// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://marcodeabuild.ly',
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  build: { inlineStylesheets: 'auto' },
  vite: {
    plugins: [tailwindcss()],
  },
});
