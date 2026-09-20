/**
 * قراءة المشاريع من Sanity وقت البناء.
 * استعلام GROQ عبر fetch مباشرة بلا مكتبة إضافية.
 */

import type { Project } from '../projects';

const API_VERSION = '2024-01-01';

/** عرض الصورة المطلوب — يكفي أكبر بطاقة في المعرض */
const IMAGE_WIDTH = 1600;

const QUERY = `*[_type == "project" && !(_id in path("drafts.**"))]
  | order(coalesce(order, 999) asc, _createdAt desc)[0...3]{
    "title": title,
    "meta": meta,
    "dims": dims,
    "imageUrl": image.asset->url,
    "imageAlt": coalesce(image.alt, title)
  }`;

export async function getSanityProjects(): Promise<Project[]> {
  const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
  const dataset = import.meta.env.PUBLIC_SANITY_DATASET || 'production';

  const url =
    `https://${projectId}.apicdn.sanity.io/v${API_VERSION}/data/query/${dataset}` +
    `?query=${encodeURIComponent(QUERY)}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Sanity ${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as { result?: Project[] };

  return (data.result ?? [])
    .filter((project) => Boolean(project.title))
    .map((project) => ({
      ...project,
      imageUrl: project.imageUrl
        ? `${project.imageUrl}?w=${IMAGE_WIDTH}&auto=format&fit=max&q=78`
        : undefined,
      imageAlt: project.imageAlt || project.title,
    }));
}
