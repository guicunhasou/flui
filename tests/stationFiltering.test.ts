import assert from "node:assert/strict";
import test from "node:test";

import { defaultFilters } from "../src/data/filterOptions";
import { filtrarEstacoes } from "../src/utils/filtrarEstacoes";
import { isStationOpenAt } from "../src/utils/stationHours";
import { createStation } from "./fixtures";

test("filtra por busca, potência, distância e comodidades", () => {
  const target = createStation({ name: "Carga Paulista", powerKw: 150 });
  const weak = createStation({ id: "weak", name: "Carga Centro", powerKw: 22 });

  const result = filtrarEstacoes({
    estacoes: [target, weak],
    filtros: {
      ...defaultFilters,
      amenities: ["restroom"],
      power: { minKw: 50 },
      distance: { maxKm: 3 },
    },
    termoBusca: "paulista",
  });

  assert.deepEqual(
    result.map((station) => station.id),
    [target.id],
  );
});

test("respeita horários 24 horas e bloqueia manutenção", () => {
  const date = new Date("2026-09-18T15:00:00.000Z");
  const openStation = createStation();
  const maintenanceStation = createStation({ status: "maintenance" });

  assert.equal(isStationOpenAt(openStation, date), true);
  assert.equal(isStationOpenAt(maintenanceStation, date), false);
});

test("considera período que atravessa a meia-noite", () => {
  const station = createStation({
    openingHours: "22h às 02h",
    openingSchedule: {
      timeZone: "UTC",
      periods: [{ days: ["fri"], opensAt: "22:00", closesAt: "02:00" }],
    },
  });

  assert.equal(
    isStationOpenAt(station, new Date("2026-09-18T23:30:00Z")),
    true,
  );
  assert.equal(
    isStationOpenAt(station, new Date("2026-09-18T14:00:00Z")),
    false,
  );
});

test("interpreta horário do catálogo no fuso da estação, incluindo domingo e limites", () => {
  const station = createStation({
    openingSchedule: undefined,
    openingHours: "Segunda a sábado, 08h às 20h",
  });
  assert.equal(
    isStationOpenAt(station, new Date("2026-09-18T11:00:00Z")),
    true,
  );
  assert.equal(
    isStationOpenAt(station, new Date("2026-09-18T23:00:00Z")),
    false,
  );
  assert.equal(
    isStationOpenAt(station, new Date("2026-09-20T15:00:00Z")),
    false,
  );
});

test("período noturno pertence ao dia da abertura, inclusive na virada da semana", () => {
  const station = createStation({
    openingSchedule: {
      timeZone: "UTC",
      periods: [{ days: ["sat"], opensAt: "22:00", closesAt: "02:00" }],
    },
  });
  assert.equal(
    isStationOpenAt(station, new Date("2026-09-19T01:00:00Z")),
    false,
  );
  assert.equal(
    isStationOpenAt(station, new Date("2026-09-20T01:59:00Z")),
    true,
  );
  assert.equal(
    isStationOpenAt(station, new Date("2026-09-20T02:00:00Z")),
    false,
  );
});

test("não interpreta horas inválidas ou abertura igual ao fechamento como 24h", () => {
  for (const [opensAt, closesAt] of [
    ["25:00", "26:00"],
    ["08:70", "20:00"],
    ["08:00", "08:00"],
  ]) {
    const station = createStation({
      openingSchedule: {
        timeZone: "UTC",
        periods: [{ days: ["fri"], opensAt, closesAt }],
      },
    });
    assert.equal(
      isStationOpenAt(station, new Date("2026-09-18T15:00:00Z")),
      false,
    );
  }
});

test("filtro, ficha e FluIA concordam nos horários reais do catálogo sem calendário estruturado", async () => {
  const { chargingStations } = await import(
    "../src/data/fixtures/chargingStations"
  );
  const { getStationStatusInfo } = await import(
    "../src/features/stations/stationPresentation"
  );
  const { recommendStations } = await import(
    "../src/features/assistant/fluiAssistant"
  );
  for (const date of [
    "2026-09-18T15:00:00Z",
    "2026-09-19T02:00:00Z",
    "2026-09-20T15:00:00Z",
  ]) {
    const agora = new Date(date);
    for (const station of chargingStations) {
      const open = isStationOpenAt(station, agora);
      const filtered = filtrarEstacoes({
        estacoes: [station],
        filtros: { ...defaultFilters, distance: { maxKm: 1000 }, onlyOpenNow: true },
        agora,
      });
      assert.equal(filtered.length > 0, open, station.id);
      if (station.status === "available")
        assert.equal(
          getStationStatusInfo(station, agora).label === "Aberto agora",
          open,
          station.id,
        );
      if (!open)
        assert.equal(
          recommendStations({
            stations: [station],
            intent: "fastCharge",
            vehicleRangeKm: 400,
            batteryPercent: 70,
            now: agora,
          }),
          null,
          station.id,
        );
    }
  }
});

test("calendário estruturado prevalece sobre o texto e o filtro 24h usa a mesma fonte", () => {
  const station = createStation({
    openingHours: "24 horas",
    openingSchedule: {
      timeZone: "UTC",
      periods: [{ days: ["fri"], opensAt: "10:00", closesAt: "20:00" }],
    },
  });
  const agora = new Date("2026-09-18T23:00:00Z");
  assert.deepEqual(
    filtrarEstacoes({
      estacoes: [station],
      filtros: { ...defaultFilters, onlyOpen24h: true },
      agora,
    }),
    [],
  );
  assert.deepEqual(
    filtrarEstacoes({
      estacoes: [station],
      filtros: { ...defaultFilters, distance: { maxKm: 1000 }, onlyOpenNow: true },
      agora,
    }),
    [],
  );
});

test("horário ou fuso desconhecido não produz confirmação de abertura", async () => {
  const { getStationStatusInfo, getStationRecommendation } = await import(
    "../src/features/stations/stationPresentation"
  );
  for (const station of [
    createStation({
      openingHours: "Consultar no local",
      openingSchedule: null,
    }),
    createStation({ openingSchedule: { timeZone: "inválido", periods: [] } }),
  ]) {
    assert.equal(isStationOpenAt(station), false);
    assert.equal(getStationStatusInfo(station).label, "Horário não confirmado");
    assert.equal(
      getStationRecommendation(station, 1),
      "Recarga não confirmada neste ponto",
    );
  }
});

test("filtro de carregadores livres exclui posto fechado ou com status incompatível", () => {
  const agora = new Date("2026-09-18T23:00:00Z");
  const stations = [
    createStation({ status: "unavailable" }),
    createStation({ status: "busy" }),
    createStation({
      openingHours: "Todos os dias, 10h às 20h",
      openingSchedule: null,
    }),
  ];
  assert.deepEqual(
    filtrarEstacoes({
      estacoes: stations,
      filtros: { ...defaultFilters, onlyAvailableChargers: true },
      agora,
    }),
    [],
  );
});

test("filtro 24h também rejeita fuso inválido", () => {
  const station = createStation();
  station.openingSchedule!.timeZone = "inválido";
  assert.deepEqual(filtrarEstacoes({estacoes: [station], filtros: {...defaultFilters, onlyOpen24h: true}}), []);
});
