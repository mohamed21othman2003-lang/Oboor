# -*- coding: utf-8 -*-
from django.db import migrations


def name_it(apps, schema_editor):
    SectionItem = apps.get_model("content", "SectionItem")
    SectionItem.objects.filter(page="success", block="highlights").update(
        title_ar="تفاصيل القصة المميّزة (تسميات + محتوى)",
        title_en="Featured story details (labels + content)",
    )


def noop(apps, schema_editor):
    pass


class Migration(migrations.Migration):
    dependencies = [("content", "0025_seed_home_certs")]
    operations = [migrations.RunPython(name_it, noop)]
