"use client";

import { useEffect, useState } from "react";
import { getAnalytics, type Analytics, type AnalyticsBucket } from "@/lib/cms/api";
import { useCmsLang } from "@/lib/cms/i18n";

function I({ children, size = 18 }: { children: React.ReactNode; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">{children}</svg>;
}

// كارت رقم إجمالي
function Stat({ value, label, icon, tint }: { value: number; label: string; icon: React.ReactNode; tint: string }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#e6eff0]">
      <div className="flex items-center justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl text-white" style={{ background: tint }}>{icon}</span>
      </div>
      <div className="mt-3 text-3xl font-extrabold text-ink">{value.toLocaleString("en-US")}</div>
      <div className="mt-0.5 text-sm text-ink-soft">{label}</div>
    </div>
  );
}

// رسم أعمدة أفقية
function BarChart({ title, sub, data, color }: { title: string; sub?: string; data: AnalyticsBucket[]; color: string }) {
  const { lang } = useCmsLang();
  const en = lang === "en";
  const max = Math.max(1, ...data.map((d) => d.count));
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#e6eff0]">
      <div className="mb-1 flex items-baseline justify-between gap-3">
        <h3 className="text-base font-bold text-ink">{title}</h3>
        {sub && <span className="text-xs text-ink-soft">{sub}</span>}
      </div>
      {data.length === 0 ? (
        <p className="py-8 text-center text-sm text-ink-soft">{en ? "No data yet" : "لا توجد بيانات بعد"}</p>
      ) : (
        <div className="mt-3 space-y-2.5">
          {data.map((d) => (
            <div key={d.label} className="flex items-center gap-3">
              <span className="w-28 shrink-0 truncate text-[13px] text-ink-soft" title={d.label}>{d.label}</span>
              <div className="relative h-6 flex-1 overflow-hidden rounded-md bg-[#f1f6f6]">
                <div className="absolute inset-y-0 start-0 rounded-md transition-all" style={{ width: `${(d.count / max) * 100}%`, background: color, minWidth: d.count ? "6px" : 0 }} />
              </div>
              <span className="w-8 shrink-0 text-end text-[13px] font-bold text-ink">{d.count}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default function AnalyticsPage() {
  const { lang } = useCmsLang();
  const en = lang === "en";
  const t = (ar: string, e: string) => (en ? e : ar);

  const [data, setData] = useState<Analytics | null>(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    getAnalytics().then(setData).catch((e) => setErr(e instanceof Error ? e.message : "error"));
  }, []);

  const C = { teal: "#1FA6A8", deep: "#0F6C73", blue: "#3B82F6", violet: "#7C6CC4", amber: "#E0A64B", rose: "#D96A8B" };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* الترويسة */}
      <div className="flex items-center gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0F6C73] to-[#1FA6A8] text-white shadow-sm">
          <I size={24}><path d="M3 3v18h18" /><rect x="7" y="12" width="3" height="5" rx="1" /><rect x="12" y="8" width="3" height="9" rx="1" /><rect x="17" y="5" width="3" height="12" rx="1" /></I>
        </span>
        <div>
          <h1 className="text-2xl font-extrabold text-ink">{t("التحليلات", "Analytics")}</h1>
          <p className="mt-1 text-sm text-ink-soft">{t("أرقام الطلبات والتقييمات والتوظيف من قاعدة بياناتك مباشرة.", "Requests, assessments, and recruitment figures straight from your database.")}</p>
        </div>
      </div>

      {/* ملاحظة المصدر */}
      <div className="flex items-start gap-2 rounded-xl bg-[#eef6f6] px-4 py-3 text-sm text-[#0d5b60]">
        <span className="mt-0.5 shrink-0"><I size={16}><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></I></span>
        <span>{t("هذه الأرقام من نظامك (CMS) وتتحدّث فورًا مع كل طلب جديد. أقسام الزيارات وبحث جوجل ستُضاف قريبًا.", "These figures come from your own system (CMS) and update instantly with every new request. Traffic and Google-search sections are coming soon.")}</span>
      </div>

      {err && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{err}</div>}
      {!data && !err && <div className="py-10 text-center text-sm text-ink-soft">{t("جارٍ التحميل…", "Loading…")}</div>}

      {data && (
        <>
          {/* الإجماليات */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat value={data.totals.admissions} label={t("طلبات الالتحاق", "Admission Requests")} tint={C.teal} icon={<I size={20}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M19 8v6M22 11h-6" /></I>} />
            <Stat value={data.totals.assessments} label={t("نتائج التقييم", "Assessments")} tint={C.deep} icon={<I size={20}><rect x="8" y="3" width="8" height="4" rx="1" /><path d="M9 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3" /></I>} />
            <Stat value={data.totals.contacts} label={t("رسائل التواصل", "Contact Messages")} tint={C.blue} icon={<I size={20}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></I>} />
            <Stat value={data.totals.careers} label={t("طلبات التوظيف", "Job Applications")} tint={C.violet} icon={<I size={20}><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></I>} />
          </div>

          {/* طلبات الالتحاق */}
          <h2 className="pt-2 text-lg font-bold text-ink">{t("طلبات الالتحاق", "Admission Requests")}</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            <BarChart title={t("حسب الفرع", "By Branch")} data={data.admissions_by_branch} color={C.teal} />
            <BarChart title={t("حسب المدينة", "By City")} data={data.admissions_by_city} color={C.deep} />
            <BarChart title={t("حسب نوع الحالة", "By Case Type")} data={data.admissions_by_case_type} color={C.violet} />
            <BarChart title={t("حسب الفئة العمرية", "By Age Band")} data={data.admissions_by_age} color={C.amber} />
            <BarChart title={t("حسب الجنس", "By Gender")} data={data.admissions_by_gender} color={C.rose} />
          </div>

          {/* التقييمات */}
          <h2 className="pt-2 text-lg font-bold text-ink">{t("التقييمات", "Assessments")}</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            <BarChart title={t("حسب نوع التقييم", "By Assessment Type")} data={data.assessments_by_type} color={C.teal} />
            <BarChart title={t("حسب مستوى الحالة", "By Level")} data={data.assessments_by_level} color={C.blue} />
          </div>

          {/* التوظيف */}
          <h2 className="pt-2 text-lg font-bold text-ink">{t("التوظيف", "Recruitment")}</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            <BarChart title={t("المتقدّمون حسب المدينة", "Applicants by City")} data={data.careers_by_city} color={C.deep} />
            <BarChart title={t("المتقدّمون حسب الوظيفة", "Applicants by Position")} data={data.careers_by_position} color={C.violet} />
          </div>
        </>
      )}
    </div>
  );
}
