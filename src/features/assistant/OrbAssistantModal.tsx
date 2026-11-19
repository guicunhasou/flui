import React, { useEffect, useRef, useState, type ReactNode } from "react";
import { Animated, Easing, Modal, StyleSheet, useWindowDimensions, View } from "react-native";
import { getOrbRevealGeometry, type OrbOrigin } from "../map/mapExperimentLayout";
import { MapEnergyOrb } from "./MapEnergyOrb";

type Props = { visible: boolean; origin: OrbOrigin; reducedMotion: boolean; onClose: () => void; onDismiss: () => void; children: ReactNode };

export function OrbAssistantModal({ visible, origin, reducedMotion, onClose, onDismiss, children }: Props) {
  const { width, height } = useWindowDimensions();
  const [mounted, setMounted] = useState(visible);
  const [ready, setReady] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;
  const dismissRef = useRef(onDismiss); dismissRef.current = onDismiss;
  const geometry = getOrbRevealGeometry(width, height, origin);
  useEffect(() => { if (visible) setMounted(true); }, [visible]);
  useEffect(() => {
    if (!mounted) return;
    setReady(false);
    const animation = Animated.timing(progress, { toValue: visible ? 1 : 0, duration: reducedMotion ? 0 : visible ? 440 : 300, easing: Easing.inOut(Easing.cubic), useNativeDriver: true });
    animation.start(({ finished }) => {
      if (!finished) return;
      if (visible) setReady(true);
      else { setMounted(false); dismissRef.current(); }
    });
    return () => animation.stop();
  }, [mounted, progress, reducedMotion, visible]);
  return <Modal transparent visible={mounted} animationType="none" statusBarTranslucent navigationBarTranslucent presentationStyle="overFullScreen" onRequestClose={onClose}>
    <View style={styles.viewport} accessibilityViewIsModal>
      <Animated.View pointerEvents="none" style={[styles.circle, { left: geometry.x - geometry.size / 2, top: geometry.y - geometry.size / 2, width: geometry.size, height: geometry.size, borderRadius: geometry.size / 2, transform: [{ scale: progress.interpolate({ inputRange: [0, 1], outputRange: [1, geometry.scale] }) }] }]} />
      <Animated.View pointerEvents="none" style={{ position: "absolute", left: geometry.x - geometry.size / 2, top: geometry.y - geometry.size / 2, opacity: progress.interpolate({ inputRange: [0, 0.35, 1], outputRange: [1, 0, 0] }), transform: [{ scale: progress.interpolate({ inputRange: [0, 1], outputRange: [1, 2] }) }] }}>
        <MapEnergyOrb mapVariant size={geometry.size} state="repouso" active={mounted && !ready} reducedMotion={reducedMotion} />
      </Animated.View>
      <Animated.View testID="fluia-tela-cheia" pointerEvents={ready ? "auto" : "none"} accessibilityElementsHidden={!ready} importantForAccessibility={ready ? "auto" : "no-hide-descendants"} style={{ flex: 1, opacity: progress.interpolate({ inputRange: [0, 0.45, 1], outputRange: [0, 0, 1] }), transform: [{ translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }] }}>
        {children}
      </Animated.View>
    </View>
  </Modal>;
}
const styles = StyleSheet.create({ viewport: { flex: 1, overflow: "hidden" }, circle: { position: "absolute", backgroundColor: "#2B0055" } });
