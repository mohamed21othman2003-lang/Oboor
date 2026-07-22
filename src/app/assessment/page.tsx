import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { getAssessStats, getAssessFeatures, getAssessSteps, getAssessments, getQuestionsFor, PRELIM_QUESTIONS, PRELIM_QUESTIONS_EN, ANSWER_OPTIONS, ANSWER_OPTIONS_EN, type Assessment } from "@/lib/assessmentData";
import AssessmentWizard from "@/components/AssessmentWizard";
import AnimatedNumber from "@/components/home/AnimatedNumber";
import { getLocale } from "@/i18n/locale";
import { pick, type Locale } from "@/i18n/config";
import { fetchContent, fetchSections, getWhatsAppUrl } from "@/lib/server/django";
import { loadBranches } from "@/lib/server/branches";
import { branchSelectOptions } from "@/lib/branchesData";
import { hl } from "@/lib/highlight";

// الشكل اللي بيرجع من Django (content/assessment)
type ApiAssessment = {
  slug: string; key: string; icon: string;
  title_ar: string; title_en: string;
  duration_ar: string; duration_en: string;
  questions_ar: string; questions_en: string;
  age_range_ar: string; age_range_en: string;
  desc_ar: string; desc_en: string;
  question_list_ar: string[]; question_list_en: string[];
  order: number;
};

type WizardData = { assessments: Assessment[]; questions: Record<string, string[]> };

// نص «عدد الأسئلة» يُحسب تلقائياً من عدد الأسئلة الفعلية (لا يتعارض مع الواقع)
function qLabel(n: number, en: boolean): string {
  if (en) return `${n} question${n === 1 ? "" : "s"}`;
  if (n === 1) return "سؤال واحد";
  if (n === 2) return "سؤالان";
  if (n >= 3 && n <= 10) return `${n} أسئلة`;
  return `${n} سؤالاً`;
}

// نحوّل صفوف Django المسطّحة إلى كروت + خريطة أسئلة حسب اللغة
function fromApi(rows: ApiAssessment[], locale: Locale): WizardData {
  const en = locale === "en";
  const questions: Record<string, string[]> = {};
  for (const r of rows) {
    questions[r.slug] = en && r.question_list_en?.length ? r.question_list_en : r.question_list_ar;
  }
  const assessments: Assessment[] = rows.map((r) => ({
    slug: r.slug,
    title: en ? (r.title_en ?? r.title_ar) : r.title_ar,
    desc: en ? (r.desc_en ?? r.desc_ar) : r.desc_ar,
    icon: r.icon,
    duration: en ? (r.duration_en ?? r.duration_ar) : r.duration_ar,
    // العدد من الأسئلة الفعلية (يتحدّث تلقائياً عند إضافة/حذف سؤال)
    questions: qLabel((questions[r.slug] ?? []).length, en),
    ageRange: en ? (r.age_range_en ?? r.age_range_ar) : r.age_range_ar,
  }));
  return { assessments, questions };
}

// fallback للبيانات الثابتة لو Django مش متاح
function staticData(locale: Locale): WizardData {
  const assessments = getAssessments(locale);
  const questions: Record<string, string[]> = {};
  for (const a of assessments) questions[a.slug] = getQuestionsFor(a.slug, locale);
  return { assessments, questions };
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return pageMeta(
    pick(
      locale,
      "قيّم ابنك | مركز عبور للرعاية والتأهيل",
      "Assess Your Child | Oboor Center for Care & Rehabilitation"
    ),
    pick(
      locale,
      "تقييم أولي مجاني وسريع لطفلك خلال دقائق — أسئلة بسيطة تساعدك على فهم احتياجاته وتحديد الخطوات الصحيحة نحو خطة تأهيل مناسبة.",
      "A free, quick preliminary assessment for your child in minutes — simple questions that help you understand their needs and identify the right steps toward a suitable rehabilitation plan."
    ),
  );
}

function Chev() {
  return <svg className="dir-flip" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" /></svg>;
}

