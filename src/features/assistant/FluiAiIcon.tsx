import React from "react";
import { StyleSheet, View } from "react-native";
import { Sparkle, Zap } from "lucide-react-native";

export function FluiAiIcon({
  color,
  size = 22,
}: {
  color: string;
  size?: number;
}) {
  const largeSparkleSize = Math.max(7, Math.round(size * 0.38));
  const smallSparkleSize = Math.max(5, Math.round(size * 0.27));
  const iconWidth = size + Math.round(size * 0.48);

  return (
    <View
      style={[
        styles.container,
        { width: iconWidth, height: size + 4 },
      ]}
    >
      <Zap
        size={size}
        color={color}
        fill={color}
        strokeWidth={2.4}
        style={styles.bolt}
      />
      <Sparkle
        size={largeSparkleSize}
        color={color}
        fill={color}
        strokeWidth={2.2}
        style={[
          styles.sparkle,
          { left: size * 0.91, top: 0 },
        ]}
      />
      <Sparkle
        size={smallSparkleSize}
        color={color}
        fill={color}
        strokeWidth={2.2}
        style={[
          styles.sparkle,
          { left: size * 1.16, top: size * 0.35 },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  bolt: {
    marginLeft: 0,
  },
  sparkle: {
    position: "absolute",
  },
});
