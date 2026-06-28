import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CLINICAL_SERVICES, getClinicalService, type ClinicalBlock, type ClinicalService } from "@/lib/clinicalData";
import { areaIcon, distinctIcons } from "@/lib/areaIcon";
import { getLocale } from "@/i18n/locale";
import { pick, type Locale } from "@/i18n/config";
import { fetchContent } from "@/lib/server/django";
import CtaSection from "@/components/CtaSection";

export function generateStaticParams() {
  return CLINICAL_SERVICES.map((s) => ({ slug: s.slug }));
}

// الشكل اللي بيرجع من Django (content/services)
type ApiService = {
  slug: string;
  title_ar: string; title_en: string;
  subtitle_ar: string; subtitle_en: string;
  about_heading_ar: string; about_heading_en: string;
  about_ar: string[]; about_en: string[];
  about_list_ar: string[]; about_list_en: string[];
  about_tag_ar: { heading: string; label: string } | null;
  about_tag_en: { heading: string; label: string } | null;
  blocks_ar: ClinicalBlock[]; blocks_en: ClinicalBlock[];
  image: string;
  order: number;
};

// لو القيمة بالإنجليزي موجودة وغير فاضية نستخدمها، وإلا نرجع للعربي
function biStr(en: boolean, ar: string, eng: string): string {
  return en && eng ? eng : ar;
}
function biArr<T>(en: boolean, ar: T[], eng: T[]): T[] {
  return en && eng && eng.length ? eng : (ar ?? []);
}
function biObj<T>(en: boolean, ar: T | null, eng: T | null): T | undefined {
  return (en && eng ? eng : ar) ?? undefined;
}

function toService(r: ApiService, locale: Locale): ClinicalService {
  const en = locale === "en";
  return {
    slug: r.slug,
    title: biStr(en, r.title_ar, r.title_en),
    subtitle: biStr(en, r.subtitle_ar, r.subtitle_en),
    image: r.image,
    aboutHeading: biStr(en, r.about_heading_ar, r.about_heading_en),
    about: biArr(en, r.about_ar, r.about_en),
    aboutTag: biObj(en, r.about_tag_ar, r.about_tag_en),
    aboutList: biArr(en, r.about_list_ar, r.about_list_en),
    blocks: biArr(en, r.blocks_ar, r.blocks_en),
  };
}

