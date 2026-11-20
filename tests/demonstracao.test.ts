import assert from "node:assert/strict";
import test from "node:test";
import { demonstracaoPadrao, obterOrigemDemonstrativa, origensDemonstrativas } from "../src/data/demonstracao";
import { chargingStations } from "../src/data/fixtures/chargingStations";
import { defaultFilters } from "../src/data/filterOptions";
import {
  aplicarOrigemDemonstrativa,
  calcularDistanciaGeograficaKm,
  formatarDistanciaDemonstrativa,
  normalizarConfiguracaoDemonstrativa,
  validarConfiguracaoDemonstrativa,
} from "../src/utils/demonstracao";
import { normalizeBatteryData } from "../src/utils/batteryData";
import { avaliarAlcance } from "../src/utils/autonomia";
import { filtrarEstacoes } from "../src/utils/filtrarEstacoes";
import { recommendStations } from "../src/features/assistant/fluiAssistant";
import { getStationArrivalPresentation } from "../src/features/stations/stationPresentation";
import { createStation } from "./fixtures";

test("preferências sem origem recebem FIAP e veículo padrão sem perder autonomia e origem da bateria", () => {
  const antigo = { vehicleRangeKm: 320, batteryPercent: 35, batterySource: "manual" as const, batteryUpdatedAt: "2026-10-16T12:00:00Z" };
  const migrado = { ...normalizarConfiguracaoDemonstrativa(antigo), ...normalizeBatteryData(antigo) };
  assert.equal(migrado.demoOriginId, "fiap");
  assert.equal(migrado.vehicleName, demonstracaoPadrao.vehicleName);
  assert.equal(migrado.vehicleRangeKm, 320);
  assert.equal(migrado.batterySource, "manual");
  assert.equal(migrado.batteryPercent, 35);
  assert.equal(migrado.batteryUpdatedAt, antigo.batteryUpdatedAt);
});

test("configuração demonstrativa conserva valores após serialização sem transformar bateria em telemetria", () => {
  for (const battery of [normalizeBatteryData(), normalizeBatteryData({ batteryPercent: 45, batterySource: "manual", batteryUpdatedAt: "2026-10-16T12:00:00Z" })]) {
    const salvo = { vehicleName: "Veículo de teste", vehicleRangeKm: 275.5, demoOriginId: "vila-mariana" as const, ...battery };
    const lido = JSON.parse(JSON.stringify(salvo));
    assert.deepEqual({ ...normalizarConfiguracaoDemonstrativa(lido), ...normalizeBatteryData(lido) }, salvo);
  }
});

test("rejeita entradas inválidas e recupera padrões em dados locais inválidos", () => {
  const base = normalizarConfiguracaoDemonstrativa();
  assert.equal(validarConfiguracaoDemonstrativa(base), null);
  for (const vehicleRangeKm of [0, -1, NaN, Infinity, 2001]) {
    assert.ok(validarConfiguracaoDemonstrativa({ ...base, vehicleRangeKm }));
    assert.equal(normalizarConfiguracaoDemonstrativa({ vehicleRangeKm }).vehicleRangeKm, 400);
  }
  assert.ok(validarConfiguracaoDemonstrativa({ ...base, vehicleName: "  " }));
  assert.ok(validarConfiguracaoDemonstrativa({ ...base, vehicleName: "x".repeat(61) }));
  const corrompido = JSON.parse('{"demoOriginId":"gps","vehicleName":12}');
  assert.deepEqual(normalizarConfiguracaoDemonstrativa(corrompido), base);
  assert.ok(validarConfiguracaoDemonstrativa({ ...base, ...corrompido, vehicleName: "Teste" }));
});

test("distância geográfica usa coordenadas em vez dos quilômetros estáticos do catálogo", () => {
  const equador = { latitude: 0, longitude: 0 };
  assert.equal(calcularDistanciaGeograficaKm(equador, equador), 0);
  const distancia = calcularDistanciaGeograficaKm(equador, { latitude: 0, longitude: 1 });
  assert.ok(Math.abs(distancia - 111.195) < 0.001);
  assert.equal(distancia, calcularDistanciaGeograficaKm({ latitude: 0, longitude: 1 }, equador));
  const copia = structuredClone(chargingStations);
  const estacoes = aplicarOrigemDemonstrativa(chargingStations, obterOrigemDemonstrativa("fiap"));
  assert.equal(estacoes.length, chargingStations.length);
  assert.notEqual(estacoes[0].distanceKm, chargingStations[0].distanceKm);
  assert.deepEqual(chargingStations, copia);
});

