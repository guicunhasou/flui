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

  assert.deepEqual(result.map((station) => station.id), [target.id]);
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

  assert.equal(isStationOpenAt(station, new Date("2026-09-18T23:30:00Z")), true);
  assert.equal(isStationOpenAt(station, new Date("2026-09-18T14:00:00Z")), false);
});

test("exige vaga em conector escolhido e horário aberto ao filtrar recarga disponível", () => {
  const open = createStation({ id: "open" });
  const busy = createStation({ id: "busy", status: "busy" });
  const closed = createStation({ id: "closed", openingSchedule: undefined, openingHours: "Todos os dias, 01h às 02h" });
  const wrongConnector = createStation({
    id: "type-two",
    connectors: [{ ...open.connectors[0], availableChargers: 0 },
      { ...open.connectors[0], id: "type-two", type: "type2", label: "Tipo 2" }],
  });
  const filtros = { ...defaultFilters, onlyAvailableChargers: true, connectorTypes: ["ccs2" as const] };
  const agora = new Date(2026, 10, 19, 12);
  assert.deepEqual(filtrarEstacoes({ estacoes: [open, busy, closed, wrongConnector], filtros, agora }).map(s => s.id), ["open"]);
});
