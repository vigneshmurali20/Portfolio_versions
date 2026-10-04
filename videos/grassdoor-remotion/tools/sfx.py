"""Synthesise the sound-design layer, one stereo 48 kHz WAV placed on the 20 s timeline.
Every hit is tied to an animation event (global frame @30fps). Deterministic (seeded)."""
import numpy as np, wave
from scipy.signal import butter, sosfilt, fftconvolve

SR = 48000
DUR = 21.0
N = int(SR * DUR)
rng = np.random.default_rng(7)
L = np.zeros(N); R = np.zeros(N)

class Snd(np.ndarray):
    """1-D signal whose + pads the shorter operand, so layered hits of different lengths just sum."""
    __array_priority__ = 10
    def __add__(self, o):
        if isinstance(o, np.ndarray) and o.shape != self.shape:
            n = max(len(self), len(o)); a = np.zeros(n); b = np.zeros(n)
            a[: len(self)] = self; b[: len(o)] = o
            return (a + b).view(Snd)
        return np.ndarray.__add__(self, o)
    __radd__ = __add__

def t_(d): return (np.arange(int(SR * d)) / SR).view(Snd)
def env(d, a=0.005, rel=None, curve=4.0):
    t = t_(d); e = np.minimum(1, t / max(a, 1e-4))
    return e * np.exp(-curve * t / d) if rel is None else e * np.clip(1 - (t - (d - rel)) / rel, 0, 1)
def bp(x, lo, hi, order=2): return sosfilt(butter(order, [lo, hi], btype="band", fs=SR, output="sos"), x)
def lp(x, f, order=2): return sosfilt(butter(order, f, btype="low", fs=SR, output="sos"), x)
def hp(x, f, order=2): return sosfilt(butter(order, f, btype="high", fs=SR, output="sos"), x)
def sweep_sine(f0, f1, d, phase=0):
    t = t_(d); f = f0 * (f1 / f0) ** (t / d); return np.sin(2 * np.pi * np.cumsum(f) / SR + phase)
def place(x, at, gain=1.0, pan=0.0):
    x = np.asarray(x)
    i = int(at * SR); x = x[: max(0, N - i)] * gain
    l = np.cos((pan + 1) * np.pi / 4); r = np.sin((pan + 1) * np.pi / 4)
    L[i:i + len(x)] += x * l * 1.41; R[i:i + len(x)] += x * r * 1.41
F = lambda fr: fr / 30.0

# ---- building blocks -------------------------------------------------------
def tick(f=3200, d=0.035): return bp(rng.standard_normal(int(SR * d)), f * 0.6, min(f * 1.6, 20000)) * env(d, 0.001, curve=9)
def pluck(f, d=0.35):
    t = t_(d); x = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * 2 * f * t) + 0.12 * np.sin(2 * np.pi * 3 * f * t)
    return x * env(d, 0.002, curve=7)
def whoosh(d=0.5, lo=300, hi=6000, rev=False):
    n = rng.standard_normal(int(SR * d)); t = t_(d)
    out = np.zeros_like(n); seg = 32
    for k in range(seg):  # moving band-pass
        a, b = k * len(n) // seg, (k + 1) * len(n) // seg
        c = lo * (hi / lo) ** (k / seg)
        out[a:b] = bp(n, c * 0.7, min(c * 1.4, 22000))[a:b]
    shape = np.sin(np.pi * t / d) ** 2
    if rev: shape = (t / d) ** 2.2 * np.clip((d - t) / 0.03, 0, 1)
    return out * shape
def impact(d=1.2, f0=95):
    t = t_(d); body = sweep_sine(f0 * 1.8, f0 * 0.55, d) * np.exp(-5 * t)
    click = hp(rng.standard_normal(len(t)), 1500) * np.exp(-60 * t) * 0.4
    tail = lp(rng.standard_normal(len(t)), 900) * np.exp(-4 * t) * 0.25
    return body + click + tail
