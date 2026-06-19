import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PROGRAM_DETAILS, getProgram } from "@/lib/programsData";
import { distinctIcons } from "@/lib/areaIcon";
import { getLocale } from "@/i18n/locale";
import { pick } from "@/i18n/config";

export function generateStaticParams() {
  return PROGRAM_DETAILS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const p = getProgram(slug, locale);
  return {
    title: p
      ? `${p.title} | ${pick(locale, "مركز عبور", "Oboor Center")}`
      : pick(locale, "برنامج | مركز عبور", "Program | Oboor Center"),
    description: p
      ? p.subtitle
      : pick(locale, "تعرّف على برامج عبور التأهيلية لدعم طفلك.", "Discover Oboor's rehabilitation programs to support your child."),
  };
}


export default async function ProgramDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await getLocale();
  const p = getProgram(slug, locale);
  if (!p) notFound();

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-[#ebf7f9] to-white">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <nav className="mb-8 flex items-center justify-start gap-2 text-sm text-ink-soft">
            <span className="text-brand">{p.title}</span>
            <Chev />
            <Link href="/programs" className="hover:text-brand">{pick(locale, "البرامج التأهيلية", "Rehabilitation Programs")}</Link>
            <Chev />
            <Link href="/programs" className="hover:text-brand">{pick(locale, "خدماتنا", "Services")}</Link>
            <Chev />
            <Link href="/" className="hover:text-brand">{pick(locale, "الرئيسية", "Home")}</Link>
          </nav>
          <div className="text-center">
            <span className="rounded-full bg-white px-4 py-1.5 text-sm font-medium text-brand-dark shadow-sm ring-1 ring-line">{pick(locale, "خدماتنا في المملكة", "Our Services in Saudi Arabia")}</span>
            <h1 className="mt-5 text-3xl font-extrabold text-ink sm:text-4xl">{p.title}</h1>
            <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-ink-muted">{p.subtitle}</p>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2 lg:px-8">
          <div className="relative order-1 h-[420px]">
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-2xl bg-brand/10" />
            <div className="absolute -bottom-4 left-8 h-20 w-20 rounded-full bg-brand/10" />
            <div className="relative h-full w-full overflow-hidden rounded-3xl shadow-lg">
              <Image src={p.image} alt={p.title} fill className="object-cover" />
            </div>
          </div>
          <div className="order-2 text-start">
            <h2 className="text-3xl font-extrabold text-ink">{pick(locale, "عن ", "About ")}{p.title}</h2>
            <div className="mt-6 space-y-4">
              {p.about.map((para, i) => (
                <p key={i} className="text-sm leading-8 text-ink-muted">{para}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      {p.philosophy.length > 0 && (
        <section className="bg-gradient-to-bl from-brand-deep to-[#0a2329] py-16 text-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mb-10 text-start">
              <h2 className="text-3xl font-extrabold">{pick(locale, "فلسفة ", "Program ")}<span className="text-brand">{pick(locale, "البرنامج", "Philosophy")}</span></h2>
              {p.philosophyIntro && <p className="mt-4 max-w-5xl text-sm leading-8 text-white/75">{p.philosophyIntro}</p>}
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {p.philosophy.map((card, i) => (
                <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-6 text-start text-sm leading-7 text-white/85 backdrop-blur">
                  {card}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Info */}
      <section className="bg-surface py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="mb-10 text-start text-3xl font-extrabold text-ink">{pick(locale, "معلومات ", "Program ")}<span className="text-brand">{pick(locale, "البرنامج", "Information")}</span></h2>
          <div className="grid gap-6 md:grid-cols-3">
            {/* Methods */}
            {p.methods.length > 0 && (
              <InfoCard title={pick(locale, "المنهج العلمي", "Scientific Methodology")} icon={bookIcon}>
                <ul className="space-y-3">
                  {p.methods.map((m, i) => (
                    <li key={i} className="border-r-2 border-brand pr-3 text-start">
                      {m.name && <p className="text-sm font-bold text-ink">{m.name}</p>}
                      <p className="text-xs text-ink-muted">{m.desc}</p>
                    </li>
                  ))}
                </ul>
              </InfoCard>
            )}
            {/* Duration */}
            {p.duration && (
              <InfoCard title={pick(locale, "مدة البرنامج", "Program Duration")} icon={clockIcon}>
                <p className="text-start text-sm leading-7 text-ink-muted">{p.duration}</p>
              </InfoCard>
            )}
            {/* Target */}
            {(p.target || p.targetTags.length > 0 || (p.targetList && p.targetList.length > 0)) && (
              <InfoCard title={pick(locale, "الفئة المستهدفة", "Target Group")} icon={usersIcon}>
                {p.target && <p className="text-start text-sm leading-7 text-ink-muted">{p.target}</p>}
                {p.targetTags.length > 0 && (
                  <div className="mt-4 flex flex-wrap justify-start gap-2">
                    {p.targetTags.map((t) => (
                      <span key={t} className="rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand-dark">{t}</span>
                    ))}
                  </div>
                )}
                {p.targetList && p.targetList.length > 0 && (
                  <ul className="mt-3 space-y-2">
                    {p.targetList.map((t) => (
                      <li key={t} className="flex items-start gap-2 text-start text-sm text-ink-muted">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                        {t}
                      </li>
                    ))}
                  </ul>
                )}
              </InfoCard>
            )}
          </div>
        </div>
      </section>

      {/* Training areas */}
      {p.trainingAreas.length > 0 && (
        <section className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mb-10 text-start">
              <h2 className="text-3xl font-extrabold text-ink">{pick(locale, "مجالات ", "Training ")}<span className="text-brand">{pick(locale, "التدريب", "Areas")}</span></h2>
              {p.trainingIntro && <p className="mt-3 max-w-4xl text-sm text-ink-muted">{p.trainingIntro}</p>}
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {(() => { const icons = distinctIcons(p.trainingAreas.map((x) => x.title)); return p.trainingAreas.map((a, i) => (
                <div key={i} className="rounded-2xl border border-line bg-white p-6 text-start shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="flex shrink-0 flex-col items-center gap-1">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand">{icons[i]}</span>
                      <span className="text-[11px] font-semibold text-ink-soft">{String(i + 1).padStart(2, "0")}</span>
                    </div>
                    <h3 className="flex-1 text-base font-bold leading-7 text-ink">{a.title}</h3>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-ink-muted">{a.desc}</p>
                </div>
              )); })()}
            </div>
          </div>
        </section>
      )}

      {/* Application stations (youth only) */}
      {p.stations && p.stations.length > 0 && (
        <section className="bg-surface py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-extrabold text-ink">{pick(locale, "المحطات التطبيقية", "Applied Practical Stations")}</h2>
              {p.stationsIntro && <p className="mx-auto mt-3 max-w-3xl text-sm text-ink-muted">{p.stationsIntro}</p>}
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {p.stations.map((s) => (
                <div key={s} className="rounded-xl bg-gradient-to-bl from-brand to-brand-deep py-5 text-center text-sm font-bold text-white shadow-md transition-transform hover:scale-[1.03]">
                  {s}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="relative overflow-hidden bg-gradient-to-bl from-brand-deep to-[#0a2329]">
        <div className="relative mx-auto max-w-7xl px-6 py-14 text-center lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90">
            <span className="h-2 w-2 rounded-full bg-success" />
            {pick(locale, "خدمة العملاء متاحة على مدار الساعة", "Customer service available around the clock")}
          </span>
          <h2 className="mt-5 text-3xl font-extrabold text-white sm:text-4xl">{pick(locale, `هل ترغب في التسجيل ب${p.title} ؟`, `Would you like to enroll in ${p.title}?`)}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-white/75">{pick(locale, "يمكنك التواصل معنا لمساعدتك في اختيار البرنامج أو الخدمة الأنسب وفق احتياجات طفلك.", "Contact us and we will help you choose the program or service best suited to your child's needs.")}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/admission" className="rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark">{pick(locale, "طلب التحاق", "Apply Now")}</Link>
            <a href="https://wa.me/966561000274" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90">{pick(locale, "تواصل عبر الواتساب", "Contact via WhatsApp")}</a>
            <Link href="/branches" className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-surface">{pick(locale, "اعثر على أقرب فرع", "Find Nearest Branch")}</Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Chev() {
  return <svg className="dir-flip" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" /></svg>;
}

function InfoCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-line border-t-4 border-t-brand bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-start gap-3 border-b border-line pb-4">
        <h3 className="text-lg font-bold text-ink">{title}</h3>
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand">{icon}</span>
      </div>
      {children}
    </div>
  );
}

const bookIcon = <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>;
const clockIcon = <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" strokeLinecap="round" /></svg>;
const usersIcon = <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
