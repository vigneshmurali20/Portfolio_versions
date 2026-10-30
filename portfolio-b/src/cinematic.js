import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './cinematic.css';

export function cinematic({ hero, reduced }) {
  if (!hero) return;
  document.documentElement.classList.add('cinematic');
  const caption = document.createElement('div');
  caption.className = 'cinema-scroll';
  caption.setAttribute('aria-hidden', 'true');
  caption.innerHTML = '<span>SCROLL TO EXPLORE</span><span class="cinema-scroll__track"><i></i></span><span class="cinema-scroll__count">01 / 11</span>';
  hero.append(caption);
  const backdrop = document.createElement('div');
  backdrop.className = 'cinema-backdrop';
  backdrop.setAttribute('aria-hidden', 'true');
  backdrop.textContent = 'IN MOTION';
  hero.prepend(backdrop);
  ['back', 'near'].forEach((depth) => {
    const cloud = document.createElement('div');
    cloud.className = `cinema-cloud cinema-cloud--${depth}`;
    cloud.setAttribute('aria-hidden', 'true');
    const image = new Image();
    image.alt = '';
    image.decoding = 'async';
    image.addEventListener('load', () => cloud.classList.add('is-loaded'));
    image.src = `${import.meta.env.BASE_URL}images/cloud-foreground.webp`;
    cloud.append(image);
    hero.append(cloud);
  });
  if (reduced) return;

  const mm = gsap.matchMedia();
  mm.add({ desktop: '(min-width: 861px)', mobile: '(max-width: 860px)' }, ({ conditions }) => {
    const desktop = conditions.desktop;
    hero.dataset.cinemaPinned = 'true';
    const shot = gsap.timeline({
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: () => `+=${Math.round(innerHeight * (desktop ? 1.45 : 0.7))}`,
        pin: true,
        scrub: 0.65,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => { hero.cinemaProgress = self.progress; },
      },
    });
    shot.to('.hero__copy', { y: desktop ? -90 : -45, opacity: 0, ease: 'power2.in', duration: 0.7 }, 0.2)
      .to('.cinema-backdrop', { xPercent: -12, scale: 1.18, opacity: 0.02, ease: 'none', duration: 1 }, 0)
      .to('.hero__trust, .hero__tag, .badge', { opacity: 0, y: -50, duration: 0.4 }, 0)
      .to('.cinema-scroll__track i', { scaleX: 1, ease: 'none', duration: 1 }, 0)
      .to('.cinema-scroll', { opacity: 0, duration: 0.15 }, 0.85);
    shot.to('.cinema-cloud--back', { xPercent: 6, yPercent: -8, scale: 1.08, ease: 'none', duration: 1 }, 0)
      .to('.cinema-cloud--near', { xPercent: -12, yPercent: -25, scale: 1.35, ease: 'none', duration: 1 }, 0);
    return () => {
      delete hero.dataset.cinemaPinned;
      hero.cinemaProgress = 0;
    };
  });

  // Leave the case-study section untransformed: its sticky project stack must
  // keep the viewport as its containing block. Other chapters enter in depth.
  document.querySelectorAll('main > section:not(.hero):not(#case-studies)').forEach((section) => {
    const head = section.querySelector('.sec-head, .contact__title');
    if (head) {
      const frame = document.createElement('div');
      frame.className = 'cinema-heading';
      head.before(frame);
      frame.append(head);
      gsap.fromTo(frame, { rotationX: 16, y: 65, opacity: 0.2, transformPerspective: 1200, transformOrigin: '50% 100%' }, {
        rotationX: 0, y: 0, opacity: 1, ease: 'power2.out',
        scrollTrigger: { trigger: section, start: 'top 95%', end: 'top 43%', scrub: 0.65 },
      });
    }
    const visual = section.querySelector('.global__panel, .tb__box, .reel__frame');
    if (visual) {
      const frame = document.createElement('div');
      frame.className = 'cinema-visual';
      visual.before(frame);
      frame.append(visual);
      gsap.fromTo(frame, { scale: 0.9, rotationX: 7, y: 70, transformPerspective: 1600 }, {
        scale: 1, rotationX: 0, y: 0, ease: 'none',
        scrollTrigger: { trigger: frame, start: 'top bottom', end: 'top 28%', scrub: 0.7 },
      });
    }
  });

  // Tilt the media inside the card, independently of the sticky stack's scale.
  mm.add('(hover: hover) and (pointer: fine)', () => {
    const cleanups = [];
    const cloudMotion = [...hero.querySelectorAll('.cinema-cloud img')].map((image, i) => ({
      x: gsap.quickTo(image, 'x', { duration: 1.4, ease: 'power3.out' }),
      y: gsap.quickTo(image, 'y', { duration: 1.4, ease: 'power3.out' }),
      depth: i ? -32 : 12,
    }));
    const moveClouds = (e) => {
      if (e.pointerType !== 'mouse') return;
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      cloudMotion.forEach((layer) => { layer.x(x * layer.depth); layer.y(y * layer.depth * 0.45); });
    };
    const resetClouds = () => cloudMotion.forEach((layer) => { layer.x(0); layer.y(0); });
    hero.addEventListener('pointermove', moveClouds, { passive: true });
    hero.addEventListener('pointerleave', resetClouds);
    cleanups.push(() => { hero.removeEventListener('pointermove', moveClouds); hero.removeEventListener('pointerleave', resetClouds); });
    document.querySelectorAll('.cs-card__link').forEach((card) => {
      const media = card.querySelector('.cs-card__media');
      if (!media) return;
      const rx = gsap.quickTo(media, 'rotationX', { duration: 0.7, ease: 'power3.out' });
      const ry = gsap.quickTo(media, 'rotationY', { duration: 0.7, ease: 'power3.out' });
      gsap.set(media, { transformPerspective: 1100 });
      const move = (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        rx((0.5 - y) * 9);
        ry((x - 0.5) * 12);
        card.style.setProperty('--light-x', `${x * 100}%`);
        card.style.setProperty('--light-y', `${y * 100}%`);
      };
      const leave = () => { rx(0); ry(0); };
      card.addEventListener('pointermove', move, { passive: true });
      card.addEventListener('pointerleave', leave);
      cleanups.push(() => { card.removeEventListener('pointermove', move); card.removeEventListener('pointerleave', leave); });
    });
    return () => cleanups.forEach((fn) => fn());
  });
  return () => mm.revert();
}
