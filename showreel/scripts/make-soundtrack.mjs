// Synthesises the showreel score to public/soundtrack.wav.
// Every sound is generated here (no samples), and every hit is placed on the
// picture's own timings, so music and motion stay locked together.
//   node scripts/make-soundtrack.mjs
import { writeFileSync } from 'node:fs';

const SR = 48000;
const DUR = 15;
const N = SR * DUR;
const L = new Float32Array(N);
const R = new Float32Array(N);
const sendL = new Float32Array(N); // reverb bus
const sendR = new Float32Array(N);

// deterministic noise
let seed = 12345;
const noise = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2147483648 - 1);
const TAU = Math.PI * 2;
const note = (n) => 440 * Math.pow(2, (n - 69) / 12); // MIDI → Hz

function add(t0, len, fn, { gain = 1, pan = 0, send = 0 } = {}) {
  const s0 = Math.max(0, Math.floor(t0 * SR));
  const s1 = Math.min(N, Math.floor((t0 + len) * SR));
  const gl = gain * Math.cos(((pan + 1) * Math.PI) / 4);
  const gr = gain * Math.sin(((pan + 1) * Math.PI) / 4);
  for (let i = s0; i < s1; i++) {
    const t = (i - s0) / SR;
    const v = fn(t, i);
    L[i] += v * gl;
    R[i] += v * gr;
    if (send) {
      sendL[i] += v * gl * send;
      sendR[i] += v * gr * send;
    }
  }
}

// state-variable filter factory (per voice)
function svf() {
  let low = 0;
  let band = 0;
  return (x, cutoff, q = 0.7) => {
    const f = 2 * Math.sin((Math.PI * Math.min(cutoff, SR / 6)) / SR);
    low += f * band;
    const high = x - low - q * band;
    band += f * high;
    return { low, band, high };
  };
}

