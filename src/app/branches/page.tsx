import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { BRANCH_FEATURES, BRANCH_FEATURES_EN, mapRegionsFrom } from "@/lib/branchesData";
import { Suspense } from "react";
import BranchesExplorer from "@/components/BranchesExplorer";
import BranchesMapSection from "@/components/BranchesMapSection";
import { getLocale } from "@/i18n/locale";
import { pick } from "@/i18n/config";
import { loadBranches } from "@/lib/server/branches";
import { fetchSections } from "@/lib/server/django";
import { hl } from "@/lib/highlight";
import { CMS_ICONS } from "@/lib/cms/icons";
import CtaSection from "@/components/CtaSection";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return pageMeta(
    pick(locale, "مراكزنا | مركز عبور للرعاية والتأهيل", "Branches | Oboor Center for Care & Rehabilitation"),
    pick(
      locale,
      "ابحث عن أقرب فرع إليك واستكشف خدماتنا في مختلف مناطق المملكة العربية السعودية.",
      "Find your nearest branch and explore our services across the various regions of Saudi Arabia.",
    ),
  );
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
  const en = locale === "en";
  const [branches, sections] = await Promise.all([
    loadBranches(locale),
    fetchSections("branches"),
  ]);

  // مناطق الخريطة (الليجند) مشتقّة من الفروع الفعلية — تتحدّث تلقائياً مع أي تغيير في الفروع
  const mapRegions = mapRegionsFrom(branches);

  const branchFeatures = sections?.features
    ? sections.features.map((row) => ({
        icon: row.icon,
        title: en ? row.title_en || row.title_ar : row.title_ar,
        desc: en ? row.text_en || row.text_ar : row.text_ar,
      }))
    : en ? BRANCH_FEATURES_EN : BRANCH_FEATURES;

  // نصوص الهيرو والعناوين من الـCMS
  const hero = sections?.hero ?? [];
  const hF = (k: string) => hero.find((r) => r.key === k);
  const hT = (r?: (typeof hero)[number]) => (r ? (en ? r.title_en || r.title_ar : r.title_ar) : "");
  const hB = (r?: (typeof hero)[number]) => (r ? (en ? r.text_en || r.text_ar : r.text_ar) : "");
  return (
    <>
      {/* Hero */}
      <section className="overflow-hidden bg-gradient-to-b from-[#ebf7f9] to-white">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <nav className="mb-8 flex items-center justify-start gap-2 text-sm text-ink-soft">
            <span className="text-brand">{pick(locale, "مراكزنا", "Branches")}</span>
            <Chev />
            <Link href="/" className="hover:text-brand">{pick(locale, "الرئيسية", "Home")}</Link>
          </nav>

          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-medium text-brand-dark shadow-sm ring-1 ring-line">
              <PinIconSm />
              {hT(hF("badge")) || pick(locale, "مراكزنا في المملكة", "Our Branches Across the Kingdom")}
            </span>
            <h1 className="mt-5 text-4xl font-extrabold text-ink sm:text-5xl">{hF("heading") ? hl(hT(hF("heading"))) : <><span className="text-brand">{pick(locale, "مراكزنا", "Our Centers")}</span>{pick(locale, "، رعايةٌ تمتد من حولك", " — Care That Extends to You")}</>}</h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-ink-muted">
              {hB(hF("heading")) || pick(locale, "ابحث عن أقرب فرع إليك واستكشف خدماتنا في مختلف مناطق المملكة العربية السعودية.", "Find your nearest branch and explore our services across the various regions of Saudi Arabia.")}
            </p>
          </div>
        </div>
      </section>

      {/* Branches by region (interactive) */}
      <Suspense fallback={null}>
        <BranchesExplorer locale={locale} branches={branches} />
      </Suspense>

      {/* Map */}
      <section className="bg-surface py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-extrabold text-ink">{hF("map_heading") ? hl(hT(hF("map_heading"))) : <>{pick(locale, "على بُعد ", "Just ")}<span className="text-brand">{pick(locale, "خطوة منك", "One Step Away")}</span></>}</h2>
            <p className="mt-2 text-sm text-ink-muted">{hB(hF("map_heading")) || pick(locale, "بضغطة على الخريطة، تجد أقرب فرع إليك، وكل ما تحتاجه للوصول إلينا.", "With a tap on the map, find the nearest branch and everything you need to reach us.")}</p>
          </div>

          <BranchesMapSection locale={locale} branches={branches} regions={mapRegions} />
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold text-ink">{hF("features_heading") ? hl(hT(hF("features_heading"))) : <>{pick(locale, "بيئتنا، ", "Our Environment — ")}<span className="text-brand">{pick(locale, "أمانٌ وتمكين", "Safety and Empowerment")}</span></>}</h2>
            <p className="mt-3 text-sm leading-7 text-ink-muted">
              {hB(hF("features_heading")) || pick(locale, "في كل مراكزنا، نحتضن طفلك برعاية متخصصة، لندعمه في رحلة نموّه، ونمكّنه ليشق طريقه باستقلالية.", "Across all our branches, we embrace your child with specialized care that supports their growth and empowers them to move forward with independence.")}
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {branchFeatures.map((f) => (
              <div key={f.title} className="rounded-2xl border border-line bg-white p-6 text-center shadow-sm">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand">{CMS_ICONS[f.icon] ?? CMS_ICONS.building}</span>
                <h3 className="mt-4 text-base font-bold text-ink">{f.title}</h3>
                <p className="mt-2 text-sm leading-7 text-ink-muted">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <CtaSection
        locale={locale}
        badge={pick(locale, "فريقنا معك، في كل وقت", "Our team is with you at all times.")}
        title={pick(locale, "أتحتاجنا بجانبك لاختيار الوجهة؟", "Need help choosing the right option?")}
        subtitle={pick(locale, "نحن هنا لنكون بوصلتك؛ نختار معًا الفرع الأقرب لروح طفلك، والأنسب لتحقيق طموحه.", "We are here to guide you in finding the most suitable branch for your child's needs and potential, ensuring the best path toward their goals.")}
      />
    </>
  );
}

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
