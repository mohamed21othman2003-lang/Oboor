import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { notFound } from "next/navigation";
import { TECHNIQUES, getTechnique, type Technique } from "@/lib/techniquesData";
import { distinctIcons, iconByKey } from "@/lib/areaIcon";
import CtaSection from "@/components/CtaSection";
import { fetchContent } from "@/lib/server/django";
import { getLocale } from "@/i18n/locale";
import { pick, type Locale } from "@/i18n/config";

// الشكل اللي بيرجع من Django (content/techniques)
type HelpSection = {
  title: string; benefitsHeading: string; benefits: string[];
  valueHeading: string; values: string[];
};

type ApiTechnique = {
  slug: string;
  title_ar: string; title_en: string;
  badge_ar: string; badge_en: string;
  about_ar: string[]; about_en: string[];
  targets_ar: string[]; targets_en: string[];
  offers_ar: string[]; offers_en: string[];
  offer_icons: string[];
  help_section_ar: Partial<HelpSection>; help_section_en: Partial<HelpSection>;
  image: string; order: number;
};

// bilingual pick: استخدم الإنجليزي لو موجود وغير فارغ، وإلا ارجع للعربي
function bi<T>(en: boolean, enVal: T[] | undefined, arVal: T[] | undefined): T[] {
  return en ? (enVal?.length ? enVal : arVal ?? []) : arVal ?? [];
}

function isEmptyHelp(h: Partial<HelpSection> | undefined): boolean {
  return !h || Object.keys(h).length === 0;
}

function toTechnique(row: ApiTechnique, locale: Locale): Technique {
  const en = locale === "en";
  const rawHelp = en ? row.help_section_en : row.help_section_ar;
  const helpSection = isEmptyHelp(rawHelp) ? undefined : (rawHelp as HelpSection);
  return {
    slug: row.slug,
    title: en ? row.title_en || row.title_ar : row.title_ar,
    badge: en ? row.badge_en || row.badge_ar : row.badge_ar,
    image: row.image,
    about: bi(en, row.about_en, row.about_ar),
    targets: bi(en, row.targets_en, row.targets_ar),
    offers: bi(en, row.offers_en, row.offers_ar),
    offerIcons: row.offer_icons?.length ? row.offer_icons : undefined,
    helpSection,
  };
}

// جلب التقنية من Django مع fallback للبيانات الثابتة
async function loadTechnique(slug: string, locale: Locale): Promise<Technique | undefined> {
  const rows = await fetchContent<ApiTechnique[]>("techniques");
  if (rows && rows.length) {
    const row = rows.find((r) => r.slug === slug);
    if (row) return toTechnique(row, locale);
  }
  return getTechnique(slug, locale);
}

export function generateStaticParams() {
  return TECHNIQUES.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const t = await loadTechnique(slug, locale);
  const suffix = pick(locale, "مركز عبور", "Oboor Center");
  const fallback = pick(locale, "تقنية تأهيلية", "Rehabilitation Technology");
  return pageMeta(t ? `${t.title} | ${suffix}` : `${fallback} | ${suffix}`);
}

function Chev() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="dir-flip"><path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" /></svg>;
}

