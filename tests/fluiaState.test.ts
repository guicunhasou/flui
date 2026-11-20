import assert from "node:assert/strict";
import test from "node:test";

import {
  FLUIA_STATE_LABELS,
  tempoDeExibicaoFluia,
  type FluiaState,
} from "../src/features/assistant/fluiaState";

test("todos os estados da FluIA têm rótulos visíveis", () => {
  const states: FluiaState[] = [
    "repouso",
    "digitando",
    "pensando",
    "respondendo",
    "aviso",
    "alerta",
  ];
  for (const state of states) {
    assert.ok(FLUIA_STATE_LABELS[state].trim());
  }
});

test("campo de texto não se apresenta como reconhecimento de voz", () => {
  assert.equal(FLUIA_STATE_LABELS.digitando, "Escrevendo");
  assert.equal(Object.hasOwn(FLUIA_STATE_LABELS, "ouvindo"), false);
});

test("resposta e aviso expiram, mas alerta e estados ativos não", () => {
  assert.equal(tempoDeExibicaoFluia("respondendo"), 2500);
  assert.equal(tempoDeExibicaoFluia("aviso"), 5000);
  for (const state of ["repouso", "digitando", "pensando", "alerta"] as FluiaState[]) {
    assert.equal(tempoDeExibicaoFluia(state), null);
  }
});
