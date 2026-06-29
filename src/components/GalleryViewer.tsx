"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { pick, type Locale } from "@/i18n/config";

type Item = { src: string; caption: string };

// شبكة المعرض + عارض صور (lightbox) بتصميم عبور: صورة كبيرة، أسهم جانبية،
// شريط سفلي (الوصف + العدّاد)، وشريط مصغّرات قابل للتمرير.
export default function GalleryViewer({ items, locale }: { items: Item[]; locale: Locale }) {
  const [open, setOpen] = useState<number | null>(null);
  const n = items.length;
  const isOpen = open !== null;

  const go = useCallback(
    (dir: number) => setOpen((p) => (p === null ? p : (p + dir + n) % n)),
    [n],
  );

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      else if (e.key === "ArrowLeft") go(1);
      else if (e.key === "ArrowRight") go(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, go]);

  const cur = open !== null ? items[open] : null;
  const pos = (open ?? 0) + 1;

  return (
    <>
      {/* الشبكة — كل صورة قابلة للضغط لفتح العارض */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((it, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setOpen(i)}
            aria-label={it.caption || pick(locale, `صورة ${i + 1}`, `Photo ${i + 1}`)}
            className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#f3f5f6] shadow-sm"
          >
            <Image src={it.src} alt={it.caption} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="(max-width:640px) 50vw, 25vw" />
            {it.caption && (
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 text-start text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">{it.caption}</span>
            )}
          </button>
        ))}
      </div>

      {/* العارض */}
      {cur && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-black/85 backdrop-blur-sm" onClick={() => setOpen(null)}>
          {/* إغلاق */}
          <button onClick={() => setOpen(null)} aria-label={pick(locale, "إغلاق", "Close")} className="absolute end-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20 sm:end-6 sm:top-6">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>

          {/* المنصّة: الصورة + الأسهم الجانبية */}
          <div className="relative flex flex-1 items-center justify-center px-3 pb-2 pt-16 sm:px-20" onClick={(e) => e.stopPropagation()}>
            {n > 1 && (
              <button onClick={() => go(-1)} aria-label={pick(locale, "السابق", "Previous")} className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/15 text-white transition-colors hover:bg-white/30 sm:right-6 sm:h-12 sm:w-12">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" /></svg>
              </button>
            )}
            <div className="relative h-full w-full max-w-5xl">
              <Image key={cur.src} src={cur.src} alt={cur.caption} fill className="rounded-2xl object-contain" sizes="92vw" priority />
            </div>
            {n > 1 && (
              <button onClick={() => go(1)} aria-label={pick(locale, "التالي", "Next")} className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/15 text-white transition-colors hover:bg-white/30 sm:left-6 sm:h-12 sm:w-12">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" /></svg>
              </button>
            )}
          </div>

          {/* الشريط السفلي: الوصف + العدّاد + المصغّرات */}
          <div className="mx-auto w-full max-w-5xl px-3 pb-6 sm:px-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/15 bg-black/60 px-4 py-3 sm:px-5">
              <span dir="ltr" className="shrink-0 text-xs text-white/55">{pos} / {n}</span>
              {cur.caption && <p className="min-w-0 flex-1 truncate text-end text-sm font-bold text-white">{cur.caption}</p>}
            </div>
            {n > 1 && (
              <div className="no-scrollbar mt-3 flex justify-start gap-2 overflow-x-auto pb-1 sm:justify-center">
                {items.map((it, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setOpen(i)}
                    aria-label={pick(locale, `صورة ${i + 1}`, `Photo ${i + 1}`)}
                    className={`relative h-10 w-14 shrink-0 overflow-hidden rounded-lg ring-2 transition ${i === open ? "ring-brand" : "opacity-50 ring-transparent hover:opacity-100"}`}
                  >
                    <Image src={it.src} alt="" fill className="object-cover" sizes="56px" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
