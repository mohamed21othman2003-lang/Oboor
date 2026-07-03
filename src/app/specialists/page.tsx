import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getSpecialistStats, getJoinCards, getContactPrompt, getSpecialists, type Specialist } from "@/lib/specialistsData";
import { getLocale } from "@/i18n/locale";
import { pick, type Locale } from "@/i18n/config";
import { fetchContent, fetchSections, getWhatsAppUrl } from "@/lib/server/django";
import { loadBranches } from "@/lib/server/branches";
import { hl } from "@/lib/highlight";
import SpecialistsExplorer from "@/components/SpecialistsExplorer";
import CtaSection from "@/components/CtaSection";

// الشكل اللي بيرجع من Django (content/specialists)
type ApiSpecialist = {
  slug: string; image: string; order: number;
  name_ar: string; name_en: string;
  specialty_ar: string; specialty_en: string;
  desc_ar: string; desc_en: string;
  days_ar: string; days_en: string;
  branch_ar: string; branch_en: string;
  experience_ar: string; experience_en: string;
  hours_ar: string; hours_en: string;
  branches_ar: string; branches_en: string;
  about_ar: string; about_en: string;
  qualifications_ar: string[]; qualifications_en: string[];
};

function toSpecialist(a: ApiSpecialist, locale: Locale): Specialist {
  const en = locale === "en";
  const tx = (ar: string, env: string | undefined | null) => (en ? (env ?? ar) : ar);
  return {
    slug: a.slug,
    name: tx(a.name_ar, a.name_en),
    specialty: tx(a.specialty_ar, a.specialty_en),
    desc: tx(a.desc_ar, a.desc_en),
    image: a.image,
    days: tx(a.days_ar, a.days_en),
    branch: tx(a.branch_ar, a.branch_en),
    experience: tx(a.experience_ar, a.experience_en),
    hours: tx(a.hours_ar, a.hours_en),
    branches: tx(a.branches_ar, a.branches_en),
    about: tx(a.about_ar, a.about_en),
    qualifications: en ? (a.qualifications_en ?? a.qualifications_ar) : a.qualifications_ar,
  };
}

// جلب الأخصائيين من Django مع fallback للبيانات الثابتة
async function loadSpecialists(locale: Locale): Promise<Specialist[]> {
  const rows = await fetchContent<ApiSpecialist[]>("specialists");
  return rows && rows.length ? rows.map((r) => toSpecialist(r, locale)) : getSpecialists(locale);
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: pick(
      locale,
      "الأخصائيون | مركز عبور للرعاية والتأهيل",
      "Specialists | Oboor Center for Care & Rehabilitation",
    ),
    description: pick(
      locale,
      "تعرف على فريقنا من الأخصائيين المؤهلين في مختلف مجالات التأهيل والعلاج.",
      "Meet our team of qualified specialists across the various fields of rehabilitation and therapy.",
    ),
  };
}

function Chev() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="dir-flip"><path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" /></svg>;
}
function ChevDown() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ink-soft"><path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" /></svg>;
}

