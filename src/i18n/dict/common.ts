// قاموس العناصر المشتركة (Navbar / Footer / أزرار متكررة)
import type { Locale } from "@/i18n/config";

const common = {
  ar: {
    nav: {
      home: "الرئيسية", about: "عن عبور", news: "إعلامنا", programs: "برامجنا التمكينية",
      branches: "مراكزنا", success: "أبطال عبور", specialists: "روّادنا",
      gallery: "المعرض", careers: "انضم إلينا", assessment: "التقييم",
    },
    admission: "طلب التحاق",
    contact: "خذ الخطوة لعبور",
    menu: "القائمة",
    langLabel: "English",
    footer: {
      brandDesc: "مركز عبور للرعاية والتأهيل — وجهتكم المتخصصة في دعم أطفالكم وتمكين أسرهم من خلال برامج تأهيلية شاملة.",
      quickLinks: "روابط سريعة",
      servicesTitle: "خدماتنا",
      contactTitle: "تواصل معنا",
      mainBranch: "الرياض ( الفرع الرئيسي )",
      privacy: "سياسة الخصوصية",
      rights: "© 2026 مركز عبور للرعاية والتأهيل. جميع الحقوق محفوظة.",
      quick: { about: "من نحن", services: "خدماتنا", branches: "فروعنا", programs: "البرامج التأهيلية", blog: "المدوّنة والمقالات", contact: "تواصل معنا" },
      services: ["التدخل المبكر", "النطق والتخاطب", "العلاج الوظيفي", "العلاج الفيزيائي", "التحليل السلوكي التطبيقي (ABA)", "الدعم التربوي والأكاديمي"],
    },
  },
  en: {
    nav: {
      home: "Home", about: "About Oboor", news: "Our Media", programs: "Our Empowerment Programs",
      branches: "Our Centers", success: "Oboor Champions", specialists: "Our Pioneers",
      gallery: "Gallery", careers: "Join Us", assessment: "Assessment",
    },
    admission: "Apply Now",
    contact: "Take the Step to Oboor",
    menu: "Menu",
    langLabel: "العربية",
    footer: {
      brandDesc: "Oboor Center for Care & Rehabilitation — your specialized destination for supporting your children and empowering their families through comprehensive rehabilitation programs.",
      quickLinks: "Quick Links",
      servicesTitle: "Our Services",
      contactTitle: "Contact Us",
      mainBranch: "Riyadh (Main Branch)",
      privacy: "Privacy Policy",
      rights: "© 2026 Oboor Center for Care & Rehabilitation. All rights reserved.",
      quick: { about: "About Us", services: "Services", branches: "Branches", programs: "Rehabilitation Programs", blog: "Blog & Articles", contact: "Contact Us" },
      services: ["Early Intervention", "Speech & Language Therapy", "Occupational Therapy", "Physical Therapy", "Applied Behavior Analysis (ABA)", "Educational & Academic Support"],
    },
  },
} as const;

export function getCommon(locale: Locale) {
  return common[locale];
}
export type Common = (typeof common)["ar"];
