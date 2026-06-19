import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getLocale } from "@/i18n/locale";
import { pick } from "@/i18n/config";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: pick(locale, "المعرض | مركز عبور للرعاية والتأهيل", "Gallery | Oboor Center for Care & Rehabilitation"),
    description: pick(locale, "صور المركز — لحظات حقيقية من رحلات التأهيل والتطور داخل مراكز عبور.", "Center photos — real moments from rehabilitation and growth journeys inside Oboor Centers."),
  };
}

const G = "/figma/gallery";

function Chev() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="dir-flip"><path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" /></svg>;
}

/* صورة داخل الجريد مع طبقة فيديو اختيارية */
function Tile({ src, video, duration, className = "" }: { src: string; video?: boolean; duration?: string; className?: string }) {
  return (
    <div className={`group relative overflow-hidden rounded-2xl ${className}`}>
      <Image src={src} alt="" fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="(max-width:768px) 50vw, 25vw" />
      {video && (
        <>
          <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white/60 bg-white/40 shadow-lg backdrop-blur">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5 text-brand-deep"><path d="M8 5v14l11-7z" /></svg>
          </span>
          {duration && (
            <span className="absolute right-3 top-3 flex items-center gap-1 rounded-[10px] bg-brand-deep/85 px-2 py-1 text-[11px] font-semibold text-white">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" strokeLinecap="round" /></svg>
              {duration}
            </span>
          )}
        </>
      )}
    </div>
  );
}

const FILTERS = [
  { ar: "الكل", en: "All", count: 7, active: true },
  { ar: "صور", en: "Photos", count: 6, active: false },
  { ar: "فيديوهات", en: "Videos", count: 1, active: false },
  { ar: "فعاليات وانشطه", en: "Events & Activities", count: 1, active: false },
];

// كل الصور للعرض المتجاوب على الموبايل
const ALL_IMAGES = [
  `${G}/g-209.jpg`, `${G}/g-213.jpg`, `${G}/g-f0.jpg`, `${G}/g-f2.jpg`, `${G}/g-f1.jpg`, `${G}/g-f3.jpg`,
  `${G}/g-215.jpg`, `${G}/g-f4.jpg`, `${G}/g-216.jpg`, `${G}/g-214.jpg`, `${G}/g-210.jpg`, `${G}/g-f5.jpg`,
  `${G}/g-f6.jpg`, `${G}/g-217.jpg`, `${G}/g-f7.jpg`, `${G}/g-f8.jpg`, `${G}/g-f9.jpg`, `${G}/g-f10.jpg`,
];

