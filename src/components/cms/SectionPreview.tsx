"use client";

// معاينات حيّة لأقسام الصفحة داخل الـCMS — تعرض المحتوى «كما يظهر على الموقع»
// وتتحدّث لحظياً مع كل حرف يُكتب في الحقول (read-your-own-writes قبل الحفظ).

// يبرز الأجزاء المحاطة بـ **هكذا** بلون مميّز (يحاكي hl() على الموقع)
function highlight(text: string) {
  const parts = text.split("**");
  return parts.map((p, i) =>
    i % 2 === 1 ? (
      <span key={i} className="text-emerald-300">{p}</span>
    ) : (
      <span key={i}>{p}</span>
    ),
  );
}

// معاينة قسم التواصل السفلي (CTA) — تطابق تصميم CtaSection مصغّراً
export function CtaPreview({
  lang,
  badge,
  title,
  text,
  bullets,
}: {
  lang: "ar" | "en";
  badge: string;
  title: string;
  text: string;
  bullets: string[];
}) {
  const en = lang === "en";
  const dir = en ? "ltr" : "rtl";
  const badgeShown = badge || (en ? "Customer service available around the clock" : "خدمة العملاء متاحة على مدار الساعة");
  const btnApply = en ? "Apply Now" : "طلب التحاق";
  const btnWhats = en ? "Contact via WhatsApp" : "تواصل عبر الواتساب";
  const btnBranch = en ? "Find Nearest Branch" : "اعثر على أقرب فرع";
  return (
    <div dir={dir} className="overflow-hidden rounded-xl bg-gradient-to-br from-[#0e4048] via-[#1a6c75] to-[#0e4048] px-4 py-6 text-center shadow-sm ring-1 ring-line">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-white/90">
        <span className="h-1.5 w-1.5 rounded-full bg-success" />
        {badgeShown}
      </span>
      <h4 className="mt-3 text-lg font-extrabold leading-snug text-white">
        {title ? highlight(title) : <span className="text-white/40">{en ? "CTA heading appears here" : "عنوان الـCTA يظهر هنا"}</span>}
      </h4>
      <p className="mx-auto mt-2 max-w-md text-[11px] leading-5 text-white/75">
        {text || <span className="text-white/40">{en ? "Descriptive line appears here" : "الجملة التوضيحية تظهر هنا"}</span>}
      </p>

      {bullets.length > 0 && (
        <div className="mx-auto mt-3 grid w-fit grid-cols-2 gap-x-5 gap-y-1.5 text-start">
          {bullets.map((b, i) => (
            <span key={i} className="flex items-center gap-1.5 text-[11px] text-white/85">
              <span className="h-1 w-1 shrink-0 rounded-full bg-success" />
              {b}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <span className="rounded-lg bg-brand px-3 py-1.5 text-[11px] font-semibold text-white">{btnApply}</span>
        <span className="rounded-lg bg-[#2ba73e] px-3 py-1.5 text-[11px] font-semibold text-white">{btnWhats}</span>
        <span className="rounded-lg bg-white px-3 py-1.5 text-[11px] font-semibold text-ink">{btnBranch}</span>
      </div>
    </div>
  );
}
