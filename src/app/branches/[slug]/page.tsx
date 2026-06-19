import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ALL_BRANCHES, getBranch, BRANCH_FEATURES, BRANCH_FEATURES_EN } from "@/lib/branchesData";
import { getSuccessStories } from "@/lib/successStoriesData";
import ProgramCard, { type Program } from "@/components/ProgramCard";
import SuccessStoryCard from "@/components/SuccessStoryCard";
import BranchGallery from "@/components/BranchGallery";
import { getLocale } from "@/i18n/locale";
import { pick, type Locale } from "@/i18n/config";

export function generateStaticParams() {
  return ALL_BRANCHES.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const b = getBranch(slug, locale);
  const suffix = pick(locale, "مركز عبور", "Oboor Center");
  const fallback = pick(locale, "تفاصيل الفرع", "Branch Details");
  return { title: b ? `${b.name} | ${suffix}` : `${fallback} | ${suffix}` };
}

function branchServices(locale: Locale): Program[] {
  return [
    {
      badge: pick(locale, "خدمة", "Service"),
      href: "/services/physical",
      title: pick(locale, "العلاج الطبيعي", "Physical Therapy"),
      desc: pick(locale, "جلسات علاجية متخصصة لتحسين الحركة والقوة والتوازن لدى الأطفال.", "Specialized therapy sessions to improve children's movement, strength, and balance."),
      features: [
        pick(locale, "تقييم حركي شامل", "Comprehensive motor assessment"),
        pick(locale, "تمارين تقوية وتوازن", "Strengthening and balance exercises"),
        pick(locale, "استخدام المعدات العلاجية الحديثة", "Use of modern therapy equipment"),
      ],
      regions: [pick(locale, "الرياض", "Riyadh"), pick(locale, "جدة", "Jeddah"), pick(locale, "الشرقية", "Eastern Province")],
    },
    {
      badge: pick(locale, "خدمة", "Service"),
      href: "/services/social",
      title: pick(locale, "الخدمات الاجتماعية", "Social Services"),
      desc: pick(locale, "دعم الأسر في مواجهة التحديات اليومية وتسهيل اندماج الطفل في محيطه.", "Supporting families with daily challenges and easing the child's integration into their environment."),
      features: [
        pick(locale, "إدارة الحالات الاجتماعية", "Social case management"),
        pick(locale, "التواصل مع الجهات الداعمة", "Coordination with support organizations"),
        pick(locale, "ورش توعية للأسر", "Awareness workshops for families"),
      ],
      regions: [pick(locale, "الرياض", "Riyadh"), pick(locale, "جدة", "Jeddah"), pick(locale, "الشرقية", "Eastern Province")],
    },
    {
      badge: pick(locale, "خدمة", "Service"),
      href: "/services/psychological",
      title: pick(locale, "الخدمات النفسية", "Psychological Services"),
      desc: pick(locale, "خدمات تشخيصية وعلاجية شاملة لتحسين القدرات السلوكية والنفسية.", "Comprehensive diagnostic and therapeutic services to improve behavioral and psychological abilities."),
      features: [
        pick(locale, "التقييم النفسي الشامل", "Comprehensive psychological assessment"),
        pick(locale, "العلاج السلوكي المعرفي", "Cognitive behavioral therapy"),
        pick(locale, "إرشاد الأسرة وتقديم الدعم النفسي", "Family counseling and psychological support"),
      ],
      regions: [pick(locale, "الرياض", "Riyadh"), pick(locale, "جدة", "Jeddah"), pick(locale, "الشرقية", "Eastern Province")],
    },
  ];
}

const GALLERY = Array.from({ length: 8 }, (_, i) => `/figma/branch-gallery/b${i + 1}.jpg`);

