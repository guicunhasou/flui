import { formatAssistantDistance, type FluiAssistantRecommendation } from "./fluiAssistant";
import type { UserPreferences } from "../../types";
import { getBatterySourceLabels } from "../../utils/batteryData";

export function summarizeAssistantContext(
  preferences: Pick<UserPreferences, "vehicleName" | "batteryPercent">,
  originName: string,
) {
  return `${preferences.vehicleName} · bateria ${preferences.batteryPercent}%\nOrigem do cenário: ${originName}`;
}

export function describeAssistantContext(
  preferences: Pick<UserPreferences, "vehicleName" | "vehicleRangeKm" | "batteryPercent" | "batterySource" | "batteryUpdatedAt">,
  originName: string,
  stationCount: number,
) {
  const source = getBatterySourceLabels(preferences);
  const detail = source.detail === "Sem telemetria" ? "" : ` · ${source.detail}`;
  return [
    `Veículo: ${preferences.vehicleName}. Autonomia configurada com bateria cheia: ${preferences.vehicleRangeKm} km.`,
    `Bateria para estimativa: ${preferences.batteryPercent}%. ${source.source}${detail}. Sem telemetria do veículo.`,
    `Origem do cenário: ${originName}. Esta consulta não usa sua localização real.`,
    `Estações recebidas nesta consulta: ${stationCount}. Catálogo de simulação; não confirma disponibilidade real.`,
    "Valores atuais para novas consultas. Respostas anteriores podem usar outros valores; envie nova pergunta após ajustes.",
  ].join("\n");
}

// O resumo é a resposta visível por padrão; a explicação completa continua disponível.
export function summarizeSuggestion(recommendation: FluiAssistantRecommendation) {
  const free = recommendation.availableChargers === 1 ? "1 carregador livre" : `${recommendation.availableChargers} carregadores livres`;
  const reasons = {
    lowBattery: `Uma opção para preservar bateria, com ${free} no cadastro.`,
    fastCharge: `Até ${recommendation.powerKw} kW no cadastro; a velocidade depende do carro.`,
    avoidQueues: `${free} no cadastro; a fila real não é monitorada.`,
    coffeeAndRestroom: "Café e banheiro cadastrados para sua parada.",
    comfortableWait: "Comodidades cadastradas para esperar com conforto.",
  };
  return `Sugiro ${recommendation.primary.name}.\n${reasons[recommendation.intent]}\nChegada ≈${recommendation.arrivalBatteryPercent}% · ${formatAssistantDistance(recommendation.primary.distanceKm)} em linha reta.\nDados simulados, com reserva de 5%. Confirme funcionamento e compatibilidade.`;
}
