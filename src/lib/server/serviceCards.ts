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

// صفحة التفاصيل المرتبطة بكل بطاقة (programs / services / techniques) هي المصدر الوحيد لـ:
// الاسم، والإظهار/الإخفاء، والترتيب. البطاقة نفسها تحتفظ بالوصف والمميزات والفئة والعمر والمناطق فقط.
type DetailRow = { slug: string; title_ar: string; title_en: string; order: number };
const DETAIL_TYPE: Record<ServiceCardRow["tab"], string> = { programs: "programs", clinical: "services", techniques: "techniques" };

function linkedSlug(row: ServiceCardRow): string {
  if (row.slug) return row.slug;
  const m = (row.href || "").match(/^\/(?:programs|services|techniques)\/([^/?#]+)/);
  return m ? m[1] : "";
}

// يجلب بطاقات الخدمات من CMS مجمّعة حسب التبويب. يرجّع undefined لو الجسر غير متاح → fallback ثابت
export async function loadServiceCards(locale: Locale): Promise<ServiceCards | undefined> {
  const [rows, programs, services, techniques] = await Promise.all([
    fetchContent<ServiceCardRow[]>("service-cards"),
    fetchContent<DetailRow[]>("programs"),
    fetchContent<DetailRow[]>("services"),
    fetchContent<DetailRow[]>("techniques"),
  ]);
  if (!rows || !rows.length) return undefined;
  const en = locale === "en";
  const details: Record<string, DetailRow[] | null> = { programs, services, techniques };
  const grouped: ServiceCards = { programs: [], clinical: [], techniques: [] };
  const sortKey = new Map<ServiceCardRow, number>();
  const visible: ServiceCardRow[] = [];
  for (const row of rows) {
    if (!(row.tab in grouped)) continue;
    const list = details[DETAIL_TYPE[row.tab]];
    const slug = linkedSlug(row);
    // لو قائمة التفاصيل متاحة والبطاقة مربوطة بعنصر مش منشور ⇒ البطاقة تختفي مع صفحتها
    const d = list?.length && slug ? list.find((x) => x.slug === slug) : undefined;
    if (list?.length && slug && !d) continue;
    const card = d ? { ...row, title_ar: d.title_ar || row.title_ar, title_en: d.title_en || row.title_en } : row;
    sortKey.set(card, d ? d.order : row.order);
    visible.push(card);
  }
  for (const row of visible.sort((a, b) => sortKey.get(a)! - sortKey.get(b)!)) {
    grouped[row.tab].push(toProgram(row, en));
  }
  return grouped;
}
