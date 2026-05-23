import {
  Amenity,
  ConnectorType,
  FilterOption,
  StationFilters,
  StationStatus,
} from '../types';

export const connectorOptions: FilterOption<ConnectorType>[] = [
  {
    label: 'CCS2',
    value: 'ccs2',
  },
  {
    label: 'Type 2',
    value: 'type2',
  },
  {
    label: 'CHAdeMO',
    value: 'chademo',
  },
  {
    label: 'GB/T',
    value: 'gbt',
  },
];

export const statusOptions: FilterOption<StationStatus>[] = [
  {
    label: 'Disponível',
    value: 'available',
  },
  {
    label: 'Ocupado',
    value: 'busy',
  },
  {
    label: 'Indisponível',
    value: 'unavailable',
  },
  {
    label: 'Em manutenção',
    value: 'maintenance',
  },
];

export const amenityOptions: FilterOption<Amenity>[] = [
  {
    label: 'Restaurante',
    value: 'restaurant',
  },
  {
    label: 'Café',
    value: 'coffee',
  },
  {
    label: 'Banheiro',
    value: 'restroom',
  },
  {
    label: 'Estacionamento',
    value: 'parking',
  },
  {
    label: 'Área coberta',
    value: 'coveredArea',
  },
  {
    label: 'Mercado',
    value: 'market',
  },
  {
    label: 'Wi-Fi',
    value: 'wifi',
  },
  {
    label: 'Segurança',
    value: 'security',
  },
];

export const defaultFilters: StationFilters = {
  connectorTypes: [],
  statuses: [],
  amenities: [],
  power: {
    minKw: 0,
  },
  distance: {
    maxKm: 10,
  },
  rating: {
    minRating: 0,
  },
  onlyOpenNow: false,
};

export const powerOptions = [22, 50, 60, 120, 150];

export const distanceOptions = [1, 3, 5, 10, 20];

export const ratingOptions = [3, 4, 4.5];