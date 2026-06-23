# -*- coding: utf-8 -*-
from django.core.management.base import BaseCommand
from content.m_sections import SectionItem


# ============================================================
# 1. success / stats  -> (value, label_ar, label_en)
# ============================================================
SUCCESS_STATS = [
    ("+1300", "جلسة تأهيل شهريًا", "rehabilitation sessions per month"),
    ("96%", "نسبة التحسن المُسجّلة", "recorded improvement rate"),
    ("+500", "قصة نجاح موثّقة", "documented success stories"),
]

# ============================================================
# 2. success / highlights  -> single row (data_ar, data_en dicts)
#    journeyTemplate converted from arrow fn to string with {name} placeholder.
# ============================================================
SUCCESS_HIGHLIGHTS_AR = {
    "badge": "حياة جديدة وثقة",
    "durationLabel": "المدة",
    "ageLabel": "العمر",
    "programLabel": "البرنامج",
    "program": "علاج النطق واللغة",
    "specialistTitle": "من الأخصائي",
    "journeyTitle": "رحلة العلاج",
    "journeyTemplate": "التحق {name} ببرنامج مكثّف لعلاج النطق واللغة، ركّزت جلساته على تحفيز النطق وبناء المفردات وتمارين التواصل، مع إشراك الأسرة في التطبيق المنزلي.",
    "resultsTitle": "أبرز النتائج",
    "results": [
        "نطق واضح للحروف والكلمات",
        "تكوين جُمل كاملة ومترابطة",
        "تواصل اجتماعي بثقة في المواقف اليومية",
        "تحسّن ملحوظ في التفاعل داخل الفصل",
    ],
    "storyTitle": "كلمة ولي الأمر",
}

SUCCESS_HIGHLIGHTS_EN = {
    "badge": "A new life & confidence",
    "durationLabel": "Duration",
    "ageLabel": "Age",
    "programLabel": "Program",
    "program": "Speech & Language Therapy",
    "specialistTitle": "From the specialist",
    "journeyTitle": "Treatment Journey",
    "journeyTemplate": "{name} joined an intensive Speech & Language Therapy program focused on stimulating speech, building vocabulary, and communication exercises, with the family involved in home practice.",
    "resultsTitle": "Key Results",
    "results": [
        "Clear pronunciation of letters and words",
        "Building complete, coherent sentences",
        "Confident social communication in everyday situations",
        "Noticeable improvement in classroom interaction",
    ],
    "storyTitle": "Parent's Words",
}

# ============================================================
# 3. specialists / stats  -> (value, label_ar, label_en)
# ============================================================
SPECIALIST_STATS = [
    ("+8", "سنوات خبرة", "Years of Experience"),
    ("+30", "أخصائي متخصص", "Specialized Therapists"),
]

# ============================================================
# 4. specialists / join_cards  -> (icon, title_ar, desc_ar, title_en, desc_en)
# ============================================================
JOIN_CARDS = [
    ("growth", "فرص نمو", "فرص ترقي حقيقية وبيئة داعمة تمكّنك من بناء مسيرة مهنية ناجحة ومستدامة.",
     "Growth Opportunities", "Real opportunities for advancement and a supportive environment that empowers you to build a successful, sustainable career."),
    ("building", "بيئة عمل احترافية", "انضم إلى بيئة طبية متطورة ومجهزة بأحدث التقنيات والأدوات العلاجية.",
     "Professional Work Environment", "Join an advanced medical environment equipped with the latest technologies and therapeutic tools."),
    ("book", "تطوير مستمر", "نوفر برامج تدريب وتطوير مستمرة لتعزيز مهاراتك المهنية وأحدث الممارسات العلاجية.",
     "Continuous Development", "We provide ongoing training and development programs to enhance your professional skills and the latest therapeutic practices."),
    ("heart", "تأثير حقيقي", "كن جزءاً من رحلة تغيير حياة الأطفال وأسرهم، وأحدث فارقاً حقيقياً كل يوم.",
     "Real Impact", "Be part of a journey that changes the lives of children and their families, and make a real difference every day."),
]

