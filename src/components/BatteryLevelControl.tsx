import React, { useRef } from "react";
import { StyleSheet, Text, TextInput, View, type GestureResponderEvent } from "react-native";
import { useAppPreferences } from "../context/PreferencesContext";
import { batteryLevelFromPosition } from "../utils/batteryAdjustment";

export function BatteryLevelControl({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  const { theme, scale } = useAppPreferences();
  const width = useRef(0);
  const adjust = (event: GestureResponderEvent) => {
    const next = batteryLevelFromPosition(event.nativeEvent.locationX, width.current);
    if (next !== null) onChange(next);
  };
  return (
    <View style={styles.container}>
      <View
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel="Nível de bateria"
        accessibilityHint="Deslize para ajustar ou use o campo numérico abaixo. Ações de acessibilidade alteram um ponto percentual."
        accessibilityValue={{ min: 0, max: 100, now: value, text: `${value} por cento` }}
        accessibilityActions={[{ name: "increment", label: "Aumentar um por cento" }, { name: "decrement", label: "Diminuir um por cento" }]}
        onAccessibilityAction={({ nativeEvent }) => {
          if (nativeEvent.actionName === "increment") onChange(Math.min(100, value + 1));
          if (nativeEvent.actionName === "decrement") onChange(Math.max(0, value - 1));
        }}
        onLayout={(event) => { width.current = event.nativeEvent.layout.width; }}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderTerminationRequest={() => false}
        onResponderGrant={adjust}
        onResponderMove={adjust}
        style={styles.slider}
      >
        <View pointerEvents="none" style={[styles.track, { backgroundColor: theme.border }]}>
          <View style={[styles.fill, { width: `${value}%`, backgroundColor: theme.primary }]} />
        </View>
        <View pointerEvents="none" style={[styles.thumb, { left: `${value}%`, backgroundColor: theme.primary, borderColor: theme.onPrimary }]} />
      </View>
      <View style={styles.numberRow}>
        <Text style={{ color: theme.text, fontSize: scale(14), flexShrink: 1 }}>Carga do painel (%)</Text>
        <TextInput
          accessibilityLabel="Carga exata da bateria em porcentagem"
          accessibilityHint="Informe um número inteiro entre zero e cem."
          value={String(value)}
          onChangeText={(text) => { if (/^\d{0,3}$/.test(text)) onChange(Math.min(100, Number(text))); }}
          selectTextOnFocus
          keyboardType="number-pad"
          maxLength={3}
          style={[styles.input, { color: theme.text, borderColor: theme.border, fontSize: scale(18) }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginHorizontal: 12, marginBottom: 12 },
  slider: { minHeight: 48, justifyContent: "center" },
  track: { height: 6, borderRadius: 3, overflow: "hidden" },
  fill: { height: "100%" },
  thumb: { position: "absolute", width: 28, height: 28, borderRadius: 14, borderWidth: 2, transform: [{ translateX: -14 }] },
  numberRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  input: { minHeight: 48, minWidth: 76, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderRadius: 12, textAlign: "center" },
});
