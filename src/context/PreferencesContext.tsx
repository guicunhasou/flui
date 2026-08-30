import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { defaultFilters } from "../data/filterOptions";
import { fluiStorage } from "../storage";
import type {
  AppearanceMode,
  FontSizePreference,
  UserPreferences,
} from "../types";
import {
  AppTheme,
  getAppTheme,
  getFontScale,
  scaleFontSize,
} from "../theme/appTheme";

type PreferencesContextValue = {
  userPreferences: UserPreferences;
  appearanceMode: AppearanceMode;
  fontSize: FontSizePreference;
  theme: AppTheme;
  fontScale: number;
  isLoadingPreferences: boolean;
  isSavingPreferences: boolean;
  preferencesError: string | null;
  reloadPreferences: () => Promise<UserPreferences | null>;
  updateAppearanceMode: (appearanceMode: AppearanceMode) => Promise<void>;
  updateFontSize: (fontSize: FontSizePreference) => Promise<void>;
  updateBatteryPercent: (batteryPercent: number) => Promise<void>;
  scale: (size: number) => number;
};

const defaultUserPreferences: UserPreferences = {
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
    onlyOpen24h: defaultFilters.onlyOpen24h,
  },
  hasSeenOnboarding: false,
  appearanceMode: "light",
  fontSize: "default",
  vehicleRangeKm: 400,
  batteryPercent: 70,
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(
    defaultUserPreferences,
  );
  const [isLoadingPreferences, setIsLoadingPreferences] = useState(true);
  const [isSavingPreferences, setIsSavingPreferences] = useState(false);
  const [preferencesError, setPreferencesError] = useState<string | null>(null);

  const reloadPreferences = useCallback(async () => {
    try {
      setPreferencesError(null);
      setIsLoadingPreferences(true);

      const preferences = await fluiStorage.getUserPreferences();

      setUserPreferences(preferences);

      return preferences;
    } catch {
      setPreferencesError("Não foi possível carregar as preferências.");
      return null;
    } finally {
      setIsLoadingPreferences(false);
    }
  }, []);

  useEffect(() => {
    void reloadPreferences();
  }, [reloadPreferences]);

  const savePreferences = useCallback(
    async (preferences: Partial<UserPreferences>) => {
      try {
        setPreferencesError(null);
        setIsSavingPreferences(true);

        const nextPreferences =
          await fluiStorage.updateUserPreferences(preferences);

        setUserPreferences(nextPreferences);
      } catch {
        setPreferencesError("Não foi possível salvar as preferências.");
        throw new Error("Não foi possível salvar as preferências.");
      } finally {
        setIsSavingPreferences(false);
      }
    },
    [],
  );

  const updateAppearanceMode = useCallback(
    async (appearanceMode: AppearanceMode) => {
      await savePreferences({ appearanceMode });
    },
    [savePreferences],
  );

  const updateFontSize = useCallback(
    async (fontSize: FontSizePreference) => {
      await savePreferences({ fontSize });
    },
    [savePreferences],
  );

  const updateBatteryPercent = useCallback(
    async (batteryPercent: number) => {
      await savePreferences({
        batteryPercent: Math.min(100, Math.max(0, batteryPercent)),
      });
    },
    [savePreferences],
  );

  const appearanceMode = userPreferences.appearanceMode;
  const fontSize = userPreferences.fontSize;

  const theme = useMemo(() => getAppTheme(appearanceMode), [appearanceMode]);
  const fontScale = useMemo(() => getFontScale(fontSize), [fontSize]);

  const scale = useCallback(
    (size: number) => {
      return scaleFontSize(size, fontScale);
    },
    [fontScale],
  );

  const value = useMemo(
    () => ({
      userPreferences,
      appearanceMode,
      fontSize,
      theme,
      fontScale,
      isLoadingPreferences,
      isSavingPreferences,
      preferencesError,
      reloadPreferences,
      updateAppearanceMode,
      updateFontSize,
      updateBatteryPercent,
      scale,
    }),
    [
      userPreferences,
      appearanceMode,
      fontSize,
      theme,
      fontScale,
      isLoadingPreferences,
      isSavingPreferences,
      preferencesError,
      reloadPreferences,
      updateAppearanceMode,
      updateFontSize,
      updateBatteryPercent,
      scale,
    ],
  );

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function useAppPreferences() {
  const context = useContext(PreferencesContext);

  if (!context) {
    throw new Error(
      "useAppPreferences deve ser usado dentro de PreferencesProvider.",
    );
  }

  return context;
}