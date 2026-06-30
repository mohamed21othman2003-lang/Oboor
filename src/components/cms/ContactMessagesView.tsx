"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import CustomSelect from "@/components/ui/Select";
import { type CmsItem } from "@/lib/cms/api";

/* ===== رسائل التواصل — تصميم Inbox مقسوم (قائمة + تفاصيل) — ديزاين فقط ===== */

const MONTHS_AR = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];

function stamp(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  const h = d.getHours();
  const am = h < 12;
  const h12 = h % 12 === 0 ? 12 : h % 12;
  const t = `${h12}:${String(d.getMinutes()).padStart(2, "0")} ${am ? "ص" : "م"}`;
  return `${d.getDate()} ${MONTHS_AR[d.getMonth()]} ${d.getFullYear()} · ${t}`;
}

function relTime(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const diff = (d.getTime() - Date.now()) / 1000;
  const abs = Math.abs(diff);
  const rtf = new Intl.RelativeTimeFormat("ar", { numeric: "auto" });
  if (abs < 60) return "الآن";
  if (abs < 3600) return rtf.format(Math.round(diff / 60), "minute");
  if (abs < 86400) return rtf.format(Math.round(diff / 3600), "hour");
  if (abs < 2592000) return rtf.format(Math.round(diff / 86400), "day");
  if (abs < 31536000) return rtf.format(Math.round(diff / 2592000), "month");
  return rtf.format(Math.round(diff / 31536000), "year");
}

const uniq = (a: string[]) => [...new Set(a.filter(Boolean))];

const I = {
  search: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>,
  filter: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" /></svg>,
  reset: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></svg>,
  mail: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>,
  chats: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>,
  inbox: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-6l-2 3h-4l-2-3H2" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></svg>,
  phone: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.8 2z" /></svg>,
  copy: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>,
  check: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>,
  wa: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.5A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.7-.1-.4-.1-.9-.3-1.6-.6-2.7-1.2-4.5-4-4.6-4.2-.1-.2-1.1-1.5-1.1-2.8s.7-2 .9-2.2c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.1.1.3 0 .5l-.4.5-.3.3c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.6-.1l.7-.9c.2-.2.4-.2.6-.1l1.8.9c.2.1.4.2.5.3.1.2.1.7-.1 1.1z" /></svg>,
  trash: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>,
  pin: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>,
  tag: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.6 13.4 12 22l-9-9V3h10z" /><circle cx="7.5" cy="7.5" r="1.5" /></svg>,
  msg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>,
};

