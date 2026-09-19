import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  Armchair,
  BatteryLow,
  BatteryMedium,
  ChevronRight,
  Coffee,
  MapPin,
  Plug,
  Sparkles,
  Users,
  X,
  Zap,
} from "lucide-react-native";

import { PressableScale } from "../../components";
import { useAppPreferences } from "../../context/PreferencesContext";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import type { AppTheme } from "../../theme/appTheme";
import { scaleFontSize } from "../../theme/appTheme";
import type { ChargingStation } from "../../types";
import {
  formatAssistantDistance,
  recommendStations,
  type FluiAssistantIntent,
} from "./fluiAssistant";
import { FluiAiIcon } from "./FluiAiIcon";

type Props = {
  visible: boolean;
  stations: ChargingStation[];
  batteryPercent: number;
  vehicleRangeKm: number;
  onClose: () => void;
  onSelectStation: (stationId: string) => void;
};

const ASSISTANT_THINKING_DURATION = 1800;

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

export function FluiAssistantSheet({
  visible,
  stations,
  batteryPercent,
  vehicleRangeKm,
  onClose,
  onSelectStation,
}: Props) {
  const { theme, fontScale, appearanceMode } = useAppPreferences();
  const reduceMotionEnabled = useReducedMotion();
  const styles = useMemo(
    () => createStyles(theme, fontScale, appearanceMode === "dark"),
    [appearanceMode, fontScale, theme],
  );
  const [selectedIntent, setSelectedIntent] =
    useState<FluiAssistantIntent | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const analysisTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const thinkingProgress = useRef(new Animated.Value(0)).current;

  const recommendation = useMemo(() => {
    if (!selectedIntent || isAnalyzing) return null;
    return recommendStations({
      stations,
      intent: selectedIntent,
      vehicleRangeKm,
      batteryPercent,
    });
  }, [batteryPercent, isAnalyzing, selectedIntent, stations, vehicleRangeKm]);

  useEffect(() => {
    return () => {
      if (analysisTimeoutRef.current) clearTimeout(analysisTimeoutRef.current);
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

  const closeAssistant = () => {
    if (analysisTimeoutRef.current) {
      clearTimeout(analysisTimeoutRef.current);
      analysisTimeoutRef.current = null;
    }
    setSelectedIntent(null);
    setIsAnalyzing(false);
    onClose();
  };

  const chooseIntent = (intent: FluiAssistantIntent) => {
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

  const chooseStation = (stationId: string) => {
    closeAssistant();
    onSelectStation(stationId);
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType={reduceMotionEnabled ? "none" : "slide"}
      statusBarTranslucent
      onRequestClose={closeAssistant}
    >
      <View style={styles.overlay} accessibilityViewIsModal>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Fechar assistente Flui IA"
          style={StyleSheet.absoluteFill}
          onPress={closeAssistant}
        />

        <View style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.headerRow}>
            <View style={styles.headerIcon}>
              <FluiAiIcon color={theme.primary} size={22} />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.title}>Flui IA</Text>
              <Text style={styles.subtitle}>
                {selectedIntent
                  ? "Recomendação simulada com os dados do protótipo."
                  : "Como posso ajudar?\nEscolha uma necessidade."}
              </Text>
            </View>
            <PressableScale
              accessibilityRole="button"
              accessibilityLabel="Fechar assistente"
              style={styles.closeButton}
              onPress={closeAssistant}
            >
              <X size={22} color={theme.textMuted} strokeWidth={2.2} />
            </PressableScale>
          </View>

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
            <ScrollView
              style={styles.resultScroll}
              contentContainerStyle={styles.resultContent}
              showsVerticalScrollIndicator={false}
            >
              <View
                style={styles.recommendationCard}
                accessibilityLiveRegion="polite"
              >
                <View style={styles.bestChoiceBadge}>
                  <Text style={styles.bestChoiceText}>Melhor escolha agora</Text>
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
                    label={`Chegada: ${recommendation.arrivalBatteryPercent}%`}
                    color={theme.primary}
                  />
                  <Metric
                    styles={styles}
                    icon={Zap}
                    label={`${recommendation.primary.powerKw} kW`}
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

                <Text style={styles.explanationTitle}>
                  Por que essa escolha?
                </Text>
                <Text style={styles.explanationText}>
                  {recommendation.explanation}
                </Text>
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
                    <MapPin
                      size={22}
                      color={theme.primary}
                      strokeWidth={2.3}
                    />
                  </View>
                  <View style={styles.backupText}>
                    <Text style={styles.backupTitle}>Plano B</Text>
                    <Text style={styles.backupDescription} numberOfLines={1}>
                      {recommendation.backup.name} ·{" "}
                      {formatAssistantDistance(recommendation.backup.distanceKm)}
                    </Text>
                  </View>
                  <ChevronRight
                    size={22}
                    color={theme.textMuted}
                    strokeWidth={2.2}
                  />
                </PressableScale>
              ) : null}

              <PressableScale
                accessibilityRole="button"
                accessibilityLabel={`Ver ${recommendation.primary.name} no mapa`}
                accessibilityHint="Abre a ficha detalhada do ponto recomendado."
                style={styles.primaryButton}
                onPress={() => chooseStation(recommendation.primary.id)}
              >
                <Text style={styles.primaryButtonText}>Ver ponto no mapa</Text>
              </PressableScale>
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
            </ScrollView>
          ) : selectedIntent ? (
            <View style={styles.analyzingCard}>
              <Text style={styles.analyzingTitle}>
                Nenhum ponto compatível encontrado
              </Text>
              <Text style={styles.analyzingText}>
                Tente outra necessidade ou ajuste o nível da bateria.
              </Text>
            </View>
          ) : (
            <ScrollView
              style={styles.optionsScroll}
              contentContainerStyle={styles.optionsContent}
              showsVerticalScrollIndicator={false}
            >
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
                    <Icon
                      size={22}
                      color={theme.primary}
                      strokeWidth={2.3}
                    />
                  </View>
                  <Text style={styles.optionText}>{label}</Text>
                  <ChevronRight
                    size={22}
                    color={theme.textMuted}
                    strokeWidth={2.2}
                  />
                </PressableScale>
              ))}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}

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

