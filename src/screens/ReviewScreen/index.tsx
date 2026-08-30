import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";
import { router, type Href, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Heart,
  Check,
  Clock3,
  Coffee,
  Sparkles,
  Star,
  ThumbsDown,
  ThumbsUp,
  Zap,
} from "lucide-react-native";

import { chargingStations } from "../../data";
import { LoadingOverlay, ScreenTransition } from "../../components";
import { useFluiStorage } from "../../hooks/useFluiStorage";
import { styles as baseStyles, colors as baseColors } from "./styles";
import { useTelaComPreferencias } from "../../hooks/useTelaComPreferencias";
import { getStationImageSource } from "../../assets/stations";
import { triggerImpact, type PressableVisualState } from "../../utils/interaction";

type CriteriaKey = "quality" | "cleaning" | "availability" | "amenities";

type CriteriaRatings = Record<CriteriaKey, number>;

type ReviewCriterion = {
  key: CriteriaKey;
  title: string;
  description: string;
  icon: React.ElementType;
};

const reviewCriteria: ReviewCriterion[] = [
  {
    key: "quality",
    title: "Qualidade",
    description: "Funcionamento do carregador",
    icon: Zap,
  },
  {
    key: "cleaning",
    title: "Limpeza",
    description: "Ambiente e conservação",
    icon: Sparkles,
  },
  {
    key: "availability",
    title: "Disponibilidade",
    description: "Tempo de espera e vagas livres",
    icon: Clock3,
  },
  {
    key: "amenities",
    title: "Comodidades",
    description: "Serviços úteis próximos ao ponto",
    icon: Coffee,
  },
];

const SUCCESS_FEEDBACK_DURATION = 1500;

function wait(duration: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, duration);
  });
}

function normalizeParam(value?: string | string[]) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function formatAddress(station: (typeof chargingStations)[number]) {
  return [station.address, station.neighborhood, station.city, station.state]
    .filter(Boolean)
    .join(", ");
}

function getStatusLabel(status: (typeof chargingStations)[number]["status"]) {
  if (status === "available") {
    return "Aberto agora";
  }

  if (status === "busy") {
    return "Ocupado agora";
  }

  if (status === "maintenance") {
    return "Em manutenção";
  }

  return "Indisponível";
}

type StarRatingInputProps = {
  styles: typeof baseStyles;
  colors: typeof baseColors;
  value: number;
  onChange: (rating: number) => void;
  size?: number;
  accessibilityLabel: string;
};

