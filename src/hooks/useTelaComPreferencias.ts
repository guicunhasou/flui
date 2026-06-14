import { useMemo } from "react";
import {
  ImageStyle,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from "react-native";

import { useAppPreferences } from "../context/PreferencesContext";
import type { AppTheme } from "../theme/appTheme";
import { scaleFontSize } from "../theme/appTheme";

type EstiloBase = ViewStyle | TextStyle | ImageStyle;
type MapaDeEstilos = Record<string, unknown>;
type MapaDeCores = Record<string, string>;

const propriedadesDeCor = new Set([
  "backgroundColor",
  "borderColor",
  "borderTopColor",
  "borderRightColor",
  "borderBottomColor",
  "borderLeftColor",
  "color",
  "shadowColor",
  "tintColor",
  "textDecorationColor",
]);

const valoresClaros = {
  background: new Set(["#F7F4EC", "#F3F8F4", "#F8F6FF"]),
  surface: new Set(["#FFFFFF", "#FCFEFA", "#FAF8FF"]),
  text: new Set(["#10162F", "#10221E", "#17142A", "#383354"]),
  textMuted: new Set(["#4F5878", "#3F554F", "#5F6078"]),
  textLight: new Set(["#63766F", "#7C829A", "#7C8C86", "#8FA19B"]),
  primary: new Set(["#2B0055", "#230044", "#3A0EC6", "#2166F3"]),
  primarySoft: new Set([
    "#EFE7FF",
    "#EEE9FF",
    "#EAF1FF",
    "#EEF7F1",
    "#E8F5EE",
  ]),
  primarySoftStrong: new Set(["#E0D1FF", "#CFE8D9"]),
  border: new Set(["#ECE8DF", "#DDE8E3", "#C9C2DA", "#BBD0C7"]),
  shadow: new Set(["#1E1230", "#12302A", "#080A12"]),
  success: new Set(["#23B24B", "#1FA971", "#18A957"]),
  successSoft: new Set(["#DFF4D8", "#DDF6E8"]),
  yellow: new Set(["#FFF2C7"]),
  yellowDark: new Set(["#F3B512", "#F4B942", "#D99721"]),
  dangerSoft: new Set(["#FBE5E2"]),
  dangerBorder: new Set(["#C0392B", "#C94D45", "#D94343"]),
};

function normalizarCor(value: string) {
  return value.trim().toUpperCase();
}

function resolverCorPorValor(value: string, theme: AppTheme) {
  const color = normalizarCor(value);

  if (valoresClaros.background.has(color)) return theme.background;
  if (valoresClaros.surface.has(color)) return theme.surface;
  if (valoresClaros.text.has(color)) return theme.text;
  if (valoresClaros.textMuted.has(color)) return theme.textMuted;
  if (valoresClaros.textLight.has(color)) return theme.textLight;
  if (valoresClaros.primary.has(color)) return theme.primary;
  if (valoresClaros.primarySoft.has(color)) return theme.primarySoft;
  if (valoresClaros.primarySoftStrong.has(color)) {
    return theme.primarySoftStrong;
  }
  if (valoresClaros.border.has(color)) return theme.border;
  if (valoresClaros.shadow.has(color)) return theme.shadow;
  if (valoresClaros.success.has(color)) return theme.success;
  if (valoresClaros.successSoft.has(color)) return theme.successSoft;
  if (valoresClaros.yellow.has(color)) return theme.yellow;
  if (valoresClaros.yellowDark.has(color)) return theme.yellowDark;
  if (valoresClaros.dangerSoft.has(color)) return theme.dangerSoft;
  if (valoresClaros.dangerBorder.has(color)) return theme.dangerBorder;

  return value;
}

function resolverCorPorChave(key: string, value: string, theme: AppTheme) {
  switch (key) {
    case "background":
      return theme.background;
    case "surface":
    case "card":
      return theme.surface;
    case "white":
      return theme.onPrimary;
    case "text":
    case "textSoft":
      return theme.text;
    case "textMuted":
    case "textSecondary":
      return theme.textMuted;
    case "textLight":
      return theme.textLight;
    case "primary":
    case "primaryDark":
    case "primaryBright":
      return theme.primary;
    case "primaryLight":
    case "primarySoft":
    case "cardSoft":
    case "iconSoft":
      return theme.primarySoft;
    case "primarySoftStrong":
      return theme.primarySoftStrong;
    case "border":
    case "borderStrong":
      return theme.border;
    case "shadow":
      return theme.shadow;
    case "green":
    case "success":
      return theme.success;
    case "greenSoft":
    case "successLight":
    case "successSoft":
      return theme.successSoft;
    case "yellow":
    case "warning":
      return theme.yellowDark;
    case "warningLight":
      return theme.yellow;
    case "danger":
    case "dangerBorder":
      return theme.dangerBorder;
    case "dangerLight":
    case "dangerSoft":
      return theme.dangerSoft;
    default:
      return resolverCorPorValor(value, theme);
  }
}

function transformarEstilo(
  style: EstiloBase,
  theme: AppTheme,
  fontScale: number,
) {
  const nextStyle: Record<string, unknown> = {};

  Object.entries(style).forEach(([key, value]) => {
    if (typeof value === "string" && propriedadesDeCor.has(key)) {
      nextStyle[key] = resolverCorPorValor(value, theme);
      return;
    }

    if (
      typeof value === "number" &&
      (key === "fontSize" || key === "lineHeight")
    ) {
      nextStyle[key] = scaleFontSize(value, fontScale);
      return;
    }

    nextStyle[key] = value;
  });

  return nextStyle as EstiloBase;
}

function transformarMapaDeCores<Cores extends MapaDeCores>(
  colors: Cores | undefined,
  theme: AppTheme,
) {
  const nextColors: MapaDeCores = {
    background: theme.background,
    surface: theme.surface,
    card: theme.surface,
    white: theme.onPrimary,
    text: theme.text,
    textMuted: theme.textMuted,
    textLight: theme.textLight,
    primary: theme.primary,
    primaryDark: theme.primary,
    primaryBright: theme.primary,
    primarySoft: theme.primarySoft,
    primaryLight: theme.primarySoft,
    primarySoftStrong: theme.primarySoftStrong,
    border: theme.border,
    borderStrong: theme.border,
    green: theme.success,
    success: theme.success,
    greenSoft: theme.successSoft,
    successLight: theme.successSoft,
    successSoft: theme.successSoft,
    yellow: theme.yellowDark,
    yellowDark: theme.yellowDark,
    warning: theme.yellowDark,
    warningLight: theme.yellow,
    danger: theme.dangerBorder,
    dangerSoft: theme.dangerSoft,
    dangerBorder: theme.dangerBorder,
    shadow: theme.shadow,
  };

  Object.entries(colors ?? {}).forEach(([key, value]) => {
    nextColors[key] = resolverCorPorChave(key, value, theme);
  });

  return nextColors as Cores & AppTheme;
}

export function useTelaComPreferencias<
  Estilos extends MapaDeEstilos,
  Cores extends MapaDeCores = MapaDeCores,
>(baseStyles: Estilos, baseColors?: Cores) {
  const { appearanceMode, fontScale, theme } = useAppPreferences();

  const styles = useMemo(() => {
    const nextStyles = {} as Record<keyof Estilos, EstiloBase>;

    Object.keys(baseStyles).forEach((styleKey) => {
      const flattenedStyle = StyleSheet.flatten(
        baseStyles[styleKey] as EstiloBase,
      );

      nextStyles[styleKey as keyof Estilos] = transformarEstilo(
        flattenedStyle ?? {},
        theme,
        fontScale,
      );
    });

    return StyleSheet.create(nextStyles) as Estilos;
  }, [baseStyles, fontScale, theme]);

  const colors = useMemo(
    () => transformarMapaDeCores(baseColors, theme),
    [baseColors, theme],
  );

  return {
    styles,
    colors,
    theme,
    fontScale,
    appearanceMode,
    isDarkMode: appearanceMode === "dark",
  };
}
