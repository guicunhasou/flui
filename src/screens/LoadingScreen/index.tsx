import LottieView from "lottie-react-native";
import React, { useEffect, useRef } from "react";
import { StatusBar, View } from "react-native";

import loadingAnimation from "../../assets/lottie/loading.json";
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

  useEffect(() => {
    animationRef.current?.play();

    const timer = setTimeout(() => {
      onFinish?.();
    }, 4800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.animationWrapper}>
        <LottieView
          ref={animationRef}
          source={loadingAnimation}
          style={styles.animation}
          resizeMode="cover"
          autoPlay
          loop={loop}
          onAnimationFinish={() => {
            if (!loop) onFinish?.();
          }}
        />
      </View>
    </View>
  );
}
