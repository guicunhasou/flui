import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },

  heroContainer: {
    ...StyleSheet.absoluteFillObject,
  },

  cardContainer: {
    height: 136,
    borderRadius: 22,
  },

  gradeFundo: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.92,
  },

  blocoMaior: {
    position: "absolute",
    left: -32,
    right: 90,
    bottom: -12,
    height: 104,
    borderTopRightRadius: 42,
    opacity: 0.22,
    transform: [{ rotate: "-4deg" }],
  },

  blocoMenor: {
    position: "absolute",
    right: 34,
    bottom: 52,
    width: 82,
    height: 62,
    borderRadius: 20,
    opacity: 0.24,
    transform: [{ rotate: "8deg" }],
  },

  blocoBaixo: {
    position: "absolute",
    left: 46,
    right: -24,
    bottom: -38,
    height: 92,
    borderTopLeftRadius: 46,
    opacity: 0.16,
  },

  linhaEnergia: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 70,
    height: 2,
    backgroundColor: "rgba(252, 254, 250, 0.22)",
  },

  pontoEnergia: {
    position: "absolute",
    right: 96,
    bottom: 63,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#FCFEFA",
    opacity: 0.82,
  },

  carregadorPrincipal: {
    position: "absolute",
    right: 68,
    bottom: 42,
    width: 58,
    height: 126,
    borderRadius: 16,
    padding: 10,
    backgroundColor: "rgba(252, 254, 250, 0.92)",
    borderWidth: 1,
    borderColor: "rgba(252, 254, 250, 0.58)",
    justifyContent: "space-between",
    shadowColor: "#080A12",
    shadowOpacity: 0.16,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    elevation: 6,
  },

  raio: {
    color: "#10221E",
    fontSize: 24,
    fontWeight: "800",
  },

  telaCarregador: {
    minHeight: 28,
    borderRadius: 9,
    backgroundColor: "#10221E",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },

  telaTexto: {
    color: "#FCFEFA",
    fontSize: 10,
    fontWeight: "800",
  },

  carregadorSecundario: {
    position: "absolute",
    right: 138,
    bottom: 42,
    width: 42,
    height: 82,
    borderRadius: 13,
    backgroundColor: "rgba(252, 254, 250, 0.68)",
    alignItems: "center",
    justifyContent: "center",
  },

  raioSecundario: {
    color: "#2166F3",
    fontSize: 20,
    fontWeight: "800",
  },

  conteudo: {
    position: "absolute",
    left: 22,
    right: 150,
    bottom: 30,
  },

  tipoLinha: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "rgba(252, 254, 250, 0.16)",
    marginBottom: 10,
  },

  tipoIcone: {
    color: "#FCFEFA",
    fontSize: 13,
    fontWeight: "800",
  },

  tipoTexto: {
    color: "#FCFEFA",
    fontSize: 12,
    fontWeight: "800",
  },

  nome: {
    color: "#FCFEFA",
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: -0.4,
    lineHeight: 24,
  },

  nomeHero: {
    fontSize: 25,
    lineHeight: 30,
  },

  legenda: {
    color: "rgba(252, 254, 250, 0.78)",
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 17,
    marginTop: 5,
  },

  statusPill: {
    position: "absolute",
    top: 76,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 7,
    backgroundColor: "rgba(252, 254, 250, 0.9)",
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
});
