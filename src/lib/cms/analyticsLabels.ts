import { CASE_TYPES_AR, CASE_TYPES_EN } from "@/lib/caseTypes";
import { REGION_EN } from "@/lib/branchesData";

// أزواج (إنجليزي، عربي) للقيم المعروفة التي تأتي من GA4 أو من قاعدة البيانات
const PAIRS: [string, string][] = [
  // أجهزة (GA4 تُرجعها إنجليزي)
  ["Desktop", "كمبيوتر"], ["Mobile", "موبايل"], ["Tablet", "تابلت"], ["Smart TV", "تلفاز ذكي"],
  // قنوات (GA4)
  ["Direct", "مباشر"], ["Organic Search", "بحث عضوي"], ["Organic Social", "سوشيال عضوي"],
  ["Referral", "إحالة"], ["Unassigned", "غير مصنّف"], ["Paid Search", "بحث مدفوع"], ["Email", "بريد"],
  // الجنس والمستوى (قاعدة البيانات تخزّنها عربي)
  ["Male", "ذكر"], ["Female", "أنثى"],
  ["High", "مرتفع"], ["Medium", "متوسط"], ["Low", "منخفض"],
  ["Unspecified", "غير محدّد"],
];

const EN2AR = new Map<string, string>();
const AR2EN = new Map<string, string>();
function add(en: string, ar: string) {
  if (!en || !ar) return;
  EN2AR.set(en.toLowerCase(), ar);
  AR2EN.set(ar, en);
}
for (const [en, ar] of PAIRS) add(en, ar);
CASE_TYPES_AR.forEach((ar, i) => add(CASE_TYPES_EN[i], ar));
Object.entries(REGION_EN).forEach(([ar, en]) => add(en, ar)); // REGION_EN: عربي → إنجليزي

/**
 * يترجم قيمة تسمية إلى لغة اللوحة:
 * - في الإنجليزية: يحوّل القيم العربية المعروفة إلى إنجليزي.
 * - في العربية: يحوّل القيم الإنجليزية المعروفة (مثل بيانات GA4) إلى عربي.
 * القيم الحرّة غير المعروفة (أسماء فروع/وظائف مخصّصة) تبقى كما أُدخلت.
 */
export function labelTr(raw: string, en: boolean): string {
  if (!raw) return raw;
  return en ? (AR2EN.get(raw) ?? raw) : (EN2AR.get(raw.toLowerCase()) ?? raw);
}
