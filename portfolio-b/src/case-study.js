// Entry for /case-studies/<slug>/. The page is static HTML rendered at build
// time (renderCaseStudyPage); this file only adds smooth scroll and motion.
import '@fontsource/instrument-serif/latin-400-italic.css';
import '@fontsource-variable/fraunces/opsz.css';
import '@fontsource-variable/urbanist';
import '@fontsource-variable/jetbrains-mono';
import './styles.css';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const EASE = 'expo.out';

/* smooth scroll (wheel only; touch keeps native scrolling) */
let lenis = null;
if (!reduced) {
  lenis = new Lenis({ duration: 1.1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a || a.getAttribute('href').length < 2) return;
  const el = $(a.getAttribute('href'));
  if (!el) return;
  e.preventDefault();
  if (lenis) lenis.scrollTo(el, { offset: -24, duration: 1.2 });
  else el.scrollIntoView();
  history.replaceState(null, '', a.getAttribute('href'));
});

/* reading progress: one transform on one element */
const bar = $('[data-csd-progress]');
if (bar) {
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (st) => gsap.set(bar, { scaleX: st.progress }),
  });
}

/* the rail follows the module in view */
const jumps = $$('[data-csd-jump]');
$$('[data-csd-mod]').forEach((mod, i) => {
  ScrollTrigger.create({
    trigger: mod,
    start: 'top 50%',
    end: 'bottom 50%',
    onToggle: (st) => {
      if (!st.isActive) return;
      jumps.forEach((j, k) => (k === i ? j.setAttribute('aria-current', 'true') : j.removeAttribute('aria-current')));
    },
  });
});

if (!reduced) {
  // header: title lines rise, the rest follows; the cover arrives through the
  // view transition when coming from the home page, so it is left alone
  gsap
    .timeline({ defaults: { ease: EASE } })
    .fromTo('.csd-line__in', { yPercent: 110 }, { yPercent: 0, duration: 1.3, stagger: 0.08 }, 0.05)
    .fromTo('[data-csd-in]', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 1.1, stagger: 0.06 }, 0.2);

  // modules open from a clip as they enter, with the image settling inside
  $$('[data-csd-mod]').forEach((mod) => {
    const fig = $('.csd-mod__fig', mod);
    const img = $('img', mod);
    gsap.fromTo(
      fig,
      { clipPath: 'inset(8% 6% 0% 6% round 28px)' },
      { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none', scrollTrigger: { trigger: mod, start: 'top bottom', end: 'top 35%', scrub: 0.4 } },
    );
    gsap.fromTo(img, { scale: 1.06 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: mod, start: 'top bottom', end: 'top 20%', scrub: 0.4 } });
  });

  // the next study's cover grows as you reach the end
  const nextMedia = $('.csd-next__media');
  if (nextMedia) {
    gsap.fromTo(nextMedia, { scale: 0.86, y: 40 }, { scale: 1, y: 0, ease: 'none', scrollTrigger: { trigger: '.csd-next', start: 'top bottom', end: 'center center', scrub: true } });
  }
}

// lazy images change the page height as they load; keep triggers honest
window.addEventListener('load', () => ScrollTrigger.refresh());
