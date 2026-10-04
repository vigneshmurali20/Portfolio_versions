import { useCurrentFrame } from "remotion";
import { C } from "../lib/theme";

/**
 * "Tech" edge glow: a running conic light around the border plus a soft bloom.
 * Place inside a positioned card; it fills the card and ignores pointer layout.
 */
export const EdgeGlow: React.FC<{ radius: number; width?: number; color?: string; speed?: number; intensity?: number; phase?: number }> = ({
  radius,
  width = 3,
  color = C.tealBright,
  speed = 4,
  intensity = 1,
  phase = 0,
}) => {
  const frame = useCurrentFrame();
  const a = (frame * speed + phase) % 360;
  const ring = `conic-gradient(from ${a}deg, rgba(47,211,218,0) 0deg, ${color} 50deg, rgba(47,211,218,0) 110deg, rgba(47,211,218,0) 180deg, ${color} 230deg, rgba(47,211,218,0) 290deg)`;
  const mask: React.CSSProperties = {
    WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
    WebkitMaskComposite: "xor",
    maskComposite: "exclude",
  };
  return (
    <>
      <div style={{ position: "absolute", inset: -width, borderRadius: radius + width, padding: width, background: ring, opacity: intensity, ...mask }} />
      <div style={{ position: "absolute", inset: -width * 4, borderRadius: radius + width * 4, padding: width * 4, background: ring, opacity: 0.55 * intensity, filter: "blur(14px)", ...mask }} />
      <div style={{ position: "absolute", inset: 0, borderRadius: radius, boxShadow: `0 0 60px rgba(5,160,168,${0.28 * intensity}), inset 0 0 0 1.5px rgba(47,211,218,${0.35 * intensity})` }} />
    </>
  );
};
