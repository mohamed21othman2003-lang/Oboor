"use client";

import { useEffect, useState } from "react";
import { listCollection, updateItem, uploadField, type CmsItem } from "@/lib/cms/api";

// أسماء ودّية لأقسام رأس الصفحة وعناصرها
const BLOCK_LABELS: Record<string, string> = {
  hero: "المقدمة العلوية (الهيرو)",
  list: "ترويسة القائمة",
  cities: "المدن (فلاتر البحث)",
  employment_types: "أنواع الدوام (فلاتر البحث)",
};
const ITEM_LABELS: Record<string, string> = {
  "hero.badge": "الوسم العلوي",
  "hero.heading": "العنوان + الوصف + الصورة",
  "hero.stat": "الشارة العائمة (العدّاد)",
  "list.header": "ترويسة قائمة الوظائف",
};

const INPUT = "w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20";

function resolveSrc(s: string): string {
  if (!s) return "";
  if (/^(https?:|data:|blob:|\/)/.test(s)) return s;
  return "/" + s.replace(/^\/+/, "");
}

export default function PageChrome({ page }: { page: string }) {
  const [items, setItems] = useState<CmsItem[]>([]);
  const [edits, setEdits] = useState<Record<number, Record<string, string>>>({});
  const [open, setOpen] = useState(false);
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
      for (const k of ["title_ar", "title_en", "text_ar", "text_en"]) if (k in e) payload[k] = e[k];
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

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-line">
      <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between gap-3 px-5 py-4 text-right transition-colors hover:bg-surface/60">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/10 text-brand">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="7" rx="1.5" /><path d="M3 14h18M3 18h12" /></svg>
          </span>
          <div className="text-start">
            <span className="block font-bold text-ink">محتوى رأس الصفحة</span>
            <span className="block text-[11px] text-ink-soft">العنوان والوصف والصورة وترويسة القائمة — تظهر أعلى الصفحة</span>
          </div>
        </div>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`shrink-0 text-ink-soft transition-transform ${open ? "rotate-180" : ""}`}><path strokeLinecap="round" d="M6 9l6 6 6-6" /></svg>
      </button>

      {open && (
        <div className="space-y-4 border-t border-line p-4">
          {err && <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">{err}</p>}
          {blocks.map((g) => (
            <div key={g.block}>
              <p className="mb-2 px-1 text-xs font-bold text-brand-dark">{BLOCK_LABELS[g.block] || g.block}</p>
              <div className="space-y-3">
                {g.items.map((it) => {
                  const key = `${g.block}.${String(it.key ?? "")}`;
                  const hasText = String(it.text_ar ?? "").trim() !== "" || String(it.text_en ?? "").trim() !== "" || ("text_ar" in (edits[it.id] || {}));
                  const hasImage = String(it.image ?? "").trim() !== "" || Boolean(it.image_file);
                  const imgSrc = resolveSrc(String(it.image ?? ""));
                  return (
                    <div key={it.id} className="rounded-xl border border-line bg-surface/40 p-3">
                      <p className="mb-2 text-xs font-bold text-ink">{ITEM_LABELS[key] || String(it.title_ar || it.key || "")}</p>
                      <div className="space-y-2">
                        <div>
                          <p className="mb-1 text-xs font-semibold text-ink-soft">العنوان</p>
                          <div className="grid gap-2 sm:grid-cols-2">
                            <input value={val(it, "title_ar")} onChange={(e) => setVal(it.id, "title_ar", e.target.value)} className={INPUT} placeholder="عربي" />
                            <input value={val(it, "title_en")} onChange={(e) => setVal(it.id, "title_en", e.target.value)} dir="ltr" className={INPUT} placeholder="English" />
                          </div>
                        </div>
                        {hasText && (
                          <div>
                            <p className="mb-1 text-xs font-semibold text-ink-soft">النص</p>
                            <div className="grid gap-2 sm:grid-cols-2">
                              <textarea value={val(it, "text_ar")} onChange={(e) => setVal(it.id, "text_ar", e.target.value)} rows={3} className={INPUT} placeholder="عربي" />
                              <textarea value={val(it, "text_en")} onChange={(e) => setVal(it.id, "text_en", e.target.value)} dir="ltr" rows={3} className={INPUT} placeholder="English" />
                            </div>
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
            </div>
          ))}
          <p className="px-1 text-[11px] text-ink-soft">تلميح: في العنوان الرئيسي، ضع الجزء الذي تريده باللون المميّز بين نجمتين **هكذا**.</p>
        </div>
      )}
    </div>
  );
}
