import { StyleSheet } from "react-native";

import { colors } from "../../theme/colors";
import { radius } from "../../theme/radius";
import { shadows } from "../../theme/shadows";
import { spacing } from "../../theme/spacing";
import { typography } from "../../theme/typography";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    flex: 1,
  },

  header: {
    minHeight: 58,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xs,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
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

  headerTitle: {
    flex: 1,
    minWidth: 0,
    textAlign: "center",
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.25,
  },

  headerSpacer: {
    width: 44,
    height: 44,
  },

  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 140,
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    ...shadows.soft,
  },

  routeField: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 48,
  },

  routeFieldPressed: {
    opacity: 0.75,
  },

  routeDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  },

  routeDotWrap: {
    width: 28,
    alignItems: "center",
  },

  routeDotOrigin: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.success,
  },

  routeFieldText: {
    flex: 1,
    marginLeft: spacing.sm,
  },

  routeFieldLabel: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },

  routeFieldValue: {
    color: colors.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    marginTop: 2,
  },

  autonomyRow: {
    flexDirection: "row",
    gap: spacing.md,
  },

  stackedRow: {
    flexDirection: "column",
    alignItems: "stretch",
    gap: spacing.md,
  },

  autonomyTile: {
    flexGrow: 1,
    flexBasis: "auto",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderRadius: radius.md,
    padding: spacing.md,
  },

  autonomyIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
  },

  autonomyTextGroup: {
    flex: 1,
    minWidth: 0,
  },

  autonomyLabel: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
  },

  autonomyValue: {
    color: colors.text,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    marginTop: 2,
  },

  batteryBarTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.border,
    marginTop: spacing.xs,
    overflow: "hidden",
  },

  batteryBarFill: {
    height: 6,
    borderRadius: 3,
  },

  stopSummaryLink: { minHeight: 44, flexDirection: "row", alignItems: "center", gap: 8 },
  stopLinkTitle: { flexDirection: "row", alignItems: "center", gap: 8 },
  stopsSummary: { padding: 12, borderRadius: 14, backgroundColor: colors.primarySoft, marginBottom: 10 },
  stopsSummaryTitle: { color: colors.primary, fontSize: 14, lineHeight: 20, fontWeight: "700" },
  stopsSummaryText: { color: colors.textSecondary, fontSize: 12, lineHeight: 18, marginTop: 4 },
  mapCard: {
    height: 160,
    borderRadius: radius.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
    ...shadows.soft,
  },

  scrollHint: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xxs,
    marginBottom: spacing.md,
  },

  scrollHintText: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
  },

  map: {
    flex: 1,
  },

  markerOrigin: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.primary,
    borderWidth: 3,
    borderColor: colors.white,
  },

  stopNumber: { color: colors.white, fontSize: 14, lineHeight: 18, fontWeight: "800", textAlign: "center" },
  markerStop: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.success,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.white,
  },

  markerDestination: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.white,
  },

  routeCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },

  routeCardTitleGroup: {
    flexGrow: 1,
    flexShrink: 1,
    minWidth: 0,
    marginRight: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
  },

  routeCardTitleText: {
    flex: 1,
    minWidth: 0,
  },

  routeCardIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
  },

  routeCardTitle: {
    color: colors.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },

  routeCardSubtitle: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
    marginTop: 1,
  },

  editButton: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
  },

  editButtonText: {
    color: colors.primary,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    marginLeft: spacing.xxs,
  },

  statsRow: {
    flexDirection: "row",
    backgroundColor: colors.background,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },

  statItem: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    minWidth: 0,
    paddingHorizontal: 4,
    alignItems: "center",
  },

  statsStack: { flexDirection: "column", gap: spacing.sm },
  statItemStack: { flexGrow: 0, flexShrink: 0, flexBasis: "auto", width: "100%" },
  statDividerStack: { width: "100%", height: 1 },

  statDivider: {
    width: 1,
    flexShrink: 0,
    backgroundColor: colors.border,
  },

  statValue: {
    alignSelf: "stretch",
    color: colors.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    marginTop: spacing.xxs,
    textAlign: "center",
  },

  statLabel: {
    alignSelf: "stretch",
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
    marginTop: 1,
    textAlign: "center",
  },

  timelineRow: {
    flexDirection: "row",
  },

  timelineRail: {
    width: 28,
    alignItems: "center",
  },

  timelineIconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },

  timelineIconOrigin: {
    backgroundColor: colors.success,
  },

  timelineIconStop: {
    backgroundColor: colors.primary,
  },

  timelineIconDestination: {
    backgroundColor: colors.primary,
  },

  timelineConnector: {
    flex: 1,
    width: 2,
    backgroundColor: colors.border,
    marginVertical: 2,
    minHeight: 18,
  },

  timelineContent: {
    flex: 1,
    minWidth: 0,
    paddingLeft: spacing.xs,
    paddingBottom: spacing.md,
  },

  timelineName: {
    color: colors.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },

  timelineMeta: {
    color: colors.textMuted,
    fontSize: typography.sizes.sm,
    lineHeight: 20,
    marginTop: 4,
  },

  timelineBatteryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginTop: spacing.xs,
  },

  timelineBatteryText: {
    flexShrink: 1,
    color: colors.text,
    fontSize: typography.sizes.sm,
    lineHeight: 20,
    fontWeight: typography.weights.semibold,
  },

  warningBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },

  warningIconBox: {
    marginRight: spacing.sm,
  },

  warningText: {
    flex: 1,
    fontSize: typography.sizes.sm,
    lineHeight: 19,
    fontWeight: typography.weights.semibold,
  },

  disclaimerText: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
    lineHeight: 16,
    marginBottom: spacing.md,
  },

  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  footerCaption: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
    textAlign: "center",
    marginBottom: spacing.xs,
  },

  startButton: {
    minHeight: 56,
    borderRadius: radius.lg,
    backgroundColor: colors.primaryDark,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: spacing.xs,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },

  startButtonDisabled: {
    opacity: 0.5,
  },

  startButtonPressed: {
    opacity: 0.86,
    transform: [{ scale: 0.98 }],
  },

  startButtonText: {
    flexShrink: 1,
    textAlign: "center",
    color: colors.white,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(8, 10, 18, 0.45)",
    justifyContent: "flex-end",
  },

  modalSheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    maxHeight: "70%",
  },

  modalTitle: {
    color: colors.text,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.md,
  },

  modalOption: {
    minHeight: 48,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  modalOptionPressed: {
    opacity: 0.7,
  },

  modalOptionSelected: {
    backgroundColor: colors.primarySoft,
  },

  modalOptionTitle: {
    color: colors.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
  },

  modalOptionSubtitle: {
    color: colors.textMuted,
    fontSize: typography.sizes.sm,
    marginTop: 1,
  },

  modalCloseButton: {
    minHeight: 48,
    justifyContent: "center",
    marginTop: spacing.md,
    alignItems: "center",
    paddingVertical: spacing.sm,
  },

  modalCloseButtonText: {
    color: colors.primary,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
  },
});
