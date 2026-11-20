import { useAppPreferences } from "../context/PreferencesContext";
import { presentationActivityStorage } from "../features/presentation/presentationStorage";
import { useCallback, useEffect, useState, useRef } from 'react';

import { fluiStorage } from '../storage';
import {
  CreateLocalReviewInput,
  CreateRecentHistoryInput,
  FluiStorageSnapshot,
  UserPreferences,
} from '../types';

export function useFluiStorage() {
  const { presentationState, isLoadingPreferences, updateUserPreferences: savePreferences } = useAppPreferences();
  const presentationEnabled = __DEV__ && presentationState.enabled;
  const storage = presentationEnabled ? presentationActivityStorage : fluiStorage;
  const scopeRef = useRef(presentationEnabled);
  scopeRef.current = presentationEnabled;
  const [snapshotScope, setSnapshotScope] = useState<boolean | null>(null);
  const [snapshot, setSnapshot] = useState<FluiStorageSnapshot | null>(null);
  const [isLoadingStorage, setIsLoadingStorage] = useState(true);
  const [storageError, setStorageError] = useState<string | null>(null);

  const reloadStorage = useCallback(async () => {
    try {
      setStorageError(null);
      setIsLoadingStorage(true);

      const nextSnapshot = await storage.getSnapshot();

      if (scopeRef.current !== presentationEnabled) return nextSnapshot;
      setSnapshot(nextSnapshot);
      setSnapshotScope(presentationEnabled);

      return nextSnapshot;
    } catch {
      if (scopeRef.current === presentationEnabled) setStorageError('Não foi possível carregar os dados locais.');
      return null;
    } finally {
      if (scopeRef.current === presentationEnabled) setIsLoadingStorage(false);
    }
  }, [storage, presentationEnabled]);

  useEffect(() => {
    void reloadStorage();
  }, [reloadStorage, storage]);

  const toggleFavoriteStation = useCallback(
    async (stationId: string) => {
      const result = await storage.toggleFavoriteStationId(stationId);

      setSnapshot((currentSnapshot) => {
        if (scopeRef.current !== presentationEnabled || !currentSnapshot) {
          return currentSnapshot;
        }

        return {
          ...currentSnapshot,
          favoriteStationIds: result.favoriteStationIds,
        };
      });

      return result;
    },
    [storage, presentationEnabled],
  );

  const addSentReview = useCallback(async (review: CreateLocalReviewInput) => {
    const createdReview = await storage.addSentReview(review);
    const nextSnapshot = await storage.getSnapshot();

    if (scopeRef.current === presentationEnabled) setSnapshot(nextSnapshot);

    return createdReview;
  }, [storage, presentationEnabled]);

  const addRecentHistory = useCallback(
    async (historyItem: CreateRecentHistoryInput) => {
      const createdHistoryItem = await storage.addRecentHistory(historyItem);
      const nextSnapshot = await storage.getSnapshot();

      if (scopeRef.current === presentationEnabled) setSnapshot(nextSnapshot);

      return createdHistoryItem;
    },
    [storage, presentationEnabled],
  );

  const updateUserPreferences = useCallback(
    async (preferences: Partial<UserPreferences>) => {
      const nextPreferences =
        await savePreferences(preferences);

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
    [savePreferences],
  );

  const clearLocalData = useCallback(async () => {
    await storage.clearAll();
    await reloadStorage();
  }, [reloadStorage, storage]);

  const scopedSnapshot = snapshotScope === presentationEnabled ? snapshot : null;
  return {
    favoriteStationIds: scopedSnapshot?.favoriteStationIds ?? [],
    sentReviews: scopedSnapshot?.sentReviews ?? [],
    recentHistory: scopedSnapshot?.recentHistory ?? [],
    userPreferences: scopedSnapshot?.userPreferences ?? null,
    isLoadingStorage: isLoadingStorage || isLoadingPreferences || (snapshotScope !== presentationEnabled && !storageError),
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