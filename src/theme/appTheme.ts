import type { AppearanceMode, FontSizePreference } from "../types";

export const appThemes = {
  light: {
    background: "#F7F4EC",
    surface: "#FFFFFF",
    white: "#FFFFFF",

    text: "#10162F",
    textMuted: "#4F5878",
    textLight: "#7C829A",

    primary: "#2B0055",
    primarySoft: "#EFE7FF",
    primarySoftStrong: "#E0D1FF",
    selectedCard: "#EFE7FF",
    onPrimary: "#FFFFFF",

    yellow: "#FFF4CC",
    yellowDark: "#F3B512",

    border: "#ECE8DF",
    shadow: "#1E1230",

    dangerSoft: "#FFF0F0",
    dangerBorder: "#F5D5D5",

    success: "#23B24B",
    successSoft: "#EAF8EF",
  },

  dark: {
    background: "#100D1D",
    surface: "#1B1730",
    white: "#1B1730",

    text: "#FFFDF8",
    textMuted: "#C6BEDA",
    textLight: "#958BAD",

    primary: "#D8C7FF",
    primarySoft: "#302452",
    primarySoftStrong: "#43306F",
    selectedCard: "#2A2147",
    onPrimary: "#100D1D",

    yellow: "#4A3B18",
    yellowDark: "#FFD35A",

    border: "#3A3158",
    shadow: "#000000",

    dangerSoft: "#351C2A",
    dangerBorder: "#5A2A3E",

    success: "#6DE08E",
    successSoft: "#203D2D",
  },
} as const;

export type AppTheme = (typeof appThemes)[AppearanceMode];

export const fontScales: Record<FontSizePreference, number> = {
  small: 0.94,
  default: 1,
  large: 1.1,
};

export function getAppTheme(appearanceMode: AppearanceMode) {
  return appThemes[appearanceMode];
}

export function getFontScale(fontSize: FontSizePreference) {
  return fontScales[fontSize];
}

export function scaleFontSize(size: number, scale: number) {
  return Math.round(size * scale);
}