/* ------------------------------------------------------------ voices */
function kick(t0, gain = 1) {
  let ph = 0;
  add(t0, 0.5, (t) => {
    const f = 45 + 110 * Math.exp(-t * 28);
    ph += (TAU * f) / SR;
    const click = t < 0.004 ? noise() * (1 - t / 0.004) * 0.6 : 0;
    return (Math.sin(ph) * Math.exp(-t * 7) + click) * 0.9;
  }, { gain });
}
function snap(t0, gain = 1, pan = 0) {
  const f = svf();
  add(t0, 0.25, (t) => f(noise(), 2200, 1.2).band * Math.exp(-t * 26) * 1.8, { gain, pan, send: 0.35 });
}
function hat(t0, gain = 1, open = false, pan = 0.2) {
  const f = svf();
  add(t0, open ? 0.3 : 0.08, (t) => f(noise(), 9000, 0.6).high * Math.exp(-t * (open ? 14 : 60)), { gain, pan });
}
function thump(t0, gain, pitch) {
  // woody bounce: pitched sine drop + soft click
  let ph = 0;
  add(t0, 0.3, (t) => {
    const f = pitch * (0.55 + 0.45 * Math.exp(-t * 30));
    ph += (TAU * f) / SR;
    const click = t < 0.003 ? noise() * 0.5 : 0;
    return Math.sin(ph) * Math.exp(-t * 16) + click;
  }, { gain, send: 0.2 });
}
function saw(ph) {
  return 2 * (ph - Math.floor(ph + 0.5));
}
function stab(t0, notes, gain = 1, len = 0.32) {
  const f = svf();
  const phs = notes.map(() => [0, 0.33]);
  add(t0, len + 0.4, (t) => {
    let v = 0;
    notes.forEach((n, k) => {
      const hz = note(n);
      phs[k][0] += hz / SR;
      phs[k][1] += (hz * 1.006) / SR;
      v += saw(phs[k][0]) + saw(phs[k][1]);
    });
    const env = t < 0.005 ? t / 0.005 : Math.exp(-(t - 0.005) * (t > len ? 18 : 4.5));
    return f(v / notes.length, 600 + 4200 * Math.exp(-t * 9), 0.9).low * env * 0.6;
  }, { gain, send: 0.4 });
}
function pad(t0, len, notes, gain = 1, attack = 0.6) {
  const f = svf();
  const phs = notes.map((_, k) => [k * 0.1, k * 0.37, k * 0.71]);
  add(t0, len, (t) => {
    let v = 0;
    notes.forEach((n, k) => {
      const hz = note(n);
      phs[k][0] += hz / SR;
      phs[k][1] += (hz * 1.004) / SR;
      phs[k][2] += (hz * 0.996) / SR;
      v += saw(phs[k][0]) + saw(phs[k][1]) * 0.8 + saw(phs[k][2]) * 0.8;
    });
    const env = Math.min(1, t / attack) * Math.min(1, (len - t) / 0.5);
    return f(v / notes.length, 900 + 500 * Math.sin(t * 1.3), 0.5).low * env * 0.32;
  }, { gain, send: 0.6, pan: 0 });
}
function bass(t0, len, n, gain = 1) {
  const f = svf();
  let ph = 0;
  add(t0, len, (t) => {
    ph += note(n) / SR;
    const env = Math.min(1, t / 0.01) * Math.exp(-t * 2.2) * Math.min(1, (len - t) / 0.03);
    return f(saw(ph) * 0.7 + Math.sin(TAU * ph) * 0.6, 380, 0.8).low * env;
  }, { gain });
}
function pluck(t0, n, gain = 1, pan = 0) {
  const hz = note(n);
  add(t0, 0.9, (t) => (Math.sin(TAU * hz * t) * Math.exp(-t * 7) + Math.sin(TAU * hz * 4.01 * t) * 0.3 * Math.exp(-t * 20)) * 0.5, {
    gain,
    pan,
    send: 0.45,
  });
}
function bell(t0, n, gain = 1, pan = 0) {
  const hz = note(n);
  add(t0, 2.6, (t) => {
    const idx = 2.2 * Math.exp(-t * 3);
    return Math.sin(TAU * hz * t + idx * Math.sin(TAU * hz * 1.41 * t)) * Math.exp(-t * 1.8) * 0.45;
  }, { gain, pan, send: 0.7 });
}
function whoosh(t0, len, from, to, gain = 1, pan = 0) {
  const f = svf();
  add(t0, len, (t) => {
    const p = t / len;
    const cut = from * Math.pow(to / from, p);
    const env = Math.sin(Math.PI * Math.min(1, p * 1.15)) ** 2;
    return f(noise(), cut, 1.4).band * env * 1.6;
  }, { gain, pan, send: 0.3 });
}
function riser(t0, len, gain = 1) {
  const f = svf();
  let ph = 0;
  add(t0, len, (t) => {
    const p = t / len;
    ph += (180 * Math.pow(6, p)) / SR;
    const env = p * p;
    return (f(noise(), 500 * Math.pow(16, p), 1.1).band * 1.2 + Math.sin(TAU * ph) * 0.25) * env;
  }, { gain, send: 0.4 });
}
function boom(t0, gain = 1) {
  kick(t0, gain * 1.2);
  let ph = 0;
  add(t0, 2.4, (t) => {
    ph += (38 + 20 * Math.exp(-t * 6)) / SR;
    return Math.sin(TAU * ph) * Math.exp(-t * 1.6) * 0.8;
  }, { gain });
  const f = svf();
  add(t0, 1.6, (t) => f(noise(), 1800 * Math.exp(-t * 2) + 200, 0.7).low * Math.exp(-t * 3.5) * 1.4, { gain, send: 0.8 });
}
function tick(t0, gain = 1, pan = 0) {
  const f = svf();
  add(t0, 0.03, (t) => f(noise(), 5000, 0.8).high * Math.exp(-t * 180), { gain, pan });
}

