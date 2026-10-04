import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(Flip);
import { env } from './ui.js';

const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];

function countUp(el, duration = 1.6) {
  const to = parseFloat(el.dataset.count);
  if (Number.isNaN(to) || env.reduced) return;
  const o = { v: 0 };
  gsap.to(o, {
    v: to,
    duration,
    ease: 'power3.out',
    onUpdate: () => (el.textContent = String(Math.round(o.v))),
  });
}

/* ----------------------------------------------------------------- hero */
// Hero pieces are centred with left:50%; GSAP owns that offset from here on.
export function prepareHero() {
  gsap.set(['.hero__head', '.hero__portrait', '.hero__cta'], { xPercent: -50, x: 0 });
  if (env.reduced) return;
  gsap.set('.hero__hello', { opacity: 0, y: 30, scale: 0.8 });
  gsap.set('.hero__line-i', { yPercent: 115, rotate: 3 });
  gsap.set(['.hero__quote', '.hero__stat', '.hero__cta', '.hero__scroll'], { opacity: 0 });
}

export function heroIntro(stage) {
  if (env.reduced) {
    if (stage) stage.state.intro = 1;
    return;
  }
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.call(() => window.dispatchEvent(new Event('hero-intro')), null, 0.7);
  if (stage) tl.to(stage.state, { intro: 1, duration: 2.8, ease: 'power2.inOut' }, 0);
  tl.to('.hero__hello', { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'back.out(2.2)' }, 0.1)
    .from('.hero__hello-spark i', { scaleY: 0, stagger: 0.08, duration: 0.6, ease: 'back.out(3)' }, 0.5)
    .to('.hero__line-i', { yPercent: 0, rotate: 0, duration: 1.4, stagger: 0.14 }, 0.15)
    .fromTo('.hero__quote', { opacity: 0, x: -70 }, { opacity: 1, x: 0, duration: 1.2 }, 0.9)
    .fromTo('.hero__stat', { opacity: 0, x: 70 }, { opacity: 1, x: 0, duration: 1.2 }, 0.9)
    .from('.hero__stars .ico-star', { scale: 0, rotate: -120, stagger: 0.07, duration: 0.7, ease: 'back.out(3)' }, 1.1)
    .add(() => countUp($('.hero__years [data-count]'), 1.4), 1.1)
    .fromTo('.hero__cta', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.2 }, 1.2)
    .from('.hero__cta .pill-btn', { scale: 0.7, opacity: 0, stagger: 0.1, duration: 1, ease: 'back.out(2)' }, 1.3)
    .to('.hero__scroll', { opacity: 1, duration: 1 }, 1.6);
  if (!stage) tl.from('.hero__portrait', { opacity: 0, y: 60, duration: 1.6 }, 0.3);
}

// The intro also animates these elements, so every scroll tween states its
// start values and waits for the first scroll before applying them.
export function heroScroll() {
  if (env.reduced) return;
  const tl = gsap.timeline({
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    defaults: { ease: 'none', immediateRender: false },
  });
  tl.fromTo('.hero__head', { y: 0, opacity: 1, filter: 'blur(0px)' }, { y: () => -window.innerHeight * 0.18, opacity: 0, filter: 'blur(12px)' }, 0)
    .fromTo('.hero__quote', { x: 0, opacity: 1 }, { x: -140, opacity: 0, duration: 0.45 }, 0)
    .fromTo('.hero__stat', { x: 0, opacity: 1 }, { x: 140, opacity: 0, duration: 0.45 }, 0)
    .fromTo('.hero__cta', { y: 0, opacity: 1 }, { y: 90, opacity: 0, duration: 0.6 }, 0)
    .fromTo('.hero__scroll', { opacity: 1 }, { opacity: 0, duration: 0.3 }, 0);
}

