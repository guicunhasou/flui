import React, { useMemo, useState } from "react";
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { router, type Href, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { chargingStations } from "../../data/chargingStations";
import { styles } from "./styles";
import { LoadingOverlay, ScreenTransition } from "../../components";
import { useFluiStorage } from "../../hooks/useFluiStorage";

type Station = (typeof chargingStations)[number];

type StatusInfo = {
  label: string;
  description: string;
  color: string;
};

type RouteProvider = "google" | "waze";

function normalizeParam(value?: string | string[]) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function formatAddress(station: Station) {
  return [station.address, station.neighborhood, station.city, station.state]
    .filter(Boolean)
    .join(", ");
}

function getStatusInfo(status: Station["status"]): StatusInfo {
  if (status === "available") {
    return {
      label: "Aberto agora",
      description: "Carregadores disponíveis neste momento",
      color: "#18A957",
    };
  }

  if (status === "busy") {
    return {
      label: "Ocupado agora",
      description: "Alta procura no momento",
      color: "#D99721",
    };
  }

  if (status === "maintenance") {
    return {
      label: "Em manutenção",
      description: "Ponto temporariamente indisponível",
      color: "#D94343",
    };
  }

  return {
    label: "Status indisponível",
    description: "Não foi possível consultar a disponibilidade",
    color: "#7A7688",
  };
}

function getAmenityLabel(amenity: string) {
  const labels: Record<string, string> = {
    restaurant: "Restaurante",
    coffee: "Café",
    restroom: "Banheiro",
    parking: "Estacionamento",
    security: "Segurança",
    wifi: "Wi-Fi",
    coveredArea: "Área coberta",
    market: "Mercado",
  };

  return labels[amenity] ?? amenity;
}

function getAmenityIcon(amenity: string) {
  const icons: Record<string, string> = {
    restaurant: "⌂",
    coffee: "☕",
    restroom: "♙",
    parking: "P",
    security: "◇",
    wifi: "⌁",
    coveredArea: "⌃",
    market: "□",
  };

  return icons[amenity] ?? "•";
}

function getRatingStars(rating: number) {
  const roundedRating = Math.round(rating);

  return Array.from({ length: 5 }, (_, index) =>
    index < roundedRating ? "★" : "☆",
  ).join(" ");
}

function getRouteUrl(station: Station, provider: RouteProvider) {
  const latitude = station.latitude;
  const longitude = station.longitude;

  if (provider === "waze") {
    return `https://www.waze.com/ul?ll=${latitude},${longitude}&navigate=yes`;
  }

  return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;
}

function calcularTempoEstimadoCarga(powerKw: number) {
  if (powerKw >= 120) {
    return "20 a 35 min";
  }

  if (powerKw >= 50) {
    return "40 a 60 min";
  }

  return "1h30 ou mais";
}

function montarTextoDeRecomendacao(
  station: Station,
  carregadoresDisponiveis: number,
) {
  if (station.status === "maintenance") {
    return "Evite este ponto por enquanto";
  }

  if (carregadoresDisponiveis > 0 && station.powerKw >= 120) {
    return "Boa escolha para uma parada rápida";
  }

  if (carregadoresDisponiveis > 0) {
    return "Boa opção para recarregar com conforto";
  }

  return "Verifique a fila antes de ir";
}

function montarOrientacaoDeEspera(
  status: Station["status"],
  carregadoresDisponiveis: number,
) {
  if (status === "maintenance") {
    return "Indisponível";
  }

  if (carregadoresDisponiveis > 1) {
    return "Baixa";
  }

  if (carregadoresDisponiveis === 1) {
    return "Moderada";
  }

  return "Alta";
}

function montarPerfilDoPonto(station: Station) {
  if (station.powerKw >= 120) {
    return "Carga rápida";
  }

  if (station.amenities.length >= 4) {
    return "Parada confortável";
  }

  return "Recarga essencial";
}

export default function PointDetailsScreen() {
  const { stationId } = useLocalSearchParams<{
    stationId?: string | string[];
  }>();

  const selectedStationId = normalizeParam(stationId) ?? "station-01";

  const station = useMemo(() => {
    return chargingStations.find((item) => item.id === selectedStationId);
  }, [selectedStationId]);

  const { favoriteStationIds, isLoadingStorage, toggleFavoriteStation } =
    useFluiStorage();

  const [isLoadingAction, setIsLoadingAction] = useState(false);

  const isFavorite = station ? favoriteStationIds.includes(station.id) : false;

  async function handleToggleFavorite() {
    if (!station || isLoadingAction || isLoadingStorage) {
      return;
    }

    try {
      await toggleFavoriteStation(station.id);
    } catch {
      Alert.alert(
        "Não foi possível atualizar favoritos",
        "Tente novamente em alguns instantes.",
      );
    }
  }

  function handleOpenReview() {
    if (!station || isLoadingAction) {
      return;
    }

    const route = {
      pathname: "/review",
      params: {
        stationId: station.id,
      },
    } as Href;

    setIsLoadingAction(true);

    setTimeout(() => {
      setIsLoadingAction(false);
      router.push(route);
    }, 360);
  }

  async function openRouteInExternalApp(provider: RouteProvider) {
    if (!station) {
      return;
    }

    const hasCoordinates =
      Number.isFinite(station.latitude) && Number.isFinite(station.longitude);

    if (!hasCoordinates) {
      Alert.alert(
        "Rota indisponível",
        "Este ponto ainda não possui coordenadas cadastradas.",
      );

      return;
    }

    const url = getRouteUrl(station, provider);

    try {
      setIsLoadingAction(true);

      const canOpen = await Linking.canOpenURL(url);

      if (!canOpen) {
        Alert.alert(
          "Não foi possível abrir a rota",
          "Seu dispositivo não conseguiu abrir o aplicativo de mapas.",
        );

        return;
      }

      await Linking.openURL(url);
    } catch {
      Alert.alert(
        "Erro ao abrir rota",
        "Não foi possível abrir a rota agora. Tente novamente em alguns instantes.",
      );
    } finally {
      setIsLoadingAction(false);
    }
  }

  function handleStartRoute() {
    if (!station || isLoadingAction) {
      return;
    }

    Alert.alert(
      "Abrir rota",
      `Escolha como deseja navegar até ${station.name}.`,
      [
        {
          text: "Google Maps",
          onPress: () => openRouteInExternalApp("google"),
        },
        {
          text: "Waze",
          onPress: () => openRouteInExternalApp("waze"),
        },
        {
          text: "Cancelar",
          style: "cancel",
        },
      ],
    );
  }

  function voltarAoMapa() {
    router.replace("/map" as Href);
  }

  if (!station) {
    return (
      <SafeAreaView style={styles.fallbackContainer}>
        <View style={styles.fallbackCard}>
          <Text style={styles.fallbackIcon}>!</Text>

          <Text style={styles.fallbackTitle}>Ponto não encontrado</Text>

          <Text style={styles.fallbackDescription}>
            Não encontramos uma estação com o ID {selectedStationId}. Volte para
            o mapa e escolha outro ponto de recarga.
          </Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Voltar para o mapa"
            style={styles.primaryFallbackButton}
            onPress={voltarAoMapa}
          >
            <Text style={styles.primaryFallbackButtonText}>
              Voltar para o mapa
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Voltar ao mapa"
            style={styles.secondaryFallbackButton}
            onPress={voltarAoMapa}
          >
            <Text style={styles.secondaryFallbackButtonText}>Voltar ao mapa</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const statusInfo = getStatusInfo(station.status);

  const availableChargers = station.connectors.reduce(
    (total, connector) => total + connector.availableChargers,
    0,
  );

  const totalChargers = station.connectors.reduce(
    (total, connector) => total + connector.totalChargers,
    0,
  );

  const connectorLabels = station.connectors
    .map((connector) => connector.label)
    .join(", ");

  const lessBusyText =
    station.lessBusyPeriods.length > 0
      ? station.lessBusyPeriods.join(" ou ")
      : "Sem previsão de menor movimento";

  const tempoEstimadoCarga = calcularTempoEstimadoCarga(station.powerKw);
  const recomendacaoDoPonto = montarTextoDeRecomendacao(
    station,
    availableChargers,
  );
  const orientacaoDeEspera = montarOrientacaoDeEspera(
    station.status,
    availableChargers,
  );
  const perfilDoPonto = montarPerfilDoPonto(station);
  const comodidadesResumo = station.amenities
    .slice(0, 3)
    .map(getAmenityLabel)
    .join(", ");

  const informacoesUteis = [
    {
      id: "chegada",
      icon: "⌖",
      title: "Chegada",
      description: `${station.distanceKm} km de distância, com rota externa disponível pelo app de mapas.`,
    },
    {
      id: "espera",
      icon: "◷",
      title: "Espera estimada",
      description: `${orientacaoDeEspera}. Melhor horário: ${lessBusyText}.`,
    },
    {
      id: "conforto",
      icon: "☕",
      title: "Conforto no local",
      description: comodidadesResumo
        ? `Comodidades próximas: ${comodidadesResumo}.`
        : "Sem comodidades cadastradas no momento.",
    },
  ];

  const mainReview = station.reviews?.[0] ?? null;

  return (
    <ScreenTransition style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.hero}>
          <View style={styles.heroSky} />
          <View style={styles.heroCanopy} />
          <View style={styles.heroGround} />

          <View style={styles.chargerLarge}>
            <Text style={styles.chargerLogo}>Flui</Text>
            <Text style={styles.chargerSymbol}>⚡</Text>
          </View>

          <View style={styles.chargerSmall}>
            <Text style={styles.chargerSmallSymbol}>⚡</Text>
          </View>

          <SafeAreaView edges={["top"]} style={styles.heroActions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Voltar ao mapa"
              style={styles.iconButton}
              onPress={voltarAoMapa}
            >
              <Text style={styles.iconButtonText}>←</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
              accessibilityState={{
                selected: isFavorite,
                disabled: isLoadingAction || isLoadingStorage,
              }}
              style={styles.iconButton}
              disabled={isLoadingAction || isLoadingStorage}
              onPress={handleToggleFavorite}
            >
              <Text style={styles.iconButtonText}>
                {isFavorite ? "♥" : "♡"}
              </Text>
            </Pressable>
          </SafeAreaView>
        </View>

        <View style={styles.sheet}>
          <Text style={styles.stationName}>{station.name}</Text>

          <Text style={styles.address}>{formatAddress(station)}</Text>

          <View style={styles.summaryRow}>
            <View style={styles.ratingGroup}>
              <Text style={styles.star}>★</Text>

              <Text style={styles.ratingValue}>
                {station.rating.toFixed(1)}
              </Text>

              <Text style={styles.reviewCount}>
                ({station.reviewCount} avaliações)
              </Text>
            </View>

            <View style={styles.statusGroup}>
              <View
                accessible={false}
                style={[
                  styles.statusDot,
                  { backgroundColor: statusInfo.color },
                ]}
              />

              <Text style={styles.statusText}>{statusInfo.label}</Text>
            </View>
          </View>

          <View style={styles.availableRow}>
            <View style={styles.availableIconBox}>
              <Text style={styles.availableIcon}>⚡</Text>
            </View>

            <Text style={styles.availableText}>
              {availableChargers} de {totalChargers} carregadores disponíveis
            </Text>
          </View>

          <View style={styles.resumoMotoristaCard}>
            <Text style={styles.resumoEyebrow}>Guia do ponto</Text>
            <Text style={styles.resumoTitle}>{recomendacaoDoPonto}</Text>
            <Text style={styles.resumoDescription}>
              Compare disponibilidade, potência e conforto antes de escolher onde
              recarregar.
            </Text>

            <View style={styles.resumoInfoGrid}>
              <View style={styles.resumoInfoItem}>
                <Text style={styles.resumoInfoLabel}>Espera</Text>
                <Text style={styles.resumoInfoValue}>{orientacaoDeEspera}</Text>
              </View>

              <View style={styles.resumoInfoItem}>
                <Text style={styles.resumoInfoLabel}>Tempo</Text>
                <Text style={styles.resumoInfoValue}>{tempoEstimadoCarga}</Text>
              </View>

              <View style={styles.resumoInfoItem}>
                <Text style={styles.resumoInfoLabel}>Perfil</Text>
                <Text style={styles.resumoInfoValue}>{perfilDoPonto}</Text>
              </View>
            </View>
          </View>

          <View style={styles.infoGrid}>
            <View style={styles.infoCard}>
              <View style={styles.infoIconBox}>
                <Text style={styles.infoIcon}>⚡</Text>
              </View>

              <View style={styles.infoTextBox}>
                <Text style={styles.infoLabel}>Potência</Text>
                <Text style={styles.infoValue}>{station.powerKw} kW</Text>
                <Text style={styles.infoDescription}>Carga rápida</Text>
              </View>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoIconBox}>
                <Text style={styles.infoIcon}>⌁</Text>
              </View>

              <View style={styles.infoTextBox}>
                <Text style={styles.infoLabel}>Conectores</Text>
                <Text style={styles.infoValue}>{connectorLabels}</Text>
                <Text style={styles.infoDescription}>Tipos compatíveis</Text>
              </View>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoIconBox}>
                <Text style={styles.infoIcon}>◷</Text>
              </View>

              <View style={styles.infoTextBox}>
                <Text style={styles.infoLabel}>Funcionamento</Text>
                <Text style={styles.infoValue}>{station.openingHours}</Text>
                <Text style={styles.infoDescription}>
                  {statusInfo.description}
                </Text>
              </View>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoIconBox}>
                <Text style={styles.infoIcon}>⌖</Text>
              </View>

              <View style={styles.infoTextBox}>
                <Text style={styles.infoLabel}>Distância</Text>
                <Text style={styles.infoValue}>{station.distanceKm} km</Text>
                <Text style={styles.infoDescription}>Próximo de você</Text>
              </View>
            </View>
          </View>

          <View style={styles.highlightCard}>
            <View style={styles.highlightIconBox}>
              <Text style={styles.highlightIcon}>☼</Text>
            </View>

            <View style={styles.highlightContent}>
              <Text style={styles.highlightLabel}>Melhor horário</Text>
              <Text style={styles.highlightValue}>{lessBusyText}</Text>
              <Text style={styles.highlightDescription}>
                Período com menor movimento e espera
              </Text>
            </View>

            <Text style={styles.highlightArrow}>›</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informações úteis ao motorista</Text>

            {informacoesUteis.map((info) => (
              <View key={info.id} style={styles.informacaoUtilRow}>
                <View style={styles.informacaoUtilIconBox}>
                  <Text style={styles.informacaoUtilIcon}>{info.icon}</Text>
                </View>

                <View style={styles.informacaoUtilContent}>
                  <Text style={styles.informacaoUtilTitle}>{info.title}</Text>
                  <Text style={styles.informacaoUtilDescription}>
                    {info.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Conectores disponíveis</Text>

            {station.connectors.map((connector) => (
              <View key={connector.id} style={styles.connectorRow}>
                <View style={styles.connectorIconBox}>
                  <Text style={styles.connectorIcon}>⌁</Text>
                </View>

                <View style={styles.connectorInfo}>
                  <Text style={styles.connectorName}>{connector.label}</Text>

                  <Text style={styles.connectorDescription}>
                    {connector.powerKw} kW · {connector.availableChargers} de{" "}
                    {connector.totalChargers} disponíveis
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Comodidades próximas</Text>

            <View style={styles.amenitiesGrid}>
              {station.amenities.map((amenity) => (
                <View key={amenity} style={styles.amenityItem}>
                  <View style={styles.amenityIconBox}>
                    <Text style={styles.amenityIcon}>
                      {getAmenityIcon(amenity)}
                    </Text>
                  </View>

                  <Text style={styles.amenityLabel}>
                    {getAmenityLabel(amenity)}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.reviewHeader}>
              <Text style={styles.sectionTitle}>Avaliações de usuários</Text>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Avaliar este ponto"
                accessibilityHint="Abre a tela de avaliação do ponto de recarga."
                onPress={handleOpenReview}
              >
                <Text style={styles.seeAllText}>Avaliar</Text>
              </Pressable>
            </View>

            <View style={styles.ratingPanel}>
              <View style={styles.ratingPanelLeft}>
                <Text style={styles.bigRating}>
                  {station.rating.toFixed(1)}
                </Text>

                <Text style={styles.ratingStars}>
                  {getRatingStars(station.rating)}
                </Text>

                <Text style={styles.totalReviews}>
                  {station.reviewCount} avaliações
                </Text>
              </View>

              <View style={styles.ratingPanelRight}>
                <View style={styles.ratingLine}>
                  <Text style={styles.ratingLineLabel}>5 ★</Text>
                  <View style={styles.ratingTrack}>
                    <View style={styles.ratingBarLarge} />
                  </View>
                  <Text style={styles.ratingPercent}>85%</Text>
                </View>

                <View style={styles.ratingLine}>
                  <Text style={styles.ratingLineLabel}>4 ★</Text>
                  <View style={styles.ratingTrack}>
                    <View style={styles.ratingBarSmall} />
                  </View>
                  <Text style={styles.ratingPercent}>10%</Text>
                </View>

                <View style={styles.ratingLine}>
                  <Text style={styles.ratingLineLabel}>3 ★</Text>
                  <View style={styles.ratingTrack}>
                    <View style={styles.ratingBarTiny} />
                  </View>
                  <Text style={styles.ratingPercent}>3%</Text>
                </View>

                <View style={styles.ratingLine}>
                  <Text style={styles.ratingLineLabel}>2 ★</Text>
                  <View style={styles.ratingTrack}>
                    <View style={styles.ratingBarMinimal} />
                  </View>
                  <Text style={styles.ratingPercent}>1%</Text>
                </View>

                <View style={styles.ratingLine}>
                  <Text style={styles.ratingLineLabel}>1 ★</Text>
                  <View style={styles.ratingTrack}>
                    <View style={styles.ratingBarMinimal} />
                  </View>
                  <Text style={styles.ratingPercent}>1%</Text>
                </View>
              </View>
            </View>

            {mainReview ? (
              <View style={styles.userReviewCard}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {mainReview.userName.slice(0, 2).toUpperCase()}
                  </Text>
                </View>

                <View style={styles.userReviewContent}>
                  <Text style={styles.userName}>{mainReview.userName}</Text>

                  <Text style={styles.userStars}>
                    {getRatingStars(mainReview.rating)}
                  </Text>

                  <Text style={styles.userComment}>{mainReview.comment}</Text>
                </View>
              </View>
            ) : (
              <View style={styles.emptyReviewCard}>
                <Text style={styles.emptyReviewTitle}>
                  Ainda não há comentários recentes
                </Text>

                <Text style={styles.emptyReviewText}>
                  Seja uma das primeiras pessoas a avaliar este ponto.
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <SafeAreaView edges={["bottom"]} style={styles.bottomActions}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Ver mapa"
          accessibilityState={{ disabled: isLoadingAction }}
          style={({ pressed }) => [
            styles.secondaryActionButton,
            pressed ? styles.buttonPressed : null,
          ]}
          disabled={isLoadingAction}
          onPress={voltarAoMapa}
        >
          <Text style={styles.secondaryActionText}>Ver mapa</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Iniciar rota para ${station.name}`}
          accessibilityHint="Permite escolher Google Maps ou Waze."
          accessibilityState={{ disabled: isLoadingAction }}
          style={({ pressed }) => [
            styles.primaryActionButton,
            pressed ? styles.primaryButtonPressed : null,
          ]}
          disabled={isLoadingAction}
          onPress={handleStartRoute}
        >
          <Text style={styles.primaryActionText}>Iniciar rota</Text>
        </Pressable>
      </SafeAreaView>

      <LoadingOverlay visible={isLoadingAction} message="Preparando ação..." />
    </ScreenTransition>
  );
}
