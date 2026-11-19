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

  searchFeedback: { marginTop: 8, gap: 6 },
  searchFeedbackText: { color: colors.textMuted, fontSize: 12, marginTop: 6 },
  searchResetButton: { minHeight: 44, alignSelf: "flex-start", justifyContent: "center", paddingHorizontal: 12, borderRadius: 12, backgroundColor: colors.primary },
  searchResetText: { color: colors.white, fontSize: 13, fontWeight: "700" },
  topArea: {
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 18 : 0,
    paddingBottom: 10,
    zIndex: 10,
  },

  header: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerActions: {
    flex: 1,
    justifyContent: "flex-end",
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
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

  vehicleButton: {
    maxWidth: 190,
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
  },

  vehicleVisual: {
    minWidth: 64,
    alignItems: "center",
  },

  vehicleImage: {
    width: 60,
    height: 32,
    zIndex: 1,
    transform: [{ translateY: -4 }],
  },

  vehicleBatteryPill: {
    minWidth: 64,
    minHeight: 46,
    paddingHorizontal: 2,
    alignItems: "center",
    justifyContent: "center",
  },

  vehicleBatterySummary: {
    position: "absolute",
    bottom: 2,
    alignSelf: "center",
    zIndex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },

  vehicleBatteryIconRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  vehicleBatteryIcon: {
    width: 20,
    height: 10,
    padding: 1,
    overflow: "hidden",
    borderWidth: 1.4,
    borderRadius: 3,
  },

  vehicleBatteryLevel: {
    height: "100%",
    borderRadius: 1,
  },

  vehicleBatteryCap: {
    width: 2,
    height: 5,
    marginLeft: 1,
    borderTopRightRadius: 1,
    borderBottomRightRadius: 1,
  },

  vehicleBatteryText: {
    fontSize: 10,
    fontWeight: "900",
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

  batterySheetContent: {
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 24,
  },

  batterySheetCard: {
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
    flexGrow: 0,
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

  batterySheetCloseButton: {
    width: 44,
    height: 44,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
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

  batteryStepperRow: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  batteryStepperButton: {
    width: 64,
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.primarySoftStrong,
    ...softShadow,
  },

  batteryStepperButtonDisabled: {
    opacity: 0.35,
  },

  batteryStepperButtonText: {
    color: colors.primary,
    fontSize: 30,
    lineHeight: 32,
    fontWeight: "800",
  },

  batteryStepperValue: {
    flex: 1,
    minWidth: 0,
    alignItems: "center",
  },

  batteryStepperPercent: {
    fontSize: 32,
    lineHeight: 36,
    fontWeight: "900",
    letterSpacing: -0.8,
  },

  batteryStepperRange: {
    marginTop: 2,
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "700",
  },

  batterySheetSafetyHint: {
    marginTop: 14,
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
    textAlign: "center",
  },

  batterySheetDoneButton: {
    minHeight: 48,
    paddingVertical: 12,
    marginTop: 14,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
  },

  batterySheetDoneButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "800",
  },

  searchBar: {
    minHeight: 58,
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
    marginLeft: 10,
    minWidth: 0,
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
    width: 44,
    height: 44,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  quickFiltersArea: {
    marginTop: 4,
  },

  quickFiltersHandleArea: {
    minHeight: 44,
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
    minHeight: 44,
    paddingVertical: 8,
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
    height: 56,
    alignItems: "center",
  },

  realMapMarkerBody: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: colors.white,
    ...shadow,
  },

  realMapMarkerTip: {
    width: 14,
    height: 14,
    marginTop: -8,
    borderRadius: 3,
    transform: [{ rotate: "45deg" }],
  },

  userLocationMarker: {
    width: 72,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
  },

  userLocationPulse: {
    position: "absolute",
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.primary,
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

  leftMapControls: { position: "absolute", left: 16, top: 16, gap: 8, alignItems: "center", zIndex: 12 },
  fixedMapControls: { position: "absolute", right: 16, top: 16, width: 48, gap: 8, alignItems: "center", zIndex: 12 },
  recommendationsOverlay: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 20 },
  recommendationsBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(7, 12, 18, 0.62)" },
  recommendationsPopup: { width: "100%", maxWidth: 560, maxHeight: "100%", borderRadius: 28, overflow: "hidden", backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border },
  recommendationsHeader: { flexDirection: "row", alignItems: "center", gap: 12, paddingLeft: 18, paddingRight: 10, paddingVertical: 10 },
  recommendationsClose: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border },

  mapControlsCompact: {
    top: 12,
    width: "auto",
    flexDirection: "row",
  },

  zoomPillCompact: {
    width: 104,
    height: 52,
    flexDirection: "row",
  },

  zoomDividerCompact: {
    width: 1,
    height: 28,
  },

  zoomPill: {
    width: 48,
    height: 96,
    borderRadius: 26,
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.primary,
    ...shadow,
  },

  zoomPillButton: {
    width: 48,
    height: 47,
    alignItems: "center",
    justifyContent: "center",
  },

  zoomPillButtonActive: {
    opacity: 0.8,
  },

  zoomPillDivider: {
    width: 28,
    height: 1,
    backgroundColor: colors.white,
    opacity: 0.35,
  },

  mapControlButton: {
    width: 48,
    height: 48,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.primary,
    ...shadow,
  },

  mapControlButtonActive: {
    opacity: 0.8,
  },

  mapControlButtonLoading: {
    opacity: 0.68,
  },

  mapControlText: {
    color: colors.white,
    fontSize: 28,
    fontWeight: "800",
    lineHeight: 31,
  },

  fluiAssistantButton: {
    width: "100%",
    minHeight: 52,
    paddingHorizontal: 8,
    borderRadius: 26,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.primary,
    zIndex: 14,
    ...shadow,
    elevation: 12,
  },

  fluiAssistantAnimatedButton: {
    height: 52,
    overflow: "visible",
  },

  fluiAssistantButtonText: {
    paddingLeft: 8,
    color: colors.white,
    fontSize: 14,
    fontWeight: "900",
  },

  bottomSheet: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 0,
    zIndex: 8,
  },

  fluiAssistantFloating: {
    position: "absolute",
    height: 52,
    alignItems: "flex-end",
    zIndex: 16,
  },

  bottomSheetContent: {
    paddingHorizontal: 18,
    paddingBottom: 2,
  },

  bottomSheetCard: {
    flexGrow: 0,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 8,
  },

  sheetHandleArea: {
    minHeight: 44,
    marginTop: 0,
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

  simulationBadge: { color: colors.primary, backgroundColor: colors.primarySoft, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 10, fontSize: 11, fontWeight: "700" },
  originDescription: {
    color: colors.textLight,
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 10,
  },

  restaurarPainelWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 20,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
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
    fontWeight: "600",
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
    minHeight: 44,
    paddingVertical: 10,
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
    paddingBottom: 0,
  },

  pointCard: {
    marginTop: 10,
    padding: 13,
    borderRadius: 17,
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

  pointCardTags: {
    flex: 1,
    marginRight: 8,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
  },

  pointBadge: {
    maxWidth: "100%",
    alignSelf: "flex-start",
    minHeight: 22,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 11,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.primarySoft,
  },

  pointBadgeText: {
    flexShrink: 1,
    color: colors.primary,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },

  pointStationName: {
    marginTop: 8,
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
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
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
    maxWidth: "100%",
    alignSelf: "flex-start",
    minHeight: 22,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 11,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  pointAutonomiaChipText: {
    flexShrink: 1,
    fontSize: 10,
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
