import assert from "node:assert/strict";
import test from "node:test";

import {
  formatRatingStars,
  formatStationAddress,
  getEstimatedChargingTime,
  getStationProfile,
  getStationRecommendation,
  getStationRouteUrl,
  getStationStatusInfo,
  getUserInitials,
  getWaitingLevel,
} from "../src/features/stations/stationPresentation";
import { createStation } from "./fixtures";

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
});

test("resume status, recomendação e espera sem depender da tela", () => {
  const station = createStation();
  const now = new Date("2026-09-18T15:00:00.000Z");

  assert.equal(getStationStatusInfo(station, now).label, "Aberto agora");
  assert.equal(
    getStationRecommendation(station, 1),
    "Boa escolha para uma parada rápida",
  );
  assert.equal(getWaitingLevel(station.status, 1), "Moderada");
});
