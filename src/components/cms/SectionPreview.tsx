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
        <img key={i} src={it.image} alt="" className="h-24 w-full rounded-lg object-cover ring-1 ring-line" />
      ))}
    </div>
  );
}

// ===== ترويسة قسم عامة (سطر علوي + عنوان + نص + صورة + نقاط + بادچات) =====
function HeadingCard({ lang, it, itemKey }: { lang: "ar" | "en"; it: PItem; itemKey?: string }) {
  const en = lang === "en";
  const paragraphs = it.text ? it.text.split("\n").filter((p) => p.trim() !== "") : [];
  const isPill = itemKey === "badge" && it.title && !it.text && !it.image;
  if (isPill) {
    return (
      <div dir={en ? "ltr" : "rtl"} className="rounded-xl bg-white p-4 text-center shadow-sm ring-1 ring-line">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-4 py-1.5 text-xs font-bold text-brand-dark"><span className="h-1.5 w-1.5 rounded-full bg-success" />{it.title}</span>
      </div>
    );
  }
  return (
    <div dir={en ? "ltr" : "rtl"} className="rounded-xl bg-white p-4 text-center shadow-sm ring-1 ring-line">
      {it.tagline && <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 text-[11px] font-bold text-brand"><span className="h-1.5 w-1.5 rounded-full bg-brand" />{it.tagline}</span>}
      {it.title && <h4 className="mt-2 text-lg font-extrabold leading-snug text-ink">{highlight(it.title)}</h4>}
      {paragraphs.map((p, i) => <p key={i} className="mx-auto mt-1.5 max-w-md text-[12px] leading-6 text-ink-muted">{p}</p>)}
      {it.bullets.length > 0 && (
        <ul className="mx-auto mt-2 grid w-fit gap-1 text-start">
          {it.bullets.map((b, i) => <li key={i} className="flex items-center gap-1.5 text-[12px] text-ink-muted"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-brand"><circle cx="12" cy="12" r="9" /><path d="M8.5 12l2.2 2.2L15.5 9.5" strokeLinecap="round" strokeLinejoin="round" /></svg>{b}</li>)}
        </ul>
      )}
      {it.image && (
        <div className="relative mx-auto mt-3 w-full max-w-xs">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={it.image} alt="" className="h-32 w-full rounded-xl object-cover ring-1 ring-line" />
          {it.badges.length > 0 && (
            <div className="absolute inset-x-2 bottom-2 flex flex-wrap justify-center gap-1.5">
              {it.badges.map((bd, i) => <span key={i} className="rounded-lg bg-white/95 px-2 py-1 text-[10px] font-semibold text-ink shadow-sm">{bd.value && <span className="text-brand">{bd.value} </span>}{bd.label}</span>)}
            </div>
          )}
        </div>
      )}
      {!it.image && it.badges.length > 0 && (
        <div className="mt-2 flex flex-wrap justify-center gap-1.5">
          {it.badges.map((bd, i) => <span key={i} className="rounded-lg bg-brand/5 px-2.5 py-1 text-[11px] font-semibold text-ink ring-1 ring-line">{bd.value && <span className="text-brand">{bd.value} </span>}{bd.label}</span>)}
        </div>
      )}
    </div>
  );
}

// ===== الموزّع على مستوى البلوك: يعرض السكشن كامل بشكله الحقيقي =====
export function BlockPreview({ block, items, lang, itemKeys }: { block: string; items: PItem[]; lang: "ar" | "en"; itemKeys?: string[] }) {
  if (!items.length) return null;
  if (block === "cta") return <CtaCard lang={lang} it={items[0]} />;
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
          <img src={img} alt="" className="h-full w-full object-cover" />
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
