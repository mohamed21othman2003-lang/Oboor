"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getSchema, getItem, createItem, updateItem, uploadField, uploadImage, resetDefault,
  savePreviewDraft, typeLabel, addLabelFor, type FieldSchema, type CmsItem,
} from "@/lib/cms/api";
import { CMS_ICONS, ICON_LABELS, iconNamesFor } from "@/lib/cms/icons";
import { iconByKey, OFFER_ICON_KEYS } from "@/lib/areaIcon";
import { useCmsLang } from "@/lib/cms/i18n";
import { fieldLabelEn } from "@/lib/cms/fieldLabels";
import CustomSelect from "@/components/ui/Select";
// تحميل مكوّن قصّ الصورة عند الحاجة فقط (يقلّل حجم باندل المحرّر)
const ImageCropModal = dynamic(() => import("@/components/cms/ImageCropModal"), { ssr: false });

export default function CollectionEditor({ type, id }: { type: string; id: string }) {
  const { lang } = useCmsLang();
  const en = lang === "en";
  const t = (ar: string, e: string) => (en ? e : ar);
  const L = (f: FieldSchema) => (en ? (fieldLabelEn(f.name) || f.label) : f.label);
  const router = useRouter();
  const sp = useSearchParams();
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
  const [previewing, setPreviewing] = useState(false);

  const label = typeLabel(type, lang);

  // معاينة التعديلات الحالية (غير المحفوظة) على الصفحة الحقيقية قبل الحفظ
  async function doPreview() {
    const to = previewHref(type, values);
    if (!to) return;
    setError("");
    setPreviewing(true);
    try {
      await savePreviewDraft(type, id, values);
      window.open(`/api/preview?ref=${type}:${id}&to=${encodeURIComponent(to)}`, "_blank", "noopener");
    } catch (e) {
      setError(e instanceof Error ? e.message : t("تعذّرت المعاينة.", "Could not open the preview."));
    } finally {
      setPreviewing(false);
    }
  }

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
    else {
      // عنصر جديد: ابدأ من قيم أوّليّة (قد تتضمّن الصفحة تلقائياً مثل «عن عبور»)،
      // واجعل baseline مطابقاً لها حتى لا تُحسَب هذه الافتراضيات كتعديل — فيبقى الحفظ معطّلاً
      // حتى يُدخل المستخدم محتوى حقيقياً.
      const pg = sp.get("page");
      const init: Record<string, unknown> = pg ? { page: pg } : {};
      setValues(init);
      setBaseline(init);
    }
    Promise.all(tasks).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, [type, id, isNew, sp]);

  function set(name: string, v: unknown) {
    setValues((prev) => ({ ...prev, [name]: v }));
    setOk("");
  }

  // مقارنة التعديلات بآخر نسخة محفوظة (على مستوى الحقول).
  // القيم الفارغة ("" / null / undefined / [] / {}) تُعامَل كقيمة واحدة "لا شيء"،
  // حتى لا يُحسَب مثلاً كتابة نص ثم مسحه كتعديل حقيقي.
  const dirty = useMemo(() => {
    const empty = (v: unknown) => v === null || v === undefined || v === "" || (Array.isArray(v) && v.length === 0) || (typeof v === "object" && v !== null && !Array.isArray(v) && Object.keys(v as object).length === 0);
    for (const f of fields) {
      if (f.type === "image") continue;
      const a = JSON.stringify(empty(values[f.name]) ? null : values[f.name]);
      const b = JSON.stringify(empty(baseline[f.name]) ? null : baseline[f.name]);
      if (a !== b) return true;
    }
    return false;
  }, [fields, values, baseline]);

  // تحذير قبل إغلاق التبويب/إعادة التحميل مع وجود تعديلات غير محفوظة (منع فقدان العمل)
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  // نسبة الاكتمال = الحقول الإلزامية (المعلَّمة بنجمة) + حقل الصورة (محتوى أساسي وإن لم يكن إلزامياً)
  const isEmpty = (v: unknown) => v === null || v === undefined || v === "" || (Array.isArray(v) && v.length === 0) || (typeof v === "object" && v !== null && !Array.isArray(v) && Object.keys(v as object).length === 0);
  // الصورة تُعتبر مكتملة إن وُجد ملف مرفوع أو مسار (نتحقق من كل صيغ حقل الصورة)
  const imageFilled = useMemo(() => ["image_file", "image", "image_path", "logo_path"].some((k) => !isEmpty(values[k])), [values]);
  const counted = useMemo(() => fields.filter((f) => !HIDDEN_IN_FORM.has(f.name) && (f.required || f.type === "image")), [fields]);
  const fieldFilled = (f: FieldSchema) => (f.type === "image" ? imageFilled : !isEmpty(values[f.name]));
  const completion = useMemo(() => {
    if (!counted.length) return 100;
    const filled = counted.filter(fieldFilled).length;
    return Math.round((filled / counted.length) * 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counted, values, imageFilled]);
  const missing = useMemo(() => counted.filter((f) => !fieldFilled(f)).map((f) => L(f)), [counted, values, imageFilled]); // eslint-disable-line react-hooks/exhaustive-deps

  function discard() {
    if (!dirty) return;
    if (!confirm(t("تجاهل كل التعديلات غير المحفوظة والرجوع لآخر نسخة محفوظة؟", "Discard all unsaved changes and return to the last saved version?"))) return;
    setValues(baseline);
    setError("");
    setOk("");
  }

  async function onResetDefault() {
    if (!confirm(t("استرجاع النسخة الافتراضية الأصلية؟ سيُستبدل المحتوى الحالي بالكامل.", "Restore the original default version? The current content will be completely replaced."))) return;
    setResetting(true);
    setError("");
    setOk("");
    try {
      const restored = await resetDefault(type, id);
      const v = restored as Record<string, unknown>;
      setValues(v);
      setBaseline(v);
      setOk(t("تم استرجاع النسخة الافتراضية ✓", "Default version restored ✓"));
    } catch (e) {
      setError(e instanceof Error ? e.message : t("تعذّر الاسترجاع.", "Could not restore."));
    } finally {
      setResetting(false);
    }
  }

  // تجميع الحقول: أزواج عربي/إنجليزي في صف واحد، الباقي مفرد
  // (الترتيب مخفي — تتم إدارته بالأسهم في القائمة)
  type Row = { kind: "pair" | "single"; ar?: FieldSchema; en?: FieldSchema; f?: FieldSchema };
  // أقسام الروابط (قائمة الهيدر + روابط/سوشيال الفوتر): حقل «القيمة» هو وجهة الرابط
  const sectionBlock = type === "sections" ? String(values.block ?? "") : "";
  const isLinkBlock = ["nav", "quick_links", "services", "social"].includes(sectionBlock);
  const rows = useMemo(() => {
    const out: Row[] = [];
    const done = new Set<string>();
    for (const f of fields) {
      if (done.has(f.name) || HIDDEN_IN_FORM.has(f.name)) continue;
      // أخفِ الحقول التقنية الاختيارية الفارغة (icon/value/color/href) لتقليل التشويش
      if (HIDE_IF_EMPTY.has(f.name) && isEmpty(baseline[f.name])) continue;
      // أقسام الصفحات: المسار النصّي يُدار عبر الرافع؛ والرافع يظهر فقط للأقسام التي بها صورة
      if (type === "sections") {
        if (f.name === "image") continue;
        if (f.name === "image_file" && isEmpty(baseline.image) && isEmpty(baseline.image_file)) continue;
      }
      // عناصر الروابط: «النص» غير مستخدم، ونوضّح أن «القيمة» هي الرابط/الوجهة
      if (isLinkBlock) {
        if (f.base === "text") continue; // النص (عربي/إنجليزي) لا معنى له لعنصر رابط
        if (f.name === "value") {
          const label = sectionBlock === "social"
            ? t("رابط الحساب", "Account Link")
            : t("الرابط (الوجهة عند الضغط)", "Link (destination on click)");
          const help = t(
            "المكان الذي يفتحه هذا العنصر عند الضغط: رابط داخلي في الموقع مثل /about أو /news، أو رابط كامل يبدأ بـ https:// لموقع خارجي.",
            "Where this item opens when clicked: an internal site link such as /about or /news, or a full URL starting with https:// for an external site.",
          );
          // العنوان هنا مُترجَم مسبقاً (أدق من fieldLabelEn العام) — علّمه ليُعرض كما هو
          out.push({ kind: "single", f: { ...f, label, help, _labelResolved: true } as FieldSchema });
          done.add(f.name);
          continue;
        }
      }
      // الأخبار: حقول كارت الفعالية تظهر فقط للفعاليات والورش
      if (type === "news" && EVENT_FIELDS.has(f.name) && !["events", "workshops"].includes(String(values.section ?? ""))) continue;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields, baseline, type, values.section, sectionBlock, isLinkBlock, en]);

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
            catch { throw new Error(en ? `The value in "${L(f)}" is not valid JSON.` : `القيمة في «${f.label}» ليست JSON صحيحة.`); }
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
      setOk(t("تم الحفظ بنجاح ✓", "Saved successfully ✓"));
      if (isNew) router.replace(`/cms/content/${type}/${(saved as CmsItem).id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("تعذّر الحفظ.", "Could not save."));
    } finally {
      setSaving(false);
    }
  }

  function renderRow(row: Row, i: number) {
    if (row.kind === "pair") {
      // قسم «كيف يساعد…» في التقنيات — محرّر منظّم بعرض كامل
      if (row.ar?.base === "help_section" || row.en?.base === "help_section") {
        return (
          <div key={i}>
            <label className="mb-1.5 block text-sm font-semibold text-ink">{t("قسم «كيف يساعد…» (عنوان + بطاقتان)", "“How it helps…” Section (heading + two cards)")}</label>
            <HelpSectionEditor
              ar={blkObj(values.help_section_ar)}
              en={blkObj(values.help_section_en)}
              onChange={(a, e) => { set("help_section_ar", a); set("help_section_en", e); }}
            />
            <Help text={t("السكشن الذي يشرح كيف تساعد التقنية الطفل — عدّل العنوان وعنوان كل بطاقة وعناصرها (عربي يمين / إنجليزي يسار).", "The section explaining how the technique helps the child — edit the heading, each card's title, and its items (Arabic on the right / English on the left).")} />
          </div>
        );
      }
      // أقسام صفحة الخدمة (blocks) — محرّر منظّم بعرض كامل (عربي + إنجليزي معاً)
      if (row.ar?.base === "blocks" || row.en?.base === "blocks") {
        return (
          <div key={i}>
            <label className="mb-1.5 block text-sm font-semibold text-ink">{t("أقسام محتوى الصفحة", "Page Content Sections")}</label>
            <BlocksEditor
              ar={Array.isArray(values.blocks_ar) ? (values.blocks_ar as unknown[]) : []}
              en={Array.isArray(values.blocks_en) ? (values.blocks_en as unknown[]) : []}
              onChange={(a, e) => { set("blocks_ar", a); set("blocks_en", e); }}
            />
            <Help text={t("كل قسم من أقسام الصفحة (عناوين، بطاقات، قوائم، مربّعات…). عدّل النص العربي على اليمين والإنجليزي على اليسار. نوع القسم وشكله ثابتان للحفاظ على التصميم.", "Every section of the page (headings, cards, lists, tiles…). Edit the Arabic text on the right and the English on the left. The section's type and layout are fixed to preserve the design.")} />
          </div>
        );
      }
      // التاريخ: منتقي تقويم واحد (لا نص حر، ولا تاريخ قديم) يكتب للّغتين معًا
      if (row.ar?.base === "date" || /_date$/.test(row.ar?.base ?? "") || row.en?.base === "date" || /_date$/.test(row.en?.base ?? "")) {
        const arName = row.ar?.name;
        const enName = row.en?.name;
        const cur = String(values[arName ?? ""] ?? values[enName ?? ""] ?? "");
        const f0 = (row.ar || row.en)!;
        return (
          <div key={i}>
            <DateField label={L(f0)} help={f0.help} value={cur} onChange={(v) => { if (arName) set(arName, v); if (enName) set(enName, v); }} />
          </div>
        );
      }
      // الوقت: منتقيان (من / إلى) بدل النص الحر، يكتبان للّغتين معًا
      if (row.ar?.base === "time" || /_time$/.test(row.ar?.base ?? "") || row.en?.base === "time" || /_time$/.test(row.en?.base ?? "")) {
        const arName = row.ar?.name;
        const enName = row.en?.name;
        const cur = String(values[arName ?? ""] ?? values[enName ?? ""] ?? "");
        const f0 = (row.ar || row.en)!;
        return (
          <div key={i}>
            <TimeRangeField label={L(f0)} help={f0.help} value={cur} onChange={(v) => { if (arName) set(arName, v); if (enName) set(enName, v); }} />
          </div>
        );
      }
      return (
        <div key={i} className="grid gap-x-5 gap-y-2 sm:grid-cols-2">
          {row.ar && <FieldInput f={row.ar} value={values[row.ar.name]} onChange={(v) => set(row.ar!.name, v)} badge={t("عربي", "Arabic")} />}
          {row.en && <FieldInput f={row.en} value={values[row.en.name]} onChange={(v) => set(row.en!.name, v)} badge="English" dir="ltr" />}
        </div>
      );
    }
    const f = row.f!;
    if (f.type === "image") {
      const pathFallback = String(values.image ?? values.logo_path ?? values.image_path ?? "");
      // اسم حقل المسار النصّي (CharField) المقابل لحقل الرفع — نكتب فيه رابط الصورة عند إنشاء عنصر جديد
      const pathField = values.logo_path !== undefined ? "logo_path" : values.image_path !== undefined ? "image_path" : "image";
      return <ImageInput key={i} f={f} value={values[f.name]} pathFallback={pathFallback} type={type} id={id} isNew={isNew} onChange={(v) => set(pathField, v)} onUploaded={(it) => { setValues(it as Record<string, unknown>); setBaseline(it as Record<string, unknown>); }} />;
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
          <Help text={t("ارفع صور هذا الفرع الحقيقية — تظهر في معرض صفحة الفرع.", "Upload the real photos of this branch — they appear in the branch page's gallery.")} />
        </div>
      );
    }
    if (f.name === "lat") {
      return (
        <div key={i} className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-semibold text-ink">{t("موقع الفرع على الخريطة", "Branch Location on the Map")}</label>
          <LocationEditor lat={values.lat} lng={values.lng} onLat={(v) => set("lat", v)} onLng={(v) => set("lng", v)} />
        </div>
      );
    }
    if (f.name === "lng") return null;
    // حقل مقفول (مكان المحتوى) — عرض فقط على العناصر الموجودة
    if (LOCKED_FIELDS.has(f.name) && !isNew) {
      return <ReadOnlyField key={i} f={f} value={String(values[f.name] ?? "")} note={t("هذا يحدّد مكان ظهور المحتوى في الصفحة — لا يُعدّل لتجنّب اختفائه.", "This determines where the content appears on the page — it is not editable to prevent it from disappearing.")} />;
    }
    return <FieldInput key={i} f={f} value={values[f.name]} onChange={(v) => set(f.name, v)} />;
  }

  if (loading) return <p className="text-ink-soft">{t("جارٍ التحميل…", "Loading…")}</p>;

  const canPreview = !isNew && !readonly && previewHref(type, values) !== null;
  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-24">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link href={`/cms/content/${type}`} className="text-xs font-semibold text-brand hover:text-brand-dark">← {label}</Link>
          <h1 className="mt-1 text-2xl font-extrabold text-ink">{isNew ? addLabelFor(type, lang) : (en ? `Edit: ${label}` : `تعديل: ${label}`)}</h1>
        </div>
        {canPreview && (
          <button
            type="button"
            onClick={doPreview}
            disabled={previewing}
            title={t("افتح الصفحة الحقيقية وشاهد تعديلاتك الحالية قبل الحفظ — لا تظهر للزوّار", "Open the real page and see your current changes before saving — visitors won't see them")}
            className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-white px-3.5 py-2 text-sm font-semibold text-brand transition-colors hover:bg-brand hover:text-white disabled:opacity-60"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></svg>
            {previewing ? t("جارٍ فتح المعاينة…", "Opening preview…") : t("معاينة التعديلات", "Preview Changes")}
          </button>
        )}
      </div>

      {/* نسبة الاكتمال */}
      {!readonly && (
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-line">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-ink">{t("اكتمال المحتوى", "Completion")}</span>
            <span className={`font-extrabold ${completion === 100 ? "text-emerald-600" : "text-brand"}`}>{completion}{en ? "%" : "٪"}</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface">
            <div className={`h-full rounded-full transition-all ${completion === 100 ? "bg-emerald-500" : "bg-brand"}`} style={{ width: `${completion}%` }} />
          </div>
          {completion < 100 && missing.length > 0 && (
            <p className="mt-2 text-xs text-ink-soft">{t("ناقص:", "Missing:")} {missing.slice(0, 4).join(en ? ", " : "، ")}{missing.length > 4 ? ` (+${missing.length - 4})` : ""}</p>
          )}
        </div>
      )}

      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

      <div className="space-y-7 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-line sm:p-8">
        {rows.map(renderRow)}
      </div>

      {/* شريط الحفظ */}
      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-line bg-white/95 px-6 py-3 backdrop-blur lg:right-72">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-emerald-600">{ok}</span>
            {dirty && !ok && <span className="text-sm font-semibold text-amber-600">{t("• تعديلات غير محفوظة", "• Unsaved changes")}</span>}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {!isNew && hasDefault && (
              <button
                onClick={onResetDefault}
                disabled={resetting || saving}
                className="rounded-xl border border-line px-4 py-2.5 text-sm font-semibold text-ink-soft transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600 disabled:opacity-60"
              >
                {resetting ? t("جارٍ الاسترجاع…", "Restoring…") : t("استرجاع النسخة الافتراضية", "Restore Default")}
              </button>
            )}
            <button
              onClick={discard}
              disabled={!dirty || saving}
              className="rounded-xl border border-line px-4 py-2.5 text-sm font-semibold text-ink-soft transition-colors hover:bg-surface disabled:opacity-40"
            >
              {t("تجاهل التعديلات", "Discard changes")}
            </button>
            <button
              onClick={onSave}
              disabled={saving || !dirty}
              className="rounded-xl bg-brand px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-brand-dark disabled:opacity-60"
            >
              {saving ? t("جارٍ الحفظ…", "Saving…") : t("حفظ التعديلات", "Save Changes")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// شارة «الدور» — توضّح للمحرّر كيف يظهر هذا الحقل في الموقع (عنوان كبير/فرعي/قائمة…)
const ROLE_BY_BASE: Record<string, { t: string; e: string; c: string }> = {
  title: { t: "عنوان رئيسي", e: "Main Heading", c: "bg-brand/15 text-brand-dark" },
  name: { t: "عنوان رئيسي", e: "Main Heading", c: "bg-brand/15 text-brand-dark" },
  heading: { t: "عنوان رئيسي", e: "Main Heading", c: "bg-brand/15 text-brand-dark" },
  subtitle: { t: "عنوان فرعي", e: "Subheading", c: "bg-amber-100 text-amber-700" },
  about_heading: { t: "عنوان فرعي", e: "Subheading", c: "bg-amber-100 text-amber-700" },
  badge: { t: "وسم صغير", e: "Small Badge", c: "bg-violet-100 text-violet-700" },
};
function roleFor(f: FieldSchema, en: boolean): { t: string; c: string } | null {
  if (f.type === "json") return { t: en ? "List / Cards" : "قائمة / بطاقات", c: "bg-sky-100 text-sky-700" };
  if (f.type === "textarea") return { t: en ? "Paragraph Text" : "نص فقرة", c: "bg-slate-100 text-slate-600" };
  const r = ROLE_BY_BASE[f.base];
  return r ? { t: en ? r.e : r.t, c: r.c } : null;
}

function Label({ f, badge }: { f: FieldSchema; badge?: string }) {
  const { lang } = useCmsLang();
  const en = lang === "en";
  const resolved = (f as FieldSchema & { _labelResolved?: boolean })._labelResolved;
  const label = en ? (resolved ? f.label : (fieldLabelEn(f.name) || f.label)) : f.label;
  const role = badge === "English" ? null : roleFor(f, en); // الشارة مرة واحدة (الجانب العربي)
  return (
    <label className="mb-2 flex flex-wrap items-center gap-2 text-sm font-semibold text-ink">
      {label}
      {f.required && <span className="text-red-500">*</span>}
      {role && <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${role.c}`}>{role.t}</span>}
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
const OBJECT_FIELDS: Record<string, { key: string; label: string; label_en?: string }[]> = {
  about_tag: [
    { key: "heading", label: "عنوان البطاقة (مثال: الفئات المستهدفة)", label_en: "Card title (e.g. Target Groups)" },
    { key: "label", label: "نص البطاقة (مثال: الأفراد من ذوي الإعاقة)", label_en: "Card text (e.g. Individuals with disabilities)" },
  ],
};

// رابط الصفحة الحقيقية المقابلة للعنصر (لزر «عاين هذه الصفحة»)
const PAGE_URL: Record<string, string> = {
  home: "/", about: "/about", success: "/success-stories", specialists: "/specialists",
  assessment: "/assessment", branches: "/branches", careers: "/careers", news: "/news",
  programs: "/programs", header: "/", footer: "/",
};
function previewHref(type: string, v: Record<string, unknown>): string | null {
  const slug = String(v.slug ?? "");
  switch (type) {
    case "programs": return slug ? `/programs/${slug}` : "/programs";
    case "services": return slug ? `/services/${slug}` : "/programs";
    case "techniques": return slug ? `/techniques/${slug}` : "/programs";
    case "branches": return slug ? `/branches/${slug}` : "/branches";
    case "careers": return slug ? `/careers/${slug}` : "/careers";
    case "news": return slug ? `/news/${slug}` : "/news";
    case "specialists": return "/specialists";
    case "success": return "/success-stories";
    case "assessment-cards": return "/assessment";
    case "service-cards": return "/programs";
    case "hero": case "stats": case "features": return "/";
    case "gallery": return "/gallery";
    case "site": return "/";
    case "sections": return PAGE_URL[String(v.page ?? "")] ?? null;
    default: return null;
  }
}

// حقول مخفية من الفورم (الترتيب يُدار بأسهم القائمة)
// «مسار الصورة» النصّي مخفي — الصورة تُدار بأداة الرفع (image_file) التي تعرض الصورة الحالية تلقائياً
const HIDDEN_IN_FORM = new Set(["order", "page", "image"]);
// حقول تقنية/اختيارية تُخفى إن كانت فارغة (تقليل التشويش لمن لا يحتاجها)
// تشمل حقول البرامج الشرطية (قائمة الفئة المستهدفة + المحطات التطبيقية):
// تظهر فقط في البرامج التي تستخدمها فعلاً على الصفحة، وتختفي في غيرها.
const HIDE_IF_EMPTY = new Set([
  "icon", "value", "color", "href", "data_ar", "data_en",
  "target_list_ar", "target_list_en",
  "stations_intro_ar", "stations_intro_en",
  "stations_ar", "stations_en",
  "about_tag_ar", "about_tag_en",  // البطاقة المميّزة — تظهر فقط للخدمات التي تستخدمها
  "help_section_ar", "help_section_en",  // قسم المساعدة في التقنيات — يظهر فقط لمن يستخدمه
  "about_list_ar", "about_list_en",  // نقاط النبذة — تظهر فقط للخدمات التي تستخدمها
]);
// نص زر الإضافة لكل قائمة (حسب اسم الحقل) — ليكون واضحاً ما الذي يُضاف
const LIST_ADD_LABELS: Record<string, string> = {
  target_tags: "إضافة وسم", target_list: "إضافة نقطة",
  methods: "إضافة أسلوب", training_areas: "إضافة مجال",
  about: "إضافة فقرة", paragraphs: "إضافة فقرة",
  stations: "إضافة محطة", responsibilities: "إضافة مهمة",
  requirements: "إضافة متطلب", question_list: "إضافة سؤال",
  targets: "إضافة فئة", offers: "إضافة عنصر",
  values: "إضافة نتيجة", benefits: "إضافة بند",
  bullets: "إضافة نقطة", tags: "إضافة وسم",
  qualifications: "إضافة مؤهّل", days: "إضافة يوم",
};
const LIST_ADD_LABELS_EN: Record<string, string> = {
  target_tags: "Add Tag", target_list: "Add Point",
  methods: "Add Method", training_areas: "Add Area",
  about: "Add Paragraph", paragraphs: "Add Paragraph",
  stations: "Add Station", responsibilities: "Add Responsibility",
  requirements: "Add Requirement", question_list: "Add Question",
  targets: "Add Group", offers: "Add Item",
  values: "Add Outcome", benefits: "Add Item",
  bullets: "Add Point", tags: "Add Tag",
  qualifications: "Add Qualification", days: "Add Day",
};
const listAdd = (base: string, en = false) =>
  (en ? (LIST_ADD_LABELS_EN[base] || "Add Item") : (LIST_ADD_LABELS[base] || "إضافة عنصر"));

// حقول كارت الفعالية (في الأخبار) — تظهر فقط للفعاليات والورش
const EVENT_FIELDS = new Set([
  "time_ar", "time_en", "location_ar", "location_en", "map_url", "audience_ar", "audience_en",
  "seats_ar", "seats_en", "reg_status_ar", "reg_status_en",
]);
// حقول مقفولة (تُعرض للاطلاع فقط؛ تغييرها يكسر مكان المحتوى)
const LOCKED_FIELDS = new Set(["block"]);
// قوائم بطاقات — كل عنصر كائن بخانات معنونة بسيطة (بدل JSON)
const CARD_LIST_FIELDS: Record<string, { key: string; label: string; label_en?: string }[]> = {
  methods: [
    { key: "name", label: "اسم الأسلوب/المنهج (عنوان عريض — اختياري)", label_en: "Method/approach name (bold title — optional)" },
    { key: "desc", label: "وصف الأسلوب", label_en: "Method description" },
  ],
  training_areas: [
    { key: "title", label: "اسم المجال (عنوان عريض)", label_en: "Area name (bold title)" },
    { key: "desc", label: "وصف المجال", label_en: "Area description" },
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


const AR_MONTHS = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
const EN_MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const AR_DOW = ["أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"];
const EN_DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const isoOf = (y: number, m: number, d: number) => `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

// منتقي تاريخ (تقويم مخصّص) — اختيار فقط، بلا كتابة يدوية، ولا يسمح بتاريخ قبل اليوم. يخزّن ISO.
function DateField({ label, help, value, onChange }: { label?: string; help?: string; value: string; onChange: (v: string) => void }) {
  const { lang } = useCmsLang();
  const en = lang === "en";
  const t = (ar: string, e: string) => (en ? e : ar);
  const MONTHS = en ? EN_MONTHS : AR_MONTHS;
  const DOW = en ? EN_DOW : AR_DOW;
  const iso = /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : "";
  const sel = iso ? { y: +iso.slice(0, 4), m: +iso.slice(5, 7) - 1, d: +iso.slice(8, 10) } : null;
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(() => (sel ? new Date(sel.y, sel.m, 1) : (() => { const t = new Date(); return new Date(t.getFullYear(), t.getMonth(), 1); })()));
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [open]);

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const y = view.getFullYear(), m = view.getMonth();
  const firstDow = new Date(y, m, 1).getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(firstDow).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  const isPast = (d: number) => new Date(y, m, d) < today;
  const isToday = (d: number) => new Date(y, m, d).getTime() === today.getTime();
  const isSel = (d: number) => !!sel && sel.y === y && sel.m === m && sel.d === d;
  const canPrev = y > today.getFullYear() || (y === today.getFullYear() && m > today.getMonth());
  const display = sel ? (en ? `${MONTHS[sel.m]} ${sel.d}, ${sel.y}` : `${sel.d} ${MONTHS[sel.m]} ${sel.y}`) : t("اختر التاريخ", "Pick a date");
  const pick = (d: number) => { onChange(isoOf(y, m, d)); setOpen(false); };

  return (
    <div ref={ref} className="relative">
      {label && <label className="mb-1.5 block text-sm font-semibold text-ink">{label}</label>}
      <button type="button" onClick={() => setOpen((o) => !o)} className={INPUT + " flex items-center justify-between gap-2 text-start"}>
        <span className={sel ? "text-ink" : "text-ink-soft"}>{display}</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={sel ? "text-brand" : "text-ink-soft"} aria-hidden>
          <rect x="3" y="4.5" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="1.7" />
          <path d="M3 9h18M8 2.5v4M16 2.5v4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          <rect x="6.5" y="12" width="4" height="4" rx="1" fill="currentColor" />
        </svg>
      </button>

      {open && (
        <div className="absolute start-0 z-30 mt-2 w-[320px] rounded-2xl border border-line bg-white p-3 shadow-xl" dir={en ? "ltr" : "rtl"}>
          <div className="mb-2 flex items-center justify-between">
            <button type="button" disabled={!canPrev} onClick={() => setView(new Date(y, m - 1, 1))}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-ink transition-colors enabled:hover:bg-surface disabled:opacity-30" aria-label={t("الشهر السابق", "Previous month")}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <span className="text-sm font-bold text-ink">{MONTHS[m]} {y}</span>
            <button type="button" onClick={() => setView(new Date(y, m + 1, 1))}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-ink transition-colors hover:bg-surface" aria-label={t("الشهر التالي", "Next month")}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
          <div className="mb-1 grid grid-cols-7 gap-1">
            {DOW.map((w) => <div key={w} className="text-center text-[10px] font-medium text-ink-soft">{w}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((d, i) => d === null ? <div key={i} /> : (
              <button key={i} type="button" disabled={isPast(d)} onClick={() => pick(d)}
                className={"flex h-9 items-center justify-center rounded-lg text-sm transition-colors " + (
                  isSel(d) ? "bg-brand font-semibold text-white"
                  : isPast(d) ? "cursor-not-allowed text-ink-soft/30"
                  : isToday(d) ? "font-semibold text-brand ring-1 ring-brand/40 hover:bg-brand/10"
                  : "text-ink hover:bg-surface")}>
                {d}
              </button>
            ))}
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-line pt-2">
            <button type="button" onClick={() => { onChange(""); setOpen(false); }} className="text-xs text-ink-soft transition-colors hover:text-ink">{t("مسح", "Clear")}</button>
            <button type="button" onClick={() => { const d = new Date(); onChange(isoOf(d.getFullYear(), d.getMonth(), d.getDate())); setOpen(false); }} className="text-xs font-semibold text-brand hover:underline">{t("اليوم", "Today")}</button>
          </div>
        </div>
      )}
      {help && <Help text={help} />}
      {value && !iso && <p className="mt-1 text-[11px] text-amber-600">{en ? `The current value "${value}" is invalid — pick a date from the calendar.` : `القيمة الحالية «${value}» غير صالحة — اختر تاريخاً من التقويم.`}</p>}
    </div>
  );
}

// منتقي وقت (من / إلى) — يخزّن "HH:MM" أو "HH:MM - HH:MM"
function TimeRangeField({ label, help, value, onChange }: { label?: string; help?: string; value: string; onChange: (v: string) => void }) {
  const { lang } = useCmsLang();
  const en = lang === "en";
  const t = (ar: string, e: string) => (en ? e : ar);
  const norm = (s: string) => { const m = /^(\d{1,2}):(\d{2})$/.exec(s.trim()); return m ? `${m[1].padStart(2, "0")}:${m[2]}` : ""; };
  const range = /^(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})$/.exec(value.trim());
  const single = /^\d{1,2}:\d{2}$/.test(value.trim());
  const from = norm(range ? range[1] : single ? value : "");
  const to = norm(range ? range[2] : "");
  const parsed = !!range || single || !value.trim();
  const emit = (f: string, t: string) => onChange(f && t ? `${f} - ${t}` : f || "");
  return (
    <div>
      {label && <label className="mb-1.5 block text-sm font-semibold text-ink">{label}</label>}
      <div className="flex items-end gap-2">
        <label className="flex-1">
          <span className="mb-1 block text-[11px] text-ink-soft">{t("من", "From")}</span>
          <input type="time" value={from} dir="ltr" onChange={(e) => emit(e.target.value, to)} className={INPUT + " [color-scheme:light]"} />
        </label>
        <span className="pb-2.5 text-ink-soft">—</span>
        <label className="flex-1">
          <span className="mb-1 block text-[11px] text-ink-soft">{t("إلى (اختياري)", "To (optional)")}</span>
          <input type="time" value={to} dir="ltr" onChange={(e) => emit(from, e.target.value)} className={INPUT + " [color-scheme:light]"} />
        </label>
      </div>
      {help && <Help text={help} />}
      {value && !parsed && <p className="mt-1 text-[11px] text-amber-600">{en ? `The current value "${value}" is free text — pick a time from the pickers.` : `القيمة الحالية «${value}» نصّية — اختر الوقت من المنتقيين.`}</p>}
    </div>
  );
}

const LOCK_ICON = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline-block"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
);

// حقل نصّي مقفول — عرض فقط
function ReadOnlyField({ f, value, note }: { f: FieldSchema; value: string; note?: string }) {
  const { lang } = useCmsLang();
  const label = lang === "en" ? (fieldLabelEn(f.name) || f.label) : f.label;
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-ink-soft">{LOCK_ICON} {label}</label>
      <div className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-ink-soft">{value || "—"}</div>
      {note && <p className="mt-1 text-[11px] text-amber-600">{note}</p>}
    </div>
  );
}

// محتوى منظّم معقّد — عرض فقط (آمن من الكسر)
function ReadOnlyJson({ f, value }: { f: FieldSchema; value: unknown }) {
  const { lang } = useCmsLang();
  const en = lang === "en";
  const t = (ar: string, e: string) => (en ? e : ar);
  const label = en ? (fieldLabelEn(f.name) || f.label) : f.label;
  const count = Array.isArray(value) ? value.length : value && typeof value === "object" ? Object.keys(value).length : 0;
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-ink-soft">{LOCK_ICON} {label}</label>
      <details className="rounded-xl border border-line bg-surface">
        <summary className="cursor-pointer px-4 py-2.5 text-sm text-ink-soft">{en ? `Structured content (${count} items) — click to view` : `محتوى منظّم (${count} عنصر) — اضغط للعرض`}</summary>
        <pre dir="ltr" className="max-h-60 overflow-auto border-t border-line p-3 text-[11px] leading-5 text-ink-soft">{JSON.stringify(value, null, 2)}</pre>
      </details>
      <p className="mt-1 text-[11px] text-amber-600">{t("محتوى منظّم — للعرض فقط؛ لتعديله بأمان تواصل مع المطوّر.", "Structured content — view only; contact the developer to edit it safely.")}</p>
    </div>
  );
}

function FieldInput({ f, value, onChange, badge, dir }: { f: FieldSchema; value: unknown; onChange: (v: unknown) => void; badge?: string; dir?: string }) {
  const { lang } = useCmsLang();
  const en = lang === "en";
  const resolved = (f as FieldSchema & { _labelResolved?: boolean })._labelResolved;
  const label = en ? (resolved ? f.label : (fieldLabelEn(f.name) || f.label)) : f.label;
  const showHelp = badge !== "English"; // لا نكرّر الشرح على الجانب الإنجليزي
  if (f.type === "bool") {
    return (
      <div>
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3">
          <input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} className="h-5 w-5 accent-brand" />
          <span className="text-sm font-semibold text-ink">{label}</span>
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
        f.base === "offer_icons" ? (
          <IconListEditor value={value} onChange={onChange} />
        ) : OBJECT_FIELDS[f.base] ? (
          <ObjectEditor value={value} onChange={onChange} fields={OBJECT_FIELDS[f.base]} dir={dir} />
        ) : CARD_LIST_FIELDS[f.base] ? (
          <CardListEditor value={value} onChange={onChange} fields={CARD_LIST_FIELDS[f.base]} dir={dir} addLabel={listAdd(f.base, en)} />
        ) : COMPLEX_JSON.has(f.base) || isComplexJson(value) ? (
          <ReadOnlyJson f={f} value={value} />
        ) : isSimpleArray(value) || value == null ? (
          <ListEditor value={isSimpleArray(value) ? value : []} onChange={onChange} dir={dir} addLabel={listAdd(f.base, en)} />
        ) : (
          <ReadOnlyJson f={f} value={value} />
        )
      ) : f.type === "select" ? (
        <CustomSelect
          value={String(value ?? "")}
          onChange={onChange}
          placeholder={en ? "— Select —" : "— اختر —"}
          options={f.choices ?? []}
        />
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
      ) : f.base === "date" || /_date$/.test(f.base) ? (
        <DateField value={String(value ?? "")} onChange={(v) => onChange(v)} />
      ) : f.base === "time" || /_time$/.test(f.base) ? (
        <TimeRangeField value={String(value ?? "")} onChange={(v) => onChange(v)} />
      ) : (
        <AutoTextarea value={String(value ?? "")} onChange={onChange} dir={dir} />
      )}
      {showHelp && <Help text={f.help} />}
    </div>
  );
}

// منتقي أيقونات بصري — اختيار بدل كتابة الاسم
function IconPicker({ value, onChange, names }: { value: string; onChange: (v: string) => void; names: string[] }) {
  const { lang } = useCmsLang();
  const en = lang === "en";
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
          {en ? "None" : "بدون"}
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
        <p className="mt-1 text-[11px] text-amber-600">{en ? `The icon "${value}" is unknown — pick one from above.` : `الأيقونة «${value}» غير معروفة — اختر واحدة من الأعلى.`}</p>
      )}
    </div>
  );
}

// محرّر موقع — يلصق إحداثيات خرائط جوجل فتُقسَّم تلقائياً إلى خط عرض/طول
function LocationEditor({ lat, lng, onLat, onLng }: { lat: unknown; lng: unknown; onLat: (v: number | null) => void; onLng: (v: number | null) => void }) {
  const { lang } = useCmsLang();
  const en = lang === "en";
  const t = (ar: string, e: string) => (en ? e : ar);
  const num = (v: unknown) => (v === null || v === undefined || v === "" ? "" : String(v));
  const parsePaste = (s: string) => {
    const m = s.match(/(-?\d+(?:\.\d+)?)\s*[,\s]\s*(-?\d+(?:\.\d+)?)/);
    if (m) { onLat(parseFloat(m[1])); onLng(parseFloat(m[2])); }
  };
  return (
    <div className="space-y-3 rounded-xl border border-line bg-surface/50 p-3">
      <div>
        <p className="mb-1 text-xs font-semibold text-ink-soft">{t("الصق إحداثيات الموقع من خرائط جوجل", "Paste the location coordinates from Google Maps")}</p>
        <input
          dir="ltr"
          placeholder={t("مثال: 24.7136, 46.6753", "Example: 24.7136, 46.6753")}
          onChange={(e) => parsePaste(e.target.value)}
          className={INPUT + " bg-white font-mono"}
        />
        <p className="mt-1 text-[11px] text-ink-soft">{t("في خرائط جوجل: كليك يمين على موقع الفرع بالضبط ← انسخ أول سطر (الأرقام) ← الصقه هنا.", "In Google Maps: right-click on the exact branch location → copy the first line (the numbers) → paste it here.")}</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="mb-1 text-xs font-semibold text-ink-soft">{t("خط العرض (lat)", "Latitude (lat)")}</p>
          <input type="number" step="any" dir="ltr" value={num(lat)} onChange={(e) => onLat(e.target.value === "" ? null : Number(e.target.value))} className={INPUT + " bg-white"} />
        </div>
        <div>
          <p className="mb-1 text-xs font-semibold text-ink-soft">{t("خط الطول (lng)", "Longitude (lng)")}</p>
          <input type="number" step="any" dir="ltr" value={num(lng)} onChange={(e) => onLng(e.target.value === "" ? null : Number(e.target.value))} className={INPUT + " bg-white"} />
        </div>
      </div>
      {(num(lat) || num(lng)) && (
        <a href={`https://www.google.com/maps/search/?api=1&query=${num(lat)},${num(lng)}`} target="_blank" rel="noopener" className="inline-block text-xs font-semibold text-brand hover:underline">{t("معاينة الموقع على الخريطة ↗", "Preview location on the map ↗")}</a>
      )}
    </div>
  );
}

