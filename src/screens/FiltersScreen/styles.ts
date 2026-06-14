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
    alignItems: "flex-start",
    justifyContent: "space-between",
  },

  titleGroup: {
    flex: 1,
    paddingRight: spacing.lg,
  },

  eyebrow: {
    color: colors.primary,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    letterSpacing: 1.4,
    marginBottom: spacing.xs,
    textTransform: "uppercase",
  },

  title: {
    ...typography.title,
    color: colors.primaryDark,
    fontSize: 34,
    lineHeight: 38,
    letterSpacing: 0.4,
  },

  subtitle: {
    color: colors.textMuted,
    fontSize: typography.sizes.md,
    lineHeight: 21,
    marginTop: spacing.xs,
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

  searchCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    ...shadows.soft,
  },

  searchInputBox: {
    minHeight: 56,
    borderRadius: radius.lg,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
  },

  searchIcon: {
    color: colors.primaryDark,
    fontSize: 24,
    fontWeight: typography.weights.bold,
    marginRight: spacing.sm,
  },

  searchIconSvg: {
    marginRight: spacing.sm,
  },

  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    paddingVertical: spacing.sm,
  },

  searchClearButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: spacing.sm,
  },

  searchClearText: {
    color: colors.primaryDark,
    fontSize: 22,
    lineHeight: 24,
    fontWeight: typography.weights.medium,
  },

  quickSearchLabel: {
    color: colors.textMuted,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },

  quickSearchRow: {
    flexDirection: "row",
    gap: spacing.sm,
    paddingRight: spacing.md,
  },

  quickSearchChip: {
    minHeight: 40,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.md,
  },

  quickSearchChipSelected: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primaryDark,
  },

  quickSearchChipText: {
    color: colors.text,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
  },

  quickSearchChipTextSelected: {
    color: colors.white,
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

  sectionIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
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

  chipIconSvg: {
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

  resultsCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    ...shadows.soft,
  },

  resultsHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },

  resultsEyebrow: {
    color: colors.primary,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    letterSpacing: 1.1,
    marginBottom: spacing.xs,
    textTransform: "uppercase",
  },

  resultsTitle: {
    color: colors.text,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },

  resultsCount: {
    color: colors.textMuted,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
  },

  resultItem: {
    minHeight: 82,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    marginTop: spacing.sm,
  },

  resultItemPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },

  resultIconBox: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },

  resultIcon: {
    color: colors.primaryDark,
    fontSize: 22,
    fontWeight: typography.weights.bold,
  },

  resultContent: {
    flex: 1,
  },

  resultName: {
    color: colors.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    marginBottom: 3,
  },

  resultAddress: {
    color: colors.textMuted,
    fontSize: typography.sizes.sm,
    lineHeight: 18,
  },

  resultStatus: {
    color: colors.primaryDark,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    marginTop: 3,
  },

  resultArrow: {
    color: colors.primaryDark,
    fontSize: 30,
    lineHeight: 32,
    marginLeft: spacing.sm,
  },

  emptyResultsCard: {
    borderRadius: radius.md,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginTop: spacing.sm,
  },

  emptyResultsTitle: {
    color: colors.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.xs,
  },

  emptyResultsText: {
    color: colors.textMuted,
    fontSize: typography.sizes.sm,
    lineHeight: 19,
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

  clearButtonIconSvg: {
    marginRight: spacing.xs,
  },

  clearButtonText: {
    color: colors.primaryDark,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
  },

  applyButton: {
    minHeight: 56,
    flex: 1.45,
    borderRadius: radius.lg,
    backgroundColor: colors.primaryDark,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
  },

  applyButtonText: {
    color: colors.white,
    fontSize: typography.sizes.md,
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
