"use client";

import Image from "next/image";
import { useRef } from "react";
// index-based scrolling for reliable RTL behaviour
import { pick, type Locale } from "@/i18n/config";

const STORIES = [
  {
    img: "/figma/home/imgImageWithFallback3.png",
    program: "برنامج التدخل المبكر",
    duration: "٢٠ شهراً من البرنامج",
    name: "سارة",
    age: "٨ سنوات",
    before: "لم تكن تستطيع التواصل بشكل مستقل",
    after: "باتت تتواصل بجمل كاملة وتنخرط في الأنشطة الاجتماعية",
    quote: "مركز عبور غيّر حياة ابنتي تماماً. رأيت تطوراً لم أكن أتخيله ممكناً.",
    parent: "والدة سارة",
    period: "٣ أشهر",
  },
  {
    img: "/figma/home/imgImageWithFallback4.png",
    program: "العلاج الوظيفي",
    duration: "١٢ شهراً من الجلسات",
    name: "أحمد",
    age: "٦ سنوات",
    before: "صعوبة في التركيز والمهارات الحركية",
    after: "تحسّن ملحوظ في التركيز والاعتماد على النفس",
    quote: "الفريق محترف ويتعامل بإنسانية عالية مع أبنائنا.",
    parent: "والدة أحمد",
    period: "٦ أشهر",
  },
  {
    img: "/figma/home/imgImageWithFallback5.png",
    program: "النطق والتخاطب",
    duration: "٢ شهراً من جلسات النطق",
    name: "مريم",
    age: "٥ سنوات",
    before: "تأخر في النطق والتخاطب",
    after: "أصبحت تعبّر عن احتياجاتها بوضوح وثقة",
    quote: "نتائج حقيقية خلال أشهر قليلة، شكراً لكل القائمين على المركز.",
    parent: "أم مريم",
    period: "٤ أشهر",
  },
];

const STORIES_EN: typeof STORIES = [
  {
    img: "/figma/home/imgImageWithFallback3.png",
    program: "Early Intervention Program",
    duration: "20 months in the program",
    name: "Sara",
    age: "8 years",
    before: "Was unable to communicate independently",
    after: "Now communicates in full sentences and takes part in social activities",
    quote: "Oboor Center completely changed my daughter's life. I saw progress I never imagined possible.",
    parent: "Sara's mother",
    period: "3 months",
  },
  {
    img: "/figma/home/imgImageWithFallback4.png",
    program: "Occupational Therapy",
    duration: "12 months of sessions",
    name: "Ahmed",
    age: "6 years",
    before: "Difficulty with focus and motor skills",
    after: "Noticeable improvement in focus and self-reliance",
    quote: "The team is professional and treats our children with great compassion.",
    parent: "Ahmed's mother",
    period: "6 months",
  },
  {
    img: "/figma/home/imgImageWithFallback5.png",
    program: "Speech & Language Therapy",
    duration: "2 months of speech sessions",
    name: "Maryam",
    age: "5 years",
    before: "Delay in speech and language",
    after: "Now expresses her needs clearly and confidently",
    quote: "Real results within just a few months — thank you to everyone at the center.",
    parent: "Maryam's mother",
    period: "4 months",
  },
];

function Story({ s, locale }: { s: (typeof STORIES)[number]; locale: Locale }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-white text-start shadow-lg">
      <div className="relative h-40 shrink-0">
        <Image src={s.img} alt={s.name} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover" />
        <span className="absolute right-3 top-3 rounded-full bg-brand px-3 py-1 text-[11px] font-semibold text-white">{s.program}</span>
        <span className="absolute bottom-3 left-3 rounded-lg bg-black/55 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur">{s.duration}</span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-3 text-sm font-bold text-ink">{s.name} - {s.age}</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-[#fdeced] p-3">
            <p className="mb-1 text-[11px] font-semibold text-[#c0392b]">{pick(locale, "قبل الالتحاق", "Before Enrollment")}</p>
            <p className="text-xs leading-6 text-ink-muted">{s.before}</p>
          </div>
          <div className="rounded-lg bg-brand/10 p-3">
            <p className="mb-1 text-[11px] font-semibold text-brand-dark">{pick(locale, "بعد البرنامج", "After the Program")}</p>
            <p className="text-xs leading-6 text-ink-muted">{s.after}</p>
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-surface p-4">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="mb-2 text-brand/40"><path d="M7 7h4v10H3v-6a4 4 0 0 1 4-4zm10 0h4v10h-8v-6a4 4 0 0 1 4-4z" /></svg>
          <p className="text-sm leading-7 text-ink">{s.quote}</p>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-line pt-3 text-xs text-ink-muted">
          <span className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
              {s.period}
            </span>
            <span className="flex items-center gap-1">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
              {s.age}
            </span>
          </span>
          <span className="font-semibold text-brand-dark">{s.parent}</span>
        </div>
      </div>
    </div>
  );
}

export default function SuccessStories({ locale, stories: storiesProp }: { locale: Locale; stories?: (typeof STORIES)[number][] }) {
  const stories = storiesProp?.length ? storiesProp : (locale === "en" ? STORIES_EN : STORIES);
  const trackRef = useRef<HTMLDivElement>(null);
  const idxRef = useRef(0);
  const scroll = (dir: number) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.children[0] as HTMLElement | undefined;
    if (!card) return;
    const step = card.offsetWidth + 24; // gap-6
    const max = el.scrollWidth - el.clientWidth;
    idxRef.current = Math.min(Math.max(idxRef.current + dir, 0), el.children.length - 1);
    const rtl = getComputedStyle(el).direction === "rtl";
    let target = idxRef.current * step * (rtl ? -1 : 1);
    target = rtl ? Math.max(target, -max) : Math.min(target, max);
    el.scrollTo({ left: target, behavior: "smooth" });
  };
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#eef7f8] to-white py-20">
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header: title (start) + arrows (end) */}
        <div className="mb-10 flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="text-start">
            <span className="rounded-full bg-brand/10 px-4 py-1.5 text-sm font-medium text-brand-dark">{pick(locale, "أبطال عبور", "Oboor Champions")}</span>
            <h2 className="mt-4 text-3xl font-extrabold text-ink sm:text-4xl">
              {pick(
                locale,
                <>عبروا، <span className="text-brand">وعبّروا!</span></>,
                <>They crossed barriers and found <span className="text-brand">their voice</span></>
              )}
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-ink-muted">
              {pick(
                locale,
                "قصص لحياة تغيرت، وملامح طفولة استعادت بهجتها، نفخر بمسيرة رافقنا فيها أبطالنا من أول خطوة وحتى التمكين.",
                "Stories of transformed lives and childhoods that have regained their joy. We take pride in the journeys we have accompanied — supporting our champions from their very first step to empowerment."
              )}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <button onClick={() => scroll(-1)} aria-label={pick(locale, "السابق", "Previous")} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-white text-ink-soft shadow-sm transition-colors hover:border-brand hover:text-brand">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" /></svg>
            </button>
            <button onClick={() => scroll(1)} aria-label={pick(locale, "التالي", "Next")} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-white shadow-sm transition-colors hover:bg-brand-dark">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" /></svg>
            </button>
          </div>
        </div>

        {/* Horizontal RTL carousel */}
        <div ref={trackRef} className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2">
          {stories.map((s) => (
            <div key={s.name} className="w-[82vw] shrink-0 snap-start sm:w-[48%] lg:w-[31%]">
              <Story s={s} locale={locale} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
