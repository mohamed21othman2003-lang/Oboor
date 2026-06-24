// تحميل الفروع من Django CMS (content/branches) مع fallback للبيانات الثابتة.
// يُستعمل من صفحات الفروع (server components) لتمرير القائمة للمكوّنات العميلة.

import { fetchContent } from "@/lib/server/django";
import { ALL_BRANCHES, ALL_BRANCHES_EN, type Branch } from "@/lib/branchesData";
import { type Locale } from "@/i18n/config";

// الشكل اللي بيرجع من Django (content/branches)
type ApiBranch = {
  slug: string;
  name_ar: string; name_en: string;
  area_ar: string; area_en: string;
  city_ar: string; city_en: string;
  region_ar: string; region_en: string;
  address_ar: string; address_en: string;
  hours_ar: string; hours_en: string;
  phone: string;
  services_ar: string[]; services_en: string[];
  gallery: string[];
  lat: number | null; lng: number | null;
  is_new: boolean;
  order: number;
};

function toBranch(row: ApiBranch, locale: Locale): Branch {
  const en = locale === "en";
  const f = (ar: string, e: string) => (en ? (e ?? ar) : ar);
  return {
    slug: row.slug,
    name: f(row.name_ar, row.name_en),
    area: f(row.area_ar, row.area_en),
    city: f(row.city_ar, row.city_en),
    region: f(row.region_ar, row.region_en),
    address: f(row.address_ar, row.address_en),
    hours: f(row.hours_ar, row.hours_en),
    phone: row.phone,
    services: en ? (row.services_en ?? row.services_ar) : row.services_ar,
    gallery: Array.isArray(row.gallery) ? row.gallery : [],
    lat: row.lat ?? null,
    lng: row.lng ?? null,
    isNew: row.is_new,
  };
}

// كل الفروع (CMS أو fallback ثابت) باللغة المطلوبة.
export async function loadBranches(locale: Locale): Promise<Branch[]> {
  const rows = await fetchContent<ApiBranch[]>("branches");
  if (rows && rows.length) return rows.map((r) => toBranch(r, locale));
  return locale === "en" ? ALL_BRANCHES_EN : ALL_BRANCHES;
}

// فرع واحد بالـ slug (CMS أو fallback ثابت).
export async function loadBranch(slug: string, locale: Locale): Promise<Branch | undefined> {
  const branches = await loadBranches(locale);
  return branches.find((b) => b.slug === slug);
}
