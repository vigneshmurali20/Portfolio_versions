"""Build the master soundtrack: beat-aligned Lyria bed + VO (with sidechain ducking) + SFX → public/audio/mix.wav.
Stems are also written so the mix can be rebalanced later."""
import json, subprocess, wave
import librosa, numpy as np
from scipy.signal import butter, sosfilt

SR = 48000
cfg = json.load(open("src/lib/audio.json"))
T = cfg["total"]; N = int(T * SR)

def load(path, mono=False):
    y, _ = librosa.load(path, sr=SR, mono=mono)
    return y if mono else (np.stack([y, y]) if y.ndim == 1 else y)

# ---- music: align the beat grid so beats land on whole half-seconds of the video
mus = load("audio-src/lyria-take-b.wav")
yb = librosa.to_mono(mus)
_, beats = librosa.beat.beat_track(y=yb, sr=SR, start_bpm=120, tightness=400)
bt = librosa.frames_to_time(beats, sr=SR)
period = float(np.median(np.diff(bt)))
phase = float(np.median(np.mod(bt, period)))
start = phase + period * 1  # skip the first beat (Lyria warm-up)
m = mus[:, int(start * SR): int(start * SR) + N]
m = np.pad(m, ((0, 0), (0, N - m.shape[1])))
t = np.arange(N) / SR
print(f"beat period {period:.4f}s  phase {phase:.3f}s  -> music offset {start:.3f}s")

def lowpass(x, f): return sosfilt(butter(2, f, fs=SR, output="sos"), x, axis=-1)
# intro: filtered → open by the iris (2.0 s)
g_open = np.clip((t - 1.4) / 0.8, 0, 1)
m = lowpass(m, 500) * (1 - g_open) + m * g_open
gain = 0.55 + 0.45 * np.clip(t / 1.8, 0, 1)
# pull the music out for half a beat before each bright cut, slam back on the cut
for c in cfg["brightCuts"]:
    gain *= 1 - 0.85 * np.clip((t - (c - 0.42)) / 0.12, 0, 1) * (t < c)
# ending: duck after the logo lock, fade to silence on the last second
gain *= np.interp(t, [0, 19.4, 20.1, 21.0], [1, 1, 0.55, 0])
m *= gain

# ---- VO bus
vo = np.zeros(N)
for v in cfg["vo"]:
    y = load(f"public/audio/vo/{v['id']}.wav", mono=True)
    i = int(v["at"] * SR); vo[i:i + len(y)] += y[: N - i]
vo /= max(1e-9, np.abs(vo).max()); vo *= 0.89
# sidechain duck from the VO envelope (fast attack, 250 ms release)
envl = np.abs(vo); win = int(0.03 * SR)
envl = np.convolve(envl, np.ones(win) / win, mode="same")
duck = np.zeros(N); a = np.exp(-1 / (0.01 * SR)); r = np.exp(-1 / (0.25 * SR)); s = 0.0
for k in range(0, N, 48):  # ms resolution is plenty
    x = envl[k]; s = a * s + (1 - a) * x if x > s else r * s + (1 - r) * x; duck[k:k + 48] = s
duck = 1 - 0.55 * np.clip(duck / 0.12, 0, 1)
m *= duck

# ---- SFX
fx = load("public/audio/sfx.wav")[:, :N]
fx = np.pad(fx, ((0, 0), (0, N - fx.shape[1])))

stems = {"music": m * 0.62, "vo": np.stack([vo, vo]), "sfx": fx * 0.8}
mix = sum(stems.values())
mix = np.tanh(mix * 1.1) / np.tanh(1.1)

def write(path, x):
    x = np.clip(x, -1, 1)
    with wave.open(path, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x.T * 32767).astype(np.int16).tobytes())
for k, v in stems.items(): write(f"public/audio/stem-{k}.wav", v)
write("public/audio/mix-premaster.wav", mix)
# master: two-pass loudness to -14 LUFS / -1 dBTP (social delivery)
meas = subprocess.run(["ffmpeg", "-nostdin", "-hide_banner", "-i", "public/audio/mix-premaster.wav", "-af",
                       "loudnorm=I=-14:TP=-1:LRA=9:print_format=json", "-f", "null", "-"], capture_output=True, text=True).stderr
js = json.loads(meas[meas.rindex("{"): meas.rindex("}") + 1])
af = (f"loudnorm=I=-14:TP=-1:LRA=9:measured_I={js['input_i']}:measured_TP={js['input_tp']}:"
      f"measured_LRA={js['input_lra']}:measured_thresh={js['input_thresh']}:offset={js['target_offset']}:linear=true")
subprocess.run(["ffmpeg", "-nostdin", "-y", "-loglevel", "error", "-i", "public/audio/mix-premaster.wav", "-af", af, "-ar", "48000", "public/audio/mix.wav"], check=True)
print("input loudness", js["input_i"], "LUFS -> -14 LUFS master written to public/audio/mix.wav")
