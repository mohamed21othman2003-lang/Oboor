import type { MetadataRoute } from "next";
import { fetchContent } from "@/lib/server/django";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://oboor.ido.sa";

type WithSlug = { slug?: string };

// يجلب معرّفات (slugs) نوع محتوى معيّن للروابط الديناميكية؛ يتجاهل أي فشل بهدوء.
async function slugsOf(path: string): Promise<string[]> {
  try {
    const rows = await fetchContent<WithSlug[]>(path);
    return (rows ?? []).map((r) => r.slug).filter((s): s is string => Boolean(s));
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticPaths = [
    "", "/about", "/programs", "/branches", "/specialists",
    "/success-stories", "/news", "/gallery", "/assessment", "/careers", "/contact", "/admission",
  ];
  const staticEntries = staticPaths.map((p) => ({
    url: `${SITE}${p}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.8,
  }));

  const [programs, services, techniques, branches, news, careers] = await Promise.all([
    slugsOf("programs"), slugsOf("services"), slugsOf("techniques"),
    slugsOf("branches"), slugsOf("news"), slugsOf("careers"),
  ]);

  const dynamicPaths = [
    ...programs.map((s) => `/programs/${s}`),
    ...services.map((s) => `/services/${s}`),
    ...techniques.map((s) => `/techniques/${s}`),
    ...branches.map((s) => `/branches/${s}`),
    ...news.map((s) => `/news/${s}`),
    ...careers.map((s) => `/careers/${s}`),
  ];
  const dynamicEntries = dynamicPaths.map((p) => ({
    url: `${SITE}${p}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticEntries, ...dynamicEntries];
}
