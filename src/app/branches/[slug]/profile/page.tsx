import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ALL_BRANCHES, getBranch, BRANCH_FEATURES, BRANCH_FEATURES_EN } from "@/lib/branchesData";
import { getLocale } from "@/i18n/locale";
import { pick } from "@/i18n/config";
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
  const b = getBranch(slug, locale);
  if (!b) notFound();

  const rows = [
    { label: pick(locale, "المدينة", "City"), value: b.city },
    { label: pick(locale, "المنطقة", "Region"), value: b.region },
    { label: pick(locale, "الحي", "District"), value: b.area },
    { label: pick(locale, "العنوان", "Address"), value: b.address },
    { label: pick(locale, "رقم الهاتف", "Phone"), value: b.phone },
    { label: pick(locale, "البريد الإلكتروني", "Email"), value: "info@oboor.com.sa" },
    { label: pick(locale, "ساعات العمل", "Working Hours"), value: b.hours },
  ];

  const features = locale === "en" ? BRANCH_FEATURES_EN : BRANCH_FEATURES;

  const intro = pick(
    locale,
    `يقدّم ${b.name} خدمات الرعاية والتأهيل المتكاملة لذوي الاحتياجات الخاصة وأسرهم في ${b.city}، عبر فريقٍ متخصص وبرامج معتمدة مصممة وفق احتياج كل طفل، وبيئةٍ مهيأة بأحدث أدوات التقييم والتأهيل.`,
    `${b.name} provides integrated care and rehabilitation services for people with special needs and their families in ${b.city}, through a specialized team, accredited programs tailored to each child's needs, and a facility equipped with the latest assessment and rehabilitation tools.`
  );

  return (
    <div className="min-h-screen bg-surface">
      <BranchProfileActions locale={locale} />

      <div className="profile-doc mx-auto my-8 max-w-3xl bg-white p-10 shadow-sm print:my-0 print:max-w-none print:p-0 print:shadow-none">
        {/* Header */}
        <header className="flex items-center justify-between gap-4 border-b-2 border-brand pb-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/figma/imgImage.png" alt={pick(locale, "مركز عبور", "Oboor Center")} className="h-14 w-auto" />
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

        {/* Footer */}
        <footer className="mt-10 flex items-center justify-between border-t border-line pt-5 text-sm text-ink-soft">
          <span>oboor.com.sa</span>
          <span>{pick(locale, "للحجز والاستفسار: ", "Bookings & inquiries: ")}920000109</span>
        </footer>
      </div>
    </div>
  );
}
