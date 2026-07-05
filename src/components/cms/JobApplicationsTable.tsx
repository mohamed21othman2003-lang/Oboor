"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import CustomSelect from "@/components/ui/Select";
import { type CmsItem, type FieldSchema } from "@/lib/cms/api";
import { exportSheet } from "@/lib/cms/exportSheet";
import { useCmsLang } from "@/lib/cms/i18n";
import StatCounter from "@/components/cms/StatCounter";

/* ===== جدول طلبات التوظيف (CRM) — ديزاين فقط، نفس البيانات والأكشنز ===== */

const MONTHS_AR = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
const MONTHS_EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
function stamp(iso: string, en = false): { date: string; time: string } {
  if (!iso) return { date: "—", time: "" };
  const d = new Date(iso);
  if (isNaN(d.getTime())) return { date: iso, time: "" };
  const h = d.getHours();
  const am = h < 12;
  const h12 = h % 12 === 0 ? 12 : h % 12;
  const months = en ? MONTHS_EN : MONTHS_AR;
  return { date: `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`, time: `${h12}:${String(d.getMinutes()).padStart(2, "0")} ${en ? (am ? "AM" : "PM") : (am ? "ص" : "م")}` };
}
const uniq = (a: string[]) => [...new Set(a.filter(Boolean))];

const I = {
  search: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>,
  reset: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></svg>,
  sort: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5h10M11 9h7M11 13h4M3 17l3 3 3-3M6 20V4" /></svg>,
  inbox: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-6l-2 3h-4l-2-3H2" /><path d="M5.5 5.5 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.5-6.5A2 2 0 0 0 16.8 4H7.2a2 2 0 0 0-1.7 1.5z" /></svg>,
  export: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M7 10l5 5 5-5" /><path d="M12 15V3" /></svg>,
  cal: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>,
  clock: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" strokeLinecap="round" /></svg>,
  pin: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>,
  file: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg>,
  more: <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="12" cy="19" r="2" /></svg>,
  eye: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></svg>,
  copy: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>,
  check: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>,
  wa: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.5A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.7-.1-.4-.1-.9-.3-1.6-.6-2.7-1.2-4.5-4-4.6-4.2-.1-.2-1.1-1.5-1.1-2.8s.7-2 .9-2.2c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.1.1.3 0 .5l-.4.5-.3.3c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.6-.1l.7-.9c.2-.2.4-.2.6-.1l1.8.9c.2.1.4.2.5.3.1.2.1.7-.1 1.1z" /></svg>,
  mail: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>,
  trash: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>,
  x: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>,
  open: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M8 7h9v9" /></svg>,
};

