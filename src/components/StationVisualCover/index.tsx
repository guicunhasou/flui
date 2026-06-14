import React from "react";
import {
  ImageBackground,
  type ImageSourcePropType,
  Text,
  View,
} from "react-native";

import { styles } from "./styles";

type StatusEstacao = "available" | "busy" | "unavailable" | "maintenance";

type StationVisualCoverProps = {
  nome: string;
  bairro: string;
  potenciaKw: number;
  status: StatusEstacao;
  comodidades: string[];
  imageUrl?: string;
  imageSource?: ImageSourcePropType;
  variant?: "hero" | "card";
};

function normalizarTexto(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function obterNomeCurto(nome: string) {
  return nome
    .replace("Flui Hub", "Flui")
    .replace("Flui Express", "Flui")
    .replace("Flui Vila Mariana", "Flui")
    .replace("Estação", "")
    .trim();
}

function obterPerfilVisual(nome: string, bairro: string, comodidades: string[]) {
  const textoBase = normalizarTexto(`${nome} ${bairro}`);

  if (
    textoBase.includes("paulista") ||
    textoBase.includes("masp") ||
    textoBase.includes("consolacao") ||
    textoBase.includes("jardins")
  ) {
    return {
      tipo: "Hub urbano",
      legenda: "Recarga próxima à Av. Paulista",
    };
  }

  if (
    textoBase.includes("lins") ||
    textoBase.includes("aclimacao") ||
    textoBase.includes("vila mariana") ||
    textoBase.includes("paraiso")
  ) {
    return {
      tipo: "Rota FIAP",
      legenda: "Ponto estratégico perto da FIAP",
    };
  }

  if (comodidades.includes("market")) {
    return {
      tipo: "Parada de rotina",
      legenda: "Boa opção para resolver compras rápidas",
    };
  }

  if (comodidades.includes("coffee")) {
    return {
      tipo: "Café e carga",
      legenda: "Recarga com serviços por perto",
    };
  }

  return {
    tipo: "Ponto Flui",
    legenda: "Estação de recarga monitorada",
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
  imageUrl,
  imageSource,
  variant = "card",
}: StationVisualCoverProps) {
  const perfil = obterPerfilVisual(nome, bairro, comodidades);
  const nomeCurto = obterNomeCurto(nome);
  const isHero = variant === "hero";
  const source = imageSource ?? (imageUrl ? { uri: imageUrl } : undefined);

  const conteudo = (
    <>
      <View style={styles.escurecedor} />

      {!source ? (
        <>
          <View style={styles.fallbackGlow} />
          <View style={styles.fallbackShape} />
        </>
      ) : null}

      <View
        style={[
          styles.conteudo,
          isHero ? styles.conteudoHero : styles.conteudoCard,
        ]}
      >
        <View style={styles.topo}>
          <View style={styles.tipoPill}>
            <Text style={styles.tipoTexto}>{perfil.tipo}</Text>
          </View>

          <View style={styles.statusPill}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: obterCorStatus(status) },
              ]}
            />
            <Text style={styles.statusTexto}>{obterTextoStatus(status)}</Text>
          </View>
        </View>

        <View style={styles.rodape}>
          <View style={styles.tituloArea}>
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

          <View style={styles.potenciaBadge}>
            <Text style={styles.potenciaValor}>{potenciaKw}</Text>
            <Text style={styles.potenciaUnidade}>kW</Text>
          </View>
        </View>
      </View>
    </>
  );

  if (source) {
    return (
      <ImageBackground
        accessible={false}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        source={source}
        resizeMode="cover"
        imageStyle={isHero ? styles.imagemHero : styles.imagemCard}
        style={[
          styles.container,
          isHero ? styles.heroContainer : styles.cardContainer,
        ]}
      >
        {conteudo}
      </ImageBackground>
    );
  }

  return (
    <View
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.container,
        styles.fallbackContainer,
        isHero ? styles.heroContainer : styles.cardContainer,
      ]}
    >
      {conteudo}
    </View>
  );
}
