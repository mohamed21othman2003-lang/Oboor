import Link from "next/link";
import type { Metadata } from "next";
import { Suspense } from "react";
import { getLocale } from "@/i18n/locale";
import { pick, type Locale } from "@/i18n/config";
import ServiceSearchBar from "@/components/ServiceSearchBar";
import ServicesTabs from "@/components/ServicesTabs";
import CtaSection from "@/components/CtaSection";
import type { Program } from "@/components/ProgramCard";
import { fetchContent } from "@/lib/server/django";

// صفّ بطاقة خدمة كما يرجع من Django (content/service-cards)
type ServiceCardRow = {
  tab: "programs" | "clinical" | "techniques";
  slug: string;
  href: string;
  order: number;
  badge_ar: string; badge_en: string;
  title_ar: string; title_en: string;
  desc_ar: string; desc_en: string;
  suits_ar: string; suits_en: string;
  age_ar: string; age_en: string;
  features_ar: string[]; features_en: string[];
  regions_ar: string[]; regions_en: string[];
};

type ServiceCards = { programs: Program[]; clinical: Program[]; techniques: Program[] };

// نحوّل صفّ Django إلى شكل Program حسب اللغة
function toProgram(row: ServiceCardRow, en: boolean): Program {
  return {
    slug: row.slug,
    href: row.href || undefined,
    badge: en ? row.badge_en || row.badge_ar : row.badge_ar,
    title: en ? row.title_en || row.title_ar : row.title_ar,
    desc: en ? row.desc_en || row.desc_ar : row.desc_ar,
    suits: en ? row.suits_en || row.suits_ar : row.suits_ar,
    age: en ? row.age_en || row.age_ar : row.age_ar,
    features: en ? (row.features_en?.length ? row.features_en : row.features_ar) : row.features_ar,
    regions: en ? (row.regions_en?.length ? row.regions_en : row.regions_ar) : row.regions_ar,
  };
}

// نجمّع البطاقات حسب الـ tab مع احترام order. نرجّع undefined لو Django مش متاح → ServicesTabs يستخدم الثابت
async function getServiceCards(locale: Locale): Promise<ServiceCards | undefined> {
  const rows = await fetchContent<ServiceCardRow[]>("service-cards");
  if (!rows || !rows.length) return undefined;
  const en = locale === "en";
  const grouped: ServiceCards = { programs: [], clinical: [], techniques: [] };
  for (const row of [...rows].sort((a, b) => a.order - b.order)) {
    if (row.tab in grouped) grouped[row.tab].push(toProgram(row, en));
  }
  return grouped;
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: pick(
      locale,
      "خدمات مراكز عبور | البرامج والخدمات والتقنيات",
      "Oboor Centers Services | Programs, Services & Technologies"
    ),
    description: pick(
      locale,
      "برامج تأهيلية وخدمات عيادية وتقنيات تأهيلية من مراكز عبور",
      "Rehabilitation programs, clinical services, and rehabilitation technologies from Oboor Centers"
    ),
  };
}

function Hero({ locale }: { locale: Locale }) {
  return (
    <section className="bg-gradient-to-b from-[#ebf7f9] to-white">
      <div className="mx-auto max-w-7xl px-6 pb-16 pt-10 lg:px-8">
        <nav className="mb-8 flex items-center justify-start gap-2 text-sm text-ink-soft">
          <span className="text-brand">{pick(locale, "برامجنا التمكينية", "Services")}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="dir-flip"><path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" /></svg>
          <Link href="/" className="hover:text-brand">{pick(locale, "الرئيسية", "Home")}</Link>
        </nav>

        <div className="mb-8 text-center">
          <span className="rounded-full bg-white px-4 py-1.5 text-sm font-medium text-brand-dark shadow-sm ring-1 ring-line">
            {pick(locale, "برامجنا التمكينية في المملكة", "Our Services in Saudi Arabia")}
          </span>
          <h1 className="mt-5 text-3xl font-extrabold text-ink sm:text-4xl">
            {pick(locale, "برامجنا ", "Our Empowerment ")}<span className="text-brand">{pick(locale, "التمكينية", "Programs")}</span>
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-ink-muted">
            {pick(
              locale,
              "نقدم في عبور برامج تأهيلية وخدمات عيادية وتقنيات تأهيلية لدعم الأطفال والأسر وفق احتياجات كل حالة.",
              "At Oboor we offer rehabilitation programs, clinical services, and rehabilitation technologies to support children and families according to each case's needs."
            )}
          </p>
        </div>

        <ServiceSearchBar regionValue={pick(locale, "كل المناطق", "All Regions")} locale={locale} />
      </div>
    </section>
  );
}

function CTA({ locale }: { locale: Locale }) {
  return (
    <CtaSection
      locale={locale}
      title={<>{pick(locale, "هل تحتاج مساعدة في اختيار ", "Need help choosing ")}<span className="text-brand">{pick(locale, "الخدمة المناسبة؟", "the right service?")}</span></>}
      subtitle={pick(locale, "يمكنك التواصل معنا لمساعدتك في اختيار البرنامج أو الخدمة الأنسب وفق احتياجات طفلك.", "Contact us and we'll help you choose the program or service that best fits your child's needs.")}
    />
  );
}

export default async function ServicesPage() {
  const locale = await getLocale();
  const cards = await getServiceCards(locale);
  return (
    <>
      <Hero locale={locale} />
      <Suspense fallback={null}>
        <ServicesTabs locale={locale} cards={cards} />
      </Suspense>
      <CTA locale={locale} />
    </>
  );
}
