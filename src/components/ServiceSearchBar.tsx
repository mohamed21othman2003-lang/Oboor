import { pick, type Locale } from "@/i18n/config";

function Field({ label, value, icon, boxed }: { label: string; value: string; icon: React.ReactNode; boxed?: boolean }) {
  return (
    <div className="flex flex-1 items-center justify-start gap-3 px-3 py-1">
      {boxed ? (
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">{icon}</span>
      ) : (
        <span className="shrink-0 text-brand">{icon}</span>
      )}
      <div className="min-w-0 flex-1 text-start">
        <p className="text-[11px] text-ink-soft">{label}</p>
        <p className="truncate text-sm font-bold text-ink">{value}</p>
      </div>
      <Chevron />
    </div>
  );
}

function Chevron() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-ink-soft">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
    </svg>
  );
}

export default function ServiceSearchBar({ regionValue, locale = "ar", searchLabel }: { regionValue?: string; locale?: Locale; searchLabel?: string }) {
  return (
    <div className="flex flex-col items-stretch gap-2 rounded-2xl bg-white p-3 shadow-md ring-1 ring-line lg:flex-row lg:items-center">
      <Field
        boxed
        label={pick(locale, "الفئة الرئيسية", "Main Category")}
        value={pick(locale, "برامج تأهيلية", "Rehabilitation Programs")}
        icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>}
      />
      <span className="hidden h-9 w-px shrink-0 bg-line lg:block" />
      <Field
        label={pick(locale, "اختر البرنامج", "Select Program")}
        value={pick(locale, "كل البرامج", "All Programs")}
        icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>}
      />
      <span className="hidden h-9 w-px shrink-0 bg-line lg:block" />
      <Field
        label={pick(locale, "المنطقة / الفرع", "Region / Branch")}
        value={regionValue ?? pick(locale, "الرياض", "Riyadh")}
        icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>}
      />
      <span className="hidden h-9 w-px shrink-0 bg-line lg:block" />
      <button className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark">
        {searchLabel ?? pick(locale, "ابحث الآن", "Search Now")}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" strokeLinecap="round" /></svg>
      </button>
      <button aria-label={pick(locale, "إعادة تعيين", "Reset")} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-surface">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
    </div>
  );
}
