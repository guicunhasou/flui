import { StyleSheet } from "react-native";

import type { AppTheme } from "../../theme/appTheme";
import { scaleFontSize } from "../../theme/appTheme";

export function createSettingsStyles(colors: AppTheme, fontScale: number) {
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
      backgroundColor: colors.surface,
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
      paddingTop: 10,
      paddingBottom: 34,
    },

    warningCard: {
      marginBottom: 18,
      padding: 14,
      borderRadius: 20,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      ...softShadow,
    },

    warningTitle: {
      color: colors.text,
      fontSize: s(14.5),
      fontWeight: "800",
    },

    warningText: {
      marginTop: 5,
      color: colors.textMuted,
      fontSize: s(13),
      fontWeight: "500",
      lineHeight: s(19),
    },

    section: {
      marginTop: 22,
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

    optionsList: {
      marginTop: 12,
      gap: 10,
    },

    optionButton: {
      minHeight: 82,
      padding: 13,
      borderRadius: 22,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: "row",
      alignItems: "center",
      ...softShadow,
    },

    optionButtonSelected: {
      backgroundColor: colors.selectedCard,
      borderColor: colors.primary,
    },

    optionIconBox: {
      width: 48,
      height: 48,
      marginRight: 12,
      borderRadius: 24,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.primarySoft,
    },

    optionInfo: {
      flex: 1,
      minWidth: 0,
    },

    optionTitle: {
      color: colors.text,
      fontSize: s(15),
      fontWeight: "800",
      letterSpacing: -0.1,
    },

    optionDescription: {
      marginTop: 4,
      color: colors.textMuted,
      fontSize: s(12.5),
      fontWeight: "600",
      lineHeight: s(18),
    },

    checkCircle: {
      width: 24,
      height: 24,
      marginLeft: 10,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.primary,
    },

    emptyCheckCircle: {
      width: 24,
      height: 24,
      marginLeft: 10,
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor: colors.border,
    },

    feedbackToastOverlay: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 30,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 24,
    },

    feedbackToastCard: {
      minHeight: 52,
      paddingHorizontal: 16,
      borderRadius: 999,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: "row",
      alignItems: "center",
      gap: 9,
      ...shadow,
    },

    feedbackToastIcon: {
      width: 22,
      height: 22,
      borderRadius: 11,
      overflow: "hidden",
      backgroundColor: colors.primarySoft,
      color: colors.primary,
      fontSize: s(14),
      fontWeight: "900",
      lineHeight: 22,
      textAlign: "center",
    },

    feedbackToastText: {
      color: colors.text,
      fontSize: s(14),
      fontWeight: "800",
      letterSpacing: -0.1,
    },
  });
}