// محرّر معرض صور — رفع متعدد + معاينة مصغّرة + حذف/ترتيب (يخزّن قائمة روابط)
function GalleryEditor({ value, onChange }: { value: unknown; onChange: (v: unknown) => void }) {
  const { lang } = useCmsLang();
  const en = lang === "en";
  const t = (ar: string, e: string) => (en ? e : ar);
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
        if (f.size > 5 * 1024 * 1024) { setErr(t("بعض الصور أكبر من 5 ميجابايت — تم تخطّيها.", "Some images are larger than 5 MB — they were skipped.")); continue; }
        const r = await uploadImage(f);
        added.push(r.url);
      }
      if (added.length) onChange([...urls, ...added]);
    } catch (e) {
      setErr(e instanceof Error ? e.message : t("تعذّر رفع بعض الصور.", "Could not upload some images."));
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
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="rounded p-0.5 text-white/90 hover:text-white disabled:opacity-30" title={t("لليمين", "Move earlier")}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" d="M9 6l6 6-6 6" /></svg>
              </button>
              <button type="button" onClick={() => remove(i)} className="rounded bg-red-500/90 px-1.5 py-0.5 text-[10px] font-bold text-white" title={t("حذف", "Remove")}>{t("حذف", "Remove")}</button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === urls.length - 1} className="rounded p-0.5 text-white/90 hover:text-white disabled:opacity-30" title={t("لليسار", "Move later")}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" d="M15 6l-6 6 6 6" /></svg>
              </button>
            </div>
          </div>
        ))}
        <label className={`flex aspect-square cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-line text-ink-soft transition-colors hover:border-brand/50 hover:text-brand ${busy ? "opacity-60" : ""}`}>
          {busy ? (
            <span className="text-xs font-semibold">{t("جارٍ الرفع…", "Uploading…")}</span>
          ) : (
            <>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
              <span className="text-xs font-semibold">{t("إضافة صور", "Add Images")}</span>
            </>
          )}
          <input type="file" accept="image/*" multiple onChange={onFiles} disabled={busy} className="hidden" />
        </label>
      </div>
      {urls.length === 0 && <p className="mt-2 text-xs text-ink-soft">{t("لا توجد صور بعد — اضغط «إضافة صور» لرفع صور هذا الفرع.", "No images yet — click “Add Images” to upload this branch's photos.")}</p>}
      {err && <p className="mt-1 text-xs text-red-600">{err}</p>}
    </div>
  );
}

