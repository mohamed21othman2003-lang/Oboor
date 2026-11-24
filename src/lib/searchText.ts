// بحث متسامح للنص العربي/الإنجليزي: يوحّد الهمزات والتاء المربوطة والياء،
// يحذف التشكيل والرموز والمسافات الزائدة، ويحوّل الأرقام العربية إلى لاتينية.
// المطابقة بالكلمات: كل كلمة في البحث لازم تظهر (بأي ترتيب) في نص العنصر.

export function normalizeSearch(s: string): string {
  return (s || "")
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670\u0640]/g, "") // تشكيل + تطويل
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[^\p{L}\p{N}@.]+/gu, " ") // أي رمز/شرطة/فاصلة ⇒ مسافة
    .replace(/\s+/g, " ")
    .trim();
}

// هل كل كلمات البحث موجودة في النص؟ (النص يُمرَّر مُوحَّداً مسبقاً)
export function matchesSearch(normalizedHaystack: string, query: string): boolean {
  const tokens = normalizeSearch(query).split(" ").filter(Boolean);
  if (!tokens.length) return true;
  // نسخة بلا مسافات: تلتقط «خميس مشيط» لو كُتبت «خميسمشيط» أو رقم هاتف بمسافات
  const compact = normalizedHaystack.replace(/ /g, "");
  return tokens.every((t) => normalizedHaystack.includes(t) || compact.includes(t));
}
