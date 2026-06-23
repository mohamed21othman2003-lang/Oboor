"use client";

import { useMemo, useState } from "react";
import { pick, type Locale } from "@/i18n/config";
import type { Specialist } from "@/lib/specialistsData";
import SpecialistsGrid from "@/components/SpecialistsGrid";

/* فلتر الأخصائيين (تفاعلي) + الشبكة المفلترة */
export default function SpecialistsExplorer({
  specialists,
  locale,
  contactPrompt,
}: {
  specialists: Specialist[];
  locale: Locale;
  contactPrompt?: { title: string; subtitle: string };
}) {
  const [specialty, setSpecialty] = useState("");
  const [experience, setExperience] = useState("");
  const [region, setRegion] = useState("");
  const [query, setQuery] = useState("");

  const uniq = (arr: string[]) => [...new Set(arr.map((x) => (x || "").trim()).filter(Boolean))];
  const specialties = useMemo(() => uniq(specialists.map((s) => s.specialty)), [specialists]);
  const experiences = useMemo(() => uniq(specialists.map((s) => s.experience)), [specialists]);
  const regions = useMemo(
    () => uniq(specialists.flatMap((s) => `${s.branches || ""} ${s.branch || ""}`.split(/[-،,/–]/))),
    [specialists],
  );

  const q = query.trim().toLowerCase();
  const filtered = specialists.filter((s) => {
    if (specialty && s.specialty !== specialty) return false;
    if (experience && s.experience !== experience) return false;
    if (region && !(`${s.branches || ""} ${s.branch || ""}`.includes(region))) return false;
    if (q && !(`${s.name} ${s.specialty}`.toLowerCase().includes(q))) return false;
    return true;
  });

  const reset = () => {
    setSpecialty("");
    setExperience("");
    setRegion("");
    setQuery("");
  };

  return (
    <>
      {/* Search / filter bar */}
      <div className="mb-10 flex flex-wrap items-center gap-2 rounded-2xl border border-line bg-white p-3 shadow-sm lg:flex-nowrap">
        <FilterSelect icon={<BookIcon />} label={pick(locale, "التخصص", "Specialty")} allLabel={pick(locale, "جميع التخصصات", "All Specialties")} value={specialty} onChange={setSpecialty} options={specialties} />
        <Divider />
        <FilterSelect icon={<RibbonIcon />} label={pick(locale, "الخبرة", "Experience")} allLabel={pick(locale, "جميع الخبرات", "All Experience")} value={experience} onChange={setExperience} options={experiences} />
        <Divider />
        <FilterSelect icon={<PinIcon />} label={pick(locale, "المنطقة / الفرع", "Region / Branch")} allLabel={pick(locale, "جميع الفروع", "All Branches")} value={region} onChange={setRegion} options={regions} />
        <Divider />
        <div className="relative min-w-[220px] flex-1">
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft"><SearchIcon /></span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={pick(locale, "ابحث باسم الأخصائي أو التخصص...", "Search by specialist name or specialty...")}
            className="w-full rounded-xl bg-surface py-2.5 pr-10 pl-3 text-start text-sm text-ink placeholder:text-ink-soft focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
        </div>
        <button type="button" onClick={reset} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-ink-soft transition-colors hover:bg-surface" aria-label={pick(locale, "إعادة تعيين", "Reset")}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></svg>
        </button>
      </div>

      {filtered.length > 0 ? (
        <SpecialistsGrid specialists={filtered} locale={locale} contactPrompt={contactPrompt} />
      ) : (
        <p className="py-12 text-center text-sm text-ink-muted">{pick(locale, "لا يوجد أخصائيون مطابقون لبحثك.", "No specialists match your search.")}</p>
      )}
    </>
  );
}

function FilterSelect({ icon, label, allLabel, value, onChange, options }: { icon: React.ReactNode; label: string; allLabel: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="flex min-w-[150px] items-center gap-2 rounded-xl px-3 py-1.5 transition-colors hover:bg-surface">
      <span className="text-brand">{icon}</span>
      <span className="flex flex-1 flex-col text-start">
        <span className="text-[10px] font-medium text-ink-soft">{label}</span>
        <select value={value} onChange={(e) => onChange(e.target.value)} className="cursor-pointer appearance-none bg-transparent text-sm font-bold text-ink focus:outline-none">
          <option value="">{allLabel}</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </span>
      <ChevDown />
    </label>
  );
}

function Divider() {
  return <span className="hidden h-8 w-px bg-line lg:block" />;
}
function ChevDown() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-ink-soft"><path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" /></svg>;
}
function SearchIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.3-4.3" /></svg>;
}
function BookIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>;
}
function RibbonIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6" /><path d="M8.5 13.5L7 22l5-3 5 3-1.5-8.5" /></svg>;
}
function PinIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>;
}
