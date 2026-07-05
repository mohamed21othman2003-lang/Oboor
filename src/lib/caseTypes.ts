// أنواع الحالات/الصعوبات — مصدر موحّد لنموذج الالتحاق وفلاتر الـCMS.
// أي تعديل هنا ينعكس تلقائياً على الويبسايت (نموذج الالتحاق) ولوحة التحكّم معاً.
export const CASE_TYPES_AR = [
  "اضطراب طيف التوحد",
  "نقص الانتباه وفرط الحركة (ADHD)",
  "تأخر النطق واللغة",
  "صعوبات التعلم",
  "إعاقة حركية",
];
export const CASE_TYPES_EN = [
  "Autism Spectrum Disorder",
  "ADHD",
  "Speech & Language Delay",
  "Learning Difficulties",
  "Physical Disability",
];
// «أخرى» مجرّد مفتاح لإدخال نص حرّ في النموذج — ليست فئة فعلية تُخزَّن كما هي
export const OTHER_CASE_AR = "أخرى";
export const OTHER_CASE_EN = "Other";

// قائمة النموذج الكاملة (الفئات + «أخرى») حسب اللغة
export function caseOptions(en: boolean): string[] {
  return en ? [...CASE_TYPES_EN, OTHER_CASE_EN] : [...CASE_TYPES_AR, OTHER_CASE_AR];
}

// خيارات فلتر أنواع الحالات للـCMS: الفئات القياسية (قيمتها بالعربية كما تُخزَّن)
// + أي قيم إضافية موجودة فعلاً في البيانات (مثل نص «أخرى» الحر أو بيانات قديمة).
export function caseTypeFilterOptions(existing: string[], en: boolean): { value: string; label: string }[] {
  const canonical = CASE_TYPES_AR.map((ar, i) => ({ value: ar, label: en ? CASE_TYPES_EN[i] : ar }));
  const known = new Set(CASE_TYPES_AR);
  const extra = [...new Set(existing.filter(Boolean))]
    .filter((c) => !known.has(c))
    .map((c) => ({ value: c, label: c }));
  return [...canonical, ...extra];
}
