"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NAV_LINKS } from "@/lib/site";
import { getCommon } from "@/i18n/dict/common";
import { pick, type Locale } from "@/i18n/config";
import LangToggle from "@/components/LangToggle";

export default function Navbar({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const t = getCommon(locale);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-2 px-4 sm:px-6 lg:px-6">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src="/figma/imgImage.png"
            alt={pick(locale, "مركز عبور للرعاية والتأهيل", "Oboor Center for Care & Rehabilitation")}
            width={120}
            height={70}
            className="h-12 w-auto"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className={`hidden items-center xl:flex ${locale === "en" ? "gap-0" : "gap-0.5 2xl:gap-2"}`}>
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`whitespace-nowrap rounded-lg py-2 text-[13px] font-medium transition-colors ${
                  locale === "en" ? "px-2" : "px-2.5"
                } ${
                  active
                    ? "text-brand"
                    : "text-ink-muted hover:text-brand hover:bg-surface"
                }`}
              >
                {t.nav[link.key]}
              </Link>
            );
          })}
        </nav>

        {/* CTA buttons */}
        <div className="hidden items-center gap-1.5 xl:flex">
          <LangToggle locale={locale} label={t.langLabel} iconOnly />
          <Link
            href="/admission"
            className="whitespace-nowrap rounded-lg border border-brand px-3 py-2 text-[13px] font-semibold text-brand transition-colors hover:bg-brand hover:text-white"
          >
            {t.admission}
          </Link>
          <Link
            href="/contact"
            className="whitespace-nowrap rounded-lg bg-brand px-3 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            {t.contact}
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center justify-center rounded-lg p-2 text-ink xl:hidden"
          aria-label={t.menu}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="border-t border-line bg-white px-4 py-4 xl:hidden">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-lg px-3 py-2 text-sm font-medium ${
                    pathname === link.href
                      ? "bg-surface text-brand"
                      : "text-ink-muted hover:bg-surface"
                  }`}
                >
                  {t.nav[link.key]}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-col gap-2">
            <Link href="/admission" className="rounded-lg border border-brand px-4 py-2 text-center text-sm font-semibold text-brand">
              {t.admission}
            </Link>
            <Link href="/contact" className="rounded-lg bg-brand px-4 py-2 text-center text-sm font-semibold text-white">
              {t.contact}
            </Link>
            <LangToggle locale={locale} label={t.langLabel} className="justify-center" />
          </div>
        </nav>
      )}
    </header>
  );
}
