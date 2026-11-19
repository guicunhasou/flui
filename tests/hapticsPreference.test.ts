import assert from "node:assert/strict";
import Module, { createRequire } from "node:module";
import { beforeEach, test } from "node:test";

const require = createRequire(import.meta.url);
const memory = new Map<string, string>();
const platform = { OS: "ios" };
const calls: string[] = [];
let failNative = false;
function mock(name: string, exports: object) {
  const path = require.resolve(name);
  const module = new Module(path); module.exports = exports; require.cache[path] = module;
  return module;
}
mock("react-native", { Platform: platform });
mock("expo-haptics", {
  ImpactFeedbackStyle: { Light: "light" },
  impactAsync: async (style: string) => { calls.push(`impact:${style}`); if (failNative) throw new Error("tátil indisponível"); },
  selectionAsync: async () => { calls.push("selection"); if (failNative) throw new Error("tátil indisponível"); },
});
const storage = mock("@react-native-async-storage/async-storage", {
  getItem: async (key: string) => memory.get(key) ?? null,
  setItem: async (key: string, value: string) => { memory.set(key, value); },
  multiRemove: async (keys: string[]) => { keys.forEach(key => memory.delete(key)); },
});
const { triggerImpact, triggerSelection, setHapticsEnabled } = require("../src/utils/interaction.ts") as typeof import("../src/utils/interaction");
const { fluiStorage, fluiStorageKeys } = require("../src/storage/fluiStorage.ts") as typeof import("../src/storage/fluiStorage");
beforeEach(() => { memory.clear(); calls.length = 0; platform.OS = "ios"; failNative = false; setHapticsEnabled(true); });

test("desativar vibração impede impactos e seleção; reativar restaura a ponte existente", () => {
  setHapticsEnabled(false); triggerImpact(); triggerSelection(); assert.deepEqual(calls, []);
  setHapticsEnabled(true); triggerImpact(); triggerSelection(); assert.deepEqual(calls, ["impact:light", "selection"]);
});
test("web permanece sem chamada tátil mesmo com preferência habilitada", () => {
  platform.OS = "web"; triggerImpact(); triggerSelection(); assert.deepEqual(calls, []);
});
test("indisponibilidade tátil não rejeita a ação de interface", async () => {
  failNative = true; triggerImpact(); triggerSelection();
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(calls.length, 2);
});
test("preferências antigas mantêm vibração padrão e booleano false é respeitado", async () => {
  for (const hapticsEnabled of [undefined, null, "false", 0, {}]) {
    memory.set(fluiStorageKeys.userPreferences, JSON.stringify({ hapticsEnabled }));
    assert.equal((await fluiStorage.getUserPreferences()).hapticsEnabled, true);
  }
  memory.set(fluiStorageKeys.userPreferences, JSON.stringify({ hapticsEnabled: false }));
  assert.equal((await fluiStorage.getUserPreferences()).hapticsEnabled, false);
});
test("salvar vibração preserva movimento, dados pessoais e favoritos", async () => {
  const before = await fluiStorage.updateUserPreferences({ reduceMotion: true, highContrast: true, demoOriginId: "next", batteryPercent: 42 });
  await fluiStorage.saveFavoriteStationIds(["station-01"]);
  const favorites = memory.get(fluiStorageKeys.favoriteStationIds);
  await fluiStorage.updateUserPreferences({ hapticsEnabled: false });
  assert.deepEqual(await fluiStorage.getUserPreferences(), { ...before, hapticsEnabled: false });
  assert.equal(memory.get(fluiStorageKeys.favoriteStationIds), favorites);
});
test("falha de escrita não substitui a preferência tátil persistida", async () => {
  await fluiStorage.updateUserPreferences({ hapticsEnabled: false });
  const before = memory.get(fluiStorageKeys.userPreferences), setItem = storage.exports.setItem;
  storage.exports.setItem = async () => { throw new Error("armazenamento indisponível"); };
  try {
    await assert.rejects(fluiStorage.updateUserPreferences({ hapticsEnabled: true }), /armazenamento indisponível/);
    assert.equal(memory.get(fluiStorageKeys.userPreferences), before);
  } finally { storage.exports.setItem = setItem; }
});
