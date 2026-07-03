"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { listCollection, deleteItem, reorderCollection, typeLabel, addLabelFor, type CmsItem } from "@/lib/cms/api";
import { useCmsLang } from "@/lib/cms/i18n";
import PageChrome from "@/components/cms/PageChrome";

// أنواع المحتوى التي لصفحتها «رأس صفحة» قابل للتعديل من نفس القائمة (نوع ← مفتاح الصفحة)
const PAGE_CHROME: Record<string, string> = { careers: "careers", success: "success", specialists: "specialists", branches: "branches", news: "news", programs: "programs" };

// أسماء ودّية لأقسام الصفحات (block) — لتجميع العناصر تحت قسمها بدل خلطها
const BLOCK_LABELS: Record<string, string> = {
  hero: "المقدمة العلوية", intro: "نبذة تعريفية", about: "نبذة", mission: "الرسالة", vision: "الرؤية",
  programs: "قسم البرامج (العنوان + القائمة)", services: "الخدمات",
  specialists: "قسم الأخصائيين", branches: "قسم الفروع", cta: "شريط الدعوة للتواصل",
  stats: "الأرقام", features: "المميزات", categories: "التصنيفات",
  join_cards: "بطاقات الانضمام", contact_prompt: "دعوة التواصل", steps: "خطوات", highlights: "أبرز النقاط",
  prelim_questions: "أسئلة أولية", answer_options: "خيارات الإجابة", cities: "المدن", employment_types: "أنواع الدوام",
  quick_links: "روابط سريعة", social: "روابط التواصل", nav: "روابط القائمة",
};
const BLOCK_LABELS_EN: Record<string, string> = {
  hero: "Hero", intro: "Introduction", about: "About", mission: "Mission", vision: "Vision",
  programs: "Programs Section (title + list)", services: "Services",
  specialists: "Specialists Section", branches: "Branches Section", cta: "Contact CTA Bar",
  stats: "Numbers", features: "Features", categories: "Categories",
  join_cards: "Join Cards", contact_prompt: "Contact Prompt", steps: "Steps", highlights: "Highlights",
  prelim_questions: "Preliminary Questions", answer_options: "Answer Options", cities: "Cities", employment_types: "Employment Types",
  quick_links: "Quick Links", social: "Social Links", nav: "Menu Links",
};
const blockLabel = (b: string, en: boolean) => (en ? BLOCK_LABELS_EN[b] : BLOCK_LABELS[b]) || BLOCK_LABELS[b] || b;

// صفحات لها كيان مستقل في السايد بار ⇒ تُستبعد من قائمة «أقسام الصفحات» العامة
const DEDICATED_PAGES = new Set(["about", "careers", "home", "success", "specialists", "assessment", "branches", "news", "programs"]);

