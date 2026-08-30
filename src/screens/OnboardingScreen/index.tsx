import { router, useLocalSearchParams } from "expo-router";
import {
  Heart,
  MapPinned,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react-native";
import React, { useMemo, useRef, useState } from "react";
import {
  Image,
  type ImageSourcePropType,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StatusBar,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PressableScale, ScreenTransition } from "../../components";
import { useAppPreferences } from "../../context/PreferencesContext";
import { fluiStorage } from "../../storage";
import { createOnboardingStyles } from "./styles";

type OnboardingStep = {
  title: string;
  description: string;
  image: ImageSourcePropType;
  icon: typeof MapPinned;
};

const onboardingSteps: OnboardingStep[] = [
  {
    title: "Encontre pontos próximos",
    description:
      "Veja estações no mapa, acompanhe disponibilidade e descubra pontos recomendados para a sua rota.",
    image: require("../../assets/onboarding/1.webp"),
    icon: MapPinned,
  },
  {
    title: "Compare antes de parar",
    description:
      "Analise potência, conectores, horários e comodidades antes de escolher onde carregar.",
    image: require("../../assets/onboarding/2.webp"),
    icon: SlidersHorizontal,
  },
  {
    title: "Escolha com confiança",
    description:
      "Use avaliações, comentários e critérios de experiência para evitar paradas ruins.",
    image: require("../../assets/onboarding/3.webp"),
    icon: ShieldCheck,
  },
  {
    title: "Salve seus favoritos",
    description:
      "Guarde pontos preferidos, acompanhe histórico e encontre suas avaliações dentro do Perfil.",
    image: require("../../assets/onboarding/4.webp"),
    icon: Heart,
  },
];

export default function OnboardingScreen() {
  const scrollRef = useRef<ScrollView | null>(null);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isFinishing, setIsFinishing] = useState(false);
  const { from } = useLocalSearchParams<{ from?: string }>();

  const { width } = useWindowDimensions();
  const { appearanceMode, fontScale, theme } = useAppPreferences();

  const styles = useMemo(
    () => createOnboardingStyles(theme, fontScale, width),
    [fontScale, theme, width],
  );

  const cardWidth = Math.max(width - 48, 280);
  const isLastStep = activeStepIndex === onboardingSteps.length - 1;
  const shouldReturnToSettings = from === "settings";
  const lastStepButtonLabel = shouldReturnToSettings
    ? "Voltar às configurações"
    : "Começar pelo mapa";

  const finishOnboarding = async () => {
    if (isFinishing) {
      return;
    }

    try {
      setIsFinishing(true);
      await fluiStorage.updateUserPreferences({ hasSeenOnboarding: true });
    } finally {
      if (shouldReturnToSettings) {
        router.back();
        return;
      }

      router.replace("/loading");
    }
  };

  const goToNextStep = () => {
    if (isLastStep) {
      void finishOnboarding();
      return;
    }

    const nextStepIndex = activeStepIndex + 1;

    scrollRef.current?.scrollTo({
      x: nextStepIndex * cardWidth,
      animated: true,
    });

    setActiveStepIndex(nextStepIndex);
  };

  const updateActiveStep = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const nextStepIndex = Math.round(offsetX / cardWidth);

    setActiveStepIndex(
      Math.min(Math.max(nextStepIndex, 0), onboardingSteps.length - 1),
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle={appearanceMode === "dark" ? "light-content" : "dark-content"}
      />

      <ScreenTransition style={styles.screen} distance={14}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Flui Charge Map</Text>
          <Text style={styles.title}>Carregue com mais clareza.</Text>

          <View style={styles.skipButtonAnchor}>
            <PressableScale
              accessibilityRole="button"
              accessibilityLabel="Pular apresentação"
              disabled={isFinishing}
              onPress={finishOnboarding}
              style={styles.skipButton}
            >
              <Text style={styles.skipButtonText}>Pular</Text>
            </PressableScale>
          </View>
        </View>

        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          bounces={false}
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          snapToInterval={cardWidth}
          snapToAlignment="start"
          contentContainerStyle={styles.carouselContent}
          onMomentumScrollEnd={updateActiveStep}
        >
          {onboardingSteps.map((step) => {
            const Icon = step.icon;

            return (
              <View key={step.title} style={styles.slide}>
                <View style={styles.visualCard}>
                  <Image
                    source={step.image}
                    style={styles.visualImage}
                    resizeMode="cover"
                  />
                </View>

                <View style={styles.copyContent}>
                  <View style={styles.featureIconBubble}>
                    <Icon size={27} color={theme.primary} strokeWidth={2.2} />
                  </View>

                  <Text style={styles.stepTitle}>{step.title}</Text>
                  <Text style={styles.stepDescription}>{step.description}</Text>
                </View>
              </View>
            );
          })}
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.dotsRow}>
            {onboardingSteps.map((step, index) => (
              <View
                key={step.title}
                style={[
                  styles.dot,
                  activeStepIndex === index && styles.dotActive,
                ]}
              />
            ))}
          </View>

          <PressableScale
            accessibilityRole="button"
            accessibilityLabel={
              isLastStep
                ? shouldReturnToSettings
                  ? "Voltar para configurações"
                  : "Começar a usar o mapa"
                : "Avançar apresentação"
            }
            disabled={isFinishing}
            onPress={goToNextStep}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryButtonText}>
              {isLastStep ? lastStepButtonLabel : "Continuar"}
            </Text>
          </PressableScale>
        </View>
      </ScreenTransition>
    </SafeAreaView>
  );
}
