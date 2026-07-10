"use client";

import { useState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/lib/cms/api";
import { useCmsLang } from "@/lib/cms/i18n";
import CmsAuthLayout from "@/components/cms/CmsAuthLayout";

function I({ children, size = 18 }: { children: React.ReactNode; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">{children}</svg>;
}

export default function ForgotPasswordPage() {
  const { lang } = useCmsLang();
  const en = lang === "en";
  const t = (ar: string, e: string) => (en ? e : ar);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      await requestPasswordReset(email.trim());
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("تعذّر الإرسال.", "Could not send."));
    } finally { setLoading(false); }
  }

  const features = [
    { title: t("استعادة آمنة", "Secure recovery"), desc: t("رابط إعادة التعيين يصل إلى بريدك المسجّل فقط", "The reset link is sent to your registered email only"), icon: <I><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /><path d="m16 12 2 2 3-3" /></I> },
    { title: t("حماية الحساب", "Account protection"), desc: t("تحديث كلمة المرور يتم بخطوات واضحة وآمنة", "Password updates happen through clear, secure steps"), icon: <I><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></I> },
    { title: t("عودة سريعة", "Quick return"), desc: t("بعد التحديث يمكنك الرجوع مباشرة إلى لوحة التحكم", "After updating you can return straight to the dashboard"), icon: <I><path d="M13 2 3 14h9l-1 8 10-12h-9z" /></I> },
  ];

  return (
    <CmsAuthLayout
      brandTitlePre={t("استعد الوصول إلى لوحة تحكّم ", "Regain access to the ")}
      brandTitleAccent={t("عبور", "Oboor")}
      brandTitlePost={t("", " dashboard")}
      brandSubtitle={t("أعد تعيين كلمة المرور بأمان واستمر في إدارة محتوى الموقع والطلبات بسهولة.", "Reset your password securely and keep managing the site content and requests with ease.")}
      features={features}
    >
      <div className="rounded-[28px] bg-white p-8 shadow-[0_20px_60px_-24px_rgba(15,108,115,0.35)] ring-1 ring-[#e8f1f1] sm:p-10">
        {!sent ? (
          <>
            <div className="flex flex-col items-center text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1FA6A8]/15 to-[#5FD3D0]/20 text-[#0F6C73] ring-1 ring-[#1FA6A8]/15">
                <I size={26}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 9.9-1" /><path d="M12 16v2" /></I>
              </span>
              <h1 className="mt-5 text-2xl font-extrabold text-[#123C40]">{t("إعادة تعيين كلمة المرور", "Reset password")}</h1>
              <p className="mt-1.5 text-sm leading-7 text-[#5a6a73]">{t("أدخل بريدك الإلكتروني المرتبط بحسابك، وسنرسل لك رابطًا لإعادة تعيين كلمة المرور.", "Enter the email linked to your account and we'll send you a reset link.")}</p>
            </div>

            <form onSubmit={submit} className="mt-8 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-bold text-[#123C40]">{t("البريد الإلكتروني", "Email address")}</label>
                <div className="relative">
                  <span className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 text-[#9fb1b2]"><I><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></I></span>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus placeholder="name@oboor.sa" className="w-full rounded-2xl border border-[#e2ecec] bg-[#F7FAFA] px-4 py-3.5 ps-11 text-sm text-[#123C40] outline-none transition-colors placeholder:text-[#a9b8b9] focus:border-[#1FA6A8] focus:bg-white focus:ring-4 focus:ring-[#1FA6A8]/15" />
                </div>
              </div>

              {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-600">{error}</p>}

              <button type="submit" disabled={loading} className="mt-1 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-[#1FA6A8] to-[#0F6C73] py-4 text-base font-extrabold text-white shadow-lg shadow-[#1FA6A8]/25 transition-all hover:shadow-xl hover:brightness-[1.03] disabled:opacity-60">
                {loading ? t("جارٍ الإرسال…", "Sending…") : t("إرسال رابط إعادة التعيين", "Send reset link")}
                {!loading && <I size={16}><path d="m22 2-7 20-4-9-9-4z" /><path d="M22 2 11 13" /></I>}
              </button>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1FA6A8]/15 to-[#5FD3D0]/25 text-[#0F6C73] ring-1 ring-[#1FA6A8]/15">
              <I size={30}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /><path d="m15 13 2 2 4-4" /></I>
            </span>
            <h1 className="mt-5 text-2xl font-extrabold text-[#123C40]">{t("تم إرسال رابط إعادة التعيين", "Reset link sent")}</h1>
            <p className="mt-2 text-sm leading-7 text-[#5a6a73]">{t("إذا كان البريد الإلكتروني مسجّلًا لدينا، ستصلك رسالة تحتوي على رابط إعادة تعيين كلمة المرور خلال دقائق.", "If the email is registered with us, you'll receive a message with a reset link within a few minutes.")}</p>
            <Link href="/cms/login" className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-[#1FA6A8] to-[#0F6C73] py-3.5 text-sm font-extrabold text-white shadow-md transition-all hover:shadow-lg">
              {t("العودة إلى تسجيل الدخول", "Back to sign in")}
            </Link>
          </div>
        )}
      </div>

      {!sent && (
        <Link href="/cms/login" className="mt-6 flex items-center justify-center gap-1.5 text-sm font-semibold text-[#5a6a73] transition-colors hover:text-[#1FA6A8]">
          <I size={15}><path d="M19 12H5M12 19l-7-7 7-7" /></I>
          {t("العودة إلى تسجيل الدخول", "Back to sign in")}
        </Link>
      )}
    </CmsAuthLayout>
  );
}
