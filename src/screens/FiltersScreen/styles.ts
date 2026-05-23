import { StyleSheet } from "react-native";

import { colors } from "../../theme/colors";
import { radius } from "../../theme/radius";
import { shadows } from "../../theme/shadows";
import { spacing } from "../../theme/spacing";
import { typography } from "../../theme/typography";

export const styles = StyleSheet.create({
  content: {
    flex: 1,
  },

  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    ...typography.title,
    color: colors.primaryDark,
    fontSize: 42,
    lineHeight: 48,
    letterSpacing: 1,
  },

  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.soft,
  },

  closeButtonText: {
    color: colors.primaryDark,
    fontSize: 28,
    lineHeight: 30,
    fontWeight: typography.weights.regular,
  },

  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 112,
  },

  filterCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    ...shadows.soft,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },

  sectionIcon: {
    width: 28,
    color: colors.primaryDark,
    fontSize: 23,
    fontWeight: typography.weights.medium,
    marginRight: spacing.sm,
  },

  sectionTitle: {
    color: colors.text,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },

  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },

  chip: {
    minHeight: 52,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.md,
  },

  smallChip: {
    flex: 1,
    minWidth: 86,
  },

  mediumChip: {
    minWidth: 128,
    flex: 1,
  },

  largeChip: {
    flex: 1,
    minWidth: 190,
  },

  selectedChip: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primaryDark,
  },

  pressedChip: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  },

  chipIcon: {
    color: colors.text,
    fontSize: 21,
    fontWeight: typography.weights.semibold,
    marginRight: spacing.sm,
  },

  chipText: {
    color: colors.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
  },

  selectedChipText: {
    color: colors.white,
  },

  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xs,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },

  clearButton: {
    minHeight: 54,
    flex: 0.8,
    borderRadius: radius.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  clearButtonIcon: {
    color: colors.primaryDark,
    fontSize: 21,
    fontWeight: typography.weights.medium,
    marginRight: spacing.xs,
  },

  clearButtonText: {
    color: colors.primaryDark,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
  },

  applyButton: {
    minHeight: 56,
    flex: 1.2,
    borderRadius: radius.lg,
    backgroundColor: colors.primaryDark,
    alignItems: "center",
    justifyContent: "center",
  },

  applyButtonText: {
    color: colors.white,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
  },

  buttonPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.97 }],
  },

  primaryButtonPressed: {
    opacity: 0.86,
    transform: [{ scale: 0.98 }],
  },
});
