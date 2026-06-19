// محتوى صفحة الأخصائيين — مطابق لديزاين Figma (node 64:5603)

import type { Locale } from "@/i18n/config";

export type Specialist = {
  slug: string;
  name: string;
  specialty: string;
  desc: string;
  image: string;
  days: string;
  branch: string;
  experience: string;
  hours: string;
  // تفاصيل المودال
  branches: string; // الفروع المتواجد بها
  about: string; // نبذة عن الأخصائي
  qualifications: string[]; // الشهادات والمؤهلات
};

export const SPECIALIST_STATS = [
  { value: "+8", label: "سنوات خبرة" },
  { value: "+30", label: "أخصائي متخصص" },
];

const DAYS = "الأحد – الخميس";
const BRANCH = "الفرع الرئيسي – الرياض";
const HOURS = "9:00 ص – 5:00 م";
const D_OT = "خبير في العلاج الطبيعي للأطفال وتأهيل الحالات العصبية والعضلية الهيكلية";
const D_SP = "متخصصة في اضطرابات النطق والكلام واللغة لدى الأطفال والمراهقين";
const D_BH = "متخصصة في تحليل السلوك التطبيقي ABA وتدريب الأطفال على المهارات الاجتماعية";

export const CONTACT_PROMPT = {
  title: "هل تريد التواصل مع هذا الأخصائي؟",
  subtitle: "اضغط على زر التواصل أدناه وسيتصل بكم فريقنا في أقرب وقت",
};

export const SPECIALISTS: Specialist[] = [
  {
    slug: "mohammed-abdullah", name: "د. محمد عبدالله", specialty: "علاج وظيفي", desc: D_OT,
    image: "/figma/specialists/sp1.jpg", days: DAYS, branch: BRANCH, experience: "6 سنوات خبرة", hours: HOURS,
    branches: "الرياض",
    about: "يتمتع الدكتور محمد بخبرة تمتد لأكثر من 6 سنوات في مجال العلاج الوظيفي للأطفال. متخصص في تأهيل الحالات العصبية والعضلية الهيكلية وتنمية المهارات الحركية الدقيقة، ويحرص على إشراك الأسرة في الخطة العلاجية لضمان أفضل النتائج.",
    qualifications: ["بكالوريوس العلاج الوظيفي - جامعة الملك سعود", "دبلوم التكامل الحسي للأطفال", "شهادة معتمدة في تأهيل الحالات العصبية"],
  },
  {
    slug: "sara-khaled", name: "د. سارة خالد", specialty: "تخاطب وتواصل", desc: D_SP,
    image: "/figma/specialists/sp2.jpg", days: DAYS, branch: BRANCH, experience: "3 سنوات خبرة", hours: HOURS,
    branches: "الرياض - جدة",
    about: "متخصصة في اضطرابات النطق والكلام واللغة لدى الأطفال والمراهقين، تتمتع بخبرة 3 سنوات في تقييم وعلاج تأخر اللغة واضطرابات التواصل، وتعتمد أحدث الأساليب العلاجية التفاعلية لتنمية مهارات التواصل.",
    qualifications: ["بكالوريوس علوم التخاطب - جامعة الملك سعود", "دبلوم اضطرابات التواصل واللغة", "شهادة معتمدة في التواصل المعزز والبديل (AAC)"],
  },
  {
    slug: "ahmed-alomari", name: "د. أحمد محمد العمري", specialty: "علاج وظيفي", desc: D_OT,
    image: "/figma/specialists/sp3.jpg", days: DAYS, branch: BRANCH, experience: "9 سنوات خبرة", hours: HOURS,
    branches: "الرياض - جده",
    about: "يتمتع الدكتور أحمد بخبرة واسعة تمتد لأكثر من 9 سنوات في مجال العلاج الوظيفي للأطفال. عمل في كبرى مراكز التأهيل في المنطقة وتخصص في تقييم وعلاج اضطرابات المعالجة الحسية، وتنمية المهارات الحركية الدقيقة، وتهيئة الأطفال للمرحلة الدراسية. يؤمن بأهمية المشاركة الأسرية في عملية التأهيل ويحرص على تدريب الوالدين.",
    qualifications: ["بكالوريوس العلاج الوظيفي - جامعة الملك سعود", "ماجستير تأهيل الأطفال - جامعة الإمارات", "شهادة SIPT في التكامل الحسي"],
  },
  {
    slug: "nada-fahd", name: "د. ندي فهد", specialty: "تخاطب وتواصل", desc: D_SP,
    image: "/figma/specialists/sp4.jpg", days: DAYS, branch: BRANCH, experience: "3 سنوات خبرة", hours: HOURS,
    branches: "الرياض",
    about: "متخصصة في اضطرابات النطق والكلام واللغة لدى الأطفال والمراهقين، بخبرة 3 سنوات في برامج التواصل المعزز والبديل وتنمية المهارات اللغوية، وتحرص على تصميم جلسات تفاعلية ممتعة تناسب كل طفل.",
    qualifications: ["بكالوريوس علوم التخاطب - جامعة الأميرة نورة", "دبلوم التخاطب الإكلينيكي", "شهادة معتمدة في تنمية المهارات اللغوية"],
  },
  {
    slug: "omar-faisal", name: "د. عمر فيصل", specialty: "علاج وظيفي", desc: D_OT,
    image: "/figma/specialists/sp5.jpg", days: DAYS, branch: BRANCH, experience: "6 سنوات خبرة", hours: HOURS,
    branches: "الرياض - جدة",
    about: "خبير في العلاج الطبيعي للأطفال وتأهيل الحالات العصبية والعضلية الهيكلية، بخبرة 6 سنوات في تنمية المهارات الحركية الدقيقة والكبرى، ويعتمد خطط تأهيل فردية تراعي احتياجات كل طفل.",
    qualifications: ["بكالوريوس العلاج الوظيفي - جامعة الملك سعود", "دبلوم العلاج الطبيعي للأطفال", "شهادة معتمدة في التكامل الحسي"],
  },
  {
    slug: "laila-ahmed", name: "د. ليلى أحمد", specialty: "تعديل سلوك", desc: D_BH,
    image: "/figma/specialists/sp6.jpg", days: DAYS, branch: BRANCH, experience: "9 سنوات خبرة", hours: HOURS,
    branches: "الرياض - جده",
    about: "متخصصة في تحليل السلوك التطبيقي ABA وتدريب الأطفال على المهارات الاجتماعية، بخبرة 9 سنوات في تصميم برامج تعديل السلوك الفردية وإشراك الأسرة في رحلة التطور.",
    qualifications: ["بكالوريوس علم النفس - جامعة الملك سعود", "ماجستير تحليل السلوك التطبيقي", "شهادة BCBA المعتمدة دولياً"],
  },
];

