"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getSchema, getItem, createItem, updateItem, uploadField,
  TYPE_LABELS, type FieldSchema, type CmsItem,
} from "@/lib/cms/api";

export default function CollectionEditor({ type, id }: { type: string; id: string }) {
  const router = useRouter();
  const isNew = id === "new";
  const [fields, setFields] = useState<FieldSchema[]>([]);
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [readonly, setReadonly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  const label = TYPE_LABELS[type] || type;

  useEffect(() => {
    setLoading(true);
    const tasks: Promise<unknown>[] = [
      getSchema(type).then((s) => { setFields(s.fields); setReadonly(s.readonly); }),
    ];
    if (!isNew) tasks.push(getItem(type, id).then((it) => setValues(it as Record<string, unknown>)));
    Promise.all(tasks).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, [type, id, isNew]);

  function set(name: string, v: unknown) {
    setValues((prev) => ({ ...prev, [name]: v }));
    setOk("");
  }

  // تجميع الحقول: أزواج عربي/إنجليزي في صف واحد، الباقي مفرد
  const rows = useMemo(() => {
    const out: { kind: "pair" | "single"; ar?: FieldSchema; en?: FieldSchema; f?: FieldSchema }[] = [];
    const done = new Set<string>();
    for (const f of fields) {
      if (done.has(f.name)) continue;
      if (f.bilingual) {
        const ar = fields.find((x) => x.base === f.base && x.lang === "ar");
        const en = fields.find((x) => x.base === f.base && x.lang === "en");
        if (ar) done.add(ar.name);
        if (en) done.add(en.name);
        out.push({ kind: "pair", ar, en });
      } else {
        out.push({ kind: "single", f });
      }
    }
    return out;
  }, [fields]);

  async function onSave() {
    setSaving(true);
    setError("");
    setOk("");
    try {
      // ابنِ الحمولة (استبعد حقول الصور — تُرفع منفصلة)
      const payload: Record<string, unknown> = {};
      for (const f of fields) {
        if (f.type === "image") continue;
        let v = values[f.name];
        if (f.type === "json" && typeof v === "string") {
          try { v = v.trim() ? JSON.parse(v) : (f.required ? [] : null); }
          catch { throw new Error(`القيمة في «${f.label}» ليست JSON صحيحة.`); }
        }
        if (v !== undefined) payload[f.name] = v;
      }
      const saved = isNew ? await createItem(type, payload) : await updateItem(type, id, payload);
      setValues(saved as Record<string, unknown>);
      setOk("تم الحفظ بنجاح ✓");
      if (isNew) router.replace(`/cms/content/${type}/${(saved as CmsItem).id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "تعذّر الحفظ.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-ink-soft">جارٍ التحميل…</p>;

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-24">
      <div>
        <Link href={`/cms/content/${type}`} className="text-xs font-semibold text-brand hover:text-brand-dark">← {label}</Link>
        <h1 className="mt-1 text-2xl font-extrabold text-ink">{isNew ? `إضافة ${label}` : `تعديل: ${label}`}</h1>
      </div>

      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

      <div className="space-y-5 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-line">
        {rows.map((row, i) => {
          if (row.kind === "pair") {
            return (
              <div key={i} className="grid gap-4 sm:grid-cols-2">
                {row.ar && <FieldInput f={row.ar} value={values[row.ar.name]} onChange={(v) => set(row.ar!.name, v)} badge="عربي" />}
                {row.en && <FieldInput f={row.en} value={values[row.en.name]} onChange={(v) => set(row.en!.name, v)} badge="English" dir="ltr" />}
              </div>
            );
          }
          const f = row.f!;
          if (f.type === "image") {
            return <ImageInput key={i} f={f} value={values[f.name]} type={type} id={id} isNew={isNew} onUploaded={(it) => setValues(it as Record<string, unknown>)} />;
          }
          return <FieldInput key={i} f={f} value={values[f.name]} onChange={(v) => set(f.name, v)} />;
        })}
      </div>

      {/* شريط الحفظ */}
      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-line bg-white/95 px-6 py-3 backdrop-blur lg:right-72">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3">
          <span className="text-sm font-semibold text-emerald-600">{ok}</span>
          <div className="flex items-center gap-2">
            <Link href={`/cms/content/${type}`} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-ink-soft hover:bg-surface">إلغاء</Link>
            <button
              onClick={onSave}
              disabled={saving}
              className="rounded-xl bg-brand px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-brand-dark disabled:opacity-60"
            >
              {saving ? "جارٍ الحفظ…" : "حفظ"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Label({ f, badge }: { f: FieldSchema; badge?: string }) {
  return (
    <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-ink">
      {f.label}
      {f.required && <span className="text-red-500">*</span>}
      {badge && <span className="rounded bg-surface px-1.5 py-0.5 text-[10px] font-bold text-ink-soft">{badge}</span>}
    </label>
  );
}

const INPUT = "w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20";

function FieldInput({ f, value, onChange, badge, dir }: { f: FieldSchema; value: unknown; onChange: (v: unknown) => void; badge?: string; dir?: string }) {
  if (f.type === "bool") {
    return (
      <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3">
        <input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} className="h-5 w-5 accent-brand" />
        <span className="text-sm font-semibold text-ink">{f.label}</span>
      </label>
    );
  }
  return (
    <div>
      <Label f={f} badge={badge} />
      {f.type === "textarea" ? (
        <textarea value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} rows={4} dir={dir} className={INPUT} />
      ) : f.type === "json" ? (
        <textarea
          value={typeof value === "string" ? value : JSON.stringify(value ?? [], null, 2)}
          onChange={(e) => onChange(e.target.value)}
          rows={6}
          dir="ltr"
          className={`${INPUT} font-mono text-xs`}
          placeholder='["عنصر ١", "عنصر ٢"]'
        />
      ) : f.type === "select" ? (
        <select value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} className={INPUT}>
          <option value="">— اختر —</option>
          {f.choices?.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      ) : f.type === "number" ? (
        <input type="number" value={value === null || value === undefined ? "" : String(value)} onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))} className={INPUT} />
      ) : (
        <input type="text" value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} dir={dir} className={INPUT} />
      )}
      {f.type === "json" && <p className="mt-1 text-[11px] text-ink-soft">قائمة بصيغة JSON (نص بين علامتي تنصيص، عناصر مفصولة بفاصلة).</p>}
    </div>
  );
}

function ImageInput({ f, value, type, id, isNew, onUploaded }: { f: FieldSchema; value: unknown; type: string; id: string; isNew: boolean; onUploaded: (it: CmsItem) => void }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const url = typeof value === "string" ? value : "";

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setErr("الحد الأقصى 5 ميجابايت."); return; }
    setErr("");
    setBusy(true);
    try {
      const saved = await uploadField(type, id, f.name, file);
      onUploaded(saved);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "تعذّر الرفع.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <Label f={f} />
      {isNew ? (
        <p className="rounded-xl border border-dashed border-line bg-surface px-4 py-3 text-sm text-ink-soft">احفظ العنصر أولاً ثم ارفع الصورة.</p>
      ) : (
        <div className="flex items-center gap-4">
          {url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="" className="h-20 w-20 rounded-xl object-cover ring-1 ring-line" />
          )}
          <label className="cursor-pointer rounded-xl bg-brand/10 px-4 py-2.5 text-sm font-semibold text-brand transition-colors hover:bg-brand hover:text-white">
            {busy ? "جارٍ الرفع…" : url ? "تغيير الصورة" : "رفع صورة"}
            <input type="file" accept="image/*" onChange={onFile} disabled={busy} className="hidden" />
          </label>
        </div>
      )}
      {err && <p className="mt-1 text-xs text-red-600">{err}</p>}
    </div>
  );
}
