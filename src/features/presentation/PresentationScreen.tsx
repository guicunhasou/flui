import React, { useMemo, useRef, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect, router } from "expo-router";
import { ArrowLeft, Check } from "lucide-react-native";
import { useAppPreferences } from "../../context/PreferencesContext";
import { PressableScale } from "../../components";
import { OfflineImage as Image } from "../../offline/OfflineImage";
import { obterOrigemDemonstrativa } from "../../data/demonstracao";
import { createSettingsStyles } from "../settings/SettingsScreen.styles";
import { presentationImages } from "./presentationImages";
import { getPresentationProfileState, presentationProfiles } from "./presentationProfiles";
import { presentationStore } from "./presentationStorage";

export default function PresentationScreen() {
  if (!__DEV__) return <Redirect href="/settings" />;
  return <ProfileSelection />;
}
function ProfileSelection() {
  const { theme, fontScale, presentationState, savePresentation, isLoadingPreferences, isSavingPreferences } = useAppPreferences();
  const styles = useMemo(() => createSettingsStyles(theme, fontScale), [theme, fontScale]);
  const locked = useRef(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const disabled = isLoadingPreferences || isSavingPreferences;
  const apply = async (id: string) => {
    if (disabled || locked.current) return;
    const state = getPresentationProfileState(id);
    if (!state) return;
    locked.current = true;
    try { await savePresentation(state); setFeedback(`${state.config.driverName}: perfil aplicado. Confira o mapa e o Perfil.`); }
    catch { setFeedback("Não foi possível aplicar o perfil. A configuração anterior foi mantida."); }
    finally { locked.current = false; }
  };
  const leave = async () => {
    if (disabled || locked.current) return;
    locked.current = true;
    try { const current = await presentationStore.getState(); await savePresentation({ ...current, enabled: false }); setFeedback("Apresentação desativada. Seus registros normais voltaram a ser usados."); }
    catch { setFeedback("Não foi possível desativar a apresentação. Tente novamente."); }
    finally { locked.current = false; }
  };
  return <SafeAreaView style={styles.safeArea}>
    <View style={styles.header}>
      <PressableScale accessibilityRole="button" accessibilityLabel="Voltar às configurações" style={styles.backButton} onPress={() => router.back()}><ArrowLeft size={22} color={theme.primary} /></PressableScale>
      <Text style={styles.headerTitle}>Apresentação</Text><View style={{ width: 44 }} />
    </View>
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>Escolha um perfil</Text>
      <Text style={styles.sectionText}>Um toque aplica tudo. Selecione novamente para reiniciar a demonstração daquele perfil.</Text>
      {feedback ? <View style={styles.warningCard}><Text accessibilityLiveRegion="polite" style={styles.warningText}>{feedback}</Text></View> : null}
      <View style={styles.accessibilityCards}>
        {presentationProfiles.map(profile => {
          const selected = presentationState.enabled && presentationState.profileId === profile.id;
          const config = profile.state.config;
          return <PressableScale key={profile.id} accessibilityRole="button" accessibilityLabel={`Aplicar perfil ${profile.id === "urban" ? "urbano de Caio" : "de viagem de Marina"}`} accessibilityState={{ selected, disabled }} disabled={disabled} style={[styles.accessibilityCard, selected && styles.optionButtonSelected]} onPress={() => void apply(profile.id)}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <Image source={presentationImages[config.profileImage]} accessible={false} style={{ width: 48, height: 48, borderRadius: 24 }} />
              <Text style={[styles.accessibilityTitle, { flex: 1 }]}>{profile.title}</Text>
              {selected ? <Check size={22} color={theme.primary} /> : null}
            </View>
            <Text style={styles.sectionText}>{profile.description}</Text>
            <Image source={presentationImages[config.vehicleImage]} accessible={false} resizeMode="contain" style={{ width: "100%", height: 100 }} />
            <Text style={styles.optionTitle}>{config.vehicleName}</Text>
            <Text style={styles.optionDescription}>{obterOrigemDemonstrativa(config.demoOriginId).nome} · Bateria inicial {config.batteryPercent}%</Text>
            <Text style={styles.optionDescription}>Autonomia do cenário: {config.vehicleRangeKm} km</Text>
            <Text style={styles.optionDescription}>{profile.state.favoriteStationIds.length} favoritos · {profile.state.sentReviews.length} avaliações do perfil · Histórico preparado</Text>
            <Text style={[styles.optionTitle, { color: theme.primary }]}>{selected ? "Ativo · Toque para reiniciar" : "Usar este perfil"}</Text>
          </PressableScale>;
        })}
      </View>
      {presentationState.enabled ? <PressableScale accessibilityRole="button" accessibilityLabel="Sair do modo de apresentação" disabled={disabled} style={[styles.optionButton, { marginTop: 20, justifyContent: "center" }]} onPress={() => void leave()}><Text style={styles.optionTitle}>Sair do modo de apresentação</Text></PressableScale> : null}
      <Text style={[styles.sectionText, { marginTop: 20, marginBottom: 20 }]}>Perfis, imagens e avaliações são fictícios. A autonomia é um parâmetro da demonstração, não uma especificação verificada do carro. Seus registros normais permanecem separados e voltam ao sair deste modo.</Text>
    </ScrollView>
  </SafeAreaView>;
}
