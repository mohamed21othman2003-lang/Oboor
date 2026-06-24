import type { ReactNode } from "react";

// نسخة CMS من أيقونات الموقع (للمعاينة في منتقي الأيقونات).
// المفاتيح = نفس الأسماء التي تتوقعها مكوّنات الموقع.
const S = (children: ReactNode) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);

export const CMS_ICONS: Record<string, ReactNode> = {
  users: S(<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>),
  team: S(<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>),
  user: S(<><path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /></>),
  calendar: S(<><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18M9 16l2 2 4-4" /></>),
  clipboard: S(<><rect x="8" y="2" width="8" height="4" rx="1" /><path d="M9 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-3" /><path d="M9 13l2 2 4-4" /></>),
  heart: S(<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />),
  layers: S(<><path d="M12 2l9 5-9 5-9-5 9-5z" /><path d="M3 12l9 5 9-5M3 17l9 5 9-5" /></>),
  document: S(<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h6" /></>),
  pin: S(<><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></>),
  trophy: S(<><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4z" /><path d="M5 4H3v2a3 3 0 0 0 3 3M19 4h2v2a3 3 0 0 1-3 3" /></>),
  book: S(<><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></>),
  target: S(<><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></>),
  chat: S(<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />),
  shield: S(<><path d="M12 2l8 3v6c0 5-3.4 8.6-8 11-4.6-2.4-8-6-8-11V5l8-3z" /><path d="M9 12l2 2 4-4" /></>),
  bolt: S(<path d="M13 2 3 14h7l-1 8 10-12h-7z" />),
  puzzle: S(<path d="M19 11h-2a2 2 0 1 0-4 0H9a2 2 0 1 0 0 4v2a2 2 0 1 1 0 4h6a2 2 0 0 0 2-2 2 2 0 1 1 0-4z" />),
  sensory: S(<><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" /></>),
  grid: S(<><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>),
  stethoscope: S(<><path d="M4 3v6a5 5 0 0 0 10 0V3" /><path d="M4 3H2M14 3h-2M9 14v3a4 4 0 0 0 8 0v-1" /><circle cx="19" cy="13" r="2" /></>),
  chip: S(<><rect x="6" y="6" width="12" height="12" rx="2" /><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" /></>),
  star: S(<polygon points="12 2 15 8.5 22 9.3 17 14 18.2 21 12 17.7 5.8 21 7 14 2 9.3 9 8.5 12 2" />),
  trend: S(<><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></>),
  brain: S(<><path d="M9.5 3A2.5 2.5 0 0 0 7 5.5a2.5 2.5 0 0 0-1 4.8A2.5 2.5 0 0 0 7 15a2.5 2.5 0 0 0 5 .5V5.5A2.5 2.5 0 0 0 9.5 3z" /><path d="M14.5 3A2.5 2.5 0 0 1 17 5.5a2.5 2.5 0 0 1 1 4.8A2.5 2.5 0 0 1 17 15a2.5 2.5 0 0 1-5 .5" /></>),
  globe: S(<><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" /></>),
  activity: S(<path d="M22 12h-4l-3 9L9 3l-3 9H2" />),
  hand: S(<><path d="M18 11V6a2 2 0 0 0-4 0v5M14 10V4a2 2 0 0 0-4 0v6M10 10.5V6a2 2 0 0 0-4 0v8" /><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2a8 8 0 0 1-8-8 2 2 0 1 1 4 0" /></>),
  chart: S(<><path d="M3 3v18h18" /><rect x="7" y="11" width="3" height="6" /><rect x="13" y="7" width="3" height="10" /></>),
  search: S(<><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></>),
  question: S(<><circle cx="12" cy="12" r="9" /><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></>),
  list: S(<><path d="M8 6h13M8 12h13M8 18h13" /><path d="M3 6h.01M3 12h.01M3 18h.01" /></>),
  briefcase: S(<><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></>),
  bulb: S(<path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1V17h6v-.2c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2z" />),
  graduation: S(<><path d="M22 10 12 5 2 10l10 5 10-5z" /><path d="M6 12v5c0 1 2.7 2.5 6 2.5s6-1.5 6-2.5v-5" /></>),
  building: S(<><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2" /></>),
  growth: S(<><path d="M3 17l6-6 4 4 8-8" /><path d="M21 7v5h-5" /></>),
};

// أسماء عربية ودّية للأيقونات
export const ICON_LABELS: Record<string, string> = {
  users: "مجموعة أشخاص", team: "فريق", user: "شخص", calendar: "تقويم", clipboard: "تقييم",
  heart: "قلب", layers: "طبقات", document: "مستند", pin: "موقع", trophy: "كأس", book: "كتاب",
  target: "هدف", chat: "محادثة", shield: "درع/أمان", bolt: "طاقة", puzzle: "أحجية", sensory: "حسّي",
  grid: "شبكة", stethoscope: "سمّاعة طبية", chip: "شريحة", star: "نجمة", trend: "نمو/مؤشر",
  brain: "دماغ", globe: "عالم", activity: "نشاط/نبض", hand: "يد", chart: "رسم بياني", search: "بحث",
  question: "سؤال", list: "قائمة", briefcase: "حقيبة", bulb: "فكرة", graduation: "تعليم", building: "مبنى", growth: "تطوّر",
};

export const ALL_ICON_NAMES = Object.keys(CMS_ICONS);

// الأيقونات الصالحة لكل نوع (حسب ما يدعمه مكوّن الموقع فعلاً)
export const ICON_SETS: Record<string, string[]> = {
  stats: ["users", "calendar", "clipboard", "heart", "layers", "document", "pin", "trophy", "book"],
  features: ["team", "book", "target", "heart", "chat", "shield"],
  "assessment-cards": ["chat", "bolt", "puzzle", "book", "users", "sensory"],
};

export function iconNamesFor(type: string): string[] {
  return ICON_SETS[type] || ALL_ICON_NAMES;
}
