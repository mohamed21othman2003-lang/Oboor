"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listCollection, getSchema, deleteItem, TYPE_LABELS, type CmsItem, type FieldSchema } from "@/lib/cms/api";

const isArabic = (v: string) => /[؀-ۿ]/.test(v);

function Ic({ d }: { d: React.ReactNode }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">{d}</svg>;
}
const FIELD_ICONS: Record<string, React.ReactNode> = {
  phone: <Ic d={<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.8 2z" />} />,
  email: <Ic d={<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>} />,
  branch: <Ic d={<><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></>} />,
  city: <Ic d={<><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></>} />,
  type: <Ic d={<><path d="M20.6 13.4 12 22l-9-9V3h10z" /><circle cx="7.5" cy="7.5" r="1.5" /></>} />,
  case_type: <Ic d={<><path d="M20.6 13.4 12 22l-9-9V3h10z" /><circle cx="7.5" cy="7.5" r="1.5" /></>} />,
  user: <Ic d={<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>} />,
  age: <Ic d={<><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>} />,
  message: <Ic d={<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />} />,
  file: <Ic d={<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></>} />,
};
function iconFor(name: string, type: string): React.ReactNode {
  if (type === "image") return FIELD_ICONS.file;
  if (type === "textarea") return FIELD_ICONS.message;
  if (name.includes("phone") || name.includes("whatsapp")) return FIELD_ICONS.phone;
  if (name.includes("email")) return FIELD_ICONS.email;
  if (name.includes("branch")) return FIELD_ICONS.branch;
  if (name.includes("city")) return FIELD_ICONS.city;
  if (name.includes("type")) return FIELD_ICONS.type;
  if (name.includes("age")) return FIELD_ICONS.age;
  if (name.includes("name")) return FIELD_ICONS.user;
  return FIELD_ICONS.user;
}

export default function SubmissionsList({ type }: { type: string }) {
  const [items, setItems] = useState<CmsItem[]>([]);
  const [fields, setFields] = useState<FieldSchema[]>([]);
  const [open, setOpen] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<number | null>(null);

  const label = TYPE_LABELS[type] || type;

  useEffect(() => {
    setLoading(true);
    Promise.all([listCollection(type), getSchema(type)])
      .then(([l, s]) => { setItems(l.items); setFields(s.fields); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [type]);

  async function onDelete(id: number) {
    if (!confirm("حذف هذا الطلب نهائياً؟")) return;
    setBusy(id);
    try {
      await deleteItem(type, id);
      setItems((prev) => prev.filter((it) => it.id !== id));
    } catch (e) {
      alert(e instanceof Error ? e.message : "تعذّر الحذف.");
    } finally {
      setBusy(null);
    }
  }

  const val = (it: CmsItem, name: string) => {
    const v = it[name];
    return v === null || v === undefined ? "" : String(v);
  };
  const primary = (it: CmsItem) => val(it, "name") || val(it, "child_name") || val(it, "email") || `#${it.id}`;
  const when = (it: CmsItem) => {
    const v = it["created_at"];
    if (!v) return "";
    try { return new Date(String(v)).toLocaleString("ar-EG", { dateStyle: "medium", timeStyle: "short" }); }
    catch { return String(v); }
  };

  return (
    <div className="space-y-6">
      <div>
        <Link href="/cms" className="text-xs font-semibold text-[#0F6C73] hover:text-[#1FA6A8]">← لوحة التحكّم</Link>
        <h1 className="mt-1 text-2xl font-extrabold text-ink">{label}</h1>
        <p className="mt-1 text-sm text-ink-soft">{items.length} طلب</p>
      </div>

      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
      {loading ? (
        <p className="text-ink-soft">جارٍ التحميل…</p>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-white p-10 text-center text-ink-soft">لا توجد طلبات بعد.</div>
      ) : (
        <div className="space-y-3">
          {items.map((it) => {
            const isOpen = open === it.id;
            const phone = val(it, "phone");
            const email = val(it, "email");
            const wa = phone.replace(/[^\d]/g, "");
            // الحقول من نوع JSON (مثل «الإجابات») تُعرض بشكل خاص أسفل، لا كنص خام
            const shown = fields.filter((f) => f.type !== "json" && val(it, f.name).trim() !== "");
            const boxes = shown.filter((f) => f.type === "textarea");
            const rows = shown.filter((f) => f.type !== "textarea");
            const answers = Array.isArray(it.answers)
              ? (it.answers as Array<Record<string, unknown>>).map((qa) => ({
                  q: String(qa.q ?? qa.question ?? ""),
                  a: String(qa.a ?? qa.answer ?? ""),
                }))
              : [];
            return (
              <div key={it.id} className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-line transition-shadow hover:shadow-md">
                {/* Header */}
                <button onClick={() => setOpen(isOpen ? null : it.id)} className="flex w-full items-center gap-3 px-5 py-4 text-right transition-colors hover:bg-surface/50">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1FA6A8]/12 text-base font-extrabold text-[#0F6C73]">{primary(it).charAt(0)}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-ink">{primary(it)}</p>
                    {when(it) && <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-soft"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" strokeLinecap="round" /></svg>{when(it)}</p>}
                  </div>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`shrink-0 text-ink-soft transition-transform ${isOpen ? "rotate-180" : ""}`}><path strokeLinecap="round" d="M6 9l6 6 6-6" /></svg>
                </button>

                {isOpen && (
                  <div className="border-t border-line bg-surface/40 px-5 py-5">
                    {/* أزرار تواصل سريعة */}
                    {(phone || email) && (
                      <div className="mb-4 flex flex-wrap gap-2">
                        {phone && <a href={`tel:${phone}`} className="inline-flex items-center gap-1.5 rounded-xl bg-[#1FA6A8] px-3.5 py-2 text-xs font-bold text-white transition-colors hover:bg-[#0F6C73]"><span className="h-4 w-4">{FIELD_ICONS.phone}</span>اتصال</a>}
                        {wa && <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 rounded-xl bg-[#25D366] px-3.5 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90"><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.5A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.7-.1-.4-.1-.9-.3-1.6-.6-2.7-1.2-4.5-4-4.6-4.2-.1-.2-1.1-1.5-1.1-2.8s.7-2 .9-2.2c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.1.1.3 0 .5l-.4.5-.3.3c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.6-.1l.7-.9c.2-.2.4-.2.6-.1l1.8.9c.2.1.4.2.5.3.1.2.1.7-.1 1.1z" /></svg>واتساب</a>}
                        {email && <a href={`mailto:${email}`} className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-xs font-bold text-[#0F6C73] ring-1 ring-line transition-colors hover:bg-[#1FA6A8]/10"><span className="h-4 w-4">{FIELD_ICONS.email}</span>إيميل</a>}
                      </div>
                    )}

                    {/* الحقول */}
                    <div className="grid gap-2.5 sm:grid-cols-2">
                      {rows.map((f) => {
                        const v = val(it, f.name);
                        const isLink = f.type === "image" && v.startsWith("http");
                        const isEmail = f.name.includes("email") && v.includes("@");
                        const isPhone = (f.name.includes("phone") || f.name.includes("whatsapp")) && v.trim() !== "";
                        const linkCls = "font-bold text-[#0F6C73] underline decoration-[#1FA6A8]/40 underline-offset-2 hover:text-[#1FA6A8]";
                        return (
                          <div key={f.name} className="flex items-start gap-3 rounded-xl bg-white p-3 ring-1 ring-line">
                            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#1FA6A8]/10 text-[#1FA6A8]">{iconFor(f.name, f.type)}</span>
                            <div className="min-w-0">
                              <p className="text-[11px] font-semibold text-ink-soft">{f.label}</p>
                              <p className="mt-0.5 text-sm font-medium text-ink break-words">
                                {isLink ? <a href={v} target="_blank" rel="noopener" className="font-bold text-[#1FA6A8] underline">فتح الملف ↗</a>
                                  : isEmail ? <a href={`mailto:${v}`} dir="ltr" className={`inline-block ${linkCls}`}>{v}</a>
                                  : isPhone ? <a href={`tel:${v.replace(/\s+/g, "")}`} dir="ltr" className={`inline-block ${linkCls}`}>{v}</a>
                                  : <span dir={isArabic(v) ? undefined : "ltr"} className="inline-block">{v}</span>}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* الإجابات (التقييم): كل سؤال وإجابة المتقدّم عليه */}
                    {answers.length > 0 && (
                      <div className="mt-3 rounded-xl bg-white p-4 ring-1 ring-line">
                        <p className="mb-3 flex items-center gap-1.5 text-[11px] font-semibold text-ink-soft">
                          <span className="text-[#1FA6A8]">{FIELD_ICONS.message}</span>
                          الإجابات ({answers.length})
                        </p>
                        <ol className="space-y-2.5">
                          {answers.map((qa, i) => (
                            <li key={i} className="rounded-lg bg-surface/60 p-3">
                              <p className="text-sm font-semibold leading-6 text-ink">{i + 1}. {qa.q}</p>
                              <p className="mt-1 flex items-center gap-1.5 text-sm font-bold text-[#0F6C73]">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M20 6L9 17l-5-5" /></svg>
                                {qa.a || "—"}
                              </p>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {/* الرسائل / الملاحظات */}
                    {boxes.map((f) => (
                      <div key={f.name} className="mt-3 rounded-xl bg-white p-4 ring-1 ring-line">
                        <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold text-ink-soft"><span className="text-[#1FA6A8]">{FIELD_ICONS.message}</span>{f.label}</p>
                        <p className="text-sm leading-relaxed text-ink whitespace-pre-wrap break-words">{val(it, f.name)}</p>
                      </div>
                    ))}

                    <div className="mt-4 flex justify-end">
                      <button onClick={() => onDelete(it.id)} disabled={busy === it.id} className="inline-flex items-center gap-1.5 rounded-xl bg-red-50 px-4 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-600 hover:text-white disabled:opacity-50">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                        {busy === it.id ? "…" : "حذف الطلب"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
