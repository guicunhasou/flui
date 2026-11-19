export const MAP_ORB_SIZE = 128;

export function getMapExperimentLayout(bottomInset: number) {
  return { orbBottom: Math.max(12, bottomInset) + 10 };
}

export type OrbOrigin = { x: number; y: number; size: number };
export type OrbPosition = { x: number; y: number };
export type OrbDragLayout = {
  size: number; minX: number; maxX: number; minY: number; maxY: number;
  obstacles: { x: number; y: number; width: number; height: number }[];
};

export function shouldStartOrbDrag(dx: number, dy: number) {
  return Math.hypot(dx, dy) >= 10;
}

export function shouldResetOrbAfterThrow(dx: number, dy: number, vx: number, vy: number) {
  return Math.hypot(dx, dy) >= 100 && Math.hypot(vx, vy) >= 1.1;
}

export function getOrbDragLayout(width: number, height: number, bottomInset: number): OrbDragLayout {
  const bottom = getMapExperimentLayout(bottomInset).orbBottom;
  const size = Math.max(44, Math.min(MAP_ORB_SIZE, width - 16, height - bottom - 8));
  return {
    size, minX: 8, maxX: Math.max(8, width - size - 8),
    minY: 8, maxY: Math.max(8, height - size - bottom),
    obstacles: [
      { x: 16, y: 16, width: 48, height: 104 },
      { x: width - 64, y: 16, width: 48, height: 152 },
    ],
  };
}

export function clampOrbPosition(position: OrbPosition, layout: OrbDragLayout): OrbPosition {
  return {
    x: Math.min(layout.maxX, Math.max(layout.minX, position.x)),
    y: Math.min(layout.maxY, Math.max(layout.minY, position.y)),
  };
}

export function resolveOrbPosition(position: OrbPosition, layout: OrbDragLayout): OrbPosition {
  const bounded = clampOrbPosition(position, layout);
  const isFree = (p: OrbPosition) => layout.obstacles.every(rect =>
    p.x + layout.size <= rect.x - 8 || p.x >= rect.x + rect.width + 8 ||
    p.y + layout.size <= rect.y - 8 || p.y >= rect.y + rect.height + 8);
  if (isFree(bounded)) return bounded;

  // Projeta nas bordas dos obstáculos e escolhe a posição livre mais próxima.
  const xs = [bounded.x, layout.minX, layout.maxX];
  const ys = [bounded.y, layout.minY, layout.maxY];
  for (const rect of layout.obstacles) {
    xs.push(rect.x - layout.size - 8, rect.x + rect.width + 8);
    ys.push(rect.y - layout.size - 8, rect.y + rect.height + 8);
  }
  let result = bounded;
  let nearest = Infinity;
  for (const x of xs) for (const y of ys) {
    const candidate = clampOrbPosition({ x, y }, layout);
    if (!isFree(candidate)) continue;
    const distance = (candidate.x - bounded.x) ** 2 + (candidate.y - bounded.y) ** 2;
    if (distance < nearest) { result = candidate; nearest = distance; }
  }
  return result;
}

export function getDefaultOrbPosition(layout: OrbDragLayout): OrbPosition {
  return resolveOrbPosition({ x: (layout.minX + layout.maxX) / 2, y: layout.maxY }, layout);
}

export function getOrbRevealGeometry(width: number, height: number, origin: OrbOrigin) {
  const x = Math.min(width, Math.max(0, origin.x));
  const y = Math.min(height, Math.max(0, origin.y));
  const size = Math.max(44, origin.size);
  const radius = Math.hypot(Math.max(x, width - x), Math.max(y, height - y));
  return { x, y, size, scale: Math.max(1, (radius * 2 + 4) / size) };
}