# ============================================================
# 5. specialists / contact_prompt  -> single row
# ============================================================
CONTACT_PROMPT_AR = {
    "title": "هل تريد التواصل مع هذا الأخصائي؟",
    "subtitle": "اضغط على زر التواصل أدناه وسيتصل بكم فريقنا في أقرب وقت",
}
CONTACT_PROMPT_EN = {
    "title": "Would you like to get in touch with this specialist?",
    "subtitle": "Click the contact button below and our team will reach out to you as soon as possible",
}

# ============================================================
# 6. assessment / stats  -> (value, label_ar, label_en)
# ============================================================
ASSESS_STATS = [
    ("٢٤ ساعة", "استجابة سريعة", "Fast Response"),
    ("٩٨٪", "رضا الأهل", "Parent Satisfaction"),
    ("+٥٠٠", "أسرة استفادت", "Families Helped"),
]
# NOTE: value carries AR-localized number for index 0/2; EN value differs.
ASSESS_STATS_VALUE_EN = ["24 hours", "98%", "+500"]

# ============================================================
# 7. assessment / features  -> (icon, title_ar, desc_ar, title_en, desc_en)
# ============================================================
ASSESS_FEATURES = [
    ("heart", "تقليل القلق لدى الأسرة", "نساعدك على فهم وضع طفلك بوضوح ونطمئنك بخطة عمل واضحة ومجرّبة.",
     "Reducing Family Anxiety", "We help you clearly understand your child's situation and reassure you with a clear, proven action plan."),
    ("target", "تحديد التدخل المناسب", "نقترح البرامج والخدمات الأنسب لحالة طفلك بناءً على نتائج التقييم.",
     "Identifying the Right Intervention", "We recommend the programs and services best suited to your child's case based on the assessment results."),
    ("chart", "فهم نقاط القوة والضعف", "نكشف ما يتميّز به طفلك ونحدّد المجالات التي تحتاج إلى دعم إضافي.",
     "Understanding Strengths & Weaknesses", "We reveal what makes your child stand out and identify the areas that need extra support."),
    ("search", "اكتشاف مبكر للصعوبات", "التعرّف المبكر على أي تحديات يواجهها طفلك يفتح باب التدخل في الوقت المناسب.",
     "Early Detection of Difficulties", "Early recognition of any challenges your child faces opens the door to timely intervention."),
]

# ============================================================
# 8. assessment / steps  -> (icon, title_ar, desc_ar, title_en, desc_en)
# ============================================================
ASSESS_STEPS = [
    ("question", "اختر التقييم المناسب", "حدّد نوع التقييم الأنسب لطفلك من القائمة.",
     "Choose the Right Assessment", "Select the assessment type best suited to your child from the list."),
    ("list", "الإجابة على الأسئلة", "أجب عن أسئلة بسيطة وواضحة عن طفلك.",
     "Answer the Questions", "Answer simple, clear questions about your child."),
    ("briefcase", "اضف بياناتك", "أدخل بيانات التواصل لاستلام النتيجة.",
     "Add Your Details", "Enter your contact details to receive the result."),
    ("bulb", "نتائج التقييم الأولي", "احصل على نتيجة فورية وتوصية مناسبة.",
     "Preliminary Assessment Results", "Get an instant result and a suitable recommendation."),
]

# ============================================================
# 9. assessment / prelim_questions  -> (text_ar, text_en)
# ============================================================
PRELIM_QUESTIONS = [
    ("هل يتواصل طفلك بالكلام بشكل يناسب عمره؟",
     "Does your child communicate verbally in a way appropriate for their age?"),
    ("هل يستجيب طفلك عند مناداته باسمه؟",
     "Does your child respond when called by their name?"),
    ("هل يتفاعل طفلك مع الأطفال الآخرين أثناء اللعب؟",
     "Does your child interact with other children during play?"),
    ("هل يستطيع طفلك التركيز في مهمة واحدة لفترة مناسبة؟",
     "Can your child focus on a single task for an appropriate length of time?"),
    ("هل يتّبع طفلك التعليمات البسيطة دون صعوبة؟",
     "Does your child follow simple instructions without difficulty?"),
]

