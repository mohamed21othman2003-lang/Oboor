"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { BRANCHES, BRANCHES_EN, regionTabsFrom, type Branch } from "@/lib/branchesData";
import { pick, type Locale } from "@/i18n/config";

export default function BranchesExplorer({ locale, branches }: { locale: Locale; branches?: Branch[] }) {
  // قائمة الفروع من الـ props (CMS) مع fallback للبيانات الثابتة
  const source = branches ?? (locale === "en" ? BRANCHES_EN : BRANCHES);
  const tabs = regionTabsFrom(source, locale);
  const allLabel = pick(locale, "الكل", "All");
  const router = useRouter();
  const sp = useSearchParams();
  const urlQ = sp.get("q") || "";
  const [region, setRegion] = useState(allLabel);
  // بحث تفاعلي بحالة داخلية (يبدأ من ?q لو جاء من سيرش الهيرو)
  const [query, setQuery] = useState(urlQ);
  useEffect(() => { setQuery(urlQ); }, [urlQ]);

  const q = query.trim().toLowerCase();
  const matches = (b: Branch) => [b.name, b.city, b.area, b.region, ...b.services].some((v) => v.toLowerCase().includes(q));

  // عند البحث: نبحث في كل المناطق (لا نقيّده بالتاب اليدوي)، ونفعّل تاب المنطقة
  // تلقائياً إذا كانت كل النتائج تنتمي لمنطقة واحدة — وإلا نُبقي «الكل».
  const searchHits = q ? source.filter(matches) : null;
  let activeRegion = region;
  if (searchHits) {
    const regionsInHits = [...new Set(searchHits.map((b) => b.region))];
    activeRegion = regionsInHits.length === 1 ? regionsInHits[0] : allLabel;
  }
  const list = searchHits
    ? (activeRegion === allLabel ? searchHits : searchHits.filter((b) => b.region === activeRegion))
    : (region === allLabel ? source : source.filter((b) => b.region === region));

  function clearSearch() {
    setQuery("");
    if (urlQ) router.replace("/branches", { scroll: false });
  }

  // النقر على تاب منطقة = تصفّح يدوي، فنمسح البحث ليعكس التاب اختيارك
  function pickRegion(name: string) {
    setRegion(name);
    if (query) setQuery("");
    if (urlQ) router.replace("/branches", { scroll: false });
  }

  return (
    <section id="branches-list" className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-8 text-start">
          <h2 className="text-3xl font-extrabold text-ink">{pick(locale, "تصفّح الفروع ", "Browse Branches ")}<span className="text-brand">{pick(locale, "بالمنطقة", "by Region")}</span></h2>
          <p className="mt-2 text-sm text-ink-muted">{pick(locale, "اختر المنطقة من القائمة لعرض جميع الفروع التابعة لها بشكل مفصّل.", "Choose a region from the list to view all of its branches in detail.")}</p>
        </div>

        {/* Reactive search bar */}
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-1.5 shadow-sm focus-within:ring-2 focus-within:ring-brand/30">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-ink-soft"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={pick(locale, "ابحث بالمدينة أو الحي أو اسم الفرع أو الخدمة...", "Search by city, district, branch name or service...")}
            className="w-full bg-transparent py-2 text-start text-sm text-ink outline-none placeholder:text-ink-soft"
          />
          {query && (
            <button type="button" onClick={clearSearch} aria-label={pick(locale, "مسح", "Clear")} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-surface hover:text-ink">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
          )}
        </div>

        {/* Region tabs */}
        <div className="mb-8 flex flex-wrap items-center justify-start gap-2.5">
          {tabs.map((t) => {
            const active = t.name === activeRegion;
            return (
              <button
                key={t.name}
                onClick={() => pickRegion(t.name)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  active ? "bg-brand text-white" : "bg-white text-ink-muted ring-1 ring-line hover:bg-surface"
                }`}
              >
                <span className={`flex h-5 min-w-[20px] items-center justify-center rounded-full px-1 text-xs font-bold ${active ? "bg-white/25 text-white" : "bg-surface text-ink-soft"}`}>{t.count}</span>
                {t.name}
                <span className={`h-2 w-2 rounded-full ${active ? "bg-white" : "bg-brand"}`} />
              </button>
            );
          })}
        </div>

        {/* Active search note */}
        {q && (
          <p className="mb-6 text-sm text-ink-muted">
            {pick(locale, "نتائج البحث عن: ", "Results for: ")}
            <span className="font-bold text-brand-dark">{q}</span>
            {" — "}
            <span>{pick(locale, `${list.length} فرع`, `${list.length} branch(es)`)}</span>
          </p>
        )}

        {/* Branch cards */}
        {list.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {list.map((b) => <BranchCard key={b.slug} b={b} locale={locale} />)}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-line bg-surface p-12 text-center">
            <p className="text-base font-semibold text-ink">{pick(locale, "لا توجد نتائج مطابقة", "No matching results")}</p>
            <p className="mt-1 text-sm text-ink-muted">{pick(locale, "جرّب اسم مدينة أو فرع آخر.", "Try a different city or branch name.")}</p>
          </div>
        )}
      </div>
    </section>
  );
}

function BranchCard({ b, locale }: { b: Branch; locale: Locale }) {
  return (
    <article className="flex flex-col rounded-2xl border border-line bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      {/* Header — الأيقونة يمين والاسم جنبها مباشرة (مجمّعين على اليمين) */}
      <div className="flex items-start gap-3 border-b border-line pb-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
          <BuildingIcon />
        </span>
        <div className="min-w-0 text-start">
          <h3 className="text-lg font-bold text-ink">{b.name}</h3>
          <p className="mt-0.5 text-sm">
            <span className="font-semibold text-brand">{b.city}</span>{" "}
            <span className="text-ink-soft">{b.area}</span>
          </p>
        </div>
      </div>

      {/* Rows */}
      <div className="space-y-3 py-4">
        {b.address && <InfoRow icon={<PinIcon />} label={pick(locale, "العنوان", "Address")} value={b.address} />}
        {b.hours && <InfoRow icon={<ClockIcon />} label={pick(locale, "أوقات العمل", "Working Hours")} value={b.hours} />}
        {b.manager && <InfoRow icon={<UserIcon />} label={pick(locale, "مدير الفرع", "Branch Manager")} value={b.manager} />}
        {b.phone && <InfoRow icon={<PhoneIcon />} label={pick(locale, "رقم التواصل", "Phone Number")} value={b.phone} href={`tel:${b.phone}`} />}
        {b.phoneEvening && <InfoRow icon={<PhoneIcon />} label={pick(locale, "رقم المساء", "Evening Phone")} value={b.phoneEvening} href={`tel:${b.phoneEvening}`} />}
        {b.email && <InfoRow icon={<MailIcon />} label={pick(locale, "البريد الإلكتروني", "Email")} value={b.email} href={`mailto:${b.email}`} />}
      </div>

      {/* Services */}
      <div className="text-start">
        <p className="mb-2 text-xs font-semibold text-ink-soft">{pick(locale, "الخدمات المتوفرة", "Available Services")}</p>
        <div className="flex flex-wrap justify-start gap-1.5">
          {b.services.map((s) => (
            <span key={s} className="rounded-full bg-surface px-2.5 py-1 text-[11px] font-medium text-brand-dark ring-1 ring-brand/15">{s}</span>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-5 flex items-center gap-2.5">
        <Link href={`/branches/${b.slug}`} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-brand py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark">
          {pick(locale, "عرض التفاصيل", "View Details")}
        </Link>
        <a
          href={b.mapUrl
            ? b.mapUrl
            : b.lat != null && b.lng != null
            ? `https://www.google.com/maps/dir/?api=1&destination=${b.lat},${b.lng}`
            : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([b.address, b.city, pick(locale, "السعودية", "Saudi Arabia")].filter(Boolean).join("، "))}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 rounded-xl border border-brand px-4 py-2.5 text-sm font-semibold text-brand transition-colors hover:bg-brand/5"
        >
          {pick(locale, "الاتجاهات", "Directions")}
          <NavIcon />
        </a>
      </div>
    </article>
  );
}

function InfoRow({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href?: string }) {
  return (
    <div className="text-start">
      <p className="flex items-center justify-start gap-1.5 text-xs font-semibold text-ink-soft">
        <span className="text-brand">{icon}</span>
        {label}
      </p>
      {href ? (
        <a href={href} className="mt-0.5 block text-sm leading-6 text-brand transition-colors hover:text-brand-dark hover:underline" dir="ltr">{value}</a>
      ) : (
        <p className="mt-0.5 text-sm leading-6 text-ink-muted">{value}</p>
      )}
    </div>
  );
}

/* Icons */
function BuildingIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18" /><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" /><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2" /><path d="M10 21v-3a2 2 0 0 1 4 0v3" /></svg>;
}
function PinIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>;
}
function ClockIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" strokeLinecap="round" /></svg>;
}
function PhoneIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" /></svg>;
}
function NavIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>;
}
function UserIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
}
function MailIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>;
}
