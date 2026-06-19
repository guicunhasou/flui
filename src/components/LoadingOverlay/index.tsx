import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Text, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { useTelaComPreferencias } from '../../hooks/useTelaComPreferencias';
import { overlayColors, styles as baseStyles } from './styles';

const logoFluiFXml = `
<svg width="360" height="360" viewBox="-18 -16 744 548" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M706 14L702 11L694 9L660 6L659 5H649L648 4H637L636 3L606 2L605 1H582L581 0H524L523 1H505L504 2H491L490 3L464 5L428 11L407 16L372 27L367 30L355 34L308 58L269 84L212 128L181 148L155 161L120 174L92 181L55 187L19 188L17 189L14 193V202L12 209L11 222L2 268L0 273V278L3 281H67L69 283L55 309L49 324L43 345L40 362V395L42 407L49 430L62 454L69 463L86 480L106 494L124 503L138 508L171 515L200 516L201 515H212L231 512L265 501L281 493L295 484L305 476L324 457L336 441L348 419L357 393L361 368L360 336L356 317L350 300L342 285V282L343 281H410L412 280L415 276L426 236L428 233L430 224L440 197V192L435 188H305L304 187L305 184L314 173L337 151L367 131L403 115L442 104L477 98L507 96L508 95H526L527 94H578L579 95H600L601 96L628 97L639 99H654L658 96L670 78L706 29L708 25V18L706 14ZM228 287L240 292L252 300L262 310L271 324L276 338L278 348L277 371L271 390L258 411L242 427L222 439L206 444L193 446L173 445L159 441L143 432L132 422L123 409L119 400L115 385V362L120 343L126 331L136 317L147 306L163 295L182 287L197 284H214L228 287Z" fill="#2B0055"/>
</svg>
`;

type LoadingOverlayProps = {
  visible: boolean;
  message?: string;
};

export default function LoadingOverlay({
  visible,
  message = 'Carregando...',
}: LoadingOverlayProps) {
  const pulse = useRef(new Animated.Value(0)).current;
  const { styles, colors } = useTelaComPreferencias(baseStyles, overlayColors);

  useEffect(() => {
    if (!visible) {
      return undefined;
    }

    pulse.setValue(0);

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 720,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 720,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [pulse, visible]);

  if (!visible) {
    return null;
  }

  const haloOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.28, 0.58],
  });

  const haloScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.88, 1.18],
  });

  const coreScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.96, 1.06],
  });

  const themedLogoFluiFXml = logoFluiFXml.replace(
    'fill="#2B0055"',
    `fill="${colors.primary}"`,
  );

  return (
    <View
      accessibilityRole="alert"
      accessibilityLabel={message}
      accessibilityLiveRegion="polite"
      accessibilityViewIsModal
      style={styles.overlay}
      pointerEvents="auto"
    >
      <View style={styles.card}>
        <View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={styles.loader}
        >
          <Animated.View
            style={[
              styles.loaderHalo,
              { opacity: haloOpacity, transform: [{ scale: haloScale }] },
            ]}
          />

          <Animated.View
            style={[styles.loaderCore, { transform: [{ scale: coreScale }] }]}
          >
            <SvgXml xml={themedLogoFluiFXml} width={22} height={16} />
          </Animated.View>
        </View>

        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
}
