"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { listCollection, deleteItem, TYPE_LABELS, type CmsItem } from "@/lib/cms/api";

export default function CollectionList({ type }: { type: string }) {
  const router = useRouter();
  const [items, setItems] = useState<CmsItem[]>([]);
  const [titleField, setTitleField] = useState("title_ar");
  const [readonly, setReadonly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<number | null>(null);

  const label = TYPE_LABELS[type] || type;

  function load() {
    setLoading(true);
    listCollection(type)
      .then((d) => {
        setItems(d.items);
        setTitleField(d.title_field);
        setReadonly(d.readonly);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }
  useEffect(load, [type]);

  async function onDelete(id: number) {
    if (!confirm("هل تريد حذف هذا العنصر نهائياً؟")) return;
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

  function titleOf(it: CmsItem): string {
    const v = it[titleField] ?? it["title_ar"] ?? it["name_ar"] ?? it["label_ar"] ?? `#${it.id}`;
    return String(v || `#${it.id}`);
  }
  function published(it: CmsItem): boolean | null {
    if ("published" in it) return Boolean(it.published);
    if ("is_active" in it) return Boolean(it.is_active);
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/cms" className="text-xs font-semibold text-brand hover:text-brand-dark">← لوحة التحكّم</Link>
          <h1 className="mt-1 text-2xl font-extrabold text-ink">{label}</h1>
          <p className="mt-1 text-sm text-ink-soft">{items.length} عنصر</p>
        </div>
        {!readonly && (
          <Link
            href={`/cms/content/${type}/new`}
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-brand-dark"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" d="M12 5v14M5 12h14" /></svg>
            إضافة جديد
          </Link>
        )}
      </div>

      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
      {loading ? (
        <p className="text-ink-soft">جارٍ التحميل…</p>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-white p-10 text-center text-ink-soft">
          لا توجد عناصر بعد. {!readonly && "اضغط «إضافة جديد» للبدء."}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-line">
          <table className="w-full text-right text-sm">
            <thead className="bg-surface text-xs font-semibold text-ink-soft">
              <tr>
                <th className="px-5 py-3">العنوان</th>
                <th className="px-5 py-3 w-28">الحالة</th>
                <th className="px-5 py-3 w-32"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {items.map((it) => {
                const pub = published(it);
                return (
                  <tr key={it.id} className="transition-colors hover:bg-surface/60">
                    <td className="px-5 py-3.5 font-semibold text-ink">{titleOf(it)}</td>
                    <td className="px-5 py-3.5">
                      {pub === null ? (
                        <span className="text-ink-soft">—</span>
                      ) : pub ? (
                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">منشور</span>
                      ) : (
                        <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">مخفي</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => router.push(`/cms/content/${type}/${it.id}`)}
                          className="rounded-lg bg-brand/10 px-3 py-1.5 text-xs font-semibold text-brand transition-colors hover:bg-brand hover:text-white"
                        >
                          تعديل
                        </button>
                        {!readonly && (
                          <button
                            onClick={() => onDelete(it.id)}
                            disabled={busy === it.id}
                            className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-600 hover:text-white disabled:opacity-50"
                          >
                            {busy === it.id ? "…" : "حذف"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
