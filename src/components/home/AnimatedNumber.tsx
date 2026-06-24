"use client";

import { useEffect, useRef, useState } from "react";

// عدّاد متحرّك: يعدّ من صفر للرقم لما يظهر في الشاشة، مع الحفاظ على البادئة (+)
// واللاحقة والفواصل. أي قيمة بلا رقم تُعرض كما هي.
export default function AnimatedNumber({ value, duration = 1600 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  const [display, setDisplay] = useState<string>(value);

  useEffect(() => {
    const m = String(value).match(/^([^\d]*)([\d,]+)(.*)$/);
    if (!m) { setDisplay(value); return; }
    const prefix = m[1];
    const suffix = m[3];
    const target = parseInt(m[2].replace(/,/g, ""), 10);
    const fmt = (n: number) => `${prefix}${n.toLocaleString("en-US")}${suffix}`;

    setDisplay(fmt(0));
    const el = ref.current;
    if (!el) return;

    const animate = () => {
      if (started.current) return;
      started.current = true;
      if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
        setDisplay(fmt(target));
        return;
      }
      const t0 = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setDisplay(fmt(Math.round(target * eased)));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { animate(); io.disconnect(); } }),
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, duration]);

  return <span ref={ref}>{display}</span>;
}
