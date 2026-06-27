"use client";

import { useState } from "react";
import Link from "next/link";
import ProgramCard from "@/components/ProgramCard";
import ServiceSearchBar from "@/components/ServiceSearchBar";
import { serviceCategories, type ServiceCategoryKey } from "@/components/ServicesTabs";
import { pick, type Locale } from "@/i18n/config";
import { hl, type HomeChrome } from "@/lib/highlight";

const bookIcon = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>;
const stethoscopeIcon = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 3v6a5 5 0 0 0 10 0V3" /><path d="M4 3H2M14 3h-2M9 14v3a4 4 0 0 0 8 0v-1" /><circle cx="19" cy="13" r="2" /></svg>;
const chipIcon = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="6" y="6" width="12" height="12" rx="2" /><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" /></svg>;

const CHIP_ICON: Record<ServiceCategoryKey, React.ReactNode> = { programs: bookIcon, clinical: stethoscopeIcon, techniques: chipIcon };

export default function SmartSearch({ locale, chrome }: { locale: Locale; chrome?: HomeChrome }) {
  const cats = serviceCategories(locale);
  const [active, setActive] = useState<ServiceCategoryKey>("programs");
  const current = cats.find((c) => c.key === active)!;

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-4 py-1.5 text-sm font-medium text-brand-dark">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></svg>
            {chrome?.["smart_search.badge"]?.title || pick(locale, "البحث الذكي عن الخدمات", "Smart Service Search")}
          </span>
          <h2 className="mt-4 text-3xl font-extrabold text-ink sm:text-4xl">
            {chrome?.["smart_search.main"]?.title
              ? hl(chrome["smart_search.main"].title)
              : pick(locale, <>دليلك الذكي <span className="text-brand">لخطوتك الأولى</span></>, <>Your Smart Guide to the <span className="text-brand">First Step</span></>)}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-ink-muted">
            {chrome?.["smart_search.main"]?.text || pick(
              locale,
              "بخطواتٍ بسيطة، حدّد فئة البرنامج والخدمة أو التقنية التي يحتاجها طفلك، واختر الفرع الأقرب إليك؛ لنأخذ بيد طفلك في رحلة تأهيلية متكاملة تُناسب احتياجاته.",
              "In a few simple steps, identify the program category, service, or therapy your child needs, and choose the nearest branch. We will guide your child through a comprehensive rehabilitation journey tailored to their individual needs."
            )}
          </p>
        </div>

        <ServiceSearchBar locale={locale} />

        {/* Quick chips — centered; switch the results below in-place */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <span className="text-sm text-ink-soft">{pick(locale, "تصفح مباشرة:", "Browse directly:")}</span>
          {cats.map((c) => {
            const on = c.key === active;
            return (
              <button
                key={c.key}
                onClick={() => setActive(c.key)}
                className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${on ? "bg-brand text-white" : "bg-surface text-ink-muted hover:bg-brand/10 hover:text-brand-dark"}`}
              >
                {c.label}
                {CHIP_ICON[c.key]}
              </button>
            );
          })}
        </div>

        {/* Results — reflect the active chip, in-page */}
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {current.items.map((p) => (
            <ProgramCard key={p.title} p={p} locale={locale} />
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href={`/programs#${active}`} className="inline-block rounded-xl border border-brand px-10 py-3 text-sm font-semibold text-brand transition-colors hover:bg-brand hover:text-white">
            {pick(locale, "المزيد", "View More")}
          </Link>
        </div>
      </div>
    </section>
  );
}
