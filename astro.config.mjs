// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://marcodeabuild.ly',
  trailingSlash: 'ignore',
  build: { inlineStylesheets: 'auto' },
  image: {
    // صور Sanity تُجلب وقت البناء وتُحسَّن محليًا
    domains: ['cdn.sanity.io'],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
