"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { listCollection, updateItem, createItem, deleteItem, uploadField, type CmsItem } from "@/lib/cms/api";
import { useCmsLang } from "@/lib/cms/i18n";
import { CMS_ICONS, ICON_LABELS } from "@/lib/cms/icons";
// تحميل مكوّن قصّ الصورة عند الحاجة فقط
const ImageCropModal = dynamic(() => import("@/components/cms/ImageCropModal"), { ssr: false });

// ترتيب الأقسام كما تظهر على الصفحة (لعرضها مرتّبة بدل ترتيب قاعدة البيانات)
const BLOCK_ORDER = ["hero", "about", "smart_search", "stats", "join", "join_cards", "why_us", "success", "gallery", "news", "certs", "features", "services", "profile_intro", "profile_stats", "journey", "accreditations", "steps", "prelim_questions", "answer_options", "categories", "list", "cities", "employment_types", "contact_prompt", "highlights"];
const blockRank = (b: string) => { const i = BLOCK_ORDER.indexOf(b); return i === -1 ? 999 : i; };
// أقسام محتواها منظّم معقّد ⇒ تُحرّر بالمحرّر الكامل (رابط) بدل الحقول المبسّطة
const COMPLEX_BLOCKS = new Set(["highlights", "services"]);
// أقسام هي قوائم متكررة ⇒ يُسمح بإضافة/حذف عناصرها
const LIST_BLOCKS = new Set([
  "answer_options", "prelim_questions", "cities", "employment_types",
  "accreditations", "journey", "profile_stats", "join_cards",
  "features", "stats", "steps", "services",
]);
// بلوكات لم تعُد تُدار من هنا (انتقل تحكّمها لمكان أنسب) — تُخفى من محرّر الصفحة
// «branches.services» صار لكل فرع مستقلاً داخل محرّر الفرع نفسه (كروت خدمات الفرع).
const HIDDEN_BLOCKS = new Set(["branches.services"]);
// أقسام تعرض لكل عنصر أيقونة قابلة للاختيار (المفتاح = اسم البلوك، القيمة = الأيقونات المتاحة)
const ICON_BLOCK_NAMES: Record<string, string[]> = {
  features: ["graduation", "shield", "heart", "building", "team", "book", "target", "star", "trophy", "bulb", "hand", "activity", "clipboard", "list"],
};
// نص زر الإضافة محدّد لكل قسم
// رابط الصفحة الحقيقية لكل صفحة (لزر «عاين الصفحة»)
const PAGE_URL: Record<string, string> = {
  home: "/", careers: "/careers", success: "/success-stories", specialists: "/specialists",
  branches: "/branches", news: "/news", assessment: "/assessment", about: "/about", programs: "/programs",
};
const BLOCK_ADD: Record<string, string> = {
  answer_options: "إضافة خيار إجابة", prelim_questions: "إضافة سؤال",
  cities: "إضافة مدينة", employment_types: "إضافة نوع دوام",
  accreditations: "إضافة اعتماد", journey: "إضافة خطوة",
  profile_stats: "إضافة إحصائية", join_cards: "إضافة بطاقة",
  features: "إضافة ميزة",
  stats: "إضافة رقم", steps: "إضافة خطوة", services: "إضافة خدمة",
};
const BLOCK_ADD_EN: Record<string, string> = {
  answer_options: "Add answer option", prelim_questions: "Add question",
  cities: "Add city", employment_types: "Add employment type",
  accreditations: "Add accreditation", journey: "Add step",
  profile_stats: "Add statistic", join_cards: "Add card",
  features: "Add feature",
  stats: "Add number", steps: "Add step", services: "Add service",
};

