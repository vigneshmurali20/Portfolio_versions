import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Orb } from "../components/Orb";
import { Caption } from "../components/Overlay";
import { C, clamp, ease, FPS, HEIGHT, lerp, prog, WIDTH } from "../theme";

// 04 SYSTEMS & STAGGER — a dot grid ripples out from the planet, then every
// dot becomes a rounded tile: a design system stepping into place.
const COLS = 17;
const ROWS = 9;
const GAP = 108;
const PALETTE = [C.purple, C.white, C.lilac, C.cyan];

export const Systems: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const tile = ease.inOutCubic(prog(t, 0.55, 1.0));
  const exit = ease.inExpo(prog(t, 1.5, 1.8));
  const cells: React.ReactNode[] = [];
  for (let j = 0; j < ROWS; j++) {
    for (let i = 0; i < COLS; i++) {
      if (i === (COLS - 1) / 2 && j === (ROWS - 1) / 2) continue;
      const x = WIDTH / 2 + (i - (COLS - 1) / 2) * GAP;
      const y = HEIGHT / 2 + (j - (ROWS - 1) / 2) * GAP;
      const d = Math.hypot(x - WIDTH / 2, y - HEIGHT / 2);
      const appear = ease.outBack(prog(t, d / 2600, d / 2600 + 0.35));
      const wave = Math.sin(d * 0.012 - t * 9);
      const exitK = 1 - clamp(exit * 1.6 - (1 - d / 1100) * 0.6);
      const size = lerp(10, 40, tile) * (1 + wave * 0.45 * (0.4 + tile)) * appear * exitK;
      if (size <= 0.2) continue;
      const color = tile > 0.01 ? PALETTE[Math.floor(((wave + 1) / 2) * 3.99)] : C.white;
      const alpha = lerp(0.8, 1, tile) * (0.45 + (0.55 * (wave + 1)) / 2);
      const ox = (x - WIDTH / 2) * exit * 0.6;
      const oy = (y - HEIGHT / 2) * exit * 0.6;
      const rot = 45 * tile + wave * 11 * tile;
      cells.push(
        <rect
          key={`${i}-${j}`}
          x={-size / 2}
          y={-size / 2}
          width={size}
          height={size}
          rx={lerp(size / 2, size * 0.24, tile)}
          fill={color}
          opacity={alpha}
          transform={`translate(${x + ox} ${y + oy}) rotate(${rot})`}
        />,
      );
    }
  }
  return (
    <AbsoluteFill style={{ background: exit > 0.97 ? C.deep : C.ink }}>
      <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", inset: 0 }}>
        {cells}
      </svg>
      <Orb x={WIDTH / 2} y={HEIGHT / 2} r={34 * (1 - exit)} glow={0.8} />
      <Caption t={t} text="Systems that scale." from={0.5} to={1.55} />
    </AbsoluteFill>
  );
};
