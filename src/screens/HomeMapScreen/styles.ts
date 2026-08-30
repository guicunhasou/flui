import { Platform, StyleSheet } from "react-native";

export const colors = {
  background: "#F3F8F4",
  white: "#FCFEFA",
  text: "#10221E",
  textMuted: "#3F554F",
  textLight: "#63766F",
  primary: "#2B0055",
  primarySoft: "#EAF1FF",
  primarySoftStrong: "#CFE8D9",
  green: "#1FA971",
  yellow: "#FFF2C7",
  yellowDark: "#F4B942",
  border: "#DDE8E3",
  shadow: "#12302A",
};

const shadow = {
  shadowColor: colors.shadow,
  shadowOffset: { width: 0, height: 5 },
  shadowOpacity: 0.05,
  shadowRadius: 10,
  elevation: 3,
};

const softShadow = {
  shadowColor: colors.shadow,
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.035,
  shadowRadius: 10,
  elevation: 2,
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  topArea: {
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 18 : 8,
    paddingBottom: 14,
    zIndex: 10,
  },

  header: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  profileButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    ...softShadow,
  },

  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  batteryPill: {
    height: 40,
    paddingHorizontal: 8,
    paddingRight: 14,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    ...softShadow,
  },

  batteryPillIconWrap: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },

  batteryPillText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "800",
  },

  batterySheetOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 40,
    justifyContent: "flex-end",
  },

  batterySheetBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(16, 34, 30, 0.35)",
  },

  batterySheetCard: {
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 36,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },

  batterySheetHandle: {
    width: 40,
    height: 4,
    marginBottom: 18,
    borderRadius: 2,
    alignSelf: "center",
    backgroundColor: colors.border,
  },

  batterySheetHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  batterySheetPreviewIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },

  batterySheetHeaderText: {
    flex: 1,
  },

  batterySheetTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.25,
  },

  batterySheetSubtitle: {
    marginTop: 3,
    color: colors.textMuted,
    fontSize: 13.5,
    fontWeight: "700",
  },

  batterySheetOptionsRow: {
    marginTop: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },

  batterySheetOption: {
    width: 58,
    height: 66,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    ...softShadow,
  },

  batterySheetOptionText: {
    fontSize: 13.5,
    fontWeight: "800",
  },

  batterySheetOptionTextActive: {
    color: colors.white,
  },

  searchBar: {
    height: 58,
    marginTop: 14,
    paddingLeft: 18,
    paddingRight: 10,
    borderRadius: 18,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    ...softShadow,
  },

  searchText: {
    flex: 1,
    marginLeft: 13,
    color: colors.textMuted,
    fontSize: 15,
    fontWeight: "500",
  },

  searchDivider: {
    width: 1,
    height: 30,
    marginHorizontal: 8,
    backgroundColor: colors.border,
  },

  filterButton: {
    width: 42,
    height: 42,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  quickFiltersArea: {
    marginTop: 4,
  },

  quickFiltersHandleArea: {
    minHeight: 2,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 2,
  },

  quickFiltersChevronButton: {
    width: 30,
    height: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },

  quickFiltersAnimatedContent: {
    overflow: "hidden",
  },

  filtersContent: {
    paddingTop: 4,
    paddingRight: 8,
    gap: 4,
  },

  chip: {
    height: 42,
    marginRight: 4,
    paddingHorizontal: 14,
    borderRadius: 22,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    ...softShadow,
  },

  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  chipText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
  },

  chipTextActive: {
    color: colors.white,
  },

  mapArea: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#E8F1EB",
  },

  realMap: {
    ...StyleSheet.absoluteFillObject,
  },

  mapTintOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(16, 34, 30, 0.03)",
  },

  mapTintOverlayDark: {
    backgroundColor: "rgba(5, 12, 20, 0.08)",
  },

  realMapMarker: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: colors.white,
  },

  userLocationMarker: {
    width: 54,
    height: 54,
    alignItems: "center",
    justifyContent: "center",
  },

  userLocationPulse: {
    position: "absolute",
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "rgba(31, 169, 113, 0.18)",
  },

  userLocationDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    borderWidth: 5,
    borderColor: colors.white,
    ...shadow,
  },

  mapCanvas: {
    position: "absolute",
    top: 0,
    left: 0,
  },

  mapImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  mapMarker: {
    position: "absolute",
    width: 44,
    height: 56,
    alignItems: "center",
    transform: [{ translateX: -22 }, { translateY: -48 }],
  },

  plugMarkerPosition: {
    width: 38,
    height: 38,
    transform: [{ translateX: -19 }, { translateY: -19 }],
  },

  pinBody: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    ...shadow,
  },

  pinTip: {
    width: 15,
    height: 15,
    marginTop: -8,
    borderRadius: 3,
    backgroundColor: colors.primary,
    transform: [{ rotate: "45deg" }],
  },

  plugMarker: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    ...softShadow,
  },

  currentLocation: {
    width: 82,
    height: 82,
    alignItems: "center",
    justifyContent: "center",
  },

  currentLocationHalo: {
    position: "absolute",
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: "rgba(31, 169, 113, 0.16)",
  },

  currentLocationDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 5,
  },

  fixedMapControls: {
    position: "absolute",
    right: 16,
    top: 18,
    width: 52,
    alignItems: "center",
    gap: 10,
    zIndex: 12,
  },

  zoomPill: {
    width: 52,
    height: 104,
    borderRadius: 26,
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow,
  },

  zoomPillButton: {
    width: 52,
    height: 51,
    alignItems: "center",
    justifyContent: "center",
  },

  zoomPillButtonActive: {
    backgroundColor: colors.primarySoft,
  },

  zoomPillDivider: {
    width: 28,
    height: 1,
    backgroundColor: colors.border,
  },

  mapControlButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow,
  },

  mapControlButtonActive: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primarySoftStrong,
  },

  mapControlButtonLoading: {
    opacity: 0.68,
  },

  mapControlText: {
    color: colors.primary,
    fontSize: 28,
    fontWeight: "800",
    lineHeight: 31,
  },

  bottomSheet: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 0,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.border,
    zIndex: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 8,
  },

  sheetHandleArea: {
    minHeight: 22,
    marginTop: -10,
    marginBottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },

  sheetChevronButton: {
    width: 30,
    height: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },

  sheetHeader: {
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  restaurarPainelWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 20,
    alignItems: "center",
    zIndex: 15,
  },

  restaurarPainelPill: {
    height: 46,
    paddingHorizontal: 18,
    borderRadius: 23,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow,
  },

  restaurarPainelPillText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "800",
  },


  sheetTitle: {
    flex: 1,
    color: colors.text,
    fontSize: 21,
    fontWeight: "800",
    letterSpacing: -0.35,
  },

  starBadge: {
    width: 44,
    height: 44,
    marginLeft: 14,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.yellow,
  },

  emptyCard: {
    marginTop: 10,
    padding: 16,
    borderRadius: 20,
    backgroundColor: colors.primarySoft,
    borderWidth: 1,
    borderColor: colors.primarySoftStrong,
  },

  emptyTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800",
    lineHeight: 20,
  },

  emptyText: {
    marginTop: 6,
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 18,
  },

  emptyButton: {
    height: 40,
    marginTop: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    alignSelf: "flex-start",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
  },

  emptyButtonText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "800",
  },

  pointsScroll: {
    maxHeight: 262,
  },

  pointsScrollContent: {
    paddingBottom: 2,
  },

  pointCard: {
    marginTop: 14,
    padding: 16,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.background,
    alignItems: "flex-start",
    ...softShadow,
  },

  pointCardTopRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  pointBadge: {
    alignSelf: "flex-start",
    height: 22,
    paddingHorizontal: 8,
    borderRadius: 11,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.primarySoft,
  },

  pointBadgeText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },

  pointStationName: {
    marginTop: 10,
    color: colors.text,
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: -0.3,
  },

  pointAddress: {
    marginTop: 3,
    color: colors.textLight,
    fontSize: 13,
    fontWeight: "500",
  },

  pointInlineMetaRow: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 14,
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.green,
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  metaText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "600",
  },

  pointAutonomiaChip: {
    alignSelf: "flex-start",
    marginTop: 12,
    height: 26,
    paddingHorizontal: 10,
    borderRadius: 13,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  pointAutonomiaChipText: {
    fontSize: 11.5,
    fontWeight: "800",
    letterSpacing: -0.1,
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
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    ...shadow,
  },

  feedbackToastText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: -0.1,
  },
});

export default styles;
