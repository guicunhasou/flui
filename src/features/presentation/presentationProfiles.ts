import { chargingStations } from "../../data/fixtures/chargingStations";
import { createPresentationState, type PresentationState } from "./presentationScenario";

type ReviewSeed = [stationId: string, rating: number, comment: string];
const createdAt = "2026-10-22T12:00:00.000Z";
function profileState(id: "urban" | "travel", config: Partial<PresentationState["config"]>, favorites: string[], seeds: ReviewSeed[]): PresentationState {
  const base = createPresentationState();
  return {
    ...base, profileId: id, enabled: true, config: { ...base.config, ...config, batterySource: "demo", batteryUpdatedAt: null },
    favoriteStationIds: favorites,
    sentReviews: seeds.map(([stationId, rating, comment]) => ({ id: `presentation-${id}-${stationId}`, stationId, stationName: chargingStations.find(s => s.id === stationId)!.name, rating, quality: rating, cleaning: rating, availability: rating, amenities: rating, comment, recommend: rating >= 4, wouldReturn: rating >= 4, createdAt, updatedAt: createdAt, isSynced: false })),
    recentHistory: favorites.slice(0, 2).map(stationId => { const station = chargingStations.find(s => s.id === stationId)!; return { id: `presentation-${id}-view-${stationId}`, stationId, stationName: station.name, address: station.address, action: "viewed_station", createdAt }; }),
  };
}
export const presentationProfiles = [
  {
    id: "urban" as const, title: "Caio · Uso urbano", description: "Paradas curtas em São Paulo, perto da FIAP.",
    state: profileState("urban", { driverName: "Caio Duarte", profileImage: "profile1", vehicleImage: "car1", vehicleName: "BYD Dolphin Plus", vehicleRangeKm: 400, batteryPercent: 70, demoOriginId: "fiap" },
      ["station-01", "station-03", "next-pinheiros"], [
        ["station-01", 5, "Minha parada preferida no cenário urbano: café, cobertura e um intervalo para recarregar."],
        ["station-03", 4, "Uma opção prática para encaixar a recarga entre os compromissos deste cenário."],
      ]),
  },
  {
    id: "travel" as const, title: "Marina · Viagem", description: "Menos bateria para explorar paradas entre SP e RJ.",
    state: profileState("travel", { driverName: "Marina Costa", profileImage: "profile2", vehicleImage: "car2", vehicleName: "Volvo EX30", vehicleRangeKm: 200, batteryPercent: 35, demoOriginId: "fiap" },
      ["next-sao-jose-campos", "next-resende", "next-rio-barra"], [
        ["next-sao-jose-campos", 5, "Parada escolhida para começar a viagem do cenário com mais tranquilidade."],
        ["next-resende", 4, "Incluí esta opção nos favoritos para comparar a recarga durante a apresentação."],
        ["next-rio-barra", 5, "Destino salvo para testar a chegada ao Rio e revisar as alternativas do catálogo."],
      ]),
  },
];

export function getPresentationProfileState(id: string): PresentationState | null {
  const profile = presentationProfiles.find(item => item.id === id);
  // A cópia impede que editar bateria/favoritos durante a sessão altere a base.
  return profile ? JSON.parse(JSON.stringify(profile.state)) as PresentationState : null;
}
