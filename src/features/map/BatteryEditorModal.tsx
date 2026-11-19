import React, { useEffect, useRef, useState, type ReactNode } from "react";
import { Animated, Easing, Modal, Pressable, StyleSheet, View, useWindowDimensions } from "react-native";

type Props = { visible: boolean; reducedMotion: boolean; onClose: () => void; children: ReactNode };

export function BatteryEditorModal({ visible, reducedMotion, onClose, children }: Props) {
  const { height } = useWindowDimensions();
  const [mounted, setMounted] = useState(visible);
  const progress = useRef(new Animated.Value(0)).current;
  useEffect(() => { if (visible) setMounted(true); }, [visible]);
  useEffect(() => {
    if (!mounted) return;
    const animation = Animated.timing(progress, {
      toValue: visible ? 1 : 0,
      duration: reducedMotion ? 0 : visible ? 280 : 200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
    animation.start(({ finished }) => { if (finished && !visible) setMounted(false); });
    return () => animation.stop();
  }, [mounted, visible, reducedMotion, progress]);

  return (
    <Modal visible={mounted} transparent animationType="none" statusBarTranslucent presentationStyle="overFullScreen" onRequestClose={onClose}>
      <View style={styles.overlay} accessibilityViewIsModal pointerEvents={visible ? "auto" : "none"}>
        <Animated.View testID="bateria-fundo-fade" style={[StyleSheet.absoluteFillObject, { opacity: progress }]}>
          <Pressable accessibilityRole="button" accessibilityLabel="Fechar seletor de bateria" style={styles.backdrop} onPress={onClose} />
        </Animated.View>
        <Animated.View testID="bateria-painel-deslizante" style={{ width: "100%", maxHeight: "90%", transform: [{ translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [height, 0] }) }] }}>
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "flex-end" },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(16, 34, 30, 0.35)" },
});
