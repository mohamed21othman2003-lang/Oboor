"use client";

import { useEffect } from "react";

// حدود خطأ على مستوى الجذر (لو حدث الخطأ في التخطيط نفسه). يجب أن يرندر <html>/<body>.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  const en = typeof document !== "undefined" && /(?:^|;\s*)locale=en/.test(document.cookie);
  const t = (ar: string, e: string) => (en ? e : ar);
  return (
    <html lang={en ? "en" : "ar"} dir={en ? "ltr" : "rtl"}>
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#ebf7f9" }}>
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "2rem" }}>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
            {t("حدث خطأ غير متوقّع", "Something went wrong")}
          </h1>
          <p style={{ marginTop: "1rem", maxWidth: 520, lineHeight: 1.9, color: "#475569" }}>
            {t("عذراً، واجهنا مشكلة. جرّب إعادة تحميل الصفحة.", "Sorry, we ran into a problem. Please try reloading the page.")}
          </p>
          <button
            onClick={() => reset()}
            style={{ marginTop: "1.5rem", background: "#2cbcc8", color: "#fff", border: 0, borderRadius: 12, padding: "0.75rem 1.5rem", fontWeight: 700, cursor: "pointer" }}
          >
            {t("إعادة المحاولة", "Try again")}
          </button>
        </div>
      </body>
    </html>
  );
}
