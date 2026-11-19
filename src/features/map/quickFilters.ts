import { defaultFilters } from "../../data/filterOptions";
import type { ChargingStation, StationFilters } from "../../types";

export type QuickFilterId = "openNow" | "ccs2" | "fast" | "restroom";
export type QuickFilters = Record<QuickFilterId, boolean>;

export const initialQuickFilters: QuickFilters = {
  openNow: false,
  ccs2: false,
  fast: false,
  restroom: false,
};

export function hasActiveStationFilters(filters: StationFilters) {
  return (
    filters.connectorTypes.length > 0 ||
    filters.statuses.length > 0 ||
    filters.amenities.length > 0 ||
    filters.power.minKw > 0 ||
    filters.distance.maxKm !== defaultFilters.distance.maxKm ||
    filters.rating.minRating > 0 ||
    filters.onlyOpenNow ||
    filters.onlyAvailableChargers ||
    filters.onlyOpen24h
  );
}

export function applyQuickFilters(
  filters: StationFilters,
  quickFilters: QuickFilters,
): StationFilters {
  return {
    connectorTypes: quickFilters.ccs2
      ? Array.from(new Set([...filters.connectorTypes, "ccs2"]))
      : filters.connectorTypes,
    statuses: filters.statuses,
    amenities: quickFilters.restroom
      ? Array.from(new Set([...filters.amenities, "restroom"]))
      : filters.amenities,
    power: {
      minKw: quickFilters.fast
        ? Math.max(filters.power.minKw, 50)
        : filters.power.minKw,
    },
    distance: filters.distance,
    rating: filters.rating,
    onlyOpenNow: filters.onlyOpenNow || quickFilters.openNow,
    onlyAvailableChargers: filters.onlyAvailableChargers,
    onlyOpen24h: filters.onlyOpen24h,
  };
}


// Os chips rápidos refletem os mesmos critérios editados na tela avançada.
// Não guardamos um segundo conjunto de filtros para evitar estados divergentes.
export function quickFiltersFromStationFilters(filters: StationFilters): QuickFilters {
  return {
    openNow: filters.onlyOpenNow,
    ccs2: filters.connectorTypes.includes("ccs2"),
    fast: filters.power.minKw >= 50,
    restroom: filters.amenities.includes("restroom"),
  };
}

export function toggleQuickStationFilter(
  filters: StationFilters,
  filterId: QuickFilterId,
): StationFilters {
  const selected = quickFiltersFromStationFilters(filters)[filterId];

  switch (filterId) {
    case "openNow":
      return { ...filters, onlyOpenNow: !selected };
    case "ccs2":
      return {
        ...filters,
        connectorTypes: selected
          ? filters.connectorTypes.filter((type) => type !== "ccs2")
          : [...filters.connectorTypes, "ccs2"],
      };
    case "fast":
      return { ...filters, power: { ...filters.power, minKw: selected ? 0 : 50 } };
    case "restroom":
      return {
        ...filters,
        amenities: selected
          ? filters.amenities.filter((amenity) => amenity !== "restroom")
          : [...filters.amenities, "restroom"],
      };
  }
}

export function hasActiveQuickFilters(quickFilters: QuickFilters) {
  return Object.values(quickFilters).some(Boolean);
}

function quickFilterScore(
  station: ChargingStation,
  quickFilters: QuickFilters,
) {
  let score = 0;

  if (
    quickFilters.openNow &&
    station.connectors.some((connector) => connector.availableChargers > 0)
  ) {
    score += 80;
  }

  if (
    quickFilters.ccs2 &&
    station.connectors.some((connector) => connector.type === "ccs2")
  ) {
    score += 60;
  }

  if (quickFilters.fast) {
    score += station.powerKw;
  }

  if (quickFilters.restroom && station.amenities.includes("restroom")) {
    score += 50;
  }

  return score;
}

export function rankStationsByQuickFilters<T extends ChargingStation>(
  stations: { station: T; index: number }[],
  quickFilters: QuickFilters,
) {
  if (!hasActiveQuickFilters(quickFilters)) {
    return stations;
  }

  return [...stations].sort((a, b) => {
    const scoreDifference =
      quickFilterScore(b.station, quickFilters) -
      quickFilterScore(a.station, quickFilters);

    if (scoreDifference !== 0) {
      return scoreDifference;
    }

    return (
      (a.station.distanceKm ?? a.index) - (b.station.distanceKm ?? b.index)
    );
  });
}
