import { getJsonItem, setJsonItem } from "../../storage/jsonStorage";
import { fluiStorage } from "../../storage/fluiStorage";
import type { CreateLocalReviewInput, CreateRecentHistoryInput } from "../../types";
import { createPresentationState, normalizePresentationState, type PresentationState } from "./presentationScenario";

export const PRESENTATION_STORAGE_KEY = "@flui:internalPresentation:v1";
// Uma chave separada e uma fila: cenário aplicado atomicamente, sem sobrescrever
// favoritos/avaliações/preferências normais ou perder duas edições simultâneas.
export function createPresentationStore(read: () => Promise<unknown>, write: (value: PresentationState) => Promise<void>) {
  let pending: Promise<unknown> = Promise.resolve();
  return {
    async getState() { await pending; return normalizePresentationState(await read()); },
    update(change: (current: PresentationState) => PresentationState) {
      const next = pending.then(async () => {
        const value = normalizePresentationState(change(normalizePresentationState(await read())));
        await write(value);
        return value;
      });
      pending = next.catch(() => {});
      return next;
    },
  };
}
export const presentationStore = createPresentationStore(
  () => getJsonItem(PRESENTATION_STORAGE_KEY, createPresentationState()),
  value => setJsonItem(PRESENTATION_STORAGE_KEY, value),
);
export const presentationActivityStorage = {
  async getSnapshot() {
    const [state, userPreferences] = await Promise.all([presentationStore.getState(), fluiStorage.getUserPreferences()]);
    return { favoriteStationIds: state.favoriteStationIds, sentReviews: state.sentReviews, recentHistory: state.recentHistory, userPreferences };
  },
  async toggleFavoriteStationId(stationId: string) {
    const state = await presentationStore.update(current => ({ ...current, favoriteStationIds: current.favoriteStationIds.includes(stationId) ? current.favoriteStationIds.filter(id => id !== stationId) : [...current.favoriteStationIds, stationId] }));
    return { favoriteStationIds: state.favoriteStationIds, isFavorite: state.favoriteStationIds.includes(stationId) };
  },
  async addSentReview(input: CreateLocalReviewInput) {
    const createdAt = new Date().toISOString();
    const state = await presentationStore.update(current => {
      const next = normalizePresentationState({ ...current, sentReviews: [{ ...input, id: `presentation-review-${input.stationId}`, createdAt, updatedAt: createdAt, isSynced: false }, ...current.sentReviews.filter(review => review.stationId !== input.stationId)] });
      if (!next.sentReviews.some(review => review.stationId === input.stationId)) throw new Error("Avaliação de cenário inválida.");
      return next;
    });
    const review = state.sentReviews.find(item => item.stationId === input.stationId);
    if (!review) throw new Error("Avaliação de cenário inválida.");
    return review;
  },
  async addRecentHistory(input: CreateRecentHistoryInput) {
    const createdAt = new Date().toISOString();
    const state = await presentationStore.update(current => {
      const id = `presentation-history-${input.action}-${input.stationId}`;
      const next = normalizePresentationState({ ...current, recentHistory: [{ ...input, id, createdAt }, ...current.recentHistory.filter(item => item.stationId !== input.stationId || item.action !== input.action)] });
      if (next.recentHistory[0]?.id !== id) throw new Error("Histórico de cenário inválido.");
      return next;
    });
    const history = state.recentHistory[0];
    if (!history) throw new Error("Histórico de cenário inválido.");
    return history;
  },
  async clearAll() { await presentationStore.update(current => ({ ...current, favoriteStationIds: [], sentReviews: [], recentHistory: [] })); },
};
