import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import GalleryViewer from "@/components/GalleryViewer";
import { fetchContent } from "@/lib/server/django";
import { getLocale } from "@/i18n/locale";
import { pick, type Locale } from "@/i18n/config";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return pageMeta(
    pick(locale, "المعرض | مركز عبور للرعاية والتأهيل", "Gallery | Oboor Center for Care & Rehabilitation"),
    pick(locale, "معرض صور مراكز عبور — لحظات حقيقية من داخل قاعات التأهيل والأنشطة والفعاليات، تعكس بيئة الرعاية التي يعيشها أبناؤنا كل يوم.", "Oboor centers photo gallery — real moments from inside our rehabilitation rooms, activities, and events, reflecting the caring environment our children live every day."),
  );
}

const G = "/figma/gallery";

// صور افتراضية (تُستخدم فقط إن كان معرض الـCMS فارغاً)
const FALLBACK = [
  `${G}/g-209.jpg`, `${G}/g-213.jpg`, `${G}/g-f0.jpg`, `${G}/g-f2.jpg`, `${G}/g-f1.jpg`, `${G}/g-f3.jpg`,
  `${G}/g-215.jpg`, `${G}/g-f4.jpg`, `${G}/g-216.jpg`, `${G}/g-214.jpg`, `${G}/g-210.jpg`, `${G}/g-f5.jpg`,
  `${G}/g-f6.jpg`, `${G}/g-217.jpg`, `${G}/g-f7.jpg`, `${G}/g-f8.jpg`, `${G}/g-f9.jpg`, `${G}/g-f10.jpg`,
];

type ApiGallery = { image: string; caption_ar: string; caption_en: string };

// صور المعرض من الـCMS (content/gallery) مع fallback للصور الثابتة
async function loadGallery(locale: Locale): Promise<{ src: string; caption: string }[]> {
  const rows = await fetchContent<ApiGallery[]>("gallery");
  if (rows && rows.length) {
    const en = locale === "en";
    return rows.map((r) => ({ src: r.image, caption: (en ? r.caption_en || r.caption_ar : r.caption_ar) || "" }));
  }
  return FALLBACK.map((src) => ({ src, caption: "" }));
}

function Chev() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="dir-flip"><path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" /></svg>;
}

export default async function GalleryPage() {
  const locale = await getLocale();
  const items = await loadGallery(locale);
  const images = items.map((i) => i.src);
  // الكولاج العلوي: أول ١٠ صور من المعرض (مع fallback لكل خانة)
  const collage = Array.from({ length: 10 }, (_, i) => images[i] ?? FALLBACK[i % FALLBACK.length]);
  const W = [[150, 88, 187], [150, 209, 70], [129, 113, 96, 70]];
  const rows = [collage.slice(0, 3), collage.slice(3, 6), collage.slice(6, 10)];

  return (
    <>
      {/* Hero */}
      <section className="overflow-hidden bg-gradient-to-b from-[#ebf7f9] to-white">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <nav className="mb-8 flex items-center justify-start gap-2 text-sm text-ink-soft">
            <span className="text-brand">{pick(locale, "الصور والفيديوهات", "Photos & Videos")}</span>
            <Chev />
            <Link href="/" className="hover:text-brand">{pick(locale, "الرئيسية", "Home")}</Link>
          </nav>

          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Text (right) */}
            <div className="order-2 text-start lg:order-1">
              <span className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-[#dff6f8] px-4 py-1.5 text-xs font-bold text-brand-dark">
                {pick(locale, "معرض الصور", "Photo Gallery")}
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
              </span>
              <h1 className="mt-4 text-4xl font-extrabold leading-tight text-ink">{pick(locale, "صور ", "Our ")}<span className="text-brand">{pick(locale, "المركز", "Center")}</span></h1>
              <p className="mt-4 text-base font-bold leading-8 text-ink-muted">{pick(locale, "لحظات حقيقية من رحلات التأهيل والتطور داخل مراكز عبور", "Real moments from rehabilitation and growth journeys inside Oboor Centers")}</p>
              <p className="mt-3 text-base leading-7 text-ink-muted">
                {pick(locale, "توثيق حيّ لمسيرة التغيير من الجلسات العلاجية المتخصصة، إلى الأنشطة الإبداعية، وصولاً إلى لحظات النجاح التي تُلهمنا كل يوم.", "A living record of the journey of change — from specialized therapy sessions, to creative activities, all the way to the moments of success that inspire us every day.")}
              </p>
            </div>

            {/* Collage (left) — يتغذّى من أول صور المعرض */}
            <div className="order-1 flex flex-col gap-[22px] lg:order-2">
              {rows.map((row, ri) => (
                <div key={ri} className="flex gap-[22px]">
                  {row.map((src, ci) => (
                    <div key={ci} style={{ flex: W[ri][ci] }} className="relative h-[114px] overflow-hidden rounded-2xl shadow-[3px_3px_13px_0px_rgba(44,188,200,0.6)]">
                      <Image src={src} alt="" fill className="object-cover" sizes="200px" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery grid — مُدار بالكامل من معرض الـCMS */}
      <section className="bg-white pb-16 pt-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-6 flex items-center gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-brand/10 text-brand">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>
            </span>
            <div className="shrink-0 text-start">
              <h2 className="text-xl font-bold text-ink">{pick(locale, "صور المركز", "Center Photos")}</h2>
              <p className="text-xs text-[#8a9ba3]">{pick(locale, `${items.length} صورة`, `${items.length} photos`)}</p>
            </div>
            <span className="h-px flex-1 bg-gradient-to-l from-transparent via-line-soft to-transparent" />
          </div>

          <GalleryViewer items={items} locale={locale} />
        </div>
      </section>
    </>
  );
}
