import Link from "next/link";
import type { Metadata } from "next";
import { Suspense } from "react";
import { getLocale } from "@/i18n/locale";
import { pick, type Locale } from "@/i18n/config";
import ServiceSearchBar from "@/components/ServiceSearchBar";
import ServicesTabs from "@/components/ServicesTabs";
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
    <section className="relative overflow-hidden bg-gradient-to-bl from-brand-deep to-[#0a2329]">
      <div className="relative mx-auto max-w-7xl px-6 py-14 text-center lg:px-8">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90">
          <span className="h-2 w-2 rounded-full bg-success" />
          {pick(locale, "خدمة العملاء متاحة على مدار الساعة", "Customer service available around the clock")}
        </span>
        <h2 className="mt-5 text-3xl font-extrabold text-white sm:text-4xl">
          {pick(locale, "هل تحتاج مساعدة في اختيار ", "Need help choosing ")}<span className="text-brand">{pick(locale, "الخدمة المناسبة؟", "the right service?")}</span>
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-white/75">
          {pick(
            locale,
            "يمكنك التواصل معنا لمساعدتك في اختيار البرنامج أو الخدمة الأنسب وفق احتياجات طفلك.",
            "Contact us and we'll help you choose the program or service that best fits your child's needs."
          )}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a href="https://wa.me/966920003452" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.978-1.207z" /></svg>
            {pick(locale, "تواصل عبر الواتساب", "Contact via WhatsApp")}
          </a>
          <Link href="/branches" className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-surface">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
            {pick(locale, "اعثر على أقرب فرع", "Find Nearest Branch")}
          </Link>
        </div>
      </div>
    </section>
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
