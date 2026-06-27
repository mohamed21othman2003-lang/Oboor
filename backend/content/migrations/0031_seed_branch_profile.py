# -*- coding: utf-8 -*-
from django.db import migrations


ITEMS = [
    # إحصائيات ملف الفرع
    dict(page="branches", block="profile_stats", key="s1", order=0, value="+19", title_ar="عامًا في الريادة", title_en="Years of leadership"),
    dict(page="branches", block="profile_stats", key="s2", order=1, value="+6,300", title_ar="مستفيد احتُضن بحب", title_en="Beneficiaries served"),
    dict(page="branches", block="profile_stats", key="s3", order=2, value="+43", title_ar="نقطة رعاية في الوطن", title_en="Care points nationwide"),
    dict(page="branches", block="profile_stats", key="s4", order=3, value="+7", title_ar="برامج تأهيلية", title_en="Rehabilitation programs"),
    # رحلة التأهيل
    dict(page="branches", block="journey", key="j1", order=0, title_ar="التقييم والتشخيص", title_en="Assessment & Diagnosis", text_ar="تقييمٌ شاملٌ بأدواتٍ حديثة لتحديد احتياج الطفل بدقة.", text_en="A comprehensive assessment with modern tools to precisely identify the child's needs."),
    dict(page="branches", block="journey", key="j2", order=1, title_ar="الخطة الفردية", title_en="Individualized Plan", text_ar="خطةٌ تأهيليةٌ مصممةٌ خصيصًا لكل طفلٍ وأهدافه.", text_en="A rehabilitation plan tailored specifically to each child and their goals."),
    dict(page="branches", block="journey", key="j3", order=2, title_ar="الجلسات التأهيلية", title_en="Rehabilitation Sessions", text_ar="تنفيذ البرنامج على يد نخبةٍ من الأخصائيين المتخصصين.", text_en="The program is delivered by a select team of specialized practitioners."),
    dict(page="branches", block="journey", key="j4", order=3, title_ar="المتابعة والتمكين", title_en="Follow-up & Empowerment", text_ar="قياسٌ مستمرٌ للتقدّم ودمجٌ للأسرة في كل خطوة.", text_en="Continuous progress tracking and family involvement at every step."),
    # الاعتمادات
    dict(page="branches", block="accreditations", key="a1", order=0, title_ar="ISO 9001 — إدارة الجودة", title_en="ISO 9001 — Quality Management"),
    dict(page="branches", block="accreditations", key="a2", order=1, title_ar="برامج تأهيلية معتمدة", title_en="Accredited rehabilitation programs"),
    dict(page="branches", block="accreditations", key="a3", order=2, title_ar="كوادر مرخّصة ومؤهّلة", title_en="Licensed & qualified staff"),
    # نبذة ملف الفرع (قالب — {name} و{city} يُستبدلان تلقائياً باسم الفرع ومدينته)
    dict(page="branches", block="profile_intro", key="intro", order=0,
         text_ar="يقدّم {name} خدمات الرعاية والتأهيل المتكاملة لذوي الاحتياجات الخاصة وأسرهم في {city}، عبر فريقٍ متخصص وبرامج معتمدة مصممة وفق احتياج كل طفل، وبيئةٍ مهيأة بأحدث أدوات التقييم والتأهيل.",
         text_en="{name} provides integrated care and rehabilitation services for people with special needs and their families in {city}, through a specialized team, accredited programs tailored to each child's needs, and a facility equipped with the latest assessment and rehabilitation tools."),
]


def seed(apps, schema_editor):
    SectionItem = apps.get_model("content", "SectionItem")
    for row in ITEMS:
        SectionItem.objects.get_or_create(page=row["page"], block=row["block"], key=row["key"], defaults=row)


def unseed(apps, schema_editor):
    SectionItem = apps.get_model("content", "SectionItem")
    SectionItem.objects.filter(page="branches", block__in=["profile_stats", "journey", "accreditations", "profile_intro"]).delete()


class Migration(migrations.Migration):
    dependencies = [("content", "0030_alter_sectionitem_page")]
    operations = [migrations.RunPython(seed, unseed)]
