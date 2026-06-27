"use client";

import Link from "next/link";
import PageChrome from "@/components/cms/PageChrome";

// أقسام الصفحة الرئيسية التي تُدار كقوائم (محتوى متكرّر)
const SECTIONS: { label: string; desc: string; href: string }[] = [
  { label: "شرائح الهيرو", desc: "الصور والعناوين المتحركة أعلى الصفحة", href: "/cms/content/hero" },
  { label: "الأرقام والإحصائيات", desc: "أرقام الإنجاز (شواهد الأثر)", href: "/cms/content/stats" },
  { label: "لماذا عبور؟ (المميزات)", desc: "بطاقات مميزات المركز", href: "/cms/content/features" },
  { label: "بطاقات البحث الذكي", desc: "كروت البرامج/الخدمات/التقنيات في قسم البحث الذكي (نفسها في صفحة برامجنا)", href: "/cms/content/service-cards" },
  { label: "المعرض", desc: "صور معرض الصفحة الرئيسية", href: "/cms/content/gallery" },
  { label: "أبطال عبور (قصص النجاح)", desc: "نفس قصص النجاح التي تظهر في الرئيسية", href: "/cms/content/success" },
  { label: "إعلامنا (الأخبار)", desc: "أحدث الأخبار التي تظهر في الرئيسية", href: "/cms/content/news" },
];

export default function CmsHomePage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/cms" className="text-xs font-semibold text-brand hover:text-brand-dark">← لوحة التحكّم</Link>
        <h1 className="mt-1 text-2xl font-extrabold text-ink">الصفحة الرئيسية</h1>
        <p className="mt-1 text-sm text-ink-soft">تحكّم في كل أقسام الصفحة الرئيسية من هنا — العناوين والنصوص والصور والقوائم.</p>
      </div>

      {/* عناوين ونصوص أقسام الصفحة (الهيرو، من نحن، البحث الذكي، عناوين الأقسام…) */}
      <PageChrome page="home" />

      {/* الأقسام التي تُدار كقوائم متكرّرة */}
      <div>
        <h2 className="mb-3 text-sm font-bold text-brand-dark">قوائم المحتوى في الصفحة</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {SECTIONS.map((s) => (
            <Link key={s.href} href={s.href} className="group flex items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-line transition-colors hover:ring-brand">
              <div className="text-start">
                <p className="font-bold text-ink">{s.label}</p>
                <p className="mt-0.5 text-xs text-ink-soft">{s.desc}</p>
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-ink-soft transition-colors group-hover:text-brand"><path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" /></svg>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
