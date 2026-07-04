// محتوى دليل استخدام لوحة التحكّم (ثنائي اللغة). صفحة العرض: src/app/cms/guide/page.tsx
// كل خطوة قد تحمل لقطة شاشة تُحلّ حسب اللغة إلى /guide/<lang>/<area>/<name>.png

export type GuideShot = { area: "cms" | "site"; name: string; caption_ar?: string; caption_en?: string };
export type GuideStep = { ar: string; en: string; shot?: GuideShot };
export type GuideSection = {
  id: string;
  title_ar: string; title_en: string;
  intro_ar?: string; intro_en?: string;
  steps: GuideStep[];
};
export type GuidePart = { id: string; title_ar: string; title_en: string; sections: GuideSection[] };

export const GUIDE: GuidePart[] = [
  {
    id: "cms",
    title_ar: "إدارة لوحة التحكّم",
    title_en: "Managing the Control Panel",
    sections: [
      {
        id: "login",
        title_ar: "تسجيل الدخول",
        title_en: "Signing In",
        intro_ar: "لوحة التحكّم محميّة باسم مستخدم وكلمة مرور. لن يستطيع أحد الوصول إليها أو تعديل الموقع دون تسجيل دخول.",
        intro_en: "The control panel is protected by a username and password. No one can access it or change the site without signing in.",
        steps: [
          { ar: "افتح رابط لوحة التحكّم المنتهي بـ /cms. إن لم تكن مسجّلاً للدخول ستظهر لك شاشة الدخول.", en: "Open the control-panel link ending with /cms. If you're not signed in, the sign-in screen appears.", shot: { area: "cms", name: "login" } },
          { ar: "اكتب اسم المستخدم وكلمة المرور ثم اضغط «تسجيل الدخول».", en: "Enter your username and password, then click “Sign in”." },
          { ar: "لتغيير لغة اللوحة نفسها (عربي/إنجليزي) استخدم زر الكرة الأرضية أعلى الشاشة — وهو متاح حتى قبل الدخول.", en: "To switch the panel's own language (Arabic/English), use the globe button at the top — available even before signing in." },
          { ar: "عند الانتهاء، اضغط زر الخروج (السهم) أعلى يمين/يسار الشريط العلوي لتسجيل الخروج بأمان.", en: "When done, click the log-out (arrow) button in the top bar to sign out safely." },
        ],
      },
      {
        id: "dashboard",
        title_ar: "لوحة التحكّم الرئيسية",
        title_en: "The Dashboard",
        intro_ar: "أول شاشة تظهر بعد الدخول. تعطيك نظرة سريعة على نشاط الموقع وتوصلك لكل شيء.",
        intro_en: "The first screen after signing in. It gives you a quick overview of site activity and links to everything.",
        steps: [
          { ar: "في الأعلى ترى ترحيباً وملخّصاً: إجمالي عناصر المحتوى، إجمالي الطلبات الواردة، وحالة إعدادات الموقع.", en: "At the top you see a welcome and a summary: total content items, total incoming requests, and the site-settings status.", shot: { area: "cms", name: "dashboard" } },
          { ar: "بطاقات «الطلبات» تعرض أعداد الرسائل وطلبات الالتحاق والتوظيف والتقييم — اضغط أيّها للانتقال إليه مباشرة.", en: "The “Requests” cards show the counts of messages, admission, job, and assessment requests — click any to jump straight to it." },
          { ar: "«إجراءات سريعة» اختصارات لإضافة خبر أو أخصائي أو برنامج أو صورة بضغطة واحدة.", en: "“Quick Actions” are one-click shortcuts to add a news item, specialist, program, or image." },
          { ar: "أسفل الصفحة كل أقسام المحتوى مجمّعة (محتوى الموقع، البرامج والخدمات، الموارد) — اضغط أي قسم لإدارته.", en: "Lower down, all content areas are grouped (Site Content, Programs & Services, Resources) — click any to manage it." },
          { ar: "القائمة الجانبية موجودة دائماً للتنقّل بين كل الأقسام. يمكنك البحث فيها من خانة البحث أعلاها.", en: "The sidebar is always available to move between all areas. You can filter it from the search box at its top." },
        ],
      },
      {
        id: "page-text",
        title_ar: "تعديل نصوص وعناوين الصفحات",
        title_en: "Editing Page Texts & Headings",
        intro_ar: "كل صفحة في الموقع لها «نصوص وعناوين» ثابتة (مثل عنوان الصفحة، الفقرات، نصوص الأزرار). تُعدّل من محرّر مخصّص أعلى صفحة القسم.",
        intro_en: "Every page has fixed “texts & headings” (page title, paragraphs, button labels). You edit these from a dedicated editor at the top of the section page.",
        steps: [
          { ar: "افتح الصفحة المطلوبة من القائمة (مثل «الصفحة الرئيسية» أو «عن عبور»). في الأعلى ستجد لوحة «محتوى وعناوين الصفحة».", en: "Open the target page from the sidebar (e.g. “Home Page” or “About Oboor”). At the top you'll find the “Page content & headings” panel.", shot: { area: "cms", name: "page-content-home" } },
          { ar: "كل حقل نصّي له خانتان جنباً إلى جنب: العربية والإنجليزية. اكتب النص في كل لغة كما تريده أن يظهر للزائر.", en: "Each text field has two boxes side by side: Arabic and English. Type the text in each language as you want visitors to see it." },
          { ar: "بعض العناصر لها صورة أو رقم — عدّلها من نفس المكان. الصور تُرفع بالضغط على «تغيير الصورة».", en: "Some items have an image or a number — edit them in the same place. Images are uploaded by clicking “Change image”." },
          { ar: "اضغط «حفظ» بعد كل تعديل. سيظهر تأكيد «تم الحفظ ✓»، ويظهر التعديل على الموقع خلال لحظات.", en: "Click “Save” after each change. A “Saved ✓” confirmation appears, and the change shows on the site within moments." },
        ],
      },
      {
        id: "collections",
        title_ar: "إدارة المحتوى (القوائم): إضافة وتعديل وحذف وترتيب",
        title_en: "Managing Content (Lists): Add, Edit, Delete, Reorder",
        intro_ar: "الأقسام المتكرّرة (الفروع، الأخبار، الأخصائيون، البرامج…) تُدار كقوائم. كل عنصر في القائمة يمكن تعديله أو حذفه، ويمكنك إضافة عناصر جديدة.",
        intro_en: "Repeating areas (branches, news, specialists, programs…) are managed as lists. Each list item can be edited or deleted, and you can add new items.",
        steps: [
          { ar: "افتح القسم من القائمة الجانبية. ستظهر قائمة بكل العناصر مع حالتها (منشور/مخفي).", en: "Open the area from the sidebar. A list of all items appears with each item's status (Published/Hidden).", shot: { area: "cms", name: "list-branches" } },
          { ar: "للإضافة: اضغط الزر الأزرق أعلى الصفحة (مثل «إضافة فرع»). لتعديل عنصر: اضغط «تعديل» بجانبه. للحذف: اضغط «حذف» (سيطلب تأكيداً).", en: "To add: click the blue button at the top (e.g. “Add Branch”). To edit an item: click “Edit” next to it. To delete: click “Delete” (it asks for confirmation)." },
          { ar: "القوائم الكبيرة (مثل الفروع) مقسّمة إلى مجموعات قابلة للطيّ (حسب المنطقة مثلاً) — اضغط رأس المجموعة لفتحها.", en: "Large lists (like branches) are split into collapsible groups (e.g. by region) — click a group header to expand it." },
          { ar: "لإعادة الترتيب: استخدم سهمَي الأعلى/الأسفل بجانب العنصر. الترتيب هنا هو نفسه ترتيب الظهور على الموقع.", en: "To reorder: use the up/down arrows next to an item. The order here is the same order shown on the site." },
          { ar: "الأخبار والوظائف تُرتَّب تلقائياً بالأحدث أولاً، لذلك لا تظهر لها أسهم ترتيب.", en: "News and jobs are ordered automatically (newest first), so they don't show reorder arrows." },
          { ar: "بعض القوائم يظهر أعلاها محرّر «محتوى وعناوين الصفحة» للتحكّم في عنوان القسم ووصفه على الموقع.", en: "Some lists show a “Page content & headings” editor at the top to control that section's title and description on the site." },
        ],
      },
      {
        id: "editor",
        title_ar: "محرّر العنصر: الحقول ثنائية اللغة، الاكتمال، الصور، الحفظ والمعاينة",
        title_en: "The Item Editor: Bilingual Fields, Completion, Images, Save & Preview",
        intro_ar: "عند إضافة أو تعديل أي عنصر تفتح شاشة المحرّر. هي أهم شاشة في اللوحة، وهذه شرحها بالتفصيل.",
        intro_en: "Adding or editing any item opens the editor screen. It's the most important screen in the panel — here it is in detail.",
        steps: [
          { ar: "الحقول ثنائية اللغة تظهر في عمودين متجاورين: العربية والإنجليزية. املأ اللغتين معاً حتى يظهر المحتوى صحيحاً في نسختَي الموقع.", en: "Bilingual fields appear in two adjacent columns: Arabic and English. Fill both so the content shows correctly in both site versions.", shot: { area: "cms", name: "editor" } },
          { ar: "أعلى المحرّر شريط «نسبة الاكتمال». يحسب الحقول الأساسية المطلوبة، ويكتب لك تحته «الحقول الناقصة» إن وُجدت — استهدف الوصول إلى 100%.", en: "At the top is a “Completion” bar. It counts the essential required fields and lists any “Missing” fields below it — aim for 100%." },
          { ar: "حقل الصورة: اضغط لرفع صورة من جهازك. بعض الأنواع تدعم قصّ الصورة قبل الحفظ. تظهر معاينة فور الرفع.", en: "Image field: click to upload an image from your device. Some types let you crop before saving. A preview shows immediately after upload." },
          { ar: "حقول التاريخ تفتح تقويماً للاختيار (بدل الكتابة اليدوية)، وحقول الوقت تعطيك «من / إلى». هذا يمنع أخطاء التنسيق.", en: "Date fields open a calendar picker (instead of typing), and time fields give you a “from / to” pair. This prevents formatting mistakes." },
          { ar: "القوائم (مثل الخدمات أو النقاط) تُحرَّر كعناصر تُضاف وتُحذف بزر — لا داعي لكتابة أكواد. الصفوف الفارغة تُحذف تلقائياً عند الحفظ.", en: "Lists (like services or bullet points) are edited as add/remove items with a button — no code needed. Empty rows are dropped automatically on save." },
          { ar: "زر «حفظ التعديلات» يعمل فقط عند وجود تغيير فعلي. بعد الحفظ يظهر «تم الحفظ ✓».", en: "The “Save Changes” button is active only when there's a real change. After saving, “Saved ✓” appears." },
          { ar: "«تجاهل التغييرات» يرجّع الحقول لآخر نسخة محفوظة. «استرجاع النسخة الافتراضية» يعيد العنصر لمحتواه الأصلي بالكامل (استخدمه بحذر).", en: "“Discard changes” reverts fields to the last saved version. “Restore Default” resets the item to its original content entirely (use with care)." },
          { ar: "زر «معاينة» يفتح الصفحة الحقيقية على الموقع بتعديلاتك الحالية قبل الحفظ — لتتأكد من الشكل النهائي.", en: "The “Preview” button opens the real site page with your current unsaved changes — to check the final look before saving." },
          { ar: "الحقول التقنية النادرة (مثل المعرّف) مخفيّة في لوحة «إعدادات متقدمة» وتُملأ تلقائياً — لا تحتاج للتعامل معها عادةً.", en: "Rare technical fields (like the identifier) are hidden in an “Advanced settings” panel and filled automatically — you normally don't need them." },
        ],
      },
      {
        id: "submissions",
        title_ar: "الطلبات والرسائل: العرض والفلترة والتصدير",
        title_en: "Requests & Messages: View, Filter, Export",
        intro_ar: "كل ما يرسله الزوّار (رسائل تواصل، طلبات التحاق، طلبات توظيف، نتائج تقييم) يصلك هنا في جداول منظّمة. هذه البيانات للقراءة والإدارة فقط.",
        intro_en: "Everything visitors send (contact messages, admission requests, job applications, assessment results) arrives here in organized tables. This data is for viewing and managing only.",
        steps: [
          { ar: "افتح النوع المطلوب من مجموعة «الطلبات والرسائل» في القائمة. يظهر جدول بكل الطلبات وأحدثها أولاً.", en: "Open the type from the “Requests & Messages” group in the sidebar. A table shows all requests, newest first.", shot: { area: "cms", name: "submissions-admission" } },
          { ar: "استخدم خانة البحث والفلاتر (المنطقة/الفرع، نوع الحالة، الفترة الزمنية) لتضييق النتائج بسرعة، و«إعادة تعيين» لمسح الفلاتر.", en: "Use the search box and filters (region/branch, case type, time range) to narrow results quickly, and “Reset” to clear filters." },
          { ar: "لكل طلب أزرار سريعة: مراسلة عبر الإيميل، واتساب، وعرض التفاصيل الكاملة. في طلبات التوظيف يظهر أيضاً زر لفتح ملف السيرة الذاتية.", en: "Each request has quick buttons: email, WhatsApp, and view full details. Job applications also show a button to open the CV file." },
          { ar: "زر «تصدير» ينزّل كل الطلبات كملف Excel منسّق (مع روابط السير الذاتية في طلبات التوظيف) — مناسب للأرشفة أو المشاركة.", en: "The “Export” button downloads all requests as a formatted Excel file (with CV links for job applications) — handy for archiving or sharing." },
          { ar: "يمكنك حذف طلب من زر «حذف» (بعد تأكيد). ملاحظة: بيانات الطلبات هي ما كتبه الزائر، لذلك تظهر بلغته كما أرسلها.", en: "You can delete a request via “Delete” (after confirmation). Note: request data is what the visitor typed, so it appears in their language as sent." },
        ],
      },
      {
        id: "settings",
        title_ar: "إعدادات الموقع",
        title_en: "Site Settings",
        intro_ar: "الإعدادات العامة التي تؤثّر على الموقع كله من مكان واحد.",
        intro_en: "Global settings that affect the whole site from one place.",
        steps: [
          { ar: "افتح «إعدادات الموقع» من أسفل القائمة. ستجد حقولاً مثل رقم الواتساب الموحّد وبيانات التواصل.", en: "Open “Site Settings” from the bottom of the sidebar. You'll find fields like the unified WhatsApp number and contact details.", shot: { area: "cms", name: "settings" } },
          { ar: "مثال مهم: حقل رقم الواتساب يتحكّم في كل أزرار الواتساب على مستوى الموقع كله — غيّره من هنا مرة واحدة.", en: "Key example: the WhatsApp number field controls every WhatsApp button across the entire site — change it here once." },
          { ar: "اضغط «حفظ» بعد التعديل. التغيير يسري على كل صفحات الموقع فوراً.", en: "Click “Save” after editing. The change applies to all site pages immediately." },
        ],
      },
    ],
  },
  {
    id: "site",
    title_ar: "صفحات الموقع ومن أين تُدار",
    title_en: "The Website Pages & Where They're Controlled",
    sections: [
      {
        id: "site-overview",
        title_ar: "نظرة عامة",
        title_en: "Overview",
        intro_ar: "هذا الجزء مرجع بصري: شكل كل صفحة في الموقع، وأي قسم في لوحة التحكّم يتحكّم فيها. كل الصفحات متاحة بالعربية والإنجليزية تلقائياً.",
        intro_en: "This part is a visual reference: how each site page looks, and which control-panel area manages it. All pages are available in Arabic and English automatically.",
        steps: [],
      },
      {
        id: "site-home",
        title_ar: "الصفحة الرئيسية",
        title_en: "Home Page",
        steps: [
          { ar: "واجهة الموقع: شرائح متحركة (هيرو)، نبذة، بحث ذكي، لماذا عبور، أرقام الإنجاز، قصص النجاح، المعرض، وأحدث الأخبار.", en: "The site's front page: a rotating hero, intro, smart search, why-Oboor, achievement numbers, success stories, gallery, and latest news.", shot: { area: "site", name: "home" } },
          { ar: "تُدار من: «الصفحة الرئيسية» في اللوحة (لكل قسم قائمته: الشرائح، الأرقام، المميزات، بطاقات البحث، المعرض…).", en: "Controlled from: “Home Page” in the panel (each part has its own list: slides, numbers, features, search cards, gallery…)." },
        ],
      },
      {
        id: "site-about",
        title_ar: "عن عبور",
        title_en: "About Oboor",
        steps: [
          { ar: "صفحة التعريف بالمركز: النبذة، الرؤية والرسالة، والمناطق.", en: "The center's about page: intro, vision & mission, and regions.", shot: { area: "site", name: "about" } },
          { ar: "تُدار من: «عن عبور (من نحن)» — نصوص وعناوين الصفحة.", en: "Controlled from: “About Oboor” — the page's texts and headings." },
        ],
      },
      {
        id: "site-programs",
        title_ar: "برامجنا التمكينية",
        title_en: "Our Programs",
        steps: [
          { ar: "تعرض البرامج والخدمات العيادية والتقنيات في تبويبات.", en: "Shows programs, clinical services, and techniques in tabs.", shot: { area: "site", name: "programs" } },
          { ar: "تُدار من: «البرامج»، «الخدمات العيادية»، و«التقنيات» في اللوحة.", en: "Controlled from: “Programs”, “Clinical Services”, and “Techniques” in the panel." },
        ],
      },
      {
        id: "site-branches",
        title_ar: "مراكزنا (الفروع)",
        title_en: "Our Centers (Branches)",
        steps: [
          { ar: "قائمة الفروع مع خريطة تفاعلية وبحث وتصفية حسب المنطقة، ولكل فرع صفحة تفاصيل.", en: "The branch list with an interactive map, search, and filtering by region, plus a details page per branch.", shot: { area: "site", name: "branches" } },
          { ar: "صفحة الفرع تعرض العنوان والمواعيد والمدير وأرقام التواصل والخدمات وزر الاتجاهات.", en: "A branch page shows address, hours, manager, contact numbers, services, and a Directions button.", shot: { area: "site", name: "branch-detail" } },
          { ar: "تُدار من: «مراكزنا (الفروع)» — كل فرع عنصر في القائمة بكل بياناته.", en: "Controlled from: “Our Centers (Branches)” — each branch is a list item with all its data." },
        ],
      },
      {
        id: "site-specialists",
        title_ar: "روّادنا (الأخصائيون)",
        title_en: "Our Pioneers (Specialists)",
        steps: [
          { ar: "يعرض فريق الأخصائيين مع فلترة بالتخصص والفرع، ولكل أخصائي بطاقة تفاصيل.", en: "Shows the specialists team with filtering by specialty and branch, and a details card per specialist.", shot: { area: "site", name: "specialists" } },
          { ar: "تُدار من: «روّادنا (الأخصائيون)».", en: "Controlled from: “Our Pioneers (Specialists)”." },
        ],
      },
      {
        id: "site-success",
        title_ar: "أبطال عبور (قصص النجاح)",
        title_en: "Oboor Champions (Success Stories)",
        steps: [
          { ar: "يعرض قصص نجاح المستفيدين.", en: "Shows beneficiaries' success stories.", shot: { area: "site", name: "success-stories" } },
          { ar: "تُدار من: «أبطال عبور (قصص النجاح)».", en: "Controlled from: “Oboor Champions (Success Stories)”." },
        ],
      },
      {
        id: "site-news",
        title_ar: "إعلامنا (الأخبار والمقالات)",
        title_en: "Our Media (News & Articles)",
        steps: [
          { ar: "قائمة الأخبار والمقالات والفعاليات، ولكل خبر صفحة مقال كاملة.", en: "The list of news, articles, and events, with a full article page per item.", shot: { area: "site", name: "news" } },
          { ar: "صفحة المقال تعرض الصورة والعنوان والمحتوى، وللفعاليات بيانات المكان والوقت.", en: "An article page shows the image, title, and content; events also show location and time.", shot: { area: "site", name: "news-article" } },
          { ar: "تُدار من: «إعلامنا (الأخبار والمقالات)».", en: "Controlled from: “Our Media (News & Articles)”." },
        ],
      },
      {
        id: "site-careers",
        title_ar: "انضم إلينا (الوظائف)",
        title_en: "Join Us (Careers)",
        steps: [
          { ar: "قائمة الوظائف المتاحة، ولكل وظيفة صفحة تفاصيل ونموذج تقديم.", en: "The list of open jobs, each with a details page and an application form.", shot: { area: "site", name: "careers" } },
          { ar: "طلبات المتقدّمين تصل إلى «طلبات التوظيف» في اللوحة. الوظائف نفسها تُدار من «انضم إلينا (الوظائف)».", en: "Applicants' submissions arrive in “Job Applications” in the panel. The jobs themselves are managed from “Join Us (Careers)”." },
        ],
      },
      {
        id: "site-forms",
        title_ar: "نماذج التواصل والالتحاق والتقييم",
        title_en: "Contact, Admission & Assessment Forms",
        steps: [
          { ar: "«خذ الخطوة» (تواصل) و«طلب الالتحاق» و«التقييم» نماذج يملؤها الزائر لإرسال طلبه.", en: "“Take the step” (contact), “Admission”, and “Assessment” are forms visitors fill to send a request.", shot: { area: "site", name: "admission" } },
          { ar: "نموذج التقييم عبارة عن خطوات متتابعة (Wizard) تنتهي بإرسال النتيجة.", en: "The assessment form is a step-by-step wizard that ends by submitting the result.", shot: { area: "site", name: "assessment" } },
          { ar: "كل ما يُرسَل من هذه النماذج يصلك في مجموعة «الطلبات والرسائل» في اللوحة.", en: "Everything sent from these forms arrives in the “Requests & Messages” group in the panel." },
        ],
      },
    ],
  },
];
