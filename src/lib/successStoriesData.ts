// محتوى صفحة قصص النجاح — مطابق لديزاين Figma (node 64:7181)

import type { Locale } from "@/i18n/config";

export type SuccessStory = {
  slug: string;
  name: string;
  age: string; // مثال: "3 سنوات"
  image: string;
  category: string; // شارة الفئة أعلى الصورة
  durationLabel: string; // شارة المدة أسفل الصورة
  before: string; // قبل الالتحاق
  after: string; // بعد البرنامج
  quote: string;
  metaDuration: string; // مدة العلاج (أيقونة الساعة)
  metaAge: string; // أيقونة المجموعة
  author: string; // راوي القصة (أيقونة الشخص)
};

export const SUCCESS_STATS = [
  { value: "+1300", label: "جلسة تأهيل شهريًا" },
  { value: "96%", label: "نسبة التحسن المُسجّلة" },
  { value: "+500", label: "قصة نجاح موثّقة" },
];

export const SUCCESS_STORIES: SuccessStory[] = [
  {
    slug: "tameem",
    name: "تميم",
    age: "3 سنوات",
    image: "/figma/success-stories/tameem.jpg",
    category: "علاج النطق واللغة",
    durationLabel: "٢ شهراً من جلسات النطق",
    before: "كان يعاني من صعوبات شديدة في النطق",
    after: "تحدث بطلاقة وثقة عالية في المواقف اليومية",
    quote: "الفريق المتخصص في عبور لم يعامل تميم كحالة، بل كإنسانة تستحق كل الاهتمام.",
    metaDuration: "3 أشهر",
    metaAge: "3 سنوات",
    author: "أم تميم",
  },
  {
    slug: "fahd",
    name: "فهد",
    age: "3 سنوات",
    image: "/figma/success-stories/fahd.jpg",
    category: "علاج النطق واللغة",
    durationLabel: "٢ شهراً من جلسات النطق",
    before: "لم يكن يستطيع التواصل بشكل مستقل",
    after: "بات يتواصل بجمل كاملة وينخرط في الأنشطة الاجتماعية",
    quote: "مركز عبور غيّر حياة ابني تماماً. رأيت تطوراً لم أكن أتخيله ممكناً",
    metaDuration: "3 أشهر",
    metaAge: "3 سنوات",
    author: "أم فهد",
  },
  {
    slug: "sara",
    name: "سارة",
    age: "٨ سنوات",
    image: "/figma/success-stories/sara.jpg",
    category: "علاج النطق واللغة",
    durationLabel: "٢ شهراً من جلسات النطق",
    before: "كانت تعاني من صعوبات شديدة في النطق",
    after: "تتحدث بطلاقة وثقة عالية في المواقف اليومية",
    quote: "الفريق المتخصص في عبور لم يعامل سارة كحالة، بل كإنسانة تستحق كل الاهتمام.",
    metaDuration: "3 أشهر",
    metaAge: "٥ سنوات",
    author: "أم ساره",
  },
  {
    slug: "aseel",
    name: "اسيل",
    age: "6 سنوات",
    image: "/figma/success-stories/aseel.jpg",
    category: "علاج النطق واللغة",
    durationLabel: "٢ شهراً من جلسات النطق",
    before: "كانت تعاني من صعوبات شديدة في النطق",
    after: "تتحدث بطلاقة وثقة عالية في المواقف اليومية",
    quote: "الفريق المتخصص في عبور لم يعامل اسيل، بل كإنسانة تستحق كل الاهتمام.",
    metaDuration: "3 أشهر",
    metaAge: "6 سنوات",
    author: "أم اسيل",
  },
  {
    slug: "maryam",
    name: "مريم",
    age: "10 سنوات",
    image: "/figma/success-stories/maryam.jpg",
    category: "علاج النطق واللغة",
    durationLabel: "٢ شهراً من جلسات النطق",
    before: "كانت تعاني من صعوبات شديدة في النطق",
    after: "تتحدث بطلاقة وثقة عالية في المواقف اليومية",
    quote: "الفريق المتخصص في عبور لم يعامل مريم كحالة، بل كإنسانة تستحق كل الاهتمام.",
    metaDuration: "3 أشهر",
    metaAge: "10 سنوات",
    author: "أم مريم",
  },
  {
    slug: "omar",
    name: "عمر",
    age: "4 سنوات",
    image: "/figma/success-stories/omar.jpg",
    category: "علاج النطق واللغة",
    durationLabel: "٢ شهراً من جلسات النطق",
    before: "كان يعاني من صعوبات شديدة في النطق",
    after: "تحدث بطلاقة وثقة عالية في المواقف اليومية",
    quote: "الفريق المتخصص في عبور لم يعامل عمر كحالة، بل كإنسانة تستحق كل الاهتمام.",
    metaDuration: "3 أشهر",
    metaAge: "٥ سنوات",
    author: "أم عمر",
  },
];

export const SUCCESS_STATS_EN = [
  { value: "+1300", label: "rehabilitation sessions per month" },
  { value: "96%", label: "recorded improvement rate" },
  { value: "+500", label: "documented success stories" },
];

