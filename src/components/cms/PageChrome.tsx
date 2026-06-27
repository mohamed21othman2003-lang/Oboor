"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { listCollection, updateItem, uploadField, type CmsItem } from "@/lib/cms/api";

// ترتيب الأقسام كما تظهر على الصفحة (لعرضها مرتّبة بدل ترتيب قاعدة البيانات)
const BLOCK_ORDER = ["hero", "about", "smart_search", "stats", "why_us", "success", "gallery", "news", "certs", "list", "cities", "employment_types", "highlights"];
const blockRank = (b: string) => { const i = BLOCK_ORDER.indexOf(b); return i === -1 ? 999 : i; };
// أقسام محتواها منظّم معقّد ⇒ تُحرّر بالمحرّر الكامل (رابط) بدل الحقول المبسّطة
const COMPLEX_BLOCKS = new Set(["highlights"]);

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
};
const ITEM_LABELS: Record<string, string> = {
  "hero.badge": "الوسم العلوي",
  "hero.heading": "العنوان + الوصف + الصورة",
  "hero.stat": "الشارة العائمة (العدّاد)",
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
// تسميات مخصّصة لحقلَي «العنوان/النص» حسب العنصر (لتوضيح ما يمثّله كل حقل)
const FIELD_LABELS: Record<string, { title?: string; text?: string }> = {
  "hero.chrome": { title: "الوسم العلوي", text: "نص زر الإجراء" },
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
// ملاحظات توضيحية لبعض العناصر (مثل الرقم التلقائي)
const ITEM_NOTES: Record<string, string> = {
  "hero.stat": "الرقم يُحسب تلقائياً = عدد الوظائف المنشورة (يتحدّث وحده عند الإضافة أو الحذف). أنت تتحكّم فقط في «العنوان» و«النص» حوله.",
  "list.header": "الرقم يُحسب تلقائياً = عدد الوظائف المنشورة. أنت تتحكّم فقط في النصوص حوله.",
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
            <AutoTextarea value={a[i] ?? ""} onChange={(v) => setRow(i, v, e[i] ?? "")} placeholder="عربي" />
            <AutoTextarea value={e[i] ?? ""} onChange={(v) => setRow(i, a[i] ?? "", v)} dir="ltr" placeholder="English" />
          </div>
          <button type="button" onClick={() => removeRow(i)} className="mt-1 shrink-0 rounded-lg bg-red-50 px-2 py-1.5 text-[11px] font-semibold text-red-600 hover:bg-red-600 hover:text-white">حذف</button>
        </div>
      ))}
      <button type="button" onClick={add} className="inline-flex items-center gap-1 rounded-lg bg-brand/10 px-2.5 py-1 text-[11px] font-semibold text-brand hover:bg-brand hover:text-white">+ إضافة فقرة</button>
    </div>
  );
}

