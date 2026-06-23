# -*- coding: utf-8 -*-
from django.core.management.base import BaseCommand

from content.m_sections import ServiceCard


# (AR, EN) pairs, parallel by index — copied verbatim from
# src/components/ServicesTabs.tsx

PROGRAMS = [
    (
        {"badge": "برنامج", "slug": "montaliq", "title": "برنامج منطلق", "desc": "برنامج متكامل لدعم الأطفال ذوي اضطراب طيف التوحد وتنمية مهاراتهم التواصلية والسلوكية.", "suits": "الأطفال ذوو اضطراب طيف التوحد", "age": "من سنتين إلى 12 سنة", "features": ["جلسات فردية وجماعية", "تقييم دوري للتقدم", "مشاركة الأسرة في الخطة العلاجية"], "regions": ["الرياض", "جدة", "الشرقية"]},
        {"badge": "Program", "slug": "montaliq", "title": "Montaliq Program", "desc": "An integrated program to support children with Autism Spectrum Disorder and develop their communication and behavioral skills.", "suits": "Children with Autism Spectrum Disorder", "age": "From 2 to 12 years", "features": ["Individual and group sessions", "Regular progress assessment", "Family involvement in the treatment plan"], "regions": ["Riyadh", "Jeddah", "Eastern Province"]},
    ),
    (
        {"badge": "برنامج", "slug": "faal", "title": "برنامج فعّال", "desc": "برنامج متخصص في دعم الأطفال ذوي اضطراب نقص الانتباه وفرط الحركة وتعزيز تركيزهم.", "suits": "الأطفال ذوو اضطراب ADHD", "age": "من 4 إلى 14 سنة", "features": ["برنامج هيكلي منظّم", "تدريب مهارات الانتباه", "ورش تفاعلية للأهالي"], "regions": ["الرياض", "جدة", "الشرقية"]},
        {"badge": "Program", "slug": "faal", "title": "Faal Program", "desc": "A specialized program to support children with ADHD and strengthen their focus.", "suits": "Children with ADHD", "age": "From 4 to 14 years", "features": ["A structured, organized program", "Attention skills training", "Interactive workshops for parents"], "regions": ["Riyadh", "Jeddah", "Eastern Province"]},
    ),
    (
        {"badge": "برنامج", "slug": "school-prep", "title": "برنامج الإعداد المدرسي", "desc": "يُهيِّئ الطفل أكاديمياً وسلوكياً للاندماج الناجح في البيئة المدرسية.", "suits": "الأطفال ما قبل سن المدرسة", "age": "من 4 إلى 7 سنوات", "features": ["تدريب على الاستعداد للقراءة والكتابة", "مهارات الانتظار والتسلسل", "التكيف مع البيئة الجماعية"], "regions": ["الرياض", "جدة"]},
        {"badge": "Program", "slug": "school-prep", "title": "School Readiness Program", "desc": "Prepares the child academically and behaviorally for successful integration into the school environment.", "suits": "Pre-school children", "age": "From 4 to 7 years", "features": ["Reading and writing readiness training", "Waiting and sequencing skills", "Adapting to a group environment"], "regions": ["Riyadh", "Jeddah"]},
    ),
    (
        {"badge": "برنامج", "slug": "khuta", "title": "برنامج خطى", "desc": "برنامج متخصص لتطوير مهارات الحركة والتنقل والاستقلالية الحركية عند الأطفال.", "suits": "الأطفال ذوو الإعاقة الحركية", "age": "من الولادة إلى 3 سنوات", "features": ["خطط تدخل فردية", "تدريب الأسرة على الأنشطة اليومية", "تقييم نمائي شامل"], "regions": ["الرياض", "الشرقية"]},
        {"badge": "Program", "slug": "khuta", "title": "Khuta Program", "desc": "A specialized program to develop children's movement, mobility, and motor independence skills.", "suits": "Children with physical disabilities", "age": "From birth to 3 years", "features": ["Individual intervention plans", "Training the family on daily activities", "Comprehensive developmental assessment"], "regions": ["Riyadh", "Eastern Province"]},
    ),
    (
        {"badge": "برنامج", "slug": "mental-dev", "title": "برنامج التنمية الذهنية", "desc": "يدعم الأطفال ذوي الإعاقة الذهنية في بناء مهارات التفكير والتعلم والاستقلالية.", "suits": "الأطفال ذوو الإعاقة الذهنية", "age": "من سنة إلى 6 سنوات", "features": ["تمارين إدراكية تدريجية", "أنشطة حسية حركية", "تعزيز التواصل اللفظي وغير اللفظي"], "regions": ["الرياض"]},
        {"badge": "Program", "slug": "mental-dev", "title": "Mental Development Program", "desc": "Supports children with intellectual disability in building thinking, learning, and independence skills.", "suits": "Children with intellectual disability", "age": "From 1 to 6 years", "features": ["Gradual cognitive exercises", "Sensory-motor activities", "Strengthening verbal and non-verbal communication"], "regions": ["Riyadh"]},
    ),
    (
        {"badge": "برنامج", "slug": "girls", "title": "برنامج عبور لتأهيل الفتيات", "desc": "برنامج متكامل يراعي الاحتياجات التأهيلية الخاصة بالفتيات في بيئة داعمة وآمنة.", "suits": "الفتيات ذوات الإعاقة", "age": "من 15 سنة فأكثر", "features": ["تدريب على مهارات العمل", "أنشطة الاندماج المجتمعي", "برامج المهارات اليومية المستقلة"], "regions": ["الرياض", "جدة", "الشرقية"]},
        {"badge": "Program", "slug": "girls", "title": "Oboor Girls Rehabilitation Program", "desc": "An integrated program that addresses girls' specific rehabilitation needs in a supportive and safe environment.", "suits": "Girls with disabilities", "age": "From 15 years and above", "features": ["Work skills training", "Community integration activities", "Independent daily living skills programs"], "regions": ["Riyadh", "Jeddah", "Eastern Province"]},
    ),
    (
        {"badge": "برنامج", "slug": "youth", "title": "برنامج عبور لتأهيل الشباب", "desc": "برنامج يُعدّ الشباب ذوي الإعاقة للاستقلالية والاندماج المهني والاجتماعي.", "suits": "الشباب ذوو الإعاقة (١٥ سنة فأكثر)", "age": "من 15 سنة فأكثر", "features": ["تدريب على مهارات العمل", "أنشطة الاندماج المجتمعي", "برامج المهارات اليومية المستقلة"], "regions": ["الرياض", "جدة", "الشرقية"]},
        {"badge": "Program", "slug": "youth", "title": "Oboor Youth Rehabilitation Program", "desc": "A program that prepares youth with disabilities for independence and professional and social integration.", "suits": "Youth with disabilities (15 years and above)", "age": "From 15 years and above", "features": ["Work skills training", "Community integration activities", "Independent daily living skills programs"], "regions": ["Riyadh", "Jeddah", "Eastern Province"]},
    ),
]

