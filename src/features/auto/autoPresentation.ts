// Proporções editoriais para comparar layouts; não são medidas de veículos.
export const AUTO_FORMATS = [
  { id: "horizontal", label: "Horizontal", ratio: 16 / 9, proportion: "16:9" },
  { id: "vertical", label: "Vertical", ratio: 3 / 4, proportion: "3:4" },
  { id: "panoramic", label: "Panorâmica", ratio: 24 / 9, proportion: "24:9" },
] as const;

export function getAutoFrameSize(availableWidth: number, ratio: number) {
  const width = Math.max(0, Math.min(1100, availableWidth));
  return { width, height: width / ratio };
}

// A moldura preserva a proporção e cabe na largura disponível; leitura interna pode rolar verticalmente.
export function getAutoPreviewLayout(
  availableWidth: number,
  format: (typeof AUTO_FORMATS)[number],
  appFontScale = 1,
  systemFontScale = 1,
) {
  const readingScale = Math.max(1, appFontScale * systemFontScale);
  const frame = getAutoFrameSize(availableWidth, format.ratio);
  return {
    ...frame,
    stacked: format.id === "vertical" || frame.width / readingScale < 600,
    scrollsHorizontally: false,
  };
}