export default function CollectionList({ type }: { type: string }) {
  const router = useRouter();
  const { lang } = useCmsLang();
  const en = lang === "en";
  const t = (ar: string, e: string) => (en ? e : ar);
  const sp = useSearchParams();
  const pageFilter = type === "sections" ? sp.get("page") : null;
  const [items, setItems] = useState<CmsItem[]>([]);
  const [titleField, setTitleField] = useState("title_ar");
  const [groupBy, setGroupBy] = useState<string | null>(null);
  const [groupDefs, setGroupDefs] = useState<{ value: string; label: string }[] | null>(null);
  const [readonly, setReadonly] = useState(false);
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<number | null>(null);

  const label = typeLabel(type, lang);

  function load() {
    setLoading(true);
    listCollection(type)
      .then((d) => {
        setItems(d.items);
        setTitleField(d.title_field);
        setGroupBy(d.group_by);
        setGroupDefs(d.groups);
        setReadonly(d.readonly);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }
  useEffect(load, [type]);

  async function onDelete(id: number) {
    if (!confirm(t("هل تريد حذف هذا العنصر نهائياً؟", "Delete this item permanently?"))) return;
    setBusy(id);
    try {
      await deleteItem(type, id);
      setItems((prev) => prev.filter((it) => it.id !== id));
    } catch (e) {
      alert(e instanceof Error ? e.message : t("تعذّر الحذف.", "Could not delete."));
    } finally {
      setBusy(null);
    }
  }

  // أنواع زمنية (الأحدث أولاً) — لا تُرتَّب يدوياً
  const TIME_ORDERED = new Set(["news", "careers"]);
  const canReorder = items.length > 0 && "order" in items[0] && !readonly && !TIME_ORDERED.has(type);

  async function move(it: CmsItem, dir: -1 | 1) {
    const idx = items.findIndex((x) => x.id === it.id);
    if (idx < 0) return;
    const gk = groupBy ? String(it[groupBy] ?? "") : null;
    // ابحث عن أقرب جار في نفس المجموعة بالاتجاه المطلوب
    let tgt = idx + dir;
    if (groupBy) while (tgt >= 0 && tgt < items.length && String(items[tgt][groupBy] ?? "") !== gk) tgt += dir;
    if (tgt < 0 || tgt >= items.length) return;
    if (groupBy && String(items[tgt][groupBy] ?? "") !== gk) return;
    const prev = items;
    const arr = [...items];
    [arr[idx], arr[tgt]] = [arr[tgt], arr[idx]];
    setItems(arr);
    const setIds = (groupBy ? arr.filter((x) => String(x[groupBy] ?? "") === gk) : arr).map((x) => x.id);
    try {
      await reorderCollection(type, setIds);
    } catch (e) {
      setItems(prev); // تراجع عند الفشل
      alert(e instanceof Error ? e.message : t("تعذّر إعادة الترتيب.", "Could not reorder."));
    }
  }

  function titleOf(it: CmsItem): string {
    const v = it[titleField] ?? it["title_ar"] ?? it["name_ar"] ?? it["label_ar"] ?? it["value"] ?? it["key"] ?? `#${it.id}`;
    return String(v || `#${it.id}`);
  }
  function published(it: CmsItem): boolean | null {
    if ("published" in it) return Boolean(it.published);
    if ("is_active" in it) return Boolean(it.is_active);
    return null;
  }
  function subLabel(it: CmsItem): string {
    const b = it["block"];
    return b ? String(b) : "";
  }

  // تجميع العناصر حسب حقل التجميع
  const grouped = useMemo(() => {
    if (!groupBy) return null;
    const labelMap = new Map((groupDefs || []).map((g) => [g.value, g.label]));
    const buckets = new Map<string, { key: string; label: string; items: CmsItem[] }>();
    // مهّد المجموعات المعرّفة مسبقاً لحفظ الترتيب
    for (const g of groupDefs || []) buckets.set(g.value, { key: g.value, label: g.label, items: [] });
    // استبعد الصفحات التي لها كيان مستقل من القائمة العامة
    const src = type === "sections" ? items.filter((it) => !DEDICATED_PAGES.has(String(it.page ?? ""))) : items;
    for (const it of src) {
      const raw = it[groupBy];
      const key = raw === null || raw === undefined || raw === "" ? "__other__" : String(raw);
      if (!buckets.has(key)) buckets.set(key, { key, label: labelMap.get(key) || key || t("أخرى", "Other"), items: [] });
      buckets.get(key)!.items.push(it);
    }
    return [...buckets.values()].filter((b) => b.items.length > 0);
  }, [items, groupBy, groupDefs, type]);

  // وضع «صفحة واحدة» (مثل عن عبور) — نعرض أقسام صفحة بعينها فقط
  const pageLabel = pageFilter ? (groupDefs?.find((g) => g.value === pageFilter)?.label || pageFilter) : null;
  const pageItems = pageFilter ? items.filter((it) => String(it.page ?? "") === pageFilter) : items;

  // تجميع عناصر صفحة فرعيًا حسب القسم (block) مع الحفاظ على الترتيب
  function blockGroups(list: CmsItem[]) {
    if (!list.length || !("block" in list[0])) return null;
    const order: string[] = [];
    const map = new Map<string, CmsItem[]>();
    for (const it of list) {
      const b = String(it["block"] ?? "");
      if (!map.has(b)) { map.set(b, []); order.push(b); }
      map.get(b)!.push(it);
    }
    return order.map((b) => ({ block: b, items: map.get(b)! }));
  }

  function Row({ it, hideSub }: { it: CmsItem; hideSub?: boolean }) {
    const pub = published(it);
    const sub = hideSub ? "" : subLabel(it);
    // موضع العنصر داخل مجموعته (لتعطيل الأسهم عند الحواف)
    const gk = groupBy ? String(it[groupBy] ?? "") : null;
    const sameGroup = groupBy ? items.filter((x) => String(x[groupBy] ?? "") === gk) : items;
    const posInGroup = sameGroup.findIndex((x) => x.id === it.id);
    return (
      <tr className="transition-colors hover:bg-surface/60">
        {canReorder && (
          <td className="px-2 py-3.5 w-12">
            <div className="flex flex-col items-center gap-0.5">
              <button onClick={() => move(it, -1)} disabled={posInGroup <= 0} title={t("تحريك لأعلى", "Move up")} className="rounded p-0.5 text-ink-soft transition-colors hover:bg-brand/10 hover:text-brand disabled:opacity-25 disabled:hover:bg-transparent">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M18 15l-6-6-6 6" /></svg>
              </button>
              <button onClick={() => move(it, 1)} disabled={posInGroup >= sameGroup.length - 1} title={t("تحريك لأسفل", "Move down")} className="rounded p-0.5 text-ink-soft transition-colors hover:bg-brand/10 hover:text-brand disabled:opacity-25 disabled:hover:bg-transparent">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" /></svg>
              </button>
            </div>
          </td>
        )}
        <td className="px-5 py-3.5">
          <p className="font-semibold text-ink">{titleOf(it)}</p>
          {sub && <p className="mt-0.5 text-xs text-ink-soft">{t("القسم:", "Section:")} {sub}</p>}
        </td>
        <td className="px-5 py-3.5 w-28">
          {pub === null ? <span className="text-ink-soft">—</span>
            : pub ? <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">{t("منشور", "Published")}</span>
            : <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">{t("مخفي", "Hidden")}</span>}
        </td>
        <td className="px-5 py-3.5 w-32">
          <div className="flex items-center justify-end gap-2">
            <button onClick={() => router.push(`/cms/content/${type}/${it.id}`)} className="rounded-lg bg-brand/10 px-3 py-1.5 text-xs font-semibold text-brand transition-colors hover:bg-brand hover:text-white">{t("تعديل", "Edit")}</button>
            {!readonly && (
              <button onClick={() => onDelete(it.id)} disabled={busy === it.id} className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-600 hover:text-white disabled:opacity-50">
                {busy === it.id ? "…" : t("حذف", "Delete")}
              </button>
            )}
          </div>
        </td>
      </tr>
    );
  }

  function Table({ list, hideSub }: { list: CmsItem[]; hideSub?: boolean }) {
    return (
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-line">
        <table className="w-full text-start text-sm">
          <thead className="bg-surface text-xs font-semibold text-ink-soft">
            <tr>{canReorder && <th className="px-2 py-3 w-12"></th>}<th className="px-5 py-3 text-start">{t("العنوان", "Title")}</th><th className="px-5 py-3 w-28 text-start">{t("الحالة", "Status")}</th><th className="px-5 py-3 w-32"></th></tr>
          </thead>
          <tbody className="divide-y divide-line">{list.map((it) => <Row key={it.id} it={it} hideSub={hideSub} />)}</tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/cms" className="text-xs font-semibold text-brand hover:text-brand-dark">{t("← لوحة التحكّم", "← Dashboard")}</Link>
          <h1 className="mt-1 text-2xl font-extrabold text-ink">{pageFilter ? pageLabel : label}</h1>
          <p className="mt-1 text-sm text-ink-soft">{(pageFilter ? pageItems.length : grouped ? grouped.reduce((n, g) => n + g.items.length, 0) : items.length)} {t("عنصر", "items")}</p>
        </div>
        {!readonly && (
          <Link href={pageFilter ? `/cms/content/${type}/new?page=${pageFilter}` : `/cms/content/${type}/new`} className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-brand-dark">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" d="M12 5v14M5 12h14" /></svg>
            {addLabelFor(type, lang)}
          </Link>
        )}
      </div>

      {!pageFilter && PAGE_CHROME[type] && <PageChrome page={PAGE_CHROME[type]} />}

      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

      {loading ? (
        <p className="text-ink-soft">{t("جارٍ التحميل…", "Loading…")}</p>
      ) : (pageFilter ? pageItems.length === 0 : items.length === 0) ? (
        <div className="rounded-2xl border border-dashed border-line bg-white p-10 text-center text-ink-soft">
          {t("لا توجد عناصر بعد.", "No items yet.")} {!readonly && (en ? `Click "${addLabelFor(type, lang)}" to start.` : `اضغط «${addLabelFor(type)}» للبدء.`)}
        </div>
      ) : pageFilter ? (
        <div className="space-y-4">
          {(blockGroups(pageItems) ?? [{ block: "", items: pageItems }]).map((sg) => (
            <div key={sg.block}>
              {sg.block && (
                <p className="mb-2 flex items-center gap-2 px-1 text-xs font-bold text-brand-dark">
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand/10 px-1.5 text-[11px]">{sg.items.length}</span>
                  {blockLabel(sg.block, en)}
                </p>
              )}
              <Table list={sg.items} hideSub />
            </div>
          ))}
        </div>
      ) : grouped ? (
        <div className="space-y-3">
          {grouped.map((g) => {
            const isOpen = open[g.key] ?? false;
            return (
              <div key={g.key} className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-line">
                <button onClick={() => setOpen((p) => ({ ...p, [g.key]: !isOpen }))} className="flex w-full items-center justify-between gap-3 px-5 py-4 text-start transition-colors hover:bg-surface/60">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 min-w-8 items-center justify-center rounded-full bg-brand/10 px-2 text-sm font-extrabold text-brand">{g.items.length}</span>
                    <span className="font-bold text-ink">{g.label}</span>
                  </div>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`shrink-0 text-ink-soft transition-transform ${isOpen ? "rotate-180" : ""}`}><path strokeLinecap="round" d="M6 9l6 6 6-6" /></svg>
                </button>
                {isOpen && (() => {
                  const bg = blockGroups(g.items);
                  return (
                    <div className="space-y-4 border-t border-line p-3">
                      {bg ? bg.map((sg) => (
                        <div key={sg.block}>
                          <p className="mb-2 flex items-center gap-2 px-1 text-xs font-bold text-brand-dark">
                            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand/10 px-1.5 text-[11px]">{sg.items.length}</span>
                            {blockLabel(sg.block, en)}
                          </p>
                          <Table list={sg.items} hideSub />
                        </div>
                      )) : <Table list={g.items} />}
                    </div>
                  );
                })()}
              </div>
            );
          })}
        </div>
      ) : (
        <Table list={items} />
      )}
    </div>
  );
}
