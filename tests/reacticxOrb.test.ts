import assert from "node:assert/strict";
import test from "node:test";
import { FLUIA_STATE_LABELS, type FluiaState } from "../src/features/assistant/fluiaState";
import { ENERGY_ORB_COLORS } from "../src/features/assistant/energyOrbPresentation";
import { clampOrbFrameDelta, getMapOrbPulse, getReacticxOrbPresentation, REACTICX_SHADER_INTERVAL_MS } from "../src/features/assistant/reacticxOrbPresentation";
import { parseColor } from "../src/features/assistant/reacticx/helper";

const states = Object.keys(FLUIA_STATE_LABELS) as FluiaState[];

test("Reacticx representa seis estados com paleta do Flui e brilho limitado", () => {
  for (const state of states) {
    const effect = getReacticxOrbPresentation(state, false, true);
    assert.equal(effect.colors[0], ENERGY_ORB_COLORS[state].core);
    assert.equal(effect.colors[2], ENERGY_ORB_COLORS[state].rim);
    assert.ok(effect.intensity > 0 && effect.intensity <= 1.5);
    assert.ok(effect.glowRadius >= 0.4 && effect.glowRadius <= 0.46);
    assert.equal(effect.animate, state !== "aviso" && state !== "alerta");
    for (const color of effect.colors) for (const channel of parseColor(color)) assert.ok(channel >= 0 && channel <= 1);
  }
});

test("redução de movimento, tela inativa, aviso e alerta não iniciam o relógio do shader", () => {
  for (const state of states) {
    assert.equal(getReacticxOrbPresentation(state, true, true).animate, false);
    assert.equal(getReacticxOrbPresentation(state, false, false).animate, false);
    assert.equal(getReacticxOrbPresentation(state, true, false).animate, false);
  }
});

test("relógio usa tempo decorrido limitado e ignora intervalos inválidos", () => {
  for (const delta of [null, NaN, Infinity, -10]) assert.equal(clampOrbFrameDelta(delta), 0);
  assert.equal(clampOrbFrameDelta(16.7), 16.7);
  assert.equal(clampOrbFrameDelta(5000), 64);
  assert.equal(REACTICX_SHADER_INTERVAL_MS, 1000 / 30);
});


test("Orb do mapa usa roxos e respeita redução de movimento e foco", () => {
  const map = getReacticxOrbPresentation("repouso", false, true, true);
  assert.deepEqual(map.colors, ["#2B0055", "#C797FF", "#6F2DC4"]);
  assert.equal(map.animate, true);
  for (const state of states) {
    assert.equal(getReacticxOrbPresentation(state, true, true, true).animate, false);
    assert.equal(getReacticxOrbPresentation(state, false, false, true).animate, false);
  }
  assert.notDeepEqual(getReacticxOrbPresentation("repouso", false, true).colors, map.colors);
});

test("pulso compartilhado mantém os patamares e transições contínuas no ciclo", () => {
  assert.equal(getMapOrbPulse(0.1), 0);
  assert.equal(getMapOrbPulse(1.8), 1);
  assert.equal(getMapOrbPulse(2.5), 1);
  assert.ok(getMapOrbPulse(0.8) < getMapOrbPulse(1.2));
  assert.ok(getMapOrbPulse(2.9) > getMapOrbPulse(3.3));
  for (let t = 0; t <= 10; t += 1 / 30) {
    const pulse = getMapOrbPulse(t);
    assert.ok(pulse >= 0 && pulse <= 1);
    assert.ok(Math.abs(pulse - getMapOrbPulse(t + 3.6)) < 1e-10);
  }
  for (const boundary of [0.2, 1.55, 2.65, 3.6]) {
    assert.ok(Math.abs(getMapOrbPulse(boundary - 0.00001) - getMapOrbPulse(boundary + 0.00001)) < 0.00001);
  }
});
