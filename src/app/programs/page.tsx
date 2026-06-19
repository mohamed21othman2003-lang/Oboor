import Link from "next/link";
import type { Metadata } from "next";
import { getLocale } from "@/i18n/locale";
import { pick, type Locale } from "@/i18n/config";
import ServiceSearchBar from "@/components/ServiceSearchBar";
import ServicesTabs from "@/components/ServicesTabs";

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
          <span className="text-brand">{pick(locale, "خدماتنا", "Services")}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="dir-flip"><path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" /></svg>
          <Link href="/" className="hover:text-brand">{pick(locale, "الرئيسية", "Home")}</Link>
        </nav>

        <div className="mb-8 text-center">
          <span className="rounded-full bg-white px-4 py-1.5 text-sm font-medium text-brand-dark shadow-sm ring-1 ring-line">
            {pick(locale, "خدماتنا في المملكة", "Our Services in Saudi Arabia")}
          </span>
          <h1 className="mt-5 text-3xl font-extrabold text-ink sm:text-4xl">
            {pick(locale, "خدمات ", "Oboor Centers ")}<span className="text-brand">{pick(locale, "مراكز عبور", "Services")}</span>
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
          <a href="https://wa.me/966561000274" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90">
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
  return (
    <>
      <Hero locale={locale} />
      <ServicesTabs locale={locale} />
      <CTA locale={locale} />
    </>
  );
}
