import type { Collection } from "./types";

const b = (ar: string, en: string) => ({ ar, en });

export const COLLECTIONS: Collection[] = [
  // ===== البرامج التأهيلية =====
  {
    key: "programs",
    label: "البرامج التأهيلية",
    labelEn: "Programs",
    singular: "برنامج",
    icon: "grid",
    group: "المحتوى",
    titleField: "title",
    subtitleField: "suits",
    fields: [
      { key: "title", label: "اسم البرنامج", type: "text", bilingual: true },
      { key: "slug", label: "المعرّف (slug)", type: "text", help: "يُستخدم في الرابط" },
      { key: "desc", label: "الوصف", type: "textarea", bilingual: true, colSpan: 2 },
      { key: "suits", label: "يناسب", type: "text", bilingual: true },
      { key: "age", label: "الفئة العمرية", type: "text", bilingual: true },
      { key: "features", label: "المميزات", type: "list", bilingual: true, colSpan: 2 },
      { key: "regions", label: "المناطق", type: "list", bilingual: true, colSpan: 2 },
    ],
    seed: [
      { id: "montaliq", title: b("برنامج منطلق", "Montaliq Program"), slug: "montaliq", desc: b("برنامج متكامل لدعم الأطفال ذوي اضطراب طيف التوحد وتنمية مهاراتهم.", "An integrated program supporting children with Autism Spectrum Disorder."), suits: b("الأطفال ذوو اضطراب طيف التوحد", "Children with Autism Spectrum Disorder"), age: b("من سنتين إلى 12 سنة", "From 2 to 12 years"), features: [b("جلسات فردية وجماعية", "Individual and group sessions"), b("تقييم دوري للتقدم", "Regular progress assessment")] as never, regions: [b("الرياض", "Riyadh"), b("جدة", "Jeddah")] as never },
      { id: "girls", title: b("برنامج عبور لتأهيل الفتيات", "Oboor Girls' Rehabilitation Program"), slug: "girls", desc: b("برنامج يراعي الاحتياجات التأهيلية الخاصة بالفتيات في بيئة داعمة وآمنة.", "A program addressing girls' specific rehabilitation needs in a supportive environment."), suits: b("الفتيات ذوات الإعاقة", "Girls with disabilities"), age: b("من 15 سنة فأكثر", "15 years and above"), features: [b("تدريب على مهارات العمل", "Vocational skills training")] as never, regions: [b("الرياض", "Riyadh")] as never },
    ],
  },

  // ===== الخدمات العيادية =====
  {
    key: "clinical",
    label: "الخدمات العيادية",
    labelEn: "Clinical Services",
    singular: "خدمة",
    icon: "stethoscope",
    group: "المحتوى",
    titleField: "title",
    subtitleField: "summary",
    fields: [
      { key: "title", label: "اسم الخدمة", type: "text", bilingual: true },
      { key: "slug", label: "المعرّف (slug)", type: "text" },
      { key: "summary", label: "نبذة", type: "textarea", bilingual: true, colSpan: 2 },
      { key: "areas", label: "مجالات التدريب", type: "list", bilingual: true, colSpan: 2 },
    ],
    seed: [
      { id: "speech", title: b("النطق والتخاطب", "Speech & Language Therapy"), slug: "speech", summary: b("تشخيص وعلاج اضطرابات النطق واللغة والتواصل.", "Diagnosis and treatment of speech, language and communication disorders."), areas: [b("تأخر اللغة", "Language delay"), b("اضطرابات النطق", "Articulation disorders")] as never },
      { id: "occupational", title: b("العلاج الوظيفي", "Occupational Therapy"), slug: "occupational", summary: b("تنمية المهارات الحركية والحسية والاستقلالية اليومية.", "Developing motor, sensory and daily-living independence skills."), areas: [b("المهارات الحركية الدقيقة", "Fine motor skills")] as never },
      { id: "physical", title: b("العلاج الطبيعي", "Physical Therapy"), slug: "physical", summary: b("تأهيل حركي متخصص لتحسين القوة والتوازن والحركة.", "Specialized physical rehabilitation to improve strength, balance and mobility."), areas: [b("التوازن والمشي", "Balance & gait")] as never },
    ],
  },

  // ===== التقنيات التأهيلية =====
  {
    key: "techniques",
    label: "التقنيات التأهيلية",
    labelEn: "Technologies",
    singular: "تقنية",
    icon: "cpu",
    group: "المحتوى",
    titleField: "title",
    subtitleField: "badge",
    fields: [
      { key: "title", label: "اسم التقنية", type: "text", bilingual: true },
      { key: "slug", label: "المعرّف (slug)", type: "text" },
      { key: "badge", label: "حالة التوفّر", type: "text", bilingual: true },
      { key: "summary", label: "نبذة", type: "textarea", bilingual: true, colSpan: 2 },
    ],
    seed: [
      { id: "play-attention", title: b("Play Attention", "Play Attention"), slug: "play-attention", badge: b("متوفر في المراكز", "Available at our centers"), summary: b("نظام لتدريب الانتباه والتركيز قائم على التغذية الراجعة العصبية.", "An attention-training system based on neurofeedback.") },
      { id: "cogmed", title: b("Cogmed", "Cogmed"), slug: "cogmed", badge: b("متوفر في المراكز", "Available at our centers"), summary: b("برنامج تدريب الذاكرة العاملة.", "A working-memory training program.") },
    ],
  },

  // ===== الفروع =====
  {
    key: "branches",
    label: "الفروع",
    labelEn: "Branches",
    singular: "فرع",
    icon: "pin",
    group: "المحتوى",
    titleField: "name",
    subtitleField: "city",
    fields: [
      { key: "name", label: "اسم الفرع", type: "text", bilingual: true },
      { key: "slug", label: "المعرّف (slug)", type: "text" },
      { key: "city", label: "المدينة", type: "text", bilingual: true },
      { key: "address", label: "العنوان", type: "textarea", bilingual: true, colSpan: 2 },
      { key: "phone", label: "رقم التواصل", type: "text" },
      { key: "hours", label: "أوقات العمل", type: "text", bilingual: true },
      { key: "status", label: "الحالة", type: "select", options: ["مفتوح", "مغلق", "جديد"] },
    ],
    seed: [
      { id: "narjes", name: b("فرع النرجس", "Al-Narjes Branch"), slug: "narjes", city: b("الرياض", "Riyadh"), address: b("حي النرجس، طريق الأمير محمد بن سلمان", "Al-Narjes District, Prince Mohammed bin Salman Road"), phone: "0561000274", hours: b("الأحد – الخميس: ٨ص – ٨م", "Sun – Thu: 8 AM – 8 PM"), status: "جديد" },
      { id: "olaya", name: b("فرع العليا", "Al-Olaya Branch"), slug: "olaya", city: b("الرياض", "Riyadh"), address: b("حي العليا، شارع التحلية", "Al-Olaya District, Tahlia Street"), phone: "0561000275", hours: b("الأحد – الخميس: ٨ص – ٨م", "Sun – Thu: 8 AM – 8 PM"), status: "مفتوح" },
    ],
  },

  // ===== الأخصائيون =====
  {
    key: "specialists",
    label: "الأخصائيون",
    labelEn: "Specialists",
    singular: "أخصائي",
    icon: "user",
    group: "المحتوى",
    titleField: "name",
    subtitleField: "specialty",
    imageField: "image",
    fields: [
      { key: "name", label: "الاسم", type: "text", bilingual: true },
      { key: "image", label: "الصورة", type: "image" },
      { key: "specialty", label: "التخصص", type: "text", bilingual: true },
      { key: "experience", label: "الخبرة", type: "text", bilingual: true },
      { key: "branch", label: "الفرع", type: "text", bilingual: true },
      { key: "about", label: "نبذة", type: "textarea", bilingual: true, colSpan: 2 },
    ],
    seed: [
      { id: "sp1", name: b("د. سارة العتيبي", "Dr. Sara Al-Otaibi"), image: "/figma/specialists/team.jpg", specialty: b("أخصائية نطق وتخاطب", "Speech & Language Therapist"), experience: b("10 سنوات خبرة", "10 years of experience"), branch: b("فرع النرجس", "Al-Narjes Branch"), about: b("متخصصة في تأهيل اضطرابات النطق لدى الأطفال.", "Specialized in children's speech rehabilitation.") },
    ],
  },

  // ===== الوظائف =====
  {
    key: "careers",
    label: "الوظائف",
    labelEn: "Careers",
    singular: "وظيفة",
    icon: "briefcase",
    group: "المحتوى",
    titleField: "title",
    subtitleField: "city",
    fields: [
      { key: "title", label: "المسمى الوظيفي", type: "text", bilingual: true },
      { key: "slug", label: "المعرّف (slug)", type: "text" },
      { key: "city", label: "المدينة", type: "text", bilingual: true },
      { key: "type", label: "نوع الدوام", type: "select", options: ["دوام كامل", "دوام جزئي", "تعاقد"] },
      { key: "desc", label: "الوصف الوظيفي", type: "textarea", bilingual: true, colSpan: 2 },
    ],
    seed: [
      { id: "speech-therapist", title: b("أخصائي/ة علاج النطق والتخاطب", "Speech & Language Therapist"), slug: "speech-therapist", city: b("الرياض", "Riyadh"), type: "دوام كامل", desc: b("مطلوب أخصائي نطق للعمل ضمن فريق متعدد التخصصات.", "Speech therapist needed to join a multidisciplinary team.") },
    ],
  },

  // ===== الأخبار =====
  {
    key: "news",
    label: "الأخبار والفعاليات",
    labelEn: "News",
    singular: "خبر",
    icon: "news",
    group: "المحتوى",
    titleField: "title",
    subtitleField: "category",
    imageField: "image",
    fields: [
      { key: "title", label: "العنوان", type: "text", bilingual: true, colSpan: 2 },
      { key: "slug", label: "المعرّف (slug)", type: "text" },
      { key: "category", label: "التصنيف", type: "text", bilingual: true },
      { key: "image", label: "الصورة", type: "image" },
      { key: "excerpt", label: "مقتطف", type: "textarea", bilingual: true, colSpan: 2 },
      { key: "body", label: "المحتوى", type: "richtext", bilingual: true, colSpan: 2 },
    ],
    seed: [
      { id: "language-support-workshop", title: b("ورشة دعم التواصل اللغوي في المنزل", "Supporting Language Communication at Home Workshop"), slug: "language-support-workshop", category: b("ورشة", "Workshop"), image: "/figma/news/ws1.jpg", excerpt: b("ورشة للأسر حول دعم تواصل أطفالهم.", "A workshop for families on supporting their children's communication."), body: b("تفاصيل الورشة الكاملة هنا.", "Full workshop details here.") },
    ],
  },

  // ===== قصص النجاح =====
  {
    key: "success",
    label: "قصص النجاح",
    labelEn: "Success Stories",
    singular: "قصة",
    icon: "star",
    group: "المحتوى",
    titleField: "name",
    subtitleField: "category",
    imageField: "image",
    fields: [
      { key: "name", label: "الاسم", type: "text", bilingual: true },
      { key: "age", label: "العمر", type: "text", bilingual: true },
      { key: "image", label: "الصورة", type: "image" },
      { key: "category", label: "التصنيف", type: "text", bilingual: true },
      { key: "before", label: "قبل الالتحاق", type: "textarea", bilingual: true },
      { key: "after", label: "بعد البرنامج", type: "textarea", bilingual: true },
      { key: "quote", label: "كلمة ولي الأمر", type: "textarea", bilingual: true, colSpan: 2 },
    ],
    seed: [
      { id: "tameem", name: b("تميم", "Tameem"), age: b("3 سنوات", "3 years"), image: "/figma/success-stories/tameem.jpg", category: b("علاج النطق واللغة", "Speech & Language Therapy"), before: b("كان يعاني من صعوبات شديدة في النطق", "Suffered from severe speech difficulties"), after: b("تحدث بطلاقة وثقة عالية", "Speaks fluently and confidently"), quote: b("مركز عبور غيّر حياة ابني تماماً.", "Oboor Center completely changed my son's life.") },
    ],
  },

  // ===== التقييم =====
  {
    key: "assessment",
    label: "بطاقات التقييم",
    labelEn: "Assessment",
    singular: "تقييم",
    icon: "clipboard",
    group: "المحتوى",
    titleField: "title",
    subtitleField: "category",
    fields: [
      { key: "title", label: "اسم التقييم", type: "text", bilingual: true },
      { key: "category", label: "الفئة", type: "text", bilingual: true },
      { key: "duration", label: "المدة", type: "text", bilingual: true },
      { key: "questions", label: "عدد الأسئلة", type: "text", bilingual: true },
      { key: "desc", label: "الوصف", type: "textarea", bilingual: true, colSpan: 2 },
    ],
    seed: [
      { id: "autism", title: b("مؤشرات اضطراب طيف التوحد", "Autism Spectrum Indicators"), category: b("تطوّري", "Developmental"), duration: b("6 دقائق", "6 minutes"), questions: b("12 سؤال", "12 questions"), desc: b("تقييم أولي لمؤشرات اضطراب طيف التوحد.", "A preliminary screening for autism spectrum indicators.") },
    ],
  },

  // ===== المعرض =====
  {
    key: "gallery",
    label: "المعرض",
    labelEn: "Gallery",
    singular: "صورة",
    icon: "image",
    group: "المحتوى",
    titleField: "caption",
    imageField: "image",
    fields: [
      { key: "image", label: "الصورة", type: "image", colSpan: 2 },
      { key: "caption", label: "الوصف", type: "text", bilingual: true, colSpan: 2 },
    ],
    seed: [
      { id: "g1", image: "/figma/home/imgImageWithFallback6.png", caption: b("من أنشطة المركز", "From the center's activities") },
      { id: "g2", image: "/figma/home/imgImageWithFallback7.jpg", caption: b("جلسة تأهيلية", "A rehabilitation session") },
    ],
  },

  // ===== شرائح الهيرو (الرئيسية) =====
  {
    key: "home_hero",
    label: "شرائح الهيرو",
    labelEn: "Hero Slides",
    singular: "شريحة",
    icon: "layout",
    group: "الصفحة الرئيسية",
    titleField: "heading",
    subtitleField: "badge",
    imageField: "image",
    fields: [
      { key: "badge", label: "الشارة العلوية", type: "text", bilingual: true, colSpan: 2 },
      { key: "heading", label: "العنوان الرئيسي", type: "text", bilingual: true, colSpan: 2 },
      { key: "desc", label: "الوصف", type: "textarea", bilingual: true, colSpan: 2 },
      { key: "cta", label: "زر الإجراء", type: "text", bilingual: true },
      { key: "image", label: "صورة الخلفية", type: "image" },
    ],
    seed: [
      { id: "s1", badge: b("نرعى نقاءهم، ونبني غدهم", "Nurturing Their Potential, Shaping Their Future"), heading: b("مركز عبور للرعاية النهارية والتأهيل", "Oboor Day Care & Rehabilitation Center"), desc: b("أبناؤكم في أيدٍ أمينة، يكبرون ويعبرون؛ نحتوي نقاءهم بقلوبٍ حانية.", "Your children are in safe and caring hands."), cta: b("من هنا، نُمكّنهم", "From Here, We Empower Them"), image: "/figma/home/imgImageWithFallback.jpg" },
      { id: "s2", badge: b("نرعى نقاءهم، ونبني غدهم", "Nurturing Their Potential, Shaping Their Future"), heading: b("التدخل المبكر خطوة مبكرة في الصغر تُنير سائر العُمر", "Early Intervention: A Small Step That Illuminates a Lifetime"), desc: b("من التشخيص المبكر والتدخل الفوري، نرافق أطفالكم برعايةٍ تُساند نموهم.", "Through early diagnosis and timely intervention, we support your children."), cta: b("من هنا، نُمكّنهم", "From Here, We Empower Them"), image: "/figma/home/imgImageWithFallback.jpg" },
      { id: "s3", badge: b("نرعى نقاءهم، ونبني غدهم", "Nurturing Their Potential, Shaping Their Future"), heading: b("ليُعبّروا بأصواتهم ويُعبّروا بخطواتهم", "So They Can Express Themselves and Move Forward"), desc: b("عبر برامج متكاملة تجمع بين رعاية النطق والتكامل الحسي والعلاج الوظيفي.", "Through integrated programs combining speech, sensory and occupational therapy."), cta: b("من هنا، نُمكّنهم", "From Here, We Empower Them"), image: "/figma/home/imgImageWithFallback.jpg" },
    ],
  },

  // ===== أرقام الإنجاز (الرئيسية) =====
  {
    key: "home_stats",
    label: "أرقام الإنجاز",
    labelEn: "Stats",
    singular: "رقم",
    icon: "trophy",
    group: "الصفحة الرئيسية",
    titleField: "label",
    subtitleField: "value",
    fields: [
      { key: "value", label: "الرقم", type: "text", help: "مثال: +6,300" },
      { key: "icon", label: "الأيقونة", type: "icon" },
      { key: "label", label: "العنوان", type: "text", bilingual: true, colSpan: 2 },
      { key: "note", label: "الوصف", type: "text", bilingual: true, colSpan: 2 },
    ],
    seed: [
      { id: "n1", value: "+6,300", icon: "users", label: b("مستفيد احتُضن بحب", "Beneficiaries supported with care"), note: b("من مختلف أرجاء الوطن", "From across the Kingdom") },
      { id: "n2", value: "+3,200,000", icon: "calendar", label: b("جلسة علاجية تمت", "Therapeutic sessions delivered"), note: b("بأعلى معايير الإتقان", "To the highest standards") },
      { id: "n3", value: "+155,000", icon: "clipboard", label: b("رحلة تقييم وتشخيص", "Assessment & diagnostic journeys"), note: b("بأدوات حديثة ورؤية دقيقة", "Using advanced tools") },
      { id: "n4", value: "+48,000", icon: "heart", label: b("خدمة تلامس الاحتياج", "Specialized services delivered"), note: b("بكل تفانٍ واهتمام", "With full commitment") },
      { id: "n5", value: "+320", icon: "document", label: b("خطة تأهيل أنشأناها", "Individualized plans designed"), note: b("ولأجل طفلك سخّرناها", "Tailored for each child") },
      { id: "n6", value: "+43", icon: "pin", label: b("نقطة رعايةٍ ولقاء", "Care points across the Kingdom"), note: b("تُغطّي أرجاء الوطن", "Extending our reach") },
      { id: "n7", value: "+19", icon: "trophy", label: b("عامًا في الريادة", "Years of leadership"), note: b("في مجالات التأهيل والرعاية", "In rehabilitation and care") },
      { id: "n8", value: "+7", icon: "book", label: b("برامج تأهيلية", "Rehabilitation programs"), note: b("لكل مرحلةٍ وعمر", "Across all stages and ages") },
    ],
  },

  // ===== مميزات «لماذا عبور» (الرئيسية) =====
  {
    key: "home_features",
    label: "مميزات «لماذا عبور»",
    labelEn: "Why Us Features",
    singular: "ميزة",
    icon: "star",
    group: "الصفحة الرئيسية",
    titleField: "title",
    fields: [
      { key: "icon", label: "الأيقونة", type: "icon" },
      { key: "title", label: "العنوان", type: "text", bilingual: true, colSpan: 2 },
      { key: "note", label: "الوصف", type: "textarea", bilingual: true, colSpan: 2 },
    ],
    seed: [
      { id: "f1", icon: "users", title: b("فريقنا", "Our Team"), note: b("كفاءات تخصصية متكاملة تعمل بروح الجسد الواحد.", "An integrated group of specialists working as one team.") },
      { id: "f2", icon: "book", title: b("منهجنا", "Our Approach"), note: b("برامج تأهيلية معتمدة علميًا.", "Scientifically grounded rehabilitation programs.") },
      { id: "f3", icon: "target", title: b("خططنا", "Our Plans"), note: b("أهداف محددة بوضوح ومتابعة دقيقة.", "Clearly defined goals with precise monitoring.") },
      { id: "f4", icon: "heart", title: b("شراكتنا", "Our Partnership"), note: b("الأسرة هي الشريك الأول.", "The family is our primary partner.") },
      { id: "f5", icon: "chat", title: b("تقاريرنا", "Our Reports"), note: b("تواصل مستمر وتقارير دورية.", "Continuous communication and periodic reports.") },
      { id: "f6", icon: "shield", title: b("بيئتنا", "Our Environment"), note: b("مساحات آمنة ومحفّزة.", "Safe and stimulating spaces.") },
    ],
  },
];

export function getCollection(key: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.key === key);
}
