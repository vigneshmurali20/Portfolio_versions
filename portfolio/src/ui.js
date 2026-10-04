import gsap from 'gsap';

const html = document.documentElement;

export const env = {
  reduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  fine: window.matchMedia('(hover: hover) and (pointer: fine)').matches,
  get mobile() {
    return window.innerWidth < 900;
  },
};

/* --------------------------------------------------------------- loader */
export function runLoader({ tasks, minDuration = 1.4 }) {
  const el = document.querySelector('.loader');
  const count = el.querySelector('[data-loader-count]');
  const mark = el.querySelector('.loader__mark');
  const path = el.querySelector('.logo-glyph__path');
  const curtain = el.querySelector('.loader__curtain');

  let done = 0;
  const total = tasks.length;
  const shown = { v: 0 };
  const render = () => {
    const v = Math.round(shown.v);
    count.textContent = String(v).padStart(3, '0');
    mark.style.setProperty('--p', v);
    if (path) path.style.strokeDashoffset = String(1 - v / 100);
  };
  const settle = (p) =>
    p.catch(() => {}).finally(() => {
      done += 1;
      gsap.to(shown, { v: (done / total) * 100, duration: 0.6, ease: 'power2.out', onUpdate: render, overwrite: true });
    });

  const start = performance.now();
  const all = Promise.all(tasks.map(settle));
  // never hold visitors hostage to a slow asset
  const timeout = new Promise((r) => setTimeout(r, 7000));

  return Promise.race([all, timeout]).then(async () => {
    const wait = Math.max(0, minDuration * 1000 - (performance.now() - start));
    await new Promise((r) => setTimeout(r, wait));
    await gsap.to(shown, { v: 100, duration: 0.35, ease: 'power2.out', onUpdate: render, overwrite: true });
    if (env.reduced) {
      html.classList.remove('is-loading');
      await gsap.to(el, { opacity: 0, duration: 0.3 });
      el.style.display = 'none';
      return;
    }
    const tl = gsap.timeline();
    tl.to(path, { fill: '#ececec', duration: 0.4 })
      .to(mark, { scale: 1.15, duration: 0.35, ease: 'power2.out' }, '<')
      .to([mark, count], { y: -30, opacity: 0, duration: 0.5, ease: 'power3.in' }, '+=0.1')
      .to(curtain, { scaleY: 1, duration: 0.7, ease: 'expo.inOut' }, '<0.1')
      .set(el.querySelector('.loader__inner'), { opacity: 0 })
      .add(() => html.classList.remove('is-loading'))
      .to(curtain, { scaleY: 0, transformOrigin: 'top', duration: 0.8, ease: 'expo.inOut' })
      .to(el, { opacity: 0, duration: 0.3 }, '-=0.25')
      .set(el, { display: 'none' });
    // resolve as the curtain lifts, so the hero intro overlaps the reveal
    return new Promise((r) => tl.call(r, null, 1.15));
  });
}

