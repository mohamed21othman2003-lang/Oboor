// محتوى صفحة فروعنا — مطابق لديزاين Figma (node 1:3688)
// كروت الديزاين placeholder متطابقة (فرع النرجس)؛ هنا فروع واقعية بنفس البنية.

import { type Locale } from "@/i18n/config";

export type Branch = {
  slug: string;
  name: string;
  area: string;
  city: string;
  region: string;
  address: string;
  hours: string;
  phone: string;
  services: string[];
  gallery?: string[];
  lat?: number | null;
  lng?: number | null;
  isNew?: boolean;
  rating?: string;
  reviewsCount?: string;
};

const HOURS = "الأحد – الخميس: ٨ص – ٨م";
const HOURS_EN = "Sunday – Thursday: 8 AM – 8 PM";

export const BRANCHES: Branch[] = [
  { slug: "narjes", name: "النرجس - فرع الرياض", area: "حي النرجس", city: "الرياض", region: "الرياض", address: "شارع أنس بن مالك، حي النرجس، الرياض ١٣٣٢١", hours: HOURS, phone: "920000109", services: ["تحليل سلوك", "تكامل حسي", "تخاطب ولغة", "التدخل المبكر"], isNew: true },
  { slug: "olaya", name: "العليا - فرع الرياض", area: "حي العليا", city: "الرياض", region: "الرياض", address: "طريق الملك فهد، حي العليا، الرياض ١٢٢١٤", hours: HOURS, phone: "920000109", services: ["علاج وظيفي", "علاج طبيعي", "تخاطب ولغة"] },
  { slug: "rawdah-ryd", name: "الروضة - فرع الرياض", area: "حي الروضة", city: "الرياض", region: "الرياض", address: "شارع خالد بن الوليد، حي الروضة، الرياض ١٣٢١١", hours: HOURS, phone: "920000109", services: ["دعم نفسي", "تحليل سلوك", "التدخل المبكر"] },
  { slug: "shati-jed", name: "الشاطئ - فرع جدة", area: "حي الشاطئ", city: "جدة", region: "جدة", address: "طريق الكورنيش، حي الشاطئ، جدة ٢٣٤١٢", hours: HOURS, phone: "920000109", services: ["تخاطب ولغة", "تكامل حسي", "علاج وظيفي"], isNew: true },
  { slug: "rawdah-jed", name: "الروضة - فرع جدة", area: "حي الروضة", city: "جدة", region: "جدة", address: "شارع الأمير سلطان، حي الروضة، جدة ٢٣٤٣٤", hours: HOURS, phone: "920000109", services: ["علاج طبيعي", "تحليل سلوك", "التدخل المبكر"] },
  { slug: "khobar", name: "الخبر - فرع الشرقية", area: "حي العقربية", city: "الخبر", region: "المنطقة الشرقية", address: "طريق الملك فهد، حي العقربية، الخبر ٣٤٤٢٦", hours: HOURS, phone: "920000109", services: ["تخاطب ولغة", "علاج وظيفي", "تكامل حسي"] },
  { slug: "azizia-mecca", name: "العزيزية - فرع مكة", area: "حي العزيزية", city: "مكة المكرمة", region: "مكة المكرمة", address: "شارع الحج، حي العزيزية، مكة المكرمة ٢٤٢٢٧", hours: HOURS, phone: "920000109", services: ["تحليل سلوك", "تخاطب ولغة", "التدخل المبكر"] },
  { slug: "abha", name: "المنهل - فرع أبها", area: "حي المنهل", city: "أبها", region: "عسير", address: "طريق الملك عبدالعزيز، حي المنهل، أبها ٦٢٥٢١", hours: HOURS, phone: "920000109", services: ["علاج وظيفي", "دعم نفسي", "تخاطب ولغة"], isNew: true },
];

