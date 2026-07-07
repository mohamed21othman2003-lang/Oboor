import Link from "next/link";
import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import BranchesMapSection from "@/components/BranchesMapSection";
import { loadBranches } from "@/lib/server/branches";
import { mapRegionsFrom, branchSelectOptions, type Branch } from "@/lib/branchesData";
import type { SelectOption } from "@/components/ui/Select";
import { CONTACT } from "@/lib/site";
import { fetchContent, fetchSections } from "@/lib/server/django";
import { getLocale } from "@/i18n/locale";
import { pick, type Locale } from "@/i18n/config";
import { hl } from "@/lib/highlight";

// النصوص القابلة للتحرير من الـCMS (page=contact) — تُبنى في ContactPage وتُمرَّر للأقسام.
type ContactCopy = {
  heroBadge: string; heroHeading: string; heroSub: string;
  infoMain: string;
  emailTitle: string; emailNote: string; customerTitle: string; customerNote: string; unifiedTitle: string; unifiedNote: string;
  formBadge: string; formMain: string; formNote: string;
  feat1Title: string; feat1Note: string; feat2Title: string; feat2Note: string; feat3Title: string; feat3Note: string;
  mapTitle: string; mapSub: string;
  socialTitle: string; socialSub: string;
};

// إعدادات الموقع من الـCMS (بيانات التواصل + روابط السوشيال)
type SiteInfo = { email: string; phone_unified: string; phone_customer: string; x_url: string; instagram_url: string; tiktok_url: string; youtube_url: string; snapchat_url: string };

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: pick(locale, "خذ الخطوة لعبور | مركز عبور", "Take the Step to Oboor | Oboor Center"),
    description: pick(
      locale,
      "تواصل مع مركز عبور للرعاية والتأهيل",
      "Get in touch with Oboor Center for Care & Rehabilitation",
    ),
  };
}

/* ---------- Hero ---------- */
function Hero({ locale, c }: { locale: Locale; c: ContactCopy }) {
  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-14 text-center sm:px-6 lg:px-8">
        <nav className="mb-6 flex items-center justify-center gap-2 text-sm text-ink-soft">
          <Link href="/" className="hover:text-brand">{pick(locale, "الرئيسية", "Home")}</Link>
          <span>/</span>
          <span className="text-brand">{pick(locale, "خذ الخطوة لعبور", "Take the Step to Oboor")}</span>
        </nav>
        <span className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-4 py-1.5 text-sm font-medium text-brand-dark">
          <span className="h-2 w-2 rounded-full bg-brand" />
          {c.heroBadge}
        </span>
        <h1 className="mt-5 text-4xl font-extrabold text-ink sm:text-5xl">{hl(c.heroHeading)}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-ink-muted">{c.heroSub}</p>
      </div>
    </section>
  );
}

/* ---------- Contact info cards ---------- */
type Card = { icon: React.ReactNode; title: string; value: string; note: string; cta: string; href: string };

function InfoCard({ icon, title, value, note, cta, href }: Card) {
  return (
    <a href={href} className="flex flex-col gap-4 rounded-2xl bg-gradient-to-bl from-brand to-brand-deep p-7 text-white shadow-lg transition-transform hover:-translate-y-1">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">{icon}</div>
      <div>
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="mt-1 text-sm text-white/70">{note}</p>
      </div>
      <p dir="ltr" className="text-start text-xl font-bold tracking-wide">{value}</p>
      <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-white/90">
        {cta}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="dir-flip">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
        </svg>
      </span>
    </a>
  );
}

function ContactCards({ locale, site, c }: { locale: Locale; site: SiteInfo | null; c: ContactCopy }) {
  const email = site?.email || CONTACT.email;
  const customer = site?.phone_customer || CONTACT.customerService;
  const unified = site?.phone_unified || CONTACT.unified;
  const mail = (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>
  );
  const phone = (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
  );
  const headset = (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 14v-2a9 9 0 0 1 18 0v2" /><rect x="2" y="14" width="5" height="6" rx="1.5" /><rect x="17" y="14" width="5" height="6" rx="1.5" /></svg>
  );

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h2 className="mb-8 text-center text-2xl font-bold text-ink">{c.infoMain}</h2>
      <div className="grid gap-6 md:grid-cols-3">
        <InfoCard icon={mail} title={c.emailTitle} note={c.emailNote} value={email} cta={pick(locale, "تواصل الآن", "Contact Now")} href={`mailto:${email}`} />
        <InfoCard icon={headset} title={c.customerTitle} note={c.customerNote} value={customer} cta={pick(locale, "اتصل الآن", "Call Now")} href={`tel:${customer}`} />
        <InfoCard icon={phone} title={c.unifiedTitle} note={c.unifiedNote} value={unified} cta={pick(locale, "اتصل الآن", "Call Now")} href={`tel:${unified}`} />
      </div>
    </section>
  );
}

