import assert from "node:assert/strict";
import test from "node:test";
import { batteryLevelFromPosition } from "../src/utils/batteryAdjustment";

test("régua preserva limites e permite porcentagens individuais", () => {
  assert.equal(batteryLevelFromPosition(-20, 300), 0);
  assert.equal(batteryLevelFromPosition(400, 300), 100);
  assert.equal(batteryLevelFromPosition(111, 300), 37);
  assert.equal(batteryLevelFromPosition(0, 300), 0);
  assert.equal(batteryLevelFromPosition(300, 300), 100);
});
test("régua não altera bateria antes do layout nem com coordenadas inválidas", () => {
  for (const [x, w] of [[5, 0], [5, -1], [NaN, 300], [5, Infinity]]) {
    assert.equal(batteryLevelFromPosition(x, w), null);
  }
});
