/*
 * Renders the page from src/content.js into static HTML at build time
 * (vite.config.js), so the content is there for search engines, screen
 * readers and visitors without JavaScript. src/main.js only adds motion.
 */
import * as simpleIcons from 'simple-icons';
import {
  site,
  aiIntro,
  aboutAi,
  aiPractices,
  aiTools,
  meta,
  nav,
  hero,
  disciplinesIntro,
  disciplines,
  toolboxIntro,
  tools,
  workIntro,
  workFilters,
  projects,
  showreelIntro,
  aboutLong,
  experience,
  skills,
  processSteps,
  testimonialsIntro,
  testimonialsAreSamples,
  brands,
  testimonials,
  contact,
} from './content.js';

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// The V mark from the Figma logo (node 1:13591).
export const logoPath = 'M0 20.58L0 13.87L4.87 9L9.74 4.13L9.74 7.01L9.74 9.89L14.68 4.94L19.62 0L24.57 4.94L29.51 9.89L29.51 7.01L29.51 4.13L34.38 9L39.25 13.87L39.25 20.58L39.25 27.3L34.41 22.46C31.75 19.8 29.54 17.63 29.46 17.63C29.41 17.63 29.36 18.87 29.36 20.39L29.36 23.16L24.49 18.3L19.62 13.43L14.75 18.3L9.89 23.16L9.89 20.39C9.89 18.87 9.84 17.63 9.78 17.63C9.71 17.63 7.5 19.8 4.84 22.46L0 27.3L0 20.58Z';

/* Flat line icons (24px grid, 1.6 stroke). No bevels or gradients. */
const ICONS = {
  arrowUR: '<path d="M7 17 17 7M9 7h8v8"/>',
  arrowR: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  arrowL: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  arrowUp: '<path d="M12 19V5M6 11l6-6 6 6"/>',
  play: '<path d="M8 5.5v13l11-6.5z" fill="currentColor" stroke="none"/>',
  wave: '<path d="M4 10v4M8 7v10M12 4v16M16 8v8M20 10.5v3"/>',
  copy: '<rect x="8.5" y="8.5" width="11" height="11" rx="2.5"/><path d="M15.5 8.5V6a1.5 1.5 0 0 0-1.5-1.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  mail: '<rect x="3.5" y="5.5" width="17" height="13" rx="2.5"/><path d="m4 7 8 6 8-6"/>',
  phone: '<path d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4.5 5.5a2 2 0 0 1 2-2z"/>',
  shake: '<path d="M4 9c2-3 4-3 6 0s4 3 6 0 4-3 4-3M4 15c2-3 4-3 6 0s4 3 6 0 4-3 4-3"/>',
  reset: '<path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3M4.5 4.5v4h4"/>',
  menu: '<path d="M4 8h16M4 16h16"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  sparkle: '<path d="M12 2.5c.7 5 2.5 8.6 9.5 9.5-7 .9-8.8 4.5-9.5 9.5-.7-5-2.5-8.6-9.5-9.5 7-.9 8.8-4.5 9.5-9.5z" fill="currentColor" stroke="none"/>',
  hand: '<path d="M8 13V6.5a1.5 1.5 0 0 1 3 0V12M11 11V5a1.5 1.5 0 0 1 3 0v6M14 11V6.5a1.5 1.5 0 0 1 3 0V14a6 6 0 0 1-6 6h-.5a6 6 0 0 1-4.6-2.2L3.6 15a1.6 1.6 0 0 1 2.4-2.1L8 15"/>',
  pin: '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
  sound: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>',
  mute: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="m16 9.5 5 5M21 9.5l-5 5"/>',
  pause: '<path d="M8 5.5v13M16 5.5v13"/>',
  behance:
    '<path d="M3.5 6.5h5a2.75 2.75 0 0 1 0 5.5h-5zM3.5 12h5.75a3 3 0 0 1 0 6H3.5zM14.5 7.5h5M14 14.25h7a3.5 3.5 0 1 0-1 2.5" />',
};
export const icon = (name, cls = 'icon') =>
  `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICONS[name]}</svg>`;

export const vMark = (cls = 'vmark') =>
  `<svg class="${cls}" viewBox="0 0 39.25 27.3" aria-hidden="true" focusable="false"><path transform="matrix(1 0 0 -1 0 27.3)" d="${logoPath}"/></svg>`;

