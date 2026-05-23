import { StyleSheet } from "react-native";

export const colors = {
  background: "#F7F4EC",
  white: "#FFFFFF",
  text: "#10162F",
  textMuted: "#4F5878",
  textLight: "#7C829A",
  primary: "#2B0055",
  primarySoft: "#EFE7FF",
  primarySoftStrong: "#E0D1FF",
  yellow: "#FFF4CC",
  yellowDark: "#F3B512",
  border: "#ECE8DF",
  shadow: "#1E1230",
  dangerSoft: "#FFF0F0",
  success: "#23B24B",
  successSoft: "#EAF8EF",
};

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

const styles = StyleSheet.create({
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
    fontSize: 18,
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
    paddingBottom: 30,
  },

  profileCard: {
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
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.25,
  },

  profileText: {
    marginTop: 5,
    color: colors.textMuted,
    fontSize: 13.5,
    fontWeight: "500",
    lineHeight: 19,
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
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.3,
  },

  statLabel: {
    marginTop: 3,
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "700",
  },

  segmentedControl: {
    marginTop: 18,
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
    fontSize: 13.5,
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
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.35,
  },

  sectionText: {
    marginTop: 6,
    color: colors.textMuted,
    fontSize: 13.5,
    fontWeight: "500",
    lineHeight: 20,
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
    fontSize: 15,
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
    fontSize: 12.5,
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
    fontSize: 12,
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
    fontSize: 14.5,
    fontWeight: "800",
    letterSpacing: -0.1,
  },

  reviewText: {
    marginTop: 4,
    color: colors.textMuted,
    fontSize: 12.5,
    fontWeight: "600",
  },

  logoutButton: {
    height: 56,
    marginTop: 22,
    borderRadius: 20,
    backgroundColor: colors.dangerSoft,
    borderWidth: 1,
    borderColor: "#F5D5D5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },

  logoutText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "800",
  },

  easterEgg: {
    marginTop: 42,
    marginBottom: 28,
    alignItems: "center",
    opacity: 0.72,
  },

  easterEggText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 20,
    textAlign: "center",
  },

  easterEggHighlight: {
    color: colors.primary,
    fontWeight: "900",
  },

  easterEggSubtext: {
    color: colors.textLight,
    fontSize: 12.5,
    fontWeight: "600",
    lineHeight: 19,
    textAlign: "center",
    paddingTop: 4,
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

  feedbackToastIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    overflow: "hidden",
    backgroundColor: colors.primarySoft,
    color: colors.primary,
    fontSize: 14,
    fontWeight: "900",
    lineHeight: 22,
    textAlign: "center",
  },

  feedbackToastText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: -0.1,
  },
});

export default styles;
