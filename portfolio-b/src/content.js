/*
 * Version B — all site copy and data. Facts (experience, projects, links,
 * skills) come from the Figma file (figma.com/design/T9UpObjYsMdFXsJrQvGjRY)
 * and match Version A. Edit this file to change words or links.
 */

export const site = {
  name: 'Vignesh',
  fullName: 'Vignesh Murali',
  role: 'Product Designer',
  experienceYears: 4,
  email: 'vigneshmurali2107@gmail.com',
  phone: '+91 9025934557',
  website: 'vigneshmurali.com',
  location: 'Bangalore, India',
  timezone: 'Asia/Kolkata',
  behance: 'https://www.behance.net/vigneshwaranmurali',
  linkedin: 'https://www.linkedin.com/in/vigneshmurali24',
  // The Figma file has no Dribbble link. Add the URL here to show it.
  dribbble: null,
  // One-page résumé for recruiters (public/Vigneshwaran-M-Resume.pdf).
  resume: 'Vigneshwaran-M-Resume.pdf',
  // Head-and-shoulders crop of images/portrait.png, for the hero.
  portrait: 'images/portrait-hero.png',
  portraitAlt: 'Vignesh with his arms folded, in a black knit sweater',
  // About section photo (Figma node 1:16257).
  portraitAbout: 'images/portrait-about.jpg',
  portraitAboutAlt: 'Vignesh in a white linen shirt, hands in his pockets, looking to the side',
  showreel: 'showreel.mp4',
  showreelPoster: 'images/showreel-poster.jpg',
};

export const meta = {
  title: 'Product & UI/UX Designer in Bangalore | Vignesh Murali',
  description:
    'Bangalore product and UI/UX designer with 4+ years in SaaS, web, app and brand design. Explore Vignesh Murali’s work and enquire about freelance or full-time projects.',
};

