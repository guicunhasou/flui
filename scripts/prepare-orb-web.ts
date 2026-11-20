import { createRequire } from "node:module";
import { copyFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import type { CanvasKit, CanvasKitInitOptions } from "canvaskit-wasm";
import { SHADER_SOURCE } from "../src/features/assistant/reacticx/conf";
import { parseColor } from "../src/features/assistant/reacticx/helper";
import { getMapOrbPulse, getReacticxOrbPresentation } from "../src/features/assistant/reacticxOrbPresentation";
import { FLUIA_VISUAL_STATUSES, getFluiaPreviewState } from "../src/features/assistant/fluiaVisualStatus";

const require = createRequire(import.meta.url);

async function prepare() {
  const root = resolve(import.meta.dirname, "..");
  // Resolver a versão exigida pelo Skia instalado, sem download ou CDN.
  const skiaRequire = createRequire(require.resolve("@shopify/react-native-skia/package.json"));
  const initialize = skiaRequire("canvaskit-wasm/full") as (options: CanvasKitInitOptions) => Promise<CanvasKit>;
  const wasm = skiaRequire.resolve("canvaskit-wasm/bin/full/canvaskit.wasm");
  mkdirSync(resolve(root, "public/vendor"), { recursive: true });
  copyFileSync(wasm, resolve(root, "public/canvaskit.wasm"));
  const canvasKitPackage = skiaRequire.resolve("canvaskit-wasm/package.json");
  copyFileSync(resolve(dirname(canvasKitPackage), "LICENSE"), resolve(root, "public/vendor/CANVASKIT-LICENSE"));
  copyFileSync(resolve(root, "src/features/assistant/reacticx/LICENSE"), resolve(root, "public/vendor/REACTICX-LICENSE"));
  const kit = await initialize({ locateFile: file => resolve(dirname(wasm), file) });
  const effect = kit.RuntimeEffect.Make(SHADER_SOURCE);
  if (!effect) throw new Error("O shader da #103 não compilou no CanvasKit web.");
  const size = 256;
  const time = 1.2;
  try {
    for (const status of FLUIA_VISUAL_STATUSES) {
      const presentation = getReacticxOrbPresentation(getFluiaPreviewState(status), true, false, true, status);
      const surface = kit.MakeSurface(size, size);
      if (!surface) throw new Error("Não foi possível gerar a prévia estática da Orb.");
      const shader = effect.makeShader([time, size, size, presentation.speed, presentation.intensity,
        ...presentation.colors.flatMap(parseColor), presentation.glowRadius, 1, getMapOrbPulse(time), presentation.statusMode ? 1 : 0]);
      const paint = new kit.Paint();
      paint.setShader(shader);
      surface.getCanvas().clear(kit.TRANSPARENT);
      surface.getCanvas().drawPaint(paint);
      surface.flush();
      const image = surface.makeImageSnapshot();
      try {
        const bytes = image.encodeToBytes();
        if (!bytes) throw new Error("A prévia estática da Orb não pôde ser codificada.");
        writeFileSync(resolve(root, `public/vendor/fluia-orb-${status}.png`), bytes);
      } finally { image.delete(); paint.delete(); shader.delete(); surface.dispose(); }
    }
  } finally { effect.delete(); }
  console.log(`Orb da #103 preparada: CanvasKit local e ${FLUIA_VISUAL_STATUSES.length} prévias do mesmo shader.`);
}

void prepare().catch(error => { console.error(error); process.exitCode = 1; });
