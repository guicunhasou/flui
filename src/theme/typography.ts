import { Platform } from "react-native";

export const typography = {
  title: {
    fontFamily: Platform.select({
      ios: "Georgia",
      android: "serif",
      default: "serif",
    }),
    fontWeight: "700" as const,
  },

  body: {
    fontFamily: Platform.select({
      ios: "System",
      android: "sans-serif",
      default: "System",
    }),
  },

  weights: {
    regular: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
  },

  sizes: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 18,
    xl: 24,
    xxl: 38,
  },

  lineHeights: {
    sm: 18,
    md: 22,
    lg: 26,
    xl: 34,
    xxl: 46,
  },
};