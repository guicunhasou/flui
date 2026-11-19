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

const intents = [
  "lowBattery",
  "fastCharge",
  "avoidQueues",
  "coffeeAndRestroom",
  "comfortableWait",
] as const;
const now = new Date("2026-09-18T15:00:00Z");

test("nenhuma intenção recomenda posto fora da autonomia ou chegada sem reserva", () => {
  for (const intent of intents) {
    for (const distanceKm of [100, 5, 0.01]) {
      assert.equal(
        recommendStations({
          stations: [createStation({ distanceKm })],
          intent,
          vehicleRangeKm: 100,
          batteryPercent: 5,
          now,
        }),
        null,
      );
    }
  }
});

test("exclui indisponibilidade, ocupação, ausência de carregadores e potência inválida", () => {
  const base = createStation();
  const stations = [
    createStation({ status: "unavailable" }),
    createStation({ status: "maintenance" }),
    createStation({ status: "busy" }),
    createStation({ connectors: [] }),
    createStation({
      connectors: [{ ...base.connectors[0], availableChargers: 0 }],
    }),
    createStation({
      connectors: [{ ...base.connectors[0], availableChargers: 3 }],
    }),
    createStation({ connectors: [{ ...base.connectors[0], powerKw: 0 }] }),
  ];
  for (const intent of intents)
    for (const station of stations) {
      assert.equal(
        recommendStations({
          stations: [station],
          intent,
          vehicleRangeKm: 400,
          batteryPercent: 70,
          now,
        }),
        null,
      );
    }
});

test("não inventa banheiro, café ou conforto em postos sem comodidades", () => {
  const station = createStation({ amenities: [] });
  for (const intent of ["coffeeAndRestroom", "comfortableWait"] as const) {
    assert.equal(
      recommendStations({
        stations: [station],
        intent,
        vehicleRangeKm: 400,
        batteryPercent: 70,
        now,
      }),
      null,
    );
  }
});

test("rejeita dados energéticos inválidos sem fabricar autonomia", () => {
  for (const [vehicleRangeKm, batteryPercent] of [
    [0, 70],
    [-1, 70],
    [NaN, 70],
    [Infinity, 70],
    [400, NaN],
    [400, 101],
    [400, -1],
  ]) {
    assert.equal(
      recommendStations({
        stations: [createStation()],
        intent: "fastCharge",
        vehicleRangeKm,
        batteryPercent,
        now,
      }),
      null,
    );
  }
});

test("conta somente conectores compatíveis livres e usa sua potência na recomendação", () => {
  const station = createStation({
    powerKw: 250,
    connectors: [
      {
        id: "dc",
        type: "ccs2",
        label: "CCS2",
        powerKw: 250,
        totalChargers: 4,
        availableChargers: 4,
      },
      {
        id: "ac",
        type: "type2",
        label: "Tipo 2",
        powerKw: 22,
        totalChargers: 2,
        availableChargers: 1,
      },
    ],
  });
  const result = recommendStations({
    stations: [station],
    intent: "fastCharge",
    vehicleRangeKm: 400,
    batteryPercent: 70,
    vehicleConnectorTypes: ["type2"],
    now,
  });
  assert.equal(result?.availableChargers, 1);
  assert.equal(result?.powerKw, 22);
  assert.equal(result?.compatibilityVerified, true);
  assert.match(result!.explanation, /22 kW/);
  assert.equal(
    recommendStations({
      stations: [station],
      intent: "fastCharge",
      vehicleRangeKm: 400,
      batteryPercent: 70,
      vehicleConnectorTypes: ["chademo"],
      now,
    }),
    null,
  );
  const occupied = {
    ...station,
    connectors: station.connectors.map((c) =>
      c.type === "type2" ? { ...c, availableChargers: 0 } : c,
    ),
  };
  assert.equal(
    recommendStations({
      stations: [occupied],
      intent: "fastCharge",
      vehicleRangeKm: 400,
      batteryPercent: 70,
      vehicleConnectorTypes: ["type2"],
      now,
    }),
    null,
  );
});

test("compatibilidade ausente é explicitamente não confirmada", () => {
  assert.equal(
    recommendStations({
      stations: [createStation()],
      intent: "fastCharge",
      vehicleRangeKm: 400,
      batteryPercent: 70,
      now,
    })?.compatibilityVerified,
    false,
  );
});

test("principal e alternativa obedecem às mesmas restrições, sem arredondar a reserva", () => {
  const stations = [
    createStation({ id: "primary", distanceKm: 1 }),
    createStation({ id: "backup", distanceKm: 2 }),
    createStation({ id: "invalid", status: "unavailable" }),
  ];
  const result = recommendStations({
    stations,
    intent: "fastCharge",
    vehicleRangeKm: 100,
    batteryPercent: 7,
    now,
  });
  assert.equal(result?.primary.id, "primary");
  assert.equal(result?.backup?.id, "backup");
  assert.equal(
    recommendStations({
      stations: [createStation({ distanceKm: 2.01 })],
      intent: "fastCharge",
      vehicleRangeKm: 100,
      batteryPercent: 7,
      now,
    }),
    null,
  );
});
