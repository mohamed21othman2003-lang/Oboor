import Image from "next/image";
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
function CalIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>;
}

export default async function NewsPage() {
  const locale = await getLocale();
  const categories = locale === "en" ? NEWS_CATEGORIES_EN : NEWS_CATEGORIES;
  const workshopFeatured = locale === "en" ? WORKSHOP_FEATURED_EN : WORKSHOP_FEATURED;
  const workshops = locale === "en" ? WORKSHOPS_EN : WORKSHOPS;
  const centerNews = locale === "en" ? CENTER_NEWS_EN : CENTER_NEWS;
  const events = locale === "en" ? EVENTS_EN : EVENTS;
  const articleFeatured = locale === "en" ? ARTICLE_FEATURED_EN : ARTICLE_FEATURED;
  const articles = locale === "en" ? ARTICLES_EN : ARTICLES;

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <nav className="mb-6 flex items-center justify-start gap-2 text-sm text-ink-soft">
          <span className="text-brand">{pick(locale, "اخبارنا", "News")}</span>
          <Chev />
          <Link href="/" className="hover:text-brand">{pick(locale, "الرئيسية", "Home")}</Link>
        </nav>

        {/* Category tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 border-b border-line pb-px">
          {categories.map((c, i) => (
            <button key={c.label} className={`-mb-px flex items-center gap-2 border-b-2 px-3 pb-3 text-sm font-bold transition-colors sm:text-base ${i === 0 ? "border-brand text-brand" : "border-transparent text-ink-muted hover:text-brand"}`}>
              {c.count !== undefined && <span className={`flex h-5 min-w-[20px] items-center justify-center rounded-full px-1 text-xs ${i === 0 ? "bg-brand text-white" : "bg-surface text-ink-soft"}`}>{c.count}</span>}
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Workshops */}
      <Section>
        <SectionHead tag={pick(locale, "تعلّم واحتمل", "Learn & Grow")} title={pick(locale, "أحدث الورش التدريبية", "Latest Training Workshops")} linkText={pick(locale, "عرض جميع الورش", "View All Workshops")} />
        <div className="space-y-6">
          <WideCard item={workshopFeatured} cta={pick(locale, "عرض التفاصيل", "View Details")} locale={locale} />
          <div className="grid gap-6 md:grid-cols-3">
            {workshops.map((w) => <NewsCard key={w.slug} item={w} locale={locale} />)}
          </div>
        </div>
      </Section>

      <Divider />

      {/* Center news */}
      <Section>
        <SectionHead tag={pick(locale, "من داخل عبور", "Inside Oboor")} title={pick(locale, "أخبار المراكز", "Center News")} linkText={pick(locale, "جميع الأخبار", "All News")} />
        <div className="grid gap-6 md:grid-cols-3">
          {centerNews.map((n) => <NewsCard key={n.slug} item={n} locale={locale} />)}
        </div>
      </Section>

      <Divider />

      {/* Events */}
      <Section>
        <SectionHead tag={pick(locale, "شارك معنا", "Join Us")} title={pick(locale, "الفعاليات", "Events")} linkText={pick(locale, "جميع الفعاليات", "All Events")} />
        <div className="grid gap-6 lg:grid-cols-2">
          {events.map((e) => <WideCard key={e.slug} item={e} cta={pick(locale, "عرض التفاصيل", "View Details")} locale={locale} />)}
        </div>
      </Section>

      <Divider />

      {/* Articles */}
      <Section>
        <SectionHead tag={pick(locale, "ثقّف وابنِ الثقة", "Inform & Build Confidence")} title={pick(locale, "المحتوى التوعوي للأسر", "Awareness Content for Families")} linkText={pick(locale, "جميع المقالات", "All Articles")} desc={pick(locale, "مقالات وأدلة متخصصة أُعدّت بعناية لمساعدة أسر المستفيدين على فهم الحالة ودعم أبنائهم.", "Specialized articles and guides carefully prepared to help families understand their child's condition and support them.")} />
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Featured (right) */}
          <FeaturedArticle item={articleFeatured} locale={locale} />
          {/* Articles list (left) */}
          <div className="space-y-4">
            {articles.map((a) => <ArticleRow key={a.slug} item={a} locale={locale} />)}
          </div>
        </div>
      </Section>
    </section>
  );
}

function Section({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">{children}</div>
  );
}
function Divider() {
  return <div className="mx-auto max-w-3xl border-t border-line-soft" />;
}

