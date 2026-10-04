# Vignesh — 15 s motion showreel

Remotion + Three.js. Structure follows the reference reel (seven chapters,
each named after a motion principle, with a HUD and timecode); the look,
copy and sound are Vignesh's brand from vigneshmurali.com.

| # | Chapter | Time | What happens |
|---|---|---|---|
| 01 | Squash & Stretch | 0.0–2.0 s | The purple planet from his site drops, bounces, swells to fill the frame |
| 02 | Kinetic Type | 2.0–3.7 s | UI/UX. BRAND. MOTION. VIGNESH. — the planet is the full stop, then wipes |
| 03 | Form & Depth | 3.7–5.6 s | Three.js point sphere blooms, re-forms as his V logo — "4 years. 9 disciplines." |
| 04 | Systems & Stagger | 5.6–7.4 s | Dot grid ripples into rounded tiles — "Systems that scale." |
| 05 | Path & Offset | 7.4–9.5 s | Three.js figure-eight ribbon draws in 3D — "From dashboards to motion." |
| 06 | Depth & Speed | 9.5–11.6 s | Three.js ring tunnel accelerates — "Made for tech brands." |
| 07 | Signature | 11.6–15.0 s | Burst into shards, wordmark, PRODUCT DESIGNER — SHOWREEL 2026, vigneshmurali.com |

The score is synthesised by `scripts/make-soundtrack.mjs` (no samples): a
120 bpm bed with every hit, whoosh and riser placed on the picture's timings.

```bash
npm install
node scripts/make-soundtrack.mjs   # writes public/soundtrack.wav
npm run dev                        # Remotion Studio preview
npx remotion render Showreel out/vignesh-showreel.mp4 --codec=h264 --crf=16
```

In a container without Remotion's own Chrome download, point it at a local
headless shell: `REMOTION_BROWSER=/path/to/headless_shell npx remotion render ...`.

Rendered file: `vignesh-showreel.mp4` (1920×1080, 30 fps, H.264 + AAC stereo).
