"use client";

import { useEffect } from "react";
import { pick, type Locale } from "@/i18n/config";

// Action bar for the printable branch profile. Auto-opens the print dialog
// (the user saves as PDF), and is hidden from the printout itself.
export default function BranchProfileActions({ locale }: { locale: Locale }) {
  useEffect(() => {
    const t = setTimeout(() => window.print(), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="no-print sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-line bg-white/90 px-6 py-3 backdrop-blur">
      <button
        onClick={() => window.close()}
        className="rounded-lg px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-surface"
      >
        {pick(locale, "إغلاق", "Close")}
      </button>
      <button
        onClick={() => window.print()}
        className="flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z" />
        </svg>
        {pick(locale, "تحميل / طباعة PDF", "Download / Print PDF")}
      </button>
    </div>
  );
}
