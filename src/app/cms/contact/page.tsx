"use client";

import Link from "next/link";
import PageChrome from "@/components/cms/PageChrome";
import { useCmsLang } from "@/lib/cms/i18n";

export default function CmsContactPage() {
  const { lang } = useCmsLang();
  const en = lang === "en";
  const t = (ar: string, e: string) => (en ? e : ar);
  return (
    <div className="space-y-6">
      <div>
        <Link href="/cms" className="text-xs font-semibold text-brand hover:text-brand-dark">{t("← لوحة التحكّم", "← Dashboard")}</Link>
        <h1 className="mt-1 text-2xl font-extrabold text-ink">{t("خذ الخطوة لعبور (صفحة التواصل)", "Take the Step to Oboor (Contact page)")}</h1>
        <p className="mt-1 text-sm text-ink-soft">{t("تحكّم في كل نصوص صفحة التواصل — العناوين والوصف وبطاقات التواصل والمميزات. أرقام الهاتف والبريد تُدار من «إعدادات الموقع».", "Manage every text on the contact page — headings, description, contact cards and features. Phone numbers and email are managed in “Site Settings”.")}</p>
      </div>

      <PageChrome page="contact" />
    </div>
  );
}
