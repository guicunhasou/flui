import { StyleSheet } from "react-native";

import type { AppTheme } from "../../theme/appTheme";
import { scaleFontSize } from "../../theme/appTheme";

export function createProfileStyles(colors: AppTheme, fontScale: number) {
  const s = (size: number) => scaleFontSize(size, fontScale);

  const shadow = {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 6,
  };

  const softShadow = {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 4,
  };

  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },

    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },

    header: {
      minHeight: 58,
      paddingHorizontal: 20,
      paddingTop: 8,
      paddingBottom: 8,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    backButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.border,
      ...softShadow,
    },

    headerTitle: {
      color: colors.text,
      fontSize: s(18),
      fontWeight: "800",
      letterSpacing: -0.25,
    },

    headerSpacer: {
      width: 44,
      height: 44,
    },

    content: {
      paddingHorizontal: 20,
      paddingTop: 8,
      paddingBottom: 34,
      alignItems: "stretch",
    },

    profileCard: {
      width: "100%",
      alignSelf: "stretch",
      padding: 18,
      borderRadius: 28,
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: "row",
      alignItems: "center",
      ...shadow,
    },

    avatarCircle: {
      width: 66,
      height: 66,
      borderRadius: 33,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.primarySoft,
    },

    profileInfo: {
      flex: 1,
      marginLeft: 14,
    },

    profileName: {
      color: colors.text,
      fontSize: s(18),
      fontWeight: "800",
      letterSpacing: -0.25,
    },

    profileText: {
      marginTop: 5,
      color: colors.textMuted,
      fontSize: s(13.5),
      fontWeight: "500",
      lineHeight: s(19),
    },

    profileBadge: {
      alignSelf: "flex-start",
      marginTop: 11,
      minHeight: 28,
      paddingHorizontal: 10,
      borderRadius: 14,
      backgroundColor: colors.primarySoft,
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },

    profileBadgeText: {
      color: colors.primary,
      fontSize: s(12),
      fontWeight: "800",
    },

    feedbackBadge: {
      marginTop: 12,
      minHeight: 40,
      paddingHorizontal: 14,
      borderRadius: 18,
      backgroundColor: colors.primarySoft,
      borderWidth: 1,
      borderColor: colors.primarySoftStrong,
      alignItems: "center",
      justifyContent: "center",
    },

    feedbackText: {
      color: colors.primary,
      fontSize: s(13),
      fontWeight: "800",
    },

    errorCard: {
      marginTop: 12,
      padding: 13,
      borderRadius: 18,
      backgroundColor: colors.dangerSoft,
      borderWidth: 1,
      borderColor: colors.dangerBorder,
    },

    errorText: {
      color: colors.text,
      fontSize: s(12.5),
      fontWeight: "700",
      lineHeight: s(18),
    },

    statsRow: {
      marginTop: 14,
      flexDirection: "row",
      gap: 10,
    },

    statCard: {
      flex: 1,
      minHeight: 78,
      borderRadius: 22,
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
      ...softShadow,
    },

    statNumber: {
      color: colors.primary,
      fontSize: s(22),
      fontWeight: "800",
      letterSpacing: -0.3,
    },

    statLabel: {
      marginTop: 3,
      color: colors.textMuted,
      fontSize: s(12),
      fontWeight: "700",
    },

    profileActionsRow: {
      width: "100%",
      alignSelf: "center",
      marginTop: 14,
      flexDirection: "row",
      gap: 10,
    },

    profileActionText: {
      color: colors.primary,
      fontSize: s(13),
      fontWeight: "800",
    },

    settingsButton: {
      flex: 1,
      minHeight: 54,
      paddingHorizontal: 12,
      borderRadius: 18,
      borderWidth: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      backgroundColor: colors.primarySoft,
      borderColor: colors.primarySoftStrong,
      ...softShadow,
    },

    logoutButton: {
      flex: 1,
      minHeight: 54,
      paddingHorizontal: 12,
      borderRadius: 18,
      borderWidth: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      backgroundColor: colors.dangerSoft,
      borderColor: colors.dangerBorder,
      ...softShadow,
    },

    quickActionsSection: {
      marginTop: 22,
    },

    quickActionsGrid: {
      marginTop: 12,
      flexDirection: "row",
      gap: 10,
    },

    shortcutCard: {
      flex: 1,
      minHeight: 118,
      padding: 12,
      borderRadius: 22,
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.border,
      ...softShadow,
    },

    shortcutIconBox: {
      width: 38,
      height: 38,
      borderRadius: 19,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.primarySoft,
    },

    shortcutTitle: {
      marginTop: 10,
      color: colors.text,
      fontSize: s(13.5),
      fontWeight: "800",
      letterSpacing: -0.1,
    },

    shortcutText: {
      marginTop: 3,
      color: colors.textMuted,
      fontSize: s(11.5),
      fontWeight: "600",
      lineHeight: s(16),
    },

    segmentedControl: {
      marginTop: 20,
      padding: 5,
      borderRadius: 22,
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: "row",
      ...softShadow,
    },

    segmentButton: {
      flex: 1,
      minHeight: 44,
      borderRadius: 17,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    },

    segmentButtonActive: {
      backgroundColor: colors.primary,
    },

    segmentText: {
      color: colors.primary,
      fontSize: s(13.5),
      fontWeight: "800",
    },

    segmentTextActive: {
      color: colors.white,
    },

    section: {
      marginTop: 20,
    },

    sectionTitle: {
      color: colors.text,
      fontSize: s(20),
      fontWeight: "800",
      letterSpacing: -0.35,
    },

    sectionText: {
      marginTop: 6,
      color: colors.textMuted,
      fontSize: s(13.5),
      fontWeight: "500",
      lineHeight: s(20),
    },

    cardsList: {
      marginTop: 12,
      gap: 10,
    },

    stationCard: {
      minHeight: 92,
      padding: 13,
      borderRadius: 22,
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: "row",
      alignItems: "center",
      ...softShadow,
    },

    stationIconBox: {
      width: 48,
      height: 48,
      marginRight: 12,
      borderRadius: 24,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.primarySoft,
    },

    stationInfo: {
      flex: 1,
      minWidth: 0,
    },

    stationName: {
      color: colors.text,
      fontSize: s(15),
      fontWeight: "800",
      letterSpacing: -0.15,
    },

    stationAddressRow: {
      marginTop: 5,
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },

    stationAddress: {
      flex: 1,
      color: colors.textMuted,
      fontSize: s(12.5),
      fontWeight: "500",
    },

    stationMetaRow: {
      marginTop: 9,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },

    metaPill: {
      height: 28,
      paddingHorizontal: 9,
      borderRadius: 14,
      backgroundColor: colors.primarySoft,
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
    },

    metaPillText: {
      color: colors.primary,
      fontSize: s(12),
      fontWeight: "800",
    },

    reviewsHeader: {
      marginTop: 24,
    },

    reviewCard: {
      minHeight: 74,
      padding: 13,
      borderRadius: 20,
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: "row",
      alignItems: "center",
      ...softShadow,
    },

    reviewIconBox: {
      width: 44,
      height: 44,
      marginRight: 12,
      borderRadius: 22,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.yellow,
    },

    reviewInfo: {
      flex: 1,
      minWidth: 0,
    },

    reviewStation: {
      color: colors.text,
      fontSize: s(14.5),
      fontWeight: "800",
      letterSpacing: -0.1,
    },

    reviewText: {
      marginTop: 4,
      color: colors.textMuted,
      fontSize: s(12.5),
      fontWeight: "600",
      lineHeight: s(18),
    },

    easterEgg: {
      marginTop: 300,
      marginBottom: 38,
      alignItems: "center",
    },

    easterEggText: {
      color: colors.textMuted,
      fontSize: s(11.5),
      fontWeight: "700",
      opacity: 0.58,
    },
  });
}
