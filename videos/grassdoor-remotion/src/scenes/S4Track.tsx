import { getLength, getPointAtLength } from "@remotion/paths";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { EdgeGlow } from "../components/EdgeGlow";
import { CheckIcon, HomeIcon, TruckIcon } from "../components/Icons";
import { RiseText, TypeText } from "../components/Kinetic";
import { BACK, EI, EIO, EO, k, kk } from "../lib/anim";
import { DISPLAY, MONO, UI } from "../lib/fonts";
import { C } from "../lib/theme";
import { UNBOX_DOT } from "./S3Unbox";

const ROUTE =
  "M540 1300 L540 1160 Q540 1110 590 1110 L750 1110 Q800 1110 800 1060 L800 870 Q800 820 750 820 L430 820 Q380 820 380 770 L380 690";
const RLEN = getLength(ROUTE);
const HOME = { x: 380, y: 690 };
const VERT = [120, 250, 380, 540, 670, 800, 960];
const HORZ = [600, 690, 820, 960, 1110, 1250, 1400];
const MAJOR_V = new Set([540, 800, 380]);
const MAJOR_H = new Set([820, 1110]);

/** 04 · White. The box-dot is now the driver: the route draws live to the door, rings pulse, status ticks to Delivered. */
export const S4Track: React.FC = () => {
  const f = useCurrentFrame();
  const iris = k(f, 0, 10, 0, 2300, EI);
  const tilt = k(f, 4, 26, 0, 1, EIO);
  const prog = k(f, 10, 64, 0, 1, EIO);
  const delivered = f >= 64;
  const car = getPointAtLength(ROUTE, Math.max(0.01, prog * RLEN)) ?? { x: 540, y: 1300 };
  const cardIn = k(f, 10, 28, 0, 1, EO);
  const blurOff = k(f, 80, 90, 0, 1, EI);
  const steps = ["Placed", "Packed", "On the way", "Delivered"];
  const stepFill = 0.5 + 0.5 * prog;

  return (
    <AbsoluteFill
      style={{
        clipPath: `circle(${iris}px at ${UNBOX_DOT.x}px ${UNBOX_DOT.y}px)`,
        background: C.white,
        filter: `blur(${blurOff * 26}px) brightness(${1 + blurOff * 0.35})`,
        opacity: 1 - k(f, 84, 90, 0, 1, EI),
        scale: `${1 + blurOff * 0.06}`,
      }}
    >
      {/* map, tilted like a navigation view */}
      <AbsoluteFill style={{ perspective: 1700, perspectiveOrigin: "50% 1300px" }}>
        <AbsoluteFill
          style={{
            rotate: `x ${tilt * 24}deg`,
            transformOrigin: "50% 1300px",
            WebkitMaskImage: "linear-gradient(180deg, rgba(0,0,0,0) 520px, #000 700px, #000 1420px, rgba(0,0,0,0) 1520px)",
            maskImage: "linear-gradient(180deg, rgba(0,0,0,0) 520px, #000 700px, #000 1420px, rgba(0,0,0,0) 1520px)",
          }}
        >
          <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
            <rect x={0} y={0} width={1080} height={1920} fill="#F4FAFA" />
            <rect x={560} y={1130} width={220} height={110} rx={18} fill="#DDF2EC" />
            <rect x={140} y={980} width={220} height={250} rx={18} fill="#DDF2EC" />
            <rect x={690} y={600} width={250} height={200} rx={18} fill="#E3F3F6" />
            {VERT.map((x) => (
              <line key={`v${x}`} x1={x} y1={480} x2={x} y2={1560} stroke={MAJOR_V.has(x) ? "#E1EFEF" : "#EAF4F4"} strokeWidth={MAJOR_V.has(x) ? 34 : 16} strokeLinecap="round" />
            ))}
            {HORZ.map((y) => (
              <line key={`h${y}`} x1={-20} y1={y} x2={1100} y2={y} stroke={MAJOR_H.has(y) ? "#E1EFEF" : "#EAF4F4"} strokeWidth={MAJOR_H.has(y) ? 34 : 16} strokeLinecap="round" />
            ))}
            {/* remaining route (dashed) and travelled route (solid teal) */}
            <path d={ROUTE} fill="none" stroke="#B9DCDD" strokeWidth={8} strokeDasharray="2 18" strokeLinecap="round" opacity={k(f, 6, 14, 0, 1)} />
            <path d={ROUTE} fill="none" stroke={C.teal} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={RLEN} strokeDashoffset={RLEN * (1 - prog)} />
            {/* destination rings */}
            {[0, 1, 2].map((r) => {
              const pulse = delivered ? k(f, 64, 84, 0, 1, EO) : 0;
              const R = [62, 104, 150][r] * (1 + pulse * (0.4 + r * 0.3));
              const rot = (r % 2 ? -1 : 1) * f * (2 + r);
              return (
                <circle
                  key={r}
                  cx={HOME.x}
                  cy={HOME.y}
                  r={R}
                  fill="none"
                  stroke={r === 1 ? C.ink : C.teal}
                  strokeWidth={r === 0 ? 5 : 3}
                  strokeDasharray={r === 0 ? "18 10" : r === 1 ? "4 14" : "40 18"}
                  transform={`rotate(${rot} ${HOME.x} ${HOME.y})`}
                  opacity={k(f, 8 + r * 3, 20 + r * 3, 0, 0.9) * (1 - pulse * 0.9)}
                />
              );
            })}
          </svg>
          {/* store marker */}
          <div style={{ position: "absolute", left: 540 - 44, top: 1300 - 44 + 96, width: 88, height: 88, borderRadius: 24, background: "#fff", boxShadow: "0 12px 30px rgba(6,47,51,0.18)", display: "flex", alignItems: "center", justifyContent: "center", opacity: k(f, 8, 16, 0, 1), scale: `${k(f, 8, 18, 0.5, 1, BACK)}` }}>
            <Img src={staticFile("img/logo-icon-teal.png")} style={{ height: 58 }} />
          </div>
          {/* home pin */}
          <div style={{ position: "absolute", left: HOME.x - 46, top: HOME.y - 46, width: 92, height: 92, borderRadius: 46, background: delivered ? C.teal : C.ink, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 14px 34px rgba(6,47,51,0.3)", scale: `${k(f, 10, 22, 0, 1, BACK) * (delivered ? kk(f, [64, 68, 76], [1, 1.25, 1]) : 1)}` }}>
            {delivered ? <CheckIcon size={50} color="#fff" stroke={3} draw={k(f, 64, 74, 0, 1)} /> : <HomeIcon size={48} color="#fff" stroke={2.4} />}
          </div>
          {/* driver = motif dot with a glow */}
          <div style={{ position: "absolute", left: car.x - 30, top: car.y - 30, width: 60, height: 60, borderRadius: 30, background: C.teal, border: "9px solid #fff", boxShadow: "0 0 0 10px rgba(5,160,168,0.22), 0 10px 26px rgba(6,47,51,0.35)", opacity: delivered ? k(f, 64, 70, 1, 0) : 1 }} />
        </AbsoluteFill>
      </AbsoluteFill>

      {/* headline: Track it live → Delivered on time */}
      <div style={{ position: "absolute", left: 80, top: 236, fontFamily: MONO, fontSize: 24, letterSpacing: "0.22em", color: C.teal }}>
        <TypeText text="03 — REAL-TIME TRACKING" start={6} cps={50} />
      </div>
      <div style={{ position: "absolute", left: 76, top: 286, fontFamily: DISPLAY, fontWeight: 800, fontSize: 86, lineHeight: 1.06, letterSpacing: "-0.035em", color: C.ink }}>
        {f < 62 ? (
          <>
            <RiseText text="Track it" start={8} stagger={1.1} exit={52} />
            <br />
            <RiseText text="live." start={13} stagger={1.1} exit={54} style={{ color: C.teal }} />
          </>
        ) : (
          <>
            <RiseText text="Delivered" start={62} stagger={1} />
            <br />
            <RiseText text="on time." start={67} stagger={1} style={{ color: C.teal }} />
          </>
        )}
      </div>

      {/* tracking card */}
      <div style={{ position: "absolute", left: 60, top: 1500, width: 960, height: 290, borderRadius: 44, background: "#fff", boxShadow: "0 30px 70px rgba(6,47,51,0.16)", translate: `0 ${(1 - cardIn) * 340}px`, opacity: cardIn }}>
        <EdgeGlow radius={44} width={2.5} intensity={0.85} />
        <div style={{ position: "absolute", left: 40, top: 38, width: 96, height: 96, borderRadius: 48, background: C.tealDeep, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <TruckIcon size={52} color="#fff" stroke={2} />
        </div>
        <div style={{ position: "absolute", left: 164, top: 40, fontFamily: UI, fontWeight: 800, fontSize: 36, color: C.ink }}>{delivered ? "Delivered on time" : "Your order is on the way"}</div>
        <div style={{ position: "absolute", left: 164, top: 92, fontFamily: UI, fontWeight: 500, fontSize: 25, color: C.inkSoft }}>{delivered ? "Enjoy — your order is at the door" : "Live driver location · updates in real time"}</div>
        <div style={{ position: "absolute", right: 40, top: 44, height: 40, padding: "0 16px", borderRadius: 20, background: "#E5F6F6", display: "flex", alignItems: "center", gap: 10, fontFamily: MONO, fontWeight: 700, fontSize: 19, letterSpacing: "0.14em", color: C.teal }}>
          <span style={{ width: 12, height: 12, borderRadius: 6, background: C.teal, opacity: Math.floor(f / 8) % 2 ? 0.25 : 1 }} />
          LIVE
        </div>
        {/* progress */}
        <div style={{ position: "absolute", left: 60, right: 60, top: 186, height: 8, borderRadius: 4, background: "#E3EFEF" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${stepFill * 100}%`, borderRadius: 4, background: `linear-gradient(90deg, ${C.teal}, ${C.tealBright})` }} />
          {steps.map((s, i) => {
            const at = i / 3;
            const done = stepFill >= at - 0.001;
            return (
              <div key={s} style={{ position: "absolute", left: `${at * 100}%`, top: -13, width: 34, height: 34, marginLeft: -17, borderRadius: 17, background: done ? C.teal : "#fff", border: `4px solid ${done ? C.teal : "#CFE3E3"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {done ? <CheckIcon size={18} color="#fff" stroke={3.5} /> : null}
              </div>
            );
          })}
        </div>
        {steps.map((s, i) => (
          <div key={s} style={{ position: "absolute", top: 222, left: 60 + (840 * i) / 3, width: 200, marginLeft: i === 0 ? 0 : i === 3 ? -200 : -100, textAlign: i === 0 ? "left" : i === 3 ? "right" : "center", fontFamily: MONO, fontSize: 18, letterSpacing: "0.08em", color: stepFill >= i / 3 - 0.001 ? C.ink : "#9BB0B1" }}>
            {s.toUpperCase()}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
