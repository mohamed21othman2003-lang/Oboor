"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getSchema, getItem, createItem, updateItem, uploadField, uploadImage, resetDefault,
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
  // (الترتيب مخفي — تتم إدارته بالأسهم في القائمة)
  type Row = { kind: "pair" | "single"; ar?: FieldSchema; en?: FieldSchema; f?: FieldSchema };
  const rows = useMemo(() => {
    const out: Row[] = [];
    const done = new Set<string>();
    for (const f of fields) {
      if (done.has(f.name) || HIDDEN_IN_FORM.has(f.name)) continue;
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
        if (f.type === "json") {
          if (typeof v === "string") {
            try { v = v.trim() ? JSON.parse(v) : (f.required ? [] : null); }
            catch { throw new Error(`القيمة في «${f.label}» ليست JSON صحيحة.`); }
          }
          // أزل عناصر القوائم الفارغة (نصوص فارغة أو كائنات كل قيمها فارغة)
          if (Array.isArray(v)) v = v.filter((x) => {
            if (typeof x === "string") return x.trim() !== "";
            if (x && typeof x === "object") return Object.values(x).some((val) => String(val ?? "").trim() !== "");
            return true;
          });
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
      const pathFallback = String(values.image ?? values.logo_path ?? values.image_path ?? "");
      return <ImageInput key={i} f={f} value={values[f.name]} pathFallback={pathFallback} type={type} id={id} isNew={isNew} onUploaded={(it) => { setValues(it as Record<string, unknown>); setBaseline(it as Record<string, unknown>); }} />;
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
    if (f.name === "gallery") {
      return (
        <div key={i}>
          <Label f={f} />
          <GalleryEditor value={values[f.name]} onChange={(v) => set(f.name, v)} />
          <Help text="ارفع صور هذا الفرع الحقيقية — تظهر في معرض صفحة الفرع." />
        </div>
      );
    }
    if (f.name === "lat") {
      return (
        <div key={i} className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-semibold text-ink">موقع الفرع على الخريطة</label>
          <LocationEditor lat={values.lat} lng={values.lng} onLat={(v) => set("lat", v)} onLng={(v) => set("lng", v)} />
        </div>
      );
    }
    if (f.name === "lng") return null;
    // حقل مقفول (مكان المحتوى) — عرض فقط على العناصر الموجودة
    if (LOCKED_FIELDS.has(f.name) && !isNew) {
      return <ReadOnlyField key={i} f={f} value={String(values[f.name] ?? "")} note="هذا يحدّد مكان ظهور المحتوى في الصفحة — لا يُعدّل لتجنّب اختفائه." />;
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
        {rows.map(renderRow)}
      </div>

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

// منطقة نص تكبر تلقائياً لتعرض كامل المحتوى (بدل قصّ النص في سطر واحد)
function AutoTextarea({ value, onChange, dir, className, minRows = 1 }: { value: string; onChange: (v: string) => void; dir?: string; className?: string; minRows?: number }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);
  return (
    <textarea
      ref={ref}
      rows={minRows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      dir={dir}
      className={`${className ?? INPUT} resize-none overflow-hidden`}
    />
  );
}

const isSimpleArray = (v: unknown): v is (string | number)[] =>
  Array.isArray(v) && v.every((x) => typeof x === "string" || typeof x === "number");

// حقول JSON من نوع كائن (object) — تُحرَّر كخانات بسيطة بدل كود JSON
const OBJECT_FIELDS: Record<string, { key: string; label: string }[]> = {
  about_tag: [
    { key: "heading", label: "عنوان البطاقة (مثال: الفئات المستهدفة)" },
    { key: "label", label: "نص البطاقة (مثال: الأفراد من ذوي الإعاقة)" },
  ],
};

// حقول مخفية من الفورم (الترتيب يُدار بأسهم القائمة)
const HIDDEN_IN_FORM = new Set(["order"]);
// حقول مقفولة (تُعرض للاطلاع فقط؛ تغييرها يكسر مكان المحتوى)
const LOCKED_FIELDS = new Set(["block"]);
// قوائم بطاقات — كل عنصر كائن بخانات معنونة بسيطة (بدل JSON)
const CARD_LIST_FIELDS: Record<string, { key: string; label: string }[]> = {
  methods: [
    { key: "name", label: "الاسم" },
    { key: "desc", label: "الوصف" },
  ],
  training_areas: [
    { key: "title", label: "العنوان" },
    { key: "desc", label: "الوصف" },
  ],
};
// حقول محتوى منظّم معقّد — للعرض فقط (تعديلها الخام يكسر الصفحة)
const COMPLEX_JSON = new Set(["blocks"]);
const isComplexJson = (v: unknown) =>
  (v != null && typeof v === "object" && !Array.isArray(v) && Object.keys(v).length > 0) ||
  (Array.isArray(v) && v.some((x) => x != null && typeof x === "object"));

function Help({ text }: { text?: string }) {
  if (!text) return null;
  return <p className="mt-1 text-[11px] text-ink-soft">{text}</p>;
}

const LOCK_ICON = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline-block"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
);

// حقل نصّي مقفول — عرض فقط
function ReadOnlyField({ f, value, note }: { f: FieldSchema; value: string; note?: string }) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-ink-soft">{LOCK_ICON} {f.label}</label>
      <div className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-ink-soft">{value || "—"}</div>
      {note && <p className="mt-1 text-[11px] text-amber-600">{note}</p>}
    </div>
  );
}

// محتوى منظّم معقّد — عرض فقط (آمن من الكسر)
function ReadOnlyJson({ f, value }: { f: FieldSchema; value: unknown }) {
  const count = Array.isArray(value) ? value.length : value && typeof value === "object" ? Object.keys(value).length : 0;
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-ink-soft">{LOCK_ICON} {f.label}</label>
      <details className="rounded-xl border border-line bg-surface">
        <summary className="cursor-pointer px-4 py-2.5 text-sm text-ink-soft">محتوى منظّم ({count} عنصر) — اضغط للعرض</summary>
        <pre dir="ltr" className="max-h-60 overflow-auto border-t border-line p-3 text-[11px] leading-5 text-ink-soft">{JSON.stringify(value, null, 2)}</pre>
      </details>
      <p className="mt-1 text-[11px] text-amber-600">محتوى منظّم — للعرض فقط؛ لتعديله بأمان تواصل مع المطوّر.</p>
    </div>
  );
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
        <AutoTextarea value={String(value ?? "")} onChange={onChange} dir={dir} minRows={3} />
      ) : f.type === "json" ? (
        OBJECT_FIELDS[f.base] ? (
          <ObjectEditor value={value} onChange={onChange} fields={OBJECT_FIELDS[f.base]} dir={dir} />
        ) : CARD_LIST_FIELDS[f.base] ? (
          <CardListEditor value={value} onChange={onChange} fields={CARD_LIST_FIELDS[f.base]} dir={dir} />
        ) : COMPLEX_JSON.has(f.base) || isComplexJson(value) ? (
          <ReadOnlyJson f={f} value={value} />
        ) : isSimpleArray(value) || value == null ? (
          <ListEditor value={isSimpleArray(value) ? value : []} onChange={onChange} dir={dir} />
        ) : (
          <ReadOnlyJson f={f} value={value} />
        )
      ) : f.type === "select" ? (
        <select value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} className={INPUT}>
          <option value="">— اختر —</option>
          {f.choices?.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      ) : f.type === "number" ? (
        <input
          type="number"
          min={f.name === "order" ? 0 : undefined}
          value={value === null || value === undefined ? "" : String(value)}
          onChange={(e) => {
            const n = e.target.value === "" ? null : Number(e.target.value);
            onChange(f.name === "order" && n !== null ? Math.max(0, n) : n);
          }}
          className={INPUT}
        />
      ) : (
        <AutoTextarea value={String(value ?? "")} onChange={onChange} dir={dir} />
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

// محرّر موقع — يلصق إحداثيات خرائط جوجل فتُقسَّم تلقائياً إلى خط عرض/طول
function LocationEditor({ lat, lng, onLat, onLng }: { lat: unknown; lng: unknown; onLat: (v: number | null) => void; onLng: (v: number | null) => void }) {
  const num = (v: unknown) => (v === null || v === undefined || v === "" ? "" : String(v));
  const parsePaste = (s: string) => {
    const m = s.match(/(-?\d+(?:\.\d+)?)\s*[,\s]\s*(-?\d+(?:\.\d+)?)/);
    if (m) { onLat(parseFloat(m[1])); onLng(parseFloat(m[2])); }
  };
  return (
    <div className="space-y-3 rounded-xl border border-line bg-surface/50 p-3">
      <div>
        <p className="mb-1 text-xs font-semibold text-ink-soft">الصق إحداثيات الموقع من خرائط جوجل</p>
        <input
          dir="ltr"
          placeholder="مثال: 24.7136, 46.6753"
          onChange={(e) => parsePaste(e.target.value)}
          className={INPUT + " bg-white font-mono"}
        />
        <p className="mt-1 text-[11px] text-ink-soft">في خرائط جوجل: كليك يمين على موقع الفرع بالضبط ← انسخ أول سطر (الأرقام) ← الصقه هنا.</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="mb-1 text-xs font-semibold text-ink-soft">خط العرض (lat)</p>
          <input type="number" step="any" dir="ltr" value={num(lat)} onChange={(e) => onLat(e.target.value === "" ? null : Number(e.target.value))} className={INPUT + " bg-white"} />
        </div>
        <div>
          <p className="mb-1 text-xs font-semibold text-ink-soft">خط الطول (lng)</p>
          <input type="number" step="any" dir="ltr" value={num(lng)} onChange={(e) => onLng(e.target.value === "" ? null : Number(e.target.value))} className={INPUT + " bg-white"} />
        </div>
      </div>
      {(num(lat) || num(lng)) && (
        <a href={`https://www.google.com/maps/search/?api=1&query=${num(lat)},${num(lng)}`} target="_blank" rel="noopener" className="inline-block text-xs font-semibold text-brand hover:underline">معاينة الموقع على الخريطة ↗</a>
      )}
    </div>
  );
}

// محرّر معرض صور — رفع متعدد + معاينة مصغّرة + حذف/ترتيب (يخزّن قائمة روابط)
function GalleryEditor({ value, onChange }: { value: unknown; onChange: (v: unknown) => void }) {
  const urls = (Array.isArray(value) ? value : []).filter((x) => typeof x === "string") as string[];
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = [...(e.target.files || [])];
    if (!files.length) return;
    setBusy(true); setErr("");
    const added: string[] = [];
    try {
      for (const f of files) {
        if (f.size > 5 * 1024 * 1024) { setErr("بعض الصور أكبر من 5 ميجابايت — تم تخطّيها."); continue; }
        const r = await uploadImage(f);
        added.push(r.url);
      }
      if (added.length) onChange([...urls, ...added]);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "تعذّر رفع بعض الصور.");
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }
  const remove = (i: number) => onChange(urls.filter((_, j) => j !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= urls.length) return;
    const a = [...urls];
    [a[i], a[j]] = [a[j], a[i]];
    onChange(a);
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {urls.map((u, i) => (
          <div key={u + i} className="group relative aspect-square overflow-hidden rounded-xl ring-1 ring-line">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={u} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/45 px-1.5 py-1 opacity-0 transition-opacity group-hover:opacity-100">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="rounded p-0.5 text-white/90 hover:text-white disabled:opacity-30" title="لليمين">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" d="M9 6l6 6-6 6" /></svg>
              </button>
              <button type="button" onClick={() => remove(i)} className="rounded bg-red-500/90 px-1.5 py-0.5 text-[10px] font-bold text-white" title="حذف">حذف</button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === urls.length - 1} className="rounded p-0.5 text-white/90 hover:text-white disabled:opacity-30" title="لليسار">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" d="M15 6l-6 6 6 6" /></svg>
              </button>
            </div>
          </div>
        ))}
        <label className={`flex aspect-square cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-line text-ink-soft transition-colors hover:border-brand/50 hover:text-brand ${busy ? "opacity-60" : ""}`}>
          {busy ? (
            <span className="text-xs font-semibold">جارٍ الرفع…</span>
          ) : (
            <>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
              <span className="text-xs font-semibold">إضافة صور</span>
            </>
          )}
          <input type="file" accept="image/*" multiple onChange={onFiles} disabled={busy} className="hidden" />
        </label>
      </div>
      {urls.length === 0 && <p className="mt-2 text-xs text-ink-soft">لا توجد صور بعد — اضغط «إضافة صور» لرفع صور هذا الفرع.</p>}
      {err && <p className="mt-1 text-xs text-red-600">{err}</p>}
    </div>
  );
}

