import { defineField, defineType } from 'sanity';

/**
 * مشروع في معرض الأعمال.
 * كل حقل هنا يظهر بالعربية في لوحة التحكم.
 */
export const project = defineType({
  name: 'project',
  title: 'مشروع',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'اسم المشروع',
      type: 'string',
      description: 'مثال: فيلا العائلة — الزروق',
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: 'meta',
      title: 'السطر الوصفي',
      type: 'string',
      description: 'النوع ثم المساحة، بينهما نقطة. مثال: فيلا سكنية · 300 م²',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'dims',
      title: 'مقاس الأرض',
      type: 'string',
      description: 'يظهر صغيرًا في زاوية البطاقة. مثال: 20 × 15 m — اتركه فارغًا إن لم يلزم',
    }),
    defineField({
      name: 'image',
      title: 'صورة المشروع',
      type: 'image',
      description: 'رندر بعرض 1600 بكسل على الأقل. الصورة الأولى تظهر في البطاقة الكبيرة.',
      options: { hotspot: true },
      validation: (rule) => rule.required(),
      fields: [
        defineField({
          name: 'alt',
          title: 'وصف الصورة',
          type: 'string',
          description: 'وصف قصير لما في الصورة — يقرؤه المكفوفون وتفهمه محركات البحث.',
          validation: (rule) => rule.required().max(120),
        }),
      ],
    }),
    defineField({
      name: 'order',
      title: 'الترتيب',
      type: 'number',
      description: 'الأصغر يظهر أولًا. 1 للبطاقة الكبيرة، ثم 2 و3.',
      initialValue: 10,
    }),
  ],
  orderings: [
    {
      title: 'الترتيب المعتمد',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'meta', media: 'image' },
  },
});
