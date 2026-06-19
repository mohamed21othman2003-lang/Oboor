// ملف آمن للعميل والسيرفر (بدون next/headers)
export type Locale = "ar" | "en";

export const LOCALES: Locale[] = ["ar", "en"];

export const dirOf = (l: Locale): "rtl" | "ltr" => (l === "ar" ? "rtl" : "ltr");

// اختيار النص حسب اللغة
export function pick<T>(locale: Locale, ar: T, en: T): T {
  return locale === "en" ? en : ar;
}
