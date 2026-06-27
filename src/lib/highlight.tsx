import React from "react";

// محتوى رأس الصفحة الرئيسية (من CMS): مفتاح "block.key" → نصوص/صورة بعد اختيار اللغة
export type HomeChrome = Record<string, { title?: string; text?: string; image?: string }>;

// يلوّن الجزء المحاط بـ **نجمتين** باللون المميّز (تركوازي)
// ويحترم الأسطر الجديدة (كل سطر في سطر منفصل)
export function hl(s?: string): React.ReactNode {
  if (s == null) return null;
  const color = (line: string) =>
    line.split(/\*\*(.+?)\*\*/).map((p, i) => (i % 2 ? <span key={i} className="text-brand">{p}</span> : p));
  return s.split("\n").map((line, li) => (
    <React.Fragment key={li}>
      {li > 0 && <br />}
      {color(line)}
    </React.Fragment>
  ));
}