/* --------------------------------------------------------------- cursor */
export function initCursor() {
  if (!env.fine) return;
  html.classList.add('has-cursor');
  const el = document.querySelector('.cursor');
  const dot = el.querySelector('.cursor__dot');
  const ring = el.querySelector('.cursor__ring');
  const trail = el.querySelector('.cursor__trail');
  const label = el.querySelector('.cursor__label');
  const labels = { view: 'View', drag: 'Drag', copy: 'Copy' };

  const m = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const r = { x: m.x, y: m.y };
  const tr = { x: m.x, y: m.y };
  let visible = false;

  window.addEventListener(
    'pointermove',
    (e) => {
      m.x = e.clientX;
      m.y = e.clientY;
      if (!visible) {
        visible = true;
        el.style.opacity = '1';
        r.x = tr.x = m.x;
        r.y = tr.y = m.y;
      }
    },
    { passive: true },
  );
  document.addEventListener('pointerleave', () => {
    visible = false;
    el.style.opacity = '0';
  });
  window.addEventListener('pointerdown', () => el.classList.add('is-down'));
  window.addEventListener('pointerup', () => el.classList.remove('is-down'));

  const setMode = (mode) => {
    el.classList.remove('is-hover', 'is-label', 'is-hidden', 'is-text');
    label.textContent = '';
    if (!mode) return;
    if (labels[mode]) {
      el.classList.add('is-label');
      label.textContent = labels[mode];
    } else if (mode === 'hide') el.classList.add('is-hidden');
    else if (mode === 'text') el.classList.add('is-text');
    else el.classList.add('is-hover');
  };
  document.addEventListener('pointerover', (e) => {
    const t = e.target.closest('[data-cursor], a, button, input, label');
    if (!t) return setMode(null);
    const mode = t.dataset.cursor || (t.matches('input') ? 'text' : 'hover');
    setMode(mode);
  });

  gsap.ticker.add((time, dms) => {
    const dt = Math.min(dms / 1000, 0.05);
    const a = 1 - Math.exp(-22 * dt);
    const b = 1 - Math.exp(-9 * dt);
    r.x += (m.x - r.x) * a * 0.75;
    r.y += (m.y - r.y) * a * 0.75;
    tr.x += (m.x - tr.x) * b * 0.6;
    tr.y += (m.y - tr.y) * b * 0.6;
    const vx = m.x - r.x;
    const vy = m.y - r.y;
    const speed = Math.min(Math.hypot(vx, vy) / 60, 0.45);
    const ang = (Math.atan2(vy, vx) * 180) / Math.PI;
    const squash = el.classList.contains('is-label') || el.classList.contains('is-text') ? 0 : speed;
    dot.style.transform = `translate3d(${m.x}px, ${m.y}px, 0)`;
    ring.style.transform = `translate3d(${r.x}px, ${r.y}px, 0) rotate(${ang}deg) scale(${1 + squash}, ${1 - squash * 0.6})`;
    label.style.transform = `rotate(${-ang}deg)`;
    trail.style.transform = `translate3d(${tr.x}px, ${tr.y}px, 0)`;
  });
}

