"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getStats, type DashboardStats } from "@/lib/cms/api";

export default function CmsDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getStats().then(setStats).catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>;
  if (!stats) return <p className="text-ink-soft">جارٍ التحميل…</p>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-ink">لوحة التحكّم</h1>
        <p className="mt-1 text-sm text-ink-soft">نظرة عامة على محتوى الموقع والطلبات الواردة.</p>
      </div>

      {/* Totals */}
      <div className="grid gap-4 sm:grid-cols-3">
        <TotalCard label="إجمالي الطلبات والرسائل" value={stats.totals.submissions} tone="brand" />
        <TotalCard label="إجمالي عناصر المحتوى" value={stats.totals.content} tone="deep" />
        <TotalCard label="إعدادات الموقع" value={stats.totals.site_configured ? "مُهيّأة" : "غير مُهيّأة"} tone="soft" />
      </div>

      {/* Submissions */}
      <Section title="الطلبات والرسائل" href="/cms/submissions/contact">
        {stats.submissions.map((s) => (
          <CountCard key={s.key} label={s.label} count={s.count} href={`/cms/submissions/${s.key}`} />
        ))}
      </Section>

      {/* Content */}
      <Section title="محتوى الموقع">
        {stats.content.map((c) => (
          <CountCard key={c.key} label={c.label} count={c.count} href={`/cms/content/${c.key}`} />
        ))}
      </Section>

      {/* Home & sections */}
      <Section title="الصفحة الرئيسية والأقسام">
        {stats.home.map((h) => (
          <CountCard key={h.key} label={h.label} count={h.count} href={`/cms/content/${h.key}`} />
        ))}
      </Section>
    </div>
  );
}

function TotalCard({ label, value, tone }: { label: string; value: number | string; tone: "brand" | "deep" | "soft" }) {
  const bg = tone === "brand" ? "bg-brand text-white" : tone === "deep" ? "bg-brand-deep text-white" : "bg-white text-ink ring-1 ring-line";
  return (
    <div className={`rounded-2xl p-5 shadow-sm ${bg}`}>
      <p className={`text-sm ${tone === "soft" ? "text-ink-soft" : "text-white/80"}`}>{label}</p>
      <p className="mt-2 text-3xl font-extrabold">{value}</p>
    </div>
  );
}

function Section({ title, href, children }: { title: string; href?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-bold text-ink">{title}</h2>
        {href && <Link href={href} className="text-xs font-semibold text-brand hover:text-brand-dark">عرض الكل ←</Link>}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{children}</div>
    </div>
  );
}

function CountCard({ label, count, href }: { label: string; count: number; href: string }) {
  return (
    <Link href={href} className="group flex items-center justify-between rounded-2xl bg-white p-5 shadow-sm ring-1 ring-line transition-all hover:-translate-y-0.5 hover:shadow-md hover:ring-brand/40">
      <div>
        <p className="text-sm font-semibold text-ink">{label}</p>
        <p className="mt-1 text-2xl font-extrabold text-brand">{count}</p>
      </div>
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/10 text-brand transition-colors group-hover:bg-brand group-hover:text-white">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="dir-flip"><path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" /></svg>
      </span>
    </Link>
  );
}
