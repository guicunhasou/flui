import assert from "node:assert/strict";
import test from "node:test";
import { setTimeout as delay } from "node:timers/promises";
import { classifyConnection, externalActionBlock, readConnectionStatus } from "../src/utils/connectivity";
import { openExternalRoute, prepareExternalRoute } from "../src/utils/externalRoute";
import { createStation } from "./fixtures";

test("distingue conexão, ausência de internet e estado ainda desconhecido", () => {
  assert.equal(classifyConnection({}), "unknown");
  assert.equal(classifyConnection({ type: "NONE" }), "offline");
  assert.equal(classifyConnection({ isConnected: false }), "offline");
  assert.equal(classifyConnection({ isConnected: true, isInternetReachable: false }), "offline");
  assert.equal(classifyConnection({ type: "UNKNOWN", isConnected: true, isInternetReachable: true }), "connected");
  assert.equal(classifyConnection({ isConnected: true }), "connected");
});

test("reconsulta acompanha online, offline e recuperação", async () => {
  const states = [{ isConnected: true }, { isConnected: false }, { isInternetReachable: true }];
  const read = async () => states.shift()!;
  assert.equal(await readConnectionStatus(read), "connected");
  assert.equal(await readConnectionStatus(read), "offline");
  assert.equal(await readConnectionStatus(read), "connected");
});

test("erro e demora do detector são recuperáveis, inclusive rejeição tardia", async () => {
  assert.equal(await readConnectionStatus(async () => { throw Error("network unavailable"); }), "unknown");
  let reject!: (e: Error) => void;
  const pending = new Promise<never>((_, rejectPromise) => { reject = rejectPromise; });
  assert.equal(await readConnectionStatus(() => pending, 5), "unknown");
  reject(Error("late native rejection"));
  await delay(0);
});

test("offline e desconhecido não chegam ao Linking em nenhum provedor", async () => {
  for (const provider of ["google", "waze"] as const) {
    for (const status of ["offline", "unknown"] as const) {
      const calls: string[] = [];
      const linking = { canOpenURL: async (url: string) => { calls.push(url); return true; }, openURL: async (url: string) => { calls.push(url); } };
      assert.equal(await openExternalRoute(createStation(), provider, undefined, linking, async () => status), externalActionBlock(status));
      assert.deepEqual(calls, []);
    }
  }
});

test("uma nova tentativa após reconectar permite a navegação existente", async () => {
  let online = false;
  let opened = 0;
  const check = async () => online ? "connected" as const : "offline" as const;
  const linking = { canOpenURL: async () => true, openURL: async () => { opened++; } };
  assert.match((await openExternalRoute(createStation(), "google", undefined, linking, check))!, /Sem conexão/);
  online = true;
  assert.equal(await openExternalRoute(createStation(), "google", undefined, linking, check), null);
  assert.equal(opened, 1);
});

test("detecção positiva não esconde falhas do aplicativo externo", async () => {
  const check = async () => "connected" as const;
  assert.match((await openExternalRoute(createStation(), "waze", undefined, { canOpenURL: async () => false, openURL: async () => {} }, check))!, /não conseguiu abrir/);
  assert.match((await openExternalRoute(createStation(), "google", undefined, { canOpenURL: async () => true, openURL: async () => { throw Error("launch failed"); } }, check))!, /Não foi possível abrir/);
});


test("ficha e atalho da FluIA bloqueiam a escolha de GPS até confirmar conexão", async () => {
  for (const status of ["offline", "unknown", "connected"] as const) {
    let ready = 0;
    const message = await prepareExternalRoute(async () => status, () => { ready++; });
    assert.equal(message, externalActionBlock(status));
    assert.equal(ready, status === "connected" ? 1 : 0);
  }
  let ready = false;
  const message = await prepareExternalRoute(async () => { throw Error("native unavailable"); }, () => { ready = true; });
  assert.equal(message, externalActionBlock("unknown"));
  assert.equal(ready, false);
});
