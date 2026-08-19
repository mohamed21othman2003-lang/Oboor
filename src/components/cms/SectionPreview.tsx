"use client";

import { CMS_ICONS } from "@/lib/cms/icons";

// معاينات حيّة لأقسام الصفحة داخل الـCMS — تعرض المحتوى «كما يظهر على الموقع»
// وتتحدّث لحظياً مع كل حرف يُكتب في الحقول (read-your-own-writes قبل الحفظ).

// يبرز الأجزاء المحاطة بـ **هكذا** بلون مميّز (يحاكي hl() على الموقع)
function highlight(text: string, cls = "text-brand") {
  const parts = text.split("**");
  return parts.map((p, i) =>
    i % 2 === 1 ? (
      <span key={i} className={cls}>{p}</span>
    ) : (
      <span key={i}>{p}</span>
    ),
  );
}

function Placeholder({ text }: { text: string }) {
  return <span className="text-ink-soft/50">{text}</span>;
}

export type Badge = { label: string; value: string };

export type PreviewData = {
  lang: "ar" | "en";
  block: string;
  itemKey: string;
  badge: string; // tagline / eyebrow
  title: string;
  text: string;
  value: string; // number
  icon: string; // icon key
  image: string; // resolved src
  bullets: string[];
  badges: Badge[]; // floating badges (over image)
};

// ===== قسم التواصل السفلي (CTA) — يطابق تصميم CtaSection مصغّراً =====
export function CtaPreview({ lang, badge, title, text, bullets }: {
  lang: "ar" | "en"; badge: string; title: string; text: string; bullets: string[];
}) {
  const en = lang === "en";
  const badgeShown = badge || (en ? "Customer service available around the clock" : "خدمة العملاء متاحة على مدار الساعة");
  return (
    <div dir={en ? "ltr" : "rtl"} className="overflow-hidden rounded-xl bg-gradient-to-br from-[#0e4048] via-[#1a6c75] to-[#0e4048] px-4 py-6 text-center shadow-sm ring-1 ring-line">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-white/90">
        <span className="h-1.5 w-1.5 rounded-full bg-success" />
        {badgeShown}
      </span>
      <h4 className="mt-3 text-lg font-extrabold leading-snug text-white">
        {title ? highlight(title, "text-emerald-300") : <span className="text-white/40">{en ? "CTA heading appears here" : "عنوان الـCTA يظهر هنا"}</span>}
      </h4>
      <p className="mx-auto mt-2 max-w-md text-[11px] leading-5 text-white/75">
        {text || <span className="text-white/40">{en ? "Descriptive line appears here" : "الجملة التوضيحية تظهر هنا"}</span>}
      </p>
      {bullets.length > 0 && (
        <div className="mx-auto mt-3 grid w-fit grid-cols-2 gap-x-5 gap-y-1.5 text-start">
          {bullets.map((b, i) => (
            <span key={i} className="flex items-center gap-1.5 text-[11px] text-white/85">
              <span className="h-1 w-1 shrink-0 rounded-full bg-success" />{b}
            </span>
          ))}
        </div>
      )}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <span className="rounded-lg bg-brand px-3 py-1.5 text-[11px] font-semibold text-white">{en ? "Apply Now" : "طلب التحاق"}</span>
        <span className="rounded-lg bg-[#2ba73e] px-3 py-1.5 text-[11px] font-semibold text-white">{en ? "Contact via WhatsApp" : "تواصل عبر الواتساب"}</span>
        <span className="rounded-lg bg-white px-3 py-1.5 text-[11px] font-semibold text-ink">{en ? "Find Nearest Branch" : "اعثر على أقرب فرع"}</span>
      </div>
    </div>
  );
}

// ===== كارت الانضمام (teal) — يطابق كروت «انضم إلى الفريق» =====
function JoinCardPreview({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <div className="flex flex-col items-center rounded-2xl bg-brand p-5 text-center text-white shadow-sm ring-1 ring-line">
      <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#e8f7f9] text-brand">{CMS_ICONS[icon] ?? CMS_ICONS.growth}</span>
      <h4 className="mt-3 text-[15px] font-bold">{title || <span className="text-white/50">…</span>}</h4>
      <p className="mt-1.5 text-[13px] leading-[21px] text-white/90">{text}</p>
    </div>
  );
}

// ===== كارت أيقونة (أبيض) — للمميزات والخطوات =====
function IconCardPreview({ icon, title, text, step }: { icon: string; title: string; text: string; step?: number }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5 text-center shadow-sm">
      <span className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand">
        {CMS_ICONS[icon] ?? CMS_ICONS.star}
        {step != null && <span className="absolute -end-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white">{step}</span>}
      </span>
      <h4 className="mt-3 text-sm font-bold text-ink">{title || <Placeholder text="…" />}</h4>
      <p className="mt-1 text-[12px] leading-6 text-ink-muted">{text}</p>
    </div>
  );
}

