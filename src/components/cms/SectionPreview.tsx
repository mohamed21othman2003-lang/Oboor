"use client";

import { CMS_ICONS } from "@/lib/cms/icons";

// معاينات حيّة لأقسام الصفحة داخل الـCMS — تعرض السكشن «كما يظهر على الموقع» بشكله
// الحقيقي (كل العناصر مع بعض)، وتتحدّث لحظياً مع كل حرف قبل الحفظ.

function highlight(text: string, cls = "text-brand") {
  const parts = text.split("**");
  return parts.map((p, i) => (i % 2 === 1 ? <span key={i} className={cls}>{p}</span> : <span key={i}>{p}</span>));
}

export type Badge = { label: string; value: string };
export type PItem = {
  tagline: string; title: string; text: string; value: string;
  icon: string; image: string; bullets: string[]; badges: Badge[];
};

// ===== قسم التواصل السفلي (CTA) =====
function CtaCard({ lang, it }: { lang: "ar" | "en"; it: PItem }) {
  const en = lang === "en";
  const badge = it.tagline || (en ? "Customer service available around the clock" : "خدمة العملاء متاحة على مدار الساعة");
  return (
    <div dir={en ? "ltr" : "rtl"} className="overflow-hidden rounded-xl bg-gradient-to-br from-[#0e4048] via-[#1a6c75] to-[#0e4048] px-4 py-6 text-center">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-white/90">
        <span className="h-1.5 w-1.5 rounded-full bg-success" />{badge}
      </span>
      <h4 className="mt-3 text-lg font-extrabold leading-snug text-white">
        {it.title ? highlight(it.title, "text-emerald-300") : <span className="text-white/40">{en ? "CTA heading" : "عنوان الـCTA"}</span>}
      </h4>
      <p className="mx-auto mt-2 max-w-md text-[11px] leading-5 text-white/75">{it.text}</p>
      {it.bullets.length > 0 && (
        <div className="mx-auto mt-3 grid w-fit grid-cols-2 gap-x-5 gap-y-1.5 text-start">
          {it.bullets.map((b, i) => <span key={i} className="flex items-center gap-1.5 text-[11px] text-white/85"><span className="h-1 w-1 rounded-full bg-success" />{b}</span>)}
        </div>
      )}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <span className="rounded-lg bg-brand px-3 py-1.5 text-[11px] font-semibold text-white">{en ? "Apply Now" : "طلب التحاق"}</span>
        <span className="rounded-lg bg-[#2ba73e] px-3 py-1.5 text-[11px] font-semibold text-white">{en ? "WhatsApp" : "واتساب"}</span>
        <span className="rounded-lg bg-white px-3 py-1.5 text-[11px] font-semibold text-ink">{en ? "Nearest Branch" : "أقرب فرع"}</span>
      </div>
    </div>
  );
}

// ===== شريط تبويبات/تصنيفات (news categories, programs tabs) =====
function TabsBar({ lang, items }: { lang: "ar" | "en"; items: PItem[] }) {
  return (
    <div dir={lang === "en" ? "ltr" : "rtl"} className="rounded-xl bg-white p-4 text-start shadow-sm ring-1 ring-line">
      <div className="flex flex-wrap gap-2">
        {items.map((it, i) => (
          <span key={i} className={`rounded-full px-4 py-1.5 text-[12px] font-bold ${i === 0 ? "bg-brand text-white" : "border border-line bg-white text-ink-soft"}`}>
            {it.title || "—"}
          </span>
        ))}
      </div>
    </div>
  );
}

// ===== شبكة كروت المميزات (أبيض + أيقونة) =====
function FeatureGrid({ lang, items }: { lang: "ar" | "en"; items: PItem[] }) {
  return (
    <div dir={lang === "en" ? "ltr" : "rtl"} className="grid gap-3 rounded-xl bg-surface/40 p-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((it, i) => (
        <div key={i} className="rounded-2xl border border-line bg-white p-4 text-center shadow-sm">
          <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-brand/10 text-brand">{CMS_ICONS[it.icon] ?? CMS_ICONS.star}</span>
          <h4 className="mt-2 text-sm font-bold text-ink">{it.title || "—"}</h4>
          <p className="mt-1 text-[11px] leading-5 text-ink-muted">{it.text}</p>
        </div>
      ))}
    </div>
  );
}

// ===== كروت الانضمام (Teal) =====
function JoinGrid({ lang, items }: { lang: "ar" | "en"; items: PItem[] }) {
  return (
    <div dir={lang === "en" ? "ltr" : "rtl"} className="grid gap-3 rounded-xl bg-[#f3f9f9] p-4 sm:grid-cols-2">
      {items.map((it, i) => (
        <div key={i} className="flex flex-col items-center rounded-2xl bg-brand p-4 text-center text-white shadow-sm">
          <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#e8f7f9] text-brand">{CMS_ICONS[it.icon] ?? CMS_ICONS.growth}</span>
          <h4 className="mt-2 text-[14px] font-bold">{it.title || "—"}</h4>
          <p className="mt-1 text-[12px] leading-5 text-white/90">{it.text}</p>
        </div>
      ))}
    </div>
  );
}

