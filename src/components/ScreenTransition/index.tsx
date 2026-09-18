import React, { useEffect, useRef } from 'react';
import { Animated, StyleProp, ViewStyle } from 'react-native';

import { useReducedMotion } from '../../hooks/useReducedMotion';

type ScreenTransitionProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  delay?: number;
  distance?: number;
};

export default function ScreenTransition({
  children,
  style,
  delay = 0,
  distance = 10,
}: ScreenTransitionProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(distance)).current;
  const reduceMotionEnabled = useReducedMotion();

  useEffect(() => {
    opacity.stopAnimation();
    translateY.stopAnimation();

    if (reduceMotionEnabled) {
      opacity.setValue(1);
      translateY.setValue(0);
      return undefined;
    }

    const animation = Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 220,
        delay,
        useNativeDriver: true,
      }),
    ]);

    animation.start();

    return () => animation.stop();
  }, [delay, distance, opacity, reduceMotionEnabled, translateY]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}
