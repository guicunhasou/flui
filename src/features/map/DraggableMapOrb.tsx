import React, { useEffect, useMemo, useRef } from "react";
import { Animated, Easing, PanResponder, StyleSheet, View } from "react-native";
import { PressableScale } from "../../components";
import { MapEnergyOrb } from "../assistant/MapEnergyOrb";
import { clampOrbPosition, getDefaultOrbPosition, getOrbDragLayout, resolveOrbPosition, shouldResetOrbAfterThrow, shouldStartOrbDrag, type OrbOrigin, type OrbPosition } from "./mapExperimentLayout";

type Props = {
  width: number; height: number; bottomInset: number;
  position: OrbPosition | null; onPositionChange: (position: OrbPosition) => void;
  onOpen: (origin: OrbOrigin) => void; active: boolean; reducedMotion: boolean;
};

export function DraggableMapOrb({ width, height, bottomInset, position, onPositionChange, onOpen, active, reducedMotion }: Props) {
  const layout = useMemo(() => getOrbDragLayout(width, height, bottomInset), [width, height, bottomInset]);
  const initial = resolveOrbPosition(position ?? getDefaultOrbPosition(layout), layout);
  const translation = useRef(new Animated.ValueXY(initial)).current;
  const viewRef = useRef<View>(null);
  const current = useRef(initial);
  const start = useRef(initial);
  const dragged = useRef(false);

  useEffect(() => {
    const id = translation.addListener(value => { current.current = value; });
    return () => { translation.stopAnimation(); translation.removeListener(id); };
  }, [translation]);

  useEffect(() => {
    const next = resolveOrbPosition(position ?? getDefaultOrbPosition(layout), layout);
    current.current = next;
    translation.setValue(next);
    if (!position || position.x !== next.x || position.y !== next.y) onPositionChange(next);
  }, [layout, onPositionChange, position, translation]);

  const responder = useMemo(() => {
    const finish = (reset = false) => {
      const next = reset ? getDefaultOrbPosition(layout) : resolveOrbPosition(current.current, layout);
      if (reset && !reducedMotion) {
        Animated.timing(translation, { toValue: next, duration: 240, easing: Easing.out(Easing.cubic), useNativeDriver: false })
          .start(({ finished }) => { if (finished) onPositionChange(next); });
      } else {
        current.current = next;
        translation.setValue(next);
        onPositionChange(next);
      }
    };
    return PanResponder.create({
      onMoveShouldSetPanResponderCapture: (_, gesture) => shouldStartOrbDrag(gesture.dx, gesture.dy),
      onPanResponderGrant: () => { translation.stopAnimation(); dragged.current = true; start.current = current.current; },
      onPanResponderMove: (_, gesture) => {
        const next = clampOrbPosition({ x: start.current.x + gesture.dx, y: start.current.y + gesture.dy }, layout);
        current.current = next;
        translation.setValue(next);
      },
      onPanResponderRelease: (_, gesture) => finish(shouldResetOrbAfterThrow(gesture.dx, gesture.dy, gesture.vx, gesture.vy)),
      onPanResponderTerminate: () => finish(),
      onPanResponderTerminationRequest: () => false,
      onShouldBlockNativeResponder: () => true,
    });
  }, [layout, onPositionChange, reducedMotion, translation]);

  const open = () => {
    translation.stopAnimation();
    onPositionChange(current.current);
    viewRef.current?.measureInWindow((x, y, measuredWidth, measuredHeight) => {
      onOpen({ x: x + measuredWidth / 2, y: y + measuredHeight / 2, size: measuredWidth });
    });
  };
  const moveAccessible = (dx: number, dy: number) => {
    const next = resolveOrbPosition({ x: current.current.x + dx, y: current.current.y + dy }, layout);
    current.current = next;
    translation.setValue(next);
    onPositionChange(next);
  };

  return <Animated.View ref={viewRef} collapsable={false} testID="orb-arrastavel" {...responder.panHandlers}
    style={[styles.anchor, { width: layout.size, height: layout.size, transform: translation.getTranslateTransform() }]}>
    <PressableScale testID="orb-abrir" accessibilityRole="button" accessibilityLabel="Abrir assistente Flui IA"
      accessibilityHint="Toque para abrir. Arraste para reposicionar. Um arraste longo e rápido retorna à posição inicial. Ações de acessibilidade também permitem mover a Orb."
      accessibilityActions={[
        { name: "activate", label: "Abrir FluIA" },
        { name: "moveUp", label: "Mover para cima" }, { name: "moveDown", label: "Mover para baixo" },
        { name: "moveLeft", label: "Mover para a esquerda" }, { name: "moveRight", label: "Mover para a direita" },
        { name: "resetPosition", label: "Voltar à posição inicial" },
      ]}
      onAccessibilityAction={event => {
        switch (event.nativeEvent.actionName) {
          case "activate": open(); break;
          case "moveUp": moveAccessible(0, -40); break;
          case "moveDown": moveAccessible(0, 40); break;
          case "moveLeft": moveAccessible(-40, 0); break;
          case "moveRight": moveAccessible(40, 0); break;
          case "resetPosition": {
            const home = getDefaultOrbPosition(layout);
            current.current = home; translation.setValue(home); onPositionChange(home); break;
          }
        }
      }}
      pressedScale={0.96} onPressIn={() => { dragged.current = false; }}
      onPress={() => { if (!dragged.current) open(); }}
      style={{ width: layout.size, height: layout.size, borderRadius: layout.size / 2, overflow: "hidden" }}>
      <MapEnergyOrb mapVariant state="repouso" size={layout.size} active={active} reducedMotion={reducedMotion} />
    </PressableScale>
  </Animated.View>;
}

const styles = StyleSheet.create({ anchor: { position: "absolute", left: 0, top: 0, zIndex: 16 } });