export const BRANCHES_EN: Branch[] = [
  { slug: "narjes", name: "Al-Narjes - Riyadh Branch", area: "Al-Narjes District", city: "Riyadh", region: "Riyadh", address: "Anas Bin Malik Street, Al-Narjes District, Riyadh 13321", hours: HOURS_EN, phone: "920000109", services: ["Applied Behavior Analysis", "Sensory Integration", "Speech & Language Therapy", "Early Intervention"], isNew: true },
  { slug: "olaya", name: "Al-Olaya - Riyadh Branch", area: "Al-Olaya District", city: "Riyadh", region: "Riyadh", address: "King Fahd Road, Al-Olaya District, Riyadh 12214", hours: HOURS_EN, phone: "920000109", services: ["Occupational Therapy", "Physical Therapy", "Speech & Language Therapy"] },
  { slug: "rawdah-ryd", name: "Al-Rawdah - Riyadh Branch", area: "Al-Rawdah District", city: "Riyadh", region: "Riyadh", address: "Khalid Bin Al-Walid Street, Al-Rawdah District, Riyadh 13211", hours: HOURS_EN, phone: "920000109", services: ["Psychological Services", "Applied Behavior Analysis", "Early Intervention"] },
  { slug: "shati-jed", name: "Al-Shati - Jeddah Branch", area: "Al-Shati District", city: "Jeddah", region: "Jeddah", address: "Corniche Road, Al-Shati District, Jeddah 23412", hours: HOURS_EN, phone: "920000109", services: ["Speech & Language Therapy", "Sensory Integration", "Occupational Therapy"], isNew: true },
  { slug: "rawdah-jed", name: "Al-Rawdah - Jeddah Branch", area: "Al-Rawdah District", city: "Jeddah", region: "Jeddah", address: "Prince Sultan Street, Al-Rawdah District, Jeddah 23434", hours: HOURS_EN, phone: "920000109", services: ["Physical Therapy", "Applied Behavior Analysis", "Early Intervention"] },
  { slug: "khobar", name: "Al-Khobar - Eastern Province Branch", area: "Al-Aqrabiyah District", city: "Al-Khobar", region: "Eastern Province", address: "King Fahd Road, Al-Aqrabiyah District, Al-Khobar 34426", hours: HOURS_EN, phone: "920000109", services: ["Speech & Language Therapy", "Occupational Therapy", "Sensory Integration"] },
  { slug: "azizia-mecca", name: "Al-Azizia - Makkah Branch", area: "Al-Azizia District", city: "Makkah", region: "Makkah", address: "Al-Hajj Street, Al-Azizia District, Makkah 24227", hours: HOURS_EN, phone: "920000109", services: ["Applied Behavior Analysis", "Speech & Language Therapy", "Early Intervention"] },
  { slug: "abha", name: "Al-Manhal - Abha Branch", area: "Al-Manhal District", city: "Abha", region: "Asir", address: "King Abdulaziz Road, Al-Manhal District, Abha 62521", hours: HOURS_EN, phone: "920000109", services: ["Occupational Therapy", "Psychological Services", "Speech & Language Therapy"], isNew: true },
];

// فروع إقليمية إضافية (تظهر في صفحة "من نحن" ولها صفحات تفاصيل)
export const REGION_BRANCHES: Branch[] = [
  { slug: "kharj", name: "فرع الخرج", area: "حي الناصرية", city: "الخرج", region: "الرياض", address: "طريق الملك عبدالعزيز، حي الناصرية، الخرج", hours: HOURS, phone: "920000109", services: ["تخاطب ولغة", "تحليل سلوك", "التدخل المبكر"] },
  { slug: "wadi-dawasir", name: "فرع وادي الدواسر", area: "حي الفيصلية", city: "وادي الدواسر", region: "الرياض", address: "الطريق العام، حي الفيصلية، وادي الدواسر", hours: HOURS, phone: "920000109", services: ["علاج وظيفي", "تخاطب ولغة"] },
  { slug: "qassim", name: "فرع القصيم", area: "حي الصفراء", city: "القصيم", region: "القصيم", address: "طريق الملك فهد، حي الصفراء، بريدة", hours: HOURS, phone: "920000109", services: ["تحليل سلوك", "تكامل حسي", "تخاطب ولغة"] },
  { slug: "majmaah", name: "فرع المجمعة", area: "حي العزيزية", city: "المجمعة", region: "الرياض", address: "طريق الملك سلمان، حي العزيزية، المجمعة", hours: HOURS, phone: "920000109", services: ["علاج طبيعي", "علاج وظيفي"] },
  { slug: "sharqia", name: "فرع الشرقية", area: "حي الفيصلية", city: "الشرقية", region: "المنطقة الشرقية", address: "طريق الملك فهد، حي الفيصلية، الدمام", hours: HOURS, phone: "920000109", services: ["تخاطب ولغة", "علاج وظيفي", "دعم نفسي"] },
  { slug: "jouf", name: "فرع الجوف", area: "حي الفيصلية", city: "الجوف", region: "الجوف", address: "طريق الملك عبدالله، حي الفيصلية، سكاكا", hours: HOURS, phone: "920000109", services: ["تحليل سلوك", "التدخل المبكر"] },
  { slug: "madinah", name: "فرع المدينة المنورة", area: "حي العزيزية", city: "المدينة المنورة", region: "المدينة المنورة", address: "طريق الملك عبدالعزيز، حي العزيزية، المدينة المنورة", hours: HOURS, phone: "920000109", services: ["تخاطب ولغة", "علاج وظيفي", "تكامل حسي"] },
  { slug: "taif", name: "فرع الطائف", area: "حي شهار", city: "الطائف", region: "مكة المكرمة", address: "طريق الملك فيصل، حي شهار، الطائف", hours: HOURS, phone: "920000109", services: ["علاج طبيعي", "تحليل سلوك"] },
  { slug: "aseer", name: "فرع عسير", area: "حي المنسك", city: "عسير", region: "عسير", address: "طريق الملك عبدالعزيز، حي المنسك، أبها", hours: HOURS, phone: "920000109", services: ["علاج وظيفي", "دعم نفسي", "تخاطب ولغة"] },
];

