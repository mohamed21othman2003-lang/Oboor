import Link from "next/link";
import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import AdmissionForm from "@/components/AdmissionForm";
import CtaSection from "@/components/CtaSection";
import { getLocale } from "@/i18n/locale";
import { pick } from "@/i18n/config";
import { loadBranches } from "@/lib/server/branches";
import { branchSelectOptions } from "@/lib/branchesData";
import { fetchSections } from "@/lib/server/django";
import { hl } from "@/lib/highlight";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return pageMeta(
    pick(
      locale,
      "طلب التحاق | مركز عبور للرعاية والتأهيل",
      "Apply Now | Oboor Center for Care & Rehabilitation"
    ),
    pick(
      locale,
      "سجّل طلب التحاق طفلك في مراكز عبور — نموذج بسيط وسريع، واختر الفرع الأنسب لكم، وسيتواصل معك فريقنا لاستكمال خطوات الالتحاق.",
      "Register your child at Oboor centers — a simple, quick form; choose the branch that suits you and our team will contact you to complete the admission steps."
    ),
  );
}

function Chev() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="dir-flip"><path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" /></svg>;
}

export default async function AdmissionPage() {
  const locale = await getLocale();
  const en = locale === "en";
  const [branches, sections] = await Promise.all([loadBranches(locale), fetchSections("admission")]);
  // قسم التواصل السفلي (CTA) من الـCMS
  const ctaRow = (sections?.cta ?? []).find((r) => r.key === "main") as Record<string, string> | undefined;
  const ctaTitle = ctaRow?.title_ar ? hl(en ? ctaRow.title_en || ctaRow.title_ar : ctaRow.title_ar) : undefined;
  const ctaSub = ctaRow ? (en ? ctaRow.text_en || ctaRow.text_ar : ctaRow.text_ar) || undefined : undefined;
  const ctaBadge = ctaRow ? (en ? ctaRow.tagline_en || ctaRow.tagline_ar : ctaRow.tagline_ar) || undefined : undefined;
  // القسم العلوي (الهيرو) من الـCMS مع fallback ثابت
  const hero = sections?.hero ?? [];
  const hF = (k: string) => hero.find((r) => r.key === k);
  const hT = (r?: (typeof hero)[number]) => (r ? (en ? r.title_en || r.title_ar : r.title_ar) : "");
  const hB = (r?: (typeof hero)[number]) => (r ? (en ? r.text_en || r.text_ar : r.text_ar) : "");
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
              {hT(hF("badge")) || pick(locale, "التسجيل متاح الآن في جميع الفروع", "Registration is now open at all branches")}
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight text-ink sm:text-5xl">
              {hF("heading") ? hl(hT(hF("heading"))) : <>{pick(locale, "غدُه بانتظار ", "A Future Awaits Your ")}<span className="text-brand">{pick(locale, "خطوتك", "First Step")}</span></>}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-ink-muted">
              {hB(hF("heading")) || pick(locale, "سجّل طلب الالتحاق لطفلك. نموذج التسجيل يسير ويختصر الكثير؛ ضع البيانات الآن، وستواصل معك ونمدّ يد العون.", "Submit your child's enrollment request. A simple and streamlined registration form designed for ease and convenience. Enter your details, and we will get in touch to provide full support and guidance.")}
            </p>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="bg-surface py-14">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <AdmissionForm locale={locale} branchOptions={branchSelectOptions(branches)} />
        </div>
      </section>

      {/* CTA */}
      <CtaSection
        locale={locale}
        badge={ctaBadge}
        title={ctaTitle ?? pick(locale, "إن راودك أي سؤال، فريقنا معك على مدار الساعة وفي كل حال.", "If you have any questions, our team is available around the clock to support you at all times.")}
        subtitle={ctaSub ?? pick(locale, "خبراؤنا في أتمّ الاستعداد للإجابة عن استفساراتك، وتوجيهك نحو البرنامج الأمثل لطفلك. تواصل الآن.", "Our experts are fully prepared to answer your inquiries and guide you toward the most suitable program for your child. Get in touch with us today.")}
      />
    </>
  );
}
