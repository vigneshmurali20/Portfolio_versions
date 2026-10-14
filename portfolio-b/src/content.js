/*
 * Version B — all site copy and data. Facts (experience, projects, links,
 * skills) come from the Figma file (figma.com/design/T9UpObjYsMdFXsJrQvGjRY)
 * and match Version A. Edit this file to change words or links.
 */

export const site = {
  name: 'Vignesh',
  fullName: 'Vignesh Murali',
  role: 'Product Designer & Design Engineer',
  experienceYears: 5,
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
  // Low-angle crop (head to hands) of the black-and-white portrait, for the hero.
  portrait: 'images/portrait-hero.png',
  portraitAlt: 'Vignesh in a black turtleneck, photographed from a low angle, hands in his pockets',
  // About section photo (Figma node 1:16257).
  portraitAbout: 'images/portrait-about.jpg',
  portraitAboutAlt: 'Vignesh in a white linen shirt, hands in his pockets, looking to the side',
  showreel: 'showreel.mp4',
  showreelPoster: 'images/showreel-poster.jpg',
};

export const meta = {
  title: 'Product Designer & Design Engineer | AI Design Automation, UX & Growth | Vignesh Murali',
  description:
    'Product designer and design engineer for startups, agencies, and global teams. I design SaaS products, websites, and apps, and build AI workflows that take them from brief to launch faster.',
};

// One page, so the nav links jump to sections.
export const nav = [
  { href: '#work', label: 'Work' },
  { href: '#disciplines', label: 'Disciplines' },
  { href: '#toolbox', label: 'Toolbox' },
  { href: '#ai-lab', label: 'AI Lab' },
  { href: '#about', label: 'About' },
  { href: '#writing', label: 'Writing' },
  { href: '#contact', label: 'Contact' },
];

export const hero = {
  lines: ['Design that makes', 'people say Yes.'],
  body: 'I design digital products, websites, and apps, and build the AI workflows that ship them faster.',
  cta: { label: 'Start your project', href: '#contact' },
  badge: 'PRODUCT DESIGNER · DESIGN ENGINEER · ',
  notes: [
    { icon: 'wave', title: ['Interfaces that', 'make sense.'], body: 'UI/UX and product design for SaaS.' },
    { icon: 'tools', title: ['Ideas that', 'actually move.'], body: 'Motion, brand and campaign visuals.' },
  ],
  // latest first
  trust: ['Grassdoor Logistics / Omnigreen', 'Deepvue', 'RetainIQ', 'Modish'],
  tagline: ['Less noise.', 'More clarity.'],
};

// Countries on the client globe. `count` is the number of clients there:
// set it (e.g. count: 4) and the globe, pins and list show it. null hides it.
export const clientRegions = [
  { code: 'US', short: 'US', name: 'United States', count: null, color: '#B69AF5' },
  { code: 'GB', short: 'UK', name: 'United Kingdom', count: null, color: '#5ED3F3' },
  { code: 'AE', short: 'UAE', name: 'United Arab Emirates', count: null, color: '#FFB27A' },
  { code: 'AU', short: 'AU', name: 'Australia', count: null, color: '#9BE07A' },
  // home: arcs start here, so India gets a beacon instead of an arc
  { code: 'IN', short: 'IN', name: 'India', count: null, color: '#FF8FB8', home: true },
];

