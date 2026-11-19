import assert from "node:assert/strict";
import test from "node:test";

import { answerMessage, RECOMMENDATION_DISCLAIMER } from "@/src/features/assistant/chatEngine";
import { createStation } from "./fixtures";
import { recommendStations, type FluiAssistantIntent } from "../src/features/assistant/fluiAssistant";
import { programmedAnswers } from "../src/features/assistant/programmedAnswers";
import { identificacaoDados } from "../src/data/identificacaoDados";

const context = {
  stations: [createStation({ id: "near", distanceKm: 1, powerKw: 150 })],
  vehicleRangeKm: 300,
  batteryPercent: 80,
  now: new Date("2026-10-16T15:00:00Z"),
};

test("responde pergunta programada sem acento e em maiúsculas", () => {
  const response = answerMessage("O que é AUTONOMIA?", context);
  assert.equal(response.state, "respondendo");
  assert.match(response.text, /Autonomia é a distância/);
});

test("pergunta sem resposta cai na mensagem padrão", () => {
  const response = answerMessage("qual é a capital da França?", context);
  assert.equal(response.state, "respondendo");
  assert.match(response.text, /Posso ajudar?/);
  assert.equal(response.recommendation, undefined);
});

test("pedido de recarga rápida sem estações gera alerta", () => {
  const response = answerMessage("quero carregar rápido", {
    ...context,
    stations: [],
  });
  assert.equal(response.state, "alerta");
  assert.equal(response.recommendation, undefined);
});


test("bateria baixa usa o motor local e recusa bateria insuficiente", () => {
  const viable = answerMessage("Tenho pouca bateria, consigo chegar?", context);
  assert.equal(viable.recommendation?.intent, "lowBattery");
  assert.equal(viable.recommendation?.primary.id, "near");
  assert.match(viable.text, /em linha reta/);
  assert.match(viable.text, /Confirme funcionamento e compatibilidade/);
  const insufficient = answerMessage("Tenho pouca bateria", { ...context, batteryPercent: 0 });
  assert.equal(insufficient.state, "alerta");
  assert.equal(insufficient.recommendation, undefined);
});

test("chat respeita o horário recebido da tela nas duas intenções", () => {
  const station = createStation({
    openingHours: "Todos os dias, 08h às 20h",
    openingSchedule: {
      timeZone: "America/Sao_Paulo",
      periods: [{ days: ["fri"], opensAt: "08:00", closesAt: "20:00" }],
    },
  });
  for (const text of ["carregar rápido", "tenho pouca bateria"]) {
    const before = answerMessage(text, {
      ...context, stations: [station], now: new Date("2026-10-16T22:59:59Z"),
    });
    const after = answerMessage(text, {
      ...context, stations: [station], now: new Date("2026-10-16T23:00:00Z"),
    });
    assert.equal(before.recommendation?.primary.id, station.id);
    assert.equal(after.recommendation, undefined);
    assert.equal(after.state, "alerta");
    assert.match(after.text, /catálogo de simulação/);
  }
});

test("bateria baixa não atribui indisponibilidade exclusivamente ao alcance", () => {
  const response = answerMessage("Tenho pouca bateria", {
    ...context, stations: [createStation({ status: "maintenance", distanceKm: 0 })],
  });
  assert.equal(response.recommendation, undefined);
  assert.match(response.text, /em manutenção no cadastro/);
  assert.match(response.text, /catálogo de simulação/);
  assert.doesNotMatch(response.text, /não há margem/);
});


const questions: Record<FluiAssistantIntent, string[]> = {
  lowBattery: ["Estou com pouca bateria", "Bateria baixa", "Bateria fraca", "Minha bateria está muito baixa", "Estou com pouca autonomia", "Consigo chegar?", "Quero preservar bateria", "Economizar bateria"],
  fastCharge: ["Preciso de recarga rápida", "Quero carregar depressa", "Carregador mais potente", "Alta potência", "Recarga veloz"],
  avoidQueues: ["Esperar menos", "Quero evitar filas", "Sem fila", "Não quero pegar fila", "Aguardar menos", "Menor espera", "Onde demora menos?"],
  coffeeAndRestroom: ["Onde posso tomar um café enquanto carrego?", "Preciso de banheiro e café", "Tem banheiro?"],
  comfortableWait: ["Quero esperar com conforto", "Um lugar confortável", "Quero descansar", "Quais as comodidades?", "Esperar confortavelmente"],
};
const fullContext = {
  ...context,
  stations: [createStation({
    id: "full", name: "Ponto Completo", distanceKm: 1,
    amenities: ["coffee", "restroom", "wifi"],
  })],
};

