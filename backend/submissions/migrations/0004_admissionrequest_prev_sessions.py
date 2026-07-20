from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("submissions", "0003_alter_assessmentresult_assessment"),
    ]

    operations = [
        migrations.AddField(
            model_name="admissionrequest",
            name="prev_sessions",
            field=models.CharField(
                blank=True, max_length=20, verbose_name="جلسات تأهيل سابقة"
            ),
        ),
    ]
