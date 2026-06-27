import Link from "next/link";
import type { Metadata } from "next";
import {
  getSuccessStories,
  getSuccessStats,
  getStoryHighlightsData,
  type SuccessStory,
  type StoryHighlightsData,
} from "@/lib/successStoriesData";
import { getLocale } from "@/i18n/locale";
import { pick, type Locale } from "@/i18n/config";
import { fetchContent, fetchSections } from "@/lib/server/django";
import { hl } from "@/lib/highlight";
import CtaSection from "@/components/CtaSection";
import AnimatedNumber from "@/components/home/AnimatedNumber";
import SuccessStoriesGrid from "@/components/SuccessStoriesGrid";

// الشكل اللي بيرجع من Django (content/success)
type ApiSuccess = {
  slug: string;
  name_ar: string; name_en: string;
  age_ar: string; age_en: string;
  category_ar: string; category_en: string;
  duration_label_ar: string; duration_label_en: string;
  before_ar: string; before_en: string;
  after_ar: string; after_en: string;
  quote_ar: string; quote_en: string;
  meta_duration_ar: string; meta_duration_en: string;
  meta_age_ar: string; meta_age_en: string;
  author_ar: string; author_en: string;
  image: string; order: number;
};

function toStory(row: ApiSuccess, locale: Locale): SuccessStory {
  const en = locale === "en";
  const t = (ar: string, env: string) => (en ? env ?? ar : ar);
  return {
    slug: row.slug,
    name: t(row.name_ar, row.name_en),
    age: t(row.age_ar, row.age_en),
    image: row.image,
    category: t(row.category_ar, row.category_en),
    durationLabel: t(row.duration_label_ar, row.duration_label_en),
    before: t(row.before_ar, row.before_en),
    after: t(row.after_ar, row.after_en),
    quote: t(row.quote_ar, row.quote_en),
    metaDuration: t(row.meta_duration_ar, row.meta_duration_en),
    metaAge: t(row.meta_age_ar, row.meta_age_en),
    author: t(row.author_ar, row.author_en),
  };
}

// نجلب القصص من Django، ونرجع للبيانات الثابتة (fallback) لو فشل الطلب أو فاضي
async function loadStories(locale: Locale): Promise<SuccessStory[]> {
  const rows = await fetchContent<ApiSuccess[]>("success");
  if (rows && rows.length) return rows.map((r) => toStory(r, locale));
  return getSuccessStories(locale);
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: pick(
      locale,
      "قصص النجاح | مركز عبور للرعاية والتأهيل",
      "Success Stories | Oboor Center for Care & Rehabilitation",
    ),
    description: pick(
      locale,
      "قصص حقيقية من عائلاتنا — أبناؤنا يُلهمونا كل يوم.",
      "Real stories from our families — our children inspire us every day.",
    ),
  };
}

function Chev() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="dir-flip"><path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" /></svg>;
}

// شكل قاموس الـ highlights كما يُخزَّن في الـ CMS (journeyTemplate نص يحوي {name})
type CmsHighlights = Omit<StoryHighlightsData, "journeyTemplate"> & { journeyTemplate?: string };

