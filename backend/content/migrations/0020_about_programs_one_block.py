# -*- coding: utf-8 -*-
"""ضمّ عناصر قائمة البرامج تحت نفس قسم «عنوان قسم البرامج» (block=programs)
   حتى تظهر في الـCMS تحته مباشرةً كما هي في الموقع."""
from django.db import migrations


def merge(apps, schema_editor):
    SectionItem = apps.get_model("content", "SectionItem")
    SectionItem.objects.filter(page="about", block="program_item").update(block="programs")


def split(apps, schema_editor):
    SectionItem = apps.get_model("content", "SectionItem")
    # العناصر التي لها أيقونة هي عناصر القائمة (العنوان بلا أيقونة)
    SectionItem.objects.filter(page="about", block="programs").exclude(icon="").update(block="program_item")


class Migration(migrations.Migration):
    dependencies = [("content", "0019_seed_about_hero_image")]
    operations = [migrations.RunPython(merge, split)]