// One page, so the nav links jump to sections.
export const nav = [
  { href: '#work', label: 'Work' },
  { href: '#disciplines', label: 'Disciplines' },
  { href: '#toolbox', label: 'Toolbox' },
  { href: '#ai-lab', label: 'AI Lab' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
];

export const hero = {
  lines: ['Design that makes', 'people say Yes.'],
  body: 'You’re just one step away from bringing your imagination to life.',
  cta: { label: 'Start your project', href: '#contact' },
  badge: 'PRODUCT DESIGNER · OPEN TO WORK · BANGALORE · ',
  notes: [
    { icon: 'wave', title: ['Interfaces that', 'make sense.'], body: 'UI/UX and product design for SaaS and SAP.' },
    { icon: 'tools', title: ['Ideas that', 'actually move.'], body: 'Motion, brand and campaign visuals.' },
  ],
  // latest first
  trust: ['Grassdoor Logistics / Omnigreen', 'Deepvue', 'RetainIQ', 'Modish'],
  tagline: ['Less noise.', 'More clarity.'],
};

// Cards on the 3D ring around the portrait in the hero.
export const ringCards = [
  { type: 'text', title: 'UI/UX', sub: 'Calm, clear interfaces', icon: 'cursor', tint: '#E4DAFB', ink: '#6941C6' },
  { type: 'image', src: 'images/projects/product-revamp.png' },
  { type: 'text', title: 'Motion', sub: 'Ideas that move', icon: 'play', tint: '#DDF7C8', ink: '#3B7D0F' },
  { type: 'image', src: 'images/projects/motion-integrations.png' },
  { type: 'text', title: 'Product', sub: 'Dashboards that make sense', icon: 'grid', tint: '#FFE3CC', ink: '#C4560C' },
  { type: 'image', src: 'images/projects/fintech-ai-app.png' },
  { type: 'text', title: 'Graphic', sub: 'Campaigns with one voice', icon: 'shapes', tint: '#D3F2FB', ink: '#0B7A99' },
  { type: 'image', src: 'images/projects/branding.png' },
  { type: 'text', title: 'Branding', sub: 'Identities with a system', icon: 'star', tint: '#FCDDEB', ink: '#B4246A' },
];

export const disciplinesIntro = {
  eyebrow: 'Disciplines',
  title: ['Six crafts,', 'one calm language.'],
  body: 'Most projects need more than one kind of design. I move between them so the product, the brand and the motion all say the same thing.',
};

export const disciplines = [
  {
    key: 'uiux',
    title: 'UI/UX Design',
    short: 'UI/UX',
    preview: 'wire',
    body: 'Research-led flows, wireframes and high-fidelity prototypes for web and mobile. I design screens that are easy to scan and quick to build.',
    deliverables: ['User flows', 'Wireframes', 'Prototypes', 'Design systems', 'Landing pages'],
    project: { label: 'Landing Page — SaaS', href: 'https://www.behance.net/gallery/230687789/Landing-Page-SaaS', image: 'images/work/ui-ux.png' },
  },
  {
    key: 'product',
    title: 'Product Design',
    short: 'Product',
    preview: 'dash',
    body: 'End-to-end product work, from the problem statement to shipped UI. At Deepvue I led the analytics dashboard revamp for complex fintech data.',
    deliverables: ['Dashboards', 'Booking flows', 'App design', 'Release notes', 'Handoff'],
    project: { label: 'Dashboard Revamp — Deepvue', href: 'https://www.behance.net/gallery/226234661/Dashboard-Revamp', image: 'images/work/product.png' },
  },
  {
    key: 'motion',
    title: 'Motion Graphics',
    short: 'Motion',
    preview: 'motion',
    body: 'Logo animations, product explainers, launch teasers and UI motion. Timing and easing that give a brand its rhythm.',
    deliverables: ['Logo animation', 'Explainers', 'Brand teasers', 'UI motion', 'Video editing'],
    project: { label: 'Motion Graphics', href: 'https://www.behance.net/gallery/230749799/Motion-Graphics', image: 'images/work/motion.png' },
  },
  {
    key: 'graphic',
    title: 'Graphic Design',
    short: 'Graphic',
    preview: 'poster',
    body: 'Campaign creatives, social series, email design, print and merchandise. Systems that keep every touchpoint on brand.',
    deliverables: ['Campaigns', 'Social media', 'Email design', 'Print & merch', 'Branding'],
    project: { label: 'Flyer Automation — Brand', href: 'https://www.behance.net/gallery/230710601/Flyer-Automation-Brand', image: 'images/work/graphic.png' },
  },
  {
    key: 'logo',
    title: 'Logo Design',
    short: 'Logo',
    preview: 'logo',
    body: 'Logos and identity marks built on simple geometry, so they stay sharp everywhere from an app icon to a billboard.',
    deliverables: ['Logomarks', 'Wordmarks', 'Monograms', 'Brand guidelines', 'Logo animation'],
    project: { label: 'Branding for a Fintech Service', href: 'https://www.behance.net/gallery/218921809/Branding-for-a-Fintech-Service', image: 'images/work/branding.png' },
  },
  {
    key: 'print',
    title: 'Print Design',
    short: 'Print',
    preview: 'print',
    body: 'Brochures, flyers, posters and merchandise, prepared print-ready with bleed, colour and paper in mind.',
    deliverables: ['Brochures', 'Flyers', 'Posters', 'Merchandise', 'Offer collaterals'],
    project: { label: 'Merchandise', href: 'https://www.behance.net/gallery/230692137/Merchandise', image: 'images/work/print.png' },
  },
];

export const aiIntro = {
  eyebrow: 'AI lab',
  title: ['Designing with AI,', 'building with agents.'],
  body: 'Outside client work, I explore generative design with AI, build AI agents and automations as a hobby, and vibe-code small apps that solve real, everyday problems.',
};

// Shown as one extra line under the About bio.
export const aboutAi =
  'I also create generative designs with AI, build AI agents and automations for fun, and vibe-code apps that solve real-time problems.';

export const aiPractices = [
  { icon: 'spark', title: 'Generative design', body: 'AI-assisted moodboards, visuals and motion explorations, refined by hand into on-brand work.' },
  { icon: 'agent', title: 'Agents & automation', body: 'Personal AI agents and no-code workflows that take repetitive work off the table.' },
  { icon: 'code', title: 'Vibe coding', body: 'Small working apps, shipped with Claude Code and Codex, that solve real-time problems.' },
];

// Platform icons. `si` is a Simple Icons key (resolved at build time);
// `glyph` is a built-in icon for brands Simple Icons doesn't carry.
export const aiTools = [
  {
    group: 'Agentic coding',
    items: [
      { name: 'Claude Code', si: 'siClaude', badge: 'terminal' },
      { name: 'OpenAI Codex', glyph: 'terminal', color: '#111014' },
      { name: 'Cursor', si: 'siCursor' },
      { name: 'GitHub Copilot', si: 'siGithubcopilot' },
      { name: 'v0', si: 'siV0' },
      { name: 'Replit', si: 'siReplit' },
    ],
  },
  {
    group: 'Models & assistants',
    items: [
      { name: 'Claude', si: 'siClaude' },
      { name: 'ChatGPT', glyph: 'openai', color: '#111014' },
      { name: 'Gemini', si: 'siGooglegemini' },
      { name: 'Perplexity', si: 'siPerplexity' },
    ],
  },
  {
    group: 'Agents & automation',
    items: [
      { name: 'n8n', si: 'siN8n' },
      { name: 'Zapier', si: 'siZapier' },
      { name: 'Make', si: 'siMake' },
      { name: 'LangChain', si: 'siLangchain' },
      { name: 'CrewAI', si: 'siCrewai' },
    ],
  },
  {
    group: 'Generative media',
    items: [
      { name: 'Hugging Face', si: 'siHuggingface' },
      { name: 'ElevenLabs', si: 'siElevenlabs' },
    ],
  },
];

export const toolboxIntro = {
  eyebrow: 'Toolbox',
  title: ['My toolbox.', 'Go on, play with it.'],
  body: 'Grab a tool, throw it around, then drop it in the slot to see what I use it for.',
};

// The playground tools. `value` is the proficiency from the Figma skill rings.
export const tools = [
  { key: 'figma', name: 'Figma', value: 100, src: 'images/tools/figma.png', use: 'UI/UX, design systems and clickable prototypes.', disciplines: ['uiux', 'product'] },
  { key: 'illustrator', name: 'Adobe Illustrator', value: 90, src: 'images/tools/illustrator.png', use: 'Logos, brand marks and vector illustration.', disciplines: ['logo', 'graphic'] },
  { key: 'photoshop', name: 'Adobe Photoshop', value: 90, src: 'images/tools/photoshop.png', use: 'Campaign key visuals, compositing and retouching.', disciplines: ['graphic'] },
  { key: 'aftereffects', name: 'Adobe After Effects', value: 75, src: 'images/tools/aftereffects.png', use: 'Logo animation, explainers and UI motion.', disciplines: ['motion'] },
  { key: 'framer', name: 'Framer', value: 85, src: 'images/tools/framer.png', use: 'Interactive prototypes and live marketing sites.', disciplines: ['uiux', 'motion'] },
  { key: 'premiere', name: 'Adobe Premiere Pro', value: 75, src: 'images/tools/premiere.png', use: 'Video editing, reels and promos.', disciplines: ['motion'] },
  { key: 'indesign', name: 'Adobe InDesign', value: 100, src: 'images/tools/indesign.png', use: 'Brochures, print layouts and decks.', disciplines: ['print', 'graphic'] },
  { key: 'webflow', name: 'Webflow', value: 85, src: 'images/tools/webflow.png', use: 'No-code websites with real CMS content.', disciplines: ['uiux'] },
  { key: 'xd', name: 'Adobe XD', value: 90, src: 'images/tools/xd.png', use: 'Wireframes and quick flow prototypes.', disciplines: ['uiux', 'product'] },
  { key: 'lightroom', name: 'Adobe Lightroom', value: 90, src: 'images/tools/lightroom.png', use: 'Photo grading for campaigns and social.', disciplines: ['graphic'] },
];

export const workIntro = {
  eyebrow: 'Selected work',
  title: ['Work that ships,', 'and still looks good.'],
};

export const workFilters = [
  { key: 'all', label: 'All' },
  { key: 'uiux', label: 'UI/UX & Web', match: ['UI/UX', 'Web Design', 'App Design'] },
  { key: 'motion', label: 'Motion', match: ['Motion'] },
  { key: 'graphic', label: 'Graphic', match: ['Graphic Design'] },
  { key: 'brand', label: 'Branding', match: ['Branding'] },
];

export const showreelIntro = {
  eyebrow: 'Showreel 2026',
  title: ['Fifteen seconds', 'of motion.'],
};

// Listed oldest first, as in the Figma timeline.
export const experience = [
  {
    company: 'DigiPro Marketing LM',
    period: 'Nov 2022 to Jun 2024',
    role: 'Graphic Designer',
    skills: 'Graphic Design, Website Design, Logo Design, Branding & Identity, Promotional Videos, Print Design (e.g., posters, brochures), Motion Graphics, Email Campaign, UI/UX Design.',
  },
  {
    company: 'RetainIQ, Bangalore',
    period: 'Jul 2024 to Sep 2024',
    role: 'Graphic Designer',
    skills: 'Graphic Design, Dynamic Product Design, Branding & Identity, Motion Graphics, Email Campaign, UI/UX Design.',
  },
  {
    company: 'Deepvue, Bangalore',
    period: 'Sep 2024 to Oct 2025',
    role: 'Graphic Designer and UI/UX',
    skills: 'Product Design, UI/UX Design, Web Design, Visual Design, Motion Graphics, Video Editing, Logo Design, Email Design, Printable Design (e.g. brochures, flyers), Infographics & Blog Graphics, Landing Page Design, Campaign Creatives, Social Media Post Design, Branding & Identity, Product Release Notes Design.',
  },
  {
    company: 'Freelance, Bangalore',
    period: 'Jun 2023 to Aug 2025',
    role: 'Lead Designer and UI/UX',
    skills: 'Wireframes, High-Fidelity Prototypes, Booking Flows, Responsive Design, Design Systems, Interaction Design, Website Redesigns, Experience Optimization, Motion Graphics, Video Editing, Logo Design, Email Design, Printable Design (e.g. brochures, flyers), Infographics & Blog Graphics, Landing Page Design, Campaign Creatives, Social Media Post Design, Branding & Identity, Offer Collaterals, Product Launch & Seasonal Campaign Design.',
  },
  {
    company: 'Grassdoor Logistics',
    period: 'Oct 2025 to Present',
    role: 'UI/UX and Graphic Designer',
    skills: 'UI/UX Design, Graphic Design.',
  },
];

// Long bio from the Figma "About me" frame.
export const aboutLong =
  'I’m Vignesh Murali, a UI/UX & Graphic Designer skilled in crafting seamless user experiences and visually compelling designs using tools like Figma, Framer and Adobe Suite. I specialize in wireframing, prototyping, branding and creative content across web, product and marketing. With experience working with both Indian and international clients, I deliver holistic design solutions that blend creativity, strategy and clear communication.';

// Slider values measured from the Figma bars (fill width / track width).
export const skills = [
  { name: 'Product Design', value: 91 },
  { name: 'Website UI/UX', value: 93 },
  { name: 'App Design', value: 85 },
  { name: 'Graphic Design', value: 91 },
];

// The six stops of the double-diamond diagram in Figma. Only the Discover
// note comes from the file; the other notes are written for this site.
export const processSteps = [
  { title: 'Kick off', body: 'Align on goals, audience, constraints and what success looks like.' },
  { title: 'Discover', body: 'Identified real user needs and pain points and business problems.' },
  { title: 'Define', body: 'Turn research into a clear problem statement, user flows and priorities.' },
  { title: 'Design', body: 'Explore directions, then refine one into wireframes and high-fidelity prototypes.' },
  { title: 'Deliver', body: 'Hand off a documented design system and support development through launch.' },
  { title: 'Reflection', body: 'Review the results with the team and carry the lessons into the next release.' },
];

// Project cards from Figma. The titles are part of the card artwork. The file
// has no links for these; add an `href` to any project to make its card a link.
export const projects = [
  { title: 'Fintech AI App', category: 'App Design', image: 'images/projects/fintech-ai-app.png', href: 'https://www.behance.net/gallery/231811507/AI-assisted-Fintech-App' },
  { title: 'Product Revamp', category: 'UI/UX', image: 'images/projects/product-revamp.png', href: 'https://www.behance.net/gallery/226234661/Dashboard-Revamp' },
  { title: 'Landing Page', category: 'Web Design', image: 'images/projects/landing-music.png', href: 'https://www.behance.net/gallery/230687789/Landing-Page-SaaS' },
  { title: 'Landing Page', category: 'Web Design', image: 'images/projects/landing-email-validation.png' },
  { title: 'Landing Page', category: 'Web Design', image: 'images/projects/landing-notion.png' },
  { title: 'Login Page', category: 'UI/UX', image: 'images/projects/login-page.png' },
  { title: 'Booking Page', category: 'UI/UX', image: 'images/projects/booking-page.png' },
  { title: 'Branding', category: 'Branding', image: 'images/projects/branding.png', href: 'https://www.behance.net/gallery/218921809/Branding-for-a-Fintech-Service' },
  { title: 'Brand Teaser', category: 'Motion', image: 'images/projects/brand-teaser.png' },
  { title: 'Logo Animation', category: 'Motion', image: 'images/projects/logo-animation-thal.png', href: 'https://www.behance.net/gallery/206932523/Logo-Animation' },
  { title: 'Logo Animation', category: 'Motion', image: 'images/projects/logo-animation-cynlr.png' },
  { title: 'Motion Graphics', category: 'Motion', image: 'images/projects/motion-integrations.png', href: 'https://www.behance.net/gallery/230749799/Motion-Graphics' },
  { title: 'Motion Graphics', category: 'Motion', image: 'images/projects/motion-onboarding.png' },
  { title: 'E-mail Campaign', category: 'Graphic Design', image: 'images/projects/email-campaign.png' },
  { title: 'Hero Banner', category: 'Graphic Design', image: 'images/projects/hero-banner.png' },
  { title: 'Banner', category: 'Graphic Design', image: 'images/projects/banner.png' },
  { title: 'Social Media', category: 'Graphic Design', image: 'images/projects/social-media.png', href: 'https://www.behance.net/gallery/206932249/Social-Media-Post' },
  { title: 'Merchandise', category: 'Graphic Design', image: 'images/projects/merchandise.png', href: 'https://www.behance.net/gallery/230692137/Merchandise' },
];

export const testimonialsIntro = {
  eyebrow: 'Kind words',
  title: ['What it’s like', 'to work together.'],
};

// Clients and the people quoted. The names and brands are real; the quote
// wording is a draft written for the site. Replace each quote with the
// client's own words (and their permission) before publishing as a review.

// Brands shown in the "worked with" strip.
export const brands = ['Grassdoor Logistics', 'Omnigreen', 'Deepvue', 'RetainIQ', 'DigiPro', 'Modish', 'Salesmax'];

export const testimonials = [
  {
    name: 'Chandrashekar',
    role: 'Founder, Deepvue',
    rating: 5,
    quote: 'Vignesh led the redesign of our analytics dashboard end to end, which helped us make 2X revenue. Complex fintech data became clear and easy to act on, and every screen he handed over was ready to build.',
  },
  {
    name: 'Gaurav',
    role: 'Founder, Deepvue',
    rating: 5,
    quote: 'From product UI to release notes, launch videos and campaign creatives, he keeps everything on brand. He is the person we go to when something has to look right and ship fast.',
  },
  {
    name: 'Janani',
    role: 'Founder, DigiPro',
    rating: 5,
    quote: 'Logos, brand identities, promo videos and print, all handled with the same care. Our clients noticed the jump in quality straight away.',
  },
  {
    name: 'Seema',
    role: 'Founder, Modish',
    rating: 5,
    quote: 'He understood our brand quickly and turned it into social posts and campaign visuals that felt like one consistent voice. Thoughtful, quick and easy to work with.',
  },
  {
    name: 'Stephen',
    role: 'Founder, Salesmax',
    rating: 5,
    quote: 'Clean UI, sharp landing pages and clickable prototypes that made our product easier to explain. Working across time zones was never an issue.',
  },
];

// The footer's "Currently" ticker.
export const currently = ['Designing for Grassdoor', 'Vibe-coding small apps', 'Building AI agents', 'Exploring generative design', 'Animating a logo'];

export const contact = {
  title: ['Let’s make something', 'clear.'],
  body: 'Tell me about the product, the brand or the launch. I usually reply within a day.',
};
