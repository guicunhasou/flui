import type { StationImageKey } from "../assets/stations";

export type ConnectorType = 'ccs2' | 'type2' | 'chademo' | 'gbt';

export type Amenity =
  | 'restaurant'
  | 'coffee'
  | 'restroom'
  | 'parking'
  | 'coveredArea'
  | 'market'
  | 'wifi'
  | 'security';

export type StationStatus = 'available' | 'busy' | 'unavailable' | 'maintenance';

export type ChargingStationConnector = {
  id: string;
  type: ConnectorType;
  label: string;
  powerKw: number;
  totalChargers: number;
  availableChargers: number;
};

export type ChargingStationReview = {
  id: string;
  stationId: string;
  userName: string;
  rating: number;
  quality: number;
  cleaning: number;
  availability: number;
  amenities: number;
  comment: string;
  wouldReturn: boolean;
  recommend: boolean;
  createdAt: string;
};

export type ChargingStation = {
  id: string;
  name: string;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
  rating: number;
  reviewCount: number;
  status: StationStatus;
  powerKw: number;
  connectors: ChargingStationConnector[];
  amenities: Amenity[];
  openingHours: string;
  lessBusyPeriods: string[];
  imageKey?: StationImageKey;
  imageUrl?: string;
  isFavorite?: boolean;
  reviews?: ChargingStationReview[];
};