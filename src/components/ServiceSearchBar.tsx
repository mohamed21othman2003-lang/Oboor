"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { pick, type Locale } from "@/i18n/config";
import { serviceCategories, serviceRegions, type ServiceCategoryKey } from "@/components/ServicesTabs";

type Option = { value: string; label: string };

function Chevron() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-ink-soft">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
    </svg>
  );
}

function SelectField({
  label,
  icon,
  boxed,
  value,
  onChange,
  options,
}: {
  label: string;
  icon: React.ReactNode;
  boxed?: boolean;
  value: string;
  onChange: (v: string) => void;
  options: Option[];
}) {
  const display = options.find((o) => o.value === value)?.label ?? "";
  return (
    <div className="relative flex flex-1 items-center justify-start gap-3 px-3 py-1">
      {boxed ? (
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">{icon}</span>
      ) : (
        <span className="shrink-0 text-brand">{icon}</span>
      )}
      <div className="min-w-0 flex-1 text-start">
        <p className="text-[11px] text-ink-soft">{label}</p>
        <p className="truncate text-sm font-bold text-ink">{display}</p>
      </div>
      <Chevron />
      {/* transparent native select covering the whole field — clicking anywhere (incl. the arrow) opens it */}
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

export default function ServiceSearchBar({ locale = "ar", searchLabel }: { regionValue?: string; locale?: Locale; searchLabel?: string }) {
  const router = useRouter();
  const categories = useMemo(() => serviceCategories(locale), [locale]);
  const regions = useMemo(() => serviceRegions(locale), [locale]);
  const ALL = "__all__";

  const [catKey, setCatKey] = useState<ServiceCategoryKey>("programs");
  const [region, setRegion] = useState<string>(ALL);
  const [programIdx, setProgramIdx] = useState<string>(ALL);

  const category = categories.find((c) => c.key === catKey)!;
  const programItems = region === ALL ? category.items : category.items.filter((i) => i.regions?.includes(region));

  const catOptions: Option[] = categories.map((c) => ({ value: c.key, label: c.label }));
  const regionOptions: Option[] = [{ value: ALL, label: pick(locale, "كل المناطق", "All Regions") }, ...regions.map((r) => ({ value: r, label: r }))];
  const programSelectOptions: Option[] = [
    { value: ALL, label: pick(locale, "كل البرامج", "All Programs") },
    ...programItems.map((p, i) => ({ value: String(i), label: p.title })),
  ];

  function onCat(v: string) {
    setCatKey(v as ServiceCategoryKey);
    setProgramIdx(ALL);
  }
  function onRegion(v: string) {
    setRegion(v);
    setProgramIdx(ALL);
  }

  function search() {
    const picked = programIdx !== ALL ? programItems[Number(programIdx)] : null;
    if (picked) {
      router.push(picked.href ?? `/programs/${picked.slug}`);
      return;
    }
    const query = region !== ALL ? `?region=${encodeURIComponent(region)}` : "";
    router.push(`/programs${query}#${catKey}`);
    if (typeof window !== "undefined" && window.location.pathname === "/programs") {
      window.location.hash = catKey;
      document.getElementById("services-tabs")?.scrollIntoView({ behavior: "smooth" });
    }
  }

  function reset() {
    setCatKey("programs");
    setRegion(ALL);
    setProgramIdx(ALL);
    router.push("/programs");
  }

  return (
    <div className="flex flex-col items-stretch gap-2 rounded-2xl bg-white p-3 shadow-md ring-1 ring-line lg:flex-row lg:items-center">
      <SelectField
        boxed
        label={pick(locale, "الفئة الرئيسية", "Main Category")}
        value={catKey}
        onChange={onCat}
        options={catOptions}
        icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>}
      />

      <span className="hidden h-9 w-px shrink-0 bg-line lg:block" />

      <SelectField
        label={pick(locale, "اختر البرنامج", "Select Program")}
        value={programIdx}
        onChange={setProgramIdx}
        options={programSelectOptions}
        icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>}
      />

      <span className="hidden h-9 w-px shrink-0 bg-line lg:block" />

      <SelectField
        label={pick(locale, "المنطقة / الفرع", "Region / Branch")}
        value={region}
        onChange={onRegion}
        options={regionOptions}
        icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>}
      />

      <span className="hidden h-9 w-px shrink-0 bg-line lg:block" />

      <button onClick={search} className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark">
        {searchLabel ?? pick(locale, "ابحث الآن", "Search Now")}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" strokeLinecap="round" /></svg>
      </button>
      <button onClick={reset} aria-label={pick(locale, "إعادة تعيين", "Reset")} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-surface">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
    </div>
  );
}
