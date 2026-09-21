// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// العنوان والمسار الأساسي يضبطهما سير النشر وقت البناء من إعدادات
// GitHub Pages، فيعمل الموقع على أي عنوان بلا تعديل هنا
const SITE_URL = process.env.SITE_URL || 'https://marcodeabuild.github.io';
const BASE_PATH = process.env.BASE_PATH || '/';

export default defineConfig({
  site: SITE_URL,
  base: BASE_PATH,
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  build: { inlineStylesheets: 'auto' },
  vite: {
    plugins: [tailwindcss()],
  },
});
