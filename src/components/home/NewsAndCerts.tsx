import Image from "next/image";
import Link from "next/link";
import { pick, type Locale } from "@/i18n/config";

const NEWS = [
  { img: "/figma/home/imgImageWithFallback14.jpg", badge: "تطوير", title: "إطلاق النسخة المحدثة من برنامج التدخل المبكر", desc: "تشمل فنيات علاجية جديدة للأطفال دون سن الثلاث." },
  { img: "/figma/home/imgImageWithFallback15.jpg", badge: "فعالية", title: "يوم التوعية بالإعاقة الذهنية", desc: "للتوعية بحقوق ذوي الإعاقة وأساليب الدعم الأسري المناسبة." },
  { img: "/figma/home/imgImageWithFallback16.jpg", badge: "تدريب", title: "إطلاق برنامج تدريب أسر المستفيدين", desc: "لمساعدة الأسر على أفضل أساليب دعم أبنائهم في البيئة المنزلية." },
  { img: "/figma/home/imgImageWithFallback17.jpg", badge: "شراكة", title: "تعاون مع الجهات الحكومية", desc: "لتقديم خدمات تأهيلية متكاملة بالتنسيق مع الجهات الحكومية." },
];

const NEWS_EN: typeof NEWS = [
  { img: "/figma/home/imgImageWithFallback14.jpg", badge: "Development", title: "Launch of the updated Early Intervention Program", desc: "Including new therapeutic techniques for children under three." },
  { img: "/figma/home/imgImageWithFallback15.jpg", badge: "Event", title: "Intellectual Disability Awareness Day", desc: "Raising awareness of the rights of people with disabilities and suitable family support methods." },
  { img: "/figma/home/imgImageWithFallback16.jpg", badge: "Training", title: "Launch of the beneficiary families training program", desc: "Helping families learn the best ways to support their children at home." },
  { img: "/figma/home/imgImageWithFallback17.jpg", badge: "Partnership", title: "Collaboration with government agencies", desc: "To provide integrated rehabilitation services in coordination with government agencies." },
];

function NewsCard({ n, locale }: { n: (typeof NEWS)[number]; locale: Locale }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white text-start">
      <div className="relative h-36">
        <Image src={n.img} alt={n.title} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover" />
        <span className="absolute right-3 top-3 rounded-full bg-brand px-3 py-1 text-[11px] font-semibold text-white">{n.badge}</span>
      </div>
      <div className="p-4">
        <h4 className="text-sm font-bold leading-7 text-ink">{n.title}</h4>
        <p className="mt-1 text-xs leading-6 text-ink-muted">{n.desc}</p>
        <Link href="/news" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand transition-colors hover:text-brand-dark">
          {pick(locale, "اقرأ المزيد", "Read More")}
          <svg className="dir-flip" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 6l-6 6 6 6" /></svg>
        </Link>
      </div>
    </div>
  );
}

export default function NewsAndCerts({ locale }: { locale: Locale }) {
  const news = locale === "en" ? NEWS_EN : NEWS;
  return (
    <section className="relative overflow-hidden bg-gradient-to-bl from-brand to-brand-deep py-20">
      <div className="relative mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-3 lg:px-8">
        {/* News */}
        <div className="lg:col-span-2">
          <div className="mb-6 flex items-end justify-between gap-4">
            <Link href="/news" className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-sm font-semibold text-white/90 transition-colors hover:text-white">
              {pick(locale, "عرض الكل", "View All")}
              <svg className="dir-flip" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 6l-6 6 6 6" /></svg>
            </Link>
            <div className="min-w-0 text-start">
              <h3 className="text-2xl font-extrabold text-white">{pick(locale, "صدى العبور وحراكه", "The Impact of Oboor in Motion")}</h3>
              <p className="mt-1 text-sm text-white/70">{pick(locale, "هنا ندوّن تفاصيل الأثر، تابع آخر المستجدات.", "Here, we document the details of our impact. Stay updated with the latest news and developments.")}</p>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {news.map((n) => (
              <NewsCard key={n.title} n={n} locale={locale} />
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div>
          <div className="mb-6 flex items-end justify-between gap-4">
            <Link href="/about" className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-sm font-semibold text-white/90 transition-colors hover:text-white">
              {pick(locale, "عرض الكل", "View All")}
              <svg className="dir-flip" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 6l-6 6 6 6" /></svg>
            </Link>
            <div className="min-w-0 text-start">
              <h3 className="text-2xl font-extrabold text-white">{pick(locale, "عبور، بالشهادات العالمية", "Oboor, Globally Accredited")}</h3>
              <p className="mt-1 text-sm text-white/70">{pick(locale, "سجلٌ حافل بالاعتمادات، وتمكينٌ مبنيٌ على أعلى معايير الجودة.", "A distinguished record of international accreditations and empowerment built on the highest quality standards.")}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center rounded-2xl bg-white/95 p-6 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-brand text-[10px] font-bold text-brand-deep">ISO<br />9001</div>
                <p className="mt-3 text-sm font-bold text-ink">ISO 9001</p>
                <p className="text-[11px] text-ink-muted">Quality Mgmt.</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
