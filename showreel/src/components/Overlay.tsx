import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, CHAPTERS, chapterStarts, FPS, hexA, MONO, rng } from "../theme";

/** HUD from the reference reel: corner brackets, title, chapter count, label, timecode. */
export const Hud: React.FC = () => {
  const frame = useCurrentFrame();
  let ch = 0;
  chapterStarts.forEach((s, i) => {
    if (frame >= s) ch = i;
  });
  // the Form chapter sits on a light ground, so the HUD switches to ink there
  const light = CHAPTERS[ch].id === "Form" && frame < chapterStarts[ch] + 52;
  const col = light ? hexA(C.ink, 0.75) : hexA(C.white, 0.72);
  const fadeOut = frame > 440 ? 0 : 1;
  const ss = Math.floor(frame / FPS);
  const ff = frame % FPS;
  const m = 44;
  const L = 26;
  const text: React.CSSProperties = {
    position: "absolute",
    fontFamily: MONO,
    fontWeight: 500,
    fontSize: 16,
    letterSpacing: 3,
    color: col,
    lineHeight: 1,
  };
  const corner = (pos: React.CSSProperties): React.CSSProperties => ({
    position: "absolute",
    width: L,
    height: L,
    ...pos,
    borderColor: col,
    borderStyle: "solid",
    borderWidth: 0,
  });
  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      <div style={{ ...corner({ left: m, top: m }), borderTopWidth: 2, borderLeftWidth: 2 }} />
      <div style={{ ...corner({ right: m, top: m }), borderTopWidth: 2, borderRightWidth: 2 }} />
      <div style={{ ...corner({ left: m, bottom: m }), borderBottomWidth: 2, borderLeftWidth: 2 }} />
      <div style={{ ...corner({ right: m, bottom: m }), borderBottomWidth: 2, borderRightWidth: 2 }} />
      <div style={{ ...text, left: m + 40, top: m + 4 }}>VIGNESH / SHOWREEL 2026</div>
      <div style={{ ...text, right: m + 40, top: m + 4 }}>
        {String(ch + 1).padStart(2, "0")} / {String(CHAPTERS.length).padStart(2, "0")}
      </div>
      <div style={{ ...text, left: m + 40, bottom: m + 4 }}>{CHAPTERS[ch].label}</div>
      <div style={{ ...text, right: m + 40, bottom: m + 4 }}>
        00:00:{String(ss).padStart(2, "0")}:{String(ff).padStart(2, "0")}
      </div>
    </AbsoluteFill>
  );
};

/** Film grain + vignette, re-seeded every frame so it never animates on its own. */
export const Finish: React.FC = () => {
  const frame = useCurrentFrame();
  const r = rng(frame * 97 + 3);
  const ox = Math.floor(r() * 200);
  const oy = Math.floor(r() * 200);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill
        style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 45%, rgba(0,0,0,0.38) 100%)" }}
      />
      <AbsoluteFill
        style={{
          opacity: 0.07,
          mixBlendMode: "overlay",
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundPosition: `${ox}px ${oy}px`,
        }}
      />
    </AbsoluteFill>
  );
};

/** One line of copy per chapter, bottom-left, with a masked rise in and out. */
export const Caption: React.FC<{ t: number; text: string; from: number; to: number; color?: string }> = ({
  t,
  text,
  from,
  to,
  color = C.white,
}) => {
  if (t < from || t > to) return null;
  const pin = Math.min(1, 1 - Math.pow(2, -10 * Math.min(1, (t - from) / 0.5)));
  const pout = Math.pow(Math.max(0, Math.min(1, (t - (to - 0.25)) / 0.25)), 3);
  return (
    <div style={{ position: "absolute", left: 124, bottom: 128, height: 96, overflow: "hidden", width: 1600 }}>
      <div
        style={{
          fontFamily: '"Urbanist", sans-serif',
          fontWeight: 600,
          fontSize: 68,
          letterSpacing: -1.5,
          color,
          transform: `translateY(${(1 - pin) * 96 - pout * 96}px)`,
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </div>
    </div>
  );
};
