"use client";

// عميل الـCMS — يتكلّم مع Django مباشرة من المتصفح بتوكن المصادقة.
const BASE = process.env.NEXT_PUBLIC_DJANGO_API_URL || "http://127.0.0.1:8000/api";
const TOKEN_KEY = "oboor_cms_token";

export type CmsUser = { username: string; name: string; email: string; is_staff: boolean };

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(t: string) {
  localStorage.setItem(TOKEN_KEY, t);
}
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function cmsLogin(username: string, password: string): Promise<{ token: string; user: CmsUser }> {
  const res = await fetch(`${BASE}/cms/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || "تعذّر تسجيل الدخول.");
  setToken(data.token);
  return data;
}

export async function cmsFetch<T = unknown>(path: string, opts: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...opts,
    headers: {
      ...(opts.body && !(opts.body instanceof FormData) ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Token ${token}` } : {}),
      ...(opts.headers || {}),
    },
  });
  if (res.status === 401) {
    clearToken();
    if (typeof window !== "undefined") window.location.href = "/cms/login";
    throw new Error("انتهت الجلسة، الرجاء تسجيل الدخول مجدداً.");
  }
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    if (data && typeof data === "object" && !data.detail) {
      // أخطاء تحقق DRF على مستوى الحقول
      const parts = Object.entries(data).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join("، ") : v}`);
      if (parts.length) throw new Error(parts.join(" — "));
    }
    throw new Error((data && data.detail) || `خطأ (${res.status})`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export type DashboardStats = {
  submissions: { key: string; label: string; count: number; icon: string }[];
  content: { key: string; label: string; count: number }[];
  home: { key: string; label: string; count: number }[];
  totals: { submissions: number; content: number; site_configured: boolean };
};

export function getStats() {
  return cmsFetch<DashboardStats>("/cms/stats/");
}

// ===== Collections (CRUD عام) =====
export type FieldSchema = {
  name: string;
  label: string;
  type: "text" | "textarea" | "bool" | "number" | "select" | "json" | "image";
  required: boolean;
  advanced: boolean;
  help: string;
  bilingual: boolean;
  lang: "ar" | "en" | null;
  base: string;
  choices?: { value: string; label: string }[];
};

export type CmsItem = Record<string, unknown> & { id: number };

export function getSchema(type: string) {
  return cmsFetch<{ fields: FieldSchema[]; readonly: boolean }>(`/cms/collections/${type}/schema/`);
}
export function listCollection(type: string) {
  return cmsFetch<{
    items: CmsItem[];
    title_field: string;
    group_by: string | null;
    groups: { value: string; label: string }[] | null;
    readonly: boolean;
    count: number;
  }>(`/cms/collections/${type}/`);
}
export function getItem(type: string, pk: number | string) {
  return cmsFetch<CmsItem>(`/cms/collections/${type}/${pk}/`);
}
export function createItem(type: string, data: Record<string, unknown>) {
  return cmsFetch<CmsItem>(`/cms/collections/${type}/`, { method: "POST", body: JSON.stringify(data) });
}
export function updateItem(type: string, pk: number | string, data: Record<string, unknown>) {
  return cmsFetch<CmsItem>(`/cms/collections/${type}/${pk}/`, { method: "PATCH", body: JSON.stringify(data) });
}
export function deleteItem(type: string, pk: number | string) {
  return cmsFetch(`/cms/collections/${type}/${pk}/`, { method: "DELETE" });
}
// استرجاع العنصر لنسخته الافتراضية
export function resetDefault(type: string, pk: number | string) {
  return cmsFetch<CmsItem>(`/cms/collections/${type}/${pk}/reset/`, { method: "POST" });
}
// إعادة ترتيب العناصر (قائمة المعرّفات بالترتيب الجديد)
export function reorderCollection(type: string, ids: number[]) {
  return cmsFetch(`/cms/collections/${type}/reorder/`, { method: "POST", body: JSON.stringify({ ids }) });
}
// رفع ملف (صورة) لحقل معيّن عبر multipart
export function uploadField(type: string, pk: number | string, field: string, file: File) {
  const fd = new FormData();
  fd.append(field, file);
  return cmsFetch<CmsItem>(`/cms/collections/${type}/${pk}/`, { method: "PATCH", body: fd });
}

export const TYPE_LABELS: Record<string, string> = {
  news: "الأخبار والمقالات",
  programs: "البرامج التأهيلية",
  services: "الخدمات العيادية",
  techniques: "التقنيات التأهيلية",
  branches: "الفروع",
  specialists: "الأخصائيون",
  success: "قصص النجاح",
  careers: "الوظائف",
  "assessment-cards": "بطاقات التقييم",
  hero: "شرائح الهيرو",
  stats: "أرقام الإنجاز",
  features: "مميزات «لماذا عبور»",
  gallery: "صور المعرض",
  "service-cards": "بطاقات الخدمات",
  sections: "عناصر أقسام الصفحات",
  site: "إعدادات الموقع",
  contact: "رسائل التواصل",
  admission: "طلبات الالتحاق",
  career: "طلبات التوظيف",
  assessment: "نتائج التقييم",
};