// محرّر كائن — خانات بسيطة معنونة بدل كود JSON (مثل البطاقة المميّزة: عنوان + نص)
function ObjectEditor({ value, onChange, fields, dir }: { value: unknown; onChange: (v: unknown) => void; fields: { key: string; label: string; label_en?: string }[]; dir?: string }) {
  const { lang } = useCmsLang();
  const en = lang === "en";
  const flLabel = (fl: { label: string; label_en?: string }) => (en ? (fl.label_en || fl.label) : fl.label);
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
          <p className="mb-1 text-xs font-semibold text-ink-soft">{flLabel(fl)}</p>
          <AutoTextarea value={String(obj[fl.key] ?? "")} onChange={(v) => set(fl.key, v)} dir={dir} className={INPUT + " bg-white"} />
        </div>
      ))}
      <p className="text-[11px] text-ink-soft">{en ? "Leave empty if the service doesn't need a featured card." : "اتركها فارغة إن لم تكن الخدمة تحتاج بطاقة مميّزة."}</p>
    </div>
  );
}

// محرّر قائمة بطاقات — كل عنصر كائن بخانات معنونة (بدل قائمة JSON مركّبة)
function CardListEditor({ value, onChange, fields, dir, addLabel }: { value: unknown; onChange: (v: unknown) => void; fields: { key: string; label: string; label_en?: string }[]; dir?: string; addLabel?: string }) {
  const { lang } = useCmsLang();
  const en = lang === "en";
  const flLabel = (fl: { label: string; label_en?: string }) => (en ? (fl.label_en || fl.label) : fl.label);
  const addTxt = addLabel ?? (en ? "Add Item" : "إضافة عنصر");
  const items = (Array.isArray(value) ? value : []).filter((x) => x && typeof x === "object" && !Array.isArray(x)) as Record<string, unknown>[];
  const update = (i: number, key: string, v: string) => onChange(items.map((it, j) => (j === i ? { ...it, [key]: v } : it)));
  const remove = (i: number) => onChange(items.filter((_, j) => j !== i));
  const add = () => onChange([...items, Object.fromEntries(fields.map((fl) => [fl.key, ""]))]);
  return (
    <div className="space-y-3">
      {items.length === 0 && <p className="rounded-xl border border-dashed border-line bg-surface px-4 py-2.5 text-xs text-ink-soft">{en ? "No items — click “Add Item”." : "لا توجد عناصر — اضغط «إضافة عنصر»."}</p>}
      {items.map((it, i) => (
        <div key={i} className="rounded-xl border border-line bg-surface/50 p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-brand/10 px-2 text-[11px] font-bold text-brand">{en ? `Item ${i + 1}` : `عنصر ${i + 1}`}</span>
            <button type="button" onClick={() => remove(i)} className="rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-600 hover:text-white">{en ? "Remove" : "حذف"}</button>
          </div>
          <div className="space-y-2">
            {fields.map((fl) => (
              <div key={fl.key}>
                <p className="mb-1 text-xs font-semibold text-ink-soft">{flLabel(fl)}</p>
                <AutoTextarea value={String(it[fl.key] ?? "")} onChange={(v) => update(i, fl.key, v)} dir={dir} className={INPUT + " bg-white"} />
              </div>
            ))}
          </div>
        </div>
      ))}
      <button type="button" onClick={add} className="inline-flex items-center gap-1.5 rounded-lg bg-brand/10 px-3 py-1.5 text-xs font-semibold text-brand transition-colors hover:bg-brand hover:text-white">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" d="M12 5v14M5 12h14" /></svg>
        {addTxt}
      </button>
    </div>
  );
}

