import Link from "next/link";
import { pick, type Locale } from "@/i18n/config";

/**
 * قسم «التواصل» الموحّد (CTA) المستخدم في نهاية الصفحات.
 * افتراضياً: بادج + عنوان + وصف + 3 أزرار (طلب التحاق · واتساب · أقرب فرع).
 * خيارات إضافية:
 *  - features: صف نقاط مميزات يظهر تحت الوصف.
 *  - primary: زر رئيسي مخصّص (أبيض) — مثل «قيّم طفلك الآن».
 *  - showApply / showBranches: لإظهار/إخفاء زرّي الالتحاق والفرع.
 *  - starBadge: أيقونة نجمة في البادج بدل النقطة.
 */
export default function CtaSection({
  locale,
  title,
  subtitle,
  badge,
  features,
  primary,
  showApply = true,
  showBranches = true,
  starBadge = false,
}: {
  locale: Locale;
  title: React.ReactNode;
  subtitle: string;
  badge?: string;
  features?: string[];
  primary?: { href: string; label: string };
  showApply?: boolean;
  showBranches?: boolean;
  starBadge?: boolean;
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0e4048] via-[#1a6c75] to-[#0e4048]">
      <div className="relative mx-auto max-w-7xl px-6 py-14 text-center lg:px-8">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90">
          {starBadge ? <StarIcon /> : <span className="h-2 w-2 rounded-full bg-success" />}
          {badge ?? pick(locale, "خدمة العملاء متاحة على مدار الساعة", "Customer service available around the clock")}
        </span>
        <h2 className="mt-5 text-3xl font-extrabold text-white sm:text-4xl">{title}</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-white/75">{subtitle}</p>

        {features && features.length > 0 && (
          <div className="mx-auto mt-6 flex max-w-3xl flex-wrap items-center justify-center gap-x-7 gap-y-2.5">
            {features.map((f) => (
              <span key={f} className="flex items-center gap-2 text-sm text-white/85">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                {f}
              </span>
            ))}
          </div>
        )}

        <div className="mx-auto mt-8 flex max-w-md flex-col items-stretch justify-center gap-4 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center">
          {primary && (
            <Link href={primary.href} className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-surface sm:w-auto sm:min-w-[190px]">
              <ClipboardIcon />
              {primary.label}
            </Link>
          )}
          {showApply && (
            <Link href="/admission" className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark sm:w-auto sm:min-w-[190px]">
              <FormIcon />
              {pick(locale, "طلب التحاق", "Apply Now")}
            </Link>
          )}
          <a href="https://wa.me/966920003452" target="_blank" rel="noopener noreferrer" className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2ba73e] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 sm:w-auto sm:min-w-[190px]">
            <WhatsappIcon />
            {pick(locale, "تواصل عبر الواتساب", "Contact via WhatsApp")}
          </a>
          {showBranches && (
            <Link href="/branches" className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-surface sm:w-auto sm:min-w-[190px]">
              <PinIcon />
              {pick(locale, "اعثر على أقرب فرع", "Find Nearest Branch")}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

function StarIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-success"><path d="M12 2l2.9 6.3 6.6.6-5 4.4 1.5 6.4L12 17.8 6 21l1.5-6.4-5-4.4 6.6-.6z" /></svg>;
}
function ClipboardIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand"><rect x="8" y="3" width="8" height="4" rx="1" /><path d="M9 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3" /><path d="M9 13l2 2 4-4" /></svg>;
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
