"use client";

import Link from "next/link";
import PageChrome from "@/components/cms/PageChrome";
import { useCmsLang } from "@/lib/cms/i18n";

// أقسام الصفحة الرئيسية التي تُدار كقوائم (محتوى متكرّر)
const SECTIONS: { label: string; label_en: string; desc: string; desc_en: string; href: string }[] = [
  { label: "شرائح الهيرو", label_en: "Hero Slides", desc: "الصور والعناوين المتحركة أعلى الصفحة", desc_en: "The rotating images and headings at the top of the page", href: "/cms/content/hero" },
  { label: "الأرقام والإحصائيات", label_en: "Numbers & Statistics", desc: "أرقام الإنجاز (شواهد الأثر)", desc_en: "Achievement numbers (impact indicators)", href: "/cms/content/stats" },
  { label: "لماذا عبور؟ (المميزات)", label_en: "Why Oboor? (Features)", desc: "بطاقات مميزات المركز", desc_en: "The center's feature cards", href: "/cms/content/features" },
  { label: "بطاقات البحث الذكي", label_en: "Smart Search Cards", desc: "كروت البرامج/الخدمات/التقنيات في قسم البحث الذكي (نفسها في صفحة برامجنا)", desc_en: "Program/service/technique cards in the smart-search section (same as on the Programs page)", href: "/cms/content/service-cards" },
  { label: "المعرض", label_en: "Gallery", desc: "صور معرض الصفحة الرئيسية", desc_en: "Home-page gallery images", href: "/cms/content/gallery" },
  { label: "أبطال عبور (قصص النجاح)", label_en: "Oboor Champions (Success Stories)", desc: "نفس قصص النجاح التي تظهر في الرئيسية", desc_en: "The same success stories shown on the home page", href: "/cms/content/success" },
  { label: "إعلامنا (الأخبار)", label_en: "Our Media (News)", desc: "أحدث الأخبار التي تظهر في الرئيسية", desc_en: "The latest news shown on the home page", href: "/cms/content/news" },
];

export default function CmsHomePage() {
  const { lang } = useCmsLang();
  const en = lang === "en";
  const t = (ar: string, e: string) => (en ? e : ar);
  return (
    <div className="space-y-6">
      <div>
        <Link href="/cms" className="text-xs font-semibold text-brand hover:text-brand-dark">{t("← لوحة التحكّم", "← Dashboard")}</Link>
        <h1 className="mt-1 text-2xl font-extrabold text-ink">{t("الصفحة الرئيسية", "Home Page")}</h1>
        <p className="mt-1 text-sm text-ink-soft">{t("تحكّم في كل أقسام الصفحة الرئيسية من هنا — العناوين والنصوص والصور والقوائم.", "Manage every section of the home page from here — headings, texts, images and lists.")}</p>
      </div>

      {/* عناوين ونصوص أقسام الصفحة (الهيرو، من نحن، البحث الذكي، عناوين الأقسام…) */}
      <PageChrome page="home" />

      {/* الأقسام التي تُدار كقوائم متكرّرة */}
      <div>
        <h2 className="mb-3 text-sm font-bold text-brand-dark">{t("قوائم المحتوى في الصفحة", "Content lists on the page")}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {SECTIONS.map((s) => (
            <Link key={s.href} href={s.href} className="group flex items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-line transition-colors hover:ring-brand">
              <div className="text-start">
                <p className="font-bold text-ink">{en ? s.label_en : s.label}</p>
                <p className="mt-0.5 text-xs text-ink-soft">{en ? s.desc_en : s.desc}</p>
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`shrink-0 text-ink-soft transition-colors group-hover:text-brand ${en ? "-scale-x-100" : ""}`}><path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" /></svg>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