/* ------------------------------------------------------- arrangement */
// chapter starts (s): Bounce 0, Kinetic 2.0, Form 3.7, Systems 5.6,
// Path 7.4, Depth 9.5, Signature 11.6 (burst 12.25, wordmark 12.3)

// 01 Bounce: air, then three bounces that get quieter and higher
pad(0, 2.1, [41, 48, 55], 0.35, 1.2); // F2 C3 G3 haze
thump(0.55, 0.9, 210);
thump(1.12, 0.6, 240);
thump(1.47, 0.4, 270);
whoosh(1.5, 0.5, 300, 6000, 0.55);
riser(1.55, 0.45, 0.5);

// 02 Kinetic: a stab per word, landing exactly on each word
const STABS = [
  [53, 57, 60, 64], // Fmaj7
  [57, 60, 64, 67], // Am7
  [60, 64, 67, 71], // Cmaj7
  [55, 59, 62, 66], // G(add #11) lift
];
[2.0, 2.36, 2.72, 3.08].forEach((tt, i) => {
  kick(tt, 0.9);
  snap(tt, 0.5, i % 2 ? 0.25 : -0.25);
  stab(tt, STABS[i], 0.55, i === 3 ? 0.55 : 0.28);
});
whoosh(3.38, 0.36, 500, 9000, 0.6);

// groove bed from Form to Depth: 120 bpm
const chords = [
  { t: 3.7, len: 1.9, root: 45, pad: [57, 60, 64, 67] }, // Am7
  { t: 5.6, len: 1.8, root: 48, pad: [60, 64, 67, 71] }, // Cmaj7
  { t: 7.4, len: 2.1, root: 43, pad: [55, 59, 62, 66] }, // G
  { t: 9.5, len: 2.1, root: 41, pad: [53, 57, 60, 64] }, // Fmaj7
];
chords.forEach((c) => {
  pad(c.t, c.len + 0.3, c.pad, 0.5, 0.3);
  for (let b = c.t; b < c.t + c.len - 0.01; b += 0.5) {
    bass(b, 0.45, c.root, 0.55);
    bass(b + 0.25, 0.2, c.root + 12, 0.25);
  }
});
for (let b = 3.7; b < 11.55; b += 0.5) kick(b, 0.55);
for (let b = 3.95; b < 9.5; b += 0.5) hat(b, 0.35, false, 0.25);
for (let b = 9.5; b < 11.25; b += 0.125) hat(b, 0.18 + ((b - 9.5) / 1.75) * 0.25, false, ((b * 8) % 2) - 1 > 0 ? 0.3 : -0.3);
for (let b = 4.2; b < 9.4; b += 1) snap(b, 0.32, 0);

// 03 Form: a bell as the sphere blooms, a sparkle run as it becomes the logo
bell(3.7, 76, 0.5, -0.2); // E5
bell(3.72, 69, 0.35, 0.2); // A4
[69, 72, 76, 79, 81, 84, 88].forEach((n, i) => pluck(4.55 + i * 0.1, n, 0.32, i % 2 ? 0.4 : -0.4));
whoosh(5.4, 0.22, 3000, 300, 0.45);

// 04 Systems: plucks rippling out with the grid wave
[60, 64, 67, 72, 67, 64, 71, 67, 64, 60, 64, 67].forEach((n, i) => pluck(5.6 + i * 0.125, n + 12, 0.18, Math.sin(i) * 0.6));
whoosh(7.08, 0.32, 400, 8000, 0.5);

// 05 Path: a gliding lead that rises as the ribbon draws
{
  const f = svf();
  let ph = 0;
  add(7.45, 1.95, (t) => {
    const p = Math.min(1, t / 1.5);
    const hz = note(67) * Math.pow(2, (p * 7) / 12);
    ph += hz / SR;
    const env = Math.min(1, t / 0.2) * Math.min(1, (1.95 - t) / 0.3);
    return f(saw(ph), 1200 + 2400 * p, 0.6).low * env * 0.22;
  }, { send: 0.6, pan: 0.15 });
}
whoosh(9.22, 0.3, 6000, 300, 0.45);

