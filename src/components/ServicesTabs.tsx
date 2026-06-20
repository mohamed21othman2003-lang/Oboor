"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ProgramCard, { type Program } from "@/components/ProgramCard";
import { pick, type Locale } from "@/i18n/config";

const PROGRAMS_AR: Program[] = [
  { badge: "برنامج", slug: "montaliq", title: "برنامج منطلق", desc: "برنامج متكامل لدعم الأطفال ذوي اضطراب طيف التوحد وتنمية مهاراتهم التواصلية والسلوكية.", suits: "الأطفال ذوو اضطراب طيف التوحد", age: "من سنتين إلى 12 سنة", features: ["جلسات فردية وجماعية", "تقييم دوري للتقدم", "مشاركة الأسرة في الخطة العلاجية"], regions: ["الرياض", "جدة", "الشرقية"] },
  { badge: "برنامج", slug: "faal", title: "برنامج فعّال", desc: "برنامج متخصص في دعم الأطفال ذوي اضطراب نقص الانتباه وفرط الحركة وتعزيز تركيزهم.", suits: "الأطفال ذوو اضطراب ADHD", age: "من 4 إلى 14 سنة", features: ["برنامج هيكلي منظّم", "تدريب مهارات الانتباه", "ورش تفاعلية للأهالي"], regions: ["الرياض", "جدة", "الشرقية"] },
  { badge: "برنامج", slug: "school-prep", title: "برنامج الإعداد المدرسي", desc: "يُهيِّئ الطفل أكاديمياً وسلوكياً للاندماج الناجح في البيئة المدرسية.", suits: "الأطفال ما قبل سن المدرسة", age: "من 4 إلى 7 سنوات", features: ["تدريب على الاستعداد للقراءة والكتابة", "مهارات الانتظار والتسلسل", "التكيف مع البيئة الجماعية"], regions: ["الرياض", "جدة"] },
  { badge: "برنامج", slug: "khuta", title: "برنامج خطى", desc: "برنامج متخصص لتطوير مهارات الحركة والتنقل والاستقلالية الحركية عند الأطفال.", suits: "الأطفال ذوو الإعاقة الحركية", age: "من الولادة إلى 3 سنوات", features: ["خطط تدخل فردية", "تدريب الأسرة على الأنشطة اليومية", "تقييم نمائي شامل"], regions: ["الرياض", "الشرقية"] },
  { badge: "برنامج", slug: "mental-dev", title: "برنامج التنمية الذهنية", desc: "يدعم الأطفال ذوي الإعاقة الذهنية في بناء مهارات التفكير والتعلم والاستقلالية.", suits: "الأطفال ذوو الإعاقة الذهنية", age: "من سنة إلى 6 سنوات", features: ["تمارين إدراكية تدريجية", "أنشطة حسية حركية", "تعزيز التواصل اللفظي وغير اللفظي"], regions: ["الرياض"] },
  { badge: "برنامج", slug: "girls", title: "برنامج عبور لتأهيل الفتيات", desc: "برنامج متكامل يراعي الاحتياجات التأهيلية الخاصة بالفتيات في بيئة داعمة وآمنة.", suits: "الفتيات ذوات الإعاقة", age: "من 15 سنة فأكثر", features: ["تدريب على مهارات العمل", "أنشطة الاندماج المجتمعي", "برامج المهارات اليومية المستقلة"], regions: ["الرياض", "جدة", "الشرقية"] },
  { badge: "برنامج", slug: "youth", title: "برنامج عبور لتأهيل الشباب", desc: "برنامج يُعدّ الشباب ذوي الإعاقة للاستقلالية والاندماج المهني والاجتماعي.", suits: "الشباب ذوو الإعاقة (١٥ سنة فأكثر)", age: "من 15 سنة فأكثر", features: ["تدريب على مهارات العمل", "أنشطة الاندماج المجتمعي", "برامج المهارات اليومية المستقلة"], regions: ["الرياض", "جدة", "الشرقية"] },
];