for (const [intent, synonyms] of Object.entries(questions)) {
  test(`sinônimos de ${intent} encaminham ao motor sem alterar o resultado`, () => {
    for (const question of synonyms) {
      const result = answerMessage(question, fullContext);
      assert.deepEqual(result.recommendation,
        recommendStations({ ...fullContext, intent: intent as FluiAssistantIntent }), question);
      assert.equal(result.state, "respondendo");
      assert.match(result.text, /Minha sugestão é Ponto Completo/);
      assert.match(result.text, /Confirme funcionamento e compatibilidade/);
      assert.ok(!result.text.includes(RECOMMENDATION_DISCLAIMER));
      assert.ok(!result.text.includes(identificacaoDados.fluia.aviso));
    }
  });
}

test("acentos, caixa, pontuação e espaços não mudam a intenção", () => {
  assert.equal(answerMessage("  ESPERAR   MENOS!!! ", fullContext).recommendation?.intent, "avoidQueues");
  assert.equal(answerMessage("PRECISO DE RECARGA RAPIDA", fullContext).recommendation?.intent, "fastCharge");
});

test("as cinco intenções explicam necessidades diferentes mesmo para a mesma estação", () => {
  const expected = [/alcance estimado/, /potência de até .* kW/, /não informa a fila em tempo real/, /café e banheiro no cadastro/, /comodidades cadastradas/];
  const responses = Object.values(questions).map((items) => answerMessage(items[0], fullContext));
  assert.equal(new Set(responses.map((response) => response.text)).size, 5);
  responses.forEach((response, index) => assert.match(response.text, expected[index]));
});

test("pedido genérico pede prioridade e todas as opções oferecidas são reconhecidas", () => {
  for (const question of ["Quero uma recomendação", "Me dê uma sugestão", "Onde posso carregar?"]) {
    const response = answerMessage(question, fullContext);
    assert.match(response.text, /preciso saber sua prioridade/);
    assert.equal(response.recommendation, undefined);
  }
  for (const choice of ["preservar bateria", "recarga rápida", "esperar menos", "café e banheiro", "esperar com conforto"])
    assert.ok(answerMessage(choice, fullContext).recommendation, choice);
});

test("pedido com prioridades distintas pede esclarecimento sem ignorar requisitos", () => {
  const result = answerMessage("Quero café e recarga rápida", fullContext);
  assert.equal(result.recommendation, undefined);
  assert.match(result.text, /mais de uma prioridade/);
  assert.match(result.text, /café e banheiro/);
  assert.match(result.text, /recarga rápida/);
});

test("negações simples de comodidades ou rapidez não viram recomendações opostas", () => {
  for (const question of ["Não quero café", "Sem banheiro", "Não preciso de recarga rápida", "Não quero carregar rápido"]) {
    const result = answerMessage(question, fullContext);
    assert.equal(result.recommendation, undefined);
    assert.equal(result.state, "aviso");
    assert.match(result.text, /Não consigo aplicar essa exclusão/);
  }
});

test("respostas programadas permanecem disponíveis sem anexar o aviso extenso", () => {
  for (const [question, index] of [
    ["O que é kW?", 0], ["O que significa quilowatt?", 0],
    ["O que são quilowatts?", 0], ["O que significa 150kW?", 0],
    ["O QUE É AUTONOMIA?", 1], ["Quanto tempo demora a recarga?", 2],
    ["Quanto tempo demora a recarga rápida?", 2], ["A recarga vai demorar?", 2],
  ] as const) {
    const response = answerMessage(question, fullContext);
    assert.equal(response.text, programmedAnswers[index].answer);
    assert.equal(response.recommendation, undefined);
  }
  assert.equal(answerMessage("Minha autonomia está baixa, quero evitar filas", fullContext).recommendation?.intent, "avoidQueues");
  assert.equal(answerMessage("Onde demora menos?", fullContext).recommendation?.intent, "avoidQueues");
  assert.equal(answerMessage("cafeína", fullContext).recommendation, undefined);
});

test("ausência de estações não inventa causa em filtros, bateria ou horários", () => {
  const responses = Object.values(questions).map((items) => answerMessage(items[0], { ...context, stations: [] }));
  assert.equal(new Set(responses.map((response) => response.text)).size, 5);
  for (const response of responses) {
    assert.equal(response.state, "alerta");
    assert.equal(response.recommendation, undefined);
    assert.match(response.text, /Não recebi estações/);
    assert.match(response.text, /catálogo de simulação/);
    assert.doesNotMatch(response.text, /filtros|todas.*fechadas|não há margem/);
  }
});

test("explica reserva com 0%, 4% e 5% sem sugerir deslocamento em nenhuma intenção", () => {
  for (const batteryPercent of [0, 4, 5]) {
    for (const question of Object.values(questions).map((items) => items[0])) {
      const response = answerMessage(question, { ...fullContext, batteryPercent });
      assert.equal(response.recommendation, undefined);
      assert.equal(response.state, "alerta");
      assert.match(response.text, /não há margem para deslocamento/);
      assert.match(response.text, /reserva mínima de 5%/);
    }
  }
});

