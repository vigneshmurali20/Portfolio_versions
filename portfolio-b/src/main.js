import '@fontsource/instrument-serif/latin-400-italic.css';
import '@fontsource-variable/fraunces/opsz.css';
import '@fontsource-variable/urbanist';
import '@fontsource-variable/jetbrains-mono';
import './styles.css';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import Lenis from 'lenis';
import { injectSpeedInsights } from '@vercel/speed-insights';
import { site, tools, disciplines, haloTools, clientRegions } from './content.js';
import { cinematic } from './cinematic.js';

injectSpeedInsights();

gsap.registerPlugin(ScrollTrigger, Flip);

const root = document.documentElement;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
const EASE = 'expo.out';

/* ------------------------------------------------------------ smooth scroll */
let lenis = null;
if (!reduced) {
  lenis = new Lenis({ duration: 1.15, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

function scrollToTarget(target) {
  const el = target === '#top' ? $('#top') : $(target);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: target === '#top' ? 0 : -24, duration: 1.4 });
  else el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  // move focus for keyboard and screen reader users
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
}

document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const id = a.getAttribute('href');
  if (id.length < 2) return;
  e.preventDefault();
  closeSheet();
  scrollToTarget(id);
  history.replaceState(null, '', id === '#top' ? location.pathname : id);
});

/* ------------------------------------------------------------ cursor */
const cursor = $('[data-cursor-el]');
const cursorLabel = $('[data-cursor-label]');
const cursorState = { label: '', hover: false };
function setCursorLabel(text) {
  if (!cursor) return;
  cursorState.label = text || '';
  cursorLabel.textContent = cursorState.label;
  cursor.classList.toggle('is-label', !!cursorState.label);
}
if (finePointer && cursor) {
  root.classList.add('has-cursor');
  const dot = $('.cursor__dot', cursor);
  const ring = $('.cursor__ring', cursor);
  const dx = gsap.quickTo(dot, 'x', { duration: 0.08 });
  const dy = gsap.quickTo(dot, 'y', { duration: 0.08 });
  const rx = gsap.quickTo(ring, 'x', { duration: reduced ? 0.01 : 0.45, ease: 'power3' });
  const ry = gsap.quickTo(ring, 'y', { duration: reduced ? 0.01 : 0.45, ease: 'power3' });
  window.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType !== 'mouse') return;
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
      cursor.classList.remove('is-hidden');
    },
    { passive: true },
  );
  document.addEventListener('pointerleave', () => cursor.classList.add('is-hidden'));
  window.addEventListener('pointerdown', () => cursor.classList.add('is-down'));
  window.addEventListener('pointerup', () => cursor.classList.remove('is-down'));
  document.addEventListener('pointerover', (e) => {
    const labelled = e.target.closest('[data-cursor]');
    if (labelled) setCursorLabel(labelled.dataset.cursor);
    const interactive = e.target.closest('a, button, input, textarea, label');
    cursor.classList.toggle('is-hover', !!interactive && !labelled);
  });
  document.addEventListener('pointerout', (e) => {
    const labelled = e.target.closest('[data-cursor]');
    if (labelled && !labelled.contains(e.relatedTarget)) setCursorLabel('');
  });
}

/* ------------------------------------------------------------ magnetic + tilt */
if (finePointer && !reduced) {
  $$('[data-magnetic]').forEach((el) => {
    const x = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    const y = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      x((e.clientX - r.left - r.width / 2) * 0.25);
      y((e.clientY - r.top - r.height / 2) * 0.3);
    });
    el.addEventListener('pointerleave', () => {
      x(0);
      y(0);
    });
  });

  $$('[data-tilt]').forEach((el) => {
    const max = el.classList.contains('card') ? 6 : 10;
    const rx = gsap.quickTo(el, 'rotationX', { duration: 0.8, ease: 'power3' });
    const ry = gsap.quickTo(el, 'rotationY', { duration: 0.8, ease: 'power3' });
    gsap.set(el, { transformPerspective: 900 });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      ry(px * max * 2);
      rx(-py * max * 2);
    });
    el.addEventListener('pointerleave', () => {
      rx(0);
      ry(0);
    });
  });
}

