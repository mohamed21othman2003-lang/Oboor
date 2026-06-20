"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { pick, type Locale } from "@/i18n/config";

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
    </svg>
  );
}

// Hero search for the branches page. Pushes ?q=... to the URL (read by
// BranchesExplorer to filter) and scrolls down to the results.
export default function BranchSearch({ locale }: { locale: Locale }) {
  const router = useRouter();
  const [q, setQ] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const query = q.trim();
    router.push(query ? `/branches?q=${encodeURIComponent(query)}` : "/branches", { scroll: false });
    document.getElementById("branches-list")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <form onSubmit={submit} className="mx-auto mt-8 flex max-w-3xl items-center gap-3">
      <div className="relative flex-1">
        <span className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-ink-soft"><SearchIcon /></span>
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={pick(locale, "ابحث بالمدينة أو اسم الفرع...", "Search by city or branch name...")}
          className="w-full rounded-xl border border-line bg-white py-3 pe-4 ps-11 text-start text-sm text-ink shadow-sm placeholder:text-ink-soft focus:outline-none focus:ring-2 focus:ring-brand/30"
        />
      </div>
      <button type="submit" className="flex shrink-0 items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark">
        <SearchIcon />
        {pick(locale, "بحث", "Search")}
      </button>
    </form>
  );
}
