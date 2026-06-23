import type { ReactNode } from "react";
import { pick, type Locale } from "@/i18n/config";

const users = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>
);
const calendar = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18M9 16l2 2 4-4" /></svg>
);
const clipboard = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="8" y="2" width="8" height="4" rx="1" /><path d="M9 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-3" /><path d="M9 13l2 2 4-4" /></svg>
);
const heart = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" /></svg>
);
const layers = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l9 5-9 5-9-5 9-5z" /><path d="M3 12l9 5 9-5M3 17l9 5 9-5" /></svg>
);
const document = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h6" /></svg>
);
const pin = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
);
const trophy = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4z" /><path d="M5 4H3v2a3 3 0 0 0 3 3M19 4h2v2a3 3 0 0 1-3 3" /></svg>
);
const book = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
);

// خريطة أسماء الأيقونات القادمة من الـ CMS إلى الـ SVG
const ICONS: Record<string, ReactNode> = {
  users, calendar, clipboard, heart, layers, document, pin, trophy, book,
};

export type StatItem = { icon: string; value: string; label: string; note: string };

const STATS = [
  { icon: users, value: "+6,300", label: "مستفيد احتُضن بحب", note: "من مختلف أرجاء الوطن" },
  { icon: calendar, value: "+3,200,000", label: "جلسة علاجية تمت", note: "بأعلى معايير الإتقان والتفاني" },
  { icon: clipboard, value: "+155,000", label: "رحلة تقييم وتشخيص", note: "بأدوات حديثة ورؤيةٍ دقيقة" },
  { icon: heart, value: "+48,000", label: "خدمة تلامس الاحتياج", note: "بكل تفانٍ واهتمام" },
  { icon: layers, value: "+10,000", label: "جلسات وبرامج", note: "لكل طفل ومراجع" },
  { icon: document, value: "+320", label: "خطة تأهيل أنشأناها", note: "ولأجل طفلك سخّرناها" },
  { icon: pin, value: "+43", label: "نقطة رعايةٍ ولقاء", note: "تُغطّي أرجاء الوطن" },
  { icon: trophy, value: "+19", label: "عامًا في الريادة", note: "في مجالات التأهيل والرعاية" },
  { icon: book, value: "+7", label: "برامج تأهيلية", note: "لكل مرحلةٍ وعمر" },
];

const STATS_EN = [
  { icon: users, value: "+6,300", label: "Beneficiaries supported with care", note: "From across the Kingdom" },
  { icon: calendar, value: "+3,200,000", label: "Therapeutic sessions delivered with dedication", note: "To the highest standards of quality and care" },
  { icon: clipboard, value: "+155,000", label: "Assessment and diagnostic journeys conducted", note: "Using advanced tools and precise evaluation" },
  { icon: heart, value: "+48,000", label: "Specialized services delivered", note: "With full commitment and attention" },
  { icon: layers, value: "+10,000", label: "Sessions and structured programs provided", note: "For every child and individual we serve" },
  { icon: document, value: "+320", label: "Individualized rehabilitation plans designed", note: "Tailored specifically for each child's needs" },
  { icon: pin, value: "+43", label: "Care points across the Kingdom", note: "Extending our reach nationwide" },
  { icon: trophy, value: "+19", label: "Years of leadership in rehabilitation and care", note: "A legacy of expertise and trust" },
  { icon: book, value: "+7", label: "Rehabilitation programs", note: "Across all stages and ages" },
];

export default function Stats({ locale, items }: { locale: Locale; items?: StatItem[] }) {
  const stats = items && items.length
    ? items.map((s) => ({ ...s, icon: ICONS[s.icon] ?? users }))
    : (locale === "en" ? STATS_EN : STATS);
  return (
    <section className="relative overflow-hidden bg-gradient-to-bl from-brand-deep to-[#0a2329] py-16">
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-brand/10 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            {pick(
              locale,
              <>شواهدُ أثرٍ تتحدث عن <span className="text-brand">نفسها</span></>,
              <>Proof of Impact That Speaks for <span className="text-brand">Itself</span></>
            )}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-white/70">
            {pick(
              locale,
              "أرقامٌ تعكس مسيرتنا نحو مستقبلهم، وأثرٌ نفخر بمشاركته.",
              "Numbers that reflect our journey toward their future — and the impact we are proud to share."
            )}
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-brand/15 text-brand">{s.icon}</div>
              <p className="text-4xl font-extrabold text-white" dir="ltr">{s.value}</p>
              <p className="mt-3 text-base font-bold text-white">{s.label}</p>
              <p className="mt-1 text-xs text-white/60">{s.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
