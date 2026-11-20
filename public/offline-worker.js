/* global self, caches */
// Apenas arquivos públicos do app; preferências e avaliações continuam no AsyncStorage.
// Preenchido a partir da exportação estática por prepare-offline-assets.cjs.
const VERSION = "BUILD_VERSION";
const CACHE = `flui-offline-${VERSION}`;
const PAGES = ["/", "/map", "/search", "/point-details", "/settings", "/profile", "/review", "/trip-planner", "/onboarding", "/loading"];
const ASSETS = new Set(["script", "style", "image", "font"]);
const LOCAL_ASSETS = ["/vendor/leaflet.css", "/vendor/leaflet.js", "/canvaskit.wasm", ...["pronta", "ouvindo", "pensando", "explicando", "erro", "atencao", "offline"].map(status => `/vendor/fluia-orb-${status}.png`)];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    const assets = new Set(LOCAL_ASSETS.map(path => new URL(path, self.location.origin).href));
    await Promise.all(PAGES.map(async (path) => {
      const response = await fetch(path, { cache: "reload" });
      if (!response.ok) throw new Error("Não foi possível preparar a consulta offline.");
      const html = await response.clone().text();
      await cache.put(path, response);
      for (const match of html.matchAll(/<(?:script|link|img)\b[^>]*(?:src|href)=["']([^"']+)["']/gi)) {
        const url = new URL(match[1], self.location.origin);
        if (url.origin === self.location.origin) assets.add(url.href);
      }
    }));
    const manifestResponse = await fetch("/offline-assets.json", { cache: "reload" });
    if (!manifestResponse.ok) throw new Error("Exportação sem manifesto de fotos offline.");
    const manifest = await manifestResponse.json();
    if (manifest.version !== 2 || !Array.isArray(manifest.assets) || !manifest.assets.length
      || !Array.isArray(manifest.scripts) || !manifest.scripts.length) {
      throw new Error("Manifesto offline inválido.");
    }
    for (const asset of manifest.assets) {
      if (typeof asset !== "string" || !/^\/assets\/src\/assets\/(?:user|stations|map|onboarding|images)\/[\w.@-]+\.(?:webp|png|jpe?g)$/i.test(asset)) throw new Error("Imagem fora dos recursos locais do app.");
      assets.add(new URL(asset, self.location.origin).href);
    }
    for (const script of manifest.scripts) {
      if (typeof script !== "string" || !/^\/_expo\/static\/js\/web\/[\w.-]+\.js$/.test(script)) {
        throw new Error("Script fora da exportação web.");
      }
      assets.add(new URL(script, self.location.origin).href);
    }
    await cache.addAll([...assets]);
    // A nova versão ativa quando as abas da versão anterior forem fechadas.
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if (key.startsWith("flui-offline-") && key !== CACHE) await caches.delete(key);
    }
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;
  const navigation = request.mode === "navigate";
  if (!navigation && !ASSETS.has(request.destination) && !LOCAL_ASSETS.includes(url.pathname)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    if (!navigation) {
      const stored = await cache.match(request);
      if (stored) return stored;
    }
    const findCachedResponse = async () => (
      await cache.match(request) || (navigation && await cache.match(url.pathname))
    );
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3000);
    try {
      const response = await fetch(request, { signal: controller.signal });
      if (navigation && response.status >= 500) {
        return (await findCachedResponse()) || response;
      }
      if (response.ok && response.type !== "opaque") {
        // Falha/quota de cache não pode transformar uma resposta online em erro.
        await cache.put(request, response.clone()).catch(() => {});
      }
      return response;
    } catch {
      const stored = await findCachedResponse();
      if (stored) return stored;
      return new Response("Abra o Flui uma vez com conexão para preparar a consulta offline.", { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } });
    } finally {
      clearTimeout(timer);
    }
  })());
});