const PROGRAMS_EN: Program[] = [
  { badge: "Program", slug: "montaliq", title: "Montaliq Program", desc: "An integrated program to support children with Autism Spectrum Disorder and develop their communication and behavioral skills.", suits: "Children with Autism Spectrum Disorder", age: "From 2 to 12 years", features: ["Individual and group sessions", "Regular progress assessment", "Family involvement in the treatment plan"], regions: ["Riyadh", "Jeddah", "Eastern Province"] },
  { badge: "Program", slug: "faal", title: "Faal Program", desc: "A specialized program to support children with ADHD and strengthen their focus.", suits: "Children with ADHD", age: "From 4 to 14 years", features: ["A structured, organized program", "Attention skills training", "Interactive workshops for parents"], regions: ["Riyadh", "Jeddah", "Eastern Province"] },
  { badge: "Program", slug: "school-prep", title: "School Readiness Program", desc: "Prepares the child academically and behaviorally for successful integration into the school environment.", suits: "Pre-school children", age: "From 4 to 7 years", features: ["Reading and writing readiness training", "Waiting and sequencing skills", "Adapting to a group environment"], regions: ["Riyadh", "Jeddah"] },
  { badge: "Program", slug: "khuta", title: "Khuta Program", desc: "A specialized program to develop children's movement, mobility, and motor independence skills.", suits: "Children with physical disabilities", age: "From birth to 3 years", features: ["Individual intervention plans", "Training the family on daily activities", "Comprehensive developmental assessment"], regions: ["Riyadh", "Eastern Province"] },
  { badge: "Program", slug: "mental-dev", title: "Mental Development Program", desc: "Supports children with intellectual disability in building thinking, learning, and independence skills.", suits: "Children with intellectual disability", age: "From 1 to 6 years", features: ["Gradual cognitive exercises", "Sensory-motor activities", "Strengthening verbal and non-verbal communication"], regions: ["Riyadh"] },
  { badge: "Program", slug: "girls", title: "Oboor Girls Rehabilitation Program", desc: "An integrated program that addresses girls' specific rehabilitation needs in a supportive and safe environment.", suits: "Girls with disabilities", age: "From 15 years and above", features: ["Work skills training", "Community integration activities", "Independent daily living skills programs"], regions: ["Riyadh", "Jeddah", "Eastern Province"] },
  { badge: "Program", slug: "youth", title: "Oboor Youth Rehabilitation Program", desc: "A program that prepares youth with disabilities for independence and professional and social integration.", suits: "Youth with disabilities (15 years and above)", age: "From 15 years and above", features: ["Work skills training", "Community integration activities", "Independent daily living skills programs"], regions: ["Riyadh", "Jeddah", "Eastern Province"] },
];

const CLINICAL_AR: Program[] = [
  { badge: "خدمة", href: "/services/physical", title: "العلاج الطبيعي", desc: "علاج فيزيائي متخصص لتحسين القدرات الحركية وتأهيل الوظائف الجسمية.", features: ["تقييم حركي شامل", "تمارين تقوية وتوازن", "استخدام المعدات العلاجية الحديثة"], regions: ["الرياض", "جدة", "الشرقية"] },
  { badge: "خدمة", href: "/services/social", title: "الخدمات الاجتماعية", desc: "دعم اجتماعي متكامل للأسرة وتيسير الوصول إلى الموارد والبرامج الداعمة.", features: ["إدارة الحالات الاجتماعية", "التواصل مع الجهات الداعمة", "ورش توعية للأسر"], regions: ["الرياض", "جدة", "الشرقية"] },
  { badge: "خدمة", href: "/services/psychological", title: "الخدمات النفسية", desc: "تقييم نفسي شامل ومتخصص، وبرامج علاجية وإرشادية للطفل وأسرته.", features: ["التقييم النفسي الشامل", "العلاج السلوكي المعرفي", "إرشاد الأسرة وتقديم الدعم النفسي"], regions: ["الرياض", "جدة", "الشرقية"] },
  { badge: "خدمة", href: "/services/nursing", title: "خدمات التمريض", desc: "دعم تمريضي متخصص يضمن سلامة وصحة الطفل خلال رحلته التأهيلية.", features: ["متابعة صحية يومية", "إدارة الأدوية والجرعات", "التنسيق مع الفريق الطبي"], regions: ["الرياض", "الشرقية"] },
  { badge: "خدمة", href: "/services/speech", title: "التخاطب والنطق", desc: "تقييم وعلاج اضطرابات اللغة والنطق وتطوير مهارات التواصل الفعّال.", features: ["تقييم النطق واللغة", "علاج اضطرابات الكلام", "التواصل المعزز والبديل (AAC)"], regions: ["الرياض", "جدة", "الشرقية"] },
  { badge: "خدمة", href: "/services/occupational", title: "العلاج الوظيفي", desc: "تمكين الطفل من أداء مهام الحياة اليومية بشكل مستقل ومتطور.", features: ["مهارات العناية بالذات", "التكامل الحسي", "المهارات الحركية الدقيقة"], regions: ["الرياض", "جدة"] },
];

