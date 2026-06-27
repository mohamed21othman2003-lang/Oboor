import { fetchContent } from "@/lib/server/django";
import type { Locale } from "@/i18n/config";
import type { Program } from "@/components/ProgramCard";

// صفّ بطاقة خدمة كما يرجع من Django (content/service-cards)
type ServiceCardRow = {
  tab: "programs" | "clinical" | "techniques";
  slug: string;
  href: string;
  order: number;
  badge_ar: string; badge_en: string;
  title_ar: string; title_en: string;
  desc_ar: string; desc_en: string;
  suits_ar: string; suits_en: string;
  age_ar: string; age_en: string;
  features_ar: string[]; features_en: string[];
  regions_ar: string[]; regions_en: string[];
};

export type ServiceCards = { programs: Program[]; clinical: Program[]; techniques: Program[] };

function toProgram(row: ServiceCardRow, en: boolean): Program {
  return {
    slug: row.slug,
    href: row.href || undefined,
    badge: en ? row.badge_en || row.badge_ar : row.badge_ar,
    title: en ? row.title_en || row.title_ar : row.title_ar,
    desc: en ? row.desc_en || row.desc_ar : row.desc_ar,
    suits: en ? row.suits_en || row.suits_ar : row.suits_ar,
    age: en ? row.age_en || row.age_ar : row.age_ar,
    features: en ? (row.features_en?.length ? row.features_en : row.features_ar) : row.features_ar,
    regions: en ? (row.regions_en?.length ? row.regions_en : row.regions_ar) : row.regions_ar,
  };
}

// يجلب بطاقات الخدمات من CMS مجمّعة حسب التبويب (مع احترام الترتيب). يرجّع undefined لو الجسر غير متاح → fallback ثابت
export async function loadServiceCards(locale: Locale): Promise<ServiceCards | undefined> {
  const rows = await fetchContent<ServiceCardRow[]>("service-cards");
  if (!rows || !rows.length) return undefined;
  const en = locale === "en";
  const grouped: ServiceCards = { programs: [], clinical: [], techniques: [] };
  for (const row of [...rows].sort((a, b) => a.order - b.order)) {
    if (row.tab in grouped) grouped[row.tab].push(toProgram(row, en));
  }
  return grouped;
}
