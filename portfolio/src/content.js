/*
 * All site copy lives here, taken from the Figma design
 * (figma.com/design/T9UpObjYsMdFXsJrQvGjRY, page "Portfolio").
 * Edit this file to change words or links; the layout reads everything from it.
 */

export const site = {
  name: 'Vignesh',
  fullName: 'Vignesh Murali',
  role: 'Product Designer',
  greeting: 'Hello!',
  quote: 'You are one step away from bringing your visual to live!',
  experienceYears: 4,
  bio: 'I’m a multidisciplinary designer focused on UI/UX, product, motion, and branding. I craft clean, user-driven designs that balance form and function. This portfolio highlights my process, range, and visual clarity.',
  email: 'vigneshmurali2107@gmail.com',
  phone: '+91 9025934557',
  website: 'vigneshmurali.com',
  location: 'Bangalore, India',
  timezone: 'Asia/Kolkata',
  behance: 'https://www.behance.net/vigneshwaranmurali',
  // The Figma file has a Dribbble card but no Dribbble link. Add the URL here
  // and the card appears automatically.
  dribbble: null,
  // Add a CV at public/cv.pdf and set this to 'cv.pdf' to show the Download CV button.
  resume: null,
  portrait: 'images/portrait.png',
  portraitAlt: 'Vignesh, sitting on a wooden chair with his arms folded, in a black knit sweater',
  portraitSmile: 'images/portrait-smile.png',
  portraitSmileAlt: 'Vignesh smiling, in a black shirt',
};

// Order matches the Figma nav: three links, the logo, three links.
// Each nav item is its own page. Order matches the Figma nav: three links,
// the logo, three links.
export const nav = [
  { page: 'home', href: './', label: 'Home' },
  { page: 'about', href: 'about.html', label: 'About' },
  { page: 'services', href: 'services.html', label: 'Service' },
  { page: 'resume', href: 'resume.html', label: 'Resume' },
  { page: 'projects', href: 'projects.html', label: 'Project' },
  { page: 'contact', href: 'contact.html', label: 'Contact' },
];

// Per-page titles and descriptions for the <head>.
export const pages = {
  home: { title: 'Vignesh | Product Designer', description: 'Vignesh is a multidisciplinary product designer in Bangalore working across UI/UX, product, motion and branding.' },
  about: { title: 'About | Vignesh', description: 'About Vignesh Murali, UI/UX and graphic designer: skills, toolkit and design process.' },
  services: { title: 'Services | Vignesh', description: 'UI/UX, product, graphic, motion, branding, print, video, app and social media design.' },
  resume: { title: 'Resume | Vignesh', description: 'Work experience, skills and tools of designer Vignesh Murali.' },
  projects: { title: 'Projects | Vignesh', description: 'Selected projects by Vignesh: apps, landing pages, branding, motion and campaigns.' },
  contact: { title: 'Contact | Vignesh', description: 'Start a project with Vignesh. Email, phone and availability.' },
};

export const tools = [
  { name: 'Figma', src: 'images/tools/figma.png' },
  { name: 'Adobe Photoshop', src: 'images/tools/photoshop.png' },
  { name: 'Adobe Premiere Pro', src: 'images/tools/premiere.png' },
  { name: 'Adobe Illustrator', src: 'images/tools/illustrator.png' },
  { name: 'Framer', src: 'images/tools/framer.png' },
  { name: 'Webflow', src: 'images/tools/webflow.png' },
  { name: 'Adobe XD', src: 'images/tools/xd.png' },
  { name: 'Adobe After Effects', src: 'images/tools/aftereffects.png' },
];

export const servicesIntro = {
  title: ['My', 'Services'],
  body: 'Designing products, brands, and visuals that deliver real results. From dashboards to motion, I shape ideas into experience.',
};