const CLINICAL_EN: Program[] = [
  { badge: "Service", href: "/services/physical", title: "Physical Therapy", desc: "Specialized physical therapy to improve motor abilities and rehabilitate physical functions.", features: ["Comprehensive motor assessment", "Strengthening and balance exercises", "Use of modern therapeutic equipment"], regions: ["Riyadh", "Jeddah", "Eastern Province"] },
  { badge: "Service", href: "/services/social", title: "Social Services", desc: "Integrated social support for the family and facilitated access to supportive resources and programs.", features: ["Social case management", "Coordination with supporting entities", "Awareness workshops for families"], regions: ["Riyadh", "Jeddah", "Eastern Province"] },
  { badge: "Service", href: "/services/psychological", title: "Psychological Services", desc: "Comprehensive, specialized psychological assessment along with therapeutic and counseling programs for the child and family.", features: ["Comprehensive psychological assessment", "Cognitive behavioral therapy", "Family counseling and psychological support"], regions: ["Riyadh", "Jeddah", "Eastern Province"] },
  { badge: "Service", href: "/services/nursing", title: "Nursing Services", desc: "Specialized nursing support that ensures the child's safety and health throughout their rehabilitation journey.", features: ["Daily health monitoring", "Medication and dosage management", "Coordination with the medical team"], regions: ["Riyadh", "Eastern Province"] },
  { badge: "Service", href: "/services/speech", title: "Speech & Language Therapy", desc: "Assessment and treatment of language and speech disorders and developing effective communication skills.", features: ["Speech and language assessment", "Treatment of speech disorders", "Augmentative and Alternative Communication (AAC)"], regions: ["Riyadh", "Jeddah", "Eastern Province"] },
  { badge: "Service", href: "/services/occupational", title: "Occupational Therapy", desc: "Enabling the child to perform daily life tasks independently and progressively.", features: ["Self-care skills", "Sensory Integration", "Fine motor skills"], regions: ["Riyadh", "Jeddah"] },
];

const TECHNIQUES_AR: Program[] = [
  { badge: "تقنية", href: "/techniques/kinems", title: "KINEMS", desc: "تقنية تعليمية حركية تعتمد على التفاعل الحسي والحركي لدعم التعلم والمهارات الأكاديمية للأطفال.", features: ["التعلم بالحركة", "تنمية المهارات الحسية", "دعم المهارات الأكاديمية"], regions: ["الرياض", "جدة", "الشرقية"] },
  { badge: "تقنية", href: "/techniques/cogmed", title: "COGMED", desc: "برنامج تدريبي رقمي يساعد على تطوير الذاكرة العاملة والقدرات المعرفية للأطفال من خلال تدريبات ذهنية متخصصة.", features: ["تقوية الذاكرة العاملة", "تحسين المهارات المعرفية", "تدريبات رقمية تفاعلية"], regions: ["الرياض", "جدة", "الشرقية"] },
  { badge: "تقنية", href: "/techniques/play-attention", title: "PLAY ATTENTION", desc: "تقنية تدريب معرفي لتحسين الانتباه والتركيز والوظائف التنفيذية باستخدام أنشطة تفاعلية مخصصة للأطفال.", features: ["تحسين التركيز والانتباه", "دعم الذاكرة والإدراك", "جلسات تفاعلية مخصصة"], regions: ["الرياض", "جدة", "الشرقية"] },
  { badge: "تقنية", href: "/techniques/nao-robot", title: "NAO Robot", desc: "روبوت تفاعلي يدعم الأطفال في تطوير التواصل والتفاعل الاجتماعي من خلال جلسات وأنشطة موجهة.", features: ["دعم التواصل الاجتماعي", "تقليل القلق والتوتر", "أنشطة تفاعلية ممتعة"], regions: ["الرياض", "جدة", "الشرقية"] },
  { badge: "تقنية", href: "/techniques/floreo", title: "Floreo", desc: "تقنية واقع افتراضي (VR) تساعد الأطفال على ممارسة المهارات الاجتماعية والسلوكية داخل بيئة آمنة وتفاعلية.", features: ["تدريب اجتماعي تفاعلي", "محاكاة مواقف يومية", "دعم التواصل البصري"], regions: ["الرياض", "جدة", "الشرقية"] },
  { badge: "تقنية", href: "/techniques/photon-robots", title: "Photon Robots", desc: "روبوتات تعليمية تفاعلية تساعد الأطفال على تطوير التواصل والمهارات الاجتماعية بطريقة ممتعة وآمنة.", features: ["تنمية التواصل الاجتماعي", "تعزيز التفاعل", "أنشطة تعليمية ذكية"], regions: ["الرياض", "جدة", "الشرقية"] },
  { badge: "تقنية", href: "/techniques/auditory-integration", title: "التكامل السمعي", desc: "برنامج يساعد على تحسين معالجة المعلومات السمعية والتركيز والاستجابة للمؤثرات الصوتية المختلفة.", features: ["تحسين الانتباه السمعي", "تقليل الحساسية الصوتية", "دعم التركيز والإدراك"], regions: ["الرياض", "جدة", "الشرقية"] },
];

