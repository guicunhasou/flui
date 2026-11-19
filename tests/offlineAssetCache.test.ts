import assert from "node:assert/strict";
import test from "node:test";
import { createHash } from "node:crypto";
import { copyFile, mkdir, mkdtemp, readFile, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createOfflineAssetCache, resolveOfflineImage, type OfflineAsset, type OfflineAssetIO } from "../src/offline/offlineAssetCache";
import { offlineImageMetadata } from "../src/offline/offlineImageMetadata";

const bytes = Buffer.from("demo image bytes");
const md5 = (data: Buffer) => createHash("md5").update(data).digest("hex");
const asset: OfflineAsset = { id: "profile", type: "png", md5: md5(bytes) };

test("primeira abertura offline reconhece todas as fotos embutidas sem rede ou cópia prévia", async () => {
  let cacheCalls = 0;
  for (const entry of offlineImageMetadata) {
    const source = pathToFileURL(join(process.cwd(), entry.sourceFile)).href;
    const uri = await resolveOfflineImage(entry, source, false, {
      matches: async (file, descriptor) => md5(await readFile(fileURLToPath(file))) === descriptor.md5,
      prepare: async () => { cacheCalls++;throw new Error("Não deveria precisar de cache/rede"); },
    });
    assert.equal(uri, source);
  }
  assert.equal(cacheCalls, 0);
});

test("origem HTTP não é acessada offline e bundle inválido pode usar cópia persistente", async () => {
  for (const source of ["http://metro.invalid/image.png", "file:///missing.png"]) {
    let checkedSource = false;
    const uri = await resolveOfflineImage(asset, source, false, {
      matches: async () => { checkedSource = true;throw new Error("unreadable"); },
      prepare: async (expected, networkAllowed) => {
        assert.equal(expected, asset);
        assert.equal(networkAllowed, false);
        return "file:///documents/prepared.png";
      },
    });
    assert.equal(checkedSource, source.startsWith("file://"));
    assert.equal(uri, "file:///documents/prepared.png");
  }
});

test("foto embutida corrompida sem cópia não vira uma imagem preparada", async () => {
  await assert.rejects(resolveOfflineImage(asset, "file:///app/partial.png", false, {
    matches: async () => false,
    prepare: async (_asset, networkAllowed) => { assert.equal(networkAllowed, false);throw new Error("not prepared"); },
  }), /not prepared/);
});

function memoryIO() {
  const files = new Map<string, Buffer>();
  let downloads = 0;
  let online = true;
  let corruptCopy = false;
  const io: OfflineAssetIO = {
    directory: "file:///private-test-documents/",
    matches: async (uri, expected) => !!files.get(uri)?.length && md5(files.get(uri)!) === expected.md5,
    ensureDirectory: async () => {},
    download: async () => { downloads++; if (!online) throw new Error("offline"); return "file:///cache/download.png"; },
    copy: async (_from, to) => { files.set(to, corruptCopy ? Buffer.from("partial") : bytes); },
  };
  return { io, files, downloads: () => downloads, offline: () => { online = false; }, corrupt: (value: boolean) => { corruptCopy = value; } };
}

test("downloads concorrentes são deduplicados e nova sessão lê a cópia persistente sem rede", async () => {
  const state = memoryIO();
  const cache = createOfflineAssetCache(state.io);
  const [first, second] = await Promise.all([cache.prepare(asset), cache.prepare(asset)]);
  assert.equal(first, second);
  assert.equal(state.downloads(), 1);
  state.offline();
  const recreated = createOfflineAssetCache(state.io);
  assert.equal(await recreated.prepare(asset), first);
  assert.equal(state.downloads(), 1);
});

