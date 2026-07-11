from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("submissions", "0002_assessmentresult_branch_jobapplication_branch"),
    ]

    operations = [
        migrations.AlterField(
            model_name="assessmentresult",
            name="assessment",
            field=models.CharField(blank=True, default="", max_length=120, verbose_name="نوع التقييم"),
        ),
    ]
