import type { AppTheme } from "../../theme/appTheme";

export type FluiaScreenTheme = Record<keyof AppTheme, string>;

// Paleta local da página FluIA; não modifica o tema das demais telas.
export function getFluiaScreenTheme(base: AppTheme, highContrast: boolean): FluiaScreenTheme {
  return {
    ...base,
    background: highContrast ? "#26004D" : "#2B0055",
    surface: highContrast ? "#26004D" : "#3B1766",
    text: "#FCFAFF",
    textMuted: highContrast ? "#FCFAFF" : "#D9C8EC",
    textLight: highContrast ? "#FCFAFF" : "#D9C8EC",
    primary: highContrast ? "#FFFFFF" : "#E3CDFF",
    onPrimary: "#2B0055",
    primarySoft: "#4A2476",
    primarySoftStrong: "#573182",
    selectedCard: "#4A2476",
    border: highContrast ? "#D6B5FF" : "#75518E",
  };
}
