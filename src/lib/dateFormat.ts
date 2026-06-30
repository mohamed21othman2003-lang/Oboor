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
