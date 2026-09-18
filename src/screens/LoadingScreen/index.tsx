import LottieView from "lottie-react-native";
import React, { useCallback, useEffect, useRef } from "react";
import { Image, StatusBar, View } from "react-native";

import loadingAnimation from "../../assets/lottie/loading.json";
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
  const animationRef = useRef<LottieView>(null);
  const hasFinishedRef = useRef(false);
  const onFinishRef = useRef(onFinish);
  const reduceMotionEnabled = useReducedMotion();

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
    if (!reduceMotionEnabled) {
      animationRef.current?.play();
    }

    const timer = setTimeout(finishOnce, reduceMotionEnabled ? 350 : 4800);

    return () => clearTimeout(timer);
  }, [finishOnce, reduceMotionEnabled]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.animationWrapper}>
        {reduceMotionEnabled ? (
          <Image
            source={require("../../assets/images/splash-icon.png")}
            style={styles.animation}
            resizeMode="contain"
            accessible={false}
          />
        ) : (
          <LottieView
            ref={animationRef}
            source={loadingAnimation}
            style={styles.animation}
            resizeMode="cover"
            autoPlay
            loop={loop}
            onAnimationFinish={() => {
              if (!loop) finishOnce();
            }}
          />
        )}
      </View>
    </View>
  );
}
