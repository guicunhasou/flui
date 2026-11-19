import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";
import { URL } from "node:url";

type WorkerEvent = { request?: object; waitUntil?: (work: Promise<void>) => void; respondWith?: (work: Promise<Response>) => void };

function worker() {
  const origin = "https://flui.test";
  const handlers = new Map<string, (event: WorkerEvent) => void>();
  const entries = new Map<string, Response>();
  const requests: string[] = [];
  let online = true;
  let serverStatus = 200;
  let quotaExceeded = false;
  let manifestAssets = ["/assets/src/assets/user/profile1.webp", "/assets/src/assets/stations/station-12.webp"];
  let manifestScripts = ["/_expo/static/js/web/EnergyOrbSkia-123.js"];
  const key = (request: string | { url: string }) => new URL(typeof request === "string" ? request : request.url, origin).href;
  const cache = {
    match: async (request: string | { url: string }) => entries.get(key(request))?.clone(),
    put: async (request: string | { url: string }, response: Response) => {
      if (quotaExceeded) throw Error("quota");
      entries.set(key(request), response);
    },
    addAll: async (urls: string[]) => { urls.forEach((url) => entries.set(key(url), new Response("asset"))); },
  };
  const deleted: string[] = [];
  const workerSource = readFileSync(new URL("../public/offline-worker.js", import.meta.url), "utf8");
  runInNewContext(workerSource.replace('VERSION = "BUILD_VERSION"', 'VERSION = "test-build"'), {
    self: { location: { origin, href: `${origin}/offline-worker.js` }, addEventListener: (name: string, callback: (event: WorkerEvent) => void) => handlers.set(name, callback), skipWaiting: async () => {}, clients: { claim: async () => {} } },
    caches: { open: async (name: string) => { assert.equal(name, "flui-offline-test-build"); return cache; }, keys: async () => ["flui-offline-old", "flui-offline-test-build", "other-app"], delete: async (name: string) => { deleted.push(name); } },
    fetch: async (request: string | { url: string }) => {
      requests.push(key(request));
      if (!online) throw Error("offline");
      if (key(request).endsWith("/offline-assets.json")) return Response.json({ version: 2, assets: manifestAssets, scripts: manifestScripts });
      return new Response(`<html><script src="/_expo/entry.js"></script><link href="/font.woff2"><img src="https://external.test/photo.jpg"></html>`, { status: serverStatus });
    },
    URL, Response, AbortController, setTimeout, clearTimeout,
  });
  return {
    requests, entries, deleted,
    setManifestAssets: (value: string[]) => { manifestAssets = value; },
    setManifestScripts: (value: string[]) => { manifestScripts = value; },
    setOnline: (value: boolean) => { online = value; },
    setServerStatus: (status: number) => { serverStatus = status; },
    setQuotaExceeded: () => { quotaExceeded = true; },
    lifecycle: (name: string) => new Promise<void>((resolve, reject) => handlers.get(name)!({ waitUntil: (work) => { work.then(resolve, reject); } })),
    request: (path: string, mode = "navigate", destination = "", method = "GET"): Promise<Response> | undefined => {
      let result: Promise<Response> | undefined;
      handlers.get("fetch")!({ request: { url: new URL(path, origin).href, mode, destination, method }, respondWith: (work) => { result = work; } });
      return result;
    },
  };
}

test("worker prepara páginas e assets locais, sem armazenar serviços externos", async () => {
  const app = worker();
  await app.lifecycle("install");
  assert.equal(app.entries.size, 25); // páginas, fotos, assets do HTML, Leaflet e Orb
  assert.ok(app.entries.has("https://flui.test/loading"));
  assert.ok(app.entries.has("https://flui.test/trip-planner"));
  assert.ok(app.entries.has("https://flui.test/_expo/entry.js"));
  assert.equal(app.request("https://external.test/photo.jpg", "cors", "image"), undefined);
  assert.equal(app.request("/api", "cors", ""), undefined);
  assert.equal(app.request("/review", "cors", "", "POST"), undefined);
  await app.lifecycle("activate");
  assert.deepEqual(app.deleted, ["flui-offline-old"]);
});

