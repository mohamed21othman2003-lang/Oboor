import Image from "next/image";
import { pick, type Locale } from "@/i18n/config";

const STORIES = [
  {
    img: "/figma/home/imgImageWithFallback3.png",
    program: "برنامج التدخل المبكر",
    duration: "٢٠ شهراً من البرنامج",
    name: "سارة",
    age: "٨ سنوات",
    before: "لم تكن تستطيع التواصل بشكل مستقل",
    after: "باتت تتواصل بجمل كاملة وتنخرط في الأنشطة الاجتماعية",
    quote: "مركز عبور غيّر حياة ابنتي تماماً. رأيت تطوراً لم أكن أتخيله ممكناً.",
    parent: "والدة سارة",
    period: "٣ أشهر",
  },
  {
    img: "/figma/home/imgImageWithFallback4.png",
    program: "العلاج الوظيفي",
    duration: "١٢ شهراً من الجلسات",
    name: "أحمد",
    age: "٦ سنوات",
    before: "صعوبة في التركيز والمهارات الحركية",
    after: "تحسّن ملحوظ في التركيز والاعتماد على النفس",
    quote: "الفريق محترف ويتعامل بإنسانية عالية مع أبنائنا.",
    parent: "والدة أحمد",
    period: "٦ أشهر",
  },
  {
    img: "/figma/home/imgImageWithFallback5.png",
    program: "النطق والتخاطب",
    duration: "٢ شهراً من جلسات النطق",
    name: "مريم",
    age: "٥ سنوات",
    before: "تأخر في النطق والتخاطب",
    after: "أصبحت تعبّر عن احتياجاتها بوضوح وثقة",
    quote: "نتائج حقيقية خلال أشهر قليلة، شكراً لكل القائمين على المركز.",
    parent: "أم مريم",
    period: "٤ أشهر",
  },
];

const STORIES_EN: typeof STORIES = [
  {
    img: "/figma/home/imgImageWithFallback3.png",
    program: "Early Intervention Program",
    duration: "20 months in the program",
    name: "Sara",
    age: "8 years",
    before: "Was unable to communicate independently",
    after: "Now communicates in full sentences and takes part in social activities",
    quote: "Oboor Center completely changed my daughter's life. I saw progress I never imagined possible.",
    parent: "Sara's mother",
    period: "3 months",
  },
  {
    img: "/figma/home/imgImageWithFallback4.png",
    program: "Occupational Therapy",
    duration: "12 months of sessions",
    name: "Ahmed",
    age: "6 years",
    before: "Difficulty with focus and motor skills",
    after: "Noticeable improvement in focus and self-reliance",
    quote: "The team is professional and treats our children with great compassion.",
    parent: "Ahmed's mother",
    period: "6 months",
  },
  {
    img: "/figma/home/imgImageWithFallback5.png",
    program: "Speech & Language Therapy",
    duration: "2 months of speech sessions",
    name: "Maryam",
    age: "5 years",
    before: "Delay in speech and language",
    after: "Now expresses her needs clearly and confidently",
    quote: "Real results within just a few months — thank you to everyone at the center.",
    parent: "Maryam's mother",
    period: "4 months",
  },
];

function Story({ s, locale }: { s: (typeof STORIES)[number]; locale: Locale }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-white text-start shadow-lg">
      <div className="relative h-48 shrink-0">
        <Image src={s.img} alt={s.name} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover" />
        <span className="absolute right-3 top-3 rounded-full bg-brand px-3 py-1 text-[11px] font-semibold text-white">{s.program}</span>
        <span className="absolute bottom-3 left-3 rounded-lg bg-black/55 px-3 py-1 text-[11px] font-medium text-white backdrop-blur">{s.duration}</span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-4 text-base font-bold text-ink">{s.name} - {s.age}</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-[#fdeced] p-3">
            <p className="mb-1 text-[11px] font-semibold text-[#c0392b]">{pick(locale, "قبل الالتحاق", "Before Enrollment")}</p>
            <p className="text-xs leading-6 text-ink-muted">{s.before}</p>
          </div>
          <div className="rounded-lg bg-brand/10 p-3">
            <p className="mb-1 text-[11px] font-semibold text-brand-dark">{pick(locale, "بعد البرنامج", "After the Program")}</p>
            <p className="text-xs leading-6 text-ink-muted">{s.after}</p>
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-surface p-4">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="mb-2 text-brand/40"><path d="M7 7h4v10H3v-6a4 4 0 0 1 4-4zm10 0h4v10h-8v-6a4 4 0 0 1 4-4z" /></svg>
          <p className="text-sm leading-7 text-ink">{s.quote}</p>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-line pt-3 text-xs text-ink-muted">
          <span className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
              {s.period}
            </span>
            <span className="flex items-center gap-1">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
              {s.age}
            </span>
          </span>
          <span className="font-semibold text-brand-dark">{s.parent}</span>
        </div>
      </div>
    </div>
  );
}

export default function SuccessStories({ locale }: { locale: Locale }) {
  const stories = locale === "en" ? STORIES_EN : STORIES;
  return (
    <section className="relative overflow-hidden bg-gradient-to-bl from-brand-deep to-[#0a2329] py-20">
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-12 text-center">
          <span className="rounded-full bg-brand/15 px-4 py-1.5 text-sm font-medium text-[#7ee8f0]">{pick(locale, "أبطال عبور", "Oboor Champions")}</span>
          <h2 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl">
            {pick(
              locale,
              <>عبروا، <span className="text-brand">وعبّروا!</span></>,
              <>They crossed barriers and found <span className="text-brand">their voice</span></>
            )}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-white/70">
            {pick(
              locale,
              "قصص لحياة تغيرت، وملامح طفولة استعادت بهجتها، نفخر بمسيرة رافقنا فيها أبطالنا من أول خطوة وحتى التمكين.",
              "Stories of transformed lives and childhoods that have regained their joy. We take pride in the journeys we have accompanied — supporting our champions from their very first step to empowerment."
            )}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stories.map((s) => (
            <Story key={s.name} s={s} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  );
}
