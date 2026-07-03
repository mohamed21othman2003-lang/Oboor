"use client";

import { useState } from "react";
import { validateName, validatePhone, stripDigits, digitsOnly } from "@/lib/validate";
import CustomSelect from "@/components/ui/Select";
import { getAssessments, getQuestionsFor, getAnswerOptions, type Assessment } from "@/lib/assessmentData";
import { pick, type Locale } from "@/i18n/config";
import { waUrl } from "@/lib/site";

export default function AssessmentWizard({
  locale,
  assessments,
  questions,
  prelimQuestions,
  answerOptions,
  whatsapp,
}: {
  locale: Locale;
  assessments?: Assessment[];
  questions?: Record<string, string[]>;
  prelimQuestions?: string[];
  answerOptions?: string[];
  whatsapp?: string;
}) {
  const whatsappHref = whatsapp || waUrl();
  const STEPS = [
    pick(locale, "اختر التقييم المناسب", "Choose the Assessment"),
    pick(locale, "اجب الأسئلة", "Answer Questions"),
    pick(locale, "اضف البيانات", "Add Details"),
    pick(locale, "النتيجة", "Result"),
  ];
  // نستخدم بيانات الـ CMS الممرّرة كـ props، ونرجع للبيانات الثابتة لو مش متوفّرة
  const ASSESSMENTS = assessments ?? getAssessments(locale);
  const ANSWER_OPTIONS = answerOptions?.length ? answerOptions : getAnswerOptions(locale);

  const [step, setStep] = useState(0);
  const [active, setActive] = useState<Assessment | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [error, setError] = useState("");

  // أسئلة التقييم المختار (تختلف حسب نوع التقييم)
  const PRELIM_QUESTIONS = active ? (questions?.[active.slug] ?? (prelimQuestions?.length ? prelimQuestions : getQuestionsFor(active.slug, locale))) : [];

  const start = (a: Assessment) => { setActive(a); setAnswers({}); setStep(1); };
  const reset = () => { setStep(0); setActive(null); setAnswers({}); };

  function submitData(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const nameErr = validateName(String(fd.get("parentName") || ""), locale);
    if (nameErr) { setError(nameErr); return; }
    const phoneErr = validatePhone(String(fd.get("phone") || ""), locale);
    if (phoneErr) { setError(phoneErr); return; }
    setError("");
    const payload = {
      assessment: active?.title,
      assessmentSlug: active?.slug,
      level,
      score,
      answers: PRELIM_QUESTIONS.map((q, i) => ({ q, a: answers[i] })),
      parentName: String(fd.get("parentName") || ""),
      phone: String(fd.get("phone") || ""),
      email: String(fd.get("email") || ""),
      childName: String(fd.get("childName") || ""),
      age: String(fd.get("age") || ""),
      gender: String(fd.get("gender") || ""),
      city: String(fd.get("city") || ""),
    };
    setStep(3); // النتيجة تظهر فورًا
    fetch("/api/assessment", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }).catch(() => {});
  }
  const answeredAll = PRELIM_QUESTIONS.length > 0 && PRELIM_QUESTIONS.every((_, i) => answers[i]);

  // مستوى الحالة محسوب من الإجابات: نعم=0، أحياناً=1، لا=2 (كلما زادت النقاط زادت الحاجة للمتابعة)
  const score = PRELIM_QUESTIONS.reduce((s, _, i) => s + Math.max(0, ANSWER_OPTIONS.indexOf(answers[i])), 0);
  const level = score >= 6 ? "high" : score >= 3 ? "medium" : "low";
  const levelMeta = {
    high: { label: pick(locale, "مرتفع", "High"), cls: "text-danger", desc: pick(locale, "بناءً على إجاباتك، يحتاج طفلك إلى متابعة تخصصية عاجلة. التدخل المبكر في هذه المرحلة له أثرٌ كبيرٌ جداً على مستقبله.", "Based on your answers, your child needs prompt specialized follow-up. Early intervention at this stage has a major impact on their future.") },
    medium: { label: pick(locale, "متوسط", "Medium"), cls: "text-amber-600", desc: pick(locale, "بناءً على إجاباتك، يُنصح بإجراء تقييمٍ تخصصي للاطمئنان ووضع خطةٍ داعمةٍ مناسبة لطفلك.", "Based on your answers, a specialized assessment is recommended to be sure and to set a suitable support plan for your child.") },
    low: { label: pick(locale, "منخفض", "Low"), cls: "text-brand-dark", desc: pick(locale, "نتائج طفلك مطمئنة في معظم المحاور. ننصح بالمتابعة الدورية والتواصل معنا عند ملاحظة أي تغيّر.", "Your child's results are reassuring across most areas. We recommend periodic follow-up and reaching out if you notice any change.") },
  }[level];

  return (
    <div className="mx-auto max-w-4xl rounded-3xl border border-line bg-white p-6 shadow-lg sm:p-8">
      {/* Step indicator */}
      <div className="mb-8 flex items-center">
        {STEPS.map((s, i) => (
          <div key={s} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <span className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-colors ${i <= step ? "bg-brand text-white" : "bg-surface text-ink-soft"}`}>
                {i < step ? <CheckIcon /> : i + 1}
              </span>
              <span className={`hidden text-[11px] font-semibold sm:block ${i <= step ? "text-brand-dark" : "text-ink-soft"}`}>{s}</span>
            </div>
            {i < STEPS.length - 1 && <span className={`mx-2 h-0.5 flex-1 rounded ${i < step ? "bg-brand" : "bg-line"}`} />}
          </div>
        ))}
      </div>

      {/* Step 0: choose */}
      {step === 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ASSESSMENTS.map((a) => (
            <div key={a.slug} className="flex flex-col rounded-2xl border border-line bg-white p-5 text-start transition-shadow hover:shadow-md">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand">{ICONS[a.icon]}</span>
              <h3 className="mt-3 text-base font-bold text-ink">{a.title}</h3>
              <p className="mt-1 flex-1 text-xs leading-6 text-ink-muted">{a.desc}</p>
              <div className="mt-3 grid grid-cols-3 gap-1 border-t border-line pt-3 text-center">
                <Meta icon={<ClockIcon />} label={pick(locale, "المدة", "Duration")} value={a.duration} />
                <Meta icon={<QIcon />} label={pick(locale, "الأسئلة", "Questions")} value={a.questions} />
                <Meta icon={<AgeIcon />} label={pick(locale, "الفئة", "Age")} value={a.ageRange} />
              </div>
              <button onClick={() => start(a)} className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-brand py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark">
                {pick(locale, "ابدأ التقييم", "Start Assessment")}
                <ChevL />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Step 1: questions */}
      {step === 1 && active && (
        <div>
          <div className="mb-5 flex items-center justify-between">
            <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-bold text-brand-dark">{active.title}</span>
            <h3 className="text-lg font-extrabold text-ink">{pick(locale, "أسئلة تمهيدية", "Preliminary Questions")}</h3>
          </div>
          <div className="space-y-4">
            {PRELIM_QUESTIONS.map((q, i) => (
              <div key={i} className="rounded-2xl border border-line bg-surface/40 p-4 text-start">
                <p className="mb-3 text-sm font-semibold text-ink">{i + 1}. {q}</p>
                <div className="flex flex-wrap justify-start gap-2">
                  {ANSWER_OPTIONS.map((o) => (
                    <button
                      key={o}
                      onClick={() => setAnswers((p) => ({ ...p, [i]: o }))}
                      className={`rounded-xl border px-5 py-2 text-sm font-medium transition-colors ${answers[i] === o ? "border-brand bg-brand text-white" : "border-line bg-white text-ink-muted hover:border-brand/50"}`}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-between gap-3">
            <button onClick={() => setStep(2)} disabled={!answeredAll} className="rounded-xl bg-brand px-8 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-line disabled:text-ink-soft">{pick(locale, "التالي", "Next")}</button>
            <button onClick={() => setStep(0)} className="rounded-xl border border-line px-6 py-2.5 text-sm font-semibold text-ink-muted transition-colors hover:bg-surface">{pick(locale, "السابق", "Back")}</button>
          </div>
        </div>
      )}

      {/* Step 2: data */}
      {step === 2 && (
        <form onSubmit={submitData} className="mx-auto max-w-2xl">
          <div className="mb-6 text-center">
            <h3 className="text-lg font-extrabold text-ink">{pick(locale, "بيانات الطفل وولي الأمر", "Child & Parent Details")}</h3>
            <p className="mt-1 text-sm text-ink-muted">{pick(locale, "نحتاج بعض المعلومات لعرض النتيجة الأولية والتواصل معكم عند الحاجة.", "We need a few details to show the preliminary result and contact you when needed.")}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="parentName" label={pick(locale, "اسم ولي الأمر", "Parent's Name")} required placeholder={pick(locale, "الاسم الكامل", "Full name")} filter="name" />
            <Field name="phone" label={pick(locale, "رقم الجوال", "Mobile Number")} required type="tel" placeholder="05XXXXXXXX" filter="phone" />
            <div className="sm:col-span-2">
              <Field name="email" label={pick(locale, "البريد الإلكتروني", "Email")} type="email" placeholder="name@example.com" />
            </div>
            <Field name="childName" label={pick(locale, "اسم الطفل", "Child's Name")} required placeholder={pick(locale, "اسم الطفل", "Child's name")} filter="name" />
            <Field name="age" label={pick(locale, "العمر (بالسنوات)", "Age (years)")} required placeholder={pick(locale, "مثال: 6", "Example: 6")} filter="digits" />
            <Select name="gender" label={pick(locale, "الجنس", "Gender")} placeholder={pick(locale, "اختر الجنس", "Select gender")} options={[pick(locale, "ذكر", "Male"), pick(locale, "أنثى", "Female")]} />
            <Select name="city" label={pick(locale, "المدينة", "City")} placeholder={pick(locale, "اختر المدينة", "Select city")} options={[pick(locale, "الرياض", "Riyadh"), pick(locale, "جدة", "Jeddah"), pick(locale, "الشرقية", "Eastern Province"), pick(locale, "مكة المكرمة", "Makkah"), pick(locale, "المدينة المنورة", "Madinah")]} />
          </div>
          {error && <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-600">{error}</p>}
          <div className="mt-6 flex items-center justify-between gap-3">
            <button type="submit" className="rounded-xl bg-brand px-8 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark">{pick(locale, "عرض النتيجة", "View Result")}</button>
            <button type="button" onClick={() => setStep(1)} className="rounded-xl border border-line px-6 py-2.5 text-sm font-semibold text-ink-muted transition-colors hover:bg-surface">{pick(locale, "السابق", "Back")}</button>
          </div>
        </form>
      )}

      {/* Step 3: result */}
      {step === 3 && (
        <div className="mx-auto max-w-2xl py-2">
          <div className="text-center">
            <h3 className="text-xl font-extrabold text-ink sm:text-2xl">{pick(locale, "تم إعداد تقييمك الأولي", "Your preliminary assessment is ready")}</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-ink-muted">{pick(locale, "شكراً لثقتك بنا، إليك نتيجة التقييم الأولي.", "Thank you for your trust — here is your preliminary result.")}</p>
          </div>

          {/* Result summary */}
          <div className="mt-6 grid grid-cols-2 gap-4 rounded-2xl border border-line bg-surface/50 p-5 text-center">
            <div>
              <p className="text-xs text-ink-soft">{pick(locale, "المجالات المُقيّمة", "Assessed Area")}</p>
              <p className="mt-1 text-base font-extrabold text-brand-dark">{active?.title}</p>
            </div>
            <div className="border-s border-line">
              <p className="text-xs text-ink-soft">{pick(locale, "مستوى الحالة", "Severity Level")}</p>
              <p className={`mt-1 flex items-center justify-center gap-1.5 text-base font-extrabold ${levelMeta.cls}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 3 14h7l-1 8 10-12h-7z" /></svg>
                {levelMeta.label}
              </p>
            </div>
          </div>

          <p className="mt-5 text-center text-sm leading-7 text-ink-muted">{levelMeta.desc}</p>

          {/* Disclaimer */}
          <div className="mt-5 flex items-start gap-2 rounded-xl border border-brand/20 bg-brand/5 p-4 text-start">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0 text-brand"><circle cx="12" cy="12" r="10" /><path d="M12 8h.01M11 12h1v4h1" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <p className="text-xs leading-6 text-ink-muted">
              <span className="font-bold text-ink">{pick(locale, "تنبيه مهم: ", "Important: ")}</span>
              {pick(locale, "هذه النتيجة أولية ولا تُعدّ تشخيصاً نهائياً، ويُنصح بالتقييم المتخصص عند الحاجة. بياناتك محمية وسرية تماماً.", "This is a preliminary result and not a final diagnosis; a specialized assessment is recommended when needed. Your data is fully protected and confidential.")}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark">{pick(locale, "تواصل مع خدمة العملاء", "Contact Customer Service")}</a>
            <a href="/admission" className="rounded-xl border border-brand px-6 py-3 text-sm font-semibold text-brand transition-colors hover:bg-brand hover:text-white">{pick(locale, "طلب التحاق", "Apply Now")}</a>
            <button onClick={reset} className="rounded-xl border border-line px-6 py-3 text-sm font-semibold text-ink-muted transition-colors hover:bg-surface">{pick(locale, "تقييم جديد", "New Assessment")}</button>
          </div>
        </div>
      )}
    </div>
  );
}