function SectionHead({ tag, title, linkText, desc }: { tag: string; title: string; linkText: string; desc?: string }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="text-start">
        <span className="inline-flex items-center gap-2 text-sm font-bold text-brand">
          {tag}
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand/10"><SparkIcon /></span>
        </span>
        <h2 className="mt-2 text-2xl font-extrabold text-ink sm:text-3xl">{title}</h2>
        {desc && <p className="mt-2 max-w-xl text-sm text-ink-muted">{desc}</p>}
      </div>
      <Link href="#" className="flex items-center gap-1 text-sm font-semibold text-brand hover:text-brand-dark">{linkText}<Chev /></Link>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold text-brand shadow-sm backdrop-blur">{children}</span>;
}

function NewsCard({ item, locale }: { item: NewsItem; locale: Locale }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative h-48 w-full">
        <Image src={item.image} alt={item.title} fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
        <span className="absolute right-3 top-3"><Badge>{item.category}</Badge></span>
      </div>
      <div className="flex flex-1 flex-col p-5 text-start">
        <p className="flex items-center justify-start gap-1.5 text-xs text-ink-soft"><CalIcon />{item.date}</p>
        <h3 className="mt-2 text-base font-bold leading-7 text-ink">{item.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-7 text-ink-muted">{item.desc}</p>
        <Link href={`/news/${item.slug}`} className="mt-4 flex items-center justify-start gap-1 text-sm font-semibold text-brand hover:text-brand-dark">{pick(locale, "اقرأ المزيد", "Read More")}<Chev /></Link>
      </div>
    </article>
  );
}

function WideCard({ item, cta }: { item: NewsItem; cta: string; locale: Locale }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition-shadow hover:shadow-md sm:flex-row">
      <div className="relative h-52 w-full shrink-0 sm:h-auto sm:w-72">
        <Image src={item.image} alt={item.title} fill className="object-cover" sizes="(max-width:640px) 100vw, 288px" />
      </div>
      <div className="flex flex-1 flex-col p-6 text-start">
        <div className="flex items-center justify-start gap-2">
          <span className="rounded-full border border-brand/40 px-3 py-1 text-[11px] font-bold text-brand">{item.category}</span>
          <span className="flex items-center gap-1.5 text-xs text-ink-soft"><CalIcon />{item.date}</span>
        </div>
        <h3 className="mt-2 text-lg font-bold leading-8 text-ink">{item.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-7 text-ink-muted">{item.desc}</p>
        <Link href={`/news/${item.slug}`} className="mt-4 flex items-center justify-start gap-1 text-sm font-semibold text-brand hover:text-brand-dark">{cta}<Chev /></Link>
      </div>
    </article>
  );
}

function ArticleRow({ item, locale }: { item: NewsItem; locale: Locale }) {
  return (
    <article className="flex gap-4 overflow-hidden rounded-2xl border border-line bg-white p-3 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-1 flex-col p-2 text-start">
        <p className="flex items-center justify-start gap-1.5 text-[11px] text-ink-soft"><CalIcon />{item.date}</p>
        <h3 className="mt-1.5 text-sm font-bold leading-6 text-ink">{item.title}</h3>
        <p className="mt-1.5 flex-1 text-xs leading-6 text-ink-muted">{item.desc}</p>
        <Link href={`/news/${item.slug}`} className="mt-2 flex items-center justify-start gap-1 text-xs font-semibold text-brand hover:text-brand-dark">{pick(locale, "قراءة المقال", "Read Article")}<Chev /></Link>
      </div>
      <div className="relative h-auto w-28 shrink-0 overflow-hidden rounded-xl">
        <Image src={item.image} alt={item.title} fill className="object-cover" sizes="112px" />
      </div>
    </article>
  );
}

function FeaturedArticle({ item, locale }: { item: NewsItem; locale: Locale }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
      <div className="relative h-64 w-full">
        <Image src={item.image} alt={item.title} fill className="object-cover" sizes="(max-width:1024px) 100vw, 50vw" />
        <span className="absolute right-3 top-3"><Badge>{item.category}</Badge></span>
        <span className="absolute left-3 top-3 rounded-full bg-brand px-3 py-1 text-[11px] font-bold text-white shadow">{pick(locale, "مميّز", "Featured")}</span>
      </div>
      <div className="flex flex-1 flex-col p-6 text-start">
        <p className="flex items-center justify-start gap-1.5 text-xs text-ink-soft"><CalIcon />{item.date}</p>
        <h3 className="mt-2 text-xl font-extrabold leading-8 text-ink">{item.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-7 text-ink-muted">{item.desc}</p>
        <Link href={`/news/${item.slug}`} className="mt-4 inline-flex w-fit items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark">{pick(locale, "قراءة المقال", "Read Article")}<Chev /></Link>
      </div>
    </article>
  );
}

function SparkIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand"><path d="M12 3l1.9 5.6L19.5 10l-5.6 1.4L12 17l-1.9-5.6L4.5 10l5.6-1.4z" /></svg>;
}
