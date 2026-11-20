import React, { useEffect, useId, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import Svg, { Circle, Defs, Ellipse, Path, RadialGradient, Stop } from "react-native-svg";
import type { FluiaState } from "./fluiaState";
import { ENERGY_ORB_COLORS, getEnergyOrbMotion } from "./energyOrbPresentation";
import { FLUIA_VISUAL_PRESENTATION, type FluiaVisualStatus } from "./fluiaVisualStatus";

type Props = { state: FluiaState; reducedMotion: boolean; active: boolean; size?: number; visualStatus?: FluiaVisualStatus };

/** Visual decorativo: o rótulo de estado da FluIA continua sendo a informação acessível. */
export function EnergyOrb({ state, reducedMotion, active, size = 44, visualStatus }: Props) {
  const progress = useRef(new Animated.Value(0)).current;
  const id = useId().replace(/:/g, "");
  const presentation = visualStatus ? FLUIA_VISUAL_PRESENTATION[visualStatus] : null;
  const colors = presentation ? { light: presentation.light, core: presentation.core, rim: presentation.color } : ENERGY_ORB_COLORS[state];
  const statusStatic = visualStatus === "erro" || visualStatus === "atencao" || visualStatus === "offline";
  const { duration, amplitude, rotate } = getEnergyOrbMotion(state, reducedMotion, active && !statusStatic);

  useEffect(() => {
    progress.stopAnimation();
    progress.setValue(0);
    if (!duration) return;
    const loop = Animated.loop(Animated.timing(progress, {
      toValue: 1, duration, easing: Easing.linear, useNativeDriver: true,
    }));
    loop.start();
    return () => { loop.stop(); progress.setValue(0); };
  }, [duration, progress]);

  return (
    <View style={{ width: size, height: size }} accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Animated.View style={[styles.layer, {
        transform: [{ scale: progress.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1 + amplitude, 1] }) }],
      }]}>
        <Svg width={size} height={size} viewBox="0 0 100 100">
          <Defs>
            <RadialGradient id={id} cx="34%" cy="26%" rx="74%" ry="74%">
              <Stop offset="0" stopColor={colors.light} />
              <Stop offset="0.43" stopColor={colors.core} />
              <Stop offset="1" stopColor="#271044" />
            </RadialGradient>
          </Defs>
          <Circle cx="50" cy="50" r="48" fill={colors.rim} opacity="0.13" />
          <Circle cx="50" cy="50" r="41" fill={`url(#${id})`} stroke={colors.rim} strokeWidth="1.6" />
          <Ellipse cx="39" cy="28" rx="19" ry="8" fill="#FFFFFF" opacity="0.18" transform="rotate(-26 39 28)" />
          <Path d="M23 65 Q49 85 78 51" fill="none" stroke={colors.rim} opacity="0.65" strokeWidth="1.5" />
          <Path d="M55 26 L35 53 L48 53 L44 74 L66 45 L52 45 Z" fill="#FFFFFF" stroke="#FFFFFF" strokeLinejoin="round" strokeWidth="2" />
        </Svg>
      </Animated.View>
      <Animated.View style={[styles.layer, { transform: [{ rotate: progress.interpolate({ inputRange: [0, 1], outputRange: ["0deg", rotate ? "360deg" : "0deg"] }) }] }]}>
        <Svg width={size} height={size} viewBox="0 0 100 100">
          <Circle cx="50" cy="50" r="46" fill="none" stroke={colors.rim} strokeWidth="1.4" strokeDasharray="52 237" strokeLinecap="round" />
          <Circle cx="87" cy="23" r="2.2" fill={colors.light} />
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({ layer: { ...StyleSheet.absoluteFillObject } });
