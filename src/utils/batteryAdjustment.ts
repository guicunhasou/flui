// Coordenadas da régua em pontos locais. Retorna null enquanto não houver layout.
export function batteryLevelFromPosition(position: number, width: number): number | null {
  if (!Number.isFinite(position) || !Number.isFinite(width) || width <= 0) return null;
  return Math.round(Math.min(1, Math.max(0, position / width)) * 100);
}
