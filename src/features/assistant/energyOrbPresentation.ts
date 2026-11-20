import type { FluiaState } from "./fluiaState";

export const ENERGY_ORB_COLORS: Record<FluiaState, { light: string; core: string; rim: string }> = {
  repouso: { light: "#E5CCFF", core: "#6F2DC4", rim: "#83DEC3" },
  digitando: { light: "#C6FFF0", core: "#5B2CA5", rim: "#4DBD9D" },
  pensando: { light: "#DBC3FF", core: "#7134C6", rim: "#9CAEFF" },
  respondendo: { light: "#CEFFE9", core: "#3B7E78", rim: "#71DDB7" },
  aviso: { light: "#FFE8B5", core: "#8A5626", rim: "#E5AE56" },
  alerta: { light: "#FFD1DF", core: "#9A355E", rim: "#EB94AF" },
};

// Avisos e alertas permanecem estáticos; não usamos piscadas para sinalizá-los.
export function getEnergyOrbMotion(state: FluiaState, reducedMotion: boolean, active: boolean) {
  if (reducedMotion || !active || state === "aviso" || state === "alerta") {
    return { duration: 0, amplitude: 0, rotate: false };
  }
  return {
    duration: state === "repouso" ? 4800 : state === "pensando" ? 2200 : 2800,
    amplitude: state === "repouso" ? 0.025 : 0.055,
    rotate: state === "pensando",
  };
}
