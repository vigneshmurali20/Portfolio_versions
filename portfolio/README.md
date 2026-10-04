# Vignesh — portfolio

An immersive 3D portfolio built from the Figma design
([Portfolio page](https://www.figma.com/design/T9UpObjYsMdFXsJrQvGjRY/Untitled?node-id=0-1)):
Vite, Three.js, GSAP ScrollTrigger and Lenis. No framework.

```bash
npm install
npm run dev      # local dev server
npm run build    # static site in dist/ — deploy that folder anywhere
npm run preview  # serve the production build
```

## Editing content

All words, links and images live in `src/content.js`. At build time,
`vite.config.js` renders `src/templates.js` into `index.html`, so the content
ships as static HTML (crawlable, works without JavaScript).

The Figma file has a Dribbble card but no Dribbble link. Set `site.dribbble`
in `src/content.js` and the card and footer link appear.

## How it fits together

| File | What it does |
| --- | --- |
| `src/webgl/stage.js` | Two synced canvases. Background: flowing nebula, the glowing planet (the Figma half-circle in 3D) and chrome rings. Foreground: the portrait as a shader plane (rim light, materialise and dissolve), glass tool chips, chrome shapes, particles. The hero title sits between the canvases so the portrait overlaps it, as in Figma. |
| `src/webgl/shaders.js` | GLSL for the nebula, planet, portrait and particles |
| `src/ui.js` | Loader, custom cursor, magnetic buttons, 3D tilt, nav (sliding indicator, hide on scroll, mobile menu with focus trap), local clock |
| `src/sections.js` | Hero intro and scroll, about word-lighting, services 3D orbit (pinned, scroll or drag, snaps per card), experience timeline, portfolio, marquee, contact form, footer |
| `src/styles/main.css` | Brand tokens (`#7F56D9`, `#42307D`, Urbanist and Quicksand), layout, responsive rules |

## Fallbacks

- **No WebGL2**: the DOM portrait and a CSS gradient background take over.
- **Reduced motion**: no smooth scrolling, intro, dissolve or pinning; the
  services become a swipeable row and all text is shown at once.
- **Phones and tablets** (under 900px): burger menu, four chips instead of
  eight, swipeable services, lighter glass, fewer particles.

The contact form opens the visitor's email app addressed to
vigneshmurali2107@gmail.com; there is no server.
