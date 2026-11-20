import { presentationImages } from "../presentation/presentationImages";
import { OfflineImage as Image } from "../../offline/OfflineImage";
import React, {
  useCallback,
  useMemo,
  useState,
} from "react";
import { ScrollView, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, type Href, useFocusEffect } from "expo-router";
import {
  ArrowLeft,
  CalendarClock,
  ChevronRight,
  Heart,
  History,
  MapPin,
  Settings as SettingsIcon,
  Star,
  Zap,
} from "lucide-react-native";

import { identificacaoDados } from "../../data/identificacaoDados";
import { chargingStations } from "../../data";
import { PressableScale, ScreenTransition } from "../../components";
import { useFluiStorage } from "../../hooks/useFluiStorage";
import { useAppPreferences } from "../../context/PreferencesContext";
import { createProfileStyles } from "./ProfileScreen.styles";

type ProfileTab = "favorites" | "history";
type Station = (typeof chargingStations)[number];


const toRecord = (value: unknown): Record<string, unknown> => {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : {};
};

const readString = (source: unknown, key: string, fallback = "") => {
  const value = toRecord(source)[key];
  return typeof value === "string" ? value : fallback;
};

const readNumber = (source: unknown, key: string, fallback = 0) => {
  const value = toRecord(source)[key];
  return typeof value === "number" ? value : fallback;
};

const getStationId = (station: unknown, index: number) => {
  return readString(
    station,
    "stationId",
    readString(station, "id", `station-${String(index + 1).padStart(2, "0")}`),
  );
};

const getStationName = (station: unknown) => {
  return readString(
    station,
    "stationName",
    readString(
      station,
      "name",
      readString(station, "title", "Ponto de recarga"),
    ),
  );
};

const getStationAddress = (station: unknown) => {
  return readString(
    station,
    "address",
    readString(station, "location", "Endereço não informado"),
  );
};

const getStationRating = (station: unknown) => {
  const rating = readNumber(
    station,
    "rating",
    readNumber(station, "averageRating", 4.8),
  );

  return rating.toFixed(1).replace(".", ",");
};

const getStationPower = (station: unknown) => {
  const power = readNumber(
    station,
    "powerKw",
    readNumber(station, "powerKW", readNumber(station, "maxPowerKw", 0)),
  );

  return power > 0 ? `${power} kW` : "-- kW";
};

const isStation = (station?: Station): station is Station => {
  return Boolean(station);
};

const formatarDataCurta = (value: unknown) => {
  if (typeof value !== "string" || value.trim().length === 0) {
    return "Avaliação salva";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Avaliação salva";
  }

  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
};

