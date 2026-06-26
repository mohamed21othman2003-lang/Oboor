"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getStats, type DashboardStats, TYPE_LABELS } from "@/lib/cms/api";

// ===== خريطة الأيقونات =====
function I({ children }: { children: React.ReactNode }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">{children}</svg>;
}
const ICONS: Record<string, React.ReactNode> = {
  mail: <I><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></I>,
  admission: <I><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M19 8v6M22 11h-6" /></I>,
  briefcase: <I><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></I>,
  clipboard: <I><rect x="8" y="3" width="8" height="4" rx="1" /><path d="M9 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3" /><path d="M9 14l2 2 4-4" /></I>,
  news: <I><path d="M4 4h13v16H6a2 2 0 0 1-2-2z" /><path d="M17 8h3v10a2 2 0 0 1-2 2M8 8h5M8 12h5M8 16h3" /></I>,
  cap: <I><path d="M22 10L12 5 2 10l10 5 10-5z" /><path d="M6 12v5c0 1 2.7 2.5 6 2.5s6-1.5 6-2.5v-5" /></I>,
  health: <I><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></I>,
  chip: <I><rect x="6" y="6" width="12" height="12" rx="2" /><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" /></I>,
  pin: <I><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></I>,
  user: <I><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></I>,
  star: <I><path d="M12 3l2.9 6.3 6.6.6-5 4.4 1.5 6.4L12 17.8 6 21l1.5-6.4-5-4.4 6.6-.6z" /></I>,
  megaphone: <I><path d="M3 11l16-7v16L3 13zM3 11v2M8 13v6l4-1" /></I>,
  layers: <I><path d="M12 2l9 5-9 5-9-5z" /><path d="M3 12l9 5 9-5M3 17l9 5 9-5" /></I>,
  cog: <I><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8 2 2 0 1 1-2.8 2.8 1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 0 1-4 0 1.6 1.6 0 0 0-2.7-1.1 2 2 0 1 1-2.8-2.8A1.6 1.6 0 0 0 3 14a2 2 0 0 1 0-4 1.6 1.6 0 0 0 1.1-2.7 2 2 0 1 1 2.8-2.8A1.6 1.6 0 0 0 10 3.6 2 2 0 0 1 14 3.6a1.6 1.6 0 0 0 2.7 1.1 2 2 0 1 1 2.8 2.8A1.6 1.6 0 0 0 22 10" /></I>,
  hero: <I><rect x="3" y="4" width="18" height="14" rx="2" /><path d="M8 21h8M12 18v3M7 10l3 3 4-5 3 4" /></I>,
  stats: <I><path d="M3 3v18h18" /><rect x="7" y="11" width="3" height="6" /><rect x="13" y="7" width="3" height="10" /></I>,
  features: <I><path d="M12 2l2.4 5 5.6.8-4 3.9 1 5.5L12 14.5 7 17.2l1-5.5-4-3.9L9.6 7z" /></I>,
  image: <I><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></I>,
  cards: <I><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></I>,
  checklist: <I><path d="M9 11l2 2 4-4" /><rect x="3" y="4" width="18" height="16" rx="2" /></I>,
};

// أيقونة كل نوع محتوى
const CONTENT_ICON: Record<string, string> = {
  news: "news", programs: "cap", services: "health", techniques: "chip", branches: "pin",
  specialists: "user", success: "star", careers: "megaphone", "assessment-cards": "checklist",
  hero: "hero", stats: "stats", features: "features", gallery: "image", "service-cards": "cards",
  sections: "layers", settings: "cog",
};

// تجميع المحتوى في 3 أقسام (حسب تصميم الديزاينر)
const GROUPS: { title: string; keys: string[] }[] = [
  { title: "محتوى الموقع", keys: ["gallery", "hero", "success", "news", "settings", "sections", "features", "stats"] },
  { title: "البرامج والخدمات", keys: ["service-cards", "services", "techniques", "programs", "assessment-cards"] },
  { title: "الموارد", keys: ["branches", "careers", "specialists"] },
];