/* ---------------------------------------------------------------- about */
export function initReveals() {
  if (env.reduced) return;
  $$('[data-reveal]').forEach((el) => {
    gsap.from(el, {
      y: 50,
      opacity: 0,
      duration: 1.2,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });
  $$('[data-reveal-stagger]').forEach((el) => {
    gsap.from(el.children, {
      y: 40,
      opacity: 0,
      scale: 0.92,
      duration: 1,
      stagger: 0.07,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });
}

export function initAbout() {
  const statement = $('[data-statement]');
  if (!statement) return;
  const words = $$('.w', statement);
  if (env.reduced) {
    words.forEach((w) => w.classList.add('is-lit'));
  } else {
    ScrollTrigger.create({
      trigger: statement,
      start: 'top 82%',
      end: 'bottom 48%',
      scrub: true,
      onUpdate: (self) => {
        const n = Math.round(self.progress * words.length);
        words.forEach((w, i) => w.classList.toggle('is-lit', i < n));
      },
    });
    gsap.fromTo(
      '.about__media',
      { rotationY: -24, rotationX: 10, scale: 0.86, transformPerspective: 1200 },
      {
        rotationY: 0,
        rotationX: 0,
        scale: 1,
        ease: 'none',
        scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'center center', scrub: 1 },
      },
    );
    gsap.from('.about__frame img', {
      yPercent: 18,
      ease: 'none',
      scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'center center', scrub: 1 },
    });
  }
  ScrollTrigger.create({
    trigger: '.about__facts',
    start: 'top 88%',
    once: true,
    onEnter: () => $$('.about__facts [data-count]').forEach((el) => countUp(el)),
  });
}

/* ------------------------------------------------ services: orbit carousel */
export function initOrbit({ scrollToY }) {
  const section = $('.services');
  if (!section || !$('[data-orbit]')) return;
  const pin = $('[data-services-pin]');
  const orbit = $('[data-orbit]');
  const ring = $('[data-orbit-ring]');
  const items = $$('[data-orbit-item]');
  const dots = $$('[data-orbit-dot]');
  const N = items.length;
  const step = 360 / N;
  let st = null;
  let angle = 0;
  let radius = 0;
  let activeIdx = -1;

  const setDots = (i) => {
    if (i === activeIdx) return;
    activeIdx = i;
    dots.forEach((d, j) => {
      d.classList.toggle('is-active', j === i);
      d.setAttribute('aria-selected', String(j === i));
    });
  };

  const layout = () => {
    const cw = Math.round(Math.min(400, Math.max(290, window.innerWidth * 0.25)));
    const ch = Math.round(Math.min(508, window.innerHeight * 0.58));
    ring.style.setProperty('--card-w', `${cw}px`);
    ring.style.height = `${ch}px`;
    radius = Math.round(cw / 2 / Math.tan(Math.PI / N) + cw * 0.28);
    items.forEach((it, i) => {
      it.style.transform = `rotateY(${i * step}deg) translateZ(${radius}px)`;
    });
  };

  const render = () => {
    ring.style.transform = `translateZ(${-radius}px) rotateY(${angle}deg)`;
    items.forEach((it, i) => {
      let rel = (((i * step + angle) % 360) + 540) % 360 - 180;
      const facing = Math.cos((rel * Math.PI) / 180);
      const vis = Math.max(facing, 0);
      it.style.opacity = String(0.15 + 0.85 * Math.pow(vis, 1.4));
      it.style.filter = `brightness(${0.45 + 0.55 * vis}) saturate(${0.6 + 0.4 * vis})`;
      it.style.pointerEvents = facing > 0.55 ? 'auto' : 'none';
      it.style.setProperty('--sheen', `${rel * 2.2}%`);
      const a = it.querySelector('a');
      a.style.setProperty('--sheen', `${-rel * 4}%`);
    });
  };

  const mobileMode = () => env.mobile || env.reduced;

  const setupDesktop = () => {
    layout();
    st = ScrollTrigger.create({
      trigger: section,
      pin,
      start: 'top top',
      end: () => `+=${window.innerHeight * 2.6}`,
      scrub: 0.6,
      snap: { snapTo: 1 / (N - 1), duration: { min: 0.25, max: 0.7 }, ease: 'power2.inOut', delay: 0.08 },
      onUpdate: (self) => {
        angle = -self.progress * step * (N - 1);
        render();
        setDots(Math.round(self.progress * (N - 1)));
      },
      onRefresh: () => {
        layout();
        render();
      },
    });
    render();
    setDots(0);

    // drag to rotate: dragging maps onto scroll, so snapping and dots stay in sync
    let dragging = false;
    let moved = 0;
    let startX = 0;
    let startScroll = 0;
    const pxPerCard = () => (st.end - st.start) / (N - 1);
    orbit.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      dragging = true;
      moved = 0;
      startX = e.clientX;
      startScroll = st.scroll();
    });
    window.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      moved = Math.max(moved, Math.abs(dx));
      if (moved > 6) {
        const cw = ring.getBoundingClientRect().width || 360;
        const y = Math.min(st.end, Math.max(st.start, startScroll - (dx / cw) * pxPerCard()));
        scrollToY(y, true);
      }
    });
    window.addEventListener('pointerup', () => (dragging = false));
    orbit.addEventListener(
      'click',
      (e) => {
        if (moved > 6) {
          e.preventDefault();
          e.stopPropagation();
        }
      },
      true,
    );

    const goTo = (i) => scrollToY(st.start + (i / (N - 1)) * (st.end - st.start));
    dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));
    items.forEach((it, i) => it.querySelector('a').addEventListener('focus', () => i !== activeIdx && goTo(i)));
  };

  const setupMobile = () => {
    const update = () => {
      const c = ring.scrollLeft + ring.clientWidth / 2;
      let best = 0;
      let bestD = Infinity;
      items.forEach((it, i) => {
        const d = Math.abs(it.offsetLeft + it.offsetWidth / 2 - c);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      });
      setDots(best);
    };
    ring.addEventListener('scroll', update, { passive: true });
    dots.forEach((d, i) =>
      d.addEventListener('click', () =>
        ring.scrollTo({ left: items[i].offsetLeft - (ring.clientWidth - items[i].offsetWidth) / 2, behavior: env.reduced ? 'auto' : 'smooth' }),
      ),
    );
    update();
  };

  if (mobileMode()) setupMobile();
  else setupDesktop();

  // switching between layouts mid-session is rare; a reload keeps it simple and correct
  let wasMobile = mobileMode();
  window.addEventListener('resize', () => {
    if (mobileMode() !== wasMobile) {
      wasMobile = mobileMode();
      window.location.reload();
    }
  });

  if (!env.reduced) {
    gsap.from(items.map((i) => i.firstElementChild), {
      y: 120,
      opacity: 0,
      rotateX: -30,
      stagger: 0.05,
      duration: 1.4,
      ease: 'expo.out',
      scrollTrigger: { trigger: section, start: 'top 70%', once: true },
    });
  }
}

