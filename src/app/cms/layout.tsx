"use client";

import { usePathname } from "next/navigation";
import CmsShell from "@/components/cms/CmsShell";
import { CmsLangProvider } from "@/lib/cms/i18n";

export default function CmsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // اللوجين والدليل وصفحات إعادة تعيين كلمة المرور صفحات مستقلة بدون شِل الـCMS
  const bare = pathname === "/cms/login" || pathname === "/cms/guide"
    || pathname === "/cms/forgot-password" || pathname === "/cms/reset-password";
  return (
    <CmsLangProvider>
      {bare ? children : <CmsShell>{children}</CmsShell>}
    </CmsLangProvider>
  );
}