// ألوان كروت الإحصائيات (KPI)
const KPI_TONE: Record<string, { icon: string; bg: string; bar: string }> = {
  contact: { icon: "text-[#2563eb]", bg: "bg-[#2563eb]/10", bar: "bg-[#2563eb]" },
  admission: { icon: "text-[#1FA6A8]", bg: "bg-[#1FA6A8]/12", bar: "bg-[#1FA6A8]" },
  career: { icon: "text-[#d97706]", bg: "bg-[#d97706]/10", bar: "bg-[#d97706]" },
  assessment: { icon: "text-[#7c3aed]", bg: "bg-[#7c3aed]/10", bar: "bg-[#7c3aed]" },
};
const KPI_ICON: Record<string, string> = { contact: "mail", admission: "admission", career: "briefcase", assessment: "clipboard" };

const QUICK = [
  { label: "إضافة خبر", desc: "انشر مقالاً أو فعالية جديدة", href: "/cms/content/news/new", icon: "news" },
  { label: "إضافة أخصائي", desc: "أضف عضواً للفريق الطبي", href: "/cms/content/specialists/new", icon: "user" },
  { label: "إضافة برنامج", desc: "أنشئ برنامجاً تأهيلياً", href: "/cms/content/programs/new", icon: "cap" },
  { label: "رفع صورة", desc: "أضف صورة إلى المعرض", href: "/cms/content/gallery/new", icon: "image" },
];

