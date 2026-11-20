import assert from "node:assert/strict";
import test from "node:test";
import { getTripReadingLayout, shouldStackTripStats } from "../src/features/trip/tripLayout";

test("planejador dá largura aos rótulos em telas compactas e fonte ampliada", () => {
  for (const width of [320, 375, 390]) assert.equal(getTripReadingLayout(width).stacked, true);
  assert.equal(getTripReadingLayout(440).stacked, false);
  assert.equal(getTripReadingLayout(440, 1.1).stacked, true);
  assert.equal(getTripReadingLayout(768, 1.1, 2).stacked, true);
  assert.equal(getTripReadingLayout(1194, 1.1, 1.4).stacked, false);
});

test("métricas começam empilhadas até medir o contêiner, na exportação e no cliente", () => {
  assert.equal(shouldStackTripStats(0), true);
});

test("métricas reservam largura de leitura após descontar padding e separadores", () => {
  for (const viewport of [320, 375, 390]) {
    // 40 de margem externa, 40 de padding do cartão e 2 de bordas.
    assert.equal(shouldStackTripStats(viewport - 82), true);
    assert.equal(shouldStackTripStats(viewport - 82, 1.1), true);
  }
  for (const viewport of [481, 768]) {
    assert.equal(shouldStackTripStats(viewport - 82), false);
    assert.equal(shouldStackTripStats(viewport - 82, 1.1), false);
  }
  assert.equal(shouldStackTripStats(333), true);
  assert.equal(shouldStackTripStats(334), false);
  assert.equal(shouldStackTripStats(363, 1.1), true);
  assert.equal(shouldStackTripStats(365, 1.1), false);
});

test("métricas consideram a ampliação combinada do app e do sistema", () => {
  assert.equal(shouldStackTripStats(399, 1.1, 1.5), true);
  assert.equal(shouldStackTripStats(686, 1.1, 2), true);
  assert.equal(shouldStackTripStats(1112, 1.1, 1.4), false);
});
