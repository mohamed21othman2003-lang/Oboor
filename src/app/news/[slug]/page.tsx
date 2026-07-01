import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ALL_NEWS, getNewsItem } from "@/lib/newsData";
import { fetchContent } from "@/lib/server/django";
import { getLocale } from "@/i18n/locale";
import { pick, type Locale } from "@/i18n/config";
import { formatDate, formatTime } from "@/lib/dateFormat";

export function generateStaticParams() {
  return ALL_NEWS.map((n) => ({ slug: n.slug }));
}

// الشكل اللي بيرجع من Django (content/news)
type ApiNews = {
  slug: string; section: string; title_ar: string; title_en: string;
  desc_ar: string; desc_en: string; category_ar: string; category_en: string;
  date_ar: string; date_en: string; image: string;
  body_ar: string[]; body_en: string[]; learn_ar: string[]; learn_en: string[];
  time_ar: string; time_en: string; location_ar: string; location_en: string;
  map_url: string;
  audience_ar: string; audience_en: string; seats_ar: string; seats_en: string;
  reg_status_ar: string; reg_status_en: string;
};

type NewsDetail = {
  title: string; desc: string; date: string; category: string; image: string;
  body: string[]; learn: string[];
  time: string; location: string; mapUrl: string; audience: string; seats: string; regStatus: string;
  isEvent: boolean; // فعالية/ورشة ⇒ يظهر كارت التفاصيل دائماً
};

// نصوص افتراضية (تُستخدم فقط عند تعذّر الوصول لـ Django)
const BODY_AR = [
  'تُنظّم مراكز عبور للتأهيل والرعاية فعالية متخصصة موجَّهة للأسر التي يُعاني أطفالها من صعوبات في التواصل والتفاعل. وتأتي هذه الفعالية في إطار الالتزام المستمر بتمكين الأسر وتزويدها بالأدوات العملية اللازمة لدعم أبنائها في البيئة المنزلية.',
  "تُقدَّم من قِبل نخبة من الأخصائيين المعتمدين في المراكز، وتتضمن عروضاً تقديمية تفاعلية، وأنشطة تطبيقية عملية، وجلسات نقاش مفتوحة تُتيح للمشاركين طرح الأسئلة والاستفسارات. كما تتضمن مواد مرجعية مطبوعة يحتفظ بها المشاركون بعد انتهائها.",
  "نُركّز على توفير بيئة تعليمية آمنة وداعمة، حيث يُشجَّع الآباء والأمهات على مشاركة تجاربهم وتساؤلاتهم. ويلتزم المدربون بتقديم المحتوى بأسلوب مُبسَّط وعملي يسهل تطبيقه في الحياة اليومية.",
  "في النهاية، سيتمكّن المشاركون من فهم المفاهيم الأساسية المتعلقة بالموضوع، واكتساب مهارات جديدة يمكن تطبيقها فوراً في المنزل، مما يُعزّز مسيرة التأهيل ويُسرّع من تحقيق الأهداف العلاجية.",
];
const BODY_EN = [
  "Oboor Centers for Care & Rehabilitation are hosting a specialized event for families whose children face difficulties with communication and interaction. This event reflects our ongoing commitment to empowering families and equipping them with the practical tools they need to support their children at home.",
  "It is delivered by a select group of the centers' certified specialists and includes interactive presentations, hands-on practical activities, and open discussion sessions that give participants the chance to ask questions. It also includes printed reference materials that participants keep afterward.",
  "We focus on providing a safe and supportive learning environment, where parents are encouraged to share their experiences and questions. Our trainers are committed to presenting the content in a simple, practical way that is easy to apply in everyday life.",
  "By the end, participants will understand the key concepts related to the topic and gain new skills they can apply at home right away, strengthening the rehabilitation journey and helping reach therapeutic goals faster.",
];
const LEARN_AR = [
  "فهم الأسس النظرية المتعلقة بالموضوع بشكل مُبسَّط وعملي",
  "اكتساب مهارات تطبيقية يمكن توظيفها مباشرةً في البيئة المنزلية",
  "التواصل مع أخصائيين متخصصين وطرح الأسئلة والاستفسارات",
  "الحصول على مواد مرجعية ومطبوعات تعليمية للاستخدام المنزلي",
];
const LEARN_EN = [
  "Understand the theoretical foundations of the topic in a simple, practical way",
  "Gain practical skills you can apply directly at home",
  "Connect with specialized professionals and ask your questions",
  "Receive reference materials and educational handouts for use at home",
];

