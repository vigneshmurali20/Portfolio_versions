/*
 * Pure string templates. vite.config.js runs these at build time and injects
 * the result into index.html, so every word ships as static, crawlable HTML.
 */
import {
  site,
  nav,
  tools,
  servicesIntro,
  services,
  experience,
  portfolio,
  marquee,
  cta,
  footer,
} from './content.js';

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const ext = 'target="_blank" rel="noopener noreferrer"';

const arrow = (cls = '') =>
  `<svg class="ico ${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 18L18 6M18 6H8.5M18 6v9.5"/></svg>`;

const star = () =>
  `<svg class="ico-star" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.5L12 17.3l-5.9 3.2 1.3-6.5L2.5 9.4l6.6-.8z"/></svg>`;

const sparkle = () =>
  `<svg class="ico-sparkle" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0z"/></svg>`;

// Logo glyph: vector path read from the Figma logo component (node 1:13591),
// flipped vertically exactly as the component's transform does.
export const logoPath =
  'M0 20.58L0 13.87L4.87 9L9.74 4.13L9.74 7.01L9.74 9.89L14.68 4.94L19.62 0L24.57 4.94L29.51 9.89L29.51 7.01L29.51 4.13L34.38 9L39.25 13.87L39.25 20.58L39.25 27.3L34.41 22.46C31.75 19.8 29.54 17.63 29.46 17.63C29.41 17.63 29.36 18.87 29.36 20.39L29.36 23.16L24.49 18.3L19.62 13.43L14.75 18.3L9.89 23.16L9.89 20.39C9.89 18.87 9.84 17.63 9.78 17.63C9.71 17.63 7.5 19.8 4.84 22.46L0 27.3L0 20.58Z';

export const logoSvg = (cls = '') => `
<svg class="logo-glyph ${cls}" viewBox="-2 -2 43.25 31.3" aria-hidden="true">
  <path class="logo-glyph__path" pathLength="1" transform="matrix(1 0 0 -1 0 27.3)" d="${logoPath}"/>
</svg>`;

const logo = (extra = '') => `
<span class="logo ${extra}" aria-hidden="true">
  <span class="logo__ring"></span>
  <span class="logo__disc">${logoSvg()}</span>
  <span class="logo__sheen"></span>
</span>`;

// Accent words: solid colour (no gradient). Letters are split so the
// typeface effect can vary each one's weight; screen readers get the
// plain text from the visually hidden copy.
const accent = (text) =>
  `<span class="accent" data-accent><span class="sr-only">${esc(text)}</span><span class="accent__chars" aria-hidden="true">${text
    .split(' ')
    .map((w) => `<span class="accent__word">${[...w].map((c) => `<span class="ch">${esc(c)}</span>`).join('')}</span>`)
    .join(' ')}</span></span>`;

const splitWords = (text, cls = '') =>
  text
    .split(' ')
    .map((w) => `<span class="w ${cls}"><span class="w__i">${esc(w)}</span></span>`)
    .join(' ');

/* ----------------------------------------------------------------------- */

export function renderNav() {
  const link = (n) =>
    `<li><a href="#${n.id}" data-link="${n.id}" data-cursor="hover"><span class="roll-wrap"><span class="roll" data-text="${esc(n.label)}">${esc(n.label)}</span></span></a></li>`;
  const left = nav.slice(0, 3).map(link).join('');
  const right = nav.slice(3).map(link).join('');
  return `
<header class="nav" data-nav>
  <nav class="nav__pill" aria-label="Primary">
    <span class="nav__indicator" aria-hidden="true"></span>
    <ul class="nav__links">${left}</ul>
    <a href="#top" class="nav__logo" aria-label="${esc(site.name)}, back to top" data-magnetic="0.4" data-cursor="hover">${logo()}</a>
    <ul class="nav__links">${right}</ul>
  </nav>
  <a href="#top" class="nav__logo nav__logo--solo" aria-label="${esc(site.name)}, back to top">${logo()}</a>
  <button class="nav__burger" type="button" aria-expanded="false" aria-controls="menu" aria-label="Open menu">
    <span></span><span></span>
  </button>
  <div class="nav__progress" aria-hidden="true"><span data-progress></span></div>
</header>
<div class="menu" id="menu" aria-hidden="true">
  <nav aria-label="Mobile">
    <ul class="menu__links">
      ${nav
        .map(
          (n, i) =>
            `<li><a href="#${n.id}" data-menu-link tabindex="-1"><small>0${i + 1}</small><span>${esc(n.label)}</span></a></li>`,
        )
        .join('')}
    </ul>
  </nav>
  <div class="menu__foot">
    <a href="mailto:${esc(site.email)}" tabindex="-1">${esc(site.email)}</a>
    <a href="${esc(site.behance)}" ${ext} tabindex="-1">Behance ↗</a>
  </div>
</div>`;
}

