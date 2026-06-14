import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StatusBar, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, type Href } from 'expo-router';
import { SvgXml } from 'react-native-svg';

import baseStyles, { colors as baseColors } from './styles';
import { useTelaComPreferencias } from '../../hooks/useTelaComPreferencias';

const logoFluiXml = `
<svg width="1115" height="516" viewBox="0 0 1115 516" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M706 14L702 11L694 9L660 6L659 5H649L648 4H637L636 3L606 2L605 1H582L581 0H524L523 1H505L504 2H491L490 3L464 5L428 11L407 16L372 27L367 30L355 34L308 58L269 84L212 128L181 148L155 161L120 174L92 181L55 187L19 188L17 189L14 193V202L12 209L11 222L2 268L0 273V278L3 281H67L69 283L55 309L49 324L43 345L40 362V395L42 407L49 430L62 454L69 463L86 480L106 494L124 503L138 508L171 515L200 516L201 515H212L231 512L265 501L281 493L295 484L305 476L324 457L336 441L348 419L357 393L361 368L360 336L356 317L350 300L342 285V282L343 281H410L412 280L415 276L426 236L428 233L430 224L440 197V192L435 188H305L304 187L305 184L314 173L337 151L367 131L403 115L442 104L477 98L507 96L508 95H526L527 94H578L579 95H600L601 96L628 97L639 99H654L658 96L670 78L706 29L708 25V18L706 14ZM425 436L426 437V452L430 472L434 482L444 496L456 505L469 510L480 512L506 511L523 506L536 500L560 483L583 460L592 448L594 449V457L597 471L604 486L612 496L623 504L638 510L649 512H667L683 508L692 504L705 495L727 473L751 439L765 415L766 416L765 420V449L767 462L773 481L779 491L788 500L805 509L821 512H838L853 509L871 501L883 493L897 481L928 445L929 446V456L931 468L934 477L943 493L953 502L964 508L980 512H1000L1014 509L1034 500L1048 490L1066 473L1076 461L1088 444L1100 423L1115 387L1114 379L1111 376L1105 375L1102 377L1090 399L1076 421L1054 448L1043 458L1032 464H1025L1020 459L1018 453V443L1025 413L1048 350L1093 241V231L1085 223L1071 218L1050 215H1033L1032 216L1018 217L1009 220L1000 225L991 234L984 247L963 303L943 362L933 397L917 422L906 436L884 457L870 464H863L857 460L854 451L855 435L859 419L875 374L903 306L925 258L926 250L924 245L918 240L908 237L893 236L892 235H859L841 239L828 246L817 257L810 267L796 298L774 356L740 417L727 436L708 457L699 463L691 464L685 459L683 454V440L687 420L715 341L745 267L752 253V244L748 238L741 234L723 230L677 229L661 233L653 237L647 242L638 254L634 263L611 334L610 341L602 367L594 408L574 433L556 450L545 458L535 463L520 464L513 457L512 445L515 428L523 399L540 350L570 274L571 269L618 155L619 144L616 140L612 138H513L509 140L505 149L501 163L497 171L495 179L473 237L447 316L431 380L426 414L425 436ZM228 287L240 292L252 300L262 310L271 324L276 338L278 348L277 371L271 390L258 411L242 427L222 439L206 444L193 446L173 445L159 441L143 432L132 422L123 409L119 400L115 385V362L120 343L126 331L136 317L147 306L163 295L182 287L197 284H214L228 287Z" fill="#F7F4EC"/>
  <path d="M1064.4 192C1091.74 192 1113.9 169.838 1113.9 142.5C1113.9 115.162 1091.74 93 1064.4 93C1037.06 93 1014.9 115.162 1014.9 142.5C1014.9 169.838 1037.06 192 1064.4 192Z" fill="#F7F4EC"/>
</svg>
`;

const SPLASH_DURATION = 2800;

export default function SplashScreen() {
  const { styles, isDarkMode } = useTelaComPreferencias(
    baseStyles,
    baseColors,
  );
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.94)).current;

  useEffect(() => {
    const route = '/map' as Href;

    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 350,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),

      Animated.sequence([
        Animated.timing(logoScale, {
          toValue: 1.5,
          duration: SPLASH_DURATION / 2,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 1,
          duration: SPLASH_DURATION / 2,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),

    ]).start(({ finished }) => {
      if (finished) {
        router.replace(route);
      }
    });

    return () => {
      logoOpacity.stopAnimation();
      logoScale.stopAnimation();
    };
  }, [logoOpacity, logoScale]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

      <View style={styles.screen}>
        <Animated.View
          style={[
            styles.logoWrapper,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <SvgXml xml={logoFluiXml} width={164} height={76} />
        </Animated.View>

      </View>
    </SafeAreaView>
  );
}