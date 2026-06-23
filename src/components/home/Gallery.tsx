"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { pick, type Locale } from "@/i18n/config";

const IMAGES = [
  "/figma/home/imgImageWithFallback6.png", // big (center)
  "/figma/home/imgImageWithFallback7.jpg",
  "/figma/home/imgImageWithFallback8.png",
  "/figma/home/imgImageWithFallback9.png",
  "/figma/home/imgImageWithFallback10.jpg",
  "/figma/home/imgImageWithFallback11.jpg",
  "/figma/home/imgImageWithFallback12.jpg",
];

// desktop placement: big centered (cols 2-3, rows 1-2), flanked by columns, two wide tiles at the bottom
const CELL = [
  "lg:col-start-2 lg:col-span-2 lg:row-start-1 lg:row-span-2",
  "lg:col-start-1 lg:row-start-1",
  "lg:col-start-1 lg:row-start-2",
  "lg:col-start-4 lg:row-start-1",
  "lg:col-start-4 lg:row-start-2",
  "lg:col-start-1 lg:col-span-2 lg:row-start-3",
  "lg:col-start-3 lg:col-span-2 lg:row-start-3",
];

export default function Gallery({ locale, images: imagesProp, captions }: { locale: Locale; images?: string[]; captions?: string[] }) {
  const images = imagesProp && imagesProp.length ? imagesProp : IMAGES;
  const [open, setOpen] = useState<number | null>(null);
  const alt = (i: number) =>
    captions?.[i] ?? pick(locale, `صورة ${i + 1} من المركز`, `Photo ${i + 1} from the center`);

  const go = useCallback((dir: number) => {
    setOpen((p) => (p === null ? p : (p + dir + images.length) % images.length));
  }, [images.length]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      else if (e.key === "ArrowLeft") go(1);
      else if (e.key === "ArrowRight") go(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, go]);

  return (
    <section className="bg-surface py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div className="min-w-0 text-start">
            <span className="rounded-full bg-brand/10 px-4 py-1.5 text-sm font-medium text-brand-dark">{pick(locale, "المعرض", "Gallery")}</span>
            <h2 className="mt-3 text-3xl font-extrabold text-ink sm:text-4xl">{pick(locale, "ملامح من عبور", "Moments from Oboor")}</h2>
          </div>
          <Link href="/gallery" className="mt-1 inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-sm font-semibold text-brand transition-colors hover:text-brand-dark">
            {pick(locale, "عرض الكل", "View All")}
            <svg className="dir-flip" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 6l-6 6 6 6" /></svg>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:h-[560px] lg:grid-cols-4 lg:grid-rows-3">
          {images.map((src, i) => (
            <button
              key={src}
              onClick={() => setOpen(i)}
              aria-label={alt(i)}
              className={`group relative overflow-hidden rounded-2xl ${i === 0 ? "col-span-2 h-56 lg:h-auto" : "h-40 lg:h-auto"} ${CELL[i] ?? ""}`}
            >
              <Image src={src} alt={alt(i)} fill sizes={i === 0 ? "(max-width:1024px) 100vw, 50vw" : "(max-width:1024px) 50vw, 25vw"} className="object-cover transition-transform duration-300 group-hover:scale-105" />
              <span className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/15" />
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {open !== null && (
        <div onClick={() => setOpen(null)} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm">
          <button onClick={() => setOpen(null)} aria-label={pick(locale, "إغلاق", "Close")} className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
          <button onClick={(e) => { e.stopPropagation(); go(-1); }} aria-label={pick(locale, "السابق", "Previous")} className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" /></svg>
          </button>
          <button onClick={(e) => { e.stopPropagation(); go(1); }} aria-label={pick(locale, "التالي", "Next")} className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" /></svg>
          </button>
          <div className="relative h-[82vh] w-[92vw] max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <Image src={images[open]} alt={alt(open)} fill sizes="92vw" className="object-contain" />
          </div>
          <span className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white" dir="ltr">{open + 1} / {images.length}</span>
        </div>
      )}
    </section>
  );
}
