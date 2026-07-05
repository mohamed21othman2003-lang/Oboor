# -*- coding: utf-8 -*-
# يحذف بطاقة «العلاج الاجتماعي» من قسم البرامج في صفحة «من نحن» (غير مطلوبة).
# يعمل بعد الـseed، فحتى في تنصيب جديد يُضاف ثم يُحذف ⇒ لا يعود.
from django.db import migrations


def remove(apps, schema_editor):
    SectionItem = apps.get_model("content", "SectionItem")
    SectionItem.objects.filter(page="about", block="programs", key="about-prog-social").delete()


def noop(apps, schema_editor):
    pass


class Migration(migrations.Migration):
    dependencies = [("content", "0045_seed_assessment_specialists_images")]
    operations = [migrations.RunPython(remove, noop)]
