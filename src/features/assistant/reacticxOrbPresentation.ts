import type { FluiaState } from "./fluiaState";
import { ENERGY_ORB_COLORS } from "./energyOrbPresentation";
import { FLUIA_VISUAL_PRESENTATION, MAP_ORB_PALETTE, type FluiaVisualStatus } from "./fluiaVisualStatus";

export const REACTICX_SHADER_INTERVAL_MS = 1000 / 30;

// Pulso do fundo da esfera, no relógio UI.
export function getMapOrbPulse(seconds: number) {
  "worklet";
  const phase = seconds % 3.6;
  const progress = phase < 1.55 ? (phase - 0.2) / 1.35 : (phase - 2.65) / 0.95;
  const t = Math.min(1, Math.max(0, progress));
  const smooth = t * t * (3 - 2 * t);
  return phase < 1.55 ? smooth : 1 - smooth;
}

const STATE_EFFECTS: Record<FluiaState, { speed: number; intensity: number; glowRadius: number }> = {
  repouso: { speed: 0.25, intensity: 1.1, glowRadius: 0.42 },
  digitando: { speed: 0.65, intensity: 1.3, glowRadius: 0.4 },
  pensando: { speed: 0.9, intensity: 1.5, glowRadius: 0.44 },
  respondendo: { speed: 0.5, intensity: 1.4, glowRadius: 0.46 },
  aviso: { speed: 0, intensity: 1.1, glowRadius: 0.42 },
  alerta: { speed: 0, intensity: 1.3, glowRadius: 0.44 },
};

export function getReacticxOrbPresentation(state: FluiaState, reducedMotion: boolean, active: boolean, mapVariant = false, visualStatus?: FluiaVisualStatus) {
  const colors = ENERGY_ORB_COLORS[state];
  const effect = STATE_EFFECTS[state];
  const statusColors = visualStatus ? FLUIA_VISUAL_PRESENTATION[visualStatus] : null;
  const statusStatic = visualStatus === "erro" || visualStatus === "atencao" || visualStatus === "offline";
  return {
    ...effect,
    colors: mapVariant ? statusColors ? [MAP_ORB_PALETTE[0], statusColors.light, statusColors.core] : [...MAP_ORB_PALETTE] : [colors.core, colors.light, colors.rim],
    statusMode: !!visualStatus && visualStatus !== "pronta",
    animate: active && !reducedMotion && effect.speed > 0 && !statusStatic,
  };
}

// Usado no worklet: ignora intervalos inválidos e evita saltos ao retomar a tela.
export function clampOrbFrameDelta(deltaMs: number | null) {
  "worklet";
  return deltaMs !== null && Number.isFinite(deltaMs) ? Math.min(64, Math.max(0, deltaMs)) : 0;
}
