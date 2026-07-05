"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { pick, type Locale } from "@/i18n/config";
import type { NewsItem } from "@/lib/newsData";

type Cat = { label: string; count?: number };

function Chev() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="dir-flip"><path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" /></svg>;
}
function CalIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>;
}
function SparkIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand"><path d="M12 3l1.9 5.6L19.5 10l-5.6 1.4L12 17l-1.9-5.6L4.5 10l5.6-1.4z" /></svg>;
}

function Section({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">{children}</div>;
}
function Divider() {
  return <div className="mx-auto max-w-3xl border-t border-line-soft" />;
}

function SectionHead({ tag, title, linkText, desc, onViewAll, showLink = true }: { tag: string; title: string; linkText: string; desc?: string; onViewAll: () => void; showLink?: boolean }) {
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
      {showLink && <button onClick={onViewAll} className="flex items-center gap-1 text-sm font-semibold text-brand hover:text-brand-dark">{linkText}<Chev /></button>}
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
        {item.category && <span className="absolute right-3 top-3"><Badge>{item.category}</Badge></span>}
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

function WideCard({ item, cta, locale }: { item: NewsItem; cta: string; locale: Locale }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition-shadow hover:shadow-md sm:flex-row">
      <div className="relative h-52 w-full shrink-0 sm:h-auto sm:w-72">
        <Image src={item.image} alt={item.title} fill className="object-cover" sizes="(max-width:640px) 100vw, 288px" />
      </div>
      <div className="flex flex-1 flex-col p-6 text-start">
        <div className="flex items-center justify-start gap-2">
          {item.category && <span className="rounded-full border border-brand/40 px-3 py-1 text-[11px] font-bold text-brand">{item.category}</span>}
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
        {item.category && <span className="absolute right-3 top-3"><Badge>{item.category}</Badge></span>}
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

export default function NewsBrowser({ locale, categories, workshopFeatured, workshops, centerNews, events, articleFeatured, articles }: {
  locale: Locale;
  categories: Cat[];
  workshopFeatured: NewsItem | null;
  workshops: NewsItem[];
  centerNews: NewsItem[];
  events: NewsItem[];
  articleFeatured: NewsItem | null;
  articles: NewsItem[];
}) {
  // التبويب النشط مصدره الـURL (?tab=) حتى يثبت بعد الريفريش ويعمل مع زرّي رجوع/تقدّم
  // 0=all, 1=center, 2=events, 3=workshops, 4=articles
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const raw = Number(sp.get("tab"));
  const tab = Number.isInteger(raw) && raw > 0 && raw < categories.length ? raw : 0;
  const selectTab = (k: number) => {
    const params = new URLSearchParams(sp.toString());
    if (k === 0) params.delete("tab"); else params.set("tab", String(k));
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };
  const show = (k: number) => tab === 0 || tab === k;
  // "عرض الكل" → ينقل لتبويب القسم ويرجّع لأعلى التبويبات (تغذية بصرية)
  const goToTab = (k: number) => {
    selectTab(k);
    document.getElementById("news-tabs")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const sections: React.ReactNode[] = [];
  if (show(3)) sections.push(
    <Section key="workshops">
      <SectionHead tag={pick(locale, "تعلّم واحتمل", "Learn & Grow")} title={pick(locale, "أحدث الورش التدريبية", "Latest Training Workshops")} linkText={pick(locale, "عرض جميع الورش", "View All Workshops")} onViewAll={() => goToTab(3)} showLink={tab === 0} />
      <div className="space-y-6">
        {workshopFeatured && <WideCard item={workshopFeatured} cta={pick(locale, "عرض التفاصيل", "View Details")} locale={locale} />}
        <div className="grid gap-6 md:grid-cols-3">
          {workshops.map((w) => <NewsCard key={w.slug} item={w} locale={locale} />)}
        </div>
      </div>
    </Section>
  );
  if (show(1)) sections.push(
    <Section key="center">
      <SectionHead tag={pick(locale, "من داخل عبور", "Inside Oboor")} title={pick(locale, "أخبار المراكز", "Center News")} linkText={pick(locale, "جميع الأخبار", "All News")} onViewAll={() => goToTab(1)} showLink={tab === 0} />
      <div className="grid gap-6 md:grid-cols-3">
        {centerNews.map((n) => <NewsCard key={n.slug} item={n} locale={locale} />)}
      </div>
    </Section>
  );
  if (show(2)) sections.push(
    <Section key="events">
      <SectionHead tag={pick(locale, "شارك معنا", "Join Us")} title={pick(locale, "الفعاليات", "Events")} linkText={pick(locale, "جميع الفعاليات", "All Events")} onViewAll={() => goToTab(2)} showLink={tab === 0} />
      <div className="grid gap-6 lg:grid-cols-2">
        {events.map((e) => <WideCard key={e.slug} item={e} cta={pick(locale, "عرض التفاصيل", "View Details")} locale={locale} />)}
      </div>
    </Section>
  );
  if (show(4)) sections.push(
    <Section key="articles">
      <SectionHead tag={pick(locale, "ثقّف وابنِ الثقة", "Inform & Build Confidence")} title={pick(locale, "المحتوى التوعوي للأسر", "Awareness Content for Families")} linkText={pick(locale, "جميع المقالات", "All Articles")} onViewAll={() => goToTab(4)} showLink={tab === 0} desc={pick(locale, "مقالات وأدلة متخصصة أُعدّت بعناية لمساعدة أسر المستفيدين على فهم الحالة ودعم أبنائهم.", "Specialized articles and guides carefully prepared to help families understand their child's condition and support them.")} />
      <div className="grid gap-6 lg:grid-cols-2">
        {articleFeatured && <FeaturedArticle item={articleFeatured} locale={locale} />}
        <div className="space-y-4">
          {articles.map((a) => <ArticleRow key={a.slug} item={a} locale={locale} />)}
        </div>
      </div>
    </Section>
  );

  return (
    <>
      {/* Category tabs */}
      <div id="news-tabs" className="mx-auto max-w-7xl px-6 lg:px-8 scroll-mt-24">
        <div className="flex flex-wrap items-center justify-center gap-3 border-b border-line pb-px">
          {categories.map((c, i) => (
            <button key={c.label} onClick={() => selectTab(i)} className={`-mb-px flex items-center gap-2 border-b-2 px-3 pb-3 text-sm font-bold transition-colors sm:text-base ${i === tab ? "border-brand text-brand" : "border-transparent text-ink-muted hover:text-brand"}`}>
              {i === 0 && (
                <span className={`flex h-5 w-5 items-center justify-center rounded-full ${i === tab ? "bg-brand text-white" : "bg-surface text-ink-soft"}`}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>
                </span>
              )}
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {sections.map((s, i) => (
        <Fragment key={i}>
          {i > 0 && <Divider />}
          {s}
        </Fragment>
      ))}
    </>
  );
}