/* ------------------------------------------------------------ nav */
const navEl = $('[data-nav]');
const indicator = $('.nav__indicator');
const navLinks = $$('.nav__link');
function moveIndicator(link) {
  if (!indicator) return;
  navLinks.forEach((l) => {
    l.classList.toggle('is-active', l === link);
    if (l === link) l.setAttribute('aria-current', 'true');
    else l.removeAttribute('aria-current');
  });
  if (!link) {
    indicator.style.opacity = '0';
    return;
  }
  const pr = link.parentElement.parentElement.getBoundingClientRect();
  const r = link.getBoundingClientRect();
  indicator.style.opacity = '1';
  indicator.style.width = `${r.width}px`;
  indicator.style.transform = `translateX(${r.left - pr.left + 5}px)`;
}
// Sections can nest (Writing sits inside About), so the active link is the
// one whose section started last among those in view.
const navTriggers = [];
function syncNav() {
  const live = navTriggers.filter((t) => t.st.isActive).sort((a, b) => b.st.start - a.st.start);
  if (live.length) moveIndicator(live[0].link);
}
navLinks.forEach((link) => {
  const sec = document.getElementById(link.dataset.section);
  if (!sec) return;
  const st = ScrollTrigger.create({
    trigger: sec,
    start: 'top 45%',
    end: 'bottom 45%',
    onToggle: syncNav,
  });
  navTriggers.push({ link, st });
});
ScrollTrigger.create({
  trigger: '[data-hero]',
  start: 'top top',
  end: 'bottom 45%',
  onToggle: (self) => self.isActive && moveIndicator(null),
});
let lastY = 0;
ScrollTrigger.create({
  start: 0,
  end: 'max',
  onUpdate: (self) => {
    const y = self.scroll();
    navEl.classList.toggle('is-scrolled', y > 40);
    const sheetOpen = !$('[data-sheet]').hidden;
    navEl.classList.toggle('is-hidden', !sheetOpen && y > window.innerHeight && y > lastY + 2);
    if (y < lastY - 2) navEl.classList.remove('is-hidden');
    lastY = y;
  },
});
navEl.addEventListener('focusin', () => navEl.classList.remove('is-hidden'));

// mobile menu
const sheet = $('[data-sheet]');
const menuBtn = $('[data-menu]');
function openSheet() {
  sheet.hidden = false;
  menuBtn.setAttribute('aria-expanded', 'true');
  lenis?.stop();
  $('[data-menu-close]').focus();
}
function closeSheet() {
  if (sheet.hidden) return;
  sheet.hidden = true;
  menuBtn.setAttribute('aria-expanded', 'false');
  lenis?.start();
  menuBtn.focus({ preventScroll: true });
}
menuBtn.addEventListener('click', openSheet);
$('[data-menu-close]').addEventListener('click', closeSheet);
sheet.addEventListener('click', (e) => e.target === sheet && closeSheet());
sheet.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeSheet();
  if (e.key !== 'Tab') return;
  const f = $$('a, button', sheet);
  const first = f[0];
  const last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
});

/* ------------------------------------------------------------ hero */
const hero = $('[data-hero]');
const portraitImg = $('[data-portrait]');
let scene = null;

const canWebGL = () => {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch {
    return false;
  }
};

// Three.js (the largest chunk) loads after first paint, so it never delays
// the portrait (LCP) or the first interaction.
async function startHero3D() {
  const saveData = navigator.connection?.saveData;
  if (!canWebGL() || saveData) {
    root.classList.add('no-gl');
    return;
  }
  try {
    await new Promise((r) => ('requestIdleCallback' in window ? requestIdleCallback(r, { timeout: 1500 }) : setTimeout(r, 600)));
    const { createHero3D } = await import('./hero3d.js');
    scene = createHero3D({
      canvas: $('[data-hero-gl]'),
      hero,
      portraitImg,
      portraitSrc: site.portrait,
      cards: haloTools,
      tools,
      reduced,
      onReady: () => root.classList.add('gl-ready'),
      onFirstDrag: () => $('.hero__hint')?.classList.add('is-done'),
      onHoverCard: (name) => setCursorLabel(typeof name === 'string' ? name : name ? 'Drag' : ''),
    });
    $('[data-hero-gl]').addEventListener('webglcontextlost', () => {
      root.classList.remove('gl-ready');
      root.classList.add('no-gl');
    });
  } catch (err) {
    console.warn('Hero 3D disabled:', err);
    root.classList.add('no-gl');
  }
}

// curved connector lines from the note cards to the head
function drawWires() {
  const svg = $('[data-wires]');
  if (!svg || getComputedStyle(svg).display === 'none') return;
  const hr = hero.getBoundingClientRect();
  const pr = portraitImg.getBoundingClientRect();
  const hx = pr.left - hr.left + pr.width * 0.48;
  const hy = pr.top - hr.top + pr.height * 0.25;
  $$('[data-note]').forEach((note, i) => {
    const r = note.getBoundingClientRect();
    const left = i === 0;
    const x1 = (left ? r.left + r.width * 0.45 : r.left + r.width * 0.55) - hr.left;
    const y1 = r.bottom - hr.top - 6;
    const x2 = hx + (left ? -pr.width * 0.2 : pr.width * 0.2);
    const y2 = hy + pr.height * 0.12;
    const path = $(`[data-wire="${i}"]`, svg);
    path.setAttribute('d', `M${x1} ${y1} C ${x1} ${y1 + 120}, ${x2 + (left ? -120 : 120)} ${y2}, ${x2} ${y2}`);
  });
}
window.addEventListener('resize', drawWires);

