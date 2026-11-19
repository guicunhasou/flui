import assert from "node:assert/strict";
import test from "node:test";
import { getMapPanelLayout, getMapVerticalFocusOffset, getMapHorizontalFocusOffset } from "../src/features/map/mapLayout";
import { appThemes } from "../src/theme/appTheme";

test("painel deixa espaço para controles em tela compacta e respeita a área do mapa", () => {
  const layout = getMapPanelLayout(320, 568, 374);
  assert.equal(layout.horizontal, false);
  assert.equal(layout.compactControls, true);
  assert.equal(layout.panelMaxHeight, 224);
  assert.ok(374 - layout.panelMaxHeight >= 150, "reserva espaço para controles e FluIA sem sobreposição");
  assert.equal(layout.panelWidth, undefined);
  assert.equal(getMapPanelLayout(440, 956, 700, 2).compactControls, true);
  assert.equal(getMapPanelLayout(440, 956, 700, 1, 600).compactControls, true);
  assert.equal(getMapPanelLayout(440, 956, 670, 1, 448.7).compactControls, true);
  assert.equal(getMapPanelLayout(440, 956, 700, 1, 451).compactControls, true);
  assert.equal(getMapPanelLayout(440, 956, 700, 1, 450).compactControls, false);
});

test("painel horizontal e panorâmico preserva espaço lateral e limita a largura de leitura", () => {
  for (const width of [700, 844, 1920]) {
    const layout = getMapPanelLayout(width, 390, 200);
    assert.equal(layout.horizontal, true);
    assert.ok(layout.panelWidth! <= 400);
    assert.ok(layout.panelWidth! < width / 2);
    assert.ok(layout.panelMaxHeight <= 200);
  }
  assert.equal(getMapPanelLayout(699, 390, 200).horizontal, false);
  assert.equal(getMapPanelLayout(768, 1024, 800).horizontal, false);
});

function luminance(hex: string) {
  const channels = hex.slice(1).match(/../g)!.map((value) => parseInt(value, 16) / 255)
    .map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}
function contrast(a: string, b: string) {
  const values = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

test("textos essenciais e indicadores têm contraste mínimo de 4,5:1 nos dois temas", () => {
  for (const [name, theme] of Object.entries(appThemes)) {
    for (const foreground of [theme.text, theme.textMuted, theme.textLight, theme.success, theme.warningText, theme.dangerText]) {
      for (const background of [theme.background, theme.surface]) {
        assert.ok(contrast(foreground, background) >= 4.5, `${name}: ${foreground}/${background}`);
      }
    }
    for (const [foreground, background] of [[theme.success, theme.successSoft], [theme.warningText, theme.yellow], [theme.dangerText, theme.dangerSoft]]) {
      assert.ok(contrast(foreground, background) >= 4.5, `${name} indicador: ${foreground}/${background}`);
    }
    assert.ok(contrast(theme.onPrimary, theme.primary) >= 4.5);
  }
});


test("centralização horizontal não desloca a origem para o topo por causa do painel lateral", () => {
  for (const width of [700, 956, 1194, 1920]) {
    const layout = getMapPanelLayout(width, 390, 200);
    for (const panelHeight of [0, 52, 188, 600]) {
      assert.equal(getMapVerticalFocusOffset(layout.horizontal, 200, panelHeight), 0);
    }
  }
  assert.equal(getMapVerticalFocusOffset(true, 0, 600), 0);
});

test("centralização em retrato preserva compensação, limite, recolhimento e painel oculto", () => {
  assert.equal(getMapVerticalFocusOffset(false, 600, 360), 0.3);
  assert.equal(getMapVerticalFocusOffset(false, 200, 600), 0.4);
  assert.equal(getMapVerticalFocusOffset(false, 600, 52), 52 / 1200);
  assert.equal(getMapVerticalFocusOffset(false, 600, 360, true), 0);
  assert.equal(getMapVerticalFocusOffset(false, 0, 360), 0.08);
});


test("painel lateral centraliza a origem na área livre sem alterar o retrato", () => {
  assert.equal(getMapHorizontalFocusOffset(true, 832, 400), 0.25);
  assert.equal(getMapHorizontalFocusOffset(false, 440, 400), 0);
  assert.equal(getMapHorizontalFocusOffset(true, 832, 400, true), 0);
  assert.equal(getMapHorizontalFocusOffset(true, 0, 400), 0);
});
