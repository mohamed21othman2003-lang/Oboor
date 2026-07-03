// محتوى صفحة الوظائف + تفاصيل الوظيفة — مطابق لديزاين Figma (148:7221 / 148:7786)
// كروت الديزاين placeholder متطابقة؛ هنا وظائف واقعية بنفس البنية.

import { type Locale } from "@/i18n/config";

export type Job = {
  slug: string;
  title: string;
  department: string;
  city: string;
  employment: string; // نوع الدوام
  experience: string;
  date: string; // تاريخ الطرح
  startDate: string; // تاريخ المباشرة المتوقع
  isNew?: boolean;
  description: string;
  responsibilities: string[];
  requirements: string[];
};

export const CITIES = ["الكل", "الرياض", "مكة المكرمة", "المدينة المنورة", "الشرقية", "القصيم", "عسير", "جازان", "الجوف"];
export const EMPLOYMENT_TYPES = ["الكل", "دوام كامل", "دوام جزئي", "عن بُعد"];

export const JOBS: Job[] = [
  {
    slug: "speech-therapist", title: "أخصائي/ة علاج النطق والتخاطب", department: "قسم علاج النطق",
    city: "الرياض", employment: "دوام كامل", experience: "سنتان فأكثر", date: "١٠ مارس ٢٠٢٥", startDate: "١ أبريل ٢٠٢٥", isNew: true,
    description: "يسعى مركز عبور للحصول على أخصائي/ة علاج نطق وتخاطب متخصص في تقييم وعلاج اضطرابات النطق واللغة والتواصل لدى الأطفال. يُعدّ هذا الدور ركيزةً أساسيةً في منظومة الرعاية الشاملة، حيث يُشارك الشاغل في وضع الخطط العلاجية الفردية ومتابعة تقدم المستفيدين ضمن فريق متعدد التخصصات.",
    responsibilities: [
      "إجراء التقييم الشامل لاضطرابات النطق واللغة والتواصل",
      "تصميم وتنفيذ خطط علاجية فردية لكل طفل",
      "إرشاد الأسر ومتابعة تطبيق التمارين المنزلية",
      "توثيق الجلسات وإعداد التقارير الدورية",
      "العمل ضمن الفريق متعدد التخصصات",
    ],
    requirements: [
      "بكالوريوس في علوم النطق والتخاطب أو ما يعادله",
      "خبرة سنتان فأكثر في التعامل مع الأطفال",
      "ترخيص ساري من هيئة التخصصات الصحية",
      "إتقان أساليب التواصل المعزز والبديل (AAC)",
    ],
  },
  {
    slug: "occupational-therapist", title: "أخصائي/ة علاج وظيفي", department: "قسم العلاج الوظيفي",
    city: "جدة", employment: "دوام كامل", experience: "٣ سنوات فأكثر", date: "٨ مارس ٢٠٢٥", startDate: "١ أبريل ٢٠٢٥", isNew: true,
    description: "نبحث عن أخصائي/ة علاج وظيفي شغوف بتأهيل الأطفال وتنمية مهاراتهم الحركية الدقيقة والحسية واليومية. يُشارك الشاغل في تمكين المستفيدين من أداء أنشطة الحياة اليومية باستقلالية ضمن بيئة علاجية محفّزة.",
    responsibilities: [
      "تقييم المهارات الحركية والحسية ومهارات العناية بالذات",
      "إعداد برامج التكامل الحسي والعلاج الوظيفي الفردية",
      "تدريب الأسرة على الأنشطة الداعمة في المنزل",
      "متابعة تقدم الحالة وتعديل الخطة العلاجية",
      "التنسيق مع الفريق العلاجي متعدد التخصصات",
    ],
    requirements: [
      "بكالوريوس في العلاج الوظيفي",
      "خبرة ٣ سنوات فأكثر في تأهيل الأطفال",
      "ترخيص ساري من هيئة التخصصات الصحية",
      "خبرة في برامج التكامل الحسي",
    ],
  },
  {
    slug: "physical-therapist", title: "أخصائي/ة علاج طبيعي", department: "قسم العلاج الطبيعي",
    city: "الرياض", employment: "دوام كامل", experience: "سنتان فأكثر", date: "٥ مارس ٢٠٢٥", startDate: "٢٥ مارس ٢٠٢٥",
    description: "يسعى مركز عبور لاستقطاب أخصائي/ة علاج طبيعي متخصص في تأهيل الحالات العصبية والعضلية الهيكلية لدى الأطفال، للمساهمة في تحسين القدرات الحركية والوظيفية للمستفيدين.",
    responsibilities: [
      "إجراء التقييم الحركي الشامل للأطفال",
      "تصميم برامج تأهيل حركي فردية",
      "استخدام التقنيات والمعدات العلاجية الحديثة",
      "متابعة التقدم وتوثيق النتائج",
      "إرشاد الأسر حول التمارين المنزلية",
    ],
    requirements: [
      "بكالوريوس في العلاج الطبيعي",
      "خبرة سنتان فأكثر في تأهيل الأطفال",
      "ترخيص ساري من هيئة التخصصات الصحية",
      "معرفة بأساليب التأهيل العصبي التطوري",
    ],
  },
  {
    slug: "aba-specialist", title: "أخصائي/ة تحليل سلوك تطبيقي (ABA)", department: "قسم تعديل السلوك",
    city: "الشرقية", employment: "دوام كامل", experience: "٣ سنوات فأكثر", date: "٢ مارس ٢٠٢٥", startDate: "٢٠ مارس ٢٠٢٥", isNew: true,
    description: "نبحث عن أخصائي/ة تحليل سلوك تطبيقي معتمد للعمل مع الأطفال ذوي اضطراب طيف التوحد والاضطرابات السلوكية، وتصميم برامج تعديل السلوك القائمة على الأدلة.",
    responsibilities: [
      "إجراء التقييم الوظيفي للسلوك (FBA)",
      "تصميم وتنفيذ خطط تعديل السلوك الفردية",
      "تدريب الكوادر والأسر على تطبيق البرامج",
      "جمع البيانات وتحليلها لقياس التقدم",
      "العمل ضمن فريق متعدد التخصصات",
    ],
    requirements: [
      "بكالوريوس أو ماجستير في علم النفس أو التربية الخاصة",
      "خبرة ٣ سنوات فأكثر في تحليل السلوك التطبيقي",
      "شهادة BCBA أو ما يعادلها (يُفضّل)",
      "خبرة في التعامل مع اضطراب طيف التوحد",
    ],
  },
  {
    slug: "psychologist", title: "أخصائي/ة نفسي", department: "القسم النفسي",
    city: "الرياض", employment: "دوام جزئي", experience: "٣ سنوات فأكثر", date: "٣ مارس ٢٠٢٥", startDate: "١٥ مارس ٢٠٢٥",
    description: "يسعى مركز عبور للحصول على معالج أو معالجة نفسية متخصصة في التعامل مع الأطفال وذوي الاحتياجات الخاصة. يُعدّ هذا الدور ركيزةً أساسيةً في منظومة الرعاية الشاملة التي يقدمها المركز، حيث يُشارك الشاغل في تقديم الدعم النفسي للمستفيدين وأسرهم.",
    responsibilities: [
      "إجراء الجلسات التشخيصية والعلاجية للأطفال باستخدام أساليب علاجية معتمدة",
      "تقديم الإرشاد النفسي لأسر المستفيدين",
      "العمل ضمن الفريق متعدد التخصصات لتقديم خطط رعاية شاملة",
      "توثيق الجلسات وإعداد التقارير النفسية",
      "المشاركة في جلسات الحالة والاجتماعات الفريقية",
    ],
    requirements: [
      "بكالوريوس أو ماجستير في علم النفس الإكلينيكي أو الإرشاد النفسي",
      "خبرة ٣ سنوات فأكثر في التعامل مع الأطفال",
      "ترخيص ساري من جهة معنية معتمدة",
      "إتقان تقنيات العلاج المعرفي السلوكي (CBT) والعلاج باللعب",
    ],
  },
  {
    slug: "pediatric-nurse", title: "ممرض/ة أطفال", department: "قسم التمريض",
    city: "الرياض", employment: "دوام كامل", experience: "سنة فأكثر", date: "٢٥ فبراير ٢٠٢٥", startDate: "١٥ مارس ٢٠٢٥",
    description: "نبحث عن ممرض/ة أطفال للانضمام إلى فريق التمريض، لتقديم رعاية تمريضية متخصصة وآمنة للأطفال خلال رحلتهم التأهيلية داخل المركز.",
    responsibilities: [
      "تقديم الرعاية التمريضية اليومية للمستفيدين",
      "متابعة الحالة الصحية وإدارة الأدوية والجرعات",
      "التنسيق مع الفريق الطبي والعلاجي",
      "توثيق الملاحظات الصحية والتقارير",
      "تطبيق معايير السلامة ومكافحة العدوى",
    ],
    requirements: [
      "بكالوريوس أو دبلوم في التمريض",
      "خبرة سنة فأكثر (يُفضّل في رعاية الأطفال)",
      "تصنيف ساري من الهيئة السعودية للتخصصات الصحية",
      "مهارات تواصل عالية مع الأطفال وأسرهم",
    ],
  },
  {
    slug: "special-education", title: "أخصائي/ة تربية خاصة", department: "القسم التربوي",
    city: "جدة", employment: "دوام كامل", experience: "سنتان فأكثر", date: "٢٠ فبراير ٢٠٢٥", startDate: "١٠ مارس ٢٠٢٥",
    description: "نبحث عن أخصائي/ة تربية خاصة لإعداد وتنفيذ الخطط التربوية الفردية للأطفال ذوي الاحتياجات الخاصة، ودعم اندماجهم الأكاديمي والاجتماعي.",
    responsibilities: [
      "إعداد الخطط التربوية الفردية (IEP) وتنفيذها",
      "تطبيق استراتيجيات التدريس الفردي والجماعي",
      "تقييم التقدم الأكاديمي والسلوكي للأطفال",
      "التعاون مع الأسرة والفريق العلاجي",
      "تهيئة الأطفال للاندماج في البيئة المدرسية",
    ],
    requirements: [
      "بكالوريوس في التربية الخاصة",
      "خبرة سنتان فأكثر في التعليم أو التأهيل",
      "معرفة بأساليب تعديل السلوك",
      "مهارات تخطيط وتقييم تربوي",
    ],
  },
  {
    slug: "client-coordinator", title: "منسق/ة خدمة العملاء", department: "قسم خدمة العملاء",
    city: "الرياض", employment: "دوام كامل", experience: "سنة فأكثر", date: "١٨ فبراير ٢٠٢٥", startDate: "٥ مارس ٢٠٢٥",
    description: "نبحث عن منسق/ة خدمة عملاء لتقديم تجربة مميزة للمستفيدين وأسرهم، وإدارة الاستفسارات والمواعيد والتنسيق بين الأقسام بكفاءة واحترافية.",
    responsibilities: [
      "استقبال المستفيدين والرد على الاستفسارات",
      "إدارة جدولة المواعيد ومتابعتها",
      "التنسيق بين الأقسام لضمان سلاسة الخدمة",
      "متابعة رضا المستفيدين ومعالجة الملاحظات",
      "توثيق البيانات في الأنظمة المعتمدة",
    ],
    requirements: [
      "بكالوريوس في إدارة الأعمال أو مجال ذي صلة",
      "خبرة سنة فأكثر في خدمة العملاء",
      "مهارات تواصل وتنظيم عالية",
      "إجادة استخدام الحاسب والأنظمة المكتبية",
    ],
  },
];

