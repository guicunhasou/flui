import React, { Component, useEffect, useState, type ComponentType, type ReactNode } from "react";
import { Image, View } from "react-native";
import { LoadSkiaWeb } from "@shopify/react-native-skia/lib/module/web";
import type { ReacticxOrbProps } from "./MapEnergyOrb.types";
import { getFluiaVisualStatus } from "./fluiaVisualStatus";

let renderer: ComponentType<ReacticxOrbProps> | null = null;
let loading: Promise<ComponentType<ReacticxOrbProps>> | null = null;

function loadRenderer() {
  loading ??= LoadSkiaWeb({ locateFile: () => "/canvaskit.wasm" }).then(async () => {
    // Mesmo shader, paletas e relógio da #103. A extensão é intencional:
    // só importar o renderer depois de o CanvasKit local estar pronto.
    renderer = (await import("./reacticx/EnergyOrbSkia.native")).EnergyOrbSkia;
    return renderer;
  });
  return loading;
}

class OrbBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { console.warn("FluIA: animação indisponível; imagem do mesmo shader preservada."); }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

export function MapEnergyOrb(props: ReacticxOrbProps) {
  // SSR e primeira hidratação mostram a mesma imagem, sem iniciar WebAssembly.
  const [Renderer, setRenderer] = useState<ComponentType<ReacticxOrbProps> | null>(null);
  const [foreground, setForeground] = useState(true);
  useEffect(() => {
    let mounted = true;
    const onVisibility = () => setForeground(document.visibilityState === "visible");
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    if (renderer) setRenderer(() => renderer);
    else void loadRenderer().then((component) => {
      if (mounted) setRenderer(() => component);
    }).catch(() => {
      console.warn("FluIA: animação indisponível; imagem do mesmo shader preservada.");
    });
    return () => { mounted = false; document.removeEventListener("visibilitychange", onVisibility); };
  }, []);

  const status = props.visualStatus ?? getFluiaVisualStatus(props.state, "connected");
  const fallback = <Image source={{ uri: `/vendor/fluia-orb-${status}.png` }} style={{ width: props.size, height: props.size }} accessible={false} />;
  return <View testID="orb-web-shader" accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ width: props.size, height: props.size }}>
    {Renderer ? <OrbBoundary fallback={fallback}><Renderer {...props} active={props.active && foreground} /></OrbBoundary> : fallback}
  </View>;
}
