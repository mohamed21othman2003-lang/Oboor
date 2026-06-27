import React from "react";

// محتوى رأس الصفحة الرئيسية (من CMS): مفتاح "block.key" → نصوص/صورة بعد اختيار اللغة
export type HomeChrome = Record<string, { title?: string; text?: string; image?: string }>;

// يلوّن الجزء المحاط بـ **نجمتين** باللون المميّز (تركوازي)
export function hl(s?: string): React.ReactNode {
  if (s == null) return null;
  return s.split(/\*\*(.+?)\*\*/).map((p, i) => (i % 2 ? <span key={i} className="text-brand">{p}</span> : p));
}
