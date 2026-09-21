/**
 * مصدر مشاريع المعرض.
 *
 * الوضع الافتراضي: المشاريع محفوظة داخل المستودع نفسه
 * (src/data/projects/*.json وصورها في src/assets/projects/)،
 * وتُحرَّر من لوحة التحكم بحساب GitHub — بلا خدمة خارجية
 * وبلا حساب جديد، والصور تمرّ على تحسين الصور في Astro.
 *
 * وإن أراد صاحب الموقع لاحقًا خدمة محتوى مستضافة، يكفي وضع
 * اسمها في PUBLIC_CMS_PROVIDER: storyblok أو datocms أو sanity.
 *
 * تُستدعى وقت البناء فقط — لا طلبات شبكة عند الزائر.
 */

import type { ImageMetadata } from 'astro';
import { getLocalProjects } from './local-projects';

export interface Project {
  /** اسم المشروع كما يظهر على البطاقة */
  title: string;
  /** سطر الوصف: النوع · المساحة */
  meta: string;
  /** المقاس المعروض في الزاوية، مثل: 20 × 15 m */
  dims?: string;
  /** وصف الصورة لقارئات الشاشة */
  imageAlt: string;
  /** صورة من داخل المستودع — تُحسَّن وقت البناء */
  image?: ImageMetadata;
  /** رابط صورة من خدمة خارجية */
  imageUrl?: string;
}

export type CmsProvider = 'repo' | 'storyblok' | 'datocms' | 'sanity';

function currentProvider(): CmsProvider {
  const provider = (import.meta.env.PUBLIC_CMS_PROVIDER ?? '').trim().toLowerCase();

  if (provider === 'storyblok' || provider === 'datocms' || provider === 'sanity') {
    return provider;
  }
  return 'repo';
}

async function fetchFromProvider(provider: Exclude<CmsProvider, 'repo'>): Promise<Project[]> {
  if (provider === 'storyblok') {
    const { getStoryblokProjects } = await import('./cms/storyblok');
    return getStoryblokProjects();
  }
  if (provider === 'datocms') {
    const { getDatoProjects } = await import('./cms/datocms');
    return getDatoProjects();
  }
  const { getSanityProjects } = await import('./cms/sanity');
  return getSanityProjects();
}

export async function getProjects(): Promise<Project[]> {
  const provider = currentProvider();

  if (provider === 'repo') {
    return getLocalProjects();
  }

  try {
    return await fetchFromProvider(provider);
  } catch (error) {
    // خدمة خارجية متعطّلة يجب ألا تُسقط نشر الموقع
    console.warn(
      `[cms] تعذّر جلب المشاريع من ${provider}، ستظهر البطاقات الفارغة:`,
      error instanceof Error ? error.message : error
    );
    return [];
  }
}