function heroIntro() {
  const tl = gsap.timeline({ defaults: { ease: EASE } });
  tl.fromTo('.hc__a', { y: 0, yPercent: 130 }, { yPercent: 0, duration: 1.4, stagger: 0.018, clearProps: 'transform' }, 0)
    .fromTo('[data-hero-in]', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1.2, stagger: 0.08 }, 0.35)
    .fromTo(
      '.note',
      { opacity: 0, y: 60, rotationX: -50, transformPerspective: 900 },
      { opacity: 1, y: 0, rotationX: 0, duration: 1.6, stagger: 0.15 },
      0.7,
    )
    .fromTo('.badge', { opacity: 0, scale: 0.6, rotation: -90 }, { opacity: 1, scale: 1, rotation: 0, duration: 1.6 }, 0.8)
    .fromTo('.hero__wires path', { opacity: 0 }, { opacity: 1, duration: 1 }, 1.2);
  return tl;
}

function heroScroll() {
  if (reduced) return;
  // Parallax, not fade: each hero layer drifts up at its own speed and stays
  // readable while it scrolls away.
  const heroST = (end = 'bottom top') => ({ trigger: hero, start: 'top top', end, scrub: true });
  gsap.to('.hero__copy', { yPercent: -22, ease: 'none', scrollTrigger: heroST() });
  gsap.to('.note--left', { y: -160, rotationZ: -10, ease: 'none', scrollTrigger: heroST() });
  gsap.to('.note--right', { y: -240, rotationZ: 8, ease: 'none', scrollTrigger: heroST() });
  gsap.to('.hero__wires', { opacity: 0, ease: 'none', scrollTrigger: heroST('30% top') });
  gsap.to('.hero__trust', { y: -70, ease: 'none', scrollTrigger: heroST() });
  gsap.to('.hero__tag', { y: -130, ease: 'none', scrollTrigger: heroST() });
  gsap.to('.badge', { y: -200, rotation: 120, ease: 'none', scrollTrigger: heroST() });
}

/* ------------------------------------------------------------ case studies */
// Stacked sticky cards: as the next card slides over, the covered one eases
// back and dims. The side index follows the card in view.
function caseStudies() {
  const cards = $$('[data-cs-card]');
  if (!cards.length) return;
  const links = $$('[data-cs-jump]');
  const counter = $('[data-cs-current]');
  const setActive = (i) => {
    links.forEach((l, j) => (j === i ? l.setAttribute('aria-current', 'true') : l.removeAttribute('aria-current')));
    if (counter) counter.textContent = i + 1;
  };
  cards.forEach((card, i) =>
    ScrollTrigger.create({ trigger: card, start: 'top 55%', end: 'bottom 45%', onToggle: (st) => st.isActive && setActive(i) }),
  );
  if (reduced) return;
  const mm = gsap.matchMedia();
  mm.add('(min-width: 861px)', () => {
    cards.slice(0, -1).forEach((card, i) => {
      const next = cards[i + 1];
      // the next card's sticky offset, re-read on every refresh (resize)
      const stickTop = () => parseFloat(getComputedStyle(next).top) || 0;
      gsap.to($('.cs-card__link', card), {
        scale: 0.89 - (cards.length - 2 - i) * 0.012,
        rotationX: -5,
        transformPerspective: 1400,
        '--shade': 0.28,
        ease: 'none',
        scrollTrigger: { trigger: next, start: 'top bottom', end: () => `top ${stickTop()}px`, scrub: true, invalidateOnRefresh: true },
      });
    });
  });
  // covers rise out of a clip as each card first enters
  gsap.utils.toArray('.cs-card__media').forEach((m) => {
    gsap.fromTo(
      m,
      { clipPath: 'inset(18% 10% 18% 10% round 24px)' },
      { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'power2.out', scrollTrigger: { trigger: m, start: 'top bottom', end: 'top 72%', scrub: 0.5 } },
    );
  });
}