export const JOIN_CARDS = [
  { title: "فرص نمو", desc: "فرص ترقي حقيقية وبيئة داعمة تمكّنك من بناء مسيرة مهنية ناجحة ومستدامة.", icon: "growth" },
  { title: "بيئة عمل احترافية", desc: "انضم إلى بيئة طبية متطورة ومجهزة بأحدث التقنيات والأدوات العلاجية.", icon: "building" },
  { title: "تطوير مستمر", desc: "نوفر برامج تدريب وتطوير مستمرة لتعزيز مهاراتك المهنية وأحدث الممارسات العلاجية.", icon: "book" },
  { title: "تأثير حقيقي", desc: "كن جزءاً من رحلة تغيير حياة الأطفال وأسرهم، وأحدث فارقاً حقيقياً كل يوم.", icon: "heart" },
] as const;

// ===================== English mirrors =====================

export const SPECIALIST_STATS_EN = [
  { value: "+8", label: "Years of Experience" },
  { value: "+30", label: "Specialized Therapists" },
];

const DAYS_EN = "Sunday – Thursday";
const BRANCH_EN = "Main Branch – Riyadh";
const HOURS_EN = "9:00 AM – 5:00 PM";
const D_OT_EN = "Expert in pediatric physical therapy and the rehabilitation of neurological and musculoskeletal conditions";
const D_SP_EN = "Specialized in speech, language, and communication disorders in children and adolescents";
const D_BH_EN = "Specialized in Applied Behavior Analysis (ABA) and training children in social skills";

export const CONTACT_PROMPT_EN = {
  title: "Would you like to get in touch with this specialist?",
  subtitle: "Click the contact button below and our team will reach out to you as soon as possible",
};

