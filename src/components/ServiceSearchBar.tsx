"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { pick, type Locale } from "@/i18n/config";
import { serviceCategories, serviceRegions, type ServiceCategoryKey } from "@/components/ServicesTabs";
import { sendGAEvent } from "@next/third-parties/google";

type Option = { value: string; label: string; icon: string };

/* ---- small icon set for the dropdown rows ---- */
const I = (d: React.ReactNode) => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{d}</svg>
);
const ICONS: Record<string, React.ReactNode> = {
  grid: I(<><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>),
  book: I(<><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></>),
  stethoscope: I(<><path d="M4 3v6a5 5 0 0 0 10 0V3" /><path d="M4 3H2M14 3h-2M9 14v3a4 4 0 0 0 8 0v-1" /><circle cx="19" cy="13" r="2" /></>),
  chip: I(<><rect x="6" y="6" width="12" height="12" rx="2" /><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" /></>),
  star: I(<polygon points="12 2 15 8.5 22 9.3 17 14 18.2 21 12 17.7 5.8 21 7 14 2 9.3 9 8.5 12 2" />),
  bolt: I(<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />),
  trend: I(<><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></>),
  brain: I(<><path d="M9 3a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 6 0V4a1 1 0 0 0-3-1z" /><path d="M15 3a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-6 0" /></>),
  user: I(<><path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /></>),
  users: I(<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>),
  pin: I(<><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></>),
  globe: I(<><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" /></>),
};

const PROGRAM_ICONS = ["star", "bolt", "book", "trend", "brain", "user", "users"];
function itemIcon(catKey: ServiceCategoryKey, idx: number) {
  if (catKey === "programs") return PROGRAM_ICONS[idx % PROGRAM_ICONS.length];
  if (catKey === "clinical") return "stethoscope";
  return "chip";
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`shrink-0 text-ink-soft transition-transform ${open ? "rotate-180" : ""}`}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
    </svg>
  );
}

