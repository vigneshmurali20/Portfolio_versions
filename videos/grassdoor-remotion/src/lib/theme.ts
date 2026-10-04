export const C = {
  teal: "#05A0A8",
  tealBright: "#2FD3DA",
  tealLight: "#7FDDE1",
  tealDeep: "#0B4F57",
  ink: "#062F33",
  inkSoft: "#4C6B6E",
  white: "#FFFFFF",
  mist: "#EEF7F7",
  line: "#DCEEEE",
  gold: "#F9C74F",
} as const;

export const W = 1080;
export const H = 1920;
export const FPS = 30;

// Scene table (global frames). Neighbouring scenes overlap by a few frames for the match cuts.
export const SCENES = [
  { id: "Logo", from: 0, dur: 70, bg: "silk", label: "GRASSDOOR" },
  { id: "Explore", from: 60, dur: 122, bg: "white", label: "EXPLORE" },
  { id: "Unbox", from: 180, dur: 108, bg: "silk", label: "TOP BRANDS" },
  { id: "Track", from: 276, dur: 90, bg: "white", label: "LIVE TRACKING" },
  { id: "Credit", from: 358, dur: 98, bg: "silk", label: "CREDIT BACK" },
  { id: "OnePlace", from: 444, dur: 69, bg: "white", label: "ONE PLACE" },
  { id: "Closure", from: 510, dur: 120, bg: "silk", label: "VISIT US" },
] as const;
export const TOTAL = 630;
