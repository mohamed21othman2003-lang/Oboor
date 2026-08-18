from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("content", "0061_sectionitem_hero_badges"),
    ]

    operations = [
        migrations.AddField(model_name="sectionitem", name="tagline_ar",
                            field=models.CharField("الترويسة الصغيرة فوق العنوان (عربي)", max_length=160, blank=True, default="")),
        migrations.AddField(model_name="sectionitem", name="tagline_en",
                            field=models.CharField("الترويسة الصغيرة فوق العنوان (إنجليزي)", max_length=160, blank=True, default="")),
    ]
