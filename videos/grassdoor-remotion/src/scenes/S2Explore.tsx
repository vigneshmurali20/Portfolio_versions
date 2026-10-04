import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { CATEGORIES, CategoryStack3D } from "../components/CategoryStack3D";
import { EdgeGlow } from "../components/EdgeGlow";
import { CartIcon, MicIcon, SearchIcon } from "../components/Icons";
import { RiseText, TypeText } from "../components/Kinetic";
import { TouchDot } from "../components/TouchDot";
import { EI, EIO, EO, k, kk } from "../lib/anim";
import { DISPLAY, MONO, UI } from "../lib/fonts";
import { KNOB_X, KNOB_Y } from "../lib/logo";
import { C } from "../lib/theme";

const LABELS: Record<(typeof CATEGORIES)[number], string> = {
  vapes: "Vapes",
  prerolls: "Pre-rolls",
  flower: "Flower",
  edibles: "Edibles",
  extracts: "Extracts",
  drinks: "Drinks",
  wellness: "Wellness",
  accessories: "Accessories",
};
const CARDS = ["prerolls", "flower", "vapes", "edibles", "extracts", "beverages"];

const PHONE = { x: 240, y: 600, w: 600, h: 1180, r: 78, bezel: 16 };

/** 02 · White. Visit the site: search, swipe the categories, scroll top-rated — then the categories pop out in 3D. */
export const S2Explore: React.FC = () => {
  const f = useCurrentFrame();
  const iris = k(f, 0, 11, 0, 2300, EI);

  // phone entrance / recede
  const inP = k(f, 6, 32, 0, 1, EO);
  const recede = k(f, 76, 94, 0, 1, EIO);
  const bloom = k(f, 112, 122, 0, 1, EI);

  // scroll states inside the screen
  const rowX = kk(f, [32, 56], [0, -660], EIO);
  const gridY = kk(f, [60, 78], [0, -470], EIO);

  // touch dot path (screen-space)
  const sx = PHONE.x + PHONE.bezel;
  const sy = PHONE.y + PHONE.bezel;
  const t1 = f < 58;
  const dotX = t1 ? sx + kk(f, [32, 56], [470, 140], EIO) : sx + 300;
  const dotY = t1 ? sy + 420 : sy + kk(f, [60, 78], [980, 560], EIO);
  const dotO = t1 ? kk(f, [27, 31, 55, 58], [0, 1, 1, 0], EO) : kk(f, [58, 61, 78, 82], [0, 1, 1, 0], EO);
  const press = t1 ? kk(f, [30, 33], [0, 1]) * (1 - k(f, 55, 58, 0, 1)) : kk(f, [60, 63], [0, 1]) * (1 - k(f, 78, 81, 0, 1));

  return (
    <AbsoluteFill style={{ clipPath: `circle(${iris}px at ${KNOB_X}px ${KNOB_Y}px)`, background: C.white, filter: `brightness(${1 + bloom * 0.8})` }}>
      {/* soft teal wash so the white has depth */}
      <AbsoluteFill style={{ background: "radial-gradient(70% 45% at 50% 62%, rgba(5,160,168,0.10), rgba(5,160,168,0) 70%)" }} />

      {/* headline */}
      <div style={{ position: "absolute", left: 80, top: 236, fontFamily: MONO, fontSize: 24, letterSpacing: "0.22em", color: C.teal }}>
        <TypeText text="01 — VISIT GRASSDOOR.COM" start={8} cps={50} />
      </div>
      <div style={{ position: "absolute", left: 76, top: 286, fontFamily: DISPLAY, fontWeight: 800, fontSize: 86, lineHeight: 1.06, letterSpacing: "-0.035em", color: C.ink }}>
        <RiseText text="Explore every" start={10} stagger={1.1} />
        <br />
        <RiseText text="category." start={16} stagger={1.1} style={{ color: C.teal }} />
      </div>

      {/* phone */}
      <AbsoluteFill style={{ perspective: 1800, perspectiveOrigin: "50% 40%" }}>
        <div
          style={{
            position: "absolute",
            left: PHONE.x,
            top: PHONE.y,
            width: PHONE.w,
            height: PHONE.h,
            translate: `0 ${(1 - inP) * 620 + recede * 90}px`,
            rotate: `x ${(1 - inP) * 42}deg`,
            scale: `${(0.9 + inP * 0.1) * (1 - recede * 0.14)}`,
            opacity: 1 - recede * 0.72,
            filter: `blur(${recede * 7}px)`,
            transformOrigin: "50% 100%",
          }}
        >
          <div style={{ position: "absolute", inset: 0, borderRadius: PHONE.r, background: "linear-gradient(160deg, #10363a, #04191b)", boxShadow: "0 60px 120px rgba(6,47,51,0.35)" }} />
          <EdgeGlow radius={PHONE.r} width={3} intensity={0.9} />
          <div style={{ position: "absolute", inset: PHONE.bezel, borderRadius: PHONE.r - PHONE.bezel, overflow: "hidden", background: "#F6FAFA" }}>
            {/* status bar */}
            <div style={{ position: "absolute", left: 34, top: 18, fontFamily: UI, fontWeight: 700, fontSize: 22, color: C.ink }}>9:41</div>
            <div style={{ position: "absolute", left: "50%", top: 14, width: 150, height: 34, marginLeft: -75, borderRadius: 20, background: "#061c1e" }} />
            {/* header */}
            <Img src={staticFile("img/logo-teal.png")} style={{ position: "absolute", left: 30, top: 78, height: 50 }} />
            <div style={{ position: "absolute", right: 28, top: 74, width: 58, height: 58, borderRadius: 29, background: C.mist, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CartIcon size={30} color={C.ink} stroke={2.2} />
              <div style={{ position: "absolute", right: -2, top: -2, width: 22, height: 22, borderRadius: 11, background: C.teal, color: "#fff", fontFamily: UI, fontSize: 13, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>2</div>
            </div>
            {/* search */}
            <div style={{ position: "absolute", left: 24, right: 24, top: 154, height: 82, borderRadius: 41, background: "#fff", border: `2px solid ${C.line}`, boxShadow: "0 10px 30px rgba(6,47,51,0.07)", display: "flex", alignItems: "center", padding: "0 26px", gap: 16 }}>
              <SearchIcon size={30} color={C.inkSoft} stroke={2.4} />
              <div style={{ flex: 1, fontFamily: UI, fontWeight: 500, fontSize: 25, color: f < 18 ? "#9BB0B1" : C.ink }}>
                {f < 18 ? "Did you leave something behind?" : <TypeText text="Best edibles in California" start={18} cps={34} cursorColor={C.teal} holdCursor={6} />}
              </div>
              <MicIcon size={28} color={C.inkSoft} stroke={2.2} />
            </div>
            {/* categories */}
            <div style={{ position: "absolute", left: 28, right: 28, top: 268, display: "flex", justifyContent: "space-between", fontFamily: UI }}>
              <span style={{ fontWeight: 800, fontSize: 28, color: C.ink }}>Shop by category</span>
              <span style={{ fontWeight: 700, fontSize: 22, color: C.teal, marginTop: 4 }}>See all</span>
            </div>
            <div style={{ position: "absolute", left: 18, top: 318, display: "flex", gap: 14, translate: `${rowX}px 0` }}>
              {CATEGORIES.map((c, i) => {
                const pop = k(f, 22 + i * 1.5, 36 + i * 1.5, 0, 1, EO);
                const active = c === "edibles" && f > 50;
                return (
                  <div key={c} style={{ width: 136, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, scale: `${0.6 + pop * 0.4}`, opacity: pop }}>
                    <div style={{ width: 124, height: 124, borderRadius: 62, background: active ? "#CDEFEE" : "#E7F5F4", border: active ? `4px solid ${C.teal}` : "4px solid transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Img src={staticFile(`icons/${c}.png`)} style={{ maxWidth: 84, maxHeight: 88 }} />
                    </div>
                    <span style={{ fontFamily: UI, fontWeight: 700, fontSize: 21, color: active ? C.teal : C.ink }}>{LABELS[c]}</span>
                  </div>
                );
              })}
            </div>
            {/* top rated grid */}
            <div style={{ position: "absolute", left: 0, right: 0, top: 520, bottom: 0, overflow: "hidden" }}>
              <div style={{ translate: `0 ${gridY}px` }}>
                <div style={{ padding: "0 28px 14px", fontFamily: UI, fontWeight: 800, fontSize: 28, color: C.ink }}>Top rated near you</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, padding: "0 22px" }}>
                  {CARDS.map((c, i) => (
                    <div key={c} style={{ borderRadius: 22, overflow: "hidden", boxShadow: "0 10px 26px rgba(6,47,51,0.10)", opacity: k(f, 26 + i * 2, 40 + i * 2, 0, 1, EO), translate: `0 ${k(f, 26 + i * 2, 40 + i * 2, 40, 0, EO)}px` }}>
                      <Img src={staticFile(`img/cards/${c}.png`)} style={{ width: "100%", display: "block" }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </AbsoluteFill>

      <TouchDot x={dotX} y={dotY} opacity={dotO * (1 - recede)} press={press} />

      {/* categories pop out of the screen in 3D */}
      {f >= 76 ? <CategoryStack3D appear={80} exit={110} /> : null}

      {/* bright cut flash */}
      <AbsoluteFill style={{ background: "#fff", opacity: k(f, 114, 121, 0, 1, EI) }} />
    </AbsoluteFill>
  );
};
