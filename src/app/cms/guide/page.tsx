"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useCmsLang } from "@/lib/cms/i18n";
import { GUIDE, type GuideShot } from "@/lib/cms/guideContent";

export default function GuidePage() {
  const { lang, dir, setLang } = useCmsLang();
  const en = lang === "en";
  const t = (ar: string, e: string) => (en ? e : ar);
  const [active, setActive] = useState("");

  // تتبّع القسم الظاهر لتظليله في الفهرس
  useEffect(() => {
    const ids = GUIDE.flatMap((p) => p.sections.map((s) => s.id));
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-15% 0px -75% 0px" }
    );
    ids.forEach((id) => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  const shotSrc = (s: GuideShot) => `/guide/${lang}/${s.area}/${s.name}.png`;
  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div dir={dir} className="min-h-screen bg-[#F7FAFA] text-ink">
      {/* شريط علوي مستقل (الصفحة تُفتح في تاب منفصلة) */}
      <header className="sticky top-0 z-30 border-b border-[#e6eff0] bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="عبور" width={120} height={78} className="h-9 w-auto object-contain" priority />
            <div className="hidden border-s border-[#e6eff0] ps-3 sm:block">
              <p className="text-sm font-extrabold leading-tight text-[#0F6C73]">{t("دليل الاستخدام", "User Guide")}</p>
              <p className="text-[11px] text-ink-soft">{t("لوحة تحكّم مركز عبور", "Oboor Center Control Panel")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-xl border border-[#e6eff0] px-3 py-2 text-xs font-bold text-[#0F6C73] transition-colors hover:bg-[#1FA6A8]/10"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z" /></svg>
              {t("طباعة / PDF", "Print / PDF")}
            </button>
            <button
              onClick={() => setLang(en ? "ar" : "en")}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#e6eff0] px-3 py-2 text-xs font-bold text-[#0F6C73] transition-colors hover:bg-[#1FA6A8]/10"
              title={t("English", "العربية")}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" /></svg>
              {en ? "العربية" : "EN"}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* مقدمة */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-ink sm:text-3xl">{t("دليل الاستخدام الشامل", "Complete User Guide")}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-ink-soft">
            {t("كل ما تحتاجه لإدارة الموقع من لوحة التحكّم — شرح مفصّل بالصور لكل شاشة وكل نوع من عناصر المحتوى (العناوين، النصوص، الأيقونات، الصور، الكروت، الأرقام…)، وأين تُدار كل صفحة من صفحات الموقع. افتح هذه الصفحة بجانب لوحة التحكّم وامشِ على الخطوات.",
               "Everything you need to run the site from the control panel — detailed, illustrated walkthroughs of every screen and every content element type (titles, text, icons, images, cards, numbers…), plus where each site page is managed. Open this page next to the control panel and follow along.")}
          </p>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          {/* الفهرس الجانبي */}
          <nav className="lg:sticky lg:top-24 lg:w-64 lg:shrink-0">
            <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#e6eff0]">
              {GUIDE.map((part) => (
                <div key={part.id} className="mb-4 last:mb-0">
                  <p className="mb-2 px-1 text-[11px] font-bold uppercase tracking-wide text-[#0F6C73]/50">{en ? part.title_en : part.title_ar}</p>
                  <ul className="space-y-0.5">
                    {part.sections.map((s) => {
                      const on = active === s.id;
                      return (
                        <li key={s.id}>
                          <button
                            onClick={() => go(s.id)}
                            className={`w-full rounded-lg px-3 py-1.5 text-start text-[13px] transition-colors ${on ? "bg-[#1FA6A8]/12 font-bold text-[#0F6C73]" : "text-ink-soft hover:bg-[#1FA6A8]/8 hover:text-[#0F6C73]"}`}
                          >
                            {en ? s.title_en : s.title_ar}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </nav>

          {/* المحتوى */}
          <div className="min-w-0 flex-1 space-y-12">
            {GUIDE.map((part) => (
              <section key={part.id} className="space-y-8">
                <div className="border-b border-[#e6eff0] pb-2">
                  <span className="text-xs font-bold uppercase tracking-wide text-[#1FA6A8]">{en ? part.title_en : part.title_ar}</span>
                </div>
                {part.sections.map((s, si) => (
                  <article key={s.id} id={s.id} className="scroll-mt-28">
                    <h2 className="flex items-center gap-2.5 text-xl font-extrabold text-ink">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#1FA6A8]/12 text-sm font-bold text-[#0F6C73]">{si + 1}</span>
                      {en ? s.title_en : s.title_ar}
                    </h2>
                    {(s.intro_ar || s.intro_en) && (
                      <p className="mt-2 text-sm leading-7 text-ink-muted">{en ? s.intro_en : s.intro_ar}</p>
                    )}
                    <ol className="mt-4 space-y-5">
                      {s.steps.map((step, i) => (
                        <li key={i} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#e6eff0] sm:p-5">
                          <div className="flex gap-3">
                            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1FA6A8] text-xs font-bold text-white">{i + 1}</span>
                            <p className="text-sm leading-7 text-ink">{en ? step.en : step.ar}</p>
                          </div>
                          {step.shot && (
                            <figure className="mt-3 overflow-hidden rounded-xl border border-[#e6eff0]">
                              <Image
                                src={shotSrc(step.shot)}
                                alt={(en ? step.en : step.ar).slice(0, 80)}
                                width={1440}
                                height={960}
                                className="h-auto w-full"
                              />
                              {(step.shot.caption_ar || step.shot.caption_en) && (
                                <figcaption className="bg-[#F7FAFA] px-3 py-2 text-xs text-ink-soft">{en ? step.shot.caption_en : step.shot.caption_ar}</figcaption>
                              )}
                            </figure>
                          )}
                        </li>
                      ))}
                    </ol>
                  </article>
                ))}
              </section>
            ))}

            <p className="border-t border-[#e6eff0] pt-6 text-center text-xs text-ink-soft">
              {t("لأي استفسار إضافي حول لوحة التحكّم، تواصل مع فريق الدعم التقني.", "For any further questions about the control panel, contact the technical support team.")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
