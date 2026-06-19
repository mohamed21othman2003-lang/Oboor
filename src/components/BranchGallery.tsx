"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { pick, type Locale } from "@/i18n/config";

export default function BranchGallery({ images, branchName, locale = "ar" }: { images: string[]; branchName: string; locale?: Locale }) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  const go = useCallback((dir: number) => {
    setIndex((i) => (i + dir + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowLeft") go(1);
      if (e.key === "ArrowRight") go(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, go]);

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="mb-8 text-start text-3xl font-extrabold text-ink">{pick(locale, "صور من ", "Photos of the ")}<span className="text-brand">{pick(locale, "الفرع", "Branch")}</span></h2>

        {/* Featured */}
        <div className="relative overflow-hidden rounded-2xl border border-line bg-surface">
          <button onClick={() => setOpen(true)} className="relative block h-[300px] w-full sm:h-[440px]">
            <Image src={images[index]} alt={pick(locale, `${branchName} - صورة ${index + 1}`, `${branchName} - photo ${index + 1}`)} fill className="object-contain" sizes="100vw" />
          </button>
          <Arrow dir="prev" onClick={() => go(-1)} locale={locale} />
          <Arrow dir="next" onClick={() => go(1)} locale={locale} />
        </div>

        {/* Thumbnails */}
        <div className="mt-4 flex flex-wrap gap-2.5">
          {images.map((src, i) => (
            <button
              key={src}
              onClick={() => setIndex(i)}
              className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${i === index ? "border-brand" : "border-transparent opacity-70 hover:opacity-100"}`}
            >
              <Image src={src} alt="" fill className="object-cover" sizes="80px" />
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {open && (
        <div className="fixed inset-0 z-[70] flex flex-col bg-black/90 p-4" role="dialog" aria-modal="true">
          <div className="flex items-center justify-between text-white">
            <button onClick={() => setOpen(false)} aria-label={pick(locale, "إغلاق", "Close")} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
            <h3 className="text-lg font-bold">{branchName}</h3>
          </div>

          <div className="relative flex flex-1 items-center justify-center">
            <Image src={images[index]} alt={pick(locale, `${branchName} - صورة ${index + 1}`, `${branchName} - photo ${index + 1}`)} width={1200} height={800} className="max-h-[70vh] w-auto max-w-full rounded-xl object-contain" />
            <Arrow dir="prev" onClick={() => go(-1)} light locale={locale} />
            <Arrow dir="next" onClick={() => go(1)} light locale={locale} />
          </div>

          <div className="flex justify-center gap-2 overflow-x-auto pb-2">
            {images.map((src, i) => (
              <button
                key={src}
                onClick={() => setIndex(i)}
                className={`relative h-14 w-16 shrink-0 overflow-hidden rounded-md border-2 transition ${i === index ? "border-brand" : "border-transparent opacity-50 hover:opacity-90"}`}
              >
                <Image src={src} alt="" fill className="object-cover" sizes="64px" />
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function Arrow({ dir, onClick, light, locale = "ar" }: { dir: "prev" | "next"; onClick: () => void; light?: boolean; locale?: Locale }) {
  return (
    <button
      onClick={onClick}
      aria-label={dir === "next" ? pick(locale, "التالي", "Next") : pick(locale, "السابق", "Previous")}
      className={`absolute top-1/2 -translate-y-1/2 ${dir === "next" ? "left-3" : "right-3"} flex h-10 w-10 items-center justify-center rounded-full shadow transition-colors ${light ? "bg-white/15 text-white hover:bg-white/30" : "bg-white/90 text-ink hover:bg-white"}`}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d={dir === "next" ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} />
      </svg>
    </button>
  );
}
