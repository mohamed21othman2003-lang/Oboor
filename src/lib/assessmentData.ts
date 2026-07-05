// محتوى صفحة التقييم (قيّم ابنك) — مطابق لديزاين Figma (node 1:10085)

import { type Locale } from "@/i18n/config";

export type Assessment = {
  slug: string;
  title: string;
  desc: string;
  icon: string;
  duration: string;
  questions: string;
  ageRange: string;
};

export const ASSESS_STATS = [
  { value: "٢٤ ساعة", label: "استجابة سريعة" },
  { value: "٩٨٪", label: "رضا الأهل" },
  { value: "+٥٠٠", label: "أسرة استفادت" },
];

export const ASSESS_FEATURES = [
  { title: "تقليل القلق لدى الأسرة", desc: "نساعدك على فهم وضع طفلك بوضوح ونطمئنك بخطة عمل واضحة ومجرّبة.", icon: "heart" },
  { title: "تحديد التدخل المناسب", desc: "نقترح البرامج والخدمات الأنسب لحالة طفلك بناءً على نتائج التقييم.", icon: "target" },
  { title: "فهم نقاط القوة والضعف", desc: "نكشف ما يتميّز به طفلك ونحدّد المجالات التي تحتاج إلى دعم إضافي.", icon: "chart" },
  { title: "اكتشاف مبكر للصعوبات", desc: "التعرّف المبكر على أي تحديات يواجهها طفلك يفتح باب التدخل في الوقت المناسب.", icon: "search" },
];

export const ASSESS_STEPS = [
  { title: "اختر التقييم المناسب", desc: "حدّد نوع التقييم الأنسب لطفلك من القائمة.", icon: "question" },
  { title: "الإجابة على الأسئلة", desc: "أجب عن أسئلة بسيطة وواضحة عن طفلك.", icon: "list" },
  { title: "اضف بياناتك", desc: "أدخل بيانات التواصل لاستلام النتيجة.", icon: "briefcase" },
  { title: "نتائج التقييم الأولي", desc: "احصل على نتيجة فورية وتوصية مناسبة.", icon: "bulb" },
];

export const ASSESSMENTS: Assessment[] = [
  { slug: "speech", title: "فحص النطق", desc: "فحص اضطرابات النطق واللغة والتواصل عند الأطفال.", icon: "chat", duration: "6 دقائق", questions: "10 أسئلة", ageRange: "4 - 12 سنة" },
  { slug: "adhd", title: "تقييم ADHD", desc: "تقييم أعراض اضطراب نقص الانتباه وفرط الحركة لدى الأطفال.", icon: "bolt", duration: "4 دقائق", questions: "12 سؤالاً", ageRange: "4 - 13 سنة" },
  { slug: "mchat", title: "M-CHAT", desc: "قائمة تدقيق معدّلة للكشف المبكر عن طيف التوحد لدى الأطفال الصغار.", icon: "puzzle", duration: "5 دقائق", questions: "20 سؤالاً", ageRange: "16 - 30 شهراً" },
  { slug: "learning", title: "صعوبات التعلم", desc: "تقييم مؤشرات صعوبات التعلم الأكاديمية والإدراكية.", icon: "book", duration: "7 دقائق", questions: "14 سؤالاً", ageRange: "6 - 14 سنة" },
  { slug: "social", title: "المهارات الاجتماعية", desc: "تقييم مهارات التفاعل الاجتماعي والتواصل مع الأقران.", icon: "users", duration: "5 دقائق", questions: "12 سؤالاً", ageRange: "4 - 12 سنة" },
  { slug: "sensory", title: "الملف الحسي", desc: "تقييم الاستجابات الحسية ومعالجة المعلومات الحسية عند الطفل.", icon: "sensory", duration: "6 دقائق", questions: "15 سؤالاً", ageRange: "3 - 10 سنوات" },
];

export const PRELIM_QUESTIONS = [
  "هل يتواصل طفلك بالكلام بشكل يناسب عمره؟",
  "هل يستجيب طفلك عند مناداته باسمه؟",
  "هل يتفاعل طفلك مع الأطفال الآخرين أثناء اللعب؟",
  "هل يستطيع طفلك التركيز في مهمة واحدة لفترة مناسبة؟",
  "هل يتّبع طفلك التعليمات البسيطة دون صعوبة؟",
];

