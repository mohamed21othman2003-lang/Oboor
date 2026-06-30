"use client";

import { useState } from "react";
import { CITIES, CITIES_EN } from "@/lib/careersData";
import { pick, type Locale } from "@/i18n/config";
import { validateName, validatePhone, stripDigits, digitsOnly } from "@/lib/validate";
import CustomSelect from "@/components/ui/Select";
import LimitedTextarea from "@/components/ui/LimitedTextarea";

const OTHER = "__other__";

// تخصصات/مجالات مهنية للاختيار (الوظيفة الحالية للمتقدّم — مستقلة عن الوظيفة المُعلَنة)
const SPECIALTIES = ["أخصائي نطق وتخاطب", "علاج وظيفي", "علاج طبيعي", "تحليل سلوك تطبيقي (ABA)", "أخصائي نفسي", "تربية خاصة", "تمريض", "إداري / منسّق", "طالب / خريّج جديد"];
const SPECIALTIES_EN = ["Speech & Language Therapist", "Occupational Therapist", "Physical Therapist", "ABA Behavior Analyst", "Psychologist", "Special Education", "Nursing", "Administrative / Coordinator", "Student / New Graduate"];

export default function CareerApplyForm({ jobTitle, locale }: { jobTitle: string; locale: Locale }) {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const [role, setRole] = useState("");
  const [roleOther, setRoleOther] = useState("");

  const MAX = 10 * 1024 * 1024; // 10MB

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) { setFileName(""); return; }
    if (f.size > MAX) {
      setError(pick(locale, "حجم الملف أكبر من 10 ميغابايت.", "File exceeds 10 MB."));
      e.target.value = "";
      setFileName("");
      return;
    }
    setError("");
    setFileName(f.name);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const nameErr = validateName(String(fd.get("name") || ""), locale);
    if (nameErr) { setError(nameErr); return; }
    const phoneErr = validatePhone(String(fd.get("phone") || ""), locale);
    if (phoneErr) { setError(phoneErr); return; }
    const finalRole = role === OTHER ? roleOther.trim() : role;
    if (!finalRole) { setError(pick(locale, "الرجاء اختيار أو إدخال المسمى الوظيفي الحالي.", "Please select or enter your current job title.")); return; }
    fd.set("currentRole", finalRole);
    const cv = fd.get("cv");
    // السيرة الذاتية إجبارية فعلياً
    if (!(cv instanceof File) || cv.size === 0) {
      setError(pick(locale, "الرجاء رفع السيرة الذاتية (PDF أو DOC).", "Please upload your CV (PDF or DOC)."));
      return;
    }
    if (cv.size > MAX) {
      setError(pick(locale, "حجم الملف أكبر من 10 ميغابايت.", "File exceeds 10 MB."));
      return;
    }
    setLoading(true);
    setError("");
    try {
      const base = process.env.NEXT_PUBLIC_DJANGO_API_URL;
      if (base) {
        // رفع مباشر إلى Django (يتجاوز حد حجم دوال Vercel) — أسماء حقول Django
        const dj = new FormData();
        dj.set("job", jobTitle);
        dj.set("name", String(fd.get("name") || ""));
        dj.set("phone", String(fd.get("phone") || ""));
        dj.set("email", String(fd.get("email") || ""));
        dj.set("city", String(fd.get("city") || ""));
        dj.set("current_role", finalRole);
        dj.set("experience", String(fd.get("experience") || ""));
        dj.set("about", String(fd.get("about") || ""));
        dj.set("cv", cv, cv.name);
        const res = await fetch(`${base}/career/`, { method: "POST", body: dj });
        if (!res.ok) throw new Error("");
      } else {
        const res = await fetch("/api/career", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data.error || "");
      }
      setSent(true);
    } catch {
      setError(pick(locale, "حدث خطأ، حاول مرة أخرى.", "Something went wrong, please try again."));
    } finally {
      setLoading(false);
    }
  }

  const cityList = locale === "en" ? CITIES_EN : CITIES;
  const cities = cityList.filter((c) => c !== "الكل" && c !== "All");
  const experienceOptions = locale === "en"
    ? ["Less than a year", "1 - 2 years", "3 - 5 years", "More than 5 years"]
    : ["أقل من سنة", "سنة - سنتان", "٣ - ٥ سنوات", "أكثر من ٥ سنوات"];

  return (
    <section className="bg-surface py-16">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 text-sm font-bold text-brand">
            <span className="inline-block h-0.5 w-6 rounded-full bg-brand" />
            {pick(locale, "التقديم على الوظيفة", "Apply for This Job")}
            <span className="inline-block h-0.5 w-6 rounded-full bg-brand" />
          </span>
          <h2 className="mt-3 text-3xl font-extrabold text-ink">{pick(locale, "أرسل طلبك الآن", "Send Your Application Now")}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-ink-muted">
            {pick(
              locale,
              "يرجى تعبئة النموذج التالي بدقة. سيتم مراجعة طلبك والتواصل معك في حال تطابق مؤهلاتك مع المتطلبات.",
              "Please fill in the following form carefully. Your application will be reviewed and we will contact you if your qualifications match the requirements.",
            )}
          </p>
        </div>

        {sent ? (
          <div className="mt-8 rounded-2xl border border-brand/20 bg-white p-10 text-center shadow-sm">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand/10 text-brand">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
            </span>
            <h3 className="mt-4 text-xl font-bold text-ink">{pick(locale, "تم استلام طلبك بنجاح", "Your application was received successfully")}</h3>
            <p className="mt-2 text-sm text-ink-muted">
              {pick(
                locale,
                `شكراً لتقديمك على وظيفة «${jobTitle}». سيتواصل معك فريقنا قريباً.`,
                `Thank you for applying for the "${jobTitle}" position. Our team will be in touch with you soon.`,
              )}
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-8 rounded-2xl border border-line bg-white p-6 shadow-sm sm:p-8"
          >
            <input type="hidden" name="job" value={jobTitle} />
            <div className="grid gap-5 sm:grid-cols-2">
              <Field name="name" label={pick(locale, "الاسم الكامل", "Full Name")} required placeholder={pick(locale, "أدخل اسمك الكامل", "Enter your full name")} filter="name" />
              <Field name="phone" label={pick(locale, "رقم الجوال", "Mobile Number")} required type="tel" placeholder="05XXXXXXXX" filter="phone" />
              <Field name="email" label={pick(locale, "البريد الإلكتروني", "Email")} required type="email" placeholder="example@gmail.com" />
              <SelectField name="city" label={pick(locale, "المدينة", "City")} required options={cities} />
              <div>
                <Label required>{pick(locale, "تخصصك / مجالك الحالي", "Your current field / specialty")}</Label>
                <div className="mt-1.5">
                  <CustomSelect
                    value={role}
                    onChange={setRole}
                    placeholder={pick(locale, "اختر تخصصك…", "Select your specialty…")}
                    options={[
                      ...(locale === "en" ? SPECIALTIES_EN : SPECIALTIES).map((r) => ({ value: r, label: r })),
                      { value: OTHER, label: pick(locale, "أخرى…", "Other…") },
                    ]}
                  />
                </div>
                {role === OTHER && (
                  <input
                    value={roleOther}
                    onChange={(e) => setRoleOther(e.target.value)}
                    placeholder={pick(locale, "اكتب مسمّاك الوظيفي", "Type your job title")}
                    className="mt-2 w-full rounded-xl border border-line bg-white px-3 py-2.5 text-start text-sm text-ink placeholder:text-ink-soft focus:outline-none focus:ring-2 focus:ring-brand/30"
                  />
                )}
              </div>
              <SelectField name="experience" label={pick(locale, "سنوات الخبرة", "Years of Experience")} required options={experienceOptions} />
            </div>

            <div className="mt-5">
              <Label required>{pick(locale, "نبذة مختصرة عنك", "A Brief About Yourself")}</Label>
              <LimitedTextarea
                name="about"
                required
                rows={4}
                maxLength={500}
                placeholder={pick(
                  locale,
                  "أخبرنا باختصار عن خلفيتك المهنية، تخصصك، ودوافعك للانضمام إلى فريق عبور…",
                  "Tell us briefly about your professional background, specialization, and your motivation for joining the Oboor team…",
                )}
                className="mt-1.5 w-full resize-none rounded-xl border border-line bg-white px-3 py-2.5 text-start text-sm text-ink placeholder:text-ink-soft focus:outline-none focus:ring-2 focus:ring-brand/30"
              />
            </div>

            <div className="mt-5">
              <Label required>{pick(locale, "السيرة الذاتية", "Résumé / CV")}</Label>
              <label className={`mt-1.5 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors ${fileName ? "border-brand/60 bg-brand/5" : "border-line bg-surface/50 hover:border-brand/50 hover:bg-surface"}`}>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 text-brand">
                  {fileName ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 16V4M5 11l7-7 7 7M5 20h14" /></svg>
                  )}
                </span>
                {fileName ? (
                  <span className="break-all text-sm font-semibold text-brand-dark" dir="ltr">{fileName}</span>
                ) : (
                  <>
                    <span className="text-sm font-medium text-ink">{pick(locale, "اسحب ملفك هنا أو انقر للرفع", "Drag your file here or click to upload")}</span>
                    <span className="text-xs text-ink-soft">{pick(locale, "PDF, DOC, DOCX — بحد أقصى 10 ميغابايت", "PDF, DOC, DOCX — max 10 MB")}</span>
                  </>
                )}
                <input name="cv" type="file" accept=".pdf,.doc,.docx" onChange={onFile} className="hidden" />
              </label>
            </div>

            {error && <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3.5 text-base font-bold text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4z" /></svg>
              {loading ? pick(locale, "جارٍ الإرسال...", "Sending...") : pick(locale, "إرسال الطلب", "Submit Request")}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-start text-sm font-semibold text-ink">
      {children} {required && <span className="text-danger">*</span>}
    </label>
  );
}

function Field({ label, name, required, type = "text", placeholder, filter }: { label: string; name: string; required?: boolean; type?: string; placeholder?: string; filter?: "name" | "phone" }) {
  return (
    <div>
      <Label required={required}>{label}</Label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        inputMode={filter === "phone" ? "numeric" : undefined}
        onInput={filter ? (e) => { e.currentTarget.value = filter === "name" ? stripDigits(e.currentTarget.value) : digitsOnly(e.currentTarget.value); } : undefined}
        className="mt-1.5 w-full rounded-xl border border-line bg-white px-3 py-2.5 text-start text-sm text-ink placeholder:text-ink-soft focus:outline-none focus:ring-2 focus:ring-brand/30"
      />
    </div>
  );
}

function SelectField({ label, name, required, options }: { label: string; name: string; required?: boolean; options: string[] }) {
  return (
    <div>
      <Label required={required}>{label}</Label>
      <div className="mt-1.5">
        <CustomSelect name={name} required={required} placeholder="—" options={options} />
      </div>
    </div>
  );
}
