# ThreeUI Community catalog

104 entries from MengTo/threeui (commit 68802d5). Import names come from `@designcodeio/threeui`. Entries marked "variant of" render the same component as their parent with the listed props.

## Backgrounds

### Predictive Arc — `PredictiveArcCanvas`

Eight animated arc, signal, ribbon, void, and halftone scenes collected in one Canvas 2D, raw-WebGL, and Three.js family.

- Runtime: Canvas 2D + Raw WebGL + Three.js r128
- Interaction: Variant selection plus customizable mode, speed, color, and brightness
- Props (controls):
  - `mode` one of "dark", "light"; default "dark"
  - `speed` number 0–2, default 1
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.4–1.6, default 1
- Variant **Predictive Arc**: The violet predictive pixel arch with a luminous animated core. Props: `{}`
- Variant **Data Pixel Arc**: An emerald pixel horizon with an organic breathing band. Props: `{"variant": "data-pixel"}`
- Variant **Signal Particles**: A dark signal-particle field with soft connective pulses. Props: `{"variant": "signal-particles"}`
- Variant **Override Grid**: A block-by-block override grid with telemetry-orange accents. Props: `{"variant": "override-grid", "size": 48, "gap": 2}`
- Variant **Ribbon Field**: A cyan, indigo, and purple WebGL ribbon field resolved through an animated dot matrix. Props: `{"variant": "ribbon-field"}`
- Variant **Void Field**: A transparent raw-WebGL void field detached from its original article composition. Props: `{"variant": "void-field"}`
- Variant **Halftone Flow**: A red-orange raw-WebGL flow field resolved through its authored six-pixel halftone matrix. Props: `{"variant": "halftone-flow"}`
- Variant **Amber Halftone**: An animated amber-to-white Three.js point field on a dark plane. Props: `{"variant": "amber-halftone"}`

### Liquid Form — `LiquidFormBackground`

A centered silver ray-marched liquid form with authored studio reflections and pointer-responsive camera drift.

- Runtime: Raw WebGL
- Interaction: Smoothed pointer look-at plus customizable material, morph, and tint
- Props (controls):
  - `speed` number 0–2, default 1
  - `morph` number 0–2, default 1
  - `noiseScale` number 0.4–2.5, default 1
  - `mouseAmount` number 0–0.4, default 0.15
  - `metal` number 0.3–1.8, default 1
  - `camera` number 4–7, default 5.5
  - `tintHue` number 0–360, default 220
  - `tintAmount` number 0–1, default 0

### CRT — `CrtBackground`

One sharpened curved-glass CRT tube driving four screens: the Matrix-era boot terminal, a monochrome film leader, a noise-torn blue signal fault, and an 8-bit console title.

- Runtime: Raw WebGL + Canvas 2D
- Interaction: Selectable screen style plus customizable boot speed, CRT motion, hue, brightness, and opacity
- Props (controls):
  - `speed` number 0–2, default 1
  - `typeSpeed` number 0–3, default 1
  - `motion` number 0–2, default 1
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.4–1.8, default 1
  - `opacity` number 0.1–1, default 1
- Variant **Terminal**: The authored 19-row Zion boot log typing itself onto green phosphor, now resolved at the full backing resolution so the glyph cores stay crisp behind the grille. Props: `{"variant": "terminal"}`
- Variant **Cinematic**: A monotone academy leader: letterboxed frame, sweeping countdown dial, scrolling film perforations, registration marks, and a running 24 fps timecode graded to pure luminance. Props: `{"variant": "cinematic"}`
- Variant **Blue Screen**: A retro signal-fault panel on saturated broadcast blue, torn by shader-side transport noise: per-row jitter, a rolling dropout band, head-switching scramble, and heavy static. Props: `{"variant": "blue-screen"}`
- Variant **Nintendo**: An 8-bit console title screen drawn on a 320×180 grid with a hand-authored 5×7 pixel font and nearest-neighbour upscale, so every sprite, brick, and letter lands on a hard pixel edge. Props: `{"variant": "nintendo"}`

### Globe — `GlobeCollection`

The original layered FBM energy sphere with translucent rim glow and depth-aware star field.

- Runtime: Raw WebGL + Canvas 2D
- Interaction: Pointer-responsive energy sphere with visibility-aware animation and customizable motion, scale, palette, and opacity
- Props (controls):
  - `speed` number 0–3, default 1
  - `scale` number 0.5–1.8, default 1
  - `smokeScale` number 0.35–2.5, default 1
  - `smokeStrength` number 0–2, default 1
  - `smokeSpeed` number 0–2.5, default 1
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `glow` number 0–2, default 1
  - `starDensity` number 0–2, default 1
  - `starSpeed` number 0–2, default 1
  - `starSize` number 0.25–2, default 1
  - `brightness` number 0.4–2, default 1
  - `opacity` number 0.1–1, default 1
- Variant **Energy Orb**: The original layered FBM energy sphere with translucent rim glow and depth-aware star field. Props: `{"variant": "energy-orb"}`

### Spark Badge — `SparkBadge`

A luminous credential badge held together by curl-noise embers, carved typography, rain occlusion, waterline sparks, and an adaptive particle field.

- Runtime: Canvas 2D
- Interaction: Live speed, spark, rain, turbulence, and spread controls over the ambient 17-second dissolve/reform cycle
- Props (controls):
  - `speed` number 0–2, default 1
  - `particleAmount` number 0.35–1.4, default 1
  - `rainAmount` number 0–1.5, default 1
  - `turbulence` number 0–2, default 1
  - `spread` number 0.5–1.75, default 1
- Variant **Badge**: The original Codex credential assembled from luminous rain and curl-noise embers. Props: `{}`

### Stream Convergence — `StreamConvergenceBackground`

Three chromatically separated violet wavefronts crossing a rotated fluid field with the exact authored vignette.

- Runtime: Raw WebGL
- Interaction: Customizable motion, fidelity, palette, scale, brightness, and opacity
- Variant of `portal-field`
- Props (controls):
  - `speed` number 0–3, default 1
  - `fidelity` number 0–1, default 0.5
  - `scale` number 0.7–1.4, default 1
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.4–2, default 1
  - `opacity` number 0.1–1, default 1

### Bell Field — `BellFieldBackground`

A Chladni-inspired bell-mode field with authored nodal metal patterns, automatic strike rings, pointer drift, and rising foundry embers.

- Runtime: Raw WebGL + Canvas 2D
- Interaction: Pointer modes, click or timed strikes, and customizable hue and ember field
- Variant of `portal-field`
- Props (controls):
  - `speed` number 0–2, default 1
  - `pointerAmount` number 0–2, default 1
  - `strikeDuration` number 600–5000, default 2400
  - `emberAmount` number 0–1, default 1
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.4–1.8, default 1
  - `opacity` number 0.1–1, default 1

### Flow Field — `FlowField`

A warm Canvas 2D flow field with 2,500 simplex-driven amber, gold, and coral particle trails plus pointer repulsion.

- Runtime: Canvas 2D
- Interaction: Pointer repulsion plus customizable motion, scale, density, opacity, and palette
- Variant of `portal-field`
- Props (controls):
  - `speed` number 0–3, default 1
  - `size` number 0.35–2.5, default 1
  - `length` number 0.35–2.5, default 1
  - `density` number 0.25–2.5, default 1
  - `opacity` number 0.05–1, default 1
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.35–1.65, default 1

### Elements — `ElementsCollection`

Water, lightning, fire, condensation, and a painterly generative tree collected as one elemental family across WebGL2 and Canvas 2D.

- Runtime: Raw WebGL2 + Canvas 2D
- Interaction: Variant selection, pointer-reactive marks and tree wind, speed, scale, particles, palette, and opacity
- Props (controls):
  - `speed` number 0–3, default 1
  - `size` number 0.65–1.5, default 1
  - `particleAmount` number 0–2, default 1
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.35–1.8, default 1
  - `opacity` number 0.1–1, default 1
- Variant **Water**: A refracted OpenAI mark beneath pointer-driven circular ripples, cyan depth, and soft suspended particles. Props: `{"variant": "water"}`
- Variant **Lightning**: Violet fBm arcs crawl around the Anthropic contour while pointer proximity pulls the storm closer. Props: `{"variant": "lightning"}`
- Variant **Fire**: Noise-driven flame ribbons and rising embers lick upward from the Claude mark edge. Props: `{"variant": "fire"}`
- Variant **Condensation**: Transparent droplets grow, merge, fall, and resolve into soft water splash rings. Props: `{"variant": "condensation"}`
- Variant **Generative Tree**: A painterly branching tree grows from warm sienna to golden tips, sways with pointer wind, and sheds soft ambient motes. Props: `{"variant": "generative-tree"}`

### Water Element — `ElementsBackground`

A refracted OpenAI mark beneath pointer-driven circular ripples, cyan depth, and soft suspended particles.

- Runtime: Raw WebGL2
- Interaction: Pointer ripples plus customizable speed, mark size, particles, palette, and opacity
- Variant of `elements`
- Props (controls):
  - `speed` number 0–3, default 1
  - `size` number 0.65–1.5, default 1
  - `particleAmount` number 0–2, default 1
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.35–1.8, default 1
  - `opacity` number 0.1–1, default 1

### Lightning Element — `ElementsBackground`

Violet fBm arcs crawl around the Anthropic contour while pointer proximity pulls the storm closer.

- Runtime: Raw WebGL2
- Interaction: Pointer storm proximity plus customizable speed, mark size, particles, palette, and opacity
- Variant of `elements`
- Props (controls):
  - `speed` number 0–3, default 1
  - `size` number 0.65–1.5, default 1
  - `particleAmount` number 0–2, default 1
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.35–1.8, default 1
  - `opacity` number 0.1–1, default 1

