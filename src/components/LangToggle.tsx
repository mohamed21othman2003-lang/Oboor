"use client";

import { useRouter } from "next/navigation";
import type { Locale } from "@/i18n/config";

export default function LangToggle({ locale, label, className = "", iconOnly = false }: { locale: Locale; label: string; className?: string; iconOnly?: boolean }) {
  const router = useRouter();
  const toggle = () => {
    const next: Locale = locale === "ar" ? "en" : "ar";
    document.cookie = `locale=${next}; path=/; max-age=31536000; samesite=lax`;
    document.documentElement.lang = next;
    document.documentElement.dir = next === "ar" ? "rtl" : "ltr";
    router.refresh();
  };
  return (
    <button
      onClick={toggle}
      aria-label={label}
      title={label}
      className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-line ${iconOnly ? "px-2.5" : "px-3"} py-2 text-[13px] font-semibold text-ink-muted transition-colors hover:border-brand hover:text-brand ${className}`}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
      {!iconOnly && label}
    </button>
  );
}
