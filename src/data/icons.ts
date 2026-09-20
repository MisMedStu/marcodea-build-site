/**
 * سجل الأيقونات. كل مسار منقول من reference/index.html كما هو.
 * filled: أيقونة ممتلئة بلا حدود (الشعارات الاجتماعية وواتساب).
 */
export interface IconDef {
  body: string;
  stroke?: number;
  filled?: boolean;
}

export const icons = {
  menu: { body: '<path d="M4 7h16M4 12h16M4 17h10"/>', stroke: 2 },
  arrow: { body: '<path d="M19 12H5M11 6l-6 6 6 6"/>', stroke: 2 },
  clock: { body: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', stroke: 1.8 },
  check: { body: '<path d="M5 12l5 5 9-10"/>', stroke: 2.2 },
  info: { body: '<circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16.5v.01"/>', stroke: 2 },

  // الخدمات
  plan: {
    body: '<rect x="3" y="3" width="18" height="18" rx="1.5"/><path d="M3 10h8v11M11 14h10M15 3v7"/>',
    stroke: 1.7,
  },
  cube: {
    body: '<path d="M12 2l9 5v10l-9 5-9-5V7z"/><path d="M12 22V12M21 7l-9 5-9-5"/>',
    stroke: 1.7,
  },
  interior: {
    body: '<path d="M3 20h18M5 20V10l7-6 7 6v10"/><path d="M9 20v-5h6v5"/><circle cx="12" cy="10" r="1.2"/>',
    stroke: 1.7,
  },
  chart: { body: '<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>', stroke: 1.7 },

  // لماذا ماركوديا بيلد
  shield: {
    body: '<path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z"/><path d="M9 12l2 2 4-4"/>',
    stroke: 1.8,
  },
  eye: {
    body: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    stroke: 1.8,
  },
  home: {
    body: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
    stroke: 1.8,
  },
  bolt: { body: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>', stroke: 1.8 },

  // التواصل
  pin: {
    body: '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    stroke: 1.8,
  },
  mail: {
    body: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    stroke: 1.8,
  },
  globe: {
    body: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    stroke: 1.8,
  },
  phone: {
    body: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
    stroke: 1.8,
  },

  whatsapp: {
    filled: true,
    body: '<path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.3.8 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z"/>',
  },
  facebook: {
    filled: true,
    body: '<path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.7l-.4 2.9h-2.3v7A10 10 0 0 0 22 12z"/>',
  },
  instagram: {
    body: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" stroke="none"/>',
    stroke: 1.8,
  },
  tiktok: {
    filled: true,
    body: '<path d="M16.5 2h-3v13.2a2.6 2.6 0 1 1-2.1-2.6V9.5a5.8 5.8 0 1 0 5.1 5.8V8.9a6.6 6.6 0 0 0 3.8 1.2V7.1a3.8 3.8 0 0 1-3.8-3.8V2z"/>',
  },
} satisfies Record<string, IconDef>;

export type IconName = keyof typeof icons;