// Each letter rolls on hover, so the wordmark is split into letters for the
// eye and left whole for screen readers.
const wordmark = () => `
  <span class="wordmark" aria-hidden="true">${vMark()}<span class="wordmark__text">${[...site.name]
    .map((c, i) => `<span class="wm-ch" style="--i:${i}"><span>${c}</span><span>${c}</span></span>`)
    .join('')}</span></span>`;

/* Headline letters carry two copies (upright and italic) for the roll effect.
   The visible copy is aria-hidden; a plain copy is read instead. */
const rollLetters = (text) =>
  text
    .split(' ')
    .map(
      (word) =>
        `<span class="hw">${[...word]
          .map(
            (c, i) =>
              `<span class="hc" style="--i:${i}"><span class="hc__a">${esc(c)}</span><span class="hc__b">${esc(c)}</span></span>`,
          )
          .join('')}</span>`,
    )
    .join(' ');

const lines = (arr, cls = 'line') =>
  arr.map((l, i) => `<span class="${cls}${i === arr.length - 1 ? ` ${cls}--em` : ''}"><span class="${cls}__in">${esc(l)}</span></span>`).join(' ');

const sectionHead = ({ eyebrow, title, body }, id, extra = '') => `
  <header class="sec-head${extra}">
    <p class="eyebrow" data-reveal><span class="eyebrow__dot"></span>${esc(eyebrow)}</p>
    <h2 class="sec-title" id="${id}-title" data-split>${lines(title)}</h2>
    ${body ? `<p class="sec-body" data-reveal>${esc(body)}</p>` : ''}
  </header>`;

const btn = (label, href, { variant = 'dark', iconName = 'arrowR', attrs = '' } = {}) => `
  <a class="btn btn--${variant}" href="${esc(href)}" data-magnetic ${attrs}>
    <span class="btn__roll"><span class="btn__label" data-text="${esc(label)}">${esc(label)}</span></span>
    <span class="btn__icon">${icon(iconName)}</span>
  </a>`;

/* ---------------------------------------------------------------- nav */
export const renderNav = () => `
  <header class="nav" data-nav>
    <a class="nav__logo" href="#top" aria-label="${esc(site.fullName)}, back to top" data-cursor="Top">${wordmark()}</a>
    <nav class="nav__pill" aria-label="Main">
      <span class="nav__indicator" aria-hidden="true"></span>
      <ul>
        ${nav
          .map(
            (n) =>
              `<li><a class="nav__link" href="${n.href}" data-section="${n.href.slice(1)}"><span class="roll"><span data-text="${esc(n.label)}">${esc(n.label)}</span></span></a></li>`,
          )
          .join('')}
      </ul>
    </nav>
    ${btn('Let’s talk', '#contact', { variant: 'dark', iconName: 'arrowUR', attrs: 'data-nav-cta' })}
    <button class="nav__menu" type="button" aria-expanded="false" aria-controls="sheet" data-menu>
      <span class="sr-only">Open menu</span>${icon('menu')}
    </button>
  </header>
  <div class="sheet" id="sheet" hidden data-sheet>
    <div class="sheet__inner" role="dialog" aria-modal="true" aria-label="Menu">
      <button class="sheet__close" type="button" data-menu-close><span class="sr-only">Close menu</span>${icon('close')}</button>
      <ul>
        ${nav.map((n, i) => `<li style="--i:${i}"><a href="${n.href}"><span class="sheet__num">0${i + 1}</span>${esc(n.label)}</a></li>`).join('')}
      </ul>
      <a class="sheet__mail" href="mailto:${site.email}">${esc(site.email)}</a>
    </div>
  </div>`;