### Fire Element — `ElementsBackground`

Noise-driven flame ribbons and rising embers lick upward from the Claude mark edge.

- Runtime: Raw WebGL2
- Interaction: Pointer stoke and wind plus customizable speed, mark size, particles, palette, and opacity
- Variant of `elements`
- Props (controls):
  - `speed` number 0–3, default 1
  - `size` number 0.65–1.5, default 1
  - `particleAmount` number 0–2, default 1
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.35–1.8, default 1
  - `opacity` number 0.1–1, default 1

### Condensation — `CondensationBackground`

A transparent field of growing condensation bubbles that merge, fall, and resolve into soft water splash rings.

- Runtime: Canvas 2D
- Interaction: Customizable speed, bubble density, and opacity
- Variant of `elements`
- Props (controls):
  - `speed` number 0–3, default 1
  - `dropAmount` number 0.25–2, default 1
  - `opacity` number 0.1–1, default 1

### Generative Tree — `GenerativeTree`

A painterly branching tree grows from warm sienna to golden tips, sways with pointer wind, and sheds soft ambient motes.

- Runtime: Canvas 2D
- Interaction: Pointer wind, click or touch shake, automatic regrowth, and customizable motion, scale, particles, palette, and opacity
- Variant of `elements`
- Props (controls):
  - `speed` number 0–3, default 1
  - `size` number 0.65–1.5, default 1
  - `particleAmount` number 0–2, default 1
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.35–1.8, default 1
  - `opacity` number 0.1–1, default 1

### Ribbon Field — `RibbonFieldBackground`

An exact cyan, indigo, and purple WebGL ribbon field resolved through an animated seven-pixel dot matrix.

- Runtime: Raw WebGL
- Interaction: Smoothed pointer drift plus customizable motion, palette, and contrast
- Variant of `predictive-arc`
- Props (controls):
  - `speed` number 0–3, default 1
  - `pointerAmount` number 0–2, default 1
  - `smoothing` number 0.005–0.15, default 0.035
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.4–2, default 1
  - `opacity` number 0.1–1, default 1

### Cloud Field — `CloudField`

The complete raw-WebGL cloud migration background isolated at its exact source renderer boundary.

- Runtime: Raw WebGL
- Interaction: Authored continuous simulation + optional final-frame palette
- Variant of `portal-field`
- Props (controls):
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.35–1.65, default 1

### Void Field — `VoidField`

The exact transparent raw-WebGL void field, detached from the article and typography around it.

- Runtime: Raw WebGL
- Interaction: Authored continuous simulation + optional final-frame palette
- Variant of `predictive-arc`
- Props (controls):
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.35–1.65, default 1

### Halftone Flow — `HalftoneFlow`

The exact red-orange raw-WebGL flow field resolved through its authored six-pixel halftone matrix.

- Runtime: Raw WebGL
- Interaction: Authored flow animation + optional final-frame palette
- Variant of `predictive-arc`
- Props (controls):
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.35–1.65, default 1

### Constellation Field — `ConstellationField`

A family of particle networks, gateways, interface lines, defense traces, and topographic fields gathered into one configurable collection.

- Runtime: Canvas 2D + Raw WebGL
- Interaction: Variant selection plus customizable mode, speed, size, stroke width, length, density, opacity, and palette
- Props (controls):
  - `mode` one of "dark", "light"; default "dark"
  - `speed` number 0–3, default 1
  - `size` number 0.35–2.5, default 1
  - `strokeWidth` number 0.25–4, default 1
  - `length` number 0.35–2.5, default 1
  - `density` number 0.25–2.5, default 1
  - `opacity` number 0.05–1, default 1
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.35–1.65, default 1
- Variant **Constellation Field**: A drifting particle constellation network with tunable link stroke width over a deep night field. Props: `{}`
- Variant **Particle Drift**: A soft particle drift field lifted from a compute-network hero stage. Props: `{"variant": "particle-drift"}`
- Variant **Particle Network**: A sharp, thin-stroke particle network field with crisp retina trails. Props: `{"variant": "particle-network"}`
- Variant **Gateway Flow**: A black-stage flow canvas with streaming gateway trajectories. Props: `{"variant": "gateway-flow"}`
- Variant **Connectivity Graph**: A light-mode connectivity graph canvas with animated node links. Props: `{"variant": "connectivity-graph"}`
- Variant **Interface Lines**: A faint interface line-field background for dense system UI stages. Props: `{"variant": "interface-lines"}`
- Variant **Defense Lines**: A crimson defense-line canvas field behind a high-contrast hero stage. Props: `{"variant": "defense-lines"}`
- Variant **Topo Field**: A raw-WebGL topography field with flowing elevation bands. Props: `{"variant": "topo-field"}`

### Particle Drift — `ParticleDrift`

A soft particle drift field lifted from a compute-network hero stage.

- Runtime: Canvas 2D
- Interaction: Customizable speed, size, length, density, opacity, and palette
- Variant of `constellation-field`
- Props (controls):
  - `mode` one of "dark", "light"; default "dark"
  - `speed` number 0–3, default 1
  - `size` number 0.35–2.5, default 1
  - `length` number 0.35–2.5, default 1
  - `density` number 0.25–2.5, default 1
  - `opacity` number 0.05–1, default 1
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.35–1.65, default 1

### Particle Network — `ParticleNetwork`

A sharp, thin-stroke particle network field with crisp retina trails.

- Runtime: Canvas 2D
- Interaction: Customizable speed, size, length, density, opacity, and palette
- Variant of `constellation-field`
- Props (controls):
  - `mode` one of "dark", "light"; default "dark"
  - `speed` number 0–3, default 1
  - `size` number 0.35–2.5, default 1
  - `length` number 0.35–2.5, default 1
  - `density` number 0.25–2.5, default 1
  - `opacity` number 0.05–1, default 1
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.35–1.65, default 1

### Portal Field — `PortalFieldCollection`

Five ambient field backgrounds collected across Three.js, raw WebGL, and Canvas 2D renderers.

- Runtime: Three.js r134 + Raw WebGL + Canvas 2D
- Interaction: Variant selection plus customizable motion, geometry, opacity, and palette
- Props (controls):
  - `speed` number 0–3, default 1
  - `size` number 0.35–2.5, default 1
  - `length` number 0.35–2.5, default 1
  - `density` number 0.25–2.5, default 1
  - `opacity` number 0.05–1, default 1
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.35–1.65, default 1
- Variant **Portal Field**: A Three.js ShaderMaterial portal with pointer-reactive fringe light. Props: `{}`
- Variant **Cloud Field**: A raw-WebGL cloud migration background isolated at its source renderer boundary. Props: `{"variant": "cloud-field"}`
- Variant **Flow Field**: Warm amber, gold, and coral particles trace a deterministic simplex-noise field. Props: `{"variant": "flow-field"}`
- Variant **Bell Field**: A Chladni-inspired bell field with nodal metal patterns and rising foundry embers. Props: `{"variant": "bell-field"}`
- Variant **Stream Convergence**: Three chromatically separated violet wavefronts crossing a rotated fluid field. Props: `{"variant": "stream-convergence"}`

### Amber Halftone — `AmberHalftone`

An animated amber-to-white halftone point field on a dark plane.

- Runtime: Three.js r128
- Interaction: Customizable speed, size, length, density, opacity, and palette
- Variant of `predictive-arc`
- Props (controls):
  - `mode` one of "dark", "light"; default "dark"
  - `speed` number 0–3, default 1
  - `size` number 0.35–2.5, default 1
  - `length` number 0.35–2.5, default 1
  - `density` number 0.25–2.5, default 1
  - `opacity` number 0.05–1, default 1
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.35–1.65, default 1

### Laser — `LaserCollection`

Four pointer-reactive laser scenes spanning a preserved matrix junction, atmospheric blade, vanishing array, and halftone relay.

- Runtime: Raw WebGL
- Interaction: Variant selection, smoothed pointer response, reduced-motion stills, and customizable motion, geometry, opacity, and palette
- Props (controls):
  - `speed` number 0–3, default 1
  - `size` number 0.35–2.5, default 1
  - `length` number 0.35–2.5, default 1
  - `density` number 0.25–2.5, default 1
  - `opacity` number 0.05–1, default 1
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.35–1.65, default 1
- Variant **Matrix Junction**: The preserved pointer-reactive three-way matrix junction. Props: `{}`
- Variant **Atmospheric Blade**: A white-hot emerald blade cutting through layered procedural vapor and faint mirage rails. Props: `{"variant": "atmospheric-blade"}`
- Variant **Vanishing Array**: Violet and amber carrier rails accelerate from a pointer-steered horizon origin. Props: `{"variant": "vanishing-array"}`
- Variant **Halftone Relay**: An off-axis cyan relay where vapor resolves into an animated screen-space dot field. Props: `{"variant": "halftone-relay"}`

### Gateway Flow — `GatewayFlow`

A black-stage flow canvas with streaming gateway trajectories.

- Runtime: Canvas 2D
- Interaction: Customizable speed, size, length, density, opacity, and palette
- Variant of `constellation-field`
- Props (controls):
  - `mode` one of "dark", "light"; default "dark"
  - `speed` number 0–3, default 1
  - `size` number 0.35–2.5, default 1
  - `length` number 0.35–2.5, default 1
  - `density` number 0.25–2.5, default 1
  - `opacity` number 0.05–1, default 1
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.35–1.65, default 1

### Connectivity Graph — `ConnectivityGraph`

A light-mode connectivity graph canvas with animated node links.

- Runtime: Canvas 2D
- Interaction: Customizable speed, size, length, density, opacity, and palette
- Variant of `constellation-field`
- Props (controls):
  - `mode` one of "dark", "light"; default "light"
  - `speed` number 0–3, default 1
  - `size` number 0.35–2.5, default 0.35
  - `length` number 0.35–2.5, default 1.5
  - `density` number 0.25–2.5, default 1
  - `opacity` number 0.05–1, default 1
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.35–1.65, default 1

