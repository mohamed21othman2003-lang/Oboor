import Link from "next/link";
import { pick, type Locale } from "@/i18n/config";

export type Program = {
  title: string;
  desc: string;
  suits?: string;
  age?: string;
  features: string[];
  regions: string[];
  badge?: string;
  slug?: string;
  href?: string;
};

const sw = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

// أيقونة مميزة لكل برنامج مطابقة للديزاين
const PROGRAM_ICONS: Record<string, React.ReactNode> = {
  // منطلق — شخص
  montaliq: <svg width="20" height="20" viewBox="0 0 24 24" {...sw}><circle cx="12" cy="7" r="4" /><path d="M5 21v-1a7 7 0 0 1 14 0v1" /></svg>,
  // فعّال — شمس
  faal: <svg width="20" height="20" viewBox="0 0 24 24" {...sw}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" /></svg>,
  // الإعداد المدرسي — قبعة تخرج
  "school-prep": <svg width="20" height="20" viewBox="0 0 24 24" {...sw}><path d="M22 10L12 5 2 10l10 5 10-5z" /><path d="M6 12v5c0 1 2.7 2.5 6 2.5s6-1.5 6-2.5v-5" /></svg>,
  // خطى — خطوات
  khuta: <svg width="20" height="20" viewBox="0 0 24 24" {...sw}><path d="M7 4c1.5 0 2.5 1.5 2.5 4S8.5 14 7 14s-2.5-2-2.5-3S5.5 4 7 4zM7 14c1.5 0 2 1 2 3s-.5 3-2 3-2-1.5-2-3 .5-3 2-3z" /><path d="M17 7c-1.5 0-2.5 1.5-2.5 4s1 6 2.5 6 2.5-2 2.5-3-1-7-2.5-7z" /></svg>,
  // التنمية الذهنية — مخ
  "mental-dev": <svg width="20" height="20" viewBox="0 0 24 24" {...sw}><path d="M9.5 3a2.5 2.5 0 0 0-2.5 2.5 2.5 2.5 0 0 0-1 4.8A2.5 2.5 0 0 0 7 15a2.5 2.5 0 0 0 5 .5V5.5A2.5 2.5 0 0 0 9.5 3z" /><path d="M14.5 3A2.5 2.5 0 0 1 17 5.5a2.5 2.5 0 0 1 1 4.8A2.5 2.5 0 0 1 17 15a2.5 2.5 0 0 1-5 .5" /></svg>,
  // الفتيات — رمز أنثى
  girls: <svg width="20" height="20" viewBox="0 0 24 24" {...sw}><circle cx="12" cy="8" r="5" /><path d="M12 13v8M9 18h6" /></svg>,
  // الشباب — رمز ذكر
  youth: <svg width="20" height="20" viewBox="0 0 24 24" {...sw}><circle cx="10" cy="14" r="5" /><path d="M19 5l-5.4 5.4M15 5h4v4" /></svg>,
};

const defaultIcon = <svg width="20" height="20" viewBox="0 0 24 24" {...sw}><path d="M12 2a7 7 0 0 0-4 12.7V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.3A7 7 0 0 0 12 2z" /><path d="M9 21h6M10 18v3M14 18v3" /></svg>;

export default function ProgramCard({ p, locale = "ar" }: { p: Program; locale?: Locale }) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-line border-t-4 border-t-brand bg-white p-6 text-start shadow-sm">
      {/* Header: الأيقونة يمين، وجنبها شارة «برنامج» والعنوان (مجمّعين) — مطابق للديزاين */}
      <div className="mb-3 flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/[0.08] text-brand">
          {(p.slug && PROGRAM_ICONS[p.slug]) || defaultIcon}
        </span>
        <div className="min-w-0">
          <span className="inline-block rounded-full border border-[#b8ebf0] bg-[#e8f7f8] px-3 py-0.5 text-[11px] font-bold text-ink">{p.badge ?? pick(locale, "برنامج", "Program")}</span>
          <h3 className="mt-1.5 text-base font-bold leading-6 text-ink">{p.title}</h3>
        </div>
      </div>

      <p className="mt-2 text-[13px] leading-7 text-ink-muted">{p.desc}</p>

      {/* يناسب pill */}
      {p.suits && (
        <>
          <p className="mt-4 text-xs text-ink-soft">{pick(locale, "يناسب", "Suitable for")}</p>
          <div className="mt-1.5 w-full rounded-full border border-brand bg-[#f0fbfc] px-4 py-1.5 text-center text-xs font-semibold text-[#1796a3]">
            {p.suits}
          </div>
        </>
      )}

      {/* Age */}
      {p.age && (
        <div className="mt-4 flex items-center justify-start gap-2 text-sm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-brand"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>
          <span className="text-ink-soft">{pick(locale, "الفئة العمرية:", "Age group:")} <span className="font-bold text-ink">{p.age}</span></span>
        </div>
      )}

      {/* Checklist (circled checks) */}
      <ul className="mt-3 space-y-2.5">
        {p.features.map((f) => (
          <li key={f} className="flex items-center justify-start gap-2 text-[13px] text-ink-muted">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-brand"><circle cx="12" cy="12" r="9" /><path d="M8.5 12l2.2 2.2L15.5 9.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            {f}
          </li>
        ))}
      </ul>

      {/* Regions */}
      <div className="mt-4 flex flex-wrap justify-start gap-2">
        {p.regions.map((r) => (
          <span key={r} className="inline-flex items-center gap-1 rounded-full bg-surface px-3 py-1 text-xs text-ink-muted">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
            {r}
          </span>
        ))}
      </div>

      {/* فاصل مرن يدفع الزر لأسفل ليتحاذى في كل الكروت */}
      <div className="grow" />

      <Link href={p.href || (p.slug ? `/programs/${p.slug}` : "/programs")} className="mt-5 flex items-center justify-center gap-1 rounded-xl bg-brand py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark">
        {pick(locale, "عرض التفاصيل", "View Details")}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="dir-flip"><path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" /></svg>
      </Link>
    </div>
  );
}
