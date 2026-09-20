/**
 * قراءة المشاريع من Sanity وقت البناء.
 *
 * بلا مكتبة إضافية: استعلام GROQ عبر fetch مباشرة.
 * الصور تُخدَم من شبكة Sanity مع auto=format فتصل بصيغة WebP أو AVIF
 * حسب متصفح الزائر.
 *
 * إن تعذّر الوصول إلى Sanity لا يفشل البناء — يُكتب تحذير وتظهر
 * البطاقات الفارغة، حتى لا ينهار نشر الموقع بسبب خدمة خارجية.
 */

import type { Project } from './projects';

const API_VERSION = '2024-01-01';

const QUERY = `*[_type == "project" && !(_id in path("drafts.**"))]
  | order(coalesce(order, 999) asc, _createdAt desc)[0...3]{
    "title": title,
    "meta": meta,
    "dims": dims,
    "imageUrl": image.asset->url,
    "imageAlt": coalesce(image.alt, title)
  }`;

/** عرض الصورة المطلوب من شبكة Sanity — يكفي أكبر بطاقة في المعرض */
const IMAGE_WIDTH = 1200;

interface SanityResponse {
  result?: Project[];
}

export async function getSanityProjects(): Promise<Project[]> {
  const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
  const dataset = import.meta.env.PUBLIC_SANITY_DATASET || 'production';

  const url =
    `https://${projectId}.apicdn.sanity.io/v${API_VERSION}/data/query/${dataset}` +
    `?query=${encodeURIComponent(QUERY)}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`[sanity] تعذّر جلب المشاريع: ${response.status} ${response.statusText}`);
      return [];
    }

    const data = (await response.json()) as SanityResponse;
    const projects = data.result ?? [];

    return projects.map((project) => ({
      ...project,
      imageUrl: project.imageUrl
        ? `${project.imageUrl}?w=${IMAGE_WIDTH}&auto=format&fit=max&q=78`
        : undefined,
      imageAlt: project.imageAlt ?? project.title,
    }));
  } catch (error) {
    console.warn('[sanity] تعذّر الاتصال بـ Sanity، ستظهر البطاقات الفارغة:', error);
    return [];
  }
}
