// مصدر واحد لبيانات الموقع — عدّل هنا وينعكس في كل الصفحات
// تابات النافبار مطابقة للديزاين (يمين ← شمال)
export const NAV_LINKS = [
  { key: "home", label: "الرئيسية", href: "/" },
  { key: "about", label: "عن عبور", href: "/about" },
  { key: "news", label: "إعلامنا", href: "/news" },
  { key: "programs", label: "برامجنا التمكينية", href: "/programs" },
  { key: "branches", label: "مراكزنا", href: "/branches" },
  { key: "success", label: "قصص النجاح", href: "/success-stories" },
  { key: "specialists", label: "الاخصائيين", href: "/specialists" },
  { key: "careers", label: "الوظائف", href: "/careers" },
  { key: "assessment", label: "التقييم", href: "/assessment" },
] as const;

export const SERVICES = [
  "التدخل المبكر",
  "النطق والتخاطب",
  "العلاج الوظيفي",
  "العلاج الفيزيائي",
  "التحليل السلوكي التطبيقي",
  "الدعم التربوي والأكاديمي",
] as const;

// مصدر واحد لبيانات التواصل — عدّل هنا وينعكس في كل الموقع (صفحة التواصل + الفوتر)
export const CONTACT = {
  email: "info@hdc.com.sa",
  customerService: "0561000274",
  unified: "920003452",
  whatsapp: "966920003452", // wa.me
  website: "oboor.com.sa",
  mainBranchAr: "الرياض ( الفرع الرئيسي )",
  mainBranchEn: "Riyadh (Main Branch)",
};
