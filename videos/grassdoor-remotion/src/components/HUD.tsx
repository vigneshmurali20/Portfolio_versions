import { useCurrentFrame, useVideoConfig } from "remotion";
import { MONO } from "../lib/fonts";
import { C, SCENES } from "../lib/theme";
import { k, EO } from "../lib/anim";

const pad = (n: number) => String(n).padStart(2, "0");

/** Showreel HUD: corner brackets, index, scene label and running timecode. Colour follows the background. */
export const HUD: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  let idx = 0;
  SCENES.forEach((s, i) => {
    if (frame >= s.from + 5) idx = i;
  });
  const scene = SCENES[idx];
  const onWhite = scene.bg === "white";
  const col = onWhite ? C.ink : "#FFFFFF";
  const dim = onWhite ? "rgba(6,47,51,0.55)" : "rgba(255,255,255,0.6)";
  const intro = k(frame, 4, 20, 0, 1, EO);
  const local = frame - (scene.from + 5);
  const roll = k(local, 0, 10, 1, 0, EO);
  const tc = `00:00:${pad(Math.floor(frame / fps))}:${pad(frame % fps)}`;
  const base: React.CSSProperties = { position: "absolute", fontFamily: MONO, fontSize: 21, letterSpacing: "0.14em", color: col, opacity: intro, fontWeight: 500 };
  const B = 30;
  const bracket = (s: React.CSSProperties) => <div style={{ position: "absolute", width: B, height: B, borderColor: dim, borderStyle: "solid", borderWidth: 0, opacity: intro, ...s }} />;
  return (
    <>
      {bracket({ left: 36, top: 36, borderLeftWidth: 2, borderTopWidth: 2 })}
      {bracket({ right: 36, top: 36, borderRightWidth: 2, borderTopWidth: 2 })}
      {bracket({ left: 36, bottom: 36, borderLeftWidth: 2, borderBottomWidth: 2 })}
      {bracket({ right: 36, bottom: 36, borderRightWidth: 2, borderBottomWidth: 2 })}
      <div style={{ ...base, left: 84, top: 50 }}>GRASSDOOR / 2026</div>
      <div style={{ ...base, right: 84, top: 50, color: dim }}>
        <span style={{ color: col }}>{pad(idx + 1)}</span> / {pad(SCENES.length)}
      </div>
      <div style={{ ...base, left: 84, bottom: 50, overflow: "hidden", height: 26 }}>
        <div style={{ translate: `0 ${roll * 100}%` }}>{scene.label}</div>
      </div>
      <div style={{ ...base, right: 84, bottom: 50, color: dim, fontVariantNumeric: "tabular-nums" }}>{tc}</div>
    </>
  );
};
