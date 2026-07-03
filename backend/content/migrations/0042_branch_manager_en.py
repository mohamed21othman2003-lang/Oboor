# -*- coding: utf-8 -*-
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0041_branch_email_branch_manager_branch_map_url_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='branch',
            name='manager',
            field=models.CharField(blank=True, max_length=200, verbose_name='مدير الفرع (عربي)'),
        ),
        migrations.AddField(
            model_name='branch',
            name='manager_en',
            field=models.CharField(blank=True, max_length=200, verbose_name='مدير الفرع (إنجليزي)'),
        ),
    ]