// ===== الأرقام (stat) — رقم كبير + وصف =====
function StatPreview({ value, title, icon }: { value: string; title: string; icon: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-line bg-white p-5 shadow-sm">
      {icon && <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">{CMS_ICONS[icon]}</span>}
      <div className="text-start">
        <p className="text-2xl font-extrabold text-brand" dir="ltr">{value || "0"}</p>
        <p className="text-xs text-ink-muted">{title}</p>
      </div>
    </div>
  );
}

// ===== عام: ترويسة قسم (سطر علوي + عنوان + نص + صورة + نقاط + بادچات) =====
function GenericPreview({ lang, itemKey, badge, title, text, icon, image, bullets, badges }: PreviewData) {
  const en = lang === "en";
  const paragraphs = text ? text.split("\n").filter((p) => p.trim() !== "") : [];
  const empty = !badge && !title && !text && !image && !icon && bullets.length === 0 && badges.length === 0;
  // الوسم العلوي المفرد (pill) — عنصر «badge» ليس له إلا عنوان
  const isPill = itemKey === "badge" && title && !text && !image && bullets.length === 0;
  if (isPill) {
    return (
      <div dir={en ? "ltr" : "rtl"} className="rounded-xl border border-line bg-white p-5 text-center shadow-sm">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-4 py-1.5 text-xs font-bold text-brand-dark">
          <span className="h-1.5 w-1.5 rounded-full bg-success" />{title}
        </span>
      </div>
    );
  }
  return (
    <div dir={en ? "ltr" : "rtl"} className="rounded-xl border border-line bg-white p-5 text-center shadow-sm">
      {empty && <Placeholder text={en ? "Preview appears here as you type" : "المعاينة تظهر هنا أثناء الكتابة"} />}
      {badge && (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 text-[11px] font-bold text-brand">
          <span className="h-1.5 w-1.5 rounded-full bg-brand" />{badge}
        </span>
      )}
      {icon && !title && !text ? (
        <span className="mx-auto mt-1 flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand">{CMS_ICONS[icon]}</span>
      ) : null}
      {title && <h4 className="mt-2 text-lg font-extrabold leading-snug text-ink">{highlight(title)}</h4>}
      {paragraphs.map((p, i) => (
        <p key={i} className="mx-auto mt-2 max-w-md text-[12px] leading-6 text-ink-muted">{p}</p>
      ))}
      {bullets.length > 0 && (
        <ul className="mx-auto mt-3 grid w-fit gap-1.5 text-start">
          {bullets.map((b, i) => (
            <li key={i} className="flex items-center gap-1.5 text-[12px] text-ink-muted">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-brand"><circle cx="12" cy="12" r="9" /><path d="M8.5 12l2.2 2.2L15.5 9.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              {b}
            </li>
          ))}
        </ul>
      )}
      {image && (
        <div className="relative mx-auto mt-3 w-full max-w-xs">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="" className="h-32 w-full rounded-xl object-cover ring-1 ring-line" />
          {badges.length > 0 && (
            <div className="absolute inset-x-2 bottom-2 flex flex-wrap justify-center gap-1.5">
              {badges.map((bd, i) => (
                <span key={i} className="rounded-lg bg-white/95 px-2 py-1 text-[10px] font-semibold text-ink shadow-sm">
                  {bd.value && <span className="text-brand">{bd.value} </span>}{bd.label}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
      {!image && badges.length > 0 && (
        <div className="mt-3 flex flex-wrap justify-center gap-1.5">
          {badges.map((bd, i) => (
            <span key={i} className="rounded-lg bg-brand/5 px-2.5 py-1 text-[11px] font-semibold text-ink ring-1 ring-line">
              {bd.value && <span className="text-brand">{bd.value} </span>}{bd.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ===== الموزّع: يختار الشكل المناسب لكل نوع سكشن =====
export function SectionPreview(props: PreviewData) {
  const { block, value, icon, title, text, bullets, itemKey } = props;
  if (block === "cta") return <CtaPreview lang={props.lang} badge={props.badge} title={title} text={text} bullets={bullets} />;
  if (value.trim() !== "") return <StatPreview value={value} title={title} icon={icon} />;
  if (block === "join_cards") return <JoinCardPreview icon={icon} title={title} text={text} />;
  if (block === "features") return <IconCardPreview icon={icon} title={title} text={text} />;
  if (block === "steps") {
    const n = Number(itemKey.replace(/\D/g, "")) || undefined;
    return <IconCardPreview icon={icon} title={title} text={text} step={n} />;
  }
  return <GenericPreview {...props} />;
}
