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
      contactTitle: "خذ الخطوة لعبور",
      mainBranch: "الرياض ( الفرع الرئيسي )",
      privacy: "سياسة الخصوصية",
      rights: "© 2026 مركز عبور للرعاية والتأهيل. جميع الحقوق محفوظة.",
      quick: { about: "عن عبور", services: "برامجنا التمكينية", branches: "مراكزنا", programs: "البرامج التأهيلية", blog: "المدوّنة والمقالات", contact: "خذ الخطوة لعبور" },
      services: [
        { label: "التدخل المبكر", href: "/programs" },
        { label: "النطق والتخاطب", href: "/services/speech" },
        { label: "العلاج الوظيفي", href: "/services/occupational" },
        { label: "العلاج الفيزيائي", href: "/services/physical" },
        { label: "التحليل السلوكي التطبيقي (ABA)", href: "/programs" },
        { label: "الدعم التربوي والأكاديمي", href: "/programs" },
      ],
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
      contactTitle: "Take the Step to Oboor",
      mainBranch: "Riyadh (Main Branch)",
      privacy: "Privacy Policy",
      rights: "© 2026 Oboor Center for Care & Rehabilitation. All rights reserved.",
      quick: { about: "About Us", services: "Services", branches: "Branches", programs: "Rehabilitation Programs", blog: "Blog & Articles", contact: "Take the Step to Oboor" },
      services: [
        { label: "Early Intervention", href: "/programs" },
        { label: "Speech & Language Therapy", href: "/services/speech" },
        { label: "Occupational Therapy", href: "/services/occupational" },
        { label: "Physical Therapy", href: "/services/physical" },
        { label: "Applied Behavior Analysis (ABA)", href: "/programs" },
        { label: "Educational & Academic Support", href: "/programs" },
      ],
    },
  },
} as const;

export function getCommon(locale: Locale) {
  return common[locale];
}
export type Common = (typeof common)["ar"];
