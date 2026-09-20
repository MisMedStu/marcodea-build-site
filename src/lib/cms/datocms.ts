/**
 * قراءة المشاريع من DatoCMS وقت البناء.
 * استعلام GraphQL واحد بلا مكتبة إضافية.
 */

import type { Project } from '../projects';

/** عرض الصورة المطلوب — يكفي أكبر بطاقة في المعرض */
const IMAGE_WIDTH = 1600;

const QUERY = `{
  allProjects(orderBy: order_ASC, first: 3) {
    title
    meta
    dims
    image {
      url(imgixParams: { w: ${IMAGE_WIDTH}, auto: format, q: 78, fit: max })
      alt
    }
  }
}`;

interface DatoProject {
  title?: string;
  meta?: string;
  dims?: string;
  image?: { url?: string; alt?: string };
}

export async function getDatoProjects(): Promise<Project[]> {
  const token = import.meta.env.PUBLIC_DATOCMS_TOKEN;

  const response = await fetch('https://graphql.datocms.com/', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: QUERY }),
  });

  if (!response.ok) {
    throw new Error(`DatoCMS ${response.status} ${response.statusText}`);
  }

  const payload = (await response.json()) as {
    data?: { allProjects?: DatoProject[] };
    errors?: { message: string }[];
  };

  if (payload.errors?.length) {
    throw new Error(`DatoCMS: ${payload.errors.map((e) => e.message).join(' · ')}`);
  }

  return (payload.data?.allProjects ?? [])
    .filter((project) => Boolean(project.title))
    .map((project) => ({
      title: project.title ?? '',
      meta: project.meta ?? '',
      dims: project.dims || undefined,
      imageUrl: project.image?.url,
      imageAlt: project.image?.alt || project.title || '',
    }));
}
