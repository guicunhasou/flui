import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
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
  LogOut,
  Map as MapIcon,
  MapPin,
  Search,
  Settings as SettingsIcon,
  Star,
  User,
  Zap,
} from "lucide-react-native";

import { chargingStations } from "../../data";
import { PressableScale, ScreenTransition } from "../../components";
import { useFluiStorage } from "../../hooks/useFluiStorage";
import { useAppPreferences } from "../../context/PreferencesContext";
import { createProfileStyles } from "./styles";

type ProfileTab = "favorites" | "history";
type Station = (typeof chargingStations)[number];

const FEEDBACK_DURATION = 1500;

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
  const { theme, fontScale, appearanceMode } = useAppPreferences();

  const styles = useMemo(
    () => createProfileStyles(theme, fontScale),
    [theme, fontScale],
  );

  const isDarkMode = appearanceMode === "dark";

  const [activeTab, setActiveTab] = useState<ProfileTab>("favorites");
  const [profileFeedbackMessage, setProfileFeedbackMessage] = useState<
    string | null
  >(null);

  const profileFeedbackTimeoutRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);

  const {
    favoriteStationIds,
    sentReviews,
    recentHistory,
    storageError,
    reloadStorage,
  } = useFluiStorage();

  useEffect(() => {
    return () => {
      if (profileFeedbackTimeoutRef.current) {
        clearTimeout(profileFeedbackTimeoutRef.current);
      }
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      void reloadStorage();
    }, [reloadStorage]),
  );

  const stationsById = useMemo(() => {
    return new Map(chargingStations.map((station) => [station.id, station]));
  }, []);

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

  const resumoPerfil = useMemo(() => {
    const recargas = recentStations.length;
    const favoritos = favoriteStations.length;
    const avaliacoes = reviewedStations.length;

    if (recargas === 0 && favoritos === 0 && avaliacoes === 0) {
      return "Monte seu guia pessoal salvando pontos, visitando estações e avaliando suas melhores experiências.";
    }

    if (favoritos >= recargas && favoritos > 0) {
      return "Você já tem pontos salvos para recarregar com mais previsibilidade no dia a dia.";
    }

    if (recargas > 0) {
      return "Seu histórico ajuda a encontrar de novo os pontos que funcionaram melhor para sua rotina.";
    }

    return "Suas avaliações ajudam a destacar pontos de recarga mais confiáveis para outros motoristas.";
  }, [favoriteStations.length, recentStations.length, reviewedStations.length]);

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

  const abrirRota = (pathname: Href) => {
    router.push(pathname);
  };

  const showProfileFeedback = (message: string) => {
    if (profileFeedbackTimeoutRef.current) {
      clearTimeout(profileFeedbackTimeoutRef.current);
    }

    setProfileFeedbackMessage(message);

    profileFeedbackTimeoutRef.current = setTimeout(() => {
      setProfileFeedbackMessage(null);
    }, FEEDBACK_DURATION);
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

  const renderShortcutCard = (
    icon: React.ReactNode,
    title: string,
    description: string,
    route: Href,
  ) => {
    return (
      <PressableScale
        key={title}
        style={styles.shortcutCard}
        onPress={() => abrirRota(route)}
      >
        <View style={styles.shortcutIconBox}>{icon}</View>

        <Text style={styles.shortcutTitle}>{title}</Text>
        <Text style={styles.shortcutText}>{description}</Text>
      </PressableScale>
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
          <View style={styles.profileCard}>
            <View style={styles.avatarCircle}>
              <User size={30} color={theme.primary} strokeWidth={2.1} />
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Motorista Flui</Text>

              <Text style={styles.profileText}>{resumoPerfil}</Text>

              <View style={styles.profileBadge}>
                <Zap size={13} color={theme.primary} strokeWidth={2.2} />
                <Text style={styles.profileBadgeText}>Guia de recarga pessoal</Text>
              </View>
            </View>
          </View>

          {profileFeedbackMessage ? (
            <View style={styles.feedbackBadge}>
              <Text style={styles.feedbackText}>{profileFeedbackMessage}</Text>
            </View>
          ) : null}

          {storageError ? (
            <View style={styles.errorCard}>
              <Text style={styles.errorText}>{storageError}</Text>
            </View>
          ) : null}

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{favoriteStations.length}</Text>
              <Text style={styles.statLabel}>favoritos</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{recentStations.length}</Text>
              <Text style={styles.statLabel}>histórico</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{reviewedStations.length}</Text>
              <Text style={styles.statLabel}>avaliações</Text>
            </View>
          </View>

          <View style={styles.profileActionsRow}>
            <PressableScale
              style={styles.settingsButton}
              onPress={openSettingsScreen}
            >
              <SettingsIcon size={19} color={theme.primary} strokeWidth={2.1} />
              <Text style={styles.profileActionText}>Configurações</Text>
            </PressableScale>

            <PressableScale
              style={styles.logoutButton}
              onPress={() => showProfileFeedback("Logout apenas visual")}
            >
              <LogOut size={19} color={theme.primary} strokeWidth={2.1} />
              <Text style={styles.profileActionText}>Sair da conta</Text>
            </PressableScale>
          </View>

          <View style={styles.quickActionsSection}>
            <Text style={styles.sectionTitle}>Atalhos úteis</Text>
            <Text style={styles.sectionText}>
              Acesse rapidamente as áreas mais importantes antes de escolher
              onde carregar.
            </Text>

            <View style={styles.quickActionsGrid}>
              {renderShortcutCard(
                <MapIcon size={21} color={theme.primary} strokeWidth={2.1} />,
                "Mapa",
                "Ver pontos",
                "/map" as Href,
              )}

              {renderShortcutCard(
                <Search size={21} color={theme.primary} strokeWidth={2.1} />,
                "Filtros",
                "Refinar busca",
                "/filters" as Href,
              )}

              {renderShortcutCard(
                <History size={21} color={theme.primary} strokeWidth={2.1} />,
                "Atividades",
                "Ver rotina",
                "/activities" as Href,
              )}
            </View>
          </View>

          <View style={styles.segmentedControl}>
            <PressableScale
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

            <PressableScale
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
                    renderStationCard(station, index, activeTab === "favorites" ? "favorite" : "history"),
                  )
                : emptyContent}
            </View>
          </View>

          <View style={styles.reviewsHeader}>
            <Text style={styles.sectionTitle}>Avaliações enviadas</Text>

            <Text style={styles.sectionText}>
              Seus comentários ajudam a dar mais contexto sobre qualidade,
              disponibilidade e comodidades.
            </Text>

            <View style={styles.cardsList}>
              {reviewedStations.length > 0
                ? reviewedStations.map(renderReviewCard)
                : renderEmptyCard(
                    <Star size={21} color={theme.primary} strokeWidth={2.1} />,
                    "Nenhuma avaliação ainda",
                    "Depois de avaliar uma estação, seu registro aparece aqui.",
                  )}
            </View>
          </View>

          <View style={styles.easterEgg}>
            <Text style={styles.easterEggText}>
              carregando boas escolhas desde 2026 ⚡
            </Text>
          </View>
        </ScrollView>
      </ScreenTransition>
    </SafeAreaView>
  );
}
