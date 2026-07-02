"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import CustomSelect from "@/components/ui/Select";
import { type CmsItem, type FieldSchema } from "@/lib/cms/api";
import { exportSheet } from "@/lib/cms/exportSheet";

/* ===== جدول طلبات التوظيف (CRM) — ديزاين فقط، نفس البيانات والأكشنز ===== */

const MONTHS_AR = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
function stamp(iso: string): { date: string; time: string } {
  if (!iso) return { date: "—", time: "" };
  const d = new Date(iso);
  if (isNaN(d.getTime())) return { date: iso, time: "" };
  const h = d.getHours();
  const am = h < 12;
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return { date: `${d.getDate()} ${MONTHS_AR[d.getMonth()]} ${d.getFullYear()}`, time: `${h12}:${String(d.getMinutes()).padStart(2, "0")} ${am ? "ص" : "م"}` };
}
const uniq = (a: string[]) => [...new Set(a.filter(Boolean))];

const I = {
  search: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>,
  reset: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></svg>,
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
  const v = (it: CmsItem, k: string) => { const x = it[k]; return x === null || x === undefined ? "" : String(x); };

  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const [job, setJob] = useState("");
  const [range, setRange] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [menu, setMenu] = useState<number | null>(null);
  const [copied, setCopied] = useState<number | null>(null);
  const [viewing, setViewing] = useState<CmsItem | null>(null);

  const cityOpts = useMemo(() => [{ value: "", label: "كل المدن" }, ...uniq(items.map((it) => v(it, "city"))).map((c) => ({ value: c, label: c }))], [items]);
  const jobOpts = useMemo(() => [{ value: "", label: "كل الوظائف" }, ...uniq(items.map((it) => v(it, "job"))).map((j) => ({ value: j, label: j }))], [items]);
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

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const cur = Math.min(page, pages);
  const startIdx = (cur - 1) * perPage;
  const pageItems = filtered.slice(startIdx, startIdx + perPage);

  const resetFilters = () => { setQuery(""); setCity(""); setJob(""); setRange(""); setPage(1); };
  const onFilter = (fn: () => void) => { fn(); setPage(1); };
  const copyPhone = (id: number, phone: string) => navigator.clipboard?.writeText(phone).then(() => { setCopied(id); setTimeout(() => setCopied((c) => (c === id ? null : c)), 1500); });
  const del = async (id: number) => { setMenu(null); if (!confirm("حذف هذا الطلب نهائياً؟")) return; await onDelete(id); };

  const exportCsv = async () => {
    const cols: [string, (it: CmsItem) => string, boolean?][] = [
      ["الاسم", (it) => v(it, "name")], ["البريد", (it) => v(it, "email")], ["الجوال", (it) => v(it, "phone")],
      ["الوظيفة", (it) => v(it, "job")], ["المدينة", (it) => v(it, "city")], ["المسمى الحالي", (it) => v(it, "current_role")],
      ["الخبرة", (it) => v(it, "experience")], ["التاريخ", (it) => { const s = stamp(v(it, "created_at")); return `${s.date} ${s.time}`.trim(); }],
      ["السيرة الذاتية", (it) => v(it, "cv"), true],
    ];
    await exportSheet({
      filename: "job-applications",
      sheetName: "طلبات التوظيف",
      columns: cols.map(([header, , link]) => ({ header, link })),
      rows: filtered.map((it) => cols.map(([, acc]) => acc(it))),
    });
  };

  const actBtn = "flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-white transition-colors";
  const cvLink = (it: CmsItem) => {
    const cv = v(it, "cv");
    return cv ? <a href={cv} target="_blank" rel="noopener" onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-1 text-xs font-bold text-[#0F6C73] hover:text-[#1FA6A8]">فتح الملف {I.open}</a> : <span className="text-ink-soft">—</span>;
  };

  return (
    <div className="space-y-5">
      <div>
        <Link href="/cms" className="text-xs font-semibold text-[#0F6C73] hover:text-[#1FA6A8]">← لوحة التحكّم</Link>
        <h1 className="mt-1 text-2xl font-extrabold text-ink">{label}</h1>
        <p className="mt-1 text-sm text-ink-soft">عرض وإدارة جميع طلبات التوظيف الواردة</p>
      </div>

      {/* شريط الفلاتر */}
      <div className="rounded-2xl border border-line bg-white p-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative min-w-[230px] flex-1">
            <span className="pointer-events-none absolute inset-y-0 start-3 flex items-center text-ink-soft">{I.search}</span>
            <input value={query} onChange={(e) => onFilter(() => setQuery(e.target.value))} placeholder="ابحث عن اسم أو بريد إلكتروني أو هاتف…" className="w-full rounded-xl border border-line bg-surface/60 py-2.5 pe-3 ps-10 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20" />
          </div>
          <div className="w-[150px]"><CustomSelect value={range} onChange={(x) => onFilter(() => setRange(x))} options={rangeOpts} placeholder="كل الوقت" /></div>
          <div className="w-[160px]"><CustomSelect value={city} onChange={(x) => onFilter(() => setCity(x))} options={cityOpts} placeholder="كل المدن" /></div>
          <div className="w-[180px]"><CustomSelect value={job} onChange={(x) => onFilter(() => setJob(x))} options={jobOpts} placeholder="كل الوظائف" /></div>
          <button onClick={resetFilters} className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-white px-3.5 py-2.5 text-xs font-bold text-ink-soft transition-colors hover:bg-surface">{I.reset} إعادة تعيين</button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-ink-soft">إجمالي الطلبات: <span className="font-extrabold text-[#0F6C73]">{total}</span> طلب</p>
        <button onClick={exportCsv} className="inline-flex items-center gap-1.5 rounded-xl bg-[#0F6C73] px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#1FA6A8]">{I.export} تصدير</button>
      </div>

      {/* جدول (ديسكتوب) */}
      <div className="hidden overflow-hidden rounded-2xl border border-line bg-white shadow-sm lg:block">
        <div className="max-h-[70vh] overflow-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="sticky top-0 z-10 bg-surface text-ink-soft">
              <tr>
                <th className="px-4 py-3 text-start text-xs font-bold">المتقدم</th>
                <th className="px-4 py-3 text-center text-xs font-bold">الوظيفة</th>
                <th className="px-4 py-3 text-center text-xs font-bold">المدينة</th>
                <th className="px-4 py-3 text-center text-xs font-bold">المسمى الحالي</th>
                <th className="px-4 py-3 text-center text-xs font-bold">الخبرة</th>
                <th className="px-4 py-3 text-center text-xs font-bold">تاريخ التقديم</th>
                <th className="px-4 py-3 text-center text-xs font-bold">السيرة الذاتية</th>
                <th className="px-4 py-3 text-center text-xs font-bold">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-ink-soft">لا توجد طلبات مطابقة.</td></tr>
              ) : pageItems.map((it) => {
                const name = v(it, "name") || `#${it.id}`;
                const phone = v(it, "phone");
                const email = v(it, "email");
                const wa = phone.replace(/[^\d]/g, "");
                const s = stamp(v(it, "created_at"));
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
                        {email && <a href={`mailto:${email}`} className={`${actBtn} text-[#1FA6A8] hover:border-[#1FA6A8] hover:bg-[#1FA6A8]/10`} title="إيميل" aria-label="إيميل">{I.mail}</a>}
                        {wa && <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener" className={`${actBtn} text-[#25D366] hover:border-[#25D366] hover:bg-[#25D366]/10`} title="واتساب" aria-label="واتساب">{I.wa}</a>}
                        <button onClick={() => setViewing(it)} className={`${actBtn} text-[#0F6C73] hover:border-[#1FA6A8] hover:bg-[#1FA6A8]/10`} title="عرض التفاصيل" aria-label="عرض التفاصيل">{I.eye}</button>
                        <div className="relative">
                          <button onClick={() => setMenu(menu === it.id ? null : it.id)} className={`${actBtn} text-ink hover:bg-surface`} title="المزيد" aria-label="المزيد">{I.more}</button>
                          {menu === it.id && (
                            <>
                              <div className="fixed inset-0 z-20" onClick={() => setMenu(null)} />
                              <div className="absolute end-0 z-30 mt-1 w-44 overflow-hidden rounded-xl border border-line bg-white py-1 shadow-xl">
                                <button onClick={() => { setMenu(null); setViewing(it); }} className="flex w-full items-center gap-2 px-3 py-2 text-start text-xs font-semibold text-ink transition-colors hover:bg-surface">{I.eye} عرض التفاصيل</button>
                                {v(it, "cv") && <a href={v(it, "cv")} target="_blank" rel="noopener" className="flex w-full items-center gap-2 px-3 py-2 text-start text-xs font-semibold text-[#0F6C73] transition-colors hover:bg-surface">{I.file} فتح السيرة الذاتية</a>}
                                <button onClick={() => del(it.id)} disabled={busy === it.id} className="flex w-full items-center gap-2 px-3 py-2 text-start text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50">{I.trash}{busy === it.id ? "جارٍ الحذف…" : "حذف الطلب"}</button>
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
          <div className="rounded-2xl border border-dashed border-line bg-white p-8 text-center text-ink-soft">لا توجد طلبات مطابقة.</div>
        ) : pageItems.map((it) => {
          const name = v(it, "name") || `#${it.id}`;
          const phone = v(it, "phone");
          const email = v(it, "email");
          const wa = phone.replace(/[^\d]/g, "");
          const s = stamp(v(it, "created_at"));
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
                {email && <a href={`mailto:${email}`} className={`${actBtn} text-[#1FA6A8]`} aria-label="إيميل">{I.mail}</a>}
                {wa && <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener" className={`${actBtn} text-[#25D366]`} aria-label="واتساب">{I.wa}</a>}
                <button onClick={() => setViewing(it)} className={`${actBtn} text-[#0F6C73]`} aria-label="عرض التفاصيل">{I.eye}</button>
                <button onClick={() => del(it.id)} disabled={busy === it.id} className="ms-auto inline-flex items-center gap-1.5 rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 disabled:opacity-50">{I.trash} حذف</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* الترقيم */}
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

      {/* نافذة التفاصيل */}
      {viewing && (() => {
        const it = viewing;
        const phone = v(it, "phone");
        const email = v(it, "email");
        const wa = phone.replace(/[^\d]/g, "");
        const s = stamp(v(it, "created_at"));
        const shown = fields.filter((f) => f.type !== "json" && v(it, f.name).trim() !== "");
        const rows = shown.filter((f) => f.type !== "textarea");
        const boxes = shown.filter((f) => f.type === "textarea");
        const removeAndClose = async () => { if (!confirm("حذف هذا الطلب نهائياً؟")) return; await onDelete(it.id); setViewing(null); };
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
                <button onClick={() => setViewing(null)} className="flex h-9 w-9 items-center justify-center rounded-xl border border-line text-ink-soft transition-colors hover:bg-surface" aria-label="إغلاق">{I.x}</button>
              </div>

              <div className="flex flex-wrap gap-2 px-5 pt-4">
                {wa && <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 rounded-xl bg-[#25D366] px-3.5 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90">{I.wa} واتساب</a>}
                {email && <a href={`mailto:${email}`} className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-white px-3.5 py-2 text-xs font-bold text-[#1FA6A8] transition-colors hover:bg-surface">{I.mail} إيميل</a>}
                {phone && <button onClick={() => copyPhone(it.id, phone)} className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-white px-3.5 py-2 text-xs font-bold text-[#0F6C73] transition-colors hover:bg-surface">{copied === it.id ? I.check : I.copy}{copied === it.id ? "تم النسخ" : "نسخ الرقم"}</button>}
                {v(it, "cv") && <a href={v(it, "cv")} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-white px-3.5 py-2 text-xs font-bold text-[#0F6C73] transition-colors hover:bg-surface">{I.file} السيرة الذاتية {I.open}</a>}
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
                        {isLink ? <a href={val0} target="_blank" rel="noopener" className="font-bold text-[#1FA6A8] underline">فتح الملف ↗</a>
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
                <button onClick={removeAndClose} disabled={busy === it.id} className="inline-flex items-center gap-1.5 rounded-xl bg-red-50 px-4 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-600 hover:text-white disabled:opacity-50">{I.trash}{busy === it.id ? "جارٍ الحذف…" : "حذف الطلب"}</button>
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