function StarRatingInput({
  styles,
  colors,
  value,
  onChange,
  size = 24,
  accessibilityLabel,
}: StarRatingInputProps) {
  return (
    <View style={styles.starsRow}>
      {Array.from({ length: 5 }, (_, index) => {
        const rating = index + 1;
        const isActive = rating <= value;

        return (
          <Pressable
            key={rating}
            style={({ pressed, hovered }: PressableVisualState) => [
              styles.starButton,
              hovered && !pressed ? styles.hoverFeedback : null,
              pressed ? styles.starButtonPressed : null,
            ]}
            accessibilityRole="button"
            accessibilityLabel={`${accessibilityLabel}: ${rating} estrelas`}
            onPress={() => {
              triggerImpact();
              onChange(rating);
            }}
          >
            <Star
              size={size}
              color={isActive ? colors.primary : colors.borderStrong}
              fill={isActive ? colors.primary : "transparent"}
              strokeWidth={2}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

export default function ReviewScreen() {
  const { styles, colors, isDarkMode } = useTelaComPreferencias(
    baseStyles,
    baseColors,
  );
  const { stationId } = useLocalSearchParams<{
    stationId?: string | string[];
  }>();

  const selectedStationId = normalizeParam(stationId);

  const station = useMemo(() => {
    return chargingStations.find((item) => item.id === selectedStationId);
  }, [selectedStationId]);

  const {
    favoriteStationIds,
    sentReviews,
    isLoadingStorage,
    toggleFavoriteStation,
    addSentReview,
    addRecentHistory,
  } = useFluiStorage();

  const existingReview = useMemo(() => {
    if (!station) {
      return null;
    }

    return (
      sentReviews.find((review) => review.stationId === station.id) ?? null
    );
  }, [sentReviews, station]);

  const isEditingReview = Boolean(existingReview);

  const [overallRating, setOverallRating] = useState(0);

  const [criteriaRatings, setCriteriaRatings] = useState<CriteriaRatings>({
    quality: 0,
    cleaning: 0,
    availability: 0,
    amenities: 0,
  });

  const [comment, setComment] = useState("");
  const [wouldReturn, setWouldReturn] = useState(true);
  const [recommend, setRecommend] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessFeedbackVisible, setIsSuccessFeedbackVisible] =
    useState(false);
  const [successFeedbackMessage, setSuccessFeedbackMessage] =
    useState("Avaliação salva");

  const isSubmitLockedRef = useRef(false);
  const hasFilledExistingReviewRef = useRef(false);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);

  const isFavorite = station ? favoriteStationIds.includes(station.id) : false;

  useEffect(() => {
    if (!existingReview || hasFilledExistingReviewRef.current) {
      return;
    }

    setOverallRating(existingReview.rating);

    setCriteriaRatings({
      quality: existingReview.quality,
      cleaning: existingReview.cleaning,
      availability: existingReview.availability,
      amenities: existingReview.amenities,
    });

    setComment(existingReview.comment ?? "");
    setWouldReturn(existingReview.wouldReturn);
    setRecommend(existingReview.recommend);

    hasFilledExistingReviewRef.current = true;
  }, [existingReview]);

  function updateCriterionRating(key: CriteriaKey, rating: number) {
    setCriteriaRatings((currentRatings) => ({
      ...currentRatings,
      [key]: rating,
    }));
  }

  function handleGoToMap() {
    router.push("/map" as Href);
  }

  async function handleToggleFavorite() {
    if (!station || isFavoriteLoading || isLoadingStorage) {
      return;
    }

    try {
      triggerImpact();
      setIsFavoriteLoading(true);
      await toggleFavoriteStation(station.id);
    } catch {
      Alert.alert(
        "Não foi possível atualizar favoritos",
        "Tente novamente em alguns instantes.",
      );
    } finally {
      setIsFavoriteLoading(false);
    }
  }

  async function handleSubmitReview() {
    if (
      !station ||
      isSubmitting ||
      isSuccessFeedbackVisible ||
      isSubmitLockedRef.current ||
      isLoadingStorage
    ) {
      return;
    }

    const hasEmptyCriterion = Object.values(criteriaRatings).some(
      (rating) => rating === 0,
    );

    if (overallRating === 0 || hasEmptyCriterion) {
      Alert.alert(
        "Avaliação incompleta",
        "Preencha a avaliação geral e todos os critérios antes de enviar.",
      );

      return;
    }

    try {
      isSubmitLockedRef.current = true;
      setIsSubmitting(true);

      const feedbackMessage = existingReview
        ? "Avaliação atualizada"
        : "Avaliação salva";

      setSuccessFeedbackMessage(feedbackMessage);

      await addSentReview({
        id: existingReview?.id,
        createdAt: existingReview?.createdAt,
        stationId: station.id,
        stationName: station.name,
        rating: overallRating,
        quality: criteriaRatings.quality,
        cleaning: criteriaRatings.cleaning,
        availability: criteriaRatings.availability,
        amenities: criteriaRatings.amenities,
        comment: comment.trim(),
        wouldReturn,
        recommend,
      });

      await addRecentHistory({
        stationId: station.id,
        stationName: station.name,
        address: formatAddress(station),
        action: "sent_review",
      });

      setIsSubmitting(false);
      setIsSuccessFeedbackVisible(true);

      await wait(SUCCESS_FEEDBACK_DURATION);

      setIsSuccessFeedbackVisible(false);
      router.back();
    } catch {
      setIsSuccessFeedbackVisible(false);

      Alert.alert(
        "Erro ao enviar avaliação",
        "Não foi possível salvar sua avaliação agora. Tente novamente em alguns instantes.",
      );
    } finally {
      isSubmitLockedRef.current = false;
      setIsSubmitting(false);
    }
  }

  if (!station) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

        <ScreenTransition style={styles.fallbackContainer}>
          <View style={styles.fallbackCard}>
            <View style={styles.fallbackIconCircle}>
              <Text style={styles.fallbackIcon}>!</Text>
            </View>

            <Text style={styles.fallbackTitle}>Ponto não encontrado</Text>

            <Text style={styles.fallbackDescription}>
              Não foi possível encontrar o ponto selecionado para avaliação.
              Volte ao mapa e escolha uma estação novamente.
            </Text>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Voltar para o mapa"
              style={({ pressed, hovered }: PressableVisualState) => [
                styles.primaryFallbackButton,
                hovered && !pressed ? styles.hoverFeedback : null,
                pressed ? styles.primaryButtonPressed : null,
              ]}
              onPress={handleGoToMap}
            >
              <Text style={styles.primaryFallbackButtonText}>
                Voltar para o mapa
              </Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Voltar para a tela anterior"
              style={({ pressed, hovered }: PressableVisualState) => [
                styles.secondaryFallbackButton,
                hovered && !pressed ? styles.hoverFeedback : null,
                pressed ? styles.buttonPressed : null,
              ]}
              onPress={() => router.back()}
            >
              <Text style={styles.secondaryFallbackButtonText}>Voltar</Text>
            </Pressable>
          </View>
        </ScreenTransition>
      </SafeAreaView>
    );
  }

  const connectorLabels = station.connectors
    .map((connector) => connector.label)
    .join(", ");

  const availableChargers = station.connectors.reduce(
    (total, connector) => total + connector.availableChargers,
    0,
  );

  const totalChargers = station.connectors.reduce(
    (total, connector) => total + connector.totalChargers,
    0,
  );

  const commentLength = comment.length;
  const maxCommentLength = 200;
  const statusColor =
    station.status === "available"
      ? colors.success
      : station.status === "busy"
        ? colors.yellowDark
        : station.status === "maintenance"
          ? colors.dangerBorder
          : colors.textMuted;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScreenTransition style={styles.screen}>
          <View style={styles.header}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Voltar"
              style={({ pressed, hovered }: PressableVisualState) => [
                styles.backButton,
                hovered && !pressed ? styles.hoverFeedback : null,
                pressed ? styles.buttonPressed : null,
              ]}
              onPress={() => router.back()}
            >
              <ArrowLeft size={22} color={colors.primary} strokeWidth={2.3} />
            </Pressable>

            <Text style={styles.headerTitle}>Avaliação</Text>

            <View style={styles.headerSpacer} />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.stationCard}>
              <Image
                source={getStationImageSource(station.imageKey)}
                style={styles.stationImage}
              />

              <View style={styles.stationInfo}>
                <View style={styles.badgesRow}>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{connectorLabels}</Text>
                  </View>

                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{station.powerKw} kW</Text>
                  </View>
                </View>

                <Text style={styles.stationName} numberOfLines={1}>
                  {station.name}
                </Text>

                <Text style={styles.stationAddress} numberOfLines={1}>
                  {formatAddress(station)}
                </Text>

                <View style={styles.statusRow}>
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: statusColor },
                    ]}
                  />

                  <Text style={styles.statusText}>
                    {getStatusLabel(station.status)}
                  </Text>
                </View>
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel={
                  isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"
                }
                accessibilityState={{
                  selected: isFavorite,
                  disabled: isFavoriteLoading || isLoadingStorage,
                }}
                style={({ pressed, hovered }: PressableVisualState) => [
                  styles.heartButton,
                  hovered && !pressed ? styles.hoverFeedback : null,
                  pressed ? styles.buttonPressed : null,
                ]}
                disabled={isFavoriteLoading || isLoadingStorage}
                onPress={handleToggleFavorite}
              >
                <Heart
                  size={22}
                  color={colors.primary}
                  fill={isFavorite ? colors.primary : "transparent"}
                  strokeWidth={2.1}
                />
              </Pressable>
            </View>

            <View style={styles.formCard}>
              <Text style={styles.title}>
                {isEditingReview
                  ? "Edite sua avaliação"
                  : "Avalie sua experiência"}
              </Text>

              <Text style={styles.subtitle}>
                {isEditingReview
                  ? "Você já avaliou este ponto. Ajuste sua nota ou comentário quando quiser."
                  : "Sua opinião ajuda outros motoristas e melhora a rede."}
              </Text>

              <View style={styles.overallCard}>
                <View style={styles.overallIconCircle}>
                  <Star
                    size={24}
                    color={colors.primary}
                    fill={colors.primary}
                    strokeWidth={2}
                  />
                </View>

                <View style={styles.overallContent}>
                  <Text style={styles.overallTitle}>Avaliação geral</Text>

                  <Text style={styles.overallDescription}>
                    Como foi a experiência neste ponto?
                  </Text>
                </View>

                <StarRatingInput
                  styles={styles}
                  colors={colors}
                  value={overallRating}
                  onChange={setOverallRating}
                  accessibilityLabel="Avaliação geral"
                />
              </View>

              <View style={styles.criteriaList}>
                {reviewCriteria.map((criterion) => {
                  const Icon = criterion.icon;

                  return (
                    <View key={criterion.key} style={styles.criterionRow}>
                      <View style={styles.criterionIconCircle}>
                        <Icon
                          size={21}
                          color={colors.primary}
                          strokeWidth={2.1}
                        />
                      </View>

                      <View style={styles.criterionContent}>
                        <Text style={styles.criterionTitle}>
                          {criterion.title}
                        </Text>

                        <Text style={styles.criterionDescription}>
                          {criterion.description}
                        </Text>
                      </View>

                      <StarRatingInput
                        styles={styles}
                        colors={colors}
                        value={criteriaRatings[criterion.key]}
                        onChange={(rating) =>
                          updateCriterionRating(criterion.key, rating)
                        }
                        size={22}
                        accessibilityLabel={criterion.title}
                      />
                    </View>
                  );
                })}
              </View>

              <View style={styles.commentBlock}>
                <View style={styles.commentHeader}>
                  <Text style={styles.commentLabel}>Comentário</Text>

                  <Text style={styles.optionalText}>opcional</Text>
                </View>

                <TextInput
                  accessibilityLabel="Comentário da avaliação"
                  accessibilityHint="Campo opcional para contar como foi a recarga, o acesso, o tempo de espera ou a estrutura do local."
                  style={styles.commentInput}
                  value={comment}
                  maxLength={maxCommentLength}
                  multiline
                  placeholder="Conte como foi a recarga, o acesso, o tempo de espera ou a estrutura do local."
                  placeholderTextColor={colors.textMuted}
                  textAlignVertical="top"
                  onChangeText={setComment}
                />

                <Text style={styles.counterText}>
                  {commentLength}/{maxCommentLength}
                </Text>
              </View>

              <View style={styles.toggleGrid}>
                <View style={styles.toggleQuestionCard}>
                  <View style={styles.toggleTextArea}>
                    <Text style={styles.toggleTitle}>Voltaria aqui</Text>

                    <Text style={styles.toggleDescription}>
                      Você voltaria a usar este ponto?
                    </Text>
                  </View>

                  <View style={styles.toggleChoiceRow}>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Voltaria aqui: sim"
                      accessibilityState={{ selected: wouldReturn }}
                      style={({ pressed, hovered }: PressableVisualState) => [
                        styles.toggleChoiceButton,
                        wouldReturn ? styles.toggleChoiceButtonSelected : null,
                        hovered && !pressed ? styles.hoverFeedback : null,
                        pressed ? styles.toggleChoiceButtonPressed : null,
                      ]}
                      onPress={() => {
                        triggerImpact();
                        setWouldReturn(true);
                      }}
                    >
                      <ThumbsUp
                        size={17}
                        color={wouldReturn ? colors.white : colors.primary}
                        strokeWidth={2.1}
                      />

                      <Text
                        style={[
                          styles.toggleChoiceButtonText,
                          wouldReturn
                            ? styles.toggleChoiceButtonTextSelected
                            : null,
                        ]}
                      >
                        Sim
                      </Text>
                    </Pressable>

                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Voltaria aqui: não"
                      accessibilityState={{ selected: !wouldReturn }}
                      style={({ pressed, hovered }: PressableVisualState) => [
                        styles.toggleChoiceButton,
                        !wouldReturn ? styles.toggleChoiceButtonSelected : null,
                        hovered && !pressed ? styles.hoverFeedback : null,
                        pressed ? styles.toggleChoiceButtonPressed : null,
                      ]}
                      onPress={() => {
                        triggerImpact();
                        setWouldReturn(false);
                      }}
                    >
                      <ThumbsDown
                        size={17}
                        color={!wouldReturn ? colors.white : colors.primary}
                        strokeWidth={2.1}
                      />

                      <Text
                        style={[
                          styles.toggleChoiceButtonText,
                          !wouldReturn
                            ? styles.toggleChoiceButtonTextSelected
                            : null,
                        ]}
                      >
                        Não
                      </Text>
                    </Pressable>
                  </View>
                </View>

                <View style={styles.toggleQuestionCard}>
                  <View style={styles.toggleTextArea}>
                    <Text style={styles.toggleTitle}>Recomendo</Text>

                    <Text style={styles.toggleDescription}>
                      Você recomendaria este ponto?
                    </Text>
                  </View>

                  <View style={styles.toggleChoiceRow}>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Recomendo este ponto: sim"
                      accessibilityState={{ selected: recommend }}
                      style={({ pressed, hovered }: PressableVisualState) => [
                        styles.toggleChoiceButton,
                        recommend ? styles.toggleChoiceButtonSelected : null,
                        hovered && !pressed ? styles.hoverFeedback : null,
                        pressed ? styles.toggleChoiceButtonPressed : null,
                      ]}
                      onPress={() => {
                        triggerImpact();
                        setRecommend(true);
                      }}
                    >
                      <ThumbsUp
                        size={17}
                        color={recommend ? colors.white : colors.primary}
                        strokeWidth={2.1}
                      />

                      <Text
                        style={[
                          styles.toggleChoiceButtonText,
                          recommend ? styles.toggleChoiceButtonTextSelected : null,
                        ]}
                      >
                        Sim
                      </Text>
                    </Pressable>

                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Recomendo este ponto: não"
                      accessibilityState={{ selected: !recommend }}
                      style={({ pressed, hovered }: PressableVisualState) => [
                        styles.toggleChoiceButton,
                        !recommend ? styles.toggleChoiceButtonSelected : null,
                        hovered && !pressed ? styles.hoverFeedback : null,
                        pressed ? styles.toggleChoiceButtonPressed : null,
                      ]}
                      onPress={() => {
                        triggerImpact();
                        setRecommend(false);
                      }}
                    >
                      <ThumbsDown
                        size={17}
                        color={!recommend ? colors.white : colors.primary}
                        strokeWidth={2.1}
                      />

                      <Text
                        style={[
                          styles.toggleChoiceButtonText,
                          !recommend
                            ? styles.toggleChoiceButtonTextSelected
                            : null,
                        ]}
                      >
                        Não
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.summaryCard}>
              <View>
                <Text style={styles.summaryLabel}>Resumo do ponto</Text>

                <View style={styles.summaryRatingRow}>
                  <Text style={styles.summaryRating}>
                    {station.rating.toFixed(1).replace(".", ",")}
                  </Text>

                  <Star
                    size={28}
                    color={colors.primary}
                    fill={colors.primary}
                    strokeWidth={2}
                  />
                </View>

                <Text style={styles.summaryQuality}>Excelente</Text>

                <Text style={styles.summaryReviews}>
                  Baseado em {station.reviewCount} avaliações
                </Text>
              </View>

              <View style={styles.summaryDetails}>
                <Text style={styles.summaryDetailText}>
                  {availableChargers} de {totalChargers} carregadores
                  disponíveis
                </Text>

                <Text style={styles.summaryDetailText}>
                  {station.powerKw} kW · {connectorLabels}
                </Text>

                <Text style={styles.summaryDetailText}>
                  {station.distanceKm} km de distância
                </Text>
              </View>
            </View>
          </ScrollView>

          <SafeAreaView edges={["bottom"]} style={styles.bottomActions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={
                isEditingReview ? "Editar avaliação" : "Enviar avaliação"
              }
              accessibilityState={{
                disabled:
                  isSubmitting || isSuccessFeedbackVisible || isLoadingStorage,
              }}
              style={({ pressed, hovered }: PressableVisualState) => [
                styles.submitButton,
                hovered && !pressed ? styles.hoverFeedback : null,
                pressed ? styles.primaryButtonPressed : null,
              ]}
              disabled={
                isSubmitting || isSuccessFeedbackVisible || isLoadingStorage
              }
              onPress={() => {
                triggerImpact();
                handleSubmitReview();
              }}
            >
              <Text style={styles.submitButtonText}>
                {isSubmitting
                  ? "Salvando..."
                  : isEditingReview
                    ? "Editar avaliação"
                    : "Enviar avaliação"}
              </Text>

            </Pressable>
          </SafeAreaView>

          <LoadingOverlay
            visible={isSubmitting}
            message="Enviando avaliação..."
          />

          {isSuccessFeedbackVisible ? (
            <View pointerEvents="none" style={styles.successToastOverlay}>
              <View style={styles.successToastCard}>
                <View style={styles.successToastIconCircle}>
                  <Check size={19} color={colors.success} strokeWidth={3} />
                </View>

                <Text style={styles.successToastText}>{successFeedbackMessage}</Text>
              </View>
            </View>
          ) : null}
        </ScreenTransition>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