# ============================================================
# 10. assessment / answer_options  -> (text_ar, text_en)
# ============================================================
ANSWER_OPTIONS = [
    ("نعم", "Yes"),
    ("أحياناً", "Sometimes"),
    ("لا", "No"),
]

# ============================================================
# 11. branches / map_regions  -> (name_ar, name_en, count, color)
# ============================================================
MAP_REGIONS = [
    ("الرياض", "Riyadh", 8, "#2cbcc8"),
    ("مكة المكرمة", "Makkah", 8, "#f59e0b"),
    ("المنطقة الشرقية", "Eastern Province", 4, "#8b5cf6"),
    ("المدينة المنورة", "Madinah", 4, "#ec4899"),
    ("عسير", "Asir", 3, "#10b981"),
    ("جدة", "Jeddah", 3, "#3b82f6"),
    ("تبوك", "Tabuk", 2, "#ef4444"),
]

# ============================================================
# 12. branches / features  -> (icon, title_ar, desc_ar, title_en, desc_en)
# ============================================================
BRANCH_FEATURES = [
    ("building", "بيئةٌ مهيأة", "مرافقُ مجهزةٌ بأحدث أدوات التأهيل والتقييم.",
     "Prepared Environment", "Facilities equipped with the latest rehabilitation and assessment tools."),
    ("heart", "العائلةُ في صلب التأهيل", "نحرصُ على وجودكم معنا لنشاركّكم كل خطوة ونجاح.",
     "Family at the Core of Care", "We ensure your presence at every step, sharing every progress and achievement."),
    ("shield", "برامجُ معتمدة", "رحلةٌ تأهيليةٌ مدروسة، تُبنى على أسسٍ علميةٍ موثوقة.",
     "Accredited Programs", "Structured rehabilitation journeys built on trusted scientific foundations."),
    ("graduation", "روّادٌ متخصصون", "نخبةٌ من الأخصائيين، يجمعون بين المعرفة التخصصية، والقدرة على استيعاب حاجة كل طفلٍ بدقة.",
     "Specialized Pioneers", "A team of experts combining professional knowledge with a precise understanding of each child's needs."),
]

# ============================================================
# 13. careers / cities  -> (city_ar, city_en)
# ============================================================
CITIES = [
    ("الكل", "All"),
    ("الرياض", "Riyadh"),
    ("الشرقية", "Eastern Province"),
    ("القصيم", "Qassim"),
    ("جازان", "Jazan"),
    ("المدينة المنورة", "Madinah"),
    ("عسير", "Asir"),
    ("الخرج", "Al-Kharj"),
]

# ============================================================
# 14. careers / employment_types  -> (type_ar, type_en)
# ============================================================
EMPLOYMENT_TYPES = [
    ("الكل", "All"),
    ("دوام كامل", "Full-time"),
    ("دوام جزئي", "Part-time"),
    ("عن بُعد", "Remote"),
]

# ============================================================
# 15. news / categories  -> (label_ar, label_en, count or None)
# ============================================================
NEWS_CATEGORIES = [
    ("الكل", "All", 7),
    ("أخبار المراكز", "Center News", None),
    ("الفعاليات", "Events", None),
    ("الورش التدريبية", "Training Workshops", None),
    ("التوعية الأسرية", "Family Awareness", None),
]


