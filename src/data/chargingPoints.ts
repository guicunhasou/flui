import type { DimensionValue } from "react-native";

export type ConnectorType = "Tipo 2" | "CCS2" | "CHAdeMO";

export type BusyLevel = "baixo" | "moderado" | "alto";

export type ChargingPoint = {
  id: string;
  name: string;
  address: string;
  distance: string;
  rating: number;
  reviews: number;

  availableChargers: number;
  totalChargers: number;
  powerKw: number;
  connectors: ConnectorType[];

  openNow: boolean;
  openingHours: string;
  lessBusyPeriod: string;
  busyLevel: BusyLevel;

  amenities: string[];
  price: string;

  isFavorite: boolean;
  isRecommended: boolean;

  coordinates: {
    latitude: number;
    longitude: number;
  };

  pinPosition: {
    top: DimensionValue;
    left: DimensionValue;
  };
};

export const chargingPoints: ChargingPoint[] = [
  {
    id: "1",
    name: "Flui Station Shopping Recife",
    address: "Av. República do Líbano, 251 — Pina",
    distance: "1,2 km",
    rating: 4.9,
    reviews: 128,

    availableChargers: 4,
    totalChargers: 6,
    powerKw: 150,
    connectors: ["CCS2", "Tipo 2"],

    openNow: true,
    openingHours: "Aberto 24h",
    lessBusyPeriod: "Entre 10h e 14h",
    busyLevel: "baixo",

    amenities: ["Shopping", "Banheiro", "Alimentação", "Área coberta"],
    price: "R$ 2,10/kWh",

    isFavorite: true,
    isRecommended: true,

    coordinates: {
      latitude: -8.0906,
      longitude: -34.8842,
    },

    pinPosition: {
      top: "12%",
      left: "44%",
    },
  },
  {
    id: "2",
    name: "Eletroposto Boa Viagem",
    address: "Av. Conselheiro Aguiar, 3200 — Boa Viagem",
    distance: "2,4 km",
    rating: 4.7,
    reviews: 86,

    availableChargers: 2,
    totalChargers: 4,
    powerKw: 80,
    connectors: ["CCS2", "CHAdeMO"],

    openNow: true,
    openingHours: "Aberto até 23h",
    lessBusyPeriod: "Entre 13h e 16h",
    busyLevel: "moderado",

    amenities: ["Café", "Estacionamento", "Wi-Fi"],
    price: "R$ 1,95/kWh",

    isFavorite: false,
    isRecommended: true,

    coordinates: {
      latitude: -8.1193,
      longitude: -34.899,
    },

    pinPosition: {
      top: "23%",
      left: "20%",
    },
  },
  {
    id: "3",
    name: "Charge Point Casa Forte",
    address: "Av. Dezessete de Agosto, 980 — Casa Forte",
    distance: "3,1 km",
    rating: 4.6,
    reviews: 64,

    availableChargers: 1,
    totalChargers: 3,
    powerKw: 60,
    connectors: ["Tipo 2"],

    openNow: true,
    openingHours: "Aberto até 22h",
    lessBusyPeriod: "Entre 9h e 11h",
    busyLevel: "alto",

    amenities: ["Restaurante", "Mercado", "Área coberta"],
    price: "R$ 1,80/kWh",

    isFavorite: false,
    isRecommended: false,

    coordinates: {
      latitude: -8.035,
      longitude: -34.917,
    },

    pinPosition: {
      top: "26%",
      left: "76%",
    },
  },
  {
    id: "4",
    name: "Flui Express Marco Zero",
    address: "Av. Alfredo Lisboa — Recife Antigo",
    distance: "4,6 km",
    rating: 4.8,
    reviews: 102,

    availableChargers: 3,
    totalChargers: 4,
    powerKw: 120,
    connectors: ["CCS2", "Tipo 2"],

    openNow: true,
    openingHours: "Aberto 24h",
    lessBusyPeriod: "Entre 8h e 10h",
    busyLevel: "baixo",

    amenities: ["Ponto turístico", "Café", "Banheiro", "Área segura"],
    price: "R$ 2,25/kWh",

    isFavorite: true,
    isRecommended: true,

    coordinates: {
      latitude: -8.0631,
      longitude: -34.8711,
    },

    pinPosition: {
      top: "49%",
      left: "60%",
    },
  },
  {
    id: "5",
    name: "EcoCharge Derby",
    address: "Praça do Derby — Derby",
    distance: "5,0 km",
    rating: 4.3,
    reviews: 41,

    availableChargers: 0,
    totalChargers: 2,
    powerKw: 50,
    connectors: ["Tipo 2"],

    openNow: false,
    openingHours: "Fechado agora",
    lessBusyPeriod: "Entre 15h e 17h",
    busyLevel: "alto",

    amenities: ["Estacionamento", "Farmácia próxima"],
    price: "R$ 1,70/kWh",

    isFavorite: false,
    isRecommended: false,

    coordinates: {
      latitude: -8.0578,
      longitude: -34.8984,
    },

    pinPosition: {
      top: "68%",
      left: "29%",
    },
  },
  {
    id: "6",
    name: "Power Hub Jaqueira",
    address: "Rua do Futuro, 450 — Jaqueira",
    distance: "5,8 km",
    rating: 4.5,
    reviews: 58,

    availableChargers: 2,
    totalChargers: 5,
    powerKw: 90,
    connectors: ["CCS2"],

    openNow: true,
    openingHours: "Aberto até 21h",
    lessBusyPeriod: "Entre 11h e 13h",
    busyLevel: "moderado",

    amenities: ["Parque próximo", "Café", "Banheiro"],
    price: "R$ 1,99/kWh",

    isFavorite: false,
    isRecommended: false,

    coordinates: {
      latitude: -8.0366,
      longitude: -34.9032,
    },

    pinPosition: {
      top: "67%",
      left: "70%",
    },
  },
];

export const recommendedChargingPoints = chargingPoints.filter(
  (point) => point.isRecommended
);

export const favoriteChargingPoints = chargingPoints.filter(
  (point) => point.isFavorite
);

export const availableChargingPoints = chargingPoints.filter(
  (point) => point.availableChargers > 0 && point.openNow
);