// يجلب تفاصيل الخبر من Django (مصدر الحقيقة) مع fallback للبيانات الثابتة
async function loadNews(slug: string, locale: Locale): Promise<NewsDetail | null> {
  const en = locale === "en";
  const rows = await fetchContent<ApiNews[]>("news");
  const row = rows?.find((r) => r.slug === slug);
  if (row) {
    const s = (ar: string, e: string) => (en ? e || ar : ar);
    const a = (ar: string[], e: string[]) => (en ? (e?.length ? e : ar) : ar) ?? [];
    const body = a(row.body_ar, row.body_en);
    return {
      title: s(row.title_ar, row.title_en), desc: s(row.desc_ar, row.desc_en),
      date: formatDate(s(row.date_ar, row.date_en), locale), category: s(row.category_ar, row.category_en),
      image: row.image,
      // المتن أساسي: لو فاضي (مثلاً قبل تحديث الباك إند) نرجع للنص الافتراضي حتى لا تظهر الصفحة فارغة
      body: body.length ? body : (en ? BODY_EN : BODY_AR),
      learn: a(row.learn_ar, row.learn_en),
      time: formatTime(s(row.time_ar, row.time_en), locale), location: s(row.location_ar, row.location_en),
      mapUrl: row.map_url || "",
      audience: s(row.audience_ar, row.audience_en), seats: s(row.seats_ar, row.seats_en),
      regStatus: s(row.reg_status_ar, row.reg_status_en),
      isEvent: ["events", "workshops"].includes(row.section),
    };
  }
  // fallback: البيانات الثابتة + نصوص افتراضية
  const n = getNewsItem(slug, locale);
  if (!n) return null;
  return {
    title: n.title, desc: n.desc, date: n.date, category: n.category, image: n.image,
    body: en ? BODY_EN : BODY_AR, learn: en ? LEARN_EN : LEARN_AR,
    time: pick(locale, "٩:٠٠ صباحاً - ١٢:٠٠ ظهراً", "9:00 AM - 12:00 PM"),
    location: pick(locale, "قاعة التدريب الرئيسية - مركز عبور، الرياض", "Main Training Hall - Oboor Center, Riyadh"),
    mapUrl: "",
    audience: pick(locale, "أولياء الأمور والأسر", "Parents and families"),
    seats: pick(locale, "٢٠ مقعداً", "20 seats"),
    regStatus: pick(locale, "التسجيل مفتوح - مقاعد محدودة", "Registration open - limited seats"),
    isEvent: true,
  };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const n = getNewsItem(slug, locale);
  return { title: n ? `${n.title} | ${pick(locale, "مركز عبور", "Oboor Center")}` : pick(locale, "خبر | مركز عبور", "News | Oboor Center") };
}

