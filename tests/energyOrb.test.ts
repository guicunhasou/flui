import test from "node:test";
import assert from "node:assert/strict";
import { ENERGY_ORB_COLORS, getEnergyOrbMotion } from "../src/features/assistant/energyOrbPresentation";
import { FLUIA_STATE_LABELS, type FluiaState } from "../src/features/assistant/fluiaState";

const states = Object.keys(FLUIA_STATE_LABELS) as FluiaState[];

test("Orb respeita redução de movimento e pausa ao fechar a FluIA em todos os estados", () => {
  for (const state of states) {
    assert.deepEqual(getEnergyOrbMotion(state, true, true), { duration: 0, amplitude: 0, rotate: false });
    assert.deepEqual(getEnergyOrbMotion(state, false, false), { duration: 0, amplitude: 0, rotate: false });
  }
});

test("Orb cobre os estados existentes sem piscadas em avisos e com movimento limitado", () => {
  assert.deepEqual(Object.keys(ENERGY_ORB_COLORS).sort(), states.slice().sort());
  for (const state of states) {
    const motion = getEnergyOrbMotion(state, false, true);
    assert.ok(motion.amplitude <= 0.06);
    assert.ok(motion.duration === 0 || motion.duration >= 2000);
  }
  for (const state of ["aviso", "alerta"] as const) assert.equal(getEnergyOrbMotion(state, false, true).duration, 0);
  assert.notEqual(ENERGY_ORB_COLORS.aviso.core, ENERGY_ORB_COLORS.alerta.core);
});
