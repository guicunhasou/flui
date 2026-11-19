import React, { Component, useEffect, useMemo, useState, type ComponentType, type ReactNode } from "react";
import { AppState, View } from "react-native";
import { EnergyOrb } from "./EnergyOrb";
import type { ReacticxOrbProps } from "./MapEnergyOrb.types";

class ShaderBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { console.warn("UX-MAPA-01: renderer Reacticx indisponível; Orb SVG preservada."); }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

export function MapEnergyOrb(props: ReacticxOrbProps) {
  const [foreground, setForeground] = useState(AppState.currentState === "active");
  useEffect(() => { const sub = AppState.addEventListener("change", state => setForeground(state === "active")); return () => sub.remove(); }, []);
  const Renderer = useMemo(() => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      return (require("./reacticx/EnergyOrbSkia.native") as { EnergyOrbSkia: ComponentType<ReacticxOrbProps> }).EnergyOrbSkia;
    } catch { return null; }
  }, []);
  const presentation = { ...props, active: props.active && foreground };
  const fallback = <EnergyOrb {...presentation} />;
  return Renderer ? <ShaderBoundary fallback={fallback}><View testID="orb-reacticx-skia"><Renderer {...presentation} /></View></ShaderBoundary> : fallback;
}
