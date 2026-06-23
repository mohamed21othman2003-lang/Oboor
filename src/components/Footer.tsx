import Image from "next/image";
import Link from "next/link";
import { getCommon } from "@/i18n/dict/common";
import type { Locale } from "@/i18n/locale";
import { pick } from "@/i18n/config";
import { CONTACT } from "@/lib/site";

// Serializable footer data resolved on the server (CMS or static fallback).
export type FooterData = {
  brandDesc: string;
  quickTitle: string;
  servicesTitle: string;
  contactTitle: string;
  privacy: string;
  rights: string;
  quickLinks: { label: string; href: string }[];
  services: { label: string; href: string }[];
  social: { platform: string; url: string; label: string }[];
  contact: { mainBranch: string; phone: string; email: string };
};

const QUICK_LINKS: { key: "about" | "services" | "branches" | "programs" | "blog" | "contact"; href: string }[] = [
  { key: "about", href: "/about" },
  { key: "services", href: "/programs" },
  { key: "branches", href: "/branches" },
  { key: "programs", href: "/programs" },
  { key: "blog", href: "/news" },
  { key: "contact", href: "/contact" },
];

function Chevron({ locale }: { locale: Locale }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-white/40">
      <path strokeLinecap="round" strokeLinejoin="round" d={pick(locale, "M15 18l-6-6 6-6", "M9 18l6-6-6-6")} />
    </svg>
  );
}

function FooterLink({ href, label, locale }: { href: string; label: string; locale: Locale }) {
  return (
    <li>
      <Link href={href} className="flex items-center gap-2 text-sm text-white/55 transition-colors hover:text-brand">
        <span>{label}</span>
        <Chevron locale={locale} />
      </Link>
    </li>
  );
}

function Social({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a href={href} aria-label={label} target="_blank" rel="noopener noreferrer"
      className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white transition-colors hover:bg-brand">
      {children}
    </a>
  );
}

// Maps a CMS platform key to the matching inline SVG icon. Unknown → null (hidden).
function SocialIcon({ platform }: { platform: string }) {
  switch (platform) {
    case "x":
      return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2H21.5l-7.5 8.57L23 22h-6.594l-5.165-6.75L5.32 22H2.06l8.02-9.166L1 2h6.76l4.668 6.17L18.244 2zm-1.157 18h1.83L7.01 3.92H5.05L17.087 20z" /></svg>;
    case "instagram":
      return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg>;
    case "tiktok":
      return <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 3a5.5 5.5 0 0 0 4 4v3a8.5 8.5 0 0 1-4-1v6a6 6 0 1 1-6-6v3a3 3 0 1 0 3 3V3h3z" /></svg>;
    case "whatsapp":
      return <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm5.8 14.06c-.24.68-1.42 1.32-1.95 1.36-.5.04-.5.4-3.16-.66-2.66-1.05-4.3-3.78-4.43-3.96-.13-.18-1.05-1.4-1.05-2.66s.66-1.89.9-2.15c.24-.26.52-.32.7-.32l.5.01c.16.01.38-.06.59.45.24.58.82 2 .89 2.14.07.14.12.31.02.49-.09.18-.14.29-.28.45l-.42.49c-.14.14-.28.29-.12.57.16.28.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.22 1.37.28.14.44.12.6-.07.18-.21.69-.8.87-1.08.18-.28.36-.23.6-.14.25.09 1.57.74 1.84.88.27.14.45.21.52.32.07.12.07.68-.17 1.36z" /></svg>;
    case "youtube":
      return <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23 12s0-3.8-.48-5.62a2.9 2.9 0 0 0-2.04-2.05C18.66 3.85 12 3.85 12 3.85s-6.66 0-8.48.48a2.9 2.9 0 0 0-2.04 2.05C1 8.2 1 12 1 12s0 3.8.48 5.62a2.9 2.9 0 0 0 2.04 2.05c1.82.48 8.48.48 8.48.48s6.66 0 8.48-.48a2.9 2.9 0 0 0 2.04-2.05C23 15.8 23 12 23 12zM9.75 15.5v-7l6 3.5-6 3.5z" /></svg>;
    case "snapchat":
      return <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c2.6 0 4.4 2 4.5 4.6.03.7-.02 1.4-.06 2 .3.16.7.1 1.06-.05.5-.2 1.1.05 1.2.5.1.45-.2.8-.6 1-.4.2-1 .35-1.4.6-.3.2-.2.5-.05.9.5 1.2 1.5 2.2 2.7 2.6.4.13.7.4.6.8-.13.5-.7.6-1.1.7-.3.07-.4.1-.5.5-.05.2-.1.4-.4.45-.5.1-1.1-.1-1.7-.05-.5.04-.9.4-1.4.75-.6.45-1.3.8-2.3.8s-1.7-.35-2.3-.8c-.5-.35-.9-.7-1.4-.75-.6-.05-1.2.15-1.7.05-.3-.05-.35-.25-.4-.45-.1-.4-.2-.43-.5-.5-.4-.1-.97-.2-1.1-.7-.1-.4.2-.67.6-.8 1.2-.4 2.2-1.4 2.7-2.6.15-.4.25-.7-.05-.9-.4-.25-1-.4-1.4-.6-.4-.2-.7-.55-.6-1 .1-.45.7-.7 1.2-.5.36.15.76.2 1.06.05-.04-.6-.09-1.3-.06-2C7.6 4 9.4 2 12 2z" /></svg>;
    default:
      return null;
  }
}

