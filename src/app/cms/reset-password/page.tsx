"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { confirmPasswordReset } from "@/lib/cms/api";
import { useCmsLang } from "@/lib/cms/i18n";
import CmsAuthLayout from "@/components/cms/CmsAuthLayout";

function I({ children, size = 18 }: { children: React.ReactNode; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">{children}</svg>;
}

function PwInput({ value, onChange, placeholder, autoFocus }: { value: string; onChange: (v: string) => void; placeholder: string; autoFocus?: boolean }) {
  const [show, setShow] = useState(false);
  const { lang } = useCmsLang();
  const en = lang === "en";
  return (
    <div className="relative">
      <span className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 text-[#9fb1b2]"><I><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></I></span>
      <input type={show ? "text" : "password"} value={value} onChange={(e) => onChange(e.target.value)} required autoFocus={autoFocus} placeholder={placeholder} className="w-full rounded-2xl border border-[#e2ecec] bg-[#F7FAFA] px-4 py-3.5 pe-11 ps-11 text-sm text-[#123C40] outline-none transition-colors placeholder:text-[#a9b8b9] focus:border-[#1FA6A8] focus:bg-white focus:ring-4 focus:ring-[#1FA6A8]/15" />
      <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? (en ? "Hide" : "إخفاء") : (en ? "Show" : "إظهار")} className="absolute end-3.5 top-1/2 -translate-y-1/2 text-[#9fb1b2] transition-colors hover:text-[#1FA6A8]">
        {show
          ? <I><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20C5 20 1 12 1 12a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M1 1l22 22" /><path d="M9.5 9.5a3 3 0 0 0 4.2 4.2" /></I>
          : <I><path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8z" /><circle cx="12" cy="12" r="3" /></I>}
      </button>
    </div>
  );
}

export default function ResetPasswordPage() {
  const { lang } = useCmsLang();
  const en = lang === "en";
  const t = (ar: string, e: string) => (en ? e : ar);

  const [uid, setUid] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    setUid(q.get("uid"));
    setToken(q.get("token"));
    setReady(true);
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (pw.length < 8) { setError(t("كلمة المرور يجب ألا تقل عن ٨ أحرف.", "Password must be at least 8 characters.")); return; }
    if (pw !== confirm) { setError(t("كلمتا المرور غير متطابقتين.", "Passwords do not match.")); return; }
    setLoading(true);
    try {
      await confirmPasswordReset(uid || "", token || "", pw);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("تعذّر التحديث.", "Could not update."));
    } finally { setLoading(false); }
  }

  const features = [
    { title: t("استعادة آمنة", "Secure recovery"), desc: t("رابط إعادة التعيين يصل إلى بريدك المسجّل فقط", "The reset link is sent to your registered email only"), icon: <I><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /><path d="m16 12 2 2 3-3" /></I> },
    { title: t("حماية الحساب", "Account protection"), desc: t("تحديث كلمة المرور يتم بخطوات واضحة وآمنة", "Password updates happen through clear, secure steps"), icon: <I><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></I> },
    { title: t("عودة سريعة", "Quick return"), desc: t("بعد التحديث يمكنك الرجوع مباشرة إلى لوحة التحكم", "After updating you can return straight to the dashboard"), icon: <I><path d="M13 2 3 14h9l-1 8 10-12h-9z" /></I> },
  ];

  const invalidLink = ready && (!uid || !token);

  return (
    <CmsAuthLayout
      brandTitlePre={t("استعد الوصول إلى لوحة تحكّم ", "Regain access to the ")}
      brandTitleAccent={t("عبور", "Oboor")}
      brandTitlePost={t("", " dashboard")}
      brandSubtitle={t("أعد تعيين كلمة المرور بأمان واستمر في إدارة محتوى الموقع والطلبات بسهولة.", "Reset your password securely and keep managing the site content and requests with ease.")}
      features={features}
    >
      <div className="rounded-[28px] bg-white p-8 shadow-[0_20px_60px_-24px_rgba(15,108,115,0.35)] ring-1 ring-[#e8f1f1] sm:p-10">
        {done ? (
          <div className="flex flex-col items-center text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1FA6A8]/15 to-[#5FD3D0]/25 text-[#0F6C73] ring-1 ring-[#1FA6A8]/15"><I size={30}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></I></span>
            <h1 className="mt-5 text-2xl font-extrabold text-[#123C40]">{t("تم تحديث كلمة المرور بنجاح", "Password updated successfully")}</h1>
            <p className="mt-2 text-sm leading-7 text-[#5a6a73]">{t("يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة.", "You can now sign in with your new password.")}</p>
            <Link href="/cms/login" className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-[#1FA6A8] to-[#0F6C73] py-3.5 text-sm font-extrabold text-white shadow-md transition-all hover:shadow-lg">{t("تسجيل الدخول", "Sign in")}</Link>
          </div>
        ) : invalidLink ? (
          <div className="flex flex-col items-center text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500 ring-1 ring-red-100"><I size={30}><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></I></span>
            <h1 className="mt-5 text-2xl font-extrabold text-[#123C40]">{t("رابط غير صالح", "Invalid link")}</h1>
            <p className="mt-2 text-sm leading-7 text-[#5a6a73]">{t("رابط إعادة التعيين غير صالح أو منتهي الصلاحية. اطلب رابطًا جديدًا.", "This reset link is invalid or has expired. Request a new one.")}</p>
            <Link href="/cms/forgot-password" className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-[#1FA6A8] to-[#0F6C73] py-3.5 text-sm font-extrabold text-white shadow-md transition-all hover:shadow-lg">{t("طلب رابط جديد", "Request a new link")}</Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1FA6A8]/15 to-[#5FD3D0]/20 text-[#0F6C73] ring-1 ring-[#1FA6A8]/15"><I size={26}><circle cx="7.5" cy="15.5" r="4.5" /><path d="m10.5 12.5 8-8M17 7l2-2M14 7l2 2" /></I></span>
              <h1 className="mt-5 text-2xl font-extrabold text-[#123C40]">{t("إنشاء كلمة مرور جديدة", "Create a new password")}</h1>
              <p className="mt-1.5 text-sm text-[#5a6a73]">{t("اختر كلمة مرور قوية لحسابك.", "Choose a strong password for your account.")}</p>
            </div>

            <form onSubmit={submit} className="mt-8 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-bold text-[#123C40]">{t("كلمة المرور الجديدة", "New password")}</label>
                <PwInput value={pw} onChange={setPw} placeholder="••••••••" autoFocus />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-bold text-[#123C40]">{t("تأكيد كلمة المرور", "Confirm password")}</label>
                <PwInput value={confirm} onChange={setConfirm} placeholder="••••••••" />
              </div>

              {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-600">{error}</p>}

              <button type="submit" disabled={loading} className="mt-1 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-[#1FA6A8] to-[#0F6C73] py-4 text-base font-extrabold text-white shadow-lg shadow-[#1FA6A8]/25 transition-all hover:shadow-xl hover:brightness-[1.03] disabled:opacity-60">
                {loading ? t("جارٍ التحديث…", "Updating…") : t("تحديث كلمة المرور", "Update password")}
                {!loading && <I size={16}><path d="M20 6 9 17l-5-5" /></I>}
              </button>
            </form>
          </>
        )}
      </div>

      {!done && (
        <Link href="/cms/login" className="mt-6 flex items-center justify-center gap-1.5 text-sm font-semibold text-[#5a6a73] transition-colors hover:text-[#1FA6A8]">
          <I size={15}><path d="M19 12H5M12 19l-7-7 7-7" /></I>
          {t("العودة إلى تسجيل الدخول", "Back to sign in")}
        </Link>
      )}
    </CmsAuthLayout>
  );
}
