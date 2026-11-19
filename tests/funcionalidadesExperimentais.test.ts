import assert from "node:assert/strict";
import test from "node:test";
import { funcionalidadesExperimentais } from "../src/config/funcionalidadesExperimentais";
import { recommendStations } from "../src/features/assistant/fluiAssistant";
import { answerMessage } from "../src/features/assistant/chatEngine";
import { createStation } from "./fixtures";

const contexto = {
  stations: [createStation({ distanceKm: 1 })],
  batteryPercent: 70,
  vehicleRangeKm: 400,
  now: new Date("2026-10-16T15:00:00Z"),
};

test("FluIA fica habilitada por padrão e mantém sugestões locais", () => {
  assert.equal(funcionalidadesExperimentais.fluia, true);
  assert.ok(recommendStations({ ...contexto, intent: "fastCharge" }));
  const resposta = answerMessage("quero carregar rápido", contexto);
  assert.ok(resposta.recommendation);
  assert.match(resposta.text, /simulação/);
});

test("controle desabilitado bloqueia sugestões e todas as respostas do motor", () => {
  const anterior = funcionalidadesExperimentais.fluia;
  try {
    funcionalidadesExperimentais.fluia = false;
    assert.equal(recommendStations({ ...contexto, intent: "fastCharge" }), null);
    for (const pergunta of ["quero carregar rápido", "tenho pouca bateria", "Esperar menos", "café", "conforto", "Quero uma recomendação", "autonomia", "olá"]) {
      const resposta = answerMessage(pergunta, contexto);
      assert.equal(resposta.state, "aviso");
      assert.equal(resposta.recommendation, undefined);
      assert.match(resposta.text, /desabilitada/);
    }
  } finally {
    funcionalidadesExperimentais.fluia = anterior;
  }
  assert.ok(recommendStations({ ...contexto, intent: "fastCharge" }));
});

test("falta de opção no exemplo não afirma indisponibilidade real", () => {
  const resposta = answerMessage("carregar rápido", { ...contexto, batteryPercent: 0 });
  assert.equal(resposta.state, "alerta");
  assert.equal(resposta.recommendation, undefined);
  assert.match(resposta.text, /simulação/);
  assert.match(resposta.text, /reserva mínima de 5%/);
});
