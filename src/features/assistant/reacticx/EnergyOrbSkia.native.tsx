// Adaptado de Reacticx Energy Orb, Copyright (c) 2026 rit3zh, MIT.
// Fonte: 4e11fcfe04e0bd7054574acc1557320911d70e4c. Licença integral em ./LICENSE.
import React, { memo, useEffect, useMemo } from "react";
import { View } from "react-native";
import { Canvas, Fill, Shader, Skia, type Uniforms } from "@shopify/react-native-skia";
import { useDerivedValue, useFrameCallback, useSharedValue } from "react-native-reanimated";
import type { ReacticxOrbProps } from "../MapEnergyOrb.types";
import { clampOrbFrameDelta, getMapOrbPulse, getReacticxOrbPresentation, REACTICX_SHADER_INTERVAL_MS } from "../reacticxOrbPresentation";
import { SHADER_SOURCE } from "./conf";
import { parseColor } from "./helper";

const source = Skia.RuntimeEffect.Make(SHADER_SOURCE);
if (!source) throw new Error("Não foi possível compilar o shader Reacticx neste ambiente.");

export const EnergyOrbSkia = memo(function EnergyOrbSkia({ state, reducedMotion, active, size, mapVariant = false, visualStatus }: ReacticxOrbProps) {
  const effect = useMemo(() => getReacticxOrbPresentation(state, reducedMotion, active, mapVariant, visualStatus), [state, reducedMotion, active, mapVariant, visualStatus]);
  const colors = useMemo(() => effect.colors.map(parseColor), [effect.colors]);
  const time = useSharedValue(1.2);
  const pendingMs = useSharedValue(0);
  const frame = useFrameCallback((info) => {
    pendingMs.value += clampOrbFrameDelta(info.timeSincePreviousFrame);
    if (pendingMs.value >= REACTICX_SHADER_INTERVAL_MS) {
      time.value += pendingMs.value / 1000;
      pendingMs.value = 0;
    }
  }, false);

  useEffect(() => {
    pendingMs.value = 0;
    frame.setActive(effect.animate);
    return () => frame.setActive(false);
  }, [effect.animate, frame, pendingMs]);

  const mapPulse = useDerivedValue(() => mapVariant ? getMapOrbPulse(time.value) : 0);
  const uniforms = useDerivedValue<Uniforms>(() => ({
    iTime: time.value,
    iResolution: [size, size],
    uSpeed: effect.speed,
    uIntensity: effect.intensity,
    uColor0: colors[0],
    uColor1: colors[1],
    uColor2: colors[2],
    uGlowRadius: effect.glowRadius,
    uMapMode: mapVariant ? 1 : 0,
    uMapPulse: mapPulse.value,
    uStatusMode: effect.statusMode ? 1 : 0,
  }));
  return <View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ width: size, height: size }}>
    <Canvas pointerEvents="none" style={{ width: size, height: size, borderRadius: size / 2 }}>
      <Fill><Shader source={source} uniforms={uniforms} /></Fill>
    </Canvas>
  </View>;
});
