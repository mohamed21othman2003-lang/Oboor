# -*- coding: utf-8 -*-
# يملأ حقل «صورة القسم» لأقسام «من نحن» (النبذة + البرامج) بالصور الحالية على الموقع،
# حتى تعرضها لوحة التحكّم كصورة حالية (والموقع يقرأها من نفس الحقل بدل الرابط الثابت).
# آمن: يضبط الصورة فقط إن كان الحقل فارغاً (لا يمسّ أي صورة رفعها الأدمن).
from django.db import migrations

DEFAULTS = {
    "about-intro": "/figma/about/intro.jpg",
    "about-programs": "/figma/about/programs.jpg",
}


def set_images(apps, schema_editor):
    SectionItem = apps.get_model("content", "SectionItem")
    for key, img in DEFAULTS.items():
        for s in SectionItem.objects.filter(page="about", key=key, image=""):
            if not s.image_file:  # لا نكتب فوق صورة مرفوعة
                s.image = img
                s.save(update_fields=["image"])


def noop(apps, schema_editor):
    pass


class Migration(migrations.Migration):
    dependencies = [("content", "0043_alter_heroslide_badge_ar_alter_heroslide_cta_ar")]
    operations = [migrations.RunPython(set_images, noop)]
