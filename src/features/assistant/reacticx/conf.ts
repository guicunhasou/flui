// Reacticx Energy Orb — Copyright (c) 2026 rit3zh, MIT.
// Fonte fixada em 4e11fcfe04e0bd7054574acc1557320911d70e4c. Licença integral em ./LICENSE.
import type { RGB } from "./types";

const SHADER_SOURCE = /*wgsl*/ `
  uniform float iTime;
  uniform vec2 iResolution;
  uniform float uSpeed;
  uniform float uIntensity;
  uniform vec3 uColor0;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform float uGlowRadius;
  uniform float uMapMode;
  uniform float uMapPulse;
  uniform float uStatusMode;

  // Quadrado explícito: pow(x, 2) não é definido para x negativo em GLSL.
  float gaussian(float x) { return exp(-x * x); }

  // UX-MAPA-01: esfera de vidro com três fitas de luz, inspirada na referência
  // visual fornecida pelo usuário. Tudo é procedural, sem vídeo ou textura.
  vec4 mapOrb(vec2 uv) {
    vec2 p = uv / 0.46;
    float radius = length(p);
    float feather = 1.0 - smoothstep(0.72, 1.05, radius);
    float z = sqrt(max(0.0, 1.0 - dot(p, p)));
    float t = iTime * (uStatusMode > 0.5 ? 0.7 + uSpeed * 0.7 : 0.95);
    float envelope = pow(max(0.0, 1.0 - p.x * p.x), 0.65);
    float morph = 0.5 + 0.5 * cos(t * 1.05);
    float frequency = mix(1.4, 5.6, morph);
    float amplitude = 0.35 + 0.40 * (0.5 + 0.5 * sin(t * 0.85 + 0.4));
    vec3 light = vec3(0.0);
    float energy = 0.0;

    // Lâminas preenchidas: o número de lobos muda e as superfícies se dobram.
    // A referência alterna entre várias ondas e um volume largo ao centro.
    for (int i = 0; i < 3; i++) {
      float phase = float(i) * 2.094395;
      float carrier = p.x * frequency + t * 0.65 + phase;
      float front = sin(carrier) * amplitude * envelope;
      float back = sin(carrier + 1.35) * amplitude * envelope;
      float center = (front + back) * 0.5;
      float width = abs(front - back) * 0.5 + 0.055 * envelope;
      float d = abs(p.y - center);
      float sheet = 1.0 - smoothstep(width * 0.7, width + 0.025, d);
      float edge = gaussian((d - width) / 0.018);
      float glow = gaussian(d / max(0.06, width * 1.6));
      float volume = 0.65 + 0.35 * cos((p.y - center) / max(0.03, width) * 1.7 + phase);
      vec3 hue = mix(uColor2, uColor1, 0.3 + float(i) * 0.25);
      if (uStatusMode < 0.5) {
        if (i == 1) hue = vec3(0.82, 0.34, 0.98);
        if (i == 2) hue = vec3(0.55, 0.52, 1.0);
      }
      light += hue * (sheet * volume * 0.85 + glow * 0.14)
        + mix(hue, vec3(1.0), 0.45) * edge * 0.08;
      energy += sheet * 0.78 + glow * 0.14 + edge * 0.08;
    }

    // Faixa clara contínua na região equatorial, com espessura e curva suaves.
    float axis = sin(p.x * 2.4 - t * 0.55) * 0.045 * envelope;
    float beamWidth = (0.028 + 0.085 * (1.0 - morph)) * envelope + 0.012;
    float beam = gaussian((p.y - axis) / beamWidth);
    float beamGlow = gaussian((p.y - axis) / (beamWidth * 2.4));
    light += vec3(0.93, 0.88, 1.0) * (beam * 0.95 + beamGlow * 0.18);
    energy += beam * 1.1 + beamGlow * 0.18;

    // Interior alterna suavemente entre dois violetas, com contorno macio e reflexos.
    float rim = gaussian((radius - 0.96) / 0.025);
    float angle = atan(p.y, p.x);
    float glint = pow(0.5 + 0.5 * cos(angle * 3.0 + t * 0.45), 12.0);
    float highlight = exp(-dot(p - vec2(-0.30, -0.68), p - vec2(-0.30, -0.68)) / 0.007);
    float glass = (0.94 + z * 0.03) * (1.0 - smoothstep(0.9, 1.03, radius));
    float opacity = mix(0.8, 0.6, uMapPulse);
    float waveAlpha = clamp(energy * 0.72 + rim * (0.23 + glint * 0.45) + highlight * 0.4, 0.0, 1.0) * opacity;
    vec3 hue = light * 0.72 + uColor1 * rim * (0.23 + glint * 0.45)
      + vec3(0.95, 0.88, 1.0) * highlight * 0.4;
    vec3 waveColor = clamp(hue * opacity, vec3(0.0), vec3(waveAlpha));
    float alpha = (waveAlpha + glass * (1.0 - waveAlpha)) * feather;
    vec3 glassLight = uStatusMode > 0.5 ? vec3(0.780392, 0.592157, 1.0) : uColor1;
    vec3 glassColor = mix(uColor0, glassLight, mix(0.12, 0.23, uMapPulse));
    vec3 color = (waveColor + glassColor * glass * (1.0 - waveAlpha)) * feather;

    // Reflexo de vidro sobre o gradiente: arco parcial fino e brilho em órbita lenta.
    // A camada tem sua própria suavização para continuar visível na borda difusa.
    float arc = pow(0.5 + 0.5 * cos(angle + 2.2 + sin(t * 0.22) * 0.12), 7.0);
    float fineRim = gaussian((radius - 0.90) / 0.010);
    float rimHalo = gaussian((radius - 0.90) / 0.045);
    float orbit = t * 0.28 - 2.2;
    vec2 pointOffset = p - vec2(cos(orbit), sin(orbit)) * 0.90;
    float pointLight = exp(-dot(pointOffset, pointOffset) / 0.0014);
    float edgeMask = 1.0 - smoothstep(0.98, 1.05, radius);
    float edgeAlpha = clamp(fineRim * (0.025 + arc * 0.52)
      + rimHalo * arc * 0.08 + pointLight * 0.72, 0.0, 0.82) * edgeMask;
    vec3 edgeColor = mix(uColor1, vec3(1.0), 0.6);
    color = edgeColor * edgeAlpha + color * (1.0 - edgeAlpha);
    alpha = edgeAlpha + alpha * (1.0 - edgeAlpha);
    return vec4(clamp(color, vec3(0.0), vec3(alpha)), alpha);
  }

  vec4 main(vec2 fragCoord) {
    vec2 uv = (fragCoord - 0.5 * iResolution) / iResolution.y;
    float r = length(uv);

    if (uMapMode > 0.5) {
      return mapOrb(uv);
    }

    // Flui: mantém um nível mínimo de brilho, evitando desaparecer no repouso.
    float wave = sin(r * 2.0 - iTime * uSpeed) * 0.35 + 0.65;
    float glow = smoothstep(uGlowRadius, 0.2, r) * wave * uIntensity;

    float t1 = sin(iTime * 0.8 + r * 6.0) * 0.5 + 0.5;
    float t2 = sin(iTime * 0.5 + r * 3.0) * 0.5 + 0.5;

    vec3 color = mix(mix(uColor0, uColor1, t1), uColor2, t2) * glow;

    color += 0.26 * smoothstep(0.55, 0.3, r) * mix(uColor0, uColor2, 0.5);

    float alpha = clamp(smoothstep(0.6, 0.2, r) * glow, 0.0, 1.0);

    // Flui: canais associados ao alpha dentro dos limites esperados pelo Skia.
    return vec4(clamp(color, vec3(0.0), vec3(alpha)), alpha);
  }
`;

const NAMED_COLORS: Record<string, RGB> = {
  red: [1, 0, 0],
  green: [0, 1, 0],
  blue: [0, 0, 1],
  white: [1, 1, 1],
  black: [0, 0, 0],
  yellow: [1, 1, 0],
  cyan: [0, 1, 1],
  magenta: [1, 0, 1],
  orange: [1, 0.65, 0],
  purple: [0.5, 0, 0.5],
  pink: [1, 0.75, 0.8],
};

const DEFAULT_COLORS = ["#4D80FF", "#FF4D80", "#80FF4D"];
const DEFAULT_SPEED = 1.0;
const DEFAULT_INTENSITY = 2.0;
const DEFAULT_GLOW_RADIUS = 0.45;
const DEFAULT_SIZE = 400;

export {
  SHADER_SOURCE,
  NAMED_COLORS,
  DEFAULT_COLORS,
  DEFAULT_SPEED,
  DEFAULT_INTENSITY,
  DEFAULT_GLOW_RADIUS,
  DEFAULT_SIZE,
};
