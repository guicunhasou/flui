// Estados da interface, sem sugerir reconhecimento de voz inexistente.
export type FluiaState =
  | "repouso"
  | "digitando"
  | "pensando"
  | "respondendo"
  | "aviso"
  | "alerta";

export const FLUIA_STATE_LABELS: Record<FluiaState, string> = {
  repouso: "Pronta",
  digitando: "Escrevendo",
  pensando: "Pensando",
  respondendo: "Respondendo",
  aviso: "Aviso",
  alerta: "Alerta",
};

// Avisos e respostas retornam ao repouso; alertas persistem até nova interação.
export function tempoDeExibicaoFluia(state: FluiaState): number | null {
  if (state === "respondendo") return 2500;
  if (state === "aviso") return 5000;
  return null;
}
