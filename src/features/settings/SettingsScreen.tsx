import React, { useEffect, useMemo, useRef, useState } from "react";
import { ScrollView, StatusBar, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import appPackage from "../../../package.json";
import {
  ArrowLeft,
  Check,
  Info,
  LogOut,
  Moon,
  Sparkles,
  Sun,
  Type,
} from "lucide-react-native";

import {
  LoadingOverlay,
  PressableScale,
  ScreenTransition,
} from "../../components";
import { useAppPreferences } from "../../context/PreferencesContext";
import { fluiStorage } from "../../storage";
import type { AppearanceMode, FontSizePreference } from "../../types";
import { createSettingsStyles } from "./SettingsScreen.styles";
import { identificacaoDados } from "../../data/identificacaoDados";

import OfflinePhotosStatus from "../../offline/OfflinePhotosStatus";
import PresentationOriginPreference from "./PresentationOriginPreference";
import { useSystemReducedMotion } from "../../hooks/useReducedMotion";

const FEEDBACK_DURATION = 3200;

const fontSizeLabels: Record<FontSizePreference, string> = {
  small: "Fonte menor",
  default: "Fonte padrão",
  large: "Fonte maior",
};

export default function SettingsScreen() {
  const [settingsFeedbackMessage, setSettingsFeedbackMessage] = useState<
    string | null
  >(null);

  const settingsFeedbackTimeoutRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);

  const {
    theme,
    fontScale,
    appearanceMode,
    highContrast,
    userPreferences,
    presentationState,
    fontSize,
    isLoadingPreferences,
    isSavingPreferences,
    preferencesError,
    reloadPreferences,
    updateAppearanceMode,
    updateHighContrast,
    updateReduceMotion,
    updateHapticsEnabled,
    updateFontSize,
  } = useAppPreferences();

  const styles = useMemo(
    () => createSettingsStyles(theme, fontScale),
    [theme, fontScale],
  );

  const isDarkMode = appearanceMode === "dark";
  const systemReducedMotion = useSystemReducedMotion();

  const appearanceOptions = [
    {
      label: "Claro",
      description: "Fundo claro e cartões brancos.",
      value: "light" as AppearanceMode,
      icon: <Sun size={21} color={theme.primary} strokeWidth={2.1} />,
    },
    {
      label: "Escuro",
      description: "Visual mais confortável para baixa luz.",
      value: "dark" as AppearanceMode,
      icon: <Moon size={21} color={theme.primary} strokeWidth={2.1} />,
    },
  ];

  const fontSizeOptions = [
    {
      label: "Menor",
      description: "Mais conteúdo visível por tela.",
      value: "small" as FontSizePreference,
    },
    {
      label: "Padrão",
      description: "Equilíbrio entre leitura e espaço.",
      value: "default" as FontSizePreference,
    },
    {
      label: "Maior",
      description: "Leitura mais confortável.",
      value: "large" as FontSizePreference,
    },
  ];

  useEffect(() => {
    return () => {
      if (settingsFeedbackTimeoutRef.current) {
        clearTimeout(settingsFeedbackTimeoutRef.current);
      }
    };
  }, []);

  const showSettingsFeedback = (message: string) => {
    if (settingsFeedbackTimeoutRef.current) {
      clearTimeout(settingsFeedbackTimeoutRef.current);
    }

    setSettingsFeedbackMessage(message);

    settingsFeedbackTimeoutRef.current = setTimeout(() => {
      setSettingsFeedbackMessage(null);
    }, FEEDBACK_DURATION);
  };

  const saveAppearanceMode = async (nextAppearanceMode: AppearanceMode) => {
    if (nextAppearanceMode === appearanceMode || isSavingPreferences) {
      return;
    }

    try {
      await updateAppearanceMode(nextAppearanceMode);
      showSettingsFeedback(
        nextAppearanceMode === "dark"
          ? "Modo escuro ativado"
          : "Modo claro ativado",
      );
    } catch {
      showSettingsFeedback("Não foi possível salvar a aparência");
    }
  };

  const saveFontSize = async (nextFontSize: FontSizePreference) => {
    if (nextFontSize === fontSize || isSavingPreferences) {
      return;
    }

    try {
      await updateFontSize(nextFontSize);
      showSettingsFeedback(`${fontSizeLabels[nextFontSize]} salva`);
    } catch {
      showSettingsFeedback("Não foi possível salvar a fonte");
    }
  };

  const toggleHighContrast = async () => {
    if (isLoadingPreferences || isSavingPreferences) return;
    try {
      await updateHighContrast(!highContrast);
      showSettingsFeedback(highContrast ? "Alto contraste desativado" : "Alto contraste ativado");
    } catch {
      showSettingsFeedback("Não foi possível salvar o contraste. Tente novamente.");
    }
  };

  const openOnboarding = () => {
    router.push("/onboarding?from=settings");
  };

  const saveReducedMotion = async (enabled: boolean) => {
    if (systemReducedMotion || isLoadingPreferences || isSavingPreferences) return;
    try {
      await updateReduceMotion(enabled);
      showSettingsFeedback(enabled ? "Movimento reduzido" : "Animações restauradas");
    } catch {
      showSettingsFeedback("Não foi possível salvar o ajuste de movimento. Tente novamente.");
    }
  };

  const saveHaptics = async (enabled: boolean) => {
    if (isLoadingPreferences || isSavingPreferences) return;
    try {
      await updateHapticsEnabled(enabled);
      showSettingsFeedback(enabled ? "Vibração dos toques ativada" : "Vibração dos toques desativada");
    } catch {
      showSettingsFeedback("Não foi possível salvar o ajuste de vibração. Tente novamente.");
    }
  };

  const resetLocalData = async () => {
    if (isSavingPreferences) {
      return;
    }

    try {
      await fluiStorage.clearAll();
      await reloadPreferences();
      router.replace("/onboarding");
    } catch {
      showSettingsFeedback("Não foi possível reiniciar os dados locais");
    }
  };

  const renderOptionCheck = (isSelected: boolean, centered = false) => {
    return isSelected ? (
      <View style={[styles.checkCircle, centered && styles.fontSizeCheckCircle]}>
        <Check size={14} color={theme.onPrimary} strokeWidth={2.4} />
      </View>
    ) : (
      <View style={[styles.emptyCheckCircle, centered && styles.fontSizeCheckCircle]} />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

      <ScreenTransition style={styles.screen}>
        <View style={styles.header}>
          <PressableScale
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={22} color={theme.primary} strokeWidth={2.2} />
          </PressableScale>

          <Text style={styles.headerTitle}>Configurações</Text>

          <PressableScale
            accessibilityRole="button"
            accessibilityLabel="Reiniciar dados locais do Flui"
            accessibilityHint="Apaga preferências, favoritos, histórico e avaliações salvas neste dispositivo."
            disabled={isSavingPreferences}
            haptics={false}
            pressedOpacity={1}
            style={styles.hiddenResetButton}
            onPress={resetLocalData}
          >
            <View style={styles.hiddenResetButtonContent} />
          </PressableScale>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          {preferencesError ? (
            <View style={styles.warningCard}>
              <Text style={styles.warningTitle}>
                Preferências indisponíveis
              </Text>
              <Text style={styles.warningText}>{preferencesError}</Text>
            </View>
          ) : null}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Acessibilidade</Text>
            <Text style={styles.sectionText}>
              Escolha os ajustes mais confortáveis para usar o Flui.
            </Text>

            <View style={styles.accessibilityCards}>
              <View style={styles.accessibilityCard} testID="acessibilidade-fonte">
                <Text style={styles.accessibilityTitle}>Tamanho da fonte</Text>
                <View accessibilityRole="radiogroup" accessibilityLabel="Tamanho da fonte" style={styles.fontSizeRow}>
                  {fontSizeOptions.map((option, index) => {
                    const isSelected = option.value === fontSize;
                    return (
                      <View key={option.value} style={styles.fontSizeItem}>
                        <PressableScale
                          accessibilityRole="radio"
                          accessibilityLabel={`Fonte ${option.label.toLowerCase()}`}
                          accessibilityHint={option.description}
                          accessibilityState={{ checked: isSelected, disabled: isLoadingPreferences || isSavingPreferences }}
                          disabled={isLoadingPreferences || isSavingPreferences}
                          style={[styles.fontSizeCard, isSelected ? styles.optionButtonSelected : null]}
                          onPress={() => saveFontSize(option.value)}
                        >
                          <View style={styles.fontSizeIconSlot}><Type accessible={false} size={18 + index * 4} color={theme.primary} /></View>
                          <Text style={styles.fontSizeLabel}>{option.label}</Text>
                          <View style={styles.fontSizeCheckSlot}>{renderOptionCheck(isSelected, true)}</View>
                        </PressableScale>
                      </View>
                    );
                  })}
                </View>
              </View>

              <View style={styles.accessibilityCard} testID="acessibilidade-aparencia">
                <Text style={styles.accessibilityTitle}>Aparência</Text>
                <View accessibilityRole="radiogroup" accessibilityLabel="Aparência" style={styles.fontSizeRow}>
                  {appearanceOptions.map((option) => {
                    const isSelected = option.value === appearanceMode;
                    return (
                      <View key={option.value} style={styles.fontSizeItem}>
                        <PressableScale
                          accessibilityRole="radio"
                          accessibilityLabel={`Tema ${option.label.toLowerCase()}`}
                          accessibilityHint={option.description}
                          accessibilityState={{ checked: isSelected, disabled: isLoadingPreferences || isSavingPreferences }}
                          disabled={isLoadingPreferences || isSavingPreferences}
                          style={[styles.fontSizeCard, isSelected ? styles.optionButtonSelected : null]}
                          onPress={() => saveAppearanceMode(option.value)}
                        >
                          <View style={styles.appearanceIconSlot}>{option.icon}</View>
                          <Text style={styles.fontSizeLabel}>{option.label}</Text>
                          <View style={styles.fontSizeCheckSlot}>{renderOptionCheck(isSelected, true)}</View>
                        </PressableScale>
                      </View>
                    );
                  })}
                </View>
              </View>

              <View style={styles.accessibilityCard} testID="acessibilidade-contraste">
                <View style={styles.accessibilityToggleRow}>
                  <Text style={styles.accessibilityToggleTitle}>Alto contraste</Text>
                  <Switch
                    style={styles.accessibilitySwitch}
                    accessibilityLabel="Alto contraste"
                    accessibilityHint="Reforça textos e contornos, mantendo o tema escolhido."
                    value={highContrast}
                    disabled={isLoadingPreferences || isSavingPreferences}
                    onValueChange={() => void toggleHighContrast()}
                    trackColor={{ false: theme.border, true: theme.primary }}
                    thumbColor={highContrast ? theme.onPrimary : theme.surface}
                  />
                </View>
                <Text style={styles.accessibilityDescription}>Reforça textos e contornos, mantendo o tema escolhido.</Text>
              </View>

              <View style={styles.accessibilityCard} testID="acessibilidade-movimento">
                <View style={styles.accessibilityToggleRow}>
                  <Text style={styles.accessibilityToggleTitle}>Reduzir movimento</Text>
                  <Switch
                    style={styles.accessibilitySwitch}
                    accessibilityLabel="Reduzir movimento"
                    accessibilityHint="Reduz animações, movimentos da Orb e transições do app."
                    value={userPreferences.reduceMotion || systemReducedMotion}
                    disabled={systemReducedMotion || isLoadingPreferences || isSavingPreferences}
                    onValueChange={(enabled) => void saveReducedMotion(enabled)}
                    trackColor={{ false: theme.border, true: theme.primary }}
                    thumbColor={userPreferences.reduceMotion || systemReducedMotion ? theme.onPrimary : theme.surface}
                  />
                </View>
                <Text style={styles.accessibilityDescription}>{systemReducedMotion ? "Ativado nas configurações de acessibilidade do dispositivo." : "Reduz animações, movimentos da Orb e transições do app."}</Text>
              </View>

              <View style={styles.accessibilityCard} testID="acessibilidade-vibracao">
                <View style={styles.accessibilityToggleRow}>
                  <Text style={styles.accessibilityToggleTitle}>Vibração nos toques</Text>
                  <Switch
                    style={styles.accessibilitySwitch}
                    accessibilityLabel="Vibração nos toques"
                    accessibilityHint="Ativa ou desativa o retorno tátil dos botões do Flui."
                    value={userPreferences.hapticsEnabled}
                    disabled={isLoadingPreferences || isSavingPreferences}
                    onValueChange={(enabled) => void saveHaptics(enabled)}
                    trackColor={{ false: theme.border, true: theme.primary }}
                    thumbColor={userPreferences.hapticsEnabled ? theme.onPrimary : theme.surface}
                  />
                </View>
                <Text style={styles.accessibilityDescription}>Ativa ou desativa o retorno tátil dos botões do Flui.</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Introdução</Text>
            <Text style={styles.sectionText}>
              Reveja o tour inicial do app no tema visual ativo agora.
            </Text>

            <View style={styles.optionsList}>
              <PressableScale
                accessibilityRole="button"
                accessibilityLabel="Ver introdução do app"
                accessibilityHint="Abre novamente o onboarding inicial do Flui."
                accessibilityState={{ selected: false }}
                style={styles.optionButton}
                onPress={openOnboarding}
              >
                <View style={styles.optionIconBox}>
                  <Sparkles
                    size={21}
                    color={theme.primary}
                    strokeWidth={2.1}
                  />
                </View>

                <View style={styles.optionInfo}>
                  <Text style={styles.optionTitle}>Ver introdução</Text>
                  <Text style={styles.optionDescription}>
                    Acesse novamente os recursos principais do Flui.
                  </Text>
                </View>
              </PressableScale>
            </View>
          </View>
          <OfflinePhotosStatus />
          {__DEV__ ? <>
            <PresentationOriginPreference onFeedback={showSettingsFeedback} />
            <View style={styles.optionsList}>
              <PressableScale accessibilityRole="button" accessibilityLabel="Cenários internos de apresentação" accessibilityHint="Configura dados fictícios separados dos registros normais deste dispositivo." style={styles.optionButton} onPress={() => router.push("/presentation")}>
                <View style={styles.optionInfo}><Text style={styles.optionTitle}>Cenários de apresentação</Text><Text style={styles.optionDescription}>{presentationState.enabled ? "Cenário ativo · dados separados" : "Ferramenta interna"}</Text></View>
              </PressableScale>
            </View>
          </> : null}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sobre os dados</Text>
            <Text style={styles.sectionText}>{identificacaoDados.catalogo.resumo}</Text>
            <Text style={styles.sectionText}>Perfil fictício, com fotos e veículo ilustrativos. A carga é informada manualmente ou usada como cenário de simulação; não é lida do veículo. Distância em linha reta e tempos são estimativas. Confirme funcionamento e compatibilidade antes de ir. A FluIA usa respostas e regras locais, sem IA generativa.</Text>
          </View>
          <View style={styles.section}>
            <PressableScale
              accessibilityRole="button"
              accessibilityLabel="Sair da conta"
              accessibilityHint="Esta versão usa um perfil local, sem sessão conectada. Não apaga dados."
              style={[styles.optionButton, styles.logoutButton]}
              onPress={() => showSettingsFeedback("Perfil local: não há uma sessão conectada para encerrar.")}
            >
              <LogOut size={21} color={theme.dangerText} />
              <Text style={[styles.optionTitle, { color: theme.dangerText }]}>Sair da conta</Text>
            </PressableScale>
          </View>
          <View style={styles.versionFooter} testID="identificacao-versao">
            <Text style={styles.versionText}>Flui {appPackage.version}</Text>
          </View>
        </ScrollView>

        <LoadingOverlay
          visible={isLoadingPreferences || isSavingPreferences}
          message={
            isSavingPreferences
              ? "Salvando preferência..."
              : "Carregando preferências..."
          }
        />

        {settingsFeedbackMessage ? (
          <View pointerEvents="none" style={styles.feedbackToastOverlay}>
            <View accessibilityLiveRegion="polite" style={styles.feedbackToastCard}>
              <View style={styles.feedbackToastIcon} accessible={false}>
                <Info size={22} color="#FFFFFF" strokeWidth={2.2} />
              </View>
              <Text style={styles.feedbackToastText}>
                {settingsFeedbackMessage}
              </Text>
            </View>
          </View>
        ) : null}
      </ScreenTransition>
    </SafeAreaView>
  );
}
