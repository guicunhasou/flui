import { StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F8F4",
  },

  scrollContent: {
    paddingBottom: 120,
  },

  hero: {
    height: 290,
    backgroundColor: "#10221E",
    overflow: "hidden",
  },

  heroSky: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#17342E",
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
    backgroundColor: "#0F4A3A",
    borderWidth: 1,
    borderColor: "rgba(252, 254, 250, 0.28)",
    justifyContent: "space-between",
  },

  chargerLogo: {
    color: "#FCFEFA",
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
    backgroundColor: "#FCFEFA",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#080A12",
    shadowOpacity: 0.14,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    elevation: 5,
  },

  iconButtonText: {
    color: "#10221E",
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
    backgroundColor: "#FCFEFA",
  },

  stationName: {
    color: "#10221E",
    fontSize: 29,
    fontWeight: "800",
    letterSpacing: -0.8,
    marginBottom: 8,
  },

  address: {
    color: "#3F554F",
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
    color: colors.warning,
    fontSize: 20,
    marginRight: 7,
  },

  starIcon: {
    marginRight: 7,
  },

  ratingValue: {
    color: "#10221E",
    fontSize: 16,
    fontWeight: "700",
    marginRight: 5,
  },

  reviewCount: {
    color: "#63766F",
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
    color: "#1FA971",
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
    backgroundColor: "#E8F5EE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  availableIcon: {
    color: colors.primaryBright,
    fontSize: 17,
    fontWeight: "700",
  },

  availableText: {
    color: "#3F554F",
    fontSize: 16,
    fontWeight: "700",
  },

  resumoMotoristaCard: {
    borderRadius: 22,
    padding: 16,
    backgroundColor: "#EEF7F1",
    borderWidth: 1,
    borderColor: "#CFE8D9",
    marginBottom: 12,
  },

  alcanceBanner: {
    minHeight: 52,
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  alcanceBannerText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: -0.1,
  },

  resumoEyebrow: {
    color: colors.primaryBright,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginBottom: 6,
    textTransform: "uppercase",
  },

  resumoTitle: {
    color: "#10221E",
    fontSize: 20,
    fontWeight: "800",
    lineHeight: 25,
    marginBottom: 6,
  },

  resumoDescription: {
    color: "#3F554F",
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 14,
  },

  resumoInfoGrid: {
    flexDirection: "row",
    gap: 10,
  },

  resumoInfoItem: {
    flex: 1,
    minHeight: 74,
    borderRadius: 16,
    padding: 10,
    backgroundColor: "#FCFEFA",
    borderWidth: 1,
    borderColor: "#DDE8E3",
    justifyContent: "center",
  },

  resumoInfoLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 5,
  },

  resumoInfoLabel: {
    color: "#63766F",
    fontSize: 11,
    fontWeight: "700",
  },

  resumoInfoValue: {
    color: "#10221E",
    fontSize: 13,
    fontWeight: "800",
    lineHeight: 17,
  },

  infoGrid: {
    gap: 14,
    marginBottom: 14,
  },

  infoRow: {
    flexDirection: "row",
    gap: 12,
  },

  infoCard: {
    flex: 1,
    minWidth: 0,
    minHeight: 118,
    borderRadius: 18,
    padding: 14,
    backgroundColor: "#FCFEFA",
    borderWidth: 1,
    borderColor: "#DDE8E3",
    alignItems: "flex-start",
  },

  infoIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EAF1FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  infoIcon: {
    color: colors.primaryBright,
    fontSize: 22,
    fontWeight: "700",
  },

  infoTextBox: {
    width: "100%",
  },

  infoLabel: {
    color: "#3F554F",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 5,
  },

  infoValue: {
    color: "#10221E",
    fontSize: 17,
    fontWeight: "800",
    lineHeight: 22,
    marginBottom: 4,
  },

  infoDescription: {
    color: "#3F554F",
    fontSize: 12,
    lineHeight: 16,
  },

  highlightCard: {
    minHeight: 90,
    borderRadius: 18,
    padding: 14,
    backgroundColor: "#FCFEFA",
    borderWidth: 1,
    borderColor: "#DDE8E3",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  highlightIconBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#FFF2C7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  highlightIcon: {
    color: "#D99A10",
    fontSize: 26,
  },

  highlightContent: {
    flex: 1,
  },

  highlightLabel: {
    color: "#3F554F",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 3,
  },

  highlightValue: {
    color: "#10221E",
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 3,
  },

  highlightDescription: {
    color: "#3F554F",
    fontSize: 13,
  },

  highlightArrow: {
    color: "#3F554F",
    fontSize: 32,
    marginLeft: 8,
  },

  section: {
    borderRadius: 18,
    padding: 16,
    backgroundColor: "#FCFEFA",
    borderWidth: 1,
    borderColor: "#DDE8E3",
    marginTop: 10,
  },

  sectionTitle: {
    color: "#10221E",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 14,
  },

  informacaoUtilRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 10,
  },

  informacaoUtilIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#E8F5EE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  informacaoUtilIcon: {
    color: "#1FA971",
    fontSize: 17,
    fontWeight: "800",
  },

  informacaoUtilContent: {
    flex: 1,
  },

  informacaoUtilTitle: {
    color: "#10221E",
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 3,
  },

  informacaoUtilDescription: {
    color: "#3F554F",
    fontSize: 13,
    lineHeight: 18,
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
    backgroundColor: "#EAF1FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  connectorIcon: {
    color: colors.primaryBright,
    fontSize: 18,
    fontWeight: "700",
  },

  connectorInfo: {
    flex: 1,
  },

  connectorName: {
    color: "#10221E",
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 3,
  },

  connectorDescription: {
    color: "#3F554F",
    fontSize: 13,
  },

  amenitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    rowGap: 16,
    columnGap: 10,
  },

  amenityItem: {
    width: 92,
    alignItems: "center",
  },

  amenityIconBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#EAF1FF",
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
    color: "#3F554F",
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
    color: colors.primaryBright,
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
    color: "#10221E",
    fontSize: 42,
    fontWeight: "800",
    lineHeight: 48,
  },

  ratingStars: {
    color: colors.warning,
    fontSize: 14,
    marginTop: 3,
    marginBottom: 6,
  },

  totalReviews: {
    color: "#3F554F",
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
    color: "#3F554F",
    fontSize: 11,
    fontWeight: "700",
  },

  ratingTrack: {
    flex: 1,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#DDE8E3",
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
    color: "#3F554F",
    fontSize: 11,
    fontWeight: "700",
    textAlign: "right",
  },

  userReviewsList: {
    gap: 12,
  },

  userReviewCard: {
    flexDirection: "row",
    borderRadius: 16,
    padding: 14,
    backgroundColor: "#FCFEFA",
    borderWidth: 1,
    borderColor: "#DDE8E3",
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#EAF1FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  avatarText: {
    color: "#2B0055",
    fontSize: 14,
    fontWeight: "800",
  },

  avatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#DDE8E3",
    backgroundColor: "#EAF1FF",
  },

  userReviewContent: {
    flex: 1,
  },

  userName: {
    color: "#10221E",
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 2,
  },

  userStars: {
    color: colors.warning,
    fontSize: 12,
    marginBottom: 5,
  },

  userComment: {
    color: "#3F554F",
    fontSize: 13,
    lineHeight: 18,
  },

  emptyReviewCard: {
    borderRadius: 16,
    padding: 14,
    backgroundColor: "#FCFEFA",
    borderWidth: 1,
    borderColor: "#DDE8E3",
  },

  emptyReviewTitle: {
    color: "#10221E",
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 4,
  },

  emptyReviewText: {
    color: "#3F554F",
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
    backgroundColor: "#FCFEFA",
    borderTopWidth: 1,
    borderTopColor: "#DDE8E3",
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
    backgroundColor: "#FCFEFA",
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
    color: "#FCFEFA",
    fontSize: 15,
    fontWeight: "800",
  },

  fallbackContainer: {
    flex: 1,
    padding: 24,
    backgroundColor: "#F3F8F4",
    alignItems: "center",
    justifyContent: "center",
  },

  fallbackCard: {
    width: "100%",
    borderRadius: 28,
    padding: 24,
    backgroundColor: "#FCFEFA",
    borderWidth: 1,
    borderColor: "#DDE8E3",
    alignItems: "center",
  },

  fallbackIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#EAF1FF",
    color: "#2B0055",
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    lineHeight: 48,
    marginBottom: 16,
  },

  fallbackTitle: {
    color: "#10221E",
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 10,
  },

  fallbackDescription: {
    color: "#3F554F",
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
    color: "#FCFEFA",
    fontSize: 15,
    fontWeight: "800",
  },

  secondaryFallbackButton: {
    width: "100%",
    height: 52,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "#BBD0C7",
    alignItems: "center",
    justifyContent: "center",
  },

  secondaryFallbackButtonText: {
    color: "#10221E",
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

  iconButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.94 }],
  },

  hoverFeedback: {
    opacity: 0.92,
  },

  iconButtonSelected: {
    backgroundColor: "#EAF1FF",
    borderWidth: 1.5,
    borderColor: colors.primaryBright,
  },
});
