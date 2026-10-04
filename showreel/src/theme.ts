import { loadFont } from "@remotion/fonts";
import { Easing, interpolate, staticFile } from "remotion";

// Brand tokens from vigneshmurali.com (Figma: #7F56D9 / #42307D, Urbanist).
export const C = {
  ink: "#040307",
  ink2: "#0b0912",
  purple: "#7F56D9",
  deep: "#42307D",
  lilac: "#B692F6",
  mist: "#EEE9FB",
  cyan: "#3DE0FF",
  white: "#F4F1FB",
} as const;

export const DISPLAY = "Urbanist, sans-serif";
export const MONO = '"JetBrains Mono", monospace';

export const fontsLoaded = Promise.all([
  loadFont({ family: "Urbanist", url: staticFile("fonts/urbanist-latin-wght-normal.woff2"), weight: "100 900" }),
  loadFont({ family: "JetBrains Mono", url: staticFile("fonts/jetbrains-mono-latin-wght-normal.woff2"), weight: "100 800" }),
]);

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

// Seven chapters, each named after the motion principle it shows off,
// mirroring the structure of the reference reel. Frames at 30 fps.
export const CHAPTERS = [
  { id: "Bounce", label: "SQUASH & STRETCH", frames: 60 },
  { id: "Kinetic", label: "KINETIC TYPE", frames: 51 },
  { id: "Form", label: "FORM & DEPTH", frames: 57 },
  { id: "Systems", label: "SYSTEMS & STAGGER", frames: 54 },
  { id: "Path", label: "PATH & OFFSET", frames: 63 },
  { id: "Depth", label: "DEPTH & SPEED", frames: 63 },
  { id: "Signature", label: "SIGNATURE", frames: 102 },
] as const;
export const TOTAL_FRAMES = CHAPTERS.reduce((a, c) => a + c.frames, 0); // 450 = 15 s
export const chapterStarts = CHAPTERS.reduce<number[]>((acc, c, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + CHAPTERS[i - 1].frames);
  return acc;
}, []);

/* ------------------------------------------------------------- helpers */
export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** 0→1 progress of time t (seconds) between a and b */
export const prog = (t: number, a: number, b: number) => clamp((t - a) / (b - a));

export const ease = {
  outExpo: Easing.out(Easing.exp),
  inExpo: Easing.in(Easing.exp),
  inOutExpo: Easing.inOut(Easing.exp),
  outCubic: Easing.out(Easing.cubic),
  inCubic: Easing.in(Easing.cubic),
  inOutCubic: Easing.inOut(Easing.cubic),
  outBack: Easing.out(Easing.back(1.7)),
  inQuad: Easing.in(Easing.quad),
  outQuad: Easing.out(Easing.quad),
};

/** interpolate seconds → value with clamping, for readable keyframes */
export const tween = (t: number, a: number, b: number, from: number, to: number, e: (x: number) => number = (x) => x) =>
  interpolate(t, [a, b], [from, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: e });

/** deterministic random, so every render is identical */
export const rng = (seed: number) => {
  let s = seed >>> 0;
  return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
};

export const hexA = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};

// Logo glyph from the site (Figma node 1:13591). Drawn flipped, like the component.
export const LOGO_PATH =
  "M0 20.58L0 13.87L4.87 9L9.74 4.13L9.74 7.01L9.74 9.89L14.68 4.94L19.62 0L24.57 4.94L29.51 9.89L29.51 7.01L29.51 4.13L34.38 9L39.25 13.87L39.25 20.58L39.25 27.3L34.41 22.46C31.75 19.8 29.54 17.63 29.46 17.63C29.41 17.63 29.36 18.87 29.36 20.39L29.36 23.16L24.49 18.3L19.62 13.43L14.75 18.3L9.89 23.16L9.89 20.39C9.89 18.87 9.84 17.63 9.78 17.63C9.71 17.63 7.5 19.8 4.84 22.46L0 27.3L0 20.58Z";
