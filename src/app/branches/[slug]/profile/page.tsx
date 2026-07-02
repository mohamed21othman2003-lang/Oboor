import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ALL_BRANCHES, getBranch, BRANCH_FEATURES, BRANCH_FEATURES_EN } from "@/lib/branchesData";
import { loadBranch } from "@/lib/server/branches";
import { fetchSections } from "@/lib/server/django";
import { getLocale } from "@/i18n/locale";
import { pick } from "@/i18n/config";
import { CONTACT } from "@/lib/site";
import BranchProfileActions from "@/components/BranchProfileActions";

export function generateStaticParams() {
  return ALL_BRANCHES.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const b = getBranch(slug, locale);
  const suffix = pick(locale, "مركز عبور", "Oboor Center");
  return { title: b ? `${pick(locale, "بروفايل", "Profile")} — ${b.name}` : suffix };
}

export default async function BranchProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await getLocale();
  const b = (await loadBranch(slug, locale)) ?? getBranch(slug, locale);
  if (!b) notFound();

  const rows = [
    { label: pick(locale, "المدينة", "City"), value: b.city },
    { label: pick(locale, "المنطقة", "Region"), value: b.region },
    { label: pick(locale, "الحي", "District"), value: b.area },
    { label: pick(locale, "العنوان", "Address"), value: b.address },
    { label: pick(locale, "مدير الفرع", "Branch Manager"), value: b.manager || "" },
    { label: pick(locale, "رقم الهاتف", "Phone"), value: b.phone },
    { label: pick(locale, "رقم المساء", "Evening Phone"), value: b.phoneEvening || "" },
    { label: pick(locale, "البريد الإلكتروني", "Email"), value: b.email || CONTACT.email },
    { label: pick(locale, "ساعات العمل", "Working Hours"), value: b.hours },
  ].filter((r) => r.value);

  const features = locale === "en" ? BRANCH_FEATURES_EN : BRANCH_FEATURES;

  // محتوى ملف الفرع من الـCMS (عام لكل الفروع) مع fallback ثابت
  const en = locale === "en";
  const sec = await fetchSections("branches");
  const sT = (r: { title_ar: string; title_en: string }) => (en ? r.title_en || r.title_ar : r.title_ar);
  const sB = (r: { text_ar: string; text_en: string }) => (en ? r.text_en || r.text_ar : r.text_ar);

  const highlights = sec?.profile_stats?.length
    ? sec.profile_stats.map((r) => ({ value: r.value, label: sT(r) }))
    : [
        { value: "+19", label: pick(locale, "عامًا في الريادة", "Years of leadership") },
        { value: "+6,300", label: pick(locale, "مستفيد احتُضن بحب", "Beneficiaries served") },
        { value: "+43", label: pick(locale, "نقطة رعاية في الوطن", "Care points nationwide") },
        { value: "+7", label: pick(locale, "برامج تأهيلية", "Rehabilitation programs") },
      ];

  const journey = sec?.journey?.length
    ? sec.journey.map((r, i) => ({ step: String(i + 1), title: sT(r), desc: sB(r) }))
    : [
        { step: "1", title: pick(locale, "التقييم والتشخيص", "Assessment & Diagnosis"), desc: pick(locale, "تقييمٌ شاملٌ بأدواتٍ حديثة لتحديد احتياج الطفل بدقة.", "A comprehensive assessment with modern tools to precisely identify the child's needs.") },
        { step: "2", title: pick(locale, "الخطة الفردية", "Individualized Plan"), desc: pick(locale, "خطةٌ تأهيليةٌ مصممةٌ خصيصًا لكل طفلٍ وأهدافه.", "A rehabilitation plan tailored specifically to each child and their goals.") },
        { step: "3", title: pick(locale, "الجلسات التأهيلية", "Rehabilitation Sessions"), desc: pick(locale, "تنفيذ البرنامج على يد نخبةٍ من الأخصائيين المتخصصين.", "The program is delivered by a select team of specialized practitioners.") },
        { step: "4", title: pick(locale, "المتابعة والتمكين", "Follow-up & Empowerment"), desc: pick(locale, "قياسٌ مستمرٌ للتقدّم ودمجٌ للأسرة في كل خطوة.", "Continuous progress tracking and family involvement at every step.") },
      ];

  const accreditations = sec?.accreditations?.length
    ? sec.accreditations.map((r) => sT(r))
    : [
        pick(locale, "ISO 9001 — إدارة الجودة", "ISO 9001 — Quality Management"),
        pick(locale, "برامج تأهيلية معتمدة", "Accredited rehabilitation programs"),
        pick(locale, "كوادر مرخّصة ومؤهّلة", "Licensed & qualified staff"),
      ];

  const introTpl = sec?.profile_intro?.[0] ? sB(sec.profile_intro[0]) : pick(
    locale,
    "يقدّم {name} خدمات الرعاية والتأهيل المتكاملة لذوي الاحتياجات الخاصة وأسرهم في {city}، عبر فريقٍ متخصص وبرامج معتمدة مصممة وفق احتياج كل طفل، وبيئةٍ مهيأة بأحدث أدوات التقييم والتأهيل.",
    "{name} provides integrated care and rehabilitation services for people with special needs and their families in {city}, through a specialized team, accredited programs tailored to each child's needs, and a facility equipped with the latest assessment and rehabilitation tools."
  );
  const intro = introTpl.replace(/\{name\}/g, b.name).replace(/\{city\}/g, b.city);

  return (
    <div className="min-h-screen bg-surface">
      <BranchProfileActions locale={locale} />

      <div className="profile-doc mx-auto my-8 max-w-3xl bg-white p-10 shadow-sm print:my-0 print:max-w-none print:p-0 print:shadow-none">
        {/* Header */}
        <header className="flex items-center justify-between gap-4 border-b-2 border-brand pb-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt={pick(locale, "مركز عبور", "Oboor Center")} className="h-14 w-auto" />
          <div className="text-end">
            <p className="text-lg font-extrabold text-brand-deep">{pick(locale, "مركز عبور للرعاية والتأهيل", "Oboor Center for Care & Rehabilitation")}</p>
            <p className="text-sm text-ink-soft">{pick(locale, "بروفايل تعريفي للفرع", "Branch Profile")}</p>
          </div>
        </header>

        {/* Title */}
        <section className="mt-8">
          <h1 className="text-3xl font-extrabold text-ink">{b.name}</h1>
          <p className="mt-1 text-lg text-brand">{pick(locale, `${b.city} ، السعودية`, `${b.city}, Saudi Arabia`)}</p>
          <p className="mt-4 text-sm leading-7 text-ink-muted">{intro}</p>
        </section>

        {/* Highlights */}
        <section className="mt-6 grid grid-cols-4 gap-3 rounded-xl bg-brand-deep p-5 text-center text-white">
          {highlights.map((h) => (
            <div key={h.label}>
              <p className="text-2xl font-extrabold text-brand" dir="ltr">{h.value}</p>
              <p className="mt-1 text-[11px] leading-4 text-white/80">{h.label}</p>
            </div>
          ))}
        </section>

        {/* Info table */}
        <section className="mt-8 overflow-hidden rounded-xl border border-line">
          {rows.map((r, i) => (
            <div key={r.label} className={`flex gap-4 px-5 py-3 ${i % 2 ? "bg-surface" : "bg-white"}`}>
              <span className="w-32 shrink-0 text-sm font-semibold text-ink-soft">{r.label}</span>
              <span className="text-sm font-medium text-ink">{r.value}</span>
            </div>
          ))}
        </section>

        {/* Services */}
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-bold text-brand-deep">{pick(locale, "الخدمات المقدّمة", "Services Offered")}</h2>
          <ul className="grid grid-cols-2 gap-2">
            {b.services.map((s) => (
              <li key={s} className="flex items-center gap-2 rounded-lg bg-surface px-3 py-2 text-sm text-ink">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/15 text-brand">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6 9 17l-5-5" /></svg>
                </span>
                {s}
              </li>
            ))}
          </ul>
        </section>

        {/* Features */}
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-bold text-brand-deep">{pick(locale, "ما يميّز الفرع", "What Sets the Branch Apart")}</h2>
          <div className="grid grid-cols-2 gap-3">
            {features.map((f) => (
              <div key={f.title} className="rounded-xl border border-line p-4">
                <h3 className="text-sm font-bold text-ink">{f.title}</h3>
                <p className="mt-1 text-xs leading-6 text-ink-muted">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Rehabilitation journey */}
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-bold text-brand-deep">{pick(locale, "رحلة التأهيل في الفرع", "The Rehabilitation Journey")}</h2>
          <div className="grid grid-cols-2 gap-3">
            {journey.map((j) => (
              <div key={j.step} className="flex gap-3 rounded-xl border border-line p-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">{j.step}</span>
                <div>
                  <h3 className="text-sm font-bold text-ink">{j.title}</h3>
                  <p className="mt-1 text-xs leading-6 text-ink-muted">{j.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Accreditations */}
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-bold text-brand-deep">{pick(locale, "الاعتمادات والجودة", "Accreditations & Quality")}</h2>
          <div className="flex flex-wrap gap-2">
            {accreditations.map((a) => (
              <span key={a} className="rounded-full bg-surface px-4 py-1.5 text-xs font-semibold text-brand-dark ring-1 ring-brand/15">{a}</span>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="mt-8 rounded-xl bg-surface p-5">
          <h2 className="mb-3 text-lg font-bold text-brand-deep">{pick(locale, "خذ الخطوة لعبور", "Take the Step to Oboor")}</h2>
          <div className="grid grid-cols-2 gap-y-2 text-sm text-ink">
            <p><span className="font-semibold text-ink-soft">{pick(locale, "الهاتف الموحّد: ", "Unified line: ")}</span>{CONTACT.unified}</p>
            <p><span className="font-semibold text-ink-soft">{pick(locale, "البريد: ", "Email: ")}</span>{CONTACT.email}</p>
            <p><span className="font-semibold text-ink-soft">{pick(locale, "الموقع: ", "Website: ")}</span>{CONTACT.website}</p>
            <p><span className="font-semibold text-ink-soft">{pick(locale, "العنوان: ", "Address: ")}</span>{b.address}</p>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-10 flex items-center justify-between border-t border-line pt-5 text-sm text-ink-soft">
          <span>oboor.com.sa</span>
          <span>{pick(locale, "مركز عبور للرعاية والتأهيل © جميع الحقوق محفوظة", "Oboor Center for Care & Rehabilitation © All rights reserved")}</span>
        </footer>
      </div>
    </div>
  );
}