/* ------------------------------------------------------------ experience */
export function initTimeline() {
  const tl = $('[data-timeline]');
  if (!tl) return;
  const rail = $('[data-rail]', tl);
  const spark = $('[data-spark]', tl);
  const jobs = $$('[data-job]', tl);

  ScrollTrigger.create({
    trigger: tl,
    start: 'top 62%',
    end: 'bottom 62%',
    scrub: env.reduced ? false : 0.5,
    onUpdate: (self) => {
      gsap.set(rail, { scaleY: self.progress });
      gsap.set(spark, { top: `${self.progress * 100}%` });
    },
  });
  jobs.forEach((job) => {
    ScrollTrigger.create({
      trigger: job.querySelector('.job__node'),
      start: 'center 62%',
      onEnter: () => job.classList.add('is-active'),
      onLeaveBack: () => job.classList.remove('is-active'),
    });
    if (env.reduced) return;
    const t = gsap.timeline({
      scrollTrigger: { trigger: job, start: 'top 85%', toggleActions: 'play none none reverse' },
      defaults: { duration: 1.1, ease: 'expo.out' },
    });
    t.from(job.querySelector('.job__where'), { x: env.mobile ? 0 : -80, y: env.mobile ? 30 : 0, opacity: 0 })
      .from(job.querySelector('.job__node'), { scale: 0, rotate: -180, duration: 0.9, ease: 'back.out(2)' }, 0.05)
      .from(job.querySelector('.job__what'), { x: env.mobile ? 0 : 80, y: env.mobile ? 30 : 0, opacity: 0 }, 0.1);
  });
}

