import assert from "node:assert/strict";
import test from "node:test";
import { shouldStackStationCards } from "../src/features/stations/stationLayout";

test("iPhone em largura de leitura normal permite dois cartões", () => {
  assert.equal(shouldStackStationCards(349, 1.1, 1), false);
  assert.equal(shouldStackStationCards(349, 1.25, 1), true);
});
test("tela estreita ou ampliação nativa preserva coluna única para leitura", () => {
  assert.equal(shouldStackStationCards(276, 1.25, 1), true);
  assert.equal(shouldStackStationCards(349, 1.1, 2), true);
  assert.equal(shouldStackStationCards(0), true);
});
