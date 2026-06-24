"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listCollection, getSchema, deleteItem, TYPE_LABELS, type CmsItem, type FieldSchema } from "@/lib/cms/api";

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

  function val(it: CmsItem, name: string): string {
    const v = it[name];
    if (v === null || v === undefined || v === "") return "";
    return String(v);
  }
  function primary(it: CmsItem): string {
    return val(it, "name") || val(it, "child_name") || val(it, "email") || `#${it.id}`;
  }
  function when(it: CmsItem): string {
    const v = it["created_at"];
    if (!v) return "";
    try { return new Date(String(v)).toLocaleString("ar-EG", { dateStyle: "medium", timeStyle: "short" }); }
    catch { return String(v); }
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/cms" className="text-xs font-semibold text-brand hover:text-brand-dark">← لوحة التحكّم</Link>
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
            return (
              <div key={it.id} className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-line">
                <button onClick={() => setOpen(isOpen ? null : it.id)} className="flex w-full items-center justify-between gap-3 px-5 py-4 text-right transition-colors hover:bg-surface/60">
                  <div className="min-w-0">
                    <p className="truncate font-bold text-ink">{primary(it)}</p>
                    {when(it) && <p className="mt-0.5 text-xs text-ink-soft">{when(it)}</p>}
                  </div>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`shrink-0 text-ink-soft transition-transform ${isOpen ? "rotate-180" : ""}`}><path strokeLinecap="round" d="M6 9l6 6 6-6" /></svg>
                </button>
                {isOpen && (
                  <div className="border-t border-line bg-surface/40 px-5 py-4">
                    <dl className="grid gap-3 sm:grid-cols-2">
                      {fields.map((f) => {
                        const v = val(it, f.name);
                        if (!v) return null;
                        const isLink = f.type === "image" && v.startsWith("http");
                        return (
                          <div key={f.name} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
                            <dt className="text-xs font-semibold text-ink-soft">{f.label}</dt>
                            <dd className="mt-0.5 text-sm text-ink whitespace-pre-wrap break-words">
                              {isLink ? <a href={v} target="_blank" rel="noopener" className="font-semibold text-brand underline">فتح الملف ↗</a> : v}
                            </dd>
                          </div>
                        );
                      })}
                    </dl>
                    <div className="mt-4 flex justify-end">
                      <button onClick={() => onDelete(it.id)} disabled={busy === it.id} className="rounded-lg bg-red-50 px-4 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-600 hover:text-white disabled:opacity-50">
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
