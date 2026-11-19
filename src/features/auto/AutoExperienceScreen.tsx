import React, { useState } from "react";
import { Pressable, ScrollView, Text, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ArrowLeft, BatteryMedium, Check, ChevronRight, MapPin, MessageCircle, Zap } from "lucide-react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import { PressableScale } from "../../components";
import { useAppPreferences } from "../../context/PreferencesContext";
import { formatarDistanciaDemonstrativa } from "../../utils/demonstracao";
import { getStationStatusInfo } from "../stations/stationPresentation";
import { getBatterySourceLabels } from "../../utils/batteryData";
import { AUTO_FORMATS, getAutoPreviewLayout } from "./autoPresentation";

export default function AutoExperienceScreen() {
  const { theme, scale, fontScale, userPreferences, demoOrigin, demoStations } = useAppPreferences();
  const { fontScale: systemFontScale } = useWindowDimensions();
  const [previewWidth, setPreviewWidth] = useState(0);
  const [formatId, setFormatId] = useState<string>("horizontal");
  const format = AUTO_FORMATS.find((item) => item.id === formatId)!;
  const availableWidth = Math.max(0, Math.min(1100, previewWidth));
  const frame = getAutoPreviewLayout(availableWidth, format, fontScale, systemFontScale);
  const station = demoStations[0];
  const batteryLabels = getBatterySourceLabels(userPreferences);
  const text = { color: theme.text, fontSize: scale(15), lineHeight: scale(22) };
  const small = { ...text, fontSize: scale(12), lineHeight: scale(18), color: theme.textMuted };
  const button = { minHeight: 48, padding: 14, borderRadius: 16, borderWidth: 1, borderColor: theme.border, backgroundColor: theme.surface };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 14, alignItems: "center" }}>
        <View style={{ width: "100%", maxWidth: 1100, flexDirection: "row", gap: 12, alignItems: "center" }}>
          <PressableScale accessibilityRole="button" accessibilityLabel="Voltar às configurações" style={button} onPress={() => router.back()}>
            <ArrowLeft color={theme.primary} size={22} />
          </PressableScale>
          <Text accessibilityRole="header" style={[text, { flex: 1, fontSize: scale(22), fontWeight: "800" }]}>Flui Auto Experience</Text>
        </View>
        <Text style={[small, { width: "100%", maxWidth: 1100, color: theme.primary, fontWeight: "800" }]}>PRÉVIA COM DADOS SIMULADOS</Text>
        <View style={{ width: "100%", maxWidth: 1100, flexDirection: "row", gap: 8 }}>
          {AUTO_FORMATS.map((item) => (
            <Pressable key={item.id} accessibilityRole="button" accessibilityLabel={`Formato ${item.label}, ${item.proportion}`} accessibilityState={{ selected: item.id === formatId }}
              style={[button, { flex: 1, paddingHorizontal: 6, alignItems: "center", justifyContent: "center", backgroundColor: item.id === formatId ? theme.selectedCard : theme.surface }]}
              onPress={() => setFormatId(item.id)}>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4, alignItems: "center", justifyContent: "center" }}>
                {item.id === formatId ? <Check size={16} color={theme.primary} /> : null}
                <Text style={[text, { fontWeight: "700" }]}>{item.proportion}</Text>
              </View>
            </Pressable>
          ))}
        </View>
        <View style={{ width: "100%", maxWidth: 1100, gap: 4 }}>
          <Text accessibilityRole="header" style={[text, { fontWeight: "800" }]}>{format.label} · {format.proportion}</Text>
          <Text style={small}>Prévia ajustada à largura disponível. Role verticalmente dentro dela se precisar.</Text>
        </View>
        <View onLayout={event => setPreviewWidth(event.nativeEvent.layout.width)} style={{ width: "100%", maxWidth: 1100, height: frame.height + 12 }}>
          <View testID="auto-moldura" style={{ width: frame.width, height: frame.height, backgroundColor: theme.surface, borderWidth: 6, borderColor: theme.border, borderRadius: 24, overflow: "hidden" }}>
            <ScrollView nestedScrollEnabled contentContainerStyle={{ flexGrow: 1, backgroundColor: theme.surface }}>
              <View style={{ padding: 12, flexDirection: "row", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 8, borderBottomWidth: 1, borderColor: theme.border }}>
                <Text style={[text, { fontSize: scale(21), fontWeight: "900", color: theme.primary }]}>Flui</Text>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <BatteryMedium size={20} color={theme.primary} />
                  <Text style={[small, { color: theme.text }]}>{userPreferences.batteryPercent}% · {batteryLabels.source}</Text>
                </View>
              </View>
              <View style={{ flex: 1, minHeight: frame.stacked ? 300 : 190, flexDirection: frame.stacked ? "column" : "row" }}>
                <View style={{ width: frame.stacked ? "100%" : "38%", padding: 16, gap: 8, backgroundColor: theme.background }}>
                  <Text style={[small, { fontWeight: "700" }]}>PONTO EM DESTAQUE · EXEMPLO</Text>
                  <Text style={[text, { fontSize: scale(20), lineHeight: scale(26), fontWeight: "800" }]}>{station.name}</Text>
                  <Text style={[small, { color: theme.text }]}>{getStationStatusInfo(station).label} nos dados locais</Text>
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                    <Text style={[small, { color: theme.primary, fontWeight: "800" }]}>{formatarDistanciaDemonstrativa(station.distanceKm)}</Text>
                    <Text style={small}>em linha reta · {station.powerKw} kW</Text>
                  </View>
                  <Text style={small}>Confirme funcionamento e compatibilidade.</Text>
                </View>
                <View accessible accessibilityLabel={`Mapa ilustrativo. Origem do cenário: ${demoOrigin.nome}. Sem percurso real.`} style={{ flex: 1, minHeight: 170, backgroundColor: theme.primarySoft, overflow: "hidden" }}>
                  <Svg height="100%" width="100%" style={{ position: "absolute" }} viewBox="0 0 600 300" preserveAspectRatio="xMidYMid meet" accessible={false}>
                    <Rect x={0} y={0} width={600} height={300} fill={theme.primarySoft} />
                    <Rect x={330} y={20} width={140} height={95} rx={28} fill={theme.primarySoftStrong} />
                    <Rect x={30} y={195} width={165} height={80} rx={24} fill={theme.primarySoftStrong} />
                    <Path d="M-20 75Q140 140 300 65T630 85 M-20 215Q170 155 340 220T630 190 M120 -20L210 320 M430 -20L370 320" fill="none" stroke={theme.surface} strokeWidth={20} />
                    <Path d="M110 230L250 230Q280 230 280 190L280 125Q280 90 330 90L465 90" fill="none" stroke={theme.primary} strokeWidth={7} strokeLinecap="round" />
                    <Circle cx={110} cy={230} r={14} fill={theme.success} stroke={theme.surface} strokeWidth={4} />
                    <Circle cx={465} cy={90} r={16} fill={theme.primary} stroke={theme.surface} strokeWidth={4} />
                    <Path d="M466 80L459 91H466L463 101L473 88H466Z" fill={theme.onPrimary} />
                  </Svg>
                  <Text style={[small, { alignSelf: "flex-start", margin: 10, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, color: theme.text, backgroundColor: theme.surface }]}>Origem · {demoOrigin.nome}</Text>
                </View>
              </View>
              <View accessibilityLabel="Barra ilustrativa: Mapa, Recarga e FluIA. Sem ações nesta prévia." style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-around", padding: 10, gap: 12, borderTopWidth: 1, borderColor: theme.border }}>
                {[{ label: "Mapa", Icon: MapPin }, { label: "Recarga", Icon: Zap }, { label: "FluIA", Icon: MessageCircle }].map(({ label, Icon }) => (
                  <View key={label} style={{ flexDirection: "row", alignItems: "center", gap: 6 }}><Icon size={18} color={label === "Mapa" ? theme.primary : theme.textMuted} /><Text style={[small, { color: label === "Mapa" ? theme.primary : theme.textMuted, fontWeight: "700" }]}>{label}</Text></View>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
        <View style={{ width: "100%", maxWidth: 1100, padding: 16, borderWidth: 1, borderColor: theme.border, borderRadius: 18, gap: 8 }}>
          <Text style={[text, { fontWeight: "800" }]}>Estudo de interface, sem integração automotiva</Text>
          <Text style={small}>Sem conexão com veículos, CarPlay ou Android Auto. Proporções ilustrativas; use com o veículo parado. A prévia não inicia rotas nem envia comandos.</Text>
          <Text style={small}>{userPreferences.vehicleName} · autonomia configurada {userPreferences.vehicleRangeKm} km. Carga de referência para estimativas, sem leitura automática do veículo.</Text>
          <PressableScale accessibilityRole="button" accessibilityLabel="Abrir o mapa real do aplicativo" style={button} onPress={() => router.push("/map")}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Text style={[text, { flex: 1, color: theme.primary, fontWeight: "700" }]}>Abrir mapa do aplicativo</Text>
              <ChevronRight size={20} color={theme.primary} />
            </View>
          </PressableScale>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
