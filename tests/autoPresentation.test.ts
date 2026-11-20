import assert from "node:assert/strict";
import test from "node:test";
import { AUTO_FORMATS, getAutoFrameSize, getAutoPreviewLayout } from "../src/features/auto/autoPresentation";

test("molduras preservam proporção e largura disponível em telefone, tablet e panorama", () => {
  assert.equal(AUTO_FORMATS.length, 3);
  for (const available of [0, 280, 350, 768, 1920]) {
    for (const format of AUTO_FORMATS) {
      const frame = getAutoFrameSize(available, format.ratio);
      assert.ok(frame.width <= available && frame.width <= 1100);
      assert.ok(Math.abs(frame.height * format.ratio - frame.width) < 0.001);
    }
  }
});

test("todas as proporções cabem na largura disponível sem rolagem horizontal", () => {
  for (const format of AUTO_FORMATS) {
    for (const width of [280, 350, 768, 1100]) {
      for (const font of [1, 1.1, 2]) {
        const preview = getAutoPreviewLayout(width, format, font);
        assert.ok(preview.width <= width);
        assert.ok(Math.abs(preview.height * format.ratio - preview.width) < 0.001);
        assert.equal(preview.scrollsHorizontally, false);
        if (format.id === "vertical") assert.equal(preview.stacked, true);
      }
    }
  }
  assert.equal(getAutoPreviewLayout(350, AUTO_FORMATS[0]).scrollsHorizontally, false);
  assert.equal(getAutoPreviewLayout(350, AUTO_FORMATS[1]).scrollsHorizontally, false);
  assert.equal(getAutoPreviewLayout(350, AUTO_FORMATS[2]).scrollsHorizontally, false);
});