export const SUCCESS_STORIES_EN: SuccessStory[] = [
  {
    slug: "tameem",
    name: "Tameem",
    age: "3 years",
    image: "/figma/success-stories/tameem.jpg",
    category: "Speech & Language Therapy",
    durationLabel: "2 months of speech sessions",
    before: "He suffered from severe speech difficulties",
    after: "He speaks fluently and with confidence in everyday situations",
    quote: "The specialized team at Oboor did not treat Tameem as a case, but as a person who deserves every attention.",
    metaDuration: "3 months",
    metaAge: "3 years",
    author: "Tameem's mother",
  },
  {
    slug: "fahd",
    name: "Fahd",
    age: "3 years",
    image: "/figma/success-stories/fahd.jpg",
    category: "Speech & Language Therapy",
    durationLabel: "2 months of speech sessions",
    before: "He was unable to communicate independently",
    after: "He now communicates in full sentences and takes part in social activities",
    quote: "Oboor Center completely changed my son's life. I saw progress I never imagined possible.",
    metaDuration: "3 months",
    metaAge: "3 years",
    author: "Fahd's mother",
  },
  {
    slug: "sara",
    name: "Sara",
    age: "8 years",
    image: "/figma/success-stories/sara.jpg",
    category: "Speech & Language Therapy",
    durationLabel: "2 months of speech sessions",
    before: "She suffered from severe speech difficulties",
    after: "She speaks fluently and with confidence in everyday situations",
    quote: "The specialized team at Oboor did not treat Sara as a case, but as a person who deserves every attention.",
    metaDuration: "3 months",
    metaAge: "5 years",
    author: "Sara's mother",
  },
  {
    slug: "aseel",
    name: "Aseel",
    age: "6 years",
    image: "/figma/success-stories/aseel.jpg",
    category: "Speech & Language Therapy",
    durationLabel: "2 months of speech sessions",
    before: "She suffered from severe speech difficulties",
    after: "She speaks fluently and with confidence in everyday situations",
    quote: "The specialized team at Oboor did not treat Aseel as a case, but as a person who deserves every attention.",
    metaDuration: "3 months",
    metaAge: "6 years",
    author: "Aseel's mother",
  },
  {
    slug: "maryam",
    name: "Maryam",
    age: "10 years",
    image: "/figma/success-stories/maryam.jpg",
    category: "Speech & Language Therapy",
    durationLabel: "2 months of speech sessions",
    before: "She suffered from severe speech difficulties",
    after: "She speaks fluently and with confidence in everyday situations",
    quote: "The specialized team at Oboor did not treat Maryam as a case, but as a person who deserves every attention.",
    metaDuration: "3 months",
    metaAge: "10 years",
    author: "Maryam's mother",
  },
  {
    slug: "omar",
    name: "Omar",
    age: "4 years",
    image: "/figma/success-stories/omar.jpg",
    category: "Speech & Language Therapy",
    durationLabel: "2 months of speech sessions",
    before: "He suffered from severe speech difficulties",
    after: "He speaks fluently and with confidence in everyday situations",
    quote: "The specialized team at Oboor did not treat Omar as a case, but as a person who deserves every attention.",
    metaDuration: "3 months",
    metaAge: "5 years",
    author: "Omar's mother",
  },
];

// تفاصيل إضافية تظهر في نافذة "عرض التفاصيل" (موحّدة لأن جميع القصص ضمن علاج النطق واللغة)
export const STORY_HIGHLIGHTS = {
  ar: {
    badge: "حياة جديدة وثقة",
    durationLabel: "المدة",
    ageLabel: "العمر",
    programLabel: "البرنامج",
    program: "علاج النطق واللغة",
    specialistTitle: "من الأخصائي",
    journeyTitle: "رحلة العلاج",
    journeyTemplate: (name: string) =>
      `التحق ${name} ببرنامج مكثّف لعلاج النطق واللغة، ركّزت جلساته على تحفيز النطق وبناء المفردات وتمارين التواصل، مع إشراك الأسرة في التطبيق المنزلي.`,
    resultsTitle: "أبرز النتائج",
    results: [
      "نطق واضح للحروف والكلمات",
      "تكوين جُمل كاملة ومترابطة",
      "تواصل اجتماعي بثقة في المواقف اليومية",
      "تحسّن ملحوظ في التفاعل داخل الفصل",
    ],
    storyTitle: "كلمة ولي الأمر",
  },
  en: {
    badge: "A new life & confidence",
    durationLabel: "Duration",
    ageLabel: "Age",
    programLabel: "Program",
    program: "Speech & Language Therapy",
    specialistTitle: "From the specialist",
    journeyTitle: "Treatment Journey",
    journeyTemplate: (name: string) =>
      `${name} joined an intensive Speech & Language Therapy program focused on stimulating speech, building vocabulary, and communication exercises, with the family involved in home practice.`,
    resultsTitle: "Key Results",
    results: [
      "Clear pronunciation of letters and words",
      "Building complete, coherent sentences",
      "Confident social communication in everyday situations",
      "Noticeable improvement in classroom interaction",
    ],
    storyTitle: "Parent's Words",
  },
} as const;

export function getStoryHighlights(locale: Locale = "ar") {
  return locale === "en" ? STORY_HIGHLIGHTS.en : STORY_HIGHLIGHTS.ar;
}

export function getSuccessStats(locale: Locale = "ar") {
  return locale === "en" ? SUCCESS_STATS_EN : SUCCESS_STATS;
}

export function getSuccessStories(locale: Locale = "ar"): SuccessStory[] {
  return locale === "en" ? SUCCESS_STORIES_EN : SUCCESS_STORIES;
}

export function getSuccessStory(
  slug: string,
  locale: Locale = "ar"
): SuccessStory | undefined {
  return getSuccessStories(locale).find((s) => s.slug === slug);
}
