// محتوى دليل استخدام لوحة التحكّم (ثنائي اللغة). صفحة العرض: src/app/cms/guide/page.tsx
// كل خطوة قد تحمل لقطة شاشة تُحلّ حسب اللغة إلى /guide/<lang>/<area>/<name>.png

export type GuideShot = { area: "cms" | "site"; name: string; caption_ar?: string; caption_en?: string };
export type GuideStep = { ar: string; en: string; shot?: GuideShot };
export type FaqItem = { q_ar: string; q_en: string; a_ar: string; a_en: string };
export type GlossaryItem = { term_ar: string; term_en: string; def_ar: string; def_en: string };
export type GuideSection = {
  id: string;
  title_ar: string; title_en: string;
  intro_ar?: string; intro_en?: string;
  steps?: GuideStep[];
  faq?: FaqItem[];
  glossary?: GlossaryItem[];
};
export type GuidePart = { id: string; title_ar: string; title_en: string; sections: GuideSection[] };

const faq = (q_ar: string, q_en: string, a_ar: string, a_en: string): FaqItem => ({ q_ar, q_en, a_ar, a_en });
const term = (term_ar: string, term_en: string, def_ar: string, def_en: string): GlossaryItem => ({ term_ar, term_en, def_ar, def_en });

// اختصار لإنشاء خطوة بلقطة CMS
const cms = (name: string, ar: string, en: string, cap_ar?: string, cap_en?: string): GuideStep =>
  ({ ar, en, shot: { area: "cms", name, caption_ar: cap_ar, caption_en: cap_en } });
const site = (name: string, ar: string, en: string): GuideStep =>
  ({ ar, en, shot: { area: "site", name } });
const p = (ar: string, en: string): GuideStep => ({ ar, en });

