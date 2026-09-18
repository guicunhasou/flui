import {
  amenityOptions,
  connectorOptions,
  defaultFilters,
  statusOptions,
} from '../data/filterOptions';
import type {
  Amenity,
  ConnectorType,
  StationFilters,
  StationStatus,
} from '../types';

const connectorValues = new Set(connectorOptions.map((option) => option.value));
const amenityValues = new Set(amenityOptions.map((option) => option.value));
const statusValues = new Set(statusOptions.map((option) => option.value));

function getParamString(value: unknown) {
  if (typeof value === 'string') {
    return value;
  }

  if (Array.isArray(value) && typeof value[0] === 'string') {
    return value[0];
  }

  return '';
}

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === 'object' && value !== null
    ? (value as Record<string, unknown>)
    : {};
}

function readNumber(source: unknown, key: string, fallback: number) {
  const value = asRecord(source)[key];
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function readStringArray(source: unknown, key: string) {
  const value = asRecord(source)[key];
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : [];
}

export function cloneDefaultFilters(): StationFilters {
  return {
    connectorTypes: [...defaultFilters.connectorTypes],
    statuses: [...defaultFilters.statuses],
    amenities: [...defaultFilters.amenities],
    power: { ...defaultFilters.power },
    distance: { ...defaultFilters.distance },
    rating: { ...defaultFilters.rating },
    onlyOpenNow: defaultFilters.onlyOpenNow,
    onlyAvailableChargers: defaultFilters.onlyAvailableChargers,
    onlyOpen24h: defaultFilters.onlyOpen24h,
  };
}

export function parseStationFiltersParam(param: unknown): StationFilters {
  const rawFilters = getParamString(param);

  if (!rawFilters) {
    return cloneDefaultFilters();
  }

  try {
    const parsed = asRecord(JSON.parse(rawFilters));

    return {
      connectorTypes: readStringArray(parsed, 'connectorTypes').filter(
        (value): value is ConnectorType =>
          connectorValues.has(value as ConnectorType),
      ),
      statuses: readStringArray(parsed, 'statuses').filter(
        (value): value is StationStatus =>
          statusValues.has(value as StationStatus),
      ),
      amenities: readStringArray(parsed, 'amenities').filter(
        (value): value is Amenity => amenityValues.has(value as Amenity),
      ),
      power: {
        minKw: Math.max(
          0,
          readNumber(parsed.power, 'minKw', defaultFilters.power.minKw),
        ),
      },
      distance: {
        maxKm: Math.max(
          0,
          readNumber(parsed.distance, 'maxKm', defaultFilters.distance.maxKm),
        ),
      },
      rating: {
        minRating: Math.max(
          0,
          readNumber(parsed.rating, 'minRating', defaultFilters.rating.minRating),
        ),
      },
      onlyOpenNow:
        typeof parsed.onlyOpenNow === 'boolean'
          ? parsed.onlyOpenNow
          : defaultFilters.onlyOpenNow,
      onlyAvailableChargers:
        typeof parsed.onlyAvailableChargers === 'boolean'
          ? parsed.onlyAvailableChargers
          : defaultFilters.onlyAvailableChargers,
      onlyOpen24h:
        typeof parsed.onlyOpen24h === 'boolean'
          ? parsed.onlyOpen24h
          : defaultFilters.onlyOpen24h,
    };
  } catch {
    return cloneDefaultFilters();
  }
}

export function getRouteParamString(param: unknown) {
  return getParamString(param);
}