export default function Footer({
  locale,
  logo,
  footer,
}: {
  locale: Locale;
  logo?: string;
  footer?: FooterData;
}) {
  const t = getCommon(locale).footer;

  // CMS-driven values with fallback to the static dictionary/site data.
  const logoSrc = logo || "/figma/imgImage.png";
  const brandDesc = footer?.brandDesc || t.brandDesc;
  const quickTitle = footer?.quickTitle || t.quickLinks;
  const servicesTitle = footer?.servicesTitle || t.servicesTitle;
  const contactTitle = footer?.contactTitle || t.contactTitle;
  const privacy = footer?.privacy || t.privacy;
  const rights = footer?.rights || t.rights;

  const quickLinks = footer?.quickLinks?.length
    ? footer.quickLinks
    : QUICK_LINKS.map((l) => ({ label: t.quick[l.key], href: l.href }));
  const services = footer?.services?.length
    ? footer.services
    : t.services.map((s) => ({ label: s, href: "/programs" }));

  const social: { platform: string; url: string; label: string }[] = footer?.social?.length
    ? footer.social
    : [
        { platform: "x", url: "https://x.com/hdc_ksa", label: pick(locale, "إكس", "X") },
        { platform: "instagram", url: "https://www.instagram.com/hdc_ksa", label: pick(locale, "انستغرام", "Instagram") },
        { platform: "tiktok", url: "https://www.tiktok.com/@hdc_ksa", label: pick(locale, "تيك توك", "TikTok") },
        { platform: "whatsapp", url: "https://wa.me/966920003452", label: pick(locale, "واتساب", "WhatsApp") },
      ];

  const mainBranch = footer?.contact.mainBranch || t.mainBranch;
  const phone = footer?.contact.phone || CONTACT.unified;
  const email = footer?.contact.email || CONTACT.email;

  return (
    <footer className="mt-auto bg-[#1f2a30] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 text-start sm:px-6 lg:grid-cols-4 lg:px-8">
        {/* Brand */}
        <div>
          <Image src={logoSrc} alt={pick(locale, "مركز عبور", "Oboor Center")} width={130} height={76} className="h-16 w-auto" />
          <p className="mt-5 text-sm leading-8 text-white/55">{brandDesc}</p>
          <div className="mt-6 flex gap-3">
            {social
              .filter((s) => s.platform && s.url)
              .map((s) => {
                const icon = <SocialIcon platform={s.platform} />;
                if (!icon) return null;
                return (
                  <Social key={s.platform + s.url} href={s.url} label={s.label}>
                    {icon}
                  </Social>
                );
              })}
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="mb-6 text-lg font-bold">{quickTitle}</h3>
          <ul className="space-y-4">
            {quickLinks.map((l) => (
              <FooterLink key={l.label + l.href} href={l.href} label={l.label} locale={locale} />
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="mb-6 text-lg font-bold">{servicesTitle}</h3>
          <ul className="space-y-4">
            {services.map((s) => (
              <FooterLink key={s.label + s.href} href={s.href} label={s.label} locale={locale} />
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-6 text-lg font-bold">{contactTitle}</h3>
          <ul className="space-y-5 text-sm text-white/55">
            <li className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-brand"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
              <span>{mainBranch}</span>
            </li>
            <li>
              <a href={`tel:${phone}`} className="flex items-center gap-2 transition-colors hover:text-brand">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-brand"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                <span dir="ltr">{phone}</span>
              </a>
            </li>
            <li>
              <a href={`mailto:${email}`} className="flex items-center gap-2 transition-colors hover:text-brand">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-brand"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>
                <span dir="ltr">{email}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col-reverse items-center justify-between gap-2 px-4 py-5 text-xs text-white/45 sm:flex-row sm:px-6 lg:px-8">
          <Link href="#" className="transition-colors hover:text-brand">{privacy}</Link>
          <p>{rights}</p>
        </div>
      </div>
    </footer>
  );
}
