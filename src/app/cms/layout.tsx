"use client";

import { usePathname } from "next/navigation";
import CmsShell from "@/components/cms/CmsShell";
import { CmsLangProvider } from "@/lib/cms/i18n";

export default function CmsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <CmsLangProvider>
      {pathname === "/cms/login" ? children : <CmsShell>{children}</CmsShell>}
    </CmsLangProvider>
  );
}
