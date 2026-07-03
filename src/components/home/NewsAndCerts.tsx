"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { pick, type Locale } from "@/i18n/config";
import { type HomeChrome } from "@/lib/highlight";

const NEWS = [
  { img: "/figma/home/imgImageWithFallback14.jpg", badge: "تطوير", title: "إطلاق النسخة المحدثة من برنامج التدخل المبكر", desc: "تشمل فنيات علاجية جديدة للأطفال دون سن الثلاث." },
  { img: "/figma/home/imgImageWithFallback15.jpg", badge: "فعالية", title: "يوم التوعية بالإعاقة الذهنية", desc: "للتوعية بحقوق ذوي الإعاقة وأساليب الدعم الأسري المناسبة." },
  { img: "/figma/home/imgImageWithFallback16.jpg", badge: "تدريب", title: "إطلاق برنامج تدريب أسر المستفيدين", desc: "لمساعدة الأسر على أفضل أساليب دعم أبنائهم في البيئة المنزلية." },
  { img: "/figma/home/imgImageWithFallback17.jpg", badge: "شراكة", title: "تعاون مع الجهات الحكومية", desc: "لتقديم خدمات تأهيلية متكاملة بالتنسيق مع الجهات الحكومية." },
];

const NEWS_EN: typeof NEWS = [
  { img: "/figma/home/imgImageWithFallback14.jpg", badge: "Development", title: "Launch of the updated Early Intervention Program", desc: "Including new therapeutic techniques for children under three." },
  { img: "/figma/home/imgImageWithFallback15.jpg", badge: "Event", title: "Intellectual Disability Awareness Day", desc: "Raising awareness of the rights of people with disabilities and suitable family support methods." },
  { img: "/figma/home/imgImageWithFallback16.jpg", badge: "Training", title: "Launch of the beneficiary families training program", desc: "Helping families learn the best ways to support their children at home." },
  { img: "/figma/home/imgImageWithFallback17.jpg", badge: "Partnership", title: "Collaboration with government agencies", desc: "To provide integrated rehabilitation services in coordination with government agencies." },
];

function NewsCard({ n, locale }: { n: (typeof NEWS)[number]; locale: Locale }) {
  return (
    // الكارت كله قابل للضغط + ارتفاع كامل ليتساوى مع باقي الكروت
    <Link href="/news" className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white text-start shadow-sm transition-shadow hover:shadow-xl">
      <div className="relative h-36 shrink-0">
        <Image src={n.img} alt={n.title} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover transition-transform duration-300 group-hover:scale-105" />
        <span className="absolute right-3 top-3 rounded-full bg-brand px-3 py-1 text-[11px] font-semibold text-white">{n.badge}</span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h4 className="text-sm font-bold leading-7 text-ink">{n.title}</h4>
        <p className="mt-1 text-xs leading-6 text-ink-muted">{n.desc}</p>
        <span className="mt-auto inline-flex items-center gap-1 pt-3 text-xs font-semibold text-brand transition-colors group-hover:text-brand-dark">
          {pick(locale, "اقرأ المزيد", "Read More")}
          <svg className="dir-flip" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 6l-6 6 6 6" /></svg>
        </span>
      </div>
    </Link>
  );
}

type Cert = { name: string; label: string };

