import Link from "next/link";
import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { Suspense } from "react";
import { getLocale } from "@/i18n/locale";
import { pick, type Locale } from "@/i18n/config";
import ServiceSearchBar from "@/components/ServiceSearchBar";
import ServicesTabs from "@/components/ServicesTabs";
import CtaSection from "@/components/CtaSection";
import type { Program } from "@/components/ProgramCard";
import { fetchSections, getBranchRegions } from "@/lib/server/django";
import { loadServiceCards } from "@/lib/server/serviceCards";
import { hl } from "@/lib/highlight";

type ServiceCards = { programs: Program[]; clinical: Program[]; techniques: Program[] };

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return pageMeta(
    pick(
      locale,
      "خدمات مراكز عبور | البرامج والخدمات والتقنيات",
      "Oboor Centers Services | Programs, Services & Technologies"
    ),
    pick(
      locale,
      "اكتشف برامج عبور التمكينية: برامج تأهيلية وخدمات عيادية متخصصة وتقنيات حديثة — التدخل المبكر، النطق والتخاطب، العلاج الوظيفي والطبيعي.",
      "Explore Oboor's empowerment programs: specialized rehabilitation programs, clinical services, and modern technologies — early intervention, speech therapy, occupational and physical therapy."
    ),
  );
}

function Hero({ locale, badge, heading, subtitle, cards, regions }: { locale: Locale; badge?: string; heading?: string; subtitle?: string; cards?: ServiceCards; regions?: string[] }) {
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
            {badge || pick(locale, "برامجنا التمكينية في المملكة", "Our Services in Saudi Arabia")}
          </span>
          <h1 className="mt-5 text-3xl font-extrabold text-ink sm:text-4xl">
            {heading ? hl(heading) : <>{pick(locale, "برامجنا ", "Our Empowerment ")}<span className="text-brand">{pick(locale, "التمكينية", "Programs")}</span></>}
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-ink-muted">
            {subtitle || pick(
              locale,
              "نقدم في عبور برامج تأهيلية وخدمات عيادية وتقنيات تأهيلية لدعم الأطفال والأسر وفق احتياجات كل حالة.",
              "At Oboor we offer rehabilitation programs, clinical services, and rehabilitation technologies to support children and families according to each case's needs."
            )}
          </p>
        </div>

        <ServiceSearchBar locale={locale} cards={cards} regions={regions} />
      </div>
    </section>
  );
}

function CTA({ locale, title, subtitle, badge }: { locale: Locale; title?: React.ReactNode; subtitle?: string; badge?: string }) {
  return (
    <CtaSection
      locale={locale}
      badge={badge}
      title={title ?? <>{pick(locale, "هل تحتاج مساعدة في اختيار ", "Need help choosing ")}<span className="text-brand">{pick(locale, "الخدمة المناسبة؟", "the right service?")}</span></>}
      subtitle={subtitle ?? pick(locale, "يمكنك التواصل معنا لمساعدتك في اختيار البرنامج أو الخدمة الأنسب وفق احتياجات طفلك.", "Contact us and we'll help you choose the program or service that best fits your child's needs.")}
    />
  );
}

export default async function ServicesPage() {
  const locale = await getLocale();
  const en = locale === "en";
  const [cards, sections, regions] = await Promise.all([
    loadServiceCards(locale),
    fetchSections("programs"),
    getBranchRegions(locale),
  ]);
  const h = (sections?.hero ?? []).find((r) => r.key === "heading");
  const hbadge = (sections?.hero ?? []).find((r) => r.key === "badge");
  // عناوين التبويبات (البرامج/العيادية/التقنيات) من الـCMS (بلوك tabs) — العنوان + الوصف
  const tabHead = (key: string) => {
    const r = (sections?.tabs ?? []).find((x) => x.key === key);
    if (!r) return undefined;
    return { heading: en ? r.title_en || r.title_ar : r.title_ar, intro: en ? r.text_en || r.text_ar : r.text_ar };
  };
  const tabHeads = { programs: tabHead("programs"), clinical: tabHead("clinical"), techniques: tabHead("techniques") };
  // قسم التواصل السفلي (CTA) من الـCMS: البادج (tagline) + العنوان + الوصف
  const ctaRow = (sections?.cta ?? []).find((r) => r.key === "main") as Record<string, string> | undefined;
  const ctaTitle = ctaRow?.title_ar ? hl(en ? ctaRow.title_en || ctaRow.title_ar : ctaRow.title_ar) : undefined;
  const ctaSub = ctaRow ? (en ? ctaRow.text_en || ctaRow.text_ar : ctaRow.text_ar) || undefined : undefined;
  const ctaBadge = ctaRow ? (en ? ctaRow.tagline_en || ctaRow.tagline_ar : ctaRow.tagline_ar) || undefined : undefined;
  return (
    <>
      <Hero
        locale={locale}
        badge={hbadge ? (en ? hbadge.title_en || hbadge.title_ar : hbadge.title_ar) : undefined}
        heading={h ? (en ? h.title_en || h.title_ar : h.title_ar) : undefined}
        subtitle={h ? (en ? h.text_en || h.text_ar : h.text_ar) : undefined}
        cards={cards}
        regions={regions}
      />
      <Suspense fallback={null}>
        <ServicesTabs locale={locale} cards={cards} heads={tabHeads} />
      </Suspense>
      <CTA locale={locale} title={ctaTitle} subtitle={ctaSub} badge={ctaBadge} />
    </>
  );
}
