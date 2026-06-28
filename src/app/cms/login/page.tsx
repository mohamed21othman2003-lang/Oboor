"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cmsLogin } from "@/lib/cms/api";

export default function CmsLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { user } = await cmsLogin(username.trim(), password);
      localStorage.setItem("oboor_cms_user", JSON.stringify(user));
      router.replace("/cms");
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذّر تسجيل الدخول.");
    } finally {
      setLoading(false);
    }
  }

  const FEATURES = [
    { t: "محتوى الموقع", d: "عدّل النصوص والصور والأقسام بسهولة" },
    { t: "الطلبات والرسائل", d: "تابع طلبات الالتحاق والتوظيف والتقييم" },
    { t: "تحديث فوري", d: "تعديلاتك تظهر على الموقع مباشرة" },
  ];

  return (
    <div dir="rtl" className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      {/* لوحة الهوية (تظهر على الشاشات الكبيرة) */}
      <aside className="relative hidden overflow-hidden bg-gradient-to-bl from-brand-deep via-[#0f4a54] to-[#0a2329] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-brand/10 blur-3xl" />
        {/* موجة سفلية خفيفة */}
        <svg className="pointer-events-none absolute bottom-0 left-0 w-full text-white/5" viewBox="0 0 1440 120" fill="currentColor" preserveAspectRatio="none"><path d="M0 60 C 240 120 480 120 720 80 C 960 40 1200 40 1440 80 L 1440 120 L 0 120 Z" /></svg>

        <div className="relative flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 p-2 ring-1 ring-white/20">
            <Image src="/logo.png" alt="عبور" width={44} height={44} className="h-full w-auto object-contain brightness-0 invert" />
          </span>
          <div>
            <p className="text-lg font-extrabold leading-tight">مركز عبور</p>
            <p className="text-xs text-white/70">للرعاية والتأهيل</p>
          </div>
        </div>

        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/90 ring-1 ring-white/15">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />لوحة إدارة المحتوى
          </span>
          <h2 className="mt-5 text-3xl font-extrabold leading-snug">أهلًا بك في لوحة تحكّم <span className="text-brand">عبور</span></h2>
          <p className="mt-3 max-w-sm text-sm leading-7 text-white/75">من هنا تدير محتوى الموقع بالكامل — بهدوء ووضوح، وبنفس هوية المركز.</p>

          <ul className="mt-8 space-y-3">
            {FEATURES.map((f) => (
              <li key={f.t} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand/20 text-brand">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M20 6L9 17l-5-5" /></svg>
                </span>
                <div>
                  <p className="text-sm font-bold">{f.t}</p>
                  <p className="text-xs text-white/65">{f.d}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-white/50">© مركز عبور للرعاية والتأهيل</p>
      </aside>

      {/* لوحة تسجيل الدخول */}
      <main className="flex items-center justify-center bg-[#F7FAFA] p-6 sm:p-10">
        <div className="w-full max-w-md">
          {/* شعار للموبايل */}
          <div className="mb-8 flex flex-col items-center text-center lg:hidden">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand/10 p-2">
              <Image src="/logo.png" alt="عبور" width={56} height={56} className="h-full w-auto object-contain" />
            </span>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-[#e6eff0] sm:p-10">
            <h1 className="text-2xl font-extrabold text-ink">تسجيل الدخول</h1>
            <p className="mt-1 text-sm text-ink-soft">أدخل بياناتك للوصول إلى لوحة التحكّم.</p>

            <form onSubmit={submit} className="mt-7 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-ink">اسم المستخدم</label>
                <div className="relative">
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                  </span>
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    autoFocus
                    className="w-full rounded-xl border border-line bg-surface px-4 py-3 pr-10 text-sm text-ink outline-none transition-colors focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20"
                    placeholder="admin"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-ink">كلمة المرور</label>
                <div className="relative">
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                  </span>
                  <input
                    type={show ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-xl border border-line bg-surface px-4 py-3 pr-10 pl-10 text-sm text-ink outline-none transition-colors focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "إخفاء" : "إظهار"} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft transition-colors hover:text-brand">
                    {show
                      ? <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20C5 20 1 12 1 12a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M1 1l22 22" /><path d="M9.5 9.5a3 3 0 0 0 4.2 4.2" /></svg>
                      : <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8z" /><circle cx="12" cy="12" r="3" /></svg>}
                  </button>
                </div>
              </div>

              {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3.5 text-base font-bold text-white shadow-sm transition-colors hover:bg-brand-dark disabled:opacity-60"
              >
                {loading ? "جارٍ الدخول…" : "تسجيل الدخول"}
                {!loading && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="dir-flip"><path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" /></svg>}
              </button>
            </form>
          </div>

          <Link href="/" className="mt-6 flex items-center justify-center gap-1.5 text-sm font-semibold text-ink-soft transition-colors hover:text-brand">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>
            العودة إلى الموقع
          </Link>
        </div>
      </main>
    </div>
  );
}
