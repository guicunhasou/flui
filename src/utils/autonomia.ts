export type NivelDeAlcance = "tranquilo" | "apertado" | "foraDeAlcance";

export type AvaliacaoDeAlcance = {
  nivel: NivelDeAlcance;
  autonomiaAtualKm: number;
  bateriaAoChegarPercent: number;
  kmFaltantes: number;
};

const MARGEM_TRANQUILA_PERCENT = 0.2;

export function calcularAutonomiaAtualKm(
  vehicleRangeKm: number,
  batteryPercent: number,
) {
  return (vehicleRangeKm * batteryPercent) / 100;
}

export function avaliarAlcance(
  distanceKm: number,
  vehicleRangeKm: number,
  batteryPercent: number,
): AvaliacaoDeAlcance {
  const autonomiaAtualKm = calcularAutonomiaAtualKm(
    vehicleRangeKm,
    batteryPercent,
  );
  const kmRestantesAoChegar = autonomiaAtualKm - distanceKm;
  const bateriaAoChegarPercent =
    vehicleRangeKm > 0
      ? Math.max(0, (kmRestantesAoChegar / vehicleRangeKm) * 100)
      : 0;

  let nivel: NivelDeAlcance = "tranquilo";

  if (kmRestantesAoChegar < 0) {
    nivel = "foraDeAlcance";
  } else if (kmRestantesAoChegar < vehicleRangeKm * MARGEM_TRANQUILA_PERCENT) {
    nivel = "apertado";
  }

  return {
    nivel,
    autonomiaAtualKm,
    bateriaAoChegarPercent: Math.round(bateriaAoChegarPercent),
    kmFaltantes: Math.max(0, Math.round(-kmRestantesAoChegar)),
  };
}