// أسئلة مخصّصة لكل نوع تقييم (مصاغة بصيغة إيجابية: نعم = جيد)
export const ASSESS_QUESTIONS: Record<string, string[]> = {
  speech: [
    "هل ينطق طفلك الكلمات بوضوح يناسب عمره؟",
    "هل يكوّن طفلك جملاً مفيدة للتعبير عن احتياجاته؟",
    "هل يفهم الآخرون كلام طفلك بسهولة؟",
    "هل تنمو حصيلة طفلك اللغوية باستمرار؟",
    "هل يستطيع طفلك متابعة محادثة بسيطة؟",
  ],
  adhd: [
    "هل يستطيع طفلك التركيز في مهمة حتى ينهيها؟",
    "هل يجلس طفلك بهدوء عندما يتطلّب الموقف ذلك؟",
    "هل ينتظر طفلك دوره دون تسرّع؟",
    "هل يتّبع طفلك التعليمات المكوّنة من عدّة خطوات؟",
    "هل يستطيع طفلك تنظيم أغراضه وإنهاء واجباته؟",
  ],
  mchat: [
    "هل ينظر طفلك في عينيك أثناء التحدث معه؟",
    "هل يستجيب طفلك عند مناداته باسمه؟",
    "هل يشير طفلك بإصبعه ليُريك شيئاً يهتم به؟",
    "هل يقلّد طفلك حركاتك أو تعبيرات وجهك؟",
    "هل يشارك طفلك في اللعب التخيّلي مع الآخرين؟",
  ],
  learning: [
    "هل يميّز طفلك الحروف والأرقام المناسبة لعمره؟",
    "هل يتذكّر طفلك ما تعلّمه بسهولة؟",
    "هل تتناسب قدرة طفلك على القراءة أو الكتابة مع عمره؟",
    "هل يربط طفلك بين أصوات الحروف وأشكالها؟",
    "هل ينجز طفلك واجباته الدراسية دون صعوبة كبيرة؟",
  ],
  social: [
    "هل يبادر طفلك باللعب مع الأطفال الآخرين؟",
    "هل يشارك طفلك ألعابه وأدواته مع أقرانه؟",
    "هل يعبّر طفلك عن مشاعره بطريقة مناسبة؟",
    "هل يفهم طفلك مشاعر الآخرين ويتجاوب معها؟",
    "هل يكوّن طفلك صداقات ويحافظ عليها؟",
  ],
  sensory: [
    "هل يتقبّل طفلك الأصوات العالية دون انزعاج شديد؟",
    "هل يتحمّل طفلك ملمس الملابس والأطعمة المختلفة؟",
    "هل تتناسب استجابة طفلك للمس والحركة مع الموقف؟",
    "هل يحافظ طفلك على توازنه أثناء الحركة واللعب؟",
    "هل يتأقلم طفلك مع الأماكن المزدحمة أو الجديدة؟",
  ],
};

export const ANSWER_OPTIONS = ["نعم", "أحياناً", "لا"];

// ===== English mirrors =====

export const ASSESS_STATS_EN = [
  { value: "24 hours", label: "Fast Response" },
  { value: "98%", label: "Parent Satisfaction" },
  { value: "+500", label: "Families Helped" },
];

export const ASSESS_FEATURES_EN = [
  { title: "Reducing Family Anxiety", desc: "We help you clearly understand your child's situation and reassure you with a clear, proven action plan.", icon: "heart" },
  { title: "Identifying the Right Intervention", desc: "We recommend the programs and services best suited to your child's case based on the assessment results.", icon: "target" },
  { title: "Understanding Strengths & Weaknesses", desc: "We reveal what makes your child stand out and identify the areas that need extra support.", icon: "chart" },
  { title: "Early Detection of Difficulties", desc: "Early recognition of any challenges your child faces opens the door to timely intervention.", icon: "search" },
];

export const ASSESS_STEPS_EN = [
  { title: "Choose the Right Assessment", desc: "Select the assessment type best suited to your child from the list.", icon: "question" },
  { title: "Answer the Questions", desc: "Answer simple, clear questions about your child.", icon: "list" },
  { title: "Add Your Details", desc: "Enter your contact details to receive the result.", icon: "briefcase" },
  { title: "Preliminary Assessment Results", desc: "Get an instant result and a suitable recommendation.", icon: "bulb" },
];

export const ASSESSMENTS_EN: Assessment[] = [
  { slug: "speech", title: "Speech Screening", desc: "Screening for speech, language, and communication disorders in children.", icon: "chat", duration: "6 minutes", questions: "10 questions", ageRange: "4 - 12 years" },
  { slug: "adhd", title: "ADHD Assessment", desc: "Assessment of attention-deficit/hyperactivity disorder symptoms in children.", icon: "bolt", duration: "4 minutes", questions: "12 questions", ageRange: "4 - 13 years" },
  { slug: "mchat", title: "M-CHAT", desc: "Modified checklist for early detection of autism spectrum disorder in young children.", icon: "puzzle", duration: "5 minutes", questions: "20 questions", ageRange: "16 - 30 months" },
  { slug: "learning", title: "Learning Difficulties", desc: "Assessment of academic and cognitive indicators of learning difficulties.", icon: "book", duration: "7 minutes", questions: "14 questions", ageRange: "6 - 14 years" },
  { slug: "social", title: "Social Skills", desc: "Assessment of social interaction skills and communication with peers.", icon: "users", duration: "5 minutes", questions: "12 questions", ageRange: "4 - 12 years" },
  { slug: "sensory", title: "Sensory Profile", desc: "Assessment of sensory responses and sensory information processing in the child.", icon: "sensory", duration: "6 minutes", questions: "15 questions", ageRange: "3 - 10 years" },
];