CLINICAL = [
    (
        {"badge": "خدمة", "href": "/services/physical", "title": "العلاج الطبيعي", "desc": "علاج فيزيائي متخصص لتحسين القدرات الحركية وتأهيل الوظائف الجسمية.", "features": ["تقييم حركي شامل", "تمارين تقوية وتوازن", "استخدام المعدات العلاجية الحديثة"], "regions": ["الرياض", "جدة", "الشرقية"]},
        {"badge": "Service", "href": "/services/physical", "title": "Physical Therapy", "desc": "Specialized physical therapy to improve motor abilities and rehabilitate physical functions.", "features": ["Comprehensive motor assessment", "Strengthening and balance exercises", "Use of modern therapeutic equipment"], "regions": ["Riyadh", "Jeddah", "Eastern Province"]},
    ),
    (
        {"badge": "خدمة", "href": "/services/social", "title": "الخدمات الاجتماعية", "desc": "دعم اجتماعي متكامل للأسرة وتيسير الوصول إلى الموارد والبرامج الداعمة.", "features": ["إدارة الحالات الاجتماعية", "التواصل مع الجهات الداعمة", "ورش توعية للأسر"], "regions": ["الرياض", "جدة", "الشرقية"]},
        {"badge": "Service", "href": "/services/social", "title": "Social Services", "desc": "Integrated social support for the family and facilitated access to supportive resources and programs.", "features": ["Social case management", "Coordination with supporting entities", "Awareness workshops for families"], "regions": ["Riyadh", "Jeddah", "Eastern Province"]},
    ),
    (
        {"badge": "خدمة", "href": "/services/psychological", "title": "الخدمات النفسية", "desc": "تقييم نفسي شامل ومتخصص، وبرامج علاجية وإرشادية للطفل وأسرته.", "features": ["التقييم النفسي الشامل", "العلاج السلوكي المعرفي", "إرشاد الأسرة وتقديم الدعم النفسي"], "regions": ["الرياض", "جدة", "الشرقية"]},
        {"badge": "Service", "href": "/services/psychological", "title": "Psychological Services", "desc": "Comprehensive, specialized psychological assessment along with therapeutic and counseling programs for the child and family.", "features": ["Comprehensive psychological assessment", "Cognitive behavioral therapy", "Family counseling and psychological support"], "regions": ["Riyadh", "Jeddah", "Eastern Province"]},
    ),
    (
        {"badge": "خدمة", "href": "/services/nursing", "title": "خدمات التمريض", "desc": "دعم تمريضي متخصص يضمن سلامة وصحة الطفل خلال رحلته التأهيلية.", "features": ["متابعة صحية يومية", "إدارة الأدوية والجرعات", "التنسيق مع الفريق الطبي"], "regions": ["الرياض", "الشرقية"]},
        {"badge": "Service", "href": "/services/nursing", "title": "Nursing Services", "desc": "Specialized nursing support that ensures the child's safety and health throughout their rehabilitation journey.", "features": ["Daily health monitoring", "Medication and dosage management", "Coordination with the medical team"], "regions": ["Riyadh", "Eastern Province"]},
    ),
    (
        {"badge": "خدمة", "href": "/services/speech", "title": "التخاطب والنطق", "desc": "تقييم وعلاج اضطرابات اللغة والنطق وتطوير مهارات التواصل الفعّال.", "features": ["تقييم النطق واللغة", "علاج اضطرابات الكلام", "التواصل المعزز والبديل (AAC)"], "regions": ["الرياض", "جدة", "الشرقية"]},
        {"badge": "Service", "href": "/services/speech", "title": "Speech & Language Therapy", "desc": "Assessment and treatment of language and speech disorders and developing effective communication skills.", "features": ["Speech and language assessment", "Treatment of speech disorders", "Augmentative and Alternative Communication (AAC)"], "regions": ["Riyadh", "Jeddah", "Eastern Province"]},
    ),
    (
        {"badge": "خدمة", "href": "/services/occupational", "title": "العلاج الوظيفي", "desc": "تمكين الطفل من أداء مهام الحياة اليومية بشكل مستقل ومتطور.", "features": ["مهارات العناية بالذات", "التكامل الحسي", "المهارات الحركية الدقيقة"], "regions": ["الرياض", "جدة"]},
        {"badge": "Service", "href": "/services/occupational", "title": "Occupational Therapy", "desc": "Enabling the child to perform daily life tasks independently and progressively.", "features": ["Self-care skills", "Sensory Integration", "Fine motor skills"], "regions": ["Riyadh", "Jeddah"]},
    ),
]

