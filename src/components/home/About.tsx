import Image from "next/image";
import Link from "next/link";
import { pick, type Locale } from "@/i18n/config";

const PARAGRAPHS = [
  "بيدٍ خبيرة وقلبٍ حانٍ ينمو طفلك في مركز عبور المظلة المتخصصة في تأهيل ورعاية الأطفال من ذوي الاضطرابات النمائية عبر برامج التدخل المبكر؛ نعمل معكم ومعهم على بناء جودة حياتهم، ليتجاوزوا كل التحديات، ونأخذ بيد كل طفلٍ ليعبر نحو غدِه بعزمٍ وثبات.",
  "نبتكر في عبور برامج تأهيلية وخدمات عيادية متخصصة، ترتكز على أحدث الأسس العلمية في مجالات التأهيل، نُفصّل كل برنامج بدقة ليتناغم مع احتياجات كل طفل، ونضمن معها رحلة تطورٍ تَبني ثقته وتُسهّل دربه.",
  "تبدأ خطواتنا معكم لتمتد وتشمل طفلكم في كل مرحلة، نحرص في عبور على احتضان الأسرة بالدعم والتمكين والإرشاد المستمر، لتكونوا شركاءنا الحقيقيين في صياغة غدٍ أجمل لأبنائكم، ومتابعة تطورهم بشغفٍ في كل التفاصيل.",
  "في عبور، نبني من أجلهم بيئةً تفيض بالدفء والأمان، تُشجعهم على التعلم والتطور بكل ثقة، وبقلوبٍ تحمل سموّ الرسالة الإنسانية قبل كفاءة المهنة، نقف مع نخبة من أخصائيينا المؤهلين ليسكبوا خبراتهم حبًّا ورعاية، ويقدموا لأطفالكم أفضل مستويات التأهيل.",
];

const PARAGRAPHS_EN = [
  "With expert hands and compassionate hearts, your child grows at Oboor Center — a specialized umbrella dedicated to the rehabilitation and care of children with developmental disorders through early intervention programs. Together with you and your child, we work to enhance the quality of life, overcome challenges, and guide every child toward a future filled with determination and confidence.",
  "At Oboor, we design specialized rehabilitation programs and clinical services grounded in the latest scientific approaches in the field of therapy. Each program is carefully tailored to meet every child's unique needs, ensuring a developmental journey that builds confidence and supports steady progress.",
  "Our journey with you extends across every stage of your child's development. We place strong emphasis on empowering and supporting families through continuous guidance and care, making you true partners in shaping a brighter future for your children and closely following their progress with dedication.",
  "At Oboor, we create an environment filled with warmth and safety — one that encourages learning and growth with confidence. Guided by a mission rooted in humanity before profession, our team of highly qualified specialists brings expertise delivered with care, offering your children the highest standards of rehabilitation.",
];

export default function About({ locale }: { locale: Locale }) {
  const paragraphs = locale === "en" ? PARAGRAPHS_EN : PARAGRAPHS;
  return (
    <section className="bg-white py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2 lg:px-8">
        {/* Text */}
        <div className="order-2 flex flex-col items-start gap-5 text-start lg:order-1">
          <span className="rounded-full bg-brand/10 px-4 py-1.5 text-sm font-medium text-brand-dark">
            {pick(locale, "عن عبور", "About Oboor")}
          </span>
          <h2 className="text-3xl font-extrabold text-ink sm:text-4xl">
            {pick(
              locale,
              <>تعرّف على مركز <span className="text-brand">عبور</span></>,
              <>Get to know <span className="text-brand">Oboor</span> Center</>
            )}
          </h2>
          {paragraphs.map((p, i) => (
            <p key={i} className="text-sm leading-7 text-ink-muted">{p}</p>
          ))}
          <Link
            href="/about"
            className="mt-2 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            {pick(locale, "تَعرّف أكثر", "Learn More")}
          </Link>
        </div>

        {/* Images */}
        <div className="relative order-1 h-[460px] lg:order-2">
          <div className="absolute bottom-0 right-0 h-[360px] w-[58%] overflow-hidden rounded-3xl shadow-lg">
            <Image src="/figma/home/imgImageWithFallback2.jpg" alt={pick(locale, "طفلة في مركز عبور", "A girl at Oboor Center")} fill sizes="(max-width:1024px) 100vw, 45vw" className="object-cover" />
          </div>
          <div className="absolute left-0 top-0 h-[300px] w-[52%] overflow-hidden rounded-3xl shadow-xl ring-8 ring-white">
            <Image src="/figma/home/imgImageWithFallback1.jpg" alt={pick(locale, "جلسة تأهيل", "A rehabilitation session")} fill sizes="(max-width:1024px) 100vw, 45vw" className="object-cover" />
          </div>
          {/* Floating badge */}
          <div className="absolute bottom-6 right-[42%] flex items-center gap-3 rounded-2xl bg-white p-3 shadow-xl ring-1 ring-line">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7.4-6.3-4.6L5.7 21l2.3-7.4-6-4.6h7.6L12 2z" /></svg>
            </div>
            <div className="text-start">
              <p className="text-sm font-bold text-ink">{pick(locale, "مركز معتمد", "Accredited Center")}</p>
              <p className="text-xs text-ink-muted">{pick(locale, "خدمات تأهيلية متكاملة", "Integrated rehabilitation services")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
