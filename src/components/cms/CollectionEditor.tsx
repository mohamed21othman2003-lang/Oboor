"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getSchema, getItem, createItem, updateItem, uploadField, resetDefault,
  TYPE_LABELS, type FieldSchema, type CmsItem,
} from "@/lib/cms/api";
import { CMS_ICONS, ICON_LABELS, iconNamesFor } from "@/lib/cms/icons";

export default function CollectionEditor({ type, id }: { type: string; id: string }) {
  const router = useRouter();
  const isNew = id === "new";
  const [fields, setFields] = useState<FieldSchema[]>([]);
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [baseline, setBaseline] = useState<Record<string, unknown>>({});
  const [hasDefault, setHasDefault] = useState(false);
  const [readonly, setReadonly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  const label = TYPE_LABELS[type] || type;

  useEffect(() => {
    setLoading(true);
    const tasks: Promise<unknown>[] = [
      getSchema(type).then((s) => { setFields(s.fields); setReadonly(s.readonly); }),
    ];
    if (!isNew) tasks.push(getItem(type, id).then((it) => {
      const v = it as Record<string, unknown>;
      setValues(v);
      setBaseline(v);
      setHasDefault(Boolean(v._has_default));
    }));
    Promise.all(tasks).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, [type, id, isNew]);

  function set(name: string, v: unknown) {
    setValues((prev) => ({ ...prev, [name]: v }));
    setOk("");
  }

  // مقارنة التعديلات بآخر نسخة محفوظة (على مستوى الحقول)
  const dirty = useMemo(() => {
    for (const f of fields) {
      if (f.type === "image") continue;
      const a = JSON.stringify(values[f.name] ?? null);
      const b = JSON.stringify(baseline[f.name] ?? null);
      if (a !== b) return true;
    }
    return false;
  }, [fields, values, baseline]);

  // نسبة الاكتمال = الحقول الإلزامية (المعلَّمة بنجمة) فقط
  const isEmpty = (v: unknown) => v === null || v === undefined || v === "" || (Array.isArray(v) && v.length === 0);
  const required = useMemo(() => fields.filter((f) => f.required && f.type !== "image"), [fields]);
  const completion = useMemo(() => {
    if (!required.length) return 100;
    const filled = required.filter((f) => !isEmpty(values[f.name])).length;
    return Math.round((filled / required.length) * 100);
  }, [required, values]);
  const missing = useMemo(() => required.filter((f) => isEmpty(values[f.name])).map((f) => f.label), [required, values]);

  function discard() {
    if (!dirty) return;
    if (!confirm("تجاهل كل التعديلات غير المحفوظة والرجوع لآخر نسخة محفوظة؟")) return;
    setValues(baseline);
    setError("");
    setOk("");
  }

  async function onResetDefault() {
    if (!confirm("استرجاع النسخة الافتراضية الأصلية؟ سيُستبدل المحتوى الحالي بالكامل.")) return;
    setResetting(true);
    setError("");
    setOk("");
    try {
      const restored = await resetDefault(type, id);
      const v = restored as Record<string, unknown>;
      setValues(v);
      setBaseline(v);
      setOk("تم استرجاع النسخة الافتراضية ✓");
    } catch (e) {
      setError(e instanceof Error ? e.message : "تعذّر الاسترجاع.");
    } finally {
      setResetting(false);
    }
  }

  // تجميع الحقول: أزواج عربي/إنجليزي في صف واحد، الباقي مفرد
  type Row = { kind: "pair" | "single"; ar?: FieldSchema; en?: FieldSchema; f?: FieldSchema; advanced: boolean };
  const rows = useMemo(() => {
    const out: Row[] = [];
    const done = new Set<string>();
    for (const f of fields) {
      if (done.has(f.name)) continue;
      if (f.bilingual) {
        const ar = fields.find((x) => x.base === f.base && x.lang === "ar");
        const en = fields.find((x) => x.base === f.base && x.lang === "en");
        if (ar) done.add(ar.name);
        if (en) done.add(en.name);
        out.push({ kind: "pair", ar, en, advanced: Boolean(ar?.advanced && en?.advanced) });
      } else {
        out.push({ kind: "single", f, advanced: Boolean(f.advanced) });
      }
    }
    return out;
  }, [fields]);
  const mainRows = rows.filter((r) => !r.advanced);
  const advancedRows = rows.filter((r) => r.advanced);
  const [advOpen, setAdvOpen] = useState(false);

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
        if (f.type === "json") {
          if (typeof v === "string") {
            try { v = v.trim() ? JSON.parse(v) : (f.required ? [] : null); }
            catch { throw new Error(`القيمة في «${f.label}» ليست JSON صحيحة.`); }
          }
          // أزل عناصر القوائم الفارغة
          if (Array.isArray(v)) v = v.filter((x) => !(typeof x === "string" && x.trim() === ""));
        }
        if (v !== undefined) payload[f.name] = v;
      }
      const saved = isNew ? await createItem(type, payload) : await updateItem(type, id, payload);
      const v = saved as Record<string, unknown>;
      setValues(v);
      setBaseline(v);
      setOk("تم الحفظ بنجاح ✓");
      if (isNew) router.replace(`/cms/content/${type}/${(saved as CmsItem).id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "تعذّر الحفظ.");
    } finally {
      setSaving(false);
    }
  }

  function renderRow(row: Row, i: number) {
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
      return <ImageInput key={i} f={f} value={values[f.name]} type={type} id={id} isNew={isNew} onUploaded={(it) => { setValues(it as Record<string, unknown>); setBaseline(it as Record<string, unknown>); }} />;
    }
    if (f.name === "icon") {
      return (
        <div key={i}>
          <Label f={f} />
          <IconPicker value={String(values[f.name] ?? "")} onChange={(v) => set(f.name, v)} names={iconNamesFor(type)} />
          <Help text={f.help} />
        </div>
      );
    }
    return <FieldInput key={i} f={f} value={values[f.name]} onChange={(v) => set(f.name, v)} />;
  }

  if (loading) return <p className="text-ink-soft">جارٍ التحميل…</p>;

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-24">
      <div>
        <Link href={`/cms/content/${type}`} className="text-xs font-semibold text-brand hover:text-brand-dark">← {label}</Link>
        <h1 className="mt-1 text-2xl font-extrabold text-ink">{isNew ? `إضافة ${label}` : `تعديل: ${label}`}</h1>
      </div>

      {/* نسبة الاكتمال */}
      {!readonly && (
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-line">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-ink">اكتمال المحتوى</span>
            <span className={`font-extrabold ${completion === 100 ? "text-emerald-600" : "text-brand"}`}>{completion}٪</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface">
            <div className={`h-full rounded-full transition-all ${completion === 100 ? "bg-emerald-500" : "bg-brand"}`} style={{ width: `${completion}%` }} />
          </div>
          {completion < 100 && missing.length > 0 && (
            <p className="mt-2 text-xs text-ink-soft">ناقص: {missing.slice(0, 4).join("، ")}{missing.length > 4 ? ` (+${missing.length - 4})` : ""}</p>
          )}
        </div>
      )}

      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

      <div className="space-y-5 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-line">
        {mainRows.map(renderRow)}
      </div>

      {/* إعدادات متقدمة (اختيارية) */}
      {advancedRows.length > 0 && (
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-line">
          <button onClick={() => setAdvOpen((o) => !o)} className="flex w-full items-center justify-between gap-3 px-6 py-4 text-right transition-colors hover:bg-surface/60">
            <div className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ink-soft"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z" /></svg>
              <span className="font-bold text-ink">إعدادات متقدمة <span className="font-normal text-ink-soft">(اختيارية — لمستخدم متقدّم)</span></span>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`shrink-0 text-ink-soft transition-transform ${advOpen ? "rotate-180" : ""}`}><path strokeLinecap="round" d="M6 9l6 6 6-6" /></svg>
          </button>
          {advOpen && <div className="space-y-5 border-t border-line p-6">{advancedRows.map(renderRow)}</div>}
        </div>
      )}

      {/* شريط الحفظ */}
      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-line bg-white/95 px-6 py-3 backdrop-blur lg:right-72">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-emerald-600">{ok}</span>
            {dirty && !ok && <span className="text-sm font-semibold text-amber-600">• تعديلات غير محفوظة</span>}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {!isNew && hasDefault && (
              <button
                onClick={onResetDefault}
                disabled={resetting || saving}
                className="rounded-xl border border-line px-4 py-2.5 text-sm font-semibold text-ink-soft transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600 disabled:opacity-60"
              >
                {resetting ? "جارٍ الاسترجاع…" : "استرجاع النسخة الافتراضية"}
              </button>
            )}
            <button
              onClick={discard}
              disabled={!dirty || saving}
              className="rounded-xl border border-line px-4 py-2.5 text-sm font-semibold text-ink-soft transition-colors hover:bg-surface disabled:opacity-40"
            >
              تجاهل التعديلات
            </button>
            <button
              onClick={onSave}
              disabled={saving || (!dirty && !isNew)}
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

const isSimpleArray = (v: unknown): v is (string | number)[] =>
  Array.isArray(v) && v.every((x) => typeof x === "string" || typeof x === "number");

function Help({ text }: { text?: string }) {
  if (!text) return null;
  return <p className="mt-1 text-[11px] text-ink-soft">{text}</p>;
}

function FieldInput({ f, value, onChange, badge, dir }: { f: FieldSchema; value: unknown; onChange: (v: unknown) => void; badge?: string; dir?: string }) {
  const showHelp = badge !== "English"; // لا نكرّر الشرح على الجانب الإنجليزي
  if (f.type === "bool") {
    return (
      <div>
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3">
          <input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} className="h-5 w-5 accent-brand" />
          <span className="text-sm font-semibold text-ink">{f.label}</span>
        </label>
        {showHelp && <Help text={f.help} />}
      </div>
    );
  }
  return (
    <div>
      <Label f={f} badge={badge} />
      {f.type === "textarea" ? (
        <textarea value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} rows={4} dir={dir} className={INPUT} />
      ) : f.type === "json" ? (
        isSimpleArray(value) || value == null ? (
          <ListEditor value={isSimpleArray(value) ? value : []} onChange={onChange} dir={dir} />
        ) : (
          <textarea value={JSON.stringify(value, null, 2)} onChange={(e) => { try { onChange(JSON.parse(e.target.value)); } catch { onChange(e.target.value); } }} rows={6} dir="ltr" className={`${INPUT} font-mono text-xs`} />
        )
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
      {showHelp && <Help text={f.help} />}
    </div>
  );
}

// منتقي أيقونات بصري — اختيار بدل كتابة الاسم
function IconPicker({ value, onChange, names }: { value: string; onChange: (v: string) => void; names: string[] }) {
  // اعرض القيمة الحالية دائماً حتى لو خارج المجموعة المقترحة
  const display = value && CMS_ICONS[value] && !names.includes(value) ? [value, ...names] : names;
  return (
    <div>
      <div className="grid grid-cols-4 gap-2 rounded-xl border border-line bg-surface p-3 sm:grid-cols-6">
        <button
          type="button"
          onClick={() => onChange("")}
          className={`flex flex-col items-center justify-center gap-1 rounded-lg border p-2 text-[10px] transition-colors ${value === "" ? "border-brand bg-brand/10 text-brand" : "border-line bg-white text-ink-soft hover:border-brand/40"}`}
        >
          <span className="flex h-6 w-6 items-center justify-center text-base">✕</span>
          بدون
        </button>
        {display.map((name) => {
          const active = value === name;
          return (
            <button
              key={name}
              type="button"
              onClick={() => onChange(name)}
              title={ICON_LABELS[name] || name}
              className={`flex flex-col items-center justify-center gap-1 rounded-lg border p-2 text-[10px] transition-colors ${active ? "border-brand bg-brand/10 text-brand" : "border-line bg-white text-ink hover:border-brand/40"}`}
            >
              <span className="flex h-6 w-6 items-center justify-center">{CMS_ICONS[name]}</span>
              <span className="truncate w-full text-center">{ICON_LABELS[name] || name}</span>
            </button>
          );
        })}
      </div>
      {value && !CMS_ICONS[value] && (
        <p className="mt-1 text-[11px] text-amber-600">الأيقونة «{value}» غير معروفة — اختر واحدة من الأعلى.</p>
      )}
    </div>
  );
}

// محرّر قوائم سهل — صفّ لكل عنصر مع زر حذف + زر إضافة (بدل JSON)
function ListEditor({ value, onChange, dir }: { value: (string | number)[]; onChange: (v: unknown) => void; dir?: string }) {
  const items = value.map(String);
  const update = (i: number, v: string) => { const copy = [...items]; copy[i] = v; onChange(copy); };
  const remove = (i: number) => onChange(items.filter((_, j) => j !== i));
  const add = () => onChange([...items, ""]);
  return (
    <div className="space-y-2">
      {items.length === 0 && <p className="rounded-xl border border-dashed border-line bg-surface px-4 py-2.5 text-xs text-ink-soft">لا توجد عناصر — اضغط «إضافة عنصر».</p>}
      {items.map((it, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface text-[11px] font-bold text-ink-soft">{i + 1}</span>
          <input value={it} onChange={(e) => update(i, e.target.value)} dir={dir} className={INPUT} />
          <button type="button" onClick={() => remove(i)} className="shrink-0 rounded-lg bg-red-50 px-2.5 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-600 hover:text-white">حذف</button>
        </div>
      ))}
      <button type="button" onClick={add} className="inline-flex items-center gap-1.5 rounded-lg bg-brand/10 px-3 py-1.5 text-xs font-semibold text-brand transition-colors hover:bg-brand hover:text-white">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" d="M12 5v14M5 12h14" /></svg>
        إضافة عنصر
      </button>
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
      <Help text={f.help} />
    </div>
  );
}
