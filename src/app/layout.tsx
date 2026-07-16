import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import SiteChrome, { type SiteChromeData } from "@/components/SiteChrome";
import PreviewBanner from "@/components/PreviewBanner";
import { getLocale, dirOf } from "@/i18n/locale";
import { fetchContent, fetchSections, type SectionRow } from "@/lib/server/django";
import { NAV_LINKS, CONTACT, waUrl } from "@/lib/site";
import { getCommon } from "@/i18n/dict/common";
import { GoogleAnalytics } from "@next/third-parties/google";

type SiteSettings = {
  logo_url?: string;
  email?: string;
  phone_unified?: string;
  whatsapp?: string;
  main_branch_ar?: string; main_branch_en?: string;
  brand_desc_ar?: string; brand_desc_en?: string;
  cta_admission_ar?: string; cta_admission_en?: string;
  cta_contact_ar?: string; cta_contact_en?: string;
  footer_quick_title_ar?: string; footer_quick_title_en?: string;
  footer_services_title_ar?: string; footer_services_title_en?: string;
  footer_contact_title_ar?: string; footer_contact_title_en?: string;
  privacy_label_ar?: string; privacy_label_en?: string;
  copyright_ar?: string; copyright_en?: string;
};

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://oboor.ido.sa";
// معرّف Google Analytics (GA4). عام بطبيعته (يظهر في HTML). يُفعَّل في الإنتاج فقط.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-0LHKZ941HL";
const GA_ENABLED = process.env.NODE_ENV === "production" && GA_ID !== "G-XXXXXXXXXX";
const SITE_DESC =
  "مركز عبور للرعاية النهارية والتأهيل — برامج تأهيلية وخدمات عيادية متخصصة لذوي الإعاقة والأطفال ذوي الاحتياجات: التدخل المبكر، النطق والتخاطب، العلاج الوظيفي والطبيعي، عبر فروعنا في أنحاء المملكة.";