export function renderHero() {
  return `
<section class="hero" id="top" aria-labelledby="hero-title">
  <div class="hero__stage" data-hero-stage>
    <div class="hero__head">
      <p class="hero__hello" data-hero-hello>
        <span class="hero__hello-pill">${esc(site.greeting)}</span>
        <span class="hero__hello-spark" aria-hidden="true"><i></i><i></i><i></i></span>
      </p>
      <h1 class="hero__title" id="hero-title" data-hero-title>
        <span class="hero__line"><span class="hero__line-i">I’m ${accent(site.name)},</span></span>
        <span class="hero__line"><span class="hero__line-i">${esc(site.role)}</span></span>
      </h1>
    </div>

    <figure class="hero__portrait" data-hero-portrait>
      <img src="${esc(site.portrait)}" alt="${esc(site.portraitAlt)}" width="768" height="838" fetchpriority="high" />
    </figure>

    <aside class="hero__quote" data-hero-side>
      <svg class="hero__quote-mark" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 18v-4.5C3 8.9 5.4 6 9.6 5l.9 1.8C8 7.7 6.9 9.4 6.8 12H10v6H3zm11 0v-4.5C14 8.9 16.4 6 20.6 5l.9 1.8c-2.5.9-3.6 2.6-3.7 5.2H21v6h-7z"/></svg>
      <p>${esc(site.quote)}</p>
    </aside>

    <aside class="hero__stat" data-hero-side>
      <div class="hero__stars" role="img" aria-label="Five star rating">${star().repeat(5)}</div>
      <p class="hero__years"><span data-count="${site.experienceYears}">${site.experienceYears}</span> Years</p>
      <p class="hero__years-label">Experience</p>
    </aside>

    <div class="hero__cta" data-hero-cta>
      <a class="pill-btn pill-btn--primary" href="${esc(site.behance)}" ${ext} data-magnetic="0.35" data-cursor="hover">
        <span class="pill-btn__fill" aria-hidden="true"></span>
        <span class="pill-btn__label"><span data-text="Portfolio">Portfolio</span></span>
        ${arrow('pill-btn__arrow')}
        <span class="sr-only">(opens Behance in a new tab)</span>
      </a>
      <a class="pill-btn pill-btn--ghost" href="#contact" data-magnetic="0.35" data-cursor="hover">
        <span class="pill-btn__fill" aria-hidden="true"></span>
        <span class="pill-btn__label"><span data-text="Hire me">Hire me</span></span>
      </a>
    </div>

    <div class="hero__scroll" aria-hidden="true"><span class="hero__scroll-track"><i></i></span>Scroll</div>
  </div>
</section>`;
}

export function renderAbout() {
  return `
<section class="section about" id="about" aria-labelledby="about-title">
  <div class="about__grid">
    <div class="about__media" data-tilt>
      <div class="about__frame">
        <img src="${esc(site.portraitSmile)}" alt="${esc(site.portraitSmileAlt)}" width="631" height="628" loading="lazy" />
        <span class="about__frame-glare" aria-hidden="true"></span>
      </div>
      <span class="about__badge" aria-hidden="true">${logoSvg()}</span>
    </div>
    <div class="about__body">
      <p class="kicker" data-reveal><span class="kicker__dot"></span>About me</p>
      <h2 class="about__statement" id="about-title" data-statement>${splitWords(site.bio)}</h2>
      <ul class="about__facts" data-reveal-stagger>
        <li><strong data-count="${site.experienceYears}">${site.experienceYears}</strong><span>Years of experience</span></li>
        <li><strong data-count="${services.length}">${services.length}</strong><span>Design disciplines</span></li>
        <li><strong data-count="${experience.length}">${experience.length}</strong><span>Roles &amp; studios</span></li>
      </ul>
      <div class="about__tools">
        <p class="about__tools-label">Daily toolkit</p>
        <ul class="tools" data-reveal-stagger>
          ${tools
            .map(
              (t) =>
                `<li class="tool" data-magnetic="0.5" data-cursor="hover" title="${esc(t.name)}"><img src="${esc(t.src)}" alt="${esc(t.name)}" width="48" height="48" loading="lazy" /></li>`,
            )
            .join('')}
        </ul>
      </div>
    </div>
  </div>
</section>`;
}