/* ------------------------------------------------------------ parallax */
// Layers drift at different speeds as they pass through the viewport. They
// move with the CSS `translate` property (via --py), so they never clash with
// the GSAP transforms the reveal animations use.
function parallax() {
  if (reduced) return;
  const layer = (sel, px, trigger) =>
    $$(sel).forEach((el) => {
      gsap.fromTo(
        el,
        { '--py': `${px}px` },
        { '--py': `${-px}px`, ease: 'none', scrollTrigger: { trigger: trigger ? el.closest(trigger) || el : el, start: 'top bottom', end: 'bottom top', scrub: true } },
      );
    });
  // section headings float a little ahead of their content
  layer('.sec-head', 36);
  layer('.xp__title', 24);
  // images drift inside their frames
  layer('.about__photo img', 40, '.about__photo');
  // cards in a row move at staggered speeds
  layer('.writing__item:nth-child(1)', 10);
  layer('.writing__item:nth-child(2)', 34);
  layer('.writing__item:nth-child(3)', 58);
  layer('.impact__cell:nth-child(odd)', 14);
  layer('.impact__cell:nth-child(even)', 40);
  layer('.process__step:nth-child(even)', 18);
  layer('.about__motto', 20);
}

/* ------------------------------------------------------------ loader */
function runLoader() {
  const loader = $('[data-loader]');
  const count = $('[data-loader-count]');
  const bar = $('[data-loader-bar]');
  const done = () => {
    root.classList.remove('is-loading');
    loader.remove();
  };
  const assets = Promise.all([
    document.fonts?.ready ?? Promise.resolve(),
    portraitImg.decode?.().catch(() => {}) ?? Promise.resolve(),
  ]);
  if (reduced) {
    return assets.then(() => {
      gsap.to(loader, { opacity: 0, duration: 0.3, onComplete: done });
      heroIntro().progress(1);
    });
  }
  const prog = { v: 0 };
  const fill = gsap.to(prog, {
    v: 90,
    duration: 1.6,
    ease: 'power2.out',
    onUpdate: () => {
      count.textContent = Math.round(prog.v);
      bar.style.transform = `scaleX(${prog.v / 100})`;
    },
  });
  gsap.from('.loader .wm-ch span:first-child', { yPercent: 100, duration: 1, ease: EASE, stagger: 0.05 });
  gsap.from('.loader .vmark', { scale: 0, rotation: -90, duration: 1.2, ease: EASE });
  // never hold the page for more than a few seconds
  const timeout = new Promise((r) => setTimeout(r, 4000));
  return Promise.race([Promise.all([assets, fill.then()]), timeout]).then(() => {
    fill.kill();
    const tl = gsap.timeline();
    tl.to(prog, {
      v: 100,
      duration: 0.35,
      ease: 'power1.out',
      onUpdate: () => {
        count.textContent = Math.round(prog.v);
        bar.style.transform = `scaleX(${prog.v / 100})`;
      },
    })
      .to('.loader__mark, .loader__count, .loader__bar', { y: -30, opacity: 0, duration: 0.5, ease: 'power3.in', stagger: 0.05 })
      .to(loader, { clipPath: 'inset(0 0 100% 0)', duration: 0.9, ease: 'expo.inOut' }, '-=0.1')
      .add(() => {
        root.classList.remove('is-loading');
        heroIntro();
      }, '-=0.55')
      .add(() => loader.remove());
    return tl;
  });
}

