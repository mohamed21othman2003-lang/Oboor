"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { SuccessStory, StoryHighlightsData } from "@/lib/successStoriesData";
import { getStoryHighlightsData } from "@/lib/successStoriesData";
import { pick, type Locale } from "@/i18n/config";

export default function SuccessStoryCard({ story, locale = "ar", highlights }: { story: SuccessStory; locale?: Locale; highlights?: StoryHighlightsData }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <article className="flex flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-[0_6px_24px_rgba(13,61,69,0.08)] transition-shadow hover:shadow-[0_12px_30px_rgba(13,61,69,0.13)]">
        {/* Image */}
        <div className="relative h-[220px] w-full">
          <Image src={story.image} alt={story.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
          {/* ملاحظة: شارة التصنيف (علاج النطق واللغة) مطبوعة داخل الصورة نفسها،
              فلا نضيف شارة من الكود حتى لا تتكرّر. */}
          {/* duration (bottom, dark slate) */}
          <span className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-lg bg-[#36474d]/90 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
            <ClockIcon />
            {story.durationLabel}
          </span>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col p-5">
          <h3 className="text-start text-lg font-extrabold text-ink">{story.name} - {story.age}</h3>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-[#f4dcdc] bg-[#fdf3f3] p-3 text-start">
              <p className="text-xs font-bold text-[#d9534f]">{pick(locale, "قبل الالتحاق", "Before")}</p>
              <p className="mt-1.5 text-xs leading-6 text-ink-muted">{story.before}</p>
            </div>
            <div className="rounded-xl border border-brand/15 bg-[#eef9fa] p-3 text-start">
              <p className="text-xs font-bold text-brand-dark">{pick(locale, "بعد البرنامج", "After")}</p>
              <p className="mt-1.5 text-xs leading-6 text-ink-muted">{story.after}</p>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-brand/15 bg-[#f7fcfd] p-4 text-start">
            <QuoteIcon />
            <p className="mt-1 text-xs leading-6 text-ink-muted">{story.quote}</p>
            <div className="mt-3 flex items-center justify-between gap-2 border-t border-brand/10 pt-3 text-[11px] text-ink-soft">
              <span className="flex items-center gap-1"><span className="text-brand"><UserIcon /></span>{story.author}</span>
              <span className="flex items-center gap-1"><span className="text-brand"><UsersIcon /></span>{story.metaAge}</span>
              <span className="flex items-center gap-1"><span className="text-brand"><ClockIcon /></span>{story.metaDuration}</span>
            </div>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            <EyeIcon />
            {pick(locale, "عرض التفاصيل", "View Details")}
          </button>
        </div>
      </article>

      {open && <StoryModal story={story} locale={locale} highlights={highlights} onClose={() => setOpen(false)} />}
    </>
  );
}

function StoryModal({ story, locale, highlights, onClose }: { story: SuccessStory; locale: Locale; highlights?: StoryHighlightsData; onClose: () => void }) {
  const h = highlights ?? getStoryHighlightsData(locale);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);

  const stats = [
    { label: h.durationLabel, value: story.metaDuration, icon: <ClockIcon /> },
    { label: h.ageLabel, value: story.age, icon: <UsersIcon /> },
    { label: h.programLabel, value: h.program, icon: <BookIcon small /> },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="relative flex max-h-[92vh] w-full max-w-[600px] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Decorative header */}
        <div className="relative h-[176px] shrink-0 overflow-hidden bg-[#e8f7f9]">
          {/* dotted journey path */}
          <svg className="absolute inset-0 h-full w-full text-brand/35" viewBox="0 0 600 208" fill="none" preserveAspectRatio="none">
            <path d="M-10 150 C 120 60, 220 60, 300 110 S 480 170, 610 80" stroke="currentColor" strokeWidth="2.5" strokeDasharray="3 9" strokeLinecap="round" />
          </svg>
          {/* faint book illustration */}
          <span className="absolute bottom-6 start-8 text-brand/25"><BookBig /></span>
          {/* brand */}
          <span className="absolute top-6 start-1/2 -translate-x-1/2 text-2xl font-extrabold tracking-tight text-brand/30">{pick(locale, "عبور", "Oboor")}</span>
          {/* badge */}
          <span className="absolute end-6 top-1/2 -translate-y-1/2 inline-flex items-center gap-1.5 rounded-full bg-brand px-3.5 py-1.5 text-xs font-bold text-white shadow-md">
            <SparkIcon />
            {h.badge}
          </span>
          {/* framed photo */}
          <div className="absolute left-1/2 top-1/2 h-[126px] w-[118px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-white p-1.5 shadow-[0_12px_30px_rgba(13,61,69,0.18)]">
            <div className="relative h-full w-full overflow-hidden rounded-xl">
              <Image src={story.image} alt={story.name} fill className="object-cover" sizes="140px" />
            </div>
          </div>
          {/* Close */}
          <button
            onClick={onClose}
            aria-label={pick(locale, "إغلاق", "Close")}
            className="absolute end-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink shadow transition-colors hover:bg-white"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>

        {/* Body */}
        <div className="space-y-2.5 overflow-y-auto p-5 pt-4">
          {/* name */}
          <h3 className="text-center text-lg font-extrabold text-ink">{story.name} - {story.age}</h3>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2.5">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl border border-brand/15 bg-[#f3fbfc] p-2.5 text-start">
                <span className="flex items-center justify-start gap-1 text-[11px] font-medium text-brand-dark">
                  <span className="text-brand">{s.icon}</span>
                  {s.label}
                </span>
                <p className="mt-1 text-[13px] font-bold text-ink">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Specialist note (before -> after) */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="rounded-xl border border-[#f4dcdc] bg-[#fdf3f3] p-2.5 text-start">
              <p className="text-[11px] font-bold text-[#d9534f]">{pick(locale, "قبل الالتحاق", "Before")}</p>
              <p className="mt-1 text-[12px] leading-5 text-ink-muted">{story.before}</p>
            </div>
            <div className="rounded-xl border border-brand/15 bg-[#eef9fa] p-2.5 text-start">
              <p className="text-[11px] font-bold text-brand-dark">{pick(locale, "بعد البرنامج", "After")}</p>
              <p className="mt-1 text-[12px] leading-5 text-ink-muted">{story.after}</p>
            </div>
          </div>

          {/* Journey */}
          <div>
            <SectionHeading>{h.journeyTitle}</SectionHeading>
            <p className="mt-1.5 text-start text-[12px] leading-6 text-ink-muted">{h.journeyTemplate.replace("{name}", story.name)}</p>
          </div>

          {/* Results */}
          <div>
            <SectionHeading>{h.resultsTitle}</SectionHeading>
            <ul className="mt-2 grid grid-cols-1 gap-x-4 gap-y-1.5 sm:grid-cols-2">
              {h.results.map((r) => (
                <li key={r} className="flex items-start justify-start gap-1.5 text-start text-[12px] leading-5 text-ink-muted">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0 text-brand"><circle cx="12" cy="12" r="9" /><path d="M8.5 12l2.2 2.2L15.5 9.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  {r}
                </li>
              ))}
            </ul>
          </div>

          {/* Quote */}
          <div className="rounded-2xl border border-brand/20 bg-[#f3fbfc] p-3.5 text-start">
            <p className="text-[13px] leading-6 text-ink">“{story.quote}”</p>
            <div className="mt-2.5 flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs font-semibold text-ink">
                <UserIcon />{story.author}
                <span className="text-ink-soft">· {story.metaDuration}</span>
              </span>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="text-[#f5b50a]"><polygon points="12 2 15 8.9 22.5 9.3 16.7 14 18.6 21.2 12 17.2 5.4 21.2 7.3 14 1.5 9.3 9 8.9" /></svg>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="flex items-center justify-start gap-2 text-start text-base font-bold text-ink">
      <span className="h-5 w-1 rounded-full bg-brand" />
      {children}
    </h4>
  );
}

function ClockIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" strokeLinecap="round" /></svg>;
}
function UsersIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
}
function UserIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0"><circle cx="12" cy="7" r="4" /><path d="M5 21v-1a7 7 0 0 1 14 0v1" /></svg>;
}
function BookIcon({ small }: { small?: boolean }) {
  const s = small ? 13 : 18;
  return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>;
}
function BookBig() {
  return <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>;
}
function SparkIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.6 5.4L19 9l-5.4 1.6L12 16l-1.6-5.4L5 9l5.4-1.6z" /></svg>;
}
function EyeIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></svg>;
}
function QuoteIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="text-brand/30"><path d="M7.5 6C5 6 3 8 3 10.5S5 15 7.5 15c0 2-1.5 3-3 3.5l.5 1.5c3-1 5-3.5 5-7V10.5C10 8 9 6 7.5 6zM18.5 6C16 6 14 8 14 10.5S16 15 18.5 15c0 2-1.5 3-3 3.5l.5 1.5c3-1 5-3.5 5-7V10.5C21 8 20 6 18.5 6z" /></svg>;
}
