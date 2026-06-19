import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";
import { getLocale, dirOf } from "@/i18n/locale";

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
  return (
    <html lang={locale} dir={dirOf(locale)} className={`${cairo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        <SiteChrome locale={locale}>{children}</SiteChrome>
      </body>
    </html>
  );
}
