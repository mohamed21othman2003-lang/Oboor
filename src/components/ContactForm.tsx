"use client";

import { useState, useEffect, useRef } from "react";
import { pick, type Locale } from "@/i18n/config";
import { validateName, validatePhone, stripDigits, digitsOnly } from "@/lib/validate";
import CustomSelect, { type SelectOption } from "@/components/ui/Select";
import LimitedTextarea from "@/components/ui/LimitedTextarea";
import { sendGAEvent } from "@next/third-parties/google";

const BRANCHES: { ar: string; en: string }[] = [
  { ar: "الرياض — الفرع الرئيسي", en: "Riyadh — Main Branch" },
  { ar: "فرع النرجس", en: "Al-Narjis Branch" },
  { ar: "جدة", en: "Jeddah" },
  { ar: "المدينة المنورة", en: "Madinah" },
];
const MESSAGE_TYPES: { value: string; ar: string; en: string }[] = [
  { value: "خدمة", ar: "خدمة", en: "Service" },
  { value: "مقترح", ar: "مقترح", en: "Suggestion" },
  { value: "شكوى", ar: "شكوى", en: "Complaint" },
];

export default function ContactForm({ locale, branches }: { locale: Locale; branches?: (string | SelectOption)[] }) {
  // قائمة الفروع من الـCMS (تمرَّر من الصفحة) مع fallback للقائمة الثابتة
  const branchOptions = branches?.length ? branches : BRANCHES.map((b) => pick(locale, b.ar, b.en));
  const [type, setType] = useState("خدمة");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const successRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (sent) successRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); }, [sent]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const nameErr = validateName(String(fd.get("name") || ""), locale);
    if (nameErr) { setError(nameErr); return; }
    const phoneErr = validatePhone(String(fd.get("phone") || ""), locale);
    if (phoneErr) { setError(phoneErr); return; }
    if (!String(fd.get("branch") || "").trim()) { setError(pick(locale, "يرجى اختيار الفرع.", "Please choose a branch.")); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/contact", { method: "POST", body: fd });
      const data = await res.json();
      if (data?.duplicate) { setError(pick(locale, "تم إرسال هذا الطلب مسبقاً بالفعل.", "This request has already been submitted.")); return; }
      if (!res.ok || !data.ok) throw new Error(data.error || "");
      sendGAEvent("event", "generate_lead", { form_type: "contact" });
      setSent(true);
    } catch (err) {
      setError(pick(locale, "حدث خطأ، حاول مرة أخرى.", "Something went wrong, please try again."));
    } finally {
      setLoading(false);
    }
  }

  const field =
    "w-full rounded-lg border border-line bg-surface px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft focus:border-brand focus:bg-white";
  const labelCls = "mb-2 block text-sm font-semibold text-ink";

  if (sent) {
    return (
      <div ref={successRef} className="flex scroll-mt-28 flex-col items-center rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-line sm:p-12">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-brand/10 text-brand">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M20 6 9 17l-5-5" /></svg>
        </span>
        <h3 className="mt-6 text-2xl font-extrabold text-ink">{pick(locale, "تم إرسال رسالتك بنجاح", "Your message has been sent")}</h3>
        <p className="mt-3 max-w-md text-sm leading-7 text-ink-muted">
          {pick(locale, "شكراً لتواصلك مع مركز عبور. استلمنا رسالتك وسيتواصل معك فريقنا في أقرب وقت.", "Thank you for reaching out to Oboor Center. We've received your message and our team will contact you shortly.")}
        </p>
        <button
          onClick={() => setSent(false)}
          className="mt-8 rounded-lg border border-brand px-6 py-3 text-sm font-semibold text-brand transition-colors hover:bg-brand hover:text-white"
        >
          {pick(locale, "إرسال رسالة أخرى", "Send another message")}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-line sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelCls}>{pick(locale, "الاسم الكامل", "Full Name")} <span className="text-red-500">*</span></label>
          <input id="name" name="name" required placeholder={pick(locale, "أدخل اسمك الكامل", "Enter your full name")} onInput={(e) => { e.currentTarget.value = stripDigits(e.currentTarget.value); }} className={field} />
        </div>
        <div>
          <label htmlFor="phone" className={labelCls}>{pick(locale, "رقم الجوال", "Mobile Number")} <span className="text-red-500">*</span></label>
          <input id="phone" name="phone" required dir="ltr" inputMode="numeric" placeholder="05XXXXXXXX" onInput={(e) => { e.currentTarget.value = digitsOnly(e.currentTarget.value); }} className={`${field} text-start`} />
        </div>
        <div>
          <label htmlFor="branch" className={labelCls}>{pick(locale, "اختر الفرع", "Choose Branch")} <span className="text-red-500">*</span></label>
          <CustomSelect
            id="branch"
            name="branch"
            required
            placeholder={pick(locale, "اختر الفرع", "Choose Branch")}
            options={branchOptions}
          />
        </div>
        <div>
          <span className={labelCls}>{pick(locale, "نوع الرسالة", "Message Type")}</span>
          <div className="flex items-center gap-4 pt-1">
            {MESSAGE_TYPES.map((t) => (
              <label key={t.value} className="flex cursor-pointer items-center gap-2 text-sm text-ink-muted">
                <input
                  type="radio"
                  name="type"
                  value={t.value}
                  checked={type === t.value}
                  onChange={() => setType(t.value)}
                  className="h-4 w-4 accent-brand"
                />
                {pick(locale, t.ar, t.en)}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="message" className={labelCls}>{pick(locale, "الرسالة", "Message")} <span className="text-red-500">*</span></label>
        <LimitedTextarea id="message" name="message" required rows={5} maxLength={500} placeholder={pick(locale, "اكتب رسالتك هنا...", "Write your message here...")} className={`${field} resize-none`} />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-brand py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
        </svg>
        {loading ? pick(locale, "جارٍ الإرسال...", "Sending...") : pick(locale, "إرسال الطلب", "Submit Request")}
      </button>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-600">{error}</p>
      )}
    </form>
  );
}
