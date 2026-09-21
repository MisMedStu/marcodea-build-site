/**
 * مشاريع المعرض المحفوظة داخل المستودع.
 *
 * البيانات في src/data/projects.json والصور في src/assets/projects/.
 * لوحة التحكم (Pages CMS) تكتب الاثنين بحساب GitHub، والصور تمرّ
 * على تحسين الصور في Astro كبقية صور الموقع.
 *
 * الترتيب هو ترتيب المشاريع في الملف — تُرتَّب بالسحب في اللوحة.
 */

import type { ImageMetadata } from 'astro';
import type { Project } from './projects';
import data from '../data/projects.json';

interface ProjectEntry {
  title?: string;
  meta?: string;
  dims?: string;
  /** المسار كما تكتبه لوحة التحكم، مثل /projects/villa.jpg */
  image?: string;
  imageAlt?: string;
}

const images = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/projects/*.{jpg,jpeg,png,webp,avif}',
  { eager: true }
);

/** يربط المسار المكتوب في الملف بالصورة الفعلية داخل المستودع */
function findImage(path: string | undefined): ImageMetadata | undefined {
  if (!path) return undefined;

  const name = path.split('/').pop();
  if (!name) return undefined;

  const match = Object.entries(images).find(([key]) => key.endsWith(`/${name}`));
  return match?.[1].default;
}

export function getLocalProjects(): Project[] {
  const entries = (data as { projects?: ProjectEntry[] }).projects ?? [];

  return entries
    .filter((entry): entry is ProjectEntry & { title: string } => Boolean(entry?.title))
    .map((entry) => ({
      title: entry.title,
      meta: entry.meta ?? '',
      dims: entry.dims || undefined,
      image: findImage(entry.image),
      imageAlt: entry.imageAlt || entry.title,
    }));
}
