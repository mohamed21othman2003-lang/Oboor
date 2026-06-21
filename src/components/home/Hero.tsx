"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { pick, type Locale } from "@/i18n/config";

export default function Hero({ locale }: { locale: Locale }) {
  const badge = pick(locale, "نرعى نقاءهم، ونبني غدهم", "Nurturing Their Potential, Shaping Their Future");
  const cta = pick(locale, "من هنا، نُمكّنهم", "From Here, We Empower Them");

  const slides = [
    {
      img: "/figma/home/imgImageWithFallback.jpg",
      heading: pick(
        locale,
        <>مركز <span className="text-brand">عبور</span><br />للرعاية النهارية والتأهيل</>,
        <><span className="text-brand">Oboor</span> Day Care<br />& Rehabilitation Center</>,
      ),
      desc: pick(
        locale,
        "أبناؤكم في أيدٍ أمينة، يكبرون ويعبرون؛ نحتوي نقاءهم بقلوبٍ حانية، ونرسم خطاهم ببرامج متكاملة، يتعلموا منها مهارات الحياة بثقة، ليعبروا نحو غدٍ يملؤه الأمل والسعة.",
        "Your children are in safe and caring hands. They grow and move forward with confidence. We nurture their purity with compassionate hearts and guide their journey through integrated programs that build life skills and empower them toward a future filled with hope and opportunity.",
      ),
    },
    {
      img: "/figma/home/hero-slide2-clean.jpg",
      heading: pick(
        locale,
        <>التدخل المبكر خطوة مبكرة في الصغر<br />تُنير سائر العُمر</>,
        <>Early Intervention: A Small Step in<br />Childhood That Illuminates a Lifetime</>,
      ),
      desc: pick(
        locale,
        "من التشخيص المبكر والتدخل الفوري، نرافق أطفالكم برعايةٍ تُساند نموهم وتُنمّي مهاراتهم، ليندمجوا مع أقرانهم.",
        "Through early diagnosis and timely intervention, we support your children with care that fosters their growth and skill development, helping them integrate confidently with their peers.",
      ),
    },
    {
      img: "/figma/home/hero-slide3.jpg",
      heading: pick(
        locale,
        <>ليُعبّروا بأصواتهم<br />ويُعبّروا بخطواتهم</>,
        <>So They Can Express Themselves<br />and Move Forward with Confidence</>,
      ),
      desc: pick(
        locale,
        "عبر برامج متكاملة تجمع بين رعاية النطق، والتكامل الحسي، والعلاج الوظيفي، نأخذ بأيدي أطفالكم برفقٍ مستندين إلى أحدث الأساليب الدولية، لتنمو قدراتهم ويعبروا لمستقبلهم.",
        "Through integrated programs that combine speech therapy, sensory integration, and occupational therapy, we gently support your children using the latest international approaches, helping them develop their abilities and move confidently toward their future.",
      ),
    },
  ];

  const n = slides.length;
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % n), 6000);
    return () => clearInterval(t);
  }, [n]);

  const go = (idx: number) => setI(((idx % n) + n) % n);
  const s = slides[i];

  // التدرّج يتبع جهة النص: يمين في العربي، شمال في الإنجليزي
  const gradient =
    locale === "en"
      ? "bg-gradient-to-r from-[rgba(13,61,69,0.9)] from-0% via-[rgba(13,61,69,0.4)] via-50% to-transparent to-80%"
      : "bg-gradient-to-l from-[rgba(13,61,69,0.85)] from-0% via-[rgba(13,61,69,0.28)] via-45% to-transparent to-75%";

  return (
    <section className="relative min-h-[600px] w-full overflow-hidden lg:h-[791px]">
      {/* Background images — one per slide, cross-fading */}
      {slides.map((sl, idx) => (
        <Image
          key={sl.img}
          src={sl.img}
          alt={pick(locale, "مركز عبور للرعاية والتأهيل", "Oboor Center for Care & Rehabilitation")}
          fill
          priority={idx === 0}
          quality={90}
          sizes="100vw"
          className={`object-cover object-bottom transition-opacity duration-700 ${idx === i ? "opacity-100" : "opacity-0"}`}
        />
      ))}
      {/* Gradient — teal concentrated behind the text side (direction-aware) */}
      <div className={`absolute inset-0 ${gradient}`} />

      {/* Content */}
      <div className="relative mx-auto flex h-full min-h-[600px] max-w-[1600px] items-center justify-start px-6 lg:min-h-0 lg:px-16">
        <div key={i} className="flex w-full max-w-xl flex-col items-start gap-6 text-start motion-safe:animate-[fadeIn_0.5s_ease]">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/20 px-4 py-2 text-sm font-medium text-[#7ee8f0]">
            <span className="h-2 w-2 rounded-full bg-brand opacity-95" />
            {badge}
          </span>

          <h1 className="text-4xl font-extrabold leading-tight text-white [text-shadow:0_2px_18px_rgba(13,61,69,0.5)] sm:text-5xl lg:text-[52px] lg:leading-[1.25]">
            {s.heading}
          </h1>

          <p className="max-w-[507px] text-base leading-relaxed text-white/90 [text-shadow:0_1px_12px_rgba(13,61,69,0.55)] sm:text-lg lg:text-xl">
            {s.desc}
          </p>

          <Link
            href="/programs"
            className="inline-flex items-center gap-3 rounded-2xl border border-white/30 bg-white/15 px-7 py-4 text-base font-semibold text-white backdrop-blur transition-colors hover:bg-white/25"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="dir-flip"><path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" /></svg>
            {cta}
          </Link>
        </div>
      </div>

      {/* Carousel controls */}
      <div className="absolute bottom-9 left-1/2 flex h-9 w-40 -translate-x-1/2 items-center gap-4">
        <button onClick={() => go(i - 1)} aria-label={pick(locale, "السابق", "Previous")} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/20 text-white transition-colors hover:bg-white/30">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="dir-flip"><path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" /></svg>
        </button>
        <div className="flex flex-1 items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => go(idx)}
              aria-label={pick(locale, `الشريحة ${idx + 1}`, `Slide ${idx + 1}`)}
              className={idx === i ? "h-2 flex-1 rounded-full bg-brand" : "h-2 w-2 rounded-full bg-white/40 transition-colors hover:bg-white/60"}
            />
          ))}
        </div>
        <button onClick={() => go(i + 1)} aria-label={pick(locale, "التالي", "Next")} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/20 text-white transition-colors hover:bg-white/30">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="dir-flip"><path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" /></svg>
        </button>
      </div>

      {/* Bottom wave */}
      <svg className="absolute bottom-0 left-0 w-full text-white" viewBox="0 0 1440 100" fill="currentColor" preserveAspectRatio="none">
        <path d="M0 60 C 240 100 480 100 720 70 C 960 40 1200 40 1440 70 L 1440 100 L 0 100 Z" />
      </svg>
    </section>
  );
}
