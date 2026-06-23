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
import SuccessStoryCard from "@/components/SuccessStoryCard";

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

const CTA_FEATURES: [string, string][] = [
  ["تقييم شامل ومتخصص", "Comprehensive specialized assessment"],
  ["خطة علاجية مخصصة", "Personalized treatment plan"],
  ["متابعة دورية مستمرة", "Continuous regular follow-up"],
  ["دعم الأسرة الكامل", "Full family support"],
];

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
              {pick(locale, "قصص حقيقية من عائلاتنا", "Real stories from our families")}
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight text-ink sm:text-5xl">
              {pick(
                locale,
                <>أبناؤنا يُلهمونا <span className="text-brand">كل يوم</span></>,
                <>Our children inspire us <span className="text-brand">every day</span></>,
              )}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-ink-muted">
              {pick(
                locale,
                "كل قصة نجاح تُعبّر عن رحلة حقيقية من التحدي إلى الإنجاز. نفتخر بكل مستفيد شقّ طريقه بمساعدتنا.",
                "Every success story reflects a real journey from challenge to achievement. We are proud of every child who found their way with our help.",
              )}
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-4xl border-t border-line pt-8">
            <div dir="ltr" className="grid grid-cols-3 gap-6">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-3xl font-extrabold text-brand sm:text-4xl">{s.value}</p>
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

          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {stories.map((story) => (
              <SuccessStoryCard key={story.slug} story={story} locale={locale} highlights={highlights} />
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <button className="rounded-xl border border-brand px-8 py-3 text-sm font-semibold text-brand-dark transition-colors hover:bg-brand hover:text-white">
              {pick(locale, "عرض المزيد", "Load More")}
            </button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-gradient-to-bl from-brand-deep to-[#0a2329]">
        <div className="relative mx-auto max-w-7xl px-6 py-16 text-center lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90">
            <StarIcon />
            {pick(locale, "الخطوة الأولى نحو التغير", "The first step toward change")}
          </span>
          <h2 className="mt-5 text-3xl font-extrabold text-white sm:text-4xl">{pick(locale, "ابدأ تقييم طفلك الآن", "Start your child's assessment now")}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-8 text-white/75">
            {pick(
              locale,
              "التقييم المبكر هو بداية كل قصة نجاح. فريقنا من الأخصائيين المعتمدين جاهز لتقديم تقييم شامل ودقيق لوضع طفلك ورسم خطة تأهيلية مخصصة له.",
              "Early assessment is the beginning of every success story. Our team of certified specialists is ready to provide a comprehensive, accurate assessment of your child and design a personalized rehabilitation plan.",
            )}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
            {CTA_FEATURES.map(([ar, en]) => (
              <span key={en} className="flex items-center gap-2 text-sm text-white/85">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                {pick(locale, ar, en)}
              </span>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/assessment" className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-surface">
              <ClipboardIcon />
              {pick(locale, "قيم طفلك الان", "Assess Your Child")}
            </Link>
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

/* Icons */
function SparkleIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.9 5.6L19.5 10l-5.6 1.4L12 17l-1.9-5.6L4.5 10l5.6-1.4z" /><path d="M19 3v4M21 5h-4M5 17v3M6.5 18.5h-3" /></svg>;
}
function StarIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="text-brand"><polygon points="12 2 15 8.9 22.5 9.3 16.7 14 18.6 21.2 12 17.2 5.4 21.2 7.3 14 1.5 9.3 9 8.9" /></svg>;
}
function ClipboardIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="8" y="3" width="8" height="4" rx="1" /><path d="M9 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3" /><path d="M9 13l2 2 4-4" /></svg>;
}
function WhatsappIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.5A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-2.8.9.9-2.7-.2-.3A8 8 0 1 1 12 20zm4.4-6c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1a6.5 6.5 0 0 1-3.2-2.8c-.2-.4.2-.4.6-1.2.1-.2 0-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a1 1 0 0 0-.7.3c-.2.3-.9.9-.9 2.2s.9 2.5 1 2.7c.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.7.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1z" /></svg>;
}
