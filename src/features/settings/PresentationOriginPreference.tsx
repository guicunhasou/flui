import React, { useEffect, useMemo, useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { Check, ChevronDown, X } from "lucide-react-native";
import { useAppPreferences } from "../../context/PreferencesContext";
import { origensDemonstrativas, type OrigemDemonstrativaId } from "../../data/demonstracao";
import { createSettingsStyles } from "./SettingsScreen.styles";

export default function PresentationOriginPreference({ onFeedback }: { onFeedback: (message: string) => void }) {
  const { theme, fontScale, userPreferences, updateDemoConfiguration, isLoadingPreferences, isSavingPreferences } = useAppPreferences();
  const [origemId, setOrigemId] = useState<OrigemDemonstrativaId>(userPreferences.demoOriginId);
  const [originMenuOpen, setOriginMenuOpen] = useState(false);
  const styles = useMemo(() => createSettingsStyles(theme, fontScale), [theme, fontScale]);
  const disabled = isLoadingPreferences || isSavingPreferences;
  const origin = origensDemonstrativas.find(item => item.id === origemId);
  useEffect(() => { setOrigemId(userPreferences.demoOriginId); }, [userPreferences.demoOriginId]);

  const saveOrigin = async (nextOrigin: OrigemDemonstrativaId) => {
    if (disabled) return;
    setOriginMenuOpen(false);
    if (nextOrigin === userPreferences.demoOriginId) return;
    setOrigemId(nextOrigin);
    try {
      // Veículo/autonomia pertencem à configuração do perfil; não são editáveis aqui.
      await updateDemoConfiguration({ vehicleName: userPreferences.vehicleName, vehicleRangeKm: userPreferences.vehicleRangeKm, demoOriginId: nextOrigin });
      onFeedback("Origem salva neste dispositivo.");
    } catch {
      setOrigemId(userPreferences.demoOriginId);
      onFeedback("Não foi possível salvar a origem. Sua seleção anterior foi mantida. Tente novamente.");
    }
  };

  return (
    <View style={styles.section}>
      <Text accessibilityRole="header" style={styles.sectionTitle}>Localização inicial</Text>
      <View style={styles.optionsList}>
        <Pressable accessibilityRole="button" accessibilityLabel={`Origem: ${origin?.nome ?? "Selecionar"}`} accessibilityState={{ expanded: originMenuOpen, disabled }} disabled={disabled}
          style={[styles.optionButton, { minHeight: 56, justifyContent: "space-between", gap: 12 }]} onPress={() => setOriginMenuOpen(true)}>
          <Text style={[styles.optionTitle, { flex: 1 }]}>{origin?.nome}</Text>
          <ChevronDown size={22} color={theme.primary} />
        </Pressable>
      </View>
      <Modal visible={originMenuOpen} transparent animationType="fade" onRequestClose={() => setOriginMenuOpen(false)}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.4)" }} accessibilityViewIsModal>
          <Pressable accessibilityRole="button" accessibilityLabel="Fechar opções de origem" style={{ position: "absolute", inset: 0 }} onPress={() => setOriginMenuOpen(false)} />
          <View style={{ width: "90%", maxWidth: 480, maxHeight: "85%", padding: 20, gap: 8, borderRadius: 20, backgroundColor: theme.surface }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <Text accessibilityRole="header" style={styles.optionTitle}>Selecionar origem</Text>
              <Pressable accessibilityRole="button" accessibilityLabel="Fechar menu de origem" style={{ minHeight: 44, minWidth: 44, justifyContent: "center", alignItems: "center" }} onPress={() => setOriginMenuOpen(false)}><X size={22} color={theme.primary} /></Pressable>
            </View>
            <ScrollView style={{ flexShrink: 1 }} showsVerticalScrollIndicator contentContainerStyle={{ gap: 8 }}>
            {origensDemonstrativas.map(item => (
              <Pressable key={item.id} accessibilityRole="radio" accessibilityLabel={item.nome} accessibilityState={{ checked: origemId === item.id, disabled }}
                style={{ minHeight: 48, padding: 12, borderRadius: 12, backgroundColor: origemId === item.id ? theme.selectedCard : theme.surface, flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 12 }}
                disabled={disabled}
                onPress={() => void saveOrigin(item.id)}>
                <Text style={[styles.optionTitle, { flex: 1 }]}>{item.nome}</Text>{origemId === item.id ? <Check size={20} color={theme.primary} /> : null}
              </Pressable>
            ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
