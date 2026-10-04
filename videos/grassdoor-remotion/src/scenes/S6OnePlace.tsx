import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { CTAButton } from "../components/CTAButton";
import { EdgeGlow } from "../components/EdgeGlow";
import { GiftIcon, TruckIcon, WalletIcon } from "../components/Icons";
import { RiseText, TypeText } from "../components/Kinetic";
import { TouchDot } from "../components/TouchDot";
import { EI, EIO, EO, k, kk } from "../lib/anim";
import { DISPLAY, MONO, UI } from "../lib/fonts";
import { C } from "../lib/theme";
import { DAY31 } from "./S5Credit";

const OFFERS = [
  { label: ["Check your", "wallet"], Icon: WalletIcon },
  { label: ["Fresh deals", "& drops"], Icon: GiftIcon },
  { label: ["Place a", "delivery order"], Icon: TruckIcon },
];

/** 06 · White. Figma "Everything you need in one place": wallet, deals, delivery — and the cart CTA gets tapped. */
export const S6OnePlace: React.FC = () => {
  const f = useCurrentFrame();
  const iris = k(f, 0, 11, 0, 2300, EI);
  const tap = 50;
  const bloom = k(f, 62, 69, 0, 1, EI);

  return (
    <AbsoluteFill style={{ clipPath: `circle(${iris}px at ${DAY31.x}px ${DAY31.y}px)`, background: C.white, filter: `brightness(${1 + bloom})` }}>
      <AbsoluteFill style={{ background: "radial-gradient(80% 40% at 50% 70%, rgba(5,160,168,0.10), rgba(5,160,168,0) 70%)" }} />
      <div style={{ position: "absolute", left: 80, top: 236, fontFamily: MONO, fontSize: 24, letterSpacing: "0.22em", color: C.teal }}>
        <TypeText text="05 — VISIT GRASSDOOR.COM" start={6} cps={50} />
      </div>
      <div style={{ position: "absolute", left: 76, top: 286, fontFamily: DISPLAY, fontWeight: 800, fontSize: 80, lineHeight: 1.08, letterSpacing: "-0.035em", color: C.ink }}>
        <RiseText text="Everything" start={8} stagger={1} />
        <br />
        <RiseText text="you need," start={12} stagger={1} />
        <br />
        <RiseText text="one place." start={16} stagger={1} style={{ color: C.teal }} />
      </div>

      {/* three offer cards */}
      {OFFERS.map(({ label, Icon }, i) => {
        const p = k(f, 14 + i * 4, 32 + i * 4, 0, 1, EO);
        const draw = k(f, 22 + i * 4, 40 + i * 4, 0, 1, EIO);
        return (
          <div key={i} style={{ position: "absolute", left: 60 + i * 330, top: 640, width: 300, height: 330, perspective: 1200 }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 36, background: "#F7FBFB", border: `2px solid ${C.line}`, boxShadow: "0 24px 50px rgba(6,47,51,0.10)", rotate: `y ${(1 - p) * -95}deg`, opacity: Math.min(1, p * 2), transformOrigin: "0% 50%" }}>
              <EdgeGlow radius={36} width={2} intensity={0.75} phase={i * 120} />
              <div style={{ position: "absolute", left: 90, top: 50, width: 120, height: 120, borderRadius: 60, background: C.tealDeep, display: "flex", alignItems: "center", justifyContent: "center", scale: `${k(f, 20 + i * 4, 32 + i * 4, 0.4, 1, EO)}` }}>
                <Icon size={60} color="#fff" stroke={1.9} draw={draw} />
              </div>
              <div style={{ position: "absolute", left: 0, right: 0, top: 200, textAlign: "center", fontFamily: UI, fontWeight: 700, fontSize: 30, lineHeight: 1.22, color: C.ink }}>
                {label[0]}
                <br />
                {label[1]}
              </div>
            </div>
          </div>
        );
      })}

      {/* hero box */}
      <Img
        src={staticFile("img/box-cut.png")}
        style={{
          position: "absolute",
          left: 540 - 330,
          top: 1030,
          width: 660,
          translate: `0 ${k(f, 20, 40, 120, 0, EO) + Math.sin(f * 0.1) * 6}px`,
          opacity: k(f, 20, 34, 0, 1),
          filter: "drop-shadow(0 34px 40px rgba(6,47,51,0.25))",
        }}
      />

      <CTAButton x={190} y={1546} w={700} h={150} label="SHOP NOW" start={30} tap={tap} />
      <TouchDot x={kk(f, [38, 50], [960, 640], EIO)} y={kk(f, [38, 50], [1860, 1628], EIO)} opacity={kk(f, [38, 42, 60, 64], [0, 1, 1, 0], EO)} press={kk(f, [tap - 2, tap, tap + 4, tap + 8], [0, 1, 1, 0])} ripple={k(f, tap, tap + 14, 0, 1, EO) || (f < tap ? -1 : 1.1)} />

      <AbsoluteFill style={{ background: "#fff", opacity: k(f, 63, 69, 0, 1, EI) }} />
    </AbsoluteFill>
  );
};
