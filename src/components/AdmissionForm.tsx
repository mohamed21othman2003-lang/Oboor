"use client";

import { useState } from "react";
import { pick, type Locale } from "@/i18n/config";

const CITIES = ["الرياض", "جدة", "الدمام", "مكة المكرمة", "المدينة المنورة", "القصيم", "عسير"];
const CITIES_EN = ["Riyadh", "Jeddah", "Dammam", "Makkah", "Madinah", "Qassim", "Asir"];
const BRANCHES = ["فرع النرجس", "فرع العليا", "فرع الروضة", "فرع جدة", "فرع الشرقية", "فرع مكة"];
const BRANCHES_EN = ["Al-Narjis Branch", "Al-Olaya Branch", "Al-Rawdah Branch", "Jeddah Branch", "Eastern Branch", "Makkah Branch"];
const CASES = ["اضطراب طيف التوحد", "نقص الانتباه وفرط الحركة (ADHD)", "تأخر النطق واللغة", "صعوبات التعلم", "إعاقة حركية", "أخرى"];
const CASES_EN = ["Autism Spectrum Disorder", "ADHD", "Speech & Language Delay", "Learning Difficulties", "Physical Disability", "Other"];

export default function AdmissionForm({ locale }: { locale: Locale }) {
  const [sent, setSent] = useState(false);
  const cities = locale === "en" ? CITIES_EN : CITIES;
  const branches = locale === "en" ? BRANCHES_EN : BRANCHES;
  const cases = locale === "en" ? CASES_EN : CASES;

  if (sent) {
    return (
      <div className="mx-auto max-w-2xl rounded-3xl border border-brand/20 bg-white p-10 text-center shadow-sm">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand/10 text-brand">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
        </span>
        <h3 className="mt-4 text-xl font-extrabold text-ink">{pick(locale, "تم استلام طلب الالتحاق بنجاح", "Your application has been received successfully")}</h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-ink-muted">{pick(locale, "شكراً لك. سيتواصل معك أحد ممثلينا في أقرب وقت ممكن لاستكمال إجراءات تسجيل طفلك.", "Thank you. One of our representatives will contact you as soon as possible to complete your child's registration.")}</p>
        <button onClick={() => setSent(false)} className="mt-6 rounded-xl border border-line px-6 py-2.5 text-sm font-semibold text-ink-muted transition-colors hover:bg-surface">{pick(locale, "طلب جديد", "New Request")}</button>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="mx-auto max-w-4xl rounded-3xl border border-line bg-white p-6 shadow-lg sm:p-8">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-extrabold text-ink">{pick(locale, "ابدأ التسجيل", "Start Registration")}</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-ink-muted">{pick(locale, "املأ النموذج أدناه لطلب التحاق طفلك بأحد فروعنا وسيتواصل معك أحد ممثلينا في أقرب وقت ممكن.", "Fill out the form below to apply for your child's enrollment at one of our branches, and one of our representatives will contact you as soon as possible.")}</p>
      </div>

      {/* بيانات الطفل */}
      <Section title={pick(locale, "بيانات الطفل", "Child's Information")}>
        <Field label={pick(locale, "اسم الطفل", "Child's Name")} required placeholder={pick(locale, "أدخل اسم طفلك", "Enter your child's name")} />
        <Field label={pick(locale, "العمر", "Age")} required placeholder={pick(locale, "مثال: 4 سنوات", "Example: 4 years")} />
        <Select label={pick(locale, "الجنس", "Gender")} required options={[pick(locale, "ذكر", "Male"), pick(locale, "أنثى", "Female")]} locale={locale} />
        <Select label={pick(locale, "المدينة", "City")} required options={cities} locale={locale} />
        <Select label={pick(locale, "الفرع المطلوب", "Preferred Branch")} required options={branches} locale={locale} />
      </Section>

      {/* بيانات ولي الأمر */}
      <Section title={pick(locale, "بيانات ولي الأمر", "Parent's Information")}>
        <Field label={pick(locale, "اسم ولي الأمر", "Parent's Name")} required placeholder={pick(locale, "الاسم الكامل", "Full name")} />
        <Field label={pick(locale, "رقم الجوال", "Mobile Number")} required type="tel" placeholder={pick(locale, "ادخل رقم جوالك", "Enter your mobile number")} />
        <Field label={pick(locale, "البريد الإلكتروني", "Email")} type="email" placeholder="example@gmail.com" />
      </Section>

      {/* معلومات إضافية */}
      <Section title={pick(locale, "معلومات إضافية", "Additional Information")}>
        <Select label={pick(locale, "نوع الحالة أو الصعوبة", "Type of Condition or Difficulty")} options={cases} locale={locale} />
        <div className="sm:col-span-2 lg:col-span-1">
          <Label>{pick(locale, "هل سبق الحصول على جلسات تأهيل؟", "Has your child received rehabilitation sessions before?")}</Label>
          <div className="mt-1.5 flex gap-3">
            {[pick(locale, "نعم", "Yes"), pick(locale, "لا", "No")].map((o) => (
              <label key={o} className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-line py-2.5 text-sm font-medium text-ink-muted transition-colors has-[:checked]:border-brand has-[:checked]:bg-brand/5 has-[:checked]:text-brand-dark">
                <input type="radio" name="prev-sessions" value={o} className="accent-brand" />
                {o}
              </label>
            ))}
          </div>
        </div>
      </Section>

      <div className="mt-5">
        <Label>{pick(locale, "ملاحظات إضافية", "Additional Notes")}</Label>
        <textarea rows={4} placeholder={pick(locale, "اكتب رسالتك هنا...", "Write your message here...")} className="mt-1.5 w-full resize-none rounded-xl border border-line bg-white px-3 py-2.5 text-start text-sm text-ink placeholder:text-ink-soft focus:outline-none focus:ring-2 focus:ring-brand/30" />
      </div>

      <button type="submit" className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3.5 text-base font-bold text-white transition-colors hover:bg-brand-dark">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4z" /></svg>
        {pick(locale, "أرسل طلب الالتحاق الآن", "Submit Enrollment Request Now")}
      </button>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="mb-4 flex items-center justify-start gap-2 text-start text-base font-bold text-ink">
        <span className="h-5 w-1 rounded-full bg-brand" />
        {title}
      </h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-start text-sm font-semibold text-ink">{children}</label>;
}

function Field({ label, required, type = "text", placeholder }: { label: string; required?: boolean; type?: string; placeholder?: string }) {
  return (
    <div>
      <Label>{label} {required && <span className="text-danger">*</span>}</Label>
      <input type={type} required={required} placeholder={placeholder} className="mt-1.5 w-full rounded-xl border border-line bg-white px-3 py-2.5 text-start text-sm text-ink placeholder:text-ink-soft focus:outline-none focus:ring-2 focus:ring-brand/30" />
    </div>
  );
}

function Select({ label, required, options, locale }: { label: string; required?: boolean; options: string[]; locale: Locale }) {
  return (
    <div>
      <Label>{label} {required && <span className="text-danger">*</span>}</Label>
      <select required={required} defaultValue="" className="mt-1.5 w-full rounded-xl border border-line bg-white px-3 py-2.5 text-start text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/30">
        <option value="" disabled>{pick(locale, "اختر", "Select")}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
