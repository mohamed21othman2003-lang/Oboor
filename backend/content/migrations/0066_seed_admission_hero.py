# -*- coding: utf-8 -*-
from django.db import migrations


ITEMS = [
    # ---- تقديم الطلب (الهيرو) ----
    dict(page="admission", block="hero", key="badge", order=0,
         title_ar="التسجيل متاح الآن في جميع الفروع",
         title_en="Registration is now open at all branches"),
    dict(page="admission", block="hero", key="heading", order=1,
         title_ar="غدُه بانتظار **خطوتك**",
         title_en="A Future Awaits Your **First Step**",
         text_ar="سجّل طلب الالتحاق لطفلك. نموذج التسجيل يسير ويختصر الكثير؛ ضع البيانات الآن، وستواصل معك ونمدّ يد العون.",
         text_en="Submit your child's enrollment request. A simple and streamlined registration form designed for ease and convenience. Enter your details, and we will get in touch to provide full support and guidance."),
]


def seed(apps, schema_editor):
    SectionItem = apps.get_model("content", "SectionItem")
    for row in ITEMS:
        SectionItem.objects.get_or_create(
            page=row["page"], block=row["block"], key=row["key"], defaults=row,
        )


def unseed(apps, schema_editor):
    SectionItem = apps.get_model("content", "SectionItem")
    SectionItem.objects.filter(page="admission", block="hero").delete()


class Migration(migrations.Migration):
    dependencies = [("content", "0065_branch_success_stories")]
    operations = [migrations.RunPython(seed, unseed)]