// ===== صف الأرقام =====
function StatsRow({ lang, items }: { lang: "ar" | "en"; items: PItem[] }) {
  const nums = items.filter((it) => String(it.value ?? "").trim() !== "" || (!it.text && !it.bullets.length));
  return (
    <div dir={lang === "en" ? "ltr" : "rtl"} className="flex flex-wrap items-center justify-center gap-6 rounded-xl bg-white p-5 shadow-sm ring-1 ring-line">
      {nums.map((it, i) => (
        <div key={i} className="flex items-center gap-3">
          {it.icon && <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand/10 text-brand">{CMS_ICONS[it.icon]}</span>}
          <div className="text-start">
            <p className="text-2xl font-extrabold text-brand" dir="ltr">{it.value || "0"}</p>
            <p className="text-[11px] text-ink-muted">{it.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ===== الخطوات المرقّمة =====
function StepsRow({ lang, items }: { lang: "ar" | "en"; items: PItem[] }) {
  return (
    <div dir={lang === "en" ? "ltr" : "rtl"} className="grid gap-3 rounded-xl bg-[#0e3a41] p-5 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((it, i) => (
        <div key={i} className="text-center">
          <span className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand text-white">
            {CMS_ICONS[it.icon] ?? CMS_ICONS.star}
            <span className="absolute -end-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-brand">{items.length - i}</span>
          </span>
          <h4 className="mt-2 text-[13px] font-bold text-white">{it.title || "—"}</h4>
          <p className="mt-1 text-[11px] leading-5 text-white/70">{it.text}</p>
        </div>
      ))}
    </div>
  );
}

// ===== شبكة صور المعرض =====
function GalleryGrid({ items }: { items: PItem[] }) {
  const imgs = items.filter((it) => it.image);
  if (!imgs.length) return null;
  return (
    <div className="grid grid-cols-3 gap-2 rounded-xl bg-surface/40 p-3">
      {imgs.map((it, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={i} src={it.image} alt="" className="h-24 w-full rounded-lg object-contain bg-surface ring-1 ring-line" />
      ))}
    </div>
  );
}

// ===== ترويسة قسم عامة (سطر علوي + عنوان + نص + صورة + نقاط + بادچات) =====
function HeadingCard({ lang, it, itemKey }: { lang: "ar" | "en"; it: PItem; itemKey?: string }) {
  const en = lang === "en";
  // نصّ الأقسام العامة يُخزَّن في text (أسطر) أو data (قائمة فقرات) — نعرضهما كفقرات عادية مثل الموقع
  const paragraphs = [
    ...(it.text ? it.text.split("\n").filter((p) => p.trim() !== "") : []),
    ...it.bullets.filter((b) => b.trim() !== ""),
  ];
  const isPill = itemKey === "badge" && it.title && !it.text && !it.image && it.bullets.length === 0;
  if (isPill) {
    return (
      <div dir={en ? "ltr" : "rtl"} className="rounded-xl bg-white p-4 text-center shadow-sm ring-1 ring-line">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-4 py-1.5 text-xs font-bold text-brand-dark"><span className="h-1.5 w-1.5 rounded-full bg-success" />{it.title}</span>
      </div>
    );
  }
  // السطر العلوي بشكل الخط (— نص) زي TagLine بالموقع
  const eyebrow = it.tagline ? <span className="flex items-center gap-2 text-[11px] font-bold text-brand"><span className="h-px w-5 shrink-0 bg-brand" />{it.tagline}</span> : null;
  const heading = it.title ? <h4 className="mt-2 text-xl font-extrabold leading-snug text-ink">{highlight(it.title)}</h4> : null;
  const paras = paragraphs.map((p, i) => <p key={i} className="mt-2 text-[12px] leading-6 text-ink-muted">{p}</p>);

  // فيه صورة ⇒ عمودين (نص + صورة) زي أقسام «عن عبور»؛ من غير صورة ⇒ عمود واحد
  if (it.image) {
    return (
      <div dir={en ? "ltr" : "rtl"} className="grid items-center gap-4 rounded-xl bg-white p-4 text-start shadow-sm ring-1 ring-line sm:grid-cols-2">
        <div>{eyebrow}{heading}{paras}</div>
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={it.image} alt="" className="h-44 w-full rounded-2xl object-contain bg-surface" />
          {it.badges.map((bd, i) => (
            <span key={i} className={`absolute rounded-xl bg-white/95 px-2 py-1 text-[10px] font-semibold shadow-sm ${i === 0 ? "end-2 top-2" : "start-2 bottom-2"}`}>{bd.value && <span className="text-brand">{bd.value} </span>}{bd.label}</span>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div dir={en ? "ltr" : "rtl"} className="rounded-xl bg-white p-4 text-start shadow-sm ring-1 ring-line">
      {eyebrow}{heading}{paras}
      {it.badges.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {it.badges.map((bd, i) => <span key={i} className="rounded-lg bg-brand/5 px-2.5 py-1 text-[11px] font-semibold text-ink ring-1 ring-line">{bd.value && <span className="text-brand">{bd.value} </span>}{bd.label}</span>)}
        </div>
      )}
    </div>
  );
}

// ===== كارت CTA السفلي في صفحة «عن عبور» — كارت أفقي فاتح بأيقونة دبوس (يطابق الموقع) =====
function AboutCta({ lang, it }: { lang: "ar" | "en"; it: PItem }) {
  const en = lang === "en";
  return (
    <div dir={en ? "ltr" : "rtl"} className="flex flex-col items-center justify-between gap-4 rounded-2xl bg-[#e8f7f9] p-5 sm:flex-row">
      <div className="flex items-center gap-3 text-start">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand text-white">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
        </span>
        <div>
          <p className="text-sm font-bold text-ink">{it.title || (en ? "Heading" : "العنوان")}</p>
          {it.text && <p className="mt-0.5 text-[12px] text-ink-muted">{it.text}</p>}
        </div>
      </div>
      <span className="flex shrink-0 items-center gap-1.5 rounded-xl bg-brand px-4 py-2 text-[12px] font-semibold text-white">{en ? "Take the Step to Oboor" : "خذ الخطوة لعبور"}</span>
    </div>
  );
}

// ===== هيرو صفحة «عن عبور» — عمودين: نص (سطر علوي + عنوان + فقرة) + صورة بشارتين =====
function AboutHero({ lang, it }: { lang: "ar" | "en"; it: PItem }) {
  const en = lang === "en";
  return (
    <div dir={en ? "ltr" : "rtl"} className="grid items-center gap-4 rounded-xl bg-gradient-to-b from-[#ebf7f9] to-white p-4 shadow-sm ring-1 ring-line sm:grid-cols-2">
      <div className="text-start">
        {it.title && <p className="flex items-center gap-2 text-[11px] font-bold text-brand"><span className="h-px w-5 shrink-0 bg-brand" />{it.title}</p>}
        <h4 className="mt-2 text-2xl font-extrabold text-brand">{en ? "About Oboor" : "عن عبور"}</h4>
        {it.text && <p className="mt-2 text-[12px] leading-6 text-ink-muted">{it.text}</p>}
      </div>
      <div className="relative">
        {it.image
          ? (/* eslint-disable-next-line @next/next/no-img-element */ <img src={it.image} alt="" className="h-44 w-full rounded-2xl object-contain bg-surface" />)
          : <div className="h-44 w-full rounded-2xl bg-brand/20" />}
        {it.badges.map((bd, i) => (
          <span key={i} className={`absolute rounded-xl bg-white px-2.5 py-1.5 text-[10px] shadow ${i === 0 ? "end-2 top-2" : "start-2 top-1/2"}`}>
            {bd.label && <span className="block text-[9px] text-ink-soft">{bd.label}</span>}
            <b className="text-ink">{bd.value}</b>
          </span>
        ))}
      </div>
    </div>
  );
}

// ===== كارت «رسالتنا» في عن عبور — كارت غامق بأيقونة هدف + زر =====
function MissionCard({ lang, it }: { lang: "ar" | "en"; it: PItem }) {
  const en = lang === "en";
  return (
    <div dir={en ? "ltr" : "rtl"} className="rounded-3xl bg-gradient-to-bl from-brand-deep to-[#0a2329] p-5 text-start text-white">
      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand/20 text-brand"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" /></svg></span>
      <p className="mt-3 text-[12px] text-brand">{en ? "Our Mission" : "رسالتنا"}</p>
      <h4 className="mt-1 text-base font-extrabold">{it.title || "—"}</h4>
      {it.text && <p className="mt-2 text-[12px] leading-6 text-white/75">{it.text}</p>}
      <span className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2 text-[12px] font-semibold text-white">{en ? "View Services" : "عرض الخدمات"}</span>
    </div>
  );
}

// ===== كارت «رؤيتنا» في عن عبور — كارت فاتح بأيقونة عين =====
function VisionCard({ lang, it }: { lang: "ar" | "en"; it: PItem }) {
  const en = lang === "en";
  return (
    <div dir={en ? "ltr" : "rtl"} className="rounded-3xl bg-[#e8f7f9] p-5 text-start">
      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-brand shadow-sm"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></svg></span>
      <p className="mt-3 text-[12px] text-brand-dark">{en ? "Our Vision" : "رؤيتنا"}</p>
      <h4 className="mt-1 text-base font-extrabold text-ink">{it.title || "—"}</h4>
      {it.text && <p className="mt-2 text-[12px] leading-6 text-ink-muted">{it.text}</p>}
    </div>
  );
}

// ===== قسم «نبذة عن البرامج» في عن عبور — عنوان + كروت (أيقونة + عنوان + وصف) =====
function AboutPrograms({ lang, items, itemKeys }: { lang: "ar" | "en"; items: PItem[]; itemKeys?: string[] }) {
  const en = lang === "en";
  const headIdx = (itemKeys ?? []).findIndex((k) => k === "about-programs" || !/prog/.test(k));
  const hi = headIdx < 0 ? 0 : headIdx;
  const head = items[hi];
  const cards = items.filter((_, i) => i !== hi);
  return (
    <div dir={en ? "ltr" : "rtl"} className="rounded-xl bg-white p-4 text-start shadow-sm ring-1 ring-line">
      {head?.title && <h4 className="text-lg font-extrabold text-ink">{highlight(head.title)}</h4>}
      {head?.text && <p className="mt-1 text-[12px] leading-6 text-ink-muted">{head.text}</p>}
      {cards.length > 0 && (
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {cards.map((c, i) => (
            <div key={i} className="flex items-start gap-2 rounded-2xl border border-line bg-white p-3 shadow-sm">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">{CMS_ICONS[c.icon] ?? CMS_ICONS.heart}</span>
              <div><h5 className="text-[13px] font-bold text-ink">{c.title || "—"}</h5>{c.text && <p className="mt-0.5 text-[11px] leading-5 text-ink-muted">{c.text}</p>}</div>
            </div>
          ))}
        </div>
      )}
      {head?.image && (/* eslint-disable-next-line @next/next/no-img-element */ <img src={head.image} alt="" className="mt-3 h-32 w-full rounded-2xl object-contain bg-surface" />)}
    </div>
  );
}

// ===== عناوين أقسام الأخبار (overview) — ترويسة + أيقونة شرارة + عنوان + وصف + «عرض الكل» =====
function OverviewHeads({ lang, items }: { lang: "ar" | "en"; items: PItem[] }) {
  const en = lang === "en";
  return (
    <div dir={en ? "ltr" : "rtl"} className="space-y-4 rounded-xl bg-white p-4 text-start shadow-sm ring-1 ring-line">
      {items.map((it, i) => (
        <div key={i} className="flex flex-wrap items-end justify-between gap-2 border-b border-line pb-3 last:border-0 last:pb-0">
          <div>
            {it.tagline && <span className="inline-flex items-center gap-1.5 text-[12px] font-bold text-brand">{it.tagline}<span className="flex h-5 w-5 items-center justify-center rounded-md bg-brand/10"><svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.2 6.6L21 11l-6.8 2.4L12 20l-2.2-6.6L3 11l6.8-2.4z" /></svg></span></span>}
            <h4 className="mt-1 text-base font-extrabold text-ink">{it.title || "—"}</h4>
            {it.text && <p className="mt-1 text-[11px] leading-5 text-ink-muted">{it.text}</p>}
          </div>
          <span className="flex items-center gap-1 whitespace-nowrap text-[11px] font-semibold text-brand">{en ? "View All" : "عرض الكل"} ›</span>
        </div>
      ))}
    </div>
  );
}

// ===== الموزّع على مستوى البلوك: يعرض السكشن كامل بشكله الحقيقي =====
export function BlockPreview({ block, items, lang, itemKeys, page }: { block: string; items: PItem[]; lang: "ar" | "en"; itemKeys?: string[]; page?: string }) {
  if (!items.length) return null;
  if (block === "overview" && page === "news") return <OverviewHeads lang={lang} items={items} />;
  if (block === "hero" && page === "about") return <AboutHero lang={lang} it={items[0]} />;
  if (block === "mission" && page === "about") return <MissionCard lang={lang} it={items[0]} />;
  if (block === "vision" && page === "about") return <VisionCard lang={lang} it={items[0]} />;
  if (block === "programs" && page === "about") return <AboutPrograms lang={lang} items={items} itemKeys={itemKeys} />;
  if (block === "cta") return page === "about" ? <AboutCta lang={lang} it={items[0]} /> : <CtaCard lang={lang} it={items[0]} />;
  if (block === "categories" || block === "tabs") return <TabsBar lang={lang} items={items} />;
  if (block === "features") return <FeatureGrid lang={lang} items={items} />;
  if (block === "join_cards") return <JoinGrid lang={lang} items={items} />;
  if (block === "stats" || block === "profile_stats") return <StatsRow lang={lang} items={items} />;
  if (block === "steps") return <StepsRow lang={lang} items={items} />;
  if (block === "gallery") return <GalleryGrid items={items} />;
  // عام: كل عنصر ترويسة قسم (غالباً عنصر واحد؛ ولو أكثر تُعرض متتابعة)
  return (
    <div className="space-y-3">
      {items.map((it, i) => <HeadingCard key={i} lang={lang} it={it} itemKey={itemKeys?.[i]} />)}
    </div>
  );
}

// ===== معاينة مجموعة حقول داخل محرّر العنصر — تتكيّف مع نوع المحتوى =====
const EVENT_BASES = ["date", "time", "location", "audience", "seats", "reg_status"];
const EVENT_ICON: Record<string, string> = { date: "calendar", time: "clock", location: "target", audience: "team", seats: "clipboard" };
const LIST_BASES = ["body", "learn", "offers", "targets", "about_list", "target_list", "results", "distinctions", "stations", "training_areas", "journey", "gallery", "service_cards", "philosophy", "accreditations"];

function itemText(it: unknown, en: boolean): string {
  if (typeof it === "string") return it;
  if (it && typeof it === "object") {
    const o = it as Record<string, unknown>;
    const v = (en ? (o.text_en || o.title_en || o.label_en || o.name_en) : 0) || o.text_ar || o.title_ar || o.label_ar || o.name_ar || o.text || o.title || o.label || o.name;
    return typeof v === "string" ? v : "";
  }
  return "";
}

// ===== معاينة أقسام صفحة البرنامج (مطابقة لـ /programs/[slug]) =====
function ProgramGroupPreview({ bases, values, lang }: { bases: string[]; values: Record<string, unknown>; lang: "ar" | "en" }) {
  const en = lang === "en";
  const dir = en ? "ltr" : "rtl";
  const has = (b: string) => bases.includes(b);
  const ps = (base: string) => { const v = en ? (values[`${base}_en`] || values[`${base}_ar`]) : values[`${base}_ar`]; return typeof v === "string" ? v : ""; };
  const pl = (base: string): Record<string, unknown>[] => {
    const e = values[`${base}_en`], a = values[`${base}_ar`];
    const v = en ? ((Array.isArray(e) && e.length) ? e : a) : a;
    return Array.isArray(v) ? (v as Record<string, unknown>[]) : [];
  };
  const strs = (base: string) => pl(base).map((x) => (typeof x === "string" ? x : String((x as Record<string, unknown>)?.text ?? ""))).filter(Boolean);
  const progTitle = ps("title") || (en ? "Program name" : "اسم البرنامج");
  const rawImg = String(values.image_file || values.image || "");
  const img = rawImg ? (/^(https?:|data:|blob:|\/)/.test(rawImg) ? rawImg : "/" + rawImg.replace(/^\/+/, "")) : "";

  // 1) الهيرو — بادج وسط + عنوان + وصف (خلفية متدرّجة فاتحة)
  if (has("subtitle") || (has("title") && !has("about"))) {
    return (
      <div dir={dir} className="overflow-hidden rounded-2xl bg-gradient-to-b from-[#ebf7f9] to-white p-6 text-center ring-1 ring-line">
        <span className="inline-block rounded-full bg-white px-3 py-1 text-[11px] font-medium text-brand-dark shadow-sm ring-1 ring-line">{en ? "Our Services in Saudi Arabia" : "برامجنا التمكينية في المملكة"}</span>
        <h1 className="mt-3 text-lg font-extrabold text-ink">{ps("title") || progTitle}</h1>
        {ps("subtitle") && <p className="mx-auto mt-2 max-w-md text-[12px] leading-7 text-ink-muted">{ps("subtitle")}</p>}
      </div>
    );
  }

  // 2) نبذة عن البرنامج — صورة + عنوان «عن …» + فقرات (عمودان)
  if (has("about")) {
    const paras = strs("about");
    return (
      <div dir={dir} className="grid gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-line sm:grid-cols-2">
        <div className="relative h-40 overflow-hidden rounded-2xl bg-surface">
          {img
            ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={img} alt="" className="h-40 w-full object-contain bg-surface" />
            : <div className="flex h-40 items-center justify-center text-[11px] text-ink-soft">{en ? "No image" : "لا صورة"}</div>}
        </div>
        <div className="text-start">
          <h2 className="text-base font-extrabold text-ink">{en ? "About " : "عن "}{progTitle}</h2>
          <div className="mt-2 space-y-2">
            {paras.length ? paras.map((p, i) => <p key={i} className="text-[12px] leading-7 text-ink-muted">{p}</p>) : <p className="text-[11px] text-ink-soft">{en ? "No paragraphs yet" : "لا توجد فقرات بعد"}</p>}
          </div>
        </div>
      </div>
    );
  }

  // 3) فلسفة البرنامج — قسم داكن + بطاقات
  if (has("philosophy")) {
    const cards = strs("philosophy");
    return (
      <div dir={dir} className="rounded-2xl bg-gradient-to-bl from-[#003333] via-[#0f4a54] to-[#174646] p-5 text-start">
        <h2 className="text-base font-extrabold text-white">{en ? "Program " : "فلسفة "}<span className="text-brand">{en ? "Philosophy" : "البرنامج"}</span></h2>
        {ps("philosophy_intro") && <p className="mt-2 text-[12px] leading-7 text-white/75">{ps("philosophy_intro")}</p>}
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {cards.length ? cards.map((c, i) => <div key={i} className="rounded-2xl border border-white/10 bg-[#124e5a] p-3 text-[12px] leading-7 text-white/85">{c}</div>) : <p className="text-[11px] text-white/60">{en ? "No cards yet" : "لا توجد بطاقات بعد"}</p>}
        </div>
      </div>
    );
  }

  // 4) معلومات البرنامج — ٣ بطاقات (المنهج + المدة + الفئة)
  if (has("methods") || has("duration") || has("target") || has("target_tags") || has("target_list")) {
    const methods = pl("methods");
    const duration = ps("duration");
    const target = ps("target");
    const tags = strs("target_tags");
    const tlist = strs("target_list");
    const Card = ({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) => (
      <div className="rounded-2xl border border-line border-t-4 border-t-brand bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2 border-b border-line pb-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">{CMS_ICONS[icon] ?? CMS_ICONS.star}</span>
          <h3 className="text-sm font-bold text-ink">{title}</h3>
        </div>
        {children}
      </div>
    );
    return (
      <div dir={dir} className="space-y-3 text-start">
        {methods.length > 0 && (
          <Card icon="book" title={en ? "Scientific Methodology" : "المنهج العلمي"}>
            <ul className="space-y-2">
              {methods.map((m, i) => { const name = en ? String(m.name_en || m.name || "") : String(m.name_ar || m.name || ""); const desc = en ? String(m.desc_en || m.desc || "") : String(m.desc_ar || m.desc || ""); return (
                <li key={i} className="border-e-2 border-brand pe-2">{name && <p className="text-[12px] font-bold text-ink">{name}</p>}{desc && <p className="text-[11px] text-ink-muted">{desc}</p>}</li>
              ); })}
            </ul>
          </Card>
        )}
        {duration && <Card icon="clock" title={en ? "Program Duration" : "مدة البرنامج"}><p className="text-[12px] leading-7 text-ink-muted">{duration}</p></Card>}
        {(target || tags.length > 0 || tlist.length > 0) && (
          <Card icon="team" title={en ? "Target Group" : "الفئة المستهدفة"}>
            {target && <p className="text-[12px] leading-7 text-ink-muted">{target}</p>}
            {tags.length > 0 && <div className="mt-2 flex flex-wrap gap-1.5">{tags.map((tg, i) => <span key={i} className="rounded-full bg-brand/10 px-2.5 py-1 text-[11px] font-medium text-brand-dark">{tg}</span>)}</div>}
            {tlist.length > 0 && <ul className="mt-2 space-y-1.5">{tlist.map((tl, i) => <li key={i} className="flex items-start gap-2 text-[12px] text-ink-muted"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />{tl}</li>)}</ul>}
          </Card>
        )}
      </div>
    );
  }

  // 5) مجالات التدريب — عنوان + بطاقات (أيقونة + رقم + عنوان + وصف)
  if (has("training_areas")) {
    const areas = pl("training_areas");
    return (
      <div dir={dir} className="rounded-2xl bg-white p-4 text-start shadow-sm ring-1 ring-line">
        <h2 className="text-base font-extrabold text-ink">{en ? "Training " : "مجالات "}<span className="text-brand">{en ? "Areas" : "التدريب"}</span></h2>
        {ps("training_intro") && <p className="mt-1.5 text-[12px] text-ink-muted">{ps("training_intro")}</p>}
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {areas.length ? areas.map((a, i) => { const title = en ? String(a.title_en || a.title || "") : String(a.title_ar || a.title || ""); const desc = en ? String(a.desc_en || a.desc || "") : String(a.desc_ar || a.desc || ""); const icon = String(a.icon || ""); return (
            <div key={i} className="rounded-2xl border border-line bg-white p-3 shadow-sm">
              <div className="flex items-start gap-2">
                <div className="flex shrink-0 flex-col items-center gap-0.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10 text-brand">{CMS_ICONS[icon] ?? CMS_ICONS.star}</span>
                  <span className="text-[10px] font-semibold text-ink-soft">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="flex-1 text-[13px] font-bold leading-6 text-ink">{title || "—"}</h3>
              </div>
              {desc && <p className="mt-2 text-[12px] leading-6 text-ink-muted">{desc}</p>}
            </div>
          ); }) : <p className="text-[11px] text-ink-soft">{en ? "No areas yet" : "لا توجد مجالات بعد"}</p>}
        </div>
      </div>
    );
  }

  // 6) المحطات التطبيقية — عنوان وسط + شرائح متدرّجة
  if (has("stations")) {
    const st = strs("stations");
    return (
      <div dir={dir} className="rounded-2xl bg-surface p-4 text-center ring-1 ring-line">
        <h2 className="text-base font-extrabold text-ink">{en ? "Applied Practical Stations" : "المحطات التطبيقية"}</h2>
        {ps("stations_intro") && <p className="mx-auto mt-1.5 max-w-md text-[12px] text-ink-muted">{ps("stations_intro")}</p>}
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {st.length ? st.map((s, i) => <div key={i} className="rounded-xl bg-gradient-to-bl from-brand to-brand-deep py-3 text-[12px] font-bold text-white shadow-md">{s}</div>) : <p className="text-[11px] text-ink-soft">{en ? "No stations yet" : "لا توجد محطات بعد"}</p>}
        </div>
      </div>
    );
  }

  // 7) قسم التواصل السفلي (CTA) — قسم أزرق متدرّج + بادج + عنوان + وصف + أزرار
  if (has("cta_title") || has("cta_text") || has("cta_badge")) {
    const badge = ps("cta_badge") || (en ? "Customer service available around the clock" : "خدمة العملاء متاحة على مدار الساعة");
    const title = ps("cta_title") || (en ? `Would you like to enroll in ${progTitle}?` : `هل ترغب في التسجيل ب${progTitle} ؟`);
    const sub = ps("cta_text") || (en ? "Contact us and we will help you choose the program best suited to your child's needs." : "يمكنك التواصل معنا لمساعدتك في اختيار البرنامج أو الخدمة الأنسب وفق احتياجات طفلك.");
    // كل الحقول فارغة ⇐ النص المعروض افتراضي (مولّد تلقائياً)، لتنبيه المحرّر أنّ الحقول فارغة عن قصد
    const usingDefault = !ps("cta_title") && !ps("cta_text") && !ps("cta_badge");
    return (
      <div dir={dir}>
        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-[#0e4048] via-[#1a6c75] to-[#0e4048] p-5 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-white/90"><span className="h-2 w-2 rounded-full bg-success" />{badge}</span>
          <h2 className="mt-3 text-base font-extrabold leading-snug text-white">{highlight(title, "text-brand")}</h2>
          <p className="mx-auto mt-2 max-w-md text-[12px] text-white/75">{sub}</p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="rounded-xl bg-brand px-3 py-2 text-[11px] font-semibold text-white">{en ? "Apply Now" : "طلب التحاق"}</span>
            <span className="rounded-xl bg-[#2ba73e] px-3 py-2 text-[11px] font-semibold text-white">{en ? "WhatsApp" : "واتساب"}</span>
            <span className="rounded-xl bg-white px-3 py-2 text-[11px] font-semibold text-ink">{en ? "Nearest Branch" : "أقرب فرع"}</span>
          </div>
        </div>
        {usingDefault && (
          <p className="mt-2 flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-2 text-[11px] leading-5 text-amber-700 ring-1 ring-amber-200">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><circle cx="12" cy="12" r="10" /><path d="M12 8h.01M11 12h1v4h1" /></svg>
            {en ? "This is the default text (the fields are empty). Fill the fields to override it." : "هذا هو النص الافتراضي (الحقول فارغة). املأ الحقول لتخصيصه واستبداله."}
          </p>
        )}
      </div>
    );
  }

  return <PreviewShell dir={dir} empty en={en} />;
}

export function GroupPreview({ type, bases, values, lang }: { type: string; bases: string[]; values: Record<string, unknown>; lang: "ar" | "en" }) {
  const en = lang === "en";
  const dir = en ? "ltr" : "rtl";
  const has = (b: string) => bases.includes(b);
  // معاينات مطابقة بحسب نوع العنصر (كل صفحة لها تصميم أقسامها)
  if (type === "programs") return <ProgramGroupPreview bases={bases} values={values} lang={lang} />;
  // المعاينة تقرأ فيلدز مجموعتها فقط (لا تتسرّب لحقول أقسام تانية)
  const gs = (base: string) => { if (!has(base)) return ""; const v = en ? (values[`${base}_en`] || values[`${base}_ar`]) : values[`${base}_ar`]; return typeof v === "string" ? v : ""; };
  const gl = (base: string): unknown[] => {
    if (!has(base)) return [];
    const arEn = values[`${base}_en`]; const arAr = values[`${base}_ar`];
    const v = en ? ((Array.isArray(arEn) && arEn.length) ? arEn : arAr) : arAr;
    return Array.isArray(v) ? v : (Array.isArray(values[base]) ? (values[base] as unknown[]) : []);
  };
  const rawImg = (has("image") || has("image_file")) ? String(values.image_file || values.image || values.image_path || "") : "";
  const img = rawImg ? (/^(https?:|data:|blob:|\/)/.test(rawImg) ? rawImg : "/" + rawImg.replace(/^\/+/, "")) : "";

  // 0) بطاقة الخبر (إعلامنا) — صورة + وسم التصنيف + تاريخ + عنوان + وصف (مطابقة NewsCard)
  if (has("desc") && (has("image") || has("image_file")) && (has("title") || has("name"))) {
    const cardTitle = gs("title") || gs("name");
    const cat = gs("category");
    const date = gs("date");
    const desc = gs("desc");
    return (
      <article dir={dir} className="flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
        <div className="relative h-44 w-full bg-surface">
          {img
            ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={img} alt="" className="h-44 w-full object-cover" />
            : <div className="flex h-44 w-full items-center justify-center text-[11px] text-ink-soft">{en ? "No image" : "لا صورة"}</div>}
          {cat && <span className="absolute end-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold text-brand shadow-sm backdrop-blur">{cat}</span>}
        </div>
        <div className="flex flex-1 flex-col p-5 text-start">
          {date && <p className="flex items-center gap-1.5 text-xs text-ink-soft"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>{date}</p>}
          <h3 className="mt-2 text-base font-bold leading-7 text-ink">{cardTitle || (en ? "Article title" : "عنوان الخبر")}</h3>
          {desc && <p className="mt-2 flex-1 text-sm leading-7 text-ink-muted">{desc}</p>}
          <span className="mt-4 flex items-center gap-1 text-sm font-semibold text-brand">{en ? "Read More" : "اقرأ المزيد"}<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="dir-flip"><path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" /></svg></span>
        </div>
      </article>
    );
  }

  // 1) قوائم المحتوى (فقرات / نقاط / بطاقات / صور)
  const listBase = LIST_BASES.find(has);
  if (listBase) {
    const items = gl(listBase);
    if (listBase === "gallery") {
      const imgs = items.map((x) => String(typeof x === "string" ? x : ((x as Record<string, unknown>)?.image ?? ""))).filter(Boolean).map((s) => (/^(https?:|\/)/.test(s) ? s : "/" + s.replace(/^\/+/, "")));
      if (!imgs.length) return <PreviewShell dir={dir} empty en={en} />;
      return <div className="grid grid-cols-3 gap-2 rounded-xl bg-surface/40 p-3">{imgs.map((s, i) => (/* eslint-disable-next-line @next/next/no-img-element */<img key={i} src={s} alt="" className="h-20 w-full rounded-lg object-contain bg-surface ring-1 ring-line" />))}</div>;
    }
    const objCards = items.length > 0 && typeof items[0] === "object" && (("title_ar" in (items[0] as object)) || ("desc_ar" in (items[0] as object)) || ("icon" in (items[0] as object)));
    if (objCards) {
      return (
        <div dir={dir} className="grid gap-2 rounded-xl bg-surface/40 p-3 sm:grid-cols-2">
          {items.map((it, i) => { const o = it as Record<string, unknown>; const icon = String(o.icon ?? ""); const title = en ? String(o.title_en || o.title_ar || "") : String(o.title_ar || ""); const desc = en ? String(o.desc_en || o.desc_ar || "") : String(o.desc_ar || ""); return (
            <div key={i} className="rounded-2xl border border-line bg-white p-3 text-center shadow-sm">
              {icon && <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-brand/10 text-brand">{CMS_ICONS[icon] ?? CMS_ICONS.star}</span>}
              <h5 className="mt-1.5 text-[13px] font-bold text-ink">{title || "—"}</h5>
              {desc && <p className="mt-1 text-[11px] leading-5 text-ink-muted">{desc}</p>}
            </div>); })}
        </div>
      );
    }
    // body = فقرات؛ باقي القوائم النصية = نقاط بعلامة صح
    const strs = items.map((it) => itemText(it, en)).filter(Boolean);
    if (!strs.length) return <PreviewShell dir={dir} empty en={en} />;
    if (listBase === "body") {
      return <div dir={dir} className="space-y-3 rounded-xl bg-white p-4 text-start shadow-sm ring-1 ring-line">{strs.map((s, i) => <p key={i} className="text-[12px] leading-7 text-ink-muted">{s}</p>)}</div>;
    }
    return (
      <ul dir={dir} className="space-y-2 rounded-xl bg-white p-4 text-start shadow-sm ring-1 ring-line">
        {strs.map((s, i) => <li key={i} className="flex items-start gap-2 text-[12px] leading-6 text-ink-muted"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0 text-brand"><circle cx="12" cy="12" r="9" /><path d="M8.5 12l2.2 2.2L15.5 9.5" strokeLinecap="round" strokeLinejoin="round" /></svg>{s}</li>)}
      </ul>
    );
  }

  // 2) تفاصيل الفعالية (تاريخ/وقت/مكان/فئة/مقاعد)
  if (EVENT_BASES.some(has)) {
    const rows = EVENT_BASES.filter((b) => b !== "reg_status").map((b) => ({ b, label: { date: en ? "Date" : "التاريخ", time: en ? "Time" : "الوقت", location: en ? "Location" : "المكان", audience: en ? "Audience" : "الفئة المستهدفة", seats: en ? "Seats" : "عدد المقاعد" }[b], value: gs(b) })).filter((r) => r.value);
    const reg = gs("reg_status");
    if (!rows.length && !reg) return <PreviewShell dir={dir} empty en={en} />;
    return (
      <div dir={dir} className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-line">
        <div className="bg-brand px-4 py-3 text-center text-sm font-bold text-white">{en ? "Event details" : "تفاصيل الفعالية"}</div>
        <div className="space-y-3 p-4">
          {rows.map((r) => (
            <div key={r.b} className="flex items-center justify-between gap-3 text-start">
              <div><p className="text-[10px] text-ink-soft">{r.label}</p><p className="text-[12px] font-semibold text-ink">{r.value}</p></div>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">{CMS_ICONS[EVENT_ICON[r.b]] ?? CMS_ICONS.star}</span>
            </div>
          ))}
          {reg && <p className="rounded-lg bg-brand/5 px-3 py-2 text-center text-[11px] font-semibold text-brand">{reg}</p>}
        </div>
      </div>
    );
  }

  // 3) هيرو (صورة + عنوان + عنوان فرعي)
  const title = gs("title") || gs("name") || gs("heading");
  const sub = gs("subtitle") || gs("about") || gs("badge");
  if (img && title) {
    return (
      <div dir={dir} className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img} alt="" className="h-36 w-full object-contain bg-surface" />
        <div className="p-4 text-start"><h4 className="text-base font-bold text-ink">{highlight(title)}</h4>{sub && <p className="mt-1 text-[12px] leading-6 text-ink-muted">{sub}</p>}</div>
      </div>
    );
  }

  // 4) عام: عنوان + نص/فقرات
  const text = gs("text") || gs("about") || gs("desc") || gs("subtitle") || sub;
  if (!title && !text) return <PreviewShell dir={dir} empty en={en} />;
  return (
    <div dir={dir} className="rounded-xl bg-white p-4 text-start shadow-sm ring-1 ring-line">
      {title && <h4 className="text-base font-bold leading-snug text-ink">{highlight(title)}</h4>}
      {text.split("\n").filter((p) => p.trim()).map((p, i) => <p key={i} className="mt-1.5 text-[12px] leading-6 text-ink-muted">{p}</p>)}
    </div>
  );
}

function PreviewShell({ dir, empty, en }: { dir: string; empty?: boolean; en: boolean }) {
  return <div dir={dir} className="rounded-xl border border-dashed border-line bg-white p-6 text-center text-[12px] text-ink-soft/60">{empty ? (en ? "Preview appears here as you type" : "المعاينة تظهر هنا أثناء الكتابة") : ""}</div>;
}

// ===== معاينة عنصر قائمة مفرد (خبر/فرع/أخصائي/قصة…) — كارت عام =====
export function ItemPreview({ values, lang }: { type: string; values: Record<string, unknown>; lang: "ar" | "en" }) {
  const en = lang === "en";
  const g = (base: string) => {
    const v = en ? (values[`${base}_en`] || values[`${base}_ar`]) : values[`${base}_ar`];
    return typeof v === "string" ? v : "";
  };
  const title = g("name") || g("title") || g("heading") || g("label");
  const badge = g("specialty") || g("category") || g("badge") || g("role") || g("region") || g("tag");
  const desc = g("desc") || g("excerpt") || g("about") || g("subtitle") || g("bio") || g("content");
  const rawImg = String(values.image_file || values.image || values.image_path || values.logo_path || "");
  const img = rawImg ? (/^(https?:|data:|blob:|\/)/.test(rawImg) ? rawImg : "/" + rawImg.replace(/^\/+/, "")) : "";
  const empty = !title && !badge && !desc && !img;
  return (
    <div dir={en ? "ltr" : "rtl"} className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
      {img && (
        <div className="relative h-40 w-full bg-surface">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img} alt="" className="h-full w-full object-contain bg-surface" />
        </div>
      )}
      <div className="p-4 text-start">
        {empty && <p className="text-sm text-ink-soft/60">{en ? "Preview appears here as you type" : "المعاينة تظهر هنا أثناء الكتابة"}</p>}
        {badge && <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-brand/10 px-3 py-1 text-[11px] font-semibold text-brand">{badge}</span>}
        {title && <h4 className="text-base font-bold leading-snug text-ink">{highlight(title)}</h4>}
        {desc && <p className="mt-1.5 line-clamp-5 text-[12px] leading-6 text-ink-muted">{desc.replace(/\*\*/g, "")}</p>}
      </div>
    </div>
  );
}
