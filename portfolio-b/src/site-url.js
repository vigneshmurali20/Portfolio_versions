// The site's public address, used for canonical links, Open Graph, JSON-LD,
// the sitemap, robots.txt and llms.txt. Set SITE_URL in the build
// environment (e.g. https://vigneshmurali.com) once the custom domain is
// live; until then the Vercel address is the one Search Console verifies.
export const SITE_URL = (process.env.SITE_URL || 'https://portfolioversions-portfolio-b.vercel.app').replace(/\/+$/, '');

// Placeholder used in index.html, writing/index.html and the static files in
// public/; vite.config.js swaps it for SITE_URL at build time.
export const SITE_URL_TOKEN = '__SITE_URL__';