function Meta({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-brand">{icon}</span>
      <span className="text-[10px] text-ink-soft">{label}</span>
      <span className="text-[10px] font-bold text-ink">{value}</span>
    </div>
  );
}

function Field({ label, name, required, type = "text", placeholder, filter }: { label: string; name: string; required?: boolean; type?: string; placeholder?: string; filter?: "name" | "phone" | "digits" }) {
  return (
    <div>
      <label className="block text-start text-sm font-semibold text-ink">{label} {required && <span className="text-danger">*</span>}</label>
      <input name={name} type={type} required={required} placeholder={placeholder} inputMode={filter === "phone" || filter === "digits" ? "numeric" : undefined} onInput={filter ? (e) => { e.currentTarget.value = filter === "name" ? stripDigits(e.currentTarget.value) : digitsOnly(e.currentTarget.value); } : undefined} className="mt-1.5 w-full rounded-xl border border-line bg-white px-3 py-2.5 text-start text-sm text-ink placeholder:text-ink-soft focus:outline-none focus:ring-2 focus:ring-brand/30" />
    </div>
  );
}

function Select({ label, name, placeholder, options }: { label: string; name: string; placeholder: string; options: string[] }) {
  return (
    <div>
      <label className="block text-start text-sm font-semibold text-ink">{label}</label>
      <div className="mt-1.5">
        <CustomSelect name={name} placeholder={placeholder} options={options} />
      </div>
    </div>
  );
}

/* Icons */
const ICONS: Record<string, React.ReactNode> = {
  chat: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>,
  bolt: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 3 14h7l-1 8 10-12h-7z" /></svg>,
  puzzle: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 11h-2a2 2 0 1 0-4 0H9a2 2 0 1 0 0 4v2a2 2 0 1 1 0 4h6a2 2 0 0 0 2-2 2 2 0 1 1 0-4z" /></svg>,
  book: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>,
  users: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
  sensory: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" /></svg>,
};
function CheckIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>; }
function ChevL() { return <svg className="dir-flip" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" /></svg>; }
function ClockIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" strokeLinecap="round" /></svg>; }
function QIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></svg>; }
function AgeIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="7" r="4" /><path d="M5 21v-1a7 7 0 0 1 14 0v1" /></svg>; }