/* ------------------------------------------------------------- portfolio */
export function initPortfolio() {
  if (env.reduced || !$('.platforms')) return;
  gsap.from('.platform', {
    y: 120,
    rotateX: 24,
    opacity: 0,
    transformPerspective: 1200,
    stagger: 0.15,
    duration: 1.4,
    ease: 'expo.out',
    scrollTrigger: { trigger: '.platforms', start: 'top 85%', once: true },
  });
  gsap.fromTo(
    '.feature__screen',
    { rotationX: 42, rotationY: -14, scale: 0.84, transformPerspective: 1400 },
    {
      rotationX: 0,
      rotationY: 0,
      scale: 1,
      ease: 'none',
      scrollTrigger: { trigger: '[data-feature]', start: 'top bottom', end: 'center 55%', scrub: 1 },
    },
  );
  gsap.from('.feature__text > *', {
    y: 50,
    opacity: 0,
    stagger: 0.12,
    duration: 1.2,
    ease: 'expo.out',
    scrollTrigger: { trigger: '[data-feature]', start: 'top 75%', once: true },
  });
}

/* --------------------------------------------------------------- marquee */
export function initMarquee(getVelocity) {
  const tracks = $$('[data-marquee]').map((el) => ({ el, dir: parseFloat(el.dataset.marquee), x: 0, w: 0 }));
  const measure = () => tracks.forEach((t) => (t.w = t.el.scrollWidth / 2));
  measure();
  window.addEventListener('resize', measure);
  if (env.reduced) return;
  let scrollDir = 1;
  gsap.ticker.add((time, dms) => {
    const dt = Math.min(dms / 1000, 0.05);
    const v = getVelocity();
    if (Math.abs(v) > 1) scrollDir = Math.sign(v);
    const boost = Math.min(Math.abs(v) * 0.6, 2400);
    tracks.forEach((t) => {
      if (!t.w) return;
      t.x -= (70 + boost) * t.dir * scrollDir * dt;
      t.x = ((t.x % t.w) + t.w) % t.w;
      t.el.style.transform = `translate3d(${-t.x}px,0,0) skewX(${Math.max(-12, Math.min(12, -v * 0.004 * t.dir))}deg)`;
    });
  });
}

/* ------------------------------------------------------------------- cta */
export function initCta({ email }) {
  const form = $('[data-cta-form]');
  if (!form) return;
  const input = form.querySelector('input');
  const msg = $('[data-cta-msg]');
  const valid = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = input.value.trim();
    if (!valid(v)) {
      msg.textContent = 'Please enter a valid email address, like name@example.com.';
      msg.classList.add('is-error');
      input.setAttribute('aria-invalid', 'true');
      input.focus();
      if (!env.reduced) gsap.fromTo(form, { x: -10 }, { x: 0, duration: 0.6, ease: 'elastic.out(1.2, 0.3)' });
      return;
    }
    input.removeAttribute('aria-invalid');
    msg.classList.remove('is-error');
    msg.textContent = 'Opening your email app with a message to Vignesh…';
    const subject = encodeURIComponent('Project idea — let’s discuss');
    const body = encodeURIComponent(`Hi Vignesh,\n\nI have a project idea I’d like to discuss.\n\nYou can reach me at: ${v}\n`);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  });
  input.addEventListener('input', () => {
    if (msg.classList.contains('is-error') && valid(input.value.trim())) {
      msg.textContent = '';
      msg.classList.remove('is-error');
      input.removeAttribute('aria-invalid');
    }
  });

  if (env.reduced) return;
  if ($('.cta__line-i')) gsap.from('.cta__line-i', {
    yPercent: 115,
    rotate: 3,
    stagger: 0.15,
    duration: 1.4,
    ease: 'expo.out',
    scrollTrigger: { trigger: '.cta', start: 'top 70%', once: true },
  });
  gsap.from(form, {
    y: 60,
    scale: 0.92,
    opacity: 0,
    duration: 1.3,
    ease: 'expo.out',
    scrollTrigger: { trigger: form, start: 'top 92%', once: true },
  });
}

