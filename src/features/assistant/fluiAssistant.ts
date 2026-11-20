import { avaliarAlcance } from "../../utils/autonomia";
import { formatarDistanciaDemonstrativa } from "../../utils/demonstracao";
import { funcionalidadesExperimentais } from "../../config/funcionalidadesExperimentais";
import type { ChargingStation, ConnectorType } from "../../types";
import {
  canChargeAt,
  getUsableConnectors,
} from "../../utils/stationAvailability";

export type FluiAssistantIntent =
  | "lowBattery"
  | "fastCharge"
  | "avoidQueues"
  | "coffeeAndRestroom"
  | "comfortableWait";
// Compartilhada com as explicações do chat; o corte continua sem arredondamento.
export const MIN_ARRIVAL_BATTERY_PERCENT = 5;

export type FluiAssistantRecommendation = {
  intent: FluiAssistantIntent;
  primary: ChargingStation;
  backup?: ChargingStation;
  arrivalBatteryPercent: number;
  availableChargers: number;
  powerKw: number;
  compatibilityVerified: boolean;
  explanation: string;
};

type StationCandidate = {
  station: ChargingStation;
  score: number;
  arrivalBatteryPercent: number;
  availableChargers: number;
  powerKw: number;
};

function getIntentScore(
  candidate: Omit<StationCandidate, "score">,
  intent: FluiAssistantIntent,
) {
  const { station, availableChargers, powerKw, arrivalBatteryPercent } =
    candidate;
  const totalChargers = station.connectors.reduce(
    (total, connector) => total + connector.totalChargers,
    0,
  );
  const availabilityRatio =
    totalChargers > 0 ? availableChargers / totalChargers : 0;
  const hasRestroom = station.amenities.includes("restroom");
  const hasCoffee = station.amenities.includes("coffee");
  const baseScore =
    34 +
    availableChargers * 8 +
    availabilityRatio * 18 +
    station.rating * 3 +
    Math.min(powerKw, 250) / 15 -
    station.distanceKm * 4;
  if (intent === "lowBattery")
    return (
      baseScore + arrivalBatteryPercent * 2.4 - station.distanceKm * 12 + 18
    );
  if (intent === "fastCharge")
    return baseScore + powerKw * 0.55 + availableChargers * 10;
  if (intent === "avoidQueues")
    return baseScore + availabilityRatio * 55 + availableChargers * 18;
  if (intent === "coffeeAndRestroom")
    return baseScore + (hasRestroom ? 50 : 0) + (hasCoffee ? 50 : 0);
  return (
    baseScore +
    station.amenities.length * 11 +
    station.rating * 7 +
    (hasRestroom ? 12 : 0) +
    (hasCoffee ? 12 : 0)
  );
}

export function formatAssistantDistance(distanceKm: number) {
  return formatarDistanciaDemonstrativa(distanceKm);
}

function createExplanation(
  candidate: StationCandidate,
  intent: FluiAssistantIntent,
) {
  const { station, availableChargers, powerKw } = candidate;
  const chargerLabel =
    availableChargers === 1
      ? "1 carregador livre"
      : `${availableChargers} carregadores livres`;
  if (intent === "lowBattery")
    return `Fica a ${formatAssistantDistance(station.distanceKm)} e está dentro do alcance estimado. O cadastro indica ${chargerLabel}.`;
  if (intent === "fastCharge")
    return `O cadastro indica potência de até ${powerKw} kW e ${chargerLabel}. A velocidade de recarga também depende do veículo.`;
  if (intent === "avoidQueues")
    return `O cadastro indica ${chargerLabel}. Isso ajuda a comparar as opções, mas não informa a fila em tempo real.`;
  if (intent === "coffeeAndRestroom")
    return "Tem café e banheiro no cadastro e está dentro do alcance estimado.";
  return `Reúne ${station.amenities.length} ${station.amenities.length === 1 ? "comodidade cadastrada" : "comodidades cadastradas"} para a espera. A avaliação ajuda a comparar; não há informação da espera em tempo real.`;
}

export function recommendStations({
  stations,
  intent,
  vehicleRangeKm,
  batteryPercent,
  vehicleConnectorTypes,
  now = new Date(),
}: {
  stations: ChargingStation[];
  intent: FluiAssistantIntent;
  vehicleRangeKm: number;
  batteryPercent: number;
  vehicleConnectorTypes?: ConnectorType[];
  now?: Date;
}): FluiAssistantRecommendation | null {
  if (!funcionalidadesExperimentais.fluia) return null;
  if (
    !Number.isFinite(vehicleRangeKm) ||
    vehicleRangeKm <= 0 ||
    !Number.isFinite(batteryPercent) ||
    batteryPercent < 0 ||
    batteryPercent > 100
  )
    return null;
  const candidates: StationCandidate[] = stations
    .filter((station) => canChargeAt(station, now, vehicleConnectorTypes))
    // A reserva de 5% que já existia para bateria baixa vale para todas as intenções.
    // O corte usa o valor exato, antes do arredondamento mostrado na interface.
    .filter(
      (station) =>
        Number.isFinite(station.distanceKm) &&
        station.distanceKm >= 0 &&
        Number.isFinite(station.powerKw) &&
        station.powerKw > 0 &&
        batteryPercent - (station.distanceKm / vehicleRangeKm) * 100 >= MIN_ARRIVAL_BATTERY_PERCENT,
    )
    .filter(
      (station) =>
        intent !== "coffeeAndRestroom" ||
        (station.amenities.includes("coffee") &&
          station.amenities.includes("restroom")),
    )
    .filter(
      (station) =>
        intent !== "comfortableWait" ||
        station.amenities.some((amenity) =>
          ["coffee", "restaurant", "restroom", "coveredArea", "wifi"].includes(
            amenity,
          ),
        ),
    )
    .map((station) => {
      const connectors = getUsableConnectors(station, vehicleConnectorTypes);
      const candidate = {
        station,
        arrivalBatteryPercent: Math.floor(
          batteryPercent - (station.distanceKm / vehicleRangeKm) * 100,
        ),
        availableChargers: connectors.reduce(
          (total, connector) => total + connector.availableChargers,
          0,
        ),
        powerKw: Math.min(
          station.powerKw,
          Math.max(...connectors.map((connector) => connector.powerKw)),
        ),
      };
      return { ...candidate, score: getIntentScore(candidate, intent) };
    })
    .sort((a, b) => b.score - a.score);
  const primary = candidates[0];
  if (!primary) return null;
  return {
    intent,
    primary: primary.station,
    backup: candidates[1]?.station,
    arrivalBatteryPercent: avaliarAlcance(
      primary.station.distanceKm, vehicleRangeKm, batteryPercent,
    ).bateriaAoChegarPercent,
    availableChargers: primary.availableChargers,
    powerKw: primary.powerKw,
    compatibilityVerified: !!vehicleConnectorTypes?.length,
    explanation: createExplanation(primary, intent),
  };
}