/* ------------------------------------------------------------ reveals */
function reveals() {
  if (reduced) {
    gsap.set('[data-reveal]', { opacity: 1, y: 0 });
    gsap.set('[data-split] .line__in', { y: 0, yPercent: 0 });
    gsap.set('.skill__fill', { scaleX: (i, el) => getComputedStyle(el).getPropertyValue('--v') });
    return;
  }
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 88%',
    once: true,
    onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 1.1, ease: EASE, stagger: 0.08 }),
  });
  $$('[data-split]').forEach((h) => {
    gsap.fromTo($$('.line__in', h), { y: 0, yPercent: 105 }, {
      yPercent: 0,
      duration: 1.3,
      ease: EASE,
      stagger: 0.1,
      scrollTrigger: { trigger: h, start: 'top 88%', once: true },
    });
  });

  $$('.skill__fill').forEach((el) => {
    gsap.to(el, {
      scaleX: getComputedStyle(el).getPropertyValue('--v'),
      duration: 1.6,
      ease: EASE,
      scrollTrigger: { trigger: el, start: 'top 92%', once: true },
    });
  });
  // discipline panels swing in like doors
  gsap.from('.disc__panel', {
    rotationY: -28,
    x: 60,
    opacity: 0,
    transformPerspective: 1600,
    transformOrigin: '0% 50%',
    duration: 1.4,
    ease: EASE,
    stagger: 0.1,
    clearProps: 'transform,opacity',
    scrollTrigger: { trigger: '.disc__list', start: 'top 85%', once: true },
  });
  gsap.from('.tb__box, .tb__info', {
    y: 80,
    rotationX: -14,
    opacity: 0,
    transformPerspective: 1400,
    transformOrigin: '50% 100%',
    duration: 1.4,
    ease: EASE,
    stagger: 0.12,
    clearProps: 'transform,opacity',
    scrollTrigger: { trigger: '.tb__grid', start: 'top 85%', once: true },
  });
  // showreel frame flattens out as it scrolls up
  gsap.fromTo(
    '[data-reel-frame]',
    { rotationX: 22, scale: 0.86, transformPerspective: 1600, y: 40 },
    { rotationX: 0, scale: 1, y: 0, ease: 'none', scrollTrigger: { trigger: '[data-reel-frame]', start: 'top 95%', end: 'top 25%', scrub: true } },
  );
  // footer wordmark letters rise in
  // footer card tips up into place
  gsap.from('[data-footer]', {
    y: 80,
    rotationX: 18,
    opacity: 0,
    transformPerspective: 1400,
    transformOrigin: '50% 100%',
    duration: 1.4,
    ease: EASE,
    clearProps: 'transform,opacity',
    scrollTrigger: { trigger: '[data-footer]', start: 'top 92%', once: true },
  });
  gsap.from('.deck__cards', {
    y: 80,
    rotationX: 30,
    opacity: 0,
    transformPerspective: 1400,
    duration: 1.4,
    ease: EASE,
    scrollTrigger: { trigger: '.deck', start: 'top 85%', once: true },
  });
}

/* ------------------------------------------------------------ process */
function processLine() {
  const line = $('[data-process-line]');
  const steps = $$('.process__step');
  if (!line) return;
  ScrollTrigger.create({
    trigger: '[data-process]',
    start: 'top 75%',
    end: 'bottom 60%',
    scrub: reduced ? false : 0.6,
    onUpdate: (self) => {
      line.style.transform = `scaleX(${self.progress})`;
      steps.forEach((s, i) => s.classList.toggle('is-on', self.progress >= i / steps.length));
    },
    onEnter: (self) => reduced && self.progress === 0 && steps.forEach((s) => s.classList.add('is-on')),
  });
}

/* ------------------------------------------------------------ disciplines */
function disciplineAccordion() {
  const panels = $$('[data-disc-panel]');
  const wide = matchMedia('(min-width: 961px)');
  // Wide screens: exactly one panel open. Narrow screens: each panel toggles on its own.
  function open(panel, toggle = false) {
    const wasOpen = panel.classList.contains('is-open');
    panels.forEach((p) => {
      let on;
      if (wide.matches) on = p === panel;
      else on = p === panel ? !(toggle && wasOpen) : p.classList.contains('is-open');
      p.classList.toggle('is-open', on);
      $('.disc__toggle', p).setAttribute('aria-expanded', String(on));
    });
    setTimeout(() => ScrollTrigger.refresh(), 900);
  }
  panels.forEach((p) => {
    $('.disc__toggle', p).addEventListener('click', () => open(p, true));
    let t = 0;
    p.addEventListener('pointerenter', (e) => {
      if (e.pointerType !== 'mouse' || !wide.matches) return;
      t = setTimeout(() => open(p), 140);
    });
    p.addEventListener('pointerleave', () => clearTimeout(t));
  });
  // on wide screens one panel is always open
  wide.addEventListener('change', () => {
    if (wide.matches && !panels.some((p) => p.classList.contains('is-open'))) open(panels[0]);
  });
  return open;
}

