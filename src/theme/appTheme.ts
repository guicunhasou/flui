import type { AppearanceMode, FontSizePreference } from "../types";

export const appThemes = {
  light: {
    background: "#F3F8F4",
    surface: "#FCFEFA",
    white: "#FCFEFA",

    text: "#10221E",
    textMuted: "#3F554F",
    textLight: "#63766F",

    primary: "#2B0055",
    primarySoft: "#EEF7F1",
    primarySoftStrong: "#CFE8D9",
    selectedCard: "#E8F5EE",
    onPrimary: "#FCFEFA",

    yellow: "#FFF2C7",
    yellowDark: "#F4B942",

    border: "#DDE8E3",
    shadow: "#12302A",

    dangerSoft: "#FBE5E2",
    dangerBorder: "#E9BAB5",

    success: "#1FA971",
    successSoft: "#DDF6E8",
  },

  dark: {
    background: "#0E1320",
    surface: "#171D2E",
    white: "#171D2E",

    text: "#F7FBF8",
    textMuted: "#C2D0CB",
    textLight: "#8FA19B",

    primary: "#D8C7FF",
    primarySoft: "#20332B",
    primarySoftStrong: "#2D4A3D",
    selectedCard: "#1F352C",
    onPrimary: "#0E1320",

    yellow: "#4A3D18",
    yellowDark: "#FFD35A",

    border: "#2E403A",
    shadow: "#080A12",

    dangerSoft: "#381F24",
    dangerBorder: "#66383A",

    success: "#7AE0A4",
    successSoft: "#203D32",
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