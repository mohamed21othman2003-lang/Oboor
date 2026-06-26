# -*- coding: utf-8 -*-
"""بذر عناصر قسم صفحة «عن عبور» (about) في SectionItem بالمحتوى الحالي،
   حتى يتحكّم فيها الأدمن من الـCMS (مع إبقاء نفس الشكل). idempotent عبر (page,key)."""
from django.db import migrations

ROWS = [
    # key, block, order, title_ar, title_en, text_ar, text_en, data_ar, data_en
    ("about-hero", "hero", 0,
     "منذ عام ٢٠٠٧ — رائدون في التأهيل والرعاية", "Since 2007 — pioneers in rehabilitation and care",
     "تأسست مراكز عبور عام ٢٠٠٧، وأصبحت اليوم من أكبر سلاسل المراكز المتخصصة في التشخيص والتقييم والتأهيل والتعليم للأشخاص ذوي الإعاقة في المملكة العربية السعودية، عبر شبكة فروع ممتدة وكوادر متخصصة رفيعة المستوى.",
     "Founded in 2007, Oboor Centers have grown into one of the largest chains specialized in the diagnosis, assessment, rehabilitation and education of people with disabilities in Saudi Arabia, through an extensive network of branches and highly qualified specialists.",
     [], []),
    ("about-intro", "intro", 1,
     "تعرّف على مركز عبور", "Get to know Oboor Center", "", "",
     [
         "تأسست مراكز عبور عام ٢٠٠٧ كأكبر سلسلة مراكز متخصصة في تقديم وتطوير خدمات التشخيص والتقييم والتأهيل والتعليم للأشخاص ذوي الإعاقة في المملكة العربية السعودية.",
         "نهدف إلى تمكين الأشخاص ذوي الإعاقة من حياة أكثر جودة واستقلالية من خلال منظومة متكاملة من البرامج التأهيلية والتعليمية وكوادر بشرية مؤهلة وبيئات علاجية مجهزة بأحدث التقنيات.",
         "تمتد خدماتنا عبر شبكة فروع واسعة تغطي مناطق رئيسية في المملكة، مما يُمكّن الأسر من الوصول إلى الرعاية المتخصصة بيسر وسهولة وضمان الاستمرارية في مسيرة التأهيل.",
     ],
     [
         "Oboor Centers were founded in 2007 as the largest chain specialized in providing and developing diagnosis, assessment, rehabilitation and education services for people with disabilities in Saudi Arabia.",
         "We aim to empower people with disabilities to live with greater quality and independence through an integrated system of rehabilitation and educational programs, qualified staff, and therapeutic environments equipped with the latest technologies.",
         "Our services extend across a wide network of branches covering major regions of the Kingdom, enabling families to access specialized care easily and ensuring continuity throughout the rehabilitation journey.",
     ]),
    ("about-mission", "mission", 2,
     "تحسين نوعية الحياة والاندماج الفعّال", "Improving quality of life and meaningful integration",
     "تحسين نوعية حياة الأشخاص من ذوي الإعاقة وأسرهم، ودمجهم الفعّال في المجتمع، من خلال برامج تأهيلية وتعليمية مبنية على أسس علمية وممارسات مهنية عالية الجودة.",
     "Improving the quality of life of people with disabilities and their families and integrating them meaningfully into society, through rehabilitation and educational programs built on scientific foundations and high-quality professional practices.",
     [], []),
    ("about-vision", "vision", 3,
     "الكيان الرائد والمرجعي", "The leading, reference entity",
     "أن نكون الكيان الرائد والمرجعي في تقديم الخدمات المتكاملة والمستدامة للأشخاص ذوي الإعاقة وأسرهم على مستوى المملكة والمنطقة.",
     "To be the leading, reference entity in providing integrated and sustainable services for people with disabilities and their families across the Kingdom and the region.",
     [], []),
    ("about-programs", "programs", 4,
     "نبذة عن البرامج", "About our programs",
     "نعتمد في مراكز عبور منهجية علمية متكاملة مدعومة بأحدث التقنيات والبيئات العلاجية المتخصصة لضمان أفضل نتائج تأهيلية ممكنة لكل حالة.",
     "At Oboor Centers we follow an integrated, evidence-based methodology supported by the latest technologies and specialized therapeutic environments to ensure the best possible rehabilitation outcomes for each case.",
     [], []),
    ("about-specialists", "specialists", 5,
     "نبذة عن الأخصائيين", "About our specialists",
     "يضمّ مركز عبور نخبة من الأخصائيين والاستشاريين المؤهلين والحاصلين على اعتمادات دولية في مختلف مجالات التأهيل.",
     "Oboor Center brings together a select team of qualified specialists and consultants holding international accreditations across various fields of rehabilitation.",
     [], []),
    ("about-branches", "branches", 6,
     "نبذة عن الفروع", "About our branches",
     "تمتد مراكز عبور عبر أكثر من ١١ مدينة رئيسية في المملكة العربية السعودية، لضمان وصول خدماتنا المتخصصة إلى الأسر أينما كانت، مع الحفاظ على نفس مستوى الجودة والتميّز في كل موقع.",
     "Oboor Centers span more than 11 major cities across Saudi Arabia, ensuring our specialized services reach families wherever they are, while maintaining the same level of quality and excellence at every location.",
     [], []),
    ("about-cta", "cta", 7,
     "نتوسع باستمرار لخدمتكم في كل منطقة", "We keep expanding to serve you in every region",
     "هل تبحث عن فرع قريب منك؟ تواصل معنا لمعرفة أقرب مركز إلى موقعك.",
     "Looking for a branch near you? Contact us to find the nearest center to your location.",
     [], []),
]


def seed(apps, schema_editor):
    SectionItem = apps.get_model("content", "SectionItem")
    for key, block, order, t_ar, t_en, x_ar, x_en, d_ar, d_en in ROWS:
        SectionItem.objects.get_or_create(
            page="about", key=key,
            defaults=dict(block=block, order=order, title_ar=t_ar, title_en=t_en,
                          text_ar=x_ar, text_en=x_en, data_ar=d_ar, data_en=d_en, published=True),
        )


def unseed(apps, schema_editor):
    SectionItem = apps.get_model("content", "SectionItem")
    SectionItem.objects.filter(page="about").delete()


class Migration(migrations.Migration):
    dependencies = [("content", "0013_backfill_branch_reviews")]
    operations = [migrations.RunPython(seed, unseed)]
