import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Orb } from "../components/Orb";
import { C, clamp, ease, FPS, hexA, HEIGHT, lerp, prog, WIDTH } from "../theme";

// 01 SQUASH & STRETCH — the planet drops in, bounces with decaying height,
// then swells to fill the frame and becomes chapter 2's purple ground.
const GROUND = 640;
const R = 30;
const SEGMENTS = [
  { t0: 0.15, t1: 0.55, from: -80, to: GROUND, up: false },
  { t0: 0.62, t1: 0.88, from: GROUND, to: 380, up: true },
  { t0: 0.88, t1: 1.12, from: 380, to: GROUND, up: false },
  { t0: 1.18, t1: 1.33, from: GROUND, to: 520, up: true },
  { t0: 1.33, t1: 1.47, from: 520, to: GROUND, up: false },
];
export const CONTACTS = [0.55, 1.12, 1.47];

export const Bounce: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  let y = GROUND;
  let sx = 1;
  let sy = 1;
  for (const s of SEGMENTS) {
    if (t >= s.t0 && t <= s.t1) {
      const p = prog(t, s.t0, s.t1);
      y = lerp(s.from, s.to, s.up ? ease.outQuad(p) : ease.inQuad(p));
      const speed = s.up ? 1 - p : p; // stretch along the motion when fast
      sy = 1 + speed * 0.3;
      sx = 1 - speed * 0.17;
    }
  }
  CONTACTS.forEach((c, i) => {
    const d = t - c;
    if (d >= 0 && d < 0.09) {
      const k = Math.sin((d / 0.09) * Math.PI) * [0.45, 0.3, 0.18][i];
      sx = 1 + k;
      sy = 1 - k;
      y = GROUND + R * k;
    }
  });
  const lineW = 340 * ease.outExpo(prog(t, 0.05, 0.6));
  const height = clamp((GROUND - y) / 500);
  const grow = ease.inExpo(prog(t, 1.55, 2.0));
  const lift = ease.inOutCubic(prog(t, 1.5, 1.9));
  const oy = t > 1.5 ? lerp(GROUND, HEIGHT / 2, lift) : y;
  const r = lerp(R, 1300, grow);

  return (
    <AbsoluteFill style={{ background: C.ink }}>
      <div
        style={{
          position: "absolute",
          left: WIDTH / 2 - lineW / 2,
          top: GROUND + R,
          width: lineW,
          height: 2,
          background: hexA(C.white, 0.35),
          opacity: 1 - grow,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: WIDTH / 2 - 46 * (1 - height * 0.6),
          top: GROUND + R - 3,
          width: 92 * (1 - height * 0.6),
          height: 14 * (1 - height * 0.6),
          borderRadius: "50%",
          background: hexA(C.purple, 0.4 * (1 - height) * (t > 0.15 ? 1 : 0) * (1 - lift)),
          filter: "blur(4px)",
        }}
      />
      {t >= 0.15 && <Orb x={WIDTH / 2} y={oy} r={r} sx={grow > 0 ? 1 : sx} sy={grow > 0 ? 1 : sy} glow={1 - grow} />}
      {grow > 0.92 && <AbsoluteFill style={{ background: C.purple }} />}
    </AbsoluteFill>
  );
};
