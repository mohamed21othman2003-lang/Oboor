import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { getSpecialists } from "@/lib/specialistsData";
import { REGION_BRANCHES, REGION_BRANCHES_EN, type Branch } from "@/lib/branchesData";
import { loadBranches } from "@/lib/server/branches";
import { fetchSections, fetchContent } from "@/lib/server/django";
import { CMS_ICONS } from "@/lib/cms/icons";
import { getLocale } from "@/i18n/locale";
import { pick, type Locale } from "@/i18n/config";

// الأخصائيون كما يرجع من Django
type ApiSpec = { slug: string; name_ar: string; name_en: string; specialty_ar: string; specialty_en: string; desc_ar: string; desc_en: string; image: string };

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return pageMeta(
    pick(locale, "عن عبور | مركز عبور للرعاية والتأهيل", "About Us | Oboor Center for Care & Rehabilitation"),
    pick(
      locale,
      "تأسست مراكز عبور عام ٢٠٠٧ كأكبر سلسلة مراكز متخصصة في التشخيص والتقييم والتأهيل للأشخاص ذوي الإعاقة.",
      "Founded in 2007, Oboor Centers are the largest chain specialized in the diagnosis, assessment and rehabilitation of people with disabilities."
    ),
  );
}

function Chev() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="dir-flip"><path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" /></svg>;
}
function TagLine({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm font-bold text-brand">
      <span className="inline-block h-0.5 w-6 rounded-full bg-brand" />
      {children}
    </span>
  );
}

const PROGRAMS = [
  { title: "علاج النطق والتخاطب", title_en: "Speech & Language Therapy", desc: "برامج متخصصة لتطوير مهارات التواصل والنطق واللغة، وعلاج اضطرابات النطق المختلفة، ووضع خطط علاجية فردية لكل حالة.", desc_en: "Specialized programs to develop communication, speech and language skills, treat various speech disorders, and design an individual treatment plan for each case.", icon: "chat" },
  { title: "العلاج الطبيعي", title_en: "Physical Therapy", desc: "جلسات علاجية تُعنى بتحسين الوظائف الحركية، وتنمية المهارات الحسية، وإعادة التأهيل الحركي بأساليب علمية حديثة.", desc_en: "Therapy sessions focused on improving motor function, developing sensory skills, and motor rehabilitation using modern, evidence-based methods.", icon: "activity" },
  { title: "العلاج الوظيفي", title_en: "Occupational Therapy", desc: "يُركز على تطوير مهارات الحياة اليومية والحركات الدقيقة، لتعزيز الاستقلالية والاندماج الوظيفي والمجتمعي.", desc_en: "Focuses on developing daily living skills and fine motor skills to enhance independence and functional and social integration.", icon: "hand" },
  { title: "العلاج النفسي", title_en: "Psychological Services", desc: "دعم نفسي متخصص للأشخاص ذوي الإعاقة وأسرهم، يشمل التقييم والإرشاد، ووضع خطط دعم سلوكية شاملة.", desc_en: "Specialized psychological support for people with disabilities and their families, including assessment, counseling, and comprehensive behavioral support plans.", icon: "brain" },
  { title: "العلاج الاجتماعي", title_en: "Social Services", desc: "برامج تُعزز مهارات التواصل الاجتماعي والاندماج المجتمعي، وتُسهم في بناء شبكة دعم متينة للفرد وأسرته.", desc_en: "Programs that strengthen social communication skills and community integration, helping build a strong support network for the individual and their family.", icon: "users" },
];

// ترتيب العرض كما في الديزاين
const SMALL_BRANCH_SLUGS = ["kharj", "wadi-dawasir", "qassim", "majmaah", "sharqia", "jouf", "madinah", "taif", "aseer"];

