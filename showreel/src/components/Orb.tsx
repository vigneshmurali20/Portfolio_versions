import React from "react";
import { C, hexA, LOGO_PATH } from "../theme";

type OrbProps = {
  x: number;
  y: number;
  r: number;
  sx?: number;
  sy?: number;
  glow?: number;
  color?: string;
};

/** The hero object: the glowing purple planet from vigneshmurali.com. */
export const Orb: React.FC<OrbProps> = ({ x, y, r, sx = 1, sy = 1, glow = 1 }) => {
  if (r <= 0.01) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x - r,
        top: y - r,
        width: r * 2,
        height: r * 2,
        borderRadius: "50%",
        transform: `scale(${sx}, ${sy})`,
        background: `radial-gradient(circle at 32% 28%, #cdb6ff 0%, ${C.purple} 46%, ${C.deep} 100%)`,
        boxShadow: `0 0 ${r * 1.6}px ${r * 0.5}px ${hexA(C.purple, 0.45 * glow)}, inset 0 0 0 ${Math.max(1, r * 0.06)}px ${hexA(C.lilac, 0.75)}`,
      }}
    />
  );
};

/** Purple disc with the V glyph, as in the site's nav logo. */
export const LogoDisc: React.FC<{ size: number; style?: React.CSSProperties }> = ({ size, style }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: C.deep,
      boxShadow: `inset 0 0 0 ${size * 0.03}px ${C.purple}, 0 0 ${size * 0.4}px ${hexA(C.purple, 0.5)}`,
      display: "grid",
      placeItems: "center",
      ...style,
    }}
  >
    <svg width={size * 0.58} viewBox="-1 -1 41.25 29.3" style={{ overflow: "visible" }}>
      <path d={LOGO_PATH} transform="matrix(1 0 0 -1 0 27.3)" fill={C.white} />
    </svg>
  </div>
);
