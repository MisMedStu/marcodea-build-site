/**
 * هل هذه نسخة النطاق النهائي؟
 * أي نشر على عنوان آخر (استضافة مؤقتة، معاينة) يُخفى عن محركات البحث
 * حتى لا يعدّه جوجل نسخة مكرّرة تنافس النطاق الحقيقي.
 */

import { site } from '../data/site';

export function isProductionSite(siteUrl: URL | undefined): boolean {
  return siteUrl?.hostname === site.domain;
}
