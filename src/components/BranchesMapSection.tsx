"use client";

import dynamic from "next/dynamic";
import { type Locale } from "@/i18n/config";
import type { Branch } from "@/lib/branchesData";

type Region = { name: string; count: number; color: string };

// خريطة Leaflet تعمل على العميل فقط (تستخدم window) → نحمّلها ديناميكياً بدون SSR
const LeafletMap = dynamic(() => import("@/components/LeafletMap"), {
  ssr: false,
  loading: () => <div className="h-[520px] w-full animate-pulse rounded-3xl border border-line bg-surface" />,
});

export default function BranchesMapSection({ locale, branches, regions }: { locale: Locale; branches: Branch[]; regions: Region[] }) {
  return <LeafletMap locale={locale} branches={branches} regions={regions} />;
}
