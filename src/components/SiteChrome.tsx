"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer, { type FooterData } from "@/components/Footer";
import type { Locale } from "@/i18n/config";

// Serializable, locale-resolved chrome data passed from the server layout.
export type SiteChromeData = {
  logo: string;
  navLinks: { label: string; href: string }[];
  cta: { admission: string; contact: string };
  footer: FooterData;
};

// Public site chrome (navbar/footer). Hidden on the /admin CMS dashboard
// (its own shell) and on printable profile pages (standalone documents).
export default function SiteChrome({
  locale,
  chrome,
  children,
}: {
  locale: Locale;
  chrome?: SiteChromeData;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin") || pathname?.endsWith("/profile")) {
    return <>{children}</>;
  }
  return (
    <>
      <Navbar
        locale={locale}
        logo={chrome?.logo}
        navLinks={chrome?.navLinks}
        cta={chrome?.cta}
      />
      <main className="flex-1">{children}</main>
      <Footer locale={locale} logo={chrome?.logo} footer={chrome?.footer} />
    </>
  );
}