test("worker permite reinício offline e ficha com parâmetros sem rede", async () => {
  const app = worker();
  await app.lifecycle("install");
  app.setOnline(false);
  assert.equal((await app.request("/map"))?.status, 200);
  assert.equal((await app.request("/loading"))?.status, 200);
  assert.equal((await app.request("/point-details?stationId=vm"))?.status, 200);
  const calls = app.requests.length;
  assert.equal(await (await app.request("/_expo/entry.js", "cors", "script"))?.text(), "asset");
  assert.equal(app.requests.length, calls);
  assert.equal((await app.request("/canvaskit.wasm", "cors", ""))?.status, 200);
  assert.equal((await app.request("/vendor/fluia-orb-pronta.png", "cors", "image"))?.status, 200);
  assert.equal((await app.request("/_expo/static/js/web/EnergyOrbSkia-123.js", "cors", "script"))?.status, 200);
  assert.equal((await app.request("/vendor/leaflet.js", "cors", "script"))?.status, 200);
  assert.equal((await app.request("/vendor/leaflet.css", "cors", "style"))?.status, 200);
  assert.equal(app.request("https://tile.openstreetmap.org/1/1/1.png", "cors", "image"), undefined);
  assert.equal(app.requests.length, calls);
  assert.equal((await app.request("/not-cached"))?.status, 503);
});

test("worker usa cópia local em erro do servidor e volta à rede ao reconectar", async () => {
  const app = worker();
  await app.lifecycle("install");
  app.setOnline(false);
  assert.equal((await app.request("/settings"))?.status, 200);
  app.setOnline(true);
  const before = app.requests.length;
  assert.equal((await app.request("/settings"))?.status, 200);
  assert.equal(app.requests.length, before + 1);
  app.setServerStatus(503);
  assert.equal((await app.request("/settings"))?.status, 200);
});

test("falha de quota rejeita preparação sem impedir consulta online", async () => {
  const app = worker();
  app.setQuotaExceeded();
  await assert.rejects(app.lifecycle("install"), /quota/);
  assert.equal((await app.request("/map"))?.status, 200);
});


test("prepara foto de estação nunca visitada e perfil antes de ficar offline", async () => {
  const app = worker();
  await app.lifecycle("install");
  app.setOnline(false);
  for (const url of ["/assets/src/assets/user/profile1.webp", "/assets/src/assets/stations/station-12.webp"]) {
    assert.equal((await app.request(url, "cors", "image"))?.status, 200);
  }
});
test("manifesto não permite cache de fotos externas ou caminhos fora dos assets", async () => {
  for (const asset of ["https://external.test/photo.webp", "/private/profile.webp", "/assets/src/assets/user/../../profile.webp"]) {
    const app = worker();
    app.setManifestAssets([asset]);
    await assert.rejects(app.lifecycle("install"), /Foto fora do catálogo local/);
  }
});

test("manifesto rejeita scripts externos ou fora da exportação Web", async () => {
  for (const script of ["https://external.test/script.js", "/_expo/static/js/web/../private.js"]) {
    const app = worker();
    app.setManifestScripts([script]);
    await assert.rejects(app.lifecycle("install"), /Script fora da exportação web/);
  }
});

test("worker preserva o 404 da rede mesmo com uma cópia anterior no cache", async () => {
  const app = worker();
  await app.lifecycle("install");
  app.setServerStatus(404);
  assert.equal((await app.request("/point-details?stationId=vm"))?.status, 404);
  assert.equal((await app.request("/rota-inexistente"))?.status, 404);

  app.setServerStatus(502);
  assert.equal((await app.request("/rota-inexistente"))?.status, 502);

  app.setOnline(false);
  assert.equal((await app.request("/point-details?stationId=vm"))?.status, 200);
});
