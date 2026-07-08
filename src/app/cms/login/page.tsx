"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cmsLogin } from "@/lib/cms/api";
import { useCmsLang } from "@/lib/cms/i18n";

// هوية لوحة تحكّم عبور (نفس ألوان الداشبورد المعاد تصميمه)
// primary #1FA6A8 · deep #0F6C73 · dark #064E52 · accent #5FD3D0 · bg #F7FAFA
// ملاحظة RTL: أول عنصر في الـgrid يقع يمينًا → لوحة الهوية أولًا (يمين) ثم الفورم (يسار).

export default function CmsLoginPage() {
  const router = useRouter();
  const { lang, dir, setLang } = useCmsLang();
  const en = lang === "en";
  const t = (ar: string, e: string) => (en ? e : ar);
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
      // ارجع للصفحة المطلوبة بعد الدخول (مثل الدليل) إن كانت داخل الـCMS، وإلا اللوحة
      const next = new URLSearchParams(window.location.search).get("next");
      router.replace(next && next.startsWith("/cms") ? next : "/cms");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("تعذّر تسجيل الدخول.", "Unable to sign in."));
    } finally {
      setLoading(false);
    }
  }

  const FEATURES = [
    {
      t: t("إدارة المحتوى بسهولة", "Easy content management"),
      d: t("تحكّم كامل في صفحات وأقسام الموقع", "Full control over the site's pages and sections"),
      icon: (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></svg>
      ),
    },
    {
      t: t("متابعة الطلبات والرسائل", "Track requests & messages"),
      d: t("تابع الطلبات والرسائل الواردة بسهولة", "Follow incoming requests and messages with ease"),
      icon: (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
      ),
    },
    {
      t: t("تحديثات فورية", "Instant updates"),
      d: t("نشر التحديثات والمحتوى الجديد فورًا", "Publish new updates and content instantly"),
      icon: (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></svg>
      ),
    },
  ];

  return (
    <div dir={dir} className="grid min-h-screen bg-[#F7FAFA] lg:grid-cols-[1.05fr_1fr]">
      {/* ============ لوحة الهوية (يمين) ============ */}
      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-[#137e86] via-[#0F6C73] to-[#064E52] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        {/* موجات عضوية علوية وسفلية */}
        <svg aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-40 w-full text-white/10" viewBox="0 0 1440 200" fill="currentColor" preserveAspectRatio="none"><path d="M0 0h1440v96c-240 64-480 64-720 24C480 84 240 84 0 128z" /></svg>
        <svg aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-44 w-full text-black/10" viewBox="0 0 1440 200" fill="currentColor" preserveAspectRatio="none"><path d="M0 200h1440v-96c-240-64-480-64-720-24C480 116 240 116 0 72z" /></svg>
        {/* توهّجات ناعمة + نمط نقاط خفيف */}
        <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#5FD3D0]/20 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-16 h-80 w-80 rounded-full bg-[#5FD3D0]/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1.4px)", backgroundSize: "22px 22px" }} />

        {/* الشعار */}
        <div className="relative flex items-center gap-3">
          <Image src="/logo.png" alt={t("عبور", "Oboor")} width={128} height={84} className="h-14 w-auto object-contain brightness-0 invert" priority />
          <span className="h-9 w-px bg-white/20" />
          <div>
            <p className="text-base font-extrabold leading-tight">{t("مركز عبور", "Oboor Center")}</p>
            <p className="text-xs text-white/70">{t("للرعاية والتأهيل", "for Care & Rehabilitation")}</p>
          </div>
        </div>

        {/* العنوان + الوصف + المزايا */}
        <div className="relative">
          <h2 className="text-3xl font-extrabold leading-snug sm:text-[2.1rem]">
            {t("أهلًا بك في لوحة تحكّم ", "Welcome to the ")}<span className="text-[#8EE7E8]">{t("عبور", "Oboor")}</span>{t("", " dashboard")}
          </h2>
          <p className="mt-4 max-w-md text-sm leading-8 text-white/80">
            {t("من هنا تدير محتوى الموقع بالكامل بسهولة ووضوح، وتتابع رسائل وطلبات المستفيدين بكفاءة.",
               "Manage the entire site content here — easily and clearly — and follow beneficiaries' messages and requests efficiently.")}
          </p>

          <ul className="mt-9 space-y-1.5">
            {FEATURES.map((f, i) => (
              <li key={f.t}>
                <div className="flex items-center gap-4 py-3.5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#8EE7E8] ring-1 ring-white/15">{f.icon}</span>
                  <div className="min-w-0">
                    <p className="text-[15px] font-bold leading-tight">{f.t}</p>
                    <p className="mt-1 text-[13px] leading-relaxed text-white/65">{f.d}</p>
                  </div>
                </div>
                {i < FEATURES.length - 1 && <span className="block h-px w-full bg-white/10" />}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-white/45">{t("© مركز عبور للرعاية والتأهيل", "© Oboor Center for Care & Rehabilitation")}</p>
      </aside>

      {/* ============ لوحة تسجيل الدخول (يسار) ============ */}
      <main className="relative flex items-center justify-center p-6 sm:p-10">
        {/* مبدّل اللغة — حبّة صغيرة أعلى اللوحة */}
        <button
          type="button"
          onClick={() => setLang(en ? "ar" : "en")}
          className="absolute start-6 top-6 inline-flex items-center gap-1.5 rounded-full border border-[#e2ecec] bg-white px-3.5 py-2 text-xs font-bold text-[#0F6C73] shadow-sm transition-colors hover:border-[#1FA6A8] hover:text-[#1FA6A8]"
          aria-label={t("تبديل اللغة", "Switch language")}
        >
          {en ? "العربية" : "EN"}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
        </button>

        <div className="w-full max-w-md">
          {/* شعار للموبايل (تُخفى اللوحة الجانبية على الشاشات الصغيرة) */}
          <div className="mb-7 flex flex-col items-center text-center lg:hidden">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1FA6A8]/10 p-2.5">
              <Image src="/logo.png" alt={t("عبور", "Oboor")} width={56} height={56} className="h-full w-auto object-contain" />
            </span>
          </div>

          {/* الكارت */}
          <div className="rounded-[28px] bg-white p-8 shadow-[0_20px_60px_-24px_rgba(15,108,115,0.35)] ring-1 ring-[#e8f1f1] sm:p-10">
            {/* أيقونة الأمان + العنوان */}
            <div className="flex flex-col items-center text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1FA6A8]/15 to-[#5FD3D0]/20 text-[#0F6C73] ring-1 ring-[#1FA6A8]/15">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><circle cx="12" cy="10" r="2.2" /><path d="M8.5 15.6a3.6 3.6 0 0 1 7 0" /></svg>
              </span>
              <h1 className="mt-5 text-2xl font-extrabold text-[#123C40]">{t("تسجيل الدخول", "Sign in")}</h1>
              <p className="mt-1.5 text-sm text-[#5a6a73]">{t("أدخل بياناتك للوصول إلى لوحة التحكّم", "Enter your credentials to access the dashboard")}</p>
            </div>

            <form onSubmit={submit} className="mt-8 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-bold text-[#123C40]">{t("اسم المستخدم", "Username")}</label>
                <div className="relative">
                  <span className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 text-[#9fb1b2]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                  </span>
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    autoFocus
                    className="w-full rounded-2xl border border-[#e2ecec] bg-[#F7FAFA] px-4 py-3.5 ps-11 text-sm text-[#123C40] outline-none transition-colors placeholder:text-[#a9b8b9] focus:border-[#1FA6A8] focus:bg-white focus:ring-4 focus:ring-[#1FA6A8]/15"
                    placeholder="admin"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-[#123C40]">{t("كلمة المرور", "Password")}</label>
                <div className="relative">
                  <span className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 text-[#9fb1b2]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                  </span>
                  <input
                    type={show ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-2xl border border-[#e2ecec] bg-[#F7FAFA] px-4 py-3.5 pe-11 ps-11 text-sm text-[#123C40] outline-none transition-colors placeholder:text-[#a9b8b9] focus:border-[#1FA6A8] focus:bg-white focus:ring-4 focus:ring-[#1FA6A8]/15"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? t("إخفاء", "Hide") : t("إظهار", "Show")} className="absolute end-3.5 top-1/2 -translate-y-1/2 text-[#9fb1b2] transition-colors hover:text-[#1FA6A8]">
                    {show
                      ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20C5 20 1 12 1 12a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M1 1l22 22" /><path d="M9.5 9.5a3 3 0 0 0 4.2 4.2" /></svg>
                      : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8z" /><circle cx="12" cy="12" r="3" /></svg>}
                  </button>
                </div>
              </div>

              {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="mt-1 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-[#1FA6A8] to-[#0F6C73] py-4 text-base font-extrabold text-white shadow-lg shadow-[#1FA6A8]/25 transition-all hover:shadow-xl hover:shadow-[#1FA6A8]/30 hover:brightness-[1.03] disabled:opacity-60"
              >
                {loading ? t("جارٍ الدخول…", "Signing in…") : t("تسجيل الدخول", "Sign in")}
                {!loading && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="dir-flip"><path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" /></svg>}
              </button>
            </form>
          </div>

          {/* رابط العودة للموقع (أسفل الكارت) */}
          <Link href="/" className="mt-6 flex items-center justify-center gap-1.5 text-sm font-semibold text-[#5a6a73] transition-colors hover:text-[#1FA6A8]">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>
            {t("العودة إلى الموقع", "Back to site")}
          </Link>
        </div>
      </main>
    </div>
  );
}
