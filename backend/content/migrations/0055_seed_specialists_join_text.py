from django.db import migrations

# النصوص التي كانت ثابتة في صفحة الأخصائيين (قسم «انضم إلى الفريق») — ننقلها
# إلى عنصر القسم في الـCMS حتى يطابق ما يظهر على الصفحة ويصبح قابلاً للتحرير.
HEADING_AR = "انضم إلى فريق **الأخصائيين**"
HEADING_EN = "Join the **Specialists** Team"
DESC_AR = (
    "إذا كنت أخصائيًا في مجالات التأهيل المختلفة وترغب في الانضمام إلى فريقنا، "
    "يسعدنا تواصلك معنا. نبحث دائماً عن متخصصين شغوفين يشاركوننا رؤيتنا في تقديم "
    "رعاية استثنائية للأطفال وأسرهم."
)
DESC_EN = (
    "If you are a specialist in any of the various fields of rehabilitation and "
    "would like to join our team, we would be delighted to hear from you. We are "
    "always looking for passionate professionals who share our vision of providing "
    "exceptional care for children and their families."
)


def seed(apps, schema_editor):
    SectionItem = apps.get_model("content", "SectionItem")
    row = SectionItem.objects.filter(page="specialists", block="join").order_by("order").first()
    if not row:
        return
    row.title_ar = HEADING_AR
    row.title_en = HEADING_EN
    row.text_ar = DESC_AR
    row.text_en = DESC_EN
    row.save(update_fields=["title_ar", "title_en", "text_ar", "text_en"])


def unseed(apps, schema_editor):
    SectionItem = apps.get_model("content", "SectionItem")
    row = SectionItem.objects.filter(page="specialists", block="join").order_by("order").first()
    if not row:
        return
    row.title_ar = "انضم إلى الفريق (الصورة)"
    row.title_en = "Join the Team (image)"
    row.text_ar = ""
    row.text_en = ""
    row.save(update_fields=["title_ar", "title_en", "text_ar", "text_en"])


class Migration(migrations.Migration):

    dependencies = [
        ("content", "0054_seed_branch_distinctions_success"),
    ]

    operations = [
        migrations.RunPython(seed, unseed),
    ]
