"use client";

import Image from "next/image";
import { useCmsLang } from "@/lib/cms/i18n";

// تخطيط مشترك لصفحات مصادقة الـCMS (نسيت/تعيين كلمة المرور) — بنفس هوية صفحة الدخول.
// لوحة الهوية يمين (أول عنصر في RTL)، وبطاقة النموذج يسار.

export type AuthFeature = { title: string; desc: string; icon: React.ReactNode };

export default function CmsAuthLayout({
  brandTitlePre, brandTitleAccent, brandTitlePost, brandSubtitle, features, children,
}: {
  brandTitlePre: string; brandTitleAccent: string; brandTitlePost?: string;
  brandSubtitle: string; features: AuthFeature[]; children: React.ReactNode;
}) {
  const { lang, dir, setLang } = useCmsLang();
  const en = lang === "en";
  const t = (ar: string, e: string) => (en ? e : ar);

  return (
    <div dir={dir} className="grid min-h-screen bg-[#F7FAFA] lg:grid-cols-[1.05fr_1fr]">
      {/* ===== لوحة الهوية (يمين) ===== */}
      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-[#137e86] via-[#0F6C73] to-[#064E52] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <svg aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-40 w-full text-white/10" viewBox="0 0 1440 200" fill="currentColor" preserveAspectRatio="none"><path d="M0 0h1440v96c-240 64-480 64-720 24C480 84 240 84 0 128z" /></svg>
        <svg aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-44 w-full text-black/10" viewBox="0 0 1440 200" fill="currentColor" preserveAspectRatio="none"><path d="M0 200h1440v-96c-240-64-480-64-720-24C480 116 240 116 0 72z" /></svg>
        <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#5FD3D0]/20 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-16 h-80 w-80 rounded-full bg-[#5FD3D0]/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1.4px)", backgroundSize: "22px 22px" }} />

        <div className="relative flex items-center gap-3">
          <Image src="/logo.png" alt={t("عبور", "Oboor")} width={128} height={84} className="h-14 w-auto object-contain brightness-0 invert" priority />
          <span className="h-9 w-px bg-white/20" />
          <div>
            <p className="text-base font-extrabold leading-tight">{t("مركز عبور", "Oboor Center")}</p>
            <p className="text-xs text-white/70">{t("للرعاية والتأهيل", "for Care & Rehabilitation")}</p>
          </div>
        </div>

        <div className="relative">
          <h2 className="text-3xl font-extrabold leading-snug sm:text-[2.1rem]">
            {brandTitlePre}<span className="text-[#8EE7E8]">{brandTitleAccent}</span>{brandTitlePost || ""}
          </h2>
          <p className="mt-4 max-w-md text-sm leading-8 text-white/80">{brandSubtitle}</p>
          <ul className="mt-9 space-y-1.5">
            {features.map((f, i) => (
              <li key={f.title}>
                <div className="flex items-center gap-4 py-3.5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#8EE7E8] ring-1 ring-white/15">{f.icon}</span>
                  <div className="min-w-0">
                    <p className="text-[15px] font-bold leading-tight">{f.title}</p>
                    <p className="mt-1 text-[13px] leading-relaxed text-white/65">{f.desc}</p>
                  </div>
                </div>
                {i < features.length - 1 && <span className="block h-px w-full bg-white/10" />}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-white/45">{t("© مركز عبور للرعاية والتأهيل", "© Oboor Center for Care & Rehabilitation")}</p>
      </aside>

      {/* ===== منطقة النموذج (يسار) ===== */}
      <main className="relative flex items-center justify-center p-6 sm:p-10">
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
          <div className="mb-7 flex flex-col items-center text-center lg:hidden">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1FA6A8]/10 p-2.5">
              <Image src="/logo.png" alt={t("عبور", "Oboor")} width={56} height={56} className="h-full w-auto object-contain" />
            </span>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
