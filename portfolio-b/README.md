# Vignesh Murali — Portfolio, Version B

A second portfolio direction, built so it can be compared with Version A (`../portfolio`).
Light editorial layout (warm paper, ink type, brand violet as an accent), inspired by the
Figma frame `T9UpObjYsMdFXsJrQvGjRY` node 16-2607.

## What's in it

- **Hero:** a Three.js scene. A tilted ring of curved glass cards orbits the portrait.
  Cards in front cover the face and cards behind are hidden by it. Drag to spin the ring.
  Hover a card to lift it. Flat tool icons hide behind the portrait and come out when
  the cursor is near or the page scrolls. Hovering a word in the headline rolls it
  between upright and italic.
- **Work:** filterable project grid (GSAP Flip) with 3D tilt and a 3D entrance.
- **Disciplines:** UI/UX, Product, Motion Graphics and Graphic Design as expanding panels,
  each with an animated preview, deliverables and a case study link.
- **Toolbox:** drag-and-drop physics playground (Matter.js). Throw the tool icons around
  and drop one in the slot to see what it's used for and the proficiency level.
  Shake, Reset and per-tool buttons give keyboard access to the same features.
- **Showreel:** inline player, plus a modal from the hero button.
- **About:** bio, facts, skill meters, experience and a 6-step process line.
- **Testimonials:** swipeable 3D card deck. These are **sample quotes**, labelled as such
  on the page. Replace them in `src/content.js` and set `testimonialsAreSamples = false`.
- **Contact:** mailto form, copy-email button, phone and Behance links.

Flat buttons and icons, no gradient text. Supports reduced motion, has fallbacks for
no WebGL and no JS, and is keyboard and screen-reader friendly.

## Edit content

All words, links and data live in `src/content.js`. The page is rendered to static HTML
at build time from `src/templates.js`.

## Run

```bash
npm install
npm run dev      # local dev server
npm run build    # static site in dist/
npm run preview  # serve dist/
```
