import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  Armchair,
  ArrowLeft,
  BatteryLow,
  BatteryMedium,
  ChevronRight,
  ChevronDown,
  Coffee,
  MapPin,
  Square,
  Volume2,
  Plug,
  Sparkles,
  Users,
  Zap,
} from "lucide-react-native";

import { PressableScale } from "../../components";
import { useAppPreferences } from "../../context/PreferencesContext";
import { useConnectivity } from "../../context/ConnectivityContext";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { scaleFontSize } from "../../theme/appTheme";
import type { ChargingStation, ConnectorType } from "../../types";
import {
  formatAssistantDistance,
  recommendStations,
  type FluiAssistantIntent,
} from "./fluiAssistant";
import { funcionalidadesExperimentais } from "../../config/funcionalidadesExperimentais";
import { MapEnergyOrb } from "./MapEnergyOrb";
import { OrbAssistantModal } from "./OrbAssistantModal";
import type { OrbOrigin } from "../map/mapExperimentLayout";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { answerMessage, RECOMMENDATION_DISCLAIMER } from "./chatEngine";
import { summarizeSuggestion } from "./assistantPresentation";
import { getFluiaScreenTheme, type FluiaScreenTheme } from "./fluiaScreenTheme";
import { FLUIA_VISUAL_PRESENTATION, getFluiaVisualStatus } from "./fluiaVisualStatus";
import {
  canRecognizeSpeech,
  canSpeakText,
  speakText,
  startSpeechInput,
  stopSpeechOutput,
  type SpeechSession,
} from "./browserSpeech";

import {
  tempoDeExibicaoFluia,
  type FluiaState,
} from "./fluiaState";

type Props = {
  visible: boolean;
  orbOrigin: OrbOrigin;
  stations: ChargingStation[];
  vehicleConnectorTypes: ConnectorType[];
  batteryPercent: number;
  vehicleRangeKm: number;
  now: Date;
  onClose: () => void;
  onDismiss?: () => void;
  onSelectStation: (stationId: string) => void;
  onStartRoute: (stationId: string) => void;
};

export type FluiAssistantHandle = { startVoiceMode: () => void };

const ASSISTANT_THINKING_DURATION = 1800;

type ChatMessage = {
  id: number;
  from: "user" | "flui";
  text: string;
  state?: "respondendo" | "aviso" | "alerta";
  stationId?: string;
  summary?: string;
};

const options: {
  id: FluiAssistantIntent;
  label: string;
  Icon: typeof BatteryLow;
}[] = [
  { id: "lowBattery", label: "Tenho pouca bateria", Icon: BatteryLow },
  { id: "fastCharge", label: "Quero carregar rápido", Icon: Zap },
  { id: "avoidQueues", label: "Quero evitar filas", Icon: Users },
  {
    id: "coffeeAndRestroom",
    label: "Preciso de banheiro e café",
    Icon: Coffee,
  },
  {
    id: "comfortableWait",
    label: "Quero esperar com conforto",
    Icon: Armchair,
  },
];

