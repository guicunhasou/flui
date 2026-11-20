import type { AppearanceMode, FontSizePreference } from "../types";

export const appThemes = {
  light: {
    background: "#F3F8F4",
    surface: "#FCFEFA",
    white: "#FCFEFA",

    text: "#10221E",
    textMuted: "#3F554F",
    textLight: "#5B6E67",

    primary: "#2B0055",
    primarySoft: "#EEF7F1",
    primarySoftStrong: "#CFE8D9",
    selectedCard: "#E8F5EE",
    onPrimary: "#FCFEFA",

    yellow: "#FFF2C7",
    yellowDark: "#F4B942",
    warningText: "#805500",
    dangerText: "#AD352D",

    border: "#DDE8E3",
    shadow: "#12302A",

    dangerSoft: "#FBE5E2",
    dangerBorder: "#E9BAB5",

    success: "#137A50",
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
    warningText: "#FFD35A",
    dangerText: "#FFAAA2",

    border: "#2E403A",
    shadow: "#080A12",

    dangerSoft: "#381F24",
    dangerBorder: "#66383A",

    success: "#7AE0A4",
    successSoft: "#203D32",
  },
} as const;

// A preferência de contraste é independente do tema e do tamanho da fonte.
// Os mesmos tokens atendem às telas existentes, sem uma segunda árvore de estilos.
export const highContrastThemes = {
  light: {
    background: "#FFFFFF",
    surface: "#FFFFFF",
    white: "#FFFFFF",
    text: "#000000",
    textMuted: "#1F1F1F",
    textLight: "#333333",
    primary: "#26004D",
    primarySoft: "#F3EDF9",
    primarySoftStrong: "#E4D9EF",
    selectedCard: "#F3EDF9",
    onPrimary: "#FFFFFF",
    yellow: "#FFF0B3",
    yellowDark: "#704100",
    warningText: "#633B00",
    dangerText: "#870C0C",
    border: "#595959",
    shadow: "#000000",
    dangerSoft: "#FFF0F0",
    dangerBorder: "#870C0C",
    success: "#005C30",
    successSoft: "#E8F7EE",
  },
  dark: {
    background: "#000000",
    surface: "#000000",
    white: "#000000",
    text: "#FFFFFF",
    textMuted: "#F0F0F0",
    textLight: "#D9D9D9",
    primary: "#E6D5FF",
    primarySoft: "#190C29",
    primarySoftStrong: "#2F174A",
    selectedCard: "#190C29",
    onPrimary: "#000000",
    yellow: "#261B00",
    yellowDark: "#FFDD66",
    warningText: "#FFE599",
    dangerText: "#FFD1D1",
    border: "#BFBFBF",
    shadow: "#000000",
    dangerSoft: "#290A0A",
    dangerBorder: "#FFB3B3",
    success: "#8CFFC1",
    successSoft: "#002B16",
  },
} as const satisfies Record<AppearanceMode, Record<keyof typeof appThemes.light, string>>;

export type AppTheme =
  | (typeof appThemes)[AppearanceMode]
  | (typeof highContrastThemes)[AppearanceMode];

export const fontScales: Record<FontSizePreference, number> = {
  small: 1,
  default: 1.1,
  large: 1.25,
};

export function getAppTheme(appearanceMode: AppearanceMode, highContrast = false) {
  return highContrast ? highContrastThemes[appearanceMode] : appThemes[appearanceMode];
}

export function getFontScale(fontSize: FontSizePreference) {
  return fontScales[fontSize];
}

export function scaleFontSize(size: number, scale: number) {
  return Math.round(size * scale);
}
