import React, { useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, type Href } from "expo-router";
import {
  Car,
  ChevronRight,
  Clock,
  Coffee,
  Heart,
  Map as MapIcon,
  MoreHorizontal,
  Pencil,
  Plug,
  ShieldCheck,
  ShoppingBag,
  Star,
  Store,
  Toilet,
  User,
  Wifi,
  Zap,
} from "lucide-react-native";

import { chargingStations } from "../../data";
import { LoadingOverlay, ScreenTransition } from "../../components";
import baseStyles, { colors as baseColors } from "./styles";
import { useTelaComPreferencias } from "../../hooks/useTelaComPreferencias";

type Station = (typeof chargingStations)[number];

const statusLabels = {
  available: "Aberto agora",
  busy: "Ocupado agora",
  unavailable: "Indisponível",
  maintenance: "Em manutenção",
};


function getStationDetailsRoute(stationId: string) {
  return {
    pathname: "/point-details",
    params: {
      stationId,
    },
  } as Href;
}

function openMap() {
  router.push("/map" as Href);
}

function openActivities() {
  router.push("/activities" as Href);
}

function showMoreFeedback() {
  Alert.alert(
    "Mais opções",
    "Essa área pode receber perfil, ajuda e configurações.",
  );
}

function getConnectorLabel(station: Station) {
  const firstConnector = station.connectors[0];

  return firstConnector ? firstConnector.label : "Carregador";
}

function getStatusLabel(station: Station) {
  return statusLabels[station.status] ?? "Status não informado";
}

function getDistanceLabel(station: Station) {
  if (station.distanceKm < 1) {
    return `${Math.round(station.distanceKm * 1000)} m`;
  }

  return `${station.distanceKm.toFixed(1).replace(".", ",")} km`;
}

function getStationTitle(station: Station) {
  const connectorLabel = getConnectorLabel(station);

  return `${connectorLabel} • ${station.name}`;
}

function getAmenityIcon(amenity: string) {
  switch (amenity) {
    case "restaurant":
      return ShoppingBag;
    case "coffee":
      return Coffee;
    case "restroom":
      return Toilet;
    case "parking":
      return Car;
    case "coveredArea":
      return Store;
    case "market":
      return Store;
    case "wifi":
      return Wifi;
    case "security":
      return ShieldCheck;
    default:
      return Plug;
  }
}