export const REGION_BRANCHES_EN: Branch[] = [
  { slug: "kharj", name: "Al-Kharj Branch", area: "Al-Nasiriyah District", city: "Al-Kharj", region: "Riyadh", address: "King Abdulaziz Road, Al-Nasiriyah District, Al-Kharj", hours: HOURS_EN, phone: "920000109", services: ["Speech & Language Therapy", "Applied Behavior Analysis", "Early Intervention"] },
  { slug: "wadi-dawasir", name: "Wadi Al-Dawasir Branch", area: "Al-Faisaliyah District", city: "Wadi Al-Dawasir", region: "Riyadh", address: "Main Road, Al-Faisaliyah District, Wadi Al-Dawasir", hours: HOURS_EN, phone: "920000109", services: ["Occupational Therapy", "Speech & Language Therapy"] },
  { slug: "qassim", name: "Qassim Branch", area: "Al-Safra District", city: "Qassim", region: "Qassim", address: "King Fahd Road, Al-Safra District, Buraidah", hours: HOURS_EN, phone: "920000109", services: ["Applied Behavior Analysis", "Sensory Integration", "Speech & Language Therapy"] },
  { slug: "majmaah", name: "Al-Majmaah Branch", area: "Al-Azizia District", city: "Al-Majmaah", region: "Riyadh", address: "King Salman Road, Al-Azizia District, Al-Majmaah", hours: HOURS_EN, phone: "920000109", services: ["Physical Therapy", "Occupational Therapy"] },
  { slug: "sharqia", name: "Eastern Province Branch", area: "Al-Faisaliyah District", city: "Eastern Province", region: "Eastern Province", address: "King Fahd Road, Al-Faisaliyah District, Dammam", hours: HOURS_EN, phone: "920000109", services: ["Speech & Language Therapy", "Occupational Therapy", "Psychological Services"] },
  { slug: "jouf", name: "Al-Jouf Branch", area: "Al-Faisaliyah District", city: "Al-Jouf", region: "Al-Jouf", address: "King Abdullah Road, Al-Faisaliyah District, Sakaka", hours: HOURS_EN, phone: "920000109", services: ["Applied Behavior Analysis", "Early Intervention"] },
  { slug: "madinah", name: "Madinah Branch", area: "Al-Azizia District", city: "Madinah", region: "Madinah", address: "King Abdulaziz Road, Al-Azizia District, Madinah", hours: HOURS_EN, phone: "920000109", services: ["Speech & Language Therapy", "Occupational Therapy", "Sensory Integration"] },
  { slug: "taif", name: "Taif Branch", area: "Shihar District", city: "Taif", region: "Makkah", address: "King Faisal Road, Shihar District, Taif", hours: HOURS_EN, phone: "920000109", services: ["Physical Therapy", "Applied Behavior Analysis"] },
  { slug: "aseer", name: "Asir Branch", area: "Al-Mansak District", city: "Asir", region: "Asir", address: "King Abdulaziz Road, Al-Mansak District, Abha", hours: HOURS_EN, phone: "920000109", services: ["Occupational Therapy", "Psychological Services", "Speech & Language Therapy"] },
];