/* ------------------------------------------------------------ toolbox */
function toolbox(openDiscipline) {
  const section = $('#toolbox');
  const empty = $('[data-pg-empty]');
  const detail = $('[data-pg-detail]');
  const meter = $('[data-pg-meter]');
  const value = $('[data-pg-value]');
  const discList = $('[data-pg-disc]');
  const picks = $$('[data-pg-pick]');
  const numberTween = { v: 0 };

  function show(tool) {
    picks.forEach((b) => b.setAttribute('aria-pressed', String(!!tool && b.dataset.pgPick === tool.key)));
    if (!tool) {
      empty.hidden = false;
      detail.hidden = true;
      return;
    }
    empty.hidden = true;
    detail.hidden = false;
    $('[data-pg-img]').src = tool.src;
    $('[data-pg-name]').textContent = tool.name;
    $('[data-pg-use]').textContent = tool.use;
    meter.style.strokeDashoffset = '100';
    requestAnimationFrame(() => requestAnimationFrame(() => (meter.style.strokeDashoffset = String(100 - tool.value))));
    gsap.fromTo(numberTween, { v: 0 }, { v: tool.value, duration: reduced ? 0 : 1.2, ease: 'power3.out', onUpdate: () => (value.textContent = Math.round(numberTween.v)) });
    discList.innerHTML = tool.disciplines
      .map((k) => disciplines.find((d) => d.key === k))
      .filter(Boolean)
      .map((d) => `<li><a href="#disciplines" data-open-disc="${d.key}">${d.title}</a></li>`)
      .join('');
    if (!reduced) gsap.from(detail.children, { y: 16, opacity: 0, duration: 0.7, ease: EASE, stagger: 0.05 });
  }

  discList.addEventListener('click', (e) => {
    const a = e.target.closest('[data-open-disc]');
    if (!a) return;
    const panel = $(`[data-disc-panel="${a.dataset.openDisc}"]`);
    if (panel) openDiscipline(panel);
  });

  let pg = null;
  import('./playground.js')
    .then(({ createPlayground }) => {
      pg = createPlayground({
        root: section,
        tools,
        reduced,
        onSelect: show,
        onHover: (on) => setCursorLabel(on ? 'Grab' : ''),
      });
    })
    .catch((err) => {
      console.warn('Playground disabled:', err);
      root.classList.add('no-physics');
    });

  $('[data-pg-shake]').addEventListener('click', () => pg?.shake());
  $('[data-pg-reset]').addEventListener('click', () => pg?.reset());
  picks.forEach((b) =>
    b.addEventListener('click', () => {
      const tool = tools.find((t) => t.key === b.dataset.pgPick);
      if (pg) pg.pick(tool.key);
      else show(tool);
    }),
  );
}

/* ------------------------------------------------------------ showreel */
function showreel() {
  const section = $('#showreel');
  const video = $('[data-reel-video]');
  const play = $('[data-reel-play]');
  play.addEventListener('click', () => {
    video.controls = true;
    video.muted = false;
    video.play().catch(() => {});
    section.classList.add('is-playing');
    video.focus();
  });
  video.addEventListener('ended', () => {
    section.classList.remove('is-playing');
    video.controls = false;
    play.focus();
  });
  // pause when scrolled away
  ScrollTrigger.create({ trigger: video, start: 'top bottom', end: 'bottom top', onLeave: () => video.pause(), onLeaveBack: () => video.pause() });

  const dialog = $('[data-reel-dialog]');
  const dVideo = $('video', dialog);
  $$('[data-reel-open]').forEach((b) =>
    b.addEventListener('click', () => {
      dialog.showModal();
      lenis?.stop();
      dVideo.currentTime = 0;
      dVideo.play().catch(() => {});
    }),
  );
  $('[data-reel-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (e) => e.target === dialog && dialog.close());
  dialog.addEventListener('close', () => {
    dVideo.pause();
    lenis?.start();
  });
}

/* ------------------------------------------------------------ testimonials deck */
function deck() {
  const wrap = $('[data-deck-cards]');
  const cards = $$('[data-deck-card]', wrap);
  const indexEl = $('[data-deck-index]');
  let order = cards.map((_, i) => i);
  let busy = false;

  function layout(animate = true) {
    order.forEach((ci, k) => {
      const c = cards[ci];
      c.style.zIndex = String(cards.length - k);
      c.toggleAttribute('aria-hidden', k !== 0);
      c.inert = k !== 0;
      gsap.to(c, {
        y: k * 16,
        scale: 1 - k * 0.05,
        rotationX: k * -4,
        transformPerspective: 1400,
        opacity: k > 2 ? 0 : 1 - k * 0.12,
        x: 0,
        rotation: 0,
        duration: animate && !reduced ? 0.8 : 0,
        ease: EASE,
      });
    });
    indexEl.textContent = String(order[0] + 1);
  }

  function next(dir = 1) {
    if (busy) return;
    busy = true;
    if (dir > 0) {
      const top = cards[order[0]];
      gsap.to(top, {
        x: -window.innerWidth * 0.6,
        rotation: -14,
        opacity: 0,
        duration: reduced ? 0 : 0.55,
        ease: 'power3.in',
        onComplete: () => {
          order.push(order.shift());
          gsap.set(top, { x: 0, rotation: 0 });
          layout();
          busy = false;
        },
      });
    } else {
      order.unshift(order.pop());
      const top = cards[order[0]];
      gsap.set(top, { x: window.innerWidth * 0.6, rotation: 14, opacity: 0 });
      layout();
      busy = false;
    }
  }

  $('[data-deck-next]').addEventListener('click', () => next(1));
  $('[data-deck-prev]').addEventListener('click', () => next(-1));
  wrap.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') next(1);
    if (e.key === 'ArrowLeft') next(-1);
  });

  // swipe the top card away
  let drag = null;
  wrap.addEventListener('pointerdown', (e) => {
    const top = cards[order[0]];
    if (!top.contains(e.target) || busy) return;
    drag = { x: e.clientX, top, id: e.pointerId, dx: 0 };
    top.setPointerCapture(e.pointerId);
  });
  wrap.addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    drag.dx = e.clientX - drag.x;
    gsap.set(drag.top, { x: drag.dx, rotation: drag.dx * 0.03 });
  });
  const end = (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const { dx } = drag;
    drag = null;
    if (dx < -90) next(1);
    else if (dx > 90) {
      // throw right: same as next, mirrored
      const top = cards[order[0]];
      busy = true;
      gsap.to(top, {
        x: window.innerWidth * 0.6,
        rotation: 14,
        opacity: 0,
        duration: 0.5,
        ease: 'power3.in',
        onComplete: () => {
          order.push(order.shift());
          gsap.set(top, { x: 0, rotation: 0 });
          layout();
          busy = false;
        },
      });
    } else layout();
  };
  wrap.addEventListener('pointerup', end);
  wrap.addEventListener('pointercancel', end);
  layout(false);
}

