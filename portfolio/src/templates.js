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
  pages,
  aboutLong,
  skills,
  toolSkills,
  processSteps,
  projects,
  testimonialsIntro,
  testimonials,
  testimonialsAreSamples,
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

export function renderNav(current = 'home') {
  const link = (n) =>
    `<li><a href="${n.href}" data-link="${n.page}"${n.page === current ? ' class="is-active" aria-current="page"' : ''} data-cursor="hover"><span class="roll-wrap"><span class="roll" data-text="${esc(n.label)}">${esc(n.label)}</span></span></a></li>`;
  const left = nav.slice(0, 3).map(link).join('');
  const right = nav.slice(3).map(link).join('');
  return `
<header class="nav" data-nav data-current="${current}">
  <nav class="nav__pill" aria-label="Primary">
    <span class="nav__indicator" aria-hidden="true"></span>
    <ul class="nav__links">${left}</ul>
    <a href="./" class="nav__logo" aria-label="${esc(site.name)}, home" data-magnetic="0.4" data-cursor="hover">${logo()}</a>
    <ul class="nav__links">${right}</ul>
  </nav>
  <a href="./" class="nav__logo nav__logo--solo" aria-label="${esc(site.name)}, home">${logo()}</a>
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
            `<li><a href="${n.href}" data-menu-link tabindex="-1"${n.page === current ? ' aria-current="page"' : ''}><small>0${i + 1}</small><span>${esc(n.label)}</span></a></li>`,
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
      <a class="pill-btn pill-btn--ghost" href="contact.html" data-magnetic="0.35" data-cursor="hover">
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
      <a class="text-link" href="about.html" data-cursor="hover">More about me ${arrow()}</a>
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
      <div class="services__intro-wrap" data-reveal>
        <p class="services__intro">${esc(servicesIntro.body)}</p>
        <a class="text-link" href="services.html" data-cursor="hover">All services ${arrow()}</a>
      </div>
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

export function renderExperience({ link = true, heading = true } = {}) {
  return `
<section class="section experience" id="experience" aria-labelledby="exp-title">
  ${heading ? `<h2 class="section-title section-title--center" id="exp-title" data-reveal>My ${accent('Work Experience')}</h2>` : `<h2 class="sr-only" id="exp-title">Work experience</h2>`}
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
  ${link ? `<p class="section-more"><a class="text-link" href="resume.html" data-cursor="hover">Full resume, skills &amp; tools ${arrow()}</a></p>` : ''}
</section>`;
}

export function renderPortfolio({ seeAll = true } = {}) {
  const cards = [
    { label: 'Behance', href: site.behance },
    ...(site.dribbble ? [{ label: 'Dribbble', href: site.dribbble }] : []),
  ];
  const f = portfolio.featured;
  return `
<section class="section portfolio" id="portfolio" aria-labelledby="folio-title">
  <div class="portfolio__head">
    <h2 class="section-title" id="folio-title" data-reveal>${esc(portfolio.title[0])} ${accent(portfolio.title[1])}</h2>
    ${seeAll ? pill('projects.html', 'See All', { sm: true }) : ''}
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

export function renderCta({ title = true } = {}) {
  return `
<section class="cta${title ? '' : ' cta--form-only'}" id="contact" aria-labelledby="cta-title">
  ${
    title
      ? `<h2 class="cta__title" id="cta-title">
    <span class="cta__line"><span class="cta__line-i">${esc(cta.title[0])}</span></span>
    <span class="cta__line"><span class="cta__line-i">${accent(cta.title[1])}</span></span>
  </h2>`
      : `<h2 class="sr-only" id="cta-title">Send your email address</h2>`
  }
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
        <h3>Pages</h3>
        <ul>
          ${nav.map((n) => `<li><a href="${n.href}" data-cursor="hover">${esc(n.label)}</a></li>`).join('')}
        </ul>
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

/* ------------------------------------------------------------ new parts */

const pill = (href, label, { primary = true, external = false, sm = false } = {}) => `
<a class="pill-btn ${primary ? 'pill-btn--primary' : 'pill-btn--outline'}${sm ? ' pill-btn--sm' : ''}" href="${esc(href)}" ${external ? ext : ''} data-magnetic="0.35" data-cursor="hover">
  <span class="pill-btn__fill" aria-hidden="true"></span>
  <span class="pill-btn__label"><span data-text="${esc(label)}">${esc(label)}</span></span>
  ${primary ? arrow('pill-btn__arrow') : ''}
  ${external ? '<span class="sr-only">(opens in a new tab)</span>' : ''}
</a>`;

// Header for the inner pages: big title over the glowing planet horizon.
export function renderPageHero({ kicker, title, accentText, body }) {
  return `
<section class="page-hero" id="top" aria-labelledby="page-title">
  <p class="kicker page-hero__kicker"><span class="kicker__dot"></span>${esc(kicker)}</p>
  <h1 class="page-hero__title" id="page-title">
    <span class="hero__line"><span class="hero__line-i">${esc(title)} ${accentText ? accent(accentText) : ''}</span></span>
  </h1>
  ${body ? `<p class="page-hero__body">${esc(body)}</p>` : ''}
  <div class="hero__scroll page-hero__scroll" aria-hidden="true"><span class="hero__scroll-track"><i></i></span>Scroll</div>
</section>`;
}

export function renderTestimonials() {
  const initials = (n) => n.split(' ').map((p) => p[0]).join('').slice(0, 2);
  const card = (t, hidden = false) => `
    <li class="tcard"${hidden ? ' aria-hidden="true"' : ''}>
      <figure>
        <svg class="tcard__mark" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 6v4.5c0 4.6-2.4 7.5-6.6 8.5l-.9-1.8c2.5-.9 3.6-2.6 3.7-5.2H14V6h7zM10 6v4.5c0 4.6-2.4 7.5-6.6 8.5l-.9-1.8C5 16.3 6.1 14.6 6.2 12H3V6h7z"/></svg>
        <div class="tcard__who">
          <span class="tcard__avatar" aria-hidden="true">${esc(initials(t.name))}</span>
          <figcaption><strong>${esc(t.name)}</strong><span>${esc(t.role)}</span></figcaption>
        </div>
        <div class="tcard__rating" role="img" aria-label="Rated ${t.rating} out of 5">${star().repeat(t.rating)}<span>${t.rating.toFixed(1)}</span></div>
        <blockquote>${esc(t.quote)}</blockquote>
      </figure>
    </li>`;
  return `
<section class="section testimonials" aria-labelledby="t-title">
  <div class="testimonials__head">
    <h2 class="section-title section-title--center" id="t-title" data-reveal>${esc(testimonialsIntro.title[0])} ${accent(testimonialsIntro.title[1])}</h2>
    <p class="testimonials__intro" data-reveal>${esc(testimonialsIntro.body)}</p>
    ${testimonialsAreSamples ? '<p class="sample-note">Sample testimonials, shown as placeholders until real client quotes are added</p>' : ''}
  </div>
  <div class="tslider" data-tslider data-cursor="drag">
    <ul class="tslider__track" data-tslider-track>
      ${testimonials.map((t) => card(t)).join('')}
      ${testimonials.map((t) => card(t, true)).join('')}
    </ul>
  </div>
</section>`;
}

export function renderAboutFull() {
  return `
<section class="section about-full" aria-labelledby="about-full-title">
  <div class="about-full__grid">
    <div class="about-full__media" data-tilt>
      <div class="about-full__frame about__frame">
        <img src="${esc(site.portrait)}" alt="${esc(site.portraitAlt)}" width="768" height="838" loading="lazy" />
        <span class="about__frame-glare" aria-hidden="true"></span>
      </div>
    </div>
    <div class="about-full__body">
      <h2 class="section-title" id="about-full-title" data-reveal>About ${accent('me')}</h2>
      <p class="about-full__bio" data-reveal>${esc(aboutLong)}</p>
      <ul class="skills" data-skills aria-label="Skill levels">
        ${skills
          .map(
            (k) => `
        <li class="skill" style="--v:${k.value}">
          <div class="skill__row"><span>${esc(k.name)}</span><span class="skill__val"><span data-count="${k.value}">${k.value}</span>%</span></div>
          <div class="skill__track" role="meter" aria-label="${esc(k.name)}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${k.value}"><span class="skill__fill"></span><span class="skill__knob"></span></div>
        </li>`,
          )
          .join('')}
      </ul>
      <div class="about-full__cta">
        ${site.resume ? pill(site.resume, 'Download CV') : ''}
        ${pill('contact.html', 'Hire me', { primary: !site.resume })}
      </div>
    </div>
  </div>
</section>`;
}

export function renderFacts() {
  return `
<section class="section facts" aria-label="At a glance">
  <ul class="about__facts facts__list" data-reveal-stagger>
    <li><strong data-count="${site.experienceYears}">${site.experienceYears}</strong><span>Years of experience</span></li>
    <li><strong data-count="${services.length}">${services.length}</strong><span>Design disciplines</span></li>
    <li><strong data-count="${experience.length}">${experience.length}</strong><span>Roles &amp; studios</span></li>
    <li><strong data-count="${projects.length}">${projects.length}</strong><span>Projects on show</span></li>
  </ul>
</section>`;
}

export function renderToolRings() {
  const R = 54;
  const C = 2 * Math.PI * R;
  return `
<section class="section tools-rings" aria-labelledby="tools-title">
  <h2 class="section-title section-title--center" id="tools-title" data-reveal>My ${accent('Toolkit')}</h2>
  <ul class="rings" data-rings>
    ${toolSkills
      .map(
        (t) => `
    <li class="ring" style="--v:${t.value}">
      <div class="ring__dial">
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <circle class="ring__track" cx="60" cy="60" r="${R}"/>
          <circle class="ring__fill" cx="60" cy="60" r="${R}" stroke-dasharray="${C.toFixed(2)}" stroke-dashoffset="${(C * (1 - t.value / 100)).toFixed(2)}" data-full="${C.toFixed(2)}"/>
        </svg>
        <img src="${esc(t.src)}" alt="" width="52" height="52" loading="lazy" />
      </div>
      <p class="ring__val"><span data-count="${t.value}">${t.value}</span>%</p>
      <p class="ring__name">${esc(t.name)}</p>
    </li>`,
      )
      .join('')}
  </ul>
</section>`;
}

export function renderProcess() {
  return `
<section class="section process" aria-labelledby="process-title">
  <h2 class="section-title section-title--center" id="process-title" data-reveal>How I ${accent('Work')}</h2>
  <p class="process__intro" data-reveal>A double-diamond process: open up to understand the problem, focus on the right one, open up again to explore solutions, then focus on the one that ships.</p>
  <div class="diamond" data-diamond aria-hidden="true">
    <svg viewBox="0 0 1000 420" preserveAspectRatio="xMidYMid meet">
      <path class="diamond__shape" d="M60 210 L280 40 L500 210 L280 380 Z"/>
      <path class="diamond__shape" d="M500 210 L720 40 L940 210 L720 380 Z"/>
      <path class="diamond__line" d="M60 210 L280 40 L500 210 L720 40 L940 210 L720 380 L500 210 L280 380 Z"/>
      ${[[60, 210], [280, 40], [500, 210], [720, 40], [940, 210]].map(([x, y]) => `<circle class="diamond__dot" cx="${x}" cy="${y}" r="11"/>`).join('')}
      <text x="175" y="220" class="diamond__label">Discover</text>
      <text x="390" y="220" class="diamond__label">Define</text>
      <text x="615" y="220" class="diamond__label">Design</text>
      <text x="830" y="220" class="diamond__label">Deliver</text>
    </svg>
  </div>
  <ol class="steps" data-reveal-stagger>
    ${processSteps.map((p, i) => `<li class="step"><span class="step__n">${i + 1}</span><h3>${esc(p.title)}</h3><p>${esc(p.body)}</p></li>`).join('')}
  </ol>
</section>`;
}

export function renderServicesGrid() {
  return `
<section class="section svc-grid" aria-label="All services">
  <ul class="svc-grid__list">
    ${services
      .map(
        (s, i) => `
    <li class="svc-row" data-reveal>
      <a class="svc-row__link" href="${esc(s.href)}" ${ext} data-cursor="view">
        <span class="svc-row__num">${String(i + 1).padStart(2, '0')}</span>
        <span class="svc-row__text">
          <span class="svc-row__title">${esc(s.title)}</span>
          <span class="svc-row__project">Case study: ${esc(s.project)}</span>
        </span>
        <span class="svc-row__media"><img src="${esc(s.image)}" alt="" width="416" height="307" loading="lazy" /></span>
        <span class="svc-row__go">${arrow()}</span>
        <span class="sr-only">(opens Behance in a new tab)</span>
      </a>
    </li>`,
      )
      .join('')}
  </ul>
</section>`;
}

export function renderProjects() {
  const cats = ['All', ...new Set(projects.map((p) => p.category))];
  return `
<section class="section projects" aria-labelledby="projects-title">
  <h2 class="sr-only" id="projects-title">Project gallery</h2>
  <div class="filters" role="group" aria-label="Filter projects" data-filters>
    ${cats.map((c, i) => `<button type="button" class="filter${i === 0 ? ' is-active' : ''}" aria-pressed="${i === 0}" data-filter="${esc(c)}" data-magnetic="0.2">${esc(c)}<span class="filter__count">${c === 'All' ? projects.length : projects.filter((p) => p.category === c).length}</span></button>`).join('')}
  </div>
  <ul class="pgrid" data-pgrid>
    ${projects
      .map((p) => {
        const inner = `<img src="${esc(p.image)}" alt="${esc(p.title)} (${esc(p.category)})" width="527" height="309" loading="lazy" /><span class="pcard__glare" aria-hidden="true"></span>`;
        return `<li class="pcard" data-cat="${esc(p.category)}">${
          p.href
            ? `<a href="${esc(p.href)}" ${ext} data-cursor="view" data-tilt>${inner}<span class="sr-only">, view on Behance (opens in a new tab)</span></a>`
            : `<div class="pcard__static" data-tilt>${inner}</div>`
        }</li>`;
      })
      .join('')}
  </ul>
  <p class="section-more">${pill(site.behance, 'More on Behance', { external: true })}</p>
</section>`;
}

export function renderContact() {
  return `
<section class="section contact" aria-labelledby="contact-title">
  <h2 class="sr-only" id="contact-title">Contact details</h2>
  <ul class="contact__cards" data-reveal-stagger>
    <li class="ccard">
      <span class="ccard__label">Email</span>
      <a class="ccard__value" href="mailto:${esc(site.email)}" data-cursor="hover">${esc(site.email)}</a>
      <button type="button" class="ccard__copy" data-copy="${esc(site.email)}" data-cursor="hover">Copy</button>
    </li>
    <li class="ccard">
      <span class="ccard__label">Phone</span>
      <a class="ccard__value" href="tel:${esc(site.phone.replace(/\s/g, ''))}" data-cursor="hover">${esc(site.phone)}</a>
      <button type="button" class="ccard__copy" data-copy="${esc(site.phone)}" data-cursor="hover">Copy</button>
    </li>
    <li class="ccard">
      <span class="ccard__label">Website</span>
      <a class="ccard__value" href="https://${esc(site.website)}" ${ext} data-cursor="hover">${esc(site.website)}</a>
    </li>
    <li class="ccard">
      <span class="ccard__label">Portfolio</span>
      <a class="ccard__value" href="${esc(site.behance)}" ${ext} data-cursor="hover">Behance ↗</a>
    </li>
    <li class="ccard ccard--wide">
      <span class="ccard__label">Based in</span>
      <span class="ccard__value">${esc(site.location)} · <span data-clock>--:--</span> local time</span>
      <span class="ccard__status"><span class="status-dot"></span>Open to full-time roles and freelance projects</span>
    </li>
  </ul>
  <p class="copy-toast" role="status" aria-live="polite" data-copy-toast></p>
</section>`;
}

export function renderPage(page = 'home') {
  const bodies = {
    home: () => [renderHero(), renderAbout(), renderServices(), renderExperience(), renderPortfolio(), renderTestimonials(), renderMarquee(), renderCta()],
    about: () => [
      renderPageHero({ kicker: 'About me', title: 'Designer of calm,', accentText: 'clear interfaces', body: site.bio }),
      renderAboutFull(),
      renderFacts(),
      renderToolRings(),
      renderProcess(),
      renderTestimonials(),
      renderCta(),
    ],
    services: () => [
      renderPageHero({ kicker: 'Services', title: 'What I can', accentText: 'design for you', body: servicesIntro.body }),
      renderServicesGrid(),
      renderProcess(),
      renderMarquee(),
      renderCta(),
    ],
    resume: () => [
      renderPageHero({ kicker: 'Resume', title: 'My Work', accentText: 'Experience', body: `${site.experienceYears} years across in-house teams, startups and freelance clients in India and abroad.` }),
      renderExperience({ link: false, heading: false }),
      renderAboutFull(),
      renderToolRings(),
      renderCta(),
    ],
    projects: () => [
      renderPageHero({ kicker: 'Projects', title: 'My', accentText: 'Projects', body: 'Apps, landing pages, brand identities, motion and campaign work. Cards with an arrow open the full case study on Behance.' }),
      renderProjects(),
      renderPortfolio({ seeAll: false }),
      renderCta(),
    ],
    contact: () => [
      renderPageHero({ kicker: 'Contact', title: 'Have an Awesome Project Idea?', accentText: 'Let’s Discuss', body: 'Leave your email and your email app opens with a note to me, or use any of the details below.' }),
      renderCta({ title: false }),
      renderContact(),
    ],
  };
  return {
    meta: pages[page],
    nav: renderNav(page),
    main: bodies[page]().join('\n'),
    footer: renderFooter(),
    loaderLogo: logoSvg('loader__glyph'),
  };
}
