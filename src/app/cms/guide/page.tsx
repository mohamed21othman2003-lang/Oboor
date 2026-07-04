"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useCmsLang } from "@/lib/cms/i18n";
import { GUIDE, type GuideShot, type GuideSection } from "@/lib/cms/guideContent";

// أيقونة لكل جزء رئيسي في الفهرس
const I = (d: React.ReactNode) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{d}</svg>;
const PART_ICON: Record<string, React.ReactNode> = {
  basics: I(<path d="m5 3 14 9-14 9V3z" />),
  content: I(<><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" /></>),
  site: I(<><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" /></>),
  recipes: I(<><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></>),
  help: I(<><circle cx="12" cy="12" r="9" /><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01" /></>),
};

// نصّ قابل للبحث داخل قسم (باللغة الحالية)
function sectionText(s: GuideSection, en: boolean): string {
  const parts: string[] = [en ? s.title_en : s.title_ar, (en ? s.intro_en : s.intro_ar) || ""];
  (s.steps || []).forEach((st) => parts.push(en ? st.en : st.ar));
  (s.faq || []).forEach((f) => parts.push(en ? `${f.q_en} ${f.a_en}` : `${f.q_ar} ${f.a_ar}`));
  (s.glossary || []).forEach((g) => parts.push(en ? `${g.term_en} ${g.def_en}` : `${g.term_ar} ${g.def_ar}`));
  return parts.join(" ").toLowerCase();
}

export default function GuidePage() {
  const { lang, dir, setLang } = useCmsLang();
  const en = lang === "en";
  const t = (ar: string, e: string) => (en ? e : ar);
  const [active, setActive] = useState("");
  const [progress, setProgress] = useState(0);
  const [query, setQuery] = useState("");
  const [zoom, setZoom] = useState<string | null>(null);
  const [copied, setCopied] = useState("");
  const [today, setToday] = useState("");

  // تصفية الأقسام حسب البحث
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return GUIDE;
    return GUIDE
      .map((part) => ({ ...part, sections: part.sections.filter((s) => sectionText(s, en).includes(q)) }))
      .filter((part) => part.sections.length > 0);
  }, [query, en]);

  // قائمة مسطّحة للأقسام الظاهرة (لأزرار التالي/السابق)
  const flat = useMemo(() => filtered.flatMap((p) => p.sections.map((s) => ({ id: s.id, ar: s.title_ar, en: s.title_en }))), [filtered]);

  // تتبّع القسم الظاهر + شريط التقدّم (يعاد عند تغيّر التصفية)
  useEffect(() => {
    const ids = filtered.flatMap((p) => p.sections.map((s) => s.id));
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-20% 0px -75% 0px" }
    );
    ids.forEach((id) => { const el = document.getElementById(id); if (el) obs.observe(el); });
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? Math.min(100, (h.scrollTop / max) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { obs.disconnect(); window.removeEventListener("scroll", onScroll); };
  }, [filtered]);

  // تاريخ الطباعة (بعد التحميل لتفادي اختلاف الترطيب)
  useEffect(() => {
    setToday(new Date().toLocaleDateString(en ? "en-GB" : "ar-EG", { year: "numeric", month: "long", day: "numeric" }));
  }, [en]);

  // إغلاق التكبير بمفتاح Esc
  useEffect(() => {
    if (!zoom) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setZoom(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoom]);

  const shotSrc = (s: GuideShot) => `/guide/${lang}/${s.area}/${s.name}.png`;
  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  const copyLink = (id: string) => {
    try { navigator.clipboard?.writeText(`${location.origin}${location.pathname}#${id}`); setCopied(id); setTimeout(() => setCopied(""), 1500); } catch {}
  };
  const totalSections = GUIDE.reduce((n, p) => n + p.sections.length, 0);

  return (
    <div dir={dir} className="min-h-screen bg-[#f4f9fa] text-ink">
      {/* غلاف الطباعة (يظهر عند PDF فقط) */}
      <div className="guide-cover hidden">
        <Image src="/logo.png" alt="عبور" width={160} height={104} className="mx-auto h-16 w-auto object-contain" />
        <h1 className="mt-8 text-3xl font-extrabold text-[#0F6C73]">{t("دليل الاستخدام الشامل", "The Complete User Guide")}</h1>
        <p className="mt-2 text-ink-soft">{t("لوحة تحكّم مركز عبور للرعاية والتأهيل", "Oboor Center Control Panel")}</p>
        {today && <p className="mt-6 text-sm text-ink-soft">{t("تاريخ الإصدار:", "Issued:")} {today}</p>}
      </div>

      {/* شريط علوي مستقل + شريط تقدّم القراءة */}
      <header className="guide-chrome sticky top-0 z-30 border-b border-[#e6eff0] bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="عبور" width={120} height={78} className="h-9 w-auto object-contain" priority />
            <div className="hidden border-s border-[#e6eff0] ps-3 sm:block">
              <p className="text-sm font-extrabold leading-tight text-[#0F6C73]">{t("دليل الاستخدام", "User Guide")}</p>
              <p className="text-[11px] text-ink-soft">{t("لوحة تحكّم مركز عبور", "Oboor Center Control Panel")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/cms" target="_blank" rel="noopener" className="hidden items-center gap-1.5 rounded-xl bg-[#1FA6A8] px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-[#0F6C73] sm:inline-flex">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v18" /></svg>
              {t("فتح لوحة التحكّم", "Open control panel")}
            </Link>
            <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-xl border border-[#e6eff0] px-3 py-2 text-xs font-bold text-[#0F6C73] transition-colors hover:bg-[#1FA6A8]/10">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z" /></svg>
              {t("طباعة / PDF", "Print / PDF")}
            </button>
            <button onClick={() => setLang(en ? "ar" : "en")} className="inline-flex items-center gap-1.5 rounded-xl border border-[#e6eff0] px-3 py-2 text-xs font-bold text-[#0F6C73] transition-colors hover:bg-[#1FA6A8]/10" title={t("English", "العربية")}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" /></svg>
              {en ? "العربية" : "EN"}
            </button>
          </div>
        </div>
        <div className="h-0.5 w-full bg-transparent">
          <div className="h-full bg-gradient-to-r from-[#1FA6A8] to-[#0F6C73] transition-[width] duration-150" style={{ width: `${progress}%` }} />
        </div>
      </header>

      {/* هيرو */}
      <section className="guide-hero relative overflow-hidden bg-gradient-to-br from-[#0F6C73] via-[#137e86] to-[#1FA6A8] text-white">
        <div aria-hidden className="pointer-events-none absolute -top-16 end-[-40px] h-72 w-72 rounded-full bg-white/10" />
        <div aria-hidden className="pointer-events-none absolute bottom-[-60px] start-10 h-52 w-52 rounded-full bg-white/5" />
        <div className="relative mx-auto max-w-[1400px] px-4 py-12 sm:px-6 sm:py-16">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold ring-1 ring-white/20">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
            {t("دليل تشغيل لوحة التحكّم", "Control-Panel Operating Guide")}
          </span>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">{t("دليل الاستخدام الشامل", "The Complete User Guide")}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/85 sm:text-base">
            {t("كل ما تحتاجه لإدارة الموقع من لوحة التحكّم — شرح مفصّل بالصور لكل شاشة وكل نوع من عناصر المحتوى (العناوين، النصوص، الأيقونات، الصور، الكروت، الأرقام…)، ومهام شائعة وأسئلة متكرّرة. افتح هذه الصفحة بجانب لوحة التحكّم وامشِ على الخطوات.",
               "Everything you need to run the site from the control panel — detailed, illustrated walkthroughs of every screen and content element (titles, text, icons, images, cards, numbers…), plus common tasks and FAQs. Open this beside the control panel and follow along.")}
          </p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            {[
              t(`${GUIDE.length} أقسام رئيسية`, `${GUIDE.length} main parts`),
              t(`${totalSections} موضوعًا`, `${totalSections} topics`),
              t("شرح بالصور خطوة بخطوة", "Step-by-step screenshots"),
              t("عربي / إنجليزي", "Arabic / English"),
            ].map((c) => (
              <span key={c} className="inline-flex items-center gap-1.5 rounded-lg bg-white/12 px-3 py-1.5 text-xs font-semibold ring-1 ring-white/15">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
          {/* الفهرس الجانبي + البحث */}
          <nav className="guide-toc lg:sticky lg:top-24 lg:w-80 lg:shrink-0">
            <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#e6eff0] lg:flex lg:max-h-[calc(100vh-7rem)] lg:flex-col">
              <div className="mb-3 flex shrink-0 items-center gap-2 rounded-xl border border-[#e6eff0] bg-[#f7fafa] px-3 py-2">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#0F6C73]/50"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("ابحث في الدليل…", "Search the guide…")} className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-[#0F6C73]/40" />
                {query && <button onClick={() => setQuery("")} className="text-ink-soft hover:text-ink" aria-label={t("مسح", "Clear")}>✕</button>}
              </div>
              <div className="lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pe-1">
              {filtered.map((part) => (
                <div key={part.id} className="mb-4 last:mb-0">
                  <p className="mb-1.5 flex items-center gap-2 px-1 text-xs font-extrabold text-[#0F6C73]">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#1FA6A8]/12 text-[#1FA6A8]">{PART_ICON[part.id]}</span>
                    {en ? part.title_en : part.title_ar}
                  </p>
                  <ul className="space-y-0.5 border-s border-[#eef4f5] ps-2">
                    {part.sections.map((s) => {
                      const on = active === s.id;
                      return (
                        <li key={s.id}>
                          <button onClick={() => go(s.id)} className={`relative w-full rounded-lg px-3 py-1.5 text-start text-[13px] transition-colors ${on ? "bg-[#1FA6A8]/12 font-bold text-[#0F6C73]" : "text-ink-soft hover:bg-[#1FA6A8]/8 hover:text-[#0F6C73]"}`}>
                            {on && <span className="absolute inset-y-1.5 start-0 w-[3px] rounded-full bg-[#1FA6A8]" />}
                            {en ? s.title_en : s.title_ar}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
              {filtered.length === 0 && <p className="px-1 text-xs text-ink-soft">{t(`لا نتائج لـ«${query}»`, `No results for "${query}"`)}</p>}
              </div>
            </div>
          </nav>

          {/* المحتوى */}
          <div className="min-w-0 flex-1 space-y-14">
            {filtered.length === 0 && (
              <div className="rounded-2xl border border-dashed border-[#e6eff0] bg-white p-10 text-center text-ink-soft">
                {t("لا توجد نتائج مطابقة لبحثك.", "No results match your search.")}
              </div>
            )}
            {filtered.map((part) => (
              <section key={part.id} className="space-y-8">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#0F6C73] to-[#1FA6A8] text-white shadow-sm">{PART_ICON[part.id]}</span>
                  <h2 className="text-lg font-extrabold text-[#0F6C73]">{en ? part.title_en : part.title_ar}</h2>
                  <span className="h-px flex-1 bg-gradient-to-r from-[#e6eff0] to-transparent" />
                </div>

                {part.sections.map((s, si) => {
                  const idx = flat.findIndex((f) => f.id === s.id);
                  const prev = idx > 0 ? flat[idx - 1] : null;
                  const next = idx >= 0 && idx < flat.length - 1 ? flat[idx + 1] : null;
                  return (
                    <article key={s.id} id={s.id} className="scroll-mt-28">
                      <h3 className="group/h flex items-center gap-3 text-xl font-extrabold text-ink">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1FA6A8] to-[#0F6C73] text-sm font-bold text-white shadow-sm">{si + 1}</span>
                        {en ? s.title_en : s.title_ar}
                        <button onClick={() => copyLink(s.id)} title={t("نسخ رابط القسم", "Copy section link")} className="no-print text-ink-soft opacity-0 transition-opacity hover:text-[#1FA6A8] group-hover/h:opacity-100">
                          {copied === s.id
                            ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                            : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" /></svg>}
                        </button>
                      </h3>
                      {(s.intro_ar || s.intro_en) && (
                        <p className="mt-2 ps-11 text-sm leading-7 text-ink-muted">{en ? s.intro_en : s.intro_ar}</p>
                      )}

                      {/* خطوات */}
                      {s.steps && s.steps.length > 0 && (
                        <ol className="mt-4 space-y-5">
                          {s.steps.map((step, i) => (
                            <li key={i} className="group rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#e6eff0] transition-all hover:shadow-md hover:ring-[#1FA6A8]/30 sm:p-5">
                              <div className="flex gap-3">
                                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1FA6A8]/12 text-xs font-bold text-[#0F6C73]">{i + 1}</span>
                                <p className="text-sm leading-7 text-ink">{en ? step.en : step.ar}</p>
                              </div>
                              {step.shot && (
                                <figure className="mt-4 overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-[#e6eff0]">
                                  <div className="flex items-center gap-2 border-b border-[#eef4f5] bg-[#f7fafa] px-3 py-2">
                                    <span className="flex gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" /><span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" /><span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" /></span>
                                    <span className="ms-2 truncate rounded-md bg-white px-2 py-0.5 text-[10px] font-medium text-ink-soft ring-1 ring-[#e6eff0]">{step.shot.area === "cms" ? "/cms" : t("الموقع", "site")}</span>
                                    <span className="no-print ms-auto text-[10px] text-ink-soft">{t("اضغط للتكبير", "click to zoom")}</span>
                                  </div>
                                  <button type="button" onClick={() => setZoom(shotSrc(step.shot!))} className="block w-full cursor-zoom-in">
                                    <Image src={shotSrc(step.shot)} alt={(en ? step.en : step.ar).slice(0, 80)} width={1440} height={960} className="h-auto w-full" />
                                  </button>
                                  {(step.shot.caption_ar || step.shot.caption_en) && (
                                    <figcaption className="bg-[#f7fafa] px-3 py-2 text-xs text-ink-soft">{en ? step.shot.caption_en : step.shot.caption_ar}</figcaption>
                                  )}
                                </figure>
                              )}
                            </li>
                          ))}
                        </ol>
                      )}

                      {/* أسئلة شائعة */}
                      {s.faq && (
                        <div className="mt-4 space-y-3">
                          {s.faq.map((f, i) => (
                            <details key={i} className="guide-faq group rounded-2xl bg-white shadow-sm ring-1 ring-[#e6eff0] transition-shadow open:shadow-md">
                              <summary className="flex cursor-pointer list-none items-center gap-3 p-4 text-sm font-bold text-ink">
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#1FA6A8]/12 text-xs font-extrabold text-[#0F6C73]">؟</span>
                                <span className="flex-1">{en ? f.q_en : f.q_ar}</span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-ink-soft transition-transform group-open:rotate-180"><path d="M6 9l6 6 6-6" /></svg>
                              </summary>
                              <p className="border-t border-[#eef4f5] px-4 py-3 pe-4 ps-[52px] text-sm leading-7 text-ink-muted">{en ? f.a_en : f.a_ar}</p>
                            </details>
                          ))}
                        </div>
                      )}

                      {/* مسرد */}
                      {s.glossary && (
                        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                          {s.glossary.map((g, i) => (
                            <div key={i} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#e6eff0]">
                              <dt className="flex items-center gap-2 text-sm font-extrabold text-[#0F6C73]">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#1FA6A8]" />
                                {en ? g.term_en : g.term_ar}
                              </dt>
                              <dd className="mt-1.5 text-sm leading-7 text-ink-muted">{en ? g.def_en : g.def_ar}</dd>
                            </div>
                          ))}
                        </dl>
                      )}

                      {/* التالي / السابق */}
                      {(prev || next) && (
                        <div className="no-print mt-6 flex items-center justify-between gap-3 text-xs">
                          {prev ? (
                            <button onClick={() => go(prev.id)} className="inline-flex max-w-[45%] items-center gap-1.5 rounded-xl border border-[#e6eff0] bg-white px-3 py-2 font-semibold text-[#0F6C73] transition-colors hover:bg-[#1FA6A8]/10">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={en ? "" : "-scale-x-100"}><path d="M15 18l-6-6 6-6" /></svg>
                              <span className="truncate">{en ? prev.en : prev.ar}</span>
                            </button>
                          ) : <span />}
                          {next ? (
                            <button onClick={() => go(next.id)} className="inline-flex max-w-[45%] items-center gap-1.5 rounded-xl border border-[#e6eff0] bg-white px-3 py-2 font-semibold text-[#0F6C73] transition-colors hover:bg-[#1FA6A8]/10">
                              <span className="truncate">{en ? next.en : next.ar}</span>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={en ? "" : "-scale-x-100"}><path d="M9 18l6-6-6-6" /></svg>
                            </button>
                          ) : <span />}
                        </div>
                      )}
                    </article>
                  );
                })}
              </section>
            ))}

            {!query && (
              <div className="rounded-2xl bg-gradient-to-br from-[#0F6C73] to-[#1FA6A8] px-6 py-8 text-center text-white shadow-sm">
                <p className="text-base font-extrabold">{t("جاهز للبدء؟", "Ready to start?")}</p>
                <p className="mt-1 text-sm text-white/85">{t("افتح لوحة التحكّم بجانب هذا الدليل وابدأ إدارة موقعك بثقة.", "Open the control panel beside this guide and start managing your site with confidence.")}</p>
                <Link href="/cms" target="_blank" rel="noopener" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-[#0F6C73] transition-transform hover:scale-[1.02]">
                  {t("فتح لوحة التحكّم", "Open the control panel")}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* زر العودة لأعلى */}
      {progress > 8 && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="no-print fixed bottom-6 end-6 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-[#0F6C73] text-white shadow-lg transition-colors hover:bg-[#1FA6A8]" aria-label={t("العودة لأعلى", "Back to top")}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6" /></svg>
        </button>
      )}

      {/* تكبير الصورة (Lightbox) */}
      {zoom && (
        <div onClick={() => setZoom(null)} className="no-print fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
          <button onClick={() => setZoom(null)} className="absolute end-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25" aria-label={t("إغلاق", "Close")}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={zoom} alt="" onClick={(e) => e.stopPropagation()} className="max-h-[92vh] max-w-[95vw] rounded-xl shadow-2xl ring-1 ring-white/10" />
        </div>
      )}
    </div>
  );
}
