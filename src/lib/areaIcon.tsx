import React from "react";

// مكتبة أيقونات (المفتاح → رسم SVG)
const PATHS: Record<string, string> = {
  strength: '<path d="M14.4 14.4 9.6 9.6M18.7 21.3l2.6-2.6a1 1 0 0 0 0-1.4l-1.6-1.6 2.6-2.6-2-2-2.6 2.6-3-3 2.6-2.6-2-2-2.6 2.6-1.6-1.6a1 1 0 0 0-1.4 0L2.7 5.3a1 1 0 0 0 0 1.4l1.6 1.6L1.7 11l2 2 2.6-2.6 3 3L6.7 16l2 2 2.6-2.6 1.6 1.6a1 1 0 0 0 1.4 0z"/>',
  stretch: '<path d="M4 4v16M20 4v16M4 12h16"/><path d="M7 9l-3 3 3 3M17 9l3 3-3 3"/>',
  range: '<path d="M3 12a9 9 0 1 0 9-9"/><path d="M12 3v9l6 3"/>',
  pencil: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  run: '<circle cx="13" cy="4" r="2"/><path d="M15 22l-3-7-3 3v4M12 15l-2-4 2-4 4 2"/>',
  endurance: '<rect x="2" y="7" width="16" height="10" rx="2"/><path d="M22 11v2M6 11v2M10 11v2"/>',
  zap: '<path d="M13 2 3 14h7l-1 8 10-12h-7z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/>',
  home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
  eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>',
  brain: '<path d="M9.5 3A2.5 2.5 0 0 0 7 5.5a2.5 2.5 0 0 0-1 4.8A2.5 2.5 0 0 0 7 15a2.5 2.5 0 0 0 5 .5V5.5A2.5 2.5 0 0 0 9.5 3zM14.5 3A2.5 2.5 0 0 1 17 5.5a2.5 2.5 0 0 1 1 4.8A2.5 2.5 0 0 1 17 15a2.5 2.5 0 0 1-5 .5"/>',
  book: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
  hand: '<path d="M18 11V6a2 2 0 0 0-4 0v5M14 10V4a2 2 0 0 0-4 0v6M10 10.5V6a2 2 0 0 0-4 0v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2a8 8 0 0 1-8-8 2 2 0 1 1 4 0"/>',
  heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/>',
  chat: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  ear: '<path d="M6 8.5a6.5 6.5 0 1 1 13 0c0 6-6 4-6 8a3 3 0 0 1-6 0"/>',
  graduation: '<path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c0 1 2.7 2.5 6 2.5s6-1.5 6-2.5v-5"/>',
  person: '<circle cx="12" cy="7" r="4"/><path d="M5 21v-1a7 7 0 0 1 14 0v1"/>',
  briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  puzzle: '<path d="M19 11h-2a2 2 0 1 0-4 0H9a2 2 0 1 0 0 4v2a2 2 0 1 1 0 4h6a2 2 0 0 0 2-2 2 2 0 1 1 0-4z"/>',
  sparkle: '<path d="M12 3l1.9 5.6L20 10l-6.1 1.4L12 17l-1.9-5.6L4 10l6.1-1.4z"/>',
  shield: '<path d="M12 2l8 3v6c0 5-3.4 8.6-8 11-4.6-2.4-8-6-8-11V5z"/><path d="M9 12l2 2 4-4"/>',
  chart: '<path d="M3 3v18h18"/><rect x="7" y="11" width="3" height="6"/><rect x="13" y="7" width="3" height="10"/>',
  activity: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
  star: '<polygon points="12 2 15 8.9 22.5 9.3 16.7 14 18.6 21.2 12 17.2 5.4 21.2 7.3 14 1.5 9.3 9 8.9"/>',
  check: '<circle cx="12" cy="12" r="9"/><path d="M8.5 12l2.2 2.2L15.5 9.5"/>',
};

// قائمة مفاتيح الأيقونات المتاحة (لمنتقي الأيقونات في لوحة التحكّم)
export const OFFER_ICON_KEYS = Object.keys(PATHS);

const I = (key: string) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: PATHS[key] || PATHS.check }} />
);

// المفتاح المناسب لكل اسم حسب الكلمات المفتاحية
function keyFor(t: string): string {
  if (/قوة|عضل/.test(t)) return "strength";
  if (/شد|مرونة|إطالة/.test(t)) return "stretch";
  if (/مدى|مفاصل|نطاق/.test(t)) return "range";
  if (/دقيق|أصابع|قبل الكتابة|كتابة/.test(t)) return "pencil";
  if (/كبرى|مشي|جري|تنقل|حرك|توازن|تناسق/.test(t)) return "run";
  if (/تحمل|استمرار/.test(t)) return "endurance";
  if (/منعكس/.test(t)) return "zap";
  if (/حس|تكامل|سمع|صوت|سمعي/.test(t)) return "ear";
  if (/حياة يومية|يومي|رعاية ذات|عناية بالذات/.test(t)) return "home";
  if (/انتباه|بصر|عين|مراقب|إدراك البصري/.test(t)) return "eye";
  if (/ذاكرة|تذكر|تعلم|أكاديم|قراءة|مدرس|معرفي|معرف/.test(t)) return "book";
  if (/تركيز|ذهن|تفكير|إدراك|نمائي/.test(t)) return "brain";
  if (/مساعدة|اعتماد|نفس|رعاية|استعداد/.test(t)) return "hand";
  if (/عاطف|انفعال|مشاعر|وجدان|قلق|توتر|خوف/.test(t)) return "heart";
  if (/اجتماعي|تفاعل|دمج/.test(t)) return "users";
  if (/تواصل|تعبير|لغة|نطق|كلام|حوار/.test(t)) return "chat";
  if (/تقليد|محاكاة/.test(t)) return "copy";
  if (/أداء|تطور|تنمية|مهار/.test(t)) return "chart";
  if (/استقلال|مستقل/.test(t)) return "person";
  if (/مهن|عمل/.test(t)) return "briefcase";
  if (/تدريب|مختص|كادر|كوادر|تطوير/.test(t)) return "graduation";
  if (/أسرة|أسر|عائلة|والد/.test(t)) return "users";
  return "check";
}

// ترتيب احتياطي لاختيار بديل عند التكرار
const POOL = ["eye", "brain", "book", "graduation", "heart", "chat", "target", "puzzle", "hand", "run", "sun", "person", "users", "chart", "ear", "pencil", "shield", "sparkle", "range", "strength", "check"];

export function areaIcon(title: string): React.ReactNode {
  return I(keyFor(title));
}

// أيقونة بمفتاح صريح
export function iconByKey(key: string): React.ReactNode {
  return I(key);
}

// أيقونات مميزة بدون تكرار لمجموعة عناوين
export function distinctIcons(titles: string[]): React.ReactNode[] {
  const used = new Set<string>();
  return titles.map((t) => {
    let k = keyFor(t);
    if (used.has(k)) k = POOL.find((p) => !used.has(p)) || k;
    used.add(k);
    return I(k);
  });
}
