import { C } from "../lib/theme";

/** The motif dot used as a finger / cursor. `press` 0..1 squashes it, `ripple` 0..1 expands a ring. */
export const TouchDot: React.FC<{ x: number; y: number; opacity?: number; press?: number; ripple?: number; color?: string; size?: number }> = ({
  x,
  y,
  opacity = 1,
  press = 0,
  ripple = -1,
  color = C.teal,
  size = 56,
}) => (
  <div style={{ position: "absolute", left: x, top: y, width: 0, height: 0, opacity, pointerEvents: "none" }}>
    {ripple >= 0 && ripple <= 1 ? (
      <div
        style={{
          position: "absolute",
          left: -size,
          top: -size,
          width: size * 2,
          height: size * 2,
          borderRadius: "50%",
          border: `4px solid ${color}`,
          scale: `${0.4 + ripple * 1.6}`,
          opacity: 1 - ripple,
        }}
      />
    ) : null}
    <div
      style={{
        position: "absolute",
        left: -size / 2,
        top: -size / 2,
        width: size,
        height: size,
        borderRadius: "50%",
        background: "rgba(255,255,255,0.92)",
        border: `6px solid ${color}`,
        boxShadow: `0 10px 30px rgba(6,47,51,0.35), 0 0 0 10px rgba(5,160,168,${0.18 + press * 0.2})`,
        scale: `${1 - press * 0.22}`,
      }}
    />
  </div>
);
