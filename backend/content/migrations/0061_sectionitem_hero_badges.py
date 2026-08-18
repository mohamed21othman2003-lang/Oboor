from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("content", "0060_emailsettings"),
    ]

    operations = [
        migrations.AddField(model_name="sectionitem", name="badge1_label_ar",
                            field=models.CharField("الشارة الأولى — العنوان الصغير (عربي)", max_length=120, blank=True, default="")),
        migrations.AddField(model_name="sectionitem", name="badge1_label_en",
                            field=models.CharField("الشارة الأولى — العنوان الصغير (إنجليزي)", max_length=120, blank=True, default="")),
        migrations.AddField(model_name="sectionitem", name="badge1_value_ar",
                            field=models.CharField("الشارة الأولى — النص الكبير (عربي)", max_length=120, blank=True, default="")),
        migrations.AddField(model_name="sectionitem", name="badge1_value_en",
                            field=models.CharField("الشارة الأولى — النص الكبير (إنجليزي)", max_length=120, blank=True, default="")),
        migrations.AddField(model_name="sectionitem", name="badge2_label_ar",
                            field=models.CharField("الشارة الثانية — العنوان الصغير (عربي)", max_length=120, blank=True, default="")),
        migrations.AddField(model_name="sectionitem", name="badge2_label_en",
                            field=models.CharField("الشارة الثانية — العنوان الصغير (إنجليزي)", max_length=120, blank=True, default="")),
        migrations.AddField(model_name="sectionitem", name="badge2_value_ar",
                            field=models.CharField("الشارة الثانية — النص الكبير (عربي)", max_length=120, blank=True, default="")),
        migrations.AddField(model_name="sectionitem", name="badge2_value_en",
                            field=models.CharField("الشارة الثانية — النص الكبير (إنجليزي)", max_length=120, blank=True, default="")),
    ]
