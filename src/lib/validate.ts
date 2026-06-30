import { pick, type Locale } from "@/i18n/config";

// تحويل الأرقام العربية-الهندية (٠-٩ و ۰-۹) إلى لاتينية
const toLatinDigits = (s: string) =>
  s.replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06F0));

// فلاتر إدخال (تُستخدم وقت الكتابة لمنع المحارف غير المسموحة):
// حقول الأسماء — إزالة كل الأرقام
export const stripDigits = (v: string) => v.replace(/[0-9٠-٩۰-۹]/g, "");
// حقول الجوال — إبقاء الأرقام وعلامات الهاتف فقط (لا حروف)
export const digitsOnly = (v: string) => v.replace(/[^0-9٠-٩۰-۹+\s-]/g, "");

// الاسم الكامل: حروف فقط (بدون أرقام) + كلمتان على الأقل
export function validateName(v: string, locale: Locale): string {
  const s = v.trim();
  if (/[0-9٠-٩۰-۹]/.test(s)) {
    return pick(locale, "الاسم يجب ألا يحتوي على أرقام.", "Name must not contain numbers.");
  }
  const parts = s.split(/\s+/).filter((p) => p.length > 0);
  if (parts.length < 2) {
    return pick(locale, "الرجاء إدخال الاسم بالكامل (اسمان على الأقل).", "Please enter your full name (at least two names).");
  }
  return "";
}

// رقم الجوال السعودي: أرقام فقط — يبدأ بـ 5 (مع 0 أو 966 اختياري) — ٩ أرقام على الأقل
export function validatePhone(v: string, locale: Locale): string {
  const s = toLatinDigits(v);
  if (/[A-Za-zء-ي]/.test(s)) {
    return pick(locale, "رقم الجوال يجب أن يحتوي على أرقام فقط.", "Phone number must contain digits only.");
  }
  const digits = s.replace(/\D/g, "");
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
