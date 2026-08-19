from django.db import migrations, models


def cta_fields():
    return [
        ("cta_badge_ar", models.CharField(blank=True, help_text="نص البادج في قسم التواصل السفلي بصفحة هذا العنصر (اتركه فارغاً للنص الافتراضي).", max_length=200, verbose_name="CTA — الترويسة الصغيرة (عربي)")),
        ("cta_badge_en", models.CharField(blank=True, max_length=200, verbose_name="CTA — الترويسة الصغيرة (إنجليزي)")),
        ("cta_title_ar", models.TextField(blank=True, help_text="عنوان قسم التواصل السفلي بصفحة هذا العنصر (اتركه فارغاً للنص الافتراضي).", verbose_name="CTA — العنوان (عربي)")),
        ("cta_title_en", models.TextField(blank=True, verbose_name="CTA — العنوان (إنجليزي)")),
        ("cta_text_ar", models.TextField(blank=True, verbose_name="CTA — النص (عربي)")),
        ("cta_text_en", models.TextField(blank=True, verbose_name="CTA — النص (إنجليزي)")),
    ]


class Migration(migrations.Migration):

    dependencies = [
        ("content", "0062_sectionitem_tagline"),
    ]

    operations = [
        migrations.AddField(model_name=model, name=name, field=field)
        for model in ("programdetail", "clinicalservice", "technique")
        for (name, field) in cta_fields()
    ]
