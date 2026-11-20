import assert from "node:assert/strict";
import Module, { createRequire } from "node:module";
import { beforeEach, test } from "node:test";

const memory = new Map<string, string>();
const require = createRequire(import.meta.url);
const nativePath = require.resolve("@react-native-async-storage/async-storage");
const nativeModule = new Module(nativePath);
nativeModule.exports = {
  getItem: async (key: string) => memory.get(key) ?? null,
  setItem: async (key: string, value: string) => { memory.set(key, value); },
  multiRemove: async (keys: string[]) => { keys.forEach(key => memory.delete(key)); },
};
require.cache[nativePath] = nativeModule;
const { fluiStorage, fluiStorageKeys } = require("../src/storage/fluiStorage.ts") as typeof import("../src/storage/fluiStorage");
beforeEach(() => memory.clear());

test("preferências antigas ou inválidas não ativam movimento reduzido por conversão de texto", async () => {
  for (const reduceMotion of [undefined, null, "false", "true", 1, {}, []]) {
    memory.set(fluiStorageKeys.userPreferences, JSON.stringify({ reduceMotion, fontSize: "large", demoOriginId: "next" }));
    const saved = await fluiStorage.getUserPreferences();
    assert.equal(saved.reduceMotion, false);
    assert.equal(saved.fontSize, "large");
    assert.equal(saved.demoOriginId, "next");
  }
});

test("salvar movimento preserva bateria, filtros, contraste e favoritos ao reler", async () => {
  const before = await fluiStorage.updateUserPreferences({ batteryPercent: 38, highContrast: true, fontSize: "large", demoOriginId: "next" });
  await fluiStorage.saveFavoriteStationIds(["station-01"]);
  const favorites = memory.get(fluiStorageKeys.favoriteStationIds);
  await fluiStorage.updateUserPreferences({ reduceMotion: true });
  assert.deepEqual(await fluiStorage.getUserPreferences(), { ...before, reduceMotion: true });
  await fluiStorage.updateUserPreferences({ reduceMotion: false });
  assert.deepEqual(await fluiStorage.getUserPreferences(), before);
  assert.equal(memory.get(fluiStorageKeys.favoriteStationIds), favorites);
});

test("falha de gravação não substitui o ajuste de movimento persistido", async () => {
  await fluiStorage.updateUserPreferences({ reduceMotion: true });
  const before = memory.get(fluiStorageKeys.userPreferences);
  const setItem = nativeModule.exports.setItem;
  nativeModule.exports.setItem = async () => { throw new Error("armazenamento indisponível"); };
  try {
    await assert.rejects(fluiStorage.updateUserPreferences({ reduceMotion: false }), /armazenamento indisponível/);
    assert.equal(memory.get(fluiStorageKeys.userPreferences), before);
  } finally { nativeModule.exports.setItem = setItem; }
});