/* ------------------------------------------------------------ contact */
function contactForm() {
  const form = $('[data-form]');
  const msg = $('[data-form-msg]');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fields = [...form.elements].filter((el) => el.name);
    let firstBad = null;
    fields.forEach((el) => {
      const ok = el.value.trim() && (el.type !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim()));
      el.closest('.field').classList.toggle('is-invalid', !ok);
      el.setAttribute('aria-invalid', String(!ok));
      if (!ok && !firstBad) firstBad = el;
    });
    msg.classList.remove('is-ok');
    if (firstBad) {
      msg.textContent = firstBad.type === 'email' && firstBad.value.trim() ? 'Please check your email address.' : 'Please fill in every field.';
      firstBad.focus();
      return;
    }
    const data = Object.fromEntries(new FormData(form));
    const subject = encodeURIComponent(`Project enquiry from ${data.name}`);
    const body = encodeURIComponent(`${data.message}\n\n${data.name}\n${data.email}`);
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
    msg.textContent = 'Your email app should open with the message ready to send.';
    msg.classList.add('is-ok');
  });

  $$('[data-copy]').forEach((b) =>
    b.addEventListener('click', async () => {
      const label = $('[data-copy-label]', b);
      try {
        await navigator.clipboard.writeText(b.dataset.copy);
        label.textContent = 'Copied';
      } catch {
        label.textContent = 'Press Ctrl+C';
        const range = document.createRange();
        range.selectNodeContents(b.previousElementSibling);
        getSelection().removeAllRanges();
        getSelection().addRange(range);
      }
      setTimeout(() => (label.textContent = 'Copy'), 2200);
    }),
  );
}

/* ------------------------------------------------------------ footer ticker */
function currentlyTicker() {
  const roll = $('[data-now]');
  if (!roll || reduced) return;
  const items = $$('span', roll);
  let i = 0;
  setInterval(() => {
    const prev = items[i];
    i = (i + 1) % items.length;
    prev.classList.remove('is-on');
    prev.classList.add('is-out');
    items[i].classList.remove('is-out');
    items[i].classList.add('is-on');
    setTimeout(() => prev.classList.remove('is-out'), 900);
  }, 2600);
}

/* ------------------------------------------------------------ clock */
function clock() {
  const els = $$('[data-clock]');
  if (!els.length) return;
  const fmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: site.timezone });
  const tick = () => els.forEach((el) => (el.textContent = `${fmt.format(new Date())} IST`));
  tick();
  setInterval(tick, 30000);
}

function clientGlobe() {
  const root = $('[data-globe]');
  if (!root) return;
  const name = $('[data-globe-name]', root);
  const total = $('[data-globe-total]', root);
  const buttons = $$('[data-region]', root);
  let globe = null;

  // update the copy and buttons for the highlighted country
  function show(code) {
    const r = clientRegions.find((x) => x.code === code);
    if (!r) return;
    name.textContent = r.name;
    total.innerHTML = r.count == null ? (r.home ? 'Home base, and clients here too' : 'Clients worked with') : `<strong>${r.count}</strong> ${r.count === 1 ? 'client' : 'clients'}`;
    buttons.forEach((b) => {
      const on = b.dataset.region === code;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', String(on));
    });
  }
  buttons.forEach((b) =>
    b.addEventListener('click', () => (globe ? globe.focus(b.dataset.region) : show(b.dataset.region))),
  );

  if (!canWebGL()) return;
  const mount = () =>
    import('./clientGlobe.js')
      .then(({ createClientGlobe }) => {
        globe = createClientGlobe({ root, regions: clientRegions, reduced, onFocus: show });
      })
      .catch((err) => {
        console.warn('Client globe disabled:', err);
        root.classList.add('no-gl');
      });
  const io = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      mount();
    },
    { rootMargin: '600px 0px' },
  );
  io.observe(root);
}