export const services = [
  { title: 'UI/UX Design', project: 'Landing Page — SaaS', image: 'images/work/ui-ux.png', href: 'https://www.behance.net/gallery/230687789/Landing-Page-SaaS' },
  { title: 'Product Design', project: 'Dashboard Revamp — Deepvue', image: 'images/work/product.png', href: 'https://www.behance.net/gallery/226234661/Dashboard-Revamp' },
  { title: 'Graphic Design', project: 'Flyer Automation — Brand', image: 'images/work/graphic.png', href: 'https://www.behance.net/gallery/230710601/Flyer-Automation-Brand' },
  { title: 'Motion Graphics', project: 'Motion Graphics', image: 'images/work/motion.png', href: 'https://www.behance.net/gallery/230749799/Motion-Graphics' },
  { title: 'Branding', project: 'Branding for a Fintech Service', image: 'images/work/branding.png', href: 'https://www.behance.net/gallery/218921809/Branding-for-a-Fintech-Service' },
  { title: 'Print Design', project: 'Merchandise', image: 'images/work/print.png', href: 'https://www.behance.net/gallery/230692137/Merchandise' },
  { title: 'Video Editing', project: 'Logo Animation', image: 'images/work/video.png', href: 'https://www.behance.net/gallery/206932523/Logo-Animation' },
  { title: 'App Design', project: 'AI-assisted Fintech App', image: 'images/work/app.png', href: 'https://www.behance.net/gallery/231811507/AI-assisted-Fintech-App' },
  { title: 'Social Media', project: 'Social Media Posts', image: 'images/work/social.png', href: 'https://www.behance.net/gallery/206932249/Social-Media-Post' },
];

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

export const portfolio = {
  title: ['Let’s have a look at my', 'Portfolio'],
  tags: ['Landing Page', 'Product Design', 'Animation', 'Glassmorphism', 'Cards'],
  featured: {
    title: 'Deepvue — SaaS Dashboard Revamp',
    body: 'At Deepvue.ai, I led the end-to-end redesign of the analytics dashboard, enhancing both UI clarity and UX flow. The updated experience made complex fintech data more intuitive, interactive, and accessible to users.',
    image: 'images/work/product.png',
    href: 'https://www.behance.net/gallery/226234661/Dashboard-Revamp',
  },
};

export const marquee = ['UX Design', 'Graphic Design', 'Dashboard', 'Wireframe', 'User Research'];

export const cta = {
  title: ['Have an Awesome Project Idea?', 'Let’s Discuss'],
  placeholder: 'Enter Email Address',
  button: 'Send',
};

export const footer = {
  title: 'Let’s Connect there',
  button: 'Hire me',
};

/* ---------------------------------------------------------------------------
 * Added from the second Figma pass (About frame 1:15698, skill rings
 * 1:13666 / 1:13717, process diagram 1:15730, project cards 1:14144-1:14246,
 * testimonial layout 1:13773).
 * ------------------------------------------------------------------------ */

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

export const toolSkills = [
  { name: 'Figma', value: 100, src: 'images/tools/figma.png' },
  { name: 'Adobe Illustrator', value: 90, src: 'images/tools/illustrator.png' },
  { name: 'Adobe Photoshop', value: 90, src: 'images/tools/photoshop.png' },
  { name: 'Framer', value: 85, src: 'images/tools/framer.png' },
  { name: 'Adobe After Effects', value: 75, src: 'images/tools/aftereffects.png' },
  { name: 'Adobe InDesign', value: 100, src: 'images/tools/indesign.png' },
  { name: 'Adobe Lightroom', value: 90, src: 'images/tools/lightroom.png' },
  { name: 'Adobe XD', value: 90, src: 'images/tools/xd.png' },
  { name: 'Webflow', value: 85, src: 'images/tools/webflow.png' },
  { name: 'Adobe Premiere Pro', value: 75, src: 'images/tools/premiere.png' },
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
  title: ['Testimonials That Speak to', 'My Results'],
  body: 'A few words from the founders, marketers and product teams I’ve designed with.',
};

// Clients and the people quoted. The names and brands are real; the quote
// wording is a DRAFT written for the site. While `testimonialsAreSamples` is
// true, the section shows a visible "draft" label. Replace each quote with
// the client's own words (and their permission), then set it to false.
export const testimonialsAreSamples = true;

// Brands shown in the "worked with" strip.
export const brands = ['Deepvue', 'RetainIQ', 'DigiPro', 'Modish', 'Salesmax'];

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
