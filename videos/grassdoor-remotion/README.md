# Grassdoor — 21s vertical showreel spot (Remotion)

`renders/grassdoor-v4-21s-1080x1920-audio.mp4`: 1080×1920, 30fps, H.264 + AAC 48 kHz stereo, 21.0s, −14 LUFS.
(`renders/grassdoor-v3-20s-1080x1920.mp4` is the silent v3 cut.)

Built with Remotion 4.0.532 + `@remotion/three`. Silk is a WebGL shader. Every cut is a silk ⇄ #FFFFFF match cut
(iris, bright cut, or blur-off), and the white scenes use teal as their main colour. One motif carries
through every scene, like the dot in the benchmark showreel: the **door-knob dot** of the Grassdoor icon.

| Time | Scene | Out |
| --- | --- | --- |
| 0.0–2.2 | Knob dot drops (squash & stretch), traces the door silhouette, light sweep fills the door through its own shape, wordmark spills out letter by letter | Iris to white from the knob |
| 2.0–6.0 | **White.** "Explore every category." Phone with an edge glow: search types, the touch dot swipes categories and scrolls top-rated. The 8 Figma category icons burst out as glossy 3D tiles (Three.js) in a twisting stack | Bright cut |
| 6.0–9.4 | **Silk.** "Top brands, unboxed." Box shakes, products explode out with motion trails and shards, settle into the hero cluster, brand callouts | Box collapses into the dot |
| 9.2–12.2 | **White.** "Track it live." → "Delivered on time." The dot is the driver on a tilted map, the route draws live, rings pulse at the door, the tracking card ticks to Delivered | Blur-off |
| 11.9–15.2 | **Silk.** 20% (odometer) credit back, on all orders till Oct 31. October 2026 calendar fills day by day; ring + "LAST DAY · 31" | Iris to white from the 31st |
| 14.8–17.1 | **White.** Figma "Everything you need in one place": wallet / deals / delivery cards with edge glow, CTA with the cart icon leading the label, tap + ripple + cart badge | Bright cut |
| 17.0–21.0 | **Silk.** Line-drawn icons with taglines in line animation, settling into a trust bar; shards lock into the logo; "Visit www.grassdoor.com" | — |

Type: **Unbounded** (display), **Inter Tight** (UI), **Geist Mono** (HUD and labels). A showreel HUD
(corner brackets, index, scene label, timecode) runs throughout.

Assets come from the Figma file "Grassdoor" (page "Figma motion"). Category icons and the logo were exported at
8×/4× through the plugin API; product pieces are cut from the cluster render (`src/lib/pieces.json`).
`src/lib/iconPath.ts` is the traced door silhouette.

```bash
npm i
npx remotion studio                       # preview; each scene is also registered under "Scenes"
npx remotion render GrassdoorAd renders/grassdoor-v3-20s-1080x1920.mp4 --crf=16
```

`remotion.config.ts` points at the local Chromium headless shell with software WebGL (`swangle`).
Set `REMOTION_BROWSER` to use another browser.

## Sound

All audio is generated and mixed in this repo (`tools/`), then played as one master track (`public/audio/mix.wav`).

| Layer | Source | Notes |
| --- | --- | --- |
| Voice-over | Gemini TTS (`gemini-3.1-flash-tts-preview`, voice *Kore*) | Recorded as one take (`audio-src/vo-take.wav`), split at the pauses into `public/audio/vo/vo1–8.wav`, placed per `src/lib/audio.json`. Transcribed back with Gemini to verify every line and the "Grassdoor" pronunciation. |
| Music | Lyria RealTime (`lyria-realtime-exp`), 120 BPM nu-disco / house | `audio-src/lyria-take-b.wav`. Beat grid detected and aligned so beats land on the 6.0 s and 17.0 s bright cuts. Filter-sweep intro, drop-outs before the bright cuts, fade at the end. |
| SFX | Synthesised (`tools/sfx.py`) | Dot drop, outline shimmer, iris whooshes, UI taps, 3D tile plucks, risers and impacts, box rattle and burst, delivery chime, odometer ticks, card swishes, cart tap, logo lock, URL typing. |
| Mix | `tools/mix.py` | VO sidechain-ducks the music; soft clip; two-pass loudnorm to −14 LUFS / −1 dBTP. Stems: `public/audio/stem-{music,vo,sfx}.wav`. |

| VO line | At |
| --- | --- |
| Grassdoor is back. | 0.70 s |
| Explore every category, right from your phone. | 2.62 s |
| California's top brands, unboxed. | 6.55 s |
| Track it live. Delivered on time. | 9.45 s |
| Twenty percent credit back, all October. | 12.15 s |
| Everything you need, in one place. | 14.95 s |
| Fast. Premium. Trusted. | 17.25 s |
| Visit grassdoor dot com. | 19.25 s |

```bash
python3 tools/sfx.py && python3 tools/mix.py      # rebuild SFX + master after changing src/lib/audio.json
```
Regenerating the VO or music needs `GEMINI_API_KEY` (`tools/tts.py`, `tools/lyria_rt.py`, `tools/listen.py` for QA).