test("arquivo parcial nunca é publicado e uma tentativa posterior pode repará-lo", async () => {
  const state = memoryIO();state.corrupt(true);
  const cache = createOfflineAssetCache(state.io);
  await assert.rejects(cache.prepare(asset), /integrity/);
  state.corrupt(false);
  const uri = await cache.prepare(asset);
  assert.equal(md5(state.files.get(uri)!), asset.md5);
  assert.equal(state.downloads(), 2);
});

test("nova versão de uma imagem não reutiliza silenciosamente conteúdo antigo", async () => {
  const state = memoryIO();const cache = createOfflineAssetCache(state.io);
  await cache.prepare(asset);state.offline();
  await assert.rejects(createOfflineAssetCache(state.io).prepare({ ...asset, md5: md5(Buffer.from("changed")) }), /offline/);
  assert.equal(state.files.size, 1);
});

test("não aceita descritor fora do escopo nem retorno de URL remota como arquivo local", async () => {
  const state = memoryIO();const cache = createOfflineAssetCache(state.io);
  await assert.rejects(cache.prepare({ ...asset, id: "../user-data" }), /Invalid/);
  await assert.rejects(cache.prepare({ ...asset, md5: "not-a-hash" }), /Invalid/);
  assert.equal(state.downloads(), 0);
  await assert.rejects(createOfflineAssetCache({ ...state.io, download: async () => "https://example.invalid/photo" }).prepare(asset), /local file/);
  assert.equal(state.files.size, 0);
});

test("as 18 fotos públicas persistem em disco após recriar o cache e bloquear downloads", async () => {
  const root = await mkdtemp(join(tmpdir(), "flui-offline-assets-"));
  let downloads = 0;
  let online = true;
  const metadata = new Map(offlineImageMetadata.map(item => [item.id, item]));
  const directory = pathToFileURL(join(root, "photos") + "/").href;
  const io: OfflineAssetIO = {
    directory,
    ensureDirectory: () => mkdir(fileURLToPath(directory), { recursive: true }).then(() => {}),
    matches: async (uri, expected) => {
      try { const data = await readFile(fileURLToPath(uri));return data.length > 0 && md5(data) === expected.md5; } catch { return false; }
    },
    download: async item => {
      downloads++;if (!online) throw new Error("offline");
      const path = join(process.cwd(), metadata.get(item.id)!.sourceFile);
      return pathToFileURL(path).href;
    },
    copy: (from, to) => copyFile(fileURLToPath(from), fileURLToPath(to)),
  };
  try {
    // Unrelated data survives; only the cache's own directory is written.
    await writeFile(join(root, "user-preferences.json"), '{"batteryPercent":42}');
    assert.equal(offlineImageMetadata.length, 18);
    const first = createOfflineAssetCache(io);
    const prepared = await Promise.all(offlineImageMetadata.map(item => first.prepare(item)));
    assert.equal(downloads, 18);
    for (const [index, item] of offlineImageMetadata.entries()) {
      const source = await readFile(join(process.cwd(), item.sourceFile));
      assert.equal(md5(source), item.md5, `fingerprint outdated: ${item.id}`);
      assert.ok((await stat(fileURLToPath(prepared[index]))).size > 0);
    }
    online = false;
    const nextSession = createOfflineAssetCache(io);
    assert.deepEqual(await Promise.all(offlineImageMetadata.map(item => nextSession.prepare(item))), prepared);
    assert.equal(downloads, 18, "nenhuma requisição após preparar os arquivos");
    assert.equal(await readFile(join(root, "user-preferences.json"), "utf8"), '{"batteryPercent":42}');
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("sem conexão, foto ainda não preparada é informada sem tentar uma requisição", async () => {
  const state = memoryIO();
  await assert.rejects(createOfflineAssetCache(state.io).prepare(asset, false), /not prepared/);
  assert.equal(state.downloads(), 0);
  const uri = await createOfflineAssetCache(state.io).prepare(asset);
  state.offline();
  assert.equal(await createOfflineAssetCache(state.io).prepare(asset, false), uri);
  assert.equal(state.downloads(), 1);
});
