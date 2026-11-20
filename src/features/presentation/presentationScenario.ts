import type { UserPreferences, LocalSentReview, RecentHistoryItem } from "../../types";
import { chargingStations } from "../../data/fixtures/chargingStations";
import { normalizarConfiguracaoDemonstrativa } from "../../utils/demonstracao";
import { normalizeBatteryData } from "../../utils/batteryData";

export type PresentationConfig = Pick<UserPreferences, "vehicleName" | "vehicleRangeKm" | "demoOriginId" | "batteryPercent" | "batterySource" | "batteryUpdatedAt"> & {
  driverName: string;
  profileImage: "profile1" | "profile2";
  vehicleImage: "car1" | "car2";
};
export type PresentationState = {
  version: 1;
  profileId: "urban" | "travel" | null;
  enabled: boolean;
  config: PresentationConfig;
  favoriteStationIds: string[];
  sentReviews: LocalSentReview[];
  recentHistory: RecentHistoryItem[];
};
const stationById = new Map(chargingStations.map(station => [station.id, station]));
const record = (value: unknown): Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value) ? value as Record<string, unknown> : {};
const text = (value: unknown, fallback: string, max: number) => typeof value === "string" && value.trim() ? value.trim().slice(0, max) : fallback;
const validRating = (value: unknown): value is number => typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= 5;

export function createPresentationState(): PresentationState {
  return { version: 1, profileId: null, enabled: false, config: { ...normalizarConfiguracaoDemonstrativa(), ...normalizeBatteryData(), driverName: "Caio Duarte", profileImage: "profile1", vehicleImage: "car1" }, favoriteStationIds: [], sentReviews: [], recentHistory: [] };
}

export function normalizePresentationState(input: unknown): PresentationState {
  const base = createPresentationState(), data = record(input), config = record(data.config);
  if (data.version !== 1) return base;
  const reviews: LocalSentReview[] = [];
  if (Array.isArray(data.sentReviews)) for (const item of data.sentReviews) {
    const review = record(item), station = stationById.get(String(review.stationId));
    if (!station || reviews.some(r => r.stationId === station.id) || ![review.rating, review.quality, review.cleaning, review.availability, review.amenities].every(validRating)) continue;
    const createdAt = typeof review.createdAt === "string" && Number.isFinite(Date.parse(review.createdAt)) ? review.createdAt : "2026-10-24T12:00:00.000Z";
    reviews.push({ id: text(review.id, `presentation-${station.id}`, 100), stationId: station.id, stationName: station.name, rating: review.rating as number, quality: review.quality as number, cleaning: review.cleaning as number, availability: review.availability as number, amenities: review.amenities as number, comment: typeof review.comment === "string" ? review.comment.trim().slice(0, 500) : "", wouldReturn: review.wouldReturn === true, recommend: review.recommend === true, createdAt, updatedAt: createdAt, isSynced: false });
  }
  const history: RecentHistoryItem[] = [];
  if (Array.isArray(data.recentHistory)) for (const item of data.recentHistory.slice(0, 20)) {
    const entry = record(item), station = stationById.get(String(entry.stationId));
    if (!station || !["viewed_station", "started_route", "sent_review"].includes(String(entry.action)) || typeof entry.createdAt !== "string" || !Number.isFinite(Date.parse(entry.createdAt))) continue;
    history.push({ id: text(entry.id, `presentation-history-${station.id}`, 100), stationId: station.id, stationName: station.name, address: station.address, action: entry.action as RecentHistoryItem["action"], createdAt: entry.createdAt });
  }
  return {
    version: 1, profileId: data.profileId === "urban" || data.profileId === "travel" ? data.profileId : null, enabled: data.enabled === true,
    config: { ...normalizarConfiguracaoDemonstrativa(config), ...normalizeBatteryData(config), driverName: text(config.driverName, base.config.driverName, 60), profileImage: config.profileImage === "profile2" ? "profile2" : "profile1", vehicleImage: config.vehicleImage === "car2" ? "car2" : "car1" },
    favoriteStationIds: Array.isArray(data.favoriteStationIds) ? [...new Set(data.favoriteStationIds.filter((id): id is string => typeof id === "string" && stationById.has(id)))] : [],
    sentReviews: reviews, recentHistory: history,
  };
}

export const presentationPreferenceKeys = ["vehicleName", "vehicleRangeKm", "demoOriginId", "batteryPercent", "batterySource", "batteryUpdatedAt"] as const;
export function resolvePresentationPreferences(base: UserPreferences, state: PresentationState, allowed: boolean): UserPreferences {
  if (!allowed || !state.enabled) return base;
  return { ...base, ...Object.fromEntries(presentationPreferenceKeys.map(key => [key, state.config[key]])) };
}
