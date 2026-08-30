import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Pressable,
  PressableProps,
  StyleProp,
  ViewStyle,
} from 'react-native';
import * as Haptics from 'expo-haptics';

import { triggerImpact } from '../../utils/interaction';

type PressableScaleProps = PressableProps & {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  pressedScale?: number;
  hoverScale?: number;
  pressedOpacity?: number;
  haptics?: boolean;
  hapticStyle?: Haptics.ImpactFeedbackStyle;
};

export default function PressableScale({
  children,
  style,
  pressedScale = 0.97,
  hoverScale = 1.015,
  pressedOpacity = 0.88,
  haptics = true,
  hapticStyle = Haptics.ImpactFeedbackStyle.Light,
  disabled,
  ...props
}: PressableScaleProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const isHoveredRef = useRef(false);
  const isPressedRef = useRef(false);

  function animateTo(targetScale: number, targetOpacity: number) {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: targetScale,
        speed: 28,
        bounciness: 4,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: targetOpacity,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
  }

  function syncVisualState() {
    if (isPressedRef.current) {
      animateTo(pressedScale, pressedOpacity);
      return;
    }

    if (isHoveredRef.current) {
      animateTo(hoverScale, 1);
      return;
    }

    animateTo(1, 1);
  }

  useEffect(() => {
    if (disabled) {
      isHoveredRef.current = false;
      isPressedRef.current = false;
      scale.setValue(1);
      opacity.setValue(1);
    }
  }, [disabled, opacity, scale]);

  return (
    <Pressable
      {...props}
      disabled={disabled}
      onHoverIn={(event) => {
        if (!disabled) {
          isHoveredRef.current = true;
          syncVisualState();
        }

        props.onHoverIn?.(event);
      }}
      onHoverOut={(event) => {
        isHoveredRef.current = false;
        syncVisualState();
        props.onHoverOut?.(event);
      }}
      onPressIn={(event) => {
        if (!disabled) {
          isPressedRef.current = true;
          syncVisualState();

          if (haptics) {
            triggerImpact(hapticStyle);
          }
        }

        props.onPressIn?.(event);
      }}
      onPressOut={(event) => {
        isPressedRef.current = false;
        syncVisualState();
        props.onPressOut?.(event);
      }}
    >
      <Animated.View style={[style, { transform: [{ scale }], opacity }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}
