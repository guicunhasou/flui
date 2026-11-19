import assert from "node:assert/strict";
import test from "node:test";
import { offlinePhotosPresentation } from "../src/offline/offlinePhotosPresentation";

test("confirma imagens somente após concluir a verificação local de todas", () => {
  const input = { ready: 15, total: 15, supported: true, preparing: false };
  assert.equal(offlinePhotosPresentation(input).complete, true);
  assert.equal(offlinePhotosPresentation(input).title, "Imagens preparadas");
  const checking = offlinePhotosPresentation({ ...input, preparing: true });
  assert.equal(checking.complete, false);
  assert.equal(checking.title, "Conferindo imagens");
  assert.equal(checking.canRetry, false);
});

test("preparação parcial e instalação incompatível não anunciam conclusão", () => {
  const partial = offlinePhotosPresentation({ ready: 12, total: 15, supported: true, preparing: false });
  assert.equal(partial.complete, false);
  assert.equal(partial.canRetry, true);
  const unavailable = offlinePhotosPresentation({ ready: 15, total: 15, supported: false, preparing: false });
  assert.equal(unavailable.complete, false);
  assert.equal(unavailable.title, "Preparação indisponível");
  assert.equal(unavailable.canRetry, false);
});

test("contagem indisponível e catálogo vazio não são anunciados como prontos", () => {
  for (const ready of [-3, NaN, 0]) {
    const state = offlinePhotosPresentation({ ready, total: 15, supported: true, preparing: true });
    assert.equal(state.complete, false);
  }
  assert.equal(offlinePhotosPresentation({ ready: 0, total: 0, supported: true, preparing: false }).complete, false);
});
