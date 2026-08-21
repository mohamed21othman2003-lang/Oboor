# -*- coding: utf-8 -*-
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("content", "0064_alter_clinicalservice_cta_badge_ar_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="branch",
            name="success_story_slugs",
            field=models.JSONField(blank=True, default=list, verbose_name="قصص مختارة من أبطال عبور"),
        ),
        migrations.AddField(
            model_name="branch",
            name="success_stories",
            field=models.JSONField(blank=True, default=list, verbose_name="قصص نجاح خاصة بالفرع"),
        ),
    ]