export const CITIES_EN = ["All", "Riyadh", "Makkah", "Madinah", "Eastern Province", "Qassim", "Asir", "Jazan", "Al-Jouf"];
export const EMPLOYMENT_TYPES_EN = ["All", "Full-time", "Part-time", "Remote"];

export const JOBS_EN: Job[] = [
  {
    slug: "speech-therapist", title: "Speech & Language Therapist", department: "Speech Therapy Department",
    city: "Riyadh", employment: "Full-time", experience: "2+ years", date: "10 March 2025", startDate: "1 April 2025", isNew: true,
    description: "Oboor Center is seeking a Speech & Language Therapist specialized in assessing and treating speech, language, and communication disorders in children. This role is a cornerstone of our comprehensive care system, where the postholder contributes to developing individual treatment plans and tracking beneficiaries' progress within a multidisciplinary team.",
    responsibilities: [
      "Conduct comprehensive assessment of speech, language, and communication disorders",
      "Design and implement individual treatment plans for each child",
      "Guide families and follow up on the application of home exercises",
      "Document sessions and prepare periodic reports",
      "Work within the multidisciplinary team",
    ],
    requirements: [
      "Bachelor's degree in Speech & Language Sciences or equivalent",
      "2+ years of experience working with children",
      "Valid license from the Saudi Commission for Health Specialties",
      "Proficiency in Augmentative and Alternative Communication (AAC) methods",
    ],
  },
  {
    slug: "occupational-therapist", title: "Occupational Therapist", department: "Occupational Therapy Department",
    city: "Jeddah", employment: "Full-time", experience: "3+ years", date: "8 March 2025", startDate: "1 April 2025", isNew: true,
    description: "We are looking for an Occupational Therapist passionate about rehabilitating children and developing their fine motor, sensory, and daily living skills. The postholder helps empower beneficiaries to perform daily life activities independently within a stimulating therapeutic environment.",
    responsibilities: [
      "Assess motor, sensory, and self-care skills",
      "Prepare individual sensory integration and occupational therapy programs",
      "Train families on supportive activities at home",
      "Track case progress and adjust the treatment plan",
      "Coordinate with the multidisciplinary therapy team",
    ],
    requirements: [
      "Bachelor's degree in Occupational Therapy",
      "3+ years of experience in children's rehabilitation",
      "Valid license from the Saudi Commission for Health Specialties",
      "Experience in sensory integration programs",
    ],
  },
  {
    slug: "physical-therapist", title: "Physical Therapist", department: "Physical Therapy Department",
    city: "Riyadh", employment: "Full-time", experience: "2+ years", date: "5 March 2025", startDate: "25 March 2025",
    description: "Oboor Center seeks to recruit a Physical Therapist specialized in rehabilitating neurological and musculoskeletal conditions in children, to contribute to improving beneficiaries' motor and functional abilities.",
    responsibilities: [
      "Conduct comprehensive motor assessment for children",
      "Design individual motor rehabilitation programs",
      "Use modern therapeutic techniques and equipment",
      "Track progress and document outcomes",
      "Guide families on home exercises",
    ],
    requirements: [
      "Bachelor's degree in Physical Therapy",
      "2+ years of experience in children's rehabilitation",
      "Valid license from the Saudi Commission for Health Specialties",
      "Knowledge of Neurodevelopmental Treatment (NDT) methods",
    ],
  },
  {
    slug: "aba-specialist", title: "Applied Behavior Analysis (ABA) Specialist", department: "Behavior Modification Department",
    city: "Eastern Province", employment: "Full-time", experience: "3+ years", date: "2 March 2025", startDate: "20 March 2025", isNew: true,
    description: "We are looking for a certified Applied Behavior Analysis specialist to work with children with Autism Spectrum Disorder and behavioral disorders, and to design evidence-based behavior modification programs.",
    responsibilities: [
      "Conduct Functional Behavior Assessment (FBA)",
      "Design and implement individual behavior modification plans",
      "Train staff and families on program implementation",
      "Collect and analyze data to measure progress",
      "Work within a multidisciplinary team",
    ],
    requirements: [
      "Bachelor's or Master's degree in Psychology or Special Education",
      "3+ years of experience in applied behavior analysis",
      "BCBA certification or equivalent (preferred)",
      "Experience working with Autism Spectrum Disorder",
    ],
  },
  {
    slug: "psychologist", title: "Psychologist", department: "Psychology Department",
    city: "Riyadh", employment: "Part-time", experience: "3+ years", date: "3 March 2025", startDate: "15 March 2025",
    description: "Oboor Center is seeking a psychologist specialized in working with children and people with special needs. This role is a cornerstone of the comprehensive care system the center provides, where the postholder contributes to delivering psychological support to beneficiaries and their families.",
    responsibilities: [
      "Conduct diagnostic and therapeutic sessions for children using approved therapeutic methods",
      "Provide psychological counseling to beneficiaries' families",
      "Work within the multidisciplinary team to deliver comprehensive care plans",
      "Document sessions and prepare psychological reports",
      "Participate in case sessions and team meetings",
    ],
    requirements: [
      "Bachelor's or Master's degree in Clinical Psychology or Psychological Counseling",
      "3+ years of experience working with children",
      "Valid license from a relevant accredited authority",
      "Proficiency in Cognitive Behavioral Therapy (CBT) and play therapy techniques",
    ],
  },
  {
    slug: "pediatric-nurse", title: "Pediatric Nurse", department: "Nursing Department",
    city: "Riyadh", employment: "Full-time", experience: "1+ year", date: "25 February 2025", startDate: "15 March 2025",
    description: "We are looking for a Pediatric Nurse to join the nursing team, to provide specialized and safe nursing care for children throughout their rehabilitation journey at the center.",
    responsibilities: [
      "Provide daily nursing care to beneficiaries",
      "Monitor health conditions and manage medications and dosages",
      "Coordinate with the medical and therapy team",
      "Document health observations and reports",
      "Apply safety and infection control standards",
    ],
    requirements: [
      "Bachelor's degree or diploma in Nursing",
      "1+ year of experience (preferably in pediatric care)",
      "Valid classification from the Saudi Commission for Health Specialties",
      "Strong communication skills with children and their families",
    ],
  },
  {
    slug: "special-education", title: "Special Education Specialist", department: "Educational Department",
    city: "Jeddah", employment: "Full-time", experience: "2+ years", date: "20 February 2025", startDate: "10 March 2025",
    description: "We are looking for a Special Education Specialist to prepare and implement individual education plans for children with special needs, and to support their academic and social integration.",
    responsibilities: [
      "Prepare and implement Individual Education Plans (IEP)",
      "Apply individual and group teaching strategies",
      "Assess children's academic and behavioral progress",
      "Collaborate with the family and the therapy team",
      "Prepare children for integration into the school environment",
    ],
    requirements: [
      "Bachelor's degree in Special Education",
      "2+ years of experience in education or rehabilitation",
      "Knowledge of behavior modification methods",
      "Educational planning and assessment skills",
    ],
  },
  {
    slug: "client-coordinator", title: "Customer Service Coordinator", department: "Customer Service Department",
    city: "Riyadh", employment: "Full-time", experience: "1+ year", date: "18 February 2025", startDate: "5 March 2025",
    description: "We are looking for a Customer Service Coordinator to deliver an outstanding experience for beneficiaries and their families, and to manage inquiries, appointments, and coordination between departments efficiently and professionally.",
    responsibilities: [
      "Welcome beneficiaries and respond to inquiries",
      "Manage appointment scheduling and follow-up",
      "Coordinate between departments to ensure smooth service",
      "Track beneficiary satisfaction and address feedback",
      "Document data in the approved systems",
    ],
    requirements: [
      "Bachelor's degree in Business Administration or a related field",
      "1+ year of experience in customer service",
      "Strong communication and organizational skills",
      "Proficiency in using computers and office systems",
    ],
  },
];

export function getJob(slug: string, locale: Locale = "ar"): Job | undefined {
  const jobs = locale === "en" ? JOBS_EN : JOBS;
  return jobs.find((j) => j.slug === slug);
}
