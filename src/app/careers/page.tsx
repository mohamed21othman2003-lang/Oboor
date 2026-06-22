import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { JOBS, JOBS_EN, CITIES, CITIES_EN, EMPLOYMENT_TYPES, EMPLOYMENT_TYPES_EN, type Job } from "@/lib/careersData";
import { getLocale } from "@/i18n/locale";
import { pick, type Locale } from "@/i18n/config";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: pick(locale, "الوظائف | مركز عبور للرعاية والتأهيل", "Careers | Oboor Center for Care & Rehabilitation"),
    description: pick(
      locale,
      "انضم إلى فريق عبور — وظائف تصنع فرقاً حقيقياً في حياة المستفيدين وأسرهم.",
      "Join the Oboor team — careers that make a real difference in the lives of beneficiaries and their families.",
    ),
  };
}

function Chev() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="dir-flip"><path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" /></svg>;
}

export default async function CareersPage() {
  const locale = await getLocale();
  const jobs = locale === "en" ? JOBS_EN : JOBS;
  const cities = locale === "en" ? CITIES_EN : CITIES;
  const employmentTypes = locale === "en" ? EMPLOYMENT_TYPES_EN : EMPLOYMENT_TYPES;

  return (
    <>
      {/* Hero */}
      <section className="overflow-hidden bg-gradient-to-b from-[#ebf7f9] to-white">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <nav className="mb-8 flex items-center justify-start gap-2 text-sm text-ink-soft">
            <span className="text-brand">{pick(locale, "الوظائف", "Careers")}</span>
            <Chev />
            <Link href="/" className="hover:text-brand">{pick(locale, "الرئيسية", "Home")}</Link>
          </nav>

          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Text (right) */}
            <div className="order-2 text-start lg:order-1">
              <span className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-white px-4 py-1.5 text-xs font-bold text-brand shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                {pick(locale, "انضم إلى فريق عبور", "Join the Oboor Team")}
              </span>
              <h1 className="mt-5 text-4xl font-extrabold leading-tight text-ink sm:text-5xl">
                {pick(locale, "وظائف تصنع ", "Careers that make ")}<span className="text-brand">{pick(locale, "فرقاً حقيقياً", "a real difference")}</span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-8 text-ink-muted">
                {pick(
                  locale,
                  "في مراكز عبور، نبحث عن أخصائيين وكوادر تحمل شغفاً بالتأهيل والرعاية. انضم إلى بيئة مهنية متخصصة تُقدّر الكفاءة وتدعم نموك المهني، مع أثر إنساني ملموس في حياة المستفيدين وأسرهم.",
                  "At Oboor Centers, we are looking for specialists and professionals who are passionate about rehabilitation and care. Join a specialized professional environment that values competence and supports your professional growth, with a tangible human impact on the lives of beneficiaries and their families.",
                )}
              </p>
            </div>

            {/* Image (left) */}
            <div className="relative order-1 mx-auto h-[420px] w-full max-w-[495px] lg:order-2">
              <div className="absolute -bottom-4 -left-4 h-full w-full rounded-3xl bg-brand/10" />
              <div className="relative h-full w-full overflow-hidden rounded-3xl shadow-lg">
                <Image src="/figma/careers/hero-v2.jpg" alt={pick(locale, "فريق عبور", "Oboor team")} fill className="object-cover" sizes="(max-width:1024px) 100vw, 495px" priority />
              </div>
              {/* Floating badge */}
              <div className="absolute bottom-5 left-5 flex items-center gap-3 rounded-2xl bg-white px-4 py-2.5 shadow-lg">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <BriefcaseIcon />
                </span>
                <div className="text-start">
                  <p className="text-[11px] text-ink-soft">{pick(locale, "وظائف متاحة", "Open Positions")}</p>
                  <p className="text-base font-extrabold text-brand">{pick(locale, "٨ وظائف", "8 jobs")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Jobs */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6 text-start">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-brand">
              {pick(locale, "8 وظيفة متاحة", "8 open positions")}
              <span className="inline-block h-0.5 w-9 rounded-full bg-brand" />
            </span>
            <h2 className="mt-2 text-3xl font-extrabold text-ink">{pick(locale, "الوظائف المتاحة", "Open Positions")}</h2>
          </div>

          {/* Toolbar: search + sort */}
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="relative min-w-[260px] flex-1 sm:max-w-[350px]">
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft"><SearchIcon /></span>
              <input type="text" placeholder={pick(locale, "ابحث عن وظيفة", "Search for a job")} className="w-full rounded-xl border border-line bg-white py-2.5 pr-10 pl-3 text-start text-sm text-ink placeholder:text-ink-soft focus:outline-none focus:ring-2 focus:ring-brand/30" />
            </div>
            <button className="flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-medium text-ink-muted transition-colors hover:bg-surface">
              <ChevDown />
              {pick(locale, "الأحدث أولاً", "Newest first")}
            </button>
          </div>

          {/* Filters */}
          <div className="mb-8 space-y-3 rounded-2xl border border-line bg-surface/50 p-4">
            <div className="flex items-center justify-start gap-1.5 text-sm font-bold text-ink">
              <FilterIcon />
              {pick(locale, "تصفية", "Filter")}
            </div>
            <FilterRow label={pick(locale, "المدينة:", "City:")} options={cities} />
            <FilterRow label={pick(locale, "نوع الدوام:", "Employment type:")} options={employmentTypes} />
          </div>

          {/* Job list */}
          <div className="space-y-4">
            {jobs.map((job) => <JobCard key={job.slug} job={job} locale={locale} />)}
          </div>

          {/* Pagination */}
          <div className="mt-10 flex items-center justify-center gap-2">
            <PagerArrow dir="next" locale={locale} />
            <PageBtn n="20" />
            <span className="px-1 text-ink-soft">…</span>
            <PageBtn n="3" />
            <PageBtn n="2" />
            <PageBtn n="1" active />
            <PagerArrow dir="prev" locale={locale} />
          </div>
        </div>
      </section>
    </>
  );
}

