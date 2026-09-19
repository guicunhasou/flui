import type { ChargingStation } from "../../types";

export type FluiAssistantIntent =
  | "lowBattery"
  | "fastCharge"
  | "avoidQueues"
  | "coffeeAndRestroom"
  | "comfortableWait";

export type FluiAssistantRecommendation = {
  intent: FluiAssistantIntent;
  primary: ChargingStation;
  backup?: ChargingStation;
  arrivalBatteryPercent: number;
  availableChargers: number;
  explanation: string;
};

type StationCandidate = {
  station: ChargingStation;
  score: number;
  arrivalBatteryPercent: number;
  availableChargers: number;
};

function getAvailableChargers(station: ChargingStation) {
  return station.connectors.reduce(
    (total, connector) => total + connector.availableChargers,
    0,
  );
}

function getTotalChargers(station: ChargingStation) {
  return station.connectors.reduce(
    (total, connector) => total + connector.totalChargers,
    0,
  );
}

function getArrivalBatteryPercent(
  station: ChargingStation,
  vehicleRangeKm: number,
  batteryPercent: number,
) {
  if (vehicleRangeKm <= 0) return 0;

  const batteryUsed = (station.distanceKm / vehicleRangeKm) * 100;
  return Math.max(0, Math.round(batteryPercent - batteryUsed));
}

function getStatusScore(status: ChargingStation["status"]) {
  if (status === "available") return 34;
  if (status === "busy") return 10;
  if (status === "unavailable") return -45;
  return -1000;
}

function getIntentScore(
  station: ChargingStation,
  intent: FluiAssistantIntent,
  arrivalBatteryPercent: number,
  availableChargers: number,
) {
  const totalChargers = getTotalChargers(station);
  const availabilityRatio =
    totalChargers > 0 ? availableChargers / totalChargers : 0;
  const hasRestroom = station.amenities.includes("restroom");
  const hasCoffee = station.amenities.includes("coffee");
  const baseScore =
    getStatusScore(station.status) +
    availableChargers * 8 +
    availabilityRatio * 18 +
    station.rating * 3 +
    Math.min(station.powerKw, 250) / 15 -
    station.distanceKm * 4;

  if (intent === "lowBattery") {
    return (
      baseScore +
      arrivalBatteryPercent * 2.4 -
      station.distanceKm * 12 +
      (availableChargers > 0 ? 18 : -30)
    );
  }
  if (intent === "fastCharge") {
    return baseScore + station.powerKw * 0.55 + availableChargers * 10;
  }
  if (intent === "avoidQueues") {
    return baseScore + availabilityRatio * 55 + availableChargers * 18;
  }
  if (intent === "coffeeAndRestroom") {
    return baseScore + (hasRestroom ? 50 : -24) + (hasCoffee ? 50 : -24);
  }

  return (
    baseScore +
    station.amenities.length * 11 +
    station.rating * 7 +
    (hasRestroom ? 12 : 0) +
    (hasCoffee ? 12 : 0)
  );
}

export function formatAssistantDistance(distanceKm: number) {
  if (distanceKm < 1) return `${Math.round(distanceKm * 1000)} m`;
  return `${distanceKm.toFixed(1).replace(".", ",")} km`;
}

function createExplanation(
  station: ChargingStation,
  intent: FluiAssistantIntent,
  availableChargers: number,
) {
  const distance = formatAssistantDistance(station.distanceKm);
  const chargerLabel =
    availableChargers === 1
      ? "1 carregador livre"
      : `${availableChargers} carregadores livres`;

  if (intent === "lowBattery") {
    return `Está ao seu alcance, fica a ${distance} e tem ${chargerLabel}.`;
  }
  if (intent === "fastCharge") {
    return `Oferece até ${station.powerKw} kW e ${chargerLabel} agora.`;
  }
  if (intent === "avoidQueues") {
    return "Tem a melhor combinação de disponibilidade e distância neste momento.";
  }
  if (intent === "coffeeAndRestroom") {
    return "Reúne banheiro e café sem deixar de considerar alcance e disponibilidade.";
  }
  return "Combina boa avaliação, comodidades e uma espera mais confortável.";
}

export function recommendStations({
  stations,
  intent,
  vehicleRangeKm,
  batteryPercent,
}: {
  stations: ChargingStation[];
  intent: FluiAssistantIntent;
  vehicleRangeKm: number;
  batteryPercent: number;
}): FluiAssistantRecommendation | null {
  const candidates: StationCandidate[] = stations
    .filter((station) => station.status !== "maintenance")
    .map((station) => {
      const arrivalBatteryPercent = getArrivalBatteryPercent(
        station,
        vehicleRangeKm,
        batteryPercent,
      );
      const availableChargers = getAvailableChargers(station);
      return {
        station,
        arrivalBatteryPercent,
        availableChargers,
        score: getIntentScore(
          station,
          intent,
          arrivalBatteryPercent,
          availableChargers,
        ),
      };
    })
    .filter(
      (candidate) =>
        intent !== "lowBattery" || candidate.arrivalBatteryPercent >= 5,
    )
    .sort((a, b) => b.score - a.score);

  const primaryCandidate = candidates[0];
  if (!primaryCandidate) return null;

  return {
    intent,
    primary: primaryCandidate.station,
    backup: candidates[1]?.station,
    arrivalBatteryPercent: primaryCandidate.arrivalBatteryPercent,
    availableChargers: primaryCandidate.availableChargers,
    explanation: createExplanation(
      primaryCandidate.station,
      intent,
      primaryCandidate.availableChargers,
    ),
  };
}