### Interface Lines — `InterfaceLines`

A faint interface line-field background for dense system UI stages.

- Runtime: Canvas 2D
- Interaction: Customizable speed, size, length, density, opacity, and palette
- Variant of `constellation-field`
- Props (controls):
  - `mode` one of "dark", "light"; default "dark"
  - `speed` number 0–3, default 1
  - `size` number 0.35–2.5, default 1
  - `length` number 0.35–2.5, default 1
  - `density` number 0.25–2.5, default 1
  - `opacity` number 0.05–1, default 1
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.35–1.65, default 1

### Defense Lines — `DefenseLines`

A crimson defense-line canvas field behind a high-contrast hero stage.

- Runtime: Canvas 2D
- Interaction: Customizable speed, size, length, density, opacity, and palette
- Variant of `constellation-field`
- Props (controls):
  - `mode` one of "dark", "light"; default "dark"
  - `speed` number 0–3, default 1
  - `size` number 0.35–2.5, default 1
  - `length` number 0.35–2.5, default 1
  - `density` number 0.25–2.5, default 1
  - `opacity` number 0.05–1, default 1
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.35–1.65, default 1

### Topo Field — `TopoField`

A raw-WebGL topography field with flowing elevation bands.

- Runtime: Raw WebGL
- Interaction: Customizable speed, size, length, density, opacity, and palette
- Variant of `constellation-field`
- Props (controls):
  - `mode` one of "dark", "light"; default "dark"
  - `speed` number 0–3, default 1
  - `size` number 0.35–2.5, default 1
  - `length` number 0.35–2.5, default 1
  - `density` number 0.25–2.5, default 1
  - `opacity` number 0.05–1, default 1
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.35–1.65, default 1

## Three.js

### Sylva Living World — `SylvaLivingWorldScene`

The original procedural moss-root world with pale flowers, ferns, drifting pollen, scan light, and a landing butterfly.

- Runtime: Three.js r149
- Interaction: Pointer-driven moss parting, camera parallax, pollen trails, scan-light entrance, and butterfly flight
- Variant **Living Green**: The original procedural moss-root world with pale flowers, ferns, drifting pollen, scan light, and a landing butterfly. Props: `{"variant": "living-green"}`

### Temple Night — `TempleNightScene`

Kage’s procedural Kyoto mountain temple after dark, with the exact authored architecture, rain, mist, leaves, pointer wisps, camera composition, and bloom pipeline.

- Runtime: Three.js r149
- Interaction: Pointer parallax and world-space cursor wisps
- Variant **Temple Night**: Kage’s procedural Kyoto mountain temple after dark, with the exact authored architecture, rain, mist, leaves, pointer wisps, camera composition, and bloom pipeline. Props: `{"variant": "temple-night"}`

### Landscape — `LandscapeScene`

A tower-free procedural terrain whose light, sky, fog, stars, rain, lightning, snow, grass, and stones move through seven authored environment states.

- Runtime: Three.js r149
- Interaction: Pointer parallax, drag-to-orbit, wheel and pinch zoom, with cross-fading time and weather systems
- Needs runtime files in the app's public folder (see SKILL.md)
- Variant **Sunrise**: Low amber light crossing the grass and distant ridges under the source's warm morning sky. Props: `{"variant": "sunrise"}`
- Variant **Noon**: Clear cool daylight with the terrain, moisture colours, stones, and grass at their most legible. Props: `{"variant": "noon"}`
- Variant **Sunset**: The ridges and grass settle into long warm light beneath a deepening six-stop sky. Props: `{"variant": "sunset"}`
- Variant **Night**: Moonlit terrain beneath 39,200 stars constrained to the landscape camera's visible band. Props: `{"variant": "night"}`
- Variant **Rain**: Rain draws in the fog, darkens the ground into puddles, and throws small splashes across the field. Props: `{"variant": "rain"}`
- Variant **Storm**: A dense sideways downpour over sunset light, with close fog and multi-stroke lightning flashes. Props: `{"variant": "storm"}`
- Variant **Snow**: Wind-driven snow settles across the terrain, stones, and grass while a blizzard tightens the horizon. Props: `{"variant": "snow"}`

### Country Towers — `JapaneseTowerLandscape`

Six country-specific towers assembling above a procedural landscape: Japanese, Chinese, Vietnamese, Thai, Khmer, and Ottoman.

- Runtime: Three.js r149 + Canvas 2D
- Interaction: Country selection, automatic 4.4-second construction, pointer orbit, hover parallax, pinch and wheel zoom, and camera reset
- Needs runtime files in the app's public folder (see SKILL.md)
- Variant **Japan**: A Japanese tenshu with an ishigaki stone base, plastered storeys, and flying tiled eaves. Props: `{"country": "japan"}`
- Variant **China**: A Chinese pagoda in vermilion lacquer and green glaze beneath a gilt finial. Props: `{"country": "china"}`
- Variant **Vietnam**: A Vietnamese tháp with seven octagonal Huế lime-wash storeys and lifted tiled eaves. Props: `{"country": "vietnam"}`
- Variant **Thailand**: A Thai prang rising from a stepped plinth into a richly detailed gold spire. Props: `{"country": "thailand"}`
- Variant **Cambodia**: A Khmer prasat on laterite terraces with a redented sanctuary and diminishing sandstone tiers. Props: `{"country": "cambodia"}`
- Variant **Turkey**: An Ottoman mosque with limestone ashlar, İznik tile, a lead dome, and twin pencil minarets. Props: `{"country": "turkey"}`

### Bookshelf — `BookshelfScene`

The exact seven-volume Bookshelf collection with its authored room, carousel shelf, individual cover artwork, foil, pages, inspection, opening, and page-turn system.

- Runtime: Three.js r165
- Interaction: Shelf navigation, volume selection, click-to-inspect, cover drag, paginated leaf drag, orbit, pan, and reset

### Structure Flow — `StructureFlowCollection`

Thirteen authored Three.js field studies collected as one family, spanning particle domes, horizons, orbital systems, matrices, topology, fluid fields, embers, and vortexes.

- Runtime: Three.js r128–r160
- Interaction: Variant-specific pointer, motion, geometry, opacity, mask, and palette controls
- Props (controls):
  - `speed` number 0–3, default 1
  - `pointSize` number 0.02–0.2, default 0.08
  - `opacity` number 0.05–1, default 0.4
  - `maskStart` number 0–0.45, default 0.2
  - `maskSolid` number 0.3–0.8, default 0.5
- Variant **Structure Flow**: A masked white particle dome drifting across a dark field. Props: `{"variant": "structure-flow"}`
- Variant **Emerald Horizon**: A deep emerald shader glow rising from an organic moving horizon. Props: `{"variant": "emerald-horizon"}`
- Variant **Orbital Sphere**: A violet particle synthesis sphere with encrypted orbital rings and luminous data nodes. Props: `{"variant": "orbital-sphere"}`
- Variant **Dot Matrix**: A cyan breathing dot matrix with radial depth fade and smoothed pointer drift. Props: `{"variant": "dot-matrix"}`
- Variant **Expanse Field**: A full-screen ShaderMaterial expanse isolated from its original editorial layout. Props: `{"variant": "expanse-field"}`
- Variant **Logic Core**: An isometric platform, illuminated logic core, and orbiting nodes. Props: `{"variant": "logic-core"}`
- Variant **Dimensional Field**: Dimensional architecture composed from two authored ShaderMaterials. Props: `{"variant": "dimensional-field"}`
- Variant **Data Field**: A global-data Three.js network visual isolated from its dashboard frame. Props: `{"variant": "data-field"}`
- Variant **Topology Field**: A rotating topology graph with connected nodes and rhythmic point pulses. Props: `{"variant": "topology-field"}`
- Variant **Nebula**: An indigo FBM nebula with pointer drift, breathing light, and vignette. Props: `{"variant": "nebula"}`
- Variant **Fluid Field**: A blue-violet animated fluid ShaderMaterial. Props: `{"variant": "fluid-field"}`
- Variant **Ember Storm**: A 12,000-particle ember vortex with additive heat grading and flicker. Props: `{"variant": "ember-storm"}`
- Variant **Flux Vortex**: A blooming particle vortex with spiral filaments and post-process glow. Props: `{"variant": "flux-vortex"}`

### Emerald Horizon — `EmeraldHorizonBackground`

A deep emerald shader glow rising from an organic moving horizon.

- Runtime: Three.js r128
- Interaction: Customizable motion, waves, variation, hue, glow, and vignette
- Variant of `structure-flow`
- Props (controls):
  - `speed` number 0–2, default 1
  - `waveScale` number 0–2.5, default 1
  - `variation` number 0–2, default 1
  - `hue` number -180–180, default 0
  - `glow` number 0.2–2, default 1
  - `vignette` number 0–1, default 1

### Orbital Sphere — `OrbitalSphereBackground`

A violet particle synthesis sphere with six encrypted orbital rings and luminous data nodes.

- Runtime: Three.js r128
- Interaction: Customizable particles, rings, hue, scale, halos, and motion
- Variant of `structure-flow`
- Props (controls):
  - `speed` number 0–3, default 1
  - `particleSize` number 0.005–0.04, default 0.015
  - `particleOpacity` number 0.1–1, default 0.8
  - `orbitOpacity` number 0–0.8, default 0.25
  - `hue` number -180–180, default 0
  - `scale` number 0.6–1.6, default 1
  - `haloOpacity` number 0–1, default 0.2

### Dot Matrix — `DotMatrixBackground`