// كل الفروع (للبحث وصفحات التفاصيل)
export const ALL_BRANCHES: Branch[] = [...BRANCHES, ...REGION_BRANCHES];
export const ALL_BRANCHES_EN: Branch[] = [...BRANCHES_EN, ...REGION_BRANCHES_EN];

export function getBranch(slug: string, locale: Locale = "ar"): Branch | undefined {
  const source = locale === "en" ? ALL_BRANCHES_EN : ALL_BRANCHES;
  return source.find((b) => b.slug === slug);
}

// تبويبات تصفية المنطقة محسوبة من قائمة فروع مُمرّرة (CMS أو ثابتة)
export function regionTabsFrom(source: Branch[], locale: Locale = "ar"): { name: string; count: number }[] {
  const allLabel = locale === "en" ? "All" : "الكل";
  const counts: Record<string, number> = {};
  for (const b of source) counts[b.region] = (counts[b.region] || 0) + 1;
  return [{ name: allLabel, count: source.length }, ...Object.entries(counts).map(([name, count]) => ({ name, count }))];
}

// تبويبات تصفية المنطقة (تُحسب من الفروع الثابتة)
export function regionTabs(locale: Locale = "ar"): { name: string; count: number }[] {
  return regionTabsFrom(locale === "en" ? BRANCHES_EN : BRANCHES, locale);
}

// مفتاح المناطق في الخريطة (أرقام تعريفية كما في الديزاين)
export const MAP_REGIONS = [
  { name: "الرياض", count: 8, color: "#2cbcc8" },
  { name: "مكة المكرمة", count: 8, color: "#f59e0b" },
  { name: "المنطقة الشرقية", count: 4, color: "#8b5cf6" },
  { name: "المدينة المنورة", count: 4, color: "#ec4899" },
  { name: "عسير", count: 3, color: "#10b981" },
  { name: "جدة", count: 3, color: "#3b82f6" },
  { name: "تبوك", count: 2, color: "#ef4444" },
];

export const MAP_REGIONS_EN = [
  { name: "Riyadh", count: 8, color: "#2cbcc8" },
  { name: "Makkah", count: 8, color: "#f59e0b" },
  { name: "Eastern Province", count: 4, color: "#8b5cf6" },
  { name: "Madinah", count: 4, color: "#ec4899" },
  { name: "Asir", count: 3, color: "#10b981" },
  { name: "Jeddah", count: 3, color: "#3b82f6" },
  { name: "Tabuk", count: 2, color: "#ef4444" },
];

export const BRANCH_FEATURES = [
  { title: "بيئةٌ مهيأة", desc: "مرافقُ مجهزةٌ بأحدث أدوات التأهيل والتقييم.", icon: "building" },
  { title: "العائلةُ في صلب التأهيل", desc: "نحرصُ على وجودكم معنا لنشاركّكم كل خطوة ونجاح.", icon: "heart" },
  { title: "برامجُ معتمدة", desc: "رحلةٌ تأهيليةٌ مدروسة، تُبنى على أسسٍ علميةٍ موثوقة.", icon: "shield" },
  { title: "روّادٌ متخصصون", desc: "نخبةٌ من الأخصائيين، يجمعون بين المعرفة التخصصية، والقدرة على استيعاب حاجة كل طفلٍ بدقة.", icon: "graduation" },
];

export const BRANCH_FEATURES_EN = [
  { title: "Prepared Environment", desc: "Facilities equipped with the latest rehabilitation and assessment tools.", icon: "building" },
  { title: "Family at the Core of Care", desc: "We ensure your presence at every step, sharing every progress and achievement.", icon: "heart" },
  { title: "Accredited Programs", desc: "Structured rehabilitation journeys built on trusted scientific foundations.", icon: "shield" },
  { title: "Specialized Pioneers", desc: "A team of experts combining professional knowledge with a precise understanding of each child's needs.", icon: "graduation" },
];
