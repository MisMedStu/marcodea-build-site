import type { APIRoute } from 'astro';
import { isProductionSite } from '../lib/env';
import { absoluteUrl } from '../lib/url';
import { site } from '../data/site';

/** على النطاق النهائي: يُسمح بالفهرسة. في أي نسخة أخرى: يُمنع. */
export const GET: APIRoute = ({ site: siteUrl }) => {
  const body = isProductionSite(siteUrl)
    ? `User-agent: *\nAllow: /\n\nSitemap: ${absoluteUrl('sitemap-index.xml', siteUrl, site.url)}\n`
    : 'User-agent: *\nDisallow: /\n';

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
