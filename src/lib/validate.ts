import { pick, type Locale } from "@/i18n/config";

// الاسم الكامل: كلمتان على الأقل (يرفض اسماً واحداً)
export function validateName(v: string, locale: Locale): string {
  const parts = v.trim().split(/\s+/).filter((p) => p.length > 0);
  if (parts.length < 2) {
    return pick(locale, "الرجاء إدخال الاسم بالكامل (اسمان على الأقل).", "Please enter your full name (at least two names).");
  }
  return "";
}

// رقم الجوال السعودي: يبدأ بـ 5 (مع 0 أو 966 اختياري) — ٩ أرقام على الأقل
export function validatePhone(v: string, locale: Locale): string {
  const digits = v.replace(/\D/g, "");
  if (digits.length < 9) {
    return pick(locale, "رقم الجوال قصير جداً — ٩ أرقام على الأقل.", "Phone number is too short — at least 9 digits.");
  }
  if (!/^(?:00966|966|0)?5\d{8}$/.test(digits)) {
    return pick(locale, "الرجاء إدخال رقم جوال سعودي صحيح (مثال: 05XXXXXXXX).", "Please enter a valid Saudi mobile (e.g. 05XXXXXXXX).");
  }
  return "";
}

// تحقق عام لحقل مطلوب
export function validateRequired(v: string, locale: Locale): string {
  if (!v.trim()) return pick(locale, "هذا الحقل مطلوب.", "This field is required.");
  return "";
}

// بريد إلكتروني صحيح (مطلوب)
export function validateEmail(v: string, locale: Locale): string {
  const s = v.trim();
  if (!s) return pick(locale, "هذا الحقل مطلوب.", "This field is required.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)) {
    return pick(locale, "الرجاء إدخال بريد إلكتروني صحيح.", "Please enter a valid email address.");
  }
  return "";
}