export function renderServices() {
  return `
<section class="services" id="services" aria-labelledby="services-title">
  <div class="services__pin" data-services-pin>
    <div class="services__head">
      <h2 class="section-title" id="services-title" data-reveal>${esc(servicesIntro.title[0])} ${accent(servicesIntro.title[1])}</h2>
      <p class="services__intro" data-reveal>${esc(servicesIntro.body)}</p>
    </div>
    <div class="orbit" data-orbit data-cursor="drag">
      <ul class="orbit__ring" data-orbit-ring>
        ${services
          .map(
            (s, i) => `
        <li class="orbit__item" data-orbit-item style="--i:${i}">
          <a class="svc" href="${esc(s.href)}" ${ext} data-cursor="view" data-index="${i}">
            <span class="svc__top">
              <span class="svc__num">${String(i + 1).padStart(2, '0')}</span>
              <span class="svc__title">${esc(s.title)}</span>
            </span>
            <span class="svc__stack" aria-hidden="true"><i></i><i></i></span>
            <span class="svc__media">
              <img src="${esc(s.image)}" alt="" width="416" height="307" loading="lazy" />
            </span>
            <span class="svc__foot">
              <span class="svc__project">${esc(s.project)}</span>
              <span class="svc__go">${arrow()}</span>
            </span>
            <span class="svc__glare" aria-hidden="true"></span>
            <span class="sr-only">, view on Behance (opens in a new tab)</span>
          </a>
        </li>`,
          )
          .join('')}
      </ul>
    </div>
    <div class="services__ui">
      <div class="dots" role="tablist" aria-label="Services">
        ${services
          .map(
            (s, i) =>
              `<button type="button" class="dots__dot" role="tab" aria-label="${esc(s.title)}" data-orbit-dot="${i}"></button>`,
          )
          .join('')}
      </div>
      <p class="services__hint" aria-hidden="true">Scroll or drag to rotate</p>
    </div>
  </div>
</section>`;
}

export function renderExperience() {
  return `
<section class="section experience" id="experience" aria-labelledby="exp-title">
  <h2 class="section-title section-title--center" id="exp-title" data-reveal>My ${accent('Work Experience')}</h2>
  <div class="timeline" data-timeline>
  <span class="timeline__rail" aria-hidden="true"><span data-rail></span><span class="timeline__spark" data-spark></span></span>
  <ol class="timeline__list">
    ${experience
      .map(
        (e) => `
    <li class="job" data-job>
      <div class="job__where">
        <h3 class="job__company">${esc(e.company)}</h3>
        <p class="job__period">${esc(e.period)}</p>
      </div>
      <span class="job__node" aria-hidden="true"><i></i></span>
      <div class="job__what">
        <p class="job__role">${esc(e.role)}</p>
        <p class="job__skills">${esc(e.skills)}</p>
      </div>
    </li>`,
      )
      .join('')}
  </ol>
  </div>
</section>`;
}

export function renderPortfolio() {
  const cards = [
    { label: 'Behance', href: site.behance },
    ...(site.dribbble ? [{ label: 'Dribbble', href: site.dribbble }] : []),
  ];
  const f = portfolio.featured;
  return `
<section class="section portfolio" id="portfolio" aria-labelledby="folio-title">
  <div class="portfolio__head">
    <h2 class="section-title" id="folio-title" data-reveal>${esc(portfolio.title[0])} ${accent(portfolio.title[1])}</h2>
    <a class="pill-btn pill-btn--primary pill-btn--sm" href="${esc(site.behance)}" ${ext} data-magnetic="0.35" data-cursor="hover">
      <span class="pill-btn__fill" aria-hidden="true"></span>
      <span class="pill-btn__label"><span data-text="See All">See All</span></span>
      ${arrow('pill-btn__arrow')}
      <span class="sr-only">(opens Behance in a new tab)</span>
    </a>
  </div>
  <div class="platforms platforms--${cards.length}">
    ${cards
      .map(
        (c) => `
    <a class="platform" href="${esc(c.href)}" ${ext} data-tilt data-cursor="view">
      <span class="platform__bg" aria-hidden="true"></span>
      <span class="platform__grid" aria-hidden="true"></span>
      <span class="platform__line" aria-hidden="true">You are <em>one step away</em> from bringing your visual to <b>live!</b></span>
      <span class="platform__tools" aria-hidden="true">${tools.map((t) => `<img src="${esc(t.src)}" alt="" width="32" height="32" loading="lazy" />`).join('')}</span>
      <span class="platform__name">${esc(c.label)}</span>
      <span class="platform__go" aria-hidden="true">${arrow()}</span>
      <span class="platform__glare" aria-hidden="true"></span>
      <span class="sr-only">(opens in a new tab)</span>
    </a>`,
      )
      .join('')}
  </div>
  <ul class="chips" data-reveal-stagger aria-label="Focus areas">
    ${portfolio.tags.map((t) => `<li class="chip" data-magnetic="0.25">${esc(t)}</li>`).join('')}
  </ul>
  <article class="feature" data-feature>
    <div class="feature__device" data-feature-device>
      <div class="feature__screen"><img src="${esc(f.image)}" alt="Deepvue dashboard redesign preview" width="416" height="307" loading="lazy" /></div>
    </div>
    <div class="feature__text">
      <h3 class="feature__title">
        <a href="${esc(f.href)}" ${ext} data-cursor="hover">${esc(f.title)}<span class="feature__go">${arrow()}</span></a>
      </h3>
      <p class="feature__body">${esc(f.body)}</p>
    </div>
  </article>
</section>`;
}

