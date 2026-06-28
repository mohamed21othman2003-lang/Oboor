"use client";

// شريط المعاينة (واجهة) — يتيح إنهاء المعاينة والعودة لنفس الصفحة بالمحتوى المنشور.
export default function PreviewBannerBar() {
  const exit = () => {
    const to = window.location.pathname + window.location.search;
    window.location.href = `/api/preview/disable?to=${encodeURIComponent(to)}`;
  };

  return (
    <div className="sticky top-0 z-[200] flex items-center justify-center gap-3 bg-amber-400 px-4 py-2 text-center text-sm font-semibold text-amber-950 shadow">
      <span className="inline-flex items-center gap-1.5">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        وضع المعاينة — تشاهد تعديلات غير محفوظة (لا تظهر للزوّار)
      </span>
      <button
        type="button"
        onClick={exit}
        className="rounded-lg bg-amber-950 px-3 py-1 text-xs font-bold text-amber-50 transition-colors hover:bg-amber-900"
      >
        إنهاء المعاينة
      </button>
    </div>
  );
}
