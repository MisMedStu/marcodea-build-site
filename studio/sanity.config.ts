import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { project } from './schemas/project';

/**
 * لوحة تحكم ماركوديا بيلد.
 * ضع معرّف المشروع في studio/.env ثم شغّل:  npm run dev
 */
export default defineConfig({
  name: 'marcodea-build',
  title: 'ماركوديا بيلد — لوحة التحكم',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? '',
  dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',

  plugins: [structureTool()],

  schema: {
    types: [project],
  },
});
