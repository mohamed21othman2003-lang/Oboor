# -*- coding: utf-8 -*-
from django.db import migrations

# محتوى صفحة «خذ الخطوة لعبور» (التواصل) — ننقله من الكود الثابت إلى الـCMS ليصبح
# قابلاً للتحرير. كل عنصر: (block, key, order, title_ar, title_en, text_ar, text_en).
ROWS = [
    # الهيرو
    ("hero", "badge", 0, "معًا نُمهّد لهم الطريق، ليعبروا بأمان", "Together, We Pave the Way for Their Safe Journey", "", ""),
    ("hero", "heading", 1, "خذ الخطوة **لعبور**", "Take the Step **to Oboor**",
     "نسعد بتواصلك معنا للإجابة على استفساراتك والاستماع إليك.",
     "We are pleased to connect with you, answer your inquiries, and listen to your needs."),
    # معلومات التواصل
    ("info", "main", 0, "معلومات التواصل", "Contact Information", "", ""),
    ("info", "email", 1, "البريد الإلكتروني", "Email", "نرد خلال ٢٤ ساعة", "We reply within 24 hours"),
    ("info", "customer", 2, "خدمة العملاء", "Customer Service", "للدعم والمتابعة", "For support & follow-up"),
    ("info", "unified", 3, "الرقم الموحد", "Unified Number", "للاستفسارات العامة", "For general inquiries"),
    # قسم النموذج
    ("form", "badge", 0, "دائمًا بالقرب", "Always Close to You", "", ""),
    ("form", "main", 1, "ارسل طلبك", "Send Your Request", "", ""),
    ("form", "feat1", 2, "رسالتك تصلنا", "Your message will reach us", "سنكون على تواصل معك خلال يوم واحد.", "We will respond within one day."),
    ("form", "feat2", 3, "تقييم مبدئي مجاني", "Free initial assessment", "نمنحك النظرة الأولى عن قدرات طفلك.", "Offering an early insight into your child's abilities."),
    ("form", "feat3", 4, "استشارة متخصصة", "Specialized consultation", "خبراؤنا هنا للإجابة عن كل أسئلتك.", "Our experts are here to answer all your questions."),
    ("form", "note", 5, "", "",
     "يرجى تعبئة النموذج التالي بدقة. سيتم مراجعة طلبك والرد عليك في أقرب وقت ممكن",
     "Please fill out the form below carefully. We'll review your request and reply as soon as possible."),
    # الخريطة
    ("map", "main", 0, "مراكزنا", "Our Branches",
     "اضغط على الخريطة أو اختر الفرع من القائمة لعرض تفاصيله.",
     "Click the map or pick a branch from the list to view its details."),
    # السوشيال
    ("social", "main", 0, "تابعنا", "Follow Us",
     "تواصل مع خدمة العملاء وسنساعدك في اختيار الفرع الأنسب لطفلك",
     "Contact customer service and we'll help you choose the best branch for your child."),
]


def seed(apps, schema_editor):
    SectionItem = apps.get_model("content", "SectionItem")
    for block, key, order, ta, te, xa, xe in ROWS:
        SectionItem.objects.get_or_create(
            page="contact", block=block, key=key,
            defaults=dict(order=order, title_ar=ta, title_en=te, text_ar=xa, text_en=xe),
        )


def unseed(apps, schema_editor):
    SectionItem = apps.get_model("content", "SectionItem")
    SectionItem.objects.filter(page="contact").delete()


class Migration(migrations.Migration):

    dependencies = [
        ("content", "0057_seed_success_story_highlights"),
    ]

    operations = [
        migrations.RunPython(seed, unseed),
    ]