// "The work, in numbers". value is counted up from 0; suffix follows it.
// total is the full number used by the charts tab. size sets the bento tile
// (wide, tall, big or normal). back is the text on the reverse of the card.
// group splits the charts: product work vs campaign work at volume.
export const impactStats = [
  { value: 10, suffix: '+', total: 10, label: 'Web apps, apps & products', note: 'Designed to solve real user problems', group: 'product', size: 'big', back: 'Fintech dashboards, an AI-assisted finance app, booking flows and SaaS products, from wireframe to handoff.' },
  { value: 20, suffix: '+', total: 20, label: 'High-converting websites', note: 'Built to turn visits into action', group: 'product', size: 'normal', back: 'SaaS landing pages and marketing sites, including 13+ landing pages for Deepvue.' },
  { value: 30, suffix: 'k+', total: 30000, label: 'Email designs', note: 'Campaigns and lifecycle touchpoints', group: 'volume', size: 'normal', back: 'CRM campaigns, responsive templates and dynamic product emails for global DTC brands.' },
  { value: 50, suffix: '+', total: 50, label: 'Logo designs', note: 'Distinct identities, made to last', group: 'product', size: 'normal', back: 'Marks and identity systems for fintech, tech and consumer brands.' },
  { value: 30, suffix: '+', total: 30, label: 'Motion graphics', note: 'Stories brought into motion', group: 'product', size: 'normal', back: 'Logo animations, product explainers, launch teasers and feature highlights.' },
  { value: 20, suffix: 'k+', total: 20000, label: 'Print designs', note: 'Creative produced at scale', group: 'volume', size: 'wide', back: 'Brochures, flyers, posters, event booths and merchandise, prepared print-ready.' },
  { value: 500, suffix: '+', total: 500, label: 'Social media designs', note: 'Campaign series across platforms', group: 'volume', size: 'normal', back: 'Launch, seasonal and always-on series, designed as one consistent system.' },
  { value: 100, suffix: '+', total: 100, label: 'Infographics', note: 'Complex ideas made easy to read', group: 'volume', size: 'normal', back: '100+ infographics and 100+ blog thumbnails that make dense topics easy to scan.' },
];

// The "Current project" section. Fill in the details when ready:
// set preview to an image path (e.g. 'images/current.jpg') and link to a URL.
export const currentProject = {
  status: 'In progress',
  name: 'OmniGreen',
  title: 'OmniGreen, taking shape.',
  body: 'Designing the website for OmniGreen, one platform for point of sale, eCommerce, delivery, marketing and compliance. Every page, from home to products, solutions and resources.',
  tags: ['Web design', 'UI/UX', 'Product', 'Marketing'],
  // a full-page capture that scrolls slowly inside the preview window
  preview: 'images/current-omnigreen.webp',
  previewAlt: 'The OmniGreen home page design, from the hero to the footer',
  link: null,
  // workstreams shown as cards under the project, grouped by tag
  tracks: [
    {
      tag: 'Marketing',
      title: 'Email at scale, for five brands at once',
      cards: [
        { value: '500+', label: 'Email journeys', note: 'Designed end to end, from welcome to win-back' },
        { value: '5', label: 'Brands redesigned', note: 'Five brand aesthetics refreshed at once, on one shared system' },
        { value: 'Auto', label: 'Self-built journeys', note: 'My own automation, so new journeys ship faster and stay consistent' },
        { value: '2', label: 'Months', note: 'Delivery window, running now', live: true },
      ],
    },
  ],
};

