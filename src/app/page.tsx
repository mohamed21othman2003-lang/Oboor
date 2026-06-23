import Hero, { type HeroSlide } from "@/components/home/Hero";
import About from "@/components/home/About";
import SmartSearch from "@/components/home/SmartSearch";
import Stats, { type StatItem } from "@/components/home/Stats";
import WhyUs, { type FeatureItem } from "@/components/home/WhyUs";
import SuccessStories from "@/components/home/SuccessStories";
import Gallery from "@/components/home/Gallery";
import NewsAndCerts from "@/components/home/NewsAndCerts";
import { getLocale } from "@/i18n/locale";
import { pick, type Locale } from "@/i18n/config";
import { fetchContent } from "@/lib/server/django";

// أشكال الصفوف القادمة من Django CMS
type ApiHero = { key: string; badge_ar: string; badge_en: string; heading_ar: string; heading_en: string; desc_ar: string; desc_en: string; cta_ar: string; cta_en: string; image: string; order: number };
type ApiStat = { key: string; label_ar: string; label_en: string; note_ar: string; note_en: string; value: string; icon: string; order: number };
type ApiFeature = { key: string; title_ar: string; title_en: string; note_ar: string; note_en: string; icon: string; order: number };
type ApiGallery = { key: string; caption_ar: string; caption_en: string; image: string; order: number };

// تختار النص حسب اللغة (إنجليزي مع fallback للعربي)
const t = (en: boolean, ar: string, eng: string) => (en ? (eng ?? ar) : ar);

// لودرز: ترجع null لو الجسر غير مفعّل/فشل → المكوّن يرجع للبيانات الثابتة
async function loadHero(locale: Locale): Promise<HeroSlide[] | undefined> {
  const rows = await fetchContent<ApiHero[]>("home/hero");
  if (!rows || !rows.length) return undefined;
  const en = locale === "en";
  return rows.map((r) => ({ img: r.image, heading: t(en, r.heading_ar, r.heading_en), desc: t(en, r.desc_ar, r.desc_en) }));
}

async function loadStats(locale: Locale): Promise<StatItem[] | undefined> {
  const rows = await fetchContent<ApiStat[]>("home/stats");
  if (!rows || !rows.length) return undefined;
  const en = locale === "en";
  return rows.map((r) => ({ icon: r.icon, value: r.value, label: t(en, r.label_ar, r.label_en), note: t(en, r.note_ar, r.note_en) }));
}

async function loadFeatures(locale: Locale): Promise<FeatureItem[] | undefined> {
  const rows = await fetchContent<ApiFeature[]>("home/features");
  if (!rows || !rows.length) return undefined;
  const en = locale === "en";
  return rows.map((r) => ({ icon: r.icon, title: t(en, r.title_ar, r.title_en), note: t(en, r.note_ar, r.note_en) }));
}

async function loadGallery(locale: Locale): Promise<{ images: string[]; captions: string[] } | undefined> {
  const rows = await fetchContent<ApiGallery[]>("gallery");
  if (!rows || !rows.length) return undefined;
  const en = locale === "en";
  return { images: rows.map((r) => r.image), captions: rows.map((r) => t(en, r.caption_ar, r.caption_en)) };
}

export default async function Home() {
  const locale = await getLocale();
  const [heroSlides, statItems, featureItems, gallery] = await Promise.all([
    loadHero(locale),
    loadStats(locale),
    loadFeatures(locale),
    loadGallery(locale),
  ]);
  return (
    <>
      <Hero locale={locale} slides={heroSlides} />
      <About locale={locale} />
      <SmartSearch locale={locale} />
      <Stats locale={locale} items={statItems} />
      <WhyUs locale={locale} items={featureItems} />
      <SuccessStories locale={locale} />
      <Gallery locale={locale} images={gallery?.images} captions={gallery?.captions} />
      <NewsAndCerts locale={locale} />

      {/* WhatsApp float */}
      <a
        href="https://wa.me/966920003452"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={pick(locale, "تواصل عبر واتساب", "Contact via WhatsApp")}
        className={`fixed bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 ${locale === "en" ? "right-6" : "left-6"}`}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.978-1.207zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413z" /></svg>
      </a>
    </>
  );
}
