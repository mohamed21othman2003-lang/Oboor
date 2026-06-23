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
