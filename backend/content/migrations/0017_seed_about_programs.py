# -*- coding: utf-8 -*-
"""بذر قائمة برامج صفحة «عن عبور» كصفوف SectionItem مستقلة (block=program_item)،
   كل برنامج صفّ بعنوان/وصف/أيقونة — يعدّله الأدمن بالحقول العادية ويرتّبه ويضيف/يحذف."""
from django.db import migrations

ROWS = [
    ("about-prog-speech", 0, "chat", "علاج النطق والتخاطب", "Speech & Language Therapy",
     "برامج متخصصة لتطوير مهارات التواصل والنطق واللغة، وعلاج اضطرابات النطق المختلفة، ووضع خطط علاجية فردية لكل حالة.",
     "Specialized programs to develop communication, speech and language skills, treat various speech disorders, and design an individual treatment plan for each case."),
    ("about-prog-physical", 1, "activity", "العلاج الطبيعي", "Physical Therapy",
     "جلسات علاجية تُعنى بتحسين الوظائف الحركية، وتنمية المهارات الحسية، وإعادة التأهيل الحركي بأساليب علمية حديثة.",
     "Therapy sessions focused on improving motor function, developing sensory skills, and motor rehabilitation using modern, evidence-based methods."),
    ("about-prog-occupational", 2, "hand", "العلاج الوظيفي", "Occupational Therapy",
     "يُركز على تطوير مهارات الحياة اليومية والحركات الدقيقة، لتعزيز الاستقلالية والاندماج الوظيفي والمجتمعي.",
     "Focuses on developing daily living skills and fine motor skills to enhance independence and functional and social integration."),
    ("about-prog-psych", 3, "brain", "العلاج النفسي", "Psychological Services",
     "دعم نفسي متخصص للأشخاص ذوي الإعاقة وأسرهم، يشمل التقييم والإرشاد، ووضع خطط دعم سلوكية شاملة.",
     "Specialized psychological support for people with disabilities and their families, including assessment, counseling, and comprehensive behavioral support plans."),
    ("about-prog-social", 4, "users", "العلاج الاجتماعي", "Social Services",
     "برامج تُعزز مهارات التواصل الاجتماعي والاندماج المجتمعي، وتُسهم في بناء شبكة دعم متينة للفرد وأسرته.",
     "Programs that strengthen social communication skills and community integration, helping build a strong support network for the individual and their family."),
]


def seed(apps, schema_editor):
    SectionItem = apps.get_model("content", "SectionItem")
    for key, order, icon, t_ar, t_en, x_ar, x_en in ROWS:
        SectionItem.objects.get_or_create(
            page="about", key=key,
            defaults=dict(block="program_item", order=10 + order, icon=icon,
                          title_ar=t_ar, title_en=t_en, text_ar=x_ar, text_en=x_en, published=True),
        )


def unseed(apps, schema_editor):
    SectionItem = apps.get_model("content", "SectionItem")
    SectionItem.objects.filter(page="about", block="program_item").delete()


class Migration(migrations.Migration):
    dependencies = [("content", "0016_alter_sectionitem_options")]
    operations = [migrations.RunPython(seed, unseed)]