/* ---------------------------------------------------------------- footer */
export function initFooter() {
  const giant = $('[data-giant]');
  if (!giant) return;
  if (env.reduced) return;
  gsap.from(giant, {
    yPercent: 40,
    opacity: 0,
    ease: 'none',
    scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'bottom bottom', scrub: 1 },
  });
}

/* ------------------------------------------------- accent typeface effect */
// Accent words use the variable fonts' weight axis instead of a gradient:
// letters ripple from thin to bold as they scroll in, and swell toward the
// cursor as it passes over them.
export function initTypeEffect() {
  const groups = $$('[data-accent]').map((el) => {
    const chars = $$('.ch', el);
    const base = parseFloat(getComputedStyle(el).fontWeight) || 600;
    // Urbanist runs 100-900; Quicksand (the contact heading) 300-700
    const quick = getComputedStyle(el).fontFamily.includes('Quicksand');
    return { el, chars, base, min: quick ? 300 : 100, max: quick ? 700 : 900, w: chars.map(() => base) };
  });
  if (env.reduced) return;

  groups.forEach((g) => {
    const inHero = !!g.el.closest('.hero, .page-hero');
    const tw = gsap.fromTo(
      g.chars,
      { fontWeight: g.min, y: 8 },
      {
        fontWeight: g.base,
        y: 0,
        duration: 1.1,
        stagger: 0.06,
        ease: 'power3.out',
        paused: inHero,
        scrollTrigger: inHero ? undefined : { trigger: g.el, start: 'top 85%', once: true },
        onComplete: () => g.chars.forEach((c, i) => (g.w[i] = g.base)),
      },
    );
    // the hero title sits behind the loader, so it plays with the hero intro
    if (inHero) window.addEventListener('hero-intro', () => tw.play(), { once: true });
  });

  if (!env.fine) return;
  let mx = -9999;
  let my = -9999;
  window.addEventListener('pointermove', (e) => {
    mx = e.clientX;
    my = e.clientY;
  }, { passive: true });
  const radius = 140;
  gsap.ticker.add(() => {
    for (const g of groups) {
      const r = g.el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) continue;
      // skip the math entirely when the cursor is nowhere near this word
      const far = my < r.top - radius || my > r.bottom + radius || mx < r.left - radius || mx > r.right + radius;
      g.chars.forEach((c, i) => {
        let target = g.base;
        if (!far) {
          const b = c.getBoundingClientRect();
          const d = Math.hypot(mx - (b.left + b.width / 2), my - (b.top + b.height / 2));
          target = g.base + (g.max - g.base) * Math.exp(-((d / radius) ** 2) * 2.2);
        }
        if (Math.abs(g.w[i] - target) < 0.5) return;
        g.w[i] += (target - g.w[i]) * 0.18;
        c.style.fontWeight = String(Math.round(g.w[i]));
      });
    }
  });
}

/* ------------------------------------------------------ inner page header */
export function preparePageHero() {
  if (env.reduced) return;
  gsap.set('.page-hero .hero__line-i', { yPercent: 115, rotate: 2 });
  gsap.set(['.page-hero__kicker', '.page-hero__body', '.page-hero__scroll'], { opacity: 0, y: 24 });
}

