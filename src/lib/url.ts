/**
 * روابط تعمل من أي مسار.
 * الموقع قد يُنشر على جذر عنوانه (marcodeabuild.github.io/) أو تحت مسار
 * فرعي في نسخة تجريبية (…github.io/اسم-المستودع/)، فكل رابط
 * لملف داخل الموقع يمرّ من هنا بدل أن يبدأ بـ / مباشرة.
 */

/** يضيف المسار الأساسي للموقع إلى رابط داخلي: /favicon.svg ← /base/favicon.svg */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/${path.replace(/^\//, '')}`;
}

/** رابط كامل بالنطاق — لوسوم المشاركة وبيانات محركات البحث */
export function absoluteUrl(path: string, site: URL | undefined, fallback: string): string {
  return new URL(withBase(path), site ?? fallback).href;
}
