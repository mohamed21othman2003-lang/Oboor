"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { clearToken, getToken, type CmsUser } from "@/lib/cms/api";

type NavItem = { label: string; href: string; icon: keyof typeof ICONS };
type NavGroup = { title: string; items: NavItem[] };

const NAV: NavGroup[] = [
  {
    title: "عام",
    items: [{ label: "لوحة التحكّم", href: "/cms", icon: "grid" }],
  },
  {
    title: "الطلبات والرسائل",
    items: [
      { label: "رسائل التواصل", href: "/cms/submissions/contact", icon: "mail" },
      { label: "طلبات الالتحاق", href: "/cms/submissions/admission", icon: "userPlus" },
      { label: "طلبات التوظيف", href: "/cms/submissions/career", icon: "briefcase" },
      { label: "نتائج التقييم", href: "/cms/submissions/assessment", icon: "clipboard" },
    ],
  },
  {
    title: "محتوى الموقع",
    items: [
      { label: "الأخبار والمقالات", href: "/cms/content/news", icon: "news" },
      { label: "البرامج التأهيلية", href: "/cms/content/programs", icon: "cap" },
      { label: "الخدمات العيادية", href: "/cms/content/services", icon: "health" },
      { label: "التقنيات التأهيلية", href: "/cms/content/techniques", icon: "chip" },
      { label: "الفروع", href: "/cms/content/branches", icon: "pin" },
      { label: "الأخصائيون", href: "/cms/content/specialists", icon: "user" },
      { label: "قصص النجاح", href: "/cms/content/success", icon: "star" },
      { label: "الوظائف", href: "/cms/content/careers", icon: "megaphone" },
    ],
  },
  {
    title: "الرئيسية والإعدادات",
    items: [
      { label: "أقسام الصفحات", href: "/cms/content/sections", icon: "layers" },
      { label: "إعدادات الموقع", href: "/cms/settings", icon: "cog" },
    ],
  },
];

export default function CmsShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<CmsUser | null>(null);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/cms/login");
      return;
    }
    try {
      const u = localStorage.getItem("oboor_cms_user");
      if (u) setUser(JSON.parse(u));
    } catch {}
    setReady(true);
  }, [router]);

  if (!ready) {
    return <div className="flex min-h-screen items-center justify-center bg-[#f4f8f9] text-ink-soft">جارٍ التحميل…</div>;
  }

  const logout = () => {
    clearToken();
    localStorage.removeItem("oboor_cms_user");
    router.replace("/cms/login");
  };

  return (
    <div dir="rtl" className="flex min-h-screen bg-[#f4f8f9] text-ink">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 right-0 z-40 w-72 transform overflow-y-auto bg-brand-deep text-white transition-transform lg:static lg:translate-x-0 ${open ? "translate-x-0" : "translate-x-full lg:translate-x-0"}`}>
        <div className="flex items-center gap-3 border-b border-white/10 px-6 py-5">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white p-1.5">
            <Image src="/logo.png" alt="عبور" width={40} height={40} className="h-full w-auto object-contain" />
          </span>
          <div>
            <p className="text-sm font-extrabold">مركز عبور</p>
            <p className="text-[11px] text-white/55">لوحة التحكّم</p>
          </div>
        </div>
        <nav className="px-3 py-4">
          {NAV.map((group) => (
            <div key={group.title} className="mb-5">
              <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wide text-white/40">{group.title}</p>
              <ul className="space-y-1">
                {group.items.map((it) => {
                  const active = pathname === it.href || (it.href !== "/cms" && pathname.startsWith(it.href));
                  return (
                    <li key={it.href}>
                      <Link
                        href={it.href}
                        onClick={() => setOpen(false)}
                        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${active ? "bg-brand text-white shadow-sm" : "text-white/70 hover:bg-white/10 hover:text-white"}`}
                      >
                        <span className="shrink-0">{ICONS[it.icon]}</span>
                        {it.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      {open && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-line bg-white/90 px-5 py-3 backdrop-blur">
          <div className="flex items-center gap-3">
            <button onClick={() => setOpen((v) => !v)} className="rounded-lg p-2 text-ink-soft hover:bg-surface lg:hidden" aria-label="القائمة">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" /></svg>
            </button>
            <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-ink-muted transition-colors hover:bg-surface">
              معاينة الموقع
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" /></svg>
            </a>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-end">
              <p className="text-sm font-bold leading-tight">{user?.name || "—"}</p>
              <p className="text-[11px] text-ink-soft">مدير النظام</p>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/10 text-sm font-bold text-brand">{(user?.name || "ع").charAt(0)}</span>
            <button onClick={logout} className="rounded-lg p-2 text-ink-soft transition-colors hover:bg-red-50 hover:text-red-600" aria-label="تسجيل الخروج" title="تسجيل الخروج">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></svg>
            </button>
          </div>
        </header>

        <main className="flex-1 p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

const ICONS: Record<string, React.ReactNode> = {
  grid: <Svg><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></Svg>,
  mail: <Svg><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></Svg>,
  userPlus: <Svg><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M19 8v6M22 11h-6" /></Svg>,
  briefcase: <Svg><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></Svg>,
  clipboard: <Svg><rect x="8" y="3" width="8" height="4" rx="1" /><path d="M9 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3" /></Svg>,
  news: <Svg><path d="M4 4h13v16H6a2 2 0 0 1-2-2z" /><path d="M17 8h3v10a2 2 0 0 1-2 2M8 8h5M8 12h5M8 16h3" /></Svg>,
  cap: <Svg><path d="M22 10L12 5 2 10l10 5 10-5z" /><path d="M6 12v5c0 1 2.7 2.5 6 2.5s6-1.5 6-2.5v-5" /></Svg>,
  health: <Svg><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></Svg>,
  chip: <Svg><rect x="6" y="6" width="12" height="12" rx="2" /><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" /></Svg>,
  pin: <Svg><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></Svg>,
  user: <Svg><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></Svg>,
  star: <Svg><path d="M12 3l2.9 6.3 6.6.6-5 4.4 1.5 6.4L12 17.8 6 21l1.5-6.4-5-4.4 6.6-.6z" /></Svg>,
  megaphone: <Svg><path d="M3 11l16-7v16L3 13zM3 11v2M8 13v6l4-1" /></Svg>,
  layers: <Svg><path d="M12 2l9 5-9 5-9-5z" /><path d="M3 12l9 5 9-5M3 17l9 5 9-5" /></Svg>,
  cog: <Svg><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 0 1-4 0v-.1A1.6 1.6 0 0 0 7 19.4a1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.6 1.6 0 0 0 3 14a2 2 0 0 1 0-4h.1A1.6 1.6 0 0 0 4.6 7a1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.6 1.6 0 0 0 10 3.6 2 2 0 0 1 14 3.6a1.6 1.6 0 0 0 2.7-1.1L17 2a2 2 0 0 1 4 0v.1A1.6 1.6 0 0 0 22 4.6" /></Svg>,
};

function Svg({ children }: { children: React.ReactNode }) {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">{children}</svg>;
}
