import { SentReview } from "./activity";
import { Amenity, ConnectorType } from "./chargingStation";
import { StationFilters } from "./filters";

export type PreferredRouteApp = "google" | "waze";
export type AppearanceMode = "light" | "dark";
export type FontSizePreference = "small" | "default" | "large";

export type RecentHistoryAction =
  | "viewed_station"
  | "started_route"
  | "sent_review";

export type LocalSentReview = SentReview & {
  updatedAt?: string;
  isSynced?: boolean;
};

export type RecentHistoryItem = {
  id: string;
  stationId: string;
  stationName: string;
  address: string;
  action: RecentHistoryAction;
  createdAt: string;
};

export type UserPreferences = {
  preferredConnectors: ConnectorType[];
  preferredAmenities: Amenity[];
  preferredRouteApp: PreferredRouteApp;
  savedFilters: StationFilters;
  hasSeenOnboarding: boolean;
  appearanceMode: AppearanceMode;
  fontSize: FontSizePreference;
  vehicleRangeKm: number;
  batteryPercent: number;
};

export type FluiStorageSnapshot = {
  favoriteStationIds: string[];
  sentReviews: LocalSentReview[];
  recentHistory: RecentHistoryItem[];
  userPreferences: UserPreferences;
};

export type CreateLocalReviewInput = Omit<
  LocalSentReview,
  "id" | "createdAt"
> &
  Partial<Pick<LocalSentReview, "id" | "createdAt">>;

export type CreateRecentHistoryInput = Omit<
  RecentHistoryItem,
  "id" | "createdAt"
> &
  Partial<Pick<RecentHistoryItem, "id" | "createdAt">>;