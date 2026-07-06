from django.db import migrations

# الصور الافتراضية المشتركة التي كان الموقع يعرضها كبديل عند فراغ معرض الفرع.
# نزرعها داخل معرض كل فرع حتى تظهر في الـCMS ويستطيع المستخدم التحكّم في صور
# كل فرع بشكلٍ مستقل (استبدال/إضافة/حذف/ترتيب) من محرّر الفرع نفسه.
DEFAULT_GALLERY = [f"/figma/branch-gallery/b{i}.jpg" for i in range(1, 9)]


def seed(apps, schema_editor):
    Branch = apps.get_model("content", "Branch")
    for b in Branch.objects.all():
        if not b.gallery:  # لا نلمس فرعاً رفع صوره الحقيقية بالفعل
            b.gallery = list(DEFAULT_GALLERY)
            b.save(update_fields=["gallery"])


def unseed(apps, schema_editor):
    Branch = apps.get_model("content", "Branch")
    # نُفرِّغ فقط المعارض التي ما زالت مطابقة للصور الافتراضية (لا نمسّ ما رفعه المستخدم)
    for b in Branch.objects.all():
        if list(b.gallery or []) == DEFAULT_GALLERY:
            b.gallery = []
            b.save(update_fields=["gallery"])


class Migration(migrations.Migration):

    dependencies = [
        ("content", "0047_clear_news_category_counts"),
    ]

    operations = [
        migrations.RunPython(seed, unseed),
    ]
