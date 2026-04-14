import { defineConfig } from 'vite';
import { resolve } from 'path';

const supportedLanguages = ['ru', 'en', 'de', 'uk', 'zh'];
const supportedLanguagesPattern = supportedLanguages.join('|');

function rewriteLocalizedRoute(url: string): string | null {
  const pathname = url.split('?')[0];

  if (new RegExp(`^/(?:${supportedLanguagesPattern})/?$`, 'i').test(pathname)) {
    return '/index.html';
  }

  if (new RegExp(`^/blog/(?:${supportedLanguagesPattern})/?$`, 'i').test(pathname)) {
    return '/blog.html';
  }

  if (new RegExp(`^/faq/(?:${supportedLanguagesPattern})/?$`, 'i').test(pathname)) {
    return '/faq.html';
  }

  if (new RegExp(`^/blog/(?:${supportedLanguagesPattern})/[^/]+/?$`, 'i').test(pathname)) {
    return '/blog-post.html';
  }

  return null;
}

export default defineConfig({
  plugins: [
    {
      name: 'localized-dev-routes',
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          if (!req.url || req.method !== 'GET') {
            next();
            return;
          }

          const rewrittenPath = rewriteLocalizedRoute(req.url);
          if (rewrittenPath) {
            const query = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
            req.url = `${rewrittenPath}${query}`;
          }

          next();
        });
      },
    },
  ],
  server: {
    port: 3000,
  },
  build: {
    target: 'es2020',
    cssMinify: true,
    modulePreload: {
      polyfill: false,
    },
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        blog: resolve(__dirname, 'blog.html'),
        blogPost: resolve(__dirname, 'blog-post.html'),
        faq: resolve(__dirname, 'faq.html'),
        admin: resolve(__dirname, 'admin.html'),
      },
      output: {
        manualChunks: {
          supabase: ['@supabase/supabase-js'],
        },
      },
    },
  },
});
