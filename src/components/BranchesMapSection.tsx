"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { pick, type Locale } from "@/i18n/config";
import type { Branch } from "@/lib/branchesData";

type Region = { name: string; count: number; color: string };

// مواضع الدبابيس على الخريطة (مرتبطة بالمناطق عبر اللون)
const PINS = [
  { top: "52%", left: "58%", color: "#2cbcc8" },
  { top: "46%", left: "55%", color: "#3b82f6" },
  { top: "30%", left: "48%", color: "#ef4444" },
  { top: "40%", left: "40%", color: "#8b5cf6" },
  { top: "60%", left: "33%", color: "#3b82f6" },
  { top: "33%", left: "62%", color: "#f59e0b" },
  { top: "44%", left: "30%", color: "#ec4899" },
  { top: "62%", left: "52%", color: "#10b981" },
];

const norm = (s: string) => (s || "").replace(/جده/g, "جدة").replace(/المنطقة|المكرمة|المنورة/g, "").trim();

export default function BranchesMapSection({ locale, branches, regions }: { locale: Locale; branches: Branch[]; regions: Region[] }) {
  const [selected, setSelected] = useState(regions[0]?.name ?? "");
  const [open, setOpen] = useState(true);

  // فروع المنطقة المختارة
  const regionBranches = useMemo(() => {
    const key = norm(selected);
    if (!key) return [] as Branch[];
    return branches.filter((b) => norm(`${b.region} ${b.city} ${b.area}`).includes(key) || key.includes(norm(b.city)));
  }, [branches, selected]);

  const branch = regionBranches[0];
  const colorOf = (name: string) => regions.find((r) => r.name === name)?.color ?? "#2cbcc8";
  const countOf = (name: string) => regions.find((r) => r.name === name)?.count ?? 0;

  const pickRegion = (name: string) => {
    setSelected(name);
    setOpen(true);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-line shadow-sm">
      <div className="relative aspect-[1233/600] w-full">
        <Image src="/figma/branches-map.png" alt={pick(locale, "خريطة مراكز عبور في المملكة", "Map of Oboor centers across the Kingdom")} fill className="object-cover" sizes="100vw" />

        {/* Pins (clickable) */}
        {PINS.map((p, i) => {
          const region = regions.find((r) => r.color === p.color);
          const active = region && region.name === selected;
          return (
            <button
              key={i}
              type="button"
              onClick={() => region && pickRegion(region.name)}
              aria-label={region?.name ?? pick(locale, "فرع", "Branch")}
              className="absolute -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-125"
              style={{ top: p.top, left: p.left }}
            >
              <span className={`block rounded-full border-2 border-white shadow ${active ? "h-5 w-5 ring-2 ring-white" : "h-3.5 w-3.5"}`} style={{ background: p.color }} />
            </button>
          );
        })}

        {/* Legend (clickable regions) */}
        <div className="absolute right-4 top-4 hidden w-48 rounded-xl bg-white/95 p-3 shadow-lg backdrop-blur sm:block">
          <p className="mb-2 border-b border-line pb-1.5 text-start text-xs font-bold text-ink">{pick(locale, "المناطق", "Regions")}</p>
          <ul className="space-y-0.5">
            {regions.map((r) => (
              <li key={r.name}>
                <button
                  type="button"
                  onClick={() => pickRegion(r.name)}
                  className={`flex w-full items-center justify-between rounded-lg px-2 py-1 text-[11px] transition-colors ${r.name === selected ? "bg-brand/10 font-bold" : "hover:bg-surface"}`}
                >
                  <span className={r.name === selected ? "text-brand" : "text-ink-soft"}>{r.count}</span>
                  <span className={`flex items-center gap-1.5 ${r.name === selected ? "text-brand" : "text-ink-muted"}`}>
                    {r.name}
                    <span className="h-2 w-2 rounded-full" style={{ background: r.color }} />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Branch popup (dynamic) — يظهر دائماً عند اختيار منطقة */}
        {open && selected && (
          <div className="absolute left-1/2 top-1/2 w-[300px] max-w-[88%] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-4 shadow-2xl">
            <div className="flex items-start justify-between">
              <button type="button" onClick={() => setOpen(false)} className="text-ink-soft hover:text-ink" aria-label={pick(locale, "إغلاق", "Close")}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
              <div className="flex items-center gap-1.5">
                {branch?.isNew && <span className="rounded-md bg-brand/10 px-2 py-0.5 text-[10px] font-bold text-brand">{pick(locale, "جديد", "New")}</span>}
                <span className="flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold" style={{ background: `${colorOf(selected)}1a`, color: colorOf(selected) }}>
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: colorOf(selected) }} />
                  {selected}
                </span>
              </div>
            </div>

            {branch ? (
              <>
                <h3 className="mt-1 text-start text-base font-bold text-ink">{branch.name}</h3>
                <p className="mt-1 text-start text-xs leading-5 text-ink-muted">{branch.address}</p>
                <p className="mt-2 flex items-center justify-start gap-1.5 text-start text-xs text-ink-soft"><ClockIcon />{branch.hours}</p>
                <p className="mt-1 flex items-center justify-start gap-1.5 text-start text-xs text-ink-soft" dir="ltr"><PhoneIcon />{branch.phone}</p>
                {regionBranches.length > 1 && (
                  <p className="mt-1 text-start text-[11px] text-brand">{pick(locale, `+${regionBranches.length - 1} فرع آخر في ${selected}`, `+${regionBranches.length - 1} more in ${selected}`)}</p>
                )}
                <div className="mt-3 flex items-center gap-2">
                  <Link href={`/branches/${branch.slug}`} className="flex-1 rounded-lg bg-brand py-2 text-center text-xs font-semibold text-white transition-colors hover:bg-brand-dark">{pick(locale, "عرض التفاصيل", "View Details")}</Link>
                  <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${branch.name} ${branch.address}`)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 rounded-lg border border-brand px-3 py-2 text-xs font-semibold text-brand transition-colors hover:bg-brand/5">{pick(locale, "الاتجاهات", "Directions")}<NavIcon /></a>
                </div>
              </>
            ) : (
              <>
                <h3 className="mt-1 text-start text-base font-bold text-ink">{pick(locale, `منطقة ${selected}`, selected)}</h3>
                <p className="mt-1 text-start text-xs leading-5 text-ink-muted">{pick(locale, `لدينا ${countOf(selected)} فرع في هذه المنطقة.`, `We have ${countOf(selected)} branches in this region.`)}</p>
                <Link href="/branches" className="mt-3 flex items-center justify-center gap-1 rounded-lg bg-brand py-2 text-center text-xs font-semibold text-white transition-colors hover:bg-brand-dark">{pick(locale, "تصفّح كل الفروع", "Browse all branches")}</Link>
              </>
            )}
          </div>
        )}

        {/* Count badge */}
        <span className="absolute bottom-4 left-4 rounded-lg bg-brand px-3 py-1.5 text-xs font-bold text-white shadow">{pick(locale, "42 فرع", "42 Branches")}</span>
      </div>
    </div>
  );
}

function ClockIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" strokeLinecap="round" /></svg>;
}
function PhoneIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" /></svg>;
}
function NavIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>;
}
