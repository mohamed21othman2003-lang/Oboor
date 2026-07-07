# -*- coding: utf-8 -*-
from django.db import migrations

ICONS = {"feat1": "clock", "feat2": "clipboard", "feat3": "phone"}


def seed(apps, schema_editor):
    SectionItem = apps.get_model("content", "SectionItem")
    for key, icon in ICONS.items():
        SectionItem.objects.filter(page="contact", block="form", key=key).update(icon=icon)


def unseed(apps, schema_editor):
    SectionItem = apps.get_model("content", "SectionItem")
    SectionItem.objects.filter(page="contact", block="form", key__in=list(ICONS)).update(icon="")


class Migration(migrations.Migration):

    dependencies = [
        ("content", "0058_seed_contact_page"),
    ]

    operations = [
        migrations.RunPython(seed, unseed),
    ]