def riser(d=0.8):
    t = t_(d); n = whoosh(d, 400, 9000, rev=True)
    tone = sweep_sine(220, 880, d) * (t / d) ** 2 * 0.25
    return n + tone
def sparkle(d=0.9, base=2400, count=9, seed=0):
    r = np.random.default_rng(seed); out = np.zeros(int(SR * d))
    for _ in range(count):
        at = r.uniform(0, d * 0.6); f = base * r.choice([1, 1.25, 1.5, 2, 2.5])
        p = pluck(f, 0.25) * 0.25; i = int(at * SR); out[i:i + len(p)] += p[: len(out) - i]
    return out
def chime(fs, gap=0.09, d=0.9):
    out = np.zeros(int(SR * (d + gap * len(fs))))
    for k, f in enumerate(fs):
        p = pluck(f, d) * 0.5; i = int(k * gap * SR); out[i:i + len(p)] += p
    return out
def rattle(d=0.45):
    t = t_(d); n = bp(rng.standard_normal(len(t)), 200, 2500) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 18 * t)))
    return n * (t / d) * 0.6
def thump(f=70, d=0.25): t = t_(d); return np.sin(2 * np.pi * sweep_sine(f * 2, f, d).cumsum() * 0 + 2 * np.pi * f * t) * np.exp(-14 * t)

# ---- 01 logo ---------------------------------------------------------------
place(sweep_sine(1800, 500, 0.4) * env(0.4, 0.02, curve=3) * 0.12, F(0))         # dot falling whistle
place(thump(110, 0.22) * 0.8 + tick(5000) * 0.5, F(12))                             # impact
place(pluck(1320, 0.2) * 0.25, F(24))                                               # little rebound
place(sparkle(0.8, 2600, 10, 1) * 0.9 + whoosh(0.7, 2000, 9000) * 0.12, F(18))    # outline draw shimmer
place(whoosh(0.5, 600, 7000) * 0.35, F(40), pan=0.4)                                # door slides
place(sparkle(0.7, 3200, 8, 2), F(55))                                              # light sweep
place(riser(0.33) * 0.5 + whoosh(0.4, 200, 4000, rev=True) * 0.4, F(52))            # iris push
place(impact(0.9, 120) * 0.35, F(64))
# ---- 02 explore ------------------------------------------------------------
for k in range(10): place(tick(4200, 0.02) * 0.18, F(78 + k * 1.5))                 # typing in search
place(tick(1800, 0.05) * 0.6 + pluck(880, 0.12) * 0.15, F(90))                     # touch down (swipe)
place(whoosh(0.7, 500, 3000) * 0.18, F(93), pan=-0.5)                              # swipe
place(tick(1800, 0.05) * 0.6 + pluck(880, 0.12) * 0.15, F(120))                    # touch down (scroll)
place(whoosh(0.5, 400, 2500) * 0.16, F(121))
for k, f in enumerate([523, 587, 659, 784, 880, 1046, 1175, 1318]):                # 8 tiles pop out (pentatonic)
    place(pluck(f, 0.3) * 0.32 + thump(160, 0.1) * 0.25, F(140 + 80 - 80 + k * 2.2), pan=np.sin(k) * 0.6)
