import type { BatterySource } from "../types/storage";
import { demonstracaoPadrao } from "../data/demonstracao";
export type BatteryData = {
  batteryPercent: number;
  batterySource: BatterySource;
  batteryUpdatedAt: string | null;
};

export function normalizeBatteryData(
  data?: Partial<BatteryData> | null,
): BatteryData {
  const percent = data?.batteryPercent;
  const validPercent = typeof percent === "number" && Number.isFinite(percent);
  const batteryPercent = validPercent
    ? Math.min(100, Math.max(0, percent))
    : demonstracaoPadrao.batteryPercent;
  const timestamp = data?.batteryUpdatedAt;
  const validTimestamp =
    typeof timestamp === "string" && Number.isFinite(Date.parse(timestamp));
  if (validPercent && data?.batterySource === "manual" && validTimestamp) {
    return {
      batteryPercent,
      batterySource: "manual",
      batteryUpdatedAt: timestamp,
    };
  }
  // Valores de versões anteriores não têm origem rastreável. Não atribuir
  // retroativamente uma edição manual nem uma atualização do veículo.
  return {
    batteryPercent,
    batterySource:
      data?.batterySource === "demo" || !validPercent ? "demo" : "unknown",
    batteryUpdatedAt: null,
  };
}

export function getBatterySourceLabels(data: BatteryData) {
  if (data.batterySource === "manual" && data.batteryUpdatedAt) {
    return {
      source: "Informado manualmente",
      detail: new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(data.batteryUpdatedAt)),
    };
  }
  return {
    source:
      data.batterySource === "demo"
        ? "Valor de simulação"
        : "Origem não registrada",
    detail: data.batterySource === "demo"
      ? "Informe a carga do painel para personalizar as estimativas"
      : "Confira a carga no painel e atualize este valor",
  };
}
