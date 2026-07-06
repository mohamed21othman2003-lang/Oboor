from django.db import migrations


def seed(apps, schema_editor):
    Branch = apps.get_model("content", "Branch")
    SectionItem = apps.get_model("content", "SectionItem")

    # «ما يميّز الفرع» من بلوك المميزات المشترك (page=branches, block=features)
    feats = [
        {
            "icon": s.icon or "",
            "title_ar": s.title_ar or "",
            "title_en": s.title_en or "",
            "desc_ar": s.text_ar or "",
            "desc_en": s.text_en or "",
        }
        for s in SectionItem.objects.filter(page="branches", block="features").order_by("order")
    ]

    for b in Branch.objects.all():
        changed = []
        if feats and not b.distinctions:
            b.distinctions = [dict(x) for x in feats]
            changed.append("distinctions")
        # عناوين قصص النجاح — تُملأ باسم الفرع مع تمييز الاسم بين نجمتين (**)
        if not b.success_heading_ar:
            b.success_heading_ar = f"قصص نجاح من **{b.name_ar}**"
            changed.append("success_heading_ar")
        if not b.success_heading_en:
            nm = b.name_en or b.name_ar
            b.success_heading_en = f"Success Stories from **{nm}**"
            changed.append("success_heading_en")
        if not b.success_sub_ar:
            b.success_sub_ar = "كل قصة نجاح تُعبّر عن رحلة حقيقية من التحدي إلى الإنجاز."
            changed.append("success_sub_ar")
        if not b.success_sub_en:
            b.success_sub_en = "Every success story reflects a real journey from challenge to achievement."
            changed.append("success_sub_en")
        if changed:
            b.save(update_fields=changed)


def unseed(apps, schema_editor):
    Branch = apps.get_model("content", "Branch")
    for b in Branch.objects.all():
        b.distinctions = []
        b.success_heading_ar = ""
        b.success_heading_en = ""
        b.success_sub_ar = ""
        b.success_sub_en = ""
        b.save(update_fields=["distinctions", "success_heading_ar", "success_heading_en", "success_sub_ar", "success_sub_en"])


class Migration(migrations.Migration):

    dependencies = [
        ("content", "0053_branch_distinctions_branch_success_heading_ar_and_more"),
    ]

    operations = [
        migrations.RunPython(seed, unseed),
    ]