export function renderMarquee() {
  const row = marquee.map((m) => `<span class="marquee__item">${esc(m)}${sparkle()}</span>`).join('');
  return `
<div class="marquee" aria-hidden="true">
  <div class="marquee__band marquee__band--a"><div class="marquee__track" data-marquee="1">${row}${row}</div></div>
  <div class="marquee__band marquee__band--b"><div class="marquee__track" data-marquee="-1">${row}${row}</div></div>
</div>
<p class="sr-only">Skills: ${esc(marquee.join(', '))}</p>`;
}

export function renderCta() {
  return `
<section class="cta" id="contact" aria-labelledby="cta-title">
  <h2 class="cta__title" id="cta-title">
    <span class="cta__line"><span class="cta__line-i">${esc(cta.title[0])}</span></span>
    <span class="cta__line"><span class="cta__line-i">${accent(cta.title[1])}</span></span>
  </h2>
  <form class="cta__form" data-cta-form novalidate>
    <label class="cta__field">
      <span class="cta__icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 5h16a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V7a2 2 0 012-2zm0 2v.4l8 5 8-5V7H4zm16 2.7l-7.5 4.7a1 1 0 01-1 0L4 9.7V17h16V9.7z"/></svg></span>
      <span class="sr-only">Your email address</span>
      <input type="email" name="email" required autocomplete="email" placeholder="${esc(cta.placeholder)}" data-cursor="text" />
    </label>
    <button type="submit" class="pill-btn pill-btn--primary cta__send" data-magnetic="0.4" data-cursor="hover">
      <span class="pill-btn__fill" aria-hidden="true"></span>
      <span class="pill-btn__label"><span data-text="${esc(cta.button)}">${esc(cta.button)}</span></span>
      <svg class="ico pill-btn__arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11.5L21 3l-8.5 18-2-7.5z"/></svg>
    </button>
    <p class="cta__msg" role="status" aria-live="polite" data-cta-msg></p>
  </form>
</section>`;
}

export function renderFooter() {
  const year = new Date().getFullYear();
  return `
<footer class="footer" aria-labelledby="footer-title">
  <div class="footer__card">
    <div class="footer__top">
      <h2 class="footer__title" id="footer-title" data-reveal>${esc(footer.title)}</h2>
      <a class="pill-btn pill-btn--primary" href="mailto:${esc(site.email)}" data-magnetic="0.35" data-cursor="hover">
        <span class="pill-btn__fill" aria-hidden="true"></span>
        <span class="pill-btn__label"><span data-text="${esc(footer.button)}">${esc(footer.button)}</span></span>
        ${arrow('pill-btn__arrow')}
      </a>
    </div>
    <div class="footer__mid">
      <div class="footer__brand">
        <span class="footer__logo">${logo('logo--sm')}<span>${esc(site.name.toUpperCase())}</span></span>
        <p>${esc(site.bio)}</p>
      </div>
      <div class="footer__col">
        <h3>Contact</h3>
        <ul>
          <li><a href="tel:${esc(site.phone.replace(/\s/g, ''))}" data-cursor="hover">${esc(site.phone)}</a></li>
          <li><a href="mailto:${esc(site.email)}" data-cursor="hover">${esc(site.email)}</a></li>
          <li><a href="https://${esc(site.website)}" ${ext} data-cursor="hover">${esc(site.website)}</a></li>
        </ul>
      </div>
      <div class="footer__col">
        <h3>Elsewhere</h3>
        <ul>
          <li><a href="${esc(site.behance)}" ${ext} data-cursor="hover">Behance ↗</a></li>
          ${site.dribbble ? `<li><a href="${esc(site.dribbble)}" ${ext} data-cursor="hover">Dribbble ↗</a></li>` : ''}
          <li><span class="footer__clock">${esc(site.location)} · <span data-clock>--:--</span></span></li>
        </ul>
      </div>
    </div>
    <div class="footer__bottom">
      <p>© ${year} ${esc(site.name)} | Made with Figma</p>
      <a href="#top" class="footer__totop" data-cursor="hover">Back to top <span aria-hidden="true">↑</span></a>
    </div>
    <p class="footer__giant" aria-hidden="true" data-giant>${esc(site.name.toUpperCase())}</p>
  </div>
</footer>`;
}

export function renderPage() {
  return {
    nav: renderNav(),
    main: [
      renderHero(),
      renderAbout(),
      renderServices(),
      renderExperience(),
      renderPortfolio(),
      renderMarquee(),
      renderCta(),
    ].join('\n'),
    footer: renderFooter(),
    loaderLogo: logoSvg('loader__glyph'),
  };
}
