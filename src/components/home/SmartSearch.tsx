import ProgramCard, { type Program } from "@/components/ProgramCard";
import ServiceSearchBar from "@/components/ServiceSearchBar";
import { pick, type Locale } from "@/i18n/config";

const PROGRAMS: Program[] = [
  {
    slug: "montaliq",
    title: "برنامج منطلق",
    desc: "برنامج متكامل لدعم الأطفال ذوي اضطراب طيف التوحد وتنمية مهاراتهم التواصلية والسلوكية.",
    suits: "الأطفال ذوو اضطراب طيف التوحد",
    age: "من سنتين إلى 12 سنة",
    features: ["جلسات فردية وجماعية", "تقييم دوري للتقدم", "مشاركة الأسرة في الخطة العلاجية"],
    regions: ["الرياض", "جدة", "الشرقية"],
  },
  {
    slug: "girls",
    title: "برنامج عبور لتأهيل الفتيات",
    desc: "برنامج متكامل يراعي الاحتياجات التأهيلية الخاصة بالفتيات في بيئة داعمة وآمنة.",
    suits: "الفتيات ذوات الإعاقة",
    age: "من 15 سنة فأكثر",
    features: ["تدريب على مهارات العمل", "أنشطة الاندماج المجتمعي", "برامج المهارات اليومية المستقلة"],
    regions: ["الرياض", "جدة", "الشرقية"],
  },
];

const PROGRAMS_EN: Program[] = [
  {
    slug: "montaliq",
    title: "Montaliq Program",
    desc: "An integrated program to support children with Autism Spectrum Disorder and develop their communication and behavioral skills.",
    suits: "Children with Autism Spectrum Disorder",
    age: "From 2 to 12 years",
    features: ["Individual and group sessions", "Regular progress assessment", "Family involvement in the treatment plan"],
    regions: ["Riyadh", "Jeddah", "Eastern Province"],
  },
  {
    slug: "girls",
    title: "Oboor Girls' Rehabilitation Program",
    desc: "An integrated program that accommodates the specific rehabilitation needs of girls in a supportive and safe environment.",
    suits: "Girls with disabilities",
    age: "15 years and above",
    features: ["Vocational skills training", "Community integration activities", "Independent daily living skills programs"],
    regions: ["Riyadh", "Jeddah", "Eastern Province"],
  },
];

export default function SmartSearch({ locale }: { locale: Locale }) {
  const programs = locale === "en" ? PROGRAMS_EN : PROGRAMS;
  const chips =
    locale === "en"
      ? ["Rehabilitation Technologies", "Clinical Services", "Rehabilitation Programs"]
      : ["تقنيات تأهيلية", "خدمات عيادية", "برامج تأهيلية"];
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-4 py-1.5 text-sm font-medium text-brand-dark">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></svg>
            {pick(locale, "البحث الذكي عن الخدمات", "Smart Service Search")}
          </span>
          <h2 className="mt-4 text-3xl font-extrabold text-ink sm:text-4xl">
            {pick(
              locale,
              <>دليلك الذكي <span className="text-brand">لخطوتك الأولى</span></>,
              <>Your Smart Guide to the <span className="text-brand">First Step</span></>
            )}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-ink-muted">
            {pick(
              locale,
              "بخطواتٍ بسيطة، حدّد فئة البرنامج والخدمة أو التقنية التي يحتاجها طفلك، واختر الفرع الأقرب إليك؛ لنأخذ بيد طفلك في رحلة تأهيلية متكاملة تُناسب احتياجاته.",
              "In a few simple steps, identify the program category, service, or therapy your child needs, and choose the nearest branch. We will guide your child through a comprehensive rehabilitation journey tailored to their individual needs."
            )}
          </p>
        </div>

        <ServiceSearchBar locale={locale} />

        {/* Quick chips */}
        <div className="mt-4 flex flex-wrap items-center justify-start gap-2">
          {chips.map((c, i) => (
            <span key={c} className={`rounded-full px-4 py-1.5 text-sm font-medium ${i === 2 ? "bg-brand/10 text-brand-dark" : "bg-surface text-ink-muted"}`}>{c}</span>
          ))}
          <span className="text-sm text-ink-soft">{pick(locale, "تصفح مباشرة:", "Browse directly:")}</span>
        </div>

        {/* Results */}
        <div className="mt-10">
          <h3 className="mb-5 flex items-center justify-start gap-2 text-xl font-bold text-ink">
            {pick(locale, "البرامج التأهيلية", "Rehabilitation Programs")}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
          </h3>
          <div className="grid gap-6 md:grid-cols-2">
            {programs.map((p) => (
              <ProgramCard key={p.title} p={p} locale={locale} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
