import { StyleSheet } from "react-native";

export const colors = {
  background: "#FCFEFA",
  text: "#10221E",
  textMuted: "#3F554F",
  primary: "#2B0055",
  accent: "#9B35F5",
  shadow: "#12302A",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },

  animationWrapper: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  animation: {
    width: 220,
    aspectRatio: 1,
  },

  captionArea: {
    position: "absolute",
    bottom: 96,
    left: 32,
    right: 32,
    alignItems: "center",
  },

  captionText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default styles;
