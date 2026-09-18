import { Zap } from "lucide-react-native";
import React, { useCallback, useEffect, useRef } from "react";
import { Animated, Easing, StatusBar, Text, View } from "react-native";

import { useReducedMotion } from "../../hooks/useReducedMotion";
import styles from "./styles";

type LoadingScreenProps = {
  onFinish?: () => void;
  loop?: boolean;
};

export default function LoadingScreen({
  onFinish,
  loop = false,
}: LoadingScreenProps) {
  const hasFinishedRef = useRef(false);
  const onFinishRef = useRef(onFinish);
  const reduceMotionEnabled = useReducedMotion();
  const pulseProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    onFinishRef.current = onFinish;
  }, [onFinish]);

  const finishOnce = useCallback(() => {
    if (hasFinishedRef.current) {
      return;
    }

    hasFinishedRef.current = true;
    onFinishRef.current?.();
  }, []);

  useEffect(() => {
    pulseProgress.stopAnimation();

    if (reduceMotionEnabled) {
      pulseProgress.setValue(0.45);
    } else {
      pulseProgress.setValue(0);
    }

    const animation = reduceMotionEnabled
      ? null
      : Animated.loop(
          Animated.sequence([
            Animated.timing(pulseProgress, {
              toValue: 1,
              duration: 850,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
            Animated.timing(pulseProgress, {
              toValue: 0,
              duration: 650,
              easing: Easing.inOut(Easing.quad),
              useNativeDriver: true,
            }),
          ]),
        );

    animation?.start();

    const timer = setTimeout(
      finishOnce,
      reduceMotionEnabled ? 650 : loop ? 3200 : 2300,
    );

    return () => {
      animation?.stop();
      clearTimeout(timer);
    };
  }, [finishOnce, loop, pulseProgress, reduceMotionEnabled]);

  const haloScale = pulseProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.82, 1.22],
  });
  const haloOpacity = pulseProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.42, 0],
  });
  const logoScale = pulseProgress.interpolate({
    inputRange: [0, 0.55, 1],
    outputRange: [0.96, 1.04, 1],
  });
  const firstDotOpacity = pulseProgress.interpolate({
    inputRange: [0, 0.25, 1],
    outputRange: [0.28, 1, 0.4],
  });
  const secondDotOpacity = pulseProgress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.28, 0.55, 1],
  });
  const thirdDotOpacity = pulseProgress.interpolate({
    inputRange: [0, 0.75, 1],
    outputRange: [0.28, 0.35, 1],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.loadingContent}>
        <View style={styles.logoStage} accessible={false}>
          <Animated.View
            style={[
              styles.pulseHalo,
              {
                opacity: haloOpacity,
                transform: [{ scale: haloScale }],
              },
            ]}
          />

          <Animated.View
            style={[styles.logoCard, { transform: [{ scale: logoScale }] }]}
          >
            <Zap size={44} color="#FFFFFF" fill="#FFFFFF" />
          </Animated.View>
        </View>

        <View style={styles.copyArea}>
          <Text style={styles.title}>Preparando seu mapa</Text>
          <Text style={styles.subtitle}>
            Encontrando os melhores pontos para a sua rota.
          </Text>
        </View>

        <View style={styles.progressDots} accessible={false}>
          <Animated.View style={[styles.progressDot, { opacity: firstDotOpacity }]} />
          <Animated.View style={[styles.progressDot, { opacity: secondDotOpacity }]} />
          <Animated.View style={[styles.progressDot, { opacity: thirdDotOpacity }]} />
        </View>
      </View>
    </View>
  );
}