// Cards on the 3D ring around the portrait in the hero.
export const ringCards = [
  { type: 'text', title: 'UI/UX', sub: 'Calm, clear interfaces', icon: 'cursor', tint: '#E4DAFB', ink: '#6941C6' },
  { type: 'image', src: 'images/projects/deepvue-dashboard-revamp.webp' },
  { type: 'text', title: 'Motion', sub: 'Ideas that move', icon: 'play', tint: '#DDF7C8', ink: '#3B7D0F' },
  { type: 'image', src: 'images/projects/motion-graphics-software-interface-showcase.webp' },
  { type: 'text', title: 'Product', sub: 'Dashboards that make sense', icon: 'grid', tint: '#FFE3CC', ink: '#C4560C' },
  { type: 'image', src: 'images/projects/ai-assisted-fintech-app-money-companion.webp' },
  { type: 'text', title: 'Graphic', sub: 'Campaigns with one voice', icon: 'shapes', tint: '#D3F2FB', ink: '#0B7A99' },
  { type: 'image', src: 'images/projects/deepvue-brand-identity.webp' },
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
    project: { label: 'Landing Page — SaaS', href: 'https://www.behance.net/gallery/230687789/Landing-Page-SaaS', image: 'images/projects/saas-landing-page-purple-product-website.webp' },
  },
  {
    key: 'product',
    title: 'Product Design',
    short: 'Product',
    preview: 'dash',
    body: 'End-to-end product work, from the problem statement to shipped UI. At Deepvue I led the analytics dashboard revamp for complex fintech data.',
    deliverables: ['Dashboards', 'Booking flows', 'App design', 'Release notes', 'Handoff'],
    project: { label: 'Dashboard Revamp — Deepvue', href: 'https://www.behance.net/gallery/226234661/Dashboard-Revamp', image: 'images/projects/deepvue-dashboard-revamp.webp' },
  },
  {
    key: 'motion',
    title: 'Motion Graphics',
    short: 'Motion',
    preview: 'motion',
    body: 'Logo animations, product explainers, launch teasers and UI motion. Timing and easing that give a brand its rhythm.',
    deliverables: ['Logo animation', 'Explainers', 'Brand teasers', 'UI motion', 'Video editing'],
    project: { label: 'Motion Graphics', href: 'https://www.behance.net/gallery/230749799/Motion-Graphics', image: 'images/projects/motion-graphics-software-interface-showcase.webp' },
  },
  {
    key: 'graphic',
    title: 'Graphic Design',
    short: 'Graphic',
    preview: 'poster',
    body: 'Campaign creatives, social series, email design, print and merchandise. Systems that keep every touchpoint on brand.',
    deliverables: ['Campaigns', 'Social media', 'Email design', 'Print & merch', 'Branding'],
    project: { label: 'Flyer Automation — Brand', href: 'https://www.behance.net/gallery/230710601/Flyer-Automation-Brand', image: 'images/projects/flyer-dark-promotional-print.webp' },
  },
  {
    key: 'logo',
    title: 'Logo Design',
    short: 'Logo',
    preview: 'logo',
    body: 'Logos and identity marks built on simple geometry, so they stay sharp everywhere from an app icon to a billboard.',
    deliverables: ['Logomarks', 'Wordmarks', 'Monograms', 'Brand guidelines', 'Logo animation'],
    project: { label: 'Branding for a Fintech Service', href: 'https://www.behance.net/gallery/218921809/Branding-for-a-Fintech-Service', image: 'images/projects/thal-the-fitness-coliseum-identity.webp' },
  },
  {
    key: 'print',
    title: 'Print Design',
    short: 'Print',
    preview: 'print',
    body: 'Brochures, flyers, posters and merchandise, prepared print-ready with bleed, colour and paper in mind.',
    deliverables: ['Brochures', 'Flyers', 'Posters', 'Merchandise', 'Offer collaterals'],
    project: { label: 'Merchandise', href: 'https://www.behance.net/gallery/230692137/Merchandise', image: 'images/projects/t-shirt-design-black-apparel.webp' },
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
    highlight: [
      'Creative for 7+ international and 5+ Indian clients across 10+ marketing campaigns.',
      '500+ social media designs, 20+ logos, 50+ videos and 30+ print designs.',
    ],
    skills: 'Graphic Design, Website Design, Logo Design, Branding & Identity, Promotional Videos, Print Design (e.g., posters, brochures), Motion Graphics, Email Campaign, UI/UX Design.',
  },
  {
    company: 'RetainIQ, Bangalore',
    period: 'Jul 2024 to Sep 2024',
    role: 'Graphic Designer',
    highlight: [
      'Designed 20+ responsive email templates, icons, GIFs and campaign assets for global DTC brands.',
      'Delivered 100% on-time outputs for urgent same-day requests.',
    ],
    skills: 'Graphic Design, Dynamic Product Design, Branding & Identity, Motion Graphics, Email Campaign, UI/UX Design.',
  },
  {
    company: 'Deepvue, Bangalore',
    period: 'Sep 2024 to Oct 2025',
    role: 'Graphic Designer and UI/UX',
    highlight: [
      'Revamped the fintech dashboard UI/UX, leading to a 2× revenue boost.',
      'Designed DigiLocker identity-verification flows, the partner login, demo booking, brand guidelines and the GFF ’25 event website.',
      '13+ landing pages, 100+ infographics, 100+ blog thumbnails, 10+ motion graphics and 20+ static product designs.',
    ],
    skills: 'Product Design, UI/UX Design, Web Design, Visual Design, Motion Graphics, Video Editing, Logo Design, Email Design, Printable Design (e.g. brochures, flyers), Infographics & Blog Graphics, Landing Page Design, Campaign Creatives, Social Media Post Design, Branding & Identity, Product Release Notes Design.',
  },
  {
    company: 'Modish Family Salon (freelance)',
    period: 'Jun 2023 to Aug 2025',
    role: 'Design Lead',
    highlight: [
      'Led brand and digital design for a multi-location salon brand: identity, stationery and website.',
      'Designed seasonal campaigns across print, social and in-store channels.',
    ],
    skills: 'Wireframes, High-Fidelity Prototypes, Booking Flows, Responsive Design, Design Systems, Interaction Design, Website Redesigns, Experience Optimization, Motion Graphics, Video Editing, Logo Design, Email Design, Printable Design (e.g. brochures, flyers), Infographics & Blog Graphics, Landing Page Design, Campaign Creatives, Social Media Post Design, Branding & Identity, Offer Collaterals, Product Launch & Seasonal Campaign Design.',
  },
  {
    company: 'Grassdoor Logistics / OmniGreen',
    period: 'Oct 2025 to Present',
    role: 'UI/UX and Graphic Designer',
    highlight: [
      'Design owner across the B2B platform and five DTC brands of an omnichannel retail business.',
      'Designing the OmniGreen website and product marketing system, with a page system that launches new pages without new design work.',
      'Leading 500+ lifecycle email journeys across five consumer brands within two months, on one shared design system.',
      'Built AI-assisted design automation and journey workflows that cut production time.',
    ],
    skills: 'UI/UX Design, Graphic Design.',
  },
];

// Earlier roles from LinkedIn, shown as one compact row under Experience.
export const earlierRoles = [
  { org: 'Vellore Institute of Technology', role: 'Design', period: 'Aug 2021 to Mar 2022' },
  { org: 'BEEP by EventBeep', role: 'Marketing Content Specialist', period: 'Oct 2021 to Dec 2021' },
  { org: 'Edureka', role: 'Associate Inside Sales Manager', period: 'Aug 2022 to Oct 2022' },
];

// Writing, posts and features across platforms. The home page shows the
// `featured` ones (up to three) and /writing/ lists them all. `excerpt` is
// quoted from the post; `summary` is the longer crawlable description.
// `embed` is the platform's embed URL (shown on /writing/ on demand).
export const writingIntro = {
  title: 'Writing & posts',
  pageTitle: 'Writing, posts and features | Vignesh Murali',
  description:
    'Posts, articles and features by Vignesh Murali on product design, design systems and AI design automation with Claude, Figma MCP and n8n.',
  lead: 'Notes on product design, design systems and the AI workflows I build to ship design faster. Shared across LinkedIn and other platforms.',
};

export const writing = [
  {
    id: 'n8n-lifecycle-design-automation',
    title: 'From 15 to 20 days to hours: automating lifecycle design with n8n, Claude and Figma',
    platform: 'LinkedIn',
    type: 'Post',
    date: '2026-10-10',
    url: 'https://www.linkedin.com/feed/update/urn:li:share:7514742888027807745/',
    embed: 'https://www.linkedin.com/embed/feed/update/urn:li:share:7514742888027807745',
    excerpt:
      '3,000+ emails, SMS, and web popups. That is how many lifecycle assets I designed manually before realizing the way we build creative had to change.',
    summary:
      'How a manual lifecycle production cycle became an automated n8n workflow: a webhook takes the client website, a Claude agent turns brand signals into structured tokens, a Slack gate lets stakeholders approve in one click, and a Figma agent builds production-ready email layouts inside the design system.',
    topics: ['Design automation', 'n8n', 'Claude', 'Figma MCP', 'Design systems', 'Lifecycle design'],
    featured: true,
  },
  {
    id: 'claude-for-startups',
    title: 'Claude for Startups: a resource for early-stage AI founders',
    platform: 'LinkedIn',
    type: 'Post',
    date: '2026-10-09',
    url: 'https://www.linkedin.com/feed/update/urn:li:share:7514189422565924864/',
    embed: 'https://www.linkedin.com/embed/feed/update/urn:li:share:7514189422565924864',
    excerpt:
      'Big resource alert for early-stage AI founders. If you’re building with LLMs, check out the Claude for Startups program by Anthropic.',
    summary:
      'A pointer to the Claude for Startups program by Anthropic: API credits for prototyping and scaling, technical office hours, and access to events and founder networks.',
    topics: ['Claude', 'Anthropic', 'AI startups'],
    featured: true,
  },
];

