# -*- coding: utf-8 -*-
# يمسح «الرقم» (value) من تبويبات أقسام الأخبار — لم يعد يُعرض على الصفحة (استُبدل بأيقونة).
from django.db import migrations


def clear(apps, schema_editor):
    SectionItem = apps.get_model("content", "SectionItem")
    SectionItem.objects.filter(page="news", block="categories").exclude(value="").update(value="")


def noop(apps, schema_editor):
    pass


class Migration(migrations.Migration):
    dependencies = [("content", "0046_remove_about_prog_social")]
    operations = [migrations.RunPython(clear, noop)]
