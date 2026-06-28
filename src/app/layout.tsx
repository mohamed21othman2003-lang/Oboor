import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import SiteChrome, { type SiteChromeData } from "@/components/SiteChrome";
import PreviewBanner from "@/components/PreviewBanner";
import { getLocale, dirOf } from "@/i18n/locale";
import { fetchContent, fetchSections, type SectionRow } from "@/lib/server/django";
import { NAV_LINKS, CONTACT } from "@/lib/site";
import { getCommon } from "@/i18n/dict/common";

type SiteSettings = {
  logo_url?: string;
  email?: string;
  phone_unified?: string;
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

export const metadata: Metadata = {
  title: "عبور | Oboor",
  description: "منصة عبور الرقمية",
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
          url: row.value,
          label: r(row.title_ar, row.title_en) || row.icon,
        }))
        .filter((s) => s.platform && s.url)
    : [
        { platform: "x", url: "https://x.com/hdc_ksa", label: en ? "X" : "إكس" },
        { platform: "instagram", url: "https://www.instagram.com/hdc_ksa", label: en ? "Instagram" : "انستغرام" },
        { platform: "tiktok", url: "https://www.tiktok.com/@hdc_ksa", label: en ? "TikTok" : "تيك توك" },
        { platform: "whatsapp", url: "https://wa.me/966920003452", label: en ? "WhatsApp" : "واتساب" },
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
        <PreviewBanner />
        <SiteChrome locale={locale} chrome={chrome}>{children}</SiteChrome>
      </body>
    </html>
  );
}
