# -*- coding: utf-8 -*-
from django.core.management.base import BaseCommand
from content.m_home import HeroSlide, StatItem, FeatureItem, GalleryImage

# Shared hero badge/cta (constants in src/components/home/Hero.tsx)
HERO_BADGE_AR = "نرعى نقاءهم، ونبني غدهم"
HERO_BADGE_EN = "Nurturing Their Potential, Shaping Their Future"
HERO_CTA_AR = "من هنا، نُمكّنهم"
HERO_CTA_EN = "From Here, We Empower Them"

# Hero slides — richer copy + images from the live Hero.tsx component
HERO = [
    ("s1", "/figma/home/imgImageWithFallback.jpg",
     ("مركز عبور للرعاية النهارية والتأهيل",
      "أبناؤكم في أيدٍ أمينة، يكبرون ويعبرون؛ نحتوي نقاءهم بقلوبٍ حانية، ونرسم خطاهم ببرامج متكاملة، يتعلموا منها مهارات الحياة بثقة، ليعبروا نحو غدٍ يملؤه الأمل والسعة."),
     ("Oboor Day Care & Rehabilitation Center",
      "Your children are in safe and caring hands. They grow and move forward with confidence. We nurture their purity with compassionate hearts and guide their journey through integrated programs that build life skills and empower them toward a future filled with hope and opportunity.")),
    ("s2", "/figma/home/hero-slide2-clean.jpg",
     ("التدخل المبكر خطوة مبكرة في الصغر تُنير سائر العُمر",
      "من التشخيص المبكر والتدخل الفوري، نرافق أطفالكم برعايةٍ تُساند نموهم وتُنمّي مهاراتهم، ليندمجوا مع أقرانهم."),
     ("Early Intervention: A Small Step in Childhood That Illuminates a Lifetime",
      "Through early diagnosis and timely intervention, we support your children with care that fosters their growth and skill development, helping them integrate confidently with their peers.")),
    ("s3", "/figma/home/hero-slide3.jpg",
     ("ليُعبّروا بأصواتهم ويُعبّروا بخطواتهم",
      "عبر برامج متكاملة تجمع بين رعاية النطق، والتكامل الحسي، والعلاج الوظيفي، نأخذ بأيدي أطفالكم برفقٍ مستندين إلى أحدث الأساليب الدولية، لتنمو قدراتهم ويعبروا لمستقبلهم."),
     ("So They Can Express Themselves and Move Forward with Confidence",
      "Through integrated programs that combine speech therapy, sensory integration, and occupational therapy, we gently support your children using the latest international approaches, helping them develop their abilities and move confidently toward their future.")),
]

# Stats — 9 items from the live Stats.tsx (richer than collections.ts which has 8)
STATS = [
    # key, value, icon, ar(label, note), en(label, note)
    ("n1", "+6,300", "users",
     ("مستفيد احتُضن بحب", "من مختلف أرجاء الوطن"),
     ("Beneficiaries supported with care", "From across the Kingdom")),
    ("n2", "+3,200,000", "calendar",
     ("جلسة علاجية تمت", "بأعلى معايير الإتقان والتفاني"),
     ("Therapeutic sessions delivered with dedication", "To the highest standards of quality and care")),
    ("n3", "+155,000", "clipboard",
     ("رحلة تقييم وتشخيص", "بأدوات حديثة ورؤيةٍ دقيقة"),
     ("Assessment and diagnostic journeys conducted", "Using advanced tools and precise evaluation")),
    ("n4", "+48,000", "heart",
     ("خدمة تلامس الاحتياج", "بكل تفانٍ واهتمام"),
     ("Specialized services delivered", "With full commitment and attention")),
    ("n5", "+10,000", "layers",
     ("جلسات وبرامج", "لكل طفل ومراجع"),
     ("Sessions and structured programs provided", "For every child and individual we serve")),
    ("n6", "+320", "document",
     ("خطة تأهيل أنشأناها", "ولأجل طفلك سخّرناها"),
     ("Individualized rehabilitation plans designed", "Tailored specifically for each child's needs")),
    ("n7", "+43", "pin",
     ("نقطة رعايةٍ ولقاء", "تُغطّي أرجاء الوطن"),
     ("Care points across the Kingdom", "Extending our reach nationwide")),
    ("n8", "+19", "trophy",
     ("عامًا في الريادة", "في مجالات التأهيل والرعاية"),
     ("Years of leadership in rehabilitation and care", "A legacy of expertise and trust")),
    ("n9", "+7", "book",
     ("برامج تأهيلية", "لكل مرحلةٍ وعمر"),
     ("Rehabilitation programs", "Across all stages and ages")),
]

