import { createPresentationState, presentationPreferenceKeys, resolvePresentationPreferences, type PresentationState } from "../features/presentation/presentationScenario";
import { presentationStore } from "../features/presentation/presentationStorage";
import { normalizeBatteryData } from "../utils/batteryData";
import { setHapticsEnabled } from "../utils/interaction";
import { chargingStations } from "../data/fixtures/chargingStations";
import { obterOrigemDemonstrativa } from "../data/demonstracao";
import {
  aplicarOrigemDemonstrativa,
  normalizarConfiguracaoDemonstrativa,
  validarConfiguracaoDemonstrativa,
  type ConfiguracaoDemonstrativa,
} from "../utils/demonstracao";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useRef,
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
  presentationState: PresentationState;
  savePresentation: (state: PresentationState) => Promise<void>;
  updateUserPreferences: (patch: Partial<UserPreferences>) => Promise<UserPreferences>;
  appearanceMode: AppearanceMode;
  highContrast: boolean;
  fontSize: FontSizePreference;
  theme: AppTheme;
  fontScale: number;
  isLoadingPreferences: boolean;
  isSavingPreferences: boolean;
  preferencesError: string | null;
  reloadPreferences: () => Promise<UserPreferences | null>;
  updateAppearanceMode: (appearanceMode: AppearanceMode) => Promise<void>;
  updateHighContrast: (highContrast: boolean) => Promise<void>;
  updateReduceMotion: (reduceMotion: boolean) => Promise<void>;
  updateHapticsEnabled: (enabled: boolean) => Promise<void>;
  updateFontSize: (fontSize: FontSizePreference) => Promise<void>;
  updateBatteryPercent: (batteryPercent: number) => Promise<void>;
  updateDemoConfiguration: (config: ConfiguracaoDemonstrativa) => Promise<void>;
  demoOrigin: ReturnType<typeof obterOrigemDemonstrativa>;
  demoStations: ReturnType<typeof aplicarOrigemDemonstrativa>;
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
    onlyAvailableChargers: defaultFilters.onlyAvailableChargers,
    onlyOpen24h: defaultFilters.onlyOpen24h,
  },
  hasSeenOnboarding: false,
  appearanceMode: "light",
  highContrast: false,
  reduceMotion: false,
  hapticsEnabled: true,
  speechVoiceId: null,
  fontSize: "default",
  ...normalizarConfiguracaoDemonstrativa(),
  ...normalizeBatteryData(),
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [basePreferences, setUserPreferences] = useState<UserPreferences>(
    defaultUserPreferences,
  );
  const [presentationState, setPresentationState] = useState(createPresentationState);
  const presentationReady = useRef(!__DEV__);
  const userPreferences = useMemo(() => resolvePresentationPreferences(basePreferences, presentationState, __DEV__), [basePreferences, presentationState]);
  const [isLoadingPreferences, setIsLoadingPreferences] = useState(true);
  const [isSavingPreferences, setIsSavingPreferences] = useState(false);
  const [preferencesError, setPreferencesError] = useState<string | null>(null);

  useEffect(() => {
    setHapticsEnabled(!isLoadingPreferences && userPreferences.hapticsEnabled);
  }, [isLoadingPreferences, userPreferences.hapticsEnabled]);

  const reloadPreferences = useCallback(async () => {
    try {
      setPreferencesError(null);
      setIsLoadingPreferences(true);
      presentationReady.current = !__DEV__;

      const [preferences, presentation] = await Promise.all([
        fluiStorage.getUserPreferences(),
        __DEV__ ? presentationStore.getState() : Promise.resolve(createPresentationState()),
      ]);
      presentationReady.current = true;
      setPresentationState(presentation);
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

        if (!presentationReady.current) throw new Error("Cenário interno indisponível.");
        const scenarioPatch: Partial<UserPreferences> = {}, basePatch: Partial<UserPreferences> = {};
        for (const [key, value] of Object.entries(preferences)) {
          Object.assign(__DEV__ && presentationState.enabled && presentationPreferenceKeys.includes(key as typeof presentationPreferenceKeys[number]) ? scenarioPatch : basePatch, { [key]: value });
        }
        const nextPreferences = Object.keys(basePatch).length ? await fluiStorage.updateUserPreferences(basePatch) : basePreferences;
        let nextPresentation = presentationState;
        if (Object.keys(scenarioPatch).length) {
          nextPresentation = await presentationStore.update(current => ({ ...current, config: { ...current.config, ...scenarioPatch } }));
          setPresentationState(nextPresentation);
        }
        setUserPreferences(nextPreferences);
        return resolvePresentationPreferences(nextPreferences, nextPresentation, __DEV__);
      } catch {
        setPreferencesError("Não foi possível salvar as preferências.");
        throw new Error("Não foi possível salvar as preferências.");
      } finally {
        setIsSavingPreferences(false);
      }
    },
    [basePreferences, presentationState],
  );

  const savePresentation = useCallback(async (state: PresentationState) => {
    if (!__DEV__ || !presentationReady.current) throw new Error("Ferramenta interna indisponível.");
    setIsSavingPreferences(true);
    try {
      const saved = await presentationStore.update(() => state);
      setPresentationState(saved);
    } finally { setIsSavingPreferences(false); }
  }, []);

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

  const updateHighContrast = useCallback(
    async (highContrast: boolean) => {
      await savePreferences({ highContrast });
    },
    [savePreferences],
  );

  const updateReduceMotion = useCallback(
    async (reduceMotion: boolean) => {
      await savePreferences({ reduceMotion });
    },
    [savePreferences],
  );

  const updateHapticsEnabled = useCallback(
    async (hapticsEnabled: boolean) => {
      await savePreferences({ hapticsEnabled });
    },
    [savePreferences],
  );

  const updateBatteryPercent = useCallback(
    async (batteryPercent: number) => {
      await savePreferences({
        batteryPercent: Math.min(100, Math.max(0, batteryPercent)),
        batterySource: "manual",
        batteryUpdatedAt: new Date().toISOString(),
      });
    },
    [savePreferences],
  );

  const updateDemoConfiguration = useCallback(
    async (config: ConfiguracaoDemonstrativa) => {
      const error = validarConfiguracaoDemonstrativa(config);
      if (error) throw new Error(error);
      await savePreferences(normalizarConfiguracaoDemonstrativa(config));
    },
    [savePreferences],
  );

  const demoOrigin = obterOrigemDemonstrativa(userPreferences.demoOriginId);
  const demoStations = useMemo(
    () => aplicarOrigemDemonstrativa(chargingStations, demoOrigin),
    [demoOrigin],
  );
  const appearanceMode = userPreferences.appearanceMode;
  const highContrast = userPreferences.highContrast;
  const fontSize = userPreferences.fontSize;

  const theme = useMemo(
    () => getAppTheme(appearanceMode, highContrast),
    [appearanceMode, highContrast],
  );
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
      presentationState,
      savePresentation,
      updateUserPreferences: savePreferences,
      appearanceMode,
      highContrast,
      fontSize,
      theme,
      fontScale,
      isLoadingPreferences,
      isSavingPreferences,
      preferencesError,
      reloadPreferences,
      updateAppearanceMode,
      updateHighContrast,
      updateReduceMotion,
      updateHapticsEnabled,
      updateFontSize,
      updateBatteryPercent,
      updateDemoConfiguration,
      demoOrigin,
      demoStations,
      scale,
    }),
    [
      userPreferences,
      presentationState,
      savePresentation,
      savePreferences,
      appearanceMode,
      highContrast,
      fontSize,
      theme,
      fontScale,
      isLoadingPreferences,
      isSavingPreferences,
      preferencesError,
      reloadPreferences,
      updateAppearanceMode,
      updateHighContrast,
      updateReduceMotion,
      updateHapticsEnabled,
      updateFontSize,
      updateBatteryPercent,
      updateDemoConfiguration,
      demoOrigin,
      demoStations,
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
