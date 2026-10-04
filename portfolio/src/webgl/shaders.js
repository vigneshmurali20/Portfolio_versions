// Shared GLSL. All custom shaders work in raw sRGB values (no colour-space
// conversion), so brand hex values render exactly as specified.

export const noise = /* glsl */ `
float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 4; i++) {
    v += a * vnoise(p);
    p = m * p;
    a *= 0.5;
  }
  return v;
}
`;

export const fullscreenVert = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

// Flowing aurora in the brand purples, lit by the cursor.
export const nebulaFrag = /* glsl */ `
uniform float uTime;
uniform vec2 uRes;
uniform vec2 uMouse;
uniform float uScroll;
uniform float uGlow;
uniform float uGlowY;
varying vec2 vUv;
${noise}
void main() {
  vec2 uv = vUv;
  float aspect = uRes.x / uRes.y;
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
  float t = uTime * 0.035;

  vec2 q = vec2(fbm(p * 1.3 + t), fbm(p * 1.3 - t + 5.2));
  vec2 r = vec2(fbm(p * 1.7 + 3.0 * q + vec2(1.7, 9.2) + t * 1.3),
                fbm(p * 1.7 + 3.0 * q + vec2(8.3, 2.8) - t));
  float f = fbm(p * 1.1 + 2.4 * r + vec2(0.0, uScroll * 2.0));

  vec3 ink = vec3(0.035, 0.027, 0.059);
  vec3 deep = vec3(0.259, 0.188, 0.490);
  vec3 brand = vec3(0.498, 0.337, 0.851);
  vec3 cyan = vec3(0.239, 0.878, 1.0);

  vec3 col = ink;
  col = mix(col, deep * 0.6, smoothstep(0.35, 0.95, f));
  col = mix(col, brand * 0.55, smoothstep(0.6, 1.05, f) * clamp(length(q), 0.0, 1.0));
  col += cyan * 0.05 * smoothstep(0.62, 1.0, r.x) * smoothstep(0.45, 0.9, f);

  vec2 m = (uMouse - 0.5) * vec2(aspect, 1.0);
  float ml = exp(-3.2 * length(p - m));
  col += brand * 0.14 * ml * (0.5 + f);

  float g = exp(-pow((uv.y - uGlowY) * 2.6, 2.0)) * uGlow;
  col += brand * 0.16 * g;

  float v = smoothstep(1.3, 0.2, length(p * vec2(0.8, 1.15)));
  col *= mix(0.3, 1.0, v);

  gl_FragColor = vec4(col, 1.0);
}
`;

export const copyFrag = /* glsl */ `
uniform sampler2D uTex;
varying vec2 vUv;
void main() { gl_FragColor = texture2D(uTex, vUv); }
`;

// Glowing planet that stands in for the purple half-circle in the Figma hero.
export const planetVert = /* glsl */ `
varying vec3 vNormal;
varying vec3 vView;
varying vec3 vPos;
void main() {
  vPos = position;
  vNormal = normalize(normalMatrix * normal);
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vView = -mv.xyz;
  gl_Position = projectionMatrix * mv;
}
`;

export const planetFrag = /* glsl */ `
uniform float uTime;
uniform vec2 uLight;
varying vec3 vNormal;
varying vec3 vView;
varying vec3 vPos;
${noise}
void main() {
  vec3 n = normalize(vNormal);
  vec3 v = normalize(vView);
  float fres = pow(1.0 - max(dot(n, v), 0.0), 2.4);
  vec3 L = normalize(vec3(uLight, 0.7));
  float diff = max(dot(n, L), 0.0);

  float warp = fbm(vPos.xz * 2.2 + uTime * 0.04);
  float bands = fbm(vec2(vPos.y * 4.0 + warp * 1.6, uTime * 0.02) * 1.8);

  vec3 deep = vec3(0.259, 0.188, 0.490);
  vec3 brand = vec3(0.498, 0.337, 0.851);
  vec3 soft = vec3(0.714, 0.573, 0.965);
  vec3 cyan = vec3(0.239, 0.878, 1.0);

  vec3 col = mix(deep * 0.55, brand, diff * 0.85 + bands * 0.28);
  col = mix(col, soft, pow(diff, 7.0) * 0.55);
  col += mix(soft, cyan, 0.4) * fres * 1.35;
  gl_FragColor = vec4(col, 1.0);
}
`;

