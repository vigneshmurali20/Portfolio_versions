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
- **Testimonials:** swipeable 3D card deck. The current quotes are samples; replace them
  in `src/content.js` with client-approved wording before publishing as reviews.
- **Contact:** mailto form, copy-email button, phone and Behance links.

Flat buttons and icons, no gradient text. Supports reduced motion, has fallbacks for
no WebGL and no JS, and is keyboard and screen-reader friendly.

## Edit content

All words, links and data live in `src/content.js`. The page is rendered to static HTML
at build time from `src/templates.js`.

## Search Console and Analytics

The site includes a canonical URL, Person structured data, a root sitemap and
an open `robots.txt`. Submit `https://vigneshmurali.com/sitemap.xml` in Google
Search Console after verifying the domain. DNS verification in your domain
provider is preferred; if using the HTML meta-tag method, put the verification
token in `VITE_GOOGLE_SITE_VERIFICATION` before building.

The GA4 Google tag for this site is installed in `index.html`. After deploying,
confirm live traffic in the GA4 Realtime report.

Google Analytics measurement and Search Console verification are separate:
add the verified site property and submit the sitemap in Search Console, then
confirm live traffic in GA4 Realtime after deploying. Search rankings take time
and depend on content quality, competition, links and crawl/indexing; these
technical steps do not guarantee a position.

## Run

```bash
npm install
npm run dev      # local dev server
npm run build    # static site in dist/
npm run preview  # serve dist/
```
