import type { Locale } from "@/i18n/config";

const MONTHS_AR = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
const MONTHS_EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// يحوّل تاريخ ISO (YYYY-MM-DD) إلى صيغة مقروءة حسب اللغة.
// أي قيمة ليست ISO (نص قديم محرّر يدويًا) تُعرض كما هي للتوافق الرجعي.
export function formatDate(value: string | undefined | null, locale: Locale): string {
  const v = (value ?? "").trim();
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
  if (!m) return v;
  const year = m[1];
  const month = Number(m[2]) - 1;
  const day = Number(m[3]);
  if (month < 0 || month > 11) return v;
  return locale === "en" ? `${day} ${MONTHS_EN[month]} ${year}` : `${day} ${MONTHS_AR[month]} ${year}`;
}

// يحوّل وقت 24 ساعة (HH:MM) إلى صيغة 12 ساعة حسب اللغة (مثال: 5:00 م / 5:00 PM)
function to12h(hhmm: string, locale: Locale): string {
  const m = /^(\d{1,2}):(\d{2})$/.exec(hhmm.trim());
  if (!m) return hhmm;
  const h = Number(m[1]);
  const am = h < 12;
  const h12 = h % 12 === 0 ? 12 : h % 12;
  const suffix = locale === "en" ? (am ? "AM" : "PM") : (am ? "ص" : "م");
  return `${h12}:${m[2]} ${suffix}`;
}

// يعرض الوقت/نطاق الوقت المخزّن (HH:MM أو HH:MM - HH:MM) بصيغة مقروءة.
// أي نص قديم محرّر يدويًا يُعرض كما هو.
export function formatTime(value: string | undefined | null, locale: Locale): string {
  const v = (value ?? "").trim();
  const range = /^(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})$/.exec(v);
  if (range) return `${to12h(range[1], locale)} - ${to12h(range[2], locale)}`;
  if (/^\d{1,2}:\d{2}$/.test(v)) return to12h(v, locale);
  return v;
}
