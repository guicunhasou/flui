import { calcularDistanciaGeograficaKm } from "./demonstracao";
import type { PlanoDeViagem } from "./tripPlanner";

type TripStopContext = {
  stationId: string;
  destinationId: string;
  origin: string;
  distanceKm: number;
  vehicleRangeKm: number;
  departurePercent: number;
  arrivalPercent: number;
};

export function getTripStopContext(
  stops: PlanoDeViagem["paradas"],
  index: number,
  origin: { nome: string; latitude: number; longitude: number },
  destinationId: string,
  vehicleRangeKm: number,
  initialBatteryPercent: number,
): TripStopContext | null {
  const stop = stops[index];
  if (!stop) return null;

  const previous = stops[index - 1];
  const departure = previous ?? origin;
  return {
    stationId: stop.id,
    destinationId,
    origin: departure.nome,
    distanceKm: calcularDistanciaGeograficaKm(departure, stop),
    vehicleRangeKm,
    departurePercent: previous?.bateriaSaidaPercent ?? initialBatteryPercent,
    arrivalPercent: stop.bateriaChegadaPercent,
  };
}

function validPercent(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 100;
}

export function readTripStopContext(
  serialized: string | undefined,
  stationId: string,
): TripStopContext | null {
  if (!serialized) return null;

  try {
    const context: Partial<TripStopContext> | null = JSON.parse(serialized);
    if (
      !context || context.stationId !== stationId ||
      typeof context.destinationId !== "string" || !context.destinationId ||
      typeof context.origin !== "string" || !context.origin.trim() ||
      typeof context.distanceKm !== "number" || !Number.isFinite(context.distanceKm) || context.distanceKm < 0 ||
      typeof context.vehicleRangeKm !== "number" || !Number.isFinite(context.vehicleRangeKm) || context.vehicleRangeKm <= 0 ||
      !validPercent(context.departurePercent) || !validPercent(context.arrivalPercent) ||
      context.arrivalPercent > context.departurePercent
    ) return null;

    return {
      stationId,
      destinationId: context.destinationId,
      origin: context.origin,
      distanceKm: context.distanceKm,
      vehicleRangeKm: context.vehicleRangeKm,
      departurePercent: context.departurePercent,
      arrivalPercent: context.arrivalPercent,
    };
  } catch {
    return null;
  }
}
