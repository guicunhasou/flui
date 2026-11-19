import assert from "node:assert/strict";
import test from "node:test";
import { planejarViagemNoCatalogo } from "../src/utils/catalogTripPlanner";
import { calcularDistanciaGeograficaKm } from "../src/utils/demonstracao";
import { getTripStopContext, readTripStopContext } from "../src/utils/tripStopContext";
import { chargingStations } from "../src/data/fixtures/chargingStations";
import { obterOrigemDemonstrativa } from "../src/data/demonstracao";
import { obterDestinoDemonstrativo } from "../src/data/destinosViagem";
import { createStation } from "./fixtures";

const now = new Date("2026-10-23T15:00:00Z");
const origin = { latitude: 0, longitude: 0 };
const destination = { latitude: 0, longitude: 3 };
const stationAt = (longitude: number) => createStation({ id: `p-${longitude}`, name: `Parada ${longitude}`, latitude: 0, longitude, openingHours: "24 horas" });

test("não força parada quando a chegada direta preserva 5%", () => {
  const plan = planejarViagemNoCatalogo(origin, destination, 400, 100, [stationAt(1)], now);
  assert.equal(plan.paradas.length, 0);
  assert.notEqual(plan.nivelDeAlcance, "foraDeAlcance");
});

test("escolhe uma parada útil em vez de recarregar no primeiro ponto próximo", () => {
  const stations = [stationAt(0.3), stationAt(1.5), stationAt(2.6)];
  const plan = planejarViagemNoCatalogo(origin, destination, 250, 100, stations, now);
  assert.equal(plan.paradas.length, 1);
  assert.equal(plan.paradas[0].id, "p-1.5");
  assert.equal(plan.paradas[0].longitude, 1.5);
  assert.notEqual(plan.nivelDeAlcance, "foraDeAlcance");
});

test("monta três recargas em ordem com coordenadas reais do catálogo, sem interpolação", () => {
  const plan = planejarViagemNoCatalogo(origin, destination, 150, 100, [stationAt(2.7), stationAt(0.9), stationAt(1.8)], now);
  assert.deepEqual(plan.paradas.map(p => p.id), ["p-0.9", "p-1.8", "p-2.7"]);
  assert.notEqual(plan.nivelDeAlcance, "foraDeAlcance");
  for (const parada of plan.paradas) assert.ok(parada.bateriaChegadaPercent >= 5);
  assert.ok(plan.bateriaChegadaDestinoPercent >= 5);
});

test("não conta estação em manutenção ou fechada como recarga viável", () => {
  for (const station of [
    { ...stationAt(1.5), status: "maintenance" as const },
    { ...stationAt(1.5), openingHours: "Todos os dias, 00h às 01h", openingSchedule: undefined },
    { ...stationAt(1.5), connectors: [] },
    { ...stationAt(1.5), openingSchedule: { timeZone: "America/Sao_Paulo", periods: [] } },
  ]) {
    const plan = planejarViagemNoCatalogo(origin, destination, 250, 100, [station], now);
    assert.equal(plan.nivelDeAlcance, "foraDeAlcance");
    assert.deepEqual(plan.paradas, []);
  }
});

test("reserva continua exata antes de arredondar e bateria zero não cria uma recarga", () => {
  const target = { latitude: 0, longitude: 1 };
  const range = calcularDistanciaGeograficaKm(origin, target) * 2;
  assert.notEqual(planejarViagemNoCatalogo(origin, target, range, 55, [], now).nivelDeAlcance, "foraDeAlcance");
  assert.equal(planejarViagemNoCatalogo(origin, target, range, 54.999999, [], now).nivelDeAlcance, "foraDeAlcance");
  assert.equal(planejarViagemNoCatalogo(origin, target, range, 0, [stationAt(0)], now).nivelDeAlcance, "foraDeAlcance");
});

test("bateria, autonomia ou coordenadas inválidas não liberam viagem", () => {
  for (const [range, battery] of [[0, 70], [NaN, 70], [400, -1], [400, 101], [400, NaN]]) {
    assert.equal(planejarViagemNoCatalogo(origin, destination, range, battery, [], now).nivelDeAlcance, "foraDeAlcance");
  }
  assert.equal(planejarViagemNoCatalogo({ latitude: NaN, longitude: 0 }, destination, 400, 70, [], now).nivelDeAlcance, "foraDeAlcance");
});

test("viagem ao RJ usa as mesmas estações do mapa e muda conforme autonomia", () => {
  const fiap = obterOrigemDemonstrativa("fiap");
  const cabo = obterDestinoDemonstrativo("cabo-frio");
  const highRange = planejarViagemNoCatalogo(fiap, cabo, 400, 70, chargingStations, now);
  const lowRange = planejarViagemNoCatalogo(fiap, cabo, 200, 70, chargingStations, now);
  assert.notEqual(highRange.nivelDeAlcance, "foraDeAlcance");
  assert.notEqual(lowRange.nivelDeAlcance, "foraDeAlcance");
  assert.ok(lowRange.paradas.length > highRange.paradas.length);
  assert.ok(lowRange.paradas.length >= 2);
  let position = fiap as { latitude: number; longitude: number };
  let battery = 70;
  for (const stop of lowRange.paradas) {
    const source = chargingStations.find(s => s.id === stop.id);
    assert.ok(source);
    assert.equal(source.name, stop.nome);
    assert.equal(source.latitude, stop.latitude);
    assert.equal(source.longitude, stop.longitude);
    const km = calcularDistanciaGeograficaKm(position, stop);
    assert.ok(battery - km / 200 * 100 >= 5);
    position = stop;
    battery = stop.bateriaSaidaPercent;
  }
  assert.ok(battery - calcularDistanciaGeograficaKm(position, cabo) / 200 * 100 >= 5);
});

test("ficha da segunda parada recebe origem e bateria do trecho e preserva o destino", () => {
  const plan = planejarViagemNoCatalogo(origin, destination, 150, 100, [stationAt(0.9), stationAt(1.8), stationAt(2.7)], now);
  const originWithName = { ...origin, nome: "Origem inicial" };
  const first = getTripStopContext(plan.paradas, 0, originWithName, "rio", 150, 100);
  const second = getTripStopContext(plan.paradas, 1, originWithName, "rio", 150, 100);
  assert.equal(first?.origin, "Origem inicial");
  assert.equal(first?.departurePercent, 100);
  assert.ok(second);
  assert.equal(second.origin, plan.paradas[0].nome);
  assert.equal(second.departurePercent, plan.paradas[0].bateriaSaidaPercent);
  assert.equal(second.arrivalPercent, plan.paradas[1].bateriaChegadaPercent);
  assert.equal(second.distanceKm, calcularDistanciaGeograficaKm(plan.paradas[0], plan.paradas[1]));
  assert.equal(second.destinationId, "rio");

  const routePayload = JSON.stringify(second);
  assert.deepEqual(readTripStopContext(routePayload, plan.paradas[1].id), second);
  assert.equal(readTripStopContext(routePayload, plan.paradas[0].id), null);
  assert.equal(readTripStopContext(JSON.stringify({ ...second, departurePercent: -1 }), second.stationId), null);
  assert.equal(readTripStopContext("}", second.stationId), null);
});
