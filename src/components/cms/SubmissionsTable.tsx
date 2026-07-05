"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import CustomSelect from "@/components/ui/Select";
import { type CmsItem, type FieldSchema } from "@/lib/cms/api";
import { exportSheet } from "@/lib/cms/exportSheet";
import { useCmsLang } from "@/lib/cms/i18n";
import { branchFilterOptions } from "@/lib/branchesData";

/* ===== جدول إدارة طلبات الالتحاق (شكل CRM) — ديزاين فقط، نفس البيانات والأكشنز ===== */

const MONTHS_AR = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
const MONTHS_EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function stamp(iso: string, en = false): { date: string; time: string } {
  if (!iso) return { date: "—", time: "" };
  const d = new Date(iso);
  if (isNaN(d.getTime())) return { date: iso, time: "" };
  const h = d.getHours();
  const am = h < 12;
  const h12 = h % 12 === 0 ? 12 : h % 12;
  const time = `${h12}:${String(d.getMinutes()).padStart(2, "0")} ${en ? (am ? "AM" : "PM") : am ? "ص" : "م"}`;
  const months = en ? MONTHS_EN : MONTHS_AR;
  return { date: `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`, time };
}

/* أيقونات */
const I = {
  search: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>,
  filter: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" /></svg>,
  reset: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></svg>,
  export: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M7 10l5 5 5-5" /><path d="M12 15V3" /></svg>,
  cal: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>,
  clock: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" strokeLinecap="round" /></svg>,
  pin: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>,
  more: <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="12" cy="19" r="2" /></svg>,
  phone: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.8 2z" /></svg>,
  copy: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>,
  check: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>,
  wa: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.5A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.7-.1-.4-.1-.9-.3-1.6-.6-2.7-1.2-4.5-4-4.6-4.2-.1-.2-1.1-1.5-1.1-2.8s.7-2 .9-2.2c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.1.1.3 0 .5l-.4.5-.3.3c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.6-.1l.7-.9c.2-.2.4-.2.6-.1l1.8.9c.2.1.4.2.5.3.1.2.1.7-.1 1.1z" /></svg>,
  mail: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>,
  trash: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>,
  tag: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.6 13.4 12 22l-9-9V3h10z" /><circle cx="7.5" cy="7.5" r="1.5" /></svg>,
  user: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
  eye: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></svg>,
  x: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>,
};

const uniq = (a: string[]) => [...new Set(a.filter(Boolean))];

