import React, { useEffect, useMemo, useRef, useState } from "react";
import { ScrollView, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import {
  ArrowLeft,
  Check,
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
import type { AppearanceMode, FontSizePreference } from "../../types";
import { createSettingsStyles } from "./styles";

const FEEDBACK_DURATION = 1500;

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
    fontSize,
    isLoadingPreferences,
    isSavingPreferences,
    preferencesError,
    updateAppearanceMode,
    updateFontSize,
  } = useAppPreferences();

  const styles = useMemo(
    () => createSettingsStyles(theme, fontScale),
    [theme, fontScale],
  );

  const isDarkMode = appearanceMode === "dark";

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
      label: "Fonte menor",
      description: "Mais conteúdo visível por tela.",
      value: "small" as FontSizePreference,
    },
    {
      label: "Fonte padrão",
      description: "Equilíbrio entre leitura e espaço.",
      value: "default" as FontSizePreference,
    },
    {
      label: "Fonte maior",
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

  const openOnboarding = () => {
    router.push("/onboarding?from=settings");
  };

  const renderOptionCheck = (isSelected: boolean) => {
    return isSelected ? (
      <View style={styles.checkCircle}>
        <Check size={14} color={theme.onPrimary} strokeWidth={2.4} />
      </View>
    ) : (
      <View style={styles.emptyCheckCircle} />
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

          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
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
            <Text style={styles.sectionTitle}>Aparência</Text>
            <Text style={styles.sectionText}>
              Escolha o tema visual do app.
            </Text>

            <View style={styles.optionsList}>
              {appearanceOptions.map((option) => {
                const isSelected = option.value === appearanceMode;

                return (
                  <PressableScale
                    key={option.value}
                    accessibilityRole="button"
                    accessibilityLabel={`Selecionar tema ${option.label.toLowerCase()}`}
                    accessibilityState={{ selected: isSelected }}
                    style={[
                      styles.optionButton,
                      isSelected ? styles.optionButtonSelected : null,
                    ]}
                    onPress={() => saveAppearanceMode(option.value)}
                  >
                    <View style={styles.optionIconBox}>{option.icon}</View>

                    <View style={styles.optionInfo}>
                      <Text style={styles.optionTitle}>{option.label}</Text>
                      <Text style={styles.optionDescription}>
                        {option.description}
                      </Text>
                    </View>

                    {renderOptionCheck(isSelected)}
                  </PressableScale>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Acessibilidade</Text>
            <Text style={styles.sectionText}>
              Ajuste o tamanho da fonte para melhorar a leitura.
            </Text>

            <View style={styles.optionsList}>
              {fontSizeOptions.map((option) => {
                const isSelected = option.value === fontSize;

                return (
                  <PressableScale
                    key={option.value}
                    accessibilityRole="button"
                    accessibilityLabel={`Selecionar ${option.label.toLowerCase()}`}
                    accessibilityState={{ selected: isSelected }}
                    style={[
                      styles.optionButton,
                      isSelected ? styles.optionButtonSelected : null,
                    ]}
                    onPress={() => saveFontSize(option.value)}
                  >
                    <View style={styles.optionIconBox}>
                      <Type size={21} color={theme.primary} strokeWidth={2.1} />
                    </View>

                    <View style={styles.optionInfo}>
                      <Text style={styles.optionTitle}>{option.label}</Text>
                      <Text style={styles.optionDescription}>
                        {option.description}
                      </Text>
                    </View>

                    {renderOptionCheck(isSelected)}
                  </PressableScale>
                );
              })}
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
            <View style={styles.feedbackToastCard}>
              <Text style={styles.feedbackToastIcon}>i</Text>
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