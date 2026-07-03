"use client";

import { useState } from "react";
import { pick, type Locale } from "@/i18n/config";
import { validateName, validatePhone, validateRequired, validateEmail, stripDigits, digitsOnly } from "@/lib/validate";
import CustomSelect from "@/components/ui/Select";
import LimitedTextarea from "@/components/ui/LimitedTextarea";

const CITIES = ["الرياض", "جدة", "الدمام", "مكة المكرمة", "المدينة المنورة", "القصيم", "عسير"];
const CITIES_EN = ["Riyadh", "Jeddah", "Dammam", "Makkah", "Madinah", "Qassim", "Asir"];
const BRANCHES = ["فرع النرجس", "فرع العليا", "فرع الروضة", "فرع جدة", "فرع الشرقية", "فرع مكة"];
const BRANCHES_EN = ["Al-Narjis Branch", "Al-Olaya Branch", "Al-Rawdah Branch", "Jeddah Branch", "Eastern Branch", "Makkah Branch"];
const CASES = ["اضطراب طيف التوحد", "نقص الانتباه وفرط الحركة (ADHD)", "تأخر النطق واللغة", "صعوبات التعلم", "إعاقة حركية", "أخرى"];
const CASES_EN = ["Autism Spectrum Disorder", "ADHD", "Speech & Language Delay", "Learning Difficulties", "Physical Disability", "Other"];

export default function AdmissionForm({ locale, branchOptions }: { locale: Locale; branchOptions?: string[] }) {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  // أخطاء لكل حقل (تظهر فوق الحقل نفسه) + خطأ عام للإرسال (شبكة)
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [caseType, setCaseType] = useState(""); // لإظهار حقل «حدّد» عند اختيار «أخرى»
  const cities = locale === "en" ? CITIES_EN : CITIES;
  const branches = locale === "en" ? BRANCHES_EN : BRANCHES;
  // الفروع من الـCMS (تُمرَّر من الصفحة) مع fallback للقائمة الثابتة
  const branchList = branchOptions?.length ? branchOptions : branches;
  const cases = locale === "en" ? CASES_EN : CASES;
  const otherCase = pick(locale, "أخرى", "Other");

  // مسح خطأ حقل بمجرّد أن يبدأ المستخدم تعديله
  const clearError = (name: string) =>
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const g = (k: string) => String(fd.get(k) || "");

    // التحقق بالترتيب البصري للحقول حتى يكون «أول خطأ» هو الأعلى في الصفحة
    const checks: [string, string][] = [
      ["childName", validateName(g("childName"), locale)],
      ["childAge", validateRequired(g("childAge"), locale)],
      ["gender", validateRequired(g("gender"), locale)],
      ["city", validateRequired(g("city"), locale)],
      ["branch", validateRequired(g("branch"), locale)],
      ["parentName", validateName(g("parentName"), locale)],
      ["phone", validatePhone(g("phone"), locale)],
      ["email", validateEmail(g("email"), locale)],
    ];

    const nextErrors: Record<string, string> = {};
    for (const [field, msg] of checks) if (msg) nextErrors[field] = msg;

    // عند اختيار «أخرى» يجب تحديد نوع الحالة، ونرسلها بدل كلمة «أخرى»
    if (g("caseType") === otherCase) {
      const other = g("caseTypeOther").trim();
      if (!other) nextErrors.caseTypeOther = pick(locale, "الرجاء تحديد نوع الحالة أو الصعوبة.", "Please specify the condition or difficulty.");
      else fd.set("caseType", other);
    }

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      setFormError("");
      // سكرول + تركيز على أول حقل فيه خطأ ليلاحظه المستخدم
      const order = [...checks.map(([f]) => f), "caseTypeOther"];
      const first = order.find((f) => nextErrors[f]);
      if (first) {
        const el = document.getElementById(first);
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => el?.focus({ preventScroll: true }), 350);
      }
      return;
    }

    setErrors({});
    setLoading(true);
    setFormError("");
    try {
      const res = await fetch("/api/admission", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "");
      setSent(true);
    } catch {
      setFormError(pick(locale, "حدث خطأ، حاول مرة أخرى.", "Something went wrong, please try again."));
    } finally {
      setLoading(false);
    }
  }

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
    <form onSubmit={handleSubmit} noValidate className="mx-auto max-w-4xl rounded-3xl border border-line bg-white p-6 shadow-lg sm:p-8">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-extrabold text-ink">{pick(locale, "ابدأ التسجيل", "Start Registration")}</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-ink-muted">{pick(locale, "املأ النموذج أدناه لطلب التحاق طفلك بأحد مراكزنا وسيتواصل معك أحد ممثلينا في أقرب وقت ممكن.", "Fill out the form below to apply for your child's enrollment at one of our branches, and one of our representatives will contact you as soon as possible.")}</p>
      </div>

      {/* بيانات الطفل */}
      <Section title={pick(locale, "بيانات الطفل", "Child's Information")}>
        <Field name="childName" label={pick(locale, "اسم الطفل", "Child's Name")} required placeholder={pick(locale, "أدخل اسم طفلك", "Enter your child's name")} error={errors.childName} onClear={clearError} filter="name" />
        <Field name="childAge" label={pick(locale, "العمر (بالسنوات)", "Age (years)")} required placeholder={pick(locale, "مثال: 4", "Example: 4")} error={errors.childAge} onClear={clearError} filter="digits" />
        <Select name="gender" label={pick(locale, "الجنس", "Gender")} required options={[pick(locale, "ذكر", "Male"), pick(locale, "أنثى", "Female")]} locale={locale} error={errors.gender} onClear={clearError} />
        <Select name="city" label={pick(locale, "المدينة", "City")} required options={cities} locale={locale} error={errors.city} onClear={clearError} />
        <Select name="branch" label={pick(locale, "الفرع المطلوب", "Preferred Branch")} required options={branchList} locale={locale} error={errors.branch} onClear={clearError} />
      </Section>

      {/* بيانات ولي الأمر */}
      <Section title={pick(locale, "بيانات ولي الأمر", "Parent's Information")}>
        <Field name="parentName" label={pick(locale, "اسم ولي الأمر", "Parent's Name")} required placeholder={pick(locale, "الاسم الكامل", "Full name")} error={errors.parentName} onClear={clearError} filter="name" />
        <Field name="phone" label={pick(locale, "رقم الجوال", "Mobile Number")} required type="tel" placeholder={pick(locale, "ادخل رقم جوالك", "Enter your mobile number")} error={errors.phone} onClear={clearError} filter="phone" />
        <Field name="email" label={pick(locale, "البريد الإلكتروني", "Email")} required type="email" placeholder="example@gmail.com" error={errors.email} onClear={clearError} />
      </Section>

      {/* معلومات إضافية */}
      <Section title={pick(locale, "معلومات إضافية", "Additional Information")}>
        <div>
          <Label>{pick(locale, "نوع الحالة أو الصعوبة", "Type of Condition or Difficulty")}</Label>
          <div className="mt-1.5">
            <CustomSelect
              name="caseType"
              options={cases}
              placeholder={pick(locale, "اختر", "Select")}
              onChange={(v) => { setCaseType(v); if (v !== otherCase) clearError("caseTypeOther"); }}
            />
          </div>
          {caseType === otherCase && (
            <div className="mt-2">
              <input
                id="caseTypeOther"
                name="caseTypeOther"
                placeholder={pick(locale, "حدّد نوع الحالة أو الصعوبة…", "Specify the condition or difficulty…")}
                aria-invalid={!!errors.caseTypeOther}
                onInput={() => clearError("caseTypeOther")}
                className={`w-full rounded-xl border bg-white px-3 py-2.5 text-start text-sm text-ink placeholder:text-ink-soft focus:outline-none focus:ring-2 ${errors.caseTypeOther ? "border-red-400 ring-2 ring-red-100 focus:ring-red-200" : "border-line focus:ring-brand/30"}`}
              />
              <FieldError name="caseTypeOther" error={errors.caseTypeOther} />
            </div>
          )}
        </div>
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
        <LimitedTextarea name="notes" rows={4} maxLength={500} placeholder={pick(locale, "اكتب رسالتك هنا...", "Write your message here...")} className="mt-1.5 w-full resize-none rounded-xl border border-line bg-white px-3 py-2.5 text-start text-sm text-ink placeholder:text-ink-soft focus:outline-none focus:ring-2 focus:ring-brand/30" />
      </div>

      <button type="submit" disabled={loading} className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3.5 text-base font-bold text-white transition-colors hover:bg-brand-dark disabled:opacity-60">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4z" /></svg>
        {loading ? pick(locale, "جارٍ الإرسال...", "Sending...") : pick(locale, "أرسل طلب الالتحاق الآن", "Submit Enrollment Request Now")}
      </button>
      {formError && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-600">{formError}</p>}
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

// رسالة خطأ تظهر فوق الحقل (لا تحته)
function FieldError({ name, error }: { name: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={`${name}-error`} role="alert" className="mt-1 text-start text-xs font-medium text-red-600">
      {error}
    </p>
  );
}

function Field({ label, name, required, type = "text", placeholder, error, onClear, filter }: { label: string; name: string; required?: boolean; type?: string; placeholder?: string; error?: string; onClear?: (name: string) => void; filter?: "name" | "phone" | "digits" }) {
  return (
    <div>
      <Label>{label} {required && <span className="text-danger">*</span>}</Label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        inputMode={filter === "phone" || filter === "digits" ? "numeric" : undefined}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        onInput={(e) => {
          if (filter === "name") e.currentTarget.value = stripDigits(e.currentTarget.value);
          else if (filter === "phone" || filter === "digits") e.currentTarget.value = digitsOnly(e.currentTarget.value);
          onClear?.(name);
        }}
        className={`mt-1.5 w-full rounded-xl border bg-white px-3 py-2.5 text-start text-sm text-ink placeholder:text-ink-soft focus:outline-none focus:ring-2 ${error ? "border-red-400 ring-2 ring-red-100 focus:ring-red-200" : "border-line focus:ring-brand/30"}`}
      />
      <FieldError name={name} error={error} />
    </div>
  );
}

function Select({ label, name, required, options, locale, error, onClear }: { label: string; name: string; required?: boolean; options: string[]; locale: Locale; error?: string; onClear?: (name: string) => void }) {
  return (
    <div>
      <Label>{label} {required && <span className="text-danger">*</span>}</Label>
      <div className="mt-1.5">
        <CustomSelect
          id={name}
          name={name}
          required={required}
          options={options}
          placeholder={pick(locale, "اختر", "Select")}
          invalid={!!error}
          onChange={() => onClear?.(name)}
        />
      </div>
      <FieldError name={name} error={error} />
    </div>
  );
}
