import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    backgroundColor: "#10221E",
  },

  heroContainer: {
    ...StyleSheet.absoluteFillObject,
  },

  cardContainer: {
    height: 136,
    borderRadius: 22,
  },

  imagemHero: {
    resizeMode: "cover",
  },

  imagemCard: {
    borderRadius: 22,
    resizeMode: "cover",
  },

  fallbackContainer: {
    backgroundColor: "#143B34",
  },

  escurecedor: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(8, 18, 16, 0.5)",
  },

  fallbackGlow: {
    position: "absolute",
    right: -48,
    top: -54,
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: "rgba(110, 231, 168, 0.26)",
  },

  fallbackShape: {
    position: "absolute",
    left: -36,
    bottom: -54,
    width: 260,
    height: 150,
    borderTopRightRadius: 90,
    backgroundColor: "rgba(252, 254, 250, 0.14)",
    transform: [{ rotate: "-6deg" }],
  },

  conteudo: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
  },

  conteudoHero: {
    paddingTop: 82,
    paddingHorizontal: 22,
    paddingBottom: 28,
  },

  conteudoCard: {
    padding: 18,
  },

  topo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },

  tipoPill: {
    maxWidth: "58%",
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 7,
    backgroundColor: "rgba(252, 254, 250, 0.18)",
    borderWidth: 1,
    borderColor: "rgba(252, 254, 250, 0.22)",
  },

  tipoTexto: {
    color: "#FCFEFA",
    fontSize: 12,
    fontWeight: "800",
  },

  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 7,
    backgroundColor: "rgba(252, 254, 250, 0.92)",
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },

  statusTexto: {
    color: "#10221E",
    fontSize: 11,
    fontWeight: "800",
  },

  rodape: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 14,
  },

  tituloArea: {
    flex: 1,
  },

  nome: {
    color: "#FCFEFA",
    fontSize: 21,
    fontWeight: "900",
    letterSpacing: -0.4,
    lineHeight: 25,
  },

  nomeHero: {
    fontSize: 27,
    lineHeight: 32,
  },

  legenda: {
    color: "rgba(252, 254, 250, 0.82)",
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 17,
    marginTop: 5,
  },

  potenciaBadge: {
    minWidth: 58,
    borderRadius: 18,
    paddingHorizontal: 10,
    paddingVertical: 9,
    backgroundColor: "rgba(252, 254, 250, 0.92)",
    alignItems: "center",
  },

  potenciaValor: {
    color: "#2B0055",
    fontSize: 17,
    fontWeight: "900",
    lineHeight: 20,
  },

  potenciaUnidade: {
    color: "#3F554F",
    fontSize: 10,
    fontWeight: "800",
    lineHeight: 12,
  },
});