function Chev() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="dir-flip"><path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" /></svg>;
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await getLocale();
  const n = await loadNews(slug, locale);
  if (!n) notFound();

  // صفوف كارت التفاصيل — تظهر فقط لو الحقل مُعبّأ
  const info: { icon: ReactNode; label: string; value: string; href?: string }[] = [
    { icon: <CalIcon />, label: pick(locale, "التاريخ", "Date"), value: n.date },
    { icon: <ClockIcon />, label: pick(locale, "الوقت", "Time"), value: n.time },
    { icon: <PinIcon />, label: pick(locale, "المكان", "Location"), value: n.location, href: n.mapUrl || undefined },
    { icon: <UsersIcon />, label: pick(locale, "الفئة المستهدفة", "Target Audience"), value: n.audience },
    { icon: <SeatIcon />, label: pick(locale, "عدد المقاعد", "Seats Available"), value: n.seats },
  ].filter((it) => it.value);
  // كارت الفعالية يظهر للفعاليات والورش (أو لأي عنصر عُبّئت له بيانات فعالية)
  const hasEvent = n.isEvent || Boolean(n.time || n.location || n.audience || n.seats || n.regStatus);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-[#ebf7f9] to-white">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <nav className="mb-6 flex items-center justify-start gap-2 text-sm text-ink-soft">
            <span className="text-brand">{n.category}</span>
            <Chev />
            <Link href="/news" className="hover:text-brand">{pick(locale, "إعلامنا", "News")}</Link>
            <Chev />
            <Link href="/" className="hover:text-brand">{pick(locale, "الرئيسية", "Home")}</Link>
          </nav>

          <div className="text-start">
            <div className="flex items-center justify-start gap-2">
              <span className="rounded-full border border-brand/40 px-3 py-1 text-[11px] font-bold text-brand">{n.category}</span>
              <span className="flex items-center gap-1.5 text-xs text-ink-soft"><CalIcon />{n.date}</span>
            </div>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-ink sm:text-4xl">{n.title}</h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-ink-muted">{n.desc}</p>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="bg-white pb-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Featured image — حجم متمركز (أوضح للصور صغيرة الدقة) + قص يُظهر الأشخاص في المنتصف */}
          <div className="relative mx-auto mb-10 aspect-[4/3] w-full max-w-3xl overflow-hidden rounded-3xl bg-surface shadow-lg">
            <Image src={n.image} alt={n.title} fill className="object-cover object-center" sizes="(max-width:768px) 100vw, 768px" priority />
          </div>

          <div className={hasEvent ? "grid gap-8 lg:grid-cols-[1fr_340px]" : ""}>
            {/* Main (right) */}
            <article className={`space-y-5 text-start ${hasEvent ? "order-2 lg:order-1" : "mx-auto max-w-4xl"}`}>
              {n.body.map((p, i) => <p key={i} className="text-sm leading-8 text-ink-muted">{p}</p>)}

              {hasEvent && n.learn.length > 0 && (
                <div className="rounded-2xl border border-line bg-surface/50 p-6">
                  <h2 className="text-lg font-extrabold text-ink">{pick(locale, "ما الذي ستتعلمه في هذه الفعالية؟", "What will you learn at this event?")}</h2>
                  <ul className="mt-4 space-y-3">
                    {n.learn.map((l) => (
                      <li key={l} className="flex items-start justify-start gap-2.5 text-sm leading-7 text-ink-muted">
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0 text-brand"><circle cx="12" cy="12" r="9" /><path d="M8.5 12l2.2 2.2L15.5 9.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        <span>{l}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </article>

            {/* Sidebar (left) — للفعاليات والورش فقط */}
            {hasEvent && (
            <aside className="order-1 lg:order-2">
              <div className="sticky top-6 overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
                <h3 className="bg-gradient-to-bl from-brand to-brand-dark px-5 py-4 text-center text-base font-bold text-white">{pick(locale, "تفاصيل الفعالية", "Event Details")}</h3>
                <div className="space-y-4 p-5">
                  {info.map((it) => (
                    <div key={it.label} className="flex items-start justify-start gap-3 text-start">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">{it.icon}</span>
                      <div>
                        <p className="text-xs text-ink-soft">{it.label}</p>
                        {it.href ? (
                          <a href={it.href} target="_blank" rel="noopener noreferrer"
                            className="group inline-flex items-center gap-1.5 text-sm font-semibold leading-6 text-brand transition-colors hover:text-brand-dark hover:underline">
                            <span>{it.value}</span>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 opacity-70 transition-opacity group-hover:opacity-100"><path d="M7 17L17 7M17 7H8M17 7v9" strokeLinecap="round" strokeLinejoin="round" /></svg>
                          </a>
                        ) : (
                          <p className="text-sm font-semibold leading-6 text-ink">{it.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                  {n.regStatus && (
                    <div className="flex items-center justify-center gap-2 rounded-xl bg-[#eef9fa] py-2.5 text-xs font-bold text-brand-dark">
                      <span className="h-2 w-2 rounded-full bg-success" />
                      {n.regStatus}
                    </div>
                  )}
                  <a href="https://wa.me/966920003452" target="_blank" rel="noopener noreferrer" className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark">
                    <PhoneIcon />
                    {pick(locale, "تواصل معنا للتسجيل", "Contact us to register")}
                  </a>
                </div>
              </div>
            </aside>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function CalIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>;
}
function ClockIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" strokeLinecap="round" /></svg>;
}
function PinIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>;
}
function UsersIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
}
function SeatIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3M5 18v2M19 18v2M4 9h16a1 1 0 0 1 1 1v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6a1 1 0 0 1 1-1z" /></svg>;
}
function PhoneIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" /></svg>;
}
