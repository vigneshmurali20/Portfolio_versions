# Grassdoor is Back — 15s vertical spot (HyperFrames)

`renders/grassdoor-is-back-15s-1080x1920.mp4` — 1080×1920, 30fps, H.264, 15.0s, seamless loop
(the last frame matches frame 0: the doors close back onto "knock, knock…").

| Time | Beat |
| --- | --- |
| 0.0–2.0 | Closed door, "knock, knock…" written on, two knocks, doors swing open on light, logo emerges and glides into the header |
| 2.0–4.4 | WE ARE / BACK! mask reveals over the confetti banner, "we've missed you" written on |
| 4.0–7.0 | CALIFORNIA'S / MOST TRUSTED / CANNABIS DELIVERY; Google 4.7 + Leafly 4.8 cards tilt up, scores and stars count up; review quote |
| 6.6–10.4 | YOUR FAVORITE + word roller (PRE-ROLLS → FLOWER → VAPES → EDIBLES → BRANDS), each word landing with its card in the 3D carousel; products float in |
| 9.8–12.7 | GRAND REOPENING, sticker slap, lettering prints on: 20% counts up, CREDIT BACK letters, brush underline, sub-lines |
| 12.2–15.0 | YOUR NEXT ORDER IS WAITING., box rises, CTA + shine, trust icons, legal; doors close (loop) |

Assets come from the Figma file "Grassdoor" (page "Figma motion"). Derived assets:
`assets/img/cards/*` (cards flattened out of the curved carousel render), `sticker-blank.png`
(printed text removed so the type animates in code), `box-cut.png` / `products/*` (background removed).

```bash
npx hyperframes preview      # Studio
npx hyperframes check
npx hyperframes render -f 30 -q delivery -o renders/grassdoor-is-back-15s-1080x1920.mp4
```
