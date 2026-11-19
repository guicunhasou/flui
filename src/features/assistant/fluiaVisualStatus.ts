import type { ConnectionStatus } from "../../utils/connectivity";
import type { FluiaState } from "./fluiaState";

export const MAP_ORB_PALETTE = ["#2B0055", "#C797FF", "#6F2DC4"] as const;
export const FLUIA_VISUAL_STATUSES = ["pronta", "ouvindo", "pensando", "explicando", "erro", "atencao", "offline"] as const;
export type FluiaVisualStatus = typeof FLUIA_VISUAL_STATUSES[number];

export const FLUIA_VISUAL_PRESENTATION = {
  pronta: { label: "Pronta", color: "#C797FF", light: "#C797FF", core: "#6F2DC4" },
  ouvindo: { label: "Ouvindo", color: "#8DDFFF", light: "#C3EFFF", core: "#67CFFF" },
  pensando: { label: "Pensando", color: "#AE70FF", light: "#C99CFF", core: "#AE70FF" },
  explicando: { label: "Explicando", color: "#D7B8FF", light: "#EAD9FF", core: "#D7B8FF" },
  erro: { label: "Erro", color: "#FF6B7A", light: "#FFB0BA", core: "#FF6B7A" },
  atencao: { label: "Atenção", color: "#FFC45C", light: "#FFE6A9", core: "#FFC45C" },
  offline: { label: "Offline", color: "#8E9AAF", light: "#C6CFDD", core: "#8E9AAF" },
} as const;

export function getFluiaVisualStatus(state: FluiaState, connection: ConnectionStatus, isSpeaking = false): FluiaVisualStatus {
  if (isSpeaking) return "explicando";
  if (connection === "offline") return "offline";
  if (state === "pensando") return "pensando";
  if (state === "respondendo") return "explicando";
  // Ausência de recomendação e resposta fora de escopo pedem atenção, não indicam falha técnica.
  if (state === "aviso" || state === "alerta") return "atencao";
  return "pronta";
}

export function nextFluiaVisualStatus(current: FluiaVisualStatus): FluiaVisualStatus {
  return FLUIA_VISUAL_STATUSES[(FLUIA_VISUAL_STATUSES.indexOf(current) + 1) % FLUIA_VISUAL_STATUSES.length];
}

export function getFluiaPreviewState(status: FluiaVisualStatus): FluiaState {
  if (status === "pensando") return "pensando";
  if (status === "explicando") return "respondendo";
  if (status === "erro") return "alerta";
  if (status === "atencao") return "aviso";
  return "repouso";
}