/* ------------------------------------------------------------- magnetic */
export function initMagnetic() {
  if (!env.fine || env.reduced) return;
  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    const strength = parseFloat(el.dataset.magnetic) || 0.3;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });
    el.addEventListener('pointermove', (e) => {
      const b = el.getBoundingClientRect();
      const dx = e.clientX - (b.left + b.width / 2);
      const dy = e.clientY - (b.top + b.height / 2);
      xTo(dx * strength);
      yTo(dy * strength);
      el.style.setProperty('--mx', `${((e.clientX - b.left) / b.width) * 100}%`);
      el.style.setProperty('--my', `${((e.clientY - b.top) / b.height) * 100}%`);
    });
    el.addEventListener('pointerleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 1.1, ease: 'elastic.out(1, 0.35)' });
    });
  });
  // spotlight on fact cards
  document.querySelectorAll('.about__facts li').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const b = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - b.left}px`);
      el.style.setProperty('--my', `${e.clientY - b.top}px`);
    });
  });
}

/* ----------------------------------------------------------------- tilt */
export function initTilt() {
  if (!env.fine || env.reduced) return;
  document.querySelectorAll('[data-tilt]').forEach((host) => {
    const target = host.querySelector('.about__frame') || host;
    gsap.set(target, { transformPerspective: 1100 });
    const rx = gsap.quickTo(target, 'rotationX', { duration: 0.8, ease: 'power3.out' });
    const ry = gsap.quickTo(target, 'rotationY', { duration: 0.8, ease: 'power3.out' });
    host.addEventListener('pointermove', (e) => {
      const b = host.getBoundingClientRect();
      const px = (e.clientX - b.left) / b.width;
      const py = (e.clientY - b.top) / b.height;
      ry((px - 0.5) * 14);
      rx((0.5 - py) * 12);
      target.style.setProperty('--gx', `${px * 100}%`);
      target.style.setProperty('--gy', `${py * 100}%`);
    });
    host.addEventListener('pointerleave', () => {
      rx(0);
      ry(0);
    });
  });
}

/* ------------------------------------------------------------------ nav */
export function initNav({ ScrollTrigger, scrollTo, lenis }) {
  const nav = document.querySelector('[data-nav]');
  const pill = nav.querySelector('.nav__pill');
  const indicator = nav.querySelector('.nav__indicator');
  const links = [...nav.querySelectorAll('[data-link]')];
  const progress = nav.querySelector('[data-progress]');
  const burger = nav.querySelector('.nav__burger');
  const menu = document.getElementById('menu');
  const menuLinks = [...menu.querySelectorAll('a')];

  // Each nav item is its own page, so the active item is the current page.
  const active = nav.dataset.current || 'home';
  const moveIndicator = (id) => {
    const a = links.find((l) => l.dataset.link === id);
    if (!a || !pill.offsetParent) return;
    const pb = pill.getBoundingClientRect();
    const ab = a.getBoundingClientRect();
    indicator.style.width = `${ab.width}px`;
    indicator.style.transform = `translateX(${ab.left - pb.left}px)`;
    indicator.style.opacity = '1';
  };
  links.forEach((l) => {
    l.addEventListener('pointerenter', () => moveIndicator(l.dataset.link));
    l.addEventListener('focus', () => moveIndicator(l.dataset.link));
  });
  pill.addEventListener('pointerleave', () => moveIndicator(active));
  pill.addEventListener('focusout', () => moveIndicator(active));

  let lastY = 0;
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => {
      const y = self.scroll();
      gsap.set(progress, { scaleX: self.progress });
      const goingDown = y > lastY + 2;
      const goingUp = y < lastY - 2;
      if (!nav.contains(document.activeElement) && !menu.classList.contains('is-open')) {
        if (goingDown && y > window.innerHeight * 0.8) nav.classList.add('is-hidden');
        else if (goingUp) nav.classList.remove('is-hidden');
      }
      nav.classList.toggle('is-compact', y > window.innerHeight * 0.6);
      lastY = y;
    },
  });
  nav.addEventListener('focusin', () => nav.classList.remove('is-hidden'));
  window.addEventListener('resize', () => moveIndicator(active));
  // re-measure once the compact width transition settles
  pill.addEventListener('transitionend', (e) => e.propertyName === 'width' && moveIndicator(active));
  requestAnimationFrame(() => moveIndicator(active));
  document.fonts?.ready.then(() => moveIndicator(active));

  /* mobile menu */
  const setMenu = (open) => {
    menu.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.setAttribute('aria-hidden', String(!open));
    menuLinks.forEach((a) => (a.tabIndex = open ? 0 : -1));
    if (open) {
      lenis?.stop();
      gsap.fromTo(menu.querySelectorAll('.menu__links li'), { y: 60, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.06, duration: 0.8, delay: 0.25, ease: 'expo.out' });
      setTimeout(() => menuLinks[0]?.focus(), 350);
    } else {
      lenis?.start();
    }
  };
  burger.addEventListener('click', () => setMenu(!menu.classList.contains('is-open')));
  menu.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    const href = a.getAttribute('href') || '';
    setMenu(false);
    if (href.startsWith('#')) {
      e.preventDefault();
      burger.focus();
      setTimeout(() => scrollTo(href), 200);
    }
    // links to other pages fall through to the page transition
  });
  document.addEventListener('keydown', (e) => {
    if (!menu.classList.contains('is-open')) return;
    if (e.key === 'Escape') {
      setMenu(false);
      burger.focus();
    }
    if (e.key === 'Tab') {
      const items = [burger, ...menuLinks];
      const i = items.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) {
        e.preventDefault();
        items[items.length - 1].focus();
      } else if (!e.shiftKey && i === items.length - 1) {
        e.preventDefault();
        items[0].focus();
      }
    }
  });
}

/* ---------------------------------------------------------- local clock */
export function initClock(timeZone) {
  const fmt = new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone });
  const els = document.querySelectorAll('[data-clock]');
  const tick = () => els.forEach((el) => (el.textContent = fmt.format(new Date())));
  tick();
  setInterval(tick, 20000);
}

/* ------------------------------------------------------- page transitions */
// A brand-purple curtain wipes up before moving to another page; the next
// page's loader lifts it again.
export function initPageTransitions() {
  const curtain = document.createElement('div');
  curtain.className = 'page-curtain';
  curtain.setAttribute('aria-hidden', 'true');
  document.body.appendChild(curtain);
  const reset = () => gsap.set(curtain, { scaleY: 0 });
  reset();
  // returning with the back button can restore a covered page from the cache
  window.addEventListener('pageshow', (e) => e.persisted && reset());

  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest('a[href]');
    if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || /^(mailto|tel):/.test(href)) return;
    const url = new URL(href, location.href);
    if (url.origin !== location.origin) return;
    if (url.pathname === location.pathname && url.hash) return;
    e.preventDefault();
    if (env.reduced) {
      location.href = url.href;
      return;
    }
    gsap.fromTo(curtain, { scaleY: 0 }, { scaleY: 1, transformOrigin: 'bottom', duration: 0.6, ease: 'expo.inOut', onComplete: () => (location.href = url.href) });
  });
}
