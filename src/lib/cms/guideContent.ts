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
          p("لو نسيت كلمة المرور، اضغط «نسيت كلمة المرور؟» أسفل الحقول ليصلك رابط إعادة تعيين على بريدك المسجّل (تفاصيل أكثر في قسم «حسابي»).", "If you forget your password, click “Forgot password?” below the fields to receive a reset link on your registered email (more in the “My Account” section)."),
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
      {
        id: "account",
        title_ar: "حسابي: تغيير البريد وكلمة المرور",
        title_en: "My Account: Email & Password",
        intro_ar: "من صفحة «حسابي» تدير بيانات دخولك بنفسك — تغيّر بريدك الإلكتروني أو كلمة مرورك في أي وقت وأنت مسجّل الدخول.",
        intro_en: "From the “My Account” page you manage your own sign-in details — change your email or password anytime while signed in.",
        steps: [
          cms("account", "افتح «حسابي» من أسفل القائمة الجانبية، أو اضغط على اسمك/صورتك أعلى الشريط.", "Open “My Account” from the bottom of the sidebar, or click your name/avatar in the top bar."),
          p("اسم المستخدم للعرض فقط ولا يمكن تعديله (لأسباب أمنية). أمّا البريد الإلكتروني فقابل للتعديل — بعد تغييره اضغط «حفظ البريد الإلكتروني».", "The username is read-only (for security). The email, however, is editable — after changing it, click “Save email”."),
          p("لتغيير كلمة المرور: اكتب كلمة المرور الحالية، ثم الجديدة، ثم أكّدها (٨ أحرف على الأقل)، واضغط «تحديث كلمة المرور».", "To change your password: enter your current password, then the new one, then confirm it (at least 8 characters), and click “Update password”."),
          p("زر العين بجانب كل حقل يُظهر/يُخفي كلمة المرور للتأكّد منها قبل الحفظ.", "The eye button next to each field shows/hides the password so you can verify it before saving."),
          p("أسفل نفس الصفحة يوجد قسم «إعدادات البريد (SMTP)» — وهو مهم جدًا وله شرح كامل مفصّل في القسم التالي مباشرةً.", "At the bottom of the same page is the “Email Settings (SMTP)” section — it's very important and has its own full, detailed walkthrough in the next section."),
        ],
        faq: [
          faq("نسيت كلمة المرور تمامًا وأُقفلت خارج اللوحة؟", "Forgot your password entirely and locked out?",
              "من شاشة الدخول اضغط «نسيت كلمة المرور؟» ليصلك رابط إعادة تعيين على بريدك المسجّل. (يتطلب ضبط «إعدادات البريد (SMTP)» في صفحة «حسابي» أولًا؛ إن لم تصلك الرسالة تواصل مع الفريق التقني لإعادة التعيين.)",
              "On the sign-in screen click “Forgot password?” to receive a reset link on your registered email. (Requires the “Email Settings (SMTP)” on the “My Account” page to be configured first; if it doesn't arrive, contact the technical team to reset it.)"),
          faq("كيف أُفعّل إرسال رسائل إعادة تعيين كلمة المرور؟", "How do I enable password-reset emails?",
              "من «حسابي» → قسم «إعدادات البريد (SMTP)»: أدخل بيانات إيميل الشركة (الخادم والمنفذ واسم المستخدم وكلمة مرور التطبيق)، فعّل المفتاح، احفظ، ثم أرسل رسالة تجريبية للتأكّد. بعدها تعمل إعادة التعيين تلقائيًا برسائل من إيميل الشركة نفسه.",
              "From “My Account” → the “Email Settings (SMTP)” section: enter the company email details (host, port, username, app password), turn on the toggle, save, then send a test email to confirm. Password reset then works automatically, sending from the company's own email."),
          faq("هل تغيير كلمة المرور يسجّل خروجي؟", "Does changing my password sign me out?",
              "لا، تبقى جلستك الحالية مفتوحة. لكن أي جهاز آخر مسجّل بنفس الحساب سيحتاج تسجيل دخول جديد بكلمة المرور الجديدة.",
              "No, your current session stays open. But any other device signed in with the same account will need to sign in again with the new password."),
        ],
      },

      // ---------------------- إعدادات البريد (SMTP) — قسم مفصّل ----------------------
      {
        id: "smtp",
        title_ar: "إعدادات البريد (SMTP): شرح كل حقل بالتفصيل",
        title_en: "Email Settings (SMTP): every field explained",
        intro_ar: "هذا القسم يشرح — بالتفصيل ومن غير أي خلفية تقنية — كيف تربط بريد شركتك بالنظام حتى يستطيع إرسال رسائله تلقائيًا (أهمّها رابط إعادة تعيين كلمة المرور). تجد هذه الإعدادات أسفل صفحة «حسابي». اضبطها مرة واحدة فقط.",
        intro_en: "This section explains — in plain, non-technical language — how to connect your company email to the system so it can send its messages automatically (chiefly the password-reset link). You'll find these settings at the bottom of the “My Account” page. You set them up just once.",
        steps: [
          p("ما معنى SMTP أصلًا؟ ببساطة هو «مكتب البريد» الذي يرسل رسائل النظام نيابةً عنك. الموقع لا يملك بريدًا خاصًا به، فنعطيه بيانات صندوق بريد شركتكم الرسمي ليرسل منه — تمامًا كأنك تعطي موظفًا مفتاح صندوق البريد ليضع رسائلك فيه.", "What is SMTP anyway? Simply, it's the “post office” that sends the system's emails on your behalf. The website has no mailbox of its own, so we give it your company's official mailbox details to send from — just like handing an employee the key to your mailbox so they can post your letters."),
          p("لماذا نحتاجه؟ لأن النظام يرسل رسائل مهمة تلقائيًا: أهمّها رابط «نسيت كلمة المرور» الذي يصلك على بريدك لتستعيد الدخول. بدون هذه الإعدادات، لن تصلك تلك الرسائل — لذا يُفضَّل ضبطها من اليوم الأول.", "Why do we need it? Because the system sends important emails automatically — chiefly the “Forgot password” reset link that lands in your inbox to get you back in. Without these settings, those emails won't be sent — so it's best to set it up from day one."),
          cms("smtp", "١) مفتاح التفعيل (Enable): أعلى القسم مفتاح تشغيل/إيقاف. شغّله ليعمل الإرسال. لو أطفأته، يتوقّف النظام عن إرسال أي بريد (مفيد مؤقتًا لو أردت تعطيله). في الصورة تجد القسم كاملًا كما سنشرحه حقلًا حقلًا.", "1) Enable toggle: at the top of the section is an on/off switch. Turn it on to allow sending. If you turn it off, the system stops sending any email (handy if you want to pause it temporarily). The image shows the whole section, which we'll explain field by field."),
          p("٢) مزوّد البريد (Provider): قائمة تختار منها نوع بريدك — Gmail، أو Outlook/Office365، أو cPanel/بريد الاستضافة، أو «مخصّص». بمجرد اختيارك، يضبط النظام الخادم والمنفذ والتشفير تلقائيًا نيابةً عنك، فلا تقلق بشأن الأرقام التقنية.", "2) Provider: a dropdown where you pick your email type — Gmail, Outlook/Office365, cPanel/hosting mail, or “Custom”. Once you choose, the system sets the host, port, and encryption automatically for you, so you don't need to worry about the technical numbers."),
          p("٣) خادم SMTP (Host): هو عنوان «مكتب البريد» الذي يرسل منه بريدك. عند اختيار Gmail أو Outlook يُملأ تلقائيًا ويظهر مقفلًا (لا تعدّله). في وضع cPanel أو «مخصّص» تكتب أنت اسم خادم بريدك (يوفّره لك مزوّد الاستضافة، مثل: hs38.name.tools).", "3) SMTP host: the address of the “post office” your email sends from. For Gmail or Outlook it's filled in automatically and shown locked (don't edit it). In cPanel or “Custom” mode you type your mail server's name (your hosting provider gives it to you, e.g. hs38.name.tools)."),
          p("٤) المنفذ (Port) والتشفير (Security): المنفذ رقم يشبه «رقم الباب» الذي تدخل منه الرسالة لمكتب البريد، والتشفير هو ما يحمي الرسالة أثناء إرسالها. في وضع Gmail/Outlook/cPanel يُضبطان تلقائيًا (تراهما مكتوبين تحت الحقل، مثل: المنفذ 587 · تشفير TLS). لا تظهر خانتا المنفذ والتشفير للتعديل إلا في الوضع «المخصّص» فقط، وحينها يعطيك مزوّد بريدك القيم الصحيحة.", "4) Port and Security: the port is like the “door number” the message enters the post office through, and security is what protects the message in transit. In Gmail/Outlook/cPanel mode they're set automatically (shown under the field, e.g. port 587 · TLS). The port and security boxes only appear for editing in “Custom” mode — and there your mail provider gives you the correct values."),
          p("لماذا يظهر المنفذ أحيانًا كرقم مختلف (587 أو 465)؟ كل نوع تشفير له «باب» مختلف: 587 يُستخدم مع تشفير TLS، و465 مع تشفير SSL. النظام يختار الصحيح تلقائيًا حسب المزوّد، فلا داعي لحفظ هذه الأرقام.", "Why does the port sometimes show a different number (587 or 465)? Each encryption type uses a different “door”: 587 goes with TLS, and 465 with SSL. The system picks the right one automatically per provider, so there's no need to memorize these numbers."),
          p("٥) اسم المستخدم (الإيميل): هو عنوان بريد شركتكم الكامل الذي ستُرسَل منه الرسائل، مثل: info@company.com. اكتبه كاملًا وبشكل صحيح.", "5) Username (email): your company's full email address that messages will be sent from, e.g. info@company.com. Type it in full and correctly."),
          p("٦) كلمة مرور التطبيق (App Password): وهنا أهم نقطة — في Gmail و Outlook لا تضع كلمة مرور بريدك العادية، بل «كلمة مرور تطبيق» خاصة تُنشئها لهذا الغرض. الخطوات التالية تشرح كيف تحصل عليها. (في cPanel/بريد الاستضافة تضع كلمة مرور البريد العادية.)", "6) App Password: this is the most important point — for Gmail and Outlook you do NOT use your normal email password, but a special “app password” you generate for this purpose. The next steps explain how to get it. (For cPanel/hosting mail you use the normal mailbox password.)"),
          p("لماذا كلمة مرور تطبيق وليست كلمتك العادية؟ لأن Google و Microsoft يمنعان البرامج الخارجية من استخدام كلمة مرورك الأساسية (لحمايتها). فتُنشئ كلمة بديلة مخصّصة لهذا النظام فقط — ولو ألغيتها يومًا لا تتأثر كلمة مرور بريدك الأصلية.", "Why an app password and not your normal one? Because Google and Microsoft block outside programs from using your main password (to protect it). So you generate a substitute dedicated to this system only — and if you ever revoke it, your real email password is unaffected."),
          p("كيف أحصل على App Password من Gmail؟ فعّل «التحقّق بخطوتين» على حساب Google أولًا (إجباري)، ثم افتح myaccount.google.com/apppasswords ← اكتب اسمًا (مثل: موقع عبور) ← اضغط «إنشاء» ← ستظهر ٤ مجموعات من ٤ أحرف. انسخها والصقها في خانة كلمة مرور التطبيق (تجاهل المسافات).", "How to get an App Password from Gmail? First turn on “2-Step Verification” on your Google account (required), then open myaccount.google.com/apppasswords → type a name (e.g. Oboor site) → click “Create” → 4 groups of 4 characters appear. Copy and paste them into the app-password box (ignore the spaces)."),
          p("كيف أحصل عليها من Outlook/Office365؟ من account.microsoft.com/security ← «خيارات الأمان المتقدّمة» ← فعّل «التحقّق بخطوتين» ← ثم «كلمات مرور التطبيقات» ← «إنشاء كلمة مرور تطبيق جديدة» ← انسخ الكلمة الظاهرة والصقها في الخانة. (بعض حسابات Office365 المؤسسية تديرها إدارة تقنية شركتكم — لو لم تجد الخيار، اطلب منهم تفعيله.)", "How to get it from Outlook/Office365? Go to account.microsoft.com/security → “Advanced security options” → turn on “Two-step verification” → then “App passwords” → “Create a new app password” → copy the shown password and paste it into the box. (Some corporate Office365 accounts are managed by your company's IT — if you don't see the option, ask them to enable it.)"),
          p("ملاحظة أمان مهمة: كلمة مرور التطبيق تُحفظ ولا تظهر مرة أخرى بعد الحفظ (تراها كنقاط ••••••). هذا مقصود لحمايتها. لو احتجت تغييرها لاحقًا، اكتب الجديدة فوقها واحفظ.", "Important security note: the app password is stored and never shown again after saving (you'll see it as dots ••••••). That's intentional, to protect it. If you need to change it later, type the new one over it and save."),
          p("٧) اسم المُرسِل الظاهر (Sender name): الاسم الذي يظهر للمستقبِل كمُرسِل للرسالة، مثل: «مركز عبور للرعاية والتأهيل». اختياري لكنه يعطي انطباعًا احترافيًا.", "7) Sender display name: the name recipients see as the sender, e.g. “Oboor Center”. Optional, but it looks professional."),
          p("٨) عنوان المُرسِل (From) — اختياري: لو أردت أن تظهر الرسائل كأنها من عنوان مختلف عن اسم المستخدم، اكتبه هنا. لو تركته فارغًا، يستخدم النظام نفس اسم المستخدم تلقائيًا — وهذا هو الأنسب في معظم الحالات.", "8) From address — optional: if you want messages to appear from a different address than the username, type it here. Left blank, the system uses the username automatically — which is best in most cases."),
          p("٩) احفظ ثم اختبر: بعد تعبئة الحقول اضغط «حفظ إعدادات البريد». ثم في مربّع «إرسال رسالة تجريبية» اكتب بريدك واضغط «إرسال اختبار». إن وصلتك الرسالة خلال دقيقة، فكل شيء يعمل. إن ظهر خطأ، فهو يوضّح السبب (غالبًا كلمة مرور تطبيق غير صحيحة).", "9) Save then test: after filling the fields, click “Save email settings”. Then in the “Send a test email” box, type your email and click “Send test”. If it arrives within a minute, everything works. If an error shows, it explains the reason (usually an incorrect app password)."),
        ],
        faq: [
          faq("جرّبت الإرسال وظهر خطأ «بيانات المصادقة غير صحيحة»، ماذا أفعل؟", "I tried sending and got an “authentication data is incorrect” error — what now?",
              "غالبًا كلمة مرور التطبيق غير صحيحة أو انتهت. أنشئ كلمة مرور تطبيق جديدة (كما في الخطوات أعلاه)، الصقها في الخانة، احفظ، ثم جرّب الاختبار مرة أخرى. تأكّد أيضًا أن اسم المستخدم مكتوب كاملًا وصحيحًا.",
              "Usually the app password is wrong or expired. Generate a fresh app password (as in the steps above), paste it in, save, then run the test again. Also make sure the username is typed in full and correctly."),
          faq("هل أستخدم بريدي الشخصي أم بريد الشركة؟", "Should I use my personal email or the company's?",
              "استخدم بريد الشركة الرسمي دائمًا (مثل info@company.com). فرسائل النظام — كإعادة تعيين كلمة المرور — يجب أن تصل من جهة الشركة لا من شخص، وهذا أكثر احترافية وأمانًا وثباتًا على المدى الطويل.",
              "Always use the company's official email (e.g. info@company.com). System emails — like password reset — should come from the organization, not an individual; it's more professional, secure, and stable long-term."),
          faq("اخترت المزوّد لكن لا أرى خانتي المنفذ والتشفير؟", "I picked a provider but I don't see the port and security boxes?",
              "هذا طبيعي ومقصود. في أوضاع Gmail و Outlook و cPanel يضبط النظام المنفذ والتشفير تلقائيًا (تراهما مكتوبين كنصّ تحت خانة الخادم). تظهر الخانتان للتعديل في الوضع «المخصّص» فقط.",
              "That's normal and intended. In Gmail, Outlook, and cPanel modes the system sets port and security automatically (shown as text under the host box). The editable boxes only appear in “Custom” mode."),
          faq("هل يجب أن أضبط هذا الإعداد أكثر من مرة؟", "Do I have to set this up more than once?",
              "لا. تضبطه مرة واحدة ويبقى محفوظًا. تحتاج العودة إليه فقط لو غيّرت بريد الشركة أو ألغيت كلمة مرور التطبيق القديمة.",
              "No. You set it up once and it stays saved. You only return to it if you change the company email or revoke the old app password."),
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
          cms("page-content-home", "افتح الصفحة من القائمة (مثل «الصفحة الرئيسية»). في الأعلى تجد لوحة «محتوى وعناوين الصفحة» مقسّمة إلى أقسام الصفحة مرقّمة.", "Open the page from the sidebar (e.g. “Home Page”). At the top is the “Page content & headings” panel, split into the page's numbered sections."),
          p("الفتح على مستويين: أولًا افتح اللوحة نفسها، ثم اضغط رأس القسم المرقّم الذي تريده (مثل «١ — القسم الرئيسي») ليُفتح وتظهر حقوله. هذا الترتيب يمنع الزحام ويريك جزءًا واحدًا في كل مرّة.", "Two-level opening: first open the panel itself, then click the numbered section header you want (e.g. “1 — Hero”) to expand it and reveal its fields. This keeps things uncluttered and shows one part at a time."),
          p("انتبه لفارق مهم عن محرّر القوائم: هنا لكل عنصر زرّ «حفظ» خاص به بجانبه مباشرة — لا يوجد زر حفظ واحد أسفل الصفحة ولا شريط اكتمال. عدّلت نصًا؟ اضغط زر «حفظ» الخاص به قبل الانتقال لغيره.", "Note an important difference from the list editor: here each item has its own “Save” button right beside it — there's no single bottom Save bar and no completion bar. Edited a text? Click that item's own “Save” before moving to another."),
          p("العناصر ذات الصور تُعدَّل من نفس المكان بزر «تغيير الصورة»، والأرقام والإحصاءات تُكتب مباشرة في خانتها.", "Items with images are edited right there via a “Change image” button, and numbers/stats are typed straight into their box."),
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
          p("للإضافة في قائمة عادية: اضغط زر الإضافة (مثل «إضافة خبر») أسفل القائمة مباشرة، فتفتح شاشة المحرّر بحقول فارغة.", "To add in a normal list: click the add button (e.g. “Add News”) directly below the list, and the editor opens with empty fields."),
          p("مهم — للإضافة في قائمة مقسّمة لمجموعات (مثل الفروع المقسّمة حسب المنطقة): لا يوجد زر إضافة واحد أعلى القائمة. افتح أولًا مجموعة المنطقة التي تريد الإضافة إليها، ثم اضغط زرها الخاص «إضافة فرع — <اسم المنطقة>»، والعنصر الجديد يرث تلك المنطقة تلقائيًا.", "Important — to add in a list split into groups (like branches grouped by region): there is no single Add button at the top. First open the region group you want to add to, then click its own “Add Branch — <region>” button, and the new item inherits that region automatically."),
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
          p("الحقول مجمّعة في أقسام واضحة بعناوين بارزة (مثل «بيانات الفرع الأساسية»، «نافذة عرض التفاصيل») حتى تعرف كل مجموعة تتحكّم في أي جزء من الصفحة.", "Fields are grouped into clearly labelled sections with bold headers (e.g. “Branch basic info”, “View Details popup”) so you know which group controls which part of the page."),
          p("تحت بعض الأقسام ملاحظة زرقاء صغيرة (ℹ️) تشرح أين يظهر محتواها على الموقع، وبجانبها زر «عاين على الموقع» يفتح تلك الصفحة مباشرة.", "Under some sections is a small blue note (ℹ️) explaining where its content appears on the site, with a “Preview on site” link that opens that page directly."),
          p("الحقول الاختيارية الفارغة تُطوى إلى زر صغير «+ إضافة …» لتقليل الزحام — اضغطه فقط عند الحاجة لإظهار الحقل وملئه.", "Empty optional fields collapse into a small “+ Add …” button to reduce clutter — click it only when you need to reveal and fill the field."),
          p("أسفل الشاشة دائماً أزرار: «حفظ التعديلات» و«تجاهل التعديلات» و«معاينة التعديلات». كل تعديل يحتاج ضغط «حفظ» ليُطبّق.", "At the bottom are always: “Save Changes”, “Discard changes”, and “Preview changes”. Every edit needs a “Save” click to apply."),
          p("ملاحظة: زر «معاينة التعديلات» يظهر فقط للعناصر المحفوظة سابقًا (لا يظهر أثناء إنشاء عنصر جديد قبل حفظه). وزر «استرجاع النسخة الافتراضية» يظهر فقط للعناصر الأصلية الجاهزة مع الموقع، لا للعناصر التي أضفتها أنت — فلا تقلق إن لم تجد أحد الزرّين في بعض الحالات.", "Note: the “Preview changes” button appears only for already-saved items (not while creating a brand-new item before saving). And “Restore default” appears only for the original items that shipped with the site, not for ones you added yourself — so don't worry if a button is missing in some cases."),
          p("تنبيه مهم: هذه الشاشة (بشريط الاكتمال وأزرار الأسفل) تخصّ عناصر القوائم. أمّا نصوص وعناوين الصفحات الثابتة فتُحرَّر من لوحة «محتوى وعناوين الصفحة» بأسلوب مختلف قليلًا: لكل عنصر فيها زر «حفظ» خاص به، ولا يوجد شريط اكتمال (مشروح في قسم «تعديل نصوص وعناوين الصفحات»).", "Important heads-up: this screen (with the completion bar and bottom buttons) is for list items. Fixed page texts and headings are edited from the “Page content & headings” panel in a slightly different way: each item there has its own “Save” button, with no completion bar (explained in “Editing page texts & headings”)."),
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
          p("تلوين جزء من العنوان: في بعض العناوين البارزة (مثل عنوان الهيرو) يمكنك إبراز كلمة أو أكثر بلون التصميم التركوازي بوضعها بين نجمتين مزدوجتين، هكذا: **الكلمة**. يظهر تحت الحقل تلميح صغير يذكّرك بذلك. اكتب باقي العنوان عاديًا، وضع النجمتين حول الجزء الذي تريد تمييزه فقط.", "Highlighting part of a title: in some prominent headings (like the hero title) you can emphasize one or more words in the brand teal by wrapping them in double asterisks, like this: **the word**. A small tip under the field reminds you of this. Write the rest normally, and put the asterisks only around the part you want to stand out."),
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
          p("بعد اختيار الملف تظهر عادةً نافذة «قصّ الصورة» لتحديد الجزء الظاهر منها بالأبعاد المناسبة للمكان — حرّك الإطار وكبّره/صغّره ثم اضغط «تأكيد». هذا يضمن ظهور الصورة متناسقة دون تشويه.", "After you pick a file, a “Crop image” window usually appears to choose the visible part at the right proportions for its place — move and resize the frame, then click “Confirm”. This keeps the image looking consistent without distortion."),
          p("ملاحظة على اسم الزر: داخل محرّر عنصر القائمة يكون الزر «رفع صورة»، أمّا في لوحة «محتوى وعناوين الصفحة» فيكون «تغيير الصورة» — وكلاهما يفعل الشيء نفسه.", "A note on the button label: inside a list item's editor the button reads “Upload image”, while in the “Page content & headings” panel it reads “Change image” — both do the same thing."),
          p("تظهر معاينة فور الرفع. لتغيير الصورة ارفع صورة جديدة فوق القديمة. لو تجاوز الملف الحد المسموح تظهر رسالة خطأ توضّح ذلك.", "A preview appears right after upload. To change it, upload a new image over the old one. If the file exceeds the allowed size, an error message says so."),
          p("اضغط على أي صورة (في المحرّر أو في القائمة أو في المعرض) لعرضها بالحجم الكامل في نافذة، ثم أغلقها بزر الإغلاق أو مفتاح Esc.", "Click any image (in the editor, the list, or a gallery) to view it full-screen in an overlay, then close it with the close button or the Esc key."),
          p("الحد الأقصى لحجم الصورة 5 ميجابايت. استخدم صوراً واضحة وبأبعاد مناسبة لأفضل ظهور.", "Maximum image size is 5 MB. Use clear, well-proportioned images for the best look."),
          p("المعرض (Gallery) يقبل عدة صور لنفس العنصر — أضف أو احذف أو رتّب صوره بنفس الطريقة (مثل معرض صور كل فرع).", "A gallery accepts multiple images for one item — add, remove, or reorder its photos the same way (like each branch's photo gallery)."),
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
          cms("detail-button", "في محرّر العنصر: حقل «نص الزر» أو «العنوان» هو الكلمات الظاهرة على الزر — اكتبها بالعربية والإنجليزية.", "In the item editor: the “Button label” or “Title” field is the words shown on the button — write them in Arabic and English."),
          p("حقل «الرابط» أو «القيمة» يحدّد الوجهة: رابط داخلي في الموقع يبدأ بـ / مثل ‎/about، أو رابط خارجي كامل يبدأ بـ https://‎.", "The “Link” or “Value” field sets the destination: an internal link starting with / like /about, or a full external link starting with https://."),
          p("لروابط التواصل الاجتماعي والقائمة العلوية والفوتر، حقل «القيمة» هو عنوان الرابط.", "For social links and the top/footer menus, the “Value” field is the link address."),
        ],
      },
      {
        id: "numbers",
        title_ar: "الأرقام والإحصائيات",
        title_en: "Numbers & Statistics",
        steps: [
          cms("detail-number", "أرقام الإنجاز (مثل «+30 أخصائي») تُدار من قسم «أرقام الإنجاز». كل رقم عنصر له «القيمة» (الرقم) و«التسمية» (وصفه).", "Achievement numbers (like “+30 specialists”) are managed from the “Achievement Numbers” area. Each is an item with a “Value” (the number) and a “Label” (its description)."),
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
          p("النشر/الإخفاء: كل عنصر له حالة «منشور» (يظهر للزوّار) أو «مخفي» (لا يظهر). لتغييرها: افتح العنصر بزر «تعديل»، وفي المحرّر انزل إلى مجموعة «الإعدادات» بالأسفل، وستجد خانة/مفتاح «منشور» — فعّله أو أطفئه ثم احفظ.", "Publish/Hide: each item has a “Published” status (visible to visitors) or “Hidden” (not shown). To change it: open the item with “Edit”, and in the editor scroll to the “Settings” group at the bottom — you'll find a “Published” checkbox/toggle; turn it on or off, then save."),
          p("مهم: الشارة الملوّنة بجانب العنصر في القائمة (خضراء «منشور» / برتقالية «مخفي») هي للعرض فقط لتعرف حالته بنظرة — لا يمكنك الضغط عليها لتغيير الحالة، بل تُغيَّر من داخل المحرّر كما في الخطوة السابقة.", "Important: the coloured badge beside an item in the list (green “Published” / amber “Hidden”) is display-only so you can see its state at a glance — you can't click it to change the state; you change it inside the editor as in the previous step."),
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
          p("«حفظ التعديلات» يعمل فقط عند وجود تغيير فعلي. بعد الحفظ تظهر رسالة «تم الحفظ بنجاح ✓» ويظهر التعديل على الموقع خلال لحظات.", "“Save Changes” is active only when there's a real change. After saving, a “Saved successfully ✓” message appears and the change shows on the site within moments."),
          p("زر «معاينة التعديلات» يفتح الصفحة الحقيقية بتعديلاتك الحالية قبل الحفظ — لتتأكّد من الشكل النهائي. (يظهر فقط للعناصر المحفوظة مسبقًا، لا أثناء إنشاء عنصر جديد.)", "The “Preview changes” button opens the real page with your current unsaved changes — to check the final look before saving. (It appears only for already-saved items, not while creating a new one.)"),
          p("«تجاهل التعديلات» يرجّع الحقول لآخر نسخة محفوظة. «استرجاع النسخة الافتراضية» يعيد العنصر لمحتواه الأصلي بالكامل، ويظهر فقط للعناصر الأصلية الجاهزة مع الموقع لا لما أضفته أنت (استخدمه بحذر).", "“Discard changes” reverts to the last saved version. “Restore Default” resets the item to its original content entirely, and appears only for the original items shipped with the site, not ones you added (use with care)."),
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
          cms("settings", "«إعدادات الموقع» تجمع البيانات العامة في مكان واحد. تحتوي عادةً على: رقم الواتساب الموحّد، رقم الهاتف، البريد الإلكتروني، العنوان، ورابط الخريطة — أي البيانات التي تتكرّر في أكثر من صفحة.", "“Site Settings” gathers global data in one place. It typically holds: the unified WhatsApp number, phone, email, address, and the map link — the data that repeats across more than one page."),
          p("مثال مهم: حقل رقم الواتساب يتحكّم في كل أزرار الواتساب على مستوى الموقع كله — غيّره من هنا مرة واحدة فيتغيّر في كل مكان.", "Key example: the WhatsApp field controls every WhatsApp button across the whole site — change it here once and it changes everywhere."),
          p("ما الذي لا يُدار من هنا؟ روابط التواصل الاجتماعي (إنستغرام، تيك توك، X) تُحرَّر من أقسام تذييل الصفحة (Footer)، وعناوين بطاقات التواصل الثلاث تُحرَّر من صفحة «التواصل» نفسها. فلو لم تجد ما تبحث عنه في «إعدادات الموقع»، فهو غالبًا في صفحته الخاصة.", "What isn't managed here? Social links (Instagram, TikTok, X) are edited from the footer sections, and the three contact-card titles are edited from the “Contact” page itself. So if you don't find something in “Site Settings”, it's likely on its own page."),
          p("اضغط «حفظ» بعد التعديل ليسري التغيير على كل الصفحات فوراً.", "Click “Save” after editing so the change applies to all pages immediately."),
        ],
      },
    ],
  },

  // ======================== الجزء 3: التحليلات والإحصاءات ========================
  {
    id: "analytics",
    title_ar: "التحليلات: قراءة أرقام موقعك",
    title_en: "Analytics: reading your site's numbers",
    sections: [
      {
        id: "analytics-overview",
        title_ar: "ما هي صفحة التحليلات؟",
        title_en: "What is the Analytics page?",
        intro_ar: "صفحة «التحليلات» هي لوحة القيادة التي تريك ماذا يحدث في موقعك بالأرقام: كم زائرًا جاء، من أين، وكم طلبًا وتقييمًا وتوظيفًا وصلك. افتحها من «التحليلات» في القائمة الجانبية. فكّر فيها كطبلون السيارة — يجمع كل المؤشّرات في مكان واحد لتعرف حالة موقعك بنظرة.",
        intro_en: "The “Analytics” page is the dashboard that shows what's happening on your site in numbers: how many visitors came, from where, and how many requests, assessments, and job applications you received. Open it from “Analytics” in the sidebar. Think of it like a car dashboard — it gathers all the gauges in one place so you know your site's health at a glance.",
        steps: [
          p("الأرقام تأتي من ثلاثة مصادر مختلفة، وكل قسم مكتوب فوقه مصدره: (١) «نظامك (CMS)» — أرقام الطلبات والتقييمات من قاعدة بياناتك مباشرة، وتتحدّث فورًا مع كل طلب جديد. (٢) «زيارات الموقع (GA4)» — من Google Analytics، تُظهر الزوّار وسلوكهم. (٣) «أداء البحث (SEO)» — من Google Search Console، تُظهر ظهورك في نتائج بحث جوجل.", "The numbers come from three different sources, and each section is labelled with its source: (1) “Your system (CMS)” — request and assessment figures straight from your database, updating instantly with each new request. (2) “Website Traffic (GA4)” — from Google Analytics, showing visitors and their behaviour. (3) “Search Performance (SEO)” — from Google Search Console, showing your presence in Google search results."),
          p("لا تحتاج لعمل أي شيء لتظهر الأرقام — كلها تُجمَع تلقائيًا. دورك فقط أن تقرأها وتفهمها، وهذا ما تشرحه الأقسام التالية.", "You don't need to do anything for the numbers to appear — they're all collected automatically. Your only job is to read and understand them, which the next sections explain."),
          p("شارة «مباشر» الخضراء بجانب عنوان أي قسم تعني أن مصدره متّصل ويجلب بيانات حيّة. لو ظهرت رسالة «لم يتم الربط بعد» فهذا يعني أن ذلك المصدر لم يُفعّل، والفريق التقني يتولّى ربطه.", "The green “Live” badge beside a section's title means its source is connected and pulling live data. If you see “not connected yet”, that source hasn't been enabled — the technical team handles connecting it."),
        ],
      },
      {
        id: "analytics-traffic",
        title_ar: "زيارات الموقع (GA4)",
        title_en: "Website Traffic (GA4)",
        intro_ar: "هذا القسم يجيب على السؤال: من يزور موقعي، وكيف يتصرّفون؟ الأرقام لآخر ٢٨ يومًا.",
        intro_en: "This section answers: who visits my site, and how do they behave? Figures cover the last 28 days.",
        steps: [
          p("البطاقات الأربعة الكبيرة في الأعلى: «الجلسات» = عدد مرّات دخول الموقع، «المستخدمون» = عدد الأشخاص (الشخص الواحد قد يزور أكثر من مرّة)، «مستخدمون جدد» = من زاروا لأول مرّة، «مشاهدات الصفحات» = إجمالي الصفحات التي فُتحت.", "The four big cards at top: “Sessions” = number of visits, “Users” = number of people (one person may visit more than once), “New Users” = first-time visitors, “Page Views” = total pages opened."),
          p("المؤشّرات الثلاثة الصغيرة: «معدل التفاعل» = نسبة الزيارات التي تفاعل فيها الزائر فعلًا (كلما زاد كان أفضل)، «معدل الارتداد» = نسبة من غادروا بسرعة دون تفاعل (كلما قلّ كان أفضل)، «متوسط زمن التفاعل» = الوقت الذي يقضيه الزائر متفاعلًا في المتوسّط.", "The three small metrics: “Engagement Rate” = share of visits where the visitor actually engaged (higher is better), “Bounce Rate” = share who left quickly without engaging (lower is better), “Avg. Engagement” = the average time a visitor spends engaged."),
          p("«اتجاه الجلسات»: رسم بياني خطّي يريك عدد الزيارات يومًا بيوم — يساعدك تلاحظ أثر حملة إعلانية أو منشور على أيّام معيّنة.", "“Sessions Trend”: a line chart showing visits day by day — helps you spot the effect of a campaign or a post on particular days."),
          p("الرسوم الدائرية والأعمدة: «حسب الجهاز» (جوال/كمبيوتر)، «حسب القناة» (من أين جاء الزائر: بحث جوجل، مباشرة، سوشيال…)، «حسب المدينة»، و«أكثر الصفحات دخولًا» (أول صفحة يفتحها الزوّار). كل شريحة تُظهر نسبتها المئوية، وعند وقوفك عليها يظهر العدد الحقيقي.", "The pie and bar charts: “By Device” (mobile/desktop), “By Channel” (where the visitor came from: Google search, direct, social…), “By City”, and “Top Landing Pages” (the first page visitors open). Each slice shows its percentage, and hovering reveals the actual count."),
        ],
      },
      {
        id: "analytics-events",
        title_ar: "تفاعلات الزوّار (الأحداث)",
        title_en: "Visitor Actions (events)",
        intro_ar: "هذا الجزء يقيس الأفعال المهمّة التي يقوم بها الزوّار — لا مجرّد التصفّح، بل الضغطات التي تدلّ على اهتمام حقيقي.",
        intro_en: "This part measures the important actions visitors take — not just browsing, but the clicks that signal real interest.",
        steps: [
          p("«ضغطات واتساب / الهاتف / الإيميل»: كم مرّة ضغط الزوّار على زر التواصل المقابل. أرقام مرتفعة هنا تعني أن الموقع يحوّل الزوّار إلى تواصل فعلي.", "“WhatsApp / Phone / Email clicks”: how many times visitors clicked the matching contact button. High numbers here mean the site is turning visitors into real contact."),
          p("«عمليات البحث الذكي»: كم مرّة استخدم الزوّار خانة البحث عن الخدمات في الموقع — يدلّك على ما يبحث عنه الناس.", "“Smart Searches”: how many times visitors used the site's service-search box — tells you what people are looking for."),
          p("رسم «أزرار التواصل»: يقارن بين وسائل التواصل المختلفة (طلب التحاق، واتساب، اتصال، إيميل) لترى أيّها يستخدمه الناس أكثر.", "“Contact Actions” chart: compares the different contact methods (admission request, WhatsApp, phone, email) so you see which people use most."),
          p("رسم «التقييم: بدء مقابل إكمال»: يريك كم شخصًا بدأ اختبار التقييم مقابل كم أكمله — الفرق بينهما يكشف إن كان الاختبار طويلًا أو يحتاج تبسيطًا.", "“Assessment: Starts vs Completions” chart: shows how many people started the assessment vs how many finished it — the gap reveals whether the test is too long or needs simplifying."),
        ],
      },
      {
        id: "analytics-seo",
        title_ar: "أداء البحث في جوجل (SEO)",
        title_en: "Google Search Performance (SEO)",
        intro_ar: "هذا القسم يريك كيف يظهر موقعك في نتائج بحث جوجل — قبل حتى أن يدخل الزائر الموقع.",
        intro_en: "This section shows how your site appears in Google search results — even before a visitor reaches the site.",
        steps: [
          p("المؤشّرات الأربعة: «النقرات» = كم مرّة نقر الناس على موقعك في نتائج جوجل، «مرات الظهور» = كم مرّة ظهر موقعك في النتائج (حتى لو لم يُنقر)، «نسبة النقر (CTR)» = النقرات ÷ الظهور، «متوسط الترتيب» = موضعك المتوسّط في صفحة النتائج (الرقم الأقل أفضل — 1 يعني الأول).", "The four metrics: “Clicks” = how many times people clicked your site in Google results, “Impressions” = how many times your site appeared in results (even if not clicked), “CTR” = clicks ÷ impressions, “Avg. Position” = your average spot on the results page (lower is better — 1 means first)."),
          p("جدول «أكثر كلمات البحث»: الكلمات التي كتبها الناس في جوجل ووجدوا موقعك من خلالها، مع نقراتها وظهورها وترتيبها. يخبرك بأي الكلمات يجدك بها جمهورك.", "“Top Search Queries” table: the words people typed into Google and found your site through, with their clicks, impressions, and position. It tells you which words your audience finds you by."),
          p("رسم «أكثر الصفحات ظهورًا في البحث»: أي صفحات موقعك تظهر أكثر في نتائج جوجل. ملاحظة: بيانات البحث تتأخّر يومًا إلى يومين، فلا تتوقّع أرقامًا فورية هنا.", "“Top Pages in Search” chart: which of your pages show up most in Google results. Note: search data lags by 1–2 days, so don't expect instant figures here."),
        ],
      },
      {
        id: "analytics-cms",
        title_ar: "أرقام الطلبات (من نظامك)",
        title_en: "Request Figures (from your system)",
        intro_ar: "هذه أهم الأرقام العملية لك: كل ما وصلك عبر نماذج الموقع، مأخوذ من قاعدة بياناتك مباشرةً ويتحدّث فورًا.",
        intro_en: "These are the most practical figures for you: everything received through the site's forms, taken straight from your database and updating instantly.",
        steps: [
          cms("analytics", "البطاقات الأربعة: «طلبات الالتحاق»، «نتائج التقييم»، «رسائل التواصل»، «طلبات التوظيف» — إجمالي كلٍّ منها. هذه نفس الطلبات التي تديرها من أقسام «الطلبات والرسائل». وتحتها مباشرةً تبدأ الرسوم البيانية كما في الصورة.", "The four cards: “Admission Requests”, “Assessments”, “Contact Messages”, “Job Applications” — the total of each. These are the same requests you manage from the “Requests & Messages” sections. Directly below them the charts begin, as shown in the image."),
          p("«طلبات الالتحاق» بالتفصيل: رسوم توزّع الطلبات «حسب الفرع» و«حسب المدينة» و«حسب نوع الحالة» و«حسب الفئة العمرية» و«حسب الجنس» — تساعدك تعرف أي فرع وأي فئة عليها إقبال أكبر.", "“Admission Requests” in detail: charts breaking requests down “By Branch”, “By City”, “By Case Type”, “By Age Band”, and “By Gender” — helping you see which branch and which segment has the most demand."),
          p("«التقييمات»: توزيع نتائج التقييم «حسب النوع» و«حسب مستوى الحالة» (مرتفع/متوسط/منخفض).", "“Assessments”: assessment results broken down “By Type” and “By Level” (high/medium/low)."),
          p("«التوظيف»: المتقدّمون «حسب المدينة» و«حسب الوظيفة»، ورسم «اتجاه طلبات التوظيف» أسبوعيًا لترى فترات الإقبال على الوظائف.", "“Recruitment”: applicants “By City” and “By Position”, plus an “Applications Trend” chart by week so you can see peak hiring interest periods."),
          p("«إشارات الطلب»: قسم ذكي يبرز ملاحظات مفيدة من البيانات — مثل مدينة يأتي منها طلبات كثيرة دون أن يكون لها فرع قريب، وهي فرصة توسّع محتملة.", "“Demand Signals”: a smart section highlighting useful notes from the data — like a city sending many requests without a nearby branch, a potential expansion opportunity."),
        ],
        faq: [
          faq("لماذا قسم الزيارات (GA4) يقول «لا توجد بيانات كافية»؟", "Why does the Traffic (GA4) section say “not enough data”?",
              "إمّا أن الربط بـGoogle Analytics لم يُفعّل بعد (يتولّاه الفريق التقني)، أو أن الموقع جديد ولم يتجمّع لديه زيارات كافية بعد. أرقام «نظامك (CMS)» تظهر دائمًا لأنها من قاعدة بياناتك مباشرة.",
              "Either the Google Analytics connection isn't enabled yet (the technical team handles it), or the site is new and hasn't gathered enough visits. The “Your system (CMS)” figures always show because they come straight from your database."),
          faq("الأرقام هنا تختلف قليلًا عن عدّاد آخر رأيته، لماذا؟", "The numbers here differ slightly from another counter I saw — why?",
              "كل مصدر يقيس بطريقة مختلفة قليلًا (جوجل يستبعد الزيارات المكرّرة أو الآلية مثلًا). المهم هو الاتجاه العام والمقارنة عبر الوقت، لا الرقم المطلق تمامًا.",
              "Each source measures a bit differently (Google excludes repeated or automated visits, for instance). What matters is the overall trend and comparison over time, not the exact absolute number."),
        ],
      },
    ],
  },

  // ======================== الجزء 4: صفحات الموقع ========================
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
          cms("list-branches", "تُدار من «مراكزنا (الفروع)». محرّر كل فرع مقسّم لأقسام واضحة، وكل قسم يتحكّم في جزء مستقل من صفحة الفرع (لكل فرع محتواه الخاص، لا شيء مشترك بين الفروع).", "Managed from “Our Centers (Branches)”. Each branch's editor is split into clear sections, each controlling a separate part of that branch's page (every branch has its own content — nothing is shared between branches)."),
          p("الأقسام: «بيانات الفرع الأساسية» (الاسم/المدينة/المنطقة/العنوان/الهاتف/المدير/رابط الخريطة)، «الخدمات المقدَّمة» (كروت الخدمات الكبيرة + وسوم الخدمات السريعة)، «ما يميّز الفرع» (بطاقات بأيقونات)، «قصص النجاح» (العنوان والوصف)، «ملف الفرع (PDF)»، و«معرض صور الفرع».", "Sections: “Branch basic info” (name/city/region/address/phone/manager/map link), “Services offered” (the big service cards + quick service tags), “What sets the branch apart” (cards with icons), “Success stories” (heading & text), “Branch profile (PDF)”, and “Branch photo gallery”."),
          p("«ملف الفرع (PDF)» يتحكّم في محتوى الملف الذي يُنزَّل عند الضغط على «تحميل البروفايل» في صفحة الفرع (النبذة، الإحصائيات، رحلة التأهيل، الاعتمادات).", "“Branch profile (PDF)” controls the file downloaded via “Download profile” on the branch page (intro, statistics, rehabilitation journey, accreditations)."),
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
          site("success-stories", "قصص نجاح المستفيدين، ولكل قصة نافذة «عرض التفاصيل».", "Beneficiaries' success stories, each with a “View Details” popup."),
          p("تُدار من «أبطال عبور (قصص النجاح)». محرّر كل قصة مقسّم إلى: «بيانات القصة (البطاقة)» و«نافذة عرض التفاصيل».", "Managed from “Oboor Champions (Success Stories)”. Each story's editor is split into “Story info (card)” and “View Details popup”."),
          p("قسم «نافذة عرض التفاصيل» يتحكّم في محتوى النافذة التي تُفتح عند الضغط على «عرض التفاصيل» لتلك القصة (الوسم، البرنامج، رحلة العلاج، أبرز النتائج) — لكل قصة تفاصيلها الخاصة.", "The “View Details popup” section controls the popup opened via “View Details” for that story (badge, program, treatment journey, key results) — each story has its own details."),
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
        id: "site-contact",
        title_ar: "خذ الخطوة لعبور (صفحة التواصل)",
        title_en: "Take the Step (Contact Page)",
        steps: [
          site("contact", "صفحة التواصل: مقدمة، بطاقات التواصل، قسم «ارسل طلبك» بنموذج، خريطة الفروع، وقسم «تابعنا».", "The contact page: an intro, contact cards, a “Send Your Request” section with a form, the branches map, and a “Follow Us” section."),
          p("تُدار كل نصوصها من «خذ الخطوة لعبور (التواصل)» في القائمة الجانبية — مقسّمة إلى أقسام (المقدمة، معلومات التواصل، ارسل طلبك، الخريطة، تابعنا).", "All its texts are managed from “Take the Step (Contact)” in the sidebar — split into sections (intro, contact info, send request, map, follow us)."),
          p("مهم: البطاقات في «معلومات التواصل» تتحكّم في العناوين والوصف فقط. أما البريد الإلكتروني وأرقام الهاتف نفسها فتُدار من «إعدادات الموقع».", "Important: the “Contact Information” cards control only the titles and descriptions. The actual email and phone numbers are managed in “Site Settings”."),
        ],
      },
      {
        id: "site-assessment",
        title_ar: "صفحة التقييم (إدارة محتواها)",
        title_en: "The Assessment Page (Managing Its Content)",
        intro_ar: "الزائر يملأ التقييم كخطوات متتابعة، لكن محتوى الصفحة نفسه (النصوص والأرقام والأسئلة والخيارات) تتحكّم فيه أنت من اللوحة.",
        intro_en: "Visitors fill the assessment as a step-by-step wizard, but the page's own content (texts, numbers, questions, options) is controlled by you from the panel.",
        steps: [
          site("assessment", "صفحة التقييم كما يراها الزائر: مقدمة وأرقام ومميزات ثم خطوات وأسئلة أولية تنتهي بإرسال النتيجة.", "The assessment page as the visitor sees it: an intro, numbers and features, then steps and preliminary questions ending with submitting the result."),
          p("تُدار من «التقييم» في القائمة الجانبية (مجموعة صفحات الموقع): عناوين ونصوص الأقسام من لوحة «محتوى وعناوين الصفحة»، ومعها الأرقام والمميزات والخطوات والأسئلة الأولية وخياراتها.", "Managed from “Assessment” in the sidebar (Site Pages group): section headings and texts via the “Page content & headings” panel, along with the numbers, features, steps, and preliminary questions with their options."),
          p("«بطاقات أنواع التقييم» قائمة مستقلة في أسفل نفس الصفحة — أضف أو عدّل الكروت التي تعرض أنواع التقييم المتاحة، بنفس طريقة أي قائمة.", "“Assessment-type Cards” is a separate list at the bottom of the same page — add or edit the cards that show the available assessment types, just like any list."),
          p("أما النتائج التي يرسلها الزوّار فتصلك في «نتائج التقييم» ضمن مجموعة «الطلبات والرسائل» (وليس هنا).", "The results visitors submit arrive in “Assessment Results” under the “Requests & Messages” group (not here)."),
        ],
      },
      {
        id: "site-forms",
        title_ar: "نماذج الالتحاق والتقييم",
        title_en: "Admission & Assessment Forms",
        steps: [
          site("admission", "«طلب الالتحاق» ونموذج التواصل نماذج يملؤها الزائر لإرسال طلبه.", "“Admission” and the contact form are forms visitors fill to send a request."),
          site("assessment", "نموذج التقييم خطوات متتابعة (Wizard) تنتهي بإرسال النتيجة.", "The assessment form is a step-by-step wizard that ends by submitting the result."),
          p("كل ما يُرسَل من هذه النماذج يصلك في مجموعة «الطلبات والرسائل» في اللوحة.", "Everything sent from these forms arrives in the “Requests & Messages” group in the panel."),
        ],
      },
    ],
  },

  // ======================== الجزء 5: مهام شائعة (وصفات جاهزة) ========================
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
          cms("list-branches", "من القائمة الجانبية افتح «مراكزنا (الفروع)». الفروع مقسّمة إلى مجموعات حسب المنطقة، فلا يوجد زر «إضافة» واحد أعلى القائمة. افتح أولًا مجموعة المنطقة التي سيتبعها الفرع (مثل «الرياض»).", "From the sidebar open “Our Centers (Branches)”. Branches are grouped by region, so there's no single “Add” button at the top. First open the region group the branch will belong to (e.g. “Riyadh”)."),
          p("اضغط زر تلك المجموعة «إضافة فرع — <اسم المنطقة>». يفتح المحرّر بحقول فارغة، والفرع الجديد يرث تلك المنطقة تلقائيًا.", "Click that group's “Add Branch — <region>” button. The editor opens with empty fields, and the new branch inherits that region automatically."),
          cms("editor", "املأ الاسم والمدينة والعنوان — بالعربية والإنجليزية معاً. راقب شريط الاكتمال حتى يصل 100%.", "Fill the name, city, and address — in both Arabic and English. Watch the completion bar reach 100%."),
          p("أضف رقم التواصل، المدير، ورابط الخريطة في قسم «بيانات الفرع الأساسية».", "Add the phone number, manager, and map link in the “Branch basic info” section."),
          p("انزل لباقي الأقسام لتخصيص هذا الفرع: كروت الخدمات، «ما يميّز الفرع» (بأيقونات)، قصص النجاح، ملف الـPDF، ورفع صور المعرض. اترك أي قسم كما هو إن لم ترد تغييره.", "Scroll to the other sections to tailor this branch: service cards, “What sets the branch apart” (with icons), success stories, the PDF profile, and uploading gallery photos. Leave any section as-is if you don't want to change it."),
          p("تأكّد أن الحالة «منشور» (من مجموعة «الإعدادات» أسفل المحرّر)، ثم اضغط «حفظ». سيظهر الفرع في صفحة «مراكزنا» على الموقع خلال لحظات.", "Make sure the status is “Published” (in the “Settings” group at the bottom of the editor), then click “Save”. The branch appears on the site's Centers page within moments."),
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

  // ======================== الجزء 6: نصائح وأسئلة شائعة ومسرد ========================
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
          faq("أين أعدّل نصوص صفحة «خذ الخطوة لعبور» (التواصل)؟",
              "Where do I edit the “Take the Step” (contact) page texts?",
              "من «خذ الخطوة لعبور (التواصل)» في القائمة الجانبية — كل عناوين ونصوص الصفحة. أما الإيميل والأرقام فمن «إعدادات الموقع».",
              "From “Take the Step (Contact)” in the sidebar — all the page's headings and texts. The email and numbers, though, are in “Site Settings”."),
          faq("أين أتحكّم في محتوى نافذة «عرض التفاصيل» لقصة نجاح؟",
              "Where do I control a success story's “View Details” popup?",
              "من داخل محرّر القصة نفسها في «أبطال عبور» → قسم «نافذة عرض التفاصيل». لكل قصة تفاصيلها المستقلة.",
              "Inside that story's own editor in “Oboor Champions” → the “View Details popup” section. Each story has its own separate details."),
          faq("لماذا لا أجد حقل «الحي» أو «ساعات العمل» أو «التقييم» في الفرع؟",
              "Why can't I find the “District”, “Working Hours”, or “Rating” field on a branch?",
              "أُخفيت هذه الحقول من محرّر الفرع لأنها غير مستخدمة حالياً (لتقليل الزحام). يمكن إرجاعها عند الحاجة عبر فريق الدعم.",
              "These fields were hidden from the branch editor because they're currently unused (to reduce clutter). They can be restored if needed via the support team."),
          faq("هل الفروع تتشارك نفس الخدمات وقصص النجاح؟",
              "Do branches share the same services and success details?",
              "لا؛ كل فرع صار يتحكّم في خدماته وبطاقاته وملفه (PDF) ونصوص أقسامه بشكل مستقل تماماً من محرّره الخاص.",
              "No; each branch now controls its own services, cards, profile (PDF), and section texts completely independently from its own editor."),
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
              "وأنت مسجّل الدخول: غيّرها بنفسك من صفحة «حسابي» في القائمة الجانبية → قسم «تغيير كلمة المرور». وإن كنت خارج اللوحة ونسيتها تمامًا: اضغط «نسيت كلمة المرور؟» في شاشة الدخول ليصلك رابط إعادة تعيين على بريدك المسجّل. (التفاصيل في قسم «حسابي: تغيير البريد وكلمة المرور».)",
              "While signed in: change it yourself from the “My Account” page in the sidebar → the “Change Password” section. If you're locked out and forgot it entirely: click “Forgot password?” on the sign-in screen to get a reset link on your registered email. (Details in the “My Account: Email & Password” section.)"),
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