export function pageHeroIntro(stage) {
  if (env.reduced) {
    if (stage) stage.state.intro = 1;
    return;
  }
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.call(() => window.dispatchEvent(new Event('hero-intro')), null, 0.35);
  if (stage) tl.to(stage.state, { intro: 1, duration: 2.2, ease: 'power2.inOut' }, 0);
  tl.to('.page-hero__kicker', { opacity: 1, y: 0, duration: 1 }, 0.05)
    .to('.page-hero .hero__line-i', { yPercent: 0, rotate: 0, duration: 1.3 }, 0.12)
    .to('.page-hero__body', { opacity: 1, y: 0, duration: 1.1 }, 0.45)
    .to('.page-hero__scroll', { opacity: 1, y: 0, duration: 1 }, 0.8);
}

export function pageHeroScroll() {
  if (env.reduced || !$('.page-hero')) return;
  gsap.timeline({
    scrollTrigger: { trigger: '.page-hero', start: 'top top', end: 'bottom top', scrub: true },
    defaults: { ease: 'none', immediateRender: false },
  })
    .fromTo('.page-hero__title', { y: 0, opacity: 1, filter: 'blur(0px)' }, { y: () => -window.innerHeight * 0.15, opacity: 0, filter: 'blur(10px)' }, 0)
    .fromTo(['.page-hero__kicker', '.page-hero__body'], { opacity: 1 }, { opacity: 0, duration: 0.6 }, 0);
}

/* ------------------------------------------------------------ skill bars */
export function initSkills() {
  $$('[data-skills]').forEach((list) => {
    const items = $$('.skill', list);
    ScrollTrigger.create({
      trigger: list,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        items.forEach((it, i) => {
          if (!env.reduced) {
            gsap.from(it.querySelector('.skill__fill'), { scaleX: 0, duration: 1.6, delay: i * 0.12, ease: 'expo.out' });
            gsap.from(it.querySelector('.skill__knob'), { left: '0%', duration: 1.6, delay: i * 0.12, ease: 'expo.out' });
          }
          const n = it.querySelector('[data-count]');
          if (n) countUp(n, 1.6);
        });
      },
    });
  });
}

/* ------------------------------------------------------------ tool rings */
export function initRings() {
  $$('[data-rings]').forEach((list) => {
    const rings = $$('.ring', list);
    ScrollTrigger.create({
      trigger: list,
      start: 'top 85%',
      once: true,
      onEnter: () =>
        rings.forEach((r, i) => {
          const fill = r.querySelector('.ring__fill');
          if (!env.reduced) gsap.from(fill, { strokeDashoffset: parseFloat(fill.dataset.full), duration: 1.8, delay: i * 0.08, ease: 'expo.out' });
          const n = r.querySelector('[data-count]');
          if (n) countUp(n, 1.6);
        }),
    });
    if (!env.reduced) {
      gsap.from(rings, { y: 50, opacity: 0, stagger: 0.06, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: list, start: 'top 90%', once: true } });
    }
  });
}

/* ------------------------------------------------- double-diamond diagram */
export function initDiamond() {
  const d = $('[data-diamond]');
  if (!d || env.reduced) return;
  const line = d.querySelector('.diamond__line');
  const len = line.getTotalLength();
  gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
  const tl = gsap.timeline({ scrollTrigger: { trigger: d, start: 'top 80%', end: 'bottom 45%', scrub: 1 } });
  tl.to(line, { strokeDashoffset: 0, ease: 'none' })
    .from(d.querySelectorAll('.diamond__shape'), { opacity: 0, scale: 0.85, transformOrigin: '50% 50%', stagger: 0.2 }, 0)
    .from(d.querySelectorAll('.diamond__dot'), { scale: 0, transformOrigin: '50% 50%', stagger: 0.12 }, 0.1)
    .from(d.querySelectorAll('.diamond__label'), { opacity: 0, y: 14, stagger: 0.12 }, 0.3);
}

