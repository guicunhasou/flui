import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { AlertCircle, CheckCircle2 } from "lucide-react-native";
import { useAppPreferences } from "../context/PreferencesContext";
import { createSettingsStyles } from "../features/settings/SettingsScreen.styles";
import { useOfflinePhotosStatus } from "./OfflineAssetsContext.native";
import { offlineImageMetadata } from "./offlineImageMetadata";
import { offlinePhotosPresentation } from "./offlinePhotosPresentation";
import { scaleFontSize } from "../theme/appTheme";

export default function OfflinePhotosStatus() {
  const { theme, fontScale } = useAppPreferences();
  const styles = createSettingsStyles(theme, fontScale);
  const { ready, preparing, supported, retry } = useOfflinePhotosStatus();
  const total = offlineImageMetadata.length;
  const state = offlinePhotosPresentation({ ready, total, preparing, supported });
  const color = state.complete ? theme.success : preparing ? theme.primary : theme.warningText;
  return <View style={styles.section}>
    <Text style={styles.sectionTitle}>Uso sem conexão</Text>
    <View style={[cardStyles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={cardStyles.heading}>
        {preparing && supported ? <ActivityIndicator color={color} accessibilityLabel={state.title} />
          : state.complete ? <CheckCircle2 color={color} size={26} accessibilityElementsHidden importantForAccessibility="no" />
            : <AlertCircle color={color} size={26} accessibilityElementsHidden importantForAccessibility="no" />}
        <Text accessibilityLiveRegion="polite" style={[cardStyles.title, { color: theme.text, fontSize: scaleFontSize(16, fontScale) }]}>{state.title}</Text>
      </View>
      <Text style={[styles.sectionText, { color: theme.text }]}>{state.description}</Text>
    </View>
    {state.canRetry ? <Pressable accessibilityRole="button" accessibilityLabel="Preparar fotos para uso sem conexão" style={[styles.optionButton, { marginTop: 12 }]} onPress={retry}>
      <Text style={styles.optionTitle}>Preparar fotos</Text>
    </Pressable> : null}
  </View>;
}

const cardStyles = StyleSheet.create({
  card: { marginTop: 12, padding: 16, borderRadius: 18, borderWidth: 1 },
  heading: { flexDirection: "row", alignItems: "center", gap: 10 },
  title: { flex: 1, fontWeight: "800", flexShrink: 1 },
});