A cyan breathing dot matrix with radial depth fade and smoothed pointer drift, extracted from the exact Neuform uplink background.

- Runtime: Three.js r128
- Interaction: Smoothed pointer drift plus customizable color and grid pulse
- Variant of `structure-flow`
- Props (controls):
  - `speed` number 0–2, default 1
  - `gridScale` number 20–100, default 60
  - `mouseAmount` number 0–0.12, default 0.04
  - `pulseSpeed` number 0–1.2, default 0.4
  - `hue` number -180–180, default 0
  - `radius` number 0.03–0.3, default 0.15
  - `opacity` number 0.05–1, default 0.35

### Warp Field — `WarpFieldBackground`

Nexus’s focused hero warp: 400 emerald additive streaks and 40 luminous tiles streaming through an authored deep-space fog field.

- Runtime: Three.js r128
- Interaction: Customizable speed, streaks, tiles, color, camera, and brightness
- Props (controls):
  - `speed` number 0–40, default 15
  - `streakOpacity` number 0.05–1, default 0.6
  - `tileOpacity` number 0.05–1, default 0.9
  - `fov` number 45–110, default 75
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.4–2, default 1
- Variant **Warp Field**: The original hero warp: 400 emerald streaks and 40 luminous tiles through deep-space fog. Props: `{}`
- Variant **Letter Storm**: 160 tumbling glyphs wandering off the rails while the streak field keeps the corridor moving. Props: `{"variant": "letters"}`
- Variant **Keycap Drift**: 72 lit mechanical keycaps tumbling through a 900-spark particle wake. Props: `{"variant": "keycaps"}`
- Variant **Hyperspace**: 1,200 ice-blue streaks stretched down a scrolling tunnel toward a pulsing jump core. Props: `{"variant": "hyperspace"}`

### Expanse Field — `ExpanseField`

The exact full-screen Three.js ShaderMaterial expanse isolated without editorial text or navigation.

- Runtime: Three.js r128
- Interaction: Authored animation + optional final-frame palette
- Variant of `structure-flow`
- Props (controls):
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.35–1.65, default 1

### Logic Core — `LogicCoreField`

The exact isometric platform, logic core, orbiting nodes, and source lighting without its card copy.

- Runtime: Three.js r136
- Interaction: Authored orbital motion + optional final-frame palette
- Variant of `structure-flow`
- Props (controls):
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.35–1.65, default 1

### Dimensional Field — `DimensionalField`

The exact dimensional architecture background with both authored ShaderMaterials and complete Three.js scene.

- Runtime: Three.js r128
- Interaction: Pointer-responsive scene + optional final-frame palette
- Variant of `structure-flow`
- Props (controls):
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.35–1.65, default 1

### Data Field — `DataField`

The exact global-data Three.js visual isolated from its dashboard frame and text content.

- Runtime: Three.js r128
- Interaction: Authored scene motion + optional final-frame palette
- Variant of `structure-flow`
- Props (controls):
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.35–1.65, default 1

### Topology Field — `TopologyField`

The exact rotating topology graph, connections, and point pulse system from the selected source.

- Runtime: Three.js r128
- Interaction: Authored rotation and node pulse + optional final-frame palette
- Variant of `structure-flow`
- Props (controls):
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.35–1.65, default 1

### Woven Cloth — `WovenCloth`

A Three.js woven-cloth simulation with Woven Cloth typography printed into its procedural textile so every letter deforms with the fabric, and three companion cloths woven around the same Verlet sheet.

- Runtime: Three.js r160
- Interaction: Variant selection; typography deforms with the authored textile motion + optional final-frame palette
- Props (controls):
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.35–1.65, default 1
- Variant **Woven Cloth**: The packaged Neuform export, untouched: an ivory banner with a crimson hem and the Woven Cloth wordmark printed into the weave, pinned along its top edge. Props: `{}`
- Variant **Iridescent Silk**: A five-harness satin under a painted studio environment: a thin-film interference layer whose thickness sweeps one full order across the width, so the colour travels over the folds while the wordmark stays a tone-on-tone jacquard. Props: `{"variant": "iridescent"}`
- Variant **Atelier Flag**: The same sheet cut and sewn: three linen panels joined by flat-felled seams and topstitching, an indigo heading tape on the hoist with brass grommets and a mast, hemmed at the fly, and a woven label tacked on at the corner. Props: `{"variant": "atelier"}`
- Variant **Washi Noren**: An indigo-dyed kozo noren on a wooden rod, backlit through a shoji: laid and chain lines from the papermaking screen, a torn deckle edge cut by an alpha mask, and slits that free three panels to sway on their own. Props: `{"variant": "washi"}`

### Nebula — `NebulaBackground`

The exact indigo Three.js ShaderMaterial nebula with four-octave FBM, pointer drift, breathing light, and vignette.

- Runtime: Three.js r128
- Interaction: Smoothed pointer drift + optional final-frame palette
- Variant of `structure-flow`
- Props (controls):
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.35–1.65, default 1

### Fluid Field — `FluidFieldBackground`

A blue-violet fluid ShaderMaterial, isolated from the surrounding editor interface.

- Runtime: Three.js r128
- Interaction: Authored fluid animation + optional final-frame palette
- Variant of `structure-flow`
- Props (controls):
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.35–1.65, default 1

### Ember Storm — `EmberStorm`

The exact 12,000-particle Three.js ember vortex with additive heat grading, flicker, and visibility-aware lifecycle.

- Runtime: Three.js r160
- Interaction: Authored vortex motion + optional final-frame palette
- Variant of `structure-flow`
- Props (controls):
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.35–1.65, default 1

### Flux Vortex — `FluxVortex`

A blooming Three.js particle vortex with spiral filaments and post-process glow.

- Runtime: Three.js r160
- Interaction: Customizable speed, size, length, density, opacity, and palette
- Variant of `structure-flow`
- Props (controls):
  - `speed` number 0–3, default 1
  - `size` number 0.35–2.5, default 1
  - `length` number 0.35–2.5, default 1
  - `density` number 0.25–2.5, default 1
  - `opacity` number 0.05–1, default 1
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.35–1.65, default 1

## Hero

### Complete Shelf — `CompleteShelfLandingPage`

The complete Working Volumes bookshelf page with all seven tools, its responsive editorial interface, and authored Three.js presentation.

- Runtime: Full HTML + DOM/CSS + Three.js r165
- Interaction: Original pointer, keyboard, scroll, navigation, and book interactions
- Needs runtime files in the app's public folder (see SKILL.md)
- Props (controls):
  - `headingFont` one of "iowan-old-style", "instrument-serif", "newsreader", "geist"; default "iowan-old-style"
  - `bodyFont` one of "inter", "geist", "newsreader", "instrument-serif"; default "inter"
  - `headingWeight` one of "400", "500", "600"; default "400"
  - `bodyWeight` one of "400", "500", "600"; default "400"
  - `primaryColor` color, default "#c87046"
  - `headingSize` number 32–88, default 60
  - `bodySize` number 10–18, default 12
  - `headingLetterSpacing` number -0.1–0.08, default -0.055

### Bestsellers Book Showcase — `BestsellersBookShowcase`

The complete Field Manuals book showcase, preserved unchanged with its editorial layout, authored motion, interactions, and embedded media.

- Runtime: Full HTML + DOM/CSS + embedded media
- Interaction: Original pointer, keyboard, scroll, navigation, and showcase interactions
- Needs runtime files in the app's public folder (see SKILL.md)
- Props (controls):
  - `headingFont` one of "iowan-old-style", "instrument-serif", "newsreader", "geist"; default "iowan-old-style"
  - `bodyFont` one of "iowan-old-style", "geist", "newsreader", "instrument-serif"; default "iowan-old-style"
  - `headingWeight` one of "400", "500", "600", "700"; default "500"
  - `bodyWeight` one of "400", "500", "600", "700"; default "400"
  - `primaryColor` color, default "#c3a47b"
  - `headingSize` number 184–420, default 325
  - `bodySize` number 12–24, default 17
  - `headingLetterSpacing` number -0.12–0.08, default -0.085

### Sylva — `SylvaHero`

The complete Sylva Living Green page, preserved with its Three.js scene, local typography, card imagery, and embedded liquid-metal buttons. The moss-root world with pale flowers, ferns, drifting pollen, the landing butterfly, and native liquid-metal controls behind the full hero layout.

- Runtime: Full HTML + DOM/CSS + local Three.js
- Interaction: Original pointer, hover, scroll, and responsive scaling
- Needs runtime files in the app's public folder (see SKILL.md)
- Props (controls):
  - `headingFont` one of "lexend", "instrument-serif", "newsreader", "geist"; default "lexend"
  - `bodyFont` one of "lexend", "geist", "newsreader", "instrument-serif"; default "lexend"
  - `headingWeight` one of "200", "300", "400", "500", "600"; default "300"
  - `bodyWeight` one of "200", "300", "400", "500"; default "300"
  - `primaryColor` color, default "#ffffff"
  - `headingSize` number 40–92, default 63
  - `bodySize` number 12–24, default 16.5
  - `headingLetterSpacing` number -0.06–0.12, default -0.006
- Variant **Living Green**: The moss-root world with pale flowers, ferns, drifting pollen, the landing butterfly, and native liquid-metal controls behind the full hero layout. Props: `{"variant": "living-green"}`

## Landing Pages

### Kage — `KageLandingPage`

The complete authored Kage temple experience, preserved as an interactive full-page document with its original navigation, scroll scenes, and local Three.js world.