export default function ProfileScreen() {
  const { theme, fontScale, appearanceMode, userPreferences, demoOrigin, presentationState, demoStations } = useAppPreferences();

  const scenarioConfig = __DEV__ && presentationState.enabled ? presentationState.config : null;
  const nomeMotorista = scenarioConfig?.driverName ?? "Caio Duarte";
  const imagemPerfilUsuario = presentationImages[scenarioConfig?.profileImage ?? "profile1"];
  const imagemCarroUsuario = presentationImages[scenarioConfig?.vehicleImage ?? "car1"];

  const styles = useMemo(
    () => createProfileStyles(theme, fontScale),
    [theme, fontScale],
  );

  const isDarkMode = appearanceMode === "dark";

  const [activeTab, setActiveTab] = useState<ProfileTab>("favorites");
  const {
    favoriteStationIds,
    sentReviews,
    recentHistory,
    storageError,
    isLoadingStorage,
    reloadStorage,
  } = useFluiStorage();

  const storageCount = (count: number) => count > 0 ? count : isLoadingStorage ? "…" : storageError ? "—" : count;

  useFocusEffect(
    useCallback(() => {
      void reloadStorage();
    }, [reloadStorage]),
  );

  const stationsById = useMemo(() => {
    return new Map(demoStations.map((station) => [station.id, station]));
  }, [demoStations]);

  const favoriteStations = useMemo(() => {
    return favoriteStationIds
      .map((stationId) => stationsById.get(stationId))
      .filter(isStation);
  }, [favoriteStationIds, stationsById]);

  const recentStations = useMemo(() => {
    return recentHistory.map((historyItem) => {
      return stationsById.get(historyItem.stationId) ?? historyItem;
    });
  }, [recentHistory, stationsById]);

  const reviewedStations = useMemo(() => {
    return sentReviews.map((review) => {
      return {
        review,
        station: stationsById.get(review.stationId),
      };
    });
  }, [sentReviews, stationsById]);

  const openSettingsScreen = () => {
    router.push("/settings" as Href);
  };

  const openStationDetails = (stationId: string) => {
    const route = {
      pathname: "/point-details",
      params: {
        stationId,
      },
    } as Href;

    router.push(route);
  };

  const renderEmptyCard = (
    icon: React.ReactNode,
    title: string,
    description: string,
  ) => {
    return (
      <View style={styles.stationCard}>
        <View style={styles.stationIconBox}>{icon}</View>

        <View style={styles.stationInfo}>
          <Text style={styles.stationName}>{title}</Text>
          <Text style={styles.sectionText}>{description}</Text>
        </View>
      </View>
    );
  };

  const renderStationCard = (
    station: unknown,
    index: number,
    variant: "favorite" | "history",
  ) => {
    const stationId = getStationId(station, index);
    const stationName = getStationName(station);
    const stationAddress = getStationAddress(station);
    const rating = getStationRating(station);
    const power = getStationPower(station);

    return (
      <PressableScale
        key={`${variant}-${stationId}-${index}`}
        accessibilityRole="button"
        accessibilityLabel={`${stationName}. ${stationAddress}. Nota ${rating}. Potência ${power}.`}
        accessibilityHint="Abre a ficha detalhada do ponto de recarga."
        style={styles.stationCard}
        onPress={() => openStationDetails(stationId)}
      >
        <View style={styles.stationIconBox}>
          {variant === "favorite" ? (
            <Heart
              size={21}
              color={theme.primary}
              fill={theme.primarySoftStrong}
              strokeWidth={2.1}
            />
          ) : (
            <CalendarClock size={21} color={theme.primary} strokeWidth={2.1} />
          )}
        </View>

        <View style={styles.stationInfo}>
          <Text style={styles.stationName} numberOfLines={1}>
            {stationName}
          </Text>

          <View style={styles.stationAddressRow}>
            <MapPin size={13} color={theme.textMuted} strokeWidth={2} />
            <Text style={styles.stationAddress} numberOfLines={1}>
              {stationAddress}
            </Text>
          </View>

          <View style={styles.stationMetaRow}>
            <View style={styles.metaPill}>
              <Star
                size={13}
                color={theme.yellowDark}
                fill={theme.yellowDark}
                strokeWidth={2}
              />
              <Text style={styles.metaPillText}>{rating}</Text>
            </View>

            <View style={styles.metaPill}>
              <Zap
                size={13}
                color={theme.primary}
                fill={theme.primary}
                strokeWidth={2}
              />
              <Text style={styles.metaPillText}>{power}</Text>
            </View>
          </View>
        </View>

        <ChevronRight size={22} color={theme.primary} strokeWidth={2.2} />
      </PressableScale>
    );
  };

  const renderReviewCard = (
    reviewData: (typeof reviewedStations)[number],
    index: number,
  ) => {
    const { review, station } = reviewData;
    const stationId = review.stationId;
    const stationName = station?.name ?? "Ponto avaliado";
    const rating = review.rating.toFixed(1).replace(".", ",");
    const comment = review.comment.trim();
    const reviewText =
      comment.length > 0
        ? comment
        : `${formatarDataCurta(review.createdAt)} • avaliação salva`;

    return (
      <PressableScale
        key={`review-${stationId}-${review.id ?? index}`}
        accessibilityRole="button"
        accessibilityLabel={`Avaliação de ${stationName}. Nota ${rating} estrelas.`}
        accessibilityHint="Abre a ficha detalhada do ponto avaliado."
        style={styles.reviewCard}
        onPress={() => openStationDetails(stationId)}
      >
        <View style={styles.reviewIconBox}>
          <Star
            size={19}
            color={theme.yellowDark}
            fill={theme.yellowDark}
            strokeWidth={2}
          />
        </View>

        <View style={styles.reviewInfo}>
          <Text style={styles.reviewStation} numberOfLines={1}>
            {stationName}
          </Text>

          <Text style={styles.reviewText} numberOfLines={2}>
            {rating} estrelas • {reviewText}
          </Text>
        </View>

        <ChevronRight size={21} color={theme.primary} strokeWidth={2.2} />
      </PressableScale>
    );
  };

  const stationsToRender =
    activeTab === "favorites" ? favoriteStations : recentStations;

  const emptyContent =
    activeTab === "favorites"
      ? renderEmptyCard(
          <Heart size={21} color={theme.primary} strokeWidth={2.1} />,
          "Nenhum favorito salvo",
          "Toque no coração de uma estação para montar sua lista de pontos preferidos.",
        )
      : renderEmptyCard(
          <History size={21} color={theme.primary} strokeWidth={2.1} />,
          "Histórico vazio",
          "Ao abrir detalhes de pontos de recarga, eles aparecem aqui para consulta rápida.",
        );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

      <ScreenTransition style={styles.screen}>
        <View style={styles.header}>
          <PressableScale
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={22} color={theme.primary} strokeWidth={2.2} />
          </PressableScale>

          <Text style={styles.headerTitle}>Perfil</Text>

          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <View style={styles.profileHeader} accessible accessibilityLabel={`Perfil fictício: ${nomeMotorista}. ${userPreferences.vehicleName}. Autonomia informada: ${userPreferences.vehicleRangeKm} km. Origem da simulação: ${demoOrigin.nome}. Imagens ilustrativas.`}>
            <View style={styles.profileHeroCard}>
              <Image
                source={imagemCarroUsuario}
                accessibilityLabel="Imagem ilustrativa de veículo"
                style={styles.profileHeroImage}
                resizeMode="cover"
              />
            </View>

            <View style={styles.profileAvatarWrap}>
              <Image
                source={imagemPerfilUsuario}
                style={styles.profileAvatar}
                resizeMode="cover"
              />
            </View>

            <Text style={styles.profileName}>{nomeMotorista}</Text>
            <Text style={styles.profileVehicle}>{userPreferences.vehicleName}</Text>
          </View>

          {storageError ? (
            <View style={styles.errorCard}>
              <Text accessibilityRole="alert" style={styles.errorText}>{storageError}</Text>
              <PressableScale accessibilityRole="button" accessibilityLabel="Tentar carregar dados locais novamente" style={{ minHeight: 44, justifyContent: "center", marginTop: 6 }} onPress={() => void reloadStorage()}>
                <Text style={{ color: theme.primary, fontWeight: "700" }}>Tentar novamente</Text>
              </PressableScale>
            </View>
          ) : null}

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{storageCount(favoriteStations.length)}</Text>
              <Text style={styles.statLabel}>favoritos</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{storageCount(recentStations.length)}</Text>
              <Text style={styles.statLabel}>histórico</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{storageCount(reviewedStations.length)}</Text>
              <Text style={styles.statLabel}>avaliações</Text>
            </View>
          </View>

          <View style={styles.profileActionsRow}>
            <View style={styles.profileActionItem}>
              <PressableScale
                accessibilityRole="button"
                accessibilityLabel="Abrir configurações"
                style={styles.settingsButton}
                onPress={openSettingsScreen}
              >
                <SettingsIcon
                  size={19}
                  color={theme.warningText}
                  strokeWidth={2.1}
                />
                <Text style={styles.profileActionText}>Configurações</Text>
              </PressableScale>
            </View>

          </View>

          <View style={styles.segmentedControl}>
            <View style={styles.segmentItem}>
              <PressableScale
                accessibilityRole="button"
                accessibilityLabel="Mostrar favoritos"
                accessibilityState={{ selected: activeTab === "favorites" }}
                style={[
                  styles.segmentButton,
                  activeTab === "favorites" ? styles.segmentButtonActive : null,
                ]}
                onPress={() => setActiveTab("favorites")}
              >
                <Heart
                  size={18}
                  color={
                    activeTab === "favorites" ? theme.white : theme.primary
                  }
                  strokeWidth={2.1}
                />

                <Text
                  style={[
                    styles.segmentText,
                    activeTab === "favorites" ? styles.segmentTextActive : null,
                  ]}
                >
                  Favoritos
                </Text>
              </PressableScale>
            </View>

            <View style={styles.segmentItem}>
              <PressableScale
                accessibilityRole="button"
                accessibilityLabel="Mostrar histórico"
                accessibilityState={{ selected: activeTab === "history" }}
                style={[
                  styles.segmentButton,
                  activeTab === "history" ? styles.segmentButtonActive : null,
                ]}
                onPress={() => setActiveTab("history")}
              >
                <History
                  size={18}
                  color={activeTab === "history" ? theme.white : theme.primary}
                  strokeWidth={2.1}
                />

                <Text
                  style={[
                    styles.segmentText,
                    activeTab === "history" ? styles.segmentTextActive : null,
                  ]}
                >
                  Histórico
                </Text>
              </PressableScale>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {activeTab === "favorites"
                ? "Pontos favoritos"
                : "Últimos pontos vistos"}
            </Text>

            <Text style={styles.sectionText}>
              {activeTab === "favorites"
                ? "Sua seleção de estações para consultar antes de sair."
                : "Pontos acessados recentemente para você não perder o caminho."}
            </Text>

            <View style={styles.cardsList}>
              {stationsToRender.length > 0
                ? stationsToRender.map((station, index) =>
                    renderStationCard(
                      station,
                      index,
                      activeTab === "favorites" ? "favorite" : "history",
                    ),
                  )
                : isLoadingStorage ? <Text accessibilityLiveRegion="polite" style={styles.sectionText}>Carregando dados salvos…</Text>
                : storageError ? null : emptyContent}
            </View>
          </View>

          {activeTab === "history" ? (
            <View style={styles.reviewsHeader}>
              <Text style={styles.sectionTitle}>Avaliações locais</Text>

              <Text style={styles.sectionText}>
                {identificacaoDados.avaliacoesLocais.aviso}
              </Text>

              <View style={styles.cardsList}>
                {reviewedStations.length > 0
                  ? reviewedStations.map(renderReviewCard)
                  : isLoadingStorage ? <Text style={styles.sectionText}>Carregando avaliações salvas…</Text>
                  : storageError ? null : renderEmptyCard(
                      <Star
                        size={21}
                        color={theme.primary}
                        strokeWidth={2.1}
                      />,
                      "Nenhuma avaliação ainda",
                      "Depois de avaliar uma estação, seu registro aparece aqui.",
                    )}
              </View>
            </View>
          ) : null}
        </ScrollView>
      </ScreenTransition>
    </SafeAreaView>
  );
}
