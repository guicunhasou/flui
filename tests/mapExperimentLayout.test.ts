import test from "node:test";
import assert from "node:assert/strict";
import { clampOrbPosition, getDefaultOrbPosition, getMapExperimentLayout, getOrbDragLayout, getOrbRevealGeometry, MAP_ORB_SIZE, resolveOrbPosition, shouldResetOrbAfterThrow, shouldStartOrbDrag } from "../src/features/map/mapExperimentLayout";

test("Orb mantém alvo de toque acima da área Home, inclusive sem inset", () => {
  for (const inset of [0, 21, 34]) {
    const layout = getMapExperimentLayout(inset);
    assert.ok(layout.orbBottom >= inset + 10);
    assert.ok(MAP_ORB_SIZE >= 44);
  }
});

test("expansão parte da posição medida e cobre todos os cantos do viewport", () => {
  for (const [width, height] of [[320, 640], [375, 812], [393, 852], [768, 1024], [1024, 768]]) {
    for (const origin of [{ x: width / 2, y: height - 70, size: 64 }, { x: 24, y: 24, size: 44 }, { x: width / 2, y: height - 110, size: MAP_ORB_SIZE }]) {
      const circle = getOrbRevealGeometry(width, height, origin);
      assert.equal(circle.x, origin.x); assert.equal(circle.y, origin.y);
      for (const [x, y] of [[0, 0], [width, 0], [0, height], [width, height]]) {
        assert.ok(Math.hypot(x - circle.x, y - circle.y) < circle.size / 2 * circle.scale);
      }
    }
  }
});

test("origem fora da tela é limitada ao viewport e mantém alvo de toque mínimo", () => {
  assert.equal(getOrbRevealGeometry(393, 852, { x: -30, y: 1000, size: 20 }).size, 44);
  assert.equal(getOrbRevealGeometry(393, 852, { x: -30, y: 1000, size: 20 }).x, 0);
  assert.equal(getOrbRevealGeometry(393, 852, { x: -30, y: 1000, size: 20 }).y, 852);
});

test("arraste exige deslocamento suficiente, preservando toques com pequena oscilação", () => {
  assert.equal(shouldStartOrbDrag(0, 0), false);
  assert.equal(shouldStartOrbDrag(6, 6), false);
  assert.equal(shouldStartOrbDrag(10, 0), true);
  assert.equal(shouldStartOrbDrag(-8, -6), true);
});

test("arremesso exige distância e velocidade; arraste longo e lento continua reposicionando", () => {
  assert.equal(shouldResetOrbAfterThrow(250, 100, 0.3, 0.2), false);
  assert.equal(shouldResetOrbAfterThrow(20, 30, 2, 2), false);
  assert.equal(shouldResetOrbAfterThrow(80, 60, 0.88, 0.66), true);
  assert.equal(shouldResetOrbAfterThrow(-150, -100, -1.2, -0.3), true);
  assert.deepEqual(getDefaultOrbPosition(getOrbDragLayout(390, 600, 34)), { x: 131, y: 428 });
});

test("soltar sobre os controles encontra a borda livre mais próxima", () => {
  const layout = getOrbDragLayout(390, 600, 34);
  assert.deepEqual(resolveOrbPosition({ x: 16, y: 16 }, layout), { x: 72, y: 16 });
  assert.deepEqual(resolveOrbPosition({ x: 300, y: 16 }, layout), { x: 190, y: 16 });
  assert.deepEqual(clampOrbPosition({ x: -200, y: 900 }, layout), { x: 8, y: 428 });
});

test("arraste permanece no mapa, acima da área Home e livre dos controles em diferentes dimensões", () => {
  for (const width of [320, 375, 390, 481, 768]) for (const height of [180, 320, 640, 960]) for (const inset of [0, 34]) {
    const layout = getOrbDragLayout(width, height, inset);
    assert.ok(layout.size >= 44 && layout.size <= MAP_ORB_SIZE);
    for (const x of [-500, 8, 16, 72, width / 2, width - 64, width + 500]) {
      for (const y of [-500, 16, 80, 128, 176, height / 2, height + 500]) {
        const p = resolveOrbPosition({ x, y }, layout);
        assert.ok(p.x >= 8 && p.x + layout.size <= width - 8);
        assert.ok(p.y >= 8 && p.y + layout.size <= height - getMapExperimentLayout(inset).orbBottom);
        for (const rect of layout.obstacles) assert.ok(
          p.x + layout.size <= rect.x - 8 || p.x >= rect.x + rect.width + 8 ||
          p.y + layout.size <= rect.y - 8 || p.y >= rect.y + rect.height + 8,
          `sobreposição ${width}×${height} em ${JSON.stringify(p)}`,
        );
        assert.deepEqual(resolveOrbPosition(p, layout), p);
      }
    }
  }
});

test("posição escolhida é estável ao reabrir e se adapta ao reduzir a área do mapa", () => {
  const oldLayout = getOrbDragLayout(481, 800, 34);
  const chosen = { x: 200, y: 500 };
  assert.deepEqual(resolveOrbPosition(chosen, oldLayout), chosen);
  const smaller = getOrbDragLayout(320, 400, 34);
  const adjusted = resolveOrbPosition(chosen, smaller);
  assert.deepEqual(adjusted, { x: 184, y: 228 });
  const reveal = getOrbRevealGeometry(320, 650, { x: adjusted.x + smaller.size / 2, y: adjusted.y + 200 + smaller.size / 2, size: smaller.size });
  assert.equal(reveal.x, 248);
  assert.equal(reveal.y, 492);
});
