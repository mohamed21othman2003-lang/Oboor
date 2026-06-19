import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JOBS, getJob } from "@/lib/careersData";
import CareerApplyForm from "@/components/CareerApplyForm";
import { getLocale } from "@/i18n/locale";
import { pick } from "@/i18n/config";

export function generateStaticParams() {
  return JOBS.map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const j = getJob(slug, locale);
  return {
    title: j
      ? `${j.title} | ${pick(locale, "وظائف مركز عبور", "Oboor Center Careers")}`
      : pick(locale, "تفاصيل الوظيفة | مركز عبور", "Job Details | Oboor Center"),
  };
}

function Chev() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="dir-flip"><path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" /></svg>;
}

export default async function JobDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await getLocale();
  const job = getJob(slug, locale);
  if (!job) notFound();

  const details = [
    { icon: <CalendarIcon />, label: pick(locale, "تاريخ طرح الوظيفة", "Posted date"), value: job.date },
    { icon: <CalendarIcon />, label: pick(locale, "تاريخ المباشرة المتوقع", "Expected start date"), value: job.startDate },
    { icon: <ClockIcon />, label: pick(locale, "نوع الدوام", "Employment type"), value: job.employment },
    { icon: <BagIcon />, label: pick(locale, "القسم", "Department"), value: job.department },
    { icon: <PinIcon />, label: pick(locale, "مكان العمل", "Work location"), value: job.city },
    { icon: <RibbonIcon />, label: pick(locale, "الخبرة المطلوبة", "Required experience"), value: job.experience },
  ];

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-bl from-brand-deep to-[#0a2329] text-white">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <nav className="mb-8 flex items-center justify-start gap-2 text-sm text-white/70">
            <span className="text-brand">{job.title}</span>
            <Chev />
            <Link href="/careers" className="hover:text-white">{pick(locale, "الوظائف", "Careers")}</Link>
            <Chev />
            <Link href="/" className="hover:text-white">{pick(locale, "الرئيسية", "Home")}</Link>
          </nav>

          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div className="text-start">
              <h1 className="text-3xl font-extrabold sm:text-4xl">{job.title}</h1>
              <div className="mt-4 flex flex-wrap items-center gap-2.5">
                <HeroChip icon={<PinIcon />}>{job.city}</HeroChip>
                <HeroChip icon={<ClockIcon />}>{job.employment}</HeroChip>
                <HeroChip icon={<BagIcon />}>{job.department}</HeroChip>
                <HeroChip icon={<CalendarIcon />}>{pick(locale, "تاريخ الطرح: ", "Posted: ")}{job.date}</HeroChip>
              </div>
            </div>
            <a href="#apply" className="flex shrink-0 items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark">
              <SendIcon />
              {pick(locale, "قدّم الآن", "Apply Now")}
            </a>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="bg-surface py-14">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-[1fr_320px] lg:px-8">
          {/* Main */}
          <div className="space-y-8 rounded-2xl border border-line bg-white p-7 lg:order-1">
            <Block title={pick(locale, "الوصف الوظيفي", "Job Description")}>
              <p className="text-start text-sm leading-8 text-ink-muted">{job.description}</p>
            </Block>

            <div>
              <SubHeading>{pick(locale, "المهام والمسؤوليات", "Duties & Responsibilities")}</SubHeading>
              <ul className="mt-4 space-y-3">
                {job.responsibilities.map((r) => (
                  <li key={r} className="flex items-start justify-start gap-2.5 text-start text-sm leading-7 text-ink-muted">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0 text-brand"><circle cx="12" cy="12" r="9" /><path d="M8.5 12l2.2 2.2L15.5 9.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <SubHeading>{pick(locale, "الخبرة المطلوبة", "Required Experience")}</SubHeading>
              <ul className="mt-4 space-y-3">
                {job.requirements.map((r) => (
                  <li key={r} className="flex items-start justify-start gap-2.5 text-start text-sm leading-7 text-ink-muted">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <SubHeading>{pick(locale, "تفاصيل الوظيفة", "Job Details")}</SubHeading>
              <div className="mt-4 overflow-hidden rounded-xl border border-line">
                {details.map((d, i) => (
                  <div key={d.label} className={`flex items-center justify-between gap-4 px-4 py-3 text-sm ${i % 2 === 0 ? "bg-surface/60" : "bg-white"}`}>
                    <span className="font-semibold text-ink">{d.value}</span>
                    <span className="flex items-center gap-2 text-ink-soft">
                      {d.label}
                      <span className="text-brand">{d.icon}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:order-2">
            <div className="sticky top-6 overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
              <h3 className="bg-gradient-to-bl from-brand to-brand-dark px-5 py-4 text-center text-base font-bold text-white">{pick(locale, "ملخص الوظيفة", "Job Summary")}</h3>
              <div className="divide-y divide-line">
                <SummaryRow label={pick(locale, "المدينة", "City")} value={job.city} />
                <SummaryRow label={pick(locale, "الدوام", "Employment")} value={job.employment} />
                <SummaryRow label={pick(locale, "الخبرة", "Experience")} value={job.experience} />
                <SummaryRow label={pick(locale, "المباشرة", "Start date")} value={job.startDate} />
              </div>
              <div className="p-4">
                <a href="#apply" className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark">
                  <SendIcon />
                  {pick(locale, "قدّم الآن", "Apply Now")}
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Apply form */}
      <div id="apply">
        <CareerApplyForm jobTitle={job.title} locale={locale} />
      </div>
    </>
  );
}

function HeroChip({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90">
      <span className="text-brand">{icon}</span>
      {children}
    </span>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <SubHeading>{title}</SubHeading>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="text-start text-xl font-extrabold text-ink">{children}</h2>;
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 px-5 py-3 text-sm">
      <span className="font-bold text-ink">{value}</span>
      <span className="text-ink-soft">{label}</span>
    </div>
  );
}

/* Icons */
function PinIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>;
}
function ClockIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" strokeLinecap="round" /></svg>;
}
function BagIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>;
}
function CalendarIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>;
}
function RibbonIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><circle cx="12" cy="8" r="6" /><path d="M8.5 13.5L7 22l5-3 5 3-1.5-8.5" /></svg>;
}
function SendIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4z" /></svg>;
}