export default function ContactMessagesView({
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
  const [mtype, setMtype] = useState("");
  const [range, setRange] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [visible, setVisible] = useState(10);
  const [selId, setSelId] = useState<number | null>(items[0]?.id ?? null);
  const [copied, setCopied] = useState(false);

  const branchOpts = useMemo(() => [{ value: "", label: "كل الفروع" }, ...uniq(items.map((it) => v(it, "branch"))).map((b) => ({ value: b, label: b }))], [items]);
  const typeOpts = useMemo(() => [{ value: "", label: "كل الأنواع" }, ...uniq(items.map((it) => v(it, "type"))).map((t) => ({ value: t, label: t }))], [items]);
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
      if (q && !`${v(it, "name")} ${v(it, "message")} ${v(it, "phone")}`.toLowerCase().includes(q)) return false;
      if (branch && v(it, "branch") !== branch) return false;
      if (mtype && v(it, "type") !== mtype) return false;
      if (range) {
        const c = new Date(v(it, "created_at"));
        if (isNaN(c.getTime())) return false;
        if (range === "today") {
          if (c.getFullYear() !== now.getFullYear() || c.getMonth() !== now.getMonth() || c.getDate() !== now.getDate()) return false;
        } else if ((now.getTime() - c.getTime()) / 86400000 > Number(range)) return false;
      }
      return true;
    });
  }, [items, query, branch, mtype, range]);

  // عدّادات حقيقية فقط (لا نخترع حالة «تم الرد»)
  const counts = useMemo(() => {
    const now = new Date();
    const isSameDay = (c: Date) => c.getFullYear() === now.getFullYear() && c.getMonth() === now.getMonth() && c.getDate() === now.getDate();
    let today = 0, week = 0;
    for (const it of items) {
      const c = new Date(v(it, "created_at"));
      if (isNaN(c.getTime())) continue;
      if (isSameDay(c)) today++;
      if ((now.getTime() - c.getTime()) / 86400000 <= 7) week++;
    }
    return { total: items.length, today, week };
  }, [items]);

  const selected = filtered.find((it) => it.id === selId) || filtered[0] || null;
  const reset = () => { setQuery(""); setBranch(""); setMtype(""); setRange(""); };
  const copyPhone = (phone: string) => navigator.clipboard?.writeText(phone).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); });
  const removeSelected = async () => { if (!selected || !confirm("حذف هذه الرسالة نهائياً؟")) return; await onDelete(selected.id); setSelId(null); };

  return (
    <div className="space-y-5">
      {/* رأس الصفحة */}
      <div>
        <Link href="/cms" className="text-xs font-semibold text-[#0F6C73] hover:text-[#1FA6A8]">← لوحة التحكّم</Link>
        <h1 className="mt-1 text-2xl font-extrabold text-ink">{label}</h1>
        <p className="mt-1 text-sm text-ink-soft">عرض وإدارة جميع رسائل التواصل الواردة من المستخدمين</p>
      </div>

      {/* عدّادات */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Counter icon={I.inbox} value={counts.total} label="إجمالي الرسائل" />
        <Counter icon={I.chats} value={counts.week} label="آخر ٧ أيام" />
        <Counter icon={I.mail} value={counts.today} label="رسائل اليوم" />
      </div>

      {/* شريط الفلاتر */}
      <div className="rounded-2xl border border-line bg-white p-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative min-w-[220px] flex-1">
            <span className="pointer-events-none absolute inset-y-0 start-3 flex items-center text-ink-soft">{I.search}</span>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ابحث في الرسائل…" className="w-full rounded-xl border border-line bg-surface/60 py-2.5 pe-3 ps-10 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20" />
          </div>
          {showFilters && (
            <>
              <div className="w-[150px]"><CustomSelect value={range} onChange={setRange} options={rangeOpts} placeholder="كل الوقت" /></div>
              <div className="w-[160px]"><CustomSelect value={mtype} onChange={setMtype} options={typeOpts} placeholder="كل الأنواع" /></div>
              <div className="w-[170px]"><CustomSelect value={branch} onChange={setBranch} options={branchOpts} placeholder="كل الفروع" /></div>
            </>
          )}
          <button onClick={() => setShowFilters((s) => !s)} className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-white px-3.5 py-2.5 text-xs font-bold text-ink-soft transition-colors hover:bg-surface">{I.filter} فلترة</button>
          <button onClick={reset} className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-white px-3.5 py-2.5 text-xs font-bold text-ink-soft transition-colors hover:bg-surface">{I.reset} إعادة تعيين</button>
        </div>
      </div>

      {/* العرض المقسوم */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_340px]">
        {/* قائمة الرسائل (يسار على الديسكتوب، وأول عنصر على الموبايل) */}
        <div className="rounded-2xl border border-line bg-white shadow-sm lg:order-2">
          <div className="border-b border-line px-4 py-3 text-sm font-extrabold text-ink">الرسائل ({filtered.length})</div>
          {filtered.length === 0 ? (
            <p className="p-8 text-center text-sm text-ink-soft">لا توجد رسائل مطابقة.</p>
          ) : (
            <div className="max-h-[64vh] overflow-auto">
              {filtered.slice(0, visible).map((it) => {
                const active = selected?.id === it.id;
                const name = v(it, "name") || `#${it.id}`;
                return (
                  <button
                    key={it.id}
                    onClick={() => setSelId(it.id)}
                    className={`flex w-full items-start gap-3 border-b border-line px-4 py-3 text-start transition-colors ${active ? "border-s-[3px] border-s-[#1FA6A8] bg-[#1FA6A8]/8" : "border-s-[3px] border-s-transparent hover:bg-surface/60"}`}
                  >
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${active ? "bg-[#1FA6A8] text-white" : "bg-[#1FA6A8]/12 text-[#0F6C73]"}`}>{name.charAt(0)}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate font-bold text-ink">{name}</p>
                        <span className="shrink-0 text-[10px] text-ink-soft">{relTime(v(it, "created_at"))}</span>
                      </div>
                      <p className="mt-0.5 truncate text-xs text-ink-soft">{v(it, "message") || "—"}</p>
                    </div>
                  </button>
                );
              })}
              {visible < filtered.length && (
                <button onClick={() => setVisible((n) => n + 10)} className="flex w-full items-center justify-center gap-1.5 py-3 text-xs font-bold text-[#0F6C73] transition-colors hover:bg-surface">عرض المزيد <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d="M6 9l6 6 6-6" /></svg></button>
              )}
            </div>
          )}
        </div>

        {/* تفاصيل الرسالة (يمين على الديسكتوب) */}
        <div className="rounded-2xl border border-line bg-white p-5 shadow-sm lg:order-1">
          {!selected ? (
            <div className="flex h-full min-h-[300px] flex-col items-center justify-center text-center text-ink-soft">
              <span className="mb-2 text-[#1FA6A8]/40">{I.inbox}</span>
              اختر رسالة من القائمة لعرض تفاصيلها.
            </div>
          ) : (() => {
            const name = v(selected, "name") || `#${selected.id}`;
            const phone = v(selected, "phone");
            const email = v(selected, "email");
            const wa = phone.replace(/[^\d]/g, "");
            return (
              <div className="space-y-4">
                {/* رأس */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1FA6A8]/12 text-lg font-extrabold text-[#0F6C73]">{name.charAt(0)}</span>
                    <div>
                      <p className="text-lg font-extrabold text-ink">{name}</p>
                      <p className="mt-0.5 text-xs text-ink-soft">{stamp(v(selected, "created_at"))}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {phone && <a href={`tel:${phone.replace(/\s+/g, "")}`} className="inline-flex items-center gap-1.5 rounded-xl bg-[#0F6C73] px-3.5 py-2 text-xs font-bold text-white transition-colors hover:bg-[#1FA6A8]">{I.phone} اتصال</a>}
                    {wa && <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 rounded-xl bg-[#25D366] px-3.5 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90">{I.wa} واتساب</a>}
                    {phone && <button onClick={() => copyPhone(phone)} className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-white px-3.5 py-2 text-xs font-bold text-[#0F6C73] transition-colors hover:bg-surface">{copied ? I.check : I.copy}{copied ? "تم النسخ" : "نسخ الرقم"}</button>}
                    <button onClick={removeSelected} disabled={busy === selected.id} className="inline-flex items-center gap-1.5 rounded-xl bg-red-50 px-3.5 py-2 text-xs font-bold text-red-600 transition-colors hover:bg-red-600 hover:text-white disabled:opacity-50">{I.trash}{busy === selected.id ? "…" : "حذف"}</button>
                  </div>
                </div>

                {/* بطاقات المعلومات */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <InfoCard icon={I.phone} label="الجوال" value={phone || "—"} ltr />
                  <InfoCard icon={I.pin} label="الفرع" value={v(selected, "branch") || "—"} />
                  <InfoCard icon={I.tag} label="نوع الخدمة" value={v(selected, "type") || "—"} />
                </div>
                {email && <InfoCard icon={I.mail} label="البريد" value={email} ltr />}

                {/* الرسالة */}
                <div className="rounded-xl border border-line bg-surface/40 p-4">
                  <p className="mb-2 flex items-center gap-1.5 text-xs font-bold text-ink-soft"><span className="text-[#1FA6A8]">{I.msg}</span> الرسالة</p>
                  <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-ink">{v(selected, "message") || "—"}</p>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

function Counter({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3 shadow-sm">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1FA6A8]/10 text-[#0F6C73]">{icon}</span>
      <div>
        <p className="text-xl font-extrabold text-ink">{value}</p>
        <p className="text-xs text-ink-soft">{label}</p>
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value, ltr }: { icon: React.ReactNode; label: string; value: string; ltr?: boolean }) {
  return (
    <div className="rounded-xl border border-line bg-surface/40 p-3 text-center">
      <span className="mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-lg bg-[#1FA6A8]/10 text-[#1FA6A8]">{icon}</span>
      <p className="text-[11px] font-semibold text-ink-soft">{label}</p>
      <p className="mt-0.5 break-words text-sm font-bold text-ink" dir={ltr ? "ltr" : undefined}>{value}</p>
    </div>
  );
}