export const haloFrag = /* glsl */ `
uniform float uStrength;
varying vec2 vUv;
void main() {
  float d = length(vUv - 0.5) * 2.0;
  float a = smoothstep(1.0, 0.36, d) * uStrength;
  vec3 c = mix(vec3(0.498, 0.337, 0.851), vec3(0.714, 0.573, 0.965), smoothstep(0.9, 0.4, d));
  gl_FragColor = vec4(c, a);
}
`;

export const planeVert = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// Portrait: rim light from the planet, velocity RGB split, noise dissolve
// with a glowing edge (used for the intro "materialise" and on scroll).
export const portraitFrag = /* glsl */ `
uniform sampler2D uTex;
uniform float uTime;
uniform float uDissolve;
uniform vec2 uVel;
uniform vec2 uTexel;
varying vec2 vUv;
${noise}
float alphaAt(vec2 uv) { return texture2D(uTex, uv).a; }
void main() {
  vec2 uv = vUv;
  vec2 shift = uVel * 0.0028;
  vec4 base = texture2D(uTex, uv);
  float r = texture2D(uTex, uv + shift).r;
  float b = texture2D(uTex, uv - shift).b;
  vec3 col = vec3(r, base.g, b);
  // the photo is cropped flat at the bottom: feather that edge into the dark
  float a = base.a * smoothstep(0.0, 0.14, uv.y);

  // rim: how much empty space surrounds this pixel
  vec2 d = uTexel * 5.0;
  float around = (alphaAt(uv + vec2(d.x, 0.0)) + alphaAt(uv - vec2(d.x, 0.0)) +
                  alphaAt(uv + vec2(0.0, d.y)) + alphaAt(uv - vec2(0.0, d.y)) +
                  alphaAt(uv + d) + alphaAt(uv - d) +
                  alphaAt(uv + vec2(d.x, -d.y)) + alphaAt(uv + vec2(-d.x, d.y))) / 8.0;
  float rim = clamp(a - around, 0.0, 1.0);
  float lower = smoothstep(0.85, 0.15, uv.y);
  vec3 rimCol = mix(vec3(0.714, 0.573, 0.965), vec3(0.239, 0.878, 1.0), uv.x);
  col += rimCol * rim * (0.55 + lower * 0.6);
  col = mix(col, col * vec3(0.92, 0.88, 1.08), 0.4);

  // dissolve
  float n = fbm(uv * 3.2 + vec2(0.0, uTime * 0.05)) * 0.55 + fbm(uv * 14.0) * 0.15 + uv.y * 0.3;
  float t = uDissolve * 1.25 - 0.12;
  if (uDissolve > 0.001) {
    if (n < t) discard;
    float edge = smoothstep(t, t + 0.07, n);
    vec3 glow = mix(vec3(0.239, 0.878, 1.0), vec3(0.714, 0.573, 0.965), edge) * 2.4;
    col = mix(glow, col, edge);
  }
  if (a < 0.01) discard;
  gl_FragColor = vec4(col * a, a);
}
`;

export const particlesVert = /* glsl */ `
attribute float aSeed;
uniform float uTime;
uniform float uSize;
uniform float uBoost;
uniform float uPixelRatio;
varying float vAlpha;
varying float vSeed;
void main() {
  vec3 p = position;
  p.y = mod(p.y + uTime * (0.08 + aSeed * 0.18) * (1.0 + uBoost * 3.0) + 4.0, 8.0) - 4.0;
  p.x += sin(uTime * 0.3 + aSeed * 30.0) * 0.12;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * uPixelRatio * (0.3 + aSeed * 0.8) * (1.0 + uBoost * 0.35) / -mv.z;
  vAlpha = (0.15 + 0.6 * aSeed) * (0.3 + uBoost * 0.5);
  vSeed = aSeed;
}
`;

export const particlesFrag = /* glsl */ `
varying float vAlpha;
varying float vSeed;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.0, d) * vAlpha;
  vec3 c = mix(vec3(0.714, 0.573, 0.965), vec3(1.0), step(0.7, vSeed));
  gl_FragColor = vec4(c, a);
}
`;
