import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useConnectivity } from "../context/ConnectivityContext";
import { useAppPreferences } from "../context/PreferencesContext";

export function ConnectionNotice() {
  const { status, checkConnection } = useConnectivity();
  const { theme, scale } = useAppPreferences();
  if (status === "connected") return null;
  return (
    <View style={[styles.notice, { backgroundColor: theme.surface }]}>
      <Text accessibilityLiveRegion="polite" style={{ color: theme.text, fontSize: scale(12), flex: 1 }}>
        {status === "offline" ? "Sem conexão · consulta local disponível." : "Conexão não confirmada · consulta local disponível."}
      </Text>
      <Pressable accessibilityRole="button" accessibilityLabel="Verificar conexão novamente" onPress={() => void checkConnection()} style={styles.retry}>
        <Text style={{ color: theme.primary, fontSize: scale(12), fontWeight: "700" }}>Verificar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  notice: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 8, paddingHorizontal: 16, paddingVertical: 8 },
  retry: { minWidth: 48, minHeight: 48, justifyContent: "center", alignItems: "center", paddingHorizontal: 8 },
});
