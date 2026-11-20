import { Platform } from "react-native";
import * as Haptics from "expo-haptics";

export type PressableVisualState = {
  pressed: boolean;
  hovered?: boolean;
};

let hapticsEnabled = true;

export function setHapticsEnabled(enabled: boolean) {
  hapticsEnabled = enabled;
}

export function triggerImpact(
  style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light,
) {
  if (!hapticsEnabled || Platform.OS === "web") {
    return;
  }

  Haptics.impactAsync(style).catch(() => {});
}

export function triggerSelection() {
  if (!hapticsEnabled || Platform.OS === "web") {
    return;
  }

  Haptics.selectionAsync().catch(() => {});
}