# Features — richer notes from the live WhyUs.tsx component
FEATURES = [
    ("f1", "users",
     ("فريقنا", "كفاءات تخصصية متكاملة (تربية خاصة، نطق، علاج وظيفي وطبيعي، ونفسي) تعمل بروح الجسد الواحد."),
     ("Our Team", "An integrated group of specialists (special education, speech therapy, occupational therapy, physical therapy, and psychology) working in harmony as one unified team.")),
    ("f2", "book",
     ("منهجنا", "برامج تأهيلية معتمدة علميًا وتستند إلى أحدث الممارسات الدولية."),
     ("Our Approach", "Scientifically grounded rehabilitation programs based on the latest international practices.")),
    ("f3", "target",
     ("خططنا", "أهداف محددة بوضوح، ومتابعة دقيقة تقيس كل خطوة تطوّر."),
     ("Our Plans", "Clearly defined goals with precise monitoring that tracks every step of development.")),
    ("f4", "heart",
     ("شراكتنا", "الأسرة هي الشريك الأول؛ نمكّنها بالدعم والإرشاد ليمتد الأثر في المنزل."),
     ("Our Partnership", "The family is our primary partner; we empower and support them so the impact extends into the home environment.")),
    ("f5", "chat",
     ("تقاريرنا", "تواصل مستمر وتقارير دورية تضع الأسرة في قلب الرحلة وتفاصيلها."),
     ("Our Reports", "Continuous communication and periodic reports that keep families at the heart of the journey.")),
    ("f6", "shield",
     ("بيئتنا", "مساحات آمنة ومحفّزة صُممت لتمنح طفلك الأمان وتُحفّز قدراته."),
     ("Our Environment", "Safe and stimulating spaces designed to provide comfort while enhancing your child's abilities.")),
]

# Gallery — the 7 home-page Gallery.tsx images, with bilingual captions
# (captions from collections.ts gallery seed, extended across the live image set)
GALLERY = [
    ("g1", "/figma/home/imgImageWithFallback6.png",
     ("من أنشطة المركز", "From the center's activities")),
    ("g2", "/figma/home/imgImageWithFallback7.jpg",
     ("جلسة تأهيلية", "A rehabilitation session")),
    ("g3", "/figma/home/imgImageWithFallback8.png",
     ("من أنشطة المركز", "From the center's activities")),
    ("g4", "/figma/home/imgImageWithFallback9.png",
     ("جلسة تأهيلية", "A rehabilitation session")),
    ("g5", "/figma/home/imgImageWithFallback10.jpg",
     ("من أنشطة المركز", "From the center's activities")),
    ("g6", "/figma/home/imgImageWithFallback11.jpg",
     ("جلسة تأهيلية", "A rehabilitation session")),
    ("g7", "/figma/home/imgImageWithFallback12.jpg",
     ("من أنشطة المركز", "From the center's activities")),
]


class Command(BaseCommand):
    help = "Seed the home page sections (hero, stats, features) and gallery from the original site content."

    def handle(self, *args, **opts):
        hero_n = stat_n = feat_n = gal_n = 0

        for i, (key, image, ar, en) in enumerate(HERO):
            HeroSlide.objects.update_or_create(
                key=key,
                defaults=dict(
                    order=i, image=image, published=True,
                    badge_ar=HERO_BADGE_AR, badge_en=HERO_BADGE_EN,
                    heading_ar=ar[0], desc_ar=ar[1],
                    heading_en=en[0], desc_en=en[1],
                    cta_ar=HERO_CTA_AR, cta_en=HERO_CTA_EN,
                ),
            )
            hero_n += 1

        for i, (key, value, icon, ar, en) in enumerate(STATS):
            StatItem.objects.update_or_create(
                key=key,
                defaults=dict(
                    order=i, value=value, icon=icon, published=True,
                    label_ar=ar[0], note_ar=ar[1],
                    label_en=en[0], note_en=en[1],
                ),
            )
            stat_n += 1

        for i, (key, icon, ar, en) in enumerate(FEATURES):
            FeatureItem.objects.update_or_create(
                key=key,
                defaults=dict(
                    order=i, icon=icon, published=True,
                    title_ar=ar[0], note_ar=ar[1],
                    title_en=en[0], note_en=en[1],
                ),
            )
            feat_n += 1

        for i, (key, image, cap) in enumerate(GALLERY):
            GalleryImage.objects.update_or_create(
                key=key,
                defaults=dict(
                    order=i, image=image, published=True,
                    caption_ar=cap[0], caption_en=cap[1],
                ),
            )
            gal_n += 1

        self.stdout.write(self.style.SUCCESS(
            f"Seeded home content: {hero_n} hero slides, {stat_n} stats, "
            f"{feat_n} features, {gal_n} gallery images."
        ))
