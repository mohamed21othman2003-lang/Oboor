// مصدر واحد لبيانات الموقع — عدّل هنا وينعكس في كل الصفحات
// تابات النافبار مطابقة للديزاين (يمين ← شمال)
export const NAV_LINKS = [
  { key: "home", label: "الرئيسية", href: "/" },
  { key: "about", label: "من نحن", href: "/about" },
  { key: "news", label: "إعلامنا", href: "/news" },
  { key: "programs", label: "خدماتنا", href: "/programs" },
  { key: "branches", label: "فروعنا", href: "/branches" },
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

export const CONTACT = {
  email: "info@hc.com.sa",
  customerService: "0561000274",
  unified: "920003452",
};
