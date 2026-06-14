import React, { useState } from "react";
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
  ChevronRight,
  Clock,
  Heart,
  Map as MapIcon,
  MoreHorizontal,
  Star,
  User,
  Zap,
} from "lucide-react-native";

import { rechargeHistory, sentReviews } from "../../data";
import { LoadingOverlay, ScreenTransition } from "../../components";
import baseStyles, { colors as baseColors } from "./styles";
import { useTelaComPreferencias } from "../../hooks/useTelaComPreferencias";

type RechargeItem = (typeof rechargeHistory)[number];
type ReviewItem = (typeof sentReviews)[number];

const connectorLabels = {
  ccs2: "CCS2",
  type2: "Type 2",
  chademo: "CHAdeMO",
  gbt: "GB/T",
};

function openMap() {
  router.push("/map" as Href);
}

function openFavorites() {
  router.push("/favorites" as Href);
}

function openStationDetails(stationId: string) {
  const route = {
    pathname: "/point-details",
    params: {
      stationId,
    },
  } as Href;

  router.push(route);
}

function getReviewRoute(stationId: string) {
  return {
    pathname: "/review",
    params: {
      stationId,
    },
  } as Href;
}

function showMoreFeedback() {
  Alert.alert(
    "Mais opções",
    "Essa área pode receber perfil, ajuda e configurações.",
  );
}

function showViewAllFeedback(section: string) {
  Alert.alert(section, "Aqui o app exibiria a lista completa.");
}

