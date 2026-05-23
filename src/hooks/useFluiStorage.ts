import { useCallback, useEffect, useState } from 'react';

import { fluiStorage } from '../storage';
import {
  CreateLocalReviewInput,
  CreateRecentHistoryInput,
  FluiStorageSnapshot,
  UserPreferences,
} from '../types';

export function useFluiStorage() {
  const [snapshot, setSnapshot] = useState<FluiStorageSnapshot | null>(null);
  const [isLoadingStorage, setIsLoadingStorage] = useState(true);
  const [storageError, setStorageError] = useState<string | null>(null);

  const reloadStorage = useCallback(async () => {
    try {
      setStorageError(null);
      setIsLoadingStorage(true);

      const nextSnapshot = await fluiStorage.getSnapshot();

      setSnapshot(nextSnapshot);

      return nextSnapshot;
    } catch {
      setStorageError('Não foi possível carregar os dados locais.');
      return null;
    } finally {
      setIsLoadingStorage(false);
    }
  }, []);

  useEffect(() => {
    void reloadStorage();
  }, [reloadStorage]);

  const toggleFavoriteStation = useCallback(
    async (stationId: string) => {
      const result = await fluiStorage.toggleFavoriteStationId(stationId);

      setSnapshot((currentSnapshot) => {
        if (!currentSnapshot) {
          return currentSnapshot;
        }

        return {
          ...currentSnapshot,
          favoriteStationIds: result.favoriteStationIds,
        };
      });

      return result;
    },
    [],
  );

  const addSentReview = useCallback(async (review: CreateLocalReviewInput) => {
    const createdReview = await fluiStorage.addSentReview(review);
    const nextSnapshot = await fluiStorage.getSnapshot();

    setSnapshot(nextSnapshot);

    return createdReview;
  }, []);

  const addRecentHistory = useCallback(
    async (historyItem: CreateRecentHistoryInput) => {
      const createdHistoryItem = await fluiStorage.addRecentHistory(historyItem);
      const nextSnapshot = await fluiStorage.getSnapshot();

      setSnapshot(nextSnapshot);

      return createdHistoryItem;
    },
    [],
  );

  const updateUserPreferences = useCallback(
    async (preferences: Partial<UserPreferences>) => {
      const nextPreferences =
        await fluiStorage.updateUserPreferences(preferences);

      setSnapshot((currentSnapshot) => {
        if (!currentSnapshot) {
          return currentSnapshot;
        }

        return {
          ...currentSnapshot,
          userPreferences: nextPreferences,
        };
      });

      return nextPreferences;
    },
    [],
  );

  const clearLocalData = useCallback(async () => {
    await fluiStorage.clearAll();
    await reloadStorage();
  }, [reloadStorage]);

  return {
    favoriteStationIds: snapshot?.favoriteStationIds ?? [],
    sentReviews: snapshot?.sentReviews ?? [],
    recentHistory: snapshot?.recentHistory ?? [],
    userPreferences: snapshot?.userPreferences ?? null,
    isLoadingStorage,
    storageError,
    reloadStorage,
    toggleFavoriteStation,
    addSentReview,
    addRecentHistory,
    updateUserPreferences,
    clearLocalData,
  };
}

export default useFluiStorage;