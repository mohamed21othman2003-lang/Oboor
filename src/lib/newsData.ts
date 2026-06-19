// محتوى صفحة اخبارنا — مطابق لديزاين Figma (node 148:5987)
// الصور placeholder من أصول الموقع الحالية (قابلة للاستبدال).

export type NewsItem = {
  slug: string;
  title: string;
  desc: string;
  date: string;
  category: string;
  image: string;
};

import { type Locale } from "@/i18n/config";

export const NEWS_CATEGORIES = [
  { label: "الكل", count: 7 },
  { label: "أخبار المراكز" },
  { label: "الفعاليات" },
  { label: "الورش التدريبية" },
  { label: "التوعية الأسرية" },
];

export const NEWS_CATEGORIES_EN = [
  { label: "All", count: 7 },
  { label: "Center News" },
  { label: "Events" },
  { label: "Training Workshops" },
  { label: "Family Awareness" },
];

export const WORKSHOP_FEATURED: NewsItem = {
  slug: "language-support-workshop",
  title: 'ورشة "دعم التواصل اللغوي في المنزل" للأسر',
  desc: "ورشة تدريبية متخصصة تُقدّمها أخصائية علاج النطق لمساعدة الأسر على تعزيز مهارات التواصل واللغة لدى أطفالهم من خلال أنشطة عملية بسيطة يمكن تطبيقها في المنزل.",
  date: "١٥ مارس ٢٠٢٥",
  category: "ورشة تدريبية",
  image: `/figma/news/wf.jpg`,
};

export const WORKSHOP_FEATURED_EN: NewsItem = {
  slug: "language-support-workshop",
  title: '"Supporting Language Communication at Home" Workshop for Families',
  desc: "A specialized training workshop delivered by a speech-language therapist to help families strengthen their child's communication and language skills through simple, practical activities that can be applied at home.",
  date: "March 15, 2025",
  category: "Training Workshop",
  image: `/figma/news/wf.jpg`,
};

export const WORKSHOPS: NewsItem[] = [
  { slug: "sensory-integration-workshop", title: "ورشة التكامل الحسي للآباء والأمهات", desc: "تعريف الأسر بمبادئ التكامل الحسي وكيفية إنشاء بيئة منزلية داعمة تساعد الطفل على تنظيم استجاباته الحسية.", date: "٢ مارس ٢٠٢٥", category: "ورشة تدريبية", image: `/figma/news/ws1.jpg` },
  { slug: "behavior-management-workshop", title: "ورشة إدارة السلوك للآباء والأمهات", desc: "استراتيجيات عملية لتعديل السلوك وتعزيز السلوكيات الإيجابية لدى الأطفال ضمن الروتين اليومي.", date: "٢ مارس ٢٠٢٥", category: "ورشة تدريبية", image: `/figma/news/ws2.jpg` },
  { slug: "communication-workshop", title: "ورشة تنمية مهارات التواصل المبكر", desc: "تزويد الأسر بأدوات تحفيز التواصل المبكر لدى الأطفال في مرحلة ما قبل الكلام عبر اللعب والتفاعل.", date: "٢ مارس ٢٠٢٥", category: "ورشة تدريبية", image: `/figma/news/ws3.jpg` },
];

export const WORKSHOPS_EN: NewsItem[] = [
  { slug: "sensory-integration-workshop", title: "Sensory Integration Workshop for Parents", desc: "Introducing families to the principles of sensory integration and how to create a supportive home environment that helps the child regulate their sensory responses.", date: "March 2, 2025", category: "Training Workshop", image: `/figma/news/ws1.jpg` },
  { slug: "behavior-management-workshop", title: "Behavior Management Workshop for Parents", desc: "Practical strategies for behavior modification and reinforcing positive behaviors in children within the daily routine.", date: "March 2, 2025", category: "Training Workshop", image: `/figma/news/ws2.jpg` },
  { slug: "communication-workshop", title: "Early Communication Skills Development Workshop", desc: "Equipping families with tools to stimulate early communication in pre-verbal children through play and interaction.", date: "March 2, 2025", category: "Training Workshop", image: `/figma/news/ws3.jpg` },
];

export const CENTER_NEWS: NewsItem[] = [
  { slug: "international-accreditation", title: "عبور تُجدّد اعتمادها الدولي في خدمات التأهيل", desc: "حصلت مراكز عبور على تجديد الاعتماد الدولي تقديراً لالتزامها بأعلى معايير الجودة في خدمات التأهيل والرعاية.", date: "٢ مارس ٢٠٢٥", category: "أخبار المراكز", image: `/figma/news/nw1.jpg` },
  { slug: "new-branch-opening", title: "افتتاح فرع جديد لمراكز عبور في المنطقة الشرقية", desc: "توسّعاً في حضورنا بالمملكة، افتتحت مراكز عبور فرعاً جديداً مجهزاً بأحدث التقنيات لخدمة أسر المنطقة الشرقية.", date: "٢ مارس ٢٠٢٥", category: "أخبار المراكز", image: `/figma/news/nw2.jpg` },
  { slug: "partnership", title: "شراكة استراتيجية لتطوير برامج التدخل المبكر", desc: "وقّعت مراكز عبور شراكة مع جهات متخصصة لتطوير وتوسيع برامج التدخل المبكر للأطفال في مختلف المناطق.", date: "٢ مارس ٢٠٢٥", category: "أخبار المراكز", image: `/figma/news/nw3.jpg` },
];

export const CENTER_NEWS_EN: NewsItem[] = [
  { slug: "international-accreditation", title: "Oboor Renews Its International Accreditation in Rehabilitation Services", desc: "Oboor Centers have earned the renewal of their international accreditation in recognition of their commitment to the highest quality standards in rehabilitation and care services.", date: "March 2, 2025", category: "Center News", image: `/figma/news/nw1.jpg` },
  { slug: "new-branch-opening", title: "Oboor Centers Open a New Branch in the Eastern Province", desc: "Expanding our presence across the Kingdom, Oboor Centers have opened a new branch equipped with the latest technologies to serve families in the Eastern Province.", date: "March 2, 2025", category: "Center News", image: `/figma/news/nw2.jpg` },
  { slug: "partnership", title: "Strategic Partnership to Develop Early Intervention Programs", desc: "Oboor Centers have signed a partnership with specialized entities to develop and expand Early Intervention programs for children across various regions.", date: "March 2, 2025", category: "Center News", image: `/figma/news/nw3.jpg` },
];

export const EVENTS: NewsItem[] = [
  { slug: "autism-awareness-day", title: "يوم التوعية بالتوحد — فعالية الباب المفتوح في الرياض", desc: "تحتفل مراكز عبور باليوم العالمي للتوعية بالتوحد بفعالية الباب المفتوح، تتضمن ورشاً تفاعلية وأنشطة لأسر المستفيدين والزوار للتعريف بخدمات التأهيل.", date: "٢ أبريل ٢٠٢٥", category: "فعاليات", image: `/figma/news/ev1.jpg` },
  { slug: "family-day", title: "اليوم العائلي السنوي لأسر المستفيدين", desc: "يوم ترفيهي وتوعوي يجمع أسر المستفيدين والكوادر في أجواء عائلية مميزة تعزّز الترابط وتبادل الخبرات بين الأسر.", date: "٢ أبريل ٢٠٢٥", category: "فعاليات", image: `/figma/news/ev2.jpg` },
];

export const EVENTS_EN: NewsItem[] = [
  { slug: "autism-awareness-day", title: "Autism Awareness Day — Open House Event in Riyadh", desc: "Oboor Centers celebrate World Autism Awareness Day with an open house event featuring interactive workshops and activities for beneficiaries' families and visitors to introduce our rehabilitation services.", date: "April 2, 2025", category: "Events", image: `/figma/news/ev1.jpg` },
  { slug: "family-day", title: "Annual Family Day for Beneficiaries' Families", desc: "A day of recreation and awareness bringing together beneficiaries' families and staff in a special family atmosphere that strengthens bonds and the exchange of experiences among families.", date: "April 2, 2025", category: "Events", image: `/figma/news/ev2.jpg` },
];

export const ARTICLE_FEATURED: NewsItem = {
  slug: "support-child-at-home",
  title: "كيف تدعم طفلك في المنزل بعد جلسات العلاج؟",
  desc: "دليل عملي للأسر يشرح كيفية استكمال التمارين العلاجية في المنزل وتعزيز ما يتعلّمه الطفل خلال الجلسات لتحقيق أفضل النتائج.",
  date: "٨ مارس ٢٠٢٥",
  category: "توعية أسرية",
  image: `/figma/news/af.jpg`,
};

export const ARTICLE_FEATURED_EN: NewsItem = {
  slug: "support-child-at-home",
  title: "How to Support Your Child at Home After Therapy Sessions",
  desc: "A practical guide for families explaining how to continue therapeutic exercises at home and reinforce what the child learns during sessions to achieve the best results.",
  date: "March 8, 2025",
  category: "Family Awareness",
  image: `/figma/news/af.jpg`,
};

export const ARTICLES: NewsItem[] = [
  { slug: "language-delay-signs", title: "علامات التأخر اللغوي عند الأطفال — متى تطلب المساعدة؟", desc: "يشرح هذا المقال علامات التأخر في اللغة والكلام حسب العمر، ومتى ينبغي استشارة الأخصائي.", date: "١ مارس ٢٠٢٥", category: "توعية أسرية", image: `/figma/news/ar1.jpg` },
  { slug: "understanding-autism", title: "فهم التوحد: دليل الأسرة للمرحلة الأولى", desc: "دليل شامل ومبسّط يُساعد الأسر على فهم تشخيص اضطراب طيف التوحد والخطوات الأولى بعده.", date: "١٨ فبراير ٢٠٢٥", category: "توعية أسرية", image: `/figma/news/ar2.jpg` },
  { slug: "occupational-therapy-meaning", title: "العلاج الوظيفي — ماذا يعني لطفلي؟", desc: "شرح وافٍ لمفهوم العلاج الوظيفي وأهدافه وما يمكن للطفل أن يكتسبه من خلاله.", date: "٥ فبراير ٢٠٢٥", category: "توعية أسرية", image: `/figma/news/ar3.jpg` },
];

export const ARTICLES_EN: NewsItem[] = [
  { slug: "language-delay-signs", title: "Signs of Language Delay in Children — When to Seek Help?", desc: "This article explains the signs of language and speech delay by age, and when you should consult a specialist.", date: "March 1, 2025", category: "Family Awareness", image: `/figma/news/ar1.jpg` },
  { slug: "understanding-autism", title: "Understanding Autism: A Family's Guide to the First Stage", desc: "A comprehensive yet simple guide to help families understand an Autism Spectrum Disorder diagnosis and the first steps afterward.", date: "February 18, 2025", category: "Family Awareness", image: `/figma/news/ar2.jpg` },
  { slug: "occupational-therapy-meaning", title: "Occupational Therapy — What Does It Mean for My Child?", desc: "A thorough explanation of the concept of Occupational Therapy, its goals, and what your child can gain from it.", date: "February 5, 2025", category: "Family Awareness", image: `/figma/news/ar3.jpg` },
];

export const ALL_NEWS: NewsItem[] = [
  WORKSHOP_FEATURED, ...WORKSHOPS, ...CENTER_NEWS, ...EVENTS, ARTICLE_FEATURED, ...ARTICLES,
];

export const ALL_NEWS_EN: NewsItem[] = [
  WORKSHOP_FEATURED_EN, ...WORKSHOPS_EN, ...CENTER_NEWS_EN, ...EVENTS_EN, ARTICLE_FEATURED_EN, ...ARTICLES_EN,
];

export function getNewsItem(slug: string, locale: Locale = "ar"): NewsItem | undefined {
  const list = locale === "en" ? ALL_NEWS_EN : ALL_NEWS;
  return list.find((n) => n.slug === slug);
}