function formatShortDate(date: string) {
  const parsedDate = new Date(`${date}T12:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate
    .toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .replace(".", "");
}

function getDurationInMinutes(item: RechargeItem) {
  const start = new Date(`${item.date}T${item.startTime}:00`);
  const end = new Date(`${item.date}T${item.endTime}:00`);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return null;
  }

  return Math.max(1, Math.round((end.getTime() - start.getTime()) / 60000));
}

function getConnectorLabel(item: RechargeItem) {
  return connectorLabels[item.connectorType] ?? item.connectorType;
}

function getHistoryTitle(item: RechargeItem) {
  return `${getConnectorLabel(item)} • ${item.stationName}`;
}

function getReviewTitle(item: ReviewItem) {
  return item.stationName;
}

export default function ActivitiesScreen() {
  const { styles, colors, isDarkMode } = useTelaComPreferencias(
    baseStyles,
    baseColors,
  );
  const [isOpeningReview, setIsOpeningReview] = useState(false);

  function handleOpenReview(stationId: string) {
    if (isOpeningReview) {
      return;
    }

    setIsOpeningReview(true);

    setTimeout(() => {
      setIsOpeningReview(false);
      router.push(getReviewRoute(stationId));
    }, 320);
  }
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
            <Text style={styles.title}>Atividades</Text>

            <Text style={styles.subtitle}>
              Seu histórico recente de recargas e interações.
            </Text>
          </View>

          <View style={styles.segmentedControl}>
            <Pressable
              style={[styles.segmentButton, styles.segmentButtonActive]}
            >
              <Clock size={21} color={colors.white} strokeWidth={2} />

              <Text style={[styles.segmentText, styles.segmentTextActive]}>
                Histórico
              </Text>
            </Pressable>

            <Pressable
              style={styles.segmentButton}
              onPress={() => showViewAllFeedback("Avaliações")}
            >
              <Star size={21} color={colors.textMuted} strokeWidth={2} />

              <Text style={styles.segmentText}>Avaliações</Text>
            </Pressable>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Histórico recente</Text>

            <Pressable onPress={() => showViewAllFeedback("Histórico recente")}>
              <Text style={styles.viewAllText}>Ver tudo</Text>
            </Pressable>
          </View>

          <View style={styles.historyList}>
            {rechargeHistory.map((item) => {
              const duration = getDurationInMinutes(item);

              return (
                <View key={item.id} style={styles.historyCard}>
                  <View style={styles.cardIconCircle}>
                    <Zap
                      size={27}
                      color={colors.primaryBright}
                      strokeWidth={2.2}
                    />
                  </View>

                  <View style={styles.historyContent}>
                    <Text style={styles.historyTitle} numberOfLines={1}>
                      {getHistoryTitle(item)}
                    </Text>

                    <Text style={styles.historyAddress} numberOfLines={1}>
                      {item.address}
                    </Text>

                    <View style={styles.dateRow}>
                      <View style={styles.statusDot} />

                      <Text style={styles.dateText}>
                        {formatShortDate(item.date)} · {item.startTime}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.historyMeta}>
                    <View style={styles.metaLine}>
                      <Text style={styles.metaText}>
                        {duration ? `${duration} min` : "-- min"}
                      </Text>

                      <Clock
                        size={15}
                        color={colors.textMuted}
                        strokeWidth={2}
                      />
                    </View>

                    <View style={styles.metaLine}>
                      <Text style={styles.metaText}>
                        {item.energyKwh.toFixed(1).replace(".", ",")} kWh
                      </Text>

                      <Zap
                        size={13}
                        color={colors.primaryBright}
                        strokeWidth={2}
                      />
                    </View>
                  </View>

                  <View style={styles.cardActionArea}>
                    <View style={styles.doneTag}>
                      <Text style={styles.doneTagText}>Concluída</Text>
                    </View>

                    <Pressable
                      style={styles.reviewButton}
                      onPress={() => handleOpenReview(item.stationId)}
                    >
                      <Text style={styles.reviewButtonText}>Avaliar</Text>

                      <ChevronRight
                        size={21}
                        color={colors.primaryBright}
                        strokeWidth={2.3}
                      />
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Avaliações enviadas</Text>

            <Pressable
              onPress={() => showViewAllFeedback("Avaliações enviadas")}
            >
              <Text style={styles.viewAllText}>Ver tudo</Text>
            </Pressable>
          </View>

          <View style={styles.reviewsBox}>
            {sentReviews.map((item) => (
              <Pressable
                key={item.id}
                style={styles.reviewRow}
                onPress={() => openStationDetails(item.stationId)}
              >
                <View style={styles.reviewIconCircle}>
                  <Star
                    size={22}
                    color={colors.primaryBright}
                    strokeWidth={2}
                  />
                </View>

                <View style={styles.reviewContent}>
                  <Text style={styles.reviewTitle} numberOfLines={1}>
                    {getReviewTitle(item)}
                  </Text>

                  <Text style={styles.reviewDate}>
                    {formatShortDate(item.createdAt)}
                  </Text>
                </View>

                <View style={styles.reviewRating}>
                  <Star
                    size={17}
                    color={colors.yellow}
                    fill={colors.yellow}
                    strokeWidth={2}
                  />

                  <Text style={styles.reviewRatingText}>
                    {item.rating.toFixed(1).replace(".", ",")}
                  </Text>
                </View>

                <ChevronRight
                  size={22}
                  color={colors.primaryBright}
                  strokeWidth={2.3}
                />
              </Pressable>
            ))}
          </View>
        </ScrollView>

        <View style={styles.tabBar}>
          <Pressable style={styles.tabItem} onPress={openMap}>
            <MapIcon size={25} color={colors.textMuted} strokeWidth={2} />

            <Text style={styles.tabLabel}>Mapa</Text>
          </Pressable>

          <Pressable style={styles.tabItem} onPress={openFavorites}>
            <Heart size={25} color={colors.textMuted} strokeWidth={2} />

            <Text style={styles.tabLabel}>Favoritos</Text>
          </Pressable>

          <Pressable style={styles.tabItem}>
            <View style={styles.activeTabIndicator} />

            <View style={styles.activityIconCircleActive}>
              <Zap size={15} color={colors.primaryBright} strokeWidth={2.2} />
            </View>

            <Text style={[styles.tabLabel, styles.tabLabelActive]}>
              Atividades
            </Text>
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
        <LoadingOverlay
          visible={isOpeningReview}
          message="Abrindo avaliação..."
        />
      </ScreenTransition>
    </SafeAreaView>
  );
}