/* ---------------------------------------------------------------- hero */
const renderHero = () => {
  const [l1, l2] = hero.lines;
  const toolStack = tools.slice(0, 4);
  return `
  <section class="hero" id="top" aria-labelledby="hero-title" data-hero>
    <canvas class="hero__gl" aria-hidden="true" data-hero-gl></canvas>
    <div class="hero__copy">
      <a class="notif" href="#contact" data-notif data-cursor="Say hi">
        <span class="notif__avatar"><img src="${site.portrait}" alt="" width="768" height="600" /><i aria-hidden="true"></i></span>
        <span class="notif__text">
          <span class="notif__top"><b>${esc(site.name)}</b><span>now</span></span>
          <span class="notif__msg">${esc(hero.hello)} <span class="notif__wave" aria-hidden="true">${icon('hand')}</span></span>
        </span>
      </a>
      <h1 class="hero__title" id="hero-title">
        <span class="sr-only">${esc(l1)} ${esc(l2)}</span>
        <span class="hero__line" aria-hidden="true">${rollLetters(l1)}</span>
        <span class="hero__line hero__line--em" aria-hidden="true">${rollLetters(l2)}</span>
      </h1>
      <p class="hero__body" data-hero-in>${esc(hero.body)}</p>
      <div class="hero__ctas" data-hero-in>
        ${btn(hero.cta.label, hero.cta.href, { iconName: 'arrowUR' })}
        <button class="btn btn--ghost" type="button" data-reel-open data-magnetic>
          <span class="btn__play">${icon('play')}</span>
          <span class="btn__roll"><span class="btn__label" data-text="Watch showreel">Watch showreel</span></span>
        </button>
      </div>
    </div>

    <div class="hero__stage" data-hero-stage>
      <img class="hero__portrait" src="${site.portrait}" alt="${esc(site.portraitAlt)}" width="768" height="600" fetchpriority="high" data-portrait />
      <ul class="hero__ring-fallback" aria-hidden="true">
        <li>UI/UX</li><li>Product</li><li>Motion</li><li>Graphic</li>
      </ul>
    </div>

    <svg class="hero__wires" aria-hidden="true" data-wires><path data-wire="0"/><path data-wire="1"/></svg>

    ${hero.notes
      .map(
        (n, i) => `
      <aside class="note note--${i ? 'right' : 'left'}" data-note="${i}" data-tilt aria-label="${esc(n.title.join(' '))}">
        <span class="note__icon">${
          n.icon === 'tools'
            ? `<span class="note__stack">${tools
                .slice(3, 6)
                .map((t) => `<img src="${t.src}" alt="" width="28" height="28" loading="lazy" />`)
                .join('')}<span class="note__plus">+</span></span>`
            : icon('wave')
        }</span>
        <p class="note__title">${n.title.map(esc).join('<br />')}</p>
        <p class="note__body">${esc(n.body)}</p>
      </aside>`,
      )
      .join('')}

    <a class="badge" href="#contact" aria-label="Open to work. Get in touch" data-cursor="Hi!">
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <defs><path id="badge-circle" d="M60 60m-46 0a46 46 0 1 1 92 0a46 46 0 1 1-92 0"/></defs>
        <text><textPath href="#badge-circle">${esc(hero.badge.repeat(1))}</textPath></text>
      </svg>
      ${icon('sparkle', 'badge__star')}
    </a>

    <div class="hero__trust" data-hero-in>
      <span class="hero__rule" aria-hidden="true"></span>
      <p>${site.experienceYears}+ years of experience with ${hero.trust.map(esc).join(', ')} &amp; more.</p>
      <ul class="tool-stack" aria-label="Main tools">
        ${toolStack.map((t) => `<li><img src="${t.src}" alt="${esc(t.name)}" width="36" height="36" loading="lazy" /></li>`).join('')}
        <li class="tool-stack__more"><a href="#toolbox" aria-label="See the full toolbox">+${tools.length - toolStack.length}</a></li>
      </ul>
    </div>

    <div class="hero__tag" data-hero-in>
      ${icon('sparkle', 'hero__tag-star')}
      <span class="hero__rule" aria-hidden="true"></span>
      <p>${hero.tagline.map(esc).join('<br />')}</p>
    </div>

    <p class="hero__hint" aria-hidden="true">${icon('hand')} Drag the ring</p>
  </section>`;
};

/* ---------------------------------------------------------------- marquee */
const renderMarquee = () => {
  const words = ['UI/UX Design', 'Product Design', 'Motion Graphics', 'Graphic Design', 'Branding', 'App Design', 'Video Editing', 'Print'];
  const row = words.map((w) => `<span class="mq__item">${esc(w)}</span><span class="mq__star">${icon('sparkle')}</span>`).join('');
  return `
  <div class="mq" aria-hidden="true" data-marquee>
    <div class="mq__track">${row}${row}</div>
  </div>`;
};

