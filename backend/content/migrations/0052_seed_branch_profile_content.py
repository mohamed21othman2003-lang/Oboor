from django.db import migrations


def seed(apps, schema_editor):
    """ينقل محتوى صفحة «ملف الفرع» من البلوكات المشتركة (page=branches) إلى حقول
    خاصة بكل فرع، حتى يتحكّم كل فرع في نبذته وإحصائياته ورحلته واعتماداته باستقلال.
    النبذة تُملأ لكل فرع (استبدال {name}/{city}) لتظهر نصاً واضحاً في الـCMS."""
    Branch = apps.get_model("content", "Branch")
    SectionItem = apps.get_model("content", "SectionItem")

    def items(block):
        return list(SectionItem.objects.filter(page="branches", block=block).order_by("order"))

    intro_row = next(iter(items("profile_intro")), None)
    intro_ar_tpl = (intro_row.text_ar if intro_row else "") or ""
    intro_en_tpl = (intro_row.text_en if intro_row else "") or ""

    stats = [
        {"value": s.value or "", "label_ar": s.title_ar or "", "label_en": s.title_en or ""}
        for s in items("profile_stats")
    ]
    journey = [
        {"title_ar": s.title_ar or "", "title_en": s.title_en or "",
         "desc_ar": s.text_ar or "", "desc_en": s.text_en or ""}
        for s in items("journey")
    ]
    accreditations = [
        {"title_ar": s.title_ar or "", "title_en": s.title_en or ""}
        for s in items("accreditations")
    ]

    def fill(tpl, name, city):
        return tpl.replace("{name}", name or "").replace("{city}", city or "")

    for b in Branch.objects.all():
        changed = []
        if intro_ar_tpl and not b.profile_intro_ar:
            b.profile_intro_ar = fill(intro_ar_tpl, b.name_ar, b.city_ar)
            changed.append("profile_intro_ar")
        if (intro_en_tpl or intro_ar_tpl) and not b.profile_intro_en:
            b.profile_intro_en = fill(intro_en_tpl or intro_ar_tpl, b.name_en or b.name_ar, b.city_en or b.city_ar)
            changed.append("profile_intro_en")
        if stats and not b.profile_stats:
            b.profile_stats = [dict(x) for x in stats]
            changed.append("profile_stats")
        if journey and not b.journey:
            b.journey = [dict(x) for x in journey]
            changed.append("journey")
        if accreditations and not b.accreditations:
            b.accreditations = [dict(x) for x in accreditations]
            changed.append("accreditations")
        if changed:
            b.save(update_fields=changed)


def unseed(apps, schema_editor):
    Branch = apps.get_model("content", "Branch")
    for b in Branch.objects.all():
        b.profile_intro_ar = ""
        b.profile_intro_en = ""
        b.profile_stats = []
        b.journey = []
        b.accreditations = []
        b.save(update_fields=["profile_intro_ar", "profile_intro_en", "profile_stats", "journey", "accreditations"])


class Migration(migrations.Migration):

    dependencies = [
        ("content", "0051_branch_accreditations_branch_journey_and_more"),
    ]

    operations = [
        migrations.RunPython(seed, unseed),
    ]
