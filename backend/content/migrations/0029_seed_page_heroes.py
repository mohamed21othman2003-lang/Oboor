# -*- coding: utf-8 -*-
from django.db import migrations


ITEMS = [
    # ---- الفروع (مراكزنا) ----
    dict(page="branches", block="hero", key="badge", order=0,
         title_ar="مراكزنا في المملكة", title_en="Our Branches Across the Kingdom"),
    dict(page="branches", block="hero", key="heading", order=1,
         title_ar="**مراكزنا**، رعايةٌ تمتد من حولك", title_en="**Our Centers** — Care That Extends to You",
         text_ar="ابحث عن أقرب فرع إليك واستكشف خدماتنا في مختلف مناطق المملكة العربية السعودية.",
         text_en="Find your nearest branch and explore our services across the various regions of Saudi Arabia."),
    dict(page="branches", block="hero", key="map_heading", order=2,
         title_ar="على بُعد **خطوة منك**", title_en="Just **One Step Away**",
         text_ar="بضغطة على الخريطة، تجد أقرب فرع إليك، وكل ما تحتاجه للوصول إلينا.",
         text_en="With a tap on the map, find the nearest branch and everything you need to reach us."),
    dict(page="branches", block="hero", key="features_heading", order=3,
         title_ar="بيئتنا، **أمانٌ وتمكين**", title_en="Our Environment — **Safety and Empowerment**",
         text_ar="في كل مراكزنا، نحتضن طفلك برعاية متخصصة، لندعمه في رحلة نموّه، ونمكّنه ليشق طريقه باستقلالية.",
         text_en="Across all our branches, we embrace your child with specialized care that supports their growth and empowers them to move forward with independence."),

    # ---- البرامج (index) ----
    dict(page="programs", block="hero", key="badge", order=0,
         title_ar="برامجنا التمكينية في المملكة", title_en="Our Services in Saudi Arabia"),
    dict(page="programs", block="hero", key="heading", order=1,
         title_ar="برامجنا **التمكينية**", title_en="Our Empowerment **Programs**",
         text_ar="نقدم في عبور برامج تأهيلية وخدمات عيادية وتقنيات تأهيلية لدعم الأطفال والأسر وفق احتياجات كل حالة.",
         text_en="At Oboor we offer rehabilitation programs, clinical services, and rehabilitation technologies to support children and families according to each case's needs."),

    # ---- رُوّادنا (الأخصائيون) ----
    dict(page="specialists", block="hero", key="badge", order=0,
         title_ar="فريق معتمد ومؤهل", title_en="A certified and qualified team"),
    dict(page="specialists", block="hero", key="heading", order=1,
         title_ar="روّادنا", title_en="Our Pioneers",
         text_ar="تعرف على فريقنا من الأخصائيين المؤهلين في مختلف مجالات التأهيل والعلاج، واختر الأنسب لاحتياجات طفلك.",
         text_en="Meet our team of qualified specialists across the various fields of rehabilitation and therapy, and choose the best fit for your child's needs."),

    # ---- التقييم ----
    dict(page="assessment", block="hero", key="badge", order=0,
         title_ar="تقييم مجاني وسريع", title_en="Free & Fast Assessment"),
    dict(page="assessment", block="hero", key="heading", order=1,
         title_ar="قيّم ابنك **الآن**", title_en="Assess Your Child **Now**",
         text_ar="احصل على تقييم أولي سريع يساعدك على فهم احتياجات طفلك وتحديد الخطوات الصحيحة نحو مستقبل أفضل.",
         text_en="Get a quick preliminary assessment that helps you understand your child's needs and identify the right steps toward a better future."),
    dict(page="assessment", block="hero", key="why_heading", order=2,
         title_ar="خطوة صغيرة، فرق كبير في حياة طفلك", title_en="A small step, a big difference in your child's life",
         text_ar="التقييم المبكر هو الخطوة الأولى نحو مستقبل أفضل. نحن نساعدك على فهم احتياجات طفلك بطريقة بسيطة وواضحة.",
         text_en="Early assessment is the first step toward a better future. We help you understand your child's needs in a simple, clear way."),
    dict(page="assessment", block="hero", key="steps_heading", order=3,
         title_ar="رحلة بسيطة من ٥ خطوات", title_en="A simple 5-step journey",
         text_ar="نأخذ بيدك خطوة بخطوة نحو فهم احتياجات طفلك.",
         text_en="We guide you step by step toward understanding your child's needs."),
]


def seed(apps, schema_editor):
    SectionItem = apps.get_model("content", "SectionItem")
    for row in ITEMS:
        SectionItem.objects.get_or_create(page=row["page"], block=row["block"], key=row["key"], defaults=row)


def unseed(apps, schema_editor):
    SectionItem = apps.get_model("content", "SectionItem")
    for p in ["branches", "programs", "specialists", "assessment"]:
        SectionItem.objects.filter(page=p, block="hero").delete()


class Migration(migrations.Migration):
    dependencies = [("content", "0028_seed_about_main_branch")]
    operations = [migrations.RunPython(seed, unseed)]
