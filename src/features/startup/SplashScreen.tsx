import { router, type Href } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useEffect } from "react";
import { Image, StatusBar, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { fluiStorage } from "../../storage";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import baseStyles from "./SplashScreen.styles";

const SPLASH_DURATION = 2800;

export default function SplashScreen() {
  const styles = baseStyles;
  const reduceMotionEnabled = useReducedMotion();

  useEffect(() => {
    let isMounted = true;

    const routePromise = fluiStorage
      .getUserPreferences()
      .then((preferences) => {
        return (preferences.hasSeenOnboarding ? "/map" : "/onboarding") as Href;
      })
      .catch(() => "/onboarding" as Href);

    const timeout = setTimeout(() => {
      routePromise.then((route) => {
        if (isMounted) {
          router.replace(route);
        }
      });
    }, reduceMotionEnabled ? 350 : SPLASH_DURATION);

    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, [reduceMotionEnabled]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      <View style={styles.screen}>
        <View style={styles.logoWrapper}>
          {reduceMotionEnabled ? (
            <Image
              source={require("../../assets/images/splash-icon.png")}
              style={styles.staticLogo}
              resizeMode="contain"
              accessible={false}
            />
          ) : (
            <LottieView
              source={require("../../assets/lottie/data.json")}
              autoPlay
              loop={false}
              style={styles.animation}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
