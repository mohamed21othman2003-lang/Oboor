import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CLINICAL_SERVICES, getClinicalService, type ClinicalBlock } from "@/lib/clinicalData";
import { areaIcon, distinctIcons } from "@/lib/areaIcon";
import { getLocale } from "@/i18n/locale";
import { pick } from "@/i18n/config";

export function generateStaticParams() {
  return CLINICAL_SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const s = getClinicalService(slug, locale);
  return {
    title: s ? pick(locale, `${s.title} | مركز عبور`, `${s.title} | Oboor Center`) : pick(locale, "خدمة عيادية | مركز عبور", "Clinical Service | Oboor Center"),
    description: s ? s.subtitle : pick(locale, "خدمة عيادية في مركز عبور للرعاية والتأهيل.", "A clinical service at Oboor Center for Care & Rehabilitation."),
  };
}

function Chev() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="dir-flip"><path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" /></svg>;
}
function Check({ className = "" }: { className?: string }) {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`shrink-0 ${className}`}><circle cx="12" cy="12" r="9" /><path d="M8.5 12l2.2 2.2L15.5 9.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function Block({ b }: { b: ClinicalBlock }) {
  if (b.kind === "agePrograms") {
    const chip = "rounded-lg bg-white/10 px-4 py-2 text-center text-xs font-medium text-white";
    return (
      <section className="bg-gradient-to-bl from-brand-deep to-[#0a2329] py-16 text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="mb-10 text-center text-3xl font-extrabold">{b.heading}</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {/* Adult */}
            <div className="flex flex-col items-center rounded-2xl border border-white/15 bg-white/5 p-7 text-center backdrop-blur">
              <h3 className="text-lg font-bold text-white">{b.adult.title}</h3>
              <p className="mt-1 text-sm text-white/70">{b.adult.sub}</p>
              <span className={`mt-4 ${chip}`}>{b.adult.label}</span>
            </div>
            {/* Child */}
            <div className="flex flex-col items-center rounded-2xl border border-white/15 bg-white/5 p-7 text-center backdrop-blur">
              <h3 className="text-lg font-bold text-white">{b.child.title}</h3>
              <p className="mt-1 text-sm text-white/70">{b.child.label}</p>
              <div className="mt-4 grid w-full max-w-xs grid-cols-2 gap-2">
                {b.child.levels.map((l) => <span key={l} className={chip}>{l}</span>)}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  if (b.kind === "cards" && b.dark) {
    return (
      <section className="bg-gradient-to-bl from-brand-deep to-[#0a2329] py-16 text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-extrabold">{b.heading}</h2>
            {b.intro && <p className="mx-auto mt-3 max-w-3xl text-sm leading-7 text-white/70">{b.intro}</p>}
          </div>
          <div className={`grid gap-5 sm:grid-cols-2 ${b.cols === 3 ? "lg:grid-cols-3" : ""}`}>
            {b.items.map((it, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-6 text-start backdrop-blur">
                <h3 className="text-lg font-bold text-white">{it.title}{it.sub && <span className="mr-2 text-sm font-medium text-brand"> {it.sub}</span>}</h3>
                {it.desc && <p className="mt-2 text-sm leading-7 text-white/75">{it.desc}</p>}
                {it.bullets && (
                  <ul className="mt-3 space-y-2">
                    {it.bullets.map((bl) => (
                      <li key={bl} className="flex items-start gap-2 text-sm leading-7 text-white/75">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                        <span>{bl}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {it.tags && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {it.tags.map((t) => <span key={t} className="rounded-full bg-brand/20 px-3 py-1 text-xs font-medium text-[#7ee8f0]">{t}</span>)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  if (b.kind === "cards") {
    const [first, ...rest] = b.heading.split(" ");
    return (
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-extrabold text-ink">{first} <span className="text-brand">{rest.join(" ")}</span></h2>
            {b.intro && <p className="mx-auto mt-3 max-w-3xl text-sm leading-7 text-ink-muted">{b.intro}</p>}
          </div>
          <div className={`grid gap-5 sm:grid-cols-2 ${b.cols === 4 ? "lg:grid-cols-4" : b.cols === 3 ? "lg:grid-cols-3" : ""}`}>
            {b.items.map((it, i) => (
              <div key={i} className="rounded-2xl border border-line bg-white p-6 text-start shadow-sm">
                <div className="mb-3 flex items-center justify-start gap-3">
                  <h3 className="text-base font-bold text-ink">{it.title}</h3>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">{areaIcon(it.title)}</span>
                </div>
                {it.desc && <p className="text-sm leading-7 text-ink-muted">{it.desc}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  if (b.kind === "pills") {
    const words = b.heading.split(" ");
    const last = words.pop();
    return (
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-extrabold text-ink">{words.join(" ")} <span className="text-brand">{last}</span></h2>
            {b.intro && <p className="mx-auto mt-3 max-w-3xl text-sm leading-7 text-ink-muted">{b.intro}</p>}
          </div>
          <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-3">
            {b.items.map((it) => (
              <span key={it} className="rounded-full bg-brand-deep px-5 py-2.5 text-sm font-medium text-white">{it}</span>
            ))}
          </div>
        </div>
      </section>
    );
  }
  if (b.kind === "prose") {
    const [first, ...rest] = b.heading.split(" ");
    return (
      <section className="bg-white pt-16">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <h2 className="text-3xl font-extrabold text-ink">{first} <span className="text-brand">{rest.join(" ")}</span></h2>
          {b.paragraphs.map((p, i) => <p key={i} className="mt-4 text-sm leading-8 text-ink-muted">{p}</p>)}
        </div>
      </section>
    );
  }
  if (b.kind === "tiles") {
    const colCls = b.cols === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3";
    if (b.dark) {
      return (
        <section className="bg-gradient-to-bl from-brand-deep to-[#0a2329] py-16 text-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <h2 className="mb-10 text-center text-3xl font-extrabold">{b.heading}</h2>
            <div className={`grid gap-5 sm:grid-cols-2 ${colCls}`}>
              {b.items.map((it) => (
                <div key={it} className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-sm leading-7 text-white/85 backdrop-blur">{it}</div>
              ))}
            </div>
          </div>
        </section>
      );
    }
    const [first, ...rest] = b.heading.split(" ");
    return (
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="mb-10 text-center text-3xl font-extrabold text-ink">{first} <span className="text-brand">{rest.join(" ")}</span></h2>
          <div className={`grid gap-5 sm:grid-cols-2 ${colCls}`}>
            {b.items.map((it) => (
              <div key={it} className="flex items-center justify-center rounded-2xl bg-brand-deep p-6 text-center text-sm font-semibold leading-7 text-white shadow-md">{it}</div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  if (b.kind === "checklist") {
    if (b.dark) {
      const [first, ...rest] = (b.heading || "").split(" ");
      const odd = b.items.length % 2 === 1;
      return (
        <section className="bg-gradient-to-bl from-brand-deep to-[#0a2329] py-16 text-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            {b.heading && <h2 className="mb-10 text-center text-3xl font-extrabold">{first} <span className="text-brand">{rest.join(" ")}</span></h2>}
            <ul className="grid gap-4 sm:grid-cols-2">
              {b.items.map((it, i) => (
                <li key={it} className={`flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 text-start text-sm leading-7 text-white/85 backdrop-blur ${odd && i === b.items.length - 1 ? "sm:col-span-2 sm:mx-auto sm:w-1/2" : ""}`}>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand/15 text-brand"><Check /></span>
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      );
    }
    return (
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {b.heading && <h2 className="mb-8 text-start text-3xl font-extrabold text-ink">{b.heading}</h2>}
          <ul className="grid gap-4 sm:grid-cols-2">
            {b.items.map((it) => (
              <li key={it} className="flex items-start gap-3 rounded-xl border border-line bg-surface p-4 text-start text-sm leading-7 text-ink-muted">
                <Check className="mt-1 text-brand" />
                <span>{it}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }
  // areas
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-10 text-start">
          <h2 className="text-3xl font-extrabold text-ink">{b.heading.trim().split(" ").slice(0, -1).join(" ")} <span className="text-brand">{b.heading.trim().split(" ").slice(-1)[0]}</span></h2>
          {b.intro && <p className="mt-3 max-w-4xl text-sm text-ink-muted">{b.intro}</p>}
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {(() => { const icons = distinctIcons(b.items.map((x) => x.title)); return b.items.map((a, i) => (
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
  );
}

export default async function ClinicalDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await getLocale();
  const s = getClinicalService(slug, locale);
  if (!s) notFound();

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-[#ebf7f9] to-white">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <nav className="mb-8 flex items-center justify-start gap-2 text-sm text-ink-soft">
            <span className="text-brand">{s.title}</span>
            <Chev />
            <Link href="/programs#clinical" className="hover:text-brand">{pick(locale, "الخدمات العيادية", "Clinical Services")}</Link>
            <Chev />
            <Link href="/programs" className="hover:text-brand">{pick(locale, "خدماتنا", "Services")}</Link>
            <Chev />
            <Link href="/" className="hover:text-brand">{pick(locale, "الرئيسية", "Home")}</Link>
          </nav>
          <div className="text-center">
            <span className="rounded-full bg-white px-4 py-1.5 text-sm font-medium text-brand-dark shadow-sm ring-1 ring-line">{pick(locale, "الخدمات العيادية", "Clinical Services")}</span>
            <h1 className="mt-5 text-3xl font-extrabold text-ink sm:text-4xl">{s.title}</h1>
            <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-ink-muted">{s.subtitle}</p>
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
              <Image src={s.image} alt={s.title} fill className="object-cover" />
            </div>
          </div>
          <div className="order-2 text-start">
            <h2 className="text-3xl font-extrabold text-ink">{s.aboutHeading}</h2>
            <div className="mt-6 space-y-4">
              {s.about.map((para, i) => <p key={i} className="text-sm leading-8 text-ink-muted">{para}</p>)}
            </div>
            {s.aboutList && (
              <ul className="mt-5 space-y-3">
                {s.aboutList.map((it) => (
                  <li key={it} className="flex items-start gap-2 text-sm leading-7 text-ink-muted">
                    <Check className="mt-1 text-brand" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            )}
            {s.aboutTag && (
              <div className="mt-6">
                <h3 className="mb-3 text-base font-bold text-ink">{s.aboutTag.heading}</h3>
                <span className="inline-block rounded-full bg-brand-deep px-5 py-2.5 text-sm font-medium text-white">{s.aboutTag.label}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {s.blocks.map((b, i) => <Block key={i} b={b} />)}

      {/* CTA */}
      <section className="relative overflow-hidden bg-gradient-to-bl from-brand-deep to-[#0a2329]">
        <div className="relative mx-auto max-w-7xl px-6 py-14 text-center lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90">
            <span className="h-2 w-2 rounded-full bg-success" />
            {pick(locale, "خدمة العملاء متاحة على مدار الساعة", "Customer service available around the clock")}
          </span>
          <h2 className="mt-5 text-3xl font-extrabold text-white sm:text-4xl">{pick(locale, "هل ترغب في تسجيل طفلك في ", "Would you like to enroll your child in ")}<span className="text-brand">{pick(locale, "خدمات عبور العيادية", "Oboor's Clinical Services")}</span>{pick(locale, " ؟", "?")}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-white/75">{pick(locale, "يمكنك التواصل معنا لمساعدتك في اختيار البرنامج أو الخدمة الأنسب وفق احتياجات طفلك.", "Get in touch and we'll help you choose the program or service that best fits your child's needs.")}</p>
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
