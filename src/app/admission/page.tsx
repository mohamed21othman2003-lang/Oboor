import Link from "next/link";
import type { Metadata } from "next";
import AdmissionForm from "@/components/AdmissionForm";
import { getLocale } from "@/i18n/locale";
import { pick } from "@/i18n/config";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: pick(
      locale,
      "طلب التحاق | مركز عبور للرعاية والتأهيل",
      "Apply Now | Oboor Center for Care & Rehabilitation"
    ),
    description: pick(
      locale,
      "سجّل طلب التحاق لطفلك الآن — ابدأ رحلة التأهيل بخطوة بسيطة وسريعة.",
      "Register your child now — start the rehabilitation journey with one simple, quick step."
    ),
  };
}

function Chev() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="dir-flip"><path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" /></svg>;
}

export default async function AdmissionPage() {
  const locale = await getLocale();
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-[#ebf7f9] to-white">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <nav className="mb-8 flex items-center justify-start gap-2 text-sm text-ink-soft">
            <span className="text-brand">{pick(locale, "طلب التحاق", "Apply Now")}</span>
            <Chev />
            <Link href="/" className="hover:text-brand">{pick(locale, "الرئيسية", "Home")}</Link>
          </nav>

          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-medium text-brand-dark shadow-sm ring-1 ring-line">
              <span className="h-2 w-2 rounded-full bg-success" />
              {pick(locale, "التسجيل متاح الآن في جميع الفروع", "Registration is now open at all branches")}
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight text-ink sm:text-5xl">
              {pick(locale, "غدُه بانتظار ", "A Future Awaits Your ")}<span className="text-brand">{pick(locale, "خطوتك", "First Step")}</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-ink-muted">
              {pick(locale, "سجّل طلب الالتحاق لطفلك. نموذج التسجيل يسير ويختصر الكثير؛ ضع البيانات الآن، وستواصل معك ونمدّ يد العون.", "Submit your child's enrollment request. A simple and streamlined registration form designed for ease and convenience. Enter your details, and we will get in touch to provide full support and guidance.")}
            </p>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="bg-surface py-14">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <AdmissionForm locale={locale} />
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-gradient-to-bl from-brand-deep to-[#0a2329]">
        <div className="relative mx-auto max-w-7xl px-6 py-16 text-center lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90">
            <span className="h-2 w-2 rounded-full bg-success" />
            {pick(locale, "خدمة العملاء متاحة على مدار الساعة", "Customer service available around the clock")}
          </span>
          <h2 className="mt-5 text-3xl font-extrabold text-white sm:text-4xl">{pick(locale, "إن راودك أي سؤال، فريقنا معك على مدار الساعة وفي كل حال.", "If you have any questions, our team is available around the clock to support you at all times.")}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-8 text-white/75">
            {pick(locale, "خبراؤنا في أتمّ الاستعداد للإجابة عن استفساراتك، وتوجيهك نحو البرنامج الأمثل لطفلك. تواصل الآن.", "Our experts are fully prepared to answer your inquiries and guide you toward the most suitable program for your child. Get in touch with us today.")}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
            {[pick(locale, "أخصائيون معتمدون", "Certified specialists"), pick(locale, "استجابة فورية", "Immediate response"), pick(locale, "متابعة مستمرة", "Continuous follow-up")].map((f) => (
              <span key={f} className="flex items-center gap-2 text-sm text-white/85">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand"><circle cx="12" cy="12" r="9" /><path d="M8.5 12l2.2 2.2L15.5 9.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                {f}
              </span>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/branches" className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-surface">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
              {pick(locale, "ابدأ من فرعك الأقرب", "Start at Your Nearest Branch")}
            </Link>
            <a href="https://wa.me/966561000274" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.5A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-2.8.9.9-2.7-.2-.3A8 8 0 1 1 12 20zm4.4-6c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1a6.5 6.5 0 0 1-3.2-2.8c-.2-.4.2-.4.6-1.2.1-.2 0-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a1 1 0 0 0-.7.3c-.2.3-.9.9-.9 2.2s.9 2.5 1 2.7c.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.7.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1z" /></svg>
              {pick(locale, "تواصل معنا", "Contact Us")}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
