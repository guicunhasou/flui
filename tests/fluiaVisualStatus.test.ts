import assert from "node:assert/strict";
import test from "node:test";
import { appThemes, highContrastThemes } from "../src/theme/appTheme";
import { getFluiaScreenTheme } from "../src/features/assistant/fluiaScreenTheme";
import { FLUIA_STATE_LABELS, type FluiaState } from "../src/features/assistant/fluiaState";
import { FLUIA_VISUAL_PRESENTATION, FLUIA_VISUAL_STATUSES, getFluiaPreviewState, getFluiaVisualStatus, MAP_ORB_PALETTE, nextFluiaVisualStatus, type FluiaVisualStatus } from "../src/features/assistant/fluiaVisualStatus";
import { getReacticxOrbPresentation } from "../src/features/assistant/reacticxOrbPresentation";

function luminance(color: string) {
  const rgb = color.slice(1).match(/../g)!.map(c => parseInt(c, 16) / 255)
    .map(c => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
}
function contrast(a: string, b: string) {
  return (Math.max(luminance(a), luminance(b)) + 0.05) / (Math.min(luminance(a), luminance(b)) + 0.05);
}

test("prévia percorre os sete estados na ordem solicitada e retorna a Pronta", () => {
  let current: FluiaVisualStatus = FLUIA_VISUAL_STATUSES[0];
  const labels: string[] = [FLUIA_VISUAL_PRESENTATION[current].label];
  for (let i = 0; i < 7; i++) { current = nextFluiaVisualStatus(current); labels.push(FLUIA_VISUAL_PRESENTATION[current].label); }
  assert.deepEqual(labels, ["Pronta", "Ouvindo", "Pensando", "Explicando", "Erro", "Atenção", "Offline", "Pronta"]);
});

test("estados reais não alegam escuta nem falha técnica e respeitam a conexão observada", () => {
  for (const state of Object.keys(FLUIA_STATE_LABELS) as FluiaState[]) {
    assert.equal(getFluiaVisualStatus(state, "offline"), "offline");
    assert.ok(!["ouvindo", "erro"].includes(getFluiaVisualStatus(state, "connected")));
  }
  assert.equal(getFluiaVisualStatus("repouso", "unknown"), "pronta");
  assert.equal(getFluiaVisualStatus("digitando", "connected"), "pronta");
  assert.equal(getFluiaVisualStatus("pensando", "connected"), "pensando");
  assert.equal(getFluiaVisualStatus("respondendo", "connected"), "explicando");
  assert.equal(getFluiaVisualStatus("alerta", "connected"), "atencao");
});

test("Pronta preserva a paleta da home; outros estados mudam ondas e pausam sinais críticos", () => {
  const home = getReacticxOrbPresentation("repouso", false, true, true);
  const ready = getReacticxOrbPresentation("repouso", false, true, true, "pronta");
  assert.deepEqual(home.colors, MAP_ORB_PALETTE);
  assert.deepEqual(ready.colors, home.colors);
  assert.equal(home.statusMode, false);
  assert.equal(ready.statusMode, false);
  for (const status of FLUIA_VISUAL_STATUSES) {
    const engineState = getFluiaPreviewState(status);
    const effect = getReacticxOrbPresentation(engineState, false, true, true, status);
    assert.equal(effect.colors[0], MAP_ORB_PALETTE[0]);
    assert.equal(effect.colors[1], FLUIA_VISUAL_PRESENTATION[status].light);
    assert.equal(effect.colors[2], FLUIA_VISUAL_PRESENTATION[status].core);
    if (["erro", "atencao", "offline"].includes(status)) assert.equal(effect.animate, false);
    assert.equal(getReacticxOrbPresentation(engineState, true, true, true, status).animate, false);
    assert.equal(getReacticxOrbPresentation(engineState, false, false, true, status).animate, false);
  }
});

test("texto e ações da FluIA têm contraste legível e paleta local não altera o app", () => {
  for (const mode of ["light", "dark"] as const) for (const highContrast of [false, true]) {
    const base = highContrast ? highContrastThemes[mode] : appThemes[mode];
    const before = { ...base };
    const theme = getFluiaScreenTheme(base, highContrast);
    assert.equal(theme.background, highContrast ? "#26004D" : "#2B0055");
    assert.deepEqual(base, before);
    for (const bg of [theme.background, theme.surface, theme.primarySoft]) {
      assert.ok(contrast(theme.text, bg) >= 4.5);
      assert.ok(contrast(theme.textMuted, bg) >= 4.5);
    }
    assert.ok(contrast(theme.onPrimary, theme.primary) >= 4.5);
    for (const status of FLUIA_VISUAL_STATUSES) {
      assert.ok(contrast(FLUIA_VISUAL_PRESENTATION[status].color, theme.background) >= 4.5, status);
    }
  }
});


test("leitura por voz mantém Explicando até terminar, inclusive offline", () => {
  for (const connection of ["connected", "offline", "unknown"] as const) {
    assert.equal(getFluiaVisualStatus("repouso", connection, true), "explicando");
    assert.equal(getFluiaVisualStatus("alerta", connection, true), "explicando");
  }
  assert.equal(getFluiaVisualStatus("repouso", "connected", false), "pronta");
  assert.equal(getFluiaVisualStatus("repouso", "offline", false), "offline");
});
