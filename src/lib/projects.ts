/**
 * مصدر مشاريع المعرض.
 *
 * الترتيب: إذا ضُبطت بيانات Sanity تُقرأ المشاريع منها،
 * وإلا تُقرأ من src/data/projects.json، وإن كان فارغًا
 * تظهر البطاقات الفارغة بنمط المخطط الهندسي.
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
  /** رابط الصورة (من Sanity) */
  imageUrl?: string;
}

function isSanityConfigured(): boolean {
  return Boolean(import.meta.env.PUBLIC_SANITY_PROJECT_ID);
}

export async function getProjects(): Promise<Project[]> {
  if (isSanityConfigured()) {
    const { getSanityProjects } = await import('./sanity');
    return getSanityProjects();
  }

  return localProjects as Project[];
}
