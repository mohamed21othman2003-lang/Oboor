"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { pick, type Locale } from "@/i18n/config";
import type { Specialist } from "@/lib/specialistsData";
import SpecialistsGrid from "@/components/SpecialistsGrid";

/* فلتر الأخصائيين (تفاعلي) + الشبكة المفلترة */
export default function SpecialistsExplorer({
  specialists,
  locale,
  contactPrompt,
  specialtyOptions = [],
  branchOptions = [],
  whatsapp,
}: {
  specialists: Specialist[];
  locale: Locale;
  contactPrompt?: { title: string; subtitle: string };
  specialtyOptions?: string[];
  branchOptions?: string[];
  whatsapp?: string;
}) {
  const [specialty, setSpecialty] = useState("");
  const [experience, setExperience] = useState("");
  const [region, setRegion] = useState("");
  const [query, setQuery] = useState("");
  const resultsRef = useRef<HTMLDivElement>(null);

  // توحيد إملائي بسيط (جده → جدة) لتفادي التكرار
  const norm = (s: string) => (s || "").replace(/جده/g, "جدة").trim();
  const uniq = (arr: string[]) => [...new Set(arr.map(norm).filter(Boolean))];

  // القائمة الكاملة لتخصصات عبور + أي تخصص فعلي موجود (عشان الفلترة تشتغل دائماً)
  const specialties = useMemo(
    () => uniq([...specialists.map((s) => s.specialty), ...specialtyOptions]),
    [specialists, specialtyOptions],
  );
  const experiences = useMemo(() => uniq(specialists.map((s) => s.experience)), [specialists]);
  // الفروع: القائمة الكاملة لمدن عبور + أي مدينة فعلية (مدن نظيفة بدون "الفرع الرئيسي")
  const regions = useMemo(() => {
    const fromData = specialists.flatMap((s) =>
      `${s.branches || ""} - ${s.branch || ""}`
        .split(/[-،,/–]/)
        .map((t) => norm(t).replace(/الفرع الرئيسي|الرئيسي|فرع/g, "").trim())
        .filter((t) => t.length > 1),
    );
    return uniq([...fromData, ...branchOptions]);
  }, [specialists, branchOptions]);

  const q = norm(query).toLowerCase();
  const filtered = specialists.filter((s) => {
    if (specialty && norm(s.specialty) !== specialty) return false;
    if (experience && norm(s.experience) !== experience) return false;
    if (region && !norm(`${s.branches || ""} ${s.branch || ""}`).includes(region)) return false;
    if (q && !norm(`${s.name} ${s.specialty}`).toLowerCase().includes(q)) return false;
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
      <div className="mb-10 flex flex-col items-stretch gap-1 rounded-2xl border border-line bg-white p-3 shadow-sm lg:flex-row lg:flex-nowrap lg:items-center lg:gap-2">
        <Dropdown icon={<BookIcon />} label={pick(locale, "التخصص", "Specialty")} allLabel={pick(locale, "جميع التخصصات", "All Specialties")} value={specialty} onChange={setSpecialty} options={specialties} />
        <Divider />
        <Dropdown icon={<RibbonIcon />} label={pick(locale, "الخبرة", "Experience")} allLabel={pick(locale, "جميع الخبرات", "All Experience")} value={experience} onChange={setExperience} options={experiences} />
        <Divider />
        <Dropdown icon={<PinIcon />} label={pick(locale, "المنطقة / الفرع", "Region / Branch")} allLabel={pick(locale, "جميع الفروع", "All Branches")} value={region} onChange={setRegion} options={regions} />
        <Divider />
        <div className="relative w-full lg:min-w-[200px] lg:flex-1">
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft"><SearchIcon /></span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={pick(locale, "ابحث باسم الأخصائي أو التخصص...", "Search by specialist name or specialty...")}
            className="w-full rounded-xl bg-surface py-2.5 pr-10 pl-3 text-start text-sm text-ink placeholder:text-ink-soft focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
        </div>
        {/* الأزرار: صف واحد على الموبايل (يمنع تيتم زر إعادة التعيين) — وعناصر مباشرة على الديسكتوب */}
        <div className="mt-1 flex items-center gap-2 lg:mt-0 lg:contents">
          <button
            type="button"
            onClick={() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark lg:flex-none lg:shrink-0"
          >
            <SearchIcon />
            {pick(locale, "ابحث الآن", "Search Now")}
          </button>
          <button type="button" onClick={reset} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-ink-soft transition-colors hover:bg-surface" aria-label={pick(locale, "إعادة تعيين", "Reset")}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></svg>
          </button>
        </div>
      </div>

      <div ref={resultsRef} className="scroll-mt-24">
        {filtered.length > 0 ? (
          <SpecialistsGrid specialists={filtered} locale={locale} contactPrompt={contactPrompt} whatsapp={whatsapp} />
        ) : (
          <p className="py-12 text-center text-sm text-ink-muted">{pick(locale, "لا يوجد أخصائيون مطابقون لبحثك.", "No specialists match your search.")}</p>
        )}
      </div>
    </>
  );
}

/* Dropdown مخصّص: أيقونة + label + القيمة + سهم، يفتح بالضغط في أي مكان */
function Dropdown({ icon, label, allLabel, value, onChange, options }: { icon: React.ReactNode; label: string; allLabel: string; value: string; onChange: (v: string) => void; options: string[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const choose = (v: string) => {
    onChange(v);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative w-full border-b border-line/70 last:border-b-0 lg:w-auto lg:min-w-[160px] lg:shrink-0 lg:border-b-0">
      <button type="button" onClick={() => setOpen((o) => !o)} className="flex min-h-[52px] w-full items-center gap-2.5 rounded-xl px-2 py-1.5 transition-colors hover:bg-surface">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">{icon}</span>
        <span className="flex-1 text-start">
          <span className="block text-[11px] leading-none text-ink-soft">{label}</span>
          <span className="mt-0.5 block truncate text-sm font-bold leading-tight text-ink">{value || allLabel}</span>
        </span>
        <ChevDown className={open ? "rotate-180 transition-transform" : "transition-transform"} />
      </button>
      {open && (
        <ul className="absolute z-30 mt-2 max-h-64 w-full min-w-[230px] overflow-y-auto rounded-2xl border border-line bg-white p-1.5 text-start shadow-xl ring-1 ring-black/5 [scrollbar-color:rgba(44,188,200,0.4)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-brand/30 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1.5">
          <Option icon={icon} active={!value} onClick={() => choose("")}>{allLabel}</Option>
          {options.map((o) => (
            <Option key={o} icon={icon} active={value === o} onClick={() => choose(o)}>{o}</Option>
          ))}
        </ul>
      )}
    </div>
  );
}

function Option({ icon, active, onClick, children }: { icon?: React.ReactNode; active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <li>
      <button type="button" onClick={onClick} className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-start text-sm transition-colors ${active ? "bg-brand/5 font-bold text-brand" : "text-ink hover:bg-surface"}`}>
        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${active ? "bg-brand/15 text-brand" : "bg-surface text-ink-soft"}`}>{icon}</span>
        <span className="flex-1 truncate">{children}</span>
        {active && <CheckIcon />}
      </button>
    </li>
  );
}

function Divider() {
  return <span className="hidden h-9 w-px bg-line lg:block" />;
}
function ChevDown({ className = "" }: { className?: string }) {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`shrink-0 text-ink-soft ${className}`}><path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" /></svg>;
}
function CheckIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-brand"><path d="M20 6L9 17l-5-5" /></svg>;
}
function SearchIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.3-4.3" /></svg>;
}
function BookIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>;
}
function RibbonIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6" /><path d="M8.5 13.5L7 22l5-3 5 3-1.5-8.5" /></svg>;
}
function PinIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>;
}