/* -------------------------------------------------------- project filters */
export function initFilters() {
  const bar = $('[data-filters]');
  if (!bar) return;
  const cards = $$('[data-pgrid] .pcard');
  const buttons = $$('[data-filter]', bar);
  bar.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-filter]');
    if (!btn || btn.classList.contains('is-active')) return;
    const cat = btn.dataset.filter;
    buttons.forEach((b) => {
      const on = b === btn;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', String(on));
    });
    const state = env.reduced ? null : Flip.getState(cards);
    cards.forEach((c) => (c.hidden = !(cat === 'All' || c.dataset.cat === cat)));
    if (state) {
      Flip.from(state, {
        duration: 0.7,
        ease: 'power3.inOut',
        scale: true,
        absolute: true,
        onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.6 }),
        onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.85, duration: 0.4 }),
      });
    }
    ScrollTrigger.refresh();
  });
  if (!env.reduced) {
    gsap.from(cards, { y: 60, opacity: 0, stagger: 0.05, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '[data-pgrid]', start: 'top 88%', once: true } });
  }
}

/* --------------------------------------------------- testimonial slider */
// Cards drift slowly and loop; scrolling the page nudges them along, hovering
// or focusing pauses them, and they can be dragged.
export function initTestimonials(getVelocity) {
  const slider = $('[data-tslider]');
  if (!slider) return;
  const track = $('[data-tslider-track]', slider);
  if (env.reduced) {
    slider.classList.add('is-static');
    return;
  }
  let x = 0;
  let w = track.scrollWidth / 2;
  window.addEventListener('resize', () => (w = track.scrollWidth / 2));
  let paused = false;
  let dragging = false;
  let lastX = 0;
  let vel = 0;
  slider.addEventListener('pointerenter', () => (paused = true));
  slider.addEventListener('pointerleave', () => (paused = false));
  slider.addEventListener('focusin', () => (paused = true));
  slider.addEventListener('focusout', () => (paused = false));
  slider.addEventListener('pointerdown', (e) => {
    dragging = true;
    lastX = e.clientX;
    slider.setPointerCapture?.(e.pointerId);
  });
  slider.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    lastX = e.clientX;
    x -= dx;
    vel = -dx * 60;
  });
  const end = () => (dragging = false);
  slider.addEventListener('pointerup', end);
  slider.addEventListener('pointercancel', end);

  gsap.ticker.add((t, dms) => {
    const dt = Math.min(dms / 1000, 0.05);
    if (!dragging) {
      const auto = paused ? 0 : 40;
      vel *= Math.exp(-4 * dt);
      x += (auto + vel + Math.abs(getVelocity()) * 0.15) * dt;
    }
    if (!w) w = track.scrollWidth / 2;
    if (w) x = ((x % w) + w) % w;
    track.style.transform = `translate3d(${-x}px,0,0)`;
  });
  gsap.from($$('.tcard', track).slice(0, 4), { y: 80, opacity: 0, rotateX: -20, stagger: 0.1, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: slider, start: 'top 85%', once: true } });
}

/* --------------------------------------------------------- copy buttons */
export function initCopy() {
  const toast = $('[data-copy-toast]');
  $$('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const text = btn.dataset.copy;
      let ok = false;
      try {
        await navigator.clipboard.writeText(text);
        ok = true;
      } catch {
        // clipboard refused: select the visible value so it can be copied by hand
        const value = btn.parentElement.querySelector('.ccard__value');
        const range = document.createRange();
        range.selectNodeContents(value);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      }
      btn.textContent = ok ? 'Copied' : 'Selected';
      if (toast) toast.textContent = ok ? `Copied ${text}` : `Selected ${text}. Press Ctrl+C or ⌘C to copy.`;
      setTimeout(() => (btn.textContent = 'Copy'), 2000);
    });
  });
}