/* ---------- Form section ---------- */
const clockIcon = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const clipboardIcon = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="8" y="3" width="8" height="4" rx="1" /><path d="M9 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3" /></svg>
);
const phoneIcon = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
);

function FeatureCard({ icon, title, note }: { icon: React.ReactNode; title: string; note: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-surface px-5 py-4">
      <div className="text-start">
        <h3 className="text-[15px] font-extrabold text-brand-deep">{title}</h3>
        <p className="mt-1 text-xs text-ink-muted">{note}</p>
      </div>
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e0eef0] text-brand">
        {icon}
      </div>
    </div>
  );
}

function FormSection({ locale, branches, c }: { locale: Locale; branches: SelectOption[]; c: ContactCopy }) {
  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-4 py-1.5 text-sm font-medium text-brand-dark">
            <span className="h-2 w-2 rounded-full bg-brand" />
            {c.formBadge}
          </span>
          <h2 className="mt-4 text-3xl font-extrabold text-ink">{c.formMain}</h2>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <FeatureCard icon={clockIcon} title={c.feat1Title} note={c.feat1Note} />
          <FeatureCard icon={clipboardIcon} title={c.feat2Title} note={c.feat2Note} />
          <FeatureCard icon={phoneIcon} title={c.feat3Title} note={c.feat3Note} />
        </div>

        <p className="mb-6 text-center text-sm text-ink-muted">{c.formNote}</p>

        <div className="mx-auto max-w-3xl">
          <ContactForm locale={locale} branches={branches} />
        </div>
      </div>
    </section>
  );
}

/* ---------- Branches map ---------- */
function BranchesSection({ locale, branches, regions, c }: { locale: Locale; branches: Branch[]; regions: { name: string; count: number; color: string }[]; c: ContactCopy }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 text-start">
        <h2 className="text-4xl font-extrabold text-ink">{c.mapTitle}</h2>
        <p className="mt-3 text-sm text-ink-muted">{c.mapSub}</p>
      </div>
      <BranchesMapSection locale={locale} branches={branches} regions={regions} />
    </section>
  );
}

/* ---------- Social CTA ---------- */
function SocialLink({ label, href, children }: { label: string; href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex w-full items-center justify-center rounded-xl bg-white/10 px-6 py-3 transition-colors hover:bg-white/20 sm:w-auto"
    >
      {/* المجموعة في المنتصف داخل صندوق ثابت العرض: الأيقونة وجنبها الكلمة،
          والصندوق متمركز → الأيقونات تتحاذى عموديًا عبر الأزرار */}
      <span dir="ltr" className="flex w-[150px] items-center justify-start gap-3 sm:justify-center">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15 text-white">
          {children}
        </span>
        <span className="text-sm font-bold uppercase text-white">{label}</span>
      </span>
    </a>
  );
}

function SocialSection({ site, c }: { locale: Locale; site: SiteInfo | null; c: ContactCopy }) {
  const ig = site?.instagram_url || "https://www.instagram.com/hdc_ksa";
  const tk = site?.tiktok_url || "https://www.tiktok.com/@hdc_ksa";
  const x = site?.x_url || "https://x.com/hdc_ksa";
  return (
    <section className="relative overflow-hidden bg-gradient-to-bl from-brand to-brand-deep">
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h2 className="text-4xl font-extrabold text-white">{c.socialTitle}</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-white/80">{c.socialSub}</p>
        <div className="mx-auto mt-8 flex max-w-md flex-col items-stretch justify-center gap-4 sm:max-w-none sm:flex-row sm:flex-wrap">
          <SocialLink label="Instagram" href={ig}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg>
          </SocialLink>
          <SocialLink label="Tik Tok" href={tk}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 3a5.5 5.5 0 0 0 4 4v3a8.5 8.5 0 0 1-4-1v6a6 6 0 1 1-6-6v3a3 3 0 1 0 3 3V3h3z" /></svg>
          </SocialLink>
          <SocialLink label="X" href={x}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2H21.5l-7.5 8.57L23 22h-6.594l-5.165-6.75L5.32 22H2.06l8.02-9.166L1 2h6.76l4.668 6.17L18.244 2zm-1.157 18h1.83L7.01 3.92H5.05L17.087 20z" /></svg>
          </SocialLink>
        </div>
      </div>
    </section>
  );
}

