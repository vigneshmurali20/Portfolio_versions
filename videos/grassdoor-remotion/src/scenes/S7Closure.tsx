import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { LeafIcon, ShieldCheckIcon, TruckIcon } from "../components/Icons";
import { LineReveal, RiseText, TypeText } from "../components/Kinetic";
import { EI, EIO, EO, k, rnd } from "../lib/anim";
import { DISPLAY, MONO, UI } from "../lib/fonts";
import { KNOB } from "../lib/iconPath";
import { C } from "../lib/theme";

const ROWS = [
  { Icon: TruckIcon, title: "Fast delivery", sub: "STRAIGHT TO YOUR DOOR", bar: "FAST DELIVERY" },
  { Icon: LeafIcon, title: "Premium products", sub: "CALIFORNIA'S TOP BRANDS", bar: "PREMIUM PRODUCTS" },
  { Icon: ShieldCheckIcon, title: "Trusted service", sub: "4.7★ GOOGLE · 4.8 LEAFLY", bar: "TRUSTED SERVICE" },
];
const LOGO = { w: 680, x: 200, y: 640 };
const LS = LOGO.w / 1538;

/** 07 · Silk. Icon + tagline line animations, they settle into a trust bar, shards lock into the logo, then the URL. */
export const S7Closure: React.FC = () => {
  const f = useCurrentFrame();
  const settle = k(f, 42, 58, 0, 1, EIO);
  const logoIn = k(f, 54, 64, 0, 1, EO);
  const knob = { x: LOGO.x + (1241 + KNOB.x) * LS, y: LOGO.y + KNOB.y * LS };

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(60% 35% at 50% 42%, rgba(47,211,218,0.16), rgba(47,211,218,0) 70%)" }} />

      {ROWS.map(({ Icon, title, sub, bar }, i) => {
        const t0 = 4 + i * 7;
        const rowY = 470 + i * 280;
        const draw = k(f, t0, t0 + 20, 0, 1, EIO);
        // icon travels from its row to the trust bar
        const ix = 80 + (150 + i * 300 - 80) * settle;
        const iy = rowY + (1290 - rowY) * settle;
        const is = 1 - settle * 0.36;
        const textOut = k(f, 40 + i * 2, 50 + i * 2, 0, 1, EI);
        return (
          <div key={title}>
            <div style={{ position: "absolute", left: ix, top: iy, width: 180, height: 180, scale: `${is}`, transformOrigin: "50% 50%" }}>
              <svg width={180} height={180} style={{ position: "absolute", inset: 0 }}>
                <circle cx={90} cy={90} r={85} fill="none" stroke="rgba(127,221,225,0.55)" strokeWidth={2} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k(f, t0, t0 + 16, 0, 1, EIO)} transform="rotate(-90 90 90)" />
              </svg>
              <div style={{ position: "absolute", left: 36, top: 36 }}>
                <Icon size={108} color="#fff" stroke={1.5} draw={draw} />
              </div>
            </div>
            <div style={{ position: "absolute", left: 300, top: rowY + 22, opacity: 1 - textOut, filter: `blur(${textOut * 10}px)`, translate: `0 ${-textOut * 30}px` }}>
              <LineReveal text={title} start={t0 + 6} lineColor={C.tealBright} style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 60, letterSpacing: "-0.02em", color: "#fff" }} />
              <div style={{ marginTop: 12, fontFamily: MONO, fontSize: 24, letterSpacing: "0.16em", color: C.tealLight }}>
                <TypeText text={sub} start={t0 + 14} cps={60} cursor={false} />
              </div>
            </div>
            <div style={{ position: "absolute", left: 240 + i * 300 - 110, top: 1478, width: 220, textAlign: "center", fontFamily: MONO, fontSize: 20, letterSpacing: "0.12em", lineHeight: 1.35, color: "rgba(255,255,255,0.85)", opacity: k(f, 56 + i * 2, 64 + i * 2, 0, 1) }}>
              {bar.split(" ").map((w) => (
                <div key={w}>{w}</div>
              ))}
            </div>
            {i < 2 ? <div style={{ position: "absolute", left: 390 + i * 300, top: 1320, width: 2, height: 220, background: "rgba(255,255,255,0.25)", scale: `1 ${k(f, 58, 68, 0, 1)}` }} /> : null}
          </div>
        );
      })}

      {/* shards converge and lock into the logo */}
      {Array.from({ length: 22 }).map((_, i) => {
        const p = k(f, 44 + rnd(`cd${i}`, 0, 6), 60 + rnd(`cd${i}`, 0, 6), 0, 1, EIO);
        if (p <= 0 || f > 66) return null;
        const sx = rnd(`csx${i}`, -100, 1180);
        const sy = rnd(`csy${i}`, 300, 1500);
        const tx = LOGO.x + rnd(`ctx${i}`, 0, LOGO.w);
        const ty = LOGO.y + rnd(`cty${i}`, 60, 200);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: sx + (tx - sx) * p,
              top: sy + (ty - sy) * p,
              width: rnd(`cw${i}`, 16, 60) * (1 - p * 0.6),
              height: rnd(`ch${i}`, 6, 18) * (1 - p * 0.6),
              background: i % 3 ? "#fff" : C.tealBright,
              rotate: `${rnd(`cr${i}`, -180, 180) * (1 - p)}deg`,
              opacity: k(f, 58, 66, 1, 0),
              borderRadius: 2,
            }}
          />
        );
      })}
      <Img
        src={staticFile("img/logo-white.png")}
        style={{ position: "absolute", left: LOGO.x, top: LOGO.y, width: LOGO.w, opacity: logoIn, scale: `${0.92 + logoIn * 0.08}`, filter: `brightness(${1 + (1 - logoIn) * 1.5}) blur(${(1 - logoIn) * 6}px)` }}
      />
      {/* the knob dot pulses one last time */}
      <div style={{ position: "absolute", left: knob.x - 30, top: knob.y - 30, width: 60, height: 60, borderRadius: 30, border: `3px solid ${C.tealBright}`, scale: `${k(f, 70, 88, 0.4, 2.2, EO)}`, opacity: k(f, 70, 88, 0.9, 0, EO) }} />

      <div style={{ position: "absolute", left: 0, right: 0, top: 980, textAlign: "center", fontFamily: MONO, fontSize: 26, letterSpacing: "0.5em", paddingLeft: "0.5em", color: C.tealLight }}>
        <RiseText text="VISIT" start={60} stagger={1.2} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1036, textAlign: "center", fontFamily: DISPLAY, fontWeight: 700, fontSize: 60, letterSpacing: "-0.02em", color: "#fff" }}>
        <TypeText text="www.grassdoor.com" start={64} cps={36} cursorColor={C.tealBright} />
      </div>
      <div style={{ position: "absolute", left: 190, top: 1128, width: 700, height: 6, borderRadius: 3, background: `linear-gradient(90deg, ${C.teal}, ${C.tealBright})`, scale: `${k(f, 76, 88, 0, 1, EO)} 1`, transformOrigin: "0 50%", boxShadow: "0 0 24px rgba(47,211,218,0.8)" }} />

      <div style={{ position: "absolute", left: 90, right: 90, top: 1690, textAlign: "center", fontFamily: UI, fontSize: 19, lineHeight: 1.4, color: "rgba(255,255,255,0.55)", opacity: k(f, 62, 74, 0, 1) }}>
        21+ only. Licensed CA cannabis retailer, Lic. C10-0001336-LIC. Credit issued as store credit; no cash value. California only.
      </div>
    </AbsoluteFill>
  );
};
