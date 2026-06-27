# -*- coding: utf-8 -*-
from django.db import migrations


ITEMS = [
    dict(page="success", block="hero", key="badge", order=0,
         title_ar="قصص حقيقية من عائلاتنا", title_en="Real stories from our families"),
    dict(page="success", block="hero", key="heading", order=1,
         title_ar="أبناؤنا يُلهمونا **كل يوم**", title_en="Our children inspire us **every day**",
         text_ar="كل قصة نجاح تُعبّر عن رحلة حقيقية من التحدي إلى الإنجاز. نفتخر بكل مستفيد شقّ طريقه بمساعدتنا.",
         text_en="Every success story reflects a real journey from challenge to achievement. We are proud of every child who found their way with our help."),
]


def seed(apps, schema_editor):
    SectionItem = apps.get_model("content", "SectionItem")
    for row in ITEMS:
        SectionItem.objects.get_or_create(page=row["page"], block=row["block"], key=row["key"], defaults=row)


def unseed(apps, schema_editor):
    SectionItem = apps.get_model("content", "SectionItem")
    SectionItem.objects.filter(page="success", block="hero").delete()


class Migration(migrations.Migration):
    dependencies = [("content", "0026_name_success_highlights")]
    operations = [migrations.RunPython(seed, unseed)]
