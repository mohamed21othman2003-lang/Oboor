import Link from "next/link";
import type { Metadata } from "next";
import { getLocale } from "@/i18n/locale";
import { pick } from "@/i18n/config";
import {
  NEWS_CATEGORIES, NEWS_CATEGORIES_EN,
  WORKSHOP_FEATURED, WORKSHOP_FEATURED_EN,
  WORKSHOPS, WORKSHOPS_EN,
  CENTER_NEWS, CENTER_NEWS_EN,
  EVENTS, EVENTS_EN,
  ARTICLE_FEATURED, ARTICLE_FEATURED_EN,
  ARTICLES, ARTICLES_EN,
} from "@/lib/newsData";
import NewsBrowser from "@/components/news/NewsBrowser";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: pick(locale, "اخبارنا | مركز عبور للرعاية والتأهيل", "News | Oboor Center for Care & Rehabilitation"),
    description: pick(locale, "أحدث أخبار وفعاليات وورش ومقالات مراكز عبور.", "Latest news, events, workshops, and articles from Oboor Centers."),
  };
}

function Chev() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="dir-flip"><path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" /></svg>;
}

export default async function NewsPage() {
  const locale = await getLocale();
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 pt-10 lg:px-8">
        <nav className="mb-6 flex items-center justify-start gap-2 text-sm text-ink-soft">
          <span className="text-brand">{pick(locale, "اخبارنا", "News")}</span>
          <Chev />
          <Link href="/" className="hover:text-brand">{pick(locale, "الرئيسية", "Home")}</Link>
        </nav>
      </div>

      <NewsBrowser
        locale={locale}
        categories={locale === "en" ? NEWS_CATEGORIES_EN : NEWS_CATEGORIES}
        workshopFeatured={locale === "en" ? WORKSHOP_FEATURED_EN : WORKSHOP_FEATURED}
        workshops={locale === "en" ? WORKSHOPS_EN : WORKSHOPS}
        centerNews={locale === "en" ? CENTER_NEWS_EN : CENTER_NEWS}
        events={locale === "en" ? EVENTS_EN : EVENTS}
        articleFeatured={locale === "en" ? ARTICLE_FEATURED_EN : ARTICLE_FEATURED}
        articles={locale === "en" ? ARTICLES_EN : ARTICLES}
      />
    </section>
  );
}
