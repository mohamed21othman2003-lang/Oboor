// روابط السوشيال — مصدر واحد: «إعدادات الموقع» في الـCMS (x_url / instagram_url / tiktok_url / youtube_url / snapchat_url + whatsapp).
// الفوتر وقسم «تابعنا» في صفحة التواصل بيقروا من هنا: أي رابط يتملي يظهر في المكانين، والفاضي يختفي.
import { waUrl } from "@/lib/site";

export type SocialSite = {
  x_url?: string; instagram_url?: string; tiktok_url?: string; youtube_url?: string; snapchat_url?: string; whatsapp?: string;
};
export type SocialItem = { platform: string; url: string; label: string };

const PLATFORMS: { platform: string; field: keyof SocialSite; ar: string; en: string }[] = [
  { platform: "x", field: "x_url", ar: "إكس", en: "X" },
  { platform: "instagram", field: "instagram_url", ar: "انستغرام", en: "Instagram" },
  { platform: "tiktok", field: "tiktok_url", ar: "تيك توك", en: "TikTok" },
  { platform: "youtube", field: "youtube_url", ar: "يوتيوب", en: "YouTube" },
  { platform: "snapchat", field: "snapchat_url", ar: "سناب شات", en: "Snapchat" },
];

// القيم الافتراضية لو الإعدادات مش متاحة خالص (الباك إند واقع)
const FALLBACK: SocialSite = {
  x_url: "https://x.com/hdc_ksa", instagram_url: "https://www.instagram.com/hdc_ksa", tiktok_url: "https://www.tiktok.com/@hdc_ksa",
};

export function socialLinks(site: SocialSite | null | undefined, en: boolean, opts: { whatsapp?: boolean; order?: string[] } = {}): SocialItem[] {
  const src = site ?? FALLBACK;
  let list = PLATFORMS
    .map((p) => ({ platform: p.platform, url: String(src[p.field] ?? "").trim(), label: en ? p.en : p.ar }))
    .filter((s) => s.url);
  if (opts.order) {
    const rank = (p: string) => { const i = opts.order!.indexOf(p); return i < 0 ? 99 : i; };
    list = [...list].sort((a, b) => rank(a.platform) - rank(b.platform));
  }
  if (opts.whatsapp) list.push({ platform: "whatsapp", url: waUrl(site?.whatsapp), label: en ? "WhatsApp" : "واتساب" });
  return list;
}
