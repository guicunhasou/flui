import assert from "node:assert/strict";
import test from "node:test";

import { recommendStations } from "../src/features/assistant/fluiAssistant";
import { createStation } from "./fixtures";

test("prioriza uma estação próxima quando a bateria está baixa", () => {
  const nearby = createStation({ id: "nearby", distanceKm: 1, powerKw: 50 });
  const farAway = createStation({
    id: "far-away",
    distanceKm: 18,
    powerKw: 250,
  });
  const recommendation = recommendStations({
    stations: [farAway, nearby],
    intent: "lowBattery",
    vehicleRangeKm: 100,
    batteryPercent: 25,
  });

  assert.equal(recommendation?.primary.id, "nearby");
  assert.equal(recommendation?.backup?.id, "far-away");
});

test("considera potência e comodidades conforme a necessidade", () => {
  const comfortable = createStation({
    id: "comfortable",
    powerKw: 50,
    amenities: ["restroom", "coffee", "wifi", "coveredArea"],
  });
  const fast = createStation({
    id: "fast",
    powerKw: 250,
    amenities: ["parking"],
  });

  assert.equal(
    recommendStations({
      stations: [comfortable, fast],
      intent: "fastCharge",
      vehicleRangeKm: 400,
      batteryPercent: 50,
    })?.primary.id,
    "fast",
  );
  assert.equal(
    recommendStations({
      stations: [comfortable, fast],
      intent: "coffeeAndRestroom",
      vehicleRangeKm: 400,
      batteryPercent: 50,
    })?.primary.id,
    "comfortable",
  );
});