// نجلب من Django ونرجع للبيانات الثابتة لو فشل أو الـ slug مش موجود
async function loadService(slug: string, locale: Locale): Promise<ClinicalService | undefined> {
  const rows = await fetchContent<ApiService[]>("services");
  if (rows && rows.length) {
    const row = rows.find((r) => r.slug === slug);
    if (row) return toService(row, locale);
  }
  return getClinicalService(slug, locale);
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
    const chip = "rounded-lg bg-white px-4 py-2 text-center text-xs font-medium text-brand-dark";
    return (
      <section className="bg-gradient-to-bl from-[#0d3d45] via-[#13505b] to-[#123749] py-16 text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="mb-10 text-center text-3xl font-extrabold">{b.heading}</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {/* Adult */}
            <div className="flex flex-col items-center rounded-2xl border border-white/10 bg-gradient-to-br from-[#1c4e57] to-[#215d68] p-7 text-center">
              <h3 className="text-lg font-bold text-white">{b.adult.title}</h3>
              <p className="mt-1 text-sm text-white/70">{b.adult.sub}</p>
              <span className={`mt-4 ${chip}`}>{b.adult.label}</span>
            </div>
            {/* Child */}
            <div className="flex flex-col items-center rounded-2xl border border-white/10 bg-gradient-to-br from-[#1c4e57] to-[#215d68] p-7 text-center">
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
      <section className="bg-gradient-to-bl from-[#0d3d45] via-[#13505b] to-[#123749] py-16 text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-extrabold">{b.heading}</h2>
            {b.intro && <p className="mx-auto mt-3 max-w-3xl text-sm leading-7 text-white/70">{b.intro}</p>}
          </div>
          <div className={`grid gap-5 sm:grid-cols-2 ${b.cols === 3 ? "lg:grid-cols-3" : ""}`}>
            {b.items.map((it, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#1c4e57] to-[#215d68] p-6 text-start">
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
        <section className="bg-gradient-to-bl from-[#0d3d45] via-[#13505b] to-[#123749] py-16 text-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <h2 className="mb-10 text-center text-3xl font-extrabold">{b.heading}</h2>
            <div className={`grid gap-5 sm:grid-cols-2 ${colCls}`}>
              {b.items.map((it) => (
                <div key={it} className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#1c4e57] to-[#215d68] p-6 text-center text-sm leading-7 text-white/85">{it}</div>
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
              <div key={it} className="flex items-center justify-center rounded-2xl bg-gradient-to-b from-brand-dark to-brand-deep p-6 text-center text-sm font-semibold leading-7 text-white shadow-md">{it}</div>
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
        <section className="bg-gradient-to-bl from-[#0d3d45] via-[#13505b] to-[#123749] py-16 text-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            {b.heading && <h2 className="mb-10 text-center text-3xl font-extrabold">{first} <span className="text-brand">{rest.join(" ")}</span></h2>}
            <ul className="grid gap-4 sm:grid-cols-2">
              {b.items.map((it, i) => (
                <li key={it} className={`flex items-start gap-3 rounded-2xl border border-white/10 bg-gradient-to-br from-[#1c4e57] to-[#215d68] p-5 text-start text-sm leading-7 text-white/85 ${odd && i === b.items.length - 1 ? "sm:col-span-2 sm:mx-auto sm:w-1/2" : ""}`}>
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
  const s = await loadService(slug, locale);
  if (!s) notFound();

  // العنوان: أول كلمة بلون داكن وباقي العنوان باللون التركوازي (مطابقة للتصميم)
  const [titleFirst, ...titleRest] = s.title.split(" ");
  const [aboutFirst, ...aboutRest] = (s.aboutHeading || "").split(" ");

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
            <Link href="/programs" className="hover:text-brand">{pick(locale, "برامجنا التمكينية", "Services")}</Link>
            <Chev />
            <Link href="/" className="hover:text-brand">{pick(locale, "الرئيسية", "Home")}</Link>
          </nav>
          <div className="text-center">
            <span className="rounded-full bg-white px-4 py-1.5 text-sm font-medium text-brand-dark shadow-sm ring-1 ring-line">{pick(locale, "خدماتنا في المملكة", "Our Services in the Kingdom")}</span>
            <h1 className="mt-5 text-3xl font-extrabold text-ink sm:text-4xl">{titleFirst} <span className="text-brand">{titleRest.join(" ")}</span></h1>
            <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-ink-muted">{s.subtitle}</p>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="bg-white pb-12 pt-4">
        <div className="mx-auto grid max-w-7xl items-center gap-6 px-6 lg:grid-cols-2 lg:gap-4 lg:px-8">
          <div className="relative order-1 mx-auto aspect-[3/4] w-full max-w-sm lg:max-w-md">
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-2xl bg-brand/10" />
            <div className="absolute -bottom-4 left-8 h-20 w-20 rounded-full bg-brand/10" />
            <div className="relative h-full w-full overflow-hidden rounded-3xl shadow-lg">
              <Image src={s.image} alt={s.title} fill className="object-cover object-center" />
            </div>
          </div>
          <div className="order-2 text-start">
            <h2 className="text-3xl font-extrabold text-ink">{aboutFirst} <span className="text-brand">{aboutRest.join(" ")}</span></h2>
            <div className="mt-6 space-y-4">
              {s.about.map((para, i) => <p key={i} className="text-sm leading-8 text-ink-muted">{para}</p>)}
            </div>
            {s.aboutList && s.aboutList.length > 0 && (
              <ul className="mt-5 space-y-3">
                {s.aboutList.map((it) => (
                  <li key={it} className="flex items-start gap-2 text-sm leading-7 text-ink-muted">
                    <Check className="mt-1 text-brand" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            )}
            {s.aboutTag?.heading && (
              <div className="mt-6">
                <h3 className="mb-3 text-base font-bold text-ink">{s.aboutTag.heading}</h3>
                <span className="inline-block rounded-2xl bg-gradient-to-b from-brand-dark to-brand-deep px-8 py-3.5 text-sm font-semibold text-white shadow-md ring-1 ring-white/30">{s.aboutTag.label}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {s.blocks.map((b, i) => <Block key={i} b={b} />)}

      {/* CTA */}
      <CtaSection
        locale={locale}
        title={<>{pick(locale, "هل ترغب في تسجيل طفلك في ", "Would you like to enroll your child in ")}<span className="text-brand">{pick(locale, "خدمات عبور العيادية", "Oboor's Clinical Services")}</span>{pick(locale, " ؟", "?")}</>}
        subtitle={pick(locale, "يمكنك التواصل معنا لمساعدتك في اختيار البرنامج أو الخدمة الأنسب وفق احتياجات طفلك.", "Get in touch and we'll help you choose the program or service that best fits your child's needs.")}
      />
    </>
  );
}