test("origem atualiza os dados usados no raio de busca e na viabilidade da FluIA", () => {
  // Exemplo conhecido: estação em Paulista, origem FIAP a cerca de 420 m.
  const destino = createStation({ ...obterOrigemDemonstrativa("paulista"), id: "teste-paulista", distanceKm: 999 });
  const fiap = aplicarOrigemDemonstrativa([destino], obterOrigemDemonstrativa("fiap"));
  const vila = aplicarOrigemDemonstrativa([destino], obterOrigemDemonstrativa("vila-mariana"));
  assert.ok(fiap[0].distanceKm < 0.5);
  assert.ok(vila[0].distanceKm > 3);
  const filtros = { ...defaultFilters, distance: { maxKm: 0.5 } };
  assert.equal(filtrarEstacoes({ estacoes: fiap, filtros }).length, 1);
  assert.equal(filtrarEstacoes({ estacoes: vila, filtros }).length, 0);
  const recomendar = (stations: typeof fiap) => recommendStations({ stations, intent: "lowBattery", vehicleRangeKm: 20, batteryPercent: 10 });
  assert.ok(recomendar(fiap));
  assert.equal(recomendar(vila), null);
  assert.equal(recommendStations({ stations: fiap, intent: "fastCharge", vehicleRangeKm: 20, batteryPercent: 0 }), null);
});

test("mapa, ficha e FluIA exibem a mesma estimativa de chegada para toda origem", () => {
  for (const origem of origensDemonstrativas) {
    const stations = aplicarOrigemDemonstrativa([createStation({ latitude: origem.latitude + 0.001, longitude: origem.longitude })], origem);
    const assessment = avaliarAlcance(stations[0].distanceKm, 275.5, 35);
    const recommendation = recommendStations({ stations, intent: "fastCharge", vehicleRangeKm: 275.5, batteryPercent: 35 });
    assert.ok(recommendation);
    assert.equal(recommendation.arrivalBatteryPercent, assessment.bateriaAoChegarPercent);
    assert.equal(recommendation.primary.distanceKm, stations[0].distanceKm);
    assert.match(getStationArrivalPresentation(stations[0], assessment).text, new RegExp(`${assessment.bateriaAoChegarPercent}%`));
  }
});

test("cortes de filtro e reserva mantêm precisão anterior ao arredondamento visual", () => {
  const origem = { latitude: 0, longitude: 0 };
  const [station] = aplicarOrigemDemonstrativa([createStation({ latitude: 0, longitude: 0.0044975 })], origem);
  assert.ok(station.distanceKm > 0.5 && station.distanceKm < 0.501);
  assert.equal(formatarDistanciaDemonstrativa(station.distanceKm), "≈500 m");
  assert.equal(filtrarEstacoes({ estacoes: [station], filtros: { ...defaultFilters, distance: { maxKm: 0.5 } } }).length, 0);
  assert.equal(recommendStations({ stations: [station], intent: "lowBattery", vehicleRangeKm: 10, batteryPercent: 10 }), null);
});


test("FIAP volta ao padrão e NEXT continua uma opção explícita", () => {
  const initial = obterOrigemDemonstrativa(normalizarConfiguracaoDemonstrativa().demoOriginId);
  assert.equal(initial.id, "fiap");
  assert.equal(initial.latitude, -23.564304);
  assert.equal(initial.longitude, -46.652537);
  assert.equal(obterOrigemDemonstrativa("next").nome, "NEXT");
  assert.equal(normalizarConfiguracaoDemonstrativa({ demoOriginId: "paulista" }).demoOriginId, "paulista");
});


test("NEXT fica primeiro sem mudar FIAP como fallback; todas as origens são persistíveis", () => {
  assert.equal(origensDemonstrativas[0].id, "next");
  assert.equal(obterOrigemDemonstrativa("invalida" as never).id, "fiap");
  assert.equal(new Set(origensDemonstrativas.map(o => o.id)).size, origensDemonstrativas.length);
  for (const origin of origensDemonstrativas) {
    const config = { ...demonstracaoPadrao, demoOriginId: origin.id };
    assert.equal(validarConfiguracaoDemonstrativa(config), null);
    assert.equal(normalizarConfiguracaoDemonstrativa(JSON.parse(JSON.stringify(config))).demoOriginId, origin.id);
  }
});
