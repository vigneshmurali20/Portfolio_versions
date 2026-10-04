---
name: threeui
description: ThreeUI Community (threeui.com, MengTo/threeui), 100+ free React components built with WebGL shaders, Three.js, Canvas and CSS, including animated backgrounds, 3D scenes, hero sections, full landing pages, text animations, shader buttons, galleries, loaders and toggles. Use when a React site needs a striking animated or 3D background, hero, button or text effect, or when the user mentions ThreeUI.
---

# ThreeUI Community

[ThreeUI](https://threeui.com) Community (MengTo/threeui, MIT) is the free
edition of ThreeUI: React components and full-page templates rendered with raw
WebGL shaders, Three.js, Canvas 2D and CSS. Pro and Beta components are not
included and need a paid account; never try to fetch them.

## Install

React 18 or 19 and `three` are peer dependencies.

```bash
npm install @designcodeio/threeui three
```

```tsx
import { LiquidFormBackground } from "@designcodeio/threeui/components/LiquidFormBackground";
import "@designcodeio/threeui/style.css";

export function Hero() {
  return (
    <section style={{ position: "relative", height: "100vh" }}>
      <LiquidFormBackground speed={1} />
    </section>
  );
}
```

- Prefer the component subpath (`@designcodeio/threeui/components/<Name>`)
  over the root import; it keeps the bundle small.
- Import `@designcodeio/threeui/style.css` once.
- Components are client-only (WebGL, canvas). In Next.js App Router, render
  them from a `'use client'` file, and load them with `next/dynamic` and
  `ssr: false` if the build complains about `window`.
- Most backgrounds fill their parent: give the parent a size and
  `position: relative`.

## Components that need runtime files

Full-page templates and some scenes (catalog entries marked "Needs runtime
files") load HTML, images, fonts or scripts from root-relative URLs. Copy what
they need from `node_modules/@designcodeio/threeui/lib-dist/assets/` into the
app's `public/` folder at the same paths, or pass the component's `sourceUrl`
or `assetBaseUrl` prop where it has one.

## Pick a component

Read [references/catalog.md](references/catalog.md) before choosing: it has
each component's description, runtime, interaction, props with their ranges
and defaults, and variants with the exact props that produce them. Search it
by category or keyword (for example `grep -n -i "halftone" references/catalog.md`).

| Category | Import names |
| --- | --- |
| Backgrounds (27) | `PredictiveArcCanvas`, `LiquidFormBackground`, `CrtBackground`, `GlobeCollection`, `SparkBadge`, `StreamConvergenceBackground`, `BellFieldBackground`, `FlowField`, `ElementsCollection`, `ElementsBackground`, `CondensationBackground`, `GenerativeTree`, `RibbonFieldBackground`, `CloudField`, `VoidField`, `HalftoneFlow`, `ConstellationField`, `ParticleDrift`, `ParticleNetwork`, `PortalFieldCollection`, `AmberHalftone`, `LaserCollection`, `GatewayFlow`, `ConnectivityGraph`, `InterfaceLines`, `DefenseLines`, `TopoField` |
| Three.js (20) | `SylvaLivingWorldScene`, `TempleNightScene`, `LandscapeScene`, `JapaneseTowerLandscape`, `BookshelfScene`, `StructureFlowCollection`, `EmeraldHorizonBackground`, `OrbitalSphereBackground`, `DotMatrixBackground`, `WarpFieldBackground`, `ExpanseField`, `LogicCoreField`, `DimensionalField`, `DataField`, `TopologyField`, `WovenCloth`, `NebulaBackground`, `FluidFieldBackground`, `EmberStorm`, `FluxVortex` |
| Hero (3) | `CompleteShelfLandingPage`, `BestsellersBookShowcase`, `SylvaHero` |
| Landing Pages (2) | `KageLandingPage`, `MengToSketchbookLandingPage` |
| Sections (2) | `EditorialIntroSection`, `NewsletterFooterSection` |
| Text Animation (14) | `TypographyVortexCanvas`, `SemanticBloom`, `TextPathStudies`, `OutlineTypeflow`, `MorphingGlyphCloud`, `ClothStudy`, `RippleStudy`, `BallStudy`, `ThreeUIIntro`, `ParticleWordmark`, `AudioWordmark`, `GalleryHeading`, `NeonTypography`, `TextAnimationCollection` |
| Buttons (20) | `ShaderButtons`, `IgnitionButton`, `InductionButton`, `PlasmaButton`, `TactileButton`, `ThinkingButton`, `SlidingTextCta`, `FloatingDotsCta`, `LaunchButton`, `DotBorderButton`, `GradientCta`, `SpinningBorderButton`, `GlassmorphismCta`, `GenerateButton`, `GradientPillButton`, `GradientBeamCta`, `RectangleButtons`, `CircleButtons`, `LiquidMetalButton`, `LumenCta` |
| UI Elements (9) | `CharacterCarousel`, `CharacterFilmstrip`, `CharacterWave`, `Gallery`, `EngravedCertificate`, `DiagnosticsPanel`, `SkeuomorphicToggleCollection`, `WireframeForms`, `BrandOrbs` |
| CSS (5) | `PerformanceGauges`, `UplinkLoader`, `KoiStudies`, `AnimatedTopDock`, `Sketchbook` |

Preview any component at https://threeui.com before using it when the user
can look; the catalog's descriptions are the offline substitute.

## Notes

- Heavy WebGL: use one or two per page, and respect `prefers-reduced-motion`
  (render a static fallback or pause) for accessibility.
- Assets and fonts have their own licenses; see
  [references/ASSET-LICENSES.md](references/ASSET-LICENSES.md) and
  [references/FONT-LICENSES.md](references/FONT-LICENSES.md).
- Catalog from the repo's main branch, package version 1.2.0 (commit
  68802d5). `npm install` gets the newest version; if an import name is
  missing, check the package's exports.
- For hand-built 3D, use `threejs-webgl` or `react-three-fiber`; for lighter
  animated React components, `motion-primitives`.