- Runtime: Full HTML + DOM/CSS + Three.js
- Interaction: Original pointer, keyboard, scroll, and navigation interactions
- Needs runtime files in the app's public folder (see SKILL.md)
- Props (controls):
  - `headingFont` one of "onest", "instrument-serif", "newsreader", "geist"; default "onest"
  - `bodyFont` one of "onest", "geist", "newsreader", "instrument-serif"; default "onest"
  - `headingWeight` one of "400", "500", "600", "700"; default "400"
  - `bodyWeight` one of "300", "400", "500", "600"; default "300"
  - `primaryColor` color, default "#e0231c"
  - `headingSize` number 30–72, default 46
  - `bodySize` number 13–24, default 17
  - `headingLetterSpacing` number -0.06–0.12, default -0.012

### Sketchbook — `MengToSketchbookLandingPage`

A tactile personal portfolio built as a Singapore sketchbook, with nine illustrated plates, curled page turns, a draggable magnifying glass, zoom controls, a botanical paper atmosphere, and an editorial index.

- Runtime: Full HTML + DOM/CSS + JavaScript
- Interaction: Original page turns, pointer tilt, draggable magnifier, zoom controls, navigation, scroll, keyboard, and responsive layout
- Needs runtime files in the app's public folder (see SKILL.md)
- Props (controls):
  - `headingFont` one of "instrument-serif", "newsreader", "geist"; default "instrument-serif"
  - `bodyFont` one of "newsreader", "geist", "instrument-serif"; default "newsreader"
  - `headingWeight` one of "300", "400", "500", "600"; default "400"
  - `bodyWeight` one of "200", "300", "400", "500", "600"; default "400"
  - `primaryColor` color, default "#2b2721"
  - `headingSize` number 20–48, default 30
  - `bodySize` number 14–30, default 20
  - `headingLetterSpacing` number -0.06–0.12, default 0.01

## Sections

### Editorial Intro — `EditorialIntroSection`

A centered editorial intro built around a dimly lit device illustration, circuit traces, and oversized gradient typography.

- Runtime: DOM + CSS
- Interaction: Subtle device float and circuit drift with reduced-motion fallback
- Variant of `saas-dark`

### Newsletter Footer — `NewsletterFooterSection`

A dark unbranded product footer with an inline newsletter form, oversized closing phrase, and compact legal navigation.

- Runtime: DOM + CSS
- Interaction: Email validation and animated inline success state
- Variant of `saas-dark`

## Text Animation

### Typography Vortex — `TypographyVortexCanvas`

Sable’s complete rotating typography vortex with crisp prerendered rings, drifting glyphs, pointer dissolution, particle dust, and click suction — with dark and light surfaces.

- Runtime: Canvas 2D
- Interaction: Mode, pointer dissolve, ambient dust, click suction, responsive rings, and reduced motion
- Props (controls):
  - `mode` one of "dark", "light"; default "dark"
  - `speed` number 0–3, default 1
  - `ringGrowth` number 1.1–1.4, default 1.21
  - `opacity` number 0.2–1, default 1
  - `dissolveRadius` number 0.5–1.5, default 1
  - `particleAmount` number 0.1–2, default 1
  - `suctionDuration` number 300–1600, default 920

### Semantic Bloom — `SemanticBloom`

A customizable Codex wordmark that draws a viscous particle organism toward its letters, illuminating the text as the network searches and reconnects.

- Runtime: Canvas 2D + DOM/CSS
- Interaction: Pointer attraction, live text and size controls, synchronized light/dark mode, visibility pausing, and reduced-motion still frame
- Props (controls):
  - `mode` one of "dark", "light"; default "dark"
  - `text` text, default "Codex"
  - `size` number 0.55–1.6, default 1
  - `opacity` number 0.1–1, default 1

### Text Path Studies — `TextPathStudies`

Six interactive Canvas 2D typography studies spanning a globe, flowing outlines, morphing glyphs, cloth physics, ripples, and a particle sphere.

- Runtime: Canvas 2D
- Interaction: Variant-specific drag, zoom, hover, click, morph, cloth, ripple, and particle interactions
- Props (controls):
  - `mode` one of "dark", "light"; default "dark"
  - `scale` number 0.65–1.5, default 1
  - `opacity` number 0.1–1, default 1
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.4–1.8, default 1
- Variant **Globe Type Study**: A typographic world sphere with drag rotation, wheel zoom, pointer lighting, and click-to-pin markers. Props: `{}`
- Variant **Outline Typeflow**: Letters trace a multi-loop outline with hover acceleration, illumination, and click-burst particles. Props: `{"variant": "outline-typeflow"}`
- Variant **Morphing Glyph Cloud**: A paired glyph field morphs between radial silhouettes with breathing motion, scatter, and pointer repulsion. Props: `{"variant": "morphing-glyph-cloud"}`
- Variant **Cloth**: A Verlet sheet of letters responds to pointer wind and direct grabbing while its live weave deforms every glyph. Props: `{"variant": "cloth-study"}`
- Variant **Ripple**: Clicks send overlapping weighted wavefronts through a seeded 24 × 24 typographic grid. Props: `{"variant": "ripple-study"}`
- Variant **Ball**: A depth-sorted glyph sphere accelerates on hover and sheds click-hit letters before regrowing its surface. Props: `{"variant": "ball-study"}`

### Outline Typeflow — `OutlineTypeflow`

A continuous ring of letters traces a multi-loop symbol outline, accelerating under the pointer and bursting outward on click.

- Runtime: Canvas 2D
- Interaction: Hover acceleration and illumination, click burst, and optional outer-frame scale and palette
- Variant of `globe-study`
- Props (controls):
  - `mode` one of "dark", "light"; default "dark"
  - `scale` number 0.65–1.5, default 1
  - `opacity` number 0.1–1, default 1
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.4–1.8, default 1

### Morphing Glyph Cloud — `MorphingGlyphCloud`

A paired field of alphanumeric glyphs morphs between two radial symbol silhouettes with a lifted mid-turn scatter and pointer repulsion.

- Runtime: Canvas 2D
- Interaction: Click to morph, pointer repulsion, autonomous glyph breathing, and optional outer-frame scale and palette
- Variant of `globe-study`
- Props (controls):
  - `mode` one of "dark", "light"; default "dark"
  - `scale` number 0.65–1.5, default 1
  - `opacity` number 0.1–1, default 1
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.4–1.8, default 1

### Cloth — `ClothStudy`

A Verlet sheet of letters hangs from six pegs, shearing every glyph with the live weave while pointer wind and direct grabbing deform the cloth.

- Runtime: Canvas 2D
- Interaction: Pointer wind, direct cloth grabbing, fixed-step constraints, and optional outer-frame scale and palette
- Variant of `globe-study`
- Props (controls):
  - `mode` one of "dark", "light"; default "dark"
  - `scale` number 0.65–1.5, default 1
  - `opacity` number 0.1–1, default 1
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.4–1.8, default 1

### Ripple — `RippleStudy`

A full-frame 24 × 24 glyph field where clicks send weighted typographic wavefronts through the seeded character grid on synchronized light and dark surfaces.

- Runtime: Canvas 2D
- Interaction: Click-triggered overlapping ripples with optional scale and palette
- Variant of `globe-study`
- Props (controls):
  - `mode` one of "dark", "light"; default "dark"
  - `scale` number 0.65–1.5, default 1
  - `opacity` number 0.1–1, default 1
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.4–1.8, default 1

### Ball — `BallStudy`

A full-frame sphere of 1,900 depth-sorted glyphs with hover acceleration and click-hit letters that break loose, fall, and regrow on synchronized light and dark surfaces.

- Runtime: Canvas 2D
- Interaction: Hover acceleration, click-hit glyph particles, sphere regrowth, and optional scale and palette
- Variant of `globe-study`
- Props (controls):
  - `mode` one of "dark", "light"; default "dark"
  - `scale` number 0.65–1.5, default 1
  - `opacity` number 0.1–1, default 1
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.4–1.8, default 1

### Intro Text — `ThreeUIIntro`

The opening chromatic wordmark assembly, reduced to its first beat and rebranded with the ThreeUI wave mark and name.

- Runtime: DOM + CSS
- Interaction: The authored opening beat loops with a short final hold + synchronized light/dark mode and optional final-frame palette
- Variant of `article-headings`
- Props (controls):
  - `mode` one of "dark", "light"; default "dark"
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.35–1.65, default 1

### Particle Wordmark — `ParticleWordmark`

The Shaders wordmark materializes through a seeded field of drifting dots and squares, isolated from the source footer and synchronized across light and dark surfaces.

- Runtime: Canvas 2D
- Interaction: Seeded eight-second particle cycle with reduced-motion support, responsive sizing, and synchronized light/dark mode
- Variant of `article-headings`
- Props (controls):
  - `mode` one of "dark", "light"; default "dark"
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.35–1.65, default 1

### Audio Wordmark — `AudioWordmark`

A portrait audio identity scene pairing two animated circular bar fields with a compact ThreeUI wordmark and icon lockup in synchronized light and dark modes.

- Runtime: Canvas 2D + DOM/CSS
- Interaction: The first authored identity scene loops every 4.7 seconds with responsive portrait scaling and synchronized light/dark mode
- Variant of `article-headings`
- Props (controls):
  - `mode` one of "dark", "light"; default "dark"
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.35–1.65, default 1

### Gallery Heading — `GalleryHeading`

An oversized headline ringed by twelve 4:3 plates — one flat colour each, shaded by a procedural noise field rather than a gradient — that hold still until the pointer arrives, then orbit. Four galleries, each with its own field, typography, and direction.

