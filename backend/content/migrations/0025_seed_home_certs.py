# -*- coding: utf-8 -*-
from django.db import migrations


ITEMS = [
    dict(page="home", block="certs", key="heading", order=0,
         title_ar="عبور، بالشهادات العالمية", title_en="Oboor, Globally Accredited",
         text_ar="سجلٌ حافل بالاعتمادات، وتمكينٌ مبنيٌ على أعلى معايير الجودة.",
         text_en="A distinguished record of international accreditations and empowerment built on the highest quality standards."),
    dict(page="home", block="certs", key="cert1", order=1, title_ar="ISO 9001", title_en="ISO 9001", text_ar="إدارة الجودة", text_en="Quality Mgmt."),
    dict(page="home", block="certs", key="cert2", order=2, title_ar="ISO 9001", title_en="ISO 9001", text_ar="إدارة الجودة", text_en="Quality Mgmt."),
    dict(page="home", block="certs", key="cert3", order=3, title_ar="ISO 9001", title_en="ISO 9001", text_ar="إدارة الجودة", text_en="Quality Mgmt."),
    dict(page="home", block="certs", key="cert4", order=4, title_ar="ISO 9001", title_en="ISO 9001", text_ar="إدارة الجودة", text_en="Quality Mgmt."),
]


def seed(apps, schema_editor):
    SectionItem = apps.get_model("content", "SectionItem")
    for row in ITEMS:
        SectionItem.objects.get_or_create(page=row["page"], block=row["block"], key=row["key"], defaults=row)


def unseed(apps, schema_editor):
    SectionItem = apps.get_model("content", "SectionItem")
    SectionItem.objects.filter(page="home", block="certs").delete()


class Migration(migrations.Migration):
    dependencies = [("content", "0024_seed_home_chrome")]
    operations = [migrations.RunPython(seed, unseed)]
