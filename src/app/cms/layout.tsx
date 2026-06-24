"use client";

import { usePathname } from "next/navigation";
import CmsShell from "@/components/cms/CmsShell";

export default function CmsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/cms/login") return <>{children}</>;
  return <CmsShell>{children}</CmsShell>;
}
