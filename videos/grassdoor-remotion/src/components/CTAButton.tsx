import { useCurrentFrame } from "remotion";
import { BACK, EIO, EO, k, kk } from "../lib/anim";
import { DISPLAY, UI } from "../lib/fonts";
import { C } from "../lib/theme";
import { CartIcon } from "./Icons";

/**
 * Primary CTA: cart icon leading the label with real padding (icon 54 · gap 24 · padding 0 64).
 * Pops in, glows, a shine sweeps, then the tap presses it, the cart bounces and a badge pops.
 */
export const CTAButton: React.FC<{ x: number; y: number; w: number; h: number; label: string; start: number; tap?: number; dark?: boolean }> = ({
  x,
  y,
  w,
  h,
  label,
  start,
  tap = 9999,
  dark = false,
}) => {
  const f = useCurrentFrame();
  const pop = k(f, start, start + 14, 0, 1, BACK);
  const shine = k(f, start + 8, start + 24, -0.3, 1.3, EIO);
  const press = kk(f, [tap - 2, tap + 1, tap + 8], [0, 1, 0], EIO);
  const cartHop = kk(f, [tap, tap + 4, tap + 9, tap + 13], [0, -16, 0, -5], EIO);
  const badge = k(f, tap + 3, tap + 13, 0, 1, BACK);
  const glow = 0.45 + 0.25 * Math.sin((f - start) * 0.25);
  const r = h / 2;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, scale: `${pop * (1 - press * 0.05)}`, opacity: Math.min(1, pop * 1.5) }}>
      <div style={{ position: "absolute", inset: -26, borderRadius: r + 26, background: `radial-gradient(closest-side, rgba(47,211,218,${glow}), rgba(47,211,218,0))`, filter: "blur(6px)" }} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: r,
          overflow: "hidden",
          background: dark ? "linear-gradient(180deg, #0a8a92, #056d76)" : `linear-gradient(180deg, ${C.tealBright} 0%, ${C.teal} 55%, #048890 100%)`,
          boxShadow: `inset 0 3px 0 rgba(255,255,255,0.35), inset 0 -6px 0 rgba(0,0,0,0.12), 0 22px 44px rgba(5,110,118,${0.35 + press * 0.1})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
          padding: "0 64px",
        }}
      >
        <div style={{ position: "absolute", top: -40, bottom: -40, width: 140, left: `${shine * 100}%`, background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.55), rgba(255,255,255,0))", rotate: "18deg" }} />
        <div style={{ position: "relative", width: 54, height: 54, translate: `0 ${cartHop}px`, flexShrink: 0 }}>
          <CartIcon size={54} color="#fff" stroke={2.3} />
          <div style={{ position: "absolute", right: -12, top: -12, width: 30, height: 30, borderRadius: 15, background: "#fff", color: C.teal, fontFamily: UI, fontWeight: 900, fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", scale: `${badge}` }}>1</div>
        </div>
        <span style={{ position: "relative", fontFamily: DISPLAY, fontWeight: 700, fontSize: 46, letterSpacing: "0.04em", color: "#fff", whiteSpace: "nowrap" }}>{label}</span>
      </div>
      <div style={{ position: "absolute", inset: 0, borderRadius: r, boxShadow: `0 0 0 ${k(f, tap, tap + 16, 0, 40, EO)}px rgba(47,211,218,${k(f, tap, tap + 16, 0.45, 0, EO)})` }} />
    </div>
  );
};
