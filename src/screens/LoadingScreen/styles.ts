import { StyleSheet } from "react-native";

export const colors = {
  background: "#FCFEFA",
  text: "#10221E",
  textMuted: "#3F554F",
  primary: "#2B0055",
  accent: "#9B35F5",
  primarySoft: "#EFE4FA",
  shadow: "#12302A",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingContent: {
    width: "100%",
    paddingHorizontal: 32,
    alignItems: "center",
    justifyContent: "center",
  },

  logoStage: {
    width: 144,
    height: 144,
    alignItems: "center",
    justifyContent: "center",
  },

  pulseHalo: {
    position: "absolute",
    width: 118,
    height: 118,
    borderRadius: 59,
    backgroundColor: colors.primarySoft,
  },

  logoCard: {
    width: 92,
    height: 92,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 8,
  },

  copyArea: {
    marginTop: 22,
    alignItems: "center",
  },

  title: {
    color: colors.text,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "900",
    letterSpacing: -0.4,
    textAlign: "center",
  },

  subtitle: {
    maxWidth: 290,
    marginTop: 8,
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "600",
    textAlign: "center",
  },

  progressDots: {
    marginTop: 28,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },
});

export default styles;
