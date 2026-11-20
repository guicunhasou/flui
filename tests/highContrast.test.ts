import assert from "node:assert/strict";
import Module, { createRequire } from "node:module";
import { beforeEach, test } from "node:test";
import { appThemes, getAppTheme, highContrastThemes } from "../src/theme/appTheme";

// Apenas a ponte nativa é substituída. Exercitamos a leitura, normalização e
// atualização reais do armazenamento, sem depender de React Native no Node.
const memory = new Map<string, string>();
const require = createRequire(import.meta.url);
const nativePath = require.resolve("@react-native-async-storage/async-storage");
const nativeModule = new Module(nativePath);
nativeModule.exports = {
  getItem: async (key: string) => memory.get(key) ?? null,
  setItem: async (key: string, value: string) => { memory.set(key, value); },
  multiRemove: async (keys: string[]) => { keys.forEach((key) => memory.delete(key)); },
};
require.cache[nativePath] = nativeModule;
const { fluiStorage, fluiStorageKeys } = require("../src/storage/fluiStorage.ts") as typeof import("../src/storage/fluiStorage");

beforeEach(() => memory.clear());

function luminance(hex: string) {
  const [r, g, b] = hex.slice(1).match(/../g)!.map((value) => {
    const channel = parseInt(value, 16) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return r * 0.2126 + g * 0.7152 + b * 0.0722;
}

function contrast(a: string, b: string) {
  const [lighter, darker] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (lighter + 0.05) / (darker + 0.05);
}

test("alto contraste é independente de claro/escuro e restaura exatamente o tema original", () => {
  for (const mode of ["light", "dark"] as const) {
    assert.equal(getAppTheme(mode), appThemes[mode]);
    assert.equal(getAppTheme(mode, true), highContrastThemes[mode]);
    assert.equal(getAppTheme(mode, false), appThemes[mode]);
    assert.deepEqual(Object.keys(highContrastThemes[mode]).sort(), Object.keys(appThemes[mode]).sort());
  }
});

test("alto contraste mantém textos em 7:1, inclusive seleção e avisos", () => {
  for (const [mode, theme] of Object.entries(highContrastThemes)) {
    for (const background of [theme.background, theme.surface, theme.primarySoft, theme.primarySoftStrong, theme.selectedCard, theme.successSoft, theme.yellow, theme.dangerSoft]) {
      for (const foreground of [theme.text, theme.textMuted, theme.textLight, theme.primary]) {
        assert.ok(contrast(foreground, background) >= 7, `${mode}: ${foreground}/${background}`);
      }
    }
    for (const [foreground, background] of [
      [theme.success, theme.successSoft], [theme.warningText, theme.yellow],
      [theme.dangerText, theme.dangerSoft], [theme.onPrimary, theme.primary],
    ]) {
      assert.ok(contrast(foreground, background) >= 7, `${mode} indicador: ${foreground}/${background}`);
    }
    for (const background of [theme.background, theme.surface, theme.selectedCard]) {
      assert.ok(contrast(theme.border, background) >= 3, `${mode}: contorno/${background}`);
    }
  }
});

test("preferências antigas e valores inválidos iniciam sem alto contraste", async () => {
  assert.equal((await fluiStorage.getUserPreferences()).highContrast, false);
  for (const highContrast of [undefined, null, "true", "false", 1, {}, []]) {
    memory.set(fluiStorageKeys.userPreferences, JSON.stringify({ appearanceMode: "dark", fontSize: "large", highContrast }));
    const preferences = await fluiStorage.getUserPreferences();
    assert.equal(preferences.highContrast, false);
    assert.equal(preferences.appearanceMode, "dark");
    assert.equal(preferences.fontSize, "large");
  }
});

test("salvar e reler contraste preserva veículo, bateria, origem, filtros e outros dados locais", async () => {
  const original = await fluiStorage.updateUserPreferences({
    appearanceMode: "dark", fontSize: "large", vehicleName: "Veículo de teste",
    vehicleRangeKm: 330, demoOriginId: "vila-mariana", batteryPercent: 46,
    batterySource: "manual", batteryUpdatedAt: "2026-10-22T06:00:00.000Z",
  });
  await fluiStorage.updateUserPreferences({ savedFilters: { ...original.savedFilters, onlyOpenNow: true } });
  const before = await fluiStorage.getUserPreferences();
  await fluiStorage.saveFavoriteStationIds(["estacao-preservada"]);
  const favoriteJson = memory.get(fluiStorageKeys.favoriteStationIds);

  await fluiStorage.updateUserPreferences({ highContrast: true });
  assert.equal(JSON.parse(memory.get(fluiStorageKeys.userPreferences)!).highContrast, true);
  assert.deepEqual(await fluiStorage.getUserPreferences(), { ...before, highContrast: true });
  await fluiStorage.updateUserPreferences({ appearanceMode: "light", fontSize: "small" });
  assert.equal((await fluiStorage.getUserPreferences()).highContrast, true);
  await fluiStorage.updateUserPreferences({ highContrast: false });
  assert.deepEqual(await fluiStorage.getUserPreferences(), { ...before, appearanceMode: "light", fontSize: "small", highContrast: false });
  assert.equal(memory.get(fluiStorageKeys.favoriteStationIds), favoriteJson);
});

test("falha ao salvar contraste é propagada sem substituir a preferência persistida", async () => {
  await fluiStorage.updateUserPreferences({ highContrast: true });
  const saved = memory.get(fluiStorageKeys.userPreferences);
  const set = nativeModule.exports.setItem;
  nativeModule.exports.setItem = async () => { throw new Error("armazenamento indisponível"); };
  try {
    await assert.rejects(fluiStorage.updateUserPreferences({ highContrast: false }), /armazenamento indisponível/);
    assert.equal(memory.get(fluiStorageKeys.userPreferences), saved);
  } finally {
    nativeModule.exports.setItem = set;
  }
});
