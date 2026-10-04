import React from "react";

type P = { size?: number; color?: string; stroke?: number; draw?: number; style?: React.CSSProperties };

// Line icons (24x24 grid). `draw` 0..1 animates the stroke on (pathLength-normalised).
const Svg: React.FC<P & { children: React.ReactNode }> = ({ size = 48, color = "currentColor", stroke = 2, draw = 1, style, children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <g style={{ strokeDasharray: 1, strokeDashoffset: 1 - draw }}>{children}</g>
  </svg>
);
const p = (d: string) => <path d={d} pathLength={1} />;

export const CartIcon: React.FC<P> = (o) => (
  <Svg {...o}>
    <circle cx="8" cy="21" r="1.2" pathLength={1} />
    <circle cx="19" cy="21" r="1.2" pathLength={1} />
    {p("M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12")}
  </Svg>
);
export const WalletIcon: React.FC<P> = (o) => (
  <Svg {...o}>
    {p("M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1")}
    {p("M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4")}
  </Svg>
);
export const GiftIcon: React.FC<P> = (o) => (
  <Svg {...o}>
    {p("M3 8h18v4H3z")}
    {p("M12 8v13")}
    {p("M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7")}
    {p("M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5")}
  </Svg>
);
export const TruckIcon: React.FC<P> = (o) => (
  <Svg {...o}>
    {p("M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2")}
    {p("M15 18H9")}
    {p("M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14")}
    <circle cx="17" cy="18" r="2" pathLength={1} />
    <circle cx="7" cy="18" r="2" pathLength={1} />
  </Svg>
);
export const ShieldCheckIcon: React.FC<P> = (o) => (
  <Svg {...o}>
    {p("M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z")}
    {p("m9 12 2 2 4-4")}
  </Svg>
);
export const CheckIcon: React.FC<P> = (o) => <Svg {...o}>{p("M20 6 9 17l-5-5")}</Svg>;
export const SearchIcon: React.FC<P> = (o) => (
  <Svg {...o}>
    <circle cx="11" cy="11" r="7" pathLength={1} />
    {p("m21 21-4.3-4.3")}
  </Svg>
);
export const MicIcon: React.FC<P> = (o) => (
  <Svg {...o}>
    {p("M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z")}
    {p("M19 10v2a7 7 0 0 1-14 0v-2")}
    {p("M12 19v3")}
  </Svg>
);
export const HomeIcon: React.FC<P> = (o) => (
  <Svg {...o}>
    {p("M3 10.5 12 3l9 7.5")}
    {p("M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5")}
  </Svg>
);

/** Cannabis leaf as seven drawn leaflets — used for the "premium products" line icon. */
export const LeafIcon: React.FC<P> = ({ size = 48, color = "currentColor", stroke = 2, draw = 1, style }) => {
  const leaflets = [
    { a: 0, l: 10.5 },
    { a: -32, l: 8.6 },
    { a: 32, l: 8.6 },
    { a: -64, l: 6.8 },
    { a: 64, l: 6.8 },
    { a: -98, l: 4.6 },
    { a: 98, l: 4.6 },
  ];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={style}>
      <g style={{ strokeDasharray: 1, strokeDashoffset: 1 - draw }}>
        {leaflets.map((f, i) => (
          <path
            key={i}
            pathLength={1}
            transform={`translate(12 16) rotate(${f.a})`}
            d={`M0 0 C ${-f.l * 0.22} ${-f.l * 0.35}, ${-f.l * 0.16} ${-f.l * 0.8}, 0 ${-f.l} C ${f.l * 0.16} ${-f.l * 0.8}, ${f.l * 0.22} ${-f.l * 0.35}, 0 0 Z`}
          />
        ))}
        <path pathLength={1} d="M12 16v6" />
      </g>
    </svg>
  );
};
