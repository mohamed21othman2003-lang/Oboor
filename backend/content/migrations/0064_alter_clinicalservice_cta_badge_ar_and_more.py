# Reconciles model metadata (help_text/choices/default) with DB — no column changes.

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('content', '0063_detail_cta_fields'),
    ]

    operations = [
        migrations.AlterField(
            model_name='clinicalservice',
            name='cta_badge_ar',
            field=models.CharField(blank=True, help_text='نص البادج في قسم التواصل السفلي بصفحة هذه الخدمة (اتركه فارغاً للنص الافتراضي).', max_length=200, verbose_name='CTA — الترويسة الصغيرة (عربي)'),
        ),
        migrations.AlterField(
            model_name='clinicalservice',
            name='cta_title_ar',
            field=models.TextField(blank=True, help_text='عنوان قسم التواصل السفلي بصفحة هذه الخدمة (اتركه فارغاً للنص الافتراضي).', verbose_name='CTA — العنوان (عربي)'),
        ),
        migrations.AlterField(
            model_name='programdetail',
            name='cta_badge_ar',
            field=models.CharField(blank=True, help_text='نص البادج في قسم التواصل السفلي بصفحة هذا البرنامج (اتركه فارغاً للنص الافتراضي).', max_length=200, verbose_name='CTA — الترويسة الصغيرة (عربي)'),
        ),
        migrations.AlterField(
            model_name='programdetail',
            name='cta_title_ar',
            field=models.TextField(blank=True, help_text='عنوان قسم التواصل السفلي بصفحة هذا البرنامج (اتركه فارغاً للنص الافتراضي).', verbose_name='CTA — العنوان (عربي)'),
        ),
        migrations.AlterField(
            model_name='sectionitem',
            name='page',
            field=models.CharField(choices=[('home', 'الرئيسية'), ('about', 'عن عبور'), ('success', 'قصص النجاح'), ('specialists', 'الأخصائيون'), ('assessment', 'التقييم'), ('branches', 'الفروع'), ('careers', 'الوظائف'), ('news', 'الأخبار'), ('programs', 'البرامج'), ('admission', 'طلب التحاق'), ('program-detail', 'تفاصيل البرنامج'), ('service-detail', 'تفاصيل الخدمة'), ('technique-detail', 'تفاصيل التقنية'), ('header', 'الهيدر (القائمة العلوية)'), ('footer', 'الفوتر (التذييل)')], max_length=40, verbose_name='الصفحة'),
        ),
        migrations.AlterField(
            model_name='servicecard',
            name='age_ar',
            field=models.CharField(blank=True, default='', max_length=120, verbose_name='الفئة العمرية (عربي)'),
        ),
        migrations.AlterField(
            model_name='servicecard',
            name='age_en',
            field=models.CharField(blank=True, default='', max_length=120, verbose_name='الفئة العمرية (إنجليزي)'),
        ),
        migrations.AlterField(
            model_name='servicecard',
            name='badge_ar',
            field=models.CharField(blank=True, default='', max_length=120, verbose_name='الشارة (عربي)'),
        ),
        migrations.AlterField(
            model_name='servicecard',
            name='badge_en',
            field=models.CharField(blank=True, default='', max_length=120, verbose_name='الشارة (إنجليزي)'),
        ),
        migrations.AlterField(
            model_name='technique',
            name='cta_badge_ar',
            field=models.CharField(blank=True, help_text='نص البادج في قسم التواصل السفلي بصفحة هذه التقنية (اتركه فارغاً للنص الافتراضي).', max_length=200, verbose_name='CTA — الترويسة الصغيرة (عربي)'),
        ),
        migrations.AlterField(
            model_name='technique',
            name='cta_title_ar',
            field=models.TextField(blank=True, help_text='عنوان قسم التواصل السفلي بصفحة هذه التقنية (اتركه فارغاً للنص الافتراضي).', verbose_name='CTA — العنوان (عربي)'),
        ),
    ]
