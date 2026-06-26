# -*- coding: utf-8 -*-
"""تعبئة حقول تفاصيل الأخبار/الفعاليات الجديدة بالمحتوى الحالي (حتى يظهر في الـCMS قابلاً للتعديل
   ولا يتغيّر شكل الموقع). كارت الفعالية يُعبّأ فقط لأقسام الفعاليات والورش."""
from django.db import migrations

BODY_AR = [
    'تُنظّم مراكز عبور للتأهيل والرعاية فعالية متخصصة موجَّهة للأسر التي يُعاني أطفالها من صعوبات في التواصل والتفاعل. وتأتي هذه الفعالية في إطار الالتزام المستمر بتمكين الأسر وتزويدها بالأدوات العملية اللازمة لدعم أبنائها في البيئة المنزلية.',
    "تُقدَّم من قِبل نخبة من الأخصائيين المعتمدين في المراكز، وتتضمن عروضاً تقديمية تفاعلية، وأنشطة تطبيقية عملية، وجلسات نقاش مفتوحة تُتيح للمشاركين طرح الأسئلة والاستفسارات. كما تتضمن مواد مرجعية مطبوعة يحتفظ بها المشاركون بعد انتهائها.",
    "نُركّز على توفير بيئة تعليمية آمنة وداعمة، حيث يُشجَّع الآباء والأمهات على مشاركة تجاربهم وتساؤلاتهم. ويلتزم المدربون بتقديم المحتوى بأسلوب مُبسَّط وعملي يسهل تطبيقه في الحياة اليومية.",
    "في النهاية، سيتمكّن المشاركون من فهم المفاهيم الأساسية المتعلقة بالموضوع، واكتساب مهارات جديدة يمكن تطبيقها فوراً في المنزل، مما يُعزّز مسيرة التأهيل ويُسرّع من تحقيق الأهداف العلاجية.",
]
BODY_EN = [
    "Oboor Centers for Care & Rehabilitation are hosting a specialized event for families whose children face difficulties with communication and interaction. This event reflects our ongoing commitment to empowering families and equipping them with the practical tools they need to support their children at home.",
    "It is delivered by a select group of the centers' certified specialists and includes interactive presentations, hands-on practical activities, and open discussion sessions that give participants the chance to ask questions. It also includes printed reference materials that participants keep afterward.",
    "We focus on providing a safe and supportive learning environment, where parents are encouraged to share their experiences and questions. Our trainers are committed to presenting the content in a simple, practical way that is easy to apply in everyday life.",
    "By the end, participants will understand the key concepts related to the topic and gain new skills they can apply at home right away, strengthening the rehabilitation journey and helping reach therapeutic goals faster.",
]
LEARN_AR = [
    "فهم الأسس النظرية المتعلقة بالموضوع بشكل مُبسَّط وعملي",
    "اكتساب مهارات تطبيقية يمكن توظيفها مباشرةً في البيئة المنزلية",
    "التواصل مع أخصائيين متخصصين وطرح الأسئلة والاستفسارات",
    "الحصول على مواد مرجعية ومطبوعات تعليمية للاستخدام المنزلي",
]
LEARN_EN = [
    "Understand the theoretical foundations of the topic in a simple, practical way",
    "Gain practical skills you can apply directly at home",
    "Connect with specialized professionals and ask your questions",
    "Receive reference materials and educational handouts for use at home",
]
EVENT = {
    "time_ar": "٩:٠٠ صباحاً - ١٢:٠٠ ظهراً", "time_en": "9:00 AM - 12:00 PM",
    "location_ar": "قاعة التدريب الرئيسية - مركز عبور، الرياض", "location_en": "Main Training Hall - Oboor Center, Riyadh",
    "audience_ar": "أولياء الأمور والأسر", "audience_en": "Parents and families",
    "seats_ar": "٢٠ مقعداً", "seats_en": "20 seats",
    "reg_status_ar": "التسجيل مفتوح - مقاعد محدودة", "reg_status_en": "Registration open - limited seats",
}


def backfill(apps, schema_editor):
    News = apps.get_model("content", "NewsArticle")
    for n in News.objects.all():
        changed = []
        if not n.body_ar:
            n.body_ar, n.body_en = BODY_AR, BODY_EN; changed += ["body_ar", "body_en"]
        if not n.learn_ar:
            n.learn_ar, n.learn_en = LEARN_AR, LEARN_EN; changed += ["learn_ar", "learn_en"]
        if n.section in ("events", "workshops") and not n.time_ar:
            for k, v in EVENT.items():
                setattr(n, k, v); changed.append(k)
        if changed:
            n.save(update_fields=changed)


def noop(apps, schema_editor):
    pass


class Migration(migrations.Migration):
    dependencies = [("content", "0010_newsarticle_audience_ar_newsarticle_audience_en_and_more")]
    operations = [migrations.RunPython(backfill, noop)]