export default async function AssessmentPage() {
  const locale = await getLocale();
  const en = locale === "en";

  // أقسام الصفحة + بطاقات التقييم من Django بالتوازي (تقليل TTFB) مع سقوط للبيانات الثابتة
  const [sections, rows, whatsapp, branches] = await Promise.all([
    fetchSections("assessment"),
    fetchContent<ApiAssessment[]>("assessment"),
    getWhatsAppUrl(),
    loadBranches(locale),
  ]);
  const hero = sections?.hero ?? [];
  const hF = (k: string) => hero.find((r) => r.key === k);
  const hT = (r?: (typeof hero)[number]) => (r ? (en ? r.title_en || r.title_ar : r.title_ar) : "");
  const hB = (r?: (typeof hero)[number]) => (r ? (en ? r.text_en || r.text_ar : r.text_ar) : "");

  const ASSESS_STATS = sections?.stats
    ? sections.stats.map((row) => ({
        value: en ? ((row.data_en as { value?: string } | null)?.value ?? row.value) : row.value,
        label: en ? (row.title_en || row.title_ar) : row.title_ar,
      }))
    : getAssessStats(locale);

  const ASSESS_FEATURES = sections?.features
    ? sections.features.map((row) => ({
        icon: row.icon,
        title: en ? (row.title_en || row.title_ar) : row.title_ar,
        desc: en ? (row.text_en || row.text_ar) : row.text_ar,
      }))
    : getAssessFeatures(locale);

  const ASSESS_STEPS = sections?.steps
    ? sections.steps.map((row) => ({
        icon: row.icon,
        title: en ? (row.title_en || row.title_ar) : row.title_ar,
        desc: en ? (row.text_en || row.text_ar) : row.text_ar,
      }))
    : getAssessSteps(locale);

  const prelimQuestions: string[] = sections?.prelim_questions
    ? sections.prelim_questions.map((row) => (en ? (row.title_en || row.title_ar) : row.title_ar))
    : (en ? PRELIM_QUESTIONS_EN : PRELIM_QUESTIONS);

  const answerOptions: string[] = sections?.answer_options
    ? sections.answer_options.map((row) => (en ? (row.title_en || row.title_ar) : row.title_ar))
    : (en ? ANSWER_OPTIONS_EN : ANSWER_OPTIONS);

  const { assessments, questions } = rows && rows.length ? fromApi(rows, locale) : staticData(locale);
  return (
    <>
      {/* Hero */}
      <section className="overflow-hidden bg-gradient-to-b from-[#ebf7f9] to-white">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <nav className="mb-8 flex items-center justify-start gap-2 text-sm text-ink-soft">
            <span className="text-brand">{pick(locale, "التقييم", "Assessment")}</span>
            <Chev />
            <Link href="/" className="hover:text-brand">{pick(locale, "الرئيسية", "Home")}</Link>
          </nav>

          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Text (right) */}
            <div className="order-2 text-start lg:order-1">
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-medium text-brand-dark shadow-sm ring-1 ring-line">
                <span className="h-2 w-2 rounded-full bg-success" />
                {hT(hF("badge")) || pick(locale, "تقييم مجاني وسريع", "Free & Fast Assessment")}
              </span>
              <h1 className="mt-5 text-4xl font-extrabold leading-tight text-ink sm:text-5xl">{hF("heading") ? hl(hT(hF("heading"))) : <>{pick(locale, "قيّم ابنك ", "Assess Your Child ")}<span className="text-brand">{pick(locale, "الآن", "Now")}</span></>}</h1>
              <p className="mt-5 max-w-xl text-base leading-8 text-ink-muted">
                {hB(hF("heading")) || pick(locale, "احصل على تقييم أولي سريع يساعدك على فهم احتياجات طفلك وتحديد الخطوات الصحيحة نحو مستقبل أفضل.", "Get a quick preliminary assessment that helps you understand your child's needs and identify the right steps toward a better future.")}
              </p>
              <div dir="ltr" className="mt-8 flex items-center justify-end gap-10">
                {ASSESS_STATS.map((s) => (
                  <div key={s.label} className="text-center">
                    <p className="text-2xl font-extrabold text-brand sm:text-3xl"><AnimatedNumber value={s.value} /></p>
                    <p className="mt-1 text-xs text-ink-muted">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Image (left) */}
            <div className="relative order-1 mx-auto h-[420px] w-full max-w-[480px] lg:order-2">
              <div className="absolute -bottom-4 -right-4 h-full w-full rounded-3xl bg-brand/10" />
              <div className="relative h-full w-full overflow-hidden rounded-3xl shadow-lg">
                <Image src={hF("heading")?.image || "/figma/about/intro.jpg"} alt={pick(locale, "تقييم الطفل", "Child assessment")} fill className="object-cover" sizes="(max-width:1024px) 100vw, 480px" priority />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="text-sm font-bold text-brand">{pick(locale, "لماذا هذا التقييم؟", "Why this assessment?")}</span>
            <h2 className="mt-2 text-3xl font-extrabold text-ink sm:text-4xl">{hF("why_heading") ? hl(hT(hF("why_heading"))) : pick(locale, "خطوة صغيرة، فرق كبير في حياة طفلك", "A small step, a big difference in your child's life")}</h2>
            <p className="mt-3 text-sm leading-7 text-ink-muted">{hB(hF("why_heading")) || pick(locale, "التقييم المبكر هو الخطوة الأولى نحو مستقبل أفضل. نحن نساعدك على فهم احتياجات طفلك بطريقة بسيطة وواضحة.", "Early assessment is the first step toward a better future. We help you understand your child's needs in a simple, clear way.")}</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ASSESS_FEATURES.map((f) => (
              <div key={f.title} className="rounded-2xl border border-line bg-surface/40 p-6 text-start">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand">{FEATURE_ICONS[f.icon]}</span>
                <h3 className="mt-4 text-base font-bold text-ink">{f.title}</h3>
                <p className="mt-2 text-sm leading-7 text-ink-muted">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="bg-gradient-to-bl from-brand-deep to-[#0a2329] py-16 text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="text-sm font-bold text-brand">{pick(locale, "كيف يعمل التقييم؟", "How does the assessment work?")}</span>
            <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">{hF("steps_heading") ? hl(hT(hF("steps_heading"))) : pick(locale, "رحلة بسيطة من ٥ خطوات", "A simple 5-step journey")}</h2>
            <p className="mt-3 text-sm text-white/70">{hB(hF("steps_heading")) || pick(locale, "نأخذ بيدك خطوة بخطوة نحو فهم احتياجات طفلك.", "We guide you step by step toward understanding your child's needs.")}</p>
          </div>
          <div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* connecting line (desktop) */}
            <div className="absolute right-[12.5%] left-[12.5%] top-8 hidden h-px bg-white/15 lg:block" />
            {ASSESS_STEPS.map((s, i) => (
              <div key={s.title} className="relative z-10 text-center">
                <span className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand text-white shadow-lg">
                  {STEP_ICONS[s.icon]}
                  <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-brand-deep text-xs font-bold text-white ring-2 ring-white/20">{i + 1}</span>
                </span>
                <h3 className="mt-4 text-base font-bold">{s.title}</h3>
                <p className="mt-1.5 text-xs leading-6 text-white/70">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wizard */}
      <section className="bg-surface py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-extrabold text-ink sm:text-4xl">{pick(locale, "ابدأ تقييم طفلك الآن", "Start your child's assessment now")}</h2>
            <p className="mt-2 text-sm text-ink-muted">{pick(locale, "يستغرق التقييم أقل من ٣ دقائق ونتيجته فورية.", "The assessment takes less than 3 minutes and the result is instant.")}</p>
          </div>
          <AssessmentWizard locale={locale} assessments={assessments} questions={questions} prelimQuestions={prelimQuestions} answerOptions={answerOptions} whatsapp={whatsapp} branchOptions={branchSelectOptions(branches)} />
        </div>
      </section>
    </>
  );
}

const FEATURE_ICONS: Record<string, React.ReactNode> = {
  heart: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" /></svg>,
  target: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></svg>,
  chart: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><rect x="7" y="11" width="3" height="6" /><rect x="13" y="7" width="3" height="10" /></svg>,
  search: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>,
};

const STEP_ICONS: Record<string, React.ReactNode> = {
  question: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></svg>,
  list: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 6h13M8 12h13M8 18h13" /><path d="M3 6h.01M3 12h.01M3 18h.01" /></svg>,
  briefcase: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>,
  bulb: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1V17h6v-.2c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2z" /></svg>,
};