/* ------------------------------------------------------------ impact counters */
function impactCounters() {
  const nums = $$('[data-count-to]');
  if (!nums.length) return;
  if (!reduced) {
    // tiles flip up into place, then the numbers count up
    gsap.from('.impact__cell', {
      y: 60,
      rotationX: -35,
      opacity: 0,
      transformPerspective: 1200,
      transformOrigin: '50% 100%',
      duration: 1.2,
      ease: EASE,
      stagger: 0.07,
      clearProps: 'transform,opacity',
      scrollTrigger: { trigger: '[data-impact]', start: 'top 85%', once: true },
    });
  }
  if (reduced) return;
  // the real numbers stay in place until the grid scrolls in, then all count up together
  ScrollTrigger.create({
    trigger: '[data-impact]',
    start: 'top 80%',
    once: true,
    onEnter: () =>
      nums.forEach((el, i) => {
        const o = { v: 0 };
        gsap.to(o, {
          v: Number(el.dataset.countTo),
          duration: 1.8,
          delay: i * 0.06,
          ease: 'power3.out',
          onUpdate: () => (el.textContent = Math.round(o.v)),
        });
      }),
  });
}

/* ------------------------------------------------------------ impact: flip, tabs, charts */

function impactViews() {
  // flip cards: click, tap, Enter or Space turns a card over
  $$('[data-flip]').forEach((card) =>
    card.addEventListener('click', () => {
      const on = card.getAttribute('aria-pressed') !== 'true';
      card.setAttribute('aria-pressed', String(on));
      card.querySelector('.impact__front').setAttribute('aria-hidden', String(on));
      card.querySelector('.impact__back').setAttribute('aria-hidden', String(!on));
    }),
  );

  const tablist = $('.impact__tabs');
  if (!tablist) return;
  const tabs = $$('[data-impact-tab]', tablist);
  const panels = $$('[data-impact-panel]');
  const bars = $$('.chart__bar');

  function select(view, focus = false) {
    tablist.dataset.view = view;
    tabs.forEach((t) => {
      const on = t.dataset.impactTab === view;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      if (on && focus) t.focus();
    });
    panels.forEach((p) => (p.hidden = p.dataset.impactPanel !== view));
    if (view === 'charts') {
      // bars grow from the baseline each time the charts open
      bars.forEach((b) => b.style.setProperty('--grow', reduced ? 1 : 0));
      requestAnimationFrame(() => requestAnimationFrame(() => bars.forEach((b, i) => {
        b.style.transitionDelay = reduced ? '0s' : `${i * 60}ms`;
        b.style.setProperty('--grow', 1);
      })));
    }
    ScrollTrigger.refresh();
  }
  tabs.forEach((t) => t.addEventListener('click', () => select(t.dataset.impactTab)));
  tablist.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const i = tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true');
    const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
    select(next.dataset.impactTab, true);
  });

  // hover a bar: highlight it and spell the number out under the chart
  const fmt = new Intl.NumberFormat('en-IN');
  $$('[data-chart]').forEach((chart) => {
    const tip = $('[data-chart-tip]', chart);
    $$('.chart__row', chart).forEach((row) => {
      const show = () => {
        $$('.chart__row', chart).forEach((r) => r.classList.toggle('is-hot', r === row));
        tip.textContent = `${row.dataset.label}: ${fmt.format(Number(row.dataset.value))}+`;
      };
      row.addEventListener('pointerenter', show);
      row.addEventListener('pointerleave', () => {
        row.classList.remove('is-hot');
        tip.textContent = '';
      });
    });
  });
}

/* ------------------------------------------------------------ boot */
cinematic({ hero, reduced });
startHero3D();
clientGlobe();
impactCounters();
impactViews();
const openDiscipline = disciplineAccordion();
caseStudies();
parallax();
toolbox(openDiscipline);
showreel();
deck();
contactForm();
clock();
currentlyTicker();
processLine();
reveals();
// The cinematic timeline owns the hero layers; avoid competing scroll tweens.
runLoader().then(() => {
  drawWires();
  ScrollTrigger.refresh();
  setTimeout(drawWires, 1800);
});
document.fonts?.ready.then(() => ScrollTrigger.refresh());
