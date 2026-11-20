import { useEffect, useState } from "react";
import { AccessibilityInfo } from "react-native";
import { useAppPreferences } from "../context/PreferencesContext";

export function useSystemReducedMotion() {
  const [reduceMotionEnabled, setReduceMotionEnabled] = useState(false);

  useEffect(() => {
    let isMounted = true;

    AccessibilityInfo.isReduceMotionEnabled()
      .then((enabled) => {
        if (isMounted) {
          setReduceMotionEnabled(enabled);
        }
      })
      .catch(() => undefined);

    const subscription = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setReduceMotionEnabled,
    );

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, []);

  return reduceMotionEnabled;
}

export function useReducedMotion() {
  const systemReducedMotion = useSystemReducedMotion();
  const { userPreferences, isLoadingPreferences } = useAppPreferences();
  return isLoadingPreferences || userPreferences.reduceMotion || systemReducedMotion;
}
