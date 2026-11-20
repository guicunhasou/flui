import assert from "node:assert/strict";
import Module, { createRequire } from "node:module";
import { test } from "node:test";
import { defaultFilters } from "../src/data/filterOptions";
import { chargingStations } from "../src/data/fixtures/chargingStations";
import { filtrarEstacoes } from "../src/utils/filtrarEstacoes";
import { answerMessage } from "../src/features/assistant/chatEngine";
import { createStation } from "./fixtures";

const require = createRequire(import.meta.url);
const nativePath = require.resolve("@react-native-async-storage/async-storage");
const storageModule = new Module(nativePath);
const stored = new Map<string, string>();

storageModule.exports = {
  getItem: async (key: string) => stored.get(key) ?? null,
  setItem: async (key: string, value: string) => {
    stored.set(key, value);
  },
};
require.cache[nativePath] = storageModule;

const { fluiStorage } = require("../src/storage/fluiStorage.ts") as typeof import("../src/storage/fluiStorage");

test("a versão integrada lê e mantém os quatro registros locais produzidos pela v1", async () => {
  const favorites = ["station-02", "station-12"];
  const reviews = [{
    id: "local-review-v1",
    stationId: "station-02",
    stationName: "Flui Express MASP",
    rating: 4,
    quality: 5,
    cleaning: 4,
    availability: 3,
    amenities: 4,
    comment: "Avaliação criada na v1",
    wouldReturn: true,
    recommend: false,
    createdAt: "2026-09-18T12:00:00.000Z",
    updatedAt: "2026-09-18T12:10:00.000Z",
    isSynced: false,
  }];
  const history = [{
    id: "local-history-v1",
    stationId: "station-12",
    stationName: "Garagem Verde Brigadeiro",
    address: "Endereço salvo na v1",
    action: "viewed_station",
    createdAt: "2026-09-18T12:20:00.000Z",
  }];
  const preferences = {
    preferredConnectors: ["ccs2"],
    preferredAmenities: ["restroom"],
    preferredRouteApp: "waze",
    savedFilters: {
      ...defaultFilters,
      connectorTypes: ["ccs2"],
      distance: { maxKm: 20 },
      onlyAvailableChargers: true,
    },
    hasSeenOnboarding: true,
    appearanceMode: "dark",
    fontSize: "large",
    vehicleRangeKm: 400,
    batteryPercent: 32,
  };
  const legacyEntries = {
    "@flui:favoriteStationIds": JSON.stringify(favorites),
    "@flui:sentReviews": JSON.stringify(reviews),
    "@flui:recentHistory": JSON.stringify(history),
    "@flui:userPreferences": JSON.stringify(preferences),
  };
  for (const [key, value] of Object.entries(legacyEntries)) {
    stored.set(key, value);
  }

  const before = await fluiStorage.getSnapshot();
  assert.deepEqual(before.favoriteStationIds, favorites);
  assert.deepEqual(before.sentReviews, reviews);
  assert.deepEqual(before.recentHistory, history);
  for (const [key, value] of Object.entries(preferences)) {
    assert.deepEqual(before.userPreferences[key as keyof typeof preferences], value);
  }
  assert.equal(before.userPreferences.batterySource, "unknown");
  assert.equal(before.userPreferences.batteryUpdatedAt, null);
  assert.deepEqual(Object.fromEntries(stored), legacyEntries);

  await fluiStorage.updateUserPreferences({ reduceMotion: true });
  assert.deepEqual(await fluiStorage.getSnapshot(), {
    ...before,
    userPreferences: { ...before.userPreferences, reduceMotion: true },
  });
  for (const key of ["@flui:favoriteStationIds", "@flui:sentReviews", "@flui:recentHistory"] as const) {
    assert.equal(stored.get(key), legacyEntries[key]);
  }
});

test("o catálogo ampliado resolve as referências das doze estações da v1", () => {
  const ids = new Set(chargingStations.map(station => station.id));
  assert.equal(ids.size, chargingStations.length);
  assert.ok(ids.size > 12);
  for (let index = 1; index <= 12; index++) {
    const id = `station-${String(index).padStart(2, "0")}`;
    assert.ok(ids.has(id), `Referência preexistente desapareceu: ${id}`);
  }
});

test("carregadores livres usa os conectores selecionados em conjunto com o horário", () => {
  const usable = createStation();
  const stalled = createStation({
    id: "sem-vaga-ccs2",
    connectors: [
      { ...usable.connectors[0], availableChargers: 0 },
      { ...usable.connectors[0], id: "type2-livre", type: "type2", label: "Tipo 2" },
    ],
  });
  const closed = createStation({
    id: "fora-do-horario",
    openingSchedule: { timeZone: "America/Sao_Paulo", periods: [] },
  });
  const estacoes = [stalled, closed, usable];
  const agora = new Date("2026-11-19T12:00:00.000Z");
  const filtros = { ...defaultFilters, connectorTypes: ["ccs2" as const] };

  assert.deepEqual(filtrarEstacoes({ estacoes, filtros, agora }), estacoes);
  assert.deepEqual(
    filtrarEstacoes({ estacoes, filtros: { ...filtros, onlyAvailableChargers: true }, agora }),
    [usable],
  );
});

test("a FluIA só recomenda recarga livre em um dos conectores selecionados", () => {
  const station = createStation();
  const onlyType2 = createStation({ connectors: [
    { ...station.connectors[0], availableChargers: 0 },
    { ...station.connectors[0], id: "type2", type: "type2", label: "Tipo 2" },
  ] });
  const context = {
    stations: [onlyType2], vehicleRangeKm: 400, batteryPercent: 70,
    now: new Date("2026-11-19T12:00:00.000Z"),
  };
  const question = "Onde carregar rápido?";
  assert.equal(answerMessage(question, { ...context, vehicleConnectorTypes: ["ccs2"] }).recommendation, undefined);
  assert.equal(answerMessage(question, { ...context, vehicleConnectorTypes: ["type2"] }).recommendation?.primary.id, onlyType2.id);
});
