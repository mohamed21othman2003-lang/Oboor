# -*- coding: utf-8 -*-
from django.db import migrations


def remove(apps, schema_editor):
    # الأسئلة الأولية غير مستخدمة (كل تقييم له أسئلته الخاصة) ⇒ تُحذف من الـCMS
    SectionItem = apps.get_model("content", "SectionItem")
    SectionItem.objects.filter(page="assessment", block="prelim_questions").delete()


def noop(apps, schema_editor):
    pass


class Migration(migrations.Migration):
    dependencies = [("content", "0033_alter_programdetail_philosophy_ar_and_more")]
    operations = [migrations.RunPython(remove, noop)]
