import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Pressable,
  PressableProps,
  StyleProp,
  ViewStyle,
} from 'react-native';

type PressableScaleProps = PressableProps & {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  pressedScale?: number;
};

export default function PressableScale({
  children,
  style,
  pressedScale = 0.97,
  disabled,
  ...props
}: PressableScaleProps) {
  const scale = useRef(new Animated.Value(1)).current;

  function animateScale(toValue: number) {
    Animated.spring(scale, {
      toValue,
      speed: 28,
      bounciness: 4,
      useNativeDriver: true,
    }).start();
  }

  useEffect(() => {
    if (disabled) {
      scale.setValue(1);
    }
  }, [disabled, scale]);

  return (
    <Pressable
      {...props}
      disabled={disabled}
      onPressIn={(event) => {
        if (!disabled) {
          animateScale(pressedScale);
        }

        props.onPressIn?.(event);
      }}
      onPressOut={(event) => {
        animateScale(1);
        props.onPressOut?.(event);
      }}
    >
      <Animated.View style={[style, { transform: [{ scale }] }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}