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
  // The Figma file has no Dribbble link. Add the URL here to show it.
  dribbble: null,
  // Add a CV at public/cv.pdf and set this to 'cv.pdf' to show a Download CV link.
  resume: null,
  // Head-and-shoulders crop of images/portrait.png, for the hero.
  portrait: 'images/portrait-hero.png',
  portraitAlt: 'Vignesh with his arms folded, in a black knit sweater',
  portraitSmile: 'images/portrait-smile.png',
  portraitSmileAlt: 'Vignesh smiling, in a black shirt',
  showreel: 'showreel.mp4',
  showreelPoster: 'images/showreel-poster.jpg',
};

export const meta = {
  title: 'Vignesh Murali | Product, UI/UX, Motion & Graphic Designer',
  description:
    'Vignesh Murali is a product designer in Bangalore working across UI/UX, product, motion graphics, graphic design and branding.',
};

// One page, so the nav links jump to sections.
export const nav = [
  { href: '#work', label: 'Work' },
  { href: '#disciplines', label: 'Disciplines' },
  { href: '#toolbox', label: 'Toolbox' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
];

export const hero = {
  lines: ['Designing clear products', 'for brands that move.'],
  body: 'I’m Vignesh, a product designer in Bangalore. I shape interfaces, motion and brand visuals that feel calm, considered and easy to use.',
  badge: 'PRODUCT DESIGNER · OPEN TO WORK · BANGALORE · ',
  notes: [
    { icon: 'wave', title: ['Interfaces that', 'make sense.'], body: 'UI/UX and product design for SaaS and fintech.' },
    { icon: 'tools', title: ['Ideas that', 'actually move.'], body: 'Motion, brand and campaign visuals.' },
  ],
  trust: ['Deepvue', 'RetainIQ', 'DigiPro'],
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
  title: ['Four crafts,', 'one calm language.'],
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
];

export const toolboxIntro = {
  eyebrow: 'Toolbox',
  title: ['My toolbox.', 'Go on, play with it.'],
  body: 'Grab a tool, throw it around, then drop it in the slot to see what I use it for.',
};

// The playground tools. `value` is the proficiency from the Figma skill rings.
export const tools = [
  { key: 'figma', name: 'Figma', value: 100, src: 'images/tools/figma.png', use: 'UI/UX, design systems and clickable prototypes.', disciplines: ['uiux', 'product'] },
  { key: 'illustrator', name: 'Adobe Illustrator', value: 90, src: 'images/tools/illustrator.png', use: 'Logos, brand marks and vector illustration.', disciplines: ['graphic'] },
  { key: 'photoshop', name: 'Adobe Photoshop', value: 90, src: 'images/tools/photoshop.png', use: 'Campaign key visuals, compositing and retouching.', disciplines: ['graphic'] },
  { key: 'aftereffects', name: 'Adobe After Effects', value: 75, src: 'images/tools/aftereffects.png', use: 'Logo animation, explainers and UI motion.', disciplines: ['motion'] },
  { key: 'framer', name: 'Framer', value: 85, src: 'images/tools/framer.png', use: 'Interactive prototypes and live marketing sites.', disciplines: ['uiux', 'motion'] },
  { key: 'premiere', name: 'Adobe Premiere Pro', value: 75, src: 'images/tools/premiere.png', use: 'Video editing, reels and promos.', disciplines: ['motion'] },
  { key: 'indesign', name: 'Adobe InDesign', value: 100, src: 'images/tools/indesign.png', use: 'Brochures, print layouts and decks.', disciplines: ['graphic'] },
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
    period: 'Sep 2024 to Present',
    role: 'Graphic Designer and UI/UX',
    skills: 'Product Design, UI/UX Design, Web Design, Visual Design, Motion Graphics, Video Editing, Logo Design, Email Design, Printable Design (e.g. brochures, flyers), Infographics & Blog Graphics, Landing Page Design, Campaign Creatives, Social Media Post Design, Branding & Identity, Product Release Notes Design.',
  },
  {
    company: 'Freelance, Bangalore',
    period: 'Jun 2023 to Aug 2025',
    role: 'Lead Designer and UI/UX',
    skills: 'Wireframes, High-Fidelity Prototypes, Booking Flows, Responsive Design, Design Systems, Interaction Design, Website Redesigns, Experience Optimization, Motion Graphics, Video Editing, Logo Design, Email Design, Printable Design (e.g. brochures, flyers), Infographics & Blog Graphics, Landing Page Design, Campaign Creatives, Social Media Post Design, Branding & Identity, Offer Collaterals, Product Launch & Seasonal Campaign Design.',
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

// SAMPLE QUOTES. These people are invented, written as placeholders at the
// owner's request. While `testimonialsAreSamples` is true the section shows a
// visible "sample" label. Replace them with real client quotes (with the
// client's permission), then set it to false.
export const testimonialsAreSamples = true;
export const testimonials = [
  {
    name: 'Arjun Mehta',
    role: 'Founder, fintech startup',
    rating: 5,
    quote: 'Vignesh took our cluttered analytics dashboard and turned it into something our users actually enjoy opening. He asked the right questions early, and every screen he handed over was ready to build.',
  },
  {
    name: 'Priya Raman',
    role: 'Marketing Lead, D2C skincare brand',
    rating: 5,
    quote: 'Our campaign creatives went from a two-week scramble to a calm, reliable pipeline. Banners, emails and social posts all felt like one brand for the first time.',
  },
  {
    name: 'Daniel Brooks',
    role: 'Product Manager, B2B SaaS company',
    rating: 5,
    quote: 'Working across time zones was never an issue. Clickable prototypes landed in my inbox each morning, and our usability tests ran smoother because of them.',
  },
  {
    name: 'Sneha Kulkarni',
    role: 'Brand Strategist, creative agency',
    rating: 5,
    quote: 'He has a rare mix of systems thinking and visual taste. The identity he built for our client came with a guideline doc the whole team still uses.',
  },
  {
    name: 'Rahul Verma',
    role: 'Co-founder, EV mobility startup',
    rating: 5,
    quote: 'The launch teaser and social series he designed doubled our engagement in the first month. Fast, thoughtful and genuinely fun to work with.',
  },
];

export const contact = {
  title: ['Let’s make something', 'clear.'],
  body: 'Tell me about the product, the brand or the launch. I usually reply within a day.',
};
