// جسر اختياري لإرسال الطلبات إلى باك إند Django.
// لو DJANGO_API_URL متوفّر → نوجّه الطلب لـ Django (مصدر الحقيقة + Django Admin).
// لو مش متوفّر → الكود الأصلي يخزّن في Supabase مباشرة (fallback).

export const DJANGO_API_URL = process.env.DJANGO_API_URL;

export async function forwardJson(path: string, payload: Record<string, unknown>): Promise<boolean> {
  if (!DJANGO_API_URL) return false;
  const res = await fetch(`${DJANGO_API_URL}/${path}/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`django ${path} ${res.status}`);
  return true;
}

export async function forwardForm(path: string, form: FormData): Promise<boolean> {
  if (!DJANGO_API_URL) return false;
  const res = await fetch(`${DJANGO_API_URL}/${path}/`, { method: "POST", body: form });
  if (!res.ok) throw new Error(`django ${path} ${res.status}`);
  return true;
}

// جلب محتوى الـ CMS من Django. يرجّع null لو الجسر غير مفعّل أو فشل الطلب،
// عشان الصفحة ترجع للبيانات الثابتة (fallback) من غير ما تكسر.
export async function fetchContent<T = unknown>(path: string): Promise<T | null> {
  if (!DJANGO_API_URL) return null;
  try {
    const res = await fetch(`${DJANGO_API_URL}/content/${path}/`, {
      // محتوى يتحدّث من لوحة الإدارة → نعيد التحقق كل دقيقة كحدّ أقصى،
      // مع وسم cache-content حتى يبطله الحفظ فورًا (on-demand revalidation).
      next: { revalidate: 60, tags: ["cms-content"] },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

// صفّ عنصر قسم عام كما يرجع من Django (content/sections/<page>)
export type SectionRow = {
  page: string; block: string; key: string; order: number;
  icon: string; value: string; color: string;
  title_ar: string; title_en: string; text_ar: string; text_en: string;
  data_ar: unknown; data_en: unknown;
  image?: string;
};

// يجلب عناصر أقسام صفحة معيّنة ويجمّعها حسب block. يرجّع null للسقوط للبيانات الثابتة.
export async function fetchSections(page: string): Promise<Record<string, SectionRow[]> | null> {
  const rows = await fetchContent<SectionRow[]>(`sections/${page}`);
  if (!rows || !rows.length) return null;
  const grouped: Record<string, SectionRow[]> = {};
  for (const r of rows) (grouped[r.block] ??= []).push(r);
  return grouped;
}