const TECHNIQUES_EN: Program[] = [
  { badge: "Technology", href: "/techniques/kinems", title: "KINEMS", desc: "A movement-based educational technology that relies on sensory and motor interaction to support children's learning and academic skills.", features: ["Learning through movement", "Developing sensory skills", "Supporting academic skills"], regions: ["Riyadh", "Jeddah", "Eastern Province"] },
  { badge: "Technology", href: "/techniques/cogmed", title: "COGMED", desc: "A digital training program that helps develop children's working memory and cognitive abilities through specialized mental exercises.", features: ["Strengthening working memory", "Improving cognitive skills", "Interactive digital exercises"], regions: ["Riyadh", "Jeddah", "Eastern Province"] },
  { badge: "Technology", href: "/techniques/play-attention", title: "PLAY ATTENTION", desc: "A cognitive training technology to improve attention, focus, and executive functions using interactive activities designed for children.", features: ["Improving focus and attention", "Supporting memory and cognition", "Customized interactive sessions"], regions: ["Riyadh", "Jeddah", "Eastern Province"] },
  { badge: "Technology", href: "/techniques/nao-robot", title: "NAO Robot", desc: "An interactive robot that supports children in developing communication and social interaction through guided sessions and activities.", features: ["Supporting social communication", "Reducing anxiety and stress", "Fun interactive activities"], regions: ["Riyadh", "Jeddah", "Eastern Province"] },
  { badge: "Technology", href: "/techniques/floreo", title: "Floreo", desc: "A Virtual Reality (VR) technology that helps children practice social and behavioral skills within a safe and interactive environment.", features: ["Interactive social training", "Simulating daily situations", "Supporting eye contact"], regions: ["Riyadh", "Jeddah", "Eastern Province"] },
  { badge: "Technology", href: "/techniques/photon-robots", title: "Photon Robots", desc: "Interactive educational robots that help children develop communication and social skills in a fun and safe way.", features: ["Developing social communication", "Enhancing interaction", "Smart educational activities"], regions: ["Riyadh", "Jeddah", "Eastern Province"] },
  { badge: "Technology", href: "/techniques/auditory-integration", title: "Auditory Integration", desc: "A program that helps improve auditory information processing, focus, and response to different sound stimuli.", features: ["Improving auditory attention", "Reducing sound sensitivity", "Supporting focus and cognition"], regions: ["Riyadh", "Jeddah", "Eastern Province"] },
];

// مصدر مشترك لفئات الخدمات (يستخدمه شريط البحث للفلترة)
export type ServiceCategoryKey = "programs" | "clinical" | "techniques";
export function serviceCategories(locale: Locale) {
  return [
    { key: "programs" as const, label: pick(locale, "برامج تأهيلية", "Rehabilitation Programs"), items: locale === "en" ? PROGRAMS_EN : PROGRAMS_AR },
    { key: "clinical" as const, label: pick(locale, "خدمات عيادية", "Clinical Services"), items: locale === "en" ? CLINICAL_EN : CLINICAL_AR },
    { key: "techniques" as const, label: pick(locale, "تقنيات تأهيلية", "Rehabilitation Technologies"), items: locale === "en" ? TECHNIQUES_EN : TECHNIQUES_AR },
  ];
}
export function serviceRegions(locale: Locale): string[] {
  const all = serviceCategories(locale).flatMap((c) => c.items.flatMap((i) => i.regions ?? []));
  return [...new Set(all)];
}

const bookIcon = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>;
const stethoscopeIcon = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 3v6a5 5 0 0 0 10 0V3" /><path d="M4 3H2M14 3h-2M9 14v3a4 4 0 0 0 8 0v-1" /><circle cx="19" cy="13" r="2" /></svg>;
const chipIcon = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="6" y="6" width="12" height="12" rx="2" /><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" /></svg>;