// محرّر كائن — خانات بسيطة معنونة بدل كود JSON (مثل البطاقة المميّزة: عنوان + نص)
function ObjectEditor({ value, onChange, fields, dir }: { value: unknown; onChange: (v: unknown) => void; fields: { key: string; label: string }[]; dir?: string }) {
  const obj = (value && typeof value === "object" && !Array.isArray(value)) ? (value as Record<string, unknown>) : {};
  const set = (k: string, v: string) => {
    const next = { ...obj, [k]: v };
    // إن كانت كل الخانات فارغة، احفظ كائناً فارغاً (لا تظهر بطاقة فاضية)
    const allEmpty = fields.every((fl) => !String(next[fl.key] ?? "").trim());
    onChange(allEmpty ? {} : next);
  };
  return (
    <div className="space-y-3 rounded-xl border border-line bg-surface/50 p-3">
      {fields.map((fl) => (
        <div key={fl.key}>
          <p className="mb-1 text-xs font-semibold text-ink-soft">{fl.label}</p>
          <AutoTextarea value={String(obj[fl.key] ?? "")} onChange={(v) => set(fl.key, v)} dir={dir} className={INPUT + " bg-white"} />
        </div>
      ))}
      <p className="text-[11px] text-ink-soft">اتركها فارغة إن لم تكن الخدمة تحتاج بطاقة مميّزة.</p>
    </div>
  );
}