const OG_IMAGE = "/figma/home/imgImageWithFallback.jpg";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "عبور | Oboor للرعاية والتأهيل", template: "%s | عبور" },
  description: SITE_DESC,
  applicationName: "عبور",
  keywords: [
    "عبور", "مركز عبور", "التأهيل", "الرعاية النهارية", "التدخل المبكر",
    "النطق والتخاطب", "العلاج الوظيفي", "العلاج الطبيعي", "ذوي الإعاقة",
    "الأطفال ذوي الاحتياجات", "السعودية", "Oboor",
  ],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "عبور | Oboor",
    title: "عبور | Oboor للرعاية والتأهيل",
    description: SITE_DESC,
    url: SITE_URL,
    locale: "ar_SA",
    images: [{ url: OG_IMAGE, alt: "مركز عبور للرعاية والتأهيل" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "عبور | Oboor للرعاية والتأهيل",
    description: SITE_DESC,
    images: [OG_IMAGE],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const en = locale === "en";
  const r = <T,>(ar: T | undefined, enVal: T | undefined): T | undefined =>
    en ? (enVal ?? ar) : ar;

  const [site, header, footer] = await Promise.all([
    fetchContent<SiteSettings>("site"),
    fetchSections("header"),
    fetchSections("footer"),
  ]);

  const t = getCommon(locale);

  // Logo (fallback to static figma asset)
  const logo = site?.logo_url || "/logo.png";

  // Nav links (CMS → fallback NAV_LINKS + getCommon labels)
  const navLinks =
    header?.nav?.length
      ? [...header.nav]
          .sort((a, b) => a.order - b.order)
          .map((row) => ({ label: r(row.title_ar, row.title_en) || row.value, href: row.value }))
      : NAV_LINKS.map((l) => ({ label: t.nav[l.key], href: l.href }));

  // CTA labels
  const cta = {
    admission: r(site?.cta_admission_ar, site?.cta_admission_en) || t.admission,
    contact: r(site?.cta_contact_ar, site?.cta_contact_en) || t.contact,
  };

  // Footer
  const mapRows = (rows?: SectionRow[]) =>
    (rows ?? [])
      .slice()
      .sort((a, b) => a.order - b.order)
      .map((row) => ({ label: r(row.title_ar, row.title_en) || row.value, href: row.value }));

  const quickLinks = footer?.quick_links?.length
    ? mapRows(footer.quick_links)
    : [
        { label: t.footer.quick.about, href: "/about" },
        { label: t.footer.quick.services, href: "/programs" },
        { label: t.footer.quick.branches, href: "/branches" },
        { label: t.footer.quick.programs, href: "/programs" },
        { label: t.footer.quick.blog, href: "/news" },
        { label: t.footer.quick.contact, href: "/contact" },
      ];

  const services = footer?.services?.length
    ? mapRows(footer.services)
    : t.footer.services.map((s) => ({ label: s, href: "/programs" }));

  const social = footer?.social?.length
    ? [...footer.social]
        .sort((a, b) => a.order - b.order)
        .map((row) => ({
          platform: row.icon,
          // رقم الواتساب موحَّد من إعدادات الموقع (حقل whatsapp) — بقية المنصّات من قيمتها
          url: row.icon === "whatsapp" ? waUrl(site?.whatsapp) : row.value,
          label: r(row.title_ar, row.title_en) || row.icon,
        }))
        .filter((s) => s.platform && s.url)
    : [
        { platform: "x", url: "https://x.com/hdc_ksa", label: en ? "X" : "إكس" },
        { platform: "instagram", url: "https://www.instagram.com/hdc_ksa", label: en ? "Instagram" : "انستغرام" },
        { platform: "tiktok", url: "https://www.tiktok.com/@hdc_ksa", label: en ? "TikTok" : "تيك توك" },
        { platform: "whatsapp", url: waUrl(site?.whatsapp), label: en ? "WhatsApp" : "واتساب" },
      ];

  const chrome: SiteChromeData = {
    logo,
    navLinks,
    cta,
    footer: {
      brandDesc: r(site?.brand_desc_ar, site?.brand_desc_en) || t.footer.brandDesc,
      quickTitle: r(site?.footer_quick_title_ar, site?.footer_quick_title_en) || t.footer.quickLinks,
      servicesTitle: r(site?.footer_services_title_ar, site?.footer_services_title_en) || t.footer.servicesTitle,
      contactTitle: r(site?.footer_contact_title_ar, site?.footer_contact_title_en) || t.footer.contactTitle,
      privacy: r(site?.privacy_label_ar, site?.privacy_label_en) || t.footer.privacy,
      rights: r(site?.copyright_ar, site?.copyright_en) || t.footer.rights,
      quickLinks,
      services,
      social,
      contact: {
        mainBranch: r(site?.main_branch_ar, site?.main_branch_en) || t.footer.mainBranch,
        phone: site?.phone_unified || CONTACT.unified,
        email: site?.email || CONTACT.email,
      },
    },
  };

  return (
    <html lang={locale} dir={dirOf(locale)} className={`${cairo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        {/* بيانات منظَّمة (Schema.org / JSON-LD) — تعريف المنظمة لمحركات البحث */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MedicalOrganization",
              name: "مركز عبور للرعاية والتأهيل",
              alternateName: "Oboor Center for Care & Rehabilitation",
              url: SITE_URL,
              logo: `${SITE_URL}/logo.png`,
              image: `${SITE_URL}${OG_IMAGE}`,
              description: SITE_DESC,
              email: chrome.footer.contact.email,
              telephone: chrome.footer.contact.phone,
              areaServed: { "@type": "Country", name: "Saudi Arabia" },
              address: { "@type": "PostalAddress", addressCountry: "SA" },
              sameAs: chrome.footer.social.map((s) => s.url).filter(Boolean),
            }),
          }}
        />
        <PreviewBanner />
        <SiteChrome locale={locale} chrome={chrome}>{children}</SiteChrome>
      </body>
      {GA_ENABLED && <GoogleAnalytics gaId={GA_ID} />}
    </html>
  );
}