// محرّر قوائم سهل — صفّ لكل عنصر مع زر حذف + زر إضافة (بدل JSON)
function ListEditor({ value, onChange, dir, addLabel }: { value: (string | number)[]; onChange: (v: unknown) => void; dir?: string; addLabel?: string }) {
  const { lang } = useCmsLang();
  const en = lang === "en";
  const addTxt = addLabel ?? (en ? "Add Item" : "إضافة عنصر");
  const items = value.map(String);
  const update = (i: number, v: string) => { const copy = [...items]; copy[i] = v; onChange(copy); };
  const remove = (i: number) => onChange(items.filter((_, j) => j !== i));
  const add = () => onChange([...items, ""]);
  return (
    <div className="space-y-2">
      {items.length === 0 && <p className="rounded-xl border border-dashed border-line bg-surface px-4 py-2.5 text-xs text-ink-soft">{en ? "No items — click “Add Item”." : "لا توجد عناصر — اضغط «إضافة عنصر»."}</p>}
      {items.map((it, i) => (
        <div key={i} className="flex items-start gap-2">
          <span className="mt-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface text-[11px] font-bold text-ink-soft">{i + 1}</span>
          <div className="flex-1"><AutoTextarea value={it} onChange={(v) => update(i, v)} dir={dir} /></div>
          <button type="button" onClick={() => remove(i)} className="mt-1 shrink-0 rounded-lg bg-red-50 px-2.5 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-600 hover:text-white">{en ? "Remove" : "حذف"}</button>
        </div>
      ))}
      <button type="button" onClick={add} className="inline-flex items-center gap-1.5 rounded-lg bg-brand/10 px-3 py-1.5 text-xs font-semibold text-brand transition-colors hover:bg-brand hover:text-white">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" d="M12 5v14M5 12h14" /></svg>
        {addTxt}
      </button>
    </div>
  );
}

