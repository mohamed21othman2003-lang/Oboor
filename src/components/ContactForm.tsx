"use client";

import { useState } from "react";
import { pick, type Locale } from "@/i18n/config";

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

export default function ContactForm({ locale }: { locale: Locale }) {
  const [type, setType] = useState("خدمة");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: wire to backend / API route
    setSent(true);
  }

  const field =
    "w-full rounded-lg border border-line bg-surface px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft focus:border-brand focus:bg-white";
  const labelCls = "mb-2 block text-sm font-semibold text-ink";

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-line sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelCls}>{pick(locale, "الاسم الكامل", "Full Name")}</label>
          <input id="name" name="name" required placeholder={pick(locale, "أدخل اسمك الكامل", "Enter your full name")} className={field} />
        </div>
        <div>
          <label htmlFor="phone" className={labelCls}>{pick(locale, "رقم الجوال", "Mobile Number")}</label>
          <input id="phone" name="phone" required dir="ltr" placeholder="05XXXXXXXX" className={`${field} text-start`} />
        </div>
        <div>
          <label htmlFor="branch" className={labelCls}>{pick(locale, "اختر الفرع", "Choose Branch")}</label>
          <select id="branch" name="branch" className={field} defaultValue="">
            <option value="" disabled>{pick(locale, "اختر الفرع", "Choose Branch")}</option>
            {BRANCHES.map((b) => (
              <option key={b.ar} value={b.ar}>{pick(locale, b.ar, b.en)}</option>
            ))}
          </select>
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
        <label htmlFor="message" className={labelCls}>{pick(locale, "الرسالة", "Message")}</label>
        <textarea id="message" name="message" rows={5} placeholder={pick(locale, "اكتب رسالتك هنا...", "Write your message here...")} className={`${field} resize-none`} />
      </div>

      <button
        type="submit"
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-brand py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
        </svg>
        {pick(locale, "إرسال الطلب", "Submit Request")}
      </button>

      {sent && (
        <p className="mt-4 rounded-lg bg-brand/10 px-4 py-3 text-center text-sm font-medium text-brand-deep">
          {pick(locale, "تم إرسال طلبك بنجاح، سنتواصل معك قريباً.", "Your request has been sent successfully. We'll be in touch soon.")}
        </p>
      )}
    </form>
  );
}