TECHNIQUES = [
    (
        {"badge": "تقنية", "href": "/techniques/kinems", "title": "KINEMS", "desc": "تقنية تعليمية حركية تعتمد على التفاعل الحسي والحركي لدعم التعلم والمهارات الأكاديمية للأطفال.", "features": ["التعلم بالحركة", "تنمية المهارات الحسية", "دعم المهارات الأكاديمية"], "regions": ["الرياض", "جدة", "الشرقية"]},
        {"badge": "Technology", "href": "/techniques/kinems", "title": "KINEMS", "desc": "A movement-based educational technology that relies on sensory and motor interaction to support children's learning and academic skills.", "features": ["Learning through movement", "Developing sensory skills", "Supporting academic skills"], "regions": ["Riyadh", "Jeddah", "Eastern Province"]},
    ),
    (
        {"badge": "تقنية", "href": "/techniques/cogmed", "title": "COGMED", "desc": "برنامج تدريبي رقمي يساعد على تطوير الذاكرة العاملة والقدرات المعرفية للأطفال من خلال تدريبات ذهنية متخصصة.", "features": ["تقوية الذاكرة العاملة", "تحسين المهارات المعرفية", "تدريبات رقمية تفاعلية"], "regions": ["الرياض", "جدة", "الشرقية"]},
        {"badge": "Technology", "href": "/techniques/cogmed", "title": "COGMED", "desc": "A digital training program that helps develop children's working memory and cognitive abilities through specialized mental exercises.", "features": ["Strengthening working memory", "Improving cognitive skills", "Interactive digital exercises"], "regions": ["Riyadh", "Jeddah", "Eastern Province"]},
    ),
    (
        {"badge": "تقنية", "href": "/techniques/play-attention", "title": "PLAY ATTENTION", "desc": "تقنية تدريب معرفي لتحسين الانتباه والتركيز والوظائف التنفيذية باستخدام أنشطة تفاعلية مخصصة للأطفال.", "features": ["تحسين التركيز والانتباه", "دعم الذاكرة والإدراك", "جلسات تفاعلية مخصصة"], "regions": ["الرياض", "جدة", "الشرقية"]},
        {"badge": "Technology", "href": "/techniques/play-attention", "title": "PLAY ATTENTION", "desc": "A cognitive training technology to improve attention, focus, and executive functions using interactive activities designed for children.", "features": ["Improving focus and attention", "Supporting memory and cognition", "Customized interactive sessions"], "regions": ["Riyadh", "Jeddah", "Eastern Province"]},
    ),
    (
        {"badge": "تقنية", "href": "/techniques/nao-robot", "title": "NAO Robot", "desc": "روبوت تفاعلي يدعم الأطفال في تطوير التواصل والتفاعل الاجتماعي من خلال جلسات وأنشطة موجهة.", "features": ["دعم التواصل الاجتماعي", "تقليل القلق والتوتر", "أنشطة تفاعلية ممتعة"], "regions": ["الرياض", "جدة", "الشرقية"]},
        {"badge": "Technology", "href": "/techniques/nao-robot", "title": "NAO Robot", "desc": "An interactive robot that supports children in developing communication and social interaction through guided sessions and activities.", "features": ["Supporting social communication", "Reducing anxiety and stress", "Fun interactive activities"], "regions": ["Riyadh", "Jeddah", "Eastern Province"]},
    ),
    (
        {"badge": "تقنية", "href": "/techniques/floreo", "title": "Floreo", "desc": "تقنية واقع افتراضي (VR) تساعد الأطفال على ممارسة المهارات الاجتماعية والسلوكية داخل بيئة آمنة وتفاعلية.", "features": ["تدريب اجتماعي تفاعلي", "محاكاة مواقف يومية", "دعم التواصل البصري"], "regions": ["الرياض", "جدة", "الشرقية"]},
        {"badge": "Technology", "href": "/techniques/floreo", "title": "Floreo", "desc": "A Virtual Reality (VR) technology that helps children practice social and behavioral skills within a safe and interactive environment.", "features": ["Interactive social training", "Simulating daily situations", "Supporting eye contact"], "regions": ["Riyadh", "Jeddah", "Eastern Province"]},
    ),
    (
        {"badge": "تقنية", "href": "/techniques/photon-robots", "title": "Photon Robots", "desc": "روبوتات تعليمية تفاعلية تساعد الأطفال على تطوير التواصل والمهارات الاجتماعية بطريقة ممتعة وآمنة.", "features": ["تنمية التواصل الاجتماعي", "تعزيز التفاعل", "أنشطة تعليمية ذكية"], "regions": ["الرياض", "جدة", "الشرقية"]},
        {"badge": "Technology", "href": "/techniques/photon-robots", "title": "Photon Robots", "desc": "Interactive educational robots that help children develop communication and social skills in a fun and safe way.", "features": ["Developing social communication", "Enhancing interaction", "Smart educational activities"], "regions": ["Riyadh", "Jeddah", "Eastern Province"]},
    ),
    (
        {"badge": "تقنية", "href": "/techniques/auditory-integration", "title": "التكامل السمعي", "desc": "برنامج يساعد على تحسين معالجة المعلومات السمعية والتركيز والاستجابة للمؤثرات الصوتية المختلفة.", "features": ["تحسين الانتباه السمعي", "تقليل الحساسية الصوتية", "دعم التركيز والإدراك"], "regions": ["الرياض", "جدة", "الشرقية"]},
        {"badge": "Technology", "href": "/techniques/auditory-integration", "title": "Auditory Integration", "desc": "A program that helps improve auditory information processing, focus, and response to different sound stimuli.", "features": ["Improving auditory attention", "Reducing sound sensitivity", "Supporting focus and cognition"], "regions": ["Riyadh", "Jeddah", "Eastern Province"]},
    ),
]

