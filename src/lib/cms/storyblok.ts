/**
 * قراءة المشاريع من Storyblok وقت البناء.
 * REST مباشر بلا مكتبة إضافية.
 */

import type { Project } from '../projects';

/** عرض الصورة المطلوب — يكفي أكبر بطاقة في المعرض */
const IMAGE_WIDTH = 1600;

interface StoryblokStory {
  content?: {
    title?: string;
    meta?: string;
    dims?: string;
    image?: { filename?: string; alt?: string };
  };
}

/** خدمة صور Storyblok: تُلحَق المقاسات بمسار الملف */
function imageUrl(filename: string): string {
  return `${filename}/m/${IMAGE_WIDTH}x0/filters:quality(80)`;
}

export async function getStoryblokProjects(): Promise<Project[]> {
  const token = import.meta.env.PUBLIC_STORYBLOK_TOKEN;

  const url =
    'https://api.storyblok.com/v2/cdn/stories' +
    `?token=${token}&starts_with=projects/&version=published` +
    '&sort_by=content.order:asc&per_page=3';

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Storyblok ${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as { stories?: StoryblokStory[] };

  return (data.stories ?? [])
    .map((story) => story.content)
    .filter((content): content is NonNullable<typeof content> => Boolean(content?.title))
    .map((content) => ({
      title: content.title ?? '',
      meta: content.meta ?? '',
      dims: content.dims || undefined,
      imageUrl: content.image?.filename ? imageUrl(content.image.filename) : undefined,
      imageAlt: content.image?.alt || content.title || '',
    }));
}