place(riser(0.75), F(158))                                                          # bright cut build
place(impact(1.4, 80) * 0.9 + whoosh(0.3, 3000, 12000) * 0.3, F(181))              # BRIGHT CUT
# ---- 03 unbox --------------------------------------------------------------
place(thump(85, 0.3) * 0.7, F(192))                                                 # box settles
place(rattle(0.46), F(192))                                                         # anticipation shake
place(impact(1.6, 60) * 1.0 + whoosh(0.6, 300, 9000) * 0.5, F(206))                # EXPLOSION
place(sparkle(1.2, 2000, 16, 3) * 1.2, F(207))                                      # confetti glitter
for k, fr in enumerate([238, 242, 246, 250]): place(tick(2600, 0.03) * 0.5 + pluck(1568, 0.1) * 0.15, F(fr), pan=[-0.6, 0.6, -0.6, 0.6][k])
place(whoosh(0.4, 300, 5000, rev=True) * 0.6, F(268))                              # collapse into box
place(pluck(988, 0.25) * 0.5 + thump(140, 0.12) * 0.5, F(274))                      # dot pop
place(whoosh(0.35, 400, 6000) * 0.3, F(276))                                        # iris
# ---- 04 track --------------------------------------------------------------
place(whoosh(1.6, 300, 1200) * 0.08, F(288), pan=-0.3)                              # driving bed
place(chime([784, 988, 1175, 1568], 0.07, 1.0) * 0.6, F(340))                       # DELIVERED
place(whoosh(0.45, 2000, 12000) * 0.25 + riser(0.35) * 0.2, F(351))                 # blur-off
# ---- 05 credit -------------------------------------------------------------
for k in range(16): place(tick(3600 - k * 80, 0.02) * 0.28, F(364 + k * 1.4))      # odometer
place(pluck(1046, 0.4) * 0.35 + thump(120, 0.12) * 0.4, F(384))                     # % pops
for d in range(31): place(pluck(660 * 2 ** ((d % 12) / 24), 0.12) * 0.07, F(358 + 36 + d * 0.95), pan=((d % 7) - 3) / 4)
place(chime([1046, 1318, 1568], 0.06, 0.9) * 0.45, F(424))                          # 31st highlighted
place(whoosh(0.4, 300, 5000, rev=True) * 0.5, F(434))                              # iris build
# ---- 06 one place ----------------------------------------------------------
for k in range(3): place(whoosh(0.25, 800, 6000) * 0.25, F(458 + k * 4), pan=-0.5 + k * 0.5)
place(pluck(784, 0.3) * 0.35 + thump(130, 0.12) * 0.4, F(474))                      # CTA pops in
place(sparkle(0.5, 3500, 5, 4) * 0.6, F(482))                                       # CTA shine
place(tick(1500, 0.06) * 0.9 + thump(160, 0.1) * 0.6, F(494))                       # TAP
place(chime([1318, 1760], 0.06, 0.6) * 0.5, F(497))                                 # added to cart
place(riser(0.45) * 0.7, F(497))
place(impact(1.4, 85) * 0.8 + whoosh(0.3, 3000, 12000) * 0.3, F(512))               # BRIGHT CUT
# ---- 07 closure ------------------------------------------------------------
for k in range(3):
    place(whoosh(0.6, 1500, 7000) * 0.1 + sparkle(0.5, 2200 + k * 400, 4, 10 + k) * 0.5, F(514 + k * 7))
place(whoosh(0.5, 300, 6000, rev=True) * 0.55, F(552))                              # shards gather
place(impact(1.8, 70) * 0.7 + chime([523, 784, 1046], 0.03, 1.4) * 0.35, F(565))     # LOGO LOCK
for k in range(17): place(tick(5200, 0.018) * 0.2, F(574 + k * 0.83), pan=-0.3 + k * 0.035)  # URL types
place(sparkle(0.6, 3000, 6, 21) * 0.5, F(586))                                      # underline

# ---- space + master --------------------------------------------------------
ir_t = t_(1.1)
irL = rng.standard_normal(len(ir_t)) * np.exp(-6 * ir_t); irR = rng.standard_normal(len(ir_t)) * np.exp(-6 * ir_t)
irL = lp(irL, 7000); irR = lp(irR, 7000)
wetL = fftconvolve(L, irL)[:N] * 0.02; wetR = fftconvolve(R, irR)[:N] * 0.02
out = np.stack([L + wetL, R + wetR], 1)
out = np.tanh(out * 1.2) / np.tanh(1.2)
out *= 0.5 / max(1e-9, np.abs(out).max())
with wave.open("public/audio/sfx.wav", "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((out * 32767).astype(np.int16).tobytes())
print("sfx.wav", out.shape, "peak", np.abs(out).max())
