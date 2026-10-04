import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EdgeGlow } from "../components/EdgeGlow";
import { RiseText, TypeText } from "../components/Kinetic";
import { BACK, EIO, EO, k } from "../lib/anim";
import { DISPLAY, MONO, UI } from "../lib/fonts";
import { C } from "../lib/theme";

// October 2026 starts on a Thursday (Sunday-first index 4) → exactly five rows.
const FIRST = 4;
const CARD = { x: 110, y: 760, w: 860, h: 960, r: 48 };
const GRID = { x: CARD.x + 40, y: CARD.y + 200, cw: (CARD.w - 80) / 7, ch: 140 };
const cell = (d: number) => {
  const i = FIRST + d - 1;
  return { col: i % 7, row: Math.floor(i / 7) };
};
const c31 = cell(31);
export const DAY31 = { x: GRID.x + (c31.col + 0.5) * GRID.cw, y: GRID.y + (c31.row + 0.5) * GRID.ch };

const Odometer: React.FC<{ digit: number; turns: number; start: number; dur: number; h: number }> = ({ digit, turns, start, dur, h }) => {
  const f = useCurrentFrame();
  const steps = turns * 10 + digit;
  const p = k(f, start, start + dur, 0, steps, EIO);
  return (
    <span style={{ display: "inline-block", height: h, overflow: "hidden", verticalAlign: "top" }}>
      <span style={{ display: "block", translate: `0 ${-p * h}px` }}>
        {Array.from({ length: steps + 1 }).map((_, i) => (
          <span key={i} style={{ display: "block", height: h, lineHeight: `${h}px` }}>
            {i % 10}
          </span>
        ))}
      </span>
    </span>
  );
};

/** 05 · Silk. 20% credit back on every order, all of October: the calendar fills day by day to the 31st. */
export const S5Credit: React.FC = () => {
  const f = useCurrentFrame();
  const blurIn = k(f, 0, 12, 1, 0, EO);
  const cardIn = k(f, 6, 26, 0, 1, EO);
  const ring = k(f, 66, 80, 0, 1, EIO);

  return (
    <AbsoluteFill style={{ filter: `blur(${blurIn * 28}px)`, opacity: 1 - blurIn * 0.9, scale: `${1 + blurIn * 0.05}` }}>
      <div style={{ position: "absolute", left: 80, top: 236, fontFamily: MONO, fontSize: 24, letterSpacing: "0.22em", color: C.tealLight }}>
        <TypeText text="04 — GRAND REOPENING OFFER" start={4} cps={50} />
      </div>
      {/* 20% */}
      <div style={{ position: "absolute", left: 66, top: 278, fontFamily: DISPLAY, fontWeight: 900, fontSize: 250, lineHeight: "250px", letterSpacing: "-0.05em", color: "#fff", textShadow: "0 0 60px rgba(47,211,218,0.45)", display: "flex" }}>
        <Odometer digit={2} turns={1} start={6} dur={22} h={250} />
        <Odometer digit={0} turns={2} start={6} dur={26} h={250} />
        <span style={{ color: C.tealBright, display: "inline-block", scale: `${k(f, 26, 36, 0, 1, BACK)}`, transformOrigin: "20% 80%" }}>%</span>
      </div>
      <div style={{ position: "absolute", left: 80, top: 548, fontFamily: DISPLAY, fontWeight: 700, fontSize: 66, letterSpacing: "-0.01em", color: C.tealBright }}>
        <RiseText text="Credit back" start={18} stagger={1} />
      </div>
      <div style={{ position: "absolute", left: 82, top: 652, fontFamily: MONO, fontSize: 26, letterSpacing: "0.16em", color: "#fff" }}>
        <TypeText text="ON ALL ORDERS · TILL OCT 31" start={30} cps={44} />
      </div>

      {/* calendar */}
      <div style={{ position: "absolute", left: CARD.x, top: CARD.y, width: CARD.w, height: CARD.h, borderRadius: CARD.r, background: "linear-gradient(160deg, rgba(10,60,66,0.82), rgba(2,22,24,0.88))", boxShadow: "0 50px 100px rgba(0,0,0,0.45)", translate: `0 ${(1 - cardIn) * 260}px`, rotate: `x ${(1 - cardIn) * 30}deg`, opacity: cardIn, transformOrigin: "50% 0%" }}>
        <EdgeGlow radius={CARD.r} width={2.5} intensity={0.9} />
        <div style={{ position: "absolute", left: 44, top: 46, fontFamily: DISPLAY, fontWeight: 700, fontSize: 54, color: "#fff", letterSpacing: "-0.02em" }}>October</div>
        <div style={{ position: "absolute", right: 48, top: 60, fontFamily: MONO, fontSize: 30, letterSpacing: "0.14em", color: C.tealLight }}>2026</div>
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} style={{ position: "absolute", left: 40 + i * GRID.cw, top: 146, width: GRID.cw, textAlign: "center", fontFamily: MONO, fontSize: 22, letterSpacing: "0.1em", color: "rgba(255,255,255,0.5)" }}>
            {d}
          </div>
        ))}
      </div>
      {Array.from({ length: 31 }).map((_, i) => {
        const d = i + 1;
        const { col, row } = cell(d);
        const pop = k(f, 12 + (row + col) * 1.2, 24 + (row + col) * 1.2, 0, 1, BACK);
        const fill = k(f, 36 + i * 0.95, 42 + i * 0.95, 0, 1, EO);
        const last = d === 31;
        const big = last ? k(f, 64, 74, 0, 1, BACK) : 0;
        return (
          <div
            key={d}
            style={{
              position: "absolute",
              left: GRID.x + col * GRID.cw + 6,
              top: GRID.y + row * GRID.ch + 8,
              width: GRID.cw - 12,
              height: GRID.ch - 16,
              borderRadius: 26,
              background: last && big > 0 ? `rgba(47,211,218,${0.35 + big * 0.65})` : `rgba(5,160,168,${fill * 0.38})`,
              border: `2px solid rgba(127,221,225,${0.12 + fill * 0.4})`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              scale: `${pop * (1 + big * 0.12)}`,
              opacity: Math.min(1, pop),
              boxShadow: last ? `0 0 ${40 * big}px rgba(47,211,218,0.8)` : undefined,
            }}
          >
            <span style={{ fontFamily: UI, fontWeight: 700, fontSize: 38, color: last && big > 0.5 ? C.ink : "#fff" }}>{d}</span>
            <span style={{ fontFamily: MONO, fontWeight: 600, fontSize: 14, letterSpacing: "0.04em", color: last && big > 0.5 ? C.ink : C.tealLight, opacity: fill }}>+20%</span>
          </div>
        );
      })}
      {/* ring around the 31st + tag */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <circle cx={DAY31.x} cy={DAY31.y} r={84} fill="none" stroke="#fff" strokeWidth={5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ring} transform={`rotate(-90 ${DAY31.x} ${DAY31.y})`} />
      </svg>
      <div style={{ position: "absolute", left: DAY31.x - 196, top: 1742, width: 230, height: 50, borderRadius: 25, background: "#fff", color: C.ink, fontFamily: MONO, fontWeight: 700, fontSize: 20, letterSpacing: "0.14em", display: "flex", alignItems: "center", justifyContent: "center", scale: `${k(f, 72, 82, 0, 1, BACK)}`, transformOrigin: "80% 0%" }}>
        LAST DAY · 31
      </div>
    </AbsoluteFill>
  );
};
