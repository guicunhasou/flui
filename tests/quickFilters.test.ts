import assert from "node:assert/strict";
import test from "node:test";

import { defaultFilters } from "../src/data/filterOptions";
import {
  applyQuickFilters,
  hasActiveQuickFilters,
  rankStationsByQuickFilters,
  quickFiltersFromStationFilters,
  toggleQuickStationFilter,
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


test("filtros rápidos refletem seleções feitas na busca avançada", () => {
  const advanced = {
    ...defaultFilters,
    connectorTypes: ["type2", "ccs2"] as typeof defaultFilters.connectorTypes,
    amenities: ["wifi", "restroom"] as typeof defaultFilters.amenities,
    power: { minKw: 120 },
    onlyOpenNow: true,
  };

  assert.deepEqual(quickFiltersFromStationFilters(advanced), {
    openNow: true,
    ccs2: true,
    fast: true,
    restroom: true,
  });
});

test("desmarcar chips rápidos preserva os demais critérios avançados", () => {
  const advanced = {
    ...defaultFilters,
    connectorTypes: ["type2", "ccs2"] as typeof defaultFilters.connectorTypes,
    amenities: ["wifi", "restroom"] as typeof defaultFilters.amenities,
    power: { minKw: 120 },
    rating: { minRating: 4 },
    onlyOpenNow: true,
  };

  const noCcs2 = toggleQuickStationFilter(advanced, "ccs2");
  assert.deepEqual(noCcs2.connectorTypes, ["type2"]);
  assert.deepEqual(advanced.connectorTypes, ["type2", "ccs2"]);

  const noRestroom = toggleQuickStationFilter(noCcs2, "restroom");
  assert.deepEqual(noRestroom.amenities, ["wifi"]);

  const noFast = toggleQuickStationFilter(noRestroom, "fast");
  assert.equal(noFast.power.minKw, 0);
  assert.equal(noFast.rating.minRating, 4);

  const noOpenNow = toggleQuickStationFilter(noFast, "openNow");
  assert.equal(noOpenNow.onlyOpenNow, false);
  assert.deepEqual(quickFiltersFromStationFilters(noOpenNow), {
    openNow: false,
    ccs2: false,
    fast: false,
    restroom: false,
  });
});

test("um chip rápido ligado chega aos avançados e pode ser removido", () => {
  const fast = toggleQuickStationFilter(defaultFilters, "fast");
  assert.equal(fast.power.minKw, 50);
  assert.equal(quickFiltersFromStationFilters(fast).fast, true);
  assert.equal(toggleQuickStationFilter(fast, "fast").power.minKw, 0);

  const ccs2 = toggleQuickStationFilter(defaultFilters, "ccs2");
  assert.deepEqual(ccs2.connectorTypes, ["ccs2"]);
  assert.deepEqual(toggleQuickStationFilter(ccs2, "ccs2").connectorTypes, []);
});
