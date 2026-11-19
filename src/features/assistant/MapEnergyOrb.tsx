import React from "react";
import { EnergyOrb } from "./EnergyOrb";
import type { ReacticxOrbProps } from "./MapEnergyOrb.types";
// Fallback genérico. Web e nativo têm adaptadores próprios por plataforma.
export function MapEnergyOrb(props: ReacticxOrbProps) { return <EnergyOrb {...props} />; }
