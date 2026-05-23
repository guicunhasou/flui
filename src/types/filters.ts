import { Amenity, ConnectorType, StationStatus } from './chargingStation';

export type PowerFilter = {
  minKw: number;
};

export type DistanceFilter = {
  maxKm: number;
};

export type RatingFilter = {
  minRating: number;
};

export type StationFilters = {
  connectorTypes: ConnectorType[];
  statuses: StationStatus[];
  amenities: Amenity[];
  power: PowerFilter;
  distance: DistanceFilter;
  rating: RatingFilter;
  onlyOpenNow: boolean;
};

export type FilterOption<TValue extends string> = {
  label: string;
  value: TValue;
};