import assert from "node:assert/strict";
import test from "node:test";

import {
  formatRatingStars,
  formatStationAddress,
  getEstimatedChargingTime,
  getStationProfile,
  getStationRecommendation,
  getStationRouteUrl,
  getStationRouteNotice,
  getStationStatusInfo,
  getStationChargerCountLabel,
  getStationArrivalPresentation,
  getUserInitials,
  getWaitingLevel,
} from "../src/features/stations/stationPresentation";
import { createStation } from "./fixtures";
import { avaliarAlcance } from "../src/utils/autonomia";

test("formata os dados apresentados pela ficha da estação", () => {
  const station = createStation();

  assert.equal(
    formatStationAddress(station),
    "Avenida Teste, 100, Centro, São Paulo, SP",
  );
  assert.equal(formatRatingStars(4.2), "★ ★ ★ ★ ☆");
  assert.equal(getUserInitials("Caio Duarte"), "CD");
  assert.equal(getEstimatedChargingTime(150), "20 a 35 min");
  assert.equal(getStationProfile(station), "Carga rápida");
});

test("gera URLs seguras para os provedores suportados", () => {
  const station = createStation();

  assert.match(getStationRouteUrl(station, "google"), /destination=-23\.55,-46\.63/);
  assert.match(getStationRouteUrl(station, "waze"), /ll=-23\.55,-46\.63/);
  const origin = { latitude: -23.5616, longitude: -46.6554 };
  assert.match(getStationRouteUrl(station, "google", origin), /origin=-23\.5616,-46\.6554&destination=-23\.55,-46\.63/);
  assert.doesNotMatch(getStationRouteUrl(station, "google"), /&origin=/);
  assert.equal(getStationRouteUrl(station, "waze", origin), getStationRouteUrl(station, "waze"));
});

test("avisa sobre recarga não confirmada antes de oferecer a rota", () => {
  const now = new Date("2026-10-16T22:00:00Z");
  const cases = [
    { station: createStation({ status: "unavailable" }), expected: /Status indisponível/ },
    { station: createStation({ status: "maintenance" }), expected: /Em manutenção/ },
    { station: createStation({ status: "busy" }), expected: /Ocupado agora/ },
    { station: createStation({ openingSchedule: undefined, openingHours: "A confirmar" }), expected: /Horário não confirmado/ },
    { station: createStation({ connectors: [] }), expected: /Sem carregadores utilizáveis/ },
  ];
  for (const { station, expected } of cases) {
    const notice = getStationRouteNotice(station, now);
    assert.match(notice, expected);
    assert.match(notice, /recarga não está confirmada/);
    assert.match(notice, /Abrir a rota não garante atendimento/);
  }
});

test("aviso da rota acompanha o limite de fechamento e não promete dados reais", () => {
  const station = createStation({ openingSchedule: {
    timeZone: "America/Sao_Paulo",
    periods: [{ days: ["fri"], opensAt: "08:00", closesAt: "20:00" }],
  } });
  const before = getStationRouteNotice(station, new Date("2026-10-16T22:59:59Z"));
  assert.match(before, /Aberto agora/);
  assert.match(before, /carregadores livres são simulados/);
  const closed = getStationRouteNotice(station, new Date("2026-10-16T23:00:00Z"));
  assert.match(closed, /Fechado agora/);
  assert.match(closed, /recarga não está confirmada/);
});

test("resume status, recomendação e espera sem depender da tela", () => {
  const station = createStation();
  const now = new Date("2026-09-18T15:00:00.000Z");

  assert.equal(getStationStatusInfo(station, now).label, "Aberto agora");
  assert.equal(
    getStationRecommendation(station, 1),
    "Opção com conector rápido",
  );
  assert.equal(getWaitingLevel(station.status, 1), "Moderada");
});

test("não promete parada rápida quando só o conector lento está utilizável", () => {
  const station = createStation({powerKw: 150, connectors: [
    {id: "dc", type: "ccs2", label: "CCS2", powerKw: 150, totalChargers: 2, availableChargers: 0},
    {id: "ac", type: "type2", label: "Tipo 2", powerKw: 22, totalChargers: 1, availableChargers: 1},
  ]});
  assert.equal(getStationRecommendation(station, 1), "Opção de recarga no catálogo");
});

const presentationDate = new Date("2026-10-17T01:00:00Z");
const arrivalAssessment = avaliarAlcance(0.3, 400, 45);
const presentationCases = [
  { name: "aberta com recarga demonstrativa", station: createStation(), canCharge: true, status: "Aberto agora" },
  { name: "fechada", station: createStation({ openingSchedule: undefined, openingHours: "Todos os dias, 06h às 22h" }), canCharge: false, status: "Fechado agora" },
  { name: "em manutenção", station: createStation({ status: "maintenance" }), canCharge: false, status: "Em manutenção" },
  { name: "indisponível", station: createStation({ status: "unavailable" }), canCharge: false, status: "Status indisponível" },
  { name: "com horário desconhecido", station: createStation({ openingSchedule: undefined, openingHours: "A confirmar" }), canCharge: false, status: "Horário não confirmado" },
  { name: "ocupada", station: createStation({ status: "busy" }), canCharge: false, status: "Ocupado agora" },
  { name: "aberta sem conector utilizável", station: createStation({ connectors: [{ ...createStation().connectors[0], powerKw: 0 }] }), canCharge: false, status: "Aberto agora" },
];

for (const scenario of presentationCases) {
  test(`separa autonomia e recarga na ficha ${scenario.name}`, () => {
    const snapshot = structuredClone(scenario.station);
    const label = getStationChargerCountLabel(scenario.station, 1, 2, presentationDate);
    const arrival = getStationArrivalPresentation(scenario.station, arrivalAssessment, presentationDate);
    assert.equal(getStationStatusInfo(scenario.station, presentationDate).label, scenario.status);
    assert.match(arrival.text, /Autonomia disponível/);
    assert.match(arrival.text, /Chegada estimada com 45% de bateria/);
    assert.match(arrival.text, /Estimativa em linha reta; confirme o funcionamento/);
    assert.equal(arrival.tone, scenario.canCharge ? "success" : "neutral");
    assert.equal(label, scenario.canCharge
      ? "1 de 2 carregadores livres"
      : "2 carregadores cadastrados. Recarga não confirmada.");
    assert.deepEqual(scenario.station, snapshot, "A apresentação preserva os dados cadastrados");
    assert.deepEqual(arrivalAssessment, avaliarAlcance(0.3, 400, 45), "O cálculo de autonomia não muda");
  });
}

test("preserva alertas de autonomia limitada e insuficiente mesmo sem recarga", () => {
  for (const station of [createStation(), createStation({ status: "unavailable" })]) {
    const limited = getStationArrivalPresentation(station, avaliarAlcance(10, 400, 15), presentationDate);
    assert.equal(limited.tone, "warning");
    assert.match(limited.text, /Autonomia limitada — Chegada estimada com 13% de bateria/);
    const insufficient = getStationArrivalPresentation(station, avaliarAlcance(20, 400, 1), presentationDate);
    assert.equal(insufficient.tone, "danger");
    assert.match(insufficient.text, /faltam 16 km/);
    assert.match(insufficient.text, /Estimativa em linha reta; confirme o funcionamento/);
  }
});

test("a mesma ficha deixa de anunciar carregadores livres exatamente ao fechar", () => {
  const station = createStation({ openingSchedule: undefined, openingHours: "Todos os dias, 06h às 22h" });
  const before = new Date("2026-10-17T00:59:59Z");
  const after = new Date("2026-10-17T01:00:00Z");
  assert.match(getStationChargerCountLabel(station, 3, 5, before), /3 de 5 carregadores livres/);
  assert.doesNotMatch(getStationChargerCountLabel(station, 3, 5, after), /livres|disponíveis/);
  assert.equal(getStationArrivalPresentation(station, arrivalAssessment, before).tone, "success");
  assert.equal(getStationArrivalPresentation(station, arrivalAssessment, after).tone, "neutral");
});


test("estimativa da ficha acompanha carga informada sem prometer recarga", () => {
  const station = createStation({ distanceKm: 10 });
  const full = getStationArrivalPresentation(station, avaliarAlcance(10, 200, 80));
  const low = getStationArrivalPresentation(station, avaliarAlcance(10, 200, 2));
  assert.match(full.text, /160 km/);
  assert.match(full.text, /75%/);
  assert.match(low.text, /4 km/);
  assert.match(low.text, /insuficiente/);
  assert.match(low.text, /confirme o funcionamento/);
});
