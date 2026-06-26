# -*- coding: utf-8 -*-
"""تعبئة صورة هيرو «عن عبور» بالصورة الحالية حتى تظهر قابلة للتعديل في الـCMS."""
from django.db import migrations


def seed(apps, schema_editor):
    SectionItem = apps.get_model("content", "SectionItem")
    SectionItem.objects.filter(page="about", key="about-hero").update(image="/about-hero.png")


def noop(apps, schema_editor):
    pass


class Migration(migrations.Migration):
    dependencies = [("content", "0018_sectionitem_image_sectionitem_image_file")]
    operations = [migrations.RunPython(seed, noop)]
