import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { EdgeGlow } from "../components/EdgeGlow";
import { RiseText, TypeText } from "../components/Kinetic";
import { BACK, EI, EIO, EO, k, kk, rnd } from "../lib/anim";
import { DISPLAY, MONO } from "../lib/fonts";
import pieces from "../lib/pieces.json";
import { C } from "../lib/theme";

const CL = { x: 111, y: 860 }; // cluster origin on screen (1:1 scale)
const BOX = { x: 160, y: 1180, s: 760 / 1114 };
const ORIGIN = { x: 540, y: 1660 }; // inside the box, behind the front panel
export const UNBOX_DOT = { x: 540, y: 1300 };
const BURST = 26;

type Piece = { x: number; y: number; w: number; h: number };
const ORDER = ["keef", "gelato", "biscotti", "henrys-box", "henrys-tin", "stiiizy", "shorty-1", "shorty-2", "shorty-3"] as const;

const piecePose = (name: string, p: Piece, f: number, i: number) => {
  const d = rnd(`d${name}`, 0, 5);
  const fx = CL.x + p.x + p.w / 2;
  const fy = CL.y + p.y + p.h / 2;
  const ax = fx + (fx - 540) * 0.55;
  const ay = fy - 260 - rnd(`ay${name}`, 0, 160);
  const p1 = k(f, BURST + d, BURST + d + 16, 0, 1, EO);
  const p2 = k(f, BURST + 14 + d, BURST + 40 + d, 0, 1, EIO);
  const x1 = ORIGIN.x + (ax - ORIGIN.x) * p1;
  const y1 = ORIGIN.y + (ay - ORIGIN.y) * p1;
  const x = x1 + (fx - x1) * p2;
  const y = y1 + (fy - y1) * p2;
  const spinY = rnd(`ry${name}`, -1, 1) * 300;
  const spinZ = rnd(`rz${name}`, -1, 1) * 70;
  const s = (0.3 + 0.95 * p1) * (1 + (1 - p2) * 0.18 * p1) - (p1 - p2) * 0.02;
  // idle float once settled
  const fl = p2 >= 1 ? Math.sin((f - BURST - 40) * 0.09 + i) * 6 : 0;
  // exit: everything dives back into the box
  const back = k(f, 84 + i * 0.6, 96 + i * 0.6, 0, 1, EI);
  return {
    x: x + (ORIGIN.x - x) * back,
    y: y + fl + (ORIGIN.y - 120 - y) * back,
    s: s * (1 - back * 0.7),
    ry: spinY * (1 - p2),
    rz: spinZ * (1 - p2) * p1,
    visible: f >= BURST + d - 1,
  };
};

