import assert from "node:assert/strict";
import test from "node:test";

import { defaultFilters } from "../src/data/filterOptions";
import {
  applyQuickFilters,
  hasActiveQuickFilters,
  rankStationsByQuickFilters,
} from "../src/features/map/quickFilters";
import { createStation } from "./fixtures";

test("aplica filtros rápidos sem alterar o objeto original", () => {
  const result = applyQuickFilters(defaultFilters, {
    openNow: true,
    ccs2: true,
    fast: true,
    restroom: true,
  });

  assert.deepEqual(result.connectorTypes, ["ccs2"]);
  assert.deepEqual(result.amenities, ["restroom"]);
  assert.equal(result.power.minKw, 50);
  assert.equal(result.onlyOpenNow, true);
  assert.deepEqual(defaultFilters.connectorTypes, []);
});

test("detecta filtros rápidos ativos", () => {
  assert.equal(
    hasActiveQuickFilters({
      openNow: false,
      ccs2: false,
      fast: false,
      restroom: false,
    }),
    false,
  );
  assert.equal(
    hasActiveQuickFilters({
      openNow: false,
      ccs2: false,
      fast: true,
      restroom: false,
    }),
    true,
  );
});

test("prioriza estações aderentes e usa distância como desempate", () => {
  const slow = createStation({ id: "slow", powerKw: 22, distanceKm: 1 });
  const fastFar = createStation({ id: "fast-far", powerKw: 150, distanceKm: 5 });
  const fastNear = createStation({ id: "fast-near", powerKw: 150, distanceKm: 2 });

  const result = rankStationsByQuickFilters(
    [slow, fastFar, fastNear].map((station, index) => ({ station, index })),
    { openNow: false, ccs2: false, fast: true, restroom: false },
  );

  assert.deepEqual(
    result.map(({ station }) => station.id),
    ["fast-near", "fast-far", "slow"],
  );
});
