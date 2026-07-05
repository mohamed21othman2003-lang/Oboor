"use client";

import { Fragment, useMemo, useState } from "react";
import Link from "next/link";
import CustomSelect from "@/components/ui/Select";
import { branchFilterOptions } from "@/lib/branchesData";
import { type CmsItem } from "@/lib/cms/api";
import { exportSheet } from "@/lib/cms/exportSheet";
import { useCmsLang } from "@/lib/cms/i18n";

/* ===== نتائج التقييم — جدول بأكورديون داخلي (يتمدّد تحت الصف) — ديزاين فقط ===== */

const MONTHS_AR = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
const MONTHS_EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
function stamp(iso: string, en = false): { date: string; time: string } {
  if (!iso) return { date: "—", time: "" };
  const d = new Date(iso);
  if (isNaN(d.getTime())) return { date: iso, time: "" };
  const h = d.getHours(); const am = h < 12; const h12 = h % 12 === 0 ? 12 : h % 12;
  const months = en ? MONTHS_EN : MONTHS_AR;
  return { date: `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`, time: `${h12}:${String(d.getMinutes()).padStart(2, "0")} ${en ? (am ? "AM" : "PM") : (am ? "ص" : "م")}` };
}
const uniq = (a: string[]) => [...new Set(a.filter(Boolean))];

// مستوى الحالة: خفيف (أخضر) · متوسط (برتقالي) · شديد (أحمر)
const LEVEL: Record<string, { label: string; dot: string }> = {
  low: { label: "خفيف", dot: "#27ae60" },
  medium: { label: "متوسط", dot: "#f39c12" },
  high: { label: "شديد", dot: "#e74c3c" },
};
const LEVEL_EN: Record<string, string> = {
  low: "Mild",
  medium: "Moderate",
  high: "Severe",
};
const levelInfo = (l: string, en = false) => {
  const base = LEVEL[l];
  if (!base) return { label: l || "—", dot: "#94a3b8" };
  return { label: en ? (LEVEL_EN[l] || base.label) : base.label, dot: base.dot };
};

// لون الإجابة: نعم=أخضر · أحياناً=برتقالي · لا=أحمر
function ansColor(a: string): string {
  const t = a.trim();
  if (/^نعم/.test(t)) return "text-[#27ae60]";
  if (/^(أحيان|احيان)/.test(t)) return "text-[#f39c12]";
  if (/^لا\b|^لا$|^لا /.test(t) || t === "لا") return "text-[#e74c3c]";
  return "text-ink";
}

const I = {
  search: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>,
  reset: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></svg>,
  export: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M7 10l5 5 5-5" /><path d="M12 15V3" /></svg>,
  cal: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>,
  clock: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" strokeLinecap="round" /></svg>,
  chevron: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>,
  more: <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="12" cy="19" r="2" /></svg>,
  wa: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.5A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.7-.1-.4-.1-.9-.3-1.6-.6-2.7-1.2-4.5-4-4.6-4.2-.1-.2-1.1-1.5-1.1-2.8s.7-2 .9-2.2c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.1.1.3 0 .5l-.4.5-.3.3c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.6-.1l.7-.9c.2-.2.4-.2.6-.1l1.8.9c.2.1.4.2.5.3.1.2.1.7-.1 1.1z" /></svg>,
  mail: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>,
  trash: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>,
  user: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
  phone: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.8 2z" /></svg>,
  pin: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>,
  msg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>,
};