// ===================== محرّر أقسام صفحة الخدمة (blocks) =====================
// كل خدمة عيادية لها قائمة «أقسام» (blocks) بأنواع مختلفة. نعرضها بمحرّر منظّم
// يتيح تعديل كل النصوص (عربي/إنجليزي) مع الحفاظ على النوع والشكل (التصميم ثابت).
type Rec = Record<string, unknown>;
const blkStr = (v: unknown): string => (typeof v === "string" ? v : v == null ? "" : String(v));
const blkArr = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const blkStrArr = (v: unknown): string[] => blkArr(v).map((x) => blkStr(x));
const blkObj = (v: unknown): Rec => (v && typeof v === "object" && !Array.isArray(v) ? (v as Rec) : {});
const blkObjArr = (v: unknown): Rec[] => blkArr(v).map((x) => blkObj(x));

const BLOCK_KIND_LABEL: Record<string, string> = {
  cards: "بطاقات (عنوان + وصف لكل بطاقة)",
  prose: "فقرات نصّية",
  agePrograms: "برامج حسب الفئة العمرية",
  pills: "وسوم (أزرار صغيرة)",
  tiles: "مربّعات",
  checklist: "قائمة بعلامات صح ✓",
  areas: "مجالات (عنوان + وصف لكل مجال)",
};
const BLOCK_KIND_LABEL_EN: Record<string, string> = {
  cards: "Cards (title + description per card)",
  prose: "Text paragraphs",
  agePrograms: "Programs by age group",
  pills: "Pills (small buttons)",
  tiles: "Tiles",
  checklist: "Checklist with ✓ marks",
  areas: "Areas (title + description per area)",
};

