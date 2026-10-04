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
  portrait: '/images/portrait.png',
  portraitAlt: 'Vignesh, sitting on a wooden chair with his arms folded, in a black knit sweater',
  portraitSmile: '/images/portrait-smile.png',
  portraitSmileAlt: 'Vignesh smiling, in a black shirt',
};

// Order matches the Figma nav: three links, the logo, three links.
export const nav = [
  { id: 'top', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Service' },
  { id: 'experience', label: 'Resume' },
  { id: 'portfolio', label: 'Project' },
  { id: 'contact', label: 'Contact' },
];

export const tools = [
  { name: 'Figma', src: '/images/tools/figma.png' },
  { name: 'Adobe Photoshop', src: '/images/tools/photoshop.png' },
  { name: 'Adobe Premiere Pro', src: '/images/tools/premiere.png' },
  { name: 'Adobe Illustrator', src: '/images/tools/illustrator.png' },
  { name: 'Framer', src: '/images/tools/framer.png' },
  { name: 'Webflow', src: '/images/tools/webflow.png' },
  { name: 'Adobe XD', src: '/images/tools/xd.png' },
  { name: 'Adobe After Effects', src: '/images/tools/aftereffects.png' },
];

export const servicesIntro = {
  title: ['My', 'Services'],
  body: 'Designing products, brands, and visuals that deliver real results. From dashboards to motion, I shape ideas into experience.',
};

export const services = [
  { title: 'UI/UX Design', project: 'Landing Page — SaaS', image: '/images/work/ui-ux.png', href: 'https://www.behance.net/gallery/230687789/Landing-Page-SaaS' },
  { title: 'Product Design', project: 'Dashboard Revamp — Deepvue', image: '/images/work/product.png', href: 'https://www.behance.net/gallery/226234661/Dashboard-Revamp' },
  { title: 'Graphic Design', project: 'Flyer Automation — Brand', image: '/images/work/graphic.png', href: 'https://www.behance.net/gallery/230710601/Flyer-Automation-Brand' },
  { title: 'Motion Graphics', project: 'Motion Graphics', image: '/images/work/motion.png', href: 'https://www.behance.net/gallery/230749799/Motion-Graphics' },
  { title: 'Branding', project: 'Branding for a Fintech Service', image: '/images/work/branding.png', href: 'https://www.behance.net/gallery/218921809/Branding-for-a-Fintech-Service' },
  { title: 'Print Design', project: 'Merchandise', image: '/images/work/print.png', href: 'https://www.behance.net/gallery/230692137/Merchandise' },
  { title: 'Video Editing', project: 'Logo Animation', image: '/images/work/video.png', href: 'https://www.behance.net/gallery/206932523/Logo-Animation' },
  { title: 'App Design', project: 'AI-assisted Fintech App', image: '/images/work/app.png', href: 'https://www.behance.net/gallery/231811507/AI-assisted-Fintech-App' },
  { title: 'Social Media', project: 'Social Media Posts', image: '/images/work/social.png', href: 'https://www.behance.net/gallery/206932249/Social-Media-Post' },
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

export const portfolio = {
  title: ['Let’s have a look at my', 'Portfolio'],
  tags: ['Landing Page', 'Product Design', 'Animation', 'Glassmorphism', 'Cards'],
  featured: {
    title: 'Deepvue — SaaS Dashboard Revamp',
    body: 'At Deepvue.ai, I led the end-to-end redesign of the analytics dashboard, enhancing both UI clarity and UX flow. The updated experience made complex fintech data more intuitive, interactive, and accessible to users.',
    image: '/images/work/product.png',
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
