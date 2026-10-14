import { fileURLToPath } from 'node:url';
import { defineConfig, loadEnv } from 'vite';

// Renders the page from src/content.js into index.html at build time, so the
// content ships as static HTML (good for SEO, no-JS visitors and screen readers).
function staticPage(env, mode) {
  return {
    name: 'static-page',
    async transformIndexHtml(html, ctx) {
      const mod = ctx.server
        ? await ctx.server.ssrLoadModule('/src/templates.js')
        : await import(new URL('./src/templates.js', import.meta.url).href);
      if (/writing[\\/]index\.html$/.test(ctx.filename) || ctx.path.startsWith('/writing')) {
        const w = mod.renderWritingPage();
        return html
          .replace(/<title>[^<]*<\/title>/, `<title>${w.title}</title>`)
          .replace(/(<meta name="description" content=")[^"]*/, `$1${w.description}`)
          .replace(/(<meta property="og:title" content=")[^"]*/, `$1${w.title}`)
          .replace(/(<meta property="og:description" content=")[^"]*/, `$1${w.description}`)
          .replace(/(<meta name="twitter:title" content=")[^"]*/, `$1${w.title}`)
          .replace(/(<meta name="twitter:description" content=")[^"]*/, `$1${w.description}`)
          .replace('<!--WRITING_JSONLD-->', `<script type="application/ld+json">${w.jsonld}</script>`)
          .replace('<!--WRITING_BODY-->', w.body);
      }
      const page = mod.renderPage();
      const verificationToken = env.VITE_GOOGLE_SITE_VERIFICATION || '';
      if (verificationToken && !/^[A-Za-z0-9_-]+$/.test(verificationToken)) {
        throw new Error('VITE_GOOGLE_SITE_VERIFICATION contains unsupported characters.');
      }
      const verification = verificationToken
        ? `<meta name="google-site-verification" content="${verificationToken}" />`
        : '';
      return html
        .replace('<!--GOOGLE_SITE_VERIFICATION-->', verification)
        .replace(/<title>[^<]*<\/title>/, `<title>${page.meta.title}</title>`)
        .replace(/(<meta name="description" content=")[^"]*/, `$1${page.meta.description}`)
        .replace(/(<meta property="og:title" content=")[^"]*/, `$1${page.meta.title}`)
        .replace(/(<meta property="og:description" content=")[^"]*/, `$1${page.meta.description}`)
        .replace(/(<meta name="twitter:title" content=")[^"]*/, `$1${page.meta.title}`)
        .replace(/(<meta name="twitter:description" content=")[^"]*/, `$1${page.meta.description}`)
        .replace('<!--LOADER-->', page.loader)
        .replace('<!--NAV-->', page.nav)
        .replace('<!--MAIN-->', page.main)
        .replace('<!--FOOTER-->', page.footer);
    },
    handleHotUpdate({ file, server }) {
      if (/src[\\/](content|templates)\.js$/.test(file)) server.ws.send({ type: 'full-reload' });
    },
  };
}

export default defineConfig(({ mode }) => ({
  // relative asset URLs, so the build works from any folder or sub-path
  base: './',
  plugins: [staticPage(loadEnv(mode, process.cwd(), ''), mode)],
  build: {
    target: 'es2020',
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 900,
    rolldownOptions: {
      // second page: /writing/ (posts and articles, for search and AI answers)
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        writing: fileURLToPath(new URL('./writing/index.html', import.meta.url)),
      },
      output: {
        codeSplitting: {
          groups: [
            { name: 'three-vendor', test: /node_modules[\\/]three[\\/]/, priority: 15 },
            { name: 'vendor', test: /node_modules[\\/](?!@fontsource)/, priority: 5 },
          ],
        },
      },
    },
  },
}));
