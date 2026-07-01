import Link from "next/link";
import { getLocale, pick } from "@/i18n/locale";

export default async function NotFound() {
  const locale = await getLocale();
  return (
    <section className="bg-gradient-to-b from-[#ebf7f9] to-white">
      <div className="mx-auto flex min-h-[62vh] max-w-3xl flex-col items-center justify-center px-6 py-20 text-center">
        <span className="text-7xl font-extrabold tracking-tight text-brand sm:text-8xl">404</span>

        <h1 className="mt-6 text-2xl font-extrabold text-ink sm:text-3xl">
          {pick(locale, "الصفحة غير موجودة", "Page not found")}
        </h1>
        <p className="mt-4 max-w-xl text-base leading-8 text-ink-muted">
          {pick(
            locale,
            "عذراً، الصفحة التي تبحث عنها غير متوفرة — قد تكون نُقلت أو حُذفت أو أن الرابط غير صحيح.",
            "Sorry, the page you're looking for isn't available — it may have been moved, removed, or the link is incorrect.",
          )}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-brand-dark"
          >
            {pick(locale, "العودة للرئيسية", "Back to home")}
          </Link>
          <Link
            href="/news"
            className="rounded-xl border border-line bg-white px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-brand hover:text-brand"
          >
            {pick(locale, "تصفّح إعلامنا", "Browse our news")}
          </Link>
        </div>
      </div>
    </section>
  );
}
