import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { overlayColors, styles } from './styles';

type LoadingOverlayProps = {
  visible: boolean;
  message?: string;
};

export default function LoadingOverlay({
  visible,
  message = 'Carregando...',
}: LoadingOverlayProps) {
  if (!visible) {
    return null;
  }

  return (
    <View
      accessibilityRole="alert"
      accessibilityLabel={message}
      accessibilityLiveRegion="polite"
      accessibilityViewIsModal
      style={styles.overlay}
      pointerEvents="auto"
    >
      <View style={styles.card}>
        <ActivityIndicator size="small" color={overlayColors.primary} />

        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
}