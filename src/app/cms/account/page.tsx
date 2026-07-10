"use client";

import { useEffect, useState } from "react";
import { getMe, updateAccountEmail, changeAccountPassword } from "@/lib/cms/api";
import { useCmsLang } from "@/lib/cms/i18n";

// أيقونة عامة
function I({ children, size = 18 }: { children: React.ReactNode; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">{children}</svg>;
}

// حقل كلمة مرور مع زر إظهار/إخفاء (العين شمال، القفل/المفتاح يمين)
function PasswordField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [show, setShow] = useState(false);
  const { lang } = useCmsLang();
  const en = lang === "en";
  return (
    <div>
      <label className="mb-1.5 block text-sm font-bold text-ink">{label}</label>
      <div className="relative">
        <span className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 text-[#9fb1b2]">
          <I><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></I>
        </span>
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-[#e2ecec] bg-[#F7FAFA] px-4 py-3 pe-11 ps-11 text-sm text-ink outline-none transition-colors focus:border-[#1FA6A8] focus:bg-white focus:ring-4 focus:ring-[#1FA6A8]/15"
          placeholder="••••••••"
        />
        <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? (en ? "Hide" : "إخفاء") : (en ? "Show" : "إظهار")} className="absolute end-3.5 top-1/2 -translate-y-1/2 text-[#9fb1b2] transition-colors hover:text-[#1FA6A8]">
          {show
            ? <I><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20C5 20 1 12 1 12a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M1 1l22 22" /><path d="M9.5 9.5a3 3 0 0 0 4.2 4.2" /></I>
            : <I><path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8z" /><circle cx="12" cy="12" r="3" /></I>}
        </button>
      </div>
    </div>
  );
}

// شريط تنبيه (نجاح/خطأ)
function Note({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <div className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium ${ok ? "bg-[#e9f6f0] text-[#1c7a54]" : "bg-red-50 text-red-600"}`}>
      <span className="shrink-0">{ok ? <I size={16}><path d="M20 6 9 17l-5-5" /></I> : <I size={16}><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></I>}</span>
      {children}
    </div>
  );
}

export default function AccountPage() {
  const { lang } = useCmsLang();
  const en = lang === "en";
  const t = (ar: string, e: string) => (en ? e : ar);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [loaded, setLoaded] = useState(false);

  const [emailSaving, setEmailSaving] = useState(false);
  const [emailNote, setEmailNote] = useState<{ ok: boolean; msg: string } | null>(null);

  const [cur, setCur] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const [pwNote, setPwNote] = useState<{ ok: boolean; msg: string } | null>(null);

  useEffect(() => {
    getMe().then(({ user }) => { setUsername(user.username); setEmail(user.email || ""); setLoaded(true); }).catch(() => setLoaded(true));
  }, []);

  async function saveEmail(e: React.FormEvent) {
    e.preventDefault();
    setEmailSaving(true); setEmailNote(null);
    try {
      await updateAccountEmail(email.trim());
      setEmailNote({ ok: true, msg: t("تم حفظ البريد الإلكتروني.", "Email saved.") });
    } catch (err) {
      setEmailNote({ ok: false, msg: err instanceof Error ? err.message : t("تعذّر الحفظ.", "Could not save.") });
    } finally { setEmailSaving(false); }
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwNote(null);
    if (next.length < 8) { setPwNote({ ok: false, msg: t("كلمة المرور الجديدة يجب ألا تقل عن ٨ أحرف.", "New password must be at least 8 characters.") }); return; }
    if (next !== confirm) { setPwNote({ ok: false, msg: t("كلمتا المرور غير متطابقتين.", "Passwords do not match.") }); return; }
    setPwSaving(true);
    try {
      await changeAccountPassword(cur, next);
      setPwNote({ ok: true, msg: t("تم تحديث كلمة المرور بنجاح.", "Password updated successfully.") });
      setCur(""); setNext(""); setConfirm("");
    } catch (err) {
      setPwNote({ ok: false, msg: err instanceof Error ? err.message : t("تعذّر التحديث.", "Could not update.") });
    } finally { setPwSaving(false); }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* ===== ترويسة الصفحة (الأيقونة يمينًا على مستوى العنوان) ===== */}
      <div className="flex items-center gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0F6C73] to-[#1FA6A8] text-white shadow-sm">
          <I size={22}><circle cx="18" cy="15" r="3" /><circle cx="9" cy="7" r="4" /><path d="M10 15H6a4 4 0 0 0-4 4v2" /><path d="m21.7 16.4-.9-.3M15.2 13.9l-.9-.3M16.6 18.7l.3-.9M19.1 12.2l.3-.9M19.6 18.7l-.4-1M16.8 12.3l-.4-1M14.3 16.6l1-.4M20.7 13.8l1-.4" /></I>
        </span>
        <div>
          <h1 className="text-2xl font-extrabold text-ink">{t("حسابي", "My Account")}</h1>
          <p className="mt-1 text-sm text-ink-soft">{t("إدارة بيانات تسجيل الدخول الخاصة بحسابك في لوحة التحكم.", "Manage your sign-in details for the control panel.")}</p>
        </div>
      </div>

      {/* ===== كرت: معلومات الحساب ===== */}
      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#e6eff0] sm:p-7">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1FA6A8]/12 text-[#0F6C73]"><I><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M9 3v1M15 3v1" /><circle cx="12" cy="10" r="2.5" /><path d="M8 16.5a4 4 0 0 1 8 0" /></I></span>
          <div>
            <h2 className="text-lg font-bold text-ink">{t("معلومات الحساب", "Account Information")}</h2>
            <p className="text-sm text-ink-soft">{t("بيانات الدخول الأساسية الخاصة بحسابك.", "Your account's core sign-in details.")}</p>
          </div>
        </div>
        <div className="my-5 h-px w-full bg-[#eef4f5]" />

        <form onSubmit={saveEmail}>
          <div className="grid gap-5 sm:grid-cols-2">
            {/* اسم المستخدم (غير قابل للتعديل) */}
            <div>
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <label className="text-sm font-bold text-ink">{t("اسم المستخدم", "Username")}</label>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#eef4f5] px-2.5 py-1 text-[11px] font-bold text-[#0F6C73]"><I size={12}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></I>{t("غير قابل للتعديل", "Read-only")}</span>
              </div>
              <div className="relative">
                <span className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 text-[#9fb1b2]"><I><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></I></span>
                <input value={loaded ? username : "…"} readOnly disabled className="w-full cursor-not-allowed rounded-xl border border-[#e2ecec] bg-[#eef4f5] px-4 py-3 ps-11 text-sm font-semibold text-ink-soft outline-none" />
              </div>
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-ink-soft"><I size={13}><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></I>{t("لا يمكن تعديل اسم المستخدم.", "The username cannot be changed.")}</p>
            </div>

            {/* البريد الإلكتروني (قابل للتعديل) */}
            <div>
              <label className="mb-1.5 block text-sm font-bold text-ink">{t("البريد الإلكتروني", "Email address")}</label>
              <div className="relative">
                <span className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 text-[#9fb1b2]"><I><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></I></span>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@oboor.sa" className="w-full rounded-xl border border-[#e2ecec] bg-[#F7FAFA] px-4 py-3 ps-11 text-sm text-ink outline-none transition-colors focus:border-[#1FA6A8] focus:bg-white focus:ring-4 focus:ring-[#1FA6A8]/15" />
              </div>
            </div>
          </div>

          {emailNote && <div className="mt-4"><Note ok={emailNote.ok}>{emailNote.msg}</Note></div>}

          <div className="mt-5">
            <button type="submit" disabled={emailSaving} className="inline-flex items-center gap-2 rounded-xl border border-[#1FA6A8] bg-white px-5 py-2.5 text-sm font-bold text-[#0F6C73] transition-colors hover:bg-[#1FA6A8]/8 disabled:opacity-60">
              <I size={16}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><path d="M17 21v-8H7v8M7 3v5h8" /></I>
              {emailSaving ? t("جارٍ الحفظ…", "Saving…") : t("حفظ البريد الإلكتروني", "Save email")}
            </button>
          </div>
        </form>
      </section>

      {/* ===== كرت: تغيير كلمة المرور ===== */}
      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#e6eff0] sm:p-7">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1FA6A8]/12 text-[#0F6C73]"><I><rect x="5" y="12" width="14" height="9" rx="2" /><circle cx="12" cy="16.5" r="1.2" /><path d="M8.5 12V9a3.5 3.5 0 0 1 6.4-1.9" /><path d="M15.4 4.2 15 7l-2.7-.5" /></I></span>
          <div>
            <h2 className="text-lg font-bold text-ink">{t("تغيير كلمة المرور", "Change Password")}</h2>
            <p className="text-sm text-ink-soft">{t("استخدم كلمة مرور قوية لحماية حسابك.", "Use a strong password to protect your account.")}</p>
          </div>
        </div>
        <div className="my-5 h-px w-full bg-[#eef4f5]" />

        <form onSubmit={savePassword}>
          <div className="grid gap-5 sm:grid-cols-2">
            <PasswordField label={t("كلمة المرور الحالية", "Current password")} value={cur} onChange={setCur} />
            <PasswordField label={t("كلمة المرور الجديدة", "New password")} value={next} onChange={setNext} />
            <PasswordField label={t("تأكيد كلمة المرور الجديدة", "Confirm new password")} value={confirm} onChange={setConfirm} />
          </div>

          {pwNote && <div className="mt-4"><Note ok={pwNote.ok}>{pwNote.msg}</Note></div>}

          <div className="mt-5">
            <button type="submit" disabled={pwSaving} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-[#1FA6A8] to-[#0F6C73] px-6 py-3 text-sm font-extrabold text-white shadow-md shadow-[#1FA6A8]/20 transition-all hover:shadow-lg disabled:opacity-60">
              <I size={16}><path d="M20 6 9 17l-5-5" /></I>
              {pwSaving ? t("جارٍ التحديث…", "Updating…") : t("تحديث كلمة المرور", "Update password")}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
