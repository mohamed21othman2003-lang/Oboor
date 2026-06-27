# -*- coding: utf-8 -*-
from django.db import migrations


ITEMS = [
    dict(page="branches", block="services", key="physical", order=0, value="/services/physical",
         title_ar="العلاج الطبيعي", title_en="Physical Therapy",
         text_ar="جلسات علاجية متخصصة لتحسين الحركة والقوة والتوازن لدى الأطفال.",
         text_en="Specialized therapy sessions to improve children's movement, strength, and balance.",
         data_ar=["تقييم حركي شامل", "تمارين تقوية وتوازن", "استخدام المعدات العلاجية الحديثة"],
         data_en=["Comprehensive motor assessment", "Strengthening and balance exercises", "Use of modern therapy equipment"]),
    dict(page="branches", block="services", key="social", order=1, value="/services/social",
         title_ar="الخدمات الاجتماعية", title_en="Social Services",
         text_ar="دعم الأسر في مواجهة التحديات اليومية وتسهيل اندماج الطفل في محيطه.",
         text_en="Supporting families with daily challenges and easing the child's integration into their environment.",
         data_ar=["إدارة الحالات الاجتماعية", "التواصل مع الجهات الداعمة", "ورش توعية للأسر"],
         data_en=["Social case management", "Coordination with support organizations", "Awareness workshops for families"]),
    dict(page="branches", block="services", key="psychological", order=2, value="/services/psychological",
         title_ar="الخدمات النفسية", title_en="Psychological Services",
         text_ar="خدمات تشخيصية وعلاجية شاملة لتحسين القدرات السلوكية والنفسية.",
         text_en="Comprehensive diagnostic and therapeutic services to improve behavioral and psychological abilities.",
         data_ar=["التقييم النفسي الشامل", "العلاج السلوكي المعرفي", "إرشاد الأسرة وتقديم الدعم النفسي"],
         data_en=["Comprehensive psychological assessment", "Cognitive behavioral therapy", "Family counseling and psychological support"]),
]


def seed(apps, schema_editor):
    SectionItem = apps.get_model("content", "SectionItem")
    for row in ITEMS:
        SectionItem.objects.get_or_create(page=row["page"], block=row["block"], key=row["key"], defaults=row)


def unseed(apps, schema_editor):
    SectionItem = apps.get_model("content", "SectionItem")
    SectionItem.objects.filter(page="branches", block="services").delete()


class Migration(migrations.Migration):
    dependencies = [("content", "0031_seed_branch_profile")]
    operations = [migrations.RunPython(seed, unseed)]