function FilterRow({ label, options }: { label: string; options: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="ml-1 text-sm font-bold text-ink">{label}</span>
      {options.map((o, i) => (
        <button
          key={o}
          className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
            i === 0 ? "bg-brand text-white" : "bg-white text-ink-muted ring-1 ring-line hover:bg-surface"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

function JobCard({ job, locale }: { job: Job; locale: Locale }) {
  return (
    <div className="flex flex-col items-stretch gap-4 rounded-2xl border border-line bg-white p-5 transition-shadow hover:shadow-md sm:flex-row sm:items-center">
      {/* Icon (right) */}
      <span className="order-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand sm:order-1">
        <BriefcaseIcon />
      </span>

      {/* Content */}
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
          <span className="flex items-center gap-1.5 text-xs text-ink-soft">
            <CalendarIcon />
            {job.date}
          </span>
        </div>
      </div>

      {/* Button (left) */}
      <Link
        href={`/careers/${job.slug}`}
        className="order-3 flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
      >
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

function PageBtn({ n, active }: { n: string; active?: boolean }) {
  return (
    <button className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-semibold transition-colors ${active ? "bg-brand text-white" : "text-ink-muted hover:bg-surface"}`}>
      {n}
    </button>
  );
}

function PagerArrow({ dir, locale }: { dir: "next" | "prev"; locale: Locale }) {
  return (
    <button className="flex h-10 w-10 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-surface" aria-label={dir === "next" ? pick(locale, "التالي", "Next") : pick(locale, "السابق", "Previous")}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="dir-flip">
        <path d={dir === "next" ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} />
      </svg>
    </button>
  );
}

/* Icons */
function BriefcaseIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>;
}
function SearchIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>;
}
function FilterIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand"><path d="M22 3H2l8 9.46V19l4 2v-8.54z" /></svg>;
}
function ChevDown() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ink-soft"><path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" /></svg>;
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
