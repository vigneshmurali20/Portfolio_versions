# Grassdoor is Back — 15s vertical spot (HyperFrames)

`renders/grassdoor-is-back-v2-15s-1080x1920.mp4`: 1080×1920, 30fps, H.264, 15.0s, seamless loop.
Frame 0 and the last frame are both a single seam of light on the silk background.
(`renders/grassdoor-is-back-15s-1080x1920.mp4` is the earlier v1 cut.)

## Motion system (v2)

- **Silk background**: a WebGL satin shader (`#silk`). Every term runs on integer multiples of
  `2π·t/15`, so the background loops exactly. The silk shows through the intro, every transition and the end card.
- **One motif across every match cut**: a "door of light" (the portal), like the persistent dot in the
  benchmark showreel. It runs seam → door → logo icon → full-frame iris → quote card → carousel card →
  closing doors → seam.
- **Kinetic type**: per-glyph rises behind masks, 3D flips on `rotationX`, horizontal slice-lock
  for the hero words (BACK!, IS WAITING.), tracking-in built from per-glyph transforms (no reflow),
  a cylinder word drum, odometer digits, and word-by-word quote reveals.
- Everything that moves is driven by the paused root timeline. Proxies (portal, carousel, van, doors)
  render from the root `onUpdate`, so any seek order produces the same frame.

| Time | Beat | Transition out |
| --- | --- | --- |
| 0.0–1.9 | Seam opens into a door, the door becomes the logo icon, "Grassdoor" spills out glyph by glyph, the icon swings ajar, GRAND REOPENING types on | Door bursts into a full-frame iris, logo glides into the header |
| 2.2–4.6 | WE ARE (3D flip) / BACK! (slice-lock), "we've missed you" written on + underline | Whip-tilt with motion blur |
| 4.4–7.0 | CALIFORNIA'S (tracking-in) / MOST TRUSTED / CANNABIS DELIVERY; Google 4.7 + Leafly 4.8 cards flip up, gloss sweeps, scores count, stars pop; real review quote word by word | **Match cut**: the white quote card morphs into the centre carousel card |
| 7.0–10.4 | YOUR FAVORITE + drum roller (PRE-ROLLS → FLOWER → VAPES → EDIBLES → BRANDS) synced to the 3D coverflow; products rise and turn in 3D with depth satellites and a sheen; ALL IN ONE PLACE | **Match cut**: the BRANDS pill becomes the GRAND REOPENING pill; the carousel flies past camera |
| 10.0–12.8 | City dolly + speed streaks; sticker slaps down in 3D; 20 rolls on odometers, % pops, CREDIT BACK flips in per letter, underline draws, sub-lines rise; caption | **Match cut on rotation**: the sticker spins edge-on, the box spins out of it |
| 12.6–14.4 | YOUR NEXT ORDER / IS WAITING.; box lands with a sheen; delivery route draws, van drives it, pin drops with a ripple; CTA + shine, trust icons, legal | The frame closes like doors back into the seam (loop) |

Assets come from the Figma file "Grassdoor" (page "Figma motion"). The review copy and ratings match its
"Home page visit 9" frame, and the credit dates match "Desktop Banner 1".

```bash
npx hyperframes preview      # Studio
npx hyperframes check
npx hyperframes render -f 30 -q delivery -o renders/grassdoor-is-back-v2-15s-1080x1920.mp4
```
