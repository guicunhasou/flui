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
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.09,
  shadowRadius: 20,
  elevation: 7,
};

const softShadow = {
  shadowColor: colors.shadow,
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.07,
  shadowRadius: 14,
  elevation: 4,
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
    marginTop: 8,
  },

  quickFiltersHandleArea: {
    minHeight: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  quickFiltersHandle: {
    width: 44,
    height: 5,
    borderRadius: 999,
    backgroundColor: colors.border,
  },

  filtersContent: {
    paddingTop: 8,
    paddingRight: 8,
    paddingBottom: 2,
  },

  chip: {
    height: 42,
    marginRight: 10,
    paddingHorizontal: 15,
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
    backgroundColor: "rgba(5, 12, 20, 0.24)",
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
    position: "absolute",
    top: "45%",
    left: "50%",
    width: 82,
    height: 82,
    marginLeft: -41,
    marginTop: -41,
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
    width: 23,
    height: 23,
    borderRadius: 12,
    backgroundColor: colors.primary,
    borderWidth: 5,
    borderColor: colors.white,
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
    minHeight: 14,
    marginTop: -2,
    marginBottom: 6,
    alignItems: "center",
    justifyContent: "center",
  },

  sheetHandle: {
    width: 46,
    height: 5,
    borderRadius: 999,
    backgroundColor: colors.border,
  },


  sheetHeader: {
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    minHeight: 74,
    marginTop: 10,
    paddingVertical: 11,
    paddingLeft: 12,
    paddingRight: 9,
    borderRadius: 18,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    ...softShadow,
  },

  pointIconCircle: {
    width: 48,
    height: 48,
    marginRight: 12,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primarySoft,
  },

  pointInfo: {
    flex: 1,
    minWidth: 0,
  },

  pointTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: -0.15,
  },

  pointAddress: {
    marginTop: 2,
    color: colors.textMuted,
    fontSize: 12.5,
    fontWeight: "500",
  },

  statusRow: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.green,
  },

  statusText: {
    color: colors.textMuted,
    fontSize: 12.5,
    fontWeight: "500",
  },

  pointMeta: {
    width: 92,
    marginLeft: 8,
    gap: 8,
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  metaText: {
    color: colors.textMuted,
    fontSize: 12.5,
    fontWeight: "700",
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
