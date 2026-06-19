"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Locale } from "@/i18n/config";

// Public site chrome (navbar/footer). Hidden on the /admin CMS dashboard
// (its own shell) and on printable profile pages (standalone documents).
export default function SiteChrome({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin") || pathname?.endsWith("/profile")) {
    return <>{children}</>;
  }
  return (
    <>
      <Navbar locale={locale} />
      <main className="flex-1">{children}</main>
      <Footer locale={locale} />
    </>
  );
}