class Command(BaseCommand):
    help = "Seed the generic SectionItem model with all small page-section content blocks."

    def handle(self, *args, **opts):
        created = 0
        updated = 0
        per_block = {}

        def upsert(page, block, key, **defaults):
            nonlocal created, updated
            defaults.setdefault("published", True)
            _, was_created = SectionItem.objects.update_or_create(
                page=page, block=block, key=key, defaults=defaults,
            )
            if was_created:
                created += 1
            else:
                updated += 1
            per_block[f"{page}/{block}"] = per_block.get(f"{page}/{block}", 0) + 1

        # 1. success / stats
        for i, (value, ar, en) in enumerate(SUCCESS_STATS):
            upsert("success", "stats", str(i), order=i, value=value,
                   title_ar=ar, title_en=en)

        # 2. success / highlights (single row)
        upsert("success", "highlights", "default", order=0,
               data_ar=SUCCESS_HIGHLIGHTS_AR, data_en=SUCCESS_HIGHLIGHTS_EN)

        # 3. specialists / stats
        for i, (value, ar, en) in enumerate(SPECIALIST_STATS):
            upsert("specialists", "stats", str(i), order=i, value=value,
                   title_ar=ar, title_en=en)

        # 4. specialists / join_cards
        for i, (icon, t_ar, d_ar, t_en, d_en) in enumerate(JOIN_CARDS):
            upsert("specialists", "join_cards", str(i), order=i, icon=icon,
                   title_ar=t_ar, title_en=t_en, text_ar=d_ar, text_en=d_en)

        # 5. specialists / contact_prompt (single row)
        upsert("specialists", "contact_prompt", "default", order=0,
               title_ar=CONTACT_PROMPT_AR["title"], title_en=CONTACT_PROMPT_EN["title"],
               text_ar=CONTACT_PROMPT_AR["subtitle"], text_en=CONTACT_PROMPT_EN["subtitle"])

        # 6. assessment / stats (value localized: AR in value, EN tracked separately)
        for i, (value, ar, en) in enumerate(ASSESS_STATS):
            upsert("assessment", "stats", str(i), order=i, value=value,
                   title_ar=ar, title_en=en,
                   data_ar={"value": value}, data_en={"value": ASSESS_STATS_VALUE_EN[i]})

        # 7. assessment / features
        for i, (icon, t_ar, d_ar, t_en, d_en) in enumerate(ASSESS_FEATURES):
            upsert("assessment", "features", str(i), order=i, icon=icon,
                   title_ar=t_ar, title_en=t_en, text_ar=d_ar, text_en=d_en)

        # 8. assessment / steps (order = step number)
        for i, (icon, t_ar, d_ar, t_en, d_en) in enumerate(ASSESS_STEPS):
            upsert("assessment", "steps", str(i), order=i, icon=icon,
                   title_ar=t_ar, title_en=t_en, text_ar=d_ar, text_en=d_en)

        # 9. assessment / prelim_questions
        for i, (q_ar, q_en) in enumerate(PRELIM_QUESTIONS):
            upsert("assessment", "prelim_questions", str(i), order=i,
                   title_ar=q_ar, title_en=q_en)

        # 10. assessment / answer_options
        for i, (o_ar, o_en) in enumerate(ANSWER_OPTIONS):
            upsert("assessment", "answer_options", str(i), order=i,
                   title_ar=o_ar, title_en=o_en)

        # 11. branches / map_regions
        for i, (name_ar, name_en, count, color) in enumerate(MAP_REGIONS):
            upsert("branches", "map_regions", str(i), order=i,
                   title_ar=name_ar, title_en=name_en, value=str(count), color=color)

        # 12. branches / features
        for i, (icon, t_ar, d_ar, t_en, d_en) in enumerate(BRANCH_FEATURES):
            upsert("branches", "features", str(i), order=i, icon=icon,
                   title_ar=t_ar, title_en=t_en, text_ar=d_ar, text_en=d_en)

        # 13. careers / cities
        for i, (c_ar, c_en) in enumerate(CITIES):
            upsert("careers", "cities", str(i), order=i,
                   title_ar=c_ar, title_en=c_en)

        # 14. careers / employment_types
        for i, (t_ar, t_en) in enumerate(EMPLOYMENT_TYPES):
            upsert("careers", "employment_types", str(i), order=i,
                   title_ar=t_ar, title_en=t_en)

        # 15. news / categories
        for i, (label_ar, label_en, count) in enumerate(NEWS_CATEGORIES):
            upsert("news", "categories", str(i), order=i,
                   title_ar=label_ar, title_en=label_en,
                   value=(str(count) if count is not None else ""))

        total = created + updated
        self.stdout.write(self.style.SUCCESS(
            f"Seeded SectionItem: {created} created, {updated} updated ({total} total rows)."
        ))
        for block_key in sorted(per_block):
            self.stdout.write(f"  {block_key}: {per_block[block_key]}")