test("chat preserva corte exato e não usa arredondamento para liberar a reserva", () => {
  for (const question of Object.values(questions).map((items) => items[0])) {
    const atLimit = { ...fullContext, batteryPercent: 7, vehicleRangeKm: 100,
      stations: [createStation({ distanceKm: 2, amenities: ["coffee", "restroom"] })] };
    const accepted = answerMessage(question, atLimit);
    assert.equal(accepted.recommendation?.arrivalBatteryPercent, 5);
    const rejected = answerMessage(question, { ...atLimit,
      stations: [createStation({ distanceKm: 2.01, amenities: ["coffee", "restroom"] })] });
    assert.equal(rejected.recommendation, undefined);
    assert.match(rejected.text, /não preserva a reserva mínima de 5%/);
    const noTravel = answerMessage(question, { ...atLimit, batteryPercent: 5,
      stations: [createStation({ distanceKm: 0, amenities: ["coffee", "restroom"] })] });
    assert.equal(noTravel.recommendation?.arrivalBatteryPercent, 5);
  }
});

test("falta de comodidades só é afirmada entre as opções viáveis, sem relaxar a intenção", () => {
  for (const question of ["Quero café", "Quero conforto"]) {
    const result = answerMessage(question, { ...context,
      stations: [createStation({ amenities: ["parking"] })] });
    assert.equal(result.recommendation, undefined);
    assert.match(result.text, /Há opção que atende ao alcance e à disponibilidade/);
    assert.doesNotMatch(result.text, /não há margem|não preserva a reserva/);
  }
  const coffeeOnly = answerMessage("Quero café", { ...context,
    stations: [createStation({ amenities: ["coffee"] })] });
  assert.equal(coffeeOnly.recommendation, undefined);
  assert.match(coffeeOnly.text, /café e banheiro, exigidos por esta opção/);
});

test("explicação de ausência usa disponibilidade e horários sem culpar a bateria", () => {
  const cases = [
    { station: createStation({ status: "maintenance" }), expected: /em manutenção no cadastro/ },
    { station: createStation({ status: "busy" }), expected: /ocupadas, indisponíveis ou em manutenção/ },
    { station: createStation({ status: "unavailable" }), expected: /ocupadas, indisponíveis ou em manutenção/ },
    { station: createStation({ openingSchedule: { timeZone: "America/Sao_Paulo", periods: [] } }), expected: /fechadas nesta consulta/ },
    { station: createStation({ openingSchedule: undefined, openingHours: "Não informado" }), expected: /Não há horários válidos/ },
    { station: createStation({ connectors: [] }), expected: /conector livre utilizável/ },
  ];
  for (const { station, expected } of cases) {
    for (const question of Object.values(questions).map((items) => items[0])) {
      const result = answerMessage(question, { ...context, stations: [station] });
      assert.equal(result.recommendation, undefined);
      assert.match(result.text, expected);
      assert.doesNotMatch(result.text, /não há margem|não preserva a reserva/);
    }
  }
});

test("diagnóstico não apresenta dados inválidos como falta de bateria", () => {
  for (const patch of [{ vehicleRangeKm: 0 }, { vehicleRangeKm: NaN }, { batteryPercent: -1 }, { batteryPercent: 101 }, { batteryPercent: NaN }]) {
    const result = answerMessage("Esperar menos", { ...context, ...patch });
    assert.equal(result.recommendation, undefined);
    assert.match(result.text, /não permite uma estimativa válida/);
  }
  for (const patch of [{ distanceKm: NaN }, { distanceKm: -1 }, { powerKw: 0 }]) {
    const result = answerMessage("Quero café", { ...fullContext, stations: [createStation(patch)] });
    assert.equal(result.recommendation, undefined);
    assert.match(result.text, /não têm distância e potência válidas/);
  }
  assert.match(answerMessage("Esperar menos", { ...context, now: new Date(NaN) }).text, /horário da consulta é inválido/);
});


test("resposta revisada expõe chegada do motor e limites sem prometer dados em tempo real", () => {
  for (const text of ["recarga rápida", "esperar menos", "preservar bateria", "café e banheiro", "esperar com conforto"]) {
    const response = answerMessage(text, fullContext);
    assert.ok(response.recommendation);
    assert.ok(response.text.includes(`Chegada estimada: ${response.recommendation.arrivalBatteryPercent}%`));
    assert.match(response.text, /Cenário de simulação com reserva mínima de 5%/);
    assert.match(response.text, /em linha reta/);
    assert.match(response.text, /Confirme funcionamento e compatibilidade/);
    assert.doesNotMatch(response.text, /comodidade\(s\)|cadastrada\(s\)|fila garantida|reserva confirmada/);
  }
});