// أسماء ودّية لأقسام رأس الصفحة وعناصرها
const BLOCK_LABELS: Record<string, string> = {
  hero: "المقدمة العلوية (الهيرو)",
  list: "ترويسة القائمة",
  cities: "المدن (فلاتر البحث)",
  employment_types: "أنواع الدوام (فلاتر البحث)",
  about: "قسم «عن عبور»",
  smart_search: "قسم البحث الذكي",
  stats: "قسم الأرقام",
  why_us: "قسم «لماذا عبور؟»",
  success: "قسم قصص النجاح",
  gallery: "قسم المعرض",
  news: "قسم الأخبار",
  certs: "قسم الشهادات والاعتمادات",
  highlights: "القصة المميّزة",
  join_cards: "بطاقات الانضمام",
  join: "قسم «انضم إلى الفريق»",
  contact_prompt: "شريط دعوة التواصل",
  features: "المميزات",
  steps: "خطوات التقييم",
  prelim_questions: "الأسئلة الأولية",
  answer_options: "خيارات الإجابة",
  categories: "تصنيفات الأخبار",
  profile_stats: "إحصائيات ملف الفرع",
  journey: "رحلة التأهيل (ملف الفرع)",
  accreditations: "الاعتمادات (ملف الفرع)",
  profile_intro: "نبذة ملف الفرع",
  services: "كروت خدمات الفرع",
};
const BLOCK_LABELS_EN: Record<string, string> = {
  hero: "Top intro (Hero)",
  list: "List header",
  cities: "Cities (search filters)",
  employment_types: "Employment types (search filters)",
  about: "“About Oboor” section",
  smart_search: "Smart search section",
  stats: "Numbers section",
  why_us: "“Why Oboor?” section",
  success: "Success stories section",
  gallery: "Gallery section",
  news: "News section",
  certs: "Certificates & accreditations section",
  highlights: "Featured story",
  join_cards: "Join cards",
  join: "“Join the Team” section",
  contact_prompt: "Contact call-to-action bar",
  features: "Features",
  steps: "Assessment steps",
  prelim_questions: "Preliminary questions",
  answer_options: "Answer options",
  categories: "News categories",
  profile_stats: "Branch profile statistics",
  journey: "Rehabilitation journey (branch profile)",
  accreditations: "Accreditations (branch profile)",
  profile_intro: "Branch profile intro",
  services: "Branch service cards",
};
const ITEM_LABELS: Record<string, string> = {
  "hero.badge": "الوسم العلوي",
  "hero.heading": "العنوان + الوصف + الصورة",
  "hero.stat": "الشارة العائمة (العدّاد)",
  "join.visual": "صورة قسم «انضم إلى الفريق»",
  "hero.map_heading": "عنوان قسم الخريطة",
  "hero.features_heading": "عنوان قسم المميزات",
  "hero.why_heading": "عنوان قسم «لماذا هذا التقييم»",
  "hero.steps_heading": "عنوان قسم الخطوات",
  "list.header": "ترويسة قائمة الوظائف",
  // الصفحة الرئيسية
  "hero.chrome": "الوسم + زر الإجراء (ثابتان فوق كل الشرائح)",
  "about.badge": "الوسم وزر «تعرّف أكثر»",
  "about.intro": "العنوان + الفقرات",
  "about.accred": "بطاقة «مركز معتمد»",
  "about.img1": "الصورة الكبيرة",
  "about.img2": "الصورة الصغيرة",
  "smart_search.badge": "الوسم العلوي",
  "smart_search.main": "العنوان + الجملة التوضيحية",
  "stats.main": "العنوان + الجملة التوضيحية",
  "why_us.badge": "الوسم العلوي",
  "why_us.main": "العنوان + الجملة التوضيحية",
  "success.badge": "الوسم العلوي",
  "success.main": "العنوان + الجملة التوضيحية",
  "gallery.badge": "الوسم العلوي",
  "gallery.main": "العنوان",
  "news.main": "العنوان + الجملة التوضيحية",
  "certs.heading": "العنوان + الجملة التوضيحية",
  "certs.cert1": "الشهادة الأولى",
  "certs.cert2": "الشهادة الثانية",
  "certs.cert3": "الشهادة الثالثة",
  "certs.cert4": "الشهادة الرابعة",
};
const ITEM_LABELS_EN: Record<string, string> = {
  "hero.badge": "Top badge",
  "hero.heading": "Heading + description + image",
  "join.visual": "“Join the Team” section image",
  "hero.stat": "Floating badge (counter)",
  "hero.map_heading": "Map section heading",
  "hero.features_heading": "Features section heading",
  "hero.why_heading": "“Why this assessment” section heading",
  "hero.steps_heading": "Steps section heading",
  "list.header": "Jobs list header",
  // Home page
  "hero.chrome": "Badge + action button (fixed above all slides)",
  "about.badge": "Badge and “Learn more” button",
  "about.intro": "Heading + paragraphs",
  "about.accred": "“Accredited center” card",
  "about.img1": "Large image",
  "about.img2": "Small image",
  "smart_search.badge": "Top badge",
  "smart_search.main": "Heading + descriptive line",
  "stats.main": "Heading + descriptive line",
  "why_us.badge": "Top badge",
  "why_us.main": "Heading + descriptive line",
  "success.badge": "Top badge",
  "success.main": "Heading + descriptive line",
  "gallery.badge": "Top badge",
  "gallery.main": "Heading",
  "news.main": "Heading + descriptive line",
  "certs.heading": "Heading + descriptive line",
  "certs.cert1": "First certificate",
  "certs.cert2": "Second certificate",
  "certs.cert3": "Third certificate",
  "certs.cert4": "Fourth certificate",
};
// تسميات مخصّصة لحقلَي «العنوان/النص» حسب العنصر (لتوضيح ما يمثّله كل حقل)
const FIELD_LABELS: Record<string, { title?: string; text?: string }> = {
  "hero.chrome": { title: "الوسم العلوي", text: "نص زر الإجراء" },
  "hero.heading": { title: "العنوان", text: "الجملة التوضيحية" },
  "hero.map_heading": { title: "العنوان", text: "الجملة التوضيحية" },
  "hero.features_heading": { title: "العنوان", text: "الجملة التوضيحية" },
  "hero.why_heading": { title: "العنوان", text: "الجملة التوضيحية" },
  "hero.steps_heading": { title: "العنوان", text: "الجملة التوضيحية" },
  "about.badge": { title: "الوسم", text: "نص الزر" },
  "about.intro": { title: "العنوان", text: "الفقرات (كل سطر = فقرة)" },
  "about.accred": { title: "العنوان", text: "السطر الصغير" },
  "smart_search.badge": { title: "الوسم" },
  "smart_search.main": { title: "العنوان", text: "الجملة التوضيحية" },
  "stats.main": { title: "العنوان", text: "الجملة التوضيحية" },
  "why_us.badge": { title: "الوسم" },
  "why_us.main": { title: "العنوان", text: "الجملة التوضيحية" },
  "success.badge": { title: "الوسم" },
  "success.main": { title: "العنوان", text: "الجملة التوضيحية" },
  "gallery.badge": { title: "الوسم" },
  "gallery.main": { title: "العنوان" },
  "news.main": { title: "العنوان", text: "الجملة التوضيحية" },
  "certs.heading": { title: "العنوان", text: "الجملة التوضيحية" },
  "certs.cert1": { title: "اسم/كود الشهادة", text: "التصنيف" },
  "certs.cert2": { title: "اسم/كود الشهادة", text: "التصنيف" },
  "certs.cert3": { title: "اسم/كود الشهادة", text: "التصنيف" },
  "certs.cert4": { title: "اسم/كود الشهادة", text: "التصنيف" },
};
const FIELD_LABELS_EN: Record<string, { title?: string; text?: string }> = {
  "hero.chrome": { title: "Top badge", text: "Action button text" },
  "hero.heading": { title: "Heading", text: "Descriptive line" },
  "hero.map_heading": { title: "Heading", text: "Descriptive line" },
  "hero.features_heading": { title: "Heading", text: "Descriptive line" },
  "hero.why_heading": { title: "Heading", text: "Descriptive line" },
  "hero.steps_heading": { title: "Heading", text: "Descriptive line" },
  "about.badge": { title: "Badge", text: "Button text" },
  "about.intro": { title: "Heading", text: "Paragraphs (each line = a paragraph)" },
  "about.accred": { title: "Heading", text: "Small line" },
  "smart_search.badge": { title: "Badge" },
  "smart_search.main": { title: "Heading", text: "Descriptive line" },
  "stats.main": { title: "Heading", text: "Descriptive line" },
  "why_us.badge": { title: "Badge" },
  "why_us.main": { title: "Heading", text: "Descriptive line" },
  "success.badge": { title: "Badge" },
  "success.main": { title: "Heading", text: "Descriptive line" },
  "gallery.badge": { title: "Badge" },
  "gallery.main": { title: "Heading" },
  "news.main": { title: "Heading", text: "Descriptive line" },
  "certs.heading": { title: "Heading", text: "Descriptive line" },
  "certs.cert1": { title: "Certificate name/code", text: "Category" },
  "certs.cert2": { title: "Certificate name/code", text: "Category" },
  "certs.cert3": { title: "Certificate name/code", text: "Category" },
  "certs.cert4": { title: "Certificate name/code", text: "Category" },
};
// ملاحظات توضيحية لبعض العناصر (مثل الرقم التلقائي)
const ITEM_NOTES: Record<string, string> = {
  "hero.stat": "الرقم يُحسب تلقائياً = عدد الوظائف المنشورة (يتحدّث وحده عند الإضافة أو الحذف). أنت تتحكّم فقط في «العنوان» و«النص» حوله.",
  "list.header": "الرقم يُحسب تلقائياً = عدد الوظائف المنشورة. أنت تتحكّم فقط في النصوص حوله.",
};
const ITEM_NOTES_EN: Record<string, string> = {
  "hero.stat": "The number is calculated automatically = the count of published jobs (it updates on its own when you add or delete). You only control the “title” and “text” around it.",
  "list.header": "The number is calculated automatically = the count of published jobs. You only control the text around it.",
};

