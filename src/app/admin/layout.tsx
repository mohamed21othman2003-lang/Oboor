"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { COLLECTIONS } from "@/lib/admin/collections";
import Icon from "@/components/admin/icons";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const NavItem = ({ href, icon, label }: { href: string; icon: string; label: string }) => {
    const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
    return (
      <Link
        href={href}
        onClick={() => setOpen(false)}
        className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
          active ? "bg-brand text-white shadow-sm" : "text-slate-300 hover:bg-white/10 hover:text-white"
        }`}
      >
        <Icon name={icon} size={18} />
        {label}
      </Link>
    );
  };

  return (
    <div dir="rtl" className="flex min-h-screen bg-slate-100 text-slate-800">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 right-0 z-40 w-72 shrink-0 overflow-y-auto bg-[#0d2b31] px-4 py-6 transition-transform lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="mb-8 flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white font-extrabold">ع</div>
          <div>
            <p className="text-sm font-extrabold text-white">لوحة تحكّم عبور</p>
            <p className="text-[11px] text-slate-400">نظام إدارة المحتوى</p>
          </div>
        </div>

        <nav className="space-y-1">
          <NavItem href="/admin" icon="dashboard" label="الرئيسية" />

          {[...new Set(COLLECTIONS.map((c) => c.group))].map((g) => (
            <div key={g}>
              <p className="px-3 pb-1 pt-5 text-[11px] font-bold uppercase tracking-wider text-slate-500">{g}</p>
              {COLLECTIONS.filter((c) => c.group === g).map((c) => (
                <NavItem key={c.key} href={`/admin/${c.key}`} icon={c.icon} label={c.label} />
              ))}
            </div>
          ))}

          <p className="px-3 pb-1 pt-5 text-[11px] font-bold uppercase tracking-wider text-slate-500">النظام</p>
          <NavItem href="/admin/submissions" icon="news" label="الطلبات والرسائل" />
          <NavItem href="/admin/settings" icon="settings" label="الإعدادات والصفحات" />
          <NavItem href="/admin/media" icon="image" label="مكتبة الوسائط" />
          <Link href="/" target="_blank" className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white">
            <Icon name="eye" size={18} />
            معاينة الموقع
          </Link>
        </nav>
      </aside>

      {open && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-5 shadow-sm">
          <button onClick={() => setOpen(true)} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden" aria-label="القائمة">
            <Icon name="menu" />
          </button>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-[11px] font-bold text-amber-700">نسخة تجريبية — التعديلات تُحفظ في المتصفح</span>
          <div className="flex items-center gap-3">
            <div className="hidden text-end sm:block">
              <p className="text-xs font-bold text-slate-700">مدير الموقع</p>
              <p className="text-[10px] text-slate-400">admin@oboor.com.sa</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/15 font-bold text-brand-dark">م</div>
          </div>
        </header>

        <main className="flex-1 p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
