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
      paddingTop: spacing.md,
      backgroundColor: theme.background,
    },

    header: {
      minHeight: 170,
      paddingHorizontal: spacing.xl,
      paddingTop: spacing.sm,
      alignItems: "center",
      justifyContent: "center",
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

    skipButtonAnchor: {
      position: "absolute",
      top: spacing.sm,
      right: spacing.xl,
      zIndex: 5,
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

    carouselContent: {
      paddingHorizontal: spacing.xl,
      paddingTop: spacing.md,
      paddingBottom: spacing.md,
    },

    slide: {
      width: cardWidth,
      paddingRight: spacing.md,
      alignItems: "center",
      gap: spacing.xl,
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

    featureIconBubble: {
      width: 64,
      height: 64,
      marginBottom: spacing.md,
      borderRadius: 32,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.primarySoft,
      borderWidth: 1,
      borderColor: theme.border,
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
      gap: spacing.lg,
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
