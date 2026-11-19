import {
  demonstracaoPadrao,
  limiteAutonomiaKm,
  limiteNomeVeiculo,
  origensDemonstrativas,
} from "../data/demonstracao";
import type { ChargingStation, UserPreferences } from "../types";

export type ConfiguracaoDemonstrativa = Pick<
  UserPreferences,
  "vehicleName" | "vehicleRangeKm" | "demoOriginId"
>;

export function validarConfiguracaoDemonstrativa(
  config: ConfiguracaoDemonstrativa,
) {
  if (
    !config.vehicleName.trim() ||
    config.vehicleName.trim().length > limiteNomeVeiculo
  ) {
    return `Informe um veículo com até ${limiteNomeVeiculo} caracteres.`;
  }
  if (
    !Number.isFinite(config.vehicleRangeKm) ||
    config.vehicleRangeKm <= 0 ||
    config.vehicleRangeKm > limiteAutonomiaKm
  ) {
    return `Informe autonomia maior que zero e de até ${limiteAutonomiaKm} km.`;
  }
  if (!origensDemonstrativas.some((origem) => origem.id === config.demoOriginId)) {
    return "Selecione uma origem demonstrativa da lista.";
  }
  return null;
}

export function normalizarConfiguracaoDemonstrativa(
  config?: Partial<ConfiguracaoDemonstrativa> | null,
): ConfiguracaoDemonstrativa {
  const origem = origensDemonstrativas.find((item) => item.id === config?.demoOriginId);
  return {
    vehicleName:
      typeof config?.vehicleName === "string" && config.vehicleName.trim()
        ? config.vehicleName.trim().slice(0, limiteNomeVeiculo)
        : demonstracaoPadrao.vehicleName,
    vehicleRangeKm:
      typeof config?.vehicleRangeKm === "number" &&
      Number.isFinite(config.vehicleRangeKm) &&
      config.vehicleRangeKm > 0 &&
      config.vehicleRangeKm <= limiteAutonomiaKm
        ? config.vehicleRangeKm
        : demonstracaoPadrao.vehicleRangeKm,
    demoOriginId: origem?.id ?? demonstracaoPadrao.demoOriginId,
  };
}

type Coordenada = { latitude: number; longitude: number };

// Haversine: distância sobre a esfera, sem ruas, trânsito ou duração de percurso.
export function calcularDistanciaGeograficaKm(
  origem: Coordenada,
  destino: Coordenada,
) {
  const radianos = (graus: number) => graus * Math.PI / 180;
  const dLat = radianos(destino.latitude - origem.latitude);
  const dLon = radianos(destino.longitude - origem.longitude);
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(radianos(origem.latitude)) * Math.cos(radianos(destino.latitude)) *
    Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(Math.min(1, Math.max(0, a))));
}

export function aplicarOrigemDemonstrativa(
  estacoes: ChargingStation[],
  origem: Coordenada,
) {
  return estacoes.map((estacao) => ({
    ...estacao,
    // Manter precisão para filtros/reserva; arredondar somente na apresentação.
    distanceKm: calcularDistanciaGeograficaKm(origem, estacao),
  }));
}

export function formatarDistanciaDemonstrativa(distanceKm: number) {
  return distanceKm < 1
    ? `≈${Math.round(distanceKm * 1000)} m`
    : `≈${distanceKm.toFixed(1).replace(".", ",")} km`;
}
