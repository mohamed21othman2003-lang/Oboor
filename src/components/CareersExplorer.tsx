"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { pick, type Locale } from "@/i18n/config";
import type { Job } from "@/lib/careersData";

const PAGE_SIZE = 6;

/* فلاتر الوظائف (مدينة / نوع دوام) + قائمة مفلترة + ترقيم صفحات حقيقي */
export default function CareersExplorer({
  jobs,
  cities,
  employmentTypes,
  locale,
}: {
  jobs: Job[];
  cities: string[];
  employmentTypes: string[];
  locale: Locale;
}) {
  const allCity = cities[0] ?? "";
  const allEmp = employmentTypes[0] ?? "";
  const [city, setCity] = useState(allCity);
  const [employment, setEmployment] = useState(allEmp);
  const [query, setQuery] = useState("");
  const [newestFirst, setNewestFirst] = useState(true);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const isAllCity = !city || city === allCity;
    const isAllEmp = !employment || employment === allEmp;
    const q = query.trim().toLowerCase();
    const list = jobs.filter(
      (j) =>
        (isAllCity || j.city === city) &&
        (isAllEmp || j.employment === employment) &&
        (!q || `${j.title} ${j.department}`.toLowerCase().includes(q)),
    );
    // البيانات مرتّبة الأحدث أولاً؛ "الأقدم أولاً" يعكس الترتيب
    return newestFirst ? list : [...list].reverse();
  }, [jobs, city, employment, query, newestFirst, allCity, allEmp]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const pageJobs = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const pickCity = (c: string) => { setCity(c); setPage(1); };
  const pickEmp = (e: string) => { setEmployment(e); setPage(1); };

  return (
    <>
      {/* Toolbar: search + sort */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="relative min-w-[260px] flex-1 sm:max-w-[350px]">
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft"><SearchIcon /></span>
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            placeholder={pick(locale, "ابحث عن وظيفة", "Search for a job")}
            className="w-full rounded-xl border border-line bg-white py-2.5 pr-10 pl-3 text-start text-sm text-ink placeholder:text-ink-soft focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
        </div>
        <button
          type="button"
          onClick={() => { setNewestFirst((v) => !v); setPage(1); }}
          className="flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-medium text-ink-muted transition-colors hover:bg-surface"
        >
          <SortIcon />
          {newestFirst ? pick(locale, "الأحدث أولاً", "Newest first") : pick(locale, "الأقدم أولاً", "Oldest first")}
        </button>
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-3 rounded-2xl border border-line bg-surface/50 p-4">
        <div className="flex items-center justify-start gap-1.5 text-sm font-bold text-ink">
          <FilterIcon />
          {pick(locale, "تصفية", "Filter")}
        </div>
        <FilterRow label={pick(locale, "المدينة:", "City:")} options={cities} value={city} onChange={pickCity} />
        <FilterRow label={pick(locale, "نوع الدوام:", "Employment type:")} options={employmentTypes} value={employment} onChange={pickEmp} />
      </div>

      {/* Job list */}
      {pageJobs.length > 0 ? (
        <div className="space-y-4">
          {pageJobs.map((job) => <JobCard key={job.slug} job={job} locale={locale} />)}
        </div>
      ) : (
        <p className="py-12 text-center text-sm text-ink-muted">{pick(locale, "لا توجد وظائف مطابقة لاختيارك.", "No jobs match your selection.")}</p>
      )}

      {/* Pagination (real) */}
      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          <PagerArrow dir="prev" disabled={current === 1} onClick={() => setPage(current - 1)} locale={locale} />
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <PageBtn key={n} n={n} active={n === current} onClick={() => setPage(n)} />
          ))}
          <PagerArrow dir="next" disabled={current === totalPages} onClick={() => setPage(current + 1)} locale={locale} />
        </div>
      )}
    </>
  );
}

function FilterRow({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="ml-1 text-sm font-bold text-ink">{label}</span>
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(o)}
          className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${value === o ? "bg-brand text-white" : "bg-white text-ink-muted ring-1 ring-line hover:bg-surface"}`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

function PageBtn({ n, active, onClick }: { n: number; active?: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-semibold transition-colors ${active ? "bg-brand text-white" : "text-ink-muted hover:bg-surface"}`}>
      {n}
    </button>
  );
}

function PagerArrow({ dir, onClick, disabled, locale }: { dir: "next" | "prev"; onClick: () => void; disabled?: boolean; locale: Locale }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex h-10 w-10 items-center justify-center rounded-lg text-ink-muted transition-colors ${disabled ? "cursor-not-allowed opacity-40" : "hover:bg-surface"}`}
      aria-label={dir === "next" ? pick(locale, "التالي", "Next") : pick(locale, "السابق", "Previous")}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="dir-flip">
        <path d={dir === "next" ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} />
      </svg>
    </button>
  );
}

function JobCard({ job, locale }: { job: Job; locale: Locale }) {
  return (
    <div className="flex flex-col items-stretch gap-4 rounded-2xl border border-line bg-white p-5 transition-shadow hover:shadow-md sm:flex-row sm:items-center">
      <span className="order-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
        <BriefcaseIcon />
      </span>
      <div className="order-2 flex-1 text-start">
        <div className="flex items-center justify-start gap-2">
          <h3 className="text-lg font-bold text-ink">{job.title}</h3>
          {job.isNew && <span className="rounded-md bg-brand/10 px-2 py-0.5 text-[11px] font-bold text-brand">{pick(locale, "جديد", "New")}</span>}
        </div>
        <p className="mt-1 text-sm text-ink-soft">{job.department}</p>
        <div className="mt-2.5 flex flex-wrap items-center justify-start gap-2">
          <MetaPill icon={<PinIcon />}>{job.city}</MetaPill>
          <MetaPill icon={<ClockIcon />} highlight>{job.employment}</MetaPill>
          <MetaPill icon={<BagIcon />}>{job.experience}</MetaPill>
          <span className="flex items-center gap-1.5 text-xs text-ink-soft"><CalendarIcon />{job.date}</span>
        </div>
      </div>
      <Link href={`/careers/${job.slug}`} className="order-3 flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark">
        {pick(locale, "عرض التفاصيل", "View Details")}
        <Chev />
      </Link>
    </div>
  );
}

function MetaPill({ icon, children, highlight }: { icon: React.ReactNode; children: React.ReactNode; highlight?: boolean }) {
  return (
    <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${highlight ? "bg-brand/10 text-brand-dark" : "bg-surface text-ink-muted"}`}>
      {icon}
      {children}
    </span>
  );
}

/* Icons */
function SearchIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.3-4.3" /></svg>;
}
function SortIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ink-soft"><path d="M3 6h18M6 12h12M10 18h4" /></svg>;
}
function Chev() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="dir-flip"><path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" /></svg>;
}
function FilterIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand"><path d="M22 3H2l8 9.46V19l4 2v-8.54z" /></svg>;
}
function BriefcaseIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>;
}
function PinIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>;
}
function ClockIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" strokeLinecap="round" /></svg>;
}
function BagIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>;
}
function CalendarIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>;
}
