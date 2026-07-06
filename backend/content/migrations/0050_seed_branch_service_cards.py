from django.db import migrations


def seed(apps, schema_editor):
    """يزرع كروت الخدمات الغنية داخل كل فرع، مأخوذة من البلوك المشترك القديم
    (page=branches, block=services)، حتى يصبح لكل فرع نسخته المستقلة القابلة للتحكّم."""
    Branch = apps.get_model("content", "Branch")
    SectionItem = apps.get_model("content", "SectionItem")

    shared = list(
        SectionItem.objects.filter(page="branches", block="services").order_by("order")
    )
    cards = [
        {
            "title_ar": s.title_ar or "",
            "title_en": s.title_en or "",
            "desc_ar": s.text_ar or "",
            "desc_en": s.text_en or "",
            "features_ar": list(s.data_ar or []),
            "features_en": list(s.data_en or []),
            "href": s.value or "",
        }
        for s in shared
    ]
    if not cards:
        return
    for b in Branch.objects.all():
        if not b.service_cards:  # لا نلمس فرعاً خصّص كروته بالفعل
            b.service_cards = [dict(c) for c in cards]
            b.save(update_fields=["service_cards"])


def unseed(apps, schema_editor):
    Branch = apps.get_model("content", "Branch")
    for b in Branch.objects.all():
        b.service_cards = []
        b.save(update_fields=["service_cards"])


class Migration(migrations.Migration):

    dependencies = [
        ("content", "0049_branch_service_cards"),
    ]

    operations = [
        migrations.RunPython(seed, unseed),
    ]