export default async function AboutPage() {
  const locale = await getLocale();
  const en = locale === "en";
  // الفروع والأخصائيون من الـCMS (مع fallback للبيانات الثابتة)
  const staticBranches = locale === "en" ? REGION_BRANCHES_EN : REGION_BRANCHES;
  // طلبات الـCMS بالتوازي (تقليل زمن الاستجابة/TTFB)
  const [cmsBranches, specRows, about] = await Promise.all([
    loadBranches(locale),
    fetchContent<ApiSpec[]>("specialists"),
    fetchSections("about"),
  ]);
  const SMALL_BRANCHES = SMALL_BRANCH_SLUGS
    .map((s) => cmsBranches.find((b) => b.slug === s) ?? staticBranches.find((b) => b.slug === s))
    .filter(Boolean) as Branch[];
  const specialists = specRows?.length
    ? specRows.map((r) => ({ slug: r.slug, name: en ? r.name_en || r.name_ar : r.name_ar, specialty: en ? r.specialty_en || r.specialty_ar : r.specialty_ar, desc: en ? r.desc_en || r.desc_ar : r.desc_ar, image: r.image }))
    : getSpecialists(locale);

  // نصوص الصفحة من الـCMS (أقسام صفحة about) مع fallback للنص الحالي.
  // نختار عنصر العنوان الخاص بالقسم (key = about-<block>) لأن بعض الأقسام (مثل الفروع)
  // تحوي أكثر من عنصر، فلا يصح الاكتفاء بأول عنصر.
  const blk = (b: string) => about?.[b]?.find((r) => r.key === `about-${b}`) ?? about?.[b]?.[0];
  const aTitle = (b: string, ar: string, e: string) => { const r = blk(b); const v = r && (en ? r.title_en || r.title_ar : r.title_ar); return v || pick(locale, ar, e); };
  const aText = (b: string, ar: string, e: string) => { const r = blk(b); const v = r && (en ? r.text_en || r.text_ar : r.text_ar); return v || pick(locale, ar, e); };
  const aList = (b: string, ar: string[], e: string[]) => { const r = blk(b); const d = r && (en ? r.data_en : r.data_ar) as unknown; const arr = Array.isArray(d) ? (d as string[]) : []; return arr.length ? arr : (en ? e : ar); };
  // صورة القسم من الـCMS (حقل الصورة) مع fallback للصورة الثابتة
  const aImage = (b: string, fallback: string) => { const r = blk(b); const v = String(r?.image ?? "").trim(); return v || fallback; };

  // كارت الفرع الرئيسي في قسم «نبذة عن الفروع» (من الـCMS مع fallback)
  const mainCard = (about?.branches ?? []).find((r) => r.key === "main_card");
  const mcCity = mainCard ? (en ? mainCard.title_en || mainCard.title_ar : mainCard.title_ar) : pick(locale, "الرياض", "Riyadh");
  const mcRegion = mainCard ? (en ? mainCard.text_en || mainCard.text_ar : mainCard.text_ar) : pick(locale, "منطقة الرياض — ٣ فروع", "Riyadh Region — 3 branches");
  const mcDistrictsRaw = mainCard ? ((en ? mainCard.data_en : mainCard.data_ar) as unknown) : null;
  const mcDistricts = Array.isArray(mcDistrictsRaw) && mcDistrictsRaw.length ? (mcDistrictsRaw as string[]) : pick(locale, ["حي العليا", "حي النرجس", "حي الصحافة"], ["Al-Olaya District", "Al-Narjes District", "Al-Sahafa District"]);
  const mcPhone = mainCard?.value || "920-000-001";

  // قائمة البرامج: عناصر قسم «البرامج» التي لها أيقونة (العنوان بلا أيقونة) — مع fallback ثابت
  const progRows = (about?.programs ?? []).filter((r) => r.icon);
  const programItems = progRows.length
    ? progRows.map((r) => ({ icon: r.icon, title: en ? r.title_en || r.title_ar : r.title_ar, desc: en ? r.text_en || r.text_ar : r.text_ar }))
    : PROGRAMS.map((p) => ({ icon: p.icon, title: en ? p.title_en : p.title, desc: en ? p.desc_en : p.desc }));

  return (
    <>
      {/* Hero */}
      <section className="overflow-hidden bg-gradient-to-b from-[#ebf7f9] to-white">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <nav className="mb-8 flex items-center justify-start gap-2 text-sm text-ink-soft">
            <span className="text-brand">{pick(locale, "عن عبور", "About Us")}</span>
            <Chev />
            <Link href="/" className="hover:text-brand">{pick(locale, "الرئيسية", "Home")}</Link>
          </nav>

          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Image (right) — صورة نظيفة بدون بطاقات مطبوعة؛ الشارتان بطاقات HTML صغيرة ثنائية اللغة */}
            <div className="relative order-1 mx-auto w-full max-w-[480px]">
              {/* الصورة النظيفة (بدون الكارت المطبوع) على مسار جديد لتفادي كاش الصورة القديمة */}
              <Image src={((h) => !h || h.includes("about-hero") ? "/about-hero-v2.png" : h)(blk("hero")?.image)} alt={pick(locale, "مركز عبور للرعاية والتأهيل", "Oboor Center for Care & Rehabilitation")} width={511} height={560} className="h-auto w-full" quality={90} priority />
              {/* شارة «تأهيل شامل» — أعلى يمين */}
              <StatBadge className="right-[3%] top-[5%] w-[54%] max-w-[248px] px-3.5 py-2.5" iconClassName="h-5 w-5" iconSize={12} label={pick(locale, "برامج متخصصة", "Specialized Programs")} value={pick(locale, "تأهيل شامل ومتكامل", "Comprehensive Rehabilitation")} />
              {/* شارة «تأسس عام» — أسفل يسار، ضيّقة حتى لا تتلامس مع الأولى */}
              <StatBadge className="left-[3%] top-[21%] w-[37%] max-w-[176px] px-3.5 py-2.5" valueClassName="text-lg sm:text-xl" iconClassName="h-5 w-5" iconSize={12} label={pick(locale, "تأسّس عام", "Established")} value={pick(locale, "٢٠٠٧", "2007")} />
            </div>

            {/* Text (left) */}
            <div className="order-2 text-start">
              <TagLine>{aTitle("hero", "منذ عام ٢٠٠٧ — رائدون في التأهيل والرعاية", "Since 2007 — pioneers in rehabilitation and care")}</TagLine>
              <h1 className="mt-4 text-4xl font-extrabold text-ink sm:text-5xl">{pick(locale, <>عن <span className="text-brand">عبور</span></>, <>About <span className="text-brand">Oboor</span></>)}</h1>
              <p className="mt-5 text-base leading-8 text-ink-muted">
                {aText("hero", "تأسست مراكز عبور عام ٢٠٠٧، وأصبحت اليوم من أكبر سلاسل المراكز المتخصصة في التشخيص والتقييم والتأهيل والتعليم للأشخاص ذوي الإعاقة في المملكة العربية السعودية، عبر شبكة فروع ممتدة وكوادر متخصصة رفيعة المستوى.", "Founded in 2007, Oboor Centers have grown into one of the largest chains specialized in the diagnosis, assessment, rehabilitation and education of people with disabilities in Saudi Arabia, through an extensive network of branches and highly qualified specialists.")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About intro */}
      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2 lg:px-8">
          {/* Text (right) */}
          <div className="order-2 text-start lg:order-1">
            <TagLine>{pick(locale, "تعرّف علينا", "Get to know us")}</TagLine>
            <h2 className="mt-4 text-3xl font-extrabold text-ink">{aTitle("intro", "تعرّف على مركز عبور", "Get to know Oboor Center")}</h2>
            <div className="mt-5 space-y-4 text-sm leading-8 text-ink-muted">
              {aList("intro",
                ["تأسست مراكز عبور عام ٢٠٠٧ كأكبر سلسلة مراكز متخصصة في تقديم وتطوير خدمات التشخيص والتقييم والتأهيل والتعليم للأشخاص ذوي الإعاقة في المملكة العربية السعودية.", "نهدف إلى تمكين الأشخاص ذوي الإعاقة من حياة أكثر جودة واستقلالية من خلال منظومة متكاملة من البرامج التأهيلية والتعليمية وكوادر بشرية مؤهلة وبيئات علاجية مجهزة بأحدث التقنيات.", "تمتد خدماتنا عبر شبكة فروع واسعة تغطي مناطق رئيسية في المملكة، مما يُمكّن الأسر من الوصول إلى الرعاية المتخصصة بيسر وسهولة وضمان الاستمرارية في مسيرة التأهيل."],
                ["Oboor Centers were founded in 2007 as the largest chain specialized in providing and developing diagnosis, assessment, rehabilitation and education services for people with disabilities in Saudi Arabia.", "We aim to empower people with disabilities to live with greater quality and independence through an integrated system of rehabilitation and educational programs, qualified staff, and therapeutic environments equipped with the latest technologies.", "Our services extend across a wide network of branches covering major regions of the Kingdom, enabling families to access specialized care easily and ensuring continuity throughout the rehabilitation journey."],
              ).map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>
          {/* Image (left) */}
          <div className="relative order-1 h-[420px] lg:order-2">
            <div className="relative h-full w-full overflow-hidden rounded-3xl shadow-lg">
              <Image src={aImage("intro", "/figma/about/intro.jpg")} alt={pick(locale, "جلسة تأهيل", "Rehabilitation session")} fill className="object-cover" sizes="(max-width:1024px) 100vw, 50vw" quality={90} />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-surface py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-12 text-center">
            <span className="inline-flex items-center gap-2 text-sm font-bold text-brand">
              <span className="inline-block h-0.5 w-6 rounded-full bg-brand" />
              {pick(locale, "توجهاتنا الاستراتيجية", "Our strategic direction")}
              <span className="inline-block h-0.5 w-6 rounded-full bg-brand" />
            </span>
            <h2 className="mt-3 text-3xl font-extrabold text-ink sm:text-4xl">{pick(locale, "رسالتنا ورؤيتنا", "Our Mission & Vision")}</h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {/* رسالتنا (dark, right) */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-bl from-brand-deep to-[#0a2329] p-8 text-start text-white">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/20 text-brand"><TargetIcon /></span>
              <p className="mt-4 text-sm text-brand">{pick(locale, "رسالتنا", "Our Mission")}</p>
              <h3 className="mt-1 text-xl font-extrabold">{aTitle("mission", "تحسين نوعية الحياة والاندماج الفعّال", "Improving quality of life and meaningful integration")}</h3>
              <p className="mt-3 text-sm leading-8 text-white/75">{aText("mission", "تحسين نوعية حياة الأشخاص من ذوي الإعاقة وأسرهم، ودمجهم الفعّال في المجتمع، من خلال برامج تأهيلية وتعليمية مبنية على أسس علمية وممارسات مهنية عالية الجودة.", "Improving the quality of life of people with disabilities and their families and integrating them meaningfully into society, through rehabilitation and educational programs built on scientific foundations and high-quality professional practices.")}</p>
              <Link href="/programs" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark">{pick(locale, "عرض الخدمات", "View Services")}<Chev /></Link>
            </div>
            {/* رؤيتنا (light, left) */}
            <div className="relative overflow-hidden rounded-3xl bg-[#e8f7f9] p-8 text-start">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-brand shadow-sm"><EyeIcon /></span>
              <p className="mt-4 text-sm text-brand-dark">{pick(locale, "رؤيتنا", "Our Vision")}</p>
              <h3 className="mt-1 text-xl font-extrabold text-ink">{aTitle("vision", "الكيان الرائد والمرجعي", "The leading, reference entity")}</h3>
              <p className="mt-3 text-sm leading-8 text-ink-muted">{aText("vision", "أن نكون الكيان الرائد والمرجعي في تقديم الخدمات المتكاملة والمستدامة للأشخاص ذوي الإعاقة وأسرهم على مستوى المملكة والمنطقة.", "To be the leading, reference entity in providing integrated and sustainable services for people with disabilities and their families across the Kingdom and the region.")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div className="text-start">
              <h2 className="text-3xl font-extrabold text-ink">{aTitle("programs", "نبذة عن البرامج", "About our programs")}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-ink-muted">{aText("programs", "نعتمد في مراكز عبور منهجية علمية متكاملة مدعومة بأحدث التقنيات والبيئات العلاجية المتخصصة لضمان أفضل نتائج تأهيلية ممكنة لكل حالة.", "At Oboor Centers we follow an integrated, evidence-based methodology supported by the latest technologies and specialized therapeutic environments to ensure the best possible rehabilitation outcomes for each case.")}</p>
            </div>
            <Link href="/programs" className="flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark">{pick(locale, "عرض الخدمات", "View Services")}<Chev /></Link>
          </div>

          <div className="grid items-center gap-10 lg:grid-cols-2">
            {/* List (right) */}
            <div className="order-2 space-y-3 lg:order-1">
              {programItems.map((p, i) => (
                <div key={i} className="flex items-start gap-4 rounded-2xl border border-line bg-white p-4 text-start shadow-sm">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">{CMS_ICONS[p.icon] ?? CMS_ICONS.heart}</span>
                  <div>
                    <h3 className="text-base font-bold text-ink">{p.title}</h3>
                    <p className="mt-1 text-xs leading-6 text-ink-muted">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Image (left) */}
            <div className="relative order-1 h-[480px] lg:order-2">
              <div className="relative h-full w-full overflow-hidden rounded-3xl shadow-lg">
                <Image src={aImage("programs", "/figma/about/programs.jpg")} alt={pick(locale, "برامج عبور", "Oboor programs")} fill className="object-cover" sizes="(max-width:1024px) 100vw, 50vw" quality={90} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specialists */}
      <section className="bg-surface py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-10 text-start">
            <h2 className="text-3xl font-extrabold text-ink">{aTitle("specialists", "نبذة عن الأخصائيين", "About our specialists")}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-ink-muted">{aText("specialists", "يضمّ مركز عبور نخبة من الأخصائيين والاستشاريين المؤهلين والحاصلين على اعتمادات دولية في مختلف مجالات التأهيل.", "Oboor Center brings together a select team of qualified specialists and consultants holding international accreditations across various fields of rehabilitation.")}</p>
          </div>
          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {specialists.slice(0, 3).map((s) => (
              <article key={s.slug} className="flex flex-col overflow-hidden rounded-[18px] border border-line bg-white">
                <div className="relative h-[240px] w-full bg-[#f3f5f6]">
                  <Image src={s.image} alt={s.name} fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
                </div>
                <div className="flex flex-1 flex-col gap-3 p-5">
                  <div className="flex justify-start">
                    <span className="rounded-full bg-[#e8f7f8] px-3 py-1 text-xs font-semibold text-[#1a9aa5]">{s.specialty}</span>
                  </div>
                  <h3 className="text-start text-lg font-bold text-ink">{s.name}</h3>
                  <p className="text-start text-sm leading-7 text-ink-muted">{s.desc}</p>
                  <Link href="/specialists" className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-[14px] bg-brand py-2.5 text-xs font-semibold text-white transition-colors hover:bg-brand-dark">{pick(locale, "عرض التفاصيل", "View Details")}</Link>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Link href="/specialists" className="rounded-2xl border-2 border-brand px-12 py-3 text-sm font-semibold text-brand transition-colors hover:bg-brand hover:text-white">{pick(locale, "عرض الكل", "View All")}</Link>
          </div>
        </div>
      </section>

      {/* Branches */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div className="text-start">
              <TagLine>{pick(locale, "حضور واسع في المملكة", "A wide presence across the Kingdom")}</TagLine>
              <h2 className="mt-3 text-3xl font-extrabold text-ink">{aTitle("branches", "نبذة عن الفروع", "About our branches")}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-ink-muted">{aText("branches", "تمتد مراكز عبور عبر أكثر من ١١ مدينة رئيسية في المملكة العربية السعودية، لضمان وصول خدماتنا المتخصصة إلى الأسر أينما كانت، مع الحفاظ على نفس مستوى الجودة والتميّز في كل موقع.", "Oboor Centers span more than 11 major cities across Saudi Arabia, ensuring our specialized services reach families wherever they are, while maintaining the same level of quality and excellence at every location.")}</p>
            </div>
            <Link href="/branches" className="flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark">{pick(locale, "استعرض الفروع", "Browse Branches")}<Chev /></Link>
          </div>

          <div className="grid gap-4 lg:grid-cols-4">
            {/* Main branch (dark, right) */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-bl from-brand-deep to-[#0a2329] p-6 text-start text-white lg:order-1 lg:row-span-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/20 px-3 py-1 text-xs font-bold text-brand"><PinIcon />{pick(locale, "الفرع الرئيسي", "Main Branch")}</span>
              <h3 className="mt-4 text-3xl font-extrabold">{mcCity}</h3>
              <p className="mt-1 text-sm text-white/70">{mcRegion}</p>
              <ul className="mt-5 space-y-2 text-sm text-white/85">
                {mcDistricts.map((d) => (
                  <li key={d} className="flex items-center justify-start gap-2"><span className="h-1.5 w-1.5 rounded-full bg-brand" />{d}</li>
                ))}
              </ul>
              <div className="mt-5 flex items-center justify-start gap-2 border-t border-white/10 pt-4 text-sm text-white/80" dir="ltr">
                <PhoneIcon />{mcPhone}
              </div>
            </div>

            {/* Small branches */}
            {SMALL_BRANCHES.map((b) => (
              <div key={b.slug} className="rounded-2xl border border-line bg-white p-5 text-start shadow-sm lg:order-2">
                <p className="flex items-center justify-start gap-1.5 text-xs text-ink-soft"><PinIcon />{b.region}</p>
                <h3 className="mt-1.5 text-lg font-bold text-ink">{b.city}</h3>
                <Link href={`/branches/${b.slug}`} className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand hover:text-brand-dark">{pick(locale, "عرض الفرع", "View Branch")}<Chev /></Link>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl bg-[#e8f7f9] p-5 sm:flex-row">
            <div className="flex items-center gap-3 text-start">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand text-white"><PinIcon /></span>
              <div>
                <p className="text-base font-bold text-ink">{aTitle("cta", "نتوسع باستمرار لخدمتكم في كل منطقة", "We keep expanding to serve you in every region")}</p>
                <p className="mt-0.5 text-sm text-ink-muted">{aText("cta", "هل تبحث عن فرع قريب منك؟ تواصل معنا لمعرفة أقرب مركز إلى موقعك.", "Looking for a branch near you? Contact us to find the nearest center to your location.")}</p>
              </div>
            </div>
            <Link href="/contact" className="flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark">{pick(locale, "خذ الخطوة لعبور", "Take the Step to Oboor")}<Chev /></Link>
          </div>
        </div>
      </section>
    </>
  );
}


function EyeIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></svg>;
}
function TargetIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></svg>;
}
function PinIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>;
}
function PhoneIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" /></svg>;
}
function CalendarIcon({ size = 14 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18M9 16l2 2 4-4" /></svg>;
}
// شارة عائمة فوق صورة الـhero (ثنائية اللغة، تغطي النص المطبوع بالصورة)
function StatBadge({ label, value, className, valueClassName, iconClassName, iconSize }: { label: string; value: string; className?: string; valueClassName?: string; iconClassName?: string; iconSize?: number }) {
  return (
    <div className={`absolute z-10 flex items-center justify-between gap-2 rounded-2xl bg-white text-start shadow-lg ${className || "px-3.5 py-2.5"}`}>
      <div className="min-w-0">
        <p className="text-[10px] leading-tight text-ink-soft">{label}</p>
        <p className={`font-extrabold leading-tight text-ink ${valueClassName || "text-sm sm:text-base"}`}>{value}</p>
      </div>
      <span className={`flex shrink-0 items-center justify-center rounded-md bg-brand/10 text-brand ${iconClassName || "h-6 w-6"}`}><CalendarIcon size={iconSize} /></span>
    </div>
  );
}