export default function FavoritesScreen() {
  const { styles, colors, isDarkMode } = useTelaComPreferencias(
    baseStyles,
    baseColors,
  );
  const [favoriteIds, setFavoriteIds] = useState(() =>
    chargingStations
      .filter((station) => station.isFavorite)
      .map((station) => station.id),
  );

  const [isEditing, setIsEditing] = useState(false);
  const [isOpeningDetails, setIsOpeningDetails] = useState(false);

  const favoriteStations = useMemo(() => {
    return chargingStations.filter((station) =>
      favoriteIds.includes(station.id),
    );
  }, [favoriteIds]);

  function removeFavorite(station: Station) {
    setFavoriteIds((currentIds) =>
      currentIds.filter((currentId) => currentId !== station.id),
    );

    Alert.alert(
      "Favorito removido",
      `${station.name} foi removido dos favoritos nesta simulação.`,
    );
  }

  function handleOpenStationDetails(stationId: string) {
    if (isOpeningDetails) {
      return;
    }

    setIsOpeningDetails(true);

    setTimeout(() => {
      setIsOpeningDetails(false);
      router.push(getStationDetailsRoute(stationId));
    }, 280);
  }

  function toggleEditing() {
    setIsEditing((currentValue) => !currentValue);
  }

  const hasFavorites = favoriteStations.length > 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

      <ScreenTransition style={styles.screen}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.header}>
            <Text style={styles.logo}>flui</Text>

            <Pressable style={styles.profileButton}>
              <User size={22} color={colors.primary} strokeWidth={2} />
            </Pressable>
          </View>

          <View style={styles.hero}>
            <Text style={styles.title}>Favoritos</Text>

            <Text style={styles.subtitle}>
              Seus pontos salvos para carregar quando e onde precisar.
            </Text>
          </View>

          <View style={styles.segmentedControl}>
            <Pressable
              style={[styles.segmentButton, styles.segmentButtonActive]}
            >
              <Star size={20} color={colors.white} strokeWidth={2} />

              <Text style={[styles.segmentText, styles.segmentTextActive]}>
                Favoritos
              </Text>
            </Pressable>

            <Pressable style={styles.segmentButton} onPress={openActivities}>
              <Clock size={20} color={colors.primary} strokeWidth={2} />

              <Text style={styles.segmentText}>Histórico</Text>
            </Pressable>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Seus pontos favoritos</Text>

            {hasFavorites ? (
              <Pressable style={styles.editButton} onPress={toggleEditing}>
                <Pencil size={17} color={colors.primary} strokeWidth={2} />

                <Text style={styles.editButtonText}>
                  {isEditing ? "Concluir" : "Editar"}
                </Text>
              </Pressable>
            ) : null}
          </View>

          {hasFavorites ? (
            <View style={styles.cardsList}>
              {favoriteStations.map((station) => (
                <Pressable
                  key={station.id}
                  style={({ pressed }) => [
                    styles.stationCard,
                    pressed && !isEditing ? styles.stationCardPressed : null,
                  ]}
                  onPress={
                    isEditing
                      ? undefined
                      : () => handleOpenStationDetails(station.id)
                  }
                >
                  <View style={styles.cardIconCircle}>
                    <Zap
                      size={28}
                      color={colors.primary}
                      fill={colors.primarySoft}
                      strokeWidth={2.2}
                    />
                  </View>

                  <View style={styles.cardContent}>
                    <Text style={styles.stationName} numberOfLines={1}>
                      {getStationTitle(station)}
                    </Text>

                    <Text style={styles.stationAddress} numberOfLines={1}>
                      {station.address}
                    </Text>

                    <View style={styles.statusRow}>
                      <View
                        style={[
                          styles.statusDot,
                          station.status === "maintenance"
                            ? styles.statusDotWarning
                            : null,
                        ]}
                      />

                      <Text style={styles.statusText}>
                        {getStatusLabel(station)}
                      </Text>
                    </View>

                    <View style={styles.amenitiesRow}>
                      {station.amenities.slice(0, 3).map((amenity) => {
                        const AmenityIcon = getAmenityIcon(amenity);

                        return (
                          <View
                            key={`${station.id}-${amenity}`}
                            style={styles.amenityCircle}
                          >
                            <AmenityIcon
                              size={18}
                              color={colors.text}
                              strokeWidth={2}
                            />
                          </View>
                        );
                      })}
                    </View>
                  </View>

                  <View style={styles.cardMeta}>
                    <View style={styles.metaRow}>
                      <Text style={styles.distanceText}>
                        • {getDistanceLabel(station)}
                      </Text>

                      <Star
                        size={17}
                        color={colors.yellow}
                        fill={colors.yellow}
                        strokeWidth={2}
                      />

                      <Text style={styles.ratingText}>
                        {station.rating.toFixed(1).replace(".", ",")}
                      </Text>
                    </View>

                    <View style={styles.powerRow}>
                      <Zap
                        size={14}
                        color={colors.primary}
                        fill={colors.primary}
                        strokeWidth={2}
                      />

                      <Text style={styles.powerText}>{station.powerKw} kW</Text>
                    </View>

                    <View style={styles.providerTag}>
                      <Text style={styles.providerTagText}>Flui</Text>
                    </View>

                    {isEditing ? (
                      <Pressable
                        style={styles.removeButton}
                        onPress={() => removeFavorite(station)}
                      >
                        <Text style={styles.removeButtonText}>Remover</Text>
                      </Pressable>
                    ) : (
                      <ChevronRight
                        size={23}
                        color={colors.primary}
                        strokeWidth={2.3}
                      />
                    )}
                  </View>
                </Pressable>
              ))}
            </View>
          ) : (
            <View style={styles.emptyCard}>
              <View style={styles.emptyIconCircle}>
                <Heart size={30} color={colors.primary} strokeWidth={2.2} />
              </View>

              <Text style={styles.emptyTitle}>Nenhum favorito salvo</Text>

              <Text style={styles.emptyText}>
                Os pontos marcados como favoritos aparecerão aqui para acesso
                rápido.
              </Text>

              <Pressable style={styles.emptyButton} onPress={openMap}>
                <Text style={styles.emptyButtonText}>Explorar mapa</Text>
              </Pressable>
            </View>
          )}
        </ScrollView>

        <View style={styles.tabBar}>
          <Pressable style={styles.tabItem} onPress={openMap}>
            <MapIcon size={25} color={colors.textMuted} strokeWidth={2} />

            <Text style={styles.tabLabel}>Mapa</Text>
          </Pressable>

          <Pressable style={styles.tabItem}>
            <View style={styles.activeTabIndicator} />

            <Heart size={26} color={colors.primary} strokeWidth={2.2} />

            <Text style={[styles.tabLabel, styles.tabLabelActive]}>
              Favoritos
            </Text>
          </Pressable>

          <Pressable style={styles.tabItem} onPress={openActivities}>
            <View style={styles.activityIconCircle}>
              <Zap size={15} color={colors.textMuted} strokeWidth={2} />
            </View>

            <Text style={styles.tabLabel}>Atividades</Text>
          </Pressable>

          <Pressable style={styles.tabItem} onPress={showMoreFeedback}>
            <MoreHorizontal
              size={25}
              color={colors.textMuted}
              strokeWidth={2}
            />

            <Text style={styles.tabLabel}>Mais</Text>
          </Pressable>
        </View>
      </ScreenTransition>
      <LoadingOverlay
        visible={isOpeningDetails}
        message="Abrindo detalhes..."
      />
    </SafeAreaView>
  );
}
