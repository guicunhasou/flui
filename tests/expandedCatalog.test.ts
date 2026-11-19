import assert from "node:assert/strict";
import test from "node:test";
import { chargingStations } from "../src/data/fixtures/chargingStations";
import { expandedChargingStations } from "../src/data/fixtures/expandedChargingStations";
import { obterOrigemDemonstrativa } from "../src/data/demonstracao";
import { aplicarOrigemDemonstrativa } from "../src/utils/demonstracao";
import { filtrarEstacoes } from "../src/utils/filtrarEstacoes";
import { defaultFilters, distanceOptions } from "../src/data/filterOptions";
import { canChargeAt } from "../src/utils/stationAvailability";

const now = new Date("2026-10-23T15:00:00Z");

test("catálogo de 80 preserva as 12 estações iniciais e reutiliza suas imagens com fichas completas de cenário", () => {
  assert.equal(chargingStations.length, 80);
  assert.deepEqual(chargingStations.slice(0, 12).map(s => s.id), Array.from({ length: 12 }, (_, i) => `station-${String(i + 1).padStart(2, "0")}`));
  assert.equal(new Set(chargingStations.map(s => s.id)).size, chargingStations.length);
  assert.equal(expandedChargingStations.length, 68);
  assert.equal(new Set(expandedChargingStations.map(s => s.imageKey)).size, 12);
  for (const id of ["moema", "vila-olimpia", "santo-amaro", "copacabana", "tijuca", "petropolis"]) assert.ok(chargingStations.some(s => s.id === `next-${id}`));
  for (const station of expandedChargingStations) {
    assert.ok(station.reviewCount >= 3);
    assert.ok(station.rating >= 1 && station.rating <= 5);
    assert.equal(station.reviews?.length, station.id === "next-acesso-next" ? 4 : 3);
    assert.equal(station.isFavorite, false);
    assert.match(station.imageKey!, /^station-(?:0[1-9]|1[0-2])$/);
    assert.equal(station.imageUrl, undefined);
    assert.match(station.address, /, \d+$/);
    assert.doesNotMatch(station.address, /fictício|cenário|NEXT/);
  }
});

test("novos pontos têm coordenadas e conectores coerentes sem confirmar recarga em manutenção", () => {
  const connectorIds: string[] = [];
  for (const station of expandedChargingStations) {
    assert.ok(Number.isFinite(station.latitude) && station.latitude < -20 && station.latitude > -25);
    assert.ok(Number.isFinite(station.longitude) && station.longitude < -41 && station.longitude > -49);
    for (const connector of station.connectors) {
      connectorIds.push(connector.id);
      assert.ok(connector.availableChargers >= 0 && connector.availableChargers <= connector.totalChargers);
      assert.ok(connector.powerKw > 0 && connector.powerKw <= station.powerKw);
    }
    assert.equal(canChargeAt(station, now), station.status === "available");
  }
  assert.equal(new Set(connectorIds).size, connectorIds.length);
});

test("base cobre NEXT, interior, litoral e RJ com distâncias calculadas desde a origem", () => {
  const nearNext = aplicarOrigemDemonstrativa(chargingStations, obterOrigemDemonstrativa("next"));
  const nearby = filtrarEstacoes({ estacoes: nearNext, filtros: defaultFilters, agora: now });
  assert.ok(nearby.filter(s => s.id.startsWith("next-")).length >= 6);
  assert.ok(nearby.some(s => s.id === "next-butanta"));
  for (const id of ["next-campinas", "next-resende", "next-rio-centro", "next-ubatuba", "next-paraty", "next-cabo-frio", "next-buzios"]) {
    assert.ok(chargingStations.some(s => s.id === id), id);
  }
  assert.ok(chargingStations.filter(s => s.state === "RJ").length >= 15);
  const fiap = aplicarOrigemDemonstrativa(chargingStations, obterOrigemDemonstrativa("fiap"));
  assert.ok(fiap.find(s => s.id === "next-butanta")!.distanceKm > nearNext.find(s => s.id === "next-butanta")!.distanceKm);
});


test("raio amplo permite consultar o RJ sem mudar filtros padrão nem ignorar status", () => {
  const stations = aplicarOrigemDemonstrativa(chargingStations, obterOrigemDemonstrativa("fiap"));
  const filters = { ...defaultFilters, distance: { maxKm: Math.max(...distanceOptions) } };
  assert.equal(defaultFilters.distance.maxKm, 10);
  const all = filtrarEstacoes({ estacoes: stations, filtros: filters, agora: now });
  assert.equal(all.length, chargingStations.length);
  assert.ok(all.some(station => station.id === "next-buzios"));
  const available = filtrarEstacoes({ estacoes: stations, filtros: { ...filters, onlyAvailableChargers: true }, agora: now });
  assert.ok(available.some(station => station.state === "RJ"));
  for (const station of available) assert.ok(canChargeAt(station, now));
});


test("68 fichas têm comentários completos, IDs próprios e dados disponíveis nas 12 originais", () => {
  const reviewIds = new Set<string>();
  const requiredFields = Object.keys(chargingStations[0]);
  for (const station of expandedChargingStations) {
    for (const field of requiredFields) assert.ok(field in station, `${station.id}: ${field}`);
    assert.ok(station.amenities.length >= 3);
    assert.ok(station.openingHours.trim());
    if (station.status !== "maintenance") assert.ok(station.lessBusyPeriods.length >= 2);
    const authors = new Set<string>();
    for (const review of station.reviews!) {
      assert.equal(review.stationId, station.id);
      assert.ok(!reviewIds.has(review.id));
      reviewIds.add(review.id);
      authors.add(review.userName);
      for (const score of [review.rating, review.quality, review.cleaning, review.availability, review.amenities]) assert.ok(Number.isInteger(score) && score >= 1 && score <= 5);
      assert.ok(review.comment.length >= 50);
      assert.ok(Number.isFinite(Date.parse(review.createdAt)) && new Date(review.createdAt) < now);
      if (station.status === "maintenance" || station.status === "unavailable") assert.equal(review.recommend, false);
    }
    assert.equal(authors.size, station.id === "next-acesso-next" ? 4 : 3);
  }
  assert.equal(reviewIds.size, 205);
});


test("oito pontos adicionais ficam até 2 km do NEXT com a mesma ficha completa", () => {
  const ids = ["acesso-next", "vila-lageado", "campus-oeste", "jaguare", "corifeu", "rio-pequeno", "politecnica", "vila-universitaria"].map(id => `next-${id}`);
  const nearNext = aplicarOrigemDemonstrativa(chargingStations, obterOrigemDemonstrativa("next"));
  for (const id of ids) {
    const station = nearNext.find(s => s.id === id)!;
    assert.ok(station && station.distanceKm > 0 && station.distanceKm <= 2, id);
    assert.equal(station.reviews?.length, station.id === "next-acesso-next" ? 4 : 3);
    assert.ok(station.imageKey && station.reviewCount >= 3);
  }
});


test("Flui Arca tem somente os quatro comentaristas definidos para o NEXT", () => {
  const station = chargingStations.find(s => s.id === "next-acesso-next")!;
  assert.equal(station.name, "Flui Arca");
  assert.deepEqual(station.reviews!.map(r => r.userName), ["Bruno Maia", "Joseffe Barroso", "Wagner Sanchez", "John Paul"]);
});
