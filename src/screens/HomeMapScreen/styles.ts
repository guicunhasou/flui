import { StyleSheet } from "react-native";

const COLORS = {
  background: "#F8F8F6",
  card: "#FFFFFF",
  text: "#10172F",
  muted: "#657084",
  purple: "#36109A",
  purpleDark: "#2A087C",
  purpleSoft: "#EEE8FF",
  border: "#E7E8EC",
  success: "#22B86A",
  warning: "#F4B322",
  teal: "#075E6B",
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 22,
    paddingTop: 8,
  },

  header: {
    height: 72,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  logo: {
    fontSize: 44,
    fontWeight: "800",
    fontStyle: "italic",
    color: COLORS.purple,
    letterSpacing: -2,
  },

  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },

  searchBar: {
    height: 62,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.07,
    shadowRadius: 16,
    elevation: 4,
  },

  searchPlaceholder: {
    flex: 1,
    marginLeft: 14,
    fontSize: 16,
    color: COLORS.muted,
  },

  searchDivider: {
    width: 1,
    height: 28,
    marginRight: 14,
    backgroundColor: COLORS.border,
  },

  filtersScroll: {
    marginTop: 16,
    marginBottom: 18,
    marginHorizontal: -22,
  },

  filtersRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 22,
  },

  filterChip: {
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 14,
    borderRadius: 23,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },

  filterChipActive: {
    backgroundColor: COLORS.purple,
    borderColor: COLORS.purple,
  },

  filterChipText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
  },

  filterChipActiveText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  mapCard: {
    height: 430,
    marginHorizontal: -22,
    overflow: "hidden",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: "#EFF2F4",
  },

  mapBackground: {
    flex: 1,
    position: "relative",
    backgroundColor: "#F1F3F5",
    overflow: "hidden",
  },

  mapRoad: {
    position: "absolute",
    height: 12,
    borderRadius: 99,
    backgroundColor: "#FFFFFF",
    opacity: 0.95,
  },

  mapRoadOne: {
    width: 620,
    top: 52,
    left: -80,
    transform: [{ rotate: "28deg" }],
  },

  mapRoadTwo: {
    width: 660,
    top: 148,
    left: -120,
    transform: [{ rotate: "-22deg" }],
  },

  mapRoadThree: {
    width: 560,
    top: 260,
    left: -80,
    transform: [{ rotate: "18deg" }],
  },

  mapRoadFour: {
    width: 620,
    top: 210,
    left: -40,
    transform: [{ rotate: "82deg" }],
  },

  mapRoadFive: {
    width: 520,
    top: 120,
    right: -140,
    transform: [{ rotate: "105deg" }],
  },

  mapPark: {
    position: "absolute",
    borderRadius: 28,
    backgroundColor: "#DDF4E8",
    opacity: 0.8,
  },

  mapParkOne: {
    width: 140,
    height: 170,
    top: 0,
    left: 210,
    transform: [{ rotate: "18deg" }],
  },

  mapParkTwo: {
    width: 180,
    height: 140,
    bottom: 50,
    right: -20,
    transform: [{ rotate: "-22deg" }],
  },

  mapRiver: {
    position: "absolute",
    width: 70,
    height: 520,
    left: 18,
    top: -40,
    borderRadius: 40,
    backgroundColor: "#D8EEF8",
    transform: [{ rotate: "16deg" }],
  },

  mapPin: {
    position: "absolute",
    width: 44,
    height: 54,
    marginLeft: -22,
    marginTop: -27,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderBottomLeftRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    transform: [{ rotate: "45deg" }],
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },

  mapPinIcon: {
    transform: [{ rotate: "-45deg" }],
  },

  mapPinActive: {
    backgroundColor: COLORS.purple,
  },

  mapPinInactive: {
    backgroundColor: "#FFFFFF",
  },

  userLocationHalo: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 82,
    height: 82,
    marginLeft: -41,
    marginTop: -41,
    borderRadius: 41,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(54, 16, 154, 0.12)",
  },

  userLocationDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.purple,
    borderWidth: 6,
    borderColor: "#FFFFFF",
  },

  mapActions: {
    position: "absolute",
    right: 24,
    bottom: 32,
    gap: 12,
  },

  mapActionButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.card,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 5,
  },

  recommendationsCard: {
    position: "absolute",
    left: 22,
    right: 22,
    bottom: 96,
    padding: 20,
    borderRadius: 28,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 14,
    },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },

  recommendationsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  recommendationsTitle: {
    flex: 1,
    fontSize: 23,
    lineHeight: 29,
    fontWeight: "800",
    color: COLORS.text,
  },

  starBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF4D5",
  },

  recommendationsList: {
    gap: 10,
  },

  recommendationItem: {
    minHeight: 82,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 18,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },

  recommendationIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    backgroundColor: COLORS.purpleSoft,
  },

  recommendationContent: {
    flex: 1,
  },

  recommendationTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.text,
  },

  recommendationAddress: {
    marginTop: 2,
    fontSize: 13,
    color: COLORS.muted,
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 6,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.success,
  },

  statusText: {
    fontSize: 12,
    color: COLORS.muted,
  },

  recommendationMeta: {
    width: 92,
    alignItems: "flex-start",
    gap: 5,
  },

  inlineMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  metaText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.muted,
  },

  tabBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 92,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 18,
    paddingBottom: 14,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -8,
    },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 10,
  },

  tabItem: {
    width: 74,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
  },

  activeIndicator: {
    position: "absolute",
    top: 0,
    width: 34,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.purple,
  },

  tabText: {
    marginTop: 4,
    fontSize: 12,
    color: COLORS.muted,
  },

  tabTextActive: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.purple,
  },
});

export default styles;