// خيارات فلتر «نوع التقييم» للـCMS: أنواع التقييمات القياسية (كما في الويبسايت)
// + أي قيم إضافية موجودة فعلاً في البيانات (مثل عناوين قديمة أو مُعاد تسميتها).
// القيمة = العنوان العربي كما يُخزَّن، والعرض حسب لغة اللوحة.
export function assessmentTypeFilterOptions(existing: string[], en: boolean): { value: string; label: string }[] {
  const canonical = ASSESSMENTS.map((a, i) => ({ value: a.title, label: en ? ASSESSMENTS_EN[i].title : a.title }));
  const known = new Set(ASSESSMENTS.map((a) => a.title));
  const extra = [...new Set(existing.filter(Boolean))]
    .filter((tp) => !known.has(tp))
    .map((tp) => ({ value: tp, label: tp }));
  return [...canonical, ...extra];
}

export const PRELIM_QUESTIONS_EN = [
  "Does your child communicate verbally in a way appropriate for their age?",
  "Does your child respond when called by their name?",
  "Does your child interact with other children during play?",
  "Can your child focus on a single task for an appropriate length of time?",
  "Does your child follow simple instructions without difficulty?",
];

export const ASSESS_QUESTIONS_EN: Record<string, string[]> = {
  speech: [
    "Does your child pronounce words clearly for their age?",
    "Does your child form meaningful sentences to express their needs?",
    "Do others understand your child's speech easily?",
    "Is your child's vocabulary growing steadily?",
    "Can your child follow a simple conversation?",
  ],
  adhd: [
    "Can your child focus on a task until it's finished?",
    "Does your child sit calmly when the situation requires it?",
    "Does your child wait their turn without rushing?",
    "Does your child follow multi-step instructions?",
    "Can your child organize their belongings and finish tasks?",
  ],
  mchat: [
    "Does your child make eye contact when you talk to them?",
    "Does your child respond when called by their name?",
    "Does your child point to show you something they're interested in?",
    "Does your child imitate your movements or facial expressions?",
    "Does your child engage in pretend play with others?",
  ],
  learning: [
    "Does your child recognize letters and numbers appropriate for their age?",
    "Does your child remember what they've learned easily?",
    "Is your child's reading or writing ability on par with their age?",
    "Does your child link letter sounds to their shapes?",
    "Does your child complete schoolwork without major difficulty?",
  ],
  social: [
    "Does your child initiate play with other children?",
    "Does your child share toys and tools with peers?",
    "Does your child express their feelings appropriately?",
    "Does your child understand and respond to others' feelings?",
    "Does your child make and keep friends?",
  ],
  sensory: [
    "Does your child tolerate loud sounds without severe distress?",
    "Does your child tolerate different clothing and food textures?",
    "Is your child's response to touch and movement appropriate to the situation?",
    "Does your child keep their balance during movement and play?",
    "Does your child adapt to crowded or new places?",
  ],
};

export const ANSWER_OPTIONS_EN = ["Yes", "Sometimes", "No"];

// ===== Locale-aware getters =====

export const getAssessStats = (locale: Locale = "ar") => (locale === "en" ? ASSESS_STATS_EN : ASSESS_STATS);
export const getAssessFeatures = (locale: Locale = "ar") => (locale === "en" ? ASSESS_FEATURES_EN : ASSESS_FEATURES);
export const getAssessSteps = (locale: Locale = "ar") => (locale === "en" ? ASSESS_STEPS_EN : ASSESS_STEPS);
export const getAssessments = (locale: Locale = "ar"): Assessment[] => (locale === "en" ? ASSESSMENTS_EN : ASSESSMENTS);
export const getAssessment = (slug: string, locale: Locale = "ar"): Assessment | undefined =>
  getAssessments(locale).find((a) => a.slug === slug);
export const getPrelimQuestions = (locale: Locale = "ar") => (locale === "en" ? PRELIM_QUESTIONS_EN : PRELIM_QUESTIONS);
// أسئلة التقييم حسب نوعه (مع رجوع للأسئلة العامة لو النوع غير معروف)
export const getQuestionsFor = (slug: string, locale: Locale = "ar") => {
  const map = locale === "en" ? ASSESS_QUESTIONS_EN : ASSESS_QUESTIONS;
  return map[slug] ?? getPrelimQuestions(locale);
};
export const getAnswerOptions = (locale: Locale = "ar") => (locale === "en" ? ANSWER_OPTIONS_EN : ANSWER_OPTIONS);
