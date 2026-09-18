import assert from "node:assert/strict";
import test from "node:test";

import { defaultFilters } from "../src/data/filterOptions";
import {
  cloneDefaultFilters,
  parseStationFiltersParam,
} from "../src/utils/stationFilterParams";

test("retorna filtros independentes quando o parâmetro é inválido", () => {
  const first = parseStationFiltersParam("não é json");
  const second = cloneDefaultFilters();

  first.connectorTypes.push("ccs2");

  assert.deepEqual(second, defaultFilters);
  assert.deepEqual(second.connectorTypes, []);
});

test("descarta opções desconhecidas e impede valores negativos", () => {
  const parsed = parseStationFiltersParam(
    JSON.stringify({
      connectorTypes: ["ccs2", "desconhecido"],
      amenities: ["parking", "spa"],
      statuses: ["available", "broken"],
      power: { minKw: -20 },
      distance: { maxKm: -1 },
      rating: { minRating: -5 },
      onlyOpenNow: true,
    }),
  );

  assert.deepEqual(parsed.connectorTypes, ["ccs2"]);
  assert.deepEqual(parsed.amenities, ["parking"]);
  assert.deepEqual(parsed.statuses, ["available"]);
  assert.equal(parsed.power.minKw, 0);
  assert.equal(parsed.distance.maxKm, 0);
  assert.equal(parsed.rating.minRating, 0);
  assert.equal(parsed.onlyOpenNow, true);
});
