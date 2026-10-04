import { defineConfig } from 'vite';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));

// Renders the page sections from src/content.js into index.html so the
// content ships as static HTML (good for SEO, no-JS visitors and screen readers).
function staticSections() {
  return {
    name: 'static-sections',
    async transformIndexHtml(html, ctx) {
      const url = new URL('./src/templates.js', import.meta.url);
      // cache-bust in dev so edits to content.js show up on reload
      const mod = ctx.server
        ? await ctx.server.ssrLoadModule('/src/templates.js')
        : await import(url.href);
      const key = (html.match(/data-page="([a-z]+)"/) || [])[1] || 'home';
      const page = mod.renderPage(key);
      const file = key === 'home' ? '' : `${key}.html`;
      return html
        .replace(/<title>[^<]*<\/title>/, `<title>${page.meta.title}</title>`)
        .replace(/(<meta name="description" content=")[^"]*/, `$1${page.meta.description}`)
        .replace(/(<meta property="og:title" content=")[^"]*/, `$1${page.meta.title}`)
        .replace(/(<meta property="og:description" content=")[^"]*/, `$1${page.meta.description}`)
        .replace(/(<link rel="canonical" href="https:\/\/vigneshmurali.com\/)[^"]*/, `$1${file}`)
        .replace(/(<meta property="og:url" content="https:\/\/vigneshmurali.com\/)[^"]*/, `$1${file}`)
        .replace('<!--LOADER_LOGO-->', page.loaderLogo)
        .replace('<!--NAV-->', page.nav)
        .replace('<!--MAIN-->', page.main)
        .replace('<!--FOOTER-->', page.footer);
    },
    handleHotUpdate({ file, server }) {
      if (/src[\\/](content|templates)\.js$/.test(file)) {
        server.ws.send({ type: 'full-reload' });
      }
    },
  };
}

export default defineConfig({
  // relative asset URLs, so the build works from any folder or sub-path
  base: './',
  plugins: [staticSections()],
  build: {
    target: 'es2020',
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 900,
    // one HTML page per nav item; each shell is filled from src/templates.js
    rollupOptions: {
      input: Object.fromEntries(
        ['index', 'about', 'services', 'resume', 'projects', 'contact'].map((n) => [n, resolve(root, `${n}.html`)]),
      ),
    },
  },
});
