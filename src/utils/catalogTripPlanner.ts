import type { ChargingStation } from "../types";
import { avaliarAlcance } from "./autonomia";
import { calcularDistanciaGeograficaKm } from "./demonstracao";
import { canChargeAt } from "./stationAvailability";
import {
  BATERIA_ALVO_PARADA_PERCENT,
  RESERVA_MINIMA_PARADA_PERCENT,
  VELOCIDADE_MEDIA_KMH,
  type PlanoDeViagem,
} from "./tripPlanner";

type Coordenada = { latitude: number; longitude: number };
const validCoordinate = (p: Coordenada) => Number.isFinite(p.latitude) && Math.abs(p.latitude) <= 90
  && Number.isFinite(p.longitude) && Math.abs(p.longitude) <= 180;
const timeFor = (km: number) => Math.round(km / VELOCIDADE_MEDIA_KMH * 60);

// Modelo local de trechos em linha reta. Busca menos recargas; em empate, menor
// distância total. Não consulta ruas, trânsito, reserva ou disponibilidade real.
export function planejarViagemNoCatalogo(
  origem: Coordenada,
  destino: Coordenada,
  vehicleRangeKm: number,
  batteryPercent: number,
  catalogo: ChargingStation[],
  now = new Date(),
): PlanoDeViagem {
  const inputsValid = validCoordinate(origem) && validCoordinate(destino)
    && Number.isFinite(vehicleRangeKm) && vehicleRangeKm > 0
    && Number.isFinite(batteryPercent) && batteryPercent >= 0 && batteryPercent <= 100
    && Number.isFinite(now.getTime());
  const candidates = inputsValid ? catalogo.filter(s => validCoordinate(s)
    && Number.isFinite(s.powerKw) && s.powerKw > 0 && canChargeAt(s, now)) : [];
  const start = candidates.length;
  const points: Coordenada[] = [...candidates, origem];
  const counts = points.map(() => Infinity);
  const distances = points.map(() => Infinity);
  const previous = points.map(() => -1);
  const visited = new Set<number>();
  counts[start] = 0;
  distances[start] = 0;
  let goalParent = -1;
  let goalCount = Infinity;
  let goalDistance = Infinity;
  const arrival = (battery: number, km: number) => battery - km / vehicleRangeKm * 100;

  if (inputsValid) for (let iteration = 0; iteration < points.length; iteration++) {
    let current = -1;
    for (let i = 0; i < points.length; i++) {
      if (visited.has(i) || !Number.isFinite(counts[i])) continue;
      if (current < 0 || counts[i] < counts[current]
        || (counts[i] === counts[current] && distances[i] < distances[current])) current = i;
    }
    if (current < 0 || counts[current] > goalCount) break;
    visited.add(current);
    const battery = current === start ? batteryPercent : BATERIA_ALVO_PARADA_PERCENT;
    const finalKm = calcularDistanciaGeograficaKm(points[current], destino);
    const total = distances[current] + finalKm;
    if (arrival(battery, finalKm) >= RESERVA_MINIMA_PARADA_PERCENT
      && (counts[current] < goalCount || (counts[current] === goalCount && total < goalDistance))) {
      goalParent = current;
      goalCount = counts[current];
      goalDistance = total;
    }
    for (let next = 0; next < candidates.length; next++) {
      if (visited.has(next)) continue;
      const km = calcularDistanciaGeograficaKm(points[current], points[next]);
      if (arrival(battery, km) < RESERVA_MINIMA_PARADA_PERCENT) continue;
      const nextCount = counts[current] + 1;
      const nextDistance = distances[current] + km;
      if (nextCount < counts[next] || (nextCount === counts[next] && nextDistance < distances[next])) {
        counts[next] = nextCount;
        distances[next] = nextDistance;
        previous[next] = current;
      }
    }
  }

  const path: ChargingStation[] = [];
  for (let node = goalParent; node >= 0 && node !== start; node = previous[node]) path.unshift(candidates[node]);
  let position = origem;
  let battery = inputsValid ? batteryPercent : 0;
  let totalKm = 0;
  const paradas = path.map(station => {
    const km = calcularDistanciaGeograficaKm(position, station);
    const exactArrival = arrival(battery, km);
    const departure = Math.max(exactArrival, BATERIA_ALVO_PARADA_PERCENT);
    totalKm += km;
    position = station;
    battery = departure;
    return {
      id: station.id, nome: station.name, powerKw: station.powerKw,
      latitude: station.latitude, longitude: station.longitude,
      distanciaTrechoKm: Math.round(km), tempoTrechoMin: timeFor(km),
      bateriaChegadaPercent: Math.floor(exactArrival), bateriaSaidaPercent: departure,
    };
  });
  const finalKm = validCoordinate(position) && validCoordinate(destino)
    ? calcularDistanciaGeograficaKm(position, destino) : 0;
  const finalBattery = inputsValid ? arrival(battery, finalKm) : 0;
  totalKm += finalKm;
  const viable = goalParent >= 0 && finalBattery >= RESERVA_MINIMA_PARADA_PERCENT;
  return {
    distanciaTotalKm: Math.round(totalKm), tempoEstimadoMin: timeFor(totalKm), paradas,
    bateriaChegadaDestinoPercent: Math.max(0, Math.floor(finalBattery)),
    trechoFinal: { distanciaKm: Math.round(finalKm), tempoMin: timeFor(finalKm), bateriaSaidaPercent: battery },
    nivelDeAlcance: viable ? avaliarAlcance(finalKm, vehicleRangeKm, battery).nivel : "foraDeAlcance",
  };
}
