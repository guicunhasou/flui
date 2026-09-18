import type { ChargingStation } from "../../types";
import { isStationOpenAt } from "../../utils/stationHours";

export type StationStatusInfo = {
  label: string;
  description: string;
};

export type RouteProvider = "google" | "waze";

export function formatStationAddress(station: ChargingStation) {
  return [station.address, station.neighborhood, station.city, station.state]
    .filter(Boolean)
    .join(", ");
}

export function getStationStatusInfo(
  station: ChargingStation,
  date = new Date(),
): StationStatusInfo {
  if (station.status === "maintenance") {
    return {
      label: "Em manutenção",
      description: "Ponto temporariamente indisponível",
    };
  }

  if (station.status === "unavailable") {
    return {
      label: "Status indisponível",
      description: "Não foi possível consultar a disponibilidade",
    };
  }

  if (!isStationOpenAt(station, date)) {
    return {
      label: "Fechado agora",
      description: station.openingHours,
    };
  }

  if (station.status === "available") {
    return {
      label: "Aberto agora",
      description: "Carregadores disponíveis neste momento",
    };
  }

  if (station.status === "busy") {
    return {
      label: "Ocupado agora",
      description: "Alta procura no momento",
    };
  }

  return {
    label: "Status indisponível",
    description: "Não foi possível consultar a disponibilidade",
  };
}

export function formatRatingStars(rating: number) {
  const roundedRating = Math.round(rating);

  return Array.from({ length: 5 }, (_, index) =>
    index < roundedRating ? "★" : "☆",
  ).join(" ");
}

export function getUserInitials(userName: string) {
  const nameParts = userName.trim().split(/\s+/);
  const firstInitial = nameParts[0]?.[0] ?? "";
  const lastInitial =
    nameParts.length > 1 ? nameParts[nameParts.length - 1]?.[0] ?? "" : "";

  return `${firstInitial}${lastInitial}`.toUpperCase();
}

export function getStationRouteUrl(
  station: ChargingStation,
  provider: RouteProvider,
) {
  const destination = `${station.latitude},${station.longitude}`;

  if (provider === "waze") {
    return `https://www.waze.com/ul?ll=${destination}&navigate=yes`;
  }

  return `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;
}

export function getEstimatedChargingTime(powerKw: number) {
  if (powerKw >= 120) return "20 a 35 min";
  if (powerKw >= 50) return "40 a 60 min";
  return "1h30 ou mais";
}

export function getStationRecommendation(
  station: ChargingStation,
  availableChargers: number,
) {
  if (station.status === "maintenance") {
    return "Evite este ponto por enquanto";
  }

  if (availableChargers > 0 && station.powerKw >= 120) {
    return "Boa escolha para uma parada rápida";
  }

  if (availableChargers > 0) {
    return "Boa opção para recarregar com conforto";
  }

  return "Verifique a fila antes de ir";
}

export function getWaitingLevel(
  status: ChargingStation["status"],
  availableChargers: number,
) {
  if (status === "maintenance") return "Indisponível";
  if (availableChargers > 1) return "Baixa";
  if (availableChargers === 1) return "Moderada";
  return "Alta";
}

export function getStationProfile(station: ChargingStation) {
  if (station.powerKw >= 120) return "Carga rápida";
  if (station.amenities.length >= 4) return "Parada confortável";
  return "Recarga essencial";
}
