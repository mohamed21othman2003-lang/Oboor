import type { SettingsGroup } from "./types";

const b = (ar: string, en: string) => ({ ar, en });

export const SETTINGS: SettingsGroup[] = [
  /* ============================ عام (Global) ============================ */
  {
    key: "navbar",
    label: "القائمة العلوية",
    icon: "menu",
    category: "global",
    sections: [
      {
        key: "brand",
        label: "الشعار",
        fields: [{ key: "logo", label: "شعار المركز", type: "image", colSpan: 2 }],
        value: { logo: "/logo.png" },
      },
      {
        key: "links",
        label: "روابط القائمة",
        fields: [
          { key: "home", label: "الرئيسية", type: "text", bilingual: true },
          { key: "about", label: "عن عبور", type: "text", bilingual: true },
          { key: "news", label: "إعلامنا", type: "text", bilingual: true },
          { key: "programs", label: "برامجنا التمكينية", type: "text", bilingual: true },
          { key: "branches", label: "مراكزنا", type: "text", bilingual: true },
          { key: "success", label: "أبطال عبور", type: "text", bilingual: true },
          { key: "specialists", label: "روّادنا", type: "text", bilingual: true },
          { key: "careers", label: "انضم إلينا", type: "text", bilingual: true },
          { key: "assessment", label: "التقييم", type: "text", bilingual: true },
        ],
        value: {
          home: b("الرئيسية", "Home"), about: b("عن عبور", "About Oboor"), news: b("إعلامنا", "Our Media"),
          programs: b("برامجنا التمكينية", "Our Empowerment Programs"), branches: b("مراكزنا", "Our Centers"),
          success: b("أبطال عبور", "Oboor Champions"), specialists: b("روّادنا", "Our Pioneers"),
          careers: b("انضم إلينا", "Join Us"), assessment: b("التقييم", "Assessment"),
        },
      },
      {
        key: "cta",
        label: "الأزرار",
        fields: [
          { key: "contact", label: "زر التواصل", type: "text", bilingual: true },
          { key: "admission", label: "زر طلب الالتحاق", type: "text", bilingual: true },
        ],
        value: { contact: b("خذ الخطوة لعبور", "Take the Step to Oboor"), admission: b("طلب التحاق", "Apply Now") },
      },
    ],
  },
  {
    key: "footer",
    label: "التذييل (Footer)",
    icon: "layout",
    category: "global",
    sections: [
      {
        key: "brand",
        label: "الشعار والوصف",
        fields: [
          { key: "logo", label: "الشعار", type: "image", colSpan: 2 },
          { key: "brandDesc", label: "وصف المركز", type: "textarea", bilingual: true, colSpan: 2 },
        ],
        value: { logo: "/logo.png", brandDesc: b("مركز عبور للرعاية والتأهيل — وجهتكم المتخصصة في دعم أطفالكم.", "Oboor Center for Care & Rehabilitation — your specialized destination.") },
      },
      {
        key: "titles",
        label: "عناوين الأعمدة",
        fields: [
          { key: "quickLinks", label: "عنوان الروابط السريعة", type: "text", bilingual: true },
          { key: "servicesTitle", label: "عنوان الخدمات", type: "text", bilingual: true },
          { key: "contactTitle", label: "عنوان التواصل", type: "text", bilingual: true },
        ],
        value: { quickLinks: b("روابط سريعة", "Quick Links"), servicesTitle: b("خدماتنا", "Our Services"), contactTitle: b("تواصل معنا", "Contact Us") },
      },
      {
        key: "services",
        label: "قائمة الخدمات",
        fields: [{ key: "services", label: "الخدمات", type: "list", bilingual: true, colSpan: 2 }],
        value: { services: [b("التدخل المبكر", "Early Intervention"), b("النطق والتخاطب", "Speech & Language Therapy"), b("العلاج الوظيفي", "Occupational Therapy"), b("العلاج الفيزيائي", "Physical Therapy"), b("التحليل السلوكي التطبيقي (ABA)", "Applied Behavior Analysis (ABA)"), b("الدعم التربوي والأكاديمي", "Educational & Academic Support")] as never },
      },
      {
        key: "bottom",
        label: "أسفل التذييل",
        fields: [
          { key: "rights", label: "حقوق النشر", type: "text", bilingual: true, colSpan: 2 },
          { key: "privacy", label: "سياسة الخصوصية", type: "text", bilingual: true },
        ],
        value: { rights: b("© 2026 مركز عبور للرعاية والتأهيل. جميع الحقوق محفوظة.", "© 2026 Oboor Center. All rights reserved."), privacy: b("سياسة الخصوصية", "Privacy Policy") },
      },
    ],
  },
  {
    key: "brand",
    label: "الهوية والألوان",
    icon: "image",
    category: "global",
    sections: [
      {
        key: "media",
        label: "الشعار والأيقونة",
        fields: [
          { key: "logo", label: "الشعار الرئيسي", type: "image" },
          { key: "favicon", label: "أيقونة المتصفح (Favicon)", type: "image" },
        ],
        value: { logo: "/logo.png", favicon: "/favicon.ico" },
      },
      {
        key: "colors",
        label: "ألوان الهوية",
        fields: [
          { key: "brand", label: "اللون الأساسي", type: "color" },
          { key: "brandDark", label: "الأساسي الداكن", type: "color" },
          { key: "brandDeep", label: "الأساسي العميق", type: "color" },
          { key: "ink", label: "لون النصوص", type: "color" },
        ],
        value: { brand: "#2cbcc8", brandDark: "#1796a3", brandDeep: "#0d3d45", ink: "#1f2a30" },
      },
    ],
  },
  {
    key: "contact",
    label: "بيانات التواصل",
    icon: "phone",
    category: "global",
    sections: [
      {
        key: "contact",
        label: "أرقام التواصل",
        fields: [
          { key: "unified", label: "الرقم الموحد", type: "text" },
          { key: "customerService", label: "خدمة العملاء", type: "text" },
          { key: "email", label: "البريد الإلكتروني", type: "text" },
          { key: "whatsapp", label: "رقم واتساب", type: "text" },
        ],
        value: { unified: "920003452", customerService: "0561000274", email: "info@oboor.com.sa", whatsapp: "966561000274" },
      },
    ],
  },
  {
    key: "social",
    label: "وسائل التواصل",
    icon: "instagram",
    category: "global",
    sections: [
      {
        key: "social",
        label: "روابط السوشيال ميديا",
        fields: [
          { key: "instagram", label: "انستغرام", type: "text" },
          { key: "tiktok", label: "تيك توك", type: "text" },
          { key: "x", label: "إكس (تويتر)", type: "text" },
        ],
        value: { instagram: "https://www.instagram.com/", tiktok: "#", x: "#" },
      },
    ],
  },
  {
    key: "seo",
    label: "تحسين محركات البحث",
    icon: "search",
    category: "global",
    sections: [
      {
        key: "seo",
        label: "العنوان والوصف الافتراضي",
        fields: [
          { key: "title", label: "عنوان الموقع", type: "text", bilingual: true, colSpan: 2 },
          { key: "description", label: "وصف الموقع", type: "textarea", bilingual: true, colSpan: 2 },
        ],
        value: { title: b("مركز عبور للرعاية والتأهيل", "Oboor Center for Care & Rehabilitation"), description: b("وجهتكم المتخصصة في تأهيل ورعاية الأطفال.", "Your specialized destination for children's rehabilitation and care.") },
      },
    ],
  },

  /* ============================ الصفحات (Pages) ============================ */
  {
    key: "page_home",
    label: "الصفحة الرئيسية",
    icon: "home",
    category: "pages",
    sections: [
      {
        key: "smartSearch",
        label: "قسم «دليلك الذكي»",
        fields: [
          { key: "badge", label: "الشارة", type: "text", bilingual: true },
          { key: "heading", label: "العنوان", type: "text", bilingual: true },
          { key: "desc", label: "الوصف", type: "textarea", bilingual: true, colSpan: 2 },
          { key: "cta", label: "زر البحث", type: "text", bilingual: true },
        ],
        value: { badge: b("البحث الذكي عن الخدمات", "Smart Service Search"), heading: b("دليلك الذكي لخطوتك الأولى", "Your Smart Guide to the First Step"), desc: b("بخطواتٍ بسيطة، حدّد فئة البرنامج والخدمة، واختر الفرع الأقرب إليك.", "In a few simple steps, identify the program and choose the nearest branch."), cta: b("اتخذ الخطوة الأولى الآن", "Take the First Step Now") },
      },
      {
        key: "about",
        label: "قسم «عن عبور»",
        fields: [
          { key: "badge", label: "الشارة", type: "text", bilingual: true },
          { key: "heading", label: "العنوان", type: "text", bilingual: true },
          { key: "paragraphs", label: "الفقرات", type: "list", bilingual: true, colSpan: 2 },
          { key: "cta", label: "زر الإجراء", type: "text", bilingual: true },
          { key: "image1", label: "الصورة الأولى", type: "image" },
          { key: "image2", label: "الصورة الثانية", type: "image" },
        ],
        value: { badge: b("عن عبور", "About Oboor"), heading: b("تعرّف على مركز عبور", "Get to know Oboor Center"), paragraphs: [b("بيدٍ خبيرة وقلبٍ حانٍ ينمو طفلك في مركز عبور.", "With expert hands and compassionate hearts, your child grows at Oboor.")] as never, cta: b("تَعرّف أكثر", "Learn More"), image1: "/figma/home/imgImageWithFallback1.jpg", image2: "/figma/home/imgImageWithFallback2.jpg" },
      },
      {
        key: "statsHeader",
        label: "ترويسة الإحصائيات",
        fields: [
          { key: "heading", label: "العنوان", type: "text", bilingual: true, colSpan: 2 },
          { key: "subtitle", label: "الجملة", type: "textarea", bilingual: true, colSpan: 2 },
        ],
        value: { heading: b("شواهدُ أثرٍ تتحدث عن نفسها", "Proof of Impact That Speaks for Itself"), subtitle: b("أرقامٌ تعكس مسيرتنا نحو مستقبلهم.", "Numbers that reflect our journey toward their future.") },
      },
      {
        key: "whyusHeader",
        label: "ترويسة «لماذا عبور»",
        fields: [
          { key: "badge", label: "الشارة", type: "text", bilingual: true },
          { key: "heading", label: "العنوان", type: "text", bilingual: true },
          { key: "subtitle", label: "الجملة", type: "textarea", bilingual: true, colSpan: 2 },
        ],
        value: { badge: b("لماذا عبور؟", "Why Oboor?"), heading: b("العبور الأفضل يبدأ من عبور", "The Best Path of Progress Begins at Oboor"), subtitle: b("نُرسّخ ركائز التمكين، لنعبر بطفلك نحو غدٍ أبهى.", "We strengthen the foundations of empowerment.") },
      },
      {
        key: "successHeader",
        label: "ترويسة «أبطال عبور»",
        fields: [
          { key: "badge", label: "الشارة", type: "text", bilingual: true },
          { key: "heading", label: "العنوان", type: "text", bilingual: true },
          { key: "subtitle", label: "الجملة", type: "textarea", bilingual: true, colSpan: 2 },
        ],
        value: { badge: b("أبطال عبور", "Oboor Champions"), heading: b("عبروا، وعبّروا!", "They crossed barriers and found their voice"), subtitle: b("قصص لحياة تغيرت، وملامح طفولة استعادت بهجتها.", "Stories of transformed lives and childhoods that regained their joy.") },
      },
      {
        key: "galleryHeader",
        label: "ترويسة المعرض",
        fields: [
          { key: "badge", label: "الشارة", type: "text", bilingual: true },
          { key: "heading", label: "العنوان", type: "text", bilingual: true },
        ],
        value: { badge: b("المعرض", "Gallery"), heading: b("ملامح من عبور", "Moments from Oboor") },
      },
      {
        key: "newsHeader",
        label: "ترويسة الأخبار والاعتمادات",
        fields: [
          { key: "newsHeading", label: "عنوان الأخبار", type: "text", bilingual: true },
          { key: "newsSub", label: "جملة الأخبار", type: "text", bilingual: true, colSpan: 2 },
          { key: "certsHeading", label: "عنوان الاعتمادات", type: "text", bilingual: true },
          { key: "certsSub", label: "جملة الاعتمادات", type: "text", bilingual: true, colSpan: 2 },
        ],
        value: { newsHeading: b("صدى العبور وحراكه", "The Impact of Oboor in Motion"), newsSub: b("هنا ندوّن تفاصيل الأثر، تابع آخر المستجدات.", "Here, we document the details of our impact."), certsHeading: b("عبور، بالشهادات العالمية", "Oboor, Globally Accredited"), certsSub: b("سجلٌ حافل بالاعتمادات، مبنيٌ على أعلى معايير الجودة.", "A distinguished record of international accreditations.") },
      },
    ],
  },
  {
    key: "page_about",
    label: "صفحة «عن عبور»",
    icon: "user",
    category: "pages",
    sections: [
      {
        key: "hero",
        label: "الترويسة",
        fields: [
          { key: "badge", label: "الشارة", type: "text", bilingual: true },
          { key: "heading", label: "العنوان", type: "text", bilingual: true },
          { key: "desc", label: "الوصف", type: "textarea", bilingual: true, colSpan: 2 },
        ],
        value: { badge: b("من نحن", "About Us"), heading: b("عن مركز عبور", "About Oboor Center"), desc: b("وجهتكم المتخصصة في تأهيل ورعاية الأطفال.", "Your specialized destination for children's rehabilitation and care.") },
      },
    ],
  },
  {
    key: "page_branches",
    label: "صفحة الفروع",
    icon: "pin",
    category: "pages",
    sections: [
      {
        key: "hero",
        label: "الترويسة",
        fields: [
          { key: "badge", label: "الشارة", type: "text", bilingual: true },
          { key: "heading", label: "العنوان", type: "text", bilingual: true },
          { key: "desc", label: "الوصف", type: "textarea", bilingual: true, colSpan: 2 },
        ],
        value: { badge: b("فروعنا في المملكة", "Our Branches Across the Kingdom"), heading: b("مراكزنا، رعايةٌ تمتد من حولك", "Our Centers — Care That Extends to You"), desc: b("ابحث عن أقرب فرع إليك واستكشف خدماتنا.", "Find your nearest branch and explore our services.") },
      },
      {
        key: "map",
        label: "قسم الخريطة",
        fields: [
          { key: "heading", label: "العنوان", type: "text", bilingual: true },
          { key: "subtitle", label: "الجملة", type: "text", bilingual: true, colSpan: 2 },
        ],
        value: { heading: b("على بُعد خطوة منك", "Just One Step Away"), subtitle: b("بضغطة على الخريطة، تجد أقرب فرع إليك.", "With a tap on the map, find the nearest branch.") },
      },
      {
        key: "cta",
        label: "قسم الدعوة (CTA)",
        fields: [
          { key: "badge", label: "الشارة", type: "text", bilingual: true },
          { key: "heading", label: "العنوان", type: "text", bilingual: true },
          { key: "desc", label: "الوصف", type: "textarea", bilingual: true, colSpan: 2 },
        ],
        value: { badge: b("فريقنا معك، في كل وقت", "Our team is with you at all times."), heading: b("أتحتاجنا بجانبك لاختيار الوجهة؟", "Need help choosing the right option?"), desc: b("نحن هنا لنكون بوصلتك؛ نختار معًا الفرع الأقرب لطفلك.", "We are here to guide you to the most suitable branch.") },
      },
    ],
  },
  {
    key: "page_admission",
    label: "صفحة طلب الالتحاق",
    icon: "clipboard",
    category: "pages",
    sections: [
      {
        key: "hero",
        label: "الترويسة",
        fields: [
          { key: "badge", label: "الشارة", type: "text", bilingual: true, colSpan: 2 },
          { key: "heading", label: "العنوان", type: "text", bilingual: true },
          { key: "desc", label: "الوصف", type: "textarea", bilingual: true, colSpan: 2 },
          { key: "submit", label: "زر إرسال النموذج", type: "text", bilingual: true },
        ],
        value: { badge: b("التسجيل متاح الآن في جميع الفروع", "Registration is now open at all branches"), heading: b("غدُه بانتظار خطوتك", "A Future Awaits Your First Step"), desc: b("سجّل طلب الالتحاق لطفلك. نموذج التسجيل يسير ويختصر الكثير.", "Submit your child's enrollment request."), submit: b("أرسل طلب الالتحاق الآن", "Submit Enrollment Request Now") },
      },
    ],
  },
  {
    key: "page_contact",
    label: "صفحة التواصل",
    icon: "phone",
    category: "pages",
    sections: [
      {
        key: "hero",
        label: "الترويسة",
        fields: [
          { key: "badge", label: "الشارة", type: "text", bilingual: true, colSpan: 2 },
          { key: "heading", label: "العنوان", type: "text", bilingual: true },
          { key: "desc", label: "الوصف", type: "textarea", bilingual: true, colSpan: 2 },
        ],
        value: { badge: b("معًا نُمهّد لهم الطريق، ليعبروا بأمان", "Together, We Pave the Way for Their Safe Journey"), heading: b("تواصل معنا", "Contact Us"), desc: b("نسعد بتواصلك معنا للإجابة على استفساراتك والاستماع إليك.", "We are pleased to connect with you and listen to your needs.") },
      },
      {
        key: "form",
        label: "قسم النموذج",
        fields: [
          { key: "badge", label: "الشارة", type: "text", bilingual: true },
          { key: "heading", label: "العنوان", type: "text", bilingual: true },
        ],
        value: { badge: b("دائمًا بالقرب", "Always Close to You"), heading: b("ارسل طلبك", "Send Your Request") },
      },
    ],
  },
  {
    key: "page_programs",
    label: "صفحة برامجنا",
    icon: "grid",
    category: "pages",
    sections: [
      {
        key: "hero",
        label: "الترويسة",
        fields: [
          { key: "badge", label: "الشارة", type: "text", bilingual: true },
          { key: "heading", label: "العنوان", type: "text", bilingual: true },
          { key: "desc", label: "الوصف", type: "textarea", bilingual: true, colSpan: 2 },
        ],
        value: { badge: b("برامجنا التمكينية", "Our Empowerment Programs"), heading: b("خدمات مراكز عبور", "Oboor Centers Services"), desc: b("منظومة متكاملة من البرامج والخدمات والتقنيات.", "An integrated system of programs, services and technologies.") },
      },
      {
        key: "tabs",
        label: "تبويبات الصفحة",
        fields: [
          { key: "programs", label: "تبويب البرامج", type: "text", bilingual: true },
          { key: "clinical", label: "تبويب الخدمات العيادية", type: "text", bilingual: true },
          { key: "techniques", label: "تبويب التقنيات", type: "text", bilingual: true },
        ],
        value: { programs: b("برامج تأهيلية", "Rehabilitation Programs"), clinical: b("خدمات عيادية", "Clinical Services"), techniques: b("تقنيات تأهيلية", "Technologies") },
      },
      {
        key: "cta",
        label: "قسم الدعوة (CTA)",
        fields: [
          { key: "heading", label: "العنوان", type: "text", bilingual: true },
          { key: "desc", label: "الوصف", type: "textarea", bilingual: true, colSpan: 2 },
          { key: "button", label: "الزر", type: "text", bilingual: true },
        ],
        value: { heading: b("لم تجد ما يناسب طفلك؟", "Didn't find what suits your child?"), desc: b("تواصل معنا وسنساعدك في اختيار الأنسب.", "Contact us and we'll help you choose the best fit."), button: b("تواصل معنا", "Contact Us") },
      },
    ],
  },
  {
    key: "page_specialists",
    label: "صفحة روّادنا",
    icon: "user",
    category: "pages",
    sections: [
      {
        key: "hero",
        label: "الترويسة",
        fields: [
          { key: "badge", label: "الشارة", type: "text", bilingual: true },
          { key: "heading", label: "العنوان", type: "text", bilingual: true },
          { key: "desc", label: "الوصف", type: "textarea", bilingual: true, colSpan: 2 },
        ],
        value: { badge: b("فريق معتمد ومؤهل", "A certified and qualified team"), heading: b("الأخصائيين", "Specialists"), desc: b("تعرف على فريقنا من الأخصائيين المؤهلين.", "Meet our team of qualified specialists.") },
      },
      {
        key: "join",
        label: "قسم «انضم إلى فريقنا»",
        fields: [
          { key: "badge", label: "الشارة", type: "text", bilingual: true },
          { key: "heading", label: "العنوان", type: "text", bilingual: true },
          { key: "desc", label: "الوصف", type: "textarea", bilingual: true, colSpan: 2 },
          { key: "button", label: "الزر", type: "text", bilingual: true },
        ],
        value: { badge: b("انضم إلى فريقنا", "Join Our Team"), heading: b("انضم إلى فريق الأخصائيين", "Join the Specialists Team"), desc: b("إذا كنت أخصائيًا في مجالات التأهيل وترغب في الانضمام إلينا.", "If you are a specialist and would like to join us."), button: b("قدّم الآن", "Apply Now") },
      },
    ],
  },
  {
    key: "page_success",
    label: "صفحة أبطال عبور",
    icon: "star",
    category: "pages",
    sections: [
      {
        key: "hero",
        label: "الترويسة",
        fields: [
          { key: "badge", label: "الشارة", type: "text", bilingual: true },
          { key: "heading", label: "العنوان", type: "text", bilingual: true },
          { key: "desc", label: "الوصف", type: "textarea", bilingual: true, colSpan: 2 },
        ],
        value: { badge: b("قصص حقيقية من عائلاتنا", "Real stories from our families"), heading: b("أبناؤنا يُلهمونا كل يوم", "Our children inspire us every day"), desc: b("كل قصة نجاح تُعبّر عن رحلة حقيقية من التحدي إلى الإنجاز.", "Every success story reflects a real journey from challenge to achievement.") },
      },
      {
        key: "cta",
        label: "قسم الدعوة (CTA)",
        fields: [
          { key: "heading", label: "العنوان", type: "text", bilingual: true },
          { key: "desc", label: "الوصف", type: "textarea", bilingual: true, colSpan: 2 },
        ],
        value: { heading: b("ابدأ تقييم طفلك الآن", "Start your child's assessment now"), desc: b("التقييم المبكر هو بداية كل قصة نجاح.", "Early assessment is the beginning of every success story.") },
      },
    ],
  },
  {
    key: "page_careers",
    label: "صفحة انضم إلينا",
    icon: "briefcase",
    category: "pages",
    sections: [
      {
        key: "hero",
        label: "الترويسة",
        fields: [
          { key: "badge", label: "الشارة", type: "text", bilingual: true },
          { key: "heading", label: "العنوان", type: "text", bilingual: true },
          { key: "desc", label: "الوصف", type: "textarea", bilingual: true, colSpan: 2 },
        ],
        value: { badge: b("انضم إلى فريق عبور", "Join the Oboor Team"), heading: b("الوظائف المتاحة", "Open Positions"), desc: b("ابحث عن فرصتك المهنية ضمن فريقنا المتخصص.", "Find your career opportunity within our specialized team.") },
      },
      {
        key: "filters",
        label: "عناوين التصفية",
        fields: [
          { key: "filterTitle", label: "عنوان التصفية", type: "text", bilingual: true },
          { key: "cityLabel", label: "المدينة", type: "text", bilingual: true },
          { key: "typeLabel", label: "نوع الدوام", type: "text", bilingual: true },
          { key: "searchPlaceholder", label: "نص البحث", type: "text", bilingual: true },
        ],
        value: { filterTitle: b("تصفية", "Filter"), cityLabel: b("المدينة", "City"), typeLabel: b("نوع الدوام", "Employment Type"), searchPlaceholder: b("ابحث عن وظيفة", "Search for a job") },
      },
    ],
  },
  {
    key: "page_news",
    label: "صفحة إعلامنا",
    icon: "news",
    category: "pages",
    sections: [
      {
        key: "hero",
        label: "الترويسة",
        fields: [
          { key: "badge", label: "الشارة", type: "text", bilingual: true },
          { key: "heading", label: "العنوان", type: "text", bilingual: true },
          { key: "desc", label: "الوصف", type: "textarea", bilingual: true, colSpan: 2 },
        ],
        value: { badge: b("إعلامنا", "Our Media"), heading: b("أحدث الأخبار والفعاليات", "Latest News & Events"), desc: b("تابع آخر مستجدات المركز وأنشطته.", "Follow the center's latest updates and activities.") },
      },
      {
        key: "sections",
        label: "عناوين الأقسام",
        fields: [
          { key: "workshops", label: "قسم الورش", type: "text", bilingual: true },
          { key: "centerNews", label: "قسم أخبار المركز", type: "text", bilingual: true },
          { key: "events", label: "قسم الفعاليات", type: "text", bilingual: true },
          { key: "articles", label: "قسم المقالات", type: "text", bilingual: true },
        ],
        value: { workshops: b("الورش التدريبية", "Training Workshops"), centerNews: b("أخبار المركز", "Center News"), events: b("الفعاليات القادمة", "Upcoming Events"), articles: b("مقالات ومدوّنات", "Articles & Blogs") },
      },
    ],
  },
  {
    key: "page_gallery",
    label: "صفحة المعرض",
    icon: "image",
    category: "pages",
    sections: [
      {
        key: "hero",
        label: "الترويسة",
        fields: [
          { key: "badge", label: "الشارة", type: "text", bilingual: true },
          { key: "heading", label: "العنوان", type: "text", bilingual: true },
          { key: "desc", label: "الوصف", type: "textarea", bilingual: true, colSpan: 2 },
        ],
        value: { badge: b("المعرض", "Gallery"), heading: b("ملامح من عبور", "Moments from Oboor"), desc: b("لقطات من أنشطة المركز وفعالياته.", "Snapshots from the center's activities and events.") },
      },
      {
        key: "filters",
        label: "فلاتر المعرض",
        fields: [{ key: "filters", label: "تصنيفات الصور", type: "list", bilingual: true, colSpan: 2 }],
        value: { filters: [b("الكل", "All"), b("الأنشطة", "Activities"), b("الجلسات", "Sessions"), b("الفعاليات", "Events")] as never },
      },
    ],
  },
  {
    key: "page_assessment",
    label: "صفحة التقييم",
    icon: "clipboard",
    category: "pages",
    sections: [
      {
        key: "hero",
        label: "الترويسة",
        fields: [
          { key: "badge", label: "الشارة", type: "text", bilingual: true },
          { key: "heading", label: "العنوان", type: "text", bilingual: true },
          { key: "desc", label: "الوصف", type: "textarea", bilingual: true, colSpan: 2 },
        ],
        value: { badge: b("تقييم مبدئي مجاني", "Free preliminary assessment"), heading: b("قيّم طفلك الآن", "Assess Your Child Now"), desc: b("أجرِ تقييمًا أوليًا سريعًا لمعرفة احتياجات طفلك.", "Take a quick preliminary assessment to understand your child's needs.") },
      },
      {
        key: "steps",
        label: "خطوات التقييم",
        fields: [
          { key: "step1", label: "الخطوة الأولى", type: "text", bilingual: true },
          { key: "step2", label: "الخطوة الثانية", type: "text", bilingual: true },
          { key: "step3", label: "الخطوة الثالثة", type: "text", bilingual: true },
          { key: "startButton", label: "زر البدء", type: "text", bilingual: true },
        ],
        value: { step1: b("اختر نوع التقييم", "Choose the assessment type"), step2: b("أجب عن الأسئلة", "Answer the questions"), step3: b("احصل على النتيجة", "Get your result"), startButton: b("ابدأ التقييم", "Start Assessment") },
      },
    ],
  },
  {
    key: "page_details",
    label: "صفحات التفاصيل (عام)",
    icon: "document",
    category: "pages",
    sections: [
      {
        key: "program",
        label: "تفاصيل البرنامج",
        fields: [
          { key: "about", label: "عنوان «عن البرنامج»", type: "text", bilingual: true },
          { key: "philosophy", label: "عنوان «فلسفة البرنامج»", type: "text", bilingual: true },
          { key: "info", label: "عنوان «معلومات البرنامج»", type: "text", bilingual: true },
          { key: "areas", label: "عنوان «مجالات التدريب»", type: "text", bilingual: true },
          { key: "stations", label: "عنوان «المحطات التطبيقية»", type: "text", bilingual: true },
        ],
        value: { about: b("عن البرنامج", "About the Program"), philosophy: b("فلسفة البرنامج", "Program Philosophy"), info: b("معلومات البرنامج", "Program Information"), areas: b("مجالات التدريب", "Training Areas"), stations: b("المحطات التطبيقية", "Practical Stations") },
      },
      {
        key: "common",
        label: "عناصر مشتركة",
        fields: [
          { key: "viewDetails", label: "زر «عرض التفاصيل»", type: "text", bilingual: true },
          { key: "readMore", label: "زر «اقرأ المزيد»", type: "text", bilingual: true },
          { key: "directions", label: "زر «الاتجاهات»", type: "text", bilingual: true },
          { key: "backHome", label: "مسار «الرئيسية»", type: "text", bilingual: true },
        ],
        value: { viewDetails: b("عرض التفاصيل", "View Details"), readMore: b("اقرأ المزيد", "Read More"), directions: b("الاتجاهات", "Directions"), backHome: b("الرئيسية", "Home") },
      },
    ],
  },
];

export function getSettingsGroup(key: string): SettingsGroup | undefined {
  return SETTINGS.find((g) => g.key === key);
}