// محرّر قائمة بطاقات — كل عنصر كائن بخانات معنونة (بدل قائمة JSON مركّبة)
function CardListEditor({ value, onChange, fields, dir }: { value: unknown; onChange: (v: unknown) => void; fields: { key: string; label: string }[]; dir?: string }) {
  const items = (Array.isArray(value) ? value : []).filter((x) => x && typeof x === "object" && !Array.isArray(x)) as Record<string, unknown>[];
  const update = (i: number, key: string, v: string) => onChange(items.map((it, j) => (j === i ? { ...it, [key]: v } : it)));
  const remove = (i: number) => onChange(items.filter((_, j) => j !== i));
  const add = () => onChange([...items, Object.fromEntries(fields.map((fl) => [fl.key, ""]))]);
  return (
    <div className="space-y-3">
      {items.length === 0 && <p className="rounded-xl border border-dashed border-line bg-surface px-4 py-2.5 text-xs text-ink-soft">لا توجد عناصر — اضغط «إضافة عنصر».</p>}
      {items.map((it, i) => (
        <div key={i} className="rounded-xl border border-line bg-surface/50 p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-brand/10 px-2 text-[11px] font-bold text-brand">عنصر {i + 1}</span>
            <button type="button" onClick={() => remove(i)} className="rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-600 hover:text-white">حذف</button>
          </div>
          <div className="space-y-2">
            {fields.map((fl) => (
              <div key={fl.key}>
                <p className="mb-1 text-xs font-semibold text-ink-soft">{fl.label}</p>
                <AutoTextarea value={String(it[fl.key] ?? "")} onChange={(v) => update(i, fl.key, v)} dir={dir} className={INPUT + " bg-white"} />
              </div>
            ))}
          </div>
        </div>
      ))}
      <button type="button" onClick={add} className="inline-flex items-center gap-1.5 rounded-lg bg-brand/10 px-3 py-1.5 text-xs font-semibold text-brand transition-colors hover:bg-brand hover:text-white">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" d="M12 5v14M5 12h14" /></svg>
        إضافة عنصر
      </button>
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
        <div key={i} className="flex items-start gap-2">
          <span className="mt-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface text-[11px] font-bold text-ink-soft">{i + 1}</span>
          <div className="flex-1"><AutoTextarea value={it} onChange={(v) => update(i, v)} dir={dir} /></div>
          <button type="button" onClick={() => remove(i)} className="mt-1 shrink-0 rounded-lg bg-red-50 px-2.5 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-600 hover:text-white">حذف</button>
        </div>
      ))}
      <button type="button" onClick={add} className="inline-flex items-center gap-1.5 rounded-lg bg-brand/10 px-3 py-1.5 text-xs font-semibold text-brand transition-colors hover:bg-brand hover:text-white">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" d="M12 5v14M5 12h14" /></svg>
        إضافة عنصر
      </button>
    </div>
  );
}

