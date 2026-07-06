// تحميل الفروع من Django CMS (content/branches) مع fallback للبيانات الثابتة.
// يُستعمل من صفحات الفروع (server components) لتمرير القائمة للمكوّنات العميلة.

import { fetchContent } from "@/lib/server/django";
import { ALL_BRANCHES, ALL_BRANCHES_EN, REGION_EN, serviceEn, type Branch } from "@/lib/branchesData";
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
  phone: string; phone_evening: string; email: string; manager: string; manager_en: string; map_url: string;
  rating: string; reviews_count: string;
  services_ar: string[]; services_en: string[];
  service_cards?: {
    title_ar?: string; title_en?: string; desc_ar?: string; desc_en?: string;
    features_ar?: string[]; features_en?: string[]; href?: string;
  }[];
  profile_intro_ar?: string; profile_intro_en?: string;
  profile_stats?: { value?: string; label_ar?: string; label_en?: string }[];
  journey?: { title_ar?: string; title_en?: string; desc_ar?: string; desc_en?: string }[];
  accreditations?: { title_ar?: string; title_en?: string }[];
  distinctions?: { icon?: string; title_ar?: string; title_en?: string; desc_ar?: string; desc_en?: string }[];
  success_heading_ar?: string; success_heading_en?: string;
  success_sub_ar?: string; success_sub_en?: string;
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
    manager: f(row.manager, row.manager_en),
    mapUrl: row.map_url || "",
    rating: row.rating || "",
    reviewsCount: row.reviews_count || "",
    // خدمات إنجليزية إن وُجدت، وإلا نترجم القياسية، وإلا العربي كما هو
    services: en ? (row.services_en?.length ? row.services_en : (row.services_ar || []).map(serviceEn)) : row.services_ar,
    serviceCards: (Array.isArray(row.service_cards) ? row.service_cards : []).map((c) => ({
      title: en ? (c.title_en || c.title_ar || "") : (c.title_ar || ""),
      desc: en ? (c.desc_en || c.desc_ar || "") : (c.desc_ar || ""),
      features: en ? (c.features_en?.length ? c.features_en : (c.features_ar || [])) : (c.features_ar || []),
      href: c.href || undefined,
    })).filter((c) => c.title),
    profileIntro: en ? (row.profile_intro_en || row.profile_intro_ar || "") : (row.profile_intro_ar || ""),
    profileStats: (Array.isArray(row.profile_stats) ? row.profile_stats : []).map((s) => ({
      value: s.value || "",
      label: en ? (s.label_en || s.label_ar || "") : (s.label_ar || ""),
    })).filter((s) => s.value || s.label),
    journey: (Array.isArray(row.journey) ? row.journey : []).map((j) => ({
      title: en ? (j.title_en || j.title_ar || "") : (j.title_ar || ""),
      desc: en ? (j.desc_en || j.desc_ar || "") : (j.desc_ar || ""),
    })).filter((j) => j.title || j.desc),
    accreditations: (Array.isArray(row.accreditations) ? row.accreditations : []).map((a) =>
      en ? (a.title_en || a.title_ar || "") : (a.title_ar || "")
    ).filter(Boolean),
    distinctions: (Array.isArray(row.distinctions) ? row.distinctions : []).map((d) => ({
      icon: d.icon || "",
      title: en ? (d.title_en || d.title_ar || "") : (d.title_ar || ""),
      desc: en ? (d.desc_en || d.desc_ar || "") : (d.desc_ar || ""),
    })).filter((d) => d.title),
    successHeading: en ? (row.success_heading_en || row.success_heading_ar || "") : (row.success_heading_ar || ""),
    successSub: en ? (row.success_sub_en || row.success_sub_ar || "") : (row.success_sub_ar || ""),
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
