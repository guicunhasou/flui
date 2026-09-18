import type { ChargingStation } from "../src/types";

export function createStation(
  overrides: Partial<ChargingStation> = {},
): ChargingStation {
  return {
    id: "station-test",
    name: "Estação Teste",
    address: "Avenida Teste, 100",
    neighborhood: "Centro",
    city: "São Paulo",
    state: "SP",
    latitude: -23.55,
    longitude: -46.63,
    distanceKm: 2,
    rating: 4.8,
    reviewCount: 10,
    status: "available",
    powerKw: 120,
    connectors: [
      {
        id: "connector-test",
        type: "ccs2",
        label: "CCS2",
        powerKw: 120,
        totalChargers: 2,
        availableChargers: 1,
      },
    ],
    amenities: ["restroom", "parking"],
    openingHours: "24 horas",
    openingSchedule: {
      timeZone: "America/Sao_Paulo",
      periods: [
        {
          days: ["sun", "mon", "tue", "wed", "thu", "fri", "sat"],
          opensAt: "00:00",
          closesAt: "24:00",
        },
      ],
    },
    lessBusyPeriods: ["10h às 12h"],
    ...overrides,
  };
}
