/**
 * بيانات الشركة وإعدادات الموقع.
 * رقم الواتساب يأتي من متغيّر البيئة PUBLIC_WHATSAPP (ملف .env) لا من هنا.
 */

/** رقم واتساب بالصيغة الدولية: بلا + وبلا صفر بعد كود الدولة (218...) */
export const WHATSAPP_NUMBER: string = import.meta.env.PUBLIC_WHATSAPP ?? '218926243113';

/** الرقم كما يُعرض للقارئ العربي */
export const WHATSAPP_DISPLAY = '092 624 3113';

/** الرقم لرابط الاتصال tel: */
export const PHONE_TEL = '+218926243113';

export const site = {
  domain: 'marcodeabuild.ly',
  url: 'https://marcodeabuild.ly',
  displayUrl: 'www.marcodeabuild.ly',
  email: 'marcodea.ly@gmail.com',
  address: {
    full: 'منطقة الزروق — مصراتة — ليبيا',
    street: 'منطقة الزروق',
    city: 'مصراتة',
    country: 'ليبيا',
    countryCode: 'LY',
  },
  areaServed: ['مصراتة', 'ليبيا'],
  founded: '2018',
} as const;

/**
 * حسابات التواصل — مواضع محجوزة.
 * ضع الرابط الحقيقي في url ليظهر الحساب في الفوتر تلقائيًا.
 * الحساب الذي url فيه فارغ لا يظهر إطلاقًا.
 */
export const social = [
  { key: 'facebook', label: 'فيسبوك', url: '' },
  { key: 'instagram', label: 'إنستغرام', url: '' },
  { key: 'tiktok', label: 'تيك توك', url: '' },
] as const;

export const seo = {
  title: 'ماركوديا بيلد — تصميم معماري ورندر ثلاثي الأبعاد في مصراتة',
  description:
    'تصميم معماري 2D ورندر ثلاثي الأبعاد واقعي بإشراف مهندس معماري، بتسليم خلال أسبوع. شاهد بيتك أو مشروعك قبل أن يُبنى. معاينة أولى مجانية — مصراتة، ليبيا.',
  ogImage: '/og-image.jpg',
  locale: 'ar_LY',
} as const;
