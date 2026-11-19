// Reacticx Energy Orb — Copyright (c) 2026 rit3zh, MIT.
// Fonte fixada em 4e11fcfe04e0bd7054574acc1557320911d70e4c. Licença integral em ./LICENSE.
interface IEnergyOrb {
  readonly width?: number;
  readonly height?: number;
  readonly speed?: number;
  readonly intensity?: number;
  readonly colors?: string[];
  readonly glowRadius?: number;
}

type RGB = [number, number, number];

export type { IEnergyOrb, RGB };
