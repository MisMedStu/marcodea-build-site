// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// النطاق والمسار الأساسي قابلان للتغيير وقت البناء:
// على النطاق النهائي يبقيان كما هنا، وفي الاستضافة المجانية تحت مسار
// فرعي يضبطهما سير النشر في .github/workflows/deploy.yml
const SITE_URL = process.env.SITE_URL || 'https://marcodeabuild.ly';
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
