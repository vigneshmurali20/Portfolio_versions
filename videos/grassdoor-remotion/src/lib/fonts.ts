import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Type system: Unbounded (display), Inter Tight (UI / supporting copy), Geist Mono (HUD labels).
// Variable latin subsets copied from @fontsource-variable into public/fonts.
const FACES = [
  { family: "Unbounded", file: "Unbounded.woff2", weight: "200 900" },
  { family: "Inter Tight", file: "InterTight.woff2", weight: "100 900" },
  { family: "Geist Mono", file: "GeistMono.woff2", weight: "100 900" },
] as const;

export const fontsReady = Promise.all(
  FACES.map((f) => loadFont({ family: f.family, url: staticFile(`fonts/${f.file}`), weight: f.weight, display: "block" })),
);

export const DISPLAY = "Unbounded, sans-serif";
export const UI = "'Inter Tight', sans-serif";
export const MONO = "'Geist Mono', monospace";
