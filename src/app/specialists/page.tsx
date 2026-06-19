import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getSpecialistStats, getJoinCards } from "@/lib/specialistsData";
import { getLocale } from "@/i18n/locale";
import { pick } from "@/i18n/config";
import SpecialistsGrid from "@/components/SpecialistsGrid";

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
  const stats = getSpecialistStats(locale);
  const joinCards = getJoinCards(locale);
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-[#ebf7f9] to-white">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <nav className="mb-8 flex items-center justify-start gap-2 text-sm text-ink-soft">
            <span className="text-brand">{pick(locale, "الاخصائيين", "Specialists")}</span>
            <Chev />
            <Link href="/" className="hover:text-brand">{pick(locale, "الرئيسية", "Home")}</Link>
          </nav>

          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-medium text-brand-dark shadow-sm ring-1 ring-line">
              {pick(locale, "فريق معتمد ومؤهل", "A certified and qualified team")}
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="text-brand"><polygon points="12 2 15 8.9 22.5 9.3 16.7 14 18.6 21.2 12 17.2 5.4 21.2 7.3 14 1.5 9.3 9 8.9" /></svg>
            </span>
            <h1 className="mt-5 text-4xl font-extrabold text-ink sm:text-5xl">{pick(locale, "الأخصائيين", "Specialists")}</h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-ink-muted">
              {pick(
                locale,
                "تعرف على فريقنا من الأخصائيين المؤهلين في مختلف مجالات التأهيل والعلاج، واختر الأنسب لاحتياجات طفلك.",
                "Meet our team of qualified specialists across the various fields of rehabilitation and therapy, and choose the best fit for your child's needs.",
              )}
            </p>
          </div>

          {/* Stats */}
          <div dir="ltr" className="mt-8 flex items-center justify-center gap-12">
            {stats.map((s, i) => (
              <div key={s.label} className="flex items-center gap-3">
                <div className="text-start">
                  <p className="text-2xl font-extrabold text-brand">{s.value}</p>
                  <p className="text-xs text-ink-muted">{s.label}</p>
                </div>
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand/10 text-brand">
                  {i === 0 ? <RibbonIcon /> : <UsersIcon />}
                </span>
              </div>
            ))}
          </div>

          {/* Search bar */}
          <div className="mt-8 flex flex-wrap items-center gap-2 rounded-2xl border border-line bg-white p-3 shadow-sm lg:flex-nowrap">
            <SearchSelect icon={<BookIcon />} label={pick(locale, "التخصص", "Specialty")} value={pick(locale, "جميع التخصصات", "All Specialties")} />
            <Divider />
            <SearchSelect icon={<RibbonIcon small />} label={pick(locale, "الخبره", "Experience")} value={pick(locale, "جميع الخبرات", "All Experience Levels")} />
            <Divider />
            <SearchSelect icon={<PinIcon />} label={pick(locale, "المنطقة / الفرع", "Region / Branch")} value={pick(locale, "جميع الفروع", "All Branches")} />
            <Divider />
            <div className="relative min-w-[220px] flex-1">
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft"><SearchIcon /></span>
              <input
                type="text"
                placeholder={pick(locale, "ابحث باسم الأخصائي أو التخصص...", "Search by specialist name or specialty...")}
                className="w-full rounded-xl bg-surface py-2.5 pr-10 pl-3 text-start text-sm text-ink placeholder:text-ink-soft focus:outline-none focus:ring-2 focus:ring-brand/30"
              />
            </div>
            <button className="flex shrink-0 items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark">
              <SearchIcon />
              {pick(locale, "ابحث الآن", "Search Now")}
            </button>
            <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-ink-soft transition-colors hover:bg-surface" aria-label={pick(locale, "إعادة تعيين", "Reset")}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></svg>
            </button>
          </div>
        </div>
      </section>

      {/* Specialists grid */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-10 flex items-center justify-between gap-4">
            <h2 className="shrink-0 text-2xl font-extrabold text-ink sm:text-3xl">{pick(locale, "الأخصائيين", "Specialists")}</h2>
            <span className="h-px flex-1 bg-line" />
            <span className="shrink-0 rounded-full bg-surface px-4 py-1.5 text-xs font-semibold text-ink-soft">{pick(locale, "16 نتائج", "16 results")}</span>
          </div>

          <SpecialistsGrid locale={locale} />
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
      <section className="relative overflow-hidden bg-gradient-to-bl from-brand-deep to-[#0a2329]">
        <div className="relative mx-auto max-w-7xl px-6 py-16 text-center lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90">
            <span className="h-2 w-2 rounded-full bg-success" />
            {pick(locale, "خدمة العملاء متاحة على مدار الساعة", "Customer service available around the clock")}
          </span>
          <h2 className="mt-5 text-3xl font-extrabold text-white sm:text-4xl">{pick(locale, "هل تحتاج إلى استشارة أو مزيد من المعلومات؟", "Need a consultation or more information?")}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-8 text-white/75">
            {pick(
              locale,
              "فريقنا من المختصين جاهز للإجابة على كل استفساراتكم ومساعدتكم في اختيار البرنامج الأنسب لطفلكم. تواصلوا معنا الآن",
              "Our team of specialists is ready to answer all your questions and help you choose the most suitable program for your child. Get in touch with us now.",
            )}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
            {[
              pick(locale, "أخصائيون معتمدون", "Certified specialists"),
              pick(locale, "رد سريع خلال ساعات العمل", "Quick response during working hours"),
              pick(locale, "متابعة مستمرة", "Continuous follow-up"),
            ].map((f) => (
              <span key={f} className="flex items-center gap-2 text-sm text-white/85">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand"><circle cx="12" cy="12" r="9" /><path d="M8.5 12l2.2 2.2L15.5 9.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                {f}
              </span>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/branches" className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-surface">
              <PinIcon />
              {pick(locale, "اعثر على أقرب فرع", "Find Nearest Branch")}
            </Link>
            <a href="https://wa.me/966561000274" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90">
              <WhatsappIcon />
              {pick(locale, "تواصل عبر الواتساب", "Contact via WhatsApp")}
            </a>
          </div>
        </div>
      </section>
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
function PinIcon({ small }: { small?: boolean }) {
  const s = small ? 13 : 16;
  return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>;
}
function WhatsappIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.5A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-2.8.9.9-2.7-.2-.3A8 8 0 1 1 12 20zm4.4-6c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1a6.5 6.5 0 0 1-3.2-2.8c-.2-.4.2-.4.6-1.2.1-.2 0-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a1 1 0 0 0-.7.3c-.2.3-.9.9-.9 2.2s.9 2.5 1 2.7c.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.7.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1z" /></svg>;
}
