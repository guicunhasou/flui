import { router, type Href } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useEffect } from "react";
import { StatusBar, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { fluiStorage } from "../../storage";
import baseStyles from "./styles";

const SPLASH_DURATION = 2800;

export default function SplashScreen() {
  const styles = baseStyles;

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
    }, SPLASH_DURATION);

    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      <View style={styles.screen}>
        <View style={styles.logoWrapper}>
          <LottieView
            source={require("../../assets/lottie/data.json")}
            autoPlay
            loop={false}
            style={{ width: 300, height: 533 }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
