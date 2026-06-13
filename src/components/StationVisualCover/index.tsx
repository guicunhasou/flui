import React from "react";
import { Text, View } from "react-native";

import { styles } from "./styles";

type StatusEstacao = "available" | "busy" | "unavailable" | "maintenance";

type StationVisualCoverProps = {
  nome: string;
  bairro: string;
  potenciaKw: number;
  status: StatusEstacao;
  comodidades: string[];
  variant?: "hero" | "card";
};

type PerfilVisual = {
  tipo: string;
  icone: string;
  legenda: string;
  corBase: string;
  corBloco: string;
  corDetalhe: string;
};

function normalizarTexto(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function obterNomeCurto(nome: string) {
  return nome
    .replace("Flui Station", "Flui")
    .replace("Flui Carga Rápida", "Flui")
    .replace("Eletroposto", "Eletro")
    .trim();
}

function obterPerfilVisual(
  nome: string,
  bairro: string,
  comodidades: string[],
): PerfilVisual {
  const textoBase = normalizarTexto(`${nome} ${bairro}`);

  if (textoBase.includes("shopping") || textoBase.includes("riomar")) {
    return {
      tipo: "Shopping",
      icone: "▦",
      legenda: "Parada com serviços por perto",
      corBase: "#143B34",
      corBloco: "#E8EFEA",
      corDetalhe: "#F2C94C",
    };
  }

  if (textoBase.includes("parque") || textoBase.includes("jaqueira")) {
    return {
      tipo: "Parque",
      icone: "♧",
      legenda: "Recarga perto de área verde",
      corBase: "#173C28",
      corBloco: "#DDEEDB",
      corDetalhe: "#78D48B",
    };
  }

  if (textoBase.includes("marco zero") || textoBase.includes("antigo")) {
    return {
      tipo: "Centro urbano",
      icone: "⌂",
      legenda: "Boa opção para circular pela cidade",
      corBase: "#1C314A",
      corBloco: "#E6EDF5",
      corDetalhe: "#7CCBFF",
    };
  }

  if (comodidades.includes("market") || comodidades.includes("coffee")) {
    return {
      tipo: "Bairro",
      icone: "◇",
      legenda: "Recarga prática para rotina",
      corBase: "#273A2D",
      corBloco: "#F0EFE4",
      corDetalhe: "#D8A84B",
    };
  }

  return {
    tipo: "Ponto Flui",
    icone: "⚡",
    legenda: "Estação de recarga monitorada",
    corBase: "#10221E",
    corBloco: "#EDF3EE",
    corDetalhe: "#6EE7A8",
  };
}

function obterTextoStatus(status: StatusEstacao) {
  if (status === "available") {
    return "Disponível";
  }

  if (status === "busy") {
    return "Alta procura";
  }

  if (status === "maintenance") {
    return "Manutenção";
  }

  return "Indisponível";
}

function obterCorStatus(status: StatusEstacao) {
  if (status === "available") {
    return "#18A957";
  }

  if (status === "busy") {
    return "#D99721";
  }

  if (status === "maintenance") {
    return "#D94343";
  }

  return "#7A7688";
}

export default function StationVisualCover({
  nome,
  bairro,
  potenciaKw,
  status,
  comodidades,
  variant = "card",
}: StationVisualCoverProps) {
  const perfil = obterPerfilVisual(nome, bairro, comodidades);
  const nomeCurto = obterNomeCurto(nome);
  const isHero = variant === "hero";

  return (
    <View
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.container,
        isHero ? styles.heroContainer : styles.cardContainer,
        { backgroundColor: perfil.corBase },
      ]}
    >
      <View style={styles.gradeFundo}>
        <View style={[styles.blocoMaior, { backgroundColor: perfil.corBloco }]} />
        <View style={[styles.blocoMenor, { backgroundColor: perfil.corDetalhe }]} />
        <View style={[styles.blocoBaixo, { backgroundColor: perfil.corBloco }]} />
      </View>

      <View style={styles.linhaEnergia} />
      <View style={styles.pontoEnergia} />

      <View style={styles.carregadorPrincipal}>
        <Text style={styles.raio}>⚡</Text>
        <View style={styles.telaCarregador}>
          <Text style={styles.telaTexto}>{potenciaKw}kW</Text>
        </View>
      </View>

      <View style={styles.carregadorSecundario}>
        <Text style={styles.raioSecundario}>⚡</Text>
      </View>

      <View style={styles.conteudo}>
        <View style={styles.tipoLinha}>
          <Text style={styles.tipoIcone}>{perfil.icone}</Text>
          <Text style={styles.tipoTexto}>{perfil.tipo}</Text>
        </View>

        <Text
          numberOfLines={isHero ? 2 : 1}
          style={[styles.nome, isHero ? styles.nomeHero : null]}
        >
          {nomeCurto}
        </Text>

        <Text numberOfLines={1} style={styles.legenda}>
          {perfil.legenda}
        </Text>
      </View>

      <View style={styles.statusPill}>
        <View
          style={[styles.statusDot, { backgroundColor: obterCorStatus(status) }]}
        />
        <Text style={styles.statusTexto}>{obterTextoStatus(status)}</Text>
      </View>
    </View>
  );
}