function Dropdown({
  label,
  triggerIcon,
  boxed,
  value,
  options,
  onChange,
}: {
  label: string;
  triggerIcon: React.ReactNode;
  boxed?: boolean;
  value: string;
  options: Option[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const display = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [open]);

  return (
    <div ref={ref} className="relative flex-1 border-b border-line/70 last:border-b-0 lg:border-b-0">
      <button type="button" onClick={() => setOpen((o) => !o)} className="flex min-h-[56px] w-full items-center justify-start gap-3 px-3 py-1 text-start">
        {boxed ? (
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">{triggerIcon}</span>
        ) : (
          <span className="shrink-0 text-brand">{triggerIcon}</span>
        )}
        <span className="min-w-0 flex-1 text-start">
          <span className="block text-[11px] text-ink-soft">{label}</span>
          <span className="block truncate text-sm font-bold text-ink">{display?.label}</span>
        </span>
        <Chevron open={open} />
      </button>

      {open && (
        <div className="absolute top-full z-50 mt-2 w-full min-w-[240px] rounded-2xl bg-white p-2 text-start shadow-2xl ring-1 ring-line">
          <p className="px-3 py-2 text-xs font-semibold text-ink-soft">{label}</p>
          <ul>
            {options.map((o) => {
              const active = o.value === value;
              return (
                <li key={o.value}>
                  <button
                    type="button"
                    onClick={() => { onChange(o.value); setOpen(false); }}
                    className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${active ? "bg-brand/10 font-semibold text-brand-dark" : "text-ink hover:bg-surface"}`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span className={active ? "text-brand-dark" : "text-brand"}>{ICONS[o.icon]}</span>
                      {o.label}
                    </span>
                    {active && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="shrink-0 text-brand"><path strokeLinecap="round" strokeLinejoin="round" d="M20 6 9 17l-5-5" /></svg>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

type SbCards = { programs: import("@/components/ProgramCard").Program[]; clinical: import("@/components/ProgramCard").Program[]; techniques: import("@/components/ProgramCard").Program[] };

export default function ServiceSearchBar({ locale = "ar", searchLabel, cards, regions: regionsProp }: {
  regionValue?: string; locale?: Locale; searchLabel?: string;
  cards?: SbCards; regions?: string[];
}) {
  const router = useRouter();
  // الفئات من الـCMS إن توفّرت، وإلا الثابتة. والمناطق من الفروع الحقيقية إن مُرِّرت، وإلا الثابتة.
  const categories = useMemo(() => {
    if (cards) return [
      { key: "programs" as const, label: pick(locale, "برامج تأهيلية", "Rehabilitation Programs"), items: cards.programs?.length ? cards.programs : serviceCategories(locale)[0].items },
      { key: "clinical" as const, label: pick(locale, "خدمات عيادية", "Clinical Services"), items: cards.clinical?.length ? cards.clinical : serviceCategories(locale)[1].items },
      { key: "techniques" as const, label: pick(locale, "تقنيات تأهيلية", "Rehabilitation Technologies"), items: cards.techniques?.length ? cards.techniques : serviceCategories(locale)[2].items },
    ];
    return serviceCategories(locale);
  }, [cards, locale]);
  const regions = useMemo(() => (regionsProp && regionsProp.length ? regionsProp : serviceRegions(locale)), [regionsProp, locale]);
  const ALL = "__all__";

  const [catKey, setCatKey] = useState<ServiceCategoryKey>("programs");
  const [region, setRegion] = useState<string>(ALL);
  // اختيار العنصر بمُعرّف ثابت (slug/href) لا بالفهرس — حتى لا يضيع عند تغيّر أي فلتر آخر.
  const [itemKey, setItemKey] = useState<string>(ALL);

  const category = categories.find((c) => c.key === catKey) ?? categories[0];
  const keyOf = (p: { slug?: string; href?: string; title: string }, i: number) => p.slug || p.href || `i${i}`;

  const catIconKey: Record<ServiceCategoryKey, string> = { programs: "book", clinical: "stethoscope", techniques: "chip" };
  // تسمية حقل الاختيار الأوسط + أيقونته تتبع الفئة (برنامج / خدمة / تقنية)
  const NOUN: Record<ServiceCategoryKey, { pickAr: string; pickEn: string; allAr: string; allEn: string; icon: string }> = {
    programs: { pickAr: "اختر البرنامج", pickEn: "Select Program", allAr: "كل البرامج", allEn: "All Programs", icon: "book" },
    clinical: { pickAr: "اختر الخدمة", pickEn: "Select Service", allAr: "كل الخدمات", allEn: "All Services", icon: "stethoscope" },
    techniques: { pickAr: "اختر التقنية", pickEn: "Select Technology", allAr: "كل التقنيات", allEn: "All Technologies", icon: "chip" },
  };
  const noun = NOUN[catKey];
  const catOptions: Option[] = categories.map((c) => ({ value: c.key, label: c.label, icon: catIconKey[c.key] }));
  const regionOptions: Option[] = [
    { value: ALL, label: pick(locale, "كل المناطق", "All Regions"), icon: "globe" },
    ...regions.map((r) => ({ value: r, label: r, icon: "pin" })),
  ];
  const programOptions: Option[] = [
    { value: ALL, label: pick(locale, noun.allAr, noun.allEn), icon: "grid" },
    ...category.items.map((p, i) => ({ value: keyOf(p, i), label: p.title, icon: itemIcon(catKey, i) })),
  ];

  // تغيير الفئة يعيد ضبط العنصر (مجموعة مختلفة). تغيير المنطقة لا يمسّ اختيار العنصر.
  function onCat(v: string) { setCatKey(v as ServiceCategoryKey); setItemKey(ALL); }

  function search() {
    const picked = itemKey !== ALL ? category.items.find((p, i) => keyOf(p, i) === itemKey) : null;
    sendGAEvent("event", "smart_search", { category: catKey, program: itemKey !== ALL ? itemKey : "", region: region !== ALL ? region : "" });
    if (picked) { router.push(picked.href ?? `/programs/${picked.slug}`); return; }
    // منطقة فقط → اذهب لفروع تلك المنطقة (بيانات الفروع الحقيقية)
    if (region !== ALL) { router.push(`/branches?q=${encodeURIComponent(region)}`); return; }
    router.push(`/programs#${catKey}`);
    if (typeof window !== "undefined" && window.location.pathname === "/programs") {
      window.location.hash = catKey;
      document.getElementById("services-tabs")?.scrollIntoView({ behavior: "smooth" });
    }
  }

  function reset() {
    setCatKey("programs"); setRegion(ALL); setItemKey(ALL);
    if (typeof window !== "undefined" && window.location.pathname === "/programs") router.push("/programs");
  }

  return (
    <div className="relative flex flex-col items-stretch gap-2 rounded-2xl bg-white p-3 shadow-md ring-1 ring-line lg:flex-row lg:items-center">
      <Dropdown label={pick(locale, "الفئة الرئيسية", "Main Category")} triggerIcon={ICONS.book} value={catKey} onChange={onCat} options={catOptions} />
      <span className="hidden h-9 w-px shrink-0 bg-line lg:block" />
      <Dropdown label={pick(locale, noun.pickAr, noun.pickEn)} triggerIcon={ICONS[noun.icon]} value={itemKey} onChange={setItemKey} options={programOptions} />
      <span className="hidden h-9 w-px shrink-0 bg-line lg:block" />
      <Dropdown label={pick(locale, "المنطقة / الفرع", "Region / Branch")} triggerIcon={ICONS.pin} value={region} onChange={setRegion} options={regionOptions} />
      <span className="hidden h-9 w-px shrink-0 bg-line lg:block" />

      {/* الأزرار: في صفّ واحد على الموبايل (يمنع تيتم زر إعادة التعيين) — وعناصر مباشرة على الديسكتوب */}
      <div className="mt-1 flex items-center gap-2 lg:mt-0 lg:contents">
        <button onClick={search} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark lg:flex-none lg:shrink-0">
          {searchLabel ?? pick(locale, "ابحث الآن", "Search Now")}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" strokeLinecap="round" /></svg>
        </button>
        <button onClick={reset} aria-label={pick(locale, "إعادة تعيين", "Reset")} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-surface">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>
    </div>
  );
}
