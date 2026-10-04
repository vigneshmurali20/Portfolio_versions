import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { TypeText } from "../components/Kinetic";
import { EI, EIO, EO, k, kk } from "../lib/anim";
import { MONO } from "../lib/fonts";
import { ICON_H, ICON_PATH, ICON_W, KNOB, LETTERS, WORD_H, WORD_Y } from "../lib/iconPath";
import { ICON_CENTRED_DX, ICON_LEFT, KNOB_X, KNOB_Y, LOGO_LEFT, LOGO_S, LOGO_TOP } from "../lib/logo";
import { C } from "../lib/theme";

/**
 * 01 · The knob dot drops in (squash & stretch), traces the door silhouette, a light sweep fills the
 * door through its own alpha (no rectangle ever shows), then the door slides into the lockup and the
 * wordmark spills out of it letter by letter.
 */
export const S1Logo: React.FC = () => {
  const f = useCurrentFrame();
  const s = LOGO_S;
  const iw = ICON_W * s;
  const ih = ICON_H * s;

  // door slides from centre into the lockup
  const dx = k(f, 40, 56, ICON_CENTRED_DX, 0, EIO);
  // exit: push into the knob as scene 2 irises open from it
  const push = k(f, 58, 70, 1, 1.35, EI);
  const pushBlur = k(f, 60, 70, 0, 10, EI);

  // knob dot: fall → squash → rebound → settle
  const fallY = kk(f, [0, 12], [-700, 0], EI);
  const bounce = f < 12 ? fallY : f < 16 ? 0 : -kk(f, [16, 20, 24], [0, 46, 0], EIO);
  const stretch = f < 12 ? k(f, 4, 12, 1, 1.5, EI) : 1;
  const squash = kk(f, [11, 13, 16, 18, 24, 25, 28], [0, 1, 0.2, 0, 0, 0.45, 0], EIO);
  const dotSX = (1 / Math.sqrt(stretch)) * (1 + squash * 0.5);
  const dotSY = stretch * (1 - squash * 0.42);
  const dotR = KNOB.r * s * 1.25;
  const dotFade = k(f, 38, 44, 1, 0, EO);
  const ground = k(f, 12, 26, 0, 1, EO);

  // outline + fill
  const draw = k(f, 18, 38, 0, 1, EIO);
  const outlineOpacity = k(f, 40, 48, 1, 0, EO);
  const sweep = k(f, 30, 44, -30, 130, EIO); // gradient stop (%) sweeping left → right
  const bloom = kk(f, [30, 38, 48], [0, 1, 0], EIO);

  const wordS = s;
  return (
    <AbsoluteFill style={{ scale: `${push}`, transformOrigin: `${KNOB_X}px ${KNOB_Y}px`, filter: `blur(${pushBlur}px)` }}>
      {/* impact line under the dot */}
      <div
        style={{
          position: "absolute",
          left: KNOB_X + ICON_CENTRED_DX - 170,
          top: KNOB_Y + dotR + 6,
          width: 340,
          height: 3,
          borderRadius: 2,
          background: `linear-gradient(90deg, rgba(127,221,225,0), ${C.tealLight}, rgba(127,221,225,0))`,
          scale: `${ground} 1`,
          opacity: (1 - ground) * (f > 11 ? 1 : 0),
        }}
      />

      {/* door group (outline + fill) */}
      <div style={{ position: "absolute", left: ICON_LEFT, top: LOGO_TOP, width: iw, height: ih, translate: `${dx}px 0` }}>
        <div style={{ position: "absolute", inset: -60, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(127,221,225,0.55), rgba(127,221,225,0))", opacity: bloom, scale: `${0.8 + bloom * 0.4}` }} />
        <Img
          src={staticFile("img/logo-icon-white.png")}
          style={{
            position: "absolute",
            inset: 0,
            width: iw,
            height: ih,
            WebkitMaskImage: `linear-gradient(105deg, #000 ${sweep - 18}%, rgba(0,0,0,0) ${sweep + 6}%)`,
            maskImage: `linear-gradient(105deg, #000 ${sweep - 18}%, rgba(0,0,0,0) ${sweep + 6}%)`,
            filter: `brightness(${1 + bloom * 0.6}) drop-shadow(0 0 ${18 * bloom}px rgba(127,221,225,0.9))`,
          }}
        />
        <svg viewBox={`0 0 ${ICON_W} ${ICON_H}`} style={{ position: "absolute", inset: 0, width: iw, height: ih, overflow: "visible", opacity: outlineOpacity }}>
          <path d={ICON_PATH} fill="none" stroke={C.tealLight} strokeWidth={22} strokeLinejoin="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - draw} style={{ filter: "blur(10px)", opacity: 0.8 }} />
          <path d={ICON_PATH} fill="none" stroke="#fff" strokeWidth={7} strokeLinejoin="round" strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - draw} />
        </svg>
      </div>

      {/* knob dot (the motif) */}
      <div
        style={{
          position: "absolute",
          left: KNOB_X + ICON_CENTRED_DX - dotR,
          top: KNOB_Y - dotR + bounce,
          width: dotR * 2,
          height: dotR * 2,
          borderRadius: "50%",
          background: "#fff",
          boxShadow: "0 0 28px rgba(127,221,225,0.95)",
          scale: `${dotSX} ${dotSY}`,
          transformOrigin: "50% 100%",
          opacity: dotFade,
          translate: `${dx - ICON_CENTRED_DX}px 0`,
        }}
      />

      {/* wordmark letters spill out of the door, right → left */}
      <div style={{ position: "absolute", left: LOGO_LEFT, top: LOGO_TOP + WORD_Y * s, width: 1139 * wordS, height: WORD_H * wordS }}>
        {LETTERS.map(([x0, x1], i) => {
          const order = LETTERS.length - 1 - i;
          const p = k(f, 44 + order * 1.6, 62 + order * 1.6, 0, 1, EO);
          return (
            <div key={i} style={{ position: "absolute", left: x0 * wordS, top: -10, width: (x1 - x0) * wordS + 2, height: WORD_H * wordS + 20, overflow: "hidden" }}>
              <Img
                src={staticFile("img/logo-word-white.png")}
                style={{
                  position: "absolute",
                  left: -x0 * wordS,
                  top: 10,
                  width: 1139 * wordS,
                  height: WORD_H * wordS,
                  translate: `${(1 - p) * 70}px ${(1 - p) * 60}%`,
                  opacity: p,
                  filter: `blur(${(1 - p) * 6}px)`,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* light sweep across the whole lockup */}
      <div
        style={{
          position: "absolute",
          left: LOGO_LEFT,
          top: LOGO_TOP,
          width: 760,
          height: 544 * s,
          WebkitMaskImage: `url(${staticFile("img/logo-white.png")})`,
          maskImage: `url(${staticFile("img/logo-white.png")})`,
          WebkitMaskSize: "100% 100%",
          maskSize: "100% 100%",
          background: `linear-gradient(100deg, rgba(255,255,255,0) 40%, rgba(160,245,250,0.95) 50%, rgba(255,255,255,0) 60%)`,
          backgroundSize: "300% 100%",
          backgroundPosition: `${k(f, 54, 68, 130, -30, EIO)}% 0`,
        }}
      />

      <div style={{ position: "absolute", left: 0, right: 0, top: 1150, textAlign: "center", fontFamily: MONO, fontSize: 26, letterSpacing: "0.34em", color: C.tealLight, opacity: k(f, 60, 68, 1, 0, EO) }}>
        <TypeText text="CALIFORNIA'S CANNABIS DELIVERY" start={46} cps={60} />
      </div>
    </AbsoluteFill>
  );
};
