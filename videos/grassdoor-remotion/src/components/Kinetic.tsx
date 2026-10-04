import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { EO, EI, k } from "../lib/anim";

type Base = { text: string; start: number; style?: React.CSSProperties; className?: string };

/** Per-glyph rise from behind a mask (optionally a 3D flip). Words never break mid-word. */
export const RiseText: React.FC<Base & { stagger?: number; dur?: number; flip?: boolean; exit?: number; exitStagger?: number; from?: "start" | "end" | "center" }> = ({
  text,
  start,
  style,
  stagger = 1.2,
  dur = 18,
  flip = false,
  exit,
  exitStagger = 0.6,
  from = "start",
}) => {
  const frame = useCurrentFrame();
  const chars = Array.from(text);
  const n = chars.length;
  const order = (i: number) => (from === "end" ? n - 1 - i : from === "center" ? Math.abs(i - (n - 1) / 2) : i);
  let idx = -1;
  const words = text.split(" ");
  return (
    <span style={{ display: "inline-block", perspective: flip ? 900 : undefined, ...style }}>
      {words.map((w, wi) => (
        <React.Fragment key={wi}>
          <span style={{ display: "inline-block", whiteSpace: "nowrap" }}>
            {Array.from(w).map((ch) => {
              idx++;
              const t0 = start + order(idx) * stagger;
              const pin = k(frame, t0, t0 + dur, 0, 1, EO);
              const pout = exit === undefined ? 0 : k(frame, exit + order(idx) * exitStagger, exit + order(idx) * exitStagger + 12, 0, 1, EI);
              const y = (1 - pin) * 112 - pout * 112;
              return (
                <span key={idx} style={{ display: "inline-block", overflow: flip ? "visible" : "hidden", padding: "0.06em 0.015em 0.08em", margin: "-0.06em -0.015em -0.08em", verticalAlign: "top" }}>
                  <span
                    style={{
                      display: "inline-block",
                      translate: `0 ${y}%`,
                      rotate: flip ? `x ${(1 - pin) * -85}deg` : undefined,
                      opacity: flip ? pin * (1 - pout) : 1,
                      transformOrigin: "50% 100%",
                    }}
                  >
                    {ch}
                  </span>
                </span>
              );
            })}
          </span>
          {wi < words.length - 1 ? " " : null}
        </React.Fragment>
      ))}
    </span>
  );
};

/** Horizontal slice-lock: top and bottom halves slide in from opposite sides and lock together. */
export const SliceText: React.FC<Base & { dist?: number; dur?: number }> = ({ text, start, style, dist = 160, dur = 22 }) => {
  const frame = useCurrentFrame();
  const p = k(frame, start + 2, start + 2 + dur, 0, 1, EO);
  const line = k(frame, start, start + 9, 0, 1, EO);
  const lineFade = k(frame, start + 9, start + 18, 1, 0, EO);
  return (
    <span style={{ position: "relative", display: "inline-block", ...style }}>
      <span style={{ display: "inline-block", clipPath: "inset(-20% -5% 49.5% -5%)", translate: `${-(1 - p) * dist}px 0`, opacity: Math.min(1, p * 3) }}>{text}</span>
      <span style={{ position: "absolute", left: 0, top: 0, display: "inline-block", clipPath: "inset(50% -5% -20% -5%)", translate: `${(1 - p) * dist}px 0`, opacity: Math.min(1, p * 3) }}>
        {text}
      </span>
      <span style={{ position: "absolute", left: "-4%", width: "108%", top: "50%", height: 5, marginTop: -2, background: "currentColor", scale: `${line} 1`, opacity: lineFade, boxShadow: "0 0 18px rgba(47,211,218,0.9)" }} />
    </span>
  );
};

/** Typewriter with a block cursor. An invisible copy reserves the final width so centred lines don't drift. */
export const TypeText: React.FC<Base & { cps?: number; cursor?: boolean; cursorColor?: string; holdCursor?: number }> = ({
  text,
  start,
  style,
  cps = 28,
  cursor = true,
  cursorColor = "currentColor",
  holdCursor = 999,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = Math.max(0, Math.min(text.length, Math.floor(((frame - start) * cps) / fps)));
  const typing = frame >= start && n < text.length;
  const blinkOn = typing || Math.floor((frame - start) / 8) % 2 === 0;
  const showCursor = cursor && frame >= start && frame < start + (text.length / cps) * fps + holdCursor && blinkOn;
  return (
    <span style={{ position: "relative", display: "inline-block", whiteSpace: "pre", ...style }}>
      <span style={{ visibility: "hidden" }}>{text}</span>
      <span style={{ position: "absolute", left: 0, top: 0, whiteSpace: "pre" }}>
        {text.slice(0, n)}
        <span style={{ display: "inline-block", width: "0.5em", height: "0.95em", marginLeft: "0.06em", verticalAlign: "-0.1em", background: cursorColor, opacity: showCursor ? 1 : 0 }} />
      </span>
    </span>
  );
};

/** Line animation: a rule draws, then the copy rises out of it. */
export const LineReveal: React.FC<Base & { lineColor?: string; width?: number; dur?: number }> = ({ text, start, style, lineColor = "currentColor", width, dur = 16 }) => {
  const frame = useCurrentFrame();
  const l = k(frame, start, start + 12, 0, 1, EO);
  const t = k(frame, start + 6, start + 6 + dur, 0, 1, EO);
  return (
    <div style={{ position: "relative", display: "inline-block", paddingBottom: 14, ...style }}>
      <div style={{ overflow: "hidden", padding: "0.06em 0 0.04em" }}>
        <div style={{ translate: `0 ${(1 - t) * 105}%` }}>{text}</div>
      </div>
      <div style={{ position: "absolute", left: 0, bottom: 0, height: 3, width: width ?? "100%", background: lineColor, scale: `${l} 1`, transformOrigin: "0 50%", borderRadius: 2 }} />
    </div>
  );
};
