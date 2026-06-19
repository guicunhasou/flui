import { defaultFilters } from "../data/filterOptions";
import {
  CreateLocalReviewInput,
  CreateRecentHistoryInput,
  FluiStorageSnapshot,
  LocalSentReview,
  RecentHistoryItem,
  UserPreferences,
  AppearanceMode,
  FontSizePreference,
} from "../types";
import { getJsonItem, removeStorageItems, setJsonItem } from "./jsonStorage";

export const fluiStorageKeys = {
  favoriteStationIds: "@flui:favoriteStationIds",
  sentReviews: "@flui:sentReviews",
  recentHistory: "@flui:recentHistory",
  userPreferences: "@flui:userPreferences",
} as const;

const maxRecentHistoryItems = 20;

function isAppearanceMode(value: unknown): value is AppearanceMode {
  return value === "light" || value === "dark";
}

function isFontSizePreference(value: unknown): value is FontSizePreference {
  return value === "small" || value === "default" || value === "large";
}

function createLocalId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getNowIso() {
  return new Date().toISOString();
}

function createDefaultUserPreferences(): UserPreferences {
  return {
    preferredConnectors: [],
    preferredAmenities: [],
    preferredRouteApp: "google",
    savedFilters: {
      connectorTypes: [...defaultFilters.connectorTypes],
      statuses: [...defaultFilters.statuses],
      amenities: [...defaultFilters.amenities],
      power: { ...defaultFilters.power },
      distance: { ...defaultFilters.distance },
      rating: { ...defaultFilters.rating },
      onlyOpenNow: defaultFilters.onlyOpenNow,
    },
    hasSeenSplash: false,
    hasSeenOnboarding: false,
    appearanceMode: "light",
    fontSize: "default",
  };
}

function normalizeFavoriteIds(ids: string[]) {
  return Array.from(new Set(ids.filter(Boolean)));
}

function getReviewTimestamp(review: LocalSentReview) {
  return new Date(review.updatedAt ?? review.createdAt).getTime();
}

function normalizeSentReviews(reviews: LocalSentReview[]) {
  const seenStationIds = new Set<string>();

  return [...reviews]
    .sort((a, b) => getReviewTimestamp(b) - getReviewTimestamp(a))
    .filter((review) => {
      if (!review.stationId || seenStationIds.has(review.stationId)) {
        return false;
      }

      seenStationIds.add(review.stationId);
      return true;
    });
}

function normalizeUserPreferences(
  preferences?: Partial<UserPreferences> | null,
): UserPreferences {
  const base = createDefaultUserPreferences();

  if (!preferences) {
    return base;
  }

  const savedFilters = preferences.savedFilters;

  return {
    ...base,
    ...preferences,
    preferredConnectors:
      preferences.preferredConnectors ?? base.preferredConnectors,
    preferredAmenities:
      preferences.preferredAmenities ?? base.preferredAmenities,
    appearanceMode: isAppearanceMode(preferences.appearanceMode)
      ? preferences.appearanceMode
      : base.appearanceMode,
    fontSize: isFontSizePreference(preferences.fontSize)
      ? preferences.fontSize
      : base.fontSize,
    savedFilters: {
      ...base.savedFilters,
      ...(savedFilters ?? {}),
      connectorTypes:
        savedFilters?.connectorTypes ?? base.savedFilters.connectorTypes,
      statuses: savedFilters?.statuses ?? base.savedFilters.statuses,
      amenities: savedFilters?.amenities ?? base.savedFilters.amenities,
      power: {
        ...base.savedFilters.power,
        ...(savedFilters?.power ?? {}),
      },
      distance: {
        ...base.savedFilters.distance,
        ...(savedFilters?.distance ?? {}),
      },
      rating: {
        ...base.savedFilters.rating,
        ...(savedFilters?.rating ?? {}),
      },
      onlyOpenNow: savedFilters?.onlyOpenNow ?? base.savedFilters.onlyOpenNow,
    },
  };
}

