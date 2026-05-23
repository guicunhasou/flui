import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F4EC",
  },

  scrollContent: {
    paddingBottom: 120,
  },

  hero: {
    height: 290,
    backgroundColor: "#161B2E",
    overflow: "hidden",
  },

  heroSky: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#1D2738",
  },

  heroCanopy: {
    position: "absolute",
    top: 72,
    left: -24,
    right: -24,
    height: 86,
    backgroundColor: "#2B2A28",
    borderBottomWidth: 12,
    borderBottomColor: "#9B8452",
    transform: [{ rotate: "-4deg" }],
  },

  heroGround: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 96,
    backgroundColor: "#26351F",
  },

  chargerLarge: {
    position: "absolute",
    right: 92,
    bottom: 52,
    width: 54,
    height: 116,
    borderRadius: 12,
    padding: 10,
    backgroundColor: "#123B37",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.25)",
    justifyContent: "space-between",
  },

  chargerLogo: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  chargerSymbol: {
    color: "#F0D35C",
    fontSize: 24,
  },

  chargerSmall: {
    position: "absolute",
    left: 90,
    bottom: 50,
    width: 44,
    height: 82,
    borderRadius: 10,
    backgroundColor: "#F4F0E4",
    alignItems: "center",
    justifyContent: "center",
  },

  chargerSmallSymbol: {
    color: "#2B0055",
    fontSize: 24,
  },

  heroActions: {
    position: "absolute",
    top: 0,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOpacity: 0.14,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    elevation: 5,
  },

  iconButtonText: {
    color: "#111427",
    fontSize: 25,
    fontWeight: "600",
    lineHeight: 28,
  },

  sheet: {
    marginTop: -34,
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 24,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: "#FDFBF6",
  },

  stationName: {
    color: "#121526",
    fontSize: 29,
    fontWeight: "800",
    letterSpacing: -0.8,
    marginBottom: 8,
  },

  address: {
    color: "#585A72",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 14,
  },

  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 16,
  },

  ratingGroup: {
    flexDirection: "row",
    alignItems: "center",
  },

  star: {
    color: "#F2B719",
    fontSize: 20,
    marginRight: 7,
  },

  ratingValue: {
    color: "#10162F",
    fontSize: 16,
    fontWeight: "700",
    marginRight: 5,
  },

  reviewCount: {
    color: "#54566F",
    fontSize: 14,
  },

  statusGroup: {
    flexDirection: "row",
    alignItems: "center",
  },

  statusDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    marginRight: 7,
  },

  statusText: {
    color: "#17924E",
    fontSize: 14,
    fontWeight: "700",
  },

  availableRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  availableIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F0EAFB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  availableIcon: {
    color: "#3A0EC6",
    fontSize: 17,
    fontWeight: "700",
  },

  availableText: {
    color: "#343653",
    fontSize: 16,
    fontWeight: "700",
  },

  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 10,
  },

  infoCard: {
    width: "48.5%",
    minHeight: 118,
    borderRadius: 18,
    padding: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#ECE8DF",
    flexDirection: "row",
    alignItems: "flex-start",
  },

  infoIconBox: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#EFE7FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  infoIcon: {
    color: "#3A0EC6",
    fontSize: 22,
    fontWeight: "700",
  },

  infoTextBox: {
    flex: 1,
  },

  infoLabel: {
    color: "#4F5878",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 5,
  },

  infoValue: {
    color: "#10162F",
    fontSize: 17,
    fontWeight: "800",
    lineHeight: 22,
    marginBottom: 4,
  },

  infoDescription: {
    color: "#4F5878",
    fontSize: 12,
    lineHeight: 16,
  },

  highlightCard: {
    minHeight: 90,
    borderRadius: 18,
    padding: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#ECE8DF",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  highlightIconBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#FFF7E1",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  highlightIcon: {
    color: "#E6A713",
    fontSize: 26,
  },

  highlightContent: {
    flex: 1,
  },

  highlightLabel: {
    color: "#4F5878",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 3,
  },

  highlightValue: {
    color: "#10162F",
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 3,
  },

  highlightDescription: {
    color: "#4F5878",
    fontSize: 13,
  },

  highlightArrow: {
    color: "#4F5878",
    fontSize: 32,
    marginLeft: 8,
  },

  section: {
    borderRadius: 18,
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#ECE8DF",
    marginTop: 10,
  },

  sectionTitle: {
    color: "#10162F",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 14,
  },

  connectorRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },

  connectorIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#EFE7FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  connectorIcon: {
    color: "#3A0EC6",
    fontSize: 18,
    fontWeight: "700",
  },

  connectorInfo: {
    flex: 1,
  },

  connectorName: {
    color: "#10162F",
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 3,
  },

  connectorDescription: {
    color: "#4F5878",
    fontSize: 13,
  },

  amenitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  amenityItem: {
    width: "30.8%",
    alignItems: "center",
  },

  amenityIconBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#EFE7FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 7,
  },

  amenityIcon: {
    color: "#2B0055",
    fontSize: 17,
    fontWeight: "800",
  },

  amenityLabel: {
    color: "#42455F",
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
  },

  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  seeAllText: {
    color: "#3A0EC6",
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 14,
  },

  ratingPanel: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  ratingPanelLeft: {
    width: 110,
    alignItems: "center",
  },

  bigRating: {
    color: "#10162F",
    fontSize: 42,
    fontWeight: "800",
    lineHeight: 48,
  },

  ratingStars: {
    color: "#F2B719",
    fontSize: 14,
    marginTop: 3,
    marginBottom: 6,
  },

  totalReviews: {
    color: "#4F5878",
    fontSize: 12,
  },

  ratingPanelRight: {
    flex: 1,
  },

  ratingLine: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  ratingLineLabel: {
    width: 32,
    color: "#4F5878",
    fontSize: 11,
    fontWeight: "700",
  },

  ratingTrack: {
    flex: 1,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#E8E6EC",
    marginHorizontal: 8,
    overflow: "hidden",
  },

  ratingBarLarge: {
    width: "85%",
    height: "100%",
    borderRadius: 3,
    backgroundColor: "#2B0055",
  },

  ratingBarSmall: {
    width: "10%",
    height: "100%",
    borderRadius: 3,
    backgroundColor: "#2B0055",
  },

  ratingBarTiny: {
    width: "3%",
    height: "100%",
    borderRadius: 3,
    backgroundColor: "#2B0055",
  },

  ratingBarMinimal: {
    width: "1%",
    height: "100%",
    borderRadius: 3,
    backgroundColor: "#2B0055",
  },

  ratingPercent: {
    width: 28,
    color: "#4F5878",
    fontSize: 11,
    fontWeight: "700",
    textAlign: "right",
  },

  userReviewCard: {
    flexDirection: "row",
    borderRadius: 16,
    padding: 14,
    backgroundColor: "#FCFAF4",
    borderWidth: 1,
    borderColor: "#ECE8DF",
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#EFE7FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  avatarText: {
    color: "#2B0055",
    fontSize: 14,
    fontWeight: "800",
  },

  userReviewContent: {
    flex: 1,
  },

  userName: {
    color: "#10162F",
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 2,
  },

  userStars: {
    color: "#F2B719",
    fontSize: 12,
    marginBottom: 5,
  },

  userComment: {
    color: "#4F5878",
    fontSize: 13,
    lineHeight: 18,
  },

  emptyReviewCard: {
    borderRadius: 16,
    padding: 14,
    backgroundColor: "#FCFAF4",
    borderWidth: 1,
    borderColor: "#ECE8DF",
  },

  emptyReviewTitle: {
    color: "#10162F",
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 4,
  },

  emptyReviewText: {
    color: "#4F5878",
    fontSize: 13,
    lineHeight: 18,
  },

  bottomActions: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 12,
    paddingHorizontal: 22,
    paddingBottom: 10,
    backgroundColor: "#FDFBF6",
    borderTopWidth: 1,
    borderTopColor: "#ECE8DF",
    flexDirection: "row",
    gap: 12,
  },

  secondaryActionButton: {
    flex: 1,
    height: 52,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "#2B0055",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },

  secondaryActionText: {
    color: "#2B0055",
    fontSize: 15,
    fontWeight: "800",
  },

  primaryActionButton: {
    flex: 1,
    height: 52,
    borderRadius: 18,
    backgroundColor: "#2B0055",
    alignItems: "center",
    justifyContent: "center",
  },

  primaryActionText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  fallbackContainer: {
    flex: 1,
    padding: 24,
    backgroundColor: "#F7F4EC",
    alignItems: "center",
    justifyContent: "center",
  },

  fallbackCard: {
    width: "100%",
    borderRadius: 28,
    padding: 24,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#ECE8DF",
    alignItems: "center",
  },

  fallbackIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#EFE7FF",
    color: "#2B0055",
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    lineHeight: 48,
    marginBottom: 16,
  },

  fallbackTitle: {
    color: "#10162F",
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 10,
  },

  fallbackDescription: {
    color: "#4F5878",
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 24,
  },

  primaryFallbackButton: {
    width: "100%",
    height: 52,
    borderRadius: 18,
    backgroundColor: "#2B0055",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  primaryFallbackButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  secondaryFallbackButton: {
    width: "100%",
    height: 52,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "#D8D1C3",
    alignItems: "center",
    justifyContent: "center",
  },

  secondaryFallbackButtonText: {
    color: "#10162F",
    fontSize: 15,
    fontWeight: "800",
  },

  buttonPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.97 }],
  },

  primaryButtonPressed: {
    opacity: 0.86,
    transform: [{ scale: 0.98 }],
  },

  inlineButtonPressed: {
    opacity: 0.62,
  },

  iconButtonSelected: {
    backgroundColor: "#EFE7FF",
    borderWidth: 1.5,
    borderColor: "#3A0EC6",
  },
});