/* ---------------------------------------------------------------- disciplines */
const previews = {
  wire: `
    <div class="pv pv--wire">
      <div class="pv-win"><i></i><i></i><i></i></div>
      <div class="pv-wire__hero"><b></b><b></b><span class="pv-wire__cta"></span></div>
      <div class="pv-wire__cards"><span></span><span></span><span></span></div>
      <span class="pv-wire__cursor">${icon('arrowUR')}</span>
    </div>`,
  dash: `
    <div class="pv pv--dash">
      <div class="pv-dash__kpi"><b>+38%</b><span>Weekly active</span></div>
      <div class="pv-dash__bars">${[42, 64, 50, 78, 58, 92, 70].map((h, i) => `<span style="--h:${h}%;--i:${i}"></span>`).join('')}</div>
      <svg class="pv-dash__line" viewBox="0 0 200 60" preserveAspectRatio="none"><path pathLength="1" d="M0 48 C30 44 40 20 70 26 S110 50 140 22 S180 10 200 6"/></svg>
    </div>`,
  motion: `
    <div class="pv pv--motion">
      <div class="pv-motion__stage"><span class="pv-motion__ball"></span><span class="pv-motion__shadow"></span></div>
      <div class="pv-motion__tl">
        <span class="pv-motion__head"></span>
        ${[0, 22, 48, 74, 100].map((x) => `<i style="--x:${x}%"></i>`).join('')}
      </div>
    </div>`,
  logo: `
    <div class="pv pv--logo">
      <span class="pv-logo__grid"></span>
      <span class="pv-logo__ring pv-logo__ring--a"></span>
      <span class="pv-logo__ring pv-logo__ring--b"></span>
      <svg class="pv-logo__mark" viewBox="-2 -2 43.25 31.3"><path pathLength="1" transform="matrix(1 0 0 -1 0 27.3)" d="${logoPath}"/></svg>
    </div>`,
  print: `
    <div class="pv pv--print">
      <span class="pv-print__sheet pv-print__sheet--a"><i></i><i></i><i></i></span>
      <span class="pv-print__sheet pv-print__sheet--b"><i></i><i></i><i></i></span>
      <span class="pv-print__sheet pv-print__sheet--c"><b>SALE</b><i></i><i></i></span>
      <span class="pv-print__crop"></span>
    </div>`,
  poster: `
    <div class="pv pv--poster">
      <span class="pv-poster__c"></span><span class="pv-poster__s"></span><span class="pv-poster__t"></span><span class="pv-poster__r"></span>
      <b class="pv-poster__type">Aa</b>
    </div>`,
};

