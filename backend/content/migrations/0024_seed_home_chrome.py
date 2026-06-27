# -*- coding: utf-8 -*-
from django.db import migrations


PARAS_AR = "\n".join([
    "بيدٍ خبيرة وقلبٍ حانٍ ينمو طفلك في مركز عبور المظلة المتخصصة في تأهيل ورعاية الأطفال من ذوي الاضطرابات النمائية عبر برامج التدخل المبكر؛ نعمل معكم ومعهم على بناء جودة حياتهم، ليتجاوزوا كل التحديات، ونأخذ بيد كل طفلٍ ليعبر نحو غدِه بعزمٍ وثبات.",
    "نبتكر في عبور برامج تأهيلية وخدمات عيادية متخصصة، ترتكز على أحدث الأسس العلمية في مجالات التأهيل، نُفصّل كل برنامج بدقة ليتناغم مع احتياجات كل طفل، ونضمن معها رحلة تطورٍ تَبني ثقته وتُسهّل دربه.",
    "تبدأ خطواتنا معكم لتمتد وتشمل طفلكم في كل مرحلة، نحرص في عبور على احتضان الأسرة بالدعم والتمكين والإرشاد المستمر، لتكونوا شركاءنا الحقيقيين في صياغة غدٍ أجمل لأبنائكم، ومتابعة تطورهم بشغفٍ في كل التفاصيل.",
    "في عبور، نبني من أجلهم بيئةً تفيض بالدفء والأمان، تُشجعهم على التعلم والتطور بكل ثقة، وبقلوبٍ تحمل سموّ الرسالة الإنسانية قبل كفاءة المهنة، نقف مع نخبة من أخصائيينا المؤهلين ليسكبوا خبراتهم حبًّا ورعاية، ويقدموا لأطفالكم أفضل مستويات التأهيل.",
])
PARAS_EN = "\n".join([
    "With expert hands and compassionate hearts, your child grows at Oboor Center — a specialized umbrella dedicated to the rehabilitation and care of children with developmental disorders through early intervention programs. Together with you and your child, we work to enhance the quality of life, overcome challenges, and guide every child toward a future filled with determination and confidence.",
    "At Oboor, we design specialized rehabilitation programs and clinical services grounded in the latest scientific approaches in the field of therapy. Each program is carefully tailored to meet every child's unique needs, ensuring a developmental journey that builds confidence and supports steady progress.",
    "Our journey with you extends across every stage of your child's development. We place strong emphasis on empowering and supporting families through continuous guidance and care, making you true partners in shaping a brighter future for your children and closely following their progress with dedication.",
    "At Oboor, we create an environment filled with warmth and safety — one that encourages learning and growth with confidence. Guided by a mission rooted in humanity before profession, our team of highly qualified specialists brings expertise delivered with care, offering your children the highest standards of rehabilitation.",
])

ITEMS = [
    dict(page="home", block="hero", key="chrome", order=0,
         title_ar="نرعى نقاءهم، ونبني غدهم", title_en="Nurturing Their Potential, Shaping Their Future",
         text_ar="من هنا، نُمكّنهم", text_en="From Here, We Empower Them"),

    dict(page="home", block="about", key="badge", order=0,
         title_ar="عن عبور", title_en="About Oboor", text_ar="تَعرّف أكثر", text_en="Learn More"),
    dict(page="home", block="about", key="intro", order=1,
         title_ar="تعرّف على مركز **عبور**", title_en="Get to know **Oboor** Center",
         text_ar=PARAS_AR, text_en=PARAS_EN),
    dict(page="home", block="about", key="accred", order=2,
         title_ar="مركز معتمد", title_en="Accredited Center",
         text_ar="خدمات تأهيلية متكاملة", text_en="Integrated rehabilitation services"),
    dict(page="home", block="about", key="img1", order=3, image="/figma/home/imgImageWithFallback2.jpg"),
    dict(page="home", block="about", key="img2", order=4, image="/figma/home/imgImageWithFallback1.jpg"),

    dict(page="home", block="smart_search", key="badge", order=0,
         title_ar="البحث الذكي عن الخدمات", title_en="Smart Service Search"),
    dict(page="home", block="smart_search", key="main", order=1,
         title_ar="دليلك الذكي **لخطوتك الأولى**", title_en="Your Smart Guide to the **First Step**",
         text_ar="بخطواتٍ بسيطة، حدّد فئة البرنامج والخدمة أو التقنية التي يحتاجها طفلك، واختر الفرع الأقرب إليك؛ لنأخذ بيد طفلك في رحلة تأهيلية متكاملة تُناسب احتياجاته.",
         text_en="In a few simple steps, identify the program category, service, or therapy your child needs, and choose the nearest branch. We will guide your child through a comprehensive rehabilitation journey tailored to their individual needs."),

    dict(page="home", block="stats", key="main", order=0,
         title_ar="شواهدُ أثرٍ تتحدث عن **نفسها**", title_en="Proof of Impact That Speaks for **Itself**",
         text_ar="أرقامٌ تعكس مسيرتنا نحو مستقبلهم، وأثرٌ نفخر بمشاركته.",
         text_en="Numbers that reflect our journey toward their future — and the impact we are proud to share."),

    dict(page="home", block="why_us", key="badge", order=0, title_ar="لماذا عبور؟", title_en="Why Oboor?"),
    dict(page="home", block="why_us", key="main", order=1,
         title_ar="العبور الأفضل يبدأ من **عبور**", title_en="The Best Path of Progress Begins at **Oboor**",
         text_ar="نُرسّخ ركائز التمكين، لنعبر بطفلك نحو غدٍ أبهى وأجمل.",
         text_en="We strengthen the foundations of empowerment, guiding your child toward a brighter and more meaningful future."),

    dict(page="home", block="success", key="badge", order=0, title_ar="أبطال عبور", title_en="Oboor Champions"),
    dict(page="home", block="success", key="main", order=1,
         title_ar="عبروا، **وعبّروا!**", title_en="They crossed barriers and found **their voice**",
         text_ar="قصص لحياة تغيرت، وملامح طفولة استعادت بهجتها، نفخر بمسيرة رافقنا فيها أبطالنا من أول خطوة وحتى التمكين.",
         text_en="Stories of transformed lives and childhoods that have regained their joy. We take pride in the journeys we have accompanied — supporting our champions from their very first step to empowerment."),

    dict(page="home", block="gallery", key="badge", order=0, title_ar="المعرض", title_en="Gallery"),
    dict(page="home", block="gallery", key="main", order=1, title_ar="ملامح من عبور", title_en="Moments from Oboor"),

    dict(page="home", block="news", key="main", order=0,
         title_ar="صدى العبور وحراكه", title_en="The Impact of Oboor in Motion",
         text_ar="هنا ندوّن تفاصيل الأثر، تابع آخر المستجدات.",
         text_en="Here, we document the details of our impact. Stay updated with the latest news and developments."),
]


def seed(apps, schema_editor):
    SectionItem = apps.get_model("content", "SectionItem")
    for row in ITEMS:
        SectionItem.objects.get_or_create(
            page=row["page"], block=row["block"], key=row["key"], defaults=row,
        )


def unseed(apps, schema_editor):
    SectionItem = apps.get_model("content", "SectionItem")
    SectionItem.objects.filter(page="home").delete()


class Migration(migrations.Migration):
    dependencies = [("content", "0023_alter_jobopening_city_ar_alter_jobopening_date_ar_and_more")]
    operations = [migrations.RunPython(seed, unseed)]