export default async function TechniqueDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await getLocale();
  const t = await loadTechnique(slug, locale);
  if (!t) notFound();
  const available = locale === "en"
    ? !t.badge.toLowerCase().includes("not")
    : t.badge.includes("متوفر") && !t.badge.includes("غير");
  const offerIcons = t.offerIcons ? t.offerIcons.map(iconByKey) : distinctIcons(t.offers);
  const helpParts = t.helpSection ? t.helpSection.title.split(t.title) : null;

  return (
    <>
      {/* Hero + About */}
      <section className="bg-gradient-to-b from-[#ebf7f9] to-white">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <nav className="mb-8 flex items-center justify-start gap-2 text-sm text-ink-soft">
            <span className="text-brand">{t.title}</span>
            <Chev />
            <Link href="/programs#techniques" className="hover:text-brand">{pick(locale, "التقنيات التأهيلية", "Rehabilitation Technologies")}</Link>
            <Chev />
            <Link href="/programs" className="hover:text-brand">{pick(locale, "برامجنا التمكينية", "Services")}</Link>
            <Chev />
            <Link href="/" className="hover:text-brand">{pick(locale, "الرئيسية", "Home")}</Link>
          </nav>

          <div className="grid items-center gap-8 lg:grid-cols-2">
            {/* Image */}
            <div className="relative order-1 h-[420px]">
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-2xl bg-brand/10" />
              <div className="absolute -bottom-4 left-8 h-20 w-20 rounded-full bg-brand/10" />
              <div className="relative h-full w-full overflow-hidden rounded-3xl shadow-lg">
                <Image src={t.image} alt={t.title} fill className="object-cover" />
              </div>
            </div>
            {/* Content */}
            <div className="order-2 text-start">
              <span className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium ${available ? "bg-brand/10 text-brand-dark" : "bg-surface text-ink-soft"}`}>
                <span className={`h-2 w-2 rounded-full ${available ? "bg-success" : "bg-ink-soft"}`} />
                {t.badge}
              </span>
              <h1 className="mt-4 text-4xl font-extrabold text-brand">{t.title}</h1>
              <div className="mt-5 space-y-4">
                {t.about.map((p, i) => <p key={i} className="text-sm leading-8 text-ink-muted">{p}</p>)}
              </div>
              <div className="mt-6">
                <h2 className="mb-3 text-base font-bold text-ink">{pick(locale, "الفئات المستهدفة", "Target Groups")}</h2>
                <div className="flex flex-wrap gap-2">
                  {t.targets.map((tg) => (
                    <span key={tg} className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/5 px-4 py-2 text-xs font-medium text-brand-dark">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                      {tg}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Offers */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="mb-10 text-center text-3xl font-extrabold text-ink">{pick(locale, "ماذا يقدم ", "What ")}<span className="text-brand">{t.title}</span>{pick(locale, "", " offers")}</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {t.offers.map((o, i) => (
              <div key={o} className="flex flex-col items-center gap-4 rounded-2xl bg-gradient-to-bl from-brand to-brand-deep p-7 text-center shadow-lg">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white">{offerIcons[i]}</span>
                <p className="text-base font-bold text-white">{o}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it helps (technique-specific) */}
      {t.helpSection && (
        <section className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <h2 className="mb-10 text-center text-3xl font-extrabold text-ink">
              {helpParts ? <>{helpParts[0]}<span className="text-brand">{t.title}</span>{helpParts[1]}</> : t.helpSection.title}
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-line bg-white p-7 text-start shadow-sm">
                <h3 className="mb-4 border-b border-line pb-3 text-lg font-bold text-ink">{t.helpSection.benefitsHeading}</h3>
                <ul className="space-y-3">
                  {t.helpSection.benefits.map((it) => (
                    <li key={it} className="flex items-start gap-2 text-sm leading-7 text-ink-muted">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-1 shrink-0 text-brand"><circle cx="12" cy="12" r="9" /><path d="M8.5 12l2.2 2.2L15.5 9.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-line bg-white p-7 text-start shadow-sm">
                <h3 className="mb-4 border-b border-line pb-3 text-lg font-bold text-ink">{t.helpSection.valueHeading}</h3>
                <ul className="space-y-3">
                  {t.helpSection.values.map((it) => (
                    <li key={it} className="flex items-center gap-2 text-sm text-ink-muted">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-brand"><circle cx="12" cy="12" r="9" /><path d="M8.5 12l2.2 2.2L15.5 9.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <CtaSection
        locale={locale}
        title={<>{pick(locale, "هل ترغب في تسجيل طفلك في ", "Would you like to enroll your child in ")}<span className="text-brand">{pick(locale, "هذه التقنية", "this technology")}</span>{pick(locale, " ؟", "?")}</>}
        subtitle={pick(locale, "يمكنك التواصل معنا لمساعدتك في اختيار البرنامج أو الخدمة أو التقنية الأنسب وفق احتياجات طفلك.", "You can reach out to us for help choosing the program, service, or technology best suited to your child's needs.")}
      />
    </>
  );
}