export const fluiStorage = {
  async getFavoriteStationIds() {
    const ids = await getJsonItem<string[]>(
      fluiStorageKeys.favoriteStationIds,
      [],
    );

    return normalizeFavoriteIds(ids);
  },

  async saveFavoriteStationIds(stationIds: string[]) {
    const normalizedIds = normalizeFavoriteIds(stationIds);

    await setJsonItem(fluiStorageKeys.favoriteStationIds, normalizedIds);

    return normalizedIds;
  },

  async toggleFavoriteStationId(stationId: string) {
    const currentIds = await this.getFavoriteStationIds();
    const isAlreadyFavorite = currentIds.includes(stationId);

    const nextIds = isAlreadyFavorite
      ? currentIds.filter((id) => id !== stationId)
      : [...currentIds, stationId];

    const favoriteStationIds = await this.saveFavoriteStationIds(nextIds);

    return {
      favoriteStationIds,
      isFavorite: !isAlreadyFavorite,
    };
  },

  async getSentReviews() {
    const reviews = await getJsonItem<LocalSentReview[]>(
      fluiStorageKeys.sentReviews,
      [],
    );

    return normalizeSentReviews(reviews);
  },

  async saveSentReviews(reviews: LocalSentReview[]) {
    const normalizedReviews = normalizeSentReviews(reviews);

    await setJsonItem(fluiStorageKeys.sentReviews, normalizedReviews);

    return normalizedReviews;
  },

  async addSentReview(input: CreateLocalReviewInput) {
    const currentReviews = await this.getSentReviews();
    const existingReview = currentReviews.find(
      (item) => item.stationId === input.stationId,
    );

    const now = getNowIso();

    const review: LocalSentReview = {
      ...input,
      id: input.id ?? existingReview?.id ?? createLocalId("review"),
      createdAt: input.createdAt ?? existingReview?.createdAt ?? now,
      updatedAt: now,
      isSynced: false,
    };

    const nextReviews = [
      review,
      ...currentReviews.filter((item) => item.stationId !== review.stationId),
    ];

    await this.saveSentReviews(nextReviews);

    return review;
  },

  async getRecentHistory() {
    return getJsonItem<RecentHistoryItem[]>(fluiStorageKeys.recentHistory, []);
  },

  async saveRecentHistory(history: RecentHistoryItem[]) {
    const limitedHistory = history.slice(0, maxRecentHistoryItems);

    await setJsonItem(fluiStorageKeys.recentHistory, limitedHistory);

    return limitedHistory;
  },

  async addRecentHistory(input: CreateRecentHistoryInput) {
    const currentHistory = await this.getRecentHistory();

    const historyItem: RecentHistoryItem = {
      ...input,
      id: input.id ?? createLocalId("history"),
      createdAt: input.createdAt ?? getNowIso(),
    };

    const nextHistory = [
      historyItem,
      ...currentHistory.filter(
        (item) =>
          item.stationId !== historyItem.stationId ||
          item.action !== historyItem.action,
      ),
    ];

    await this.saveRecentHistory(nextHistory);

    return historyItem;
  },

  async getUserPreferences() {
    const preferences = await getJsonItem<Partial<UserPreferences>>(
      fluiStorageKeys.userPreferences,
      createDefaultUserPreferences(),
    );

    return normalizeUserPreferences(preferences);
  },

  async saveUserPreferences(preferences: UserPreferences) {
    const normalizedPreferences = normalizeUserPreferences(preferences);

    await setJsonItem(fluiStorageKeys.userPreferences, normalizedPreferences);

    return normalizedPreferences;
  },

  async updateUserPreferences(partialPreferences: Partial<UserPreferences>) {
    const currentPreferences = await this.getUserPreferences();

    const nextPreferences = normalizeUserPreferences({
      ...currentPreferences,
      ...partialPreferences,
    });

    await this.saveUserPreferences(nextPreferences);

    return nextPreferences;
  },

  async getSnapshot(): Promise<FluiStorageSnapshot> {
    const [favoriteStationIds, sentReviews, recentHistory, userPreferences] =
      await Promise.all([
        this.getFavoriteStationIds(),
        this.getSentReviews(),
        this.getRecentHistory(),
        this.getUserPreferences(),
      ]);

    return {
      favoriteStationIds,
      sentReviews,
      recentHistory,
      userPreferences,
    };
  },

  async clearAll() {
    await removeStorageItems(Object.values(fluiStorageKeys));
  },
};
