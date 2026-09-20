# موقع ماركوديا بيلد

موقع تعريفي ثابت لشركة **MARCODEA BUILD** — تصميم معماري 2D ورندر ثلاثي الأبعاد، مصراتة — ليبيا.

مبني بـ **Astro 7** و**TypeScript** و**Tailwind CSS 4**. لا خادم ولا قاعدة بيانات: البناء يُخرج ملفات HTML وصورًا جاهزة، فيفتح الموقع سريعًا على شبكات الجوال.

> **للشركة:** إن كنت تريد فقط إضافة مشروع جديد أو تبديل صورة، اقرأ [COMPANY-GUIDE-AR.md](COMPANY-GUIDE-AR.md) — لا تحتاج أي شيء مما في هذا الملف.

---

## التشغيل محليًا

تحتاج **Node.js 20.3 أو أحدث**. تحقّق بـ `node -v`.

```bash
npm install
```

```bash
npm run dev
```

يفتح الموقع على <http://localhost:4321>. أي تعديل يظهر فورًا بلا إعادة تشغيل.

### بقية الأوامر

| الأمر | ماذا يفعل |
|---|---|
| `npm run build` | يبني نسخة النشر في مجلد `dist/` |
| `npm run preview` | يعرض نسخة النشر كما ستظهر على الإنترنت |
| `npm run check` | يفحص الأنواع والأخطاء — يجب أن يخرج بصفر أخطاء |
| `npm run verify` | فحص وبناء معًا — شغّله قبل كل نشر |
| `npm run lh` | يقيس Lighthouse على الجوال والحاسوب ويحفظ التقارير في `qa/` |
| `npm run og` | يعيد توليد صورة المشاركة `public/og-image.jpg` |

> `npm run lh` يحتاج نسخة بناء حديثة: شغّل `npm run build` قبله.

---

## بنية المشروع

```
src/
  components/   مكوّنات الواجهة — ملف لكل قسم
  layouts/      BaseLayout.astro — الترويسة ووسوم SEO
  pages/        index.astro — الصفحة الوحيدة حاليًا
  data/         content.ts (كل النصوص) · site.ts (بيانات الشركة)
                icons.ts (الأيقونات) · projects.json (المعرض)
  lib/          projects.ts وsanity.ts — مصدر مشاريع المعرض
  scripts/      contact-form.ts — تحقّق النموذج وبناء رسالة واتساب
  styles/       global.css — كل التوكنات اللونية والمقاسية
  assets/       صور الهوية
public/         robots.txt · favicon · og-image · apple-touch-icon
studio/         لوحة تحكم Sanity (مشروع مستقل — انظر أدناه)
reference/      الموكب الأصلي ودليل الهوية — مرجع فقط، لا يدخل البناء
```

**قاعدتان تحفظان المشروع نظيفًا:**

1. **لا نص مكتوب داخل مكوّن.** كل جملة عربية في `src/data/content.ts`.
2. **لا لون ولا مقاس مكتوب يدويًا داخل مكوّن.** كلها متغيّرات من `src/styles/global.css`.

---

## تعديل النصوص

كل نص في الموقع موجود في [`src/data/content.ts`](src/data/content.ts)، مقسّمًا حسب القسم: `hero`، `services`، `audience`، `process`، `work`، `why`، `contact`، `form`، `footer`.

عدّل الجملة واحفظ — تظهر فورًا. لا تفتح ملفات المكوّنات.

بيانات الشركة (العنوان، البريد، النطاق، حسابات التواصل) في [`src/data/site.ts`](src/data/site.ts).

---

## تغيير رقم الواتساب

الرقم في ملف `.env` في جذر المشروع:

```
PUBLIC_WHATSAPP=218926243113
```

**الصيغة مهمة:** كود الدولة `218` ثم الرقم **بلا الصفر** الذي يسبقه محليًا، وبلا `+` وبلا فراغات.
الرقم المحلي `0926243113` يُكتب هنا `218926243113`.

بعد التعديل: أعد البناء والنشر.

الرقم كما يُعرض للزائر في الفوتر (`092 624 3113`) موجود في `src/data/site.ts` باسم `WHATSAPP_DISPLAY` — غيّره معه.

---

## إضافة مشروع إلى المعرض

### الطريقة المعتمدة: لوحة التحكم

انظر [COMPANY-GUIDE-AR.md](COMPANY-GUIDE-AR.md). لا تحتاج برمجة.

### الطريقة البديلة: ملف مباشر

إن لم تُضبط لوحة التحكم، يقرأ الموقع من [`src/data/projects.json`](src/data/projects.json):