export const FluiAssistantSheet = forwardRef<FluiAssistantHandle, Props>(function FluiAssistantSheet({
  visible,
  orbOrigin,
  stations,
  vehicleConnectorTypes,
  batteryPercent,
  vehicleRangeKm,
  now,
  onClose,
  onDismiss,
  onSelectStation,
  onStartRoute,
}: Props, ref) {
  const { theme: baseTheme, fontScale, highContrast, demoOrigin, userPreferences } = useAppPreferences();
  const { status: connectionStatus } = useConnectivity();
  const theme = useMemo(() => getFluiaScreenTheme(baseTheme, highContrast), [baseTheme, highContrast]);
  const reduceMotionEnabled = useReducedMotion();
  const insets = useSafeAreaInsets();
  const styles = useMemo(
    () => createStyles(theme, fontScale),
    [fontScale, theme],
  );
  const [selectedIntent, setSelectedIntent] =
    useState<FluiAssistantIntent | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const analysisTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const thinkingProgress = useRef(new Animated.Value(0)).current;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [voiceOutputAvailable, setVoiceOutputAvailable] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceModeEnabled, setVoiceModeEnabled] = useState(false);
  const voiceModeRef = useRef(false);
  const listenAgainRef = useRef<() => void>(() => {});
  const [speakingMessageId, setSpeakingMessageId] = useState<number | null>(null);
  const [voiceFeedback, setVoiceFeedback] = useState("");
  const speechSessionRef = useRef<SpeechSession | null>(null);
  const speechRequestRef = useRef(0);
  const speakNextAnswerRef = useRef(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [expandedMessageId, setExpandedMessageId] = useState<number | null>(null);
  const [isChatThinking, setIsChatThinking] = useState(false);
  const chatTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nextMessageId = useRef(0);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const followLatestRef = useRef(true);
  const chatScrollRef = useRef<ScrollView>(null);
  const lastScrolledMessageId = useRef<number | null>(null);

  const stateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [fluiaState, setFluiaState] = useState<FluiaState>("repouso");

  const recommendation = useMemo(() => {
    if (!funcionalidadesExperimentais.fluia || !selectedIntent || isAnalyzing) return null;
    return recommendStations({
      stations,
      vehicleConnectorTypes,
      intent: selectedIntent,
      vehicleRangeKm,
      batteryPercent,
      now,
    });
  }, [
    batteryPercent,
    isAnalyzing,
    selectedIntent,
    stations,
    vehicleConnectorTypes,
    vehicleRangeKm,
    now,
  ]);

  useEffect(() => {
    const show = Keyboard.addListener(Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow", () => setKeyboardVisible(true));
    const hide = Keyboard.addListener(Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide", () => setKeyboardVisible(false));
    return () => { show.remove(); hide.remove(); };
  }, []);

  const actualState: FluiaState = isChatThinking || isAnalyzing
    ? "pensando"
    : selectedIntent
      ? recommendation ? "respondendo" : "aviso"
      : fluiaState;
  const visualStatus = isListening
    ? "ouvindo"
    : getFluiaVisualStatus(actualState, connectionStatus, speakingMessageId !== null);
  const statusPresentation = FLUIA_VISUAL_PRESENTATION[visualStatus];

  useEffect(() => {
    setVoiceOutputAvailable(canSpeakText());
    return () => {
      voiceModeRef.current = false;
      speechSessionRef.current?.stop();
      speechRequestRef.current += 1;
      stopSpeechOutput();
    };
  }, []);

  useEffect(() => {
    if (!visible) {
      voiceModeRef.current = false;
      setVoiceModeEnabled(false);
      speechSessionRef.current?.stop();
      speechSessionRef.current = null;
      speechRequestRef.current += 1;
      stopSpeechOutput();
      setIsListening(false);
      setSpeakingMessageId(null);
      speakNextAnswerRef.current = false;
      setVoiceFeedback("");
    }
  }, [visible]);

  useEffect(() => {
    return () => {
      if (analysisTimeoutRef.current) clearTimeout(analysisTimeoutRef.current);
      if (chatTimeoutRef.current) clearTimeout(chatTimeoutRef.current);
      if (stateTimeoutRef.current) clearTimeout(stateTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    thinkingProgress.stopAnimation();

    if (!isAnalyzing || reduceMotionEnabled) {
      thinkingProgress.setValue(0);
      return;
    }

    const thinkingLoop = Animated.loop(
      Animated.timing(thinkingProgress, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    thinkingLoop.start();

    return () => {
      thinkingLoop.stop();
      thinkingProgress.setValue(0);
    };
  }, [isAnalyzing, reduceMotionEnabled, thinkingProgress]);

  const markTyping = () => {
    if (stateTimeoutRef.current) {
      clearTimeout(stateTimeoutRef.current);
      stateTimeoutRef.current = null;
    }
    setFluiaState((current) =>
      current === "pensando" ? current : "digitando",
    );
  };

  const resetConversation = () => {
    voiceModeRef.current = false;
    setVoiceModeEnabled(false);
    speechSessionRef.current?.stop();
    speechSessionRef.current = null;
    setIsListening(false);
    speechRequestRef.current += 1;
    stopSpeechOutput();
    setSpeakingMessageId(null);
    speakNextAnswerRef.current = false;
    setMessages([]);
    setDraft("");
    setIsChatThinking(false);
    setSelectedIntent(null);
    setIsAnalyzing(false);
    setShowExplanation(false);
    setExpandedMessageId(null);
    lastScrolledMessageId.current = null;
    followLatestRef.current = true;
  };

  const stopSpeaking = () => {
    speechRequestRef.current += 1;
    stopSpeechOutput();
    setSpeakingMessageId(null);
  };

  const stopVoiceMode = () => {
    voiceModeRef.current = false;
    setVoiceModeEnabled(false);
    speechSessionRef.current?.stop();
    speechSessionRef.current = null;
    setIsListening(false);
    speakNextAnswerRef.current = false;
    stopSpeaking();
  };

  const playAnswer = (text: string, messageId: number) => {
    if (!voiceOutputAvailable) {
      setVoiceFeedback("A leitura em voz alta não está disponível neste navegador.");
      return;
    }
    stopSpeaking();
    setVoiceFeedback("");
    const request = speechRequestRef.current;
    const started = speakText(text, {
      onEnd: () => {
        if (speechRequestRef.current !== request) return;
        setSpeakingMessageId(null);
        if (voiceModeRef.current) listenAgainRef.current();
      },
      onError: () => {
        if (speechRequestRef.current !== request) return;
        setSpeakingMessageId(null);
        setVoiceFeedback("Não foi possível reproduzir a resposta em áudio.");
        if (voiceModeRef.current) listenAgainRef.current();
      },
    }, userPreferences.speechVoiceId);
    if (started) setSpeakingMessageId(messageId);
    else if (voiceModeRef.current) listenAgainRef.current();
  };

  const closeAssistant = () => {
    stopVoiceMode();
    if (stateTimeoutRef.current) {
      clearTimeout(stateTimeoutRef.current);
      stateTimeoutRef.current = null;
    }
    setFluiaState("repouso");
    if (analysisTimeoutRef.current) {
      clearTimeout(analysisTimeoutRef.current);
      analysisTimeoutRef.current = null;
    }
    if (chatTimeoutRef.current) {
      clearTimeout(chatTimeoutRef.current);
      chatTimeoutRef.current = null;
    }
    Keyboard.dismiss();
    onClose();
  };

  const chooseIntent = (intent: FluiAssistantIntent) => {
    stopSpeaking();
    setShowExplanation(false);
    setSelectedIntent(intent);
    setIsAnalyzing(true);
    analysisTimeoutRef.current = setTimeout(
      () => {
        setIsAnalyzing(false);
        analysisTimeoutRef.current = null;
      },
      reduceMotionEnabled ? 0 : ASSISTANT_THINKING_DURATION,
    );
  };

  const sendMessage = (overrideText?: string) => {
    const text = (typeof overrideText === "string" ? overrideText : draft).trim();
    if (!text || chatTimeoutRef.current) return;
    setVoiceFeedback("");
    const shouldSpeakAnswer = speakNextAnswerRef.current;
    speakNextAnswerRef.current = false;
    stopSpeaking();
    if (analysisTimeoutRef.current) {
      clearTimeout(analysisTimeoutRef.current);
      analysisTimeoutRef.current = null;
    }
    setIsAnalyzing(false);
    setSelectedIntent(null);
    setShowExplanation(false);
    if (stateTimeoutRef.current) {
      clearTimeout(stateTimeoutRef.current);
      stateTimeoutRef.current = null;
    }
    setFluiaState("pensando");

    followLatestRef.current = true;
    setDraft("");
    setMessages((current) => [
      ...current,
      { id: nextMessageId.current++, from: "user", text },
    ]);
    setIsChatThinking(true);

    chatTimeoutRef.current = setTimeout(
      () => {
        const response = answerMessage(text, {
          stations,
          vehicleConnectorTypes,
          vehicleRangeKm,
          batteryPercent,
          now,
        });
        const answerId = nextMessageId.current++;
        setMessages((current) => [
          ...current,
          {
            id: answerId,
            from: "flui",
            text: response.text,
            state: response.state,
            stationId: response.recommendation?.primary.id,
            summary: response.recommendation ? summarizeSuggestion(response.recommendation) : undefined,
          },
        ]);
        const nextState: FluiaState = response.state;
        setFluiaState(nextState);
        const duration = tempoDeExibicaoFluia(nextState);
        if (duration !== null) {
          stateTimeoutRef.current = setTimeout(() => {
            setFluiaState((current) =>
              current === nextState ? "repouso" : current,
            );
            stateTimeoutRef.current = null;
          }, duration);
        }
        setIsChatThinking(false);
        chatTimeoutRef.current = null;
        if (shouldSpeakAnswer && voiceModeRef.current) {
          if (voiceOutputAvailable) playAnswer(response.text, answerId);
          else listenAgainRef.current();
        }
      },
      reduceMotionEnabled ? 0 : ASSISTANT_THINKING_DURATION,
    );
  };

  const startListening = () => {
    if (!voiceModeRef.current || chatTimeoutRef.current || speechSessionRef.current) return;
    if (!canRecognizeSpeech()) {
      stopVoiceMode();
      setVoiceFeedback("Este navegador não oferece reconhecimento de fala.");
      return;
    }
    stopSpeaking();
    setVoiceFeedback("");
    Keyboard.dismiss();
    let received = false;
    let failed = false;
    const session = startSpeechInput({
      onResult: (text) => {
        if (!voiceModeRef.current) return;
        received = true;
        speechSessionRef.current = null;
        setIsListening(false);
        speakNextAnswerRef.current = true;
        sendMessage(text);
      },
      onError: (message) => {
        failed = true;
        stopVoiceMode();
        setVoiceFeedback(message);
      },
      onEnd: () => {
        speechSessionRef.current = null;
        setIsListening(false);
        if (!received && !failed && voiceModeRef.current) {
          stopVoiceMode();
          setVoiceFeedback("Não ouvi nenhuma fala. Toque na Orb para tentar novamente.");
        }
      },
    });
    speechSessionRef.current = session;
    if (session) setIsListening(true);
  };
  listenAgainRef.current = startListening;

  const startVoiceMode = () => {
    if (voiceModeRef.current) return;
    if (chatTimeoutRef.current) {
      setVoiceFeedback("Aguarde a resposta antes de ativar a escuta.");
      return;
    }
    if (!canRecognizeSpeech()) {
      setVoiceFeedback("Este navegador não oferece reconhecimento de fala. Você pode digitar sua pergunta.");
      return;
    }
    voiceModeRef.current = true;
    setVoiceModeEnabled(true);
    startListening();
  };

  const toggleVoiceMode = () => {
    if (voiceModeRef.current) {
      stopVoiceMode();
      setVoiceFeedback("");
    } else {
      startVoiceMode();
    }
  };

  useImperativeHandle(ref, () => ({ startVoiceMode }));

  const scrollToLatestMessage = () => {
    if (messages.length > 0) {
      chatScrollRef.current?.scrollToEnd({ animated: !reduceMotionEnabled });
      followLatestRef.current = true;
    }
  };

  const scrollToNewMessage = () => {
    const lastId = messages.at(-1)?.id;
    if (lastId !== undefined && lastId !== lastScrolledMessageId.current) {
      lastScrolledMessageId.current = lastId;
      if (followLatestRef.current) scrollToLatestMessage();
    }
  };

  const chooseStation = (stationId: string) => {
    closeAssistant();
    onSelectStation(stationId);
  };

  const startRoute = (stationId: string) => {
    closeAssistant();
    onStartRoute(stationId);
  };

  if (!funcionalidadesExperimentais.fluia) return null;

  return (
    <OrbAssistantModal visible={visible} origin={orbOrigin} reducedMotion={reduceMotionEnabled} onClose={closeAssistant} onDismiss={() => { resetConversation(); onDismiss?.(); }}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        accessibilityViewIsModal
      >
        {visible ? <StatusBar barStyle="light-content" /> : null}
        <View testID="fluia-pagina" style={[styles.sheet, { paddingTop: insets.top + 8, paddingBottom: Math.max(insets.bottom, 12) }]}>
          <View style={styles.headerRow}>
            <PressableScale accessibilityRole="button" accessibilityLabel="Voltar ao mapa" style={styles.closeButton} onPress={closeAssistant}>
              <ArrowLeft size={24} color={theme.text} strokeWidth={2.3} />
            </PressableScale>
            <Text accessibilityRole="header" style={styles.title}>FluIA</Text>
            <View style={styles.headerSpacer} />
          </View>

          <ScrollView
            ref={chatScrollRef}
            testID="fluia-conteudo"
            style={styles.chatMessages}
            contentContainerStyle={styles.bodyContent}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={scrollToNewMessage}
            keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
            scrollEventThrottle={100}
            onScroll={({ nativeEvent: { contentOffset, contentSize, layoutMeasurement } }) => {
              const nearEnd = contentSize.height - contentOffset.y - layoutMeasurement.height < 80;
              followLatestRef.current = nearEnd;
            }}
            onLayout={() => { if (followLatestRef.current) scrollToLatestMessage(); }}
          >
            <View testID="fluia-orb-fixa" style={styles.hero}>
              <PressableScale
                testID="fluia-orb-voz"
                accessibilityRole="button"
                accessibilityLabel={voiceModeEnabled ? "Desligar microfone da FluIA" : "Ativar microfone da FluIA"}
                accessibilityHint="Toque para alternar o modo de escuta por voz."
                accessibilityState={{ selected: voiceModeEnabled }}
                onPress={toggleVoiceMode}
                style={{ width: 128, height: 128, borderRadius: 64, alignItems: "center", justifyContent: "center" }}
              >
                <View testID="fluia-orb-status" pointerEvents="none">
                  <MapEnergyOrb mapVariant size={128} state={actualState} visualStatus={visualStatus} reducedMotion={reduceMotionEnabled} active={visible} />
                </View>
              </PressableScale>
            </View>
            <Text testID="fluia-status" accessibilityLiveRegion="polite" style={[styles.heroPrompt, { color: statusPresentation.color }]}>{statusPresentation.label}</Text>
            {isAnalyzing ? (
              <View
                style={styles.analyzingCard}
                accessibilityRole="progressbar"
                accessibilityLiveRegion="polite"
              >
                <Animated.View
                  style={[
                    styles.analyzingIcon,
                    !reduceMotionEnabled && {
                      opacity: thinkingProgress.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [0.72, 1, 0.72],
                      }),
                      transform: [
                        {
                          scale: thinkingProgress.interpolate({
                            inputRange: [0, 0.5, 1],
                            outputRange: [1, 1.12, 1],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <Sparkles size={28} color={theme.primary} strokeWidth={2.2} />
                </Animated.View>
                <Text style={styles.analyzingTitle}>Analisando suas opções</Text>
                <View style={styles.thinkingDots} accessibilityElementsHidden>
                  {[
                    [0, 0.12, 0.25, 0.38, 1],
                    [0, 0.3, 0.43, 0.56, 1],
                    [0, 0.48, 0.61, 0.74, 1],
                  ].map((inputRange, index) => (
                    <Animated.View
                      key={index}
                      style={[
                        styles.thinkingDot,
                        !reduceMotionEnabled && {
                          opacity: thinkingProgress.interpolate({
                            inputRange,
                            outputRange: [0.35, 0.35, 1, 0.35, 0.35],
                          }),
                          transform: [
                            {
                              translateY: thinkingProgress.interpolate({
                                inputRange,
                                outputRange: [1, 1, -3, 1, 1],
                              }),
                            },
                          ],
                        },
                      ]}
                    />
                  ))}
                </View>
                <Text style={styles.analyzingText}>
                  Comparando alcance, disponibilidade, potência e conforto.
                </Text>
              </View>
            ) : recommendation ? (
              <View style={[styles.resultScroll, styles.resultContent]}>
                <View
                  style={styles.recommendationCard}
                  accessibilityLiveRegion="polite"
                >
                  <View style={styles.bestChoiceBadge}>
                    <Text style={styles.bestChoiceText}>
                      Sugestão do catálogo
                    </Text>
                  </View>
                  <Text style={styles.stationName}>
                    {recommendation.primary.name}
                  </Text>
                  <Text style={styles.stationAddress}>
                    {recommendation.primary.address}
                  </Text>

                  <View style={styles.metricsGrid}>
                    <Metric
                      styles={styles}
                      icon={BatteryMedium}
                      label={`Chegada ≈${recommendation.arrivalBatteryPercent}%`}
                      color={theme.primary}
                    />
                    <Metric
                      styles={styles}
                      icon={Zap}
                      label={`${recommendation.powerKw} kW`}
                      color={theme.primary}
                    />
                    <Metric
                      styles={styles}
                      icon={Plug}
                      label={`${recommendation.availableChargers} livres`}
                      color={theme.primary}
                    />
                    <Metric
                      styles={styles}
                      icon={MapPin}
                      label={formatAssistantDistance(
                        recommendation.primary.distanceKm,
                      )}
                      color={theme.primary}
                    />
                  </View>

                <PressableScale
                  accessibilityRole="button"
                  accessibilityLabel={`Iniciar rota para ${recommendation.primary.name}`}
                  accessibilityHint="Abre a escolha de localização e a confirmação de funcionamento antes da navegação."
                  style={styles.primaryButton}
                  onPress={() => startRoute(recommendation.primary.id)}
                >
                  <Text style={styles.primaryButtonText}>Iniciar rota</Text>
                </PressableScale>
                  <Text style={styles.explanationText}>
                    Em linha reta · reserva de 5%. Confirme funcionamento e compatibilidade.
                  </Text>
                  <PressableScale
                    accessibilityRole="button"
                    accessibilityState={{ expanded: showExplanation }}
                    style={styles.secondaryButton}
                    onPress={() => setShowExplanation((current) => !current)}
                  >
                    <Text style={styles.secondaryButtonText}>{showExplanation ? "Resumir explicação" : "Por que essa escolha?"}</Text>
                  </PressableScale>
                  {showExplanation ? <Text style={styles.explanationText}>
                    {recommendation.explanation}
                    {"\n"}
                    {userPreferences.vehicleName} · origem do cenário: {demoOrigin.nome}.
                    {"\n"}
                    {RECOMMENDATION_DISCLAIMER}
                  </Text> : null}
                </View>

                {recommendation.backup ? (
                  <PressableScale
                    accessibilityRole="button"
                    accessibilityLabel={`Abrir Plano B, ${recommendation.backup.name}`}
                    accessibilityHint="Abre a ficha detalhada da estação alternativa."
                    style={styles.backupCard}
                    onPress={() => chooseStation(recommendation.backup!.id)}
                  >
                    <View style={styles.backupIcon}>
                      <MapPin size={22} color={theme.primary} strokeWidth={2.3} />
                    </View>
                    <View style={styles.backupText}>
                      <Text style={styles.backupTitle}>Plano B</Text>
                      <Text style={styles.backupDescription}>
                        {recommendation.backup.name} ·{" "}
                        {formatAssistantDistance(
                          recommendation.backup.distanceKm,
                        )}
                      </Text>
                    </View>
                    <ChevronRight
                      size={22}
                      color={theme.textMuted}
                      strokeWidth={2.2}
                    />
                  </PressableScale>
                ) : null}

                {voiceOutputAvailable ? (
                  <PressableScale
                    accessibilityRole="button"
                    accessibilityLabel={speakingMessageId === -1 ? "Parar leitura da recomendação" : "Ouvir recomendação"}
                    style={styles.voiceReadButton}
                    onPress={() => speakingMessageId === -1
                      ? stopSpeaking()
                      : playAnswer(`${recommendation.primary.name}. ${recommendation.explanation}`, -1)}
                  >
                    {speakingMessageId === -1
                      ? <Square size={16} color={theme.primary} />
                      : <Volume2 size={16} color={theme.primary} />}
                    <Text style={styles.voiceReadText}>{speakingMessageId === -1 ? "Parar áudio" : "Ouvir recomendação"}</Text>
                  </PressableScale>
                ) : null}

                <PressableScale
                  accessibilityRole="button"
                  accessibilityLabel="Escolher outra necessidade"
                  style={styles.secondaryButton}
                  onPress={() => setSelectedIntent(null)}
                >
                  <Text style={styles.secondaryButtonText}>
                    Escolher outra necessidade
                  </Text>
                </PressableScale>
              </View>
            ) : selectedIntent ? (
              <View style={styles.analyzingCard}>
                <Text style={styles.analyzingTitle}>
                  Nenhuma opção viável confirmada
                </Text>
                <Text style={styles.analyzingText}>
                  Os dados disponíveis não confirmam uma opção com alcance,
                  horário, carregador livre e comodidades solicitadas. Revise os
                  filtros e os dados informados. Não há indicação segura neste
                  cenário.
                </Text>
              </View>
            ) : messages.length === 0 ? (
              <View style={[styles.optionsScroll, styles.optionsContent]}>
                {options.map(({ id, label, Icon }) => (
                  <PressableScale
                    key={id}
                    accessibilityRole="button"
                    accessibilityLabel={label}
                    accessibilityHint="Gera uma recomendação simulada com os dados do mapa."
                    style={styles.optionCard}
                    onPress={() => chooseIntent(id)}
                  >
                    <View style={styles.optionIcon}>
                      <Icon size={22} color={theme.primary} strokeWidth={2.3} />
                    </View>
                    <Text style={styles.optionText}>{label}</Text>
                    <ChevronRight
                      size={22}
                      color={theme.textMuted}
                      strokeWidth={2.2}
                    />
                  </PressableScale>
                ))}
              </View>
            ) : null}
            <View style={styles.chatBox}>
              <View style={styles.messagesContent}>
                {messages.map((message) => (
                  <View
                    key={message.id}
                    style={
                      message.from === "user"
                        ? styles.userBubble
                        : styles.fluiBubble
                    }
                  >
                    <Text style={styles.bubbleText}>{message.summary && expandedMessageId !== message.id ? message.summary : message.text}</Text>
                    {message.from === "flui" && voiceOutputAvailable ? (
                      <PressableScale
                        accessibilityRole="button"
                        accessibilityLabel={speakingMessageId === message.id ? "Parar leitura da resposta" : "Ouvir resposta da FluIA"}
                        style={styles.voiceReadButton}
                        onPress={() => speakingMessageId === message.id ? stopSpeaking() : playAnswer(message.text, message.id)}
                      >
                        {speakingMessageId === message.id
                          ? <Square size={16} color={theme.primary} />
                          : <Volume2 size={16} color={theme.primary} />}
                        <Text style={styles.voiceReadText}>{speakingMessageId === message.id ? "Parar áudio" : "Ouvir resposta"}</Text>
                      </PressableScale>
                    ) : null}
                    {message.summary ? (
                      <PressableScale accessibilityRole="button" accessibilityState={{ expanded: expandedMessageId === message.id }} style={styles.chatButton} onPress={() => setExpandedMessageId((current) => current === message.id ? null : message.id)}>
                        <Text style={styles.chatButtonText}>{expandedMessageId === message.id ? "Resumir resposta" : "Ver explicação completa"}</Text>
                      </PressableScale>
                    ) : null}
                    {message.stationId ? (
                      <PressableScale
                        accessibilityRole="button"
                        accessibilityLabel="Iniciar rota para o ponto recomendado"
                        style={styles.chatButton}
                        onPress={() => startRoute(message.stationId!)}
                      >
                        <Text style={styles.chatButtonText}>
                          Iniciar rota
                        </Text>
                      </PressableScale>
                    ) : null}
                  </View>
                ))}
                {isChatThinking ? (
                  <Text style={styles.thinkingText}>FluIA está pensando...</Text>
                ) : null}
              </View>
            </View>
          </ScrollView>

          {keyboardVisible ? <View style={styles.composerTools}>
              <PressableScale accessibilityRole="button" accessibilityLabel="Recolher teclado" accessibilityHint="Mantém o texto digitado e a conversa." style={styles.composerToolButton} onPress={() => Keyboard.dismiss()}>
                <ChevronDown size={22} color={theme.primary} />
                <Text style={styles.secondaryButtonText}>Recolher teclado</Text>
              </PressableScale>
          </View> : null}
          {voiceFeedback ? (
            <Text accessibilityLiveRegion="polite" style={styles.voiceFeedback}>{voiceFeedback}</Text>
          ) : null}
          <View style={styles.inputRow}>
            <TextInput
              value={draft}
              onChangeText={(text) => { setDraft(text); markTyping(); }}
              onFocus={() => { if (voiceModeRef.current) stopVoiceMode(); markTyping(); }}
              onBlur={() => setFluiaState((current) => current === "digitando" ? "repouso" : current)}
              onSubmitEditing={() => { if (voiceModeRef.current) stopVoiceMode(); sendMessage(); }}
              placeholder="Pergunte algo à FluIA"
              placeholderTextColor={theme.textMuted}
              accessibilityLabel="Mensagem para a FluIA"
              returnKeyType="send"
              blurOnSubmit={false}
              style={styles.input}
            />
            <PressableScale
              accessibilityRole="button"
              accessibilityLabel="Enviar mensagem"
              accessibilityState={{ disabled: isChatThinking }}
              disabled={isChatThinking}
              style={styles.sendButton}
              onPress={() => { if (voiceModeRef.current) stopVoiceMode(); sendMessage(); }}
            >
              <Text style={styles.sendButtonText}>Enviar</Text>
            </PressableScale>
          </View>
        </View>
      </KeyboardAvoidingView>
    </OrbAssistantModal>
  );
});

function Metric({
  styles,
  icon: Icon,
  label,
  color,
}: {
  styles: ReturnType<typeof createStyles>;
  icon: typeof BatteryMedium;
  label: string;
  color: string;
}) {
  return (
    <View style={styles.metricCard}>
      <Icon size={19} color={color} strokeWidth={2.3} />
      <Text style={styles.metricText}>{label}</Text>
    </View>
  );
}

function createStyles(theme: FluiaScreenTheme, fontScale: number) {
  const font = (size: number) => scaleFontSize(size, fontScale);
  const purple = { sheet: theme.background, surface: theme.surface, soft: theme.primarySoft, border: theme.border };

  return StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: theme.background,
    },
    sheet: {
      flex: 1,
      width: "100%",
      alignSelf: "center",
      paddingHorizontal: 20,
      paddingTop: 10,
      paddingBottom: 34,
      borderRadius: 0,
      backgroundColor: purple.sheet,
      borderTopWidth: 1,
      borderColor: purple.border,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: -8 },
      shadowOpacity: 0.16,
      shadowRadius: 22,
      elevation: 16,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      minHeight: 48,
      marginBottom: 8,
    },
    headerSpacer: { width: 44 },
    title: {
      flex: 1,
      minWidth: 0,
      textAlign: "center",
      color: theme.text,
      fontSize: font(18),
      lineHeight: font(26),
      fontWeight: "900",
      letterSpacing: -0.35,
    },
    hero: { alignItems: "center", paddingTop: 4, paddingBottom: 8 },
    heroPrompt: { color: theme.text, textAlign: "center", fontSize: font(18), lineHeight: font(24), fontWeight: "700", marginBottom: 28 },
    closeButton: {
      width: 44,
      height: 44,
      borderRadius: 21,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: purple.surface,
      borderWidth: 1,
      borderColor: purple.border,
    },
    optionsScroll: { marginTop: 12 },
    optionsContent: { gap: 8, paddingBottom: 4 },
    optionCard: {
      minHeight: 52,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 18,
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      backgroundColor: purple.surface,
      borderWidth: 1,
      borderColor: purple.border,
    },
    optionIcon: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: purple.soft,
    },
    optionText: {
      flex: 1,
      color: theme.text,
      fontSize: font(15),
      lineHeight: font(20),
      fontWeight: "600",
    },
    analyzingCard: {
      minHeight: 210,
      marginTop: 22,
      paddingHorizontal: 24,
      borderRadius: 24,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: purple.surface,
      borderWidth: 1,
      borderColor: purple.border,
    },
    analyzingIcon: {
      width: 54,
      height: 54,
      borderRadius: 27,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: purple.soft,
    },
    analyzingTitle: {
      marginTop: 12,
      color: theme.text,
      fontSize: font(17),
      lineHeight: font(22),
      fontWeight: "600",
      textAlign: "center",
    },
    thinkingDots: {
      height: 10,
      marginTop: 9,
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    thinkingDot: {
      width: 7,
      height: 7,
      borderRadius: 4,
      backgroundColor: theme.primary,
    },
    analyzingText: {
      marginTop: 8,
      color: theme.textMuted,
      fontSize: font(13),
      lineHeight: font(18),
      fontWeight: "600",
      textAlign: "center",
    },
    resultScroll: { marginTop: 18 },
    resultContent: { paddingBottom: 6 },
    recommendationCard: {
      padding: 16,
      borderRadius: 22,
      backgroundColor: purple.surface,
      borderWidth: 1,
      borderColor: purple.border,
    },
    bestChoiceBadge: {
      alignSelf: "flex-start",
      paddingHorizontal: 11,
      paddingVertical: 6,
      borderRadius: 14,
      backgroundColor: theme.successSoft,
    },
    bestChoiceText: {
      color: theme.success,
      fontSize: font(12),
      lineHeight: font(16),
      fontWeight: "900",
    },
    stationName: {
      marginTop: 12,
      color: theme.text,
      fontSize: font(23),
      lineHeight: font(28),
      fontWeight: "600",
      letterSpacing: -0.45,
    },
    stationAddress: {
      marginTop: 3,
      color: theme.textMuted,
      fontSize: font(13),
      lineHeight: font(18),
      fontWeight: "600",
    },
    metricsGrid: {
      marginTop: 15,
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    metricCard: {
      width: "48%",
      minHeight: 48,
      paddingHorizontal: 10,
      borderRadius: 15,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      backgroundColor: purple.soft,
    },
    metricText: {
      flexShrink: 1,
      color: theme.text,
      fontSize: font(13),
      lineHeight: font(17),
      fontWeight: "800",
    },
    explanationTitle: {
      marginTop: 16,
      color: theme.text,
      fontSize: font(15),
      lineHeight: font(20),
      fontWeight: "900",
    },
    explanationText: {
      marginTop: 4,
      color: theme.textMuted,
      fontSize: font(13),
      lineHeight: font(19),
      fontWeight: "600",
    },
    backupCard: {
      minHeight: 66,
      marginTop: 12,
      paddingHorizontal: 12,
      borderRadius: 18,
      flexDirection: "row",
      alignItems: "center",
      gap: 11,
      backgroundColor: purple.soft,
      borderWidth: 1,
      borderColor: purple.border,
    },
    backupIcon: {
      width: 42,
      height: 42,
      borderRadius: 21,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: purple.surface,
    },
    backupText: { flex: 1 },
    backupTitle: {
      color: theme.text,
      fontSize: font(14),
      lineHeight: font(18),
      fontWeight: "900",
    },
    backupDescription: {
      marginTop: 2,
      color: theme.textMuted,
      fontSize: font(12),
      lineHeight: font(17),
      fontWeight: "600",
    },
    primaryButton: {
      minHeight: 54,
      marginTop: 14,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.primary,
    },
    primaryButtonText: {
      color: theme.onPrimary,
      fontSize: font(15),
      lineHeight: font(20),
      fontWeight: "900",
    },
    secondaryButton: {
      minHeight: 44,
      alignItems: "center",
      justifyContent: "center",
    },
    secondaryButtonText: {
      color: theme.primary,
      fontSize: font(13),
      lineHeight: font(18),
      fontWeight: "800",
    },
    chatBox: {
      marginTop: 8,
    },
    chatMessages: { flex: 1, minHeight: 0 },
    bodyContent: { paddingBottom: 12 },
    messagesContent: { paddingTop: 12 },
    userBubble: {
      alignSelf: "flex-end",
      maxWidth: "80%",
      marginBottom: 8,
      padding: 10,
      borderRadius: 16,
      backgroundColor: purple.soft,
    },
    fluiBubble: {
      alignSelf: "flex-start",
      maxWidth: "95%",
      marginBottom: 8,
      padding: 10,
      borderRadius: 16,
      backgroundColor: purple.surface,
      borderWidth: 1,
      borderColor: purple.border,
    },
    bubbleText: {
      color: theme.text,
      fontSize: font(14),
      lineHeight: font(19),
      fontWeight: "600",
    },
    chatButton: {
      marginTop: 8,
      minHeight: 44,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.primary,
    },
    chatButtonText: {
      color: theme.onPrimary,
      fontSize: font(13),
      fontWeight: "900",
    },
    thinkingText: {
      marginBottom: 8,
      color: theme.textMuted,
      fontSize: font(13),
      fontWeight: "600",
    },
    composerTools: { flexDirection: "row", flexWrap: "wrap", justifyContent: "flex-end", gap: 8 },
    composerToolButton: { minHeight: 44, paddingHorizontal: 8, flexDirection: "row", alignItems: "center", gap: 4 },
    voiceFeedback: {
      color: theme.textMuted,
      fontSize: font(12),
      lineHeight: font(18),
      paddingHorizontal: 4,
      marginTop: 6,
    },
    voiceReadButton: {
      alignSelf: "flex-start",
      minHeight: 40,
      paddingHorizontal: 8,
      marginTop: 6,
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    voiceReadText: { color: theme.primary, fontSize: font(12), fontWeight: "700" },
    voiceButton: {
      width: 44,
      minHeight: 44,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: purple.border,
      backgroundColor: purple.surface,
    },
    voiceButtonActive: { backgroundColor: theme.primary },
    inputRow: {
      paddingTop: 10,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    input: {
      flex: 1,
      minHeight: 44,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: purple.border,
      backgroundColor: purple.surface,
      color: theme.text,
      fontSize: font(14),
    },
    sendButton: {
      minHeight: 44,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.primary,
    },
    sendButtonText: {
      color: theme.onPrimary,
      fontSize: font(13),
      fontWeight: "900",
    },
  });
}