// ملاحظة تعريفية لكل قسم (المفتاح = «الصفحة.البلوك») — توضّح أين يظهر المحتوى على الموقع
// حتى لا يتوه المستخدم. previewPath = رابط الصفحة التي يظهر فيها فعلاً (لزر معاينة).
const BLOCK_NOTES: Record<string, { ar: string; en: string; previewPath?: string; previewLabel_ar?: string; previewLabel_en?: string }> = {
  "branches.services": {
    ar: "كروت الخدمات دي بتظهر داخل صفحة تفاصيل أي فرع (من صفحة مراكزنا اضغط أي فرع). المحتوى مشترك ويظهر بنفسه في كل الفروع — مش خاص بفرع واحد.",
    en: "These service cards appear inside any branch's detail page (open any branch from the Branches page). The content is shared and shows on every branch — not tied to one branch.",
    previewPath: "/branches", previewLabel_ar: "افتح صفحة مراكزنا ← اختر فرعاً", previewLabel_en: "Open Branches → pick a branch",
  },
  "branches.profile_intro": {
    ar: "بتظهر في صفحة «ملف الفرع» (افتح أي فرع ثم صفحة ملف الفرع). المحتوى مشترك لكل الفروع.",
    en: "Appears on the branch profile page (open any branch, then its profile page). Shared across all branches.",
  },
  "branches.profile_stats": {
    ar: "أرقام تظهر في صفحة «ملف الفرع» (مشتركة لكل الفروع).",
    en: "Numbers shown on the branch profile page (shared across all branches).",
  },
  "branches.journey": {
    ar: "خطوات «رحلة التأهيل» في صفحة «ملف الفرع» (مشتركة لكل الفروع).",
    en: "The rehabilitation journey steps on the branch profile page (shared across all branches).",
  },
  "branches.accreditations": {
    ar: "الاعتمادات في صفحة «ملف الفرع» (مشتركة لكل الفروع).",
    en: "Accreditations on the branch profile page (shared across all branches).",
  },
  "branches.features": {
    ar: "قسم «بيئتنا، أمان وتمكين» أسفل صفحة مراكزنا.",
    en: "The “Our Environment” section at the bottom of the Branches page.",
    previewPath: "/branches", previewLabel_ar: "عاين صفحة مراكزنا", previewLabel_en: "Preview Branches page",
  },
};