const renderDisciplines = () => `
  <section class="disc" id="disciplines" aria-labelledby="disciplines-title">
    ${sectionHead(disciplinesIntro, 'disciplines')}
    <div class="disc__list" data-disc>
      ${disciplines
        .map(
          (d, i) => `
        <article class="disc__panel${i === 0 ? ' is-open' : ''}" data-disc-panel="${d.key}" style="--i:${i}">
          <h3 class="disc__heading">
            <button class="disc__toggle" type="button" aria-expanded="${i === 0}" aria-controls="disc-${d.key}" id="disc-${d.key}-btn">
              <span class="disc__num">0${i + 1}</span>
              <span class="disc__name">${esc(d.title)}</span>
              <span class="disc__short" aria-hidden="true">${esc(d.short)}</span>
              <span class="disc__plus" aria-hidden="true"></span>
            </button>
          </h3>
          <div class="disc__body" id="disc-${d.key}" role="region" aria-labelledby="disc-${d.key}-btn">
            <div class="disc__preview" aria-hidden="true">${previews[d.preview]}</div>
            <p class="disc__text">${esc(d.body)}</p>
            <ul class="chips" aria-label="Deliverables">${d.deliverables.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
            <a class="disc__project" href="${esc(d.project.href)}" target="_blank" rel="noopener" data-cursor="View">
              <img src="${d.project.image}" alt="" width="416" height="307" loading="lazy" />
              <span><small>Case study</small>${esc(d.project.label)}</span>
              ${icon('arrowUR')}
              <span class="sr-only">(opens Behance in a new tab)</span>
            </a>
          </div>
        </article>`,
        )
        .join('')}
    </div>
  </section>`;

/* ---------------------------------------------------------------- AI lab */
const AI_GLYPHS = {
  terminal: '<path d="M3 5.5A2.5 2.5 0 0 1 5.5 3h13A2.5 2.5 0 0 1 21 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 18.5zm4.2 3.3-1.1 1.1 2.6 2.6-2.6 2.6 1.1 1.1L10.9 12zM12 15.8v1.6h6v-1.6z"/>',
  chat: '<path d="M12 3c5 0 9 3.4 9 7.7s-4 7.7-9 7.7c-1 0-2-.1-2.9-.4L4.5 20l1.1-3.9C4 14.7 3 12.8 3 10.7 3 6.4 7 3 12 3zm-4 6.6a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4zm4 0a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4zm4 0a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4z"/>',
};
const PRACTICE_ICONS = {
  spark: '<path d="M12 2.5c.7 5 2.5 8.6 9.5 9.5-7 .9-8.8 4.5-9.5 9.5-.7-5-2.5-8.6-9.5-9.5 7-.9 8.8-4.5 9.5-9.5z" fill="currentColor" stroke="none"/>',
  agent: '<rect x="5" y="8" width="14" height="11" rx="3"/><path d="M12 4v4M9 13h.01M15 13h.01M9.5 16h5"/>',
  code: '<path d="m8 8-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14"/>',
};
const aiIcon = (t) => {
  const s = t.si ? simpleIcons[t.si] : null;
  const path = s ? `<path d="${s.path}"/>` : AI_GLYPHS[t.glyph];
  const color = s ? `#${s.hex}` : t.color;
  const badge = t.badge ? `<span class="ai-tile__badge">${icon('arrowR')}</span>` : '';
  return { svg: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">${path}</svg>${badge}`, color };
};

const renderAiLab = () => `
  <section class="ai" id="ai-lab" aria-labelledby="ai-lab-title">
    <div class="ai__top">
      ${sectionHead(aiIntro, 'ai-lab')}
      <ul class="ai__practices">
        ${aiPractices
          .map(
            (p, i) => `
          <li class="ai-card" data-reveal data-tilt style="--i:${i}">
            <span class="ai-card__icon"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${PRACTICE_ICONS[p.icon]}</svg></span>
            <h3>${esc(p.title)}</h3>
            <p>${esc(p.body)}</p>
          </li>`,
          )
          .join('')}
      </ul>
    </div>
    <div class="ai__tools">
      ${aiTools
        .map(
          (g) => `
        <div class="ai__group">
          <h3 class="ai__group-title">${esc(g.group)}</h3>
          <ul class="ai__grid">
            ${g.items
              .map((t) => {
                const { svg, color } = aiIcon(t);
                return `<li class="ai-tile" style="--c:${color}"><span class="ai-tile__icon">${svg}</span><span class="ai-tile__name">${esc(t.name)}</span></li>`;
              })
              .join('')}
          </ul>
        </div>`,
        )
        .join('')}
    </div>
    <p class="ai__note">Product names and logos belong to their owners and are shown to list the tools I use.</p>
  </section>`;

/* ---------------------------------------------------------------- toolbox */
const renderToolbox = () => `
  <section class="tb" id="toolbox" aria-labelledby="toolbox-title">
    ${sectionHead(toolboxIntro, 'toolbox')}
    <div class="tb__grid">
      <div class="tb__box" data-playground>
        <canvas class="tb__canvas" data-pg-canvas role="img" aria-label="A box of design tool icons you can drag and throw. Use the tool buttons to choose one with a keyboard."></canvas>
        <div class="tb__slot" data-pg-slot aria-hidden="true">
          <span class="tb__slot-ring"></span>
          <span class="tb__slot-label">Drop<br />a tool</span>
        </div>
        <div class="tb__controls">
          <button class="chip-btn" type="button" data-pg-shake>${icon('shake')}Shake</button>
          <button class="chip-btn" type="button" data-pg-reset>${icon('reset')}Reset</button>
        </div>
        <p class="tb__hint" aria-hidden="true">${icon('hand')} Drag, throw, drop</p>
        <ul class="tb__static" data-pg-static>
          ${tools.map((t) => `<li><img src="${t.src}" alt="" width="64" height="64" loading="lazy" /></li>`).join('')}
        </ul>
      </div>

      <div class="tb__info" data-pg-info aria-live="polite">
        <div class="tb__empty" data-pg-empty>
          <p class="tb__label">Now using</p>
          <p class="tb__empty-title">Nothing in the slot yet.</p>
          <p class="tb__empty-body">Drag any tool into the dashed slot, or pick one below.</p>
        </div>
        <div class="tb__detail" data-pg-detail hidden>
          <p class="tb__label">Now using</p>
          <div class="tb__detail-head">
            <img data-pg-img src="${tools[0].src}" alt="" width="56" height="56" />
            <div>
              <p class="tb__name" data-pg-name></p>
              <p class="tb__use" data-pg-use></p>
            </div>
          </div>
          <div class="tb__meter">
            <svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="52"/><circle class="tb__meter-fill" cx="60" cy="60" r="52" pathLength="100" data-pg-meter/></svg>
            <p><b data-pg-value>0</b><span>%</span><small>Proficiency</small></p>
          </div>
          <p class="tb__label">Used for</p>
          <ul class="chips chips--link" data-pg-disc></ul>
        </div>
        <div class="tb__pick">
          <p class="tb__label" id="tb-pick-label">Pick a tool</p>
          <ul class="tb__keys" aria-labelledby="tb-pick-label">
            ${tools
              .map(
                (t) =>
                  `<li><button type="button" class="tb__key" data-pg-pick="${t.key}" aria-pressed="false"><img src="${t.src}" alt="" width="28" height="28" loading="lazy" /><span>${esc(t.name.replace('Adobe ', ''))}</span></button></li>`,
              )
              .join('')}
          </ul>
        </div>
      </div>
    </div>
  </section>`;

/* ---------------------------------------------------------------- work */
const renderWork = () => {
  const catKey = (cat) => (workFilters.find((f) => f.match && f.match.includes(cat)) || { key: 'all' }).key;
  return `
  <section class="work" id="work" aria-labelledby="work-title">
    <div class="work__top">
      ${sectionHead(workIntro, 'work')}
      <div class="filters" role="group" aria-label="Filter projects" data-filters>
        ${workFilters
          .map((f) => {
            const n = f.key === 'all' ? projects.length : projects.filter((p) => catKey(p.category) === f.key).length;
            return `<button type="button" class="filter${f.key === 'all' ? ' is-active' : ''}" data-filter="${f.key}" aria-pressed="${f.key === 'all'}">${esc(f.label)}<sup>${n}</sup></button>`;
          })
          .join('')}
      </div>
    </div>
    <p class="sr-only" aria-live="polite" data-filter-status></p>
    <ul class="work__grid" data-work>
      ${projects
        .map((p, i) => {
          const inner = `
            <span class="card__media"><img src="${p.image}" alt="" width="527" height="309" loading="lazy" /></span>
            <span class="card__meta">
              <span class="card__title">${esc(p.title)}</span>
              <span class="card__cat">${esc(p.category)}</span>
              ${p.href ? `<span class="card__go">${icon('arrowUR')}</span>` : ''}
            </span>`;
          return `<li class="card${i % 5 === 0 ? ' card--wide' : ''}" data-cat="${catKey(p.category)}" data-tilt>
            ${
              p.href
                ? `<a class="card__link" href="${esc(p.href)}" target="_blank" rel="noopener" data-cursor="View">${inner}<span class="sr-only">${esc(p.title)}, ${esc(p.category)} (opens Behance in a new tab)</span></a>`
                : `<div class="card__link">${inner}</div>`
            }
          </li>`;
        })
        .join('')}
    </ul>
    <div class="work__more" data-reveal>
      ${btn('More on Behance', site.behance, { variant: 'ghost', iconName: 'arrowUR', attrs: 'target="_blank" rel="noopener"' })}
    </div>
  </section>`;
};

/* ---------------------------------------------------------------- showreel */
const renderShowreel = () => `
  <section class="reel" id="showreel" aria-labelledby="showreel-title">
    ${sectionHead(showreelIntro, 'showreel', ' sec-head--center')}
    <div class="reel__frame" data-reel-frame>
      <video class="reel__video" src="${site.showreel}" poster="${site.showreelPoster}" preload="none" playsinline width="1920" height="1080" data-reel-video>
        <p>Your browser can’t play this video. <a href="${site.showreel}">Download the showreel</a>.</p>
      </video>
      <button class="reel__play" type="button" data-reel-play data-cursor="Play">
        <span class="reel__play-disc">${icon('play')}</span>
        <span class="reel__play-label">Play with sound</span>
      </button>
      <span class="reel__corner reel__corner--tl" aria-hidden="true"></span>
      <span class="reel__corner reel__corner--tr" aria-hidden="true"></span>
      <span class="reel__corner reel__corner--bl" aria-hidden="true"></span>
      <span class="reel__corner reel__corner--br" aria-hidden="true"></span>
    </div>
  </section>`;

/* ---------------------------------------------------------------- about */
// Newest first: start dates in content.js are Nov 2022, Jul 2024, Sep 2024, Jun 2023, Oct 2025.
const EXPERIENCE_ORDER = [4, 2, 1, 3, 0];

const renderAbout = () => `
  <section class="about" id="about" aria-labelledby="about-title">
    <div class="about__grid">
      <div class="about__photo" data-tilt data-reveal>
        <img src="${site.portraitAbout}" alt="${esc(site.portraitAboutAlt)}" width="928" height="1120" loading="lazy" />
        <span class="about__sticker">${icon('pin')} ${esc(site.location)}</span>
        <span class="about__clock" data-clock aria-label="Local time in Bangalore">--:--</span>
      </div>
      <div class="about__text">
        ${sectionHead({ eyebrow: 'About', title: ['Hi, I’m Vignesh.', 'Nice to meet you.'] }, 'about')}
        <p class="about__bio" data-reveal>${esc(aboutLong)}</p>
        <p class="about__bio about__bio--ai" data-reveal>${esc(aboutAi)}</p>
        <dl class="facts" data-reveal>
          <div><dt>Based in</dt><dd>${esc(site.location)}</dd></div>
          <div><dt>Experience</dt><dd>${site.experienceYears}+ years</dd></div>
          <div><dt>Disciplines</dt><dd>9 and counting</dd></div>
        </dl>
        <ul class="skills">
          ${skills
            .map(
              (s) => `
            <li class="skill" data-reveal>
              <span class="skill__name">${esc(s.name)}</span>
              <span class="skill__val">${s.value}%</span>
              <span class="skill__track" role="meter" aria-label="${esc(s.name)}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${s.value}"><span class="skill__fill" style="--v:${s.value / 100}"></span></span>
            </li>`,
            )
            .join('')}
        </ul>
      </div>
    </div>

    <div class="xp">
      <h3 class="xp__title" data-reveal>Experience</h3>
      <ol class="xp__list">
        ${EXPERIENCE_ORDER.map((idx) => {
          const e = experience[idx];
          const skillsShort = e.skills.replace(/\.$/, '').split(', ').slice(0, 5).join(' · ');
          return `
          <li class="xp__row" data-reveal>
            <span class="xp__period">${esc(e.period)}</span>
            <span class="xp__company">${esc(e.company)}</span>
            <span class="xp__role">${esc(e.role)}</span>
            <span class="xp__skills">${esc(skillsShort)}</span>
          </li>`;
        }).join('')}
      </ol>
    </div>

    <div class="process" data-process>
      <h3 class="xp__title" data-reveal>How I work</h3>
      <span class="process__line" aria-hidden="true"><span data-process-line></span></span>
      <ol class="process__list">
        ${processSteps
          .map(
            (s, i) => `
          <li class="process__step" style="--i:${i}">
            <span class="process__num">0${i + 1}</span>
            <h4>${esc(s.title)}</h4>
            <p>${esc(s.body)}</p>
          </li>`,
          )
          .join('')}
      </ol>
    </div>
  </section>`;

/* ---------------------------------------------------------------- testimonials */
const renderTestimonials = () => `
  <section class="testi" aria-labelledby="testi-title">
    <div class="testi__head">
      ${sectionHead(testimonialsIntro, 'testi')}
      ${
        testimonialsAreSamples
          ? '<p class="sample-note" data-reveal>Draft quotes, to be confirmed with each client.</p>'
          : ''
      }
    </div>
    <div class="brands" data-reveal>
      <p class="brands__label">Brands I’ve worked with</p>
      <ul>${brands.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>
    </div>
    <div class="deck" data-deck>
      <div class="deck__cards" data-deck-cards>
        ${testimonials
          .map(
            (t, i) => `
          <figure class="deck__card" data-deck-card style="--i:${i}" ${i ? 'aria-hidden="true"' : ''}>
            <span class="deck__quote" aria-hidden="true">“</span>
            <span class="deck__stars" role="img" aria-label="${t.rating} out of 5">${'★'.repeat(t.rating)}</span>
            <blockquote><p>${esc(t.quote)}</p></blockquote>
            <figcaption>
              <span class="deck__avatar" aria-hidden="true">${esc(
                t.name
                  .split(' ')
                  .map((w) => w[0])
                  .join(''),
              )}</span>
              <span><b>${esc(t.name)}</b><small>${esc(t.role)}</small></span>
              ${testimonialsAreSamples ? '<span class="deck__sample">Draft</span>' : ''}
            </figcaption>
          </figure>`,
          )
          .join('')}
      </div>
      <div class="deck__nav">
        <button type="button" class="round-btn" data-deck-prev>${icon('arrowL')}<span class="sr-only">Previous quote</span></button>
        <p class="deck__count" aria-live="polite"><span data-deck-index>1</span> / ${testimonials.length}</p>
        <button type="button" class="round-btn" data-deck-next>${icon('arrowR')}<span class="sr-only">Next quote</span></button>
      </div>
    </div>
  </section>`;

/* ---------------------------------------------------------------- contact */
const renderContact = () => `
  <section class="contact" id="contact" aria-labelledby="contact-title">
    <div class="contact__card">
      <p class="eyebrow" data-reveal><span class="eyebrow__dot"></span>Contact</p>
      <h2 class="contact__title" id="contact-title" data-split>${lines(contact.title)}</h2>
      <p class="sec-body" data-reveal>${esc(contact.body)}</p>
      <div class="contact__grid">
        <form class="form" data-form novalidate>
          <div class="field">
            <input id="f-name" name="name" type="text" autocomplete="name" placeholder=" " required />
            <label for="f-name">Your name</label>
          </div>
          <div class="field">
            <input id="f-email" name="email" type="email" autocomplete="email" placeholder=" " required />
            <label for="f-email">Email</label>
          </div>
          <div class="field">
            <textarea id="f-msg" name="message" rows="4" placeholder=" " required></textarea>
            <label for="f-msg">What are we making?</label>
          </div>
          <p class="form__msg" role="status" data-form-msg></p>
          <button class="btn btn--dark btn--wide" type="submit" data-magnetic>
            <span class="btn__roll"><span class="btn__label" data-text="Send message">Send message</span></span>
            <span class="btn__icon">${icon('arrowUR')}</span>
          </button>
          <p class="form__note">Opens your email app with the message filled in.</p>
        </form>
        <ul class="contact__links">
          <li>
            <span class="contact__label">Email</span>
            <a href="mailto:${site.email}" class="contact__big">${esc(site.email)}</a>
            <button type="button" class="chip-btn" data-copy="${site.email}">${icon('copy')}<span data-copy-label>Copy</span></button>
          </li>
          <li>
            <span class="contact__label">Phone</span>
            <a href="tel:${site.phone.replace(/\s/g, '')}" class="contact__big">${esc(site.phone)}</a>
          </li>
          <li>
            <span class="contact__label">Elsewhere</span>
            <a href="${site.behance}" target="_blank" rel="noopener" class="contact__big">Behance ${icon('arrowUR')}<span class="sr-only">(opens in a new tab)</span></a>
            ${site.dribbble ? `<a href="${site.dribbble}" target="_blank" rel="noopener" class="contact__big">Dribbble ${icon('arrowUR')}</a>` : ''}
            ${site.resume ? `<a href="${site.resume}" class="contact__big" download>Download CV ${icon('arrowUR')}</a>` : ''}
          </li>
        </ul>
      </div>
    </div>
  </section>`;

/* ---------------------------------------------------------------- footer */
export const renderFooter = () => `
  <footer class="footer">
    <div class="footer__row">
      <p>© ${new Date().getFullYear()} ${esc(site.fullName)}. Designed &amp; built with care.</p>
      <ul>
        ${nav.map((n) => `<li><a href="${n.href}">${esc(n.label)}</a></li>`).join('')}
      </ul>
      <a class="footer__top" href="#top" data-magnetic>${icon('arrowUp')}<span>Back to top</span></a>
    </div>
    <p class="footer__mark" aria-hidden="true" data-footer-mark>${[...site.name].map((c) => `<span>${c}</span>`).join('')}</p>
  </footer>`;

/* ---------------------------------------------------------------- reel dialog */
const renderDialog = () => `
  <dialog class="modal" data-reel-dialog aria-label="Showreel">
    <button class="modal__close round-btn" type="button" data-reel-close>${icon('close')}<span class="sr-only">Close showreel</span></button>
    <video class="modal__video" src="${site.showreel}" poster="${site.showreelPoster}" preload="none" controls playsinline width="1920" height="1080"></video>
  </dialog>`;

export const renderLoader = () => `${wordmark()}`;

export function renderPage() {
  return {
    meta,
    loader: renderLoader(),
    nav: renderNav(),
    main: [renderHero(), renderMarquee(), renderWork(), renderDisciplines(), renderToolbox(), renderAiLab(), renderShowreel(), renderAbout(), renderTestimonials(), renderContact()].join('\n'),
    footer: renderFooter() + renderDialog(),
  };
}
