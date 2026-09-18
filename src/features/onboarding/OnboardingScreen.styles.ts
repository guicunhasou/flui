import { StyleSheet } from "react-native";

import { radius, shadows, spacing } from "../../theme";
import type { AppTheme } from "../../theme/appTheme";
import { scaleFontSize } from "../../theme/appTheme";

export function createOnboardingStyles(
  theme: AppTheme,
  fontScale: number,
  width: number,
) {
  const cardWidth = Math.max(width - 48, 280);

  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.background,
    },

    screen: {
      flex: 1,
      backgroundColor: theme.background,
    },

    topBar: {
      minHeight: 48,
      paddingHorizontal: spacing.xl,
      alignItems: "flex-end",
      justifyContent: "center",
    },

    header: {
      minHeight: 102,
      paddingHorizontal: spacing.xl,
      paddingBottom: spacing.lg,
      alignItems: "center",
      justifyContent: "flex-end",
    },

    eyebrow: {
      color: theme.primary,
      fontSize: scaleFontSize(12, fontScale),
      lineHeight: scaleFontSize(16, fontScale),
      fontWeight: "800",
      letterSpacing: 0.8,
      textAlign: "center",
      textTransform: "uppercase",
    },

    title: {
      maxWidth: 330,
      marginTop: spacing.xs,
      color: theme.text,
      fontSize: scaleFontSize(31, fontScale),
      lineHeight: scaleFontSize(37, fontScale),
      fontWeight: "900",
      letterSpacing: -0.7,
      textAlign: "center",
    },

    skipButton: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: radius.pill,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.surface,
    },

    skipButtonText: {
      color: theme.textMuted,
      fontSize: scaleFontSize(13, fontScale),
      lineHeight: scaleFontSize(18, fontScale),
      fontWeight: "800",
    },

    carousel: {
      flex: 1,
    },

    carouselContent: {
      paddingHorizontal: spacing.xl,
      alignItems: "center",
    },

    slide: {
      width: cardWidth,
      paddingRight: spacing.md,
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.md,
    },

    visualCard: {
      width: "100%",
      aspectRatio: 4 / 3,
      borderRadius: radius.xl,
      overflow: "hidden",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.primary,
      borderWidth: 1,
      borderColor: theme.primarySoftStrong,
      ...shadows.medium,
    },

    visualImage: {
      width: "100%",
      height: "100%",
    },

    copyContent: {
      alignItems: "center",
      paddingHorizontal: spacing.sm,
    },

    stepTitle: {
      color: theme.text,
      fontSize: scaleFontSize(24, fontScale),
      lineHeight: scaleFontSize(30, fontScale),
      fontWeight: "900",
      letterSpacing: -0.4,
      textAlign: "center",
    },

    stepDescription: {
      maxWidth: 330,
      marginTop: spacing.sm,
      color: theme.textMuted,
      fontSize: scaleFontSize(15, fontScale),
      lineHeight: scaleFontSize(23, fontScale),
      fontWeight: "600",
      textAlign: "center",
    },

    footer: {
      paddingHorizontal: spacing.xl,
      paddingBottom: spacing.xl,
      paddingTop: spacing.lg,
      gap: spacing.md,
    },

    dotsRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.xs,
    },

    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.border,
    },

    dotActive: {
      width: 26,
      backgroundColor: theme.primary,
    },

    primaryButton: {
      minHeight: 56,
      borderRadius: radius.pill,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.primary,
      ...shadows.soft,
    },

    primaryButtonText: {
      color: theme.onPrimary,
      fontSize: scaleFontSize(16, fontScale),
      lineHeight: scaleFontSize(22, fontScale),
      fontWeight: "900",
    },
  });
}
