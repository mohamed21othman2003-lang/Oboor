import Link from "next/link";
import { COLLECTIONS } from "@/lib/admin/collections";
import { SETTINGS } from "@/lib/admin/settings";
import Icon from "@/components/admin/icons";

export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-800">أهلاً بك في لوحة التحكّم 👋</h1>
        <p className="mt-1 text-sm text-slate-500">من هنا تتحكّم في كل محتوى الموقع — عربي وإنجليزي — بدون أي تعديل في الكود.</p>
      </div>

      {/* Quick stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {COLLECTIONS.map((c) => (
          <Link
            key={c.key}
            href={`/admin/${c.key}`}
            className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand-dark transition-colors group-hover:bg-brand group-hover:text-white">
                <Icon name={c.icon} size={20} />
              </span>
              <span className="text-2xl font-extrabold text-slate-800">{c.seed.length}</span>
            </div>
            <p className="mt-3 text-sm font-bold text-slate-700">{c.label}</p>
            <p className="text-[11px] text-slate-400">إدارة {c.label} ←</p>
          </Link>
        ))}
      </div>

      {/* Settings + sections */}
      <h2 className="mb-3 text-sm font-bold text-slate-500">الإعدادات العامة</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {SETTINGS.map((g) => (
          <Link
            key={g.key}
            href="/admin/settings"
            className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white p-5 text-center transition-all hover:border-brand/40 hover:shadow-md"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <Icon name={g.icon} size={20} />
            </span>
            <p className="text-xs font-bold text-slate-700">{g.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