export const GUIDE: GuidePart[] = [
  // ============================ الجزء 1: الأساسيات ============================
  {
    id: "basics",
    title_ar: "أساسيات لوحة التحكّم",
    title_en: "Control Panel Basics",
    sections: [
      {
        id: "login",
        title_ar: "تسجيل الدخول والخروج",
        title_en: "Signing In & Out",
        intro_ar: "لوحة التحكّم محميّة باسم مستخدم وكلمة مرور، فلا يستطيع أحد تعديل الموقع دون تسجيل دخول.",
        intro_en: "The control panel is protected by a username and password, so no one can change the site without signing in.",
        steps: [
          cms("login", "افتح رابط لوحة التحكّم المنتهي بـ /cms. إن لم تكن مسجّلاً ستظهر شاشة الدخول.", "Open the control-panel link ending with /cms. If you're not signed in, the sign-in screen appears."),
          p("اكتب اسم المستخدم وكلمة المرور ثم اضغط «تسجيل الدخول».", "Enter your username and password, then click “Sign in”."),
          p("زر الكرة الأرضية أعلى الشاشة يبدّل لغة اللوحة نفسها بين العربية والإنجليزية في أي وقت.", "The globe button at the top switches the panel's own language between Arabic and English at any time."),
          p("عند الانتهاء اضغط زر الخروج (السهم) أعلى الشريط لتسجيل الخروج بأمان — خاصة على جهاز مشترك.", "When done, click the log-out (arrow) button in the top bar to sign out safely — especially on a shared device."),
        ],
      },
      {
        id: "dashboard",
        title_ar: "لوحة التحكّم الرئيسية",
        title_en: "The Dashboard",
        intro_ar: "أول شاشة بعد الدخول؛ تعطيك نظرة سريعة وتوصلك لكل شيء.",
        intro_en: "The first screen after signing in; it gives a quick overview and links to everything.",
        steps: [
          cms("dashboard", "في الأعلى ترحيب وملخّص: إجمالي عناصر المحتوى، إجمالي الطلبات، وحالة إعدادات الموقع.", "At the top: a welcome and summary — total content items, total requests, and site-settings status."),
          p("بطاقات «الطلبات» تعرض أعداد الرسائل والالتحاق والتوظيف والتقييم — اضغط أيّها للانتقال إليه.", "The “Requests” cards show counts of messages, admission, jobs, and assessments — click any to open it."),
          p("«إجراءات سريعة» اختصارات لإضافة خبر أو أخصائي أو برنامج أو صورة بضغطة.", "“Quick Actions” are one-click shortcuts to add a news item, specialist, program, or image."),
          p("أسفل الصفحة كل أقسام المحتوى مجمّعة — اضغط أي قسم لإدارته.", "Lower down, all content areas are grouped — click any to manage it."),
        ],
      },
      {
        id: "navigation",
        title_ar: "التنقّل والبحث وتبديل اللغة",
        title_en: "Navigating, Searching & Switching Language",
        steps: [
          p("القائمة الجانبية مقسّمة إلى مجموعات: الطلبات والرسائل، صفحات الموقع، والإعدادات. اضغط أي عنصر للانتقال إليه.", "The sidebar is split into groups: Requests & Messages, Site Pages, and Settings. Click any item to go to it."),
          p("خانة البحث أعلى القائمة تصفّي الأقسام بالاسم — اكتب جزءاً من الاسم لتصل بسرعة.", "The search box at the top of the sidebar filters areas by name — type part of a name to jump quickly."),
          p("زر الكرة الأرضية أعلى الشريط يبدّل لغة اللوحة. هذا يغيّر لغة الأزرار والقوائم فقط — لا يؤثّر على محتوى الموقع.", "The globe button in the top bar switches the panel language. This changes only buttons and menus — it does not affect the site's content."),
          p("زر «رجوع» يعيدك للصفحة السابقة، وشعار «عبور» يعيدك للوحة الرئيسية.", "The “Back” button returns to the previous page, and the Oboor logo returns to the main dashboard."),
        ],
      },
    ],
  },

  // ==================== الجزء 2: التحكّم في المحتوى والعناصر ====================
  {
    id: "content",
    title_ar: "التحكّم في المحتوى والعناصر",
    title_en: "Managing Content & Elements",
    sections: [
      {
        id: "page-text",
        title_ar: "تعديل نصوص وعناوين الصفحات",
        title_en: "Editing Page Texts & Headings",
        intro_ar: "لكل صفحة نصوص وعناوين ثابتة (عنوان الصفحة، الفقرات، نصوص الأزرار). تُعدَّل من لوحة «محتوى وعناوين الصفحة» أعلى صفحة القسم.",
        intro_en: "Each page has fixed texts and headings (page title, paragraphs, button labels). Edit them from the “Page content & headings” panel at the top of the section page.",
        steps: [
          cms("page-content-home", "افتح الصفحة من القائمة (مثل «الصفحة الرئيسية»). في الأعلى تجد لوحة «محتوى وعناوين الصفحة» مقسّمة إلى أقسام الصفحة.", "Open the page from the sidebar (e.g. “Home Page”). At the top is the “Page content & headings” panel, split into the page's sections."),
          p("كل قسم قابل للطيّ — اضغط رأسه لفتحه وتظهر حقوله. عدّل النص الذي تريده واضغط «حفظ».", "Each section is collapsible — click its header to open it and reveal its fields. Edit the text you want, then click “Save”."),
          p("العناصر ذات الصور أو الأرقام تُعدَّل من نفس المكان مباشرة.", "Items with images or numbers are edited right there in the same place."),
        ],
      },
      {
        id: "collections",
        title_ar: "إدارة القوائم: إضافة وتعديل وحذف وترتيب",
        title_en: "Managing Lists: Add, Edit, Delete, Reorder",
        intro_ar: "الأقسام المتكرّرة (الفروع، الأخبار، الأخصائيون، البرامج…) تُدار كقوائم من عناصر.",
        intro_en: "Repeating areas (branches, news, specialists, programs…) are managed as lists of items.",
        steps: [
          cms("list-branches", "افتح القسم من القائمة. تظهر كل العناصر مع حالتها (منشور/مخفي). القوائم الكبيرة مقسّمة لمجموعات قابلة للطيّ.", "Open the area from the sidebar. All items show with their status (Published/Hidden). Large lists are split into collapsible groups."),
          cms("detail-list-rows", "اضغط رأس مجموعة لفتحها. بجانب كل عنصر: سهمَا ترتيب (لأعلى/أسفل)، زر «تعديل»، وزر «حذف».", "Click a group header to open it. Next to each item: up/down reorder arrows, an “Edit” button, and a “Delete” button."),
          p("للإضافة: اضغط الزر الأزرق أعلى الصفحة (مثل «إضافة فرع»). ستفتح شاشة المحرّر بحقول فارغة.", "To add: click the blue button at the top (e.g. “Add Branch”). The editor opens with empty fields."),
          p("للحذف: اضغط «حذف» ثم أكّد. الحذف نهائي، فتأكّد قبل التأكيد.", "To delete: click “Delete” then confirm. Deletion is permanent, so be sure before confirming."),
          p("ملاحظة: الأخبار والوظائف تُرتَّب تلقائياً بالأحدث أولاً، لذلك لا تظهر لها أسهم ترتيب.", "Note: news and jobs are auto-ordered (newest first), so they don't show reorder arrows."),
        ],
      },
      {
        id: "editor",
        title_ar: "محرّر العنصر: نظرة عامة",
        title_en: "The Item Editor: Overview",
        intro_ar: "عند الإضافة أو التعديل تفتح شاشة المحرّر — أهم شاشة في اللوحة. الأقسام التالية تشرح كل نوع من الحقول بالتفصيل.",
        intro_en: "Adding or editing opens the editor — the most important screen in the panel. The next sections explain each field type in detail.",
        steps: [
          cms("editor", "أعلى المحرّر شريط «نسبة الاكتمال» يقيس الحقول الأساسية المطلوبة ويكتب تحته «الحقول الناقصة». الحقول تظهر في عمودين: عربي وإنجليزي.", "At the top is a “Completion” bar measuring the essential required fields, listing any “Missing” below. Fields appear in two columns: Arabic and English."),
          p("أسفل الشاشة دائماً أزرار: «حفظ التعديلات» و«تجاهل التغييرات» و«معاينة». كل تعديل يحتاج ضغط «حفظ» ليُطبّق.", "At the bottom are always: “Save Changes”, “Discard changes”, and “Preview”. Every edit needs a “Save” click to apply."),
        ],
      },
      {
        id: "titles",
        title_ar: "العناوين والعناوين الفرعية",
        title_en: "Titles & Subtitles",
        intro_ar: "العنوان هو النص الكبير الأبرز في العنصر، والعنوان الفرعي نص أصغر أعلاه أو تحته.",
        intro_en: "The title is the item's most prominent large text; the subtitle is a smaller text above or below it.",
        steps: [
          cms("editor", "الحقل المعنون «الاسم» أو «العنوان» هو العنوان الرئيسي. لاحظ الشارة الصغيرة «Main Heading» التي تدل على أنه العنوان البارز.", "The field labeled “Name” or “Title” is the main heading. Notice the small “Main Heading” badge indicating it's the prominent title."),
          p("اكتب العنوان في الخانة العربية (يمين) والإنجليزية (يسار) معاً — كلٌّ يظهر في نسخة الموقع بلغته.", "Type the title in both the Arabic box (right) and the English box (left) — each shows in the matching site version."),
          p("العناوين الفرعية أو الشارات (Badge/Pill) لها حقول منفصلة مثل «العنوان الفرعي» أو «الوسم» — عدّلها بنفس الطريقة.", "Subtitles or badges/pills have separate fields like “Subtitle” or “Tag” — edit them the same way."),
          p("اجعل العناوين قصيرة وواضحة؛ العنوان الطويل جداً قد يبدو غير متناسق في التصميم.", "Keep titles short and clear; a very long title may look inconsistent in the design."),
        ],
      },
      {
        id: "text",
        title_ar: "النصوص والفقرات والأوصاف",
        title_en: "Text, Paragraphs & Descriptions",
        intro_ar: "الحقول الطويلة (الوصف، الفقرة، النبذة) تُكتب في مربّع نص أكبر ويظهر تحته عدّاد للأحرف.",
        intro_en: "Longer fields (description, paragraph, intro) are typed in a larger text box with a character counter below.",
        steps: [
          cms("editor", "الحقل المعنون «الوصف» أو «العنوان» بشارة «Paragraph Text» هو نص طويل — اكتب فيه الفقرة كاملة.", "The field labeled “Description”, or a field with a “Paragraph Text” badge, is a long text — type the full paragraph there."),
          p("بعض المربّعات لها حد أقصى (مثل 500 حرف) ويظهر عدّاد يخبرك بالمتبقّي — اكتب ضمن الحد.", "Some boxes have a maximum (e.g. 500 characters) with a counter showing what's left — stay within the limit."),
          p("اكتب النص في اللغتين. إن تركت الإنجليزية فارغة، سيظهر النص العربي في النسخة الإنجليزية كبديل — لكن يُفضّل تعبئة الاثنين.", "Write the text in both languages. If you leave English empty, the Arabic shows in the English version as a fallback — but filling both is preferred."),
        ],
      },
      {
        id: "icons",
        title_ar: "الأيقونات",
        title_en: "Icons",
        intro_ar: "كثير من العناصر (المميزات، بطاقات الخدمات، الخطوات…) لها أيقونة صغيرة تظهر بجانب العنوان. تُختار من مكتبة جاهزة — لا حاجة لرفع صور.",
        intro_en: "Many items (features, service cards, steps…) have a small icon shown next to the title. It's picked from a ready library — no image upload needed.",
        steps: [
          cms("detail-icon", "في محرّر العنصر انزل إلى حقل «الأيقونة». ستجد شبكة أيقونات جاهزة.", "In the item editor scroll to the “Icon” field. You'll find a grid of ready-made icons."),
          p("اضغط أي أيقونة لاختيارها — تُظلَّل باللون التركوازي لتأكيد الاختيار. لإزالة الأيقونة اضغط «بدون».", "Click any icon to select it — it highlights teal to confirm. To remove the icon, click “None”."),
          p("الأيقونة تظهر مباشرة على الموقع في مكان العنصر، وتتبع ألوان التصميم تلقائياً.", "The icon appears directly on the site at the item's place and follows the design colors automatically."),
          p("لا تنسَ الضغط على «حفظ» بعد تغيير الأيقونة.", "Don't forget to click “Save” after changing the icon."),
        ],
      },
      {
        id: "images",
        title_ar: "الصور",
        title_en: "Images",
        intro_ar: "الصور (صورة الفرع، الأخصائي، الخبر، شريحة الهيرو، صور المعرض) تُرفع من جهازك مباشرة.",
        intro_en: "Images (a branch, specialist, news, hero slide, gallery photos) are uploaded straight from your device.",
        steps: [
          cms("detail-image", "في المحرّر اضغط منطقة الصورة أو زر «رفع صورة»، ثم اختر الملف من جهازك.", "In the editor click the image area or the “Upload image” button, then choose the file from your device."),
          p("بعض الأنواع تسمح بقصّ الصورة (تحديد الجزء الظاهر) قبل الحفظ — اضبط الإطار ثم أكّد.", "Some types let you crop the image (choose the visible part) before saving — adjust the frame then confirm."),
          p("تظهر معاينة فور الرفع. لتغيير الصورة ارفع صورة جديدة فوق القديمة.", "A preview appears right after upload. To change it, upload a new image over the old one."),
          p("الحد الأقصى لحجم الصورة 5 ميجابايت. استخدم صوراً واضحة وبأبعاد مناسبة لأفضل ظهور.", "Maximum image size is 5 MB. Use clear, well-proportioned images for the best look."),
          p("المعرض (Gallery) يقبل عدة صور لنفس العنصر — أضف أو احذف صوراً منه بنفس الطريقة.", "A gallery accepts multiple images for one item — add or remove photos from it the same way."),
        ],
      },
      {
        id: "cards-lists",
        title_ar: "الكروت والقوائم",
        title_en: "Cards & Lists",
        intro_ar: "بعض الحقول عبارة عن قائمة عناصر متكرّرة (مثل قائمة الخدمات، النقاط، الخطوات، أو بطاقات داخل قسم). تُحرَّر بأزرار إضافة وحذف — دون كتابة أي أكواد.",
        intro_en: "Some fields are a list of repeating items (like a services list, bullet points, steps, or cards inside a section). They're edited with add/remove buttons — no code at all.",
        steps: [
          cms("detail-list", "انزل إلى الحقل الذي يظهر كقائمة (مثل «الخدمات»). كل سطر عنصر مستقل بخانته.", "Scroll to the field shown as a list (e.g. “Services”). Each row is a separate item with its own box."),
          p("لإضافة عنصر: اضغط زر «إضافة». لحذف عنصر: اضغط زر الحذف بجانب سطره. الأسطر الفارغة تُحذف تلقائياً عند الحفظ.", "To add an item: click the “Add” button. To delete: click the delete button beside its row. Empty rows are dropped automatically on save."),
          p("البطاقات المركّبة (لها عنوان + وصف + أيقونة معاً) تُحرَّر كمجموعة حقول لكل بطاقة، بالعربية والإنجليزية.", "Composite cards (with a title + description + icon together) are edited as a group of fields per card, in Arabic and English."),
          p("شكل البطاقة وتصميمها ثابتان للحفاظ على مظهر الموقع — أنت تتحكّم في المحتوى فقط، لا التصميم.", "A card's shape and design are fixed to keep the site consistent — you control the content only, not the design."),
        ],
      },
      {
        id: "buttons-links",
        title_ar: "الأزرار والروابط",
        title_en: "Buttons & Links",
        intro_ar: "بعض العناصر لها نص زر ووجهة (الرابط الذي يفتح عند الضغط).",
        intro_en: "Some items have a button label and a destination (the link that opens on click).",
        steps: [
          p("حقل «نص الزر» أو «العنوان» يحدّد الكلمات الظاهرة على الزر — اكتبها بالعربية والإنجليزية.", "The “Button label” or “Title” field sets the words shown on the button — write them in Arabic and English."),
          p("حقل «الرابط» أو «القيمة» يحدّد الوجهة: رابط داخلي في الموقع يبدأ بـ / مثل ‎/about، أو رابط خارجي كامل يبدأ بـ https://‎.", "The “Link” or “Value” field sets the destination: an internal link starting with / like /about, or a full external link starting with https://."),
          p("لروابط التواصل الاجتماعي والقائمة العلوية والفوتر، حقل «القيمة» هو عنوان الرابط.", "For social links and the top/footer menus, the “Value” field is the link address."),
        ],
      },
      {
        id: "numbers",
        title_ar: "الأرقام والإحصائيات",
        title_en: "Numbers & Statistics",
        steps: [
          p("أرقام الإنجاز (مثل «+30 أخصائي») تُدار من قسم «أرقام الإنجاز». كل رقم عنصر له «القيمة» و«التسمية».", "Achievement numbers (like “+30 specialists”) are managed from the “Achievement Numbers” area. Each is an item with a “Value” and a “Label”."),
          p("اكتب الرقم في حقل «القيمة» (يمكن أن يتضمّن + أو نصاً)، والوصف في حقل «التسمية» بالعربية والإنجليزية.", "Type the number in the “Value” field (it may include + or text), and the description in the “Label” field in Arabic and English."),
          p("لإضافة رقم جديد اضغط «إضافة رقم إنجاز»، ولإخفاء رقم اجعله «مخفي» بدل حذفه إن أردت إرجاعه لاحقاً.", "To add a new number click “Add Achievement Number”; to hide one, set it to “Hidden” instead of deleting if you may restore it later."),
        ],
      },
      {
        id: "order-publish",
        title_ar: "الترتيب والنشر والإخفاء",
        title_en: "Ordering, Publishing & Hiding",
        steps: [
          cms("detail-list-rows", "الترتيب: استخدم سهمَي الأعلى/الأسفل بجانب العنصر في القائمة. الترتيب هنا هو نفسه ترتيب الظهور على الموقع.", "Order: use the up/down arrows next to an item in the list. The order here is the same order shown on the site."),
          p("النشر/الإخفاء: كل عنصر له حالة «منشور» (يظهر للزوّار) أو «مخفي» (لا يظهر). غيّرها من داخل المحرّر.", "Publish/Hide: each item has a “Published” status (visible to visitors) or “Hidden” (not shown). Change it inside the editor."),
          p("الإخفاء أفضل من الحذف عندما تريد إيقاف عنصر مؤقتاً مع إمكانية إرجاعه لاحقاً.", "Hiding is better than deleting when you want to pause an item temporarily but keep the option to restore it."),
        ],
      },
      {
        id: "bilingual",
        title_ar: "الكتابة بلغتين (عربي وإنجليزي)",
        title_en: "Writing in Two Languages (Arabic & English)",
        intro_ar: "الموقع بنسختين: عربية وإنجليزية. أغلب الحقول لها خانتان جنباً إلى جنب.",
        intro_en: "The site has two versions: Arabic and English. Most fields have two boxes side by side.",
        steps: [
          cms("editor", "الخانة العربية والخانة الإنجليزية تظهران بشارة «Arabic» و«English». املأ الاثنتين حتى يظهر المحتوى صحيحاً في نسختَي الموقع.", "The Arabic and English boxes are marked with “Arabic” and “English” badges. Fill both so the content shows correctly in both site versions."),
          p("الأسماء العلمية (أسماء أشخاص أو أماكن) يمكن تركها كما هي إن لم يكن لها مقابل، لكن العناوين والنصوص العامة يُفضّل ترجمتها.", "Proper names (people or places) can stay as they are if they have no equivalent, but general titles and texts are best translated."),
          p("لمعاينة النسخة الإنجليزية من الموقع، بدّل لغة الموقع من زر اللغة في الموقع نفسه (منفصل عن لغة اللوحة).", "To preview the English site, switch the site language from the language button on the site itself (separate from the panel language)."),
        ],
      },
      {
        id: "save-preview",
        title_ar: "الاكتمال والحفظ والمعاينة والاسترجاع",
        title_en: "Completion, Saving, Preview & Restore",
        steps: [
          p("شريط «نسبة الاكتمال» أعلى المحرّر يوضّح كم حقلاً أساسياً تبقّى، ويكتب أسماء «الحقول الناقصة». استهدف 100%.", "The “Completion” bar at the top shows how many essential fields remain and lists the “Missing” fields. Aim for 100%."),
          p("«حفظ التعديلات» يعمل فقط عند وجود تغيير فعلي. بعد الحفظ يظهر «تم الحفظ ✓» ويظهر التعديل على الموقع خلال لحظات.", "“Save Changes” is active only when there's a real change. After saving, “Saved ✓” appears and the change shows on the site within moments."),
          p("زر «معاينة» يفتح الصفحة الحقيقية بتعديلاتك الحالية قبل الحفظ — لتتأكّد من الشكل النهائي.", "The “Preview” button opens the real page with your current unsaved changes — to check the final look before saving."),
          p("«تجاهل التغييرات» يرجّع الحقول لآخر نسخة محفوظة. «استرجاع النسخة الافتراضية» يعيد العنصر لمحتواه الأصلي بالكامل (استخدمه بحذر).", "“Discard changes” reverts to the last saved version. “Restore Default” resets the item to its original content entirely (use with care)."),
          p("الحقول التقنية النادرة (مثل المعرّف الداخلي) تُملأ تلقائياً وتبقى مخفيّة ما دامت فارغة — لا تحتاج للتعامل معها عادةً.", "Rare technical fields (like the internal identifier) are filled automatically and stay hidden while empty — you normally don't deal with them."),
        ],
      },
      {
        id: "submissions",
        title_ar: "الطلبات والرسائل: العرض والفلترة والتصدير",
        title_en: "Requests & Messages: View, Filter, Export",
        intro_ar: "كل ما يرسله الزوّار (رسائل، طلبات التحاق وتوظيف، نتائج تقييم) يصلك هنا في جداول للقراءة والإدارة.",
        intro_en: "Everything visitors send (messages, admission and job requests, assessment results) arrives here in tables for viewing and managing.",
        steps: [
          cms("submissions-admission", "افتح النوع من مجموعة «الطلبات والرسائل». يظهر جدول بكل الطلبات، الأحدث أولاً، مع بحث وفلاتر (الفرع، النوع، الفترة).", "Open the type from the “Requests & Messages” group. A table shows all requests newest-first, with search and filters (branch, type, period)."),
          cms("detail-submission", "اضغط زر «عرض التفاصيل» (العين) لأي طلب لفتح كل بياناته. وتجد أزرار مراسلة سريعة: إيميل وواتساب.", "Click the “View details” (eye) button on any request to open all its data. There are also quick contact buttons: email and WhatsApp."),
          p("في طلبات التوظيف يظهر زر لفتح ملف السيرة الذاتية المرفق.", "Job applications also show a button to open the attached CV file."),
          p("زر «تصدير» ينزّل كل الطلبات كملف Excel منسّق (مع روابط السير الذاتية) — مناسب للأرشفة أو المشاركة.", "The “Export” button downloads all requests as a formatted Excel file (with CV links) — handy for archiving or sharing."),
          p("بيانات الطلبات هي ما كتبه الزائر، لذلك تظهر بلغته كما أرسلها. يمكنك حذف طلب من زر «حذف» بعد تأكيد.", "Request data is what the visitor typed, so it appears in their language as sent. You can delete a request via “Delete” after confirmation."),
        ],
      },
      {
        id: "settings",
        title_ar: "إعدادات الموقع",
        title_en: "Site Settings",
        steps: [
          cms("settings", "«إعدادات الموقع» تجمع الإعدادات العامة في مكان واحد، مثل رقم الواتساب الموحّد وبيانات التواصل.", "“Site Settings” gathers global settings in one place, like the unified WhatsApp number and contact details."),
          p("مثال مهم: حقل رقم الواتساب يتحكّم في كل أزرار الواتساب على مستوى الموقع كله — غيّره من هنا مرة واحدة.", "Key example: the WhatsApp field controls every WhatsApp button across the whole site — change it here once."),
          p("اضغط «حفظ» بعد التعديل ليسري التغيير على كل الصفحات فوراً.", "Click “Save” after editing so the change applies to all pages immediately."),
        ],
      },
    ],
  },

  // ======================== الجزء 3: صفحات الموقع ========================
  {
    id: "site",
    title_ar: "صفحات الموقع ومن أين تُدار",
    title_en: "The Website Pages & Where They're Controlled",
    sections: [
      {
        id: "site-overview",
        title_ar: "نظرة عامة",
        title_en: "Overview",
        intro_ar: "هذا الجزء مرجع بصري: شكل كل صفحة، ومن أي قسم في اللوحة تتحكّم في كل جزء منها. كل الصفحات متاحة بالعربية والإنجليزية تلقائياً.",
        intro_en: "This part is a visual reference: how each page looks, and which panel area controls each part of it. All pages are available in Arabic and English automatically.",
        steps: [],
      },
      {
        id: "site-home",
        title_ar: "الصفحة الرئيسية",
        title_en: "Home Page",
        steps: [
          site("home", "واجهة الموقع وأكثر صفحاته أقساماً.", "The site's front page and its most section-rich page."),
          p("الشرائح المتحركة (الهيرو) ← «الصفحة الرئيسية» ثم قسم «شرائح الهيرو» (صورة + عنوان + زر لكل شريحة).", "The rotating hero ← “Home Page” → “Hero Slides” (image + title + button per slide)."),
          p("أرقام الإنجاز ← «أرقام الإنجاز» · مميزات «لماذا عبور» ← «المميزات» (أيقونة + عنوان + وصف لكل ميزة).", "Achievement numbers ← “Achievement Numbers” · “Why Oboor” features ← “Features” (icon + title + description each)."),
          p("بطاقات البحث الذكي ← «بطاقات الخدمات» · المعرض ← «صور المعرض» · قصص النجاح ← «أبطال عبور» · الأخبار ← «إعلامنا».", "Smart-search cards ← “Service Cards” · gallery ← “Gallery Images” · success stories ← “Oboor Champions” · news ← “Our Media”."),
        ],
      },
      {
        id: "site-about",
        title_ar: "عن عبور",
        title_en: "About Oboor",
        steps: [
          site("about", "صفحة التعريف بالمركز: النبذة، الرؤية والرسالة، والمناطق.", "The center's about page: intro, vision & mission, and regions."),
          p("تُدار من «عن عبور (من نحن)» — عناوين ونصوص وصور الأقسام من لوحة «محتوى وعناوين الصفحة».", "Controlled from “About Oboor” — section headings, texts and images via the “Page content & headings” panel."),
        ],
      },
      {
        id: "site-programs",
        title_ar: "برامجنا التمكينية",
        title_en: "Our Programs",
        steps: [
          site("programs", "تعرض البرامج والخدمات العيادية والتقنيات في تبويبات.", "Shows programs, clinical services, and techniques in tabs."),
          p("تُدار من ثلاثة أقسام: «البرامج»، «الخدمات العيادية»، و«التقنيات». لكل عنصر عنوان ووصف وأيقونة/صورة.", "Controlled from three areas: “Programs”, “Clinical Services”, and “Techniques”. Each item has a title, description, and icon/image."),
        ],
      },
      {
        id: "site-branches",
        title_ar: "مراكزنا (الفروع)",
        title_en: "Our Centers (Branches)",
        steps: [
          site("branches", "قائمة الفروع مع خريطة تفاعلية وبحث وتصفية بالمنطقة.", "The branch list with an interactive map, search, and filtering by region."),
          site("branch-detail", "صفحة الفرع تعرض العنوان والمواعيد والمدير وأرقام التواصل والخدمات وزر الاتجاهات.", "A branch page shows address, hours, manager, contact numbers, services, and a Directions button."),
          p("تُدار من «مراكزنا (الفروع)» — كل فرع عنصر بكل بياناته (الاسم، المدينة، المنطقة، العنوان، الهاتف، المدير، رابط الخريطة، الخدمات).", "Controlled from “Our Centers (Branches)” — each branch is an item with all its data (name, city, region, address, phone, manager, map link, services)."),
        ],
      },
      {
        id: "site-specialists",
        title_ar: "روّادنا (الأخصائيون)",
        title_en: "Our Pioneers (Specialists)",
        steps: [
          site("specialists", "فريق الأخصائيين مع فلترة بالتخصص والفرع، ولكل أخصائي بطاقة تفاصيل.", "The specialists team with filtering by specialty and branch, and a details card per specialist."),
          p("تُدار من «روّادنا (الأخصائيون)» — لكل أخصائي صورة واسم وتخصص ونبذة.", "Controlled from “Our Pioneers (Specialists)” — each has an image, name, specialty, and bio."),
        ],
      },
      {
        id: "site-success",
        title_ar: "أبطال عبور (قصص النجاح)",
        title_en: "Oboor Champions (Success Stories)",
        steps: [
          site("success-stories", "قصص نجاح المستفيدين.", "Beneficiaries' success stories."),
          p("تُدار من «أبطال عبور (قصص النجاح)».", "Controlled from “Oboor Champions (Success Stories)”."),
        ],
      },
      {
        id: "site-news",
        title_ar: "إعلامنا (الأخبار والمقالات)",
        title_en: "Our Media (News & Articles)",
        steps: [
          site("news", "قائمة الأخبار والمقالات والفعاليات، ولكل خبر صفحة مقال كاملة.", "The list of news, articles, and events, each with a full article page."),
          site("news-article", "صفحة المقال تعرض الصورة والعنوان والمحتوى، وللفعاليات مكاناً ووقتاً.", "An article page shows the image, title, and content; events also show location and time."),
          p("تُدار من «إعلامنا (الأخبار والمقالات)». حقول الفعالية (المكان/الوقت) تظهر عند اختيار القسم «فعاليات» أو «ورش».", "Controlled from “Our Media”. Event fields (place/time) appear when the section is set to “Events” or “Workshops”."),
        ],
      },
      {
        id: "site-careers",
        title_ar: "انضم إلينا (الوظائف)",
        title_en: "Join Us (Careers)",
        steps: [
          site("careers", "قائمة الوظائف المتاحة، ولكل وظيفة صفحة تفاصيل ونموذج تقديم.", "The list of open jobs, each with a details page and an application form."),
          p("الوظائف تُدار من «انضم إلينا (الوظائف)». وطلبات المتقدّمين تصل إلى «طلبات التوظيف».", "Jobs are managed from “Join Us (Careers)”. Applicants' submissions arrive in “Job Applications”."),
        ],
      },
      {
        id: "site-forms",
        title_ar: "نماذج التواصل والالتحاق والتقييم",
        title_en: "Contact, Admission & Assessment Forms",
        steps: [
          site("admission", "«خذ الخطوة» (تواصل) و«طلب الالتحاق» نماذج يملؤها الزائر لإرسال طلبه.", "“Take the step” (contact) and “Admission” are forms visitors fill to send a request."),
          site("assessment", "نموذج التقييم خطوات متتابعة (Wizard) تنتهي بإرسال النتيجة.", "The assessment form is a step-by-step wizard that ends by submitting the result."),
          p("كل ما يُرسَل من هذه النماذج يصلك في مجموعة «الطلبات والرسائل» في اللوحة.", "Everything sent from these forms arrives in the “Requests & Messages” group in the panel."),
        ],
      },
    ],
  },

  // ======================== الجزء 4: مهام شائعة (وصفات جاهزة) ========================
  {
    id: "recipes",
    title_ar: "مهام شائعة (خطوة بخطوة)",
    title_en: "Common Tasks (Step by Step)",
    sections: [
      {
        id: "recipe-branch",
        title_ar: "إضافة فرع جديد",
        title_en: "Add a New Branch",
        intro_ar: "وصفة كاملة لإضافة فرع من الصفر حتى يظهر على الموقع.",
        intro_en: "A complete recipe to add a branch from scratch until it appears on the site.",
        steps: [
          cms("list-branches", "من القائمة الجانبية افتح «مراكزنا (الفروع)» واضغط «إضافة فرع».", "From the sidebar open “Our Centers (Branches)” and click “Add Branch”."),
          cms("editor", "املأ الاسم والمدينة والمنطقة والعنوان — بالعربية والإنجليزية معاً. راقب شريط الاكتمال حتى يصل 100%.", "Fill the name, city, region, and address — in both Arabic and English. Watch the completion bar reach 100%."),
          p("أضف رقم التواصل، المدير، رابط الخريطة، والخدمات. اختر الخدمات من قائمة الإضافة.", "Add the phone number, manager, map link, and services. Pick services from the add-list."),
          p("تأكّد أن الحالة «منشور»، ثم اضغط «حفظ». سيظهر الفرع في صفحة «مراكزنا» على الموقع خلال لحظات.", "Make sure the status is “Published”, then click “Save”. The branch appears on the site's Centers page within moments."),
        ],
      },
      {
        id: "recipe-news",
        title_ar: "نشر خبر أو فعالية",
        title_en: "Publish a News Item or Event",
        steps: [
          cms("list-news", "افتح «إعلامنا (الأخبار والمقالات)» واضغط «إضافة خبر».", "Open “Our Media (News & Articles)” and click “Add News”."),
          p("اكتب العنوان والمحتوى بالعربية والإنجليزية، وارفع صورة الخبر.", "Write the title and content in Arabic and English, and upload the article image."),
          p("لفعالية أو ورشة: اختر القسم «فعاليات» أو «ورش» فتظهر حقول المكان والوقت — املأها.", "For an event or workshop: set the section to “Events” or “Workshops” to reveal place/time fields — fill them."),
          p("اضغط «حفظ». الأخبار تظهر بالأحدث أولاً في صفحة «إعلامنا» وفي الصفحة الرئيسية.", "Click “Save”. News shows newest-first on the “Our Media” page and on the home page."),
        ],
      },
      {
        id: "recipe-hero",
        title_ar: "تغيير صورة أو محتوى الصفحة الرئيسية",
        title_en: "Change a Home-Page Image or Text",
        steps: [
          cms("page-content-home", "افتح «الصفحة الرئيسية». عدّل العناوين والنصوص من لوحة «محتوى وعناوين الصفحة» أعلى الصفحة.", "Open “Home Page”. Edit headings and texts from the “Page content & headings” panel at the top."),
          cms("detail-image", "لتغيير صورة (مثل شريحة الهيرو): افتح القسم المطلوب من قوائم الصفحة، اضغط منطقة الصورة وارفع صورة جديدة.", "To change an image (e.g. a hero slide): open the relevant list, click the image area, and upload a new image."),
          p("اضغط «حفظ» بعد كل تعديل. استخدم «معاينة» لرؤية الشكل قبل النشر.", "Click “Save” after each change. Use “Preview” to see the look before publishing."),
        ],
      },
      {
        id: "recipe-submission",
        title_ar: "الرد على طلب وارد",
        title_en: "Respond to an Incoming Request",
        steps: [
          cms("submissions-admission", "افتح النوع المطلوب من «الطلبات والرسائل» (مثل «طلبات الالتحاق»).", "Open the type from “Requests & Messages” (e.g. “Admission Requests”)."),
          cms("detail-submission", "اضغط «عرض التفاصيل» (العين) لقراءة كل بيانات الطلب، ثم راسل مقدّم الطلب عبر زر الواتساب أو الإيميل مباشرةً.", "Click “View details” (eye) to read all the request data, then contact the applicant via the WhatsApp or email button directly."),
          p("لأرشفة أو مشاركة الطلبات، استخدم زر «تصدير» لتنزيلها كملف Excel منسّق.", "To archive or share requests, use the “Export” button to download them as a formatted Excel file."),
        ],
      },
    ],
  },

  // ======================== الجزء 5: نصائح وأسئلة شائعة ومسرد ========================
  {
    id: "help",
    title_ar: "نصائح وأسئلة شائعة",
    title_en: "Tips & FAQ",
    sections: [
      {
        id: "tips",
        title_ar: "نصائح وأخطاء شائعة",
        title_en: "Tips & Common Mistakes",
        steps: [
          p("✅ املأ الحقول بالعربية والإنجليزية معاً دائماً حتى يظهر المحتوى صحيحاً في نسختَي الموقع.", "✅ Always fill fields in both Arabic and English so content shows correctly in both site versions."),
          p("✅ استخدم زر «معاينة» قبل الحفظ لترى الشكل النهائي على الموقع.", "✅ Use “Preview” before saving to see the final look on the site."),
          p("✅ للإيقاف المؤقت اجعل العنصر «مخفي» بدل حذفه — الحذف نهائي بلا تراجع.", "✅ To pause an item, set it to “Hidden” instead of deleting — deletion is permanent with no undo."),
          p("✅ اجعل العناوين قصيرة وواضحة، وحافظ على صور بحجم أقل من 5 ميجابايت وأبعاد مناسبة.", "✅ Keep titles short and clear, and use images under 5 MB with suitable dimensions."),
          p("⚠️ لا تنسَ الضغط على «حفظ» بعد كل تعديل — التعديل لا يُطبّق قبل الحفظ.", "⚠️ Don't forget to click “Save” after each change — an edit is not applied until saved."),
          p("⚠️ لا تمسح نصّ قسم بالكامل إن كنت تريده أن يظهر — القسم الفارغ تماماً قد يختفي من الموقع.", "⚠️ Don't clear a section's text entirely if you want it visible — a fully empty section may disappear from the site."),
        ],
      },
      {
        id: "faq",
        title_ar: "الأسئلة الشائعة",
        title_en: "Frequently Asked Questions",
        intro_ar: "أكثر الأسئلة تكراراً وإجاباتها المختصرة.",
        intro_en: "The most common questions and their short answers.",
        faq: [
          faq("عدّلت وضغطت «حفظ»، لكن التعديل لم يظهر على الموقع؟",
              "I edited and clicked “Save”, but the change isn't showing on the site?",
              "المحتوى يتحدّث خلال دقائق قليلة (يوجد تخزين مؤقت). حدّث الصفحة بعد قليل، وتأكّد أنك ضغطت «حفظ» وظهرت لك رسالة «تم الحفظ ✓».",
              "Content updates within a few minutes (there's a short cache). Refresh the page shortly, and confirm you clicked “Save” and saw the “Saved ✓” message."),
          faq("زر «حفظ» باهت ولا يُضغط؟",
              "The “Save” button is greyed out and won't click?",
              "لأنه يعمل فقط عند وجود تعديل فعلي. اكتب أي تغيير في أحد الحقول وسيتفعّل.",
              "Because it only activates when there's a real change. Type any change in a field and it will enable."),
          faq("أريد استرجاع المحتوى الأصلي بعد أن غيّرته؟",
              "I want to restore the original content after changing it?",
              "«استرجاع النسخة الافتراضية» يعيد العنصر لمحتواه الأصلي، و«تجاهل التغييرات» يلغي التعديلات غير المحفوظة فقط.",
              "“Restore Default” returns the item to its original content; “Discard changes” cancels only unsaved edits."),
          faq("حذفت عنصراً بالخطأ، كيف أرجعه؟",
              "I deleted an item by mistake, how do I get it back?",
              "الحذف نهائي ولا يمكن التراجع عنه، لذلك ستحتاج لإضافته من جديد. لهذا يُفضّل جعل العنصر «مخفي» بدل حذفه إن كنت قد تحتاجه لاحقاً.",
              "Deletion is permanent and can't be undone, so you'll need to add it again. That's why hiding an item is better than deleting if you might need it later."),
          faq("هل يجب أن أملأ العربية والإنجليزية؟",
              "Do I have to fill both Arabic and English?",
              "يُفضّل ملء الاثنين. إن تركت الإنجليزية فارغة يظهر النص العربي بدلاً منها في النسخة الإنجليزية كحل بديل.",
              "Filling both is preferred. If you leave English empty, the Arabic text shows instead in the English version as a fallback."),
          faq("غيّرت لغة اللوحة، هل أثّر ذلك على الموقع؟",
              "I switched the panel language, did that affect the site?",
              "لا إطلاقاً — لغة اللوحة منفصلة تماماً عن لغة الموقع، وتغيّر واجهة اللوحة فقط.",
              "Not at all — the panel language is completely separate from the site language and only changes the panel's interface."),
          faq("كيف أغيّر رقم الواتساب على الموقع كله؟",
              "How do I change the WhatsApp number across the whole site?",
              "من «إعدادات الموقع» → حقل رقم الواتساب. مكان واحد يتحكّم في كل أزرار الواتساب في الموقع.",
              "From “Site Settings” → the WhatsApp number field. One place controls every WhatsApp button on the site."),
          faq("لماذا لا تظهر أسهم الترتيب في الأخبار؟",
              "Why don't the reorder arrows show for news?",
              "لأن الأخبار والوظائف تُرتَّب تلقائياً بالأحدث أولاً، فلا تحتاج لترتيب يدوي.",
              "Because news and jobs are ordered automatically (newest first), so they don't need manual ordering."),
          faq("رفع صورة السيرة الذاتية أعطى خطأ؟",
              "Uploading a CV file gave an error?",
              "يجب أن يكون الملف بصيغة PDF أو DOC أو DOCX وحجمه أقل من 10 ميجابايت.",
              "The file must be a PDF, DOC, or DOCX and under 10 MB."),
          faq("نسبة الاكتمال ليست 100%، هل هذه مشكلة؟",
              "Completion isn't 100%, is that a problem?",
              "لا، هي مجرد تنبيه للحقول الأساسية الناقصة. املأ ما هو مكتوب في «الحقول الناقصة» للوصول إلى 100%.",
              "No, it just flags the essential missing fields. Fill what's listed under “Missing” to reach 100%."),
          faq("لماذا تظهر بيانات الطلبات بالعربية حتى في النسخة الإنجليزية؟",
              "Why do request details appear in Arabic even in the English panel?",
              "لأنها ما كتبه الزائر نفسه في النموذج، فتُعرض كما أرسلها بلغته.",
              "Because it's what the visitor typed in the form, so it's shown as sent, in their language."),
          faq("نسيت كلمة المرور أو أريد تغييرها؟",
              "I forgot the password or want to change it?",
              "تواصل مع فريق الدعم التقني لتغيير كلمة المرور بأمان.",
              "Contact the technical support team to change the password safely."),
        ],
      },
      {
        id: "glossary",
        title_ar: "مسرد المصطلحات",
        title_en: "Glossary",
        intro_ar: "تعريفات سريعة لأهم المصطلحات في اللوحة.",
        intro_en: "Quick definitions of the main terms used in the panel.",
        glossary: [
          term("منشور / مخفي", "Published / Hidden", "«منشور» يعني أن العنصر يظهر للزوّار، و«مخفي» يعني أنه محفوظ لكن لا يظهر على الموقع.", "“Published” means the item is visible to visitors; “Hidden” means it's saved but not shown on the site."),
          term("نسبة الاكتمال", "Completion", "مؤشّر أعلى المحرّر يوضّح كم من الحقول الأساسية تم ملؤه، ويذكّرك بالحقول الناقصة.", "A meter at the top of the editor showing how many essential fields are filled, reminding you of missing ones."),
          term("بطاقة (Card)", "Card", "عنصر مركّب يجمع عنوان + وصف + أيقونة/صورة معاً، ويظهر ككرت على الموقع.", "A composite item that groups a title + description + icon/image together, shown as a card on the site."),
          term("قسم / بلوك", "Section / Block", "جزء من صفحة (مثل الهيرو أو قسم المميزات) تُدار عناصره ونصوصه معاً.", "A part of a page (like the hero or features section) whose items and texts are managed together."),
          term("معاينة (Preview)", "Preview", "فتح الصفحة الحقيقية بتعديلاتك الحالية قبل الحفظ للتأكّد من الشكل النهائي.", "Opening the real page with your current unsaved changes to check the final look before saving."),
          term("المعرّف (slug)", "Identifier (slug)", "اسم تقني فريد يُنشأ تلقائياً لكل عنصر — لا تحتاج للتعامل معه عادةً.", "A unique technical name generated automatically for each item — you normally don't deal with it."),
          term("الطلبات والرسائل", "Requests & Messages", "كل ما يرسله الزوّار عبر النماذج (تواصل، التحاق، توظيف، تقييم) ويصلك في اللوحة.", "Everything visitors send via the forms (contact, admission, jobs, assessment) that arrives in the panel."),
          term("تصدير (Export)", "Export", "تنزيل الطلبات كملف Excel منسّق للأرشفة أو المشاركة.", "Downloading requests as a formatted Excel file for archiving or sharing."),
        ],
      },
    ],
  },
];
