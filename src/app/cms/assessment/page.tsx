"use client";

import Link from "next/link";
import PageChrome from "@/components/cms/PageChrome";

export default function CmsAssessmentPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/cms" className="text-xs font-semibold text-brand hover:text-brand-dark">← لوحة التحكّم</Link>
        <h1 className="mt-1 text-2xl font-extrabold text-ink">التقييم</h1>
        <p className="mt-1 text-sm text-ink-soft">تحكّم في محتوى صفحة التقييم — الأرقام، المميزات، الخطوات، الأسئلة الأولية وخياراتها، وبطاقات أنواع التقييم.</p>
      </div>

      {/* عناوين ونصوص أقسام صفحة التقييم */}
      <PageChrome page="assessment" />

      {/* بطاقات أنواع التقييم (قائمة مستقلة) */}
      <div>
        <h2 className="mb-3 text-sm font-bold text-brand-dark">قوائم المحتوى في الصفحة</h2>
        <Link href="/cms/content/assessment-cards" className="group flex items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-line transition-colors hover:ring-brand">
          <div className="text-start">
            <p className="font-bold text-ink">بطاقات أنواع التقييم</p>
            <p className="mt-0.5 text-xs text-ink-soft">الكروت التي تعرض أنواع التقييم المتاحة على الصفحة</p>
          </div>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-ink-soft transition-colors group-hover:text-brand"><path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" /></svg>
        </Link>
      </div>
    </div>
  );
}