const INPUT = "w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20";

function resolveSrc(s: string): string {
  if (!s) return "";
  if (/^(https?:|data:|blob:|\/)/.test(s)) return s;
  return "/" + s.replace(/^\/+/, "");
}

// نص متعدّد الأسطر يتمدّد تلقائياً ليظهر كل المحتوى بلا تمرير داخلي
function AutoTextarea({ value, onChange, dir, placeholder }: { value: string; onChange: (v: string) => void; dir?: string; placeholder?: string }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);
  return (
    <textarea ref={ref} value={value} onChange={(e) => onChange(e.target.value)} dir={dir} rows={1} placeholder={placeholder}
      className={INPUT + " resize-none overflow-hidden"} />
  );
}

// عناصر يُعرض نصّها كفقرات منفصلة (حقل لكل فقرة) بدل صندوق واحد
const PARAGRAPH_KEYS = new Set(["about.intro"]);

// محرّر فقرات — كل فقرة في حقل مستقل (عربي/إنجليزي)؛ تُخزَّن مفصولة بأسطر
function ParagraphsField({ ar, en, onChange }: { ar: string; en: string; onChange: (ar: string, en: string) => void }) {
  const { lang } = useCmsLang();
  const isEn = lang === "en";
  const t = (arText: string, e: string) => (isEn ? e : arText);
  const a = ar ? ar.split("\n") : [];
  const e = en ? en.split("\n") : [];
  const n = Math.max(a.length, e.length, 1);
  const norm = (arr: string[]) => { const c = [...arr]; while (c.length < n) c.push(""); return c; };
  const setRow = (i: number, av: string, ev: string) => { const na = norm(a); const ne = norm(e); na[i] = av; ne[i] = ev; onChange(na.join("\n"), ne.join("\n")); };
  const removeRow = (i: number) => onChange(norm(a).filter((_, j) => j !== i).join("\n"), norm(e).filter((_, j) => j !== i).join("\n"));
  const add = () => onChange([...a, ""].join("\n"), [...e, ""].join("\n"));
  return (
    <div className="space-y-2">
      {Array.from({ length: n }, (_, i) => (
        <div key={i} className="flex items-start gap-2">
          <span className="mt-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-surface text-[10px] font-bold text-ink-soft">{i + 1}</span>
          <div className="grid flex-1 gap-2 sm:grid-cols-2">
            <AutoTextarea value={a[i] ?? ""} onChange={(v) => setRow(i, v, e[i] ?? "")} placeholder={t("عربي", "Arabic")} />
            <AutoTextarea value={e[i] ?? ""} onChange={(v) => setRow(i, a[i] ?? "", v)} dir="ltr" placeholder="English" />
          </div>
          <button type="button" onClick={() => removeRow(i)} className="mt-1 shrink-0 rounded-lg bg-red-50 px-2 py-1.5 text-[11px] font-semibold text-red-600 hover:bg-red-600 hover:text-white">{t("حذف", "Delete")}</button>
        </div>
      ))}
      <button type="button" onClick={add} className="inline-flex items-center gap-1 rounded-lg bg-brand/10 px-2.5 py-1 text-[11px] font-semibold text-brand hover:bg-brand hover:text-white">{t("+ إضافة فقرة", "+ Add paragraph")}</button>
    </div>
  );
}

