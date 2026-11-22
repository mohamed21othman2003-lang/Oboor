// قصص النجاح من الـCMS (content/success) — مصدر واحد لصفحة «أبطال عبور» وصفحات الفروع
import { getSuccessStories, type SuccessStory } from "@/lib/successStoriesData";
import type { Locale } from "@/i18n/config";
import { fetchContent } from "@/lib/server/django";

// الشكل اللي بيرجع من Django (content/success)
type ApiSuccess = {
  slug: string;
  name_ar: string; name_en: string;
  age_ar: string; age_en: string;
  category_ar: string; category_en: string;
  duration_label_ar: string; duration_label_en: string;
  before_ar: string; before_en: string;
  after_ar: string; after_en: string;
  quote_ar: string; quote_en: string;
  meta_duration_ar: string; meta_duration_en: string;
  meta_age_ar: string; meta_age_en: string;
  author_ar: string; author_en: string;
  badge_ar?: string; badge_en?: string;
  program_ar?: string; program_en?: string;
  journey_ar?: string; journey_en?: string;
  results_ar?: string[]; results_en?: string[];
  image: string; order: number;
};

function toStory(row: ApiSuccess, locale: Locale): SuccessStory {
  const en = locale === "en";
  const t = (ar: string, env: string) => (en ? env ?? ar : ar);
  return {
    slug: row.slug,
    name: t(row.name_ar, row.name_en),
    age: t(row.age_ar, row.age_en),
    image: row.image,
    category: t(row.category_ar, row.category_en),
    durationLabel: t(row.duration_label_ar, row.duration_label_en),
    before: t(row.before_ar, row.before_en),
    after: t(row.after_ar, row.after_en),
    quote: t(row.quote_ar, row.quote_en),
    metaDuration: t(row.meta_duration_ar, row.meta_duration_en),
    metaAge: t(row.meta_age_ar, row.meta_age_en),
    author: t(row.author_ar, row.author_en),
    badge: t(row.badge_ar ?? "", row.badge_en ?? ""),
    program: t(row.program_ar ?? "", row.program_en ?? ""),
    journey: t(row.journey_ar ?? "", row.journey_en ?? ""),
    results: (en ? (row.results_en?.length ? row.results_en : row.results_ar) : row.results_ar) ?? [],
  };
}

// نجلب القصص من Django، ونرجع للبيانات الثابتة (fallback) لو فشل الطلب أو فاضي
export async function loadStories(locale: Locale): Promise<SuccessStory[]> {
  const rows = await fetchContent<ApiSuccess[]>("success");
  if (rows && rows.length) return rows.map((r) => toStory(r, locale));
  return getSuccessStories(locale);
}