```json
[
  {
    "title": "فيلا العائلة — الزروق",
    "meta": "فيلا سكنية · 300 م²",
    "dims": "20 × 15 m",
    "imageUrl": "https://…/render.jpg",
    "imageAlt": "واجهة فيلا من دورين بإضاءة المساء"
  }
]
```

الملف الفارغ `[]` يعني أن البطاقات تظهر فارغة بنمط المخطط الهندسي — وهذا هو الوضع الحالي.

---

## لوحة التحكم (Sanity)

الموقع يقرأ المشاريع من Sanity وقت البناء. مجلد `studio/` يحتوي لوحة التحكم بواجهة عربية.

### التجهيز لمرة واحدة

1. أنشئ حسابًا ومشروعًا على <https://www.sanity.io> **باسم الشركة**، واختر dataset باسم `production` واجعله عامًا (public).
2. انسخ **Project ID** من إعدادات المشروع.
3. ضعه في ملف `.env` في جذر الموقع:

   ```
   PUBLIC_SANITY_PROJECT_ID=معرّف_المشروع
   PUBLIC_SANITY_DATASET=production
   ```

4. جهّز اللوحة ثم انشرها:

   ```bash
   npm --prefix studio install
   ```

   أنشئ `studio/.env` بنفس المعرّف (`SANITY_STUDIO_PROJECT_ID=…`)، ثم:

   ```bash
   npm --prefix studio run deploy
   ```

   تصبح اللوحة على رابط مثل `https://marcodeabuild.sanity.studio`.

5. في إعدادات مشروع Sanity أضف **Webhook** يشير إلى رابط النشر من Cloudflare Pages (Deploy Hook)، حتى يُعاد بناء الموقع تلقائيًا عند إضافة مشروع.

**إن لم تُضبط هذه البيانات لا يتعطّل شيء:** الموقع يبني ويعمل ويعرض البطاقات الفارغة. وإن تعذّر الاتصال بـ Sanity أثناء البناء يُكتب تحذير ويكمل البناء — لا ينهار النشر بسبب خدمة خارجية.

---

## استبدال الخط العربي بـ Montaser Arabic

دليل الهوية ينصّ على **Montaser Arabic**، وهو غير متاح مجانًا، فالموقع يعمل حاليًا بـ **Alexandria**.

عند شراء الترخيص:

1. ضع ملفات الخط في `src/assets/fonts/`.
2. أضف `@font-face` له في `src/styles/global.css`.
3. غيّر **سطرًا واحدًا** في الملف نفسه:

   ```css
   --font-ar: 'Montaser Arabic', 'Alexandria Variable', sans-serif;
   ```

لا شيء آخر يتغيّر في المشروع.

---

## النشر على Cloudflare Pages

1. ارفع المستودع إلى GitHub.
2. في Cloudflare: **Workers & Pages → Create → Pages → Connect to Git**.
3. الإعدادات:

   | الحقل | القيمة |
   |---|---|
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Node version | `20` أو أحدث |

4. أضف متغيّرات البيئة نفسها الموجودة في `.env`: `PUBLIC_WHATSAPP` و`PUBLIC_SANITY_PROJECT_ID` و`PUBLIC_SANITY_DATASET`.
5. اربط النطاق `marcodeabuild.ly` من **Custom domains**.

كل دفعة إلى الفرع `main` تنشر تلقائيًا.

> إن بِيع الموقع للشركة: اجعل حساب GitHub وحساب Cloudflare وحساب Sanity باسمها، أو انقل الملكية عند التسليم.

---

## قبل كل نشر

```bash
npm run verify && npm run build && npm run lh
```

المطلوب: صفر أخطاء، صفر تحذيرات، و**95 فأعلى** في مؤشرات Lighthouse الأربعة.
القياس الحالي: **100 في الأربعة، على الجوال والحاسوب**.

---

## ما يبقى ناقصًا

| البند | الأثر |
|---|---|
| ثلاثة رندرات لمعرض الأعمال بأسماء المشاريع ومساحاتها | البطاقات تظهر فارغة بنمط المخطط |
| روابط حسابات التواصل | لا تظهر أيقونات التواصل في الفوتر إطلاقًا |
| ترخيص خط Montaser Arabic | الموقع يعمل بـ Alexandria |
| معرّف مشروع Sanity | لوحة التحكم غير مفعّلة، والمعرض يُقرأ من الملف |
| حجز النطاق `marcodeabuild.ly` | الموقع ينشر على رابط Cloudflare المؤقت |

لا شيء من هذه يمنع النشر — كلها تُضاف لاحقًا بلا تعديل في الكود.
