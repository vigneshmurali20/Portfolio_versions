---
name: motion-primitives
description: Animated React UI components from Motion-Primitives (motion + Tailwind CSS), 33 copy-in components such as text effects, morphing dialog, dock, carousel, infinite slider, spotlight, tilt, magnetic, glow, border trail, progressive blur and animated numbers. Use when building or polishing a React or Next.js interface that needs ready-made micro-interactions or animated text, or when the user mentions Motion-Primitives or motion-primitives.com.
---

# Motion-Primitives

[Motion-Primitives](https://motion-primitives.com) (ibelick/motion-primitives,
MIT) is a set of animated components for React, built with
[Motion](https://motion.dev) (`motion/react`) and Tailwind CSS. Like shadcn/ui,
components are copied into the project as source, not imported from a package.

## Requirements

- React (or Next.js) with Tailwind CSS
- `npm install motion clsx tailwind-merge` (plus `lucide-react` if an example uses icons)
- `lib/utils.ts` with the `cn` helper: copy [references/utils.ts](references/utils.ts)
- Components import `@/lib/utils` and some `@/hooks/...`, so the project needs the `@/` path alias (or adjust the imports)

## Add a component

Prefer the CLI when the project has network access:

```bash
npx motion-primitives@latest add <name>
# or with shadcn
npx shadcn@latest add "https://motion-primitives.com/c/<name>.json"
```

Offline, or when the CLI fails, copy the source instead:

1. Copy `references/components/<name>.tsx` to `components/motion-primitives/<name>.tsx` (or the project's own components folder).
2. If it imports `@/hooks/useClickOutside` or `@/hooks/usePreventScroll`, copy those from `references/hooks/`.
3. Install any extra dependency listed in the table below.
4. Components are client components (`'use client'`); keep that line in Next.js App Router projects.

## Use a component

Before writing usage code, read `references/examples/<name>/`: `page.mdx`
lists the props and each `*.tsx` file there is a working example. Example
imports point at `@/components/core/<name>`; change them to wherever the
component was copied.

## Components

| Name | What it does | Extra deps |
| --- | --- | --- |
| `accordion` | Collapsible content component with smooth animations for showing and hiding content |  |
| `animated-background` | Provides animated background effects for UI elements |  |
| `animated-group` | Container component that applies coordinated animations to a group of child elements |  |
| `animated-number` | Animates number changes with smooth transitions |  |
| `border-trail` | Effect that creates animated border trails around elements on interaction |  |
| `carousel` | Component for cycling through elements with smooth transitions |  |
| `cursor` | Custom cursor component with animated effects and interactions |  |
| `dialog` | Modal dialog component with smooth entrance and exit animations |  |
| `disclosure` | Shows and hides content with animated transitions |  |
| `dock` | MacOS-style dock component with scaling and movement effects |  |
| `glow-effect` | Creates a glowing effect on elements based on cursor movement |  |
| `image-comparison` | Component for comparing two images with an interactive slider |  |
| `in-view` | Triggers animations when elements enter the viewport |  |
| `infinite-slider` | Slider component that loops infinitely through its content | react-use-measure |
| `magnetic` | Creates a magnetic attraction effect on hover |  |
| `morphing-dialog` | Dialog that morphs from its trigger element with smooth transitions |  |
| `morphing-popover` | Popover component that morphs from its trigger with fluid animations |  |
| `progressive-blur` | Applies progressive blur effects to elements |  |
| `scroll-progress` | Visualizes scroll progress with animated indicators |  |
| `sliding-number` | Transitions between numbers with a sliding animation | react-use-measure |
| `spinning-text` | Animates text with a spinning rotation effect |  |
| `spotlight` | Creates a spotlight effect following cursor movement |  |
| `text-effect` | Applies animated effects to text content |  |
| `text-loop` | Cycles through different text phrases with animations |  |
| `text-morph` | Morphs between different text strings with smooth transitions |  |
| `text-roll` | Animates text with a rolling effect |  |
| `text-scramble` | Creates a scrambling text effect during transitions |  |
| `text-shimmer` | Applies a shimmering effect to text |  |
| `text-shimmer-wave` | Creates a wave-like shimmer effect on text |  |
| `tilt` | Applies 3D tilt effects to elements based on cursor position |  |
| `toolbar-dynamic` | Toolbar component with dynamic appearance based on user interaction |  |
| `toolbar-expandable` | Expandable toolbar that reveals additional options with animations | react-use-measure |
| `transition-panel` | Panel component with smooth transitions between different states |  |

## Notes

- The library is in beta and components change; the vendored copies here are from the repo's main branch (commit 120f64f, 2026-09-28). The CLI fetches the latest version.
- Respect reduced motion where it matters (`useReducedMotion` from `motion/react`).
- Pair with the `motion-framer` skill for custom Motion work and `animated-component-libraries` for Magic UI and React Bits.