export default function AssessmentResultsTable({
  items, label, onDelete, busy,
}: {
  items: CmsItem[]; label: string; onDelete: (id: number) => Promise<void>; busy: number | null;
}) {
  const { lang } = useCmsLang();
  const en = lang === "en";
  const t = (ar: string, e: string) => (en ? e : ar);
  const v = (it: CmsItem, k: string) => { const x = it[k]; return x === null || x === undefined ? "" : String(x); };

  const [query, setQuery] = useState("");
  const [atype, setAtype] = useState("");
  const [sev, setSev] = useState("");
  const [range, setRange] = useState("");
  const [branch, setBranch] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState<number | null>(null);
  const [menu, setMenu] = useState<number | null>(null);

  const typeOpts = useMemo(() => [{ value: "", label: t("كل الأنواع", "All Types") }, ...uniq(items.map((it) => v(it, "assessment"))).map((tp) => ({ value: tp, label: tp }))], [items, en]);
  const sevOpts = useMemo(() => [{ value: "", label: t("كل المستويات", "All Levels") }, ...uniq(items.map((it) => v(it, "level"))).map((l) => ({ value: l, label: levelInfo(l, en).label }))], [items, en]);
  const rangeOpts = [{ value: "", label: t("كل الوقت", "All Time") }, { value: "today", label: t("اليوم", "Today") }, { value: "7", label: t("آخر ٧ أيام", "Last 7 Days") }, { value: "30", label: t("آخر ٣٠ يوم", "Last 30 Days") }];
  const branchOpts = useMemo(() => [{ value: "", label: t("كل الفروع", "All Branches") }, ...branchFilterOptions(items.map((it) => v(it, "branch")), en)], [items, en]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const now = new Date();
    return items.filter((it) => {
      if (q && !`${v(it, "child_name")} ${v(it, "parent_name")}`.toLowerCase().includes(q)) return false;
      if (atype && v(it, "assessment") !== atype) return false;
      if (sev && v(it, "level") !== sev) return false;
      if (branch && v(it, "branch") !== branch) return false;
      if (range) {
        const c = new Date(v(it, "created_at"));
        if (isNaN(c.getTime())) return false;
        if (range === "today") {
          if (c.getFullYear() !== now.getFullYear() || c.getMonth() !== now.getMonth() || c.getDate() !== now.getDate()) return false;
        } else if ((now.getTime() - c.getTime()) / 86400000 > Number(range)) return false;
      }
      return true;
    });
  }, [items, query, atype, sev, range, branch]);

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const cur = Math.min(page, pages);
  const startIdx = (cur - 1) * perPage;
  const pageItems = filtered.slice(startIdx, startIdx + perPage);

  const resetFilters = () => { setQuery(""); setAtype(""); setSev(""); setRange(""); setBranch(""); setPage(1); };
  const onFilter = (fn: () => void) => { fn(); setPage(1); };
  const del = async (id: number) => { setMenu(null); if (!confirm(t("حذف هذه النتيجة نهائياً؟", "Delete this result permanently?"))) return; await onDelete(id); };

  const exportCsv = async () => {
    const dateHeader = t("التاريخ", "Date");
    const cols: [string, (it: CmsItem) => string][] = [
      [t("الطفل", "Child"), (it) => v(it, "child_name")], [t("ولي الأمر", "Parent"), (it) => v(it, "parent_name")], [t("الجوال", "Phone"), (it) => v(it, "phone")],
      [t("نوع التقييم", "Assessment Type"), (it) => v(it, "assessment")], [t("العمر", "Age"), (it) => v(it, "age")], [t("مستوى الحالة", "Severity Level"), (it) => levelInfo(v(it, "level"), en).label],
      [t("المدينة", "City"), (it) => v(it, "city")], [t("الفرع", "Branch"), (it) => v(it, "branch")], [dateHeader, (it) => v(it, "created_at")],
    ];
    await exportSheet({
      filename: "assessment-results",
      sheetName: t("نتائج التقييم", "Assessment Results"),
      columns: cols.map(([header]) => ({ header, date: header === dateHeader })),
      rows: filtered.map((it) => cols.map(([, acc]) => acc(it))),
    });
  };

  const actBtn = "flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-white transition-colors";
  const answersOf = (it: CmsItem) => Array.isArray(it.answers)
    ? (it.answers as Array<Record<string, unknown>>).map((qa) => ({ q: String(qa.q ?? qa.question ?? ""), a: String(qa.a ?? qa.answer ?? "") }))
    : [];

  return (
    <div className="space-y-5">
      <div>
        <Link href="/cms" className="text-xs font-semibold text-[#0F6C73] hover:text-[#1FA6A8]">{t("← لوحة التحكّم", "← Dashboard")}</Link>
        <h1 className="mt-1 text-2xl font-extrabold text-ink">{label}</h1>
        <p className="mt-1 text-sm text-ink-soft">{t("عرض وإدارة جميع نتائج التقييم", "View and manage all assessment results")}</p>
      </div>

      {/* الفلاتر */}
      <div className="rounded-2xl border border-line bg-white p-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative min-w-[220px] flex-1">
            <span className="pointer-events-none absolute inset-y-0 start-3 flex items-center text-ink-soft">{I.search}</span>
            <input value={query} onChange={(e) => onFilter(() => setQuery(e.target.value))} placeholder={t("ابحث عن اسم الطفل أو ولي الأمر…", "Search by child's or parent's name…")} className="w-full rounded-xl border border-line bg-surface/60 py-2.5 pe-3 ps-10 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20" />
          </div>
          <div className="w-[150px]"><CustomSelect value={range} onChange={(x) => onFilter(() => setRange(x))} options={rangeOpts} placeholder={t("كل الوقت", "All Time")} /></div>
          <div className="w-[160px]"><CustomSelect value={sev} onChange={(x) => onFilter(() => setSev(x))} options={sevOpts} placeholder={t("كل المستويات", "All Levels")} /></div>
          <div className="w-[170px]"><CustomSelect value={atype} onChange={(x) => onFilter(() => setAtype(x))} options={typeOpts} placeholder={t("كل الأنواع", "All Types")} /></div>
          <div className="w-[180px]"><CustomSelect value={branch} onChange={(x) => onFilter(() => setBranch(x))} options={branchOpts} placeholder={t("كل الفروع", "All Branches")} /></div>
          <button onClick={resetFilters} className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-white px-3.5 py-2.5 text-xs font-bold text-ink-soft transition-colors hover:bg-surface">{I.reset} {t("إعادة تعيين", "Reset")}</button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-ink-soft">{t("إجمالي النتائج:", "Total Results:")} <span className="font-extrabold text-[#0F6C73]">{total}</span></p>
        <button onClick={exportCsv} className="inline-flex items-center gap-1.5 rounded-xl bg-[#0F6C73] px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#1FA6A8]">{I.export} {t("تصدير", "Export")}</button>
      </div>

      {/* الجدول */}
      <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-surface text-ink-soft">
              <tr>
                <th className="px-4 py-3 text-start text-xs font-bold">{t("الطفل", "Child")}</th>
                <th className="px-4 py-3 text-center text-xs font-bold">{t("نوع التقييم", "Assessment Type")}</th>
                <th className="px-4 py-3 text-center text-xs font-bold">{t("العمر", "Age")}</th>
                <th className="px-4 py-3 text-center text-xs font-bold">{t("مستوى الحالة", "Severity Level")}</th>
                <th className="px-4 py-3 text-center text-xs font-bold">{t("تاريخ التقييم", "Assessment Date")}</th>
                <th className="px-4 py-3 text-center text-xs font-bold">{t("الإجراءات", "Actions")}</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-ink-soft">{t("لا توجد نتائج مطابقة.", "No matching results.")}</td></tr>
              ) : pageItems.map((it) => {
                const isOpen = open === it.id;
                const name = v(it, "child_name") || v(it, "parent_name") || `#${it.id}`;
                const phone = v(it, "phone");
                const email = v(it, "email");
                const wa = phone.replace(/[^\d]/g, "");
                const s = stamp(v(it, "created_at"), en);
                const lv = levelInfo(v(it, "level"), en);
                const answers = answersOf(it);
                return (
                  <Fragment key={it.id}>
                    <tr className={`border-t border-line transition-colors ${isOpen ? "bg-[#1FA6A8]/5" : "hover:bg-surface/50"}`}>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5 text-start">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1FA6A8]/12 text-sm font-extrabold text-[#0F6C73]">{name.charAt(0)}</span>
                          <div className="min-w-0">
                            <p className="font-bold text-ink">{name}</p>
                            {v(it, "parent_name") && <p className="mt-0.5 text-[11px] text-ink-soft">{t("ولي الأمر:", "Parent:")} {v(it, "parent_name")}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-center font-semibold text-ink">{v(it, "assessment") || "—"}</td>
                      <td className="px-4 py-3.5 text-center text-ink">{v(it, "age") || "—"}</td>
                      <td className="px-4 py-3.5 text-center">
                        <span className="inline-flex items-center gap-1.5 text-ink"><span className="h-2 w-2 rounded-full" style={{ background: lv.dot }} />{lv.label}</span>
                      </td>
                      <td className="px-4 py-3.5 text-center text-ink-soft">
                        <span className="inline-flex flex-col items-start gap-0.5 text-start">
                          <span className="flex items-center gap-1.5"><span className="text-[#1FA6A8]">{I.cal}</span>{s.date}</span>
                          {s.time && <span className="flex items-center gap-1.5 text-xs"><span className="text-[#1FA6A8]">{I.clock}</span>{s.time}</span>}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-center gap-1.5">
                          <button onClick={() => setOpen(isOpen ? null : it.id)} className="inline-flex items-center gap-1 rounded-xl px-2.5 py-2 text-xs font-bold text-[#0F6C73] transition-colors hover:bg-[#1FA6A8]/10">
                            {t("عرض التفاصيل", "View Details")} <span className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>{I.chevron}</span>
                          </button>
                          {email && <a href={`mailto:${email}`} className={`${actBtn} text-[#1FA6A8] hover:border-[#1FA6A8] hover:bg-[#1FA6A8]/10`} title={t("إيميل", "Email")} aria-label={t("إيميل", "Email")}>{I.mail}</a>}
                          {wa && <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener" className={`${actBtn} text-[#25D366] hover:border-[#25D366] hover:bg-[#25D366]/10`} title={t("واتساب", "WhatsApp")} aria-label={t("واتساب", "WhatsApp")}>{I.wa}</a>}
                          <div className="relative">
                            <button onClick={() => setMenu(menu === it.id ? null : it.id)} className={`${actBtn} text-ink hover:bg-surface`} title={t("المزيد", "More")} aria-label={t("المزيد", "More")}>{I.more}</button>
                            {menu === it.id && (
                              <>
                                <div className="fixed inset-0 z-20" onClick={() => setMenu(null)} />
                                <div className="absolute end-0 z-30 mt-1 w-40 overflow-hidden rounded-xl border border-line bg-white py-1 shadow-xl">
                                  <button onClick={() => del(it.id)} disabled={busy === it.id} className="flex w-full items-center gap-2 px-3 py-2 text-start text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50">{I.trash}{busy === it.id ? t("جارٍ الحذف…", "Deleting…") : t("حذف النتيجة", "Delete Result")}</button>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                    {/* لوحة التفاصيل القابلة للتمدّد — بعرض الجدول الكامل */}
                    <tr>
                      <td colSpan={6} className="border-0 p-0">
                        <div className={`grid transition-all duration-200 ease-in-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                          <div className="overflow-hidden">
                            <div className="grid gap-4 border-t border-line bg-surface/30 p-5 lg:grid-cols-3">
                              {/* معلومات الطفل */}
                              <div className="rounded-xl border border-line bg-white p-4">
                                <p className="mb-3 text-sm font-extrabold text-ink">{t("معلومات الطفل", "Child Information")}</p>
                                <KV label={t("اسم الطفل", "Child's Name")} value={v(it, "child_name") || "—"} />
                                <KV label={t("العمر", "Age")} value={v(it, "age") || "—"} />
                                <KV label={t("الجنس", "Gender")} value={v(it, "gender") || "—"} />
                                <KV label={t("نوع التقييم", "Assessment Type")} value={v(it, "assessment") || "—"} />
                                <KV label={t("مستوى الحالة", "Severity Level")} value={<span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: lv.dot }} />{lv.label}</span>} last />
                              </div>
                              {/* معلومات ولي الأمر */}
                              <div className="rounded-xl border border-line bg-white p-4">
                                <p className="mb-3 text-sm font-extrabold text-ink">{t("معلومات ولي الأمر", "Parent Information")}</p>
                                <Info icon={I.user} label={t("ولي الأمر", "Parent")} value={v(it, "parent_name") || "—"} />
                                <Info icon={I.phone} label={t("الجوال", "Phone")} value={phone || "—"} ltr />
                                <Info icon={I.mail} label={t("البريد الإلكتروني", "Email")} value={email || "—"} ltr />
                                <Info icon={I.pin} label={t("المدينة", "City")} value={v(it, "city") || "—"} />
                                <Info icon={I.pin} label={t("الفرع", "Branch")} value={v(it, "branch") || "—"} last />
                              </div>
                              {/* أسئلة التقييم */}
                              <div className="rounded-xl border border-line bg-white p-4">
                                <p className="mb-3 flex items-center gap-1.5 text-sm font-extrabold text-ink"><span className="text-[#1FA6A8]">{I.msg}</span> {t("أسئلة التقييم", "Assessment Questions")} ({answers.length})</p>
                                {answers.length === 0 ? <p className="text-xs text-ink-soft">{t("لا توجد إجابات.", "No answers.")}</p> : (
                                  <ol className="space-y-2.5">
                                    {answers.map((qa, i) => (
                                      <li key={i} className="flex items-start gap-2 border-b border-line/60 pb-2 last:border-0">
                                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-surface text-[10px] font-bold text-ink-soft">{i + 1}</span>
                                        <div className="min-w-0 flex-1">
                                          <p className="text-xs leading-6 text-ink">{qa.q}</p>
                                          <p className={`mt-0.5 text-xs font-bold ${ansColor(qa.a)}`}>{qa.a || "—"}</p>
                                        </div>
                                      </li>
                                    ))}
                                  </ol>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* الترقيم */}
      {total > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-white px-4 py-3 shadow-sm">
          <div className="flex items-center gap-2 text-xs text-ink-soft">
            <span>{t("عدد الصفوف:", "Rows per page:")}</span>
            <div className="w-[72px]"><CustomSelect value={String(perPage)} onChange={(x) => { setPerPage(Number(x)); setPage(1); }} options={[{ value: "10", label: "10" }, { value: "25", label: "25" }, { value: "50", label: "50" }]} /></div>
          </div>
          <p className="text-xs font-semibold text-ink-soft">{en ? `Showing ${total === 0 ? 0 : startIdx + 1} to ${Math.min(startIdx + perPage, total)} of ${total} results` : `عرض ${total === 0 ? 0 : startIdx + 1} إلى ${Math.min(startIdx + perPage, total)} من ${total} نتيجة`}</p>
          <div className="flex items-center gap-1" dir="ltr">
            <PgBtn onClick={() => setPage(1)} disabled={cur === 1}>«</PgBtn>
            <PgBtn onClick={() => setPage(cur - 1)} disabled={cur === 1}>‹</PgBtn>
            <span className="px-3 text-xs font-bold text-ink">{cur} / {pages}</span>
            <PgBtn onClick={() => setPage(cur + 1)} disabled={cur === pages}>›</PgBtn>
            <PgBtn onClick={() => setPage(pages)} disabled={cur === pages}>»</PgBtn>
          </div>
        </div>
      )}
    </div>
  );
}

function KV({ label, value, last }: { label: string; value: React.ReactNode; last?: boolean }) {
  return (
    <div className={`flex items-center justify-between gap-3 py-2 ${last ? "" : "border-b border-line/60"}`}>
      <span className="text-xs text-ink-soft">{label}</span>
      <span className="text-sm font-bold text-ink">{value}</span>
    </div>
  );
}

function Info({ icon, label, value, ltr, last }: { icon: React.ReactNode; label: string; value: string; ltr?: boolean; last?: boolean }) {
  return (
    <div className={`flex items-start gap-2.5 py-2 ${last ? "" : "border-b border-line/60"}`}>
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#1FA6A8]/10 text-[#1FA6A8]">{icon}</span>
      <div className="min-w-0">
        <p className="text-[11px] text-ink-soft">{label}</p>
        <p className="break-words text-sm font-bold text-ink" dir={ltr ? "ltr" : undefined}>{value}</p>
      </div>
    </div>
  );
}

function PgBtn({ children, onClick, disabled }: { children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return <button onClick={onClick} disabled={disabled} className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-white text-sm text-ink-soft transition-colors hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40">{children}</button>;
}