export default function PageChrome({ page }: { page: string }) {
  const [items, setItems] = useState<CmsItem[]>([]);
  const [edits, setEdits] = useState<Record<number, Record<string, string>>>({});
  const [open, setOpen] = useState(false);
  const [openBlock, setOpenBlock] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [okId, setOkId] = useState<number | null>(null);
  const [err, setErr] = useState("");

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
      for (const k of ["title_ar", "title_en", "text_ar", "text_en", "value"]) if (k in e) payload[k] = e[k];
      if (Object.keys(payload).length) {
        const saved = await updateItem("sections", it.id, payload) as CmsItem;
        setItems((prev) => prev.map((x) => (x.id === it.id ? saved : x)));
        setEdits((p) => { const c = { ...p }; delete c[it.id]; return c; });
      }
      setOkId(it.id);
    } catch (e) { setErr(e instanceof Error ? e.message : "تعذّر الحفظ."); }
    finally { setSavingId(null); }
  }

  async function onImage(it: CmsItem, file: File) {
    if (file.size > 5 * 1024 * 1024) { setErr("الحد الأقصى 5 ميجابايت."); return; }
    setSavingId(it.id); setErr(""); setOkId(null);
    try {
      const saved = await uploadField("sections", it.id, "image_file", file) as CmsItem;
      setItems((prev) => prev.map((x) => (x.id === it.id ? saved : x)));
      setOkId(it.id);
    } catch (e) { setErr(e instanceof Error ? e.message : "تعذّر رفع الصورة."); }
    finally { setSavingId(null); }
  }

  // تجميع حسب القسم مع الحفاظ على الترتيب
  const blocks: { block: string; items: CmsItem[] }[] = [];
  for (const it of items) {
    const b = String(it.block ?? "");
    let g = blocks.find((x) => x.block === b);
    if (!g) { g = { block: b, items: [] }; blocks.push(g); }
    g.items.push(it);
  }
  blocks.sort((a, b) => blockRank(a.block) - blockRank(b.block));

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-line">
      <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between gap-3 px-5 py-4 text-right transition-colors hover:bg-surface/60">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/10 text-brand">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="7" rx="1.5" /><path d="M3 14h18M3 18h12" /></svg>
          </span>
          <div className="text-start">
            <span className="block font-bold text-ink">محتوى وعناوين الصفحة</span>
            <span className="block text-[11px] text-ink-soft">العناوين والنصوص والأرقام والصور — مرتّبة حسب ظهورها في الصفحة</span>
          </div>
        </div>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`shrink-0 text-ink-soft transition-transform ${open ? "rotate-180" : ""}`}><path strokeLinecap="round" d="M6 9l6 6 6-6" /></svg>
      </button>

      {open && (
        <div className="space-y-4 border-t border-line p-4">
          {err && <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">{err}</p>}
          {blocks.map((g, gi) => {
            const isOpen = openBlock[g.block] ?? false;
            return (
            <div key={g.block} className="overflow-hidden rounded-xl border border-line">
              <button onClick={() => setOpenBlock((p) => ({ ...p, [g.block]: !isOpen }))} className="flex w-full items-center justify-between gap-3 bg-surface/60 px-4 py-3 text-right transition-colors hover:bg-surface">
                <span className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand text-[11px] font-bold text-white">{gi + 1}</span>
                  <span className="text-sm font-bold text-ink">{BLOCK_LABELS[g.block] || g.block}</span>
                  <span className="text-[11px] text-ink-soft">({g.items.length})</span>
                </span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`shrink-0 text-ink-soft transition-transform ${isOpen ? "rotate-180" : ""}`}><path strokeLinecap="round" d="M6 9l6 6 6-6" /></svg>
              </button>
              {isOpen && (
              <div className="space-y-3 border-t border-line p-3">
                {g.items.map((it) => {
                  // أقسام بمحتوى منظّم معقّد — تُحرّر بالمحرّر الكامل
                  if (COMPLEX_BLOCKS.has(g.block)) {
                    return (
                      <div key={it.id} className="flex items-center justify-between gap-3 rounded-xl border border-line bg-surface/40 p-3">
                        <div className="text-start">
                          <p className="text-xs font-bold text-ink">{String(it.title_ar || it.key || "")}</p>
                          <p className="mt-0.5 text-[11px] text-ink-soft">محتوى منظّم (عناوين + قائمة) — يُحرّر بالمحرّر الكامل.</p>
                        </div>
                        <Link href={`/cms/content/sections/${it.id}`} className="shrink-0 rounded-lg bg-brand/10 px-3 py-1.5 text-xs font-semibold text-brand hover:bg-brand hover:text-white">فتح المحرّر ←</Link>
                      </div>
                    );
                  }
                  const key = `${g.block}.${String(it.key ?? "")}`;
                  const hasText = String(it.text_ar ?? "").trim() !== "" || String(it.text_en ?? "").trim() !== "" || ("text_ar" in (edits[it.id] || {}));
                  const hasImage = String(it.image ?? "").trim() !== "" || Boolean(it.image_file);
                  const hasTitle = String(it.title_ar ?? "").trim() !== "" || String(it.title_en ?? "").trim() !== "" || ("title_ar" in (edits[it.id] || {}));
                  const showTitle = hasTitle || !hasImage; // العناصر المخصّصة للصورة فقط لا تعرض حقل العنوان
                  const imgSrc = resolveSrc(String(it.image ?? ""));
                  return (
                    <div key={it.id} className="rounded-xl border border-line bg-surface/40 p-3">
                      <p className="mb-2 text-xs font-bold text-ink">{ITEM_LABELS[key] || String(it.title_ar || it.key || "")}</p>
                      {ITEM_NOTES[key] && <p className="mb-2 rounded-lg bg-brand/5 px-3 py-2 text-[11px] leading-5 text-ink-soft">ℹ️ {ITEM_NOTES[key]}</p>}
                      <div className="space-y-2">
                        {showTitle && (
                          <div>
                            <p className="mb-1 text-xs font-semibold text-ink-soft">{FIELD_LABELS[key]?.title || "العنوان"}</p>
                            <div className="grid gap-2 sm:grid-cols-2">
                              <input value={val(it, "title_ar")} onChange={(e) => setVal(it.id, "title_ar", e.target.value)} className={INPUT} placeholder="عربي" />
                              <input value={val(it, "title_en")} onChange={(e) => setVal(it.id, "title_en", e.target.value)} dir="ltr" className={INPUT} placeholder="English" />
                            </div>
                          </div>
                        )}
                        {hasText && (
                          <div>
                            <p className="mb-1 text-xs font-semibold text-ink-soft">{FIELD_LABELS[key]?.text || "النص"}</p>
                            {PARAGRAPH_KEYS.has(key) ? (
                              <ParagraphsField ar={val(it, "text_ar")} en={val(it, "text_en")} onChange={(a, e) => { setVal(it.id, "text_ar", a); setVal(it.id, "text_en", e); }} />
                            ) : (
                              <div className="grid gap-2 sm:grid-cols-2">
                                <AutoTextarea value={val(it, "text_ar")} onChange={(v) => setVal(it.id, "text_ar", v)} placeholder="عربي" />
                                <AutoTextarea value={val(it, "text_en")} onChange={(v) => setVal(it.id, "text_en", v)} dir="ltr" placeholder="English" />
                              </div>
                            )}
                          </div>
                        )}
                        {(String(it.value ?? "").trim() !== "" || g.block === "stats") && (
                          <div>
                            <p className="mb-1 text-xs font-semibold text-ink-soft">الرقم</p>
                            <input value={val(it, "value")} onChange={(e) => setVal(it.id, "value", e.target.value)} dir="ltr" className={INPUT} placeholder="مثال: 500" />
                          </div>
                        )}
                        {hasImage && (
                          <div>
                            <p className="mb-1 text-xs font-semibold text-ink-soft">الصورة</p>
                            <div className="flex items-center gap-3">
                              {imgSrc && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={imgSrc} alt="" className="h-16 w-24 shrink-0 rounded-lg object-cover ring-1 ring-line" />
                              )}
                              <label className="cursor-pointer rounded-lg bg-brand/10 px-3 py-2 text-xs font-semibold text-brand hover:bg-brand hover:text-white">
                                تغيير الصورة
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onImage(it, f); e.target.value = ""; }} />
                              </label>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="mt-3 flex items-center gap-3">
                        <button type="button" onClick={() => save(it)} disabled={savingId === it.id || !dirty(it.id)} className="rounded-lg bg-brand px-4 py-1.5 text-xs font-bold text-white hover:bg-brand-dark disabled:opacity-40">
                          {savingId === it.id ? "جارٍ الحفظ…" : "حفظ"}
                        </button>
                        {okId === it.id && <span className="text-xs font-semibold text-emerald-600">تم الحفظ ✓</span>}
                        {dirty(it.id) && okId !== it.id && <span className="text-xs font-semibold text-amber-600">تعديلات غير محفوظة</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
              )}
            </div>
            );
          })}
          <p className="px-1 text-[11px] text-ink-soft">تلميح: في العنوان الرئيسي، ضع الجزء الذي تريده باللون المميّز بين نجمتين **هكذا**.</p>
        </div>
      )}
    </div>
  );
}
