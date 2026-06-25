import Link from "next/link";
import { pick, type Locale } from "@/i18n/config";

/**
 * قسم «التواصل» الموحّد (CTA) المستخدم في نهاية كل الصفحات.
 * شكل ثابت مطابق للتصميم: بادج + عنوان + وصف + 3 أزرار بأيقونات
 * (طلب التحاق · تواصل عبر الواتساب · اعثر على أقرب فرع).
 * يتغيّر فقط نص العنوان/الوصف/البادج حسب الصفحة.
 */
export default function CtaSection({
  locale,
  title,
  subtitle,
  badge,
}: {
  locale: Locale;
  title: React.ReactNode;
  subtitle: string;
  badge?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0e4048] via-[#1a6c75] to-[#0e4048]">
      <div className="relative mx-auto max-w-7xl px-6 py-14 text-center lg:px-8">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90">
          <span className="h-2 w-2 rounded-full bg-success" />
          {badge ?? pick(locale, "خدمة العملاء متاحة على مدار الساعة", "Customer service available around the clock")}
        </span>
        <h2 className="mt-5 text-3xl font-extrabold text-white sm:text-4xl">{title}</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-white/75">{subtitle}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link href="/admission" className="flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark">
            <FormIcon />
            {pick(locale, "طلب التحاق", "Apply Now")}
          </Link>
          <a href="https://wa.me/966920003452" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-xl bg-[#2ba73e] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90">
            <WhatsappIcon />
            {pick(locale, "تواصل عبر الواتساب", "Contact via WhatsApp")}
          </a>
          <Link href="/branches" className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-surface">
            <PinIcon />
            {pick(locale, "اعثر على أقرب فرع", "Find Nearest Branch")}
          </Link>
        </div>
      </div>
    </section>
  );
}

function FormIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="1" /><path d="M9 12h6M9 16h4" /></svg>;
}
function WhatsappIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.978-1.207z" /></svg>;
}
function PinIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand"><path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>;
}
