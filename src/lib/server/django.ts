// جسر اختياري لإرسال الطلبات إلى باك إند Django.
// لو DJANGO_API_URL متوفّر → نوجّه الطلب لـ Django (مصدر الحقيقة + Django Admin).
// لو مش متوفّر → الكود الأصلي يخزّن في Supabase مباشرة (fallback).

import { draftMode, cookies } from "next/headers";

export const DJANGO_API_URL = process.env.DJANGO_API_URL;

// في وضع المعاينة فقط: يرجّع باراميتر ?preview=type:id من كوكي المعاينة.
// خارج وضع المعاينة (الزوّار العاديون) يرجّع فارغاً والصفحات تبقى ثابتة/مُخزّنة (ISR).
async function previewParam(): Promise<string> {
  try {
    const { isEnabled } = await draftMode();
    if (!isEnabled) return "";
    const ref = (await cookies()).get("oboor_preview")?.value;
    return ref ? `?preview=${encodeURIComponent(ref)}` : "";
  } catch {
    return "";
  }
}

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
    const preview = await previewParam();
    const res = await fetch(
      `${DJANGO_API_URL}/content/${path}/${preview}`,
      preview
        ? // وضع المعاينة: لا تخزين، نريد المسودّة الطازجة في كل طلب.
          { cache: "no-store", signal: AbortSignal.timeout(8000) }
        : // محتوى يتحدّث من لوحة الإدارة → نعيد التحقق كل ٥ دقائق كحدّ أقصى،
          // مع وسم cms-content حتى يبطله الحفظ فورًا (on-demand revalidation).
          // timeout يمنع باك إند بطيء/بارد من تعليق رندر الصفحة (يسقط للبيانات الثابتة).
          { next: { revalidate: 300, tags: ["cms-content"] }, signal: AbortSignal.timeout(3500) },
    );
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
// عنصر «له معنى» = فيه نص أو رقم أو صورة أو قائمة. العناصر الفارغة تمامًا
// (مثل عنصر أضافه الأدمن ولم يملأه) تُستبعد حتى لا تظهر فارغة/مكسورة على الموقع.
function meaningful(r: SectionRow): boolean {
  const txt = `${r.title_ar ?? ""}${r.title_en ?? ""}${r.text_ar ?? ""}${r.text_en ?? ""}${r.value ?? ""}${r.image ?? ""}`.trim();
  if (txt) return true;
  return (Array.isArray(r.data_ar) && r.data_ar.length > 0) || (Array.isArray(r.data_en) && r.data_en.length > 0);
}

export async function fetchSections(page: string): Promise<Record<string, SectionRow[]> | null> {
  const rows = await fetchContent<SectionRow[]>(`sections/${page}`);
  if (!rows || !rows.length) return null;
  const grouped: Record<string, SectionRow[]> = {};
  for (const r of rows) { if (meaningful(r)) (grouped[r.block] ??= []).push(r); }
  return grouped;
}
