"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getSpecialists, getContactPrompt, type Specialist } from "@/lib/specialistsData";
import { pick, type Locale } from "@/i18n/config";

export default function SpecialistsGrid({ locale }: { locale: Locale }) {
  const [active, setActive] = useState<Specialist | null>(null);
  const specialists = getSpecialists(locale);

  // فتح المودال عبر الرابط (?open=slug)
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("open");
    if (slug) {
      const found = specialists.find((s) => s.slug === slug);
      if (found) setActive(found);
    }
  }, [specialists]);

  return (
    <>
      <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
        {specialists.map((s) => <Card key={s.slug} s={s} locale={locale} onOpen={() => setActive(s)} />)}
      </div>

      <div className="mt-12 flex justify-center">
        <button className="rounded-2xl border-2 border-brand px-16 py-3 text-sm font-semibold text-brand transition-colors hover:bg-brand hover:text-white">
          {pick(locale, "عرض المزيد", "Load More")}
        </button>
      </div>

      {active && <Modal s={active} locale={locale} onClose={() => setActive(null)} />}
    </>
  );
}

function Card({ s, locale, onOpen }: { s: Specialist; locale: Locale; onOpen: () => void }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-[18px] border border-line bg-white">
      <div className="relative h-[260px] w-full bg-[#f3f5f6]">
        <Image src={s.image} alt={s.name} fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex justify-start">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e8f7f8] px-3 py-1 text-xs font-semibold text-[#1a9aa5]">
            {s.specialty}
            <TagIcon />
          </span>
        </div>
        <h3 className="text-start text-xl font-bold text-ink">{s.name}</h3>
        <p className="text-start text-sm leading-7 text-ink-muted">{s.desc}</p>
        <div className="grid grid-cols-2 gap-y-3 text-sm text-ink-muted">
          <InfoItem icon={<CalendarIcon />} text={s.days} />
          <InfoItem icon={<PinIcon />} text={s.branch} />
          <InfoItem icon={<RibbonIcon />} text={s.experience} />
          <InfoItem icon={<ClockIcon />} text={s.hours} />
        </div>
        <button onClick={onOpen} className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-[14px] bg-brand py-2.5 text-xs font-semibold text-white transition-colors hover:bg-brand-dark">
          {pick(locale, "عرض التفاصيل", "View Details")}
          <EyeIcon />
        </button>
      </div>
    </article>
  );
}

function InfoItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span className="flex items-center justify-start gap-1.5">
      <span className="text-ink-soft">{icon}</span>
      {text}
    </span>
  );
}

function Modal({ s, locale, onClose }: { s: Specialist; locale: Locale; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);

  const contactPrompt = getContactPrompt(locale);
  const experienceValue = pick(
    locale,
    s.experience.replace(" خبرة", ""),
    s.experience.replace(/ of experience$/, ""),
  );

  const chips = [
    { icon: <RibbonIcon />, label: pick(locale, "سنوات الخبرة", "Years of Experience"), value: experienceValue },
    { icon: <PinIcon />, label: pick(locale, "الفروع المتواجد بها", "Available Branches"), value: s.branches },
    { icon: <CalendarIcon />, label: pick(locale, "أيام العمل", "Working Days"), value: s.days },
    { icon: <ClockIcon />, label: pick(locale, "ساعات العمل", "Working Hours"), value: s.hours },
  ];

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-[780px]">
        {/* Close */}
        <button
          onClick={onClose}
          aria-label={pick(locale, "إغلاق", "Close")}
          className="absolute -top-12 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-ink shadow-lg transition-colors hover:bg-white"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>

        <div className="max-h-[94vh] overflow-y-auto rounded-3xl bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center gap-4 bg-gradient-to-bl from-brand to-brand-dark p-5 text-white">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl ring-4 ring-white/20">
              <Image src={s.image} alt={s.name} fill className="object-cover" sizes="80px" />
            </div>
            <div className="flex-1 text-start">
              <h3 className="text-xl font-extrabold">{s.name}</h3>
              <span className="mt-1.5 inline-block rounded-full bg-white/20 px-3 py-0.5 text-xs font-semibold">{s.specialty}</span>
              <p className="mt-1.5 flex items-center justify-start gap-1.5 text-sm text-white/90">
                <PinIcon />
                {s.branch}
              </p>
            </div>
          </div>

          {/* Body */}
          <div className="space-y-4 p-5">
            {/* Chips */}
            <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
              {chips.map((c) => (
                <div key={c.label} className="rounded-xl bg-surface p-2.5 text-start">
                  <span className="flex items-center justify-start gap-1.5 text-[11px] text-ink-soft">
                    <span className="text-brand">{c.icon}</span>
                    {c.label}
                  </span>
                  <p className="mt-0.5 text-sm font-bold text-ink">{c.value}</p>
                </div>
              ))}
            </div>

            {/* About */}
            <div>
              <SectionHeading>{pick(locale, "نبذة عن الأخصائي", "About the Specialist")}</SectionHeading>
              <p className="mt-2 text-start text-sm leading-6 text-ink-muted">{s.about}</p>
            </div>

            {/* Qualifications */}
            <div>
              <SectionHeading>{pick(locale, "الشهادات والمؤهلات", "Certifications & Qualifications")}</SectionHeading>
              <ul className="mt-2 space-y-1.5">
                {s.qualifications.map((q) => (
                  <li key={q} className="flex items-center justify-start gap-2 text-start text-sm text-ink-muted">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-brand"><circle cx="12" cy="12" r="9" /><path d="M8.5 12l2.2 2.2L15.5 9.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    {q}
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact prompt */}
            <div className="flex items-center gap-3 rounded-2xl border border-brand/15 bg-[#eef9fa] p-3.5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand text-white">
                <PhoneIcon />
              </span>
              <div className="text-start">
                <p className="text-sm font-bold text-ink">{contactPrompt.title}</p>
                <p className="mt-0.5 text-xs text-ink-muted">{contactPrompt.subtitle}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center gap-3">
              <a
                href="https://wa.me/966561000274"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
              >
                <PhoneIcon />
                {pick(locale, "تواصل معنا بخصوص هذا الأخصائي", "Contact us about this specialist")}
              </a>
              <button onClick={onClose} className="rounded-xl border border-line px-6 py-3 text-sm font-semibold text-ink-muted transition-colors hover:bg-surface">
                {pick(locale, "إغلاق", "Close")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="flex items-center justify-start gap-2 text-start text-lg font-bold text-ink">
      <span className="h-5 w-1 rounded-full bg-brand" />
      {children}
    </h4>
  );
}

/* Icons */
function TagIcon() {
  return <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><circle cx="7" cy="7" r="1.2" /></svg>;
}
function CalendarIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>;
}
function ClockIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" strokeLinecap="round" /></svg>;
}
function PinIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>;
}
function RibbonIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><circle cx="12" cy="8" r="6" /><path d="M8.5 13.5L7 22l5-3 5 3-1.5-8.5" /></svg>;
}
function EyeIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></svg>;
}
function PhoneIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" /></svg>;
}