/** 03 · Silk. The Grassdoor box shakes and the top brands explode out of it, then settle into a hero cluster. */
export const S3Unbox: React.FC = () => {
  const f = useCurrentFrame();
  const P = pieces.pieces as Record<string, Piece>;

  const drop = k(f, 0, 14, -90, 0, EO);
  const shake = f > 12 && f < BURST ? Math.sin(f * 2.4) * k(f, 12, BURST, 0.6, 3, EI) : 0;
  const squash = kk(f, [16, BURST, BURST + 3, BURST + 10], [0, 1, -0.6, 0], EIO);
  const boxOut = k(f, 88, 100, 0, 1, EI);
  const flash = kk(f, [BURST - 1, BURST + 2, BURST + 14], [0, 1, 0], EO);

  const stageScale = 1 - boxOut * 0.96;
  const stage: React.CSSProperties = { scale: `${stageScale}`, transformOrigin: `${UNBOX_DOT.x}px ${UNBOX_DOT.y}px`, filter: `blur(${boxOut * 8}px)`, opacity: 1 - k(f, 94, 99, 0, 1) };

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(60% 40% at 50% 62%, rgba(47,211,218,0.18), rgba(47,211,218,0) 70%)" }} />

      {/* headline */}
      <div style={{ position: "absolute", left: 80, top: 236, fontFamily: MONO, fontSize: 24, letterSpacing: "0.22em", color: C.tealLight, opacity: 1 - boxOut }}>
        <TypeText text="02 — CALIFORNIA'S TOP BRANDS" start={22} cps={50} />
      </div>
      <div style={{ position: "absolute", left: 76, top: 286, fontFamily: DISPLAY, fontWeight: 800, fontSize: 86, lineHeight: 1.06, letterSpacing: "-0.035em", color: "#fff", opacity: 1 - boxOut }}>
        <RiseText text="Top brands," start={30} stagger={1.1} exit={84} />
        <br />
        <RiseText text="unboxed." start={36} stagger={1.1} exit={86} style={{ color: C.tealBright }} />
      </div>

      <AbsoluteFill style={stage}>
        {/* box interior */}
        <div
          style={{
            position: "absolute",
            left: BOX.x + 70 * BOX.s,
            top: BOX.y + 260 * BOX.s + drop,
            width: (1114 - 140) * BOX.s,
            height: 360 * BOX.s,
            background: "linear-gradient(180deg, #0b5a61, #042a2d)",
            clipPath: "polygon(4% 0, 96% 0, 100% 100%, 0 100%)",
            rotate: `${shake}deg`,
            transformOrigin: "50% 100%",
          }}
        />
        {/* burst light */}
        <div style={{ position: "absolute", left: ORIGIN.x - 420, top: ORIGIN.y - 620, width: 840, height: 840, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(200,255,255,0.95), rgba(47,211,218,0.45) 40%, rgba(47,211,218,0))", opacity: flash, scale: `${0.4 + flash}` }} />

        {/* shards */}
        {Array.from({ length: 30 }).map((_, i) => {
          const t = f - BURST - rnd(`sd${i}`, 0, 4);
          if (t < 0 || t > 46) return null;
          const ang = rnd(`sa${i}`, -165, -15) * (Math.PI / 180);
          const v = rnd(`sv${i}`, 22, 44);
          const x = ORIGIN.x + Math.cos(ang) * v * t;
          const y = ORIGIN.y - 120 + Math.sin(ang) * v * t + 0.9 * t * t;
          const col = [C.tealBright, "#fff", C.gold, C.tealLight][i % 4];
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x,
                top: y,
                width: rnd(`sw${i}`, 10, 34),
                height: rnd(`sh${i}`, 5, 14),
                background: col,
                borderRadius: 3,
                rotate: `${rnd(`sr${i}`, 0, 360) + t * rnd(`sw2${i}`, -14, 14)}deg`,
                opacity: k(t, 30, 46, 1, 0),
              }}
            />
          );
        })}

        {/* products — with two trailing ghosts while they fly (cheap motion blur) */}
        {ORDER.map((name, i) => {
          const p = P[name];
          const layers = [2.4, 1.2, 0].map((lag) => ({ lag, pose: piecePose(name, p, f - lag, i) }));
          const flying = f > BURST && f < BURST + 40;
          return layers.map(({ lag, pose }) => {
            if (!pose.visible || (lag > 0 && !flying)) return null;
            return (
              <Img
                key={`${name}-${lag}`}
                src={staticFile(`img/pieces/${name}.png`)}
                style={{
                  position: "absolute",
                  left: pose.x - p.w / 2,
                  top: pose.y - p.h / 2,
                  width: p.w,
                  height: p.h,
                  transform: `perspective(1200px) rotateY(${pose.ry}deg) rotateZ(${pose.rz}deg) scale(${pose.s})`,
                  opacity: lag === 0 ? 1 : lag > 2 ? 0.18 : 0.32,
                  filter: lag === 0 ? "drop-shadow(0 26px 30px rgba(0,0,0,0.45))" : undefined,
                }}
              />
            );
          });
        })}

        {/* box front panel (on top so products rise out of it) */}
        <Img
          src={staticFile("img/box-front.png")}
          style={{
            position: "absolute",
            left: BOX.x,
            top: BOX.y + drop,
            width: 1114 * BOX.s,
            height: 844 * BOX.s,
            rotate: `${shake}deg`,
            scale: `${1 + squash * 0.03} ${1 - squash * 0.05}`,
            transformOrigin: "50% 100%",
            filter: "drop-shadow(0 40px 50px rgba(0,0,0,0.55))",
          }}
        />

        {/* brand callouts */}
        {[
          { label: "KEEF", ax: 700, ay: 905, px: 742, py: 660, t: 58 },
          { label: "HENRY'S", ax: 230, ay: 1000, px: 92, py: 700, t: 62 },
          { label: "GELATO", ax: 900, ay: 1180, px: 812, py: 1484, t: 66 },
          { label: "STIIIZY", ax: 470, ay: 1230, px: 92, py: 1484, t: 70 },
        ].map((c) => {
          const lp = k(f, c.t, c.t + 10, 0, 1, EO);
          const tp = k(f, c.t + 6, c.t + 16, 0, 1, BACK);
          const out = 1 - k(f, 82, 90, 0, 1, EI);
          const pillW = 40 + c.label.length * 17;
          const ex = c.px + pillW / 2;
          const ey = c.py + 26;
          const len = Math.hypot(ex - c.ax, ey - c.ay);
          const ang = (Math.atan2(ey - c.ay, ex - c.ax) * 180) / Math.PI;
          return (
            <div key={c.label} style={{ opacity: out }}>
              <div style={{ position: "absolute", left: c.ax - 9, top: c.ay - 9, width: 18, height: 18, borderRadius: 9, background: "#fff", boxShadow: `0 0 0 6px rgba(47,211,218,0.35)`, scale: `${lp}` }} />
              <div style={{ position: "absolute", left: c.ax, top: c.ay - 1, width: len, height: 2, background: "rgba(255,255,255,0.8)", rotate: `${ang}deg`, transformOrigin: "0 50%", scale: `${lp} 1` }} />
              <div style={{ position: "absolute", left: c.px, top: c.py, height: 52, width: pillW, borderRadius: 26, background: "rgba(3,28,31,0.82)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontSize: 22, letterSpacing: "0.16em", color: "#fff", scale: `${tp}` }}>
                <EdgeGlow radius={26} width={1.5} intensity={0.8} speed={6} />
                {c.label}
              </div>
            </div>
          );
        })}
      </AbsoluteFill>

      {/* the box collapses into the motif dot, which becomes the driver on the map */}
      <div
        style={{
          position: "absolute",
          left: UNBOX_DOT.x - 26,
          top: UNBOX_DOT.y - 26,
          width: 52,
          height: 52,
          borderRadius: 26,
          background: C.teal,
          border: "8px solid #fff",
          boxShadow: "0 0 40px rgba(47,211,218,0.9)",
          scale: `${k(f, 90, 98, 0, 1, BACK)}`,
        }}
      />
    </AbsoluteFill>
  );
};