export default async function SpecialistsPage() {
  const locale = await getLocale();
  const en = locale === "en";
  const [specialists, sections, branches, whatsapp] = await Promise.all([
    loadSpecialists(locale),
    fetchSections("specialists"),
    loadBranches(locale),
    getWhatsAppUrl(),
  ]);

  // القائمة الكاملة لتخصصات وفروع عبور (تظهر في الفلتر حتى قبل إضافة كل الأخصائيين)
  const specialtyOptions = pick(
    locale,
    ["علاج وظيفي", "تخاطب وتواصل", "تعديل سلوك", "علاج طبيعي", "تربية خاصة", "تكامل حسي", "تأهيل النطق واللغة", "علم النفس التربوي"],
    ["Occupational Therapy", "Speech & Communication", "Behavior Modification", "Physical Therapy", "Special Education", "Sensory Integration", "Speech & Language Rehab", "Educational Psychology"],
  );
  // مدن الفروع من الـCMS (تتحدّث تلقائياً عند إضافة فرع) مع fallback ثابت
  const branchCities = [...new Set(branches.map((b) => b.city).filter(Boolean))];
  const branchOptions = branchCities.length
    ? branchCities
    : pick(
        locale,
        ["الرياض", "جدة", "مكة المكرمة", "المدينة المنورة", "المنطقة الشرقية", "القصيم", "عسير", "الطائف", "أبها", "الخرج"],
        ["Riyadh", "Jeddah", "Makkah", "Madinah", "Eastern Province", "Qassim", "Asir", "Taif", "Abha", "Al-Kharj"],
      );

  // أقسام صفحة الأخصائيين من Django مع fallback للبيانات الثابتة
  const hero = sections?.hero ?? [];
  const hF = (k: string) => hero.find((r) => r.key === k);
  const hT = (r?: (typeof hero)[number]) => (r ? (en ? r.title_en || r.title_ar : r.title_ar) : "");
  const hB = (r?: (typeof hero)[number]) => (r ? (en ? r.text_en || r.text_ar : r.text_ar) : "");

  const stats = sections?.stats
    ? sections.stats.map((row) => ({
        value: en ? ((row.data_en as any)?.value ?? row.value) : row.value,
        label: en ? (row.title_en || row.title_ar) : row.title_ar,
      }))
    : getSpecialistStats(locale);

  const joinCards = sections?.join_cards
    ? sections.join_cards.map((row) => ({
        icon: row.icon,
        title: en ? (row.title_en || row.title_ar) : row.title_ar,
        desc: en ? (row.text_en || row.text_ar) : row.text_ar,
      }))
    : getJoinCards(locale);

  const contactPrompt = sections?.contact_prompt?.[0]
    ? (() => {
        const r = sections.contact_prompt[0];
        return {
          title: en ? (r.title_en || r.title_ar) : r.title_ar,
          subtitle: en ? (r.text_en || r.text_ar) : r.text_ar,
        };
      })()
    : getContactPrompt(locale);
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-[#ebf7f9] to-white">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <nav className="mb-8 flex items-center justify-start gap-2 text-sm text-ink-soft">
            <span className="text-brand">{pick(locale, "روّادنا", "Our Pioneers")}</span>
            <Chev />
            <Link href="/" className="hover:text-brand">{pick(locale, "الرئيسية", "Home")}</Link>
          </nav>

          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-medium text-brand-dark shadow-sm ring-1 ring-line">
              {hT(hF("badge")) || pick(locale, "فريق معتمد ومؤهل", "A certified and qualified team")}
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="text-brand"><polygon points="12 2 15 8.9 22.5 9.3 16.7 14 18.6 21.2 12 17.2 5.4 21.2 7.3 14 1.5 9.3 9 8.9" /></svg>
            </span>
            <h1 className="mt-5 text-4xl font-extrabold text-ink sm:text-5xl">{hF("heading") ? hl(hT(hF("heading"))) : pick(locale, "روّادنا", "Our Pioneers")}</h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-ink-muted">
              {hB(hF("heading")) || pick(
                locale,
                "تعرف على فريقنا من الأخصائيين المؤهلين في مختلف مجالات التأهيل والعلاج، واختر الأنسب لاحتياجات طفلك.",
                "Meet our team of qualified specialists across the various fields of rehabilitation and therapy, and choose the best fit for your child's needs.",
              )}
            </p>
          </div>

          {/* Stats — الأيقونة قبل الرقم؛ يتبع اتجاه الصفحة (LTR: أيقونة يسار، RTL: أيقونة يمين) */}
          <div className="mt-8 flex items-center justify-center gap-12">
            {stats.map((s, i) => (
              <div key={s.label} className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand/10 text-brand">
                  {i === 0 ? <RibbonIcon /> : <UsersIcon />}
                </span>
                <div className="text-start">
                  <p className="text-2xl font-extrabold text-brand"><bdi dir="ltr">{s.value}</bdi></p>
                  <p className="text-xs text-ink-muted">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Specialists grid */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-10 flex items-center justify-between gap-4">
            <h2 className="shrink-0 text-2xl font-extrabold text-ink sm:text-3xl">{pick(locale, "روّادنا", "Our Pioneers")}</h2>
            <span className="h-px flex-1 bg-line" />
          </div>

          <SpecialistsExplorer locale={locale} specialists={specialists} contactPrompt={contactPrompt} specialtyOptions={specialtyOptions} branchOptions={branchOptions} whatsapp={whatsapp} />
        </div>
      </section>

      {/* Join the team */}
      <section className="overflow-hidden bg-[#f3f9f9] py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 px-6 lg:px-8 xl:flex-row xl:justify-between">
          {/* Text (right) */}
          <div className="w-full text-start xl:w-[412px] xl:shrink-0">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-[#e8f7f9] px-4 py-1.5 text-xs font-bold text-brand">
              {pick(locale, "انضم إلى فريقنا", "Join Our Team")}
              <UsersIcon small />
            </span>
            <h2 className="mt-5 text-3xl font-extrabold leading-tight text-ink sm:text-4xl">{pick(locale, "انضم إلى فريق ", "Join the ")}<span className="text-brand">{pick(locale, "الأخصائيين", "Specialists")}</span>{pick(locale, "", " Team")}</h2>
            <p className="mt-5 text-base leading-8 text-ink-muted">
              {pick(
                locale,
                "إذا كنت أخصائيًا في مجالات التأهيل المختلفة وترغب في الانضمام إلى فريقنا، يسعدنا تواصلك معنا. نبحث دائماً عن متخصصين شغوفين يشاركوننا رؤيتنا في تقديم رعاية استثنائية للأطفال وأسرهم.",
                "If you are a specialist in any of the various fields of rehabilitation and would like to join our team, we would be delighted to hear from you. We are always looking for passionate professionals who share our vision of providing exceptional care for children and their families.",
              )}
            </p>
            <Link href="/careers" className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3.5 text-base font-bold text-white transition-colors hover:bg-brand-dark">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M19 8v6M22 11h-6" /></svg>
              {pick(locale, "قدم الآن", "Apply Now")}
            </Link>
          </div>

          {/* Visual (left) */}
          <div className="w-full xl:w-auto">
            {/* Floating layout (xl) */}
            <div className="relative hidden h-[661px] w-[752px] xl:block">
              <div className="absolute left-[28px] top-[97px] h-[500px] w-[613px] overflow-hidden rounded-[20px] shadow-[0px_20px_60px_0px_rgba(0,0,0,0.1)]">
                <Image src="/figma/specialists/team.jpg" alt={pick(locale, "فريق الأخصائيين", "The specialists team")} fill className="object-cover" sizes="613px" />
              </div>
              <JoinCard className="left-[85px] bottom-[491px]" card={joinCards[0]} />
              <JoinCard className="left-[539px] top-[109px]" card={joinCards[1]} />
              <JoinCard className="left-[481px] top-[443px]" card={joinCards[2]} />
              <JoinCard className="left-0 top-[468px]" card={joinCards[3]} />
            </div>
            {/* Stacked (below xl) */}
            <div className="xl:hidden">
              <div className="relative h-72 w-full overflow-hidden rounded-3xl shadow-lg">
                <Image src="/figma/specialists/team.jpg" alt={pick(locale, "فريق الأخصائيين", "The specialists team")} fill className="object-cover" sizes="100vw" />
              </div>
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {joinCards.map((c) => <JoinCard key={c.title} card={c} />)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CtaSection
        locale={locale}
        title={pick(locale, "هل تحتاج إلى استشارة أو مزيد من المعلومات؟", "Need a consultation or more information?")}
        subtitle={pick(locale, "فريقنا من المختصين جاهز للإجابة على كل استفساراتكم ومساعدتكم في اختيار البرنامج الأنسب لطفلكم. تواصلوا معنا الآن.", "Our team of specialists is ready to answer all your questions and help you choose the most suitable program for your child. Get in touch with us now.")}
      />
    </>
  );
}

function JoinCard({ card, className = "" }: { card: { title: string; desc: string; icon: string }; className?: string }) {
  const icons: Record<string, React.ReactNode> = {
    growth: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 17l6-6 4 4 8-8" /><path d="M21 7v5h-5" /></svg>,
    building: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2" /></svg>,
    book: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>,
    heart: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" /></svg>,
  };
  return (
    <div className={`flex w-full flex-col items-center rounded-2xl bg-brand p-5 text-center text-white shadow-[3px_3px_6.5px_rgba(0,0,0,0.16)] xl:absolute xl:min-h-[193px] xl:w-[213px] ${className}`}>
      <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#e8f7f9] text-brand">{icons[card.icon]}</span>
      <h4 className="mt-3 text-[15px] font-bold">{card.title}</h4>
      <p className="mt-1.5 text-[13px] leading-[21px] text-white/90">{card.desc}</p>
    </div>
  );
}

/* Icons */
function SearchSelect({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <button className="flex shrink-0 items-center gap-2.5 rounded-xl px-2 py-1.5 transition-colors hover:bg-surface">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">{icon}</span>
      <span className="text-start">
        <span className="block text-[11px] leading-none text-ink-soft">{label}</span>
        <span className="mt-0.5 block text-sm font-bold leading-tight text-ink">{value}</span>
      </span>
      <ChevDown />
    </button>
  );
}
function Divider() {
  return <span className="hidden h-9 w-px bg-line lg:block" />;
}
function SearchIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>;
}
function BookIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>;
}
function RibbonIcon({ small }: { small?: boolean }) {
  const s = small ? 16 : 20;
  return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6" /><path d="M8.5 13.5L7 22l5-3 5 3-1.5-8.5" /></svg>;
}
function UsersIcon({ small }: { small?: boolean }) {
  const s = small ? 14 : 20;
  return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
}