export default function CmsDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [user, setUser] = useState<string>("");
  const [error, setError] = useState("");

  useEffect(() => {
    getStats().then(setStats).catch((e) => setError(e.message));
    try {
      const u = localStorage.getItem("oboor_cms_user");
      if (u) { const p = JSON.parse(u); setUser(p.name || p.username || ""); }
    } catch {}
  }, []);

  if (error) return <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>;
  if (!stats) return <p className="text-[#0F6C73]">جارٍ التحميل…</p>;

  // كل عناصر المحتوى مفهرسة بالمفتاح + بطاقة الإعدادات
  const byKey: Record<string, { key: string; label: string; count: number }> = {};
  [...stats.content, ...stats.home].forEach((c) => (byKey[c.key] = { ...c, label: TYPE_LABELS[c.key] ?? c.label }));
  byKey["settings"] = { key: "settings", label: "إعدادات الموقع", count: stats.totals.site_configured ? 1 : 0 };

  const maxSub = Math.max(1, ...stats.submissions.map((s) => s.count));

  return (
    <div className="space-y-8">
      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden rounded-[22px] bg-gradient-to-l from-[#0F6C73] to-[#1FA6A8] p-7 text-white shadow-lg sm:p-9">
        <Image src="/logo.png" alt="" width={220} height={120} aria-hidden className="pointer-events-none absolute -bottom-6 left-4 h-40 w-auto opacity-10 invert" />
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10" aria-hidden />
        <div className="relative">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">لوحة تحكّم مركز عبور</span>
          <h1 className="mt-4 text-2xl font-extrabold sm:text-3xl">مرحبًا بعودتك، {user || "admin"} 👋</h1>
          <p className="mt-2 max-w-lg text-sm text-white/85">نظرة شاملة على نشاط المنصة — الطلبات الواردة والمحتوى المنشور في مكان واحد.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <HeroStat icon={ICONS.cards} value={stats.totals.content} label="عنصر محتوى" />
            <HeroStat icon={ICONS.mail} value={stats.totals.submissions} label="إجمالي الطلبات" />
            <HeroStat icon={ICONS.cog} value={stats.totals.site_configured ? "مُهيّأة" : "غير مُهيّأة"} label="إعدادات الموقع" />
          </div>
        </div>
      </section>

      {/* ===== KPI (الطلبات) ===== */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.submissions.map((s) => {
          const tone = KPI_TONE[s.key] || KPI_TONE.contact;
          return (
            <Link key={s.key} href={`/cms/submissions/${s.key}`} className="group rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#e6eff0] transition-all hover:-translate-y-0.5 hover:shadow-md">
              <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${tone.bg} ${tone.icon}`}>{ICONS[KPI_ICON[s.key]]}</span>
              <p className="mt-4 text-3xl font-extrabold text-ink">{s.count}</p>
              <p className="mt-1 text-sm font-medium text-ink-soft">{s.label}</p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#F7FAFA]">
                <div className={`h-full rounded-full ${tone.bar}`} style={{ width: `${Math.round((s.count / maxSub) * 100)}%` }} />
              </div>
            </Link>
          );
        })}
      </div>

      {/* ===== إجراءات سريعة ===== */}
      <div>
        <SectionTitle icon={ICONS.stats}>إجراءات سريعة</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK.map((a) => (
            <Link key={a.href} href={a.href} className="group flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#e6eff0] transition-all hover:-translate-y-0.5 hover:shadow-md hover:ring-[#1FA6A8]/40">
              <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#1FA6A8] text-white transition-colors group-hover:bg-[#0F6C73]">
                {ICONS[a.icon]}
                <span className="absolute -left-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[#1FA6A8] shadow ring-1 ring-[#e6eff0]">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" d="M12 5v14M5 12h14" /></svg>
                </span>
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-ink">{a.label}</p>
                <p className="truncate text-xs text-ink-soft">{a.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ===== أقسام المحتوى ===== */}
      {GROUPS.map((g) => {
        const items = g.keys.map((k) => byKey[k]).filter(Boolean);
        if (!items.length) return null;
        const total = items.reduce((s, it) => s + it.count, 0);
        return (
          <div key={g.title}>
            <SectionTitle icon={ICONS.cards} meta={`${items.length} أقسام · ${total} عنصر`}>{g.title}</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((it) => (
                <ContentCard key={it.key} itemKey={it.key} label={it.label} count={it.count} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function HeroStat({ icon, value, label }: { icon: React.ReactNode; value: number | string; label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white/12 px-4 py-3 backdrop-blur">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">{icon}</span>
      <div>
        <p className="text-lg font-extrabold leading-none">{value}</p>
        <p className="mt-1 text-[11px] text-white/80">{label}</p>
      </div>
    </div>
  );
}

function SectionTitle({ icon, meta, children }: { icon: React.ReactNode; meta?: string; children: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-2.5">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1FA6A8]/12 text-[#1FA6A8]">{icon}</span>
      <h2 className="text-lg font-bold text-ink">{children}</h2>
      {meta && <span className="rounded-full bg-[#F7FAFA] px-3 py-1 text-[11px] font-semibold text-ink-soft ring-1 ring-[#e6eff0]">{meta}</span>}
    </div>
  );
}

function ContentCard({ itemKey, label, count }: { itemKey: string; label: string; count: number }) {
  const href = itemKey === "settings" ? "/cms/settings" : `/cms/content/${itemKey}`;
  const icon = ICONS[CONTENT_ICON[itemKey] || "cards"];
  return (
    <Link href={href} className="group flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#e6eff0] transition-all hover:-translate-y-0.5 hover:shadow-md hover:ring-[#1FA6A8]/40">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#1FA6A8]/10 text-[#1FA6A8] transition-colors group-hover:bg-[#1FA6A8] group-hover:text-white">{icon}</span>
      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-ink">{label}</p>
        <p className="mt-0.5 text-xs text-ink-soft">{count} عنصر</p>
      </div>
      <span className="mr-auto shrink-0 text-ink-soft transition-colors group-hover:text-[#1FA6A8]">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="dir-flip"><path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" /></svg>
      </span>
    </Link>
  );
}
