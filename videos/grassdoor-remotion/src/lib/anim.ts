import { Easing, interpolate, random } from "remotion";

export const EO = Easing.bezier(0.16, 1, 0.3, 1); // expo-out: arrivals
export const EIO = Easing.bezier(0.65, 0, 0.35, 1); // in-out: moves, morphs
export const EI = Easing.bezier(0.7, 0, 0.84, 0); // expo-in: exits, iris pushes
export const BACK = Easing.bezier(0.34, 1.56, 0.64, 1); // overshoot pops
export const SOFT = Easing.bezier(0.33, 1, 0.68, 1);
export const LIN = (t: number) => t;

/** clamped keyframe: value goes from `a`→`b` while frame goes `f0`→`f1` */
export const k = (frame: number, f0: number, f1: number, a: number, b: number, ease: (t: number) => number = EO) =>
  interpolate(frame, [f0, f1], [a, b], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });

/** multi-stop clamped keyframes */
export const kk = (frame: number, input: number[], output: number[], ease: (t: number) => number = EIO) =>
  interpolate(frame, input, output, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });

export const rnd = (seed: string | number, lo = 0, hi = 1) => lo + random(seed) * (hi - lo);

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