export const SPECIALISTS_EN: Specialist[] = [
  {
    slug: "mohammed-abdullah", name: "Dr. Mohammed Abdullah", specialty: "Occupational Therapy", desc: D_OT_EN,
    image: "/figma/specialists/sp1.jpg", days: DAYS_EN, branch: BRANCH_EN, experience: "6 years of experience", hours: HOURS_EN,
    branches: "Riyadh",
    about: "Dr. Mohammed has more than 6 years of experience in pediatric occupational therapy. He specializes in rehabilitating neurological and musculoskeletal conditions and developing fine motor skills, and is keen to involve the family in the treatment plan to ensure the best outcomes.",
    qualifications: ["Bachelor's in Occupational Therapy – King Saud University", "Diploma in Sensory Integration for Children", "Certified in Rehabilitation of Neurological Conditions"],
  },
  {
    slug: "sara-khaled", name: "Dr. Sara Khaled", specialty: "Speech & Language Therapy", desc: D_SP_EN,
    image: "/figma/specialists/sp2.jpg", days: DAYS_EN, branch: BRANCH_EN, experience: "3 years of experience", hours: HOURS_EN,
    branches: "Riyadh – Jeddah",
    about: "Specialized in speech, language, and communication disorders in children and adolescents, with 3 years of experience in assessing and treating language delays and communication disorders. She adopts the latest interactive therapeutic methods to develop communication skills.",
    qualifications: ["Bachelor's in Speech Sciences – King Saud University", "Diploma in Communication & Language Disorders", "Certified in Augmentative and Alternative Communication (AAC)"],
  },
  {
    slug: "ahmed-alomari", name: "Dr. Ahmed Mohammed Al-Omari", specialty: "Occupational Therapy", desc: D_OT_EN,
    image: "/figma/specialists/sp3.jpg", days: DAYS_EN, branch: BRANCH_EN, experience: "9 years of experience", hours: HOURS_EN,
    branches: "Riyadh – Jeddah",
    about: "Dr. Ahmed brings extensive experience spanning more than 9 years in pediatric occupational therapy. He has worked in the region's leading rehabilitation centers and specializes in assessing and treating sensory processing disorders, developing fine motor skills, and preparing children for school. He believes in the importance of family involvement in the rehabilitation process and is keen to train parents.",
    qualifications: ["Bachelor's in Occupational Therapy – King Saud University", "Master's in Pediatric Rehabilitation – UAE University", "SIPT Certification in Sensory Integration"],
  },
  {
    slug: "nada-fahd", name: "Dr. Nada Fahd", specialty: "Speech & Language Therapy", desc: D_SP_EN,
    image: "/figma/specialists/sp4.jpg", days: DAYS_EN, branch: BRANCH_EN, experience: "3 years of experience", hours: HOURS_EN,
    branches: "Riyadh",
    about: "Specialized in speech, language, and communication disorders in children and adolescents, with 3 years of experience in augmentative and alternative communication programs and language skills development. She is keen to design fun, interactive sessions tailored to each child.",
    qualifications: ["Bachelor's in Speech Sciences – Princess Nourah University", "Diploma in Clinical Speech Therapy", "Certified in Language Skills Development"],
  },
  {
    slug: "omar-faisal", name: "Dr. Omar Faisal", specialty: "Occupational Therapy", desc: D_OT_EN,
    image: "/figma/specialists/sp5.jpg", days: DAYS_EN, branch: BRANCH_EN, experience: "6 years of experience", hours: HOURS_EN,
    branches: "Riyadh – Jeddah",
    about: "Expert in pediatric physical therapy and the rehabilitation of neurological and musculoskeletal conditions, with 6 years of experience in developing fine and gross motor skills. He adopts individualized rehabilitation plans that take into account each child's needs.",
    qualifications: ["Bachelor's in Occupational Therapy – King Saud University", "Diploma in Pediatric Physical Therapy", "Certified in Sensory Integration"],
  },
  {
    slug: "laila-ahmed", name: "Dr. Laila Ahmed", specialty: "Behavior Modification", desc: D_BH_EN,
    image: "/figma/specialists/sp6.jpg", days: DAYS_EN, branch: BRANCH_EN, experience: "9 years of experience", hours: HOURS_EN,
    branches: "Riyadh – Jeddah",
    about: "Specialized in Applied Behavior Analysis (ABA) and training children in social skills, with 9 years of experience in designing individualized behavior modification programs and involving the family in the development journey.",
    qualifications: ["Bachelor's in Psychology – King Saud University", "Master's in Applied Behavior Analysis", "Internationally Certified BCBA"],
  },
];

export const JOIN_CARDS_EN = [
  { title: "Growth Opportunities", desc: "Real opportunities for advancement and a supportive environment that empowers you to build a successful, sustainable career.", icon: "growth" },
  { title: "Professional Work Environment", desc: "Join an advanced medical environment equipped with the latest technologies and therapeutic tools.", icon: "building" },
  { title: "Continuous Development", desc: "We provide ongoing training and development programs to enhance your professional skills and the latest therapeutic practices.", icon: "book" },
  { title: "Real Impact", desc: "Be part of a journey that changes the lives of children and their families, and make a real difference every day.", icon: "heart" },
] as const;

// ===================== Locale-aware getters =====================

export function getSpecialists(locale: Locale = "ar"): Specialist[] {
  return locale === "en" ? SPECIALISTS_EN : SPECIALISTS;
}

export function getSpecialist(slug: string, locale: Locale = "ar"): Specialist | undefined {
  return getSpecialists(locale).find((s) => s.slug === slug);
}

export function getSpecialistStats(locale: Locale = "ar") {
  return locale === "en" ? SPECIALIST_STATS_EN : SPECIALIST_STATS;
}

export function getContactPrompt(locale: Locale = "ar") {
  return locale === "en" ? CONTACT_PROMPT_EN : CONTACT_PROMPT;
}

export function getJoinCards(locale: Locale = "ar") {
  return locale === "en" ? JOIN_CARDS_EN : JOIN_CARDS;
}