export default function NewsAndCerts({ locale, news: newsProp, certs: certsProp, chrome }: { locale: Locale; news?: (typeof NEWS)[number][]; certs?: Cert[]; chrome?: HomeChrome }) {
  const news = newsProp?.length ? newsProp : (locale === "en" ? NEWS_EN : NEWS);
  const certs: Cert[] = certsProp?.length ? certsProp : [0, 1, 2, 3].map(() => ({ name: "ISO 9001", label: pick(locale, "إدارة الجودة", "Quality Mgmt.") }));
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  // عدد صفحات التمرير الفعلية (وليس عدد الكروت) — لتفادي نقاط زائدة تصل لنفس نهاية التمرير
  const [pages, setPages] = useState(1);
  // حواف التلاشي: نُظهر التلاشي فقط على الجهة التي خلفها محتوى مخفي،
  // ونزيله عند النهاية حتى يظهر آخر كارت كاملاً (لا مقصوصاً تحت القناع).
  const [edge, setEdge] = useState({ start: true, end: false });
  const stepOf = (el: HTMLDivElement) => {
    const card = el.children[0] as HTMLElement | undefined;
    return card ? card.offsetWidth + 20 : 1; // gap-5
  };
  // عدد الكروت المرئية في المرة = عرض المسار ÷ خطوة الكارت؛ الصفحات = الكروت − المرئي + 1
  const pageCountOf = (el: HTMLDivElement) => {
    const visible = Math.max(1, Math.round(el.clientWidth / stepOf(el)));
    return Math.max(1, el.children.length - visible + 1);
  };
  const recomputeEdges = () => {
    const el = trackRef.current;
    if (!el) return;
    const pos = Math.abs(el.scrollLeft);
    const max = el.scrollWidth - el.clientWidth;
    setEdge({ start: pos <= 2, end: pos >= max - 2 });
    setPages(pageCountOf(el));
  };
  useEffect(() => {
    recomputeEdges();
    window.addEventListener("resize", recomputeEdges);
    return () => window.removeEventListener("resize", recomputeEdges);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [news.length]);
  // في RTL النهاية ناحية الشمال؛ نعكس ربط الحواف بالاتجاه
  const rtl = locale !== "en";
  const fadeLeft = rtl ? !edge.end : !edge.start;
  const fadeRight = rtl ? !edge.start : !edge.end;
  const maskImage = `linear-gradient(to right, ${fadeLeft ? "transparent 0%, #000 8%" : "#000 0%"}, ${fadeRight ? "#000 92%, transparent 100%" : "#000 100%"})`;
  const goTo = (idx: number) => {
    const el = trackRef.current;
    if (!el) return;
    const last = pageCountOf(el) - 1;
    const i = Math.min(Math.max(idx, 0), last);
    const step = stepOf(el);
    const max = el.scrollWidth - el.clientWidth;
    const rtl = getComputedStyle(el).direction === "rtl";
    // آخر صفحة تذهب لنهاية التمرير الفعلية حتى يظهر آخر كارت كاملاً
    let target = i >= last ? max * (rtl ? -1 : 1) : i * step * (rtl ? -1 : 1);
    target = rtl ? Math.max(target, -max) : Math.min(target, max);
    el.scrollTo({ left: target, behavior: "smooth" });
    setActive(i);
  };
  // مزامنة النقاط مع التمرير باللمس
  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    setActive(Math.min(pageCountOf(el) - 1, Math.round(Math.abs(el.scrollLeft) / stepOf(el))));
    recomputeEdges();
  };
  const navBtn = "flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white transition-colors hover:bg-white hover:text-brand-deep";
  return (
    <section className="relative overflow-hidden bg-gradient-to-bl from-brand to-brand-deep py-20">
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 lg:grid-cols-3 lg:px-8">
        {/* News */}
        <div className="lg:col-span-2">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div className="min-w-0 text-start">
              <h3 className="text-2xl font-extrabold text-white">{chrome?.["news.main"]?.title || pick(locale, "صدى العبور وحراكه", "The Impact of Oboor in Motion")}</h3>
              <p className="mt-1 text-sm text-white/70">{chrome?.["news.main"]?.text || pick(locale, "هنا ندوّن تفاصيل الأثر، تابع آخر المستجدات.", "Here, we document the details of our impact. Stay updated with the latest news and developments.")}</p>
            </div>
            <Link href="/news" className="mt-1 inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-sm font-semibold text-white/90 transition-colors hover:text-white">
              {pick(locale, "عرض الكل", "View All")}
              <svg className="dir-flip" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 6l-6 6 6 6" /></svg>
            </Link>
          </div>
          <div
            ref={trackRef}
            onScroll={onScroll}
            style={{ maskImage, WebkitMaskImage: maskImage }}
            className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2"
          >
            {news.map((n) => (
              <div key={n.title} className="flex w-[85%] shrink-0 snap-start sm:w-[47%] lg:w-[31%]">
                <NewsCard n={n} locale={locale} />
              </div>
            ))}
          </div>
          {/* Carousel controls: arrows + dots */}
          <div className="mt-5 flex items-center justify-center gap-3">
            <button onClick={() => goTo(active - 1)} aria-label={pick(locale, "السابق", "Previous")} className={navBtn}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" /></svg>
            </button>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: pages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={pick(locale, `الصفحة ${i + 1}`, `Page ${i + 1}`)}
                  className={`h-2 rounded-full transition-all ${i === active ? "w-5 bg-white" : "w-2 bg-white/40 hover:bg-white/60"}`}
                />
              ))}
            </div>
            <button onClick={() => goTo(active + 1)} aria-label={pick(locale, "التالي", "Next")} className={navBtn}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" /></svg>
            </button>
          </div>
        </div>

        {/* Certifications */}
        <div>
          <div className="mb-6 flex items-start justify-between gap-4">
            <div className="min-w-0 text-start">
              <h3 className="text-2xl font-extrabold text-white">{chrome?.["certs.heading"]?.title || pick(locale, "عبور، بالشهادات العالمية", "Oboor, Globally Accredited")}</h3>
              <p className="mt-1 text-sm text-white/70">{chrome?.["certs.heading"]?.text || pick(locale, "سجلٌ حافل بالاعتمادات، وتمكينٌ مبنيٌ على أعلى معايير الجودة.", "A distinguished record of international accreditations and empowerment built on the highest quality standards.")}</p>
            </div>
            <Link href="/about" className="mt-1 inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-sm font-semibold text-white/90 transition-colors hover:text-white">
              {pick(locale, "عرض الكل", "View All")}
              <svg className="dir-flip" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 6l-6 6 6 6" /></svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {certs.map((c, i) => (
              <div key={i} className="flex flex-col items-center rounded-2xl bg-white/95 p-6 text-center">
                <div className="flex h-14 w-14 flex-col items-center justify-center rounded-full border-2 border-brand text-[10px] font-bold leading-tight text-brand-deep">
                  {c.name.split(" ").map((w, j) => <span key={j}>{w}</span>)}
                </div>
                <p className="mt-3 text-sm font-bold text-ink">{c.name}</p>
                <p className="text-[11px] text-ink-muted">{c.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
