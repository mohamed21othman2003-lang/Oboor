# -*- coding: utf-8 -*-
from django.db import migrations


def seed(apps, schema_editor):
    SectionItem = apps.get_model("content", "SectionItem")
    SectionItem.objects.get_or_create(
        page="about", block="branches", key="main_card",
        defaults=dict(
            page="about", block="branches", key="main_card", order=5,
            title_ar="الرياض", title_en="Riyadh",
            text_ar="منطقة الرياض — ٣ فروع", text_en="Riyadh Region — 3 branches",
            data_ar=["حي العليا", "حي النرجس", "حي الصحافة"],
            data_en=["Al-Olaya District", "Al-Narjes District", "Al-Sahafa District"],
            value="920-000-001",
        ),
    )


def unseed(apps, schema_editor):
    SectionItem = apps.get_model("content", "SectionItem")
    SectionItem.objects.filter(page="about", block="branches", key="main_card").delete()


class Migration(migrations.Migration):
    dependencies = [("content", "0027_seed_success_hero")]
    operations = [migrations.RunPython(seed, unseed)]
