/**
 * مصدر مشاريع المعرض.
 *
 * الموقع لا يرتبط بخدمة واحدة: اختر الخدمة التي قَبِلت تسجيلك
 * بوضع اسمها في PUBLIC_CMS_PROVIDER داخل ملف .env، وضع مفتاحها معها.
 *
 * إن لم تُضبط أي خدمة تُقرأ المشاريع من src/data/projects.json،
 * وإن كان فارغًا تظهر البطاقات الفارغة بنمط المخطط الهندسي.
 *
 * تُستدعى وقت البناء فقط — لا طلبات شبكة عند الزائر.
 */

import localProjects from '../data/projects.json';

export interface Project {
  /** اسم المشروع كما يظهر على البطاقة */
  title: string;
  /** سطر الوصف: النوع · المساحة */
  meta: string;
  /** المقاس المعروض في الزاوية، مثل: 20 × 15 m */
  dims?: string;
  /** وصف الصورة لقارئات الشاشة */
  imageAlt: string;
  /** رابط الصورة من الخدمة المختارة */
  imageUrl?: string;
}

export type CmsProvider = 'none' | 'storyblok' | 'datocms' | 'sanity';

function currentProvider(): CmsProvider {
  const provider = (import.meta.env.PUBLIC_CMS_PROVIDER ?? '').trim().toLowerCase();

  if (provider === 'storyblok' || provider === 'datocms' || provider === 'sanity') {
    return provider;
  }
  return 'none';
}

async function fetchFromProvider(provider: Exclude<CmsProvider, 'none'>): Promise<Project[]> {
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

  if (provider === 'none') {
    return localProjects as Project[];
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