function blockSkeleton(kind: string): Rec {
  if (kind === "prose") return { kind, heading: "", paragraphs: [] };
  if (kind === "agePrograms") return { kind, heading: "", adult: { title: "", sub: "", label: "" }, child: { title: "", label: "", levels: [] } };
  return { kind, heading: "", intro: "", items: [] };
}

// حقل نصّي ثنائي اللغة (عربي يمين / إنجليزي يسار)
function BiScalar({ label, a, e, onA, onE }: { label: string; a: string; e: string; onA: (v: string) => void; onE: (v: string) => void }) {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold text-ink-soft">{label}</p>
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="relative">
          <span className="absolute -top-0 left-2 hidden">ع</span>
          <AutoTextarea value={a} onChange={onA} className={INPUT + " bg-white"} />
        </div>
        <AutoTextarea value={e} onChange={onE} dir="ltr" className={INPUT + " bg-white"} />
      </div>
    </div>
  );
}

// حقل نصّي اختياري — يُخفى إن كان فارغاً ويظهر زر صغير لإضافته (تقليل التشويش)
function OptionalScalar({ label, addLabel, a, e, onA, onE }: { label: string; addLabel: string; a: string; e: string; onA: (v: string) => void; onE: (v: string) => void }) {
  const has = a.trim() !== "" || e.trim() !== "";
  const [show, setShow] = useState(false);
  if (!has && !show) {
    return <button type="button" onClick={() => setShow(true)} className="text-[11px] font-semibold text-brand hover:underline">+ {addLabel}</button>;
  }
  return <BiScalar label={label} a={a} e={e} onA={onA} onE={onE} />;
}

// قائمة نصوص ثنائية اللغة (صفّ لكل عنصر: عربي + إنجليزي + حذف)
function BiStrList({ a, e, onChange, addLabel }: { a: string[]; e: string[]; onChange: (a: string[], e: string[]) => void; addLabel?: string }) {
  const { lang } = useCmsLang();
  const isEn = lang === "en";
  const addTxt = addLabel ?? (isEn ? "Add Item" : "إضافة عنصر");
  const n = Math.max(a.length, e.length);
  const norm = (arr: string[]) => { const c = [...arr]; while (c.length < n) c.push(""); return c; };
  const setRow = (i: number, av: string, ev: string) => { const na = norm(a); const ne = norm(e); na[i] = av; ne[i] = ev; onChange(na, ne); };
  const removeRow = (i: number) => onChange(norm(a).filter((_, j) => j !== i), norm(e).filter((_, j) => j !== i));
  const add = () => onChange([...a, ""], [...e, ""]);
  return (
    <div className="space-y-2">
      {n === 0 && <p className="rounded-xl border border-dashed border-line bg-surface px-3 py-2 text-[11px] text-ink-soft">{isEn ? "No items — click “Add Item”." : "لا توجد عناصر — اضغط «إضافة عنصر»."}</p>}
      {Array.from({ length: n }, (_, i) => (
        <div key={i} className="flex items-start gap-2">
          <span className="mt-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-surface text-[10px] font-bold text-ink-soft">{i + 1}</span>
          <div className="grid flex-1 gap-2 sm:grid-cols-2">
            <AutoTextarea value={a[i] ?? ""} onChange={(v) => setRow(i, v, e[i] ?? "")} className={INPUT + " bg-white"} />
            <AutoTextarea value={e[i] ?? ""} onChange={(v) => setRow(i, a[i] ?? "", v)} dir="ltr" className={INPUT + " bg-white"} />
          </div>
          <button type="button" onClick={() => removeRow(i)} className="mt-1 shrink-0 rounded-lg bg-red-50 px-2 py-1.5 text-[11px] font-semibold text-red-600 hover:bg-red-600 hover:text-white">{isEn ? "Remove" : "حذف"}</button>
        </div>
      ))}
      <button type="button" onClick={add} className="inline-flex items-center gap-1 rounded-lg bg-brand/10 px-2.5 py-1 text-[11px] font-semibold text-brand hover:bg-brand hover:text-white">+ {addTxt}</button>
    </div>
  );
}

type ItemFieldSchema = { key: string; label: string; label_en?: string; list?: boolean; optional?: boolean };

// عنصر واحد داخل قائمة البطاقات/المجالات — يُظهر الحقول الأساسية فقط،
// والحقول الاختيارية الفارغة تُخفى خلف زر صغير لتقليل التشويش
function ObjItem({ index, ia, ie, schema, onChange, onRemove }: { index: number; ia: Rec; ie: Rec; schema: ItemFieldSchema[]; onChange: (av: Rec, ev: Rec) => void; onRemove: () => void }) {
  const { lang } = useCmsLang();
  const en = lang === "en";
  const hasVal = (s: ItemFieldSchema) => s.list
    ? (blkStrArr(ia[s.key]).length > 0 || blkStrArr(ie[s.key]).length > 0)
    : (blkStr(ia[s.key]).trim() !== "" || blkStr(ie[s.key]).trim() !== "");
  const [showExtra, setShowExtra] = useState(false);
  const sLabel = (s: ItemFieldSchema) => (en ? (s.label_en || s.label) : s.label);
  const hiddenExtras = schema.filter((s) => s.optional && !hasVal(s));
  const visible = schema.filter((s) => !s.optional || hasVal(s) || showExtra);
  return (
    <div className="rounded-xl border border-line bg-white p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand/10 px-2 text-[10px] font-bold text-brand">{en ? `Item ${index + 1}` : `عنصر ${index + 1}`}</span>
        <button type="button" onClick={onRemove} className="rounded-lg bg-red-50 px-2 py-1 text-[11px] font-semibold text-red-600 hover:bg-red-600 hover:text-white">{en ? "Remove" : "حذف"}</button>
      </div>
      <div className="space-y-2">
        {visible.map((s) => s.list ? (
          <div key={s.key}>
            <p className="mb-1 text-xs font-semibold text-ink-soft">{sLabel(s)}</p>
            <BiStrList a={blkStrArr(ia[s.key])} e={blkStrArr(ie[s.key])} addLabel={listAdd(s.key, en)} onChange={(av, ev) => onChange({ ...ia, [s.key]: av }, { ...ie, [s.key]: ev })} />
          </div>
        ) : (
          <BiScalar key={s.key} label={sLabel(s)} a={blkStr(ia[s.key])} e={blkStr(ie[s.key])} onA={(v) => onChange({ ...ia, [s.key]: v }, { ...ie })} onE={(v) => onChange({ ...ia }, { ...ie, [s.key]: v })} />
        ))}
      </div>
      {hiddenExtras.length > 0 && (
        <button type="button" onClick={() => setShowExtra((s) => !s)} className="mt-2 text-[11px] font-semibold text-brand hover:underline">
          {showExtra ? (en ? "Hide extra fields" : "إخفاء الحقول الإضافية") : (en ? `+ Optional extra fields (${hiddenExtras.length})` : `+ حقول إضافية اختيارية (${hiddenExtras.length})`)}
        </button>
      )}
    </div>
  );
}

