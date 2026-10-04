import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { LogoDisc, Orb } from "../components/Orb";
import { C, clamp, DISPLAY, ease, FPS, hexA, HEIGHT, MONO, prog, rng, WIDTH } from "../theme";

// 07 SIGNATURE — the planet pulses inside its ring, bursts into brand-coloured
// shards, and the wordmark assembles: logo disc, VIGNESH, planet as full stop.
export const BURST = 0.65; // seconds into the chapter
const SUBTITLE = "PRODUCT DESIGNER  —  SHOWREEL 2026";

export const Signature: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const shards = useMemo(() => {
    const r = rng(41);
    return Array.from({ length: 160 }, () => ({
      a: r() * Math.PI * 2,
      v: 500 + r() * 1300,
      w: 8 + r() * 48,
      h: 6 + r() * 18,
      rot: r() * 180,
      spin: (r() - 0.5) * 520,
      color: [C.purple, C.white, C.lilac, C.cyan, C.deep][Math.floor(r() * 5)],
    }));
  }, []);

  const pre = t < BURST;
  const pulse = 1 + Math.sin(t * 18) * 0.06 * prog(t, 0.2, 0.6);
  const ringR = 70 * ease.outBack(prog(t, 0, 0.3)) * (1 - ease.inExpo(prog(t, 0.4, BURST)) * 0.6);
  const bt = t - BURST;
  const wt = t - 0.7;
  const zoom = 1 + Math.max(0, wt) * 0.012;
  const letters = [..."VIGNESH"];
  const chars = Math.floor(SUBTITLE.length * prog(wt, 0.85, 1.6));
  const fade = prog(t, 3.15, 3.4);

  return (
    <AbsoluteFill style={{ background: C.ink }}>
      {pre && (
        <>
          <div
            style={{
              position: "absolute",
              left: WIDTH / 2 - ringR,
              top: HEIGHT / 2 - ringR,
              width: ringR * 2,
              height: ringR * 2,
              borderRadius: "50%",
              border: `2px solid ${hexA(C.white, 0.7)}`,
            }}
          />
          <Orb x={WIDTH / 2} y={HEIGHT / 2} r={30 * pulse * (1 - ease.inExpo(prog(t, 0.45, BURST)) * 0.5)} glow={1} />
        </>
      )}

      {bt >= 0 && bt < 1.4 &&
        shards.map((s, i) => {
          const d = ((s.v * (1 - Math.exp(-bt * 3.2))) / 3.2) * 2.4;
          const x = WIDTH / 2 + Math.cos(s.a) * d;
          const y = HEIGHT / 2 + Math.sin(s.a) * d + bt * bt * 120;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x - s.w / 2,
                top: y - s.h / 2,
                width: s.w,
                height: s.h,
                borderRadius: 3,
                background: s.color,
                opacity: clamp(1 - bt / 1.3),
                transform: `rotate(${s.rot + s.spin * bt}deg)`,
              }}
            />
          );
        })}
      {bt >= 0 && bt < 0.12 && <AbsoluteFill style={{ background: hexA(C.lilac, 0.25 * (1 - bt / 0.12)) }} />}

      {wt >= 0 && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", transform: `scale(${zoom})` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 44, marginTop: -60 }}>
            <LogoDisc
              size={150}
              style={{
                transform: `rotate(${(1 - ease.outBack(prog(wt, 0, 0.5))) * -90}deg) scale(${ease.outBack(prog(wt, 0, 0.5))})`,
              }}
            />
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <div style={{ display: "flex", overflow: "hidden", height: 200, alignItems: "flex-end" }}>
                {letters.map((l, i) => {
                  const p = ease.outExpo(prog(wt, 0.12 + i * 0.045, 0.72 + i * 0.045));
                  return (
                    <span
                      key={i}
                      style={{
                        fontFamily: DISPLAY,
                        fontWeight: 800,
                        fontSize: 210,
                        lineHeight: 0.9,
                        letterSpacing: -8,
                        color: C.white,
                        display: "inline-block",
                        transform: `translateY(${(1 - p) * 230}px)`,
                      }}
                    >
                      {l}
                    </span>
                  );
                })}
              </div>
              <div style={{ position: "relative", width: 72, height: 60 }}>
                <Orb x={36} y={36} r={24 * ease.outBack(prog(wt, 0.55, 0.85))} glow={0.6} />
              </div>
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              top: HEIGHT / 2 + 120,
              width: "100%",
              textAlign: "center",
              fontFamily: MONO,
              fontWeight: 500,
              fontSize: 26,
              letterSpacing: 6,
              color: hexA(C.white, 0.85),
              whiteSpace: "pre",
            }}
          >
            {SUBTITLE.slice(0, chars)}
          </div>
          <div
            style={{
              position: "absolute",
              top: HEIGHT / 2 + 172,
              left: WIDTH / 2 - (520 * ease.outExpo(prog(wt, 1.1, 1.8))) / 2,
              width: 520 * ease.outExpo(prog(wt, 1.1, 1.8)),
              height: 4,
              background: C.purple,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: HEIGHT / 2 + 210,
              width: "100%",
              textAlign: "center",
              fontFamily: DISPLAY,
              fontWeight: 600,
              fontSize: 32,
              letterSpacing: 1,
              color: hexA(C.lilac, prog(wt, 1.7, 2.2)),
            }}
          >
            vigneshmurali.com
          </div>
        </AbsoluteFill>
      )}
      {fade > 0 && <AbsoluteFill style={{ background: hexA(C.ink, fade) }} />}
    </AbsoluteFill>
  );
};