export default async function ContactPage() {
  const locale = await getLocale();
  const en = locale === "en";
  const [branches, site, sections] = await Promise.all([
    loadBranches(locale),
    fetchContent<SiteInfo>("site"),
    fetchSections("contact"),
  ]);
  const mapRegions = mapRegionsFrom(branches);

  const find = (block: string, key: string) => (sections?.[block] ?? []).find((r) => r.key === key);
  const T = (block: string, key: string, fb: string) => {
    const r = find(block, key);
    return (r ? (en ? r.title_en || r.title_ar : r.title_ar) : "") || fb;
  };
  const B = (block: string, key: string, fb: string) => {
    const r = find(block, key);
    return (r ? (en ? r.text_en || r.text_ar : r.text_ar) : "") || fb;
  };
  const c: ContactCopy = {
    heroBadge: T("hero", "badge", pick(locale, "معًا نُمهّد لهم الطريق، ليعبروا بأمان", "Together, We Pave the Way for Their Safe Journey")),
    heroHeading: T("hero", "heading", pick(locale, "خذ الخطوة **لعبور**", "Take the Step **to Oboor**")),
    heroSub: B("hero", "heading", pick(locale, "نسعد بتواصلك معنا للإجابة على استفساراتك والاستماع إليك.", "We are pleased to connect with you, answer your inquiries, and listen to your needs.")),
    infoMain: T("info", "main", pick(locale, "معلومات التواصل", "Contact Information")),
    emailTitle: T("info", "email", pick(locale, "البريد الإلكتروني", "Email")),
    emailNote: B("info", "email", pick(locale, "نرد خلال ٢٤ ساعة", "We reply within 24 hours")),
    customerTitle: T("info", "customer", pick(locale, "خدمة العملاء", "Customer Service")),
    customerNote: B("info", "customer", pick(locale, "للدعم والمتابعة", "For support & follow-up")),
    unifiedTitle: T("info", "unified", pick(locale, "الرقم الموحد", "Unified Number")),
    unifiedNote: B("info", "unified", pick(locale, "للاستفسارات العامة", "For general inquiries")),
    formBadge: T("form", "badge", pick(locale, "دائمًا بالقرب", "Always Close to You")),
    formMain: T("form", "main", pick(locale, "ارسل طلبك", "Send Your Request")),
    formNote: B("form", "note", pick(locale, "يرجى تعبئة النموذج التالي بدقة. سيتم مراجعة طلبك والرد عليك في أقرب وقت ممكن", "Please fill out the form below carefully. We'll review your request and reply as soon as possible.")),
    feat1Title: T("form", "feat1", pick(locale, "رسالتك تصلنا", "Your message will reach us")),
    feat1Note: B("form", "feat1", pick(locale, "سنكون على تواصل معك خلال يوم واحد.", "We will respond within one day.")),
    feat2Title: T("form", "feat2", pick(locale, "تقييم مبدئي مجاني", "Free initial assessment")),
    feat2Note: B("form", "feat2", pick(locale, "نمنحك النظرة الأولى عن قدرات طفلك.", "Offering an early insight into your child's abilities.")),
    feat3Title: T("form", "feat3", pick(locale, "استشارة متخصصة", "Specialized consultation")),
    feat3Note: B("form", "feat3", pick(locale, "خبراؤنا هنا للإجابة عن كل أسئلتك.", "Our experts are here to answer all your questions.")),
    mapTitle: T("map", "main", pick(locale, "مراكزنا", "Our Branches")),
    mapSub: B("map", "main", pick(locale, "اضغط على الخريطة أو اختر الفرع من القائمة لعرض تفاصيله.", "Click the map or pick a branch from the list to view its details.")),
    socialTitle: T("social", "main", pick(locale, "تابعنا", "Follow Us")),
    socialSub: B("social", "main", pick(locale, "تواصل مع خدمة العملاء وسنساعدك في اختيار الفرع الأنسب لطفلك", "Contact customer service and we'll help you choose the best branch for your child.")),
  };

  return (
    <>
      <Hero locale={locale} c={c} />
      <ContactCards locale={locale} site={site} c={c} />
      <FormSection locale={locale} branches={branchSelectOptions(branches)} c={c} />
      <BranchesSection locale={locale} branches={branches} regions={mapRegions} c={c} />
      <SocialSection locale={locale} site={site} c={c} />
    </>
  );
}
