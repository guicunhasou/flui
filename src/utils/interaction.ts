import { Platform } from "react-native";
import * as Haptics from "expo-haptics";

export type PressableVisualState = {
  pressed: boolean;
  hovered?: boolean;
};

export function triggerImpact(
  style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light,
) {
  if (Platform.OS === "web") {
    return;
  }

  Haptics.impactAsync(style).catch(() => {});
}

export function triggerSelection() {
  if (Platform.OS === "web") {
    return;
  }

  Haptics.selectionAsync().catch(() => {});
}
