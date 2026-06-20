import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { MAP_REGIONS, MAP_REGIONS_EN, BRANCH_FEATURES, BRANCH_FEATURES_EN } from "@/lib/branchesData";
import { Suspense } from "react";
import BranchesExplorer from "@/components/BranchesExplorer";
import BranchSearch from "@/components/BranchSearch";
import { getLocale } from "@/i18n/locale";
import { pick } from "@/i18n/config";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: pick(locale, "فروعنا | مركز عبور للرعاية والتأهيل", "Branches | Oboor Center for Care & Rehabilitation"),
    description: pick(
      locale,
      "ابحث عن أقرب فرع إليك واستكشف خدماتنا في مختلف مناطق المملكة العربية السعودية.",
      "Find your nearest branch and explore our services across the various regions of Saudi Arabia.",
    ),
  };
}

function Chev() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="dir-flip"><path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" /></svg>;
}

// مواقع تقريبية للدبابيس على الخريطة (% من العرض/الارتفاع)
const PINS = [
  { top: "52%", left: "58%", color: "#2cbcc8" },
  { top: "46%", left: "55%", color: "#3b82f6" },
  { top: "30%", left: "48%", color: "#ef4444" },
  { top: "40%", left: "40%", color: "#8b5cf6" },
  { top: "60%", left: "33%", color: "#3b82f6" },
  { top: "33%", left: "62%", color: "#f59e0b" },
  { top: "44%", left: "30%", color: "#ec4899" },
  { top: "62%", left: "52%", color: "#10b981" },
];