TABS = [
    ("programs", PROGRAMS),
    ("clinical", CLINICAL),
    ("techniques", TECHNIQUES),
]


class Command(BaseCommand):
    help = "Seed the ServiceCard model from the hardcoded index-page tab cards."

    def handle(self, *args, **options):
        counts = {}

        for tab, pairs in TABS:
            count = 0
            for index, (ar, en) in enumerate(pairs):
                slug = ar.get("slug", "")

                defaults = dict(
                    href=ar.get("href", ""),
                    order=index,
                    published=True,
                    badge_ar=ar.get("badge", ""),
                    badge_en=en.get("badge", ""),
                    title_ar=ar.get("title", ""),
                    title_en=en.get("title", ""),
                    desc_ar=ar.get("desc", ""),
                    desc_en=en.get("desc", ""),
                    suits_ar=ar.get("suits", ""),
                    suits_en=en.get("suits", ""),
                    age_ar=ar.get("age", ""),
                    age_en=en.get("age", ""),
                    features_ar=ar.get("features", []),
                    features_en=en.get("features", []),
                    regions_ar=ar.get("regions", []),
                    regions_en=en.get("regions", []),
                )

                if slug:
                    defaults["slug"] = slug
                    ServiceCard.objects.update_or_create(
                        tab=tab, slug=slug, defaults=defaults,
                    )
                else:
                    ServiceCard.objects.update_or_create(
                        tab=tab, order=index, defaults=defaults,
                    )

                count += 1

            counts[tab] = count

        total = sum(counts.values())
        self.stdout.write(
            self.style.SUCCESS(
                "Seeded ServiceCard: "
                "programs={programs}, clinical={clinical}, "
                "techniques={techniques} (total={total}).".format(
                    total=total, **counts
                )
            )
        )
