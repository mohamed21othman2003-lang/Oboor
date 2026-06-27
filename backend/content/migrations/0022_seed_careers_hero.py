from django.db import migrations


HERO = [
    dict(page="careers", block="hero", key="badge", order=0,
         title_ar="انضم إلى فريق عبور", title_en="Join the Oboor Team"),
    dict(page="careers", block="hero", key="heading", order=1,
         title_ar="وظائف تصنع **فرقاً حقيقياً**",
         title_en="Careers that make **a real difference**",
         text_ar="في مراكز عبور، نبحث عن أخصائيين وكوادر تحمل شغفاً بالتأهيل والرعاية. انضم إلى بيئة مهنية متخصصة تُقدّر الكفاءة وتدعم نموك المهني، مع أثر إنساني ملموس في حياة المستفيدين وأسرهم.",
         text_en="At Oboor Centers, we are looking for specialists and professionals who are passionate about rehabilitation and care. Join a specialized professional environment that values competence and supports your professional growth, with a tangible human impact on the lives of beneficiaries and their families.",
         image="/figma/careers/hero-v2.jpg"),
    dict(page="careers", block="hero", key="stat", order=2,
         title_ar="وظائف متاحة", title_en="Open Positions",
         text_ar="وظائف", text_en="jobs"),
    dict(page="careers", block="list", key="header", order=0,
         title_ar="الوظائف المتاحة", title_en="Open Positions",
         text_ar="وظيفة متاحة", text_en="open positions"),
]


def seed(apps, schema_editor):
    SectionItem = apps.get_model("content", "SectionItem")
    for row in HERO:
        SectionItem.objects.get_or_create(
            page=row["page"], block=row["block"], key=row["key"],
            defaults=row,
        )


def unseed(apps, schema_editor):
    SectionItem = apps.get_model("content", "SectionItem")
    SectionItem.objects.filter(page="careers", block__in=["hero", "list"]).delete()


class Migration(migrations.Migration):
    dependencies = [("content", "0021_alter_programdetail_about_ar_and_more")]
    operations = [migrations.RunPython(seed, unseed)]
