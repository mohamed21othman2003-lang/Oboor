"use client";

import { usePathname } from "next/navigation";
import CmsShell from "@/components/cms/CmsShell";
import { CmsLangProvider } from "@/lib/cms/i18n";

export default function CmsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // اللوجين والدليل صفحات مستقلة بدون شِل الـCMS (الدليل يُفتح في تاب منفصلة)
  const bare = pathname === "/cms/login" || pathname === "/cms/guide";
  return (
    <CmsLangProvider>
      {bare ? children : <CmsShell>{children}</CmsShell>}
    </CmsLangProvider>
  );
}
