"use client";

import { useEffect, useState } from "react";
import { getAnalytics, getTraffic, getSeo, type Analytics, type AnalyticsBucket, type Traffic, type Seo } from "@/lib/cms/api";
import { useCmsLang } from "@/lib/cms/i18n";
import { BarChart, DonutChart, LineChart } from "@/components/cms/Chart";
import { labelTr } from "@/lib/cms/analyticsLabels";

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

// كارت نسبة/قيمة نصية
function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white p-4 text-center shadow-sm ring-1 ring-[#e6eff0]">
      <div className="text-2xl font-extrabold text-ink">{value}</div>
      <div className="mt-0.5 text-xs text-ink-soft">{label}</div>
    </div>
  );
}

// كارت رسم بياني — نوع مناسب لكل مقياس: bar (أفقي) / column (رأسي) / donut
function ChartCard({ title, sub, data, type = "bar", height }: { title: string; sub?: string; data: AnalyticsBucket[]; type?: "bar" | "column" | "donut" | "line"; height?: number }) {
  const { lang } = useCmsLang();
  const en = lang === "en";
  // ترجمة قيم التسميات لتتبع لغة اللوحة (جهاز/قناة/جنس/مستوى/حالة/منطقة)
  const tData = data.map((d) => ({ ...d, label: labelTr(d.label, en) }));
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#e6eff0]">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <h3 className="text-base font-bold text-ink">{title}</h3>
        {sub && <span className="text-xs text-ink-soft">{sub}</span>}
      </div>
      {tData.length === 0 ? (
        <p className="py-8 text-center text-sm text-ink-soft">{en ? "No data yet" : "لا توجد بيانات بعد"}</p>
      ) : type === "donut" ? (
        <DonutChart data={tData} />
      ) : type === "line" ? (
        <LineChart data={tData} />
      ) : (
        <BarChart data={tData} horizontal={type === "bar"} height={height ?? (type === "bar" ? Math.max(170, data.length * 40) : 220)} />
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
  const [traffic, setTraffic] = useState<Traffic | null>(null);
  const [seo, setSeo] = useState<Seo | null>(null);

  useEffect(() => {
    getAnalytics().then(setData).catch((e) => setErr(e instanceof Error ? e.message : "error"));
    getTraffic().then(setTraffic).catch(() => setTraffic({ connected: false }));
    getSeo().then(setSeo).catch(() => setSeo({ connected: false }));
  }, []);

  const fmtSec = (s: number) => {
    const m = Math.floor(s / 60), sec = Math.round(s % 60);
    return m ? `${m}${t("د", "m")} ${sec}${t("ث", "s")}` : `${sec}${t("ث", "s")}`;
  };

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

      {/* ===== زيارات الموقع (GA4) ===== */}
      {traffic && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 pt-1">
            <h2 className="text-lg font-bold text-ink">{t("زيارات الموقع (GA4)", "Website Traffic (GA4)")}</h2>
            {traffic.connected && <span className="rounded-md bg-[#e7f7ef] px-2 py-0.5 text-[11px] font-bold text-[#12855c]">{t("مباشر", "Live")}</span>}
            <span className="text-xs text-ink-soft">{t("آخر 28 يومًا", "Last 28 days")}</span>
          </div>
          {traffic.connected && traffic.totals ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Stat value={traffic.totals.sessions} label={t("الجلسات", "Sessions")} tint={C.teal} icon={<I size={20}><path d="M3 3v18h18" /><path d="m7 14 4-4 3 3 5-6" /></I>} />
                <Stat value={traffic.totals.users} label={t("المستخدمون", "Users")} tint={C.deep} icon={<I size={20}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /></I>} />
                <Stat value={traffic.totals.new_users} label={t("مستخدمون جدد", "New Users")} tint={C.blue} icon={<I size={20}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M19 8v6M22 11h-6" /></I>} />
                <Stat value={traffic.totals.views} label={t("مشاهدات الصفحات", "Page Views")} tint={C.violet} icon={<I size={20}><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></I>} />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <MiniStat label={t("معدل التفاعل", "Engagement Rate")} value={`${traffic.totals.engagement_rate}%`} />
                <MiniStat label={t("معدل الارتداد", "Bounce Rate")} value={`${traffic.totals.bounce_rate}%`} />
                <MiniStat label={t("متوسط زمن التفاعل", "Avg. Engagement")} value={fmtSec(traffic.totals.avg_engagement_sec)} />
              </div>
              {traffic.trend && traffic.trend.length > 1 && (
                <ChartCard title={t("اتجاه الجلسات", "Sessions Trend")} sub={t("الجلسات يوميًا", "sessions per day")} data={traffic.trend} type="line" />
              )}
              <div className="grid gap-4 lg:grid-cols-2">
                <ChartCard title={t("حسب الجهاز", "By Device")} data={traffic.by_device || []} type="donut" />
                <ChartCard title={t("حسب القناة", "By Channel")} data={traffic.by_channel || []} type="donut" />
                <ChartCard title={t("حسب المدينة", "By City")} data={traffic.by_city || []} type="bar" />
                <ChartCard title={t("أكثر الصفحات دخولاً", "Top Landing Pages")} data={(traffic.top_landing || []).map((p) => ({ label: en ? p.label_en : p.label_ar, count: p.count }))} type="bar" />
              </div>

              {traffic.events && (
                <>
                  <h3 className="pt-1 text-base font-bold text-ink">{t("تفاعلات الزوّار (أحداث)", "Visitor Actions (events)")}</h3>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Stat value={traffic.events.whatsapp_click || 0} label={t("ضغطات واتساب", "WhatsApp Clicks")} tint={C.teal} icon={<I size={20}><path d="M3 21l1.9-5.6A9 9 0 1 1 12 21a9 9 0 0 1-4.5-1.2L3 21z" /></I>} />
                    <Stat value={traffic.events.phone_click || 0} label={t("ضغطات الهاتف", "Phone Clicks")} tint={C.deep} icon={<I size={20}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.6a2 2 0 0 1-.5 2.1L8 9.6a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.8.3 1.7.6 2.6.7a2 2 0 0 1 1.7 2z" /></I>} />
                    <Stat value={traffic.events.email_click || 0} label={t("ضغطات الإيميل", "Email Clicks")} tint={C.blue} icon={<I size={20}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></I>} />
                    <Stat value={traffic.events.smart_search || 0} label={t("عمليات البحث الذكي", "Smart Searches")} tint={C.violet} icon={<I size={20}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></I>} />
                  </div>
                  <div className="grid gap-4 lg:grid-cols-2">
                    <ChartCard title={t("أزرار التواصل", "Contact Actions")} data={[
                      { label: t("طلب التحاق", "Lead"), count: traffic.events.generate_lead || 0 },
                      { label: t("واتساب", "WhatsApp"), count: traffic.events.whatsapp_click || 0 },
                      { label: t("اتصال", "Phone"), count: traffic.events.phone_click || 0 },
                      { label: t("إيميل", "Email"), count: traffic.events.email_click || 0 },
                    ]} type="bar" />
                    <ChartCard title={t("التقييم: بدء مقابل إكمال", "Assessment: Starts vs Completions")} data={[
                      { label: t("بدء التقييم", "Starts"), count: traffic.events.assessment_start || 0 },
                      { label: t("إكمال التقييم", "Completions"), count: traffic.events.assessment_complete || 0 },
                    ]} type="column" />
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
              {t("لم يتم الاتصال بـGoogle Analytics بعد أو لا توجد بيانات كافية.", "Google Analytics is not connected yet, or there isn't enough data.")}
            </div>
          )}
        </div>
      )}

      {/* ===== أداء البحث (SEO) ===== */}
      {seo && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 pt-1">
            <h2 className="text-lg font-bold text-ink">{t("أداء البحث في جوجل (SEO)", "Google Search Performance (SEO)")}</h2>
            {seo.connected && <span className="rounded-md bg-[#e7f7ef] px-2 py-0.5 text-[11px] font-bold text-[#12855c]">{t("مباشر", "Live")}</span>}
            <span className="text-xs text-ink-soft">{t("آخر 28 يومًا", "Last 28 days")}</span>
          </div>
          {!seo.connected ? (
            <div className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700">{t("لم يتم الربط بـSearch Console بعد.", "Search Console is not connected yet.")}</div>
          ) : seo.totals && (seo.totals.impressions > 0 || (seo.top_queries?.length ?? 0) > 0) ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <MiniStat label={t("النقرات", "Clicks")} value={seo.totals.clicks.toLocaleString("en-US")} />
                <MiniStat label={t("مرات الظهور", "Impressions")} value={seo.totals.impressions.toLocaleString("en-US")} />
                <MiniStat label={t("نسبة النقر (CTR)", "CTR")} value={`${seo.totals.ctr}%`} />
                <MiniStat label={t("متوسط الترتيب", "Avg. Position")} value={String(seo.totals.position)} />
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#e6eff0]">
                  <h3 className="mb-3 text-base font-bold text-ink">{t("أكثر كلمات البحث", "Top Search Queries")}</h3>
                  {(seo.top_queries?.length ?? 0) === 0 ? (
                    <p className="py-8 text-center text-sm text-ink-soft">{t("لا توجد بيانات بعد", "No data yet")}</p>
                  ) : (
                    <table className="w-full table-fixed border-collapse text-sm">
                      <thead>
                        <tr className="text-[11px] uppercase tracking-wide text-ink-soft">
                          <th className="w-[46%] pb-2.5 text-start font-bold">{t("الكلمة", "Query")}</th>
                          <th className="pb-2.5 text-center font-bold">{t("نقرات", "Clicks")}</th>
                          <th className="pb-2.5 text-center font-bold">{t("ظهور", "Impr.")}</th>
                          <th className="pb-2.5 text-center font-bold">{t("الترتيب", "Pos.")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(seo.top_queries || []).map((q) => (
                          <tr key={q.label} className="border-t border-[#eef4f5] transition-colors hover:bg-[#f7fbfb]">
                            <td className="truncate py-2.5 pe-3 font-medium text-ink" title={q.label}>{q.label}</td>
                            <td className="py-2.5 text-center font-bold tabular-nums text-[#0F6C73]">{q.clicks}</td>
                            <td className="py-2.5 text-center tabular-nums text-ink-soft">{q.impressions}</td>
                            <td className="py-2.5 text-center"><span className="inline-block min-w-[32px] rounded-md bg-[#eef4f5] px-1.5 py-0.5 text-xs font-bold tabular-nums text-[#0F6C73]">{q.position}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </section>
                <ChartCard title={t("أكثر الصفحات ظهورًا في البحث", "Top Pages in Search")} sub={t("حسب مرات الظهور", "by impressions")} data={(seo.top_pages || []).map((p) => ({ label: en ? p.label_en : p.label_ar, count: p.impressions }))} type="bar" />
              </div>
            </>
          ) : (
            <div className="rounded-xl bg-[#eef6f6] px-4 py-3 text-sm text-[#0d5b60]">{t("تم الربط بنجاح ✓ — Search Console بدأ يجمع البيانات، وستظهر الأرقام خلال يوم إلى يومين.", "Connected ✓ — Search Console has started collecting; figures appear within 1–2 days.")}</div>
          )}
        </div>
      )}

      {err && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{err}</div>}
      {!data && !err && <div className="py-10 text-center text-sm text-ink-soft">{t("جارٍ التحميل…", "Loading…")}</div>}

      {/* عنوان قسم بيانات النظام */}
      {data && <h2 className="pt-2 text-lg font-bold text-ink">{t("طلبات النظام (CMS)", "System Requests (CMS)")}</h2>}

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
            <ChartCard title={t("حسب الفرع", "By Branch")} data={data.admissions_by_branch} type="bar" />
            <ChartCard title={t("حسب المدينة", "By City")} data={data.admissions_by_city} type="bar" />
            <ChartCard title={t("حسب نوع الحالة", "By Case Type")} data={data.admissions_by_case_type} type="bar" />
            <ChartCard title={t("حسب الفئة العمرية", "By Age Band")} data={data.admissions_by_age} type="column" />
            <ChartCard title={t("حسب الجنس", "By Gender")} data={data.admissions_by_gender} type="donut" />
          </div>

          {/* التقييمات */}
          <h2 className="pt-2 text-lg font-bold text-ink">{t("التقييمات", "Assessments")}</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            <ChartCard title={t("حسب نوع التقييم", "By Assessment Type")} data={data.assessments_by_type} type="bar" />
            <ChartCard title={t("حسب مستوى الحالة", "By Level")} data={data.assessments_by_level} type="donut" />
          </div>

          {/* التوظيف */}
          <h2 className="pt-2 text-lg font-bold text-ink">{t("التوظيف", "Recruitment")}</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            <ChartCard title={t("المتقدّمون حسب المدينة", "Applicants by City")} data={data.careers_by_city} type="bar" />
            <ChartCard title={t("المتقدّمون حسب الوظيفة", "Applicants by Position")} data={data.careers_by_position} type="bar" />
          </div>
          {data.careers_trend.length > 1 && (
            <ChartCard title={t("اتجاه طلبات التوظيف", "Applications Trend")} sub={t("أسبوعيًا", "by week")} data={data.careers_trend} type="line" />
          )}

          {/* إشارات الطلب / فرص التوسّع */}
          <h2 className="pt-2 text-lg font-bold text-ink">{t("إشارات الطلب", "Demand Signals")}</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#e6eff0]">
              <h3 className="text-base font-bold text-ink">{t("طلبات من مدن بلا فرع", "Requests from Unserved Cities")}</h3>
              <p className="mt-1 text-xs text-ink-soft">{t("فرص توسّع محتملة", "Potential expansion opportunities")}</p>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-ink">{data.branch_city_mismatch.pct}<span className="text-lg">%</span></span>
                <span className="text-sm text-ink-soft">{t(`من الطلبات (${data.branch_city_mismatch.unserved} من ${data.branch_city_mismatch.total})`, `of requests (${data.branch_city_mismatch.unserved} of ${data.branch_city_mismatch.total})`)}</span>
              </div>
              {data.branch_city_mismatch.top.length > 0 ? (
                <div className="mt-3 overflow-x-auto"><table className="w-full text-sm">
                  <thead><tr className="text-ink-soft"><th className="pb-2 text-start font-semibold">{t("المدينة (بلا فرع)", "City (no branch)")}</th><th className="pb-2 text-end font-semibold">{t("الطلبات", "Requests")}</th></tr></thead>
                  <tbody>{data.branch_city_mismatch.top.map((c) => <tr key={c.label} className="border-t border-[#eef4f5]"><td className="py-2 text-ink">{labelTr(c.label, en)}</td><td className="py-2 text-end font-bold">{c.count}</td></tr>)}</tbody>
                </table></div>
              ) : (
                <p className="py-6 text-center text-sm text-ink-soft">{t("كل الطلبات من مدن بها فروع ✓", "All requests are from served cities ✓")}</p>
              )}
            </section>
          </div>
        </>
      )}
    </div>
  );
}
