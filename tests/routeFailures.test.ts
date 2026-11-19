import assert from "node:assert/strict";
import test from "node:test";
import { setTimeout as delay } from "node:timers/promises";
import type { LocationObject } from "expo-location";
import { acquireCurrentLocation } from "../src/utils/currentLocation";
import { openExternalRoute } from "../src/utils/externalRoute";
import { createStation } from "./fixtures";

const position: LocationObject = {
  coords: { latitude: -23.5614, longitude: -46.6559, accuracy: 10,
    altitude: null, altitudeAccuracy: null, heading: null, speed: null },
  timestamp: 1,
};
const granted = async () => ({ status: "granted" });

test("permissão negada não solicita posição nem inventa origem", async () => {
  let called = false;
  const result = await acquireCurrentLocation({
    requestForegroundPermissionsAsync: async () => ({ status: "denied" }),
    getCurrentPositionAsync: async () => { called = true; return position; },
  });
  assert.deepEqual(result, { status: "permission-denied" });
  assert.equal(called, false);
});

test("falha na solicitação de permissão é recuperável", async () => {
  let called = false;
  assert.deepEqual(await acquireCurrentLocation({
    requestForegroundPermissionsAsync: async () => { throw Error("permission API failed"); },
    getCurrentPositionAsync: async () => { called = true; return position; },
  }), { status: "unavailable" });
  assert.equal(called, false);
});

test("GPS concedido mas indisponível não propaga a rejeição nativa", async () => {
  const result = await acquireCurrentLocation({
    requestForegroundPermissionsAsync: granted,
    getCurrentPositionAsync: async () => { throw Error("Cannot obtain current location (kCLErrorDomain error 0)"); },
  });
  assert.deepEqual(result, { status: "unavailable" });
});

test("posição válida é devolvida integralmente e uma nova tentativa pode recuperar o GPS", async () => {
  let attempts = 0;
  const source = {
    requestForegroundPermissionsAsync: granted,
    getCurrentPositionAsync: async () => { if (++attempts === 1) throw Error("GPS unavailable"); return position; },
  };
  assert.deepEqual(await acquireCurrentLocation(source), { status: "unavailable" });
  const result = await acquireCurrentLocation(source);
  assert.equal(result.status, "success");
  if (result.status === "success") assert.equal(result.location, position);
  assert.equal(attempts, 2);
});

test("coordenadas inválidas não são usadas como posição atual", async () => {
  for (const latitude of [NaN, Infinity, 91]) {
    assert.deepEqual(await acquireCurrentLocation({
      requestForegroundPermissionsAsync: granted,
      getCurrentPositionAsync: async () => ({ ...position, coords: { ...position.coords, latitude } }),
    }), { status: "unavailable" });
  }
});

test("GPS sem resposta tem limite e rejeição tardia continua tratada", async () => {
  let rejectPosition!: (reason: Error) => void;
  const pending = new Promise<LocationObject>((_, reject) => { rejectPosition = reject; });
  const result = await acquireCurrentLocation({
    requestForegroundPermissionsAsync: granted,
    getCurrentPositionAsync: () => pending,
  }, 5);
  assert.deepEqual(result, { status: "unavailable" });
  rejectPosition(Error("late native failure"));
  await delay(0); // O runner também falha se ocorrer uma unhandledRejection.
});

test("aguarda canOpenURL e não abre um provedor indisponível", async () => {
  let resolveAvailability!: (available: boolean) => void;
  let opens = 0;
  const availability = new Promise<boolean>((resolve) => { resolveAvailability = resolve; });
  const pending = openExternalRoute(createStation(), "google", position.coords, {
    canOpenURL: () => availability,
    openURL: async () => { opens++; },
  });
  await Promise.resolve();
  assert.equal(opens, 0, "Não pode abrir antes de saber se a URL é suportada");
  resolveAvailability(false);
  assert.match((await pending)!, /não conseguiu abrir.*Tente novamente/);
  assert.equal(opens, 0);
});

test("falhas de consulta e abertura externa retornam mensagens recuperáveis", async () => {
  for (const failure of ["query", "open"]) {
    let opens = 0;
    const error = await openExternalRoute(createStation(), "waze", undefined, {
      canOpenURL: async () => { if (failure === "query") throw Error("query failed"); return true; },
      openURL: async () => { opens++; throw Error("open failed"); },
    });
    assert.match(error!, /Não foi possível abrir.*Tente novamente.*outro aplicativo/);
    assert.equal(opens, failure === "query" ? 0 : 1);
  }
});

test("destino inválido interrompe o fluxo antes de consultar ou abrir o navegador", async () => {
  const unexpected = async () => { assert.fail("Não pode consultar/abrir destino inválido"); };
  const error = await openExternalRoute(createStation({ latitude: NaN }), "google", undefined, {
    canOpenURL: unexpected, openURL: unexpected,
  });
  assert.match(error!, /não possui coordenadas/);
});

test("Google Maps e Waze preservam URLs e não recebem origem do cenário no fallback", async () => {
  for (const provider of ["google", "waze"] as const) {
    for (const origin of [position.coords, undefined]) {
      let checked = "";
      let opened = "";
      const error = await openExternalRoute(createStation(), provider, origin, {
        canOpenURL: async (url) => { checked = url; return true; },
        openURL: async (url) => { opened = url; },
      });
      assert.equal(error, null);
      assert.equal(checked, opened);
      const url = new URL(opened);
      if (provider === "google") {
        assert.equal(url.hostname, "www.google.com");
        assert.equal(url.searchParams.get("destination"), "-23.55,-46.63");
        assert.equal(url.searchParams.get("origin"), origin ? "-23.5614,-46.6559" : null);
      } else {
        assert.equal(url.hostname, "www.waze.com");
        assert.equal(url.searchParams.get("ll"), "-23.55,-46.63");
        assert.equal(url.searchParams.get("navigate"), "yes");
      }
    }
  }
});

test("abertura externa pode ser repetida após falha", async () => {
  let attempts = 0;
  const linking = {
    canOpenURL: async () => true,
    openURL: async () => { if (++attempts === 1) throw Error("temporary failure"); },
  };
  assert.notEqual(await openExternalRoute(createStation(), "google", undefined, linking), null);
  assert.equal(await openExternalRoute(createStation(), "google", undefined, linking), null);
  assert.equal(attempts, 2);
});