// طبّع المسار ليكون قابلاً للعرض (روابط الموقع تبدأ بـ "/figma..."، روابط Django مطلقة)
function resolveSrc(s: string): string {
  if (!s) return "";
  if (/^(https?:|data:|blob:|\/)/.test(s)) return s;
  return "/" + s.replace(/^\/+/, "");
}

function ImageInput({ f, value, pathFallback, type, id, isNew, onUploaded }: { f: FieldSchema; value: unknown; pathFallback: string; type: string; id: string; isNew: boolean; onUploaded: (it: CmsItem) => void }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [localPreview, setLocalPreview] = useState("");

  // أولوية العرض: معاينة فورية → ملف مرفوع → الصورة الحالية على الموقع (المسار)
  const uploaded = typeof value === "string" ? value : "";
  const current = resolveSrc(uploaded || pathFallback);
  const src = localPreview || current;

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setErr("الحد الأقصى 5 ميجابايت."); return; }
    setErr("");
    setLocalPreview(URL.createObjectURL(file)); // تظهر فوراً قبل اكتمال الرفع
    setBusy(true);
    try {
      const saved = await uploadField(type, id, f.name, file);
      onUploaded(saved);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "تعذّر الرفع.");
      setLocalPreview("");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <Label f={f} />
      <div className="flex items-center gap-4">
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="" className="h-24 w-24 rounded-xl object-cover ring-1 ring-line" />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-surface text-ink-soft ring-1 ring-dashed ring-line">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
          </div>
        )}
        <div>
          {isNew ? (
            <p className="rounded-xl border border-dashed border-line bg-surface px-4 py-3 text-sm text-ink-soft">احفظ العنصر أولاً ثم ارفع الصورة.</p>
          ) : (
            <label className="inline-block cursor-pointer rounded-xl bg-brand/10 px-4 py-2.5 text-sm font-semibold text-brand transition-colors hover:bg-brand hover:text-white">
              {busy ? "جارٍ الرفع…" : src ? "تغيير الصورة" : "رفع صورة"}
              <input type="file" accept="image/*" onChange={onFile} disabled={busy} className="hidden" />
            </label>
          )}
          {localPreview && !busy && <p className="mt-1.5 text-xs font-semibold text-emerald-600">تم رفع الصورة الجديدة ✓</p>}
        </div>
      </div>
      {err && <p className="mt-1 text-xs text-red-600">{err}</p>}
      <Help text={f.help} />
    </div>
  );
}