export default function PageChrome({ page }: { page: string }) {
  const { lang } = useCmsLang();
  const en = lang === "en";
  const t = (ar: string, e: string) => (en ? e : ar);
  const [items, setItems] = useState<CmsItem[]>([]);
  const [edits, setEdits] = useState<Record<number, Record<string, string>>>({});
  const [open, setOpen] = useState(false);
  const [openBlock, setOpenBlock] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [okId, setOkId] = useState<number | null>(null);
  const [addingBlock, setAddingBlock] = useState<string | null>(null);
  const [pendingImg, setPendingImg] = useState<{ it: CmsItem; file: File } | null>(null);
  const [err, setErr] = useState("");
  const [zoom, setZoom] = useState(""); // رابط الصورة المعروضة بالحجم الكامل
  // كاسر كاش: التخزين قد يعيد استخدام نفس مسار الملف عند التغيير فيعرض المتصفح
  // النسخة القديمة. بصمة تتغيّر عند الفتح وبعد كل رفع تضمن ظهور الصورة الحالية.
  const [bust, setBust] = useState(() => Date.now());

  useEffect(() => {
    listCollection("sections")
      .then((d) => setItems(d.items.filter((it) => String(it.page ?? "") === page)))
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, [page]);

  if (loading || !items.length) return null;

  const val = (it: CmsItem, k: string) => String(edits[it.id]?.[k] ?? it[k] ?? "");
  const dirty = (id: number) => !!edits[id] && Object.keys(edits[id]).length > 0;
  const setVal = (id: number, k: string, v: string) => { setOkId(null); setEdits((p) => ({ ...p, [id]: { ...p[id], [k]: v } })); };

  async function save(it: CmsItem) {
    setSavingId(it.id); setErr(""); setOkId(null);
    try {
      const e = edits[it.id] || {};
      const payload: Record<string, unknown> = {};
      for (const k of ["title_ar", "title_en", "text_ar", "text_en", "value", "icon"]) if (k in e) payload[k] = e[k];
      if (Object.keys(payload).length) {
        const saved = await updateItem("sections", it.id, payload) as CmsItem;
        setItems((prev) => prev.map((x) => (x.id === it.id ? saved : x)));
        setEdits((p) => { const c = { ...p }; delete c[it.id]; return c; });
      }
      setOkId(it.id);
    } catch (e) { setErr(e instanceof Error ? e.message : t("تعذّر الحفظ.", "Could not save.")); }
    finally { setSavingId(null); }
  }

  // اختيار صورة → فتح المعاينة قبل الرفع
  function pickImage(it: CmsItem, file: File) {
    if (file.size > 5 * 1024 * 1024) { setErr(t("الحد الأقصى 5 ميجابايت.", "Maximum size is 5 MB.")); return; }
    setErr("");
    setPendingImg({ it, file });
  }

  async function onImage(it: CmsItem, out: Blob | File) {
    setPendingImg(null);
    const file = out instanceof File ? out : new File([out], "image.jpg", { type: out.type || "image/jpeg" });
    setSavingId(it.id); setErr(""); setOkId(null);
    try {
      const saved = await uploadField("sections", it.id, "image_file", file) as CmsItem;
      setItems((prev) => prev.map((x) => (x.id === it.id ? saved : x)));
      setBust(Date.now()); // اعرض الصورة الجديدة فوراً حتى لو أعاد التخزين نفس المسار
      setOkId(it.id);
    } catch (e) { setErr(e instanceof Error ? e.message : t("تعذّر رفع الصورة.", "Could not upload the image.")); }
    finally { setSavingId(null); }
  }

  // إضافة عنصر جديد لقسم قائمة (بنفس بنية باقي العناصر)
  async function addItem(block: string) {
    setAddingBlock(block); setErr(""); setOkId(null);
    try {
      const orders = items.filter((i) => String(i.block) === block).map((i) => Number(i.order) || 0);
      const order = (orders.length ? Math.max(...orders) : -1) + 1;
      const base: Record<string, unknown> = { page, block, order, title_ar: "", title_en: "" };
      if (ICON_BLOCK_NAMES[block]) base.icon = ICON_BLOCK_NAMES[block][0];
      const created = await createItem("sections", base) as CmsItem;
      setItems((prev) => [...prev, created]);
    } catch (e) { setErr(e instanceof Error ? e.message : t("تعذّر الإضافة.", "Could not add.")); }
    finally { setAddingBlock(null); }
  }

  async function removeItem(it: CmsItem) {
    if (typeof window !== "undefined" && !window.confirm(t("حذف هذا العنصر نهائياً؟", "Delete this item permanently?"))) return;
    setSavingId(it.id); setErr("");
    try {
      await deleteItem("sections", it.id);
      setItems((prev) => prev.filter((x) => x.id !== it.id));
    } catch (e) { setErr(e instanceof Error ? e.message : t("تعذّر الحذف.", "Could not delete.")); }
    finally { setSavingId(null); }
  }

  // تجميع حسب القسم مع الحفاظ على الترتيب
  const blocks: { block: string; items: CmsItem[] }[] = [];
  for (const it of items) {
    const b = String(it.block ?? "");
    if (HIDDEN_BLOCKS.has(`${page}.${b}`)) continue; // بلوك انتقل تحكّمه لمكان آخر
    let g = blocks.find((x) => x.block === b);
    if (!g) { g = { block: b, items: [] }; blocks.push(g); }
    g.items.push(it);
  }
  blocks.sort((a, b) => blockRank(a.block) - blockRank(b.block));

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-line">
      <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between gap-3 px-5 py-4 text-start transition-colors hover:bg-surface/60">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/10 text-brand">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="7" rx="1.5" /><path d="M3 14h18M3 18h12" /></svg>
          </span>
          <div className="text-start">
            <span className="block font-bold text-ink">{t("محتوى وعناوين الصفحة", "Page content & headings")}</span>
            <span className="block text-[11px] text-ink-soft">{t("العناوين والنصوص والأرقام والصور — مرتّبة حسب ظهورها في الصفحة", "Headings, text, numbers and images — ordered by their appearance on the page")}</span>
          </div>
        </div>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`shrink-0 text-ink-soft transition-transform ${open ? "rotate-180" : ""}`}><path strokeLinecap="round" d="M6 9l6 6 6-6" /></svg>
      </button>

      {open && (
        <div className="space-y-4 border-t border-line p-4">
          {PAGE_URL[page] && (
            <a href={PAGE_URL[page]} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-semibold text-brand transition-colors hover:bg-brand hover:text-white">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" /></svg>
              {t("عاين الصفحة", "Preview page")}
            </a>
          )}
          {err && <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">{err}</p>}
          {blocks.map((g, gi) => {
            const isOpen = openBlock[g.block] ?? false;
            return (
            <div key={g.block} className="overflow-hidden rounded-xl border border-line">
              <button onClick={() => setOpenBlock((p) => ({ ...p, [g.block]: !isOpen }))} className="flex w-full items-center justify-between gap-3 bg-surface/60 px-4 py-3 text-start transition-colors hover:bg-surface">
                <span className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand text-[11px] font-bold text-white">{gi + 1}</span>
                  <span className="text-sm font-bold text-ink">{(en ? BLOCK_LABELS_EN[g.block] : BLOCK_LABELS[g.block]) || BLOCK_LABELS[g.block] || g.block}</span>
                  <span className="text-[11px] text-ink-soft">({g.items.length})</span>
                </span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`shrink-0 text-ink-soft transition-transform ${isOpen ? "rotate-180" : ""}`}><path strokeLinecap="round" d="M6 9l6 6 6-6" /></svg>
              </button>
              {isOpen && (
              <div className="space-y-3 border-t border-line p-3">
                {BLOCK_NOTES[`${page}.${g.block}`] && (() => {
                  const bn = BLOCK_NOTES[`${page}.${g.block}`];
                  return (
                    <div className="rounded-lg border border-brand/20 bg-brand/5 px-3 py-2.5 text-[11px] leading-5 text-ink-soft">
                      ℹ️ {en ? bn.en : bn.ar}
                      {bn.previewPath && (
                        <a href={bn.previewPath} target="_blank" rel="noopener noreferrer" className="ms-1 inline-flex items-center gap-1 font-semibold text-brand hover:underline">
                          {(en ? bn.previewLabel_en : bn.previewLabel_ar) || (en ? "Preview" : "معاينة")}
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" /></svg>
                        </a>
                      )}
                    </div>
                  );
                })()}
                {g.items.map((it) => {
                  // أقسام بمحتوى منظّم معقّد — تُحرّر بالمحرّر الكامل
                  if (COMPLEX_BLOCKS.has(g.block)) {
                    return (
                      <div key={it.id} className="flex items-center justify-between gap-3 rounded-xl border border-line bg-surface/40 p-3">
                        <div className="text-start">
                          <p className="text-xs font-bold text-ink">{String(it.title_ar || it.key || "")}</p>
                          <p className="mt-0.5 text-[11px] text-ink-soft">{t("محتوى منظّم (عناوين + قائمة) — يُحرّر بالمحرّر الكامل.", "Structured content (headings + list) — edited in the full editor.")}</p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <Link href={`/cms/content/sections/${it.id}`} className="rounded-lg bg-brand/10 px-3 py-1.5 text-xs font-semibold text-brand hover:bg-brand hover:text-white">{t("فتح المحرّر ←", "Open editor →")}</Link>
                          {LIST_BLOCKS.has(g.block) && <button type="button" onClick={() => removeItem(it)} className="rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-600 hover:text-white">{t("حذف", "Delete")}</button>}
                        </div>
                      </div>
                    );
                  }
                  const key = `${g.block}.${String(it.key ?? "")}`;
                  const hasText = String(it.text_ar ?? "").trim() !== "" || String(it.text_en ?? "").trim() !== "" || ("text_ar" in (edits[it.id] || {}));
                  const hasImage = String(it.image ?? "").trim() !== "" || Boolean(it.image_file);
                  const hasTitle = String(it.title_ar ?? "").trim() !== "" || String(it.title_en ?? "").trim() !== "" || ("title_ar" in (edits[it.id] || {}));
                  const showTitle = hasTitle || !hasImage; // العناصر المخصّصة للصورة فقط لا تعرض حقل العنوان
                  const imgResolved = resolveSrc(String(it.image ?? ""));
                  const imgSrc = imgResolved && /^(https?:|\/)/.test(imgResolved) ? `${imgResolved}${imgResolved.includes("?") ? "&" : "?"}v=${bust}` : imgResolved;
                  return (
                    <div key={it.id} className="rounded-xl border border-line bg-surface/40 p-3">
                      <p className="mb-2 text-xs font-bold text-ink">{(en ? ITEM_LABELS_EN[key] : ITEM_LABELS[key]) || ITEM_LABELS[key] || String(it.title_ar || it.key || "")}</p>
                      {ITEM_NOTES[key] && <p className="mb-2 rounded-lg bg-brand/5 px-3 py-2 text-[11px] leading-5 text-ink-soft">ℹ️ {(en ? ITEM_NOTES_EN[key] : ITEM_NOTES[key]) || ITEM_NOTES[key]}</p>}
                      <div className="space-y-2">
                        {ICON_BLOCK_NAMES[g.block] && (
                          <div>
                            <p className="mb-1 text-xs font-semibold text-ink-soft">{t("الأيقونة", "Icon")}</p>
                            <div className="grid grid-cols-7 gap-1.5 rounded-xl border border-line bg-white p-2 sm:grid-cols-10">
                              {ICON_BLOCK_NAMES[g.block].map((k) => {
                                const sel = val(it, "icon") === k;
                                return (
                                  <button type="button" key={k} onClick={() => setVal(it.id, "icon", k)} title={ICON_LABELS[k] || k} className={`flex h-9 items-center justify-center rounded-lg border transition-colors ${sel ? "border-brand bg-brand/10 text-brand" : "border-line bg-white text-ink hover:border-brand/40"}`}>{CMS_ICONS[k]}</button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                        {showTitle && (
                          <div>
                            <p className="mb-1 text-xs font-semibold text-ink-soft">{(en ? FIELD_LABELS_EN[key]?.title : FIELD_LABELS[key]?.title) || t("العنوان", "Title")}</p>
                            <div className="grid gap-2 sm:grid-cols-2">
                              <input value={val(it, "title_ar")} onChange={(e) => setVal(it.id, "title_ar", e.target.value)} className={INPUT} placeholder={t("عربي", "Arabic")} />
                              <input value={val(it, "title_en")} onChange={(e) => setVal(it.id, "title_en", e.target.value)} dir="ltr" className={INPUT} placeholder="English" />
                            </div>
                          </div>
                        )}
                        {hasText && (
                          <div>
                            <p className="mb-1 text-xs font-semibold text-ink-soft">{(en ? FIELD_LABELS_EN[key]?.text : FIELD_LABELS[key]?.text) || t("النص", "Text")}</p>
                            {PARAGRAPH_KEYS.has(key) ? (
                              <ParagraphsField ar={val(it, "text_ar")} en={val(it, "text_en")} onChange={(a, e) => { setVal(it.id, "text_ar", a); setVal(it.id, "text_en", e); }} />
                            ) : (
                              <div className="grid gap-2 sm:grid-cols-2">
                                <AutoTextarea value={val(it, "text_ar")} onChange={(v) => setVal(it.id, "text_ar", v)} placeholder={t("عربي", "Arabic")} />
                                <AutoTextarea value={val(it, "text_en")} onChange={(v) => setVal(it.id, "text_en", v)} dir="ltr" placeholder="English" />
                              </div>
                            )}
                          </div>
                        )}
                        {/* «الرقم» يظهر فقط لعناصر تحمل رقماً فعلاً — لا لعنصر العنوان (main)
                            الذي هو عنوان+جملة فقط. أرقام الرئيسية تُدار من «الأرقام والإحصائيات». */}
                        {(String(it.value ?? "").trim() !== "" || (g.block === "stats" && String(it.key ?? "") !== "main")) && (
                          <div>
                            <p className="mb-1 text-xs font-semibold text-ink-soft">{t("الرقم", "Number")}</p>
                            <input value={val(it, "value")} onChange={(e) => setVal(it.id, "value", e.target.value)} dir="ltr" className={INPUT} placeholder={t("مثال: 500", "e.g. 500")} />
                          </div>
                        )}
                        {hasImage && (
                          <div>
                            <p className="mb-1 text-xs font-semibold text-ink-soft">{t("الصورة", "Image")}</p>
                            <div className="flex items-center gap-3">
                              {imgSrc && (
                                <button type="button" onClick={() => setZoom(imgSrc)} title={t("اضغط لعرض الصورة", "Click to view")} className="group relative h-16 w-24 shrink-0 overflow-hidden rounded-lg ring-1 ring-line">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img src={imgSrc} alt="" className="h-full w-full object-cover" />
                                  <span className="absolute inset-0 flex items-center justify-center text-white opacity-0 transition-all group-hover:bg-black/35 group-hover:opacity-100">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3M11 8v6M8 11h6" /></svg>
                                  </span>
                                </button>
                              )}
                              <label className="cursor-pointer rounded-lg bg-brand/10 px-3 py-2 text-xs font-semibold text-brand hover:bg-brand hover:text-white">
                                {t("تغيير الصورة", "Change image")}
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) pickImage(it, f); e.target.value = ""; }} />
                              </label>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="mt-3 flex items-center gap-3">
                        <button type="button" onClick={() => save(it)} disabled={savingId === it.id || !dirty(it.id)} className="rounded-lg bg-brand px-4 py-1.5 text-xs font-bold text-white hover:bg-brand-dark disabled:opacity-40">
                          {savingId === it.id ? t("جارٍ الحفظ…", "Saving…") : t("حفظ", "Save")}
                        </button>
                        {okId === it.id && <span className="text-xs font-semibold text-emerald-600">{t("تم الحفظ ✓", "Saved ✓")}</span>}
                        {dirty(it.id) && okId !== it.id && <span className="text-xs font-semibold text-amber-600">{t("تعديلات غير محفوظة", "Unsaved changes")}</span>}
                        {LIST_BLOCKS.has(g.block) && <button type="button" onClick={() => removeItem(it)} className="ms-auto rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-600 hover:text-white">{t("حذف", "Delete")}</button>}
                      </div>
                    </div>
                  );
                })}
                {LIST_BLOCKS.has(g.block) && (
                  <button type="button" onClick={() => addItem(g.block)} disabled={addingBlock === g.block} className="inline-flex items-center gap-1 rounded-lg bg-brand px-3.5 py-2 text-xs font-bold text-white hover:bg-brand-dark disabled:opacity-50">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" d="M12 5v14M5 12h14" /></svg>
                    {addingBlock === g.block ? t("جارٍ الإضافة…", "Adding…") : ((en ? BLOCK_ADD_EN[g.block] : BLOCK_ADD[g.block]) || BLOCK_ADD[g.block] || t("إضافة عنصر جديد", "Add new item"))}
                  </button>
                )}
              </div>
              )}
            </div>
            );
          })}
          <p className="px-1 text-[11px] text-ink-soft">{t("تلميح: في العنوان الرئيسي، ضع الجزء الذي تريده باللون المميّز بين نجمتين **هكذا**.", "Tip: in the main heading, wrap the part you want highlighted between two asterisks **like this**.")}</p>
        </div>
      )}
      {pendingImg && <ImageCropModal file={pendingImg.file} onCancel={() => setPendingImg(null)} onConfirm={(out) => onImage(pendingImg.it, out)} />}
      {zoom && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4 sm:p-8" onClick={() => setZoom("")}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={zoom} alt="" className="max-h-[90vh] max-w-[92vw] rounded-xl object-contain shadow-2xl" onClick={(e) => e.stopPropagation()} />
          <button type="button" onClick={() => setZoom("")} aria-label={t("إغلاق", "Close")} className="absolute end-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition-colors hover:bg-white/30">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>
      )}
    </div>
  );
}
