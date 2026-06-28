import Link from "next/link";
import type { Metadata } from "next";
import { getLocale } from "@/i18n/locale";
import { pick, type Locale } from "@/i18n/config";
import {
  NEWS_CATEGORIES, NEWS_CATEGORIES_EN,
  WORKSHOP_FEATURED, WORKSHOP_FEATURED_EN,
  WORKSHOPS, WORKSHOPS_EN,
  CENTER_NEWS, CENTER_NEWS_EN,
  EVENTS, EVENTS_EN,
  ARTICLE_FEATURED, ARTICLE_FEATURED_EN,
  ARTICLES, ARTICLES_EN,
  type NewsItem,
} from "@/lib/newsData";
import { fetchContent, fetchSections } from "@/lib/server/django";
import NewsBrowser from "@/components/news/NewsBrowser";

// الشكل اللي بيرجع من Django (content/news)
type ApiNews = {
  slug: string; section: string; featured: boolean;
  title_ar: string; title_en: string;
  desc_ar: string; desc_en: string;
  category_ar: string; category_en: string;
  date_ar: string; date_en: string;
  image: string; order: number;
};

type NewsGroups = {
  workshopFeatured: NewsItem | null; workshops: NewsItem[];
  centerNews: NewsItem[]; events: NewsItem[];
  articleFeatured: NewsItem | null; articles: NewsItem[];
};

function toItem(a: ApiNews, locale: Locale): NewsItem {
  const en = locale === "en";
  return {
    slug: a.slug,
    title: en ? a.title_en : a.title_ar,
    desc: en ? a.desc_en : a.desc_ar,
    date: en ? a.date_en : a.date_ar,
    category: en ? a.category_en : a.category_ar,
    image: a.image,
  };
}

// نحوّل قائمة Django المسطّحة إلى المجموعات اللي بيتوقعها NewsBrowser
function groupNews(rows: ApiNews[], locale: Locale): NewsGroups {
  const g: NewsGroups = {
    workshopFeatured: null, workshops: [], centerNews: [],
    events: [], articleFeatured: null, articles: [],
  };
  for (const a of rows) {
    const item = toItem(a, locale);
    if (a.section === "workshops") {
      // أول عنصر مميّز فقط يظهر كبطاقة كبيرة؛ أي عنصر مميّز إضافي يدخل الشبكة العادية (حتى لا يختفي)
      if (a.featured && !g.workshopFeatured) g.workshopFeatured = item; else g.workshops.push(item);
    } else if (a.section === "center") g.centerNews.push(item);
    else if (a.section === "events") g.events.push(item);
    else if (a.section === "articles") {
      if (a.featured && !g.articleFeatured) g.articleFeatured = item; else g.articles.push(item);
    }
  }
  return g;
}

// fallback للبيانات الثابتة لو Django مش متاح
function staticGroups(locale: Locale): NewsGroups {
  const en = locale === "en";
  return {
    workshopFeatured: en ? WORKSHOP_FEATURED_EN : WORKSHOP_FEATURED,
    workshops: en ? WORKSHOPS_EN : WORKSHOPS,
    centerNews: en ? CENTER_NEWS_EN : CENTER_NEWS,
    events: en ? EVENTS_EN : EVENTS,
    articleFeatured: en ? ARTICLE_FEATURED_EN : ARTICLE_FEATURED,
    articles: en ? ARTICLES_EN : ARTICLES,
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: pick(locale, "إعلامنا | مركز عبور للرعاية والتأهيل", "News | Oboor Center for Care & Rehabilitation"),
    description: pick(locale, "أحدث أخبار وفعاليات وورش ومقالات مراكز عبور.", "Latest news, events, workshops, and articles from Oboor Centers."),
  };
}

function Chev() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="dir-flip"><path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" /></svg>;
}

export default async function NewsPage() {
  const locale = await getLocale();
  const en = locale === "en";
  const rows = await fetchContent<ApiNews[]>("news");
  const groups = rows && rows.length ? groupNews(rows, locale) : staticGroups(locale);

  const sections = await fetchSections("news");
  const categories = sections?.categories
    ? sections.categories.map((row) => ({
        label: en ? row.title_en || row.title_ar : row.title_ar,
        ...(row.value ? { count: Number(row.value) } : {}),
      }))
    : en
      ? NEWS_CATEGORIES_EN
      : NEWS_CATEGORIES;
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 pt-10 lg:px-8">
        <nav className="mb-6 flex items-center justify-start gap-2 text-sm text-ink-soft">
          <span className="text-brand">{pick(locale, "إعلامنا", "News")}</span>
          <Chev />
          <Link href="/" className="hover:text-brand">{pick(locale, "الرئيسية", "Home")}</Link>
        </nav>
      </div>

      <NewsBrowser
        locale={locale}
        categories={categories}
        workshopFeatured={groups.workshopFeatured}
        workshops={groups.workshops}
        centerNews={groups.centerNews}
        events={groups.events}
        articleFeatured={groups.articleFeatured}
        articles={groups.articles}
      />
    </section>
  );
}