export default function ServicesTabs({ locale = "ar" }: { locale?: Locale }) {
  const PROGRAMS = locale === "en" ? PROGRAMS_EN : PROGRAMS_AR;
  const CLINICAL = locale === "en" ? CLINICAL_EN : CLINICAL_AR;
  const TECHNIQUES = locale === "en" ? TECHNIQUES_EN : TECHNIQUES_AR;

  const TABS = [
    { key: "programs", label: pick(locale, "البرامج التأهيلية", "Rehabilitation Programs"), heading: pick(locale, "برامجنا التأهيلية", "Our Rehabilitation Programs"), intro: pick(locale, "صُمِّمت كل برامجنا التأهيلية وفق معايير علمية معتمدة لخدمة فئات محددة من الأطفال وفق احتياجاتهم الدقيقة.", "All our rehabilitation programs are designed to accredited scientific standards to serve specific groups of children according to their precise needs."), icon: bookIcon, data: PROGRAMS },
    { key: "clinical", label: pick(locale, "الخدمات العيادية", "Clinical Services"), heading: pick(locale, "خدماتنا العيادية", "Our Clinical Services"), intro: pick(locale, "تقدم مراكز عبور طيفاً واسعاً من الخدمات العيادية التي يشرف عليها متخصصون مؤهلون في مجالات الصحة والتأهيل.", "Oboor Centers offer a wide range of clinical services supervised by qualified specialists in health and rehabilitation fields."), icon: stethoscopeIcon, data: CLINICAL },
    { key: "techniques", label: pick(locale, "التقنيات التأهيلية", "Rehabilitation Technologies"), heading: pick(locale, "تقنياتنا التأهيلية", "Our Rehabilitation Technologies"), intro: pick(locale, "نستخدم في مراكز عبور تقنيات تأهيلية مبتكرة تدعم العملية العلاجية وتجعلها أكثر تفاعلاً وفاعلية.", "At Oboor Centers we use innovative rehabilitation technologies that support the therapeutic process and make it more interactive and effective."), icon: chipIcon, data: TECHNIQUES },
  ] as const;

  const [active, setActive] = useState<(typeof TABS)[number]["key"]>("programs");
  const current = TABS.find((t) => t.key === active)!;

  const region = useSearchParams().get("region");
  const items = region ? current.data.filter((p) => p.regions?.includes(region)) : current.data;

  // افتح التاب الصحيح حسب الرابط (#clinical / #techniques / #programs)
  useEffect(() => {
    const apply = () => {
      const h = window.location.hash.replace("#", "");
      if (h === "clinical" || h === "techniques" || h === "programs") setActive(h);
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  const selectTab = (key: (typeof TABS)[number]["key"]) => {
    setActive(key);
    if (typeof window !== "undefined") window.history.replaceState(null, "", `#${key}`);
  };

  return (
    <>
      {/* Tab bar (sits under the hero) */}
      <div className="bg-gradient-to-b from-white to-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-6 border-b border-line sm:gap-8">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => selectTab(t.key)}
                className={`-mb-px flex items-center gap-2 border-b-2 pb-3 text-sm font-bold transition-colors sm:text-base ${
                  active === t.key ? "border-brand text-brand" : "border-transparent text-ink-muted hover:text-brand"
                }`}
              >
                {t.label}
                <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${active === t.key ? "bg-brand text-white" : "bg-surface text-ink-soft"}`}>
                  {t.data.length}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <section id="services-tabs" className="scroll-mt-24 bg-white py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-10 text-start">
            <h2 className="flex items-center justify-start gap-2 text-3xl font-extrabold text-ink">
              {current.heading}
              <span className="text-brand">{current.icon}</span>
            </h2>
            <p className="mt-3 max-w-3xl text-sm text-ink-muted">{current.intro}</p>
            {region && (
              <p className="mt-2 text-sm text-ink-muted">
                {pick(locale, "المنطقة: ", "Region: ")}<span className="font-bold text-brand-dark">{region}</span>
                {" — "}{pick(locale, `${items.length} نتيجة`, `${items.length} result(s)`)}
              </p>
            )}
          </div>
          {items.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {items.map((p) => (
                <ProgramCard key={p.title} p={p} locale={locale} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-line bg-surface p-12 text-center">
              <p className="text-base font-semibold text-ink">{pick(locale, "لا توجد نتائج في هذه المنطقة", "No results in this region")}</p>
              <p className="mt-1 text-sm text-ink-muted">{pick(locale, "جرّب منطقة أخرى أو تصفّح كل المناطق.", "Try another region or browse all regions.")}</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
