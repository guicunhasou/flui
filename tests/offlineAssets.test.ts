import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
const { prepareOfflineAssets } = createRequire(import.meta.url)("../scripts/prepare-offline-assets.cjs");

test("manifesto inclui fotos públicas e chunks do Expo, e gera uma versão determinística", () => {
  const dir = mkdtempSync(join(tmpdir(), "flui-offline-assets-"));
  try {
    writeFileSync(join(dir, "index.html"), "<html></html>");
    writeFileSync(join(dir, "offline-worker.js"), 'const VERSION = "BUILD_VERSION";\n');
    writeFileSync(join(dir, "canvaskit.wasm"), "wasm");
    mkdirSync(join(dir, "vendor"));
    writeFileSync(join(dir, "vendor/leaflet.js"), "leaflet");
    const scripts = join(dir, "_expo/static/js/web");
    mkdirSync(scripts, { recursive: true });
    const lazyChunk = join(scripts, "EnergyOrbSkia-123.js");
    writeFileSync(lazyChunk, "renderer");
    writeFileSync(join(scripts, "source-map.json"), "{}");
    for (const category of ["user", "stations"]) {
      const folder = join(dir, "assets/src/assets", category);
      mkdirSync(folder, { recursive: true });
      writeFileSync(join(folder, category + ".hash.webp"), "imagem");
      writeFileSync(join(folder, "ignorado.txt"), "não é imagem");
    }
    const result = prepareOfflineAssets(dir);
    assert.deepEqual(result.assets, ["/assets/src/assets/user/user.hash.webp", "/assets/src/assets/stations/stations.hash.webp"]);
    assert.equal(result.version, 2);
    assert.deepEqual(result.scripts, ["/_expo/static/js/web/EnergyOrbSkia-123.js"]);
    assert.deepEqual(JSON.parse(readFileSync(join(dir, "offline-assets.json"), "utf8")), result);
    const worker = join(dir, "offline-worker.js");
    const firstVersion = readFileSync(worker, "utf8");
    assert.match(firstVersion, /^const VERSION = "[a-f0-9]{64}";$/m);
    prepareOfflineAssets(dir);
    assert.equal(readFileSync(worker, "utf8"), firstVersion);
    writeFileSync(lazyChunk, "renderer atualizado");
    prepareOfflineAssets(dir);
    assert.notEqual(readFileSync(worker, "utf8"), firstVersion);
    const secondVersion = readFileSync(worker, "utf8");
    writeFileSync(join(dir, "vendor/leaflet.js"), "leaflet atualizado");
    prepareOfflineAssets(dir);
    assert.notEqual(readFileSync(worker, "utf8"), secondVersion);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
test("não promete preparação offline de uma exportação inexistente", () => {
  assert.throws(() => prepareOfflineAssets(join(tmpdir(), "flui-export-inexistente")), /exportação web concluída/);
});
