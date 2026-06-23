import type { ReactNode } from "react";
import { pick, type Locale } from "@/i18n/config";

const team = <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
const book = <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>;
const target = <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></svg>;
const heart = <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" /></svg>;
const chat = <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>;
const shield = <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l8 3v6c0 5-3.4 8.6-8 11-4.6-2.4-8-6-8-11V5l8-3z" /><path d="M9 12l2 2 4-4" /></svg>;

// خريطة أسماء الأيقونات القادمة من الـ CMS إلى الـ SVG
const ICONS: Record<string, ReactNode> = { team, book, target, heart, chat, shield };

export type FeatureItem = { icon: string; title: string; note: string };

const FEATURES = [
  { icon: team, title: "فريقنا", note: "كفاءات تخصصية متكاملة (تربية خاصة، نطق، علاج وظيفي وطبيعي، ونفسي) تعمل بروح الجسد الواحد." },
  { icon: book, title: "منهجنا", note: "برامج تأهيلية معتمدة علميًا وتستند إلى أحدث الممارسات الدولية." },
  { icon: target, title: "خططنا", note: "أهداف محددة بوضوح، ومتابعة دقيقة تقيس كل خطوة تطوّر." },
  { icon: heart, title: "شراكتنا", note: "الأسرة هي الشريك الأول؛ نمكّنها بالدعم والإرشاد ليمتد الأثر في المنزل." },
  { icon: chat, title: "تقاريرنا", note: "تواصل مستمر وتقارير دورية تضع الأسرة في قلب الرحلة وتفاصيلها." },
  { icon: shield, title: "بيئتنا", note: "مساحات آمنة ومحفّزة صُممت لتمنح طفلك الأمان وتُحفّز قدراته." },
];

const FEATURES_EN = [
  { icon: team, title: "Our Team", note: "An integrated group of specialists (special education, speech therapy, occupational therapy, physical therapy, and psychology) working in harmony as one unified team." },
  { icon: book, title: "Our Approach", note: "Scientifically grounded rehabilitation programs based on the latest international practices." },
  { icon: target, title: "Our Plans", note: "Clearly defined goals with precise monitoring that tracks every step of development." },
  { icon: heart, title: "Our Partnership", note: "The family is our primary partner; we empower and support them so the impact extends into the home environment." },
  { icon: chat, title: "Our Reports", note: "Continuous communication and periodic reports that keep families at the heart of the journey." },
  { icon: shield, title: "Our Environment", note: "Safe and stimulating spaces designed to provide comfort while enhancing your child's abilities." },
];

export default function WhyUs({ locale, items }: { locale: Locale; items?: FeatureItem[] }) {
  const features = items && items.length
    ? items.map((f) => ({ ...f, icon: ICONS[f.icon] ?? team }))
    : (locale === "en" ? FEATURES_EN : FEATURES);
  return (
    <section className="bg-surface py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-12 text-center">
          <span className="rounded-full bg-brand/10 px-4 py-1.5 text-sm font-medium text-brand-dark">{pick(locale, "لماذا عبور؟", "Why Oboor?")}</span>
          <h2 className="mt-4 text-3xl font-extrabold text-ink sm:text-4xl">
            {pick(
              locale,
              <>العبور الأفضل يبدأ من <span className="text-brand">عبور</span></>,
              <>The Best Path of Progress Begins at <span className="text-brand">Oboor</span></>
            )}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-ink-muted">
            {pick(
              locale,
              "نُرسّخ ركائز التمكين، لنعبر بطفلك نحو غدٍ أبهى وأجمل.",
              "We strengthen the foundations of empowerment, guiding your child toward a brighter and more meaningful future."
            )}
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="flex items-start gap-4 rounded-2xl border border-line bg-white p-6 transition-shadow hover:shadow-md">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">{f.icon}</div>
              <div className="text-start">
                <h3 className="text-base font-bold text-ink">{f.title}</h3>
                <p className="mt-2 text-sm leading-7 text-ink-muted">{f.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
