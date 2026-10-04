import { defineConfig } from 'vite';

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
      const page = mod.renderPage();
      return html
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
  plugins: [staticSections()],
  build: {
    target: 'es2020',
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 900,
  },
});
