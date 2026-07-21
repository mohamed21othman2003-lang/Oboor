"use client";

import { useEffect } from "react";

// تحميل Google Analytics بشكل مؤجّل: لا يُحمَّل سكربت gtag.js الثقيل (~163KiB) ضمن
// المسار الحرج للصفحة، بل عند أول تفاعل من المستخدم (تمرير/لمس/ضغط) أو بعد خمول
// المتصفّح كحدّ أقصى. هذا يزيل وزنه وعمله على المعالج من قياس الأداء على الموبايل،
// مع بقاء التتبّع عاملًا (الأحداث تُخزَّن في dataLayer وتُرسَل فور تحميل GA).
type GtagWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

export default function DeferredGA({ gaId }: { gaId: string }) {
  useEffect(() => {
    const w = window as GtagWindow;
    // نمط GA القياسي — نجهّز dataLayer و gtag فورًا كي تُخزَّن أي أحداث مبكرة،
    // ثم يعالجها gtag.js عند تحميله لاحقًا.
    w.dataLayer = w.dataLayer || [];
    if (!w.gtag) {
      w.gtag = function gtag() {
        // eslint-disable-next-line prefer-rest-params
        w.dataLayer!.push(arguments);
      };
      w.gtag("js", new Date());
      w.gtag("config", gaId);
    }

    let loaded = false;
    const evs: (keyof WindowEventMap)[] = ["scroll", "keydown", "pointerdown", "touchstart"];
    const load = () => {
      if (loaded) return;
      loaded = true;
      evs.forEach((e) => window.removeEventListener(e, load));
      const s = document.createElement("script");
      s.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      s.async = true;
      document.head.appendChild(s);
    };

    evs.forEach((e) => window.addEventListener(e, load, { once: true, passive: true }));
    // احتياطي: لو لم يتفاعل المستخدم، حمّل بعد خمول المتصفّح (بحدّ أقصى ٣ ثوانٍ).
    let idleId = 0;
    let timerId = 0;
    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(load, { timeout: 3000 });
    } else {
      timerId = window.setTimeout(load, 3000);
    }

    return () => {
      evs.forEach((e) => window.removeEventListener(e, load));
      if (idleId && typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(idleId);
      if (timerId) clearTimeout(timerId);
    };
  }, [gaId]);

  return null;
}