export default function SubmissionsTable({
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
  const [branch, setBranch] = useState("");
  const [condition, setCondition] = useState("");
  const [range, setRange] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [menu, setMenu] = useState<number | null>(null);
  const [copied, setCopied] = useState<number | null>(null);
  const [viewing, setViewing] = useState<CmsItem | null>(null);

  const branchOpts = useMemo(() => [{ value: "", label: t("كل الفروع", "All branches") }, ...branchFilterOptions(items.map((it) => v(it, "branch")), en)], [items, en]);
  const condOpts = useMemo(() => [{ value: "", label: t("كل أنواع الحالات", "All case types") }, ...uniq(items.map((it) => v(it, "case_type"))).map((c) => ({ value: c, label: c }))], [items, en]);
  const rangeOpts = [
    { value: "", label: t("كل الوقت", "All time") },
    { value: "today", label: t("اليوم", "Today") },
    { value: "7", label: t("آخر ٧ أيام", "Last 7 days") },
    { value: "30", label: t("آخر ٣٠ يوم", "Last 30 days") },
  ];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const now = new Date();
    return items.filter((it) => {
      if (q && !`${v(it, "parent_name")} ${v(it, "child_name")}`.toLowerCase().includes(q)) return false;
      if (branch && v(it, "branch") !== branch) return false;
      if (condition && v(it, "case_type") !== condition) return false;
      if (range) {
        const c = new Date(v(it, "created_at"));
        if (isNaN(c.getTime())) return false;
        if (range === "today") {
          if (c.getFullYear() !== now.getFullYear() || c.getMonth() !== now.getMonth() || c.getDate() !== now.getDate()) return false;
        } else {
          const days = (now.getTime() - c.getTime()) / 86400000;
          if (days > Number(range)) return false;
        }
      }
      return true;
    });
  }, [items, query, branch, condition, range]);

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const cur = Math.min(page, pages);
  const startIdx = (cur - 1) * perPage;
  const pageItems = filtered.slice(startIdx, startIdx + perPage);

  const resetFilters = () => { setQuery(""); setBranch(""); setCondition(""); setRange(""); setPage(1); };
  const onFilterChange = (fn: () => void) => { fn(); setPage(1); };

  const copyPhone = (id: number, phone: string) => {
    navigator.clipboard?.writeText(phone).then(() => { setCopied(id); setTimeout(() => setCopied((c) => (c === id ? null : c)), 1500); });
  };

  const allOnPage = pageItems.length > 0 && pageItems.every((it) => selected.has(it.id));
  const toggleAll = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allOnPage) pageItems.forEach((it) => next.delete(it.id));
      else pageItems.forEach((it) => next.add(it.id));
      return next;
    });
  };
  const toggleOne = (id: number) => setSelected((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const del = async (id: number) => { setMenu(null); if (!confirm(t("حذف هذا الطلب نهائياً؟", "Permanently delete this request?"))) return; await onDelete(id); setSelected((p) => { const n = new Set(p); n.delete(id); return n; }); };
  const bulkDelete = async () => {
    const ids = [...selected];
    if (!ids.length || !confirm(t(`حذف ${ids.length} طلب نهائياً؟`, `Permanently delete ${ids.length} request(s)?`))) return;
    for (const id of ids) await onDelete(id);
    setSelected(new Set());
  };

  const exportCsv = async () => {
    const dateHeader = t("التاريخ", "Date");
    const cols: [string, (it: CmsItem) => string][] = [
      [t("ولي الأمر", "Parent"), (it) => v(it, "parent_name")],
      [t("الجوال", "Phone"), (it) => v(it, "phone")],
      [t("نوع الحالة", "Case type"), (it) => v(it, "case_type")],
      [t("الفرع", "Branch"), (it) => v(it, "branch")],
      [t("البريد", "Email"), (it) => v(it, "email")],
      [dateHeader, (it) => v(it, "created_at")],
    ];
    await exportSheet({
      filename: "admission-requests",
      sheetName: t("طلبات الالتحاق", "Admission Requests"),
      columns: cols.map(([header]) => ({ header, date: header === dateHeader })),
      rows: filtered.map((it) => cols.map(([, acc]) => acc(it))),
    });
  };

  const actBtn = "flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-white transition-colors";

  return (
    <div className="space-y-5">
      {/* رأس الصفحة */}
      <div>
        <Link href="/cms" className="text-xs font-semibold text-[#0F6C73] hover:text-[#1FA6A8]">{t("← لوحة التحكّم", "← Dashboard")}</Link>
        <div className="mt-1 flex items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-ink">{label}</h1>
            <p className="mt-1 text-sm text-ink-soft">{t("عرض وإدارة جميع طلبات الالتحاق الواردة", "View and manage all incoming admission requests")}</p>
          </div>
        </div>
      </div>

      {/* شريط الفلاتر */}
      <div className="rounded-2xl border border-line bg-white p-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative min-w-[220px] flex-1">
            <span className="pointer-events-none absolute inset-y-0 start-3 flex items-center text-ink-soft">{I.search}</span>
            <input
              value={query}
              onChange={(e) => onFilterChange(() => setQuery(e.target.value))}
              placeholder={t("ابحث عن اسم الطفل أو ولي الأمر…", "Search by child or parent name…")}
              className="w-full rounded-xl border border-line bg-surface/60 py-2.5 pe-3 ps-10 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20"
            />
          </div>
          {showFilters && (
            <>
              <div className="w-[150px]"><CustomSelect value={range} onChange={(x) => onFilterChange(() => setRange(x))} options={rangeOpts} placeholder={t("كل الوقت", "All time")} /></div>
              <div className="w-[170px]"><CustomSelect value={branch} onChange={(x) => onFilterChange(() => setBranch(x))} options={branchOpts} placeholder={t("كل الفروع", "All branches")} /></div>
              <div className="w-[190px]"><CustomSelect value={condition} onChange={(x) => onFilterChange(() => setCondition(x))} options={condOpts} placeholder={t("كل أنواع الحالات", "All case types")} /></div>
            </>
          )}
          <button onClick={() => setShowFilters((s) => !s)} className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-white px-3.5 py-2.5 text-xs font-bold text-ink-soft transition-colors hover:bg-surface">{I.filter} {t("فلترة", "Filter")}</button>
          <button onClick={resetFilters} className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-white px-3.5 py-2.5 text-xs font-bold text-ink-soft transition-colors hover:bg-surface">{I.reset} {t("إعادة تعيين", "Reset")}</button>
        </div>
      </div>

      {/* الإجمالي (يمين) + التصدير + حذف المحدد (شمال) */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-ink-soft">{t("إجمالي الطلبات:", "Total requests:")} <span className="font-extrabold text-[#0F6C73]">{total}</span> {t("طلب", "request(s)")}</p>
        <div className="flex items-center gap-2">
          {selected.size > 0 && (
            <button onClick={bulkDelete} className="inline-flex items-center gap-1.5 rounded-xl bg-red-50 px-4 py-2.5 text-xs font-bold text-red-600 transition-colors hover:bg-red-600 hover:text-white">{I.trash} {t("حذف المحدد", "Delete selected")} ({selected.size})</button>
          )}
          <button onClick={exportCsv} className="inline-flex items-center gap-1.5 rounded-xl bg-[#0F6C73] px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#1FA6A8]">{I.export} {t("تصدير", "Export")}</button>
        </div>
      </div>

      {/* ===== جدول (ديسكتوب/تابلت) ===== */}
      <div className="hidden overflow-hidden rounded-2xl border border-line bg-white shadow-sm md:block">
        <div className="max-h-[70vh] overflow-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="sticky top-0 z-10 bg-surface">
              <tr className="text-ink-soft">
                <th className="w-12 px-4 py-3 text-center"><input type="checkbox" checked={allOnPage} onChange={toggleAll} className="h-4 w-4 accent-[#1FA6A8]" aria-label={t("تحديد الكل", "Select all")} /></th>
                <th className="px-4 py-3 text-start text-xs font-bold">{t("ولي الأمر", "Parent")}</th>
                <th className="px-4 py-3 text-center text-xs font-bold">{t("نوع الحالة", "Case type")}</th>
                <th className="px-4 py-3 text-center text-xs font-bold">{t("الفرع", "Branch")}</th>
                <th className="px-4 py-3 text-center text-xs font-bold">{t("تاريخ الطلب", "Request date")}</th>
                <th className="px-4 py-3 text-center text-xs font-bold">{t("الإجراءات", "Actions")}</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-ink-soft">{t("لا توجد طلبات مطابقة.", "No matching requests.")}</td></tr>
              ) : pageItems.map((it) => {
                const phone = v(it, "phone");
                const email = v(it, "email");
                const wa = phone.replace(/[^\d]/g, "");
                const s = stamp(v(it, "created_at"), en);
                const checked = selected.has(it.id);
                return (
                  <tr key={it.id} onClick={() => setViewing(it)} className={`cursor-pointer border-t border-line transition-colors hover:bg-surface/50 ${checked ? "bg-[#1FA6A8]/5" : ""}`}>
                    <td className="px-4 py-3.5 text-center" onClick={(e) => e.stopPropagation()}><input type="checkbox" checked={checked} onChange={() => toggleOne(it.id)} className="h-4 w-4 accent-[#1FA6A8]" aria-label={t("تحديد", "Select")} /></td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-start gap-2.5 text-start">
                        <span className="shrink-0 text-ink-soft">{I.user}</span>
                        <div className="min-w-0">
                          <p className="font-bold text-ink">{v(it, "parent_name") || "—"}</p>
                          {phone && <p dir="ltr" className="mt-0.5 text-end text-xs text-ink-soft">{phone}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className="font-semibold text-ink">{v(it, "case_type") || "—"}</span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className="inline-flex items-center gap-1.5 text-ink"><span className="text-[#1FA6A8]">{I.pin}</span>{v(it, "branch") || "—"}</span>
                    </td>
                    <td className="px-4 py-3.5 text-ink-soft">
                      <span className="flex items-center justify-center gap-1.5"><span className="text-[#1FA6A8]">{I.cal}</span>{s.date}</span>
                      {s.time && <span className="mt-0.5 flex items-center justify-center gap-1.5 text-xs"><span className="text-[#1FA6A8]">{I.clock}</span>{s.time}</span>}
                    </td>
                    <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1.5">
                        {email && <a href={`mailto:${email}`} className={`${actBtn} text-[#1FA6A8] hover:border-[#1FA6A8] hover:bg-[#1FA6A8]/10`} title={t("إيميل", "Email")} aria-label={t("إيميل", "Email")}>{I.mail}</a>}
                        {wa && <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener" className={`${actBtn} text-[#25D366] hover:border-[#25D366] hover:bg-[#25D366]/10`} title={t("واتساب", "WhatsApp")} aria-label={t("واتساب", "WhatsApp")}>{I.wa}</a>}
                        <button onClick={() => setViewing(it)} className={`${actBtn} text-[#0F6C73] hover:border-[#1FA6A8] hover:bg-[#1FA6A8]/10`} title={t("عرض التفاصيل", "View details")} aria-label={t("عرض التفاصيل", "View details")}>{I.eye}</button>
                        <div className="relative">
                          <button onClick={() => setMenu(menu === it.id ? null : it.id)} className={`${actBtn} text-ink hover:bg-surface`} title={t("المزيد", "More")} aria-label={t("المزيد", "More")}>{I.more}</button>
                          {menu === it.id && (
                            <>
                              <div className="fixed inset-0 z-20" onClick={() => setMenu(null)} />
                              <div className="absolute end-0 z-30 mt-1 w-44 overflow-hidden rounded-xl border border-line bg-white py-1 shadow-xl">
                                <button onClick={() => { setMenu(null); setViewing(it); }} className="flex w-full items-center gap-2 px-3 py-2 text-start text-xs font-semibold text-ink transition-colors hover:bg-surface">{I.eye} {t("عرض التفاصيل", "View details")}</button>
                                <button onClick={() => del(it.id)} disabled={busy === it.id} className="flex w-full items-center gap-2 px-3 py-2 text-start text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50">{I.trash}{busy === it.id ? t("جارٍ الحذف…", "Deleting…") : t("حذف الطلب", "Delete request")}</button>
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

      {/* ===== كروت (موبايل) ===== */}
      <div className="space-y-3 md:hidden">
        {pageItems.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line bg-white p-8 text-center text-ink-soft">{t("لا توجد طلبات مطابقة.", "No matching requests.")}</div>
        ) : pageItems.map((it) => {
          const phone = v(it, "phone");
          const email = v(it, "email");
          const wa = phone.replace(/[^\d]/g, "");
          const s = stamp(v(it, "created_at"), en);
          return (
            <div key={it.id} onClick={() => setViewing(it)} className="cursor-pointer rounded-2xl border border-line bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1FA6A8]/10 text-[#0F6C73]">{I.user}</span>
                  <div>
                    <p className="font-bold text-ink">{v(it, "parent_name") || "—"}</p>
                    {phone && <p dir="ltr" className="mt-0.5 text-start text-xs text-ink-soft">{phone}</p>}
                  </div>
                </div>
                <input type="checkbox" checked={selected.has(it.id)} onChange={() => toggleOne(it.id)} onClick={(e) => e.stopPropagation()} className="mt-1 h-4 w-4 accent-[#1FA6A8]" aria-label={t("تحديد", "Select")} />
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1FA6A8]/10 px-3 py-1 font-bold text-[#0F6C73]"><span className="text-[#1FA6A8]">{I.tag}</span>{v(it, "case_type") || "—"}</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 text-ink-soft"><span className="text-[#1FA6A8]">{I.pin}</span>{v(it, "branch") || "—"}</span>
              </div>
              <p className="mt-2 flex items-center gap-1.5 text-xs text-ink-soft"><span className="text-[#1FA6A8]">{I.cal}</span>{s.date}{s.time ? ` · ${s.time}` : ""}</p>
              <div className="mt-3 flex items-center gap-1.5 border-t border-line pt-3" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => setViewing(it)} className={`${actBtn} text-[#0F6C73] hover:border-[#1FA6A8]`} aria-label={t("عرض التفاصيل", "View details")}>{I.eye}</button>
                {wa && <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener" className={`${actBtn} text-[#25D366] hover:border-[#25D366]`} aria-label={t("واتساب", "WhatsApp")}>{I.wa}</a>}
                {email && <a href={`mailto:${email}`} className={`${actBtn} text-[#1FA6A8]`} aria-label={t("إيميل", "Email")}>{I.mail}</a>}
                <button onClick={() => del(it.id)} disabled={busy === it.id} className="ms-auto inline-flex items-center gap-1.5 rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 disabled:opacity-50">{I.trash} {t("حذف", "Delete")}</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ===== الترقيم ===== */}
      {total > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-white px-4 py-3 shadow-sm">
          <div className="flex items-center gap-2 text-xs text-ink-soft">
            <span>{t("عدد الصفوف:", "Rows per page:")}</span>
            <div className="w-[72px]"><CustomSelect value={String(perPage)} onChange={(x) => { setPerPage(Number(x)); setPage(1); }} options={[{ value: "10", label: "10" }, { value: "25", label: "25" }, { value: "50", label: "50" }]} /></div>
          </div>
          <p className="text-xs font-semibold text-ink-soft">{t("عرض", "Showing")} {total === 0 ? 0 : startIdx + 1} {t("إلى", "to")} {Math.min(startIdx + perPage, total)} {t("من", "of")} {total} {t("طلب", "request(s)")}</p>
          <div className="flex items-center gap-1" dir="ltr">
            <PgBtn onClick={() => setPage(1)} disabled={cur === 1}>«</PgBtn>
            <PgBtn onClick={() => setPage(cur - 1)} disabled={cur === 1}>‹</PgBtn>
            <span className="px-3 text-xs font-bold text-ink">{cur} / {pages}</span>
            <PgBtn onClick={() => setPage(cur + 1)} disabled={cur === pages}>›</PgBtn>
            <PgBtn onClick={() => setPage(pages)} disabled={cur === pages}>»</PgBtn>
          </div>
        </div>
      )}

      {/* ===== نافذة تفاصيل الطلب ===== */}
      {viewing && (() => {
        const it = viewing;
        const phone = v(it, "phone");
        const email = v(it, "email");
        const wa = phone.replace(/[^\d]/g, "");
        const s = stamp(v(it, "created_at"), en);
        const shown = fields.filter((f) => f.type !== "json" && v(it, f.name).trim() !== "");
        const rows = shown.filter((f) => f.type !== "textarea");
        const boxes = shown.filter((f) => f.type === "textarea");
        const removeAndClose = async () => { if (!confirm(t("حذف هذا الطلب نهائياً؟", "Permanently delete this request?"))) return; await onDelete(it.id); setSelected((p) => { const n = new Set(p); n.delete(it.id); return n; }); setViewing(null); };
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setViewing(null)}>
            <div className="max-h-[88vh] w-full max-w-2xl overflow-auto rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 flex items-start justify-between gap-3 border-b border-line bg-white px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1FA6A8]/10 text-[#0F6C73]">{I.user}</span>
                  <div>
                    <p className="font-extrabold text-ink">{v(it, "parent_name") || v(it, "child_name") || `#${it.id}`}</p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-soft"><span className="text-[#1FA6A8]">{I.cal}</span>{s.date}{s.time ? ` · ${s.time}` : ""}</p>
                  </div>
                </div>
                <button onClick={() => setViewing(null)} className="flex h-9 w-9 items-center justify-center rounded-xl border border-line text-ink-soft transition-colors hover:bg-surface" aria-label={t("إغلاق", "Close")}>{I.x}</button>
              </div>

              {(phone || email) && (
                <div className="flex flex-wrap gap-2 px-5 pt-4">
                  {phone && <button onClick={() => copyPhone(it.id, phone)} className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-white px-3.5 py-2 text-xs font-bold text-[#0F6C73] transition-colors hover:bg-surface">{copied === it.id ? I.check : I.copy}{copied === it.id ? t("تم النسخ", "Copied") : t("نسخ الرقم", "Copy number")}</button>}
                  {wa && <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 rounded-xl bg-[#25D366] px-3.5 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90">{I.wa} {t("واتساب", "WhatsApp")}</a>}
                  {email && <a href={`mailto:${email}`} className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-white px-3.5 py-2 text-xs font-bold text-[#0F6C73] transition-colors hover:bg-surface">{I.mail} {t("إيميل", "Email")}</a>}
                </div>
              )}

              <div className="grid gap-2.5 p-5 sm:grid-cols-2">
                {rows.map((f) => {
                  const val0 = v(it, f.name);
                  const isEmail = f.name.includes("email") && val0.includes("@");
                  const isPhone = (f.name.includes("phone") || f.name.includes("whatsapp")) && val0.trim() !== "";
                  return (
                    <div key={f.name} className="rounded-xl bg-surface/50 p-3 ring-1 ring-line">
                      <p className="text-[11px] font-semibold text-ink-soft">{f.label}</p>
                      <p className="mt-0.5 break-words text-sm font-medium text-ink">
                        {isEmail ? <a href={`mailto:${val0}`} dir="ltr" className="font-bold text-[#0F6C73] underline">{val0}</a>
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
                <button onClick={removeAndClose} disabled={busy === it.id} className="inline-flex items-center gap-1.5 rounded-xl bg-red-50 px-4 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-600 hover:text-white disabled:opacity-50">{I.trash}{busy === it.id ? t("جارٍ الحذف…", "Deleting…") : t("حذف الطلب", "Delete request")}</button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

function PgBtn({ children, onClick, disabled }: { children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-white text-sm text-ink-soft transition-colors hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40">{children}</button>
  );
}
