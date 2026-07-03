// ترجمة عناوين تجميع القوائم في الـCMS (مثل أسماء المناطق في قائمة الفروع).
// حين لا يملك حقل التجميع choices، يستخدم الـfrontend القيمة الخام (عربية) كعنوان —
// هنا نترجم القيم المعروفة للإنجليزية، ونرجّع الأصل لغير المعروف.

const GROUP_LABELS_EN: Record<string, string> = {
  // المناطق (نفس خريطة الموقع)
  "الرياض": "Riyadh",
  "مكة المكرمة": "Makkah",
  "المدينة المنورة": "Madinah",
  "الشرقية": "Eastern Province",
  "المنطقة الشرقية": "Eastern Province",
  "القصيم": "Qassim",
  "عسير": "Asir",
  "جازان": "Jazan",
  "جيزان": "Jazan",
  "الجوف": "Al-Jouf",
  "جدة": "Jeddah",
  "تبوك": "Tabuk",
  // شائعة أخرى قد تظهر كعناوين مجموعات
  "أخرى": "Other",
};

// ترجمة عنوان مجموعة حسب لغة اللوحة (إنجليزي إن عُرف، وإلا الأصل)
export function groupLabel(label: string, lang: "ar" | "en"): string {
  if (lang !== "en" || !label) return label;
  return GROUP_LABELS_EN[label.trim()] || label;
}