- Runtime: Canvas 2D
- Interaction: The ring rests until a pointer is over it, then comes up to one orbit every 15 seconds — eased in three galleries, sprung in the matte one — and settles back to a stop on leave
- Props (controls):
  - `mode` one of "dark", "light"; default "dark"
  - `font` one of "serif", "didone", "oldstyle", "sans"; default "sans"
  - `weight` one of "400", "700"; default "400"
  - `headlineSize` number 0.6–1.8, default 1.15
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.35–1.65, default 1
- Variant **Matte Rise**: Muted museum plates under one slow rise of noise, a light sans on wide tracking, and an ascending ring that springs up to speed instead of easing. Props: `{"variant": "rising-diagonal"}`
- Variant **Glitch Fall**: Broadcast colour torn into flat blocks and slipped rows, with the headline breaking up into two channels over a descending counter-orbit. Props: `{"variant": "falling-diagonal"}`
- Variant **Riso Sweep**: Print colour dithered to three tones over a lit corner, scanlines and heavy grain, under an old-style serif standing on a hard offset plate. Props: `{"variant": "horizontal-sweep"}`
- Variant **Halftone Loop**: One ink on one stock, shaded only by the size of the dots on a rotated screen, under a high-contrast didone on a tall reverse loop. Props: `{"variant": "vertical-loop"}`

### Neon Typography — `NeonTypography`

Hand-shaped neon lettering animated with a slow typographic breath and recurring electrical flicker — tubing geometry, electrodes, and bloom on a neutral field.

- Runtime: Canvas 2D
- Interaction: Continuous typographic breath + recurring electrical flicker + synchronized monochrome dark/light mode
- Variant of `article-headings`
- Props (controls):
  - `mode` one of "dark", "light"; default "dark"
  - `brightness` number 0.7–1.3, default 1

### Article Headings — `TextAnimationCollection`

Three expressive text treatments collected in one family: a chromatic intro, a particle wordmark, and an audio-reactive identity lockup.

- Runtime: DOM/CSS + Canvas 2D
- Interaction: Authored text motion with responsive presentation, reduced-motion handling, and synchronized light/dark mode
- Props (controls):
  - `mode` one of "dark", "light"; default "dark"
  - `duration` number 150–1600, default 560
  - `stagger` number 0–500, default 140
  - `scrambleLength` number 1–20, default 10
  - `preserveChance` number 0–1, default 0.3
  - `tailChance` number 0–1, default 0.18
- Variant **Intro Text**: The opening chromatic ThreeUI wordmark assembly, isolated to its first authored beat. Props: `{"variant": "threeui-intro"}`
- Variant **Particle Wordmark**: The Shaders wordmark materializes through a seeded field of drifting dots and squares. Props: `{"variant": "particle-wordmark"}`
- Variant **Audio Wordmark**: Animated circular audio-bar fields paired with a compact ThreeUI wordmark and icon lockup. Props: `{"variant": "audio-wordmark"}`

## Buttons

### Shader Buttons — `ShaderButtons`

Six authored shader and canvas button treatments collected into one interactive family.

- Runtime: Raw WebGL + Canvas 2D + CSS
- Interaction: Variant selection with authored pointer, hover, motion, and palette behavior
- Props (controls):
  - `mode` one of "dark", "light"; default "dark"
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.35–1.65, default 1
- Variant **Star Portal**: Two drifting Canvas 2D star fields with an authored holographic pill button. Props: `{}`
- Variant **Ignition**: A raw-WebGL ambient field with a tactile ignition control. Props: `{"variant": "ignition-button"}`
- Variant **Induction**: A kinetic ambient field paired with a raw-WebGL induction button. Props: `{"variant": "induction-button"}`
- Variant **Plasma**: A deep-blue laboratory field with a luminous plasma control. Props: `{"variant": "plasma-button"}`
- Variant **Tactile**: A fluid ambient background with a tactile raw-WebGL button. Props: `{"variant": "tactile-button"}`
- Variant **Thinking**: A luminous Canvas 2D trace orbiting a softly raised blue button. Props: `{"variant": "thinking-button"}`

### Ignition Button — `IgnitionButton`

The exact raw-WebGL ambient field and tactile ignition button, without the surrounding terminal page.

- Runtime: Raw WebGL + CSS
- Interaction: Pointer-responsive shader button + optional final-frame palette
- Variant of `star-portal`
- Props (controls):
  - `mode` one of "dark", "light"; default "dark"
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.35–1.65, default 1

### Induction Button — `InductionButton`

The exact kinetic induction background and raw-WebGL button isolated as one interactive effect.

- Runtime: Raw WebGL + Canvas 2D
- Interaction: Pointer-driven kinetic button + optional final-frame palette
- Variant of `star-portal`
- Props (controls):
  - `mode` one of "dark", "light"; default "dark"
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.35–1.65, default 1

### Plasma Button — `PlasmaButton`

The exact deep-blue laboratory field and luminous plasma button with its complete authored shader pair.

- Runtime: Raw WebGL
- Interaction: Pointer-responsive plasma button + optional final-frame palette
- Variant of `star-portal`
- Props (controls):
  - `mode` one of "dark", "light"; default "dark"
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.35–1.65, default 1

### Tactile Button — `TactileButton`

The exact fluidic ambient background and tactile raw-WebGL button, isolated from page content.

- Runtime: Raw WebGL + Canvas 2D
- Interaction: Pointer-responsive fluid button + optional final-frame palette
- Variant of `star-portal`
- Props (controls):
  - `mode` one of "dark", "light"; default "dark"
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.35–1.65, default 1

### Thinking Button — `ThinkingButton`

A Canvas 2D thinking state with a luminous blue trace orbiting a softly raised blue button.

- Runtime: Canvas 2D
- Interaction: Continuous thinking trace, synchronized light/dark surfaces, and optional final-frame palette
- Variant of `star-portal`
- Props (controls):
  - `mode` one of "dark", "light"; default "dark"
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.35–1.65, default 1

### Sliding Text CTA — `SlidingTextCta`

A dark pill CTA whose label slides, blurs, and resolves into a crisp duplicate on hover.

- Runtime: DOM + CSS
- Interaction: Hover lift, sliding text swap, blur, and bottom-light reveal
- Variant of `rectangle-buttons`
- Props (controls):
  - `mode` one of "dark", "light"; default "dark"
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.35–1.65, default 1

### Floating Dots CTA — `FloatingDotsCta`

A saturated blue CTA with a glass highlight and a continuous stream of floating light points.

- Runtime: DOM + CSS
- Interaction: Floating particles, press scale, and arrow CTA
- Variant of `rectangle-buttons`
- Props (controls):
  - `mode` one of "dark", "light"; default "dark"
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.35–1.65, default 1

### Launch Button — `LaunchButton`

A warm amber launch control with tactile depth, a soft aura, and a compact lightning icon.

- Runtime: DOM + CSS
- Interaction: Hover aura and pressed-depth response
- Variant of `rectangle-buttons`
- Props (controls):
  - `mode` one of "dark", "light"; default "dark"
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.35–1.65, default 1

### Dot Border Button — `DotBorderButton`

A bright creation CTA framed by four corner dots and sequentially drawn dashed border segments.

- Runtime: DOM + CSS
- Interaction: Sequenced corner-dot and border-line hover animation
- Variant of `rectangle-buttons`
- Props (controls):
  - `mode` one of "dark", "light"; default "dark"
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.35–1.65, default 1

### Gradient CTA — `GradientCta`

A sunlit amber pill CTA with inset highlights, deep elevation, and a rising hover sheen.

- Runtime: DOM + CSS
- Interaction: Rising highlight overlay and responsive shadow
- Variant of `rectangle-buttons`
- Props (controls):
  - `mode` one of "dark", "light"; default "dark"
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.35–1.65, default 1

### Spinning Border Button — `SpinningBorderButton`

A compact graphite CTA that replaces its static edge with a rotating white border beam on hover.

- Runtime: DOM + CSS
- Interaction: Hover lift, border spin, text brightening, and arrow shift
- Variant of `rectangle-buttons`
- Props (controls):
  - `mode` one of "dark", "light"; default "dark"
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.35–1.65, default 1

### Glassmorphism CTA — `GlassmorphismCta`

A glass pill CTA with a revolving highlight, advisor portrait, and a glowing generative-action icon.

- Runtime: DOM + CSS
- Interaction: Continuous border shimmer, hover scale, and glow
- Variant of `rectangle-buttons`
- Props (controls):
  - `mode` one of "dark", "light"; default "dark"
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.35–1.65, default 1

### Generate Button — `GenerateButton`

A glossy generate control with prismatic borders, animated lettering, and an illuminated sparkle icon.

- Runtime: DOM + CSS
- Interaction: Generate-to-generating text transition and hover illumination
- Variant of `rectangle-buttons`
- Props (controls):
  - `mode` one of "dark", "light"; default "dark"
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.35–1.65, default 1

### Gradient Pill Button — `GradientPillButton`

A restrained metallic lesson pill with a masked gradient edge, soft elevation, and arrow icon.

- Runtime: DOM + CSS
- Interaction: Subtle surface and text hover response
- Variant of `rectangle-buttons`
- Props (controls):
  - `mode` one of "dark", "light"; default "dark"
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.35–1.65, default 1

### Gradient Beam CTA — `GradientBeamCta`

A dark builder CTA with a rotating orange edge beam, drifting dot texture, and responsive glow.

- Runtime: DOM + CSS
- Interaction: Continuous beam and dot motion with hover scale, glow, and arrow shift
- Variant of `rectangle-buttons`
- Props (controls):
  - `mode` one of "dark", "light"; default "dark"
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.35–1.65, default 1

### Rectangle Buttons — `RectangleButtons`

Twenty-two authored rectangle-button and animated CTA treatments collected into one family.

