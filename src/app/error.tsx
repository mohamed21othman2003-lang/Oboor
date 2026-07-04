"use client";

import { useEffect } from "react";
import Link from "next/link";

// حدود خطأ عامّة: تظهر بدل الشاشة البيضاء إن حدث خطأ غير متوقّع في العرض.
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // مكان مناسب لإرسال الخطأ لخدمة مراقبة (Sentry) لاحقًا
    console.error(error);
  }, [error]);

  const en = typeof document !== "undefined" && /(?:^|;\s*)locale=en/.test(document.cookie);
  const t = (ar: string, e: string) => (en ? e : ar);

  return (
    <section dir={en ? "ltr" : "rtl"} className="bg-gradient-to-b from-[#ebf7f9] to-white">
      <div className="mx-auto flex min-h-[62vh] max-w-3xl flex-col items-center justify-center px-6 py-20 text-center">
        <span className="text-6xl font-extrabold tracking-tight text-brand sm:text-7xl">!</span>
        <h1 className="mt-6 text-2xl font-extrabold text-ink sm:text-3xl">
          {t("حدث خطأ غير متوقّع", "Something went wrong")}
        </h1>
        <p className="mt-4 max-w-xl text-base leading-8 text-ink-muted">
          {t(
            "عذراً، واجهنا مشكلة أثناء تحميل هذا الجزء. جرّب إعادة المحاولة، وإن استمرّت المشكلة عُد للصفحة الرئيسية.",
            "Sorry, we ran into a problem loading this part. Please try again, and if it persists, return to the home page.",
          )}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-brand-dark"
          >
            {t("إعادة المحاولة", "Try again")}
          </button>
          <Link
            href="/"
            className="rounded-xl border border-line bg-white px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-brand hover:text-brand"
          >
            {t("العودة للرئيسية", "Back to home")}
          </Link>
        </div>
      </div>
    </section>
  );
}
