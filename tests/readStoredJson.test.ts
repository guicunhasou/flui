import assert from "node:assert/strict";
import test from "node:test";
import { readStoredJson } from "../src/storage/readStoredJson";

test("somente chave ausente usa o valor vazio; favoritos salvos são preservados", async () => {
  assert.deepEqual(await readStoredJson(async () => null, []), []);
  assert.deepEqual(await readStoredJson(async () => '["station-01","next-buzios"]', []), ["station-01", "next-buzios"]);
});

test("falha na leitura não vira lista vazia e impede gravação derivada dela", async () => {
  let writes = 0;
  const toggle = async () => {
    const favorites = await readStoredJson<string[]>(async () => { throw new Error("native read failed"); }, []);
    writes++;
    return [...favorites, "station-02"];
  };
  await assert.rejects(toggle, /ler os dados locais/);
  assert.equal(writes, 0);
});

test("JSON corrompido não vira dados vazios nem expõe o conteúdo na mensagem", async () => {
  await assert.rejects(readStoredJson(async () => 'private-value-not-json', []), error => {
    assert.ok(error instanceof Error);
    assert.equal(error.message, "Não foi possível interpretar os dados locais.");
    assert.ok(!error.message.includes("private-value"));
    return true;
  });
});