- Runtime: DOM + CSS
- Interaction: Variant selection with authored hover, focus, motion, and palette behavior
- Props (controls):
  - `mode` one of "dark", "light"; default "dark"
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.35–1.65, default 1
- Variant **Dark Glass**: A deep charcoal glass rectangle with a softly revolving inner highlight and restrained metallic type. Props: `{}`
- Variant **Launch Button**: A warm amber launch control with tactile depth, a soft aura, and a compact lightning icon. Props: `{"variant": "launch-button"}`
- Variant **Dot Border Button**: A bright creation CTA framed by four corner dots and sequentially drawn dashed border segments. Props: `{"variant": "dot-border-button"}`
- Variant **Floating Dots CTA**: A saturated blue CTA with a glass highlight and a continuous stream of floating light points. Props: `{"variant": "floating-dots-cta"}`
- Variant **Sliding Text CTA**: A dark rectangle CTA whose label slides, blurs, and resolves into a crisp duplicate on hover. Props: `{"variant": "sliding-text-cta"}`
- Variant **Gradient Beam CTA**: A dark builder CTA with a rotating orange edge beam, drifting dot texture, and responsive glow. Props: `{"variant": "gradient-beam-cta"}`
- Variant **Gradient Pill Button**: A restrained metallic lesson control with a masked gradient edge, soft elevation, and arrow icon. Props: `{"variant": "gradient-pill-button"}`
- Variant **Generate Button**: A glossy generate control with prismatic borders, animated lettering, and an illuminated sparkle icon. Props: `{"variant": "generate-button"}`
- Variant **Glassmorphism CTA**: A glass CTA with a revolving highlight, advisor portrait, and a glowing generative-action icon. Props: `{"variant": "glassmorphism-cta"}`
- Variant **Spinning Border Button**: A compact graphite CTA that replaces its static edge with a rotating white border beam on hover. Props: `{"variant": "spinning-border-button"}`
- Variant **Gradient CTA**: A sunlit amber CTA with inset highlights, deep elevation, and a rising hover sheen. Props: `{"variant": "gradient-cta"}`
- Variant **Lumen CTA**: The authored six-stop violet gradient pill with its inner highlight, cast glow, and trailing open ring. Props: `{"variant": "lumen-cta"}`
- Variant **Lumen CTA Ghost**: The authored sibling pill with the same geometry, a blurred glass fill, and a hairline outline. Props: `{"variant": "lumen-cta-ghost"}`
- Variant **Trochil Signal**: The selected Trochil request-access treatment: a restrained black technical rectangle with a fine lit edge and passing warm signal sheen. Props: `{"variant": "trochil-signal"}`
- Variant **Attune Thermal**: The selected Attune primary action with a compact orange thermal gradient, inset highlight, grounded glow, and chevron. Props: `{"variant": "attune-thermal"}`
- Variant **Tideform Outline**: The selected Tideform action: a square technical outline with tracked mono type, warm hover state, and a long directional arrow. Props: `{"variant": "tideform-outline"}`
- Variant **Understory Arrow Pill**: The selected Understory action with a violet capsule surface and an inset paper-toned circular arrow endcap. Props: `{"variant": "understory-arrow-pill"}`
- Variant **Meridian Keycap Primary**: The selected Meridian primary action rebuilt as a blue illuminated keycap with a physical base, LED, and pressed hover travel. Props: `{"variant": "meridian-keycap-primary"}`
- Variant **Meridian Keycap Secondary**: The selected Meridian secondary action using the same tactile keycap geometry in its graphite night-side treatment. Props: `{"variant": "meridian-keycap-secondary"}`
- Variant **Halvorsen Arrow Pill**: The selected Halvorsen action: the shared editorial arrow-pill structure recut as a bone-white capsule with a black inset arrow disc. Props: `{"variant": "halvorsen-arrow-pill"}`
- Variant **Aster Glass Access**: The compact Aster navigation action with a translucent smoke surface, masked crystalline edge, top sheen, and restrained hover lift. Props: `{"variant": "aster-glass-access"}`
- Variant **Aster Glass Arrow**: The Aster primary CTA using the same glass material with a bordered inset chip and a directional arrow that advances on hover. Props: `{"variant": "aster-glass-arrow"}`

### Circle Buttons — `CircleButtons`

Three compact circular icon controls using the exact Dark Glass, Launch, and Dot Border material systems.

- Runtime: DOM + CSS
- Interaction: Source-faithful hover and press behavior, focus-visible ring, reduced-motion fallback, and adaptive light/dark palette
- Props (controls):
  - `mode` one of "dark", "light"; default "dark"
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.35–1.65, default 1
- Variant **Play**: The Dark Glass rectangle reduced to a compact circle with its original charcoal surface, masked edge, and moving conic light. Props: `{}`
- Variant **Plus**: The Launch rectangle's exact amber gradient, 4px base, soft aura, and 2px pressed state around a centered plus glyph. Props: `{"variant": "plus"}`
- Variant **Mail**: The Dot Border rectangle's transparent face, blue hover fill, four moving corner dots, and sequential dashed frame around a mail glyph. Props: `{"variant": "mail"}`

### Liquid Metal Button — `LiquidMetalButton`

A prismatic liquid-metal control in Sign up pill, Liquid Orb, and configurable Play Circle variants, with pointer-following bloom and press ripples.

- Runtime: Raw WebGL 2 + DOM/CSS
- Interaction: Hover, focus, pointer-dragged metal, faceted press ripples, and Enter/Space activation
- Variant **Play Circle**: A compact icon-only play control with configurable finish, diameter, outline, and accessible label. Props: `{"variant": "play"}`
- Variant **Sign up Pill**: The original authored liquid-metal Sign up pill with its complete spectral field, bloom, pointer well, and faceted press ripple. Props: `{"variant": "pill"}`
- Variant **Liquid Orb**: The exact liquid-metal WebGL field measured through a compact 56–72px circular plus control, preserving every original interaction and post-process pass. Props: `{"variant": "circle"}`

### Lumen CTA — `LumenCta`

The Lumen call-to-action pill: a six-stop violet gradient running black to lilac, a hairline inner highlight, a soft cast glow, and the small open ring that trails the label.

- Runtime: DOM + CSS
- Interaction: Hover brightness lift, focus-visible ring, and disabled state
- Variant of `rectangle-buttons`
- Props (controls):
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.35–1.65, default 1

## UI Elements

### Character Carousel — `CharacterCarousel`

Two authored editorial character-card carousels collected as a light filmstrip and a dark responsive wave.

- Runtime: DOM + CSS
- Interaction: Pointer focus, wheel and arrow navigation, card selection, idle drift, responsive orientation, scale, speed, opacity, and palette
- Props (controls):
  - `speed` number 0–2.5, default 1
  - `scale` number 0.7–1.3, default 1
  - `opacity` number 0.1–1, default 1
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.35–1.65, default 1
- Variant **Filmstrip**: A warm editorial card deck with framed portraits, numbered identity footers, paper grain, and a deep looping perspective rail. Props: `{"variant": "filmstrip"}`
- Variant **Wave**: A dark dimensional card wave with colored profile tiles, responsive horizontal-to-vertical motion, and orientation toggling. Props: `{"variant": "wave"}`

### Character Filmstrip — `CharacterFilmstrip`

A warm editorial character filmstrip with framed portraits, numbered identity footers, paper grain, and a looping perspective rail.

- Runtime: DOM + CSS
- Interaction: Pointer focus, wheel and arrow navigation, card selection, idle drift, scale, speed, opacity, and palette
- Variant of `character-carousel`
- Props (controls):
  - `speed` number 0–2.5, default 1
  - `scale` number 0.7–1.3, default 1
  - `opacity` number 0.1–1, default 1
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.35–1.65, default 1

### Character Wave — `CharacterWave`

A dark dimensional character-card wave with colored tiles, responsive horizontal-to-vertical motion, and orientation toggling.

- Runtime: DOM + CSS
- Interaction: Pointer focus, wheel and arrow navigation, card selection, double-click/Space orientation, idle drift, scale, speed, opacity, and palette
- Variant of `character-carousel`
- Props (controls):
  - `speed` number 0–2.5, default 1
  - `scale` number 0.7–1.3, default 1
  - `opacity` number 0.1–1, default 1
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.35–1.65, default 1

### Gallery — `Gallery`

The isolated Vantrix hero image ribbon: sixteen curved editorial panels orbiting a vertical cylindrical rail on a quiet paper grid.

- Runtime: Three.js r149
- Interaction: Automatic rotation and vertical drift, responsive DPR-capped resize, reduced-motion still frame, and visibility-aware lifecycle
- Props (controls):
  - `speed` number 0–3, default 1
  - `scale` number 0.7–1.35, default 1
  - `opacity` number 0.05–1, default 1
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.35–1.65, default 1

### Engraved Certificate — `EngravedCertificate`

A responsive engraved certificate: plate field, dual guilloche rosettes, and a drifting harmonic pass that auto-cycles through four cam states.

- Runtime: Canvas 2D + DOM/CSS
- Interaction: Auto-cycled cam configurations + optional final-frame palette
- Props (controls):
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.35–1.65, default 1

### Diagnostics Panel — `DiagnosticsPanel`

Three diagnostic illustration variants — layered planes, node cubes, and a flowing mesh — each isolated without page chrome or copy.

- Runtime: Canvas 2D
- Interaction: Variant selection plus customizable speed, size, opacity, and palette
- Props (controls):
  - `mode` one of "dark", "light"; default "dark"
  - `speed` number 0–3, default 1
  - `size` number 0.35–2.5, default 1
  - `opacity` number 0.05–1, default 1
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.35–1.65, default 1
- Variant **Layered Planes**: Five floating isometric planes with a highlighted top layer and a cropped scan-line core. Props: `{"variant": "layers"}`
- Variant **Node Cubes**: Five synchronized wireframe cubes forming a softly animated diagnostic node cluster. Props: `{"variant": "nodes"}`
- Variant **Flowing Mesh**: An isometric wire mesh that continuously ripples around a focused central peak. Props: `{"variant": "flow"}`