// 06 Depth: speed — rising riser and tom fill into the collapse
riser(9.6, 1.65, 0.55);
[10.9, 11.0, 11.1, 11.2].forEach((tt, i) => thump(tt, 0.55, 140 - i * 18));
whoosh(11.22, 0.38, 9000, 200, 0.55);

// 07 Signature: two heartbeats, the burst, letters, typing, final chord
thump(11.72, 0.7, 90);
thump(11.97, 0.55, 90);
riser(11.85, 0.4, 0.45);
boom(12.25, 1.0);
[...'VIGNESH'].forEach((_, i) => tick(12.42 + i * 0.045, 0.35, -0.3 + i * 0.1));
bell(12.3, 77, 0.45, 0); // F5 shimmer over the logo
pad(12.25, 2.75, [41, 53, 57, 60, 64, 67], 0.75, 0.15); // Fmaj9 resolve
pluck(12.85, 84, 0.3, 0.3); // full stop pop
for (let i = 0; i < 17; i++) tick(13.15 + i * 0.044, 0.22, 0.2); // subtitle typing
bell(14.0, 72, 0.25, -0.2); // url

/* -------------------------------------------------------------- mix */
// Schroeder reverb on the send bus
function reverb(input, offset) {
  const out = new Float32Array(N);
  const combs = [1557, 1617, 1491, 1422].map((d) => ({ d: d + offset, buf: new Float32Array(d + offset), i: 0, fb: 0.8 }));
  const aps = [225, 556].map((d) => ({ d, buf: new Float32Array(d), i: 0 }));
  for (let n = 0; n < N; n++) {
    let s = 0;
    for (const c of combs) {
      const y = c.buf[c.i];
      c.buf[c.i] = input[n] + y * c.fb;
      c.i = (c.i + 1) % c.d;
      s += y;
    }
    s *= 0.25;
    for (const a of aps) {
      const y = a.buf[a.i];
      const v = s + y * -0.5;
      a.buf[a.i] = v;
      a.i = (a.i + 1) % a.d;
      s = y + v * 0.5;
    }
    out[n] = s;
  }
  return out;
}
const rvL = reverb(sendL, 0);
const rvR = reverb(sendR, 23);
let peak = 0;
for (let n = 0; n < N; n++) {
  L[n] += rvL[n] * 0.35;
  R[n] += rvR[n] * 0.35;
  // fade the last 0.35 s with the picture
  const tail = Math.min(1, (DUR - n / SR) / 0.35);
  L[n] = Math.tanh(L[n] * 0.9) * tail;
  R[n] = Math.tanh(R[n] * 0.9) * tail;
  peak = Math.max(peak, Math.abs(L[n]), Math.abs(R[n]));
}
const norm = 0.89 / peak; // ≈ -1 dBFS

// 16-bit stereo WAV
const buf = Buffer.alloc(44 + N * 4);
buf.write('RIFF', 0);
buf.writeUInt32LE(36 + N * 4, 4);
buf.write('WAVE', 8);
buf.write('fmt ', 12);
buf.writeUInt32LE(16, 16);
buf.writeUInt16LE(1, 20);
buf.writeUInt16LE(2, 22);
buf.writeUInt32LE(SR, 24);
buf.writeUInt32LE(SR * 4, 28);
buf.writeUInt16LE(4, 32);
buf.writeUInt16LE(16, 34);
buf.write('data', 36);
buf.writeUInt32LE(N * 4, 40);
for (let n = 0; n < N; n++) {
  buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[n] * norm)) * 32767), 44 + n * 4);
  buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[n] * norm)) * 32767), 46 + n * 4);
}
writeFileSync(new URL('../public/soundtrack.wav', import.meta.url), buf);
console.log(`soundtrack.wav written: ${DUR}s, peak normalised from ${peak.toFixed(2)}`);
