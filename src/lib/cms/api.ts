"use client";

import { bustContentCache } from "@/app/actions/cache";

// عميل الـCMS — يتكلّم مع Django مباشرة من المتصفح بتوكن المصادقة.
const BASE = process.env.NEXT_PUBLIC_DJANGO_API_URL || "http://127.0.0.1:8000/api";
const TOKEN_KEY = "oboor_cms_token";

export type CmsUser = { username: string; name: string; email: string; is_staff: boolean };

// ترجمة رسائل خطأ Django الشائعة حسب لغة اللوحة (تُقرأ من localStorage)
const API_ERRORS_EN: Record<string, string> = {
  "غير موجود.": "Not found.",
  "نوع غير معروف.": "Unknown type.",
  "غير مسموح.": "Not allowed.",
  "لا يوجد ملف.": "No file provided.",
  "الحد الأقصى 5 ميجابايت.": "Maximum size is 5 MB.",
  "الملف ليس صورة صالحة.": "The file is not a valid image.",
  "هذا النوع لا يدعم الترتيب.": "This type does not support reordering.",
  "لا توجد نسخة افتراضية محفوظة لهذا العنصر.": "No saved default version for this item.",
  "تعذّر تسجيل الدخول.": "Could not sign in.",
  "انتهت الجلسة، الرجاء تسجيل الدخول مجدداً.": "Your session has expired. Please sign in again.",
};
function cmsPanelLang(): "ar" | "en" {
  if (typeof window === "undefined") return "ar";
  return localStorage.getItem("oboor_cms_lang") === "en" ? "en" : "ar";
}
// ترجمة رسالة خطأ واحدة إن كانت معروفة واللوحة إنجليزية
function apiError(msg: string): string {
  return cmsPanelLang() === "en" ? (API_ERRORS_EN[msg] || msg) : msg;
}

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
  if (!res.ok) throw new Error(apiError(data.detail || "تعذّر تسجيل الدخول."));
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
    throw new Error(apiError("انتهت الجلسة، الرجاء تسجيل الدخول مجدداً."));
  }
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    if (data && typeof data === "object" && !data.detail) {
      // أخطاء تحقق DRF على مستوى الحقول
      const parts = Object.entries(data).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join("، ") : v}`);
      if (parts.length) throw new Error(parts.join(" — "));
    }
    throw new Error(apiError((data && data.detail) || (cmsPanelLang() === "en" ? `Error (${res.status})` : `خطأ (${res.status})`)));
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

// ===== حساب الأدمن =====
export function getMe() {
  return cmsFetch<{ user: CmsUser }>("/cms/me/");
}
export function updateAccountEmail(email: string) {
  return cmsFetch<{ email: string }>("/cms/account/email/", { method: "POST", body: JSON.stringify({ email }) });
}
export async function changeAccountPassword(current_password: string, new_password: string) {
  const r = await cmsFetch<{ detail: string; token: string }>("/cms/account/password/", {
    method: "POST",
    body: JSON.stringify({ current_password, new_password }),
  });
  // الباك إند يجدّد التوكن بعد تغيير كلمة المرور — نحدّثه لتبقى الجلسة صالحة
  if (r?.token) setToken(r.token);
  return r;
}

// ===== إعادة تعيين كلمة المرور (عام، بدون توكن) =====
async function publicPost<T = { detail: string }>(path: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(apiError(data.detail || (cmsPanelLang() === "en" ? `Error (${res.status})` : `خطأ (${res.status})`)));
  return data as T;
}
export function requestPasswordReset(email: string) {
  return publicPost("/cms/password-reset/", { email });
}
export function confirmPasswordReset(uid: string, token: string, new_password: string) {
  return publicPost("/cms/password-reset/confirm/", { uid, token, new_password });
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

// إبطال كاش الموقع فورًا بعد الحفظ حتى تظهر التعديلات بدون انتظار
async function bumpSiteCache() {
  try {
    await bustContentCache();
  } catch {
    /* تجاهل: الموقع سيتحدّث خلال دقيقة على أبعد تقدير */
  }
}

export function getSchema(type: string) {
  return cmsFetch<{ fields: FieldSchema[]; readonly: boolean; group_field?: string | null }>(`/cms/collections/${type}/schema/`);
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
export async function createItem(type: string, data: Record<string, unknown>) {
  const r = await cmsFetch<CmsItem>(`/cms/collections/${type}/`, { method: "POST", body: JSON.stringify(data) });
  await bumpSiteCache();
  return r;
}
export async function updateItem(type: string, pk: number | string, data: Record<string, unknown>) {
  const r = await cmsFetch<CmsItem>(`/cms/collections/${type}/${pk}/`, { method: "PATCH", body: JSON.stringify(data) });
  await bumpSiteCache();
  return r;
}
export async function deleteItem(type: string, pk: number | string) {
  const r = await cmsFetch(`/cms/collections/${type}/${pk}/`, { method: "DELETE" });
  await bumpSiteCache();
  return r;
}
// استرجاع العنصر لنسخته الافتراضية
export async function resetDefault(type: string, pk: number | string) {
  const r = await cmsFetch<CmsItem>(`/cms/collections/${type}/${pk}/reset/`, { method: "POST" });
  await bumpSiteCache();
  return r;
}
// إعادة ترتيب العناصر (قائمة المعرّفات بالترتيب الجديد)
export async function reorderCollection(type: string, ids: number[]) {
  const r = await cmsFetch(`/cms/collections/${type}/reorder/`, { method: "POST", body: JSON.stringify({ ids }) });
  await bumpSiteCache();
  return r;
}
// رفع ملف (صورة) لحقل معيّن عبر multipart
export async function uploadField(type: string, pk: number | string, field: string, file: File) {
  const fd = new FormData();
  fd.append(field, file);
  const r = await cmsFetch<CmsItem>(`/cms/collections/${type}/${pk}/`, { method: "PATCH", body: fd });
  await bumpSiteCache();
  return r;
}
// تخزين مسودّة معاينة (تعديلات غير محفوظة) في الباك إند، ثم فتح الصفحة في وضع المعاينة.
export async function savePreviewDraft(type: string, id: number | string, data: Record<string, unknown>) {
  return cmsFetch(`/cms/preview/`, { method: "POST", body: JSON.stringify({ type, id, data }) });
}

// رفع صورة عامّة (للمعارض) — تُرجِع رابطها العام
export function uploadImage(file: File) {
  const fd = new FormData();
  fd.append("file", file);
  return cmsFetch<{ url: string }>(`/cms/upload/`, { method: "POST", body: fd });
}

export const TYPE_LABELS: Record<string, string> = {
  news: "إعلامنا (الأخبار والمقالات)",
  programs: "برامجنا التمكينية: البرامج",
  services: "برامجنا التمكينية: الخدمات العيادية",
  techniques: "برامجنا التمكينية: التقنيات",
  branches: "مراكزنا (الفروع)",
  specialists: "رُوّادنا (الأخصائيون)",
  success: "أبطال عبور (قصص النجاح)",
  careers: "انضم إلينا (الوظائف)",
  "assessment-cards": "التقييم (بطاقات التقييم)",
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

// أسماء الأنواع بالإنجليزية (تُختار حسب لغة اللوحة)
export const TYPE_LABELS_EN: Record<string, string> = {
  news: "Our Media (News & Articles)",
  programs: "Programs",
  services: "Clinical Services",
  techniques: "Techniques",
  branches: "Our Centers (Branches)",
  specialists: "Our Pioneers (Specialists)",
  success: "Oboor Champions (Success Stories)",
  careers: "Join Us (Careers)",
  "assessment-cards": "Assessment (Cards)",
  hero: "Hero Slides",
  stats: "Achievement Numbers",
  features: "«Why Oboor» Features",
  gallery: "Gallery Images",
  "service-cards": "Service Cards",
  sections: "Page Section Items",
  site: "Site Settings",
  contact: "Contact Messages",
  admission: "Admission Requests",
  career: "Job Applications",
  assessment: "Assessment Results",
};

export type CmsLangKey = "ar" | "en";
// اسم النوع حسب لغة اللوحة (إنجليزي إن توفّر، وإلا العربي)
export const typeLabel = (key: string, lang: CmsLangKey = "ar") =>
  (lang === "en" ? TYPE_LABELS_EN[key] : TYPE_LABELS[key]) ?? TYPE_LABELS[key] ?? key;

// نص زر الإضافة محدّد لكل نوع (اليوزر يعرف بالظبط بيضيف إيه)
export const ADD_LABELS: Record<string, string> = {
  news: "إضافة خبر جديد",
  programs: "إضافة برنامج جديد",
  services: "إضافة خدمة جديدة",
  techniques: "إضافة تقنية جديدة",
  branches: "إضافة فرع جديد",
  specialists: "إضافة أخصائي جديد",
  success: "إضافة قصة نجاح",
  careers: "إضافة وظيفة جديدة",
  "assessment-cards": "إضافة تقييم جديد",
  hero: "إضافة شريحة جديدة",
  stats: "إضافة رقم إنجاز",
  features: "إضافة ميزة جديدة",
  gallery: "إضافة صورة جديدة",
  "service-cards": "إضافة بطاقة خدمة",
  sections: "إضافة قسم جديد",
};
export const ADD_LABELS_EN: Record<string, string> = {
  news: "Add News",
  programs: "Add Program",
  services: "Add Service",
  techniques: "Add Technique",
  branches: "Add Branch",
  specialists: "Add Specialist",
  success: "Add Success Story",
  careers: "Add Job",
  "assessment-cards": "Add Assessment Card",
  hero: "Add Hero Slide",
  stats: "Add Achievement Number",
  features: "Add Feature",
  gallery: "Add Image",
  "service-cards": "Add Service Card",
  sections: "Add Section",
};
export const addLabelFor = (type: string, lang: CmsLangKey = "ar") =>
  (lang === "en" ? ADD_LABELS_EN[type] : ADD_LABELS[type]) ?? (lang === "en" ? "Add New" : "إضافة جديد");