export default async function BranchDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await getLocale();
  const b = getBranch(slug, locale);
  if (!b) notFound();

  const BRANCH_SERVICES = branchServices(locale);
  const successStories = getSuccessStories(locale);
  const branchFeatures = locale === "en" ? BRANCH_FEATURES_EN : BRANCH_FEATURES;

  const info = [
    { icon: <PhoneIcon />, label: pick(locale, "رقم الهاتف", "Phone Number"), value: b.phone },
    { icon: <ClockIcon />, label: pick(locale, "ساعات العمل", "Working Hours"), value: b.hours },
    { icon: <PinIcon />, label: pick(locale, "العنوان", "Address"), value: b.address },
  ];

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${pick(locale, "مركز عبور", "Oboor Center")} - ${b.address}`)}`;

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-[#ebf7f9] to-white">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <nav className="mb-8 flex items-center justify-start gap-2 text-sm text-ink-soft">
            <span className="text-brand">{b.name}</span>
            <Chev />
            <Link href="/branches" className="hover:text-brand">{pick(locale, "فروعنا", "Branches")}</Link>
            <Chev />
            <Link href="/" className="hover:text-brand">{pick(locale, "الرئيسية", "Home")}</Link>
          </nav>

          <div className="flex flex-col items-stretch justify-between gap-8 lg:flex-row lg:items-center">
            {/* Buttons (end / left in RTL) */}
            <div className="order-3 flex flex-col gap-3 lg:w-64">
              <a
                href={`/branches/${slug}/profile`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
              >
                <DownloadIcon />
                {pick(locale, "تحميل البروفايل", "Download Profile")}
              </a>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl border border-brand px-6 py-3 text-sm font-semibold text-brand transition-colors hover:bg-brand/5"
              >
                <NavIcon />
                {pick(locale, "الاتجاهات", "Directions")}
              </a>
            </div>

            {/* Info (middle) */}
            <div className="order-2 flex flex-col gap-4">
              {info.map((it) => (
                <div key={it.label} className="flex items-center justify-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">{it.icon}</span>
                  <div className="text-start">
                    <p className="text-xs text-ink-soft">{it.label}</p>
                    <p className="text-sm font-semibold text-ink">{it.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Title (start / right in RTL) */}
            <div className="order-1 text-start">
              <h1 className="text-4xl font-extrabold text-ink">{b.name}</h1>
              <p className="mt-2 text-lg text-brand">{pick(locale, `${b.city} ، السعودية`, `${b.city}, Saudi Arabia`)}</p>
              <div className="mt-3 flex items-center justify-start gap-2">
                <span className="text-sm text-ink-soft">{pick(locale, "(124 تقييم)", "(124 reviews)")}</span>
                <span className="text-sm font-bold text-ink">4.8</span>
                <span className="flex">
                  {Array.from({ length: 5 }).map((_, i) => <StarIcon key={i} />)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="mb-10 text-start text-3xl font-extrabold text-ink">{pick(locale, "الخدمات المقدمة في ", "Services Offered at the ")}<span className="text-brand">{pick(locale, "الفرع", "Branch")}</span></h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {BRANCH_SERVICES.map((s) => <ProgramCard key={s.title} p={s} locale={locale} />)}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-surface py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="mb-10 text-center text-3xl font-extrabold text-ink">{pick(locale, "ما يميّز ", "What Sets ")}<span className="text-brand">{b.name}</span>{pick(locale, "", " Apart")}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {branchFeatures.map((f) => (
              <div key={f.title} className="rounded-2xl border border-line bg-white p-6 text-center shadow-sm">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand">{FEATURE_ICONS[f.icon]}</span>
                <h3 className="mt-4 text-base font-bold text-ink">{f.title}</h3>
                <p className="mt-2 text-sm leading-7 text-ink-muted">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success stories */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-10 text-start">
            <h2 className="text-3xl font-extrabold text-ink">{pick(locale, "قصص نجاح من ", "Success Stories from ")}<span className="text-brand">{b.name}</span></h2>
            <p className="mt-2 text-sm text-ink-muted">{pick(locale, "كل قصة نجاح تُعبّر عن رحلة حقيقية من التحدي إلى الإنجاز.", "Every success story reflects a real journey from challenge to achievement.")}</p>
          </div>
          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {successStories.slice(0, 3).map((s) => <SuccessStoryCard key={s.slug} story={s} locale={locale} />)}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <BranchGallery images={GALLERY} branchName={b.name} locale={locale} />
    </>
  );
}

function Chev() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="dir-flip"><path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" /></svg>;
}
function StarIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-brand"><polygon points="12 2 15 8.9 22.5 9.3 16.7 14 18.6 21.2 12 17.2 5.4 21.2 7.3 14 1.5 9.3 9 8.9" /></svg>;
}
function PhoneIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" /></svg>;
}
function ClockIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" strokeLinecap="round" /></svg>;
}
function PinIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>;
}
function DownloadIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>;
}
function NavIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>;
}

const FEATURE_ICONS: Record<string, React.ReactNode> = {
  graduation: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10 12 5 2 10l10 5 10-5z" /><path d="M6 12v5c0 1 2.7 2.5 6 2.5s6-1.5 6-2.5v-5" /></svg>,
  shield: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l8 3v6c0 5-3.4 8.6-8 11-4.6-2.4-8-6-8-11V5z" /><path d="M9 12l2 2 4-4" /></svg>,
  heart: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" /></svg>,
  building: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2" /></svg>,
};
