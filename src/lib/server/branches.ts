// تحميل الفروع من Django CMS (content/branches) مع fallback للبيانات الثابتة.
// يُستعمل من صفحات الفروع (server components) لتمرير القائمة للمكوّنات العميلة.

import { fetchContent } from "@/lib/server/django";
import { ALL_BRANCHES, ALL_BRANCHES_EN, REGION_EN, type Branch } from "@/lib/branchesData";
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
  phone: string; phone_evening: string; email: string; manager: string; map_url: string;
  rating: string; reviews_count: string;
  services_ar: string[]; services_en: string[];
  gallery: string[];
  lat: number | null; lng: number | null;
  is_new: boolean;
  order: number;
};

function toBranch(row: ApiBranch, locale: Locale): Branch {
  const en = locale === "en";
  // النص الإنجليزي فارغ ⇒ نرجع للعربي (لا نترك الحقل فارغاً) — || وليس ?? لأن الفارغ ليس nullish
  const f = (ar: string, e: string) => (en ? (e || ar) : ar);
  return {
    slug: row.slug,
    name: f(row.name_ar, row.name_en),
    area: f(row.area_ar, row.area_en),
    city: f(row.city_ar, row.city_en),
    // المنطقة: إنجليزي إن وُجد، وإلا خريطة الترجمة القياسية، وإلا العربي — لتظل التابات/الليجند/التجميع إنجليزية
    region: en ? (row.region_en || REGION_EN[row.region_ar] || row.region_ar) : row.region_ar,
    address: f(row.address_ar, row.address_en),
    hours: f(row.hours_ar, row.hours_en),
    phone: row.phone,
    phoneEvening: row.phone_evening || "",
    email: row.email || "",
    manager: row.manager || "",
    mapUrl: row.map_url || "",
    rating: row.rating || "",
    reviewsCount: row.reviews_count || "",
    services: en ? (row.services_en?.length ? row.services_en : row.services_ar) : row.services_ar,
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