### Skeuomorphic Toggle — `SkeuomorphicToggleCollection`

Four takes on one switch: the preserved tactile skeuomorphic export plus flat modern, Three.js glass, and shader-lit treatments, each matching light and dark appearances automatically.

- Runtime: DOM/CSS + Three.js + Raw WebGL
- Interaction: Click or keyboard switching, pointer-lit 3D variants, automatic site/system appearance with explicit light and dark overrides, plus customizable speed, size, opacity, and palette
- Props (controls):
  - `mode` one of "auto", "dark", "light"; default "auto"
  - `speed` number 0–3, default 1
  - `size` number 0.35–2.5, default 1
  - `opacity` number 0.05–1, default 1
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.35–1.65, default 1
- Variant **Skeuomorphic**: The preserved packaged export: a tactile pill with an inset track and a raised sliding thumb. Props: `{}`
- Variant **Modern**: A flat, hairline-edged switch with a stretching knob, a check-to-dash mark, and one soft accent pool. Props: `{"variant": "modern"}`
- Variant **Glass**: An Apple-style Three.js capsule in transmissive glass, refracting a drifting colour field around a lit core. Props: `{"variant": "glass"}`
- Variant **Shader**: A raw-WebGL switch drawn entirely in one fragment pass: plasma interior, streaming sparks, chromatic bloom, and a pointer-lit thumb. Props: `{"variant": "shader"}`

### Wireframe Forms — `WireframeForms`

A family of rotating wireframe forms, with the cube, crossed cylinders, and nested sphere isolated as individual variants.

- Runtime: Canvas 2D
- Interaction: Three selectable shape variants with customizable speed, size, length, density, opacity, and palette
- Props (controls):
  - `mode` one of "dark", "light"; default "dark"
  - `speed` number 0–3, default 3
  - `size` number 0.35–2.5, default 1
  - `length` number 0.35–2.5, default 1
  - `density` number 0.25–2.5, default 1
  - `opacity` number 0.05–1, default 0.35
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.35–1.65, default 1
- Variant **Cube**: The prismatic cube study isolated as a single rotating wireframe form. Props: `{"variant": "cube"}`
- Variant **Cylinders**: The crossed logic cylinders isolated as a single rotating wireframe form. Props: `{"variant": "cylinders"}`
- Variant **Sphere**: The nested icosahedral sphere isolated as a single rotating wireframe form. Props: `{"variant": "sphere"}`

### Brand Orbs — `BrandOrbs`

Twenty-three animated brand marks rebuilt as small and medium dimensional dot orbs for AI status, product activity, and compact loading states.

- Runtime: Canvas 2D
- Interaction: Twenty-three variants, small and medium presets, dark-first theme, speed, pause, reduced motion, visibility pause, and deterministic restart
- Props (controls):
  - `size` one of "small", "medium"; default "medium"
  - `mode` one of "dark", "light"; default "dark"
  - `speed` number 0.25–2, default 1
- Variant **Claude Code**: A warm radial spark burst that expands and contracts around a bright core. Props: `{}`
- Variant **OpenAI**: An interlocking six-loop bloom traced as a rotating monochrome dot lattice. Props: `{"variant": "openai"}`
- Variant **Codex**: A rounded command-prompt mark that breathes as a dimensional prompt blob. Props: `{"variant": "codex"}`
- Variant **Cursor**: The Cursor arrow and frame resolved in dots with a timed click ripple. Props: `{"variant": "cursor"}`
- Variant **Gemini**: A four-point Gemini twinkle with orbiting light and a soft central pulse. Props: `{"variant": "gemini"}`
- Variant **Figma**: Five dot swatches morph through the familiar stacked Figma silhouette. Props: `{"variant": "figma"}`
- Variant **Framer**: The folded Framer F rendered as shifting blue dot bands. Props: `{"variant": "framer"}`
- Variant **React**: Three luminous electron ellipses orbit a bright React nucleus. Props: `{"variant": "react"}`
- Variant **Swift**: The Swift bird silhouette sweeps through a warm coral dot field. Props: `{"variant": "swift"}`
- Variant **DesignCode**: The DesignCode monogram travels through a dense spherical dot field. Props: `{"variant": "designcode"}`
- Variant **Aura**: Aura's native asymmetric dot field carries an expanding halo of light. Props: `{"variant": "aura"}`
- Variant **DreamCut**: Six tapered petals open, breathe, and rotate as a DreamCut bloom. Props: `{"variant": "dreamcut"}`
- Variant **UI**: A paneled interface window assembles from cool blue dot segments. Props: `{"variant": "ui"}`
- Variant **UX**: A warm journey curve connects three pulsing experience nodes. Props: `{"variant": "ux"}`
- Variant **CSS**: The CSS lettermark emerges as a purple scan moving through a rounded field. Props: `{"variant": "css"}`
- Variant **iOS**: The iOS wordmark is sampled into an even monochrome dot matrix. Props: `{"variant": "ios"}`
- Variant **Neuform**: Eight directional Neuform chevrons rotate around a precise center. Props: `{"variant": "neuform"}`
- Variant **GitHub**: The Octocat silhouette appears as negative space inside a luminous orb. Props: `{"variant": "github"}`
- Variant **X**: The X mark is swept by a rotating highlight around its diagonal strokes. Props: `{"variant": "x"}`
- Variant **Instagram**: The Instagram camera mark glows through a violet-to-orange dot gradient. Props: `{"variant": "instagram"}`
- Variant **Threads**: The Threads loop is traced by an angular highlight sweep. Props: `{"variant": "threads"}`
- Variant **LinkedIn**: The LinkedIn mark scans across a blue rounded-square field. Props: `{"variant": "linkedin"}`
- Variant **Email**: A dimensional dotted envelope opens and sends a traveling signal. Props: `{"variant": "email"}`

## CSS

### Performance Gauges — `PerformanceGauges`

Four layered CSS instruments — tachometer, speedometer, turbo boost, and EV power — each isolated to one full-bleed dial with polar tick geometry, scale bands, and a self-testing needle sweep.

- Runtime: DOM + CSS
- Interaction: Self-test needle sweep, settle, and idle flutter with a counting readout + optional final-frame palette
- Props (controls):
  - `hue` number -180–180, default 0
  - `saturation` number 0–2, default 1
  - `brightness` number 0.35–1.65, default 1
- Variant **Tachometer**: Orange sunburst dial reading 0–7000 r/min with a redline band, a machined oil-temperature sub-dial, and a counterweighted red needle. Props: `{"variant": "tachometer"}`
- Variant **Speedometer**: 0–160 km/h scale whose travelled arc fills behind the needle, with a peak-hold marker, counting digital readout, and rolling odometer. Props: `{"variant": "speedometer"}`
- Variant **Turbo Boost**: Navy −1.0 to 1.5 bar dial that separates the vacuum half from the pressure half and flags the wastegate threshold with a pulsing overboost lamp. Props: `{"variant": "boost"}`
- Variant **EV Power**: Regeneration-to-power scale that fills its track from zero, with a green charge segment, kilowatt readout, and battery state-of-charge bar. Props: `{"variant": "power"}`

### Uplink Loader — `UplinkLoader`

A cinematic secure-uplink loader with stepped progress, illuminated telemetry ticks, neon readouts, technical corner markers, mirrored side rails, scanlines, and procedural grain.

- Runtime: DOM + CSS + JavaScript
- Interaction: Autonomous stepped progress sequence with phase labels, completion hold, and reset glitch

### Koi Studies — `KoiStudies`

A tactile stack of three Japanese koi studies with CSS 3D depth, pointer tilt, drag and keyboard navigation, pixel-mask reveals, and animated halftone imagery.

- Runtime: DOM + CSS 3D + Canvas 2D + WebGL
- Interaction: Drag, tap, or use the arrow keys to cycle cards, with pointer tilt, reveal trails, responsive layout, and reduced-motion behavior
- Needs runtime files in the app's public folder (see SKILL.md)

### Animated Top Dock — `AnimatedTopDock`

Sable’s proximity-spring menu in four fits: the authored centred dock, a modern command bar, a fitted pixel-terminal strip, and a vertical refracting Three.js glass rail.

- Runtime: DOM + CSS + WebGL + Three.js r128
- Interaction: Pointer proximity, keyboard focus, active selection, pointer parallax, reduced motion, and mobile static mode
- Props (controls):
  - `proximity` number 60–220, default 122
  - `spring` number 0.05–0.35, default 0.19
  - `damping` number 0.4–0.9, default 0.7
  - `widthGrowth` number 4–32, default 17
  - `heightGrowth` number 4–28, default 16
  - `drop` number 0–12, default 3.5
- Variant **Sable Dock**: The authored Sable dock: a centred glass capsule whose items spring downward and widen as the pointer crosses them. Props: `{"variant": "sable"}`
- Variant **Command Bar**: An inset modern header: wordmark on the left, the proximity dock centred on the bar’s midline, and a paired sign-in and gradient call to action on the right. Props: `{"variant": "modern"}`
- Variant **Pixel Terminal**: A fitted terminal strip: the menu cells own the whole bar and trade width with each other, over a WebGL noise field quantised through an 8×8 ordered dither into an eight-stop dusk palette. Props: `{"variant": "retro"}`
- Variant **Liquid Glass**: A vertical glass rail whose proximity field runs down the y axis, over a Three.js bead field that refracts the backdrop in screen space with per-channel dispersion and a specular rim. Props: `{"variant": "glass"}`

### Sketchbook — `Sketchbook`

The exact Singapore paper sketchbook with nested-strip page curls, direct dragging, tilt, zoom, a movable magnifying glass, and its complete authored plate set.

- Runtime: DOM + CSS 3D
- Interaction: Drag or tap pages, arrows, keyboard, cursor tilt, zoom, and draggable loupe