function createStyles(
  theme: AppTheme,
  fontScale: number,
  isDarkMode: boolean,
) {
  const font = (size: number) => scaleFontSize(size, fontScale);
  const purple = isDarkMode
    ? {
        sheet: "#1B1028",
        surface: "#28183A",
        soft: "#362149",
        border: "#54386D",
      }
    : {
        sheet: "#F8F2FF",
        surface: "#FFFDFE",
        soft: "#EFE3FF",
        border: "#DCC5F5",
      };

  return StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(7, 12, 18, 0.42)",
    },
    sheet: {
      maxHeight: "76%",
      paddingHorizontal: 20,
      paddingTop: 10,
      paddingBottom: 24,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      backgroundColor: purple.sheet,
      borderTopWidth: 1,
      borderColor: purple.border,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: -8 },
      shadowOpacity: 0.16,
      shadowRadius: 22,
      elevation: 16,
    },
    handle: {
      width: 42,
      height: 4,
      marginBottom: 16,
      alignSelf: "center",
      borderRadius: 2,
      backgroundColor: purple.border,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 10,
    },
    headerIcon: {
      width: 42,
      height: 42,
      borderRadius: 21,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: purple.soft,
    },
    headerText: { flex: 1, paddingTop: 1 },
    title: {
      color: theme.text,
      fontSize: font(21),
      lineHeight: font(26),
      fontWeight: "900",
      letterSpacing: -0.35,
    },
    subtitle: {
      marginTop: 3,
      color: theme.textMuted,
      fontSize: font(13),
      lineHeight: font(18),
      fontWeight: "600",
    },
    closeButton: {
      width: 42,
      height: 42,
      borderRadius: 21,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: purple.surface,
      borderWidth: 1,
      borderColor: purple.border,
    },
    optionsScroll: { marginTop: 18 },
    optionsContent: { gap: 10, paddingBottom: 4 },
    optionCard: {
      minHeight: 58,
      paddingHorizontal: 12,
      borderRadius: 18,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      backgroundColor: purple.surface,
      borderWidth: 1,
      borderColor: purple.border,
    },
    optionIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: purple.soft,
    },
    optionText: {
      flex: 1,
      color: theme.text,
      fontSize: font(15),
      lineHeight: font(20),
      fontWeight: "800",
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
      fontWeight: "900",
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
      fontWeight: "900",
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
  });
}