export default function JobApplicationsTable({
  items,
  fields,
  label,
  onDelete,
  busy,
}: {
  items: CmsItem[];
  fields: FieldSchema[];
  label: string;
  onDelete: (id: number) => Promise<void>;
  busy: number | null;
}) {
  const { lang } = useCmsLang();
  const en = lang === "en";
  const t = (ar: string, e: string) => (en ? e : ar);

  const v = (it: CmsItem, k: string) => { const x = it[k]; return x === null || x === undefined ? "" : String(x); };

  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const [job, setJob] = useState("");
  const [range, setRange] = useState("");
  const [sort, setSort] = useState("newest");
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [menu, setMenu] = useState<number | null>(null);
  const [copied, setCopied] = useState<number | null>(null);
  const [viewing, setViewing] = useState<CmsItem | null>(null);

  const cityOpts = useMemo(() => [{ value: "", label: t("كل المدن", "All Cities") }, ...uniq(items.map((it) => v(it, "city"))).map((c) => ({ value: c, label: c }))], [items, en]);
  const jobOpts = useMemo(() => [{ value: "", label: t("كل الوظائف", "All Positions") }, ...uniq(items.map((it) => v(it, "job"))).map((j) => ({ value: j, label: j }))], [items, en]);
  const rangeOpts = [
    { value: "", label: t("كل الوقت", "All Time") },
    { value: "today", label: t("اليوم", "Today") },
    { value: "7", label: t("آخر ٧ أيام", "Last 7 Days") },
    { value: "30", label: t("آخر ٣٠ يوم", "Last 30 Days") },
  ];
  const sortOpts = [
    { value: "newest", label: t("الأحدث أولاً", "Newest first") },
    { value: "oldest", label: t("الأقدم أولاً", "Oldest first") },
    { value: "alpha", label: t("أبجديًا (الاسم)", "Alphabetical (name)") },
    { value: "job", label: t("حسب الوظيفة", "By position") },
    { value: "city", label: t("حسب المدينة", "By city") },
  ];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const now = new Date();
    return items.filter((it) => {
      if (q && !`${v(it, "name")} ${v(it, "email")} ${v(it, "phone")}`.toLowerCase().includes(q)) return false;
      if (city && v(it, "city") !== city) return false;
      if (job && v(it, "job") !== job) return false;
      if (range) {
        const c = new Date(v(it, "created_at"));
        if (isNaN(c.getTime())) return false;
        if (range === "today") {
          if (c.getFullYear() !== now.getFullYear() || c.getMonth() !== now.getMonth() || c.getDate() !== now.getDate()) return false;
        } else if ((now.getTime() - c.getTime()) / 86400000 > Number(range)) return false;
      }
      return true;
    });
  }, [items, query, city, job, range]);

  const counts = useMemo(() => {
    const now = new Date();
    const sameDay = (c: Date) => c.getFullYear() === now.getFullYear() && c.getMonth() === now.getMonth() && c.getDate() === now.getDate();
    let today = 0, week = 0;
    for (const it of items) {
      const c = new Date(v(it, "created_at"));
      if (isNaN(c.getTime())) continue;
      if (sameDay(c)) today++;
      if ((now.getTime() - c.getTime()) / 86400000 <= 7) week++;
    }
    return { total: items.length, today, week };
  }, [items]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    const time = (it: CmsItem) => { const d = new Date(v(it, "created_at")); return isNaN(d.getTime()) ? 0 : d.getTime(); };
    const coll = en ? "en" : "ar";
    switch (sort) {
      case "oldest": arr.sort((a, b) => time(a) - time(b)); break;
      case "alpha": arr.sort((a, b) => v(a, "name").localeCompare(v(b, "name"), coll)); break;
      case "job": arr.sort((a, b) => v(a, "job").localeCompare(v(b, "job"), coll) || time(b) - time(a)); break;
      case "city": arr.sort((a, b) => v(a, "city").localeCompare(v(b, "city"), coll) || time(b) - time(a)); break;
      default: arr.sort((a, b) => time(b) - time(a)); // newest
    }
    return arr;
  }, [filtered, sort, en]);

  const total = sorted.length;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const cur = Math.min(page, pages);
  const startIdx = (cur - 1) * perPage;
  const pageItems = sorted.slice(startIdx, startIdx + perPage);

  const resetFilters = () => { setQuery(""); setCity(""); setJob(""); setRange(""); setSort("newest"); setPage(1); };
  const onFilter = (fn: () => void) => { fn(); setPage(1); };
  const copyPhone = (id: number, phone: string) => navigator.clipboard?.writeText(phone).then(() => { setCopied(id); setTimeout(() => setCopied((c) => (c === id ? null : c)), 1500); });
  const del = async (id: number) => { setMenu(null); if (!confirm(t("حذف هذا الطلب نهائياً؟", "Permanently delete this application?"))) return; await onDelete(id); };

  const exportCsv = async () => {
    const cols: [string, (it: CmsItem) => string, boolean?][] = [
      [t("الاسم", "Name"), (it) => v(it, "name")], [t("البريد", "Email"), (it) => v(it, "email")], [t("الجوال", "Phone"), (it) => v(it, "phone")],
      [t("الوظيفة", "Position"), (it) => v(it, "job")], [t("المدينة", "City"), (it) => v(it, "city")], [t("المسمى الحالي", "Current Role"), (it) => v(it, "current_role")],
      [t("الخبرة", "Experience"), (it) => v(it, "experience")], [t("التاريخ", "Date"), (it) => v(it, "created_at")],
      [t("السيرة الذاتية", "CV/Resume"), (it) => v(it, "cv"), true],
    ];
    const dateHeader = t("التاريخ", "Date");
    await exportSheet({
      filename: "job-applications",
      sheetName: t("طلبات التوظيف", "Job Applications"),
      columns: cols.map(([header, , link]) => ({ header, link, date: header === dateHeader })),
      rows: sorted.map((it) => cols.map(([, acc]) => acc(it))),
    });
  };

  const actBtn = "flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-white transition-colors";
  const cvLink = (it: CmsItem) => {
    const cv = v(it, "cv");
    return cv ? <a href={cv} target="_blank" rel="noopener" onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-1 text-xs font-bold text-[#0F6C73] hover:text-[#1FA6A8]">{t("فتح الملف", "Open File")} {I.open}</a> : <span className="text-ink-soft">—</span>;
  };

  return (
    <div className="space-y-5">
      <div>
        <Link href="/cms" className="text-xs font-semibold text-[#0F6C73] hover:text-[#1FA6A8]">{t("← لوحة التحكّم", "← Dashboard")}</Link>
        <h1 className="mt-1 text-2xl font-extrabold text-ink">{label}</h1>
        <p className="mt-1 text-sm text-ink-soft">{t("عرض وإدارة جميع طلبات التوظيف الواردة", "View and manage all incoming job applications")}</p>
      </div>

      {/* عدّادات — قابلة للضغط للفلترة السريعة */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCounter icon={I.inbox} value={counts.total} label={t("إجمالي الطلبات", "Total applications")} active={range === ""} onClick={() => onFilter(() => setRange(""))} hint={t("عرض الكل", "Show all")} />
        <StatCounter icon={I.cal} value={counts.week} label={t("آخر ٧ أيام", "Last 7 days")} active={range === "7"} onClick={() => onFilter(() => setRange("7"))} hint={t("فلترة", "Filter")} />
        <StatCounter icon={I.clock} value={counts.today} label={t("طلبات اليوم", "Today's applications")} active={range === "today"} onClick={() => onFilter(() => setRange("today"))} hint={t("فلترة", "Filter")} />
      </div>

      {/* شريط الفلاتر والترتيب */}
      <div className="rounded-2xl border border-line bg-white p-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative min-w-[230px] flex-1">
            <input id="career-search" value={query} onChange={(e) => onFilter(() => setQuery(e.target.value))} placeholder={t("ابحث عن اسم أو بريد إلكتروني أو هاتف…", "Search by name, email or phone…")} className="w-full rounded-xl border border-line bg-surface/60 py-2.5 pe-12 ps-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20" />
            <button type="button" onClick={() => document.getElementById("career-search")?.focus()} aria-label={t("بحث", "Search")} title={t("بحث", "Search")} className="absolute inset-y-1 end-1 flex w-10 items-center justify-center rounded-lg bg-[#1FA6A8] text-white transition-colors hover:bg-[#0F6C73]">{I.search}</button>
          </div>
          <div className="w-[150px]"><CustomSelect value={range} onChange={(x) => onFilter(() => setRange(x))} options={rangeOpts} placeholder={t("كل الوقت", "All Time")} /></div>
          <div className="w-[160px]"><CustomSelect value={city} onChange={(x) => onFilter(() => setCity(x))} options={cityOpts} placeholder={t("كل المدن", "All Cities")} /></div>
          <div className="w-[180px]"><CustomSelect value={job} onChange={(x) => onFilter(() => setJob(x))} options={jobOpts} placeholder={t("كل الوظائف", "All Positions")} /></div>
          <div className="flex items-center gap-1.5">
            <span className="text-ink-soft">{I.sort}</span>
            <div className="w-[170px]"><CustomSelect value={sort} onChange={setSort} options={sortOpts} placeholder={t("ترتيب", "Sort")} /></div>
          </div>
          <button onClick={resetFilters} className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-white px-3.5 py-2.5 text-xs font-bold text-ink-soft transition-colors hover:bg-surface">{I.reset} {t("إعادة تعيين", "Reset")}</button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-ink-soft">{t("إجمالي الطلبات:", "Total applications:")} <span className="font-extrabold text-[#0F6C73]">{total}</span> {t("طلب", "application(s)")}</p>
        <button onClick={exportCsv} className="inline-flex items-center gap-1.5 rounded-xl bg-[#0F6C73] px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#1FA6A8]">{I.export} {t("تصدير", "Export")}</button>
      </div>

      {/* جدول (ديسكتوب) */}
      <div className="hidden overflow-hidden rounded-2xl border border-line bg-white shadow-sm lg:block">
        <div className="max-h-[70vh] overflow-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="sticky top-0 z-10 bg-surface text-ink-soft">
              <tr>
                <th className="px-4 py-3 text-start text-xs font-bold">{t("المتقدم", "Applicant")}</th>
                <th className="px-4 py-3 text-center text-xs font-bold">{t("الوظيفة", "Position")}</th>
                <th className="px-4 py-3 text-center text-xs font-bold">{t("المدينة", "City")}</th>
                <th className="px-4 py-3 text-center text-xs font-bold">{t("المسمى الحالي", "Current Role")}</th>
                <th className="px-4 py-3 text-center text-xs font-bold">{t("الخبرة", "Experience")}</th>
                <th className="px-4 py-3 text-center text-xs font-bold">{t("تاريخ التقديم", "Application Date")}</th>
                <th className="px-4 py-3 text-center text-xs font-bold">{t("السيرة الذاتية", "CV/Resume")}</th>
                <th className="px-4 py-3 text-center text-xs font-bold">{t("الإجراءات", "Actions")}</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-ink-soft">{t("لا توجد طلبات مطابقة.", "No matching applications.")}</td></tr>
              ) : pageItems.map((it) => {
                const name = v(it, "name") || `#${it.id}`;
                const phone = v(it, "phone");
                const email = v(it, "email");
                const wa = phone.replace(/[^\d]/g, "");
                const s = stamp(v(it, "created_at"), en);
                return (
                  <tr key={it.id} onClick={() => setViewing(it)} className="cursor-pointer border-t border-line transition-colors hover:bg-surface/50">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5 text-start">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1FA6A8]/12 text-sm font-extrabold text-[#0F6C73]">{name.charAt(0)}</span>
                        <div className="min-w-0">
                          <p className="font-bold text-ink">{name}</p>
                          {email && <p dir="ltr" className="mt-0.5 truncate text-end text-[11px] text-ink-soft">{email}</p>}
                          {phone && <p dir="ltr" className="text-end text-[11px] text-ink-soft">{phone}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-center font-semibold text-ink">{v(it, "job") || "—"}</td>
                    <td className="px-4 py-3.5 text-center"><span className="inline-flex items-center gap-1.5 text-ink"><span className="text-[#1FA6A8]">{I.pin}</span>{v(it, "city") || "—"}</span></td>
                    <td className="px-4 py-3.5 text-center text-ink">{v(it, "current_role") || "—"}</td>
                    <td className="px-4 py-3.5 text-center text-ink">{v(it, "experience") || "—"}</td>
                    <td className="px-4 py-3.5 text-center text-ink-soft">
                      <span className="flex items-center justify-center gap-1.5"><span className="text-[#1FA6A8]">{I.cal}</span>{s.date}</span>
                      {s.time && <span className="mt-0.5 flex items-center justify-center gap-1.5 text-xs"><span className="text-[#1FA6A8]">{I.clock}</span>{s.time}</span>}
                    </td>
                    <td className="px-4 py-3.5 text-center">{cvLink(it)}</td>
                    <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1.5">
                        {email && <a href={`mailto:${email}`} className={`${actBtn} text-[#1FA6A8] hover:border-[#1FA6A8] hover:bg-[#1FA6A8]/10`} title={t("إيميل", "Email")} aria-label={t("إيميل", "Email")}>{I.mail}</a>}
                        {wa && <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener" className={`${actBtn} text-[#25D366] hover:border-[#25D366] hover:bg-[#25D366]/10`} title={t("واتساب", "WhatsApp")} aria-label={t("واتساب", "WhatsApp")}>{I.wa}</a>}
                        <button onClick={() => setViewing(it)} className={`${actBtn} text-[#0F6C73] hover:border-[#1FA6A8] hover:bg-[#1FA6A8]/10`} title={t("عرض التفاصيل", "View Details")} aria-label={t("عرض التفاصيل", "View Details")}>{I.eye}</button>
                        <div className="relative">
                          <button onClick={() => setMenu(menu === it.id ? null : it.id)} className={`${actBtn} text-ink hover:bg-surface`} title={t("المزيد", "More")} aria-label={t("المزيد", "More")}>{I.more}</button>
                          {menu === it.id && (
                            <>
                              <div className="fixed inset-0 z-20" onClick={() => setMenu(null)} />
                              <div className="absolute end-0 z-30 mt-1 w-44 overflow-hidden rounded-xl border border-line bg-white py-1 shadow-xl">
                                <button onClick={() => { setMenu(null); setViewing(it); }} className="flex w-full items-center gap-2 px-3 py-2 text-start text-xs font-semibold text-ink transition-colors hover:bg-surface">{I.eye} {t("عرض التفاصيل", "View Details")}</button>
                                {v(it, "cv") && <a href={v(it, "cv")} target="_blank" rel="noopener" className="flex w-full items-center gap-2 px-3 py-2 text-start text-xs font-semibold text-[#0F6C73] transition-colors hover:bg-surface">{I.file} {t("فتح السيرة الذاتية", "Open CV/Resume")}</a>}
                                <button onClick={() => del(it.id)} disabled={busy === it.id} className="flex w-full items-center gap-2 px-3 py-2 text-start text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50">{I.trash}{busy === it.id ? t("جارٍ الحذف…", "Deleting…") : t("حذف الطلب", "Delete Application")}</button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* كروت (موبايل) */}
      <div className="space-y-3 lg:hidden">
        {pageItems.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line bg-white p-8 text-center text-ink-soft">{t("لا توجد طلبات مطابقة.", "No matching applications.")}</div>
        ) : pageItems.map((it) => {
          const name = v(it, "name") || `#${it.id}`;
          const phone = v(it, "phone");
          const email = v(it, "email");
          const wa = phone.replace(/[^\d]/g, "");
          const s = stamp(v(it, "created_at"), en);
          return (
            <div key={it.id} onClick={() => setViewing(it)} className="cursor-pointer rounded-2xl border border-line bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2.5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1FA6A8]/12 text-sm font-extrabold text-[#0F6C73]">{name.charAt(0)}</span>
                <div className="min-w-0">
                  <p className="font-bold text-ink">{name}</p>
                  <p className="truncate text-xs text-ink-soft">{v(it, "job") || "—"}</p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-ink-soft">
                <span className="inline-flex items-center gap-1.5"><span className="text-[#1FA6A8]">{I.pin}</span>{v(it, "city") || "—"}</span>
                <span>{v(it, "experience") || "—"}</span>
                <span className="inline-flex items-center gap-1.5"><span className="text-[#1FA6A8]">{I.cal}</span>{s.date} · {s.time}</span>
                <span onClick={(e) => e.stopPropagation()}>{cvLink(it)}</span>
              </div>
              <div className="mt-3 flex items-center gap-1.5 border-t border-line pt-3" onClick={(e) => e.stopPropagation()}>
                {email && <a href={`mailto:${email}`} className={`${actBtn} text-[#1FA6A8]`} aria-label={t("إيميل", "Email")}>{I.mail}</a>}
                {wa && <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener" className={`${actBtn} text-[#25D366]`} aria-label={t("واتساب", "WhatsApp")}>{I.wa}</a>}
                <button onClick={() => setViewing(it)} className={`${actBtn} text-[#0F6C73]`} aria-label={t("عرض التفاصيل", "View Details")}>{I.eye}</button>
                <button onClick={() => del(it.id)} disabled={busy === it.id} className="ms-auto inline-flex items-center gap-1.5 rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 disabled:opacity-50">{I.trash} {t("حذف", "Delete")}</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* الترقيم */}
      {total > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-white px-4 py-3 shadow-sm">
          <div className="flex items-center gap-2 text-xs text-ink-soft">
            <span>{t("عدد الصفوف:", "Rows per page:")}</span>
            <div className="w-[72px]"><CustomSelect value={String(perPage)} onChange={(x) => { setPerPage(Number(x)); setPage(1); }} options={[{ value: "10", label: "10" }, { value: "25", label: "25" }, { value: "50", label: "50" }]} /></div>
          </div>
          <p className="text-xs font-semibold text-ink-soft">{t("عرض", "Showing")} {total === 0 ? 0 : startIdx + 1} {t("إلى", "to")} {Math.min(startIdx + perPage, total)} {t("من", "of")} {total} {t("طلب", "application(s)")}</p>
          <div className="flex items-center gap-1" dir="ltr">
            <PgBtn onClick={() => setPage(1)} disabled={cur === 1}>«</PgBtn>
            <PgBtn onClick={() => setPage(cur - 1)} disabled={cur === 1}>‹</PgBtn>
            <span className="px-3 text-xs font-bold text-ink">{cur} / {pages}</span>
            <PgBtn onClick={() => setPage(cur + 1)} disabled={cur === pages}>›</PgBtn>
            <PgBtn onClick={() => setPage(pages)} disabled={cur === pages}>»</PgBtn>
          </div>
        </div>
      )}

      {/* نافذة التفاصيل */}
      {viewing && (() => {
        const it = viewing;
        const phone = v(it, "phone");
        const email = v(it, "email");
        const wa = phone.replace(/[^\d]/g, "");
        const s = stamp(v(it, "created_at"), en);
        const shown = fields.filter((f) => f.type !== "json" && v(it, f.name).trim() !== "");
        const rows = shown.filter((f) => f.type !== "textarea");
        const boxes = shown.filter((f) => f.type === "textarea");
        const removeAndClose = async () => { if (!confirm(t("حذف هذا الطلب نهائياً؟", "Permanently delete this application?"))) return; await onDelete(it.id); setViewing(null); };
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setViewing(null)}>
            <div className="max-h-[88vh] w-full max-w-2xl overflow-auto rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 flex items-start justify-between gap-3 border-b border-line bg-white px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1FA6A8]/12 text-lg font-extrabold text-[#0F6C73]">{(v(it, "name") || "#").charAt(0)}</span>
                  <div>
                    <p className="font-extrabold text-ink">{v(it, "name") || `#${it.id}`}</p>
                    <p className="mt-0.5 text-xs text-ink-soft">{v(it, "job")}{v(it, "job") && " · "}{s.date} · {s.time}</p>
                  </div>
                </div>
                <button onClick={() => setViewing(null)} className="flex h-9 w-9 items-center justify-center rounded-xl border border-line text-ink-soft transition-colors hover:bg-surface" aria-label={t("إغلاق", "Close")}>{I.x}</button>
              </div>

              <div className="flex flex-wrap gap-2 px-5 pt-4">
                {wa && <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 rounded-xl bg-[#25D366] px-3.5 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90">{I.wa} {t("واتساب", "WhatsApp")}</a>}
                {email && <a href={`mailto:${email}`} className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-white px-3.5 py-2 text-xs font-bold text-[#1FA6A8] transition-colors hover:bg-surface">{I.mail} {t("إيميل", "Email")}</a>}
                {phone && <button onClick={() => copyPhone(it.id, phone)} className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-white px-3.5 py-2 text-xs font-bold text-[#0F6C73] transition-colors hover:bg-surface">{copied === it.id ? I.check : I.copy}{copied === it.id ? t("تم النسخ", "Copied") : t("نسخ الرقم", "Copy Number")}</button>}
                {v(it, "cv") && <a href={v(it, "cv")} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-white px-3.5 py-2 text-xs font-bold text-[#0F6C73] transition-colors hover:bg-surface">{I.file} {t("السيرة الذاتية", "CV/Resume")} {I.open}</a>}
              </div>

              <div className="grid gap-2.5 p-5 sm:grid-cols-2">
                {rows.map((f) => {
                  const val0 = v(it, f.name);
                  const isLink = (f.type === "image" || f.name === "cv") && val0.startsWith("http");
                  const isEmail = f.name.includes("email") && val0.includes("@");
                  const isPhone = (f.name.includes("phone") || f.name.includes("whatsapp")) && val0.trim() !== "";
                  return (
                    <div key={f.name} className="rounded-xl bg-surface/50 p-3 ring-1 ring-line">
                      <p className="text-[11px] font-semibold text-ink-soft">{f.label}</p>
                      <p className="mt-0.5 break-words text-sm font-medium text-ink">
                        {isLink ? <a href={val0} target="_blank" rel="noopener" className="font-bold text-[#1FA6A8] underline">{t("فتح الملف", "Open File")} ↗</a>
                          : isEmail ? <a href={`mailto:${val0}`} dir="ltr" className="font-bold text-[#0F6C73] underline">{val0}</a>
                          : isPhone ? <a href={`tel:${val0.replace(/\s+/g, "")}`} dir="ltr" className="font-bold text-[#0F6C73] underline">{val0}</a>
                          : <span dir={/[؀-ۿ]/.test(val0) ? undefined : "ltr"}>{val0}</span>}
                      </p>
                    </div>
                  );
                })}
              </div>

              {boxes.map((f) => (
                <div key={f.name} className="mx-5 mb-4 rounded-xl bg-surface/50 p-4 ring-1 ring-line">
                  <p className="mb-2 text-[11px] font-semibold text-ink-soft">{f.label}</p>
                  <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-ink">{v(it, f.name)}</p>
                </div>
              ))}

              <div className="flex justify-end border-t border-line px-5 py-4">
                <button onClick={removeAndClose} disabled={busy === it.id} className="inline-flex items-center gap-1.5 rounded-xl bg-red-50 px-4 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-600 hover:text-white disabled:opacity-50">{I.trash}{busy === it.id ? t("جارٍ الحذف…", "Deleting…") : t("حذف الطلب", "Delete Application")}</button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

function PgBtn({ children, onClick, disabled }: { children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return <button onClick={onClick} disabled={disabled} className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-white text-sm text-ink-soft transition-colors hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40">{children}</button>;
}