// محرّر قائمة بطاقات/مجالات ثنائي اللغة (كل عنصر كائن بخاناته)
function ObjItemsEditor({ a, e, onChange, schema, addLabel }: { a: Rec[]; e: Rec[]; onChange: (a: Rec[], e: Rec[]) => void; schema: ItemFieldSchema[]; addLabel: string }) {
  const { lang } = useCmsLang();
  const isEn = lang === "en";
  const n = Math.max(a.length, e.length);
  const norm = (arr: Rec[]) => { const c = arr.map(blkObj); while (c.length < n) c.push({}); return c; };
  const patch = (i: number, av: Rec, ev: Rec) => { const na = norm(a); const ne = norm(e); na[i] = av; ne[i] = ev; onChange(na, ne); };
  const removeAt = (i: number) => onChange(norm(a).filter((_, j) => j !== i), norm(e).filter((_, j) => j !== i));
  // عنصر جديد يبدأ بالحقول الأساسية فقط (غير الاختيارية)
  const blank = () => Object.fromEntries(schema.filter((s) => !s.optional).map((s) => [s.key, s.list ? [] : ""])) as Rec;
  const add = () => onChange([...a.map(blkObj), blank()], [...e.map(blkObj), blank()]);
  return (
    <div className="space-y-2">
      {n === 0 && <p className="rounded-xl border border-dashed border-line bg-surface px-3 py-2 text-[11px] text-ink-soft">{isEn ? `No items — click “${addLabel}”.` : `لا توجد عناصر — اضغط «${addLabel}».`}</p>}
      {Array.from({ length: n }, (_, i) => (
        <ObjItem key={i} index={i} ia={blkObj(a[i])} ie={blkObj(e[i] ?? a[i])} schema={schema}
          onChange={(av, ev) => patch(i, av, ev)} onRemove={() => removeAt(i)} />
      ))}
      <button type="button" onClick={add} className="inline-flex items-center gap-1 rounded-lg bg-brand/10 px-2.5 py-1 text-[11px] font-semibold text-brand hover:bg-brand hover:text-white">+ {addLabel}</button>
    </div>
  );
}

function BlocksEditor({ ar, en, onChange }: { ar: unknown[]; en: unknown[]; onChange: (ar: Rec[], en: Rec[]) => void }) {
  const { lang } = useCmsLang();
  const isEn = lang === "en";
  const tt = (arTxt: string, e: string) => (isEn ? e : arTxt);
  const [addKind, setAddKind] = useState("cards");
  const n = Math.max(ar.length, en.length);
  const pairs = Array.from({ length: n }, (_, i) => ({ a: blkObj(ar[i]), e: blkObj(en[i] ?? ar[i]) }));
  const commit = (next: { a: Rec; e: Rec }[]) => onChange(next.map((p) => p.a), next.map((p) => p.e));
  const patch = (i: number, av: Rec, ev: Rec) => commit(pairs.map((p, j) => (j === i ? { a: av, e: ev } : p)));
  const move = (i: number, dir: -1 | 1) => { const j = i + dir; if (j < 0 || j >= n) return; const next = [...pairs]; [next[i], next[j]] = [next[j], next[i]]; commit(next); };
  const removeAt = (i: number) => commit(pairs.filter((_, j) => j !== i));
  const add = () => commit([...pairs, { a: blockSkeleton(addKind), e: blockSkeleton(addKind) }]);

  return (
    <div className="space-y-4">
      {n === 0 && <p className="rounded-xl border border-dashed border-line bg-surface px-4 py-3 text-xs text-ink-soft">{tt("لا توجد أقسام بعد — أضف قسماً من الأسفل.", "No sections yet — add one from below.")}</p>}
      {pairs.map((p, i) => {
        const kind = blkStr(p.a.kind || p.e.kind);
        const sc = (key: string, label: string) => (
          <BiScalar key={key} label={label} a={blkStr(p.a[key])} e={blkStr(p.e[key])}
            onA={(v) => patch(i, { ...p.a, [key]: v }, { ...p.e })} onE={(v) => patch(i, { ...p.a }, { ...p.e, [key]: v })} />
        );
        const strList = (key: string, label: string) => (
          <div key={key}>
            <p className="mb-1 text-xs font-semibold text-ink-soft">{label}</p>
            <BiStrList a={blkStrArr(p.a[key])} e={blkStrArr(p.e[key])} addLabel={listAdd(key, isEn)} onChange={(av, ev) => patch(i, { ...p.a, [key]: av }, { ...p.e, [key]: ev })} />
          </div>
        );
        const introField = (key: string) => (
          <OptionalScalar key={key} label={tt("مقدمة (سطر تعريفي تحت العنوان)", "Introduction (a short line under the heading)")} addLabel={tt("إضافة مقدمة", "Add introduction")}
            a={blkStr(p.a[key])} e={blkStr(p.e[key])}
            onA={(v) => patch(i, { ...p.a, [key]: v }, { ...p.e })} onE={(v) => patch(i, { ...p.a }, { ...p.e, [key]: v })} />
        );
        const objList = (key: string, schema: ItemFieldSchema[], addLabel: string) => (
          <div key={key}>
            <ObjItemsEditor a={blkObjArr(p.a[key])} e={blkObjArr(p.e[key])} schema={schema} addLabel={addLabel}
              onChange={(av, ev) => patch(i, { ...p.a, [key]: av }, { ...p.e, [key]: ev })} />
          </div>
        );
        const nestScalar = (objKey: string, key: string, label: string) => (
          <BiScalar key={objKey + key} label={label} a={blkStr(blkObj(p.a[objKey])[key])} e={blkStr(blkObj(p.e[objKey])[key])}
            onA={(v) => patch(i, { ...p.a, [objKey]: { ...blkObj(p.a[objKey]), [key]: v } }, { ...p.e })}
            onE={(v) => patch(i, { ...p.a }, { ...p.e, [objKey]: { ...blkObj(p.e[objKey]), [key]: v } })} />
        );

        let body: React.ReactNode;
        if (kind === "prose") body = <>{sc("heading", tt("العنوان", "Heading"))}{strList("paragraphs", tt("الفقرات", "Paragraphs"))}</>;
        else if (kind === "pills") body = <>{sc("heading", tt("العنوان", "Heading"))}{introField("intro")}{strList("items", tt("الوسوم", "Pills"))}</>;
        else if (kind === "tiles") body = <>{sc("heading", tt("العنوان", "Heading"))}{introField("intro")}{strList("items", tt("المربّعات", "Tiles"))}</>;
        else if (kind === "checklist") body = <>{sc("heading", tt("العنوان (اختياري)", "Heading (optional)"))}{introField("intro")}{strList("items", tt("عناصر القائمة", "Checklist items"))}</>;
        else if (kind === "areas") body = <>{sc("heading", tt("العنوان", "Heading"))}{introField("intro")}{objList("items", [{ key: "title", label: "العنوان", label_en: "Title" }, { key: "desc", label: "الوصف", label_en: "Description" }], tt("إضافة مجال", "Add Area"))}</>;
        else if (kind === "cards") body = <>{sc("heading", tt("العنوان", "Heading"))}{introField("intro")}{objList("items", [{ key: "title", label: "عنوان البطاقة", label_en: "Card title" }, { key: "desc", label: "الوصف", label_en: "Description" }, { key: "sub", label: "نص جانبي صغير", label_en: "Small side text", optional: true }, { key: "bullets", label: "نقاط", label_en: "Bullets", list: true, optional: true }, { key: "tags", label: "وسوم", label_en: "Tags", list: true, optional: true }], tt("إضافة بطاقة", "Add Card"))}</>;
        else if (kind === "agePrograms") body = (
          <>
            {sc("heading", tt("العنوان", "Heading"))}
            <div className="rounded-xl border border-line bg-white p-3">
              <p className="mb-2 text-xs font-bold text-ink">{tt("بطاقة الكبار", "Adults Card")}</p>
              <div className="space-y-2">{nestScalar("adult", "title", tt("العنوان", "Title"))}{nestScalar("adult", "sub", tt("الوصف", "Description"))}{nestScalar("adult", "label", tt("الوسم", "Badge"))}</div>
            </div>
            <div className="rounded-xl border border-line bg-white p-3">
              <p className="mb-2 text-xs font-bold text-ink">{tt("بطاقة الأطفال", "Children Card")}</p>
              <div className="space-y-2">
                {nestScalar("child", "title", tt("العنوان", "Title"))}{nestScalar("child", "label", tt("الوصف", "Description"))}
                <div>
                  <p className="mb-1 text-xs font-semibold text-ink-soft">{tt("المستويات", "Levels")}</p>
                  <BiStrList a={blkStrArr(blkObj(p.a.child).levels)} e={blkStrArr(blkObj(p.e.child).levels)} addLabel={tt("إضافة مستوى", "Add Level")}
                    onChange={(av, ev) => patch(i, { ...p.a, child: { ...blkObj(p.a.child), levels: av } }, { ...p.e, child: { ...blkObj(p.e.child), levels: ev } })} />
                </div>
              </div>
            </div>
          </>
        );
        else body = sc("heading", tt("العنوان", "Heading"));

        return (
          <div key={i} className="rounded-2xl border border-line bg-surface/40 p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-brand px-2 text-[11px] font-bold text-white">{tt(`قسم ${i + 1}`, `Section ${i + 1}`)}</span>
                <span className="rounded-lg bg-brand/10 px-2 py-1 text-[11px] font-bold text-brand">{(isEn ? BLOCK_KIND_LABEL_EN[kind] : BLOCK_KIND_LABEL[kind]) || kind}</span>
              </div>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="rounded-lg border border-line bg-white px-2 py-1 text-xs font-bold text-ink-soft hover:border-brand hover:text-brand disabled:opacity-30" title={tt("أعلى", "Move up")}>↑</button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === n - 1} className="rounded-lg border border-line bg-white px-2 py-1 text-xs font-bold text-ink-soft hover:border-brand hover:text-brand disabled:opacity-30" title={tt("أسفل", "Move down")}>↓</button>
                <button type="button" onClick={() => removeAt(i)} className="rounded-lg bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-600 hover:bg-red-600 hover:text-white">{tt("حذف القسم", "Remove Section")}</button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 px-1 pb-2 text-[10px] font-bold text-ink-soft">
              <span>{tt("عربي", "Arabic")}</span><span dir="ltr">English</span>
            </div>
            <div className="space-y-3">{body}</div>
          </div>
        );
      })}
      <div className="flex flex-wrap items-center gap-2 border-t border-line pt-3">
        <span className="text-xs font-semibold text-ink-soft">{tt("إضافة قسم جديد:", "Add a new section:")}</span>
        <div className="w-48">
          <CustomSelect
            value={addKind}
            onChange={setAddKind}
            options={Object.entries(isEn ? BLOCK_KIND_LABEL_EN : BLOCK_KIND_LABEL).map(([k, l]) => ({ value: k, label: String(l) }))}
          />
        </div>
        <button type="button" onClick={add} className="inline-flex items-center gap-1 rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-dark">+ {tt("إضافة القسم", "Add Section")}</button>
      </div>
    </div>
  );
}

