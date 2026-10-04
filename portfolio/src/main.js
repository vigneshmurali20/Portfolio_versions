import '@fontsource-variable/urbanist';
import '@fontsource-variable/quicksand';
import '@fontsource-variable/jetbrains-mono';
import 'lenis/dist/lenis.css';
import './styles/main.css';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import { site, tools, services } from './content.js';
import { env, runLoader, initCursor, initMagnetic, initTilt, initNav, initClock } from './ui.js';
import {
  prepareHero,
  heroIntro,
  heroScroll,
  initReveals,
  initAbout,
  initOrbit,
  initTimeline,
  initPortfolio,
  initMarquee,
  initCta,
  initFooter,
  initTypeEffect,
  preparePageHero,
  pageHeroIntro,
  pageHeroScroll,
  initSkills,
  initRings,
  initDiamond,
  initFilters,
  initTestimonials,
  initCopy,
} from './sections.js';
import { initPageTransitions } from './ui.js';

gsap.registerPlugin(ScrollTrigger);
const html = document.documentElement;
const page = html.dataset.page || 'home';
const isHome = page === 'home';
const heroSel = isHome ? '.hero' : '.page-hero';
if (env.reduced) html.classList.add('reduced-motion');
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

/* ----------------------------------------------------------- smooth scroll */
let lenis = null;
if (!env.reduced) {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.3,
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  lenis.stop();
}

const scrollToY = (y, immediate = false) => {
  if (lenis) lenis.scrollTo(y, { immediate, duration: 1.3 });
  else window.scrollTo({ top: y, behavior: 'auto' });
};
const scrollTo = (hash) => {
  const target = hash === '#top' ? document.body : document.querySelector(hash);
  if (!target) return;
  if (lenis) lenis.scrollTo(hash === '#top' ? 0 : target, { duration: 1.6 });
  else target.scrollIntoView();
  // move focus for keyboard and screen-reader users
  const focusEl = hash === '#top' ? document.getElementById('main') : target;
  if (!focusEl.hasAttribute('tabindex')) focusEl.setAttribute('tabindex', '-1');
  focusEl.focus({ preventScroll: true });
};
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a || a.closest('#menu')) return;
  const hash = a.getAttribute('href');
  if (hash.length < 2) return;
  e.preventDefault();
  scrollTo(hash);
});

/* ------------------------------------------------------------------ WebGL */
let stage = null;
async function startWebGL() {
  const { createStage, webglAvailable } = await import('./webgl/stage.js');
  if (!webglAvailable()) throw new Error('WebGL2 unavailable');
  stage = createStage({
    bgCanvas: document.querySelector('.gl--bg'),
    fxCanvas: document.querySelector('.gl--fx'),
    heroEl: document.querySelector(heroSel),
    portraitEl: document.querySelector('[data-hero-portrait]'),
    ctaEl: document.querySelector('.cta:not(.cta--form-only)'),
    portraitSrc: site.portrait,
    tools,
    mobile: env.mobile,
    reduced: env.reduced,
  });
  gsap.ticker.add((time, dms) => stage.tick(dms / 1000));
  let rt;
  window.addEventListener('resize', () => {
    clearTimeout(rt);
    rt = setTimeout(() => stage.resize(), 120);
  });
  await stage.ready;
  if (isHome) html.classList.add('gl-portrait');
  return stage;
}

const webglTask = startWebGL().catch((err) => {
  console.warn('[portfolio] WebGL disabled:', err.message);
  html.classList.add('no-webgl');
  stage = null;
});

/* ----------------------------------------------------------------- preload */
const preload = (src) =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = img.onerror = resolve;
    img.src = src;
  });

if (isHome) prepareHero();
else preparePageHero();

// First visit gets the full loader; moving between pages keeps it short.
let visited = false;
try {
  visited = sessionStorage.getItem('vm-visited') === '1';
  sessionStorage.setItem('vm-visited', '1');
} catch {
  /* storage blocked: treat every load as a first visit */
}

runLoader({
  minDuration: visited ? 0.25 : 1.4,
  tasks: [
    document.fonts.ready,
    webglTask,
    ...(isHome ? [preload(site.portrait), preload(site.portraitSmile), ...services.slice(0, 3).map((s) => preload(s.image))] : []),
  ],
}).then(() => {
  lenis?.start();
  if (isHome) heroIntro(stage);
  else pageHeroIntro(stage);
});

initPageTransitions();

/* --------------------------------------------------------- interactions */
initCursor();
initMagnetic();
initTilt();
initClock(site.timezone);
initNav({ ScrollTrigger, scrollTo, lenis });
if (isHome) heroScroll();
else pageHeroScroll();
webglTask.then(() => {
  // hand the hero progress to the 3D stage once it exists
  if (stage) {
    ScrollTrigger.create({
      trigger: heroSel,
      start: 'top top',
      end: 'bottom top',
      onUpdate: (self) => (stage.state.heroP = self.progress),
    });
    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => (stage.state.scroll = self.progress),
    });
  } else if (isHome && !env.reduced) {
    gsap.to('.hero__portrait', {
      y: 120,
      opacity: 0.2,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });
  }
});
initReveals();
initAbout();
initOrbit({ scrollToY });
initTimeline();
initPortfolio();
initMarquee(() => (lenis ? lenis.velocity * 60 : 0));
initCta({ email: site.email });
initFooter();
initTypeEffect();
initSkills();
initRings();
initDiamond();
initFilters();
initTestimonials(() => (lenis ? lenis.velocity * 60 : 0));
initCopy();

window.addEventListener('load', () => ScrollTrigger.refresh());
document.fonts.ready.then(() => ScrollTrigger.refresh());
