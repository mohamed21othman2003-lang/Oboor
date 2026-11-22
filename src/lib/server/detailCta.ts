// قسم التواصل السفلي (CTA) المشترك لصفحات التفاصيل — صفوف الـCMS:
// program-detail / service-detail / technique-detail (block "cta", key "main").
// الأولوية في الصفحة: CTA الخاص بالعنصر نفسه ← هذا الصف المشترك ← النص الثابت.
// {name} في أي خانة يُستبدل باسم البرنامج/الخدمة/التقنية.
import type { Locale } from "@/i18n/config";
import { fetchSections } from "@/lib/server/django";

export type DetailCtaPage = "program-detail" | "service-detail" | "technique-detail";
export type SharedCta = { badge?: string; title?: string; text?: string };

export async function loadSharedCta(page: DetailCtaPage, locale: Locale, name: string): Promise<SharedCta> {
  const sections = await fetchSections(page);
  const row = (sections?.cta ?? []).find((r) => r.key === "main") ?? sections?.cta?.[0];
  if (!row) return {};
  const en = locale === "en";
  const r = row as unknown as Record<string, unknown>;
  const g = (base: string) => {
    const v = String((en ? (r[`${base}_en`] || r[`${base}_ar`]) : r[`${base}_ar`]) ?? "").trim();
    return v ? v.replace(/\{name\}/g, name) : undefined;
  };
  return { badge: g("tagline"), title: g("title"), text: g("text") };
}
