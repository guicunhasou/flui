import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Pressable, ScrollView, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, type Href, useFocusEffect } from "expo-router";
import {
  ArrowLeft,
  CalendarClock,
  ChevronRight,
  Heart,
  History,
  LogOut,
  MapPin,
  Settings as SettingsIcon,
  Star,
  User,
  Zap,
} from "lucide-react-native";

import { chargingStations } from "../../data";
import {
  LoadingOverlay,
  PressableScale,
  ScreenTransition,
} from "../../components";
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
    isLoadingStorage,
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

  const reviewedStations = sentReviews;

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

  const showProfileFeedback = (message: string) => {
    if (profileFeedbackTimeoutRef.current) {
      clearTimeout(profileFeedbackTimeoutRef.current);
    }

    setProfileFeedbackMessage(message);

    profileFeedbackTimeoutRef.current = setTimeout(() => {
      setProfileFeedbackMessage(null);
    }, FEEDBACK_DURATION);
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
        key={`${variant}-${stationId}`}
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
          <Text style={styles.stationName}>{stationName}</Text>

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
          
          <View style={styles.profileCard}>
            <View style={styles.avatarCircle}>
              <User size={30} color={theme.primary} strokeWidth={2.2} />
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Usuário Flui</Text>
              <Text style={styles.profileText}>
                Favoritos e preferências salvos localmente no protótipo.
              </Text>
            </View>
          </View>

          {storageError ? (
            <View style={styles.section}>
              {renderEmptyCard(
                <History size={21} color={theme.primary} strokeWidth={2.1} />,
                "Dados locais indisponíveis",
                storageError,
              )}
            </View>
          ) : null}

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {isLoadingStorage ? "..." : favoriteStations.length}
              </Text>
              <Text style={styles.statLabel}>favoritos</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {isLoadingStorage ? "..." : recentStations.length}
              </Text>
              <Text style={styles.statLabel}>recentes</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {isLoadingStorage ? "..." : reviewedStations.length}
              </Text>
              <Text style={styles.statLabel}>avaliações</Text>
            </View>
          </View>

          <View style={styles.segmentedControl}>
            <Pressable
              style={[
                styles.segmentButton,
                activeTab === "favorites" ? styles.segmentButtonActive : null,
              ]}
              onPress={() => setActiveTab("favorites")}
            >
              <Heart
                size={17}
                color={activeTab === "favorites" ? theme.white : theme.primary}
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
            </Pressable>

            <Pressable
              style={[
                styles.segmentButton,
                activeTab === "history" ? styles.segmentButtonActive : null,
              ]}
              onPress={() => setActiveTab("history")}
            >
              <History
                size={17}
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
            </Pressable>
          </View>

          {activeTab === "favorites" ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Pontos favoritos</Text>
              <Text style={styles.sectionText}>
                Pontos salvos pelo botão de coração na ficha da estação.
              </Text>

              <View style={styles.cardsList}>
                {favoriteStations.length > 0
                  ? favoriteStations.map((station, index) =>
                      renderStationCard(station, index, "favorite"),
                    )
                  : renderEmptyCard(
                      <Heart
                        size={21}
                        color={theme.primary}
                        strokeWidth={2.1}
                      />,
                      "Nenhum favorito salvo ainda",
                      "Abra a ficha de um ponto e toque no coração para salvá-lo aqui.",
                    )}
              </View>
            </View>
          ) : (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Histórico recente</Text>
              <Text style={styles.sectionText}>
                Aqui aparecerão os pontos abertos recentemente ou usados em
                rotas.
              </Text>

              <View style={styles.cardsList}>
                {recentStations.length > 0
                  ? recentStations.map((station, index) =>
                      renderStationCard(station, index, "history"),
                    )
                  : renderEmptyCard(
                      <CalendarClock
                        size={21}
                        color={theme.primary}
                        strokeWidth={2.1}
                      />,
                      "Histórico ainda vazio",
                      "Abra a ficha de um ponto, inicie uma rota ou envie uma avaliação para criar seu histórico.",
                    )}
              </View>

              <View style={styles.reviewsHeader}>
                <Text style={styles.sectionTitle}>Avaliações enviadas</Text>
                <Text style={styles.sectionText}>
                  Avaliações salvas localmente pela tela de avaliação.
                </Text>
              </View>

              <View style={styles.cardsList}>
                {reviewedStations.length > 0
                  ? reviewedStations.map((review, index) => {
                      const stationId = getStationId(review, index);
                      const reviewId = readString(review, "id", stationId);
                      const stationName = getStationName(review);
                      const rating = getStationRating(review);
                      const comment = readString(
                        review,
                        "comment",
                        "Avaliação enviada pelo app.",
                      );

                      return (
                        <PressableScale
                          key={`review-${reviewId}`}
                          style={styles.reviewCard}
                          onPress={() => openStationDetails(stationId)}
                        >
                          <View style={styles.reviewIconBox}>
                            <Star
                              size={20}
                              color={theme.yellowDark}
                              fill={theme.yellowDark}
                              strokeWidth={2}
                            />
                          </View>

                          <View style={styles.reviewInfo}>
                            <Text style={styles.reviewStation}>
                              {stationName}
                            </Text>
                            <Text style={styles.reviewText} numberOfLines={2}>
                              Nota {rating} · {comment}
                            </Text>
                          </View>

                          <ChevronRight
                            size={22}
                            color={theme.primary}
                            strokeWidth={2.2}
                          />
                        </PressableScale>
                      );
                    })
                  : renderEmptyCard(
                      <Star
                        size={21}
                        color={theme.yellowDark}
                        fill={theme.yellowDark}
                        strokeWidth={2}
                      />,
                      "Nenhuma avaliação enviada",
                      "Envie uma avaliação pela ficha de um ponto para vê-la nesta área.",
                    )}
              </View>
            </View>
          )}

          <View style={styles.easterEgg}>
            <Text style={styles.easterEggText}>
              App criado por <Text style={styles.easterEggHighlight}>MGIK</Text>
            </Text>
            <Text style={styles.easterEggText}>Mirna, Gui, Isa & Kau</Text>
            <Text style={styles.easterEggSubtext}>
              Estudantes FIAP e futuros Web Designers.
            </Text>
          </View>
        </ScrollView>

        <LoadingOverlay
          visible={isLoadingStorage}
          message="Carregando dados locais..."
        />

        {profileFeedbackMessage ? (
          <View pointerEvents="none" style={styles.feedbackToastOverlay}>
            <View style={styles.feedbackToastCard}>
              <Text style={styles.feedbackToastIcon}>i</Text>
              <Text style={styles.feedbackToastText}>
                {profileFeedbackMessage}
              </Text>
            </View>
          </View>
        ) : null}
      </ScreenTransition>
    </SafeAreaView>
  );
}