export default async function BranchesPage() {
  const locale = await getLocale();
  const mapRegions = locale === "en" ? MAP_REGIONS_EN : MAP_REGIONS;
  const branchFeatures = locale === "en" ? BRANCH_FEATURES_EN : BRANCH_FEATURES;
  return (
    <>
      {/* Hero */}
      <section className="overflow-hidden bg-gradient-to-b from-[#ebf7f9] to-white">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <nav className="mb-8 flex items-center justify-start gap-2 text-sm text-ink-soft">
            <span className="text-brand">{pick(locale, "فروعنا", "Branches")}</span>
            <Chev />
            <Link href="/" className="hover:text-brand">{pick(locale, "الرئيسية", "Home")}</Link>
          </nav>

          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-medium text-brand-dark shadow-sm ring-1 ring-line">
              <PinIconSm />
              {pick(locale, "فروعنا في المملكة", "Our Branches Across the Kingdom")}
            </span>
            <h1 className="mt-5 text-4xl font-extrabold text-ink sm:text-5xl"><span className="text-brand">{pick(locale, "مراكزنا", "Our Centers")}</span>{pick(locale, "، رعايةٌ تمتد من حولك", " — Care That Extends to You")}</h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-ink-muted">
              {pick(locale, "ابحث عن أقرب فرع إليك واستكشف خدماتنا في مختلف مناطق المملكة العربية السعودية.", "Find your nearest branch and explore our services across the various regions of Saudi Arabia.")}
            </p>
          </div>

          {/* Search bar */}
          <BranchSearch locale={locale} />
        </div>
      </section>

      {/* Branches by region (interactive) */}
      <Suspense fallback={null}>
        <BranchesExplorer locale={locale} />
      </Suspense>

      {/* Map */}
      <section className="bg-surface py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-extrabold text-ink">{pick(locale, "على بُعد ", "Just ")}<span className="text-brand">{pick(locale, "خطوة منك", "One Step Away")}</span></h2>
            <p className="mt-2 text-sm text-ink-muted">{pick(locale, "بضغطة على الخريطة، تجد أقرب فرع إليك، وكل ما تحتاجه للوصول إلينا.", "With a tap on the map, find the nearest branch and everything you need to reach us.")}</p>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-line shadow-sm">
            <div className="relative aspect-[1233/600] w-full">
              <Image src="/figma/branches-map.png" alt={pick(locale, "خريطة فروع عبور في المملكة", "Map of Oboor branches across the Kingdom")} fill className="object-cover" sizes="100vw" />

              {/* Pins */}
              {PINS.map((p, i) => (
                <span key={i} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ top: p.top, left: p.left }}>
                  <span className="block h-3.5 w-3.5 rounded-full border-2 border-white shadow" style={{ background: p.color }} />
                </span>
              ))}

              {/* Zoom controls */}
              <div className="absolute left-4 top-4 flex flex-col gap-2">
                <ZoomBtn>+</ZoomBtn>
                <ZoomBtn>−</ZoomBtn>
                <ZoomBtn><ExpandIcon /></ZoomBtn>
              </div>

              {/* Legend */}
              <div className="absolute right-4 top-4 hidden w-44 rounded-xl bg-white/95 p-3 shadow-lg backdrop-blur sm:block">
                <p className="mb-2 border-b border-line pb-1.5 text-start text-xs font-bold text-ink">{pick(locale, "المناطق", "Regions")}</p>
                <ul className="space-y-1.5">
                  {mapRegions.map((r) => (
                    <li key={r.name} className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-ink-soft">{r.count}</span>
                      <span className="flex items-center gap-1.5 text-ink-muted">
                        {r.name}
                        <span className="h-2 w-2 rounded-full" style={{ background: r.color }} />
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Branch popup */}
              <div className="absolute left-1/2 top-1/2 w-[300px] max-w-[88%] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-4 shadow-2xl">
                <div className="flex items-start justify-between">
                  <button className="text-ink-soft hover:text-ink" aria-label={pick(locale, "إغلاق", "Close")}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
                  </button>
                  <div className="flex items-center gap-1.5">
                    <span className="rounded-md bg-brand/10 px-2 py-0.5 text-[10px] font-bold text-brand">{pick(locale, "جديد", "New")}</span>
                    <span className="flex items-center gap-1 rounded-md bg-danger/10 px-2 py-0.5 text-[10px] font-bold text-danger"><span className="h-1.5 w-1.5 rounded-full bg-danger" />{pick(locale, "مغلق", "Closed")}</span>
                  </div>
                </div>
                <h3 className="mt-1 text-start text-base font-bold text-ink">{pick(locale, "فرع النرجس", "Al-Narjes Branch")}</h3>
                <p className="mt-1 text-start text-xs leading-5 text-ink-muted">{pick(locale, "حي النرجس، طريق الأمير محمد بن سلمان، الرياض", "Al-Narjes District, Prince Mohammed Bin Salman Road, Riyadh")}</p>
                <p className="mt-2 flex items-center justify-start gap-1.5 text-start text-xs text-ink-soft"><ClockIconSm />{pick(locale, "الأحد – الخميس: ٨ص – ٨م", "Sunday – Thursday: 8 AM – 8 PM")}</p>
                <p className="mt-1 flex items-center justify-start gap-1.5 text-start text-xs text-ink-soft"><PhoneIconSm />0561000274</p>
                <div className="mt-3 flex items-center gap-2">
                  <Link href="/branches/narjes" className="flex-1 rounded-lg bg-brand py-2 text-center text-xs font-semibold text-white transition-colors hover:bg-brand-dark">{pick(locale, "عرض التفاصيل", "View Details")}</Link>
                  <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pick(locale, "مركز عبور - حي النرجس، طريق الأمير محمد بن سلمان، الرياض", "Oboor Center - Al-Narjes District, Prince Mohammed Bin Salman Road, Riyadh"))}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 rounded-lg border border-brand px-3 py-2 text-xs font-semibold text-brand transition-colors hover:bg-brand/5">{pick(locale, "الاتجاهات", "Directions")}<NavIconSm /></a>
                </div>
              </div>

              {/* Count badge */}
              <span className="absolute bottom-4 left-4 rounded-lg bg-brand px-3 py-1.5 text-xs font-bold text-white shadow">{pick(locale, "42 فرع", "42 Branches")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold text-ink">{pick(locale, "بيئتنا، ", "Our Environment — ")}<span className="text-brand">{pick(locale, "أمانٌ وتمكين", "Safety and Empowerment")}</span></h2>
            <p className="mt-3 text-sm leading-7 text-ink-muted">
              {pick(locale, "في كل فروعنا، نحتضن طفلك برعاية متخصصة، لندعمه في رحلة نموّه، ونمكّنه ليشق طريقه باستقلالية.", "Across all our branches, we embrace your child with specialized care that supports their growth and empowers them to move forward with independence.")}
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {branchFeatures.map((f) => (
              <div key={f.title} className="rounded-2xl border border-line bg-white p-6 text-center shadow-sm">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand">{FEATURE_ICONS[f.icon]}</span>
                <h3 className="mt-4 text-base font-bold text-ink">{f.title}</h3>
                <p className="mt-2 text-sm leading-7 text-ink-muted">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-gradient-to-bl from-brand-deep to-[#0a2329]">
        <div className="relative mx-auto max-w-7xl px-6 py-14 text-center lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90">
            <span className="h-2 w-2 rounded-full bg-success" />
            {pick(locale, "فريقنا معك، في كل وقت", "Our team is with you at all times.")}
          </span>
          <h2 className="mt-5 text-3xl font-extrabold text-white sm:text-4xl">{pick(locale, "أتحتاجنا بجانبك لاختيار الوجهة؟", "Need help choosing the right option?")}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-white/75">{pick(locale, "نحن هنا لنكون بوصلتك؛ نختار معًا الفرع الأقرب لروح طفلك، والأنسب لتحقيق طموحه.", "We are here to guide you in finding the most suitable branch for your child's needs and potential, ensuring the best path toward their goals.")}</p>
          <div className="mt-8 flex justify-center">
            <a href="https://wa.me/966920003452" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90">
              <WhatsappIcon />
              {pick(locale, "تواصل عبر الواتساب", "Contact via WhatsApp")}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

const FEATURE_ICONS: Record<string, React.ReactNode> = {
  graduation: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10 12 5 2 10l10 5 10-5z" /><path d="M6 12v5c0 1 2.7 2.5 6 2.5s6-1.5 6-2.5v-5" /></svg>,
  shield: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l8 3v6c0 5-3.4 8.6-8 11-4.6-2.4-8-6-8-11V5z" /><path d="M9 12l2 2 4-4" /></svg>,
  heart: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" /></svg>,
  building: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2" /></svg>,
};

function ZoomBtn({ children }: { children: React.ReactNode }) {
  return <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-ink-muted shadow">{children}</span>;
}

/* Icons */
function PinIconSm() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand"><path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>;
}
function ExpandIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>;
}
function ClockIconSm() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-brand"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" strokeLinecap="round" /></svg>;
}
function PhoneIconSm() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-brand"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" /></svg>;
}
function NavIconSm() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>;
}
function WhatsappIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.5A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-2.8.9.9-2.7-.2-.3A8 8 0 1 1 12 20zm4.4-6c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1a6.5 6.5 0 0 1-3.2-2.8c-.2-.4.2-.4.6-1.2.1-.2 0-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a1 1 0 0 0-.7.3c-.2.3-.9.9-.9 2.2s.9 2.5 1 2.7c.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.7.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1z" /></svg>;
}
