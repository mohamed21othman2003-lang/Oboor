from django.db import migrations

# القيم الافتراضية (لو لم يوجد بلوك مشترك) — نفس المحتوى الذي كان يظهر في النافذة.
DEFAULT_AR = {
    "badge": "حياة جديدة وثقة",
    "program": "علاج النطق واللغة",
    "journey": "التحق {name} ببرنامج مكثّف لعلاج النطق واللغة، ركّزت جلساته على تحفيز النطق وبناء المفردات وتمارين التواصل، مع إشراك الأسرة في التطبيق المنزلي.",
    "results": [
        "نطق واضح للحروف والكلمات",
        "تكوين جُمل كاملة ومترابطة",
        "تواصل اجتماعي بثقة في المواقف اليومية",
        "تحسّن ملحوظ في التفاعل داخل الفصل",
    ],
}
DEFAULT_EN = {
    "badge": "A new life & confidence",
    "program": "Speech & Language Therapy",
    "journey": "{name} joined an intensive Speech & Language Therapy program focused on stimulating speech, building vocabulary, and communication exercises, with the family involved in home practice.",
    "results": [
        "Clear pronunciation of letters and words",
        "Building complete, coherent sentences",
        "Confident social communication in everyday situations",
        "Noticeable improvement in classroom interaction",
    ],
}


def seed(apps, schema_editor):
    SuccessStory = apps.get_model("content", "SuccessStory")
    SectionItem = apps.get_model("content", "SectionItem")

    block = SectionItem.objects.filter(page="success", block="highlights").first()
    ar = dict(DEFAULT_AR)
    en = dict(DEFAULT_EN)
    if block:
        da, de = block.data_ar or {}, block.data_en or {}
        ar = {"badge": da.get("badge", ar["badge"]), "program": da.get("program", ar["program"]),
              "journey": da.get("journeyTemplate", ar["journey"]), "results": da.get("results", ar["results"])}
        en = {"badge": de.get("badge", en["badge"]), "program": de.get("program", en["program"]),
              "journey": de.get("journeyTemplate", en["journey"]), "results": de.get("results", en["results"])}

    for s in SuccessStory.objects.all():
        changed = []
        if not s.badge_ar:
            s.badge_ar = ar["badge"]; changed.append("badge_ar")
        if not s.badge_en:
            s.badge_en = en["badge"]; changed.append("badge_en")
        if not s.program_ar:
            s.program_ar = ar["program"]; changed.append("program_ar")
        if not s.program_en:
            s.program_en = en["program"]; changed.append("program_en")
        # سرد الرحلة: نملأ اسم البطل مكان {name} ليظهر نصاً واضحاً في الـCMS
        if not s.journey_ar:
            s.journey_ar = ar["journey"].replace("{name}", s.name_ar or ""); changed.append("journey_ar")
        if not s.journey_en:
            s.journey_en = en["journey"].replace("{name}", s.name_en or s.name_ar or ""); changed.append("journey_en")
        if not s.results_ar:
            s.results_ar = list(ar["results"]); changed.append("results_ar")
        if not s.results_en:
            s.results_en = list(en["results"]); changed.append("results_en")
        if changed:
            s.save(update_fields=changed)


def unseed(apps, schema_editor):
    SuccessStory = apps.get_model("content", "SuccessStory")
    for s in SuccessStory.objects.all():
        s.badge_ar = s.badge_en = s.program_ar = s.program_en = s.journey_ar = s.journey_en = ""
        s.results_ar = []
        s.results_en = []
        s.save(update_fields=["badge_ar", "badge_en", "program_ar", "program_en", "journey_ar", "journey_en", "results_ar", "results_en"])


class Migration(migrations.Migration):

    dependencies = [
        ("content", "0056_successstory_badge_ar_successstory_badge_en_and_more"),
    ]

    operations = [
        migrations.RunPython(seed, unseed),
    ]