// محرّر قسم «كيف يساعد…» في التقنيات — عنوان + بطاقتين (فوائد + قيمة تربوية)، عربي/إنجليزي
function HelpSectionEditor({ ar, en, onChange }: { ar: Rec; en: Rec; onChange: (ar: Rec, en: Rec) => void }) {
  const { lang } = useCmsLang();
  const isEn = lang === "en";
  const tt = (arTxt: string, e: string) => (isEn ? e : arTxt);
  const sc = (key: string, label: string) => (
    <BiScalar label={label} a={blkStr(ar[key])} e={blkStr(en[key])}
      onA={(v) => onChange({ ...ar, [key]: v }, { ...en })} onE={(v) => onChange({ ...ar }, { ...en, [key]: v })} />
  );
  const list = (key: string, label: string) => (
    <div>
      <p className="mb-1 text-xs font-semibold text-ink-soft">{label}</p>
      <BiStrList a={blkStrArr(ar[key])} e={blkStrArr(en[key])} addLabel={listAdd(key, isEn)} onChange={(av, ev) => onChange({ ...ar, [key]: av }, { ...en, [key]: ev })} />
    </div>
  );
  return (
    <div className="space-y-3 rounded-2xl border border-line bg-surface/40 p-4">
      <div className="grid grid-cols-2 gap-2 px-1 text-[10px] font-bold text-ink-soft"><span>{tt("عربي", "Arabic")}</span><span dir="ltr">English</span></div>
      {sc("title", tt("عنوان القسم", "Section heading"))}
      <div className="space-y-2 rounded-xl border border-line bg-white p-3">
        <p className="text-xs font-bold text-ink">{tt("البطاقة الأولى — الفوائد", "First card — Benefits")}</p>
        {sc("benefitsHeading", tt("عنوان البطاقة", "Card title"))}
        {list("benefits", tt("عناصر البطاقة", "Card items"))}
      </div>
      <div className="space-y-2 rounded-xl border border-line bg-white p-3">
        <p className="text-xs font-bold text-ink">{tt("البطاقة الثانية — القيمة التربوية", "Second card — Educational value")}</p>
        {sc("valueHeading", tt("عنوان البطاقة", "Card title"))}
        {list("values", tt("عناصر البطاقة", "Card items"))}
      </div>
    </div>
  );
}

// صفّ أيقونة واحدة — معاينة + اختيار بصري من شبكة الأيقونات
function IconRow({ index, value, onChange, onRemove }: { index: number; value: string; onChange: (k: string) => void; onRemove: () => void }) {
  const { lang } = useCmsLang();
  const en = lang === "en";
  const [pick, setPick] = useState(false);
  return (
    <div className="rounded-xl border border-line bg-surface/50 p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface text-[11px] font-bold text-ink-soft">{index + 1}</span>
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">{iconByKey(value)}</span>
          <button type="button" onClick={() => setPick((p) => !p)} className="rounded-lg bg-brand/10 px-3 py-1.5 text-[11px] font-semibold text-brand hover:bg-brand hover:text-white">{pick ? (en ? "Close" : "إغلاق") : (en ? "Change Icon" : "تغيير الأيقونة")}</button>
        </div>
        <button type="button" onClick={onRemove} className="rounded-lg bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-600 hover:bg-red-600 hover:text-white">{en ? "Remove" : "حذف"}</button>
      </div>
      {pick && (
        <div className="mt-3 grid grid-cols-6 gap-2 sm:grid-cols-10">
          {OFFER_ICON_KEYS.map((k) => (
            <button key={k} type="button" onClick={() => { onChange(k); setPick(false); }} title={k}
              className={`flex items-center justify-center rounded-lg border p-2 transition-colors ${value === k ? "border-brand bg-brand/10 text-brand" : "border-line bg-white text-ink-soft hover:border-brand/40 hover:text-brand"}`}>
              {iconByKey(k)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// محرّر قائمة أيقونات بصري — لكل بطاقة أيقونة تُختار من شبكة (بدل كتابة الاسم)
function IconListEditor({ value, onChange }: { value: unknown; onChange: (v: unknown) => void }) {
  const { lang } = useCmsLang();
  const en = lang === "en";
  const items = (Array.isArray(value) ? value : []).map((x) => String(x ?? ""));
  const update = (i: number, k: string) => { const c = [...items]; c[i] = k; onChange(c); };
  const remove = (i: number) => onChange(items.filter((_, j) => j !== i));
  const add = () => onChange([...items, "check"]);
  return (
    <div className="space-y-2">
      <p className="text-[11px] text-ink-soft">{en ? "Each card in the section has an icon — in the same order as the cards. Pick the icon visually." : "لكل بطاقة في القسم أيقونة — بنفس ترتيب البطاقات. اختر الأيقونة بصرياً."}</p>
      {items.length === 0 && <p className="rounded-xl border border-dashed border-line bg-surface px-3 py-2 text-xs text-ink-soft">{en ? "No icons — click “Add Icon”." : "لا توجد أيقونات — اضغط «إضافة أيقونة»."}</p>}
      {items.map((k, i) => (
        <IconRow key={i} index={i} value={k} onChange={(nk) => update(i, nk)} onRemove={() => remove(i)} />
      ))}
      <button type="button" onClick={add} className="inline-flex items-center gap-1.5 rounded-lg bg-brand/10 px-3 py-1.5 text-xs font-semibold text-brand hover:bg-brand hover:text-white">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" d="M12 5v14M5 12h14" /></svg>
        {en ? "Add Icon" : "إضافة أيقونة"}
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

function ImageInput({ f, value, pathFallback, type, id, isNew, onUploaded, onChange }: { f: FieldSchema; value: unknown; pathFallback: string; type: string; id: string; isNew: boolean; onUploaded: (it: CmsItem) => void; onChange: (v: string) => void }) {
  const { lang } = useCmsLang();
  const en = lang === "en";
  const t = (ar: string, e: string) => (en ? e : ar);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [localPreview, setLocalPreview] = useState("");
  const [pending, setPending] = useState<File | null>(null); // الملف المختار قبل المعاينة/الاعتماد

  // أولوية العرض: معاينة فورية → ملف مرفوع → الصورة الحالية على الموقع (المسار)
  const uploaded = typeof value === "string" ? value : "";
  const current = resolveSrc(uploaded || pathFallback);
  const src = localPreview || current;

  // عند اختيار ملف: نفتح المعاينة بدل الرفع المباشر
  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setErr(t("الحد الأقصى 5 ميجابايت.", "Maximum size is 5 MB.")); return; }
    setErr("");
    setPending(file);
  }

  // بعد الاعتماد من المعاينة: نرفع الصورة (الأصلية أو المقصوصة)
  async function doUpload(out: Blob | File) {
    setPending(null);
    const file = out instanceof File ? out : new File([out], "image.jpg", { type: out.type || "image/jpeg" });
    setLocalPreview(URL.createObjectURL(file));
    setBusy(true);
    try {
      if (isNew) {
        // عنصر جديد لم يُحفظ بعد: نرفع الصورة بشكل مستقل ونضع رابطها ليُحفظ مع العنصر
        const r = await uploadImage(file);
        onChange(r.url);
      } else {
        const saved = await uploadField(type, id, f.name, file);
        onUploaded(saved);
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : t("تعذّر الرفع.", "Could not upload."));
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
          <label className="inline-block cursor-pointer rounded-xl bg-brand/10 px-4 py-2.5 text-sm font-semibold text-brand transition-colors hover:bg-brand hover:text-white">
            {busy ? t("جارٍ الرفع…", "Uploading…") : src ? t("تغيير الصورة", "Change Image") : t("رفع صورة", "Upload Image")}
            <input type="file" accept="image/*" onChange={onPick} disabled={busy} className="hidden" />
          </label>
          {localPreview && !busy && <p className="mt-1.5 text-xs font-semibold text-emerald-600">{t("تم رفع الصورة ✓", "Image uploaded ✓")}</p>}
        </div>
      </div>
      {err && <p className="mt-1 text-xs text-red-600">{err}</p>}
      <Help text={f.help} />
      {pending && <ImageCropModal file={pending} onCancel={() => setPending(null)} onConfirm={doUpload} />}
    </div>
  );
}
