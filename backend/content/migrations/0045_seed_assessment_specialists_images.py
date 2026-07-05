# -*- coding: utf-8 -*-
# يربط صورتين كانتا مثبّتتين في الكود بحقول صور في السي ام اس داخل سكشناتهما:
#  - صورة هيرو صفحة التقييم ← حقل صورة عنصر عنوان الهيرو (page=assessment, block=hero, key=heading)
#  - صورة «انضم إلى الفريق» في صفحة الأخصائيين ← عنصر جديد (block=join) يحمل الصورة
# آمن: لا يكتب فوق صورة موجودة، ولا يكرّر عنصر الـjoin إن وُجد.
from django.db import migrations


def seed(apps, schema_editor):
    SectionItem = apps.get_model("content", "SectionItem")

    # 1) هيرو التقييم — صورة القسم
    for s in SectionItem.objects.filter(page="assessment", block="hero", key="heading", image=""):
        if not s.image_file:
            s.image = "/figma/about/intro.jpg"
            s.save(update_fields=["image"])

    # 2) صورة «انضم إلى الفريق» في الأخصائيين — عنصر مستقل يحمل الصورة
    SectionItem.objects.get_or_create(
        page="specialists", block="join", key="visual",
        defaults=dict(
            title_ar="انضم إلى الفريق (الصورة)", title_en="Join the Team (image)",
            image="/figma/specialists/team.jpg", order=0, published=True,
        ),
    )


def noop(apps, schema_editor):
    pass


class Migration(migrations.Migration):
    dependencies = [("content", "0044_seed_about_section_images")]
    operations = [migrations.RunPython(seed, noop)]
