import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, DISPLAY, ease, FPS, prog } from "../theme";

// 02 KINETIC TYPE — his disciplines slam in letter by letter on brand purple,
// each closed by the planet as a full stop; the last full stop grows into the
// light ground of chapter 3.
export const WORDS = [
  { w: "UI/UX", s: 0, e: 0.36 },
  { w: "BRAND", s: 0.36, e: 0.72 },
  { w: "MOTION", s: 0.72, e: 1.08 },
  { w: "VIGNESH", s: 1.08, e: 1.7 },
];

export const Kinetic: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const word = WORDS.find((x) => t >= x.s && t < x.e) ?? WORDS[3];
  const local = t - word.s;
  const last = word.w === "VIGNESH";
  const size = last ? 300 : 330;
  const dot = size * 0.14;
  const dotIn = ease.outBack(prog(local, 0.12, 0.3));
  const wipe = last ? ease.inExpo(prog(t, 1.42, 1.7)) : 0;

  return (
    <AbsoluteFill style={{ background: C.purple, alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "flex-end", height: size * 1.05 }}>
        <div style={{ display: "flex", overflow: "hidden", height: size * 1.05, alignItems: "flex-end" }}>
          {[...word.w].map((l, i) => {
            const p = ease.outExpo(prog(local, i * 0.022, i * 0.022 + 0.32));
            const out = last ? 0 : ease.inCubic(prog(local, 0.28, 0.36));
            return (
              <span
                key={`${word.w}-${i}`}
                style={{
                  fontFamily: DISPLAY,
                  fontWeight: 800,
                  fontSize: size,
                  lineHeight: 0.86,
                  letterSpacing: -12,
                  color: C.ink,
                  display: "inline-block",
                  transform: `translateY(${(1 - p) * size * 1.05 - out * size * 1.05}px)`,
                }}
              >
                {l}
              </span>
            );
          })}
        </div>
        <div
          style={{
            width: dot * 2,
            height: dot * 2,
            marginLeft: dot * 0.6,
            marginBottom: size * 0.02,
            borderRadius: "50%",
            background: wipe > 0.02 ? C.mist : C.ink,
            transform: `scale(${dotIn * (1 + wipe * 70)})`,
            zIndex: 2,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
