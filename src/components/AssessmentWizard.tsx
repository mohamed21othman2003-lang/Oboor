"use client";

import { useState } from "react";
import { getAssessments, getPrelimQuestions, getAnswerOptions, type Assessment } from "@/lib/assessmentData";
import { pick, type Locale } from "@/i18n/config";

export default function AssessmentWizard({ locale }: { locale: Locale }) {
  const STEPS = [
    pick(locale, "اختر التقييم المناسب", "Choose the Assessment"),
    pick(locale, "اجب الأسئلة", "Answer Questions"),
    pick(locale, "اضف البيانات", "Add Details"),
    pick(locale, "النتيجة", "Result"),
  ];
  const ASSESSMENTS = getAssessments(locale);
  const PRELIM_QUESTIONS = getPrelimQuestions(locale);
  const ANSWER_OPTIONS = getAnswerOptions(locale);

  const [step, setStep] = useState(0);
  const [active, setActive] = useState<Assessment | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const start = (a: Assessment) => { setActive(a); setStep(1); };
  const reset = () => { setStep(0); setActive(null); setAnswers({}); };
  const answeredAll = PRELIM_QUESTIONS.every((_, i) => answers[i]);

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
        <form onSubmit={(e) => { e.preventDefault(); setStep(3); }} className="mx-auto max-w-xl">
          <h3 className="mb-5 text-center text-lg font-extrabold text-ink">{pick(locale, "أضف بيانات التواصل", "Add Contact Details")}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={pick(locale, "اسم الطفل", "Child's Name")} required placeholder={pick(locale, "اسم الطفل", "Child's name")} />
            <Field label={pick(locale, "عمر الطفل", "Child's Age")} required placeholder={pick(locale, "مثال: 6 سنوات", "Example: 6 years")} />
            <Field label={pick(locale, "اسم ولي الأمر", "Parent's Name")} required placeholder={pick(locale, "الاسم الكامل", "Full name")} />
            <Field label={pick(locale, "رقم الجوال", "Mobile Number")} required type="tel" placeholder="05XXXXXXXX" />
          </div>
          <div className="mt-6 flex items-center justify-between gap-3">
            <button type="submit" className="rounded-xl bg-brand px-8 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark">{pick(locale, "عرض النتيجة", "View Result")}</button>
            <button type="button" onClick={() => setStep(1)} className="rounded-xl border border-line px-6 py-2.5 text-sm font-semibold text-ink-muted transition-colors hover:bg-surface">{pick(locale, "السابق", "Back")}</button>
          </div>
        </form>
      )}

      {/* Step 3: result */}
      {step === 3 && (
        <div className="mx-auto max-w-xl py-4 text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand/10 text-brand">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
          </span>
          <h3 className="mt-4 text-xl font-extrabold text-ink">{pick(locale, "تم إنجاز التقييم الأولي بنجاح", "Preliminary assessment completed successfully")}</h3>
          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-ink-muted">
            {pick(
              locale,
              <>شكراً لك. بناءً على إجاباتك في «{active?.title}»، يُوصى بإجراء تقييم متخصص مع أحد أخصائيينا لوضع خطة مناسبة لطفلك. سيتواصل معك فريقنا قريباً لتحديد موعد.</>,
              <>Thank you. Based on your answers in &laquo;{active?.title}&raquo;, we recommend a specialized assessment with one of our specialists to set up a suitable plan for your child. Our team will contact you soon to schedule an appointment.</>
            )}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a href="/admission" className="rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark">{pick(locale, "طلب التحاق", "Apply Now")}</a>
            <a href="https://wa.me/966561000274" target="_blank" rel="noopener noreferrer" className="rounded-xl bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90">{pick(locale, "تواصل عبر الواتساب", "Contact via WhatsApp")}</a>
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

function Field({ label, required, type = "text", placeholder }: { label: string; required?: boolean; type?: string; placeholder?: string }) {
  return (
    <div>
      <label className="block text-start text-sm font-semibold text-ink">{label} {required && <span className="text-danger">*</span>}</label>
      <input type={type} required={required} placeholder={placeholder} className="mt-1.5 w-full rounded-xl border border-line bg-white px-3 py-2.5 text-start text-sm text-ink placeholder:text-ink-soft focus:outline-none focus:ring-2 focus:ring-brand/30" />
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