export default async function SuccessStoriesPage() {
  const locale = await getLocale();
  const en = locale === "en";
  const stories = await loadStories(locale);
  const sections = await fetchSections("success");

  // STATS: من الـ CMS لو متاح، وإلا fallback للبيانات الثابتة
  const stats = sections?.stats
    ? sections.stats.map((row) => ({
        value: en ? ((row.data_en as { value?: string } | null)?.value ?? row.value) : row.value,
        label: en ? (row.title_en || row.title_ar) : row.title_ar,
      }))
    : getSuccessStats(locale);

  // HIGHLIGHTS: من الـ CMS لو متاح، مع تحويل journeyTemplate (نص) إلى دالة
  // ليبقى نداء h.journeyTemplate(name) في الواجهة بدون تغيير. وإلا fallback للثابت.
  // journeyTemplate يبقى نصّاً (قابل للتسلسل) لتمريره لمكوّن العميل بأمان.
  const highlightsRow = sections?.highlights?.[0];
  const cmsHighlights = highlightsRow
    ? ((en ? highlightsRow.data_en : highlightsRow.data_ar) as CmsHighlights | null)
    : null;
  const highlights: StoryHighlightsData = cmsHighlights
    ? { ...cmsHighlights, journeyTemplate: cmsHighlights.journeyTemplate || "" }
    : getStoryHighlightsData(locale);

  // HERO: المقدمة العلوية من الـ CMS (مع fallback للنص الثابت)
  const heroRows = sections?.hero ?? [];
  const sFind = (k: string) => heroRows.find((r) => r.key === k);
  const sT = (r?: (typeof heroRows)[number]) => (r ? (en ? r.title_en || r.title_ar : r.title_ar) : "");
  const sB = (r?: (typeof heroRows)[number]) => (r ? (en ? r.text_en || r.text_ar : r.text_ar) : "");
  const heroBadge = sT(sFind("badge")) || pick(locale, "قصص حقيقية من عائلاتنا", "Real stories from our families");
  const heroHeading = sT(sFind("heading"));
  const heroSub = sB(sFind("heading")) || pick(locale, "كل قصة نجاح تُعبّر عن رحلة حقيقية من التحدي إلى الإنجاز. نفتخر بكل مستفيد شقّ طريقه بمساعدتنا.", "Every success story reflects a real journey from challenge to achievement. We are proud of every child who found their way with our help.");

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-[#ebf7f9] to-white">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <nav className="mb-10 flex items-center justify-start gap-2 text-sm text-ink-soft">
            <span className="text-brand">{pick(locale, "أبطال عبور", "Oboor Champions")}</span>
            <Chev />
            <Link href="/" className="hover:text-brand">{pick(locale, "الرئيسية", "Home")}</Link>
          </nav>

          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-medium text-brand-dark shadow-sm ring-1 ring-line">
              <SparkleIcon />
              {heroBadge}
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight text-ink sm:text-5xl">
              {heroHeading
                ? hl(heroHeading)
                : pick(locale, <>أبناؤنا يُلهمونا <span className="text-brand">كل يوم</span></>, <>Our children inspire us <span className="text-brand">every day</span></>)}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-ink-muted">
              {heroSub}
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-4xl border-t border-line pt-8">
            <div dir="ltr" className="grid grid-cols-3 gap-6">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-3xl font-extrabold text-brand sm:text-4xl"><AnimatedNumber value={s.value} /></p>
                  <p className="mt-1 text-xs text-ink-muted sm:text-sm">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stories grid */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-10 flex items-center justify-between gap-4">
            <h2 className="shrink-0 text-2xl font-extrabold text-ink sm:text-3xl">{pick(locale, "قصص نجاح العملاء", "Client Success Stories")}</h2>
            <span className="h-px flex-1 bg-line" />
            <span className="shrink-0 rounded-full bg-surface px-4 py-1.5 text-xs font-semibold text-ink-soft">{pick(locale, "16 نتائج", "16 results")}</span>
          </div>

          <SuccessStoriesGrid stories={stories} highlights={highlights} locale={locale} />
        </div>
      </section>

      {/* CTA */}
      <CtaSection
        locale={locale}
        starBadge
        badge={pick(locale, "الخطوة الأولى نحو التغير", "The first step toward change")}
        title={pick(locale, "ابدأ تقييم طفلك الآن", "Start your child's assessment now")}
        subtitle={pick(locale, "التقييم المبكر هو بداية كل قصة نجاح. فريقنا من الأخصائيين المعتمدين جاهز لتقديم تقييم شامل ودقيق لوضع طفلك ورسم خطة تأهيلية مخصصة له.", "Early assessment is the beginning of every success story. Our team of certified specialists is ready to provide a comprehensive, accurate assessment of your child and design a personalized rehabilitation plan.")}
        features={[
          pick(locale, "تقييم شامل ومتخصص", "Comprehensive specialized assessment"),
          pick(locale, "خطة علاجية مخصصة", "Personalized treatment plan"),
          pick(locale, "متابعة دورية مستمرة", "Ongoing periodic follow-up"),
          pick(locale, "دعم الأسرة الكامل", "Full family support"),
        ]}
        primary={{ href: "/assessment", label: pick(locale, "قيّم طفلك الآن", "Assess your child now") }}
        showApply={false}
        showBranches={false}
      />
    </>
  );
}

/* Icons */
function SparkleIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.9 5.6L19.5 10l-5.6 1.4L12 17l-1.9-5.6L4.5 10l5.6-1.4z" /><path d="M19 3v4M21 5h-4M5 17v3M6.5 18.5h-3" /></svg>;
}