// Long bio from the Figma "About me" frame.
export const aboutLong =
  'I’m Vignesh Murali, a product designer working with startups, agencies, and teams across markets. I turn user and business needs into clear SaaS products, websites, and apps, and collaborate from early flows through polished UI and developer handoff. My work connects usability with business goals like stronger conversion and sustainable growth.';

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

// Project cards, exported from the "New thumbnail" section in Figma, in the
// file's series order (1 / 64 onwards). Each image is the full card artwork,
// title included. Add an `href` to any project to make its card a link.
export const projects = [
  { title: 'Motion graphics', sub: 'Kinetic typography', category: 'Motion', image: 'images/projects/motion-graphics-kinetic-typography.webp' },
  { title: 'Card design', sub: 'Everyday banking', category: 'Graphic Design', image: 'images/projects/card-design-everyday-banking.webp' },
  { title: 'App design', sub: 'Mobile banking experience', category: 'App Design', image: 'images/projects/app-design-mobile-banking-experience.webp' },
  { title: 'Iconography', sub: 'Mint visual language', category: 'Graphic Design', image: 'images/projects/iconography-mint-visual-language.webp' },
  { title: 'Airfield Supply Company', sub: 'Aviation-inspired branding', category: 'Branding', image: 'images/projects/airfield-supply-company-aviation-inspired-brandi.webp' },
  { title: 'Dashboard', sub: 'Wallet re-engagement', category: 'UI/UX', image: 'images/projects/dashboard-wallet-re-engagement.webp' },
  { title: 'Stash Dash', sub: 'Running mascot identity', category: 'Branding', image: 'images/projects/stash-dash-running-mascot-identity.webp' },
  { title: 'STIIIZY', sub: 'Leaf-themed welcome branding', category: 'Branding', image: 'images/projects/stiiizy-leaf-themed-welcome-branding.webp' },
  { title: 'Motion design', sub: 'Glowing W interface', category: 'Motion', image: 'images/projects/motion-design-glowing-w-interface.webp' },
  { title: 'Social media', sub: 'Fintech editorial', category: 'Graphic Design', image: 'images/projects/social-media-fintech-editorial.webp' },
  { title: 'SaaS CRM dashboard', sub: 'Relationship workspace', category: 'UI/UX', image: 'images/projects/saas-crm-dashboard-relationship-workspace.webp' },
  { title: 'Motion graphics', sub: 'Software interface showcase', category: 'Motion', image: 'images/projects/motion-graphics-software-interface-showcase.webp' },
  { title: 'SaaS dashboard', sub: 'Data workspace', category: 'UI/UX', image: 'images/projects/saas-dashboard-data-workspace.webp' },
  { title: 'Deepvue', sub: 'AI-powered risk intelligence', category: 'Web Design', image: 'images/projects/deepvue-ai-powered-risk-intelligence.webp' },
  { title: 'Deepvue', sub: 'GFF event website', category: 'Web Design', image: 'images/projects/deepvue-gff-event-website.webp' },
  { title: 'Onboarding screens', sub: 'First impressions', category: 'App Design', image: 'images/projects/onboarding-screens-first-impressions.webp' },
  { title: 'Deepvue.tech', sub: 'Dashboard revamp', category: 'UI/UX', image: 'images/projects/deepvue-dashboard-revamp.webp', href: 'https://www.behance.net/gallery/226234661/Dashboard-Revamp' },
  { title: 'AI assisted fintech app', sub: 'Money companion', category: 'App Design', image: 'images/projects/ai-assisted-fintech-app-money-companion.webp', href: 'https://www.behance.net/gallery/231811507/AI-assisted-Fintech-App' },
  { title: 'Zily', sub: 'AI fashion discovery', category: 'App Design', image: 'images/projects/zily-ai-fashion-discovery.webp' },
  { title: 'Healthcare landing page', sub: 'Deliver better care', category: 'Web Design', image: 'images/projects/healthcare-landing-page-deliver-better-care.webp' },
  { title: 'Deepvue', sub: 'Financial connectivity', category: 'Web Design', image: 'images/projects/deepvue-financial-connectivity.webp' },
  { title: 'Deepvue.tech', sub: 'Brand identity', category: 'Branding', image: 'images/projects/deepvue-brand-identity.webp' },
  { title: 'Landing page', sub: 'Business website', category: 'Web Design', image: 'images/projects/landing-page-business-website.webp' },
  { title: 'Flyer', sub: 'Dark promotional print', category: 'Graphic Design', image: 'images/projects/flyer-dark-promotional-print.webp' },
  { title: 'SaaS landing page', sub: 'Purple product website', category: 'Web Design', image: 'images/projects/saas-landing-page-purple-product-website.webp' },
  { title: 'Deepvue', sub: 'Partner login', category: 'UI/UX', image: 'images/projects/deepvue-partner-login.webp' },
  { title: 'Deepvue', sub: 'Book an introduction call', category: 'UI/UX', image: 'images/projects/deepvue-book-an-introduction-call.webp' },
  { title: 'Modish Family Salon', sub: 'Website', category: 'Web Design', image: 'images/projects/modish-family-salon-website.webp' },
  { title: 'E-mailer', sub: 'Black and red promotion', category: 'Graphic Design', image: 'images/projects/e-mailer-black-and-red-promotion.webp' },
  { title: 'Deepvue', sub: 'Where fraud meets its match', category: 'Graphic Design', image: 'images/projects/deepvue-where-fraud-meets-its-match.webp' },
  { title: 'Deepvue', sub: 'Unified customer insights platform', category: 'Web Design', image: 'images/projects/deepvue-unified-customer-insights-platform.webp' },
  { title: 'DigiLocker API', sub: 'Social explainer', category: 'Graphic Design', image: 'images/projects/digilocker-api-social-explainer.webp' },
  { title: 'Music landing page', sub: 'Music without limits', category: 'Web Design', image: 'images/projects/music-landing-page-music-without-limits.webp' },
  { title: 'THAL', sub: 'The Fitness Coliseum identity', category: 'Branding', image: 'images/projects/thal-the-fitness-coliseum-identity.webp' },
  { title: 'THAL', sub: 'Gold logo application', category: 'Branding', image: 'images/projects/thal-gold-logo-application.webp' },
  { title: 'CYN:LR', sub: 'Logo animation', category: 'Motion', image: 'images/projects/cyn-lr-logo-animation.webp' },
  { title: 'CYN:LR', sub: 'Brand event teaser', category: 'Motion', image: 'images/projects/cyn-lr-brand-event-teaser.webp' },
  { title: 'CYN:LR', sub: 'Cybernetics H.I.V.E. launch', category: 'Graphic Design', image: 'images/projects/cyn-lr-cybernetics-h-i-v-e-launch.webp' },
  { title: 'Futuristic mobile home screen', sub: 'Orbital interface', category: 'App Design', image: 'images/projects/futuristic-mobile-home-screen-orbital-interface.webp' },
  { title: 'Virtual reality app', sub: 'Immersive worlds', category: 'App Design', image: 'images/projects/virtual-reality-app-immersive-worlds.webp' },
  { title: 'Yoga Book 9i', sub: 'Freedom Sale', category: 'Graphic Design', image: 'images/projects/yoga-book-9i-freedom-sale.webp' },
  { title: 'Document verification', sub: 'DigiLocker API integration', category: 'UI/UX', image: 'images/projects/document-verification-digilocker-api-integration.webp' },
  { title: 'T-shirt design', sub: 'Black apparel', category: 'Graphic Design', image: 'images/projects/t-shirt-design-black-apparel.webp' },
  { title: 'Brand stationery', sub: 'Blue and white touchpoints', category: 'Branding', image: 'images/projects/brand-stationery-blue-and-white-touchpoints.webp' },
  { title: 'Interior design website', sub: 'Spaces with intention', category: 'Web Design', image: 'images/projects/interior-design-website-spaces-with-intention.webp' },
  { title: 'CLEAN Reserve', sub: 'H2EAU collection', category: 'Graphic Design', image: 'images/projects/clean-reserve-h2eau-collection.webp' },
  { title: '2025 Indonesia', sub: 'Re-imagine Innovate Transform', category: 'Graphic Design', image: 'images/projects/2025-indonesia-re-imagine-innovate-transform.webp' },
  { title: 'Krishaa Collections', sub: 'Burgundy and gold identity', category: 'Branding', image: 'images/projects/krishaa-collections-burgundy-and-gold-identity.webp' },
  { title: 'Bakery packaging', sub: 'A sweet unboxing', category: 'Graphic Design', image: 'images/projects/bakery-packaging-a-sweet-unboxing.webp' },
  { title: 'Hydrafacial', sub: 'Skin treatment campaign', category: 'Graphic Design', image: 'images/projects/hydrafacial-skin-treatment-campaign.webp' },
  { title: 'Modish Salon', sub: 'Gold promotional campaign', category: 'Graphic Design', image: 'images/projects/modish-salon-gold-promotional-campaign.webp' },
  { title: 'Raaga', sub: 'Skin consultation day', category: 'Graphic Design', image: 'images/projects/raaga-skin-consultation-day.webp' },
  { title: 'Electric scooter', sub: 'Mobility campaign', category: 'Graphic Design', image: 'images/projects/electric-scooter-mobility-campaign.webp' },
  { title: 'ONBC', sub: 'Event photo collage', category: 'Graphic Design', image: 'images/projects/onbc-event-photo-collage.webp' },
  { title: 'E-mail campaign', sub: 'Long-form marketing', category: 'Graphic Design', image: 'images/projects/e-mail-campaign-long-form-marketing.webp' },
  { title: 'New seasonal release', sub: 'Pistachio campaign', category: 'Graphic Design', image: 'images/projects/new-seasonal-release-pistachio-campaign.webp' },
  { title: 'DualSense', sub: 'Controller product page', category: 'Web Design', image: 'images/projects/dualsense-controller-product-page.webp' },
  { title: 'Modish Family Salon', sub: 'Brand identity', category: 'Branding', image: 'images/projects/modish-family-salon-brand-identity.webp' },
  { title: 'Modish Family Salon', sub: 'Business cards', category: 'Branding', image: 'images/projects/modish-family-salon-business-cards.webp' },
  { title: 'Architectural light study', sub: 'Violet rhythm', category: 'Graphic Design', image: 'images/projects/architectural-light-study-violet-rhythm.webp' },
  { title: 'INVEN', sub: 'Premium welcome kit', category: 'Branding', image: 'images/projects/inven-premium-welcome-kit.webp' },
  { title: '3 G’s', sub: 'Human resources and payroll', category: 'Web Design', image: 'images/projects/3-gs-human-resources-and-payroll.webp' },
  { title: 'Mobile portfolio showcase', sub: 'Responsive collection', category: 'App Design', image: 'images/projects/mobile-portfolio-showcase-responsive-collection.webp' },
  { title: 'Femininity Hair Salon', sub: 'Outdoor advertising', category: 'Graphic Design', image: 'images/projects/femininity-hair-salon-outdoor-advertising.webp' },
];

// How many project cards show before "Show more"; each click adds this many.
export const projectsPerPage = 12;

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