export default async function GalleryPage() {
  const locale = await getLocale();
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

            {/* Collage (left) */}
            <div className="order-1 flex flex-col gap-[22px] lg:order-2">
              <CollageRow items={[[ "g-209", 150 ], [ "g-211", 88 ], [ "g-213", 187 ]]} />
              <CollageRow items={[[ "g-210", 150 ], [ "g-214", 209 ], [ "g-212", 70 ]]} />
              <CollageRow items={[[ "g-215", 129 ], [ "g-216", 113 ], [ "g-217", 96 ], [ "g-218", 70 ]]} />
            </div>
          </div>
        </div>
      </section>

      {/* Filter tabs */}
      <section className="bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-4 px-6 py-6 lg:px-8">
          {FILTERS.map((f) => (
            <button key={f.ar} className={`flex items-center gap-2 ${f.active ? "border-b-[3px] border-brand pb-2 text-brand-dark" : "pb-2 text-ink"}`}>
              <span className={`flex h-5 min-w-[22px] items-center justify-center rounded-[10px] px-1.5 text-xs font-bold ${f.active ? "bg-brand text-white" : "bg-[#e8f7f8] text-ink-soft"}`}>{f.count}</span>
              <span className={`text-lg font-bold sm:text-xl ${f.active ? "font-extrabold" : ""}`}>{pick(locale, f.ar, f.en)}</span>
              <GridIcon active={f.active} />
            </button>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section className="bg-white pb-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Section header */}
          <div className="flex items-center gap-4 py-6">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-brand/10 text-brand">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>
            </span>
            <div className="shrink-0 text-start">
              <h2 className="text-xl font-bold text-ink">{pick(locale, "صور المركز", "Center Photos")}</h2>
              <p className="text-xs text-[#8a9ba3]">{pick(locale, "عرض 16 من 40", "Showing 16 of 40")}</p>
            </div>
            <span className="h-px flex-1 bg-gradient-to-l from-transparent via-line-soft to-transparent" />
          </div>

          {/* Bento (md+) */}
          <div className="hidden flex-col gap-4 md:flex">
            {/* Block 1 */}
            <div className="flex items-stretch gap-4">
              {/* Col A */}
              <div className="flex flex-[348] flex-col gap-4">
                <Tile src={`${G}/g-209.jpg`} className="h-40" />
                <Tile src={`${G}/g-f0.jpg`} className="h-40" />
                <Tile src={`${G}/g-f1.jpg`} className="h-40" />
              </div>
              {/* Col Mid */}
              <div className="flex flex-[712] flex-col gap-4">
                <Tile src={`${G}/g-213.jpg`} video duration="1:20" className="h-[336px]" />
                <div className="flex gap-4">
                  <Tile src={`${G}/g-f2.jpg`} video duration="0:46" className="h-40 flex-1" />
                  <Tile src={`${G}/g-f3.jpg`} className="h-40 flex-1" />
                </div>
              </div>
              {/* Col C */}
              <div className="flex flex-[151] flex-col gap-4">
                <Tile src={`${G}/g-215.jpg`} className="h-40" />
                <Tile src={`${G}/g-f4.jpg`} className="h-40" />
                <Tile src={`${G}/g-216.jpg`} className="h-40" />
              </div>
            </div>

            {/* Block 2 */}
            <div className="flex items-stretch gap-4">
              {/* Left cluster */}
              <div className="flex flex-[712] flex-col gap-4">
                <div className="flex gap-4">
                  <Tile src={`${G}/g-214.jpg`} className="h-40 flex-1" />
                  <Tile src={`${G}/g-210.jpg`} className="h-40 flex-1" />
                </div>
                <div className="flex gap-4">
                  <Tile src={`${G}/g-f5.jpg`} className="h-40 flex-[140]" />
                  <Tile src={`${G}/g-f6.jpg`} className="h-40 flex-[538]" />
                </div>
                <div className="flex gap-4">
                  <Tile src={`${G}/g-217.jpg`} className="h-40 flex-1" />
                  <Tile src={`${G}/g-f7.jpg`} className="h-40 flex-1" />
                </div>
              </div>
              {/* Right cluster */}
              <div className="flex flex-[513] flex-col gap-4">
                <Tile src={`${G}/g-f8.jpg`} className="h-40" />
                <Tile src={`${G}/g-f9.jpg`} className="h-40" />
                <div className="flex gap-4">
                  <Tile src={`${G}/g-f10.jpg`} video duration="0:46" className="h-40 flex-[348]" />
                  <Tile src={`${G}/g-218.jpg`} className="h-40 flex-[149]" />
                </div>
              </div>
            </div>
          </div>

          {/* Masonry (mobile) */}
          <div className="columns-2 gap-3 md:hidden [&>*]:mb-3">
            {ALL_IMAGES.map((src, i) => (
              <div key={i} className="overflow-hidden rounded-2xl">
                <Image src={src} alt="" width={400} height={i % 3 === 0 ? 320 : 240} className="h-auto w-full object-cover" />
              </div>
            ))}
          </div>

          {/* Load more */}
          <div className="mt-12 flex justify-center">
            <button className="rounded-2xl border-2 border-brand px-16 py-3.5 text-sm font-semibold text-brand transition-colors hover:bg-brand hover:text-white">
              {pick(locale, "عرض المزيد", "Load More")}
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

function CollageRow({ items }: { items: [string, number][] }) {
  return (
    <div className="flex gap-[22px]">
      {items.map(([name, w]) => (
        <div key={name} style={{ flex: w }} className="relative h-[114px] overflow-hidden rounded-2xl shadow-[3px_3px_13px_0px_rgba(44,188,200,0.6)]">
          <Image src={`${G}/${name}.jpg`} alt="" fill className="object-cover" sizes="200px" />
        </div>
      ))}
    </div>
  );
}

function GridIcon({ active }: { active: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={active ? "text-brand-dark" : "text-ink-soft"}>
      <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}
