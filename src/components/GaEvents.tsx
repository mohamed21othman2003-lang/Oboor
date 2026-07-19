"use client";

import { useEffect } from "react";
import { sendGAEvent } from "@next/third-parties/google";

/**
 * متتبّع مركزي لأحداث الضغط الصادرة (واتساب/هاتف/إيميل/تحميل PDF).
 * يلتقط الضغط على الروابط في كل الموقع ويرسل حدث GA4 المناسب — بدل تعديل كل زر.
 * يُركّب في الـlayout (الإنتاج فقط).
 */
export default function GaEvents() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      const a = target?.closest?.("a") as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute("href") || "";
      if (!href) return;

      if (/wa\.me|api\.whatsapp\.com|whatsapp/i.test(href)) {
        sendGAEvent("event", "whatsapp_click", { link_url: href });
      } else if (href.startsWith("tel:")) {
        sendGAEvent("event", "phone_click", { phone_number: href.replace(/^tel:/, "") });
      } else if (href.startsWith("mailto:")) {
        sendGAEvent("event", "email_click", { email: href.replace(/^mailto:/, "") });
      } else if (/\.pdf(\?|$)/i.test(href)) {
        sendGAEvent("event", "download_pdf", { link_url: href });
      }
    }
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
