"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import CustomSelect from "@/components/ui/Select";
import { type CmsItem } from "@/lib/cms/api";

/* ===== جدول إدارة طلبات الالتحاق (شكل CRM) — ديزاين فقط، نفس البيانات والأكشنز ===== */

const MONTHS_AR = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];

function stamp(iso: string): { date: string; time: string } {
  if (!iso) return { date: "—", time: "" };
  const d = new Date(iso);
  if (isNaN(d.getTime())) return { date: iso, time: "" };
  const h = d.getHours();
  const am = h < 12;
  const h12 = h % 12 === 0 ? 12 : h % 12;
  const time = `${h12}:${String(d.getMinutes()).padStart(2, "0")} ${am ? "ص" : "م"}`;
  return { date: `${d.getDate()} ${MONTHS_AR[d.getMonth()]} ${d.getFullYear()}`, time };
}

const TEAL = "#1FA6A8";
const TEAL_D = "#0F6C73";

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
};

const uniq = (a: string[]) => [...new Set(a.filter(Boolean))];

export default function SubmissionsTable({
  items,
  label,
  onDelete,
  busy,
}: {
  items: CmsItem[];
  label: string;
  onDelete: (id: number) => Promise<void>;
  busy: number | null;
}) {
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

  const branchOpts = useMemo(() => [{ value: "", label: "كل الفروع" }, ...uniq(items.map((it) => v(it, "branch"))).map((b) => ({ value: b, label: b }))], [items]);
  const condOpts = useMemo(() => [{ value: "", label: "كل أنواع الحالات" }, ...uniq(items.map((it) => v(it, "case_type"))).map((c) => ({ value: c, label: c }))], [items]);
  const rangeOpts = [
    { value: "", label: "كل الوقت" },
    { value: "today", label: "اليوم" },
    { value: "7", label: "آخر ٧ أيام" },
    { value: "30", label: "آخر ٣٠ يوم" },
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

  const del = async (id: number) => { setMenu(null); if (!confirm("حذف هذا الطلب نهائياً؟")) return; await onDelete(id); setSelected((p) => { const n = new Set(p); n.delete(id); return n; }); };
  const bulkDelete = async () => {
    const ids = [...selected];
    if (!ids.length || !confirm(`حذف ${ids.length} طلب نهائياً؟`)) return;
    for (const id of ids) await onDelete(id);
    setSelected(new Set());
  };

  const exportCsv = () => {
    const cols: [string, (it: CmsItem) => string][] = [
      ["ولي الأمر", (it) => v(it, "parent_name")],
      ["الجوال", (it) => v(it, "phone")],
      ["نوع الحالة", (it) => v(it, "case_type")],
      ["الفرع", (it) => v(it, "branch")],
      ["البريد", (it) => v(it, "email")],
      ["التاريخ", (it) => { const s = stamp(v(it, "created_at")); return `${s.date} ${s.time}`.trim(); }],
    ];
    const esc = (s: string) => `"${s.replace(/"/g, '""')}"`;
    const rows = [cols.map((c) => c[0]), ...filtered.map((it) => cols.map((c) => c[1](it)))];
    const csv = "﻿" + rows.map((r) => r.map(esc).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a");
    a.href = url; a.download = `admission-requests.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const selBtn = "rounded-lg border border-line bg-white";
  const actBtn = "flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-white text-ink-soft transition-colors";

  return (
    <div className="space-y-5">
      {/* رأس الصفحة */}
      <div>
        <Link href="/cms" className="text-xs font-semibold text-[#0F6C73] hover:text-[#1FA6A8]">← لوحة التحكّم</Link>
        <div className="mt-1 flex items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-ink">{label}</h1>
            <p className="mt-1 text-sm text-ink-soft">عرض وإدارة جميع طلبات الالتحاق الواردة</p>
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
              placeholder="ابحث عن اسم الطفل أو ولي الأمر…"
              className="w-full rounded-xl border border-line bg-surface/60 py-2.5 pe-3 ps-10 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20"
            />
          </div>
          {showFilters && (
            <>
              <div className="w-[150px]"><CustomSelect value={range} onChange={(x) => onFilterChange(() => setRange(x))} options={rangeOpts} placeholder="كل الوقت" /></div>
              <div className="w-[170px]"><CustomSelect value={branch} onChange={(x) => onFilterChange(() => setBranch(x))} options={branchOpts} placeholder="كل الفروع" /></div>
              <div className="w-[190px]"><CustomSelect value={condition} onChange={(x) => onFilterChange(() => setCondition(x))} options={condOpts} placeholder="كل أنواع الحالات" /></div>
            </>
          )}
          <button onClick={() => setShowFilters((s) => !s)} className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-white px-3.5 py-2.5 text-xs font-bold text-ink-soft transition-colors hover:bg-surface">{I.filter} فلترة</button>
          <button onClick={resetFilters} className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-white px-3.5 py-2.5 text-xs font-bold text-ink-soft transition-colors hover:bg-surface">{I.reset} إعادة تعيين</button>
        </div>
      </div>

      {/* تصدير + الإجمالي + حذف المحدد */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button onClick={exportCsv} className="inline-flex items-center gap-1.5 rounded-xl bg-[#0F6C73] px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#1FA6A8]">{I.export} تصدير</button>
          {selected.size > 0 && (
            <button onClick={bulkDelete} className="inline-flex items-center gap-1.5 rounded-xl bg-red-50 px-4 py-2.5 text-xs font-bold text-red-600 transition-colors hover:bg-red-600 hover:text-white">{I.trash} حذف المحدد ({selected.size})</button>
          )}
        </div>
        <p className="text-sm font-semibold text-ink-soft">إجمالي الطلبات: <span className="font-extrabold text-[#0F6C73]">{total}</span> طلب</p>
      </div>

      {/* ===== جدول (ديسكتوب/تابلت) ===== */}
      <div className="hidden overflow-hidden rounded-2xl border border-line bg-white shadow-sm md:block">
        <div className="max-h-[70vh] overflow-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="sticky top-0 z-10 bg-surface">
              <tr className="text-ink-soft">
                <th className="w-12 px-4 py-3 text-center"><input type="checkbox" checked={allOnPage} onChange={toggleAll} className="h-4 w-4 accent-[#1FA6A8]" aria-label="تحديد الكل" /></th>
                <th className="px-4 py-3 text-start text-xs font-bold">ولي الأمر</th>
                <th className="px-4 py-3 text-start text-xs font-bold">نوع الحالة</th>
                <th className="px-4 py-3 text-start text-xs font-bold">الفرع</th>
                <th className="px-4 py-3 text-start text-xs font-bold">تاريخ الطلب</th>
                <th className="px-4 py-3 text-center text-xs font-bold">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-ink-soft">لا توجد طلبات مطابقة.</td></tr>
              ) : pageItems.map((it) => {
                const phone = v(it, "phone");
                const email = v(it, "email");
                const wa = phone.replace(/[^\d]/g, "");
                const s = stamp(v(it, "created_at"));
                const checked = selected.has(it.id);
                return (
                  <tr key={it.id} className={`border-t border-line transition-colors hover:bg-surface/50 ${checked ? "bg-[#1FA6A8]/5" : ""}`}>
                    <td className="px-4 py-3.5 text-center"><input type="checkbox" checked={checked} onChange={() => toggleOne(it.id)} className="h-4 w-4 accent-[#1FA6A8]" aria-label="تحديد" /></td>
                    <td className="px-4 py-3.5">
                      <p className="font-bold text-ink">{v(it, "parent_name") || "—"}</p>
                      {phone && <p dir="ltr" className="mt-0.5 text-start text-xs text-ink-soft">{phone}</p>}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1FA6A8]/10 px-3 py-1 text-xs font-bold text-[#0F6C73]"><span className="text-[#1FA6A8]">{I.tag}</span>{v(it, "case_type") || "—"}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1.5 text-ink"><span className="text-[#1FA6A8]">{I.pin}</span>{v(it, "branch") || "—"}</span>
                    </td>
                    <td className="px-4 py-3.5 text-ink-soft">
                      <span className="flex items-center gap-1.5"><span className="text-[#1FA6A8]">{I.cal}</span>{s.date}</span>
                      {s.time && <span className="mt-0.5 flex items-center gap-1.5 text-xs"><span className="text-[#1FA6A8]">{I.clock}</span>{s.time}</span>}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-center gap-1.5">
                        <div className="relative">
                          <button onClick={() => setMenu(menu === it.id ? null : it.id)} className={`${actBtn} hover:bg-surface`} title="المزيد" aria-label="المزيد">{I.more}</button>
                          {menu === it.id && (
                            <>
                              <div className="fixed inset-0 z-20" onClick={() => setMenu(null)} />
                              <div className="absolute end-0 z-30 mt-1 w-40 overflow-hidden rounded-xl border border-line bg-white py-1 shadow-xl">
                                <button onClick={() => del(it.id)} disabled={busy === it.id} className="flex w-full items-center gap-2 px-3 py-2 text-start text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50">{I.trash}{busy === it.id ? "جارٍ الحذف…" : "حذف الطلب"}</button>
                              </div>
                            </>
                          )}
                        </div>
                        {phone && <button onClick={() => copyPhone(it.id, phone)} className={`${actBtn} hover:border-[#1FA6A8] hover:text-[#0F6C73]`} title={copied === it.id ? "تم النسخ" : "نسخ الرقم"} aria-label="نسخ الرقم">{copied === it.id ? <span className="text-[#1FA6A8]">{I.check}</span> : I.phone}</button>}
                        {wa && <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener" className={`${actBtn} hover:border-[#25D366] hover:bg-[#25D366]/10 hover:text-[#25D366]`} title="واتساب" aria-label="واتساب">{I.wa}</a>}
                        {email && <a href={`mailto:${email}`} className={`${actBtn} hover:border-[#1FA6A8] hover:text-[#0F6C73]`} title="إيميل" aria-label="إيميل">{I.mail}</a>}
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
          <div className="rounded-2xl border border-dashed border-line bg-white p-8 text-center text-ink-soft">لا توجد طلبات مطابقة.</div>
        ) : pageItems.map((it) => {
          const phone = v(it, "phone");
          const email = v(it, "email");
          const wa = phone.replace(/[^\d]/g, "");
          const s = stamp(v(it, "created_at"));
          return (
            <div key={it.id} className="rounded-2xl border border-line bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-ink">{v(it, "parent_name") || "—"}</p>
                  {phone && <p dir="ltr" className="mt-0.5 text-start text-xs text-ink-soft">{phone}</p>}
                </div>
                <input type="checkbox" checked={selected.has(it.id)} onChange={() => toggleOne(it.id)} className="mt-1 h-4 w-4 accent-[#1FA6A8]" aria-label="تحديد" />
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1FA6A8]/10 px-3 py-1 font-bold text-[#0F6C73]"><span className="text-[#1FA6A8]">{I.tag}</span>{v(it, "case_type") || "—"}</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 text-ink-soft"><span className="text-[#1FA6A8]">{I.pin}</span>{v(it, "branch") || "—"}</span>
              </div>
              <p className="mt-2 flex items-center gap-1.5 text-xs text-ink-soft"><span className="text-[#1FA6A8]">{I.cal}</span>{s.date}{s.time ? ` · ${s.time}` : ""}</p>
              <div className="mt-3 flex items-center gap-1.5 border-t border-line pt-3">
                {phone && <button onClick={() => copyPhone(it.id, phone)} className={`${actBtn} hover:border-[#1FA6A8]`} aria-label="نسخ الرقم">{copied === it.id ? <span className="text-[#1FA6A8]">{I.check}</span> : I.phone}</button>}
                {wa && <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener" className={`${actBtn} hover:text-[#25D366]`} aria-label="واتساب">{I.wa}</a>}
                {email && <a href={`mailto:${email}`} className={actBtn} aria-label="إيميل">{I.mail}</a>}
                <button onClick={() => del(it.id)} disabled={busy === it.id} className="ms-auto inline-flex items-center gap-1.5 rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 disabled:opacity-50">{I.trash} حذف</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ===== الترقيم ===== */}
      {total > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-white px-4 py-3 shadow-sm">
          <div className="flex items-center gap-2 text-xs text-ink-soft">
            <span>عدد الصفوف:</span>
            <div className="w-[72px]"><CustomSelect value={String(perPage)} onChange={(x) => { setPerPage(Number(x)); setPage(1); }} options={[{ value: "10", label: "10" }, { value: "25", label: "25" }, { value: "50", label: "50" }]} /></div>
          </div>
          <p className="text-xs font-semibold text-ink-soft">عرض {total === 0 ? 0 : startIdx + 1} إلى {Math.min(startIdx + perPage, total)} من {total} طلب</p>
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

function PgBtn({ children, onClick, disabled }: { children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-white text-sm text-ink-soft transition-colors hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40">{children}</button>
  );
}
