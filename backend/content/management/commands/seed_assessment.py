# -*- coding: utf-8 -*-
from django.core.management.base import BaseCommand
from content.m_assessment import AssessmentCard

# slug, icon,
#   ar(title, desc, duration, questions, ageRange, [questions...]),
#   en(title, desc, duration, questions, ageRange, [questions...])
ASSESSMENTS = [
    ("speech", "chat",
     ("فحص النطق",
      "فحص اضطرابات النطق واللغة والتواصل عند الأطفال.",
      "6 دقائق", "10 أسئلة", "4 - 12 سنة",
      [
          "هل ينطق طفلك الكلمات بوضوح يناسب عمره؟",
          "هل يكوّن طفلك جملاً مفيدة للتعبير عن احتياجاته؟",
          "هل يفهم الآخرون كلام طفلك بسهولة؟",
          "هل تنمو حصيلة طفلك اللغوية باستمرار؟",
          "هل يستطيع طفلك متابعة محادثة بسيطة؟",
      ]),
     ("Speech Screening",
      "Screening for speech, language, and communication disorders in children.",
      "6 minutes", "10 questions", "4 - 12 years",
      [
          "Does your child pronounce words clearly for their age?",
          "Does your child form meaningful sentences to express their needs?",
          "Do others understand your child's speech easily?",
          "Is your child's vocabulary growing steadily?",
          "Can your child follow a simple conversation?",
      ])),
    ("adhd", "bolt",
     ("تقييم ADHD",
      "تقييم أعراض اضطراب نقص الانتباه وفرط الحركة لدى الأطفال.",
      "4 دقائق", "12 سؤالاً", "4 - 13 سنة",
      [
          "هل يستطيع طفلك التركيز في مهمة حتى ينهيها؟",
          "هل يجلس طفلك بهدوء عندما يتطلّب الموقف ذلك؟",
          "هل ينتظر طفلك دوره دون تسرّع؟",
          "هل يتّبع طفلك التعليمات المكوّنة من عدّة خطوات؟",
          "هل يستطيع طفلك تنظيم أغراضه وإنهاء واجباته؟",
      ]),
     ("ADHD Assessment",
      "Assessment of attention-deficit/hyperactivity disorder symptoms in children.",
      "4 minutes", "12 questions", "4 - 13 years",
      [
          "Can your child focus on a task until it's finished?",
          "Does your child sit calmly when the situation requires it?",
          "Does your child wait their turn without rushing?",
          "Does your child follow multi-step instructions?",
          "Can your child organize their belongings and finish tasks?",
      ])),
    ("mchat", "puzzle",
     ("M-CHAT",
      "قائمة تدقيق معدّلة للكشف المبكر عن طيف التوحد لدى الأطفال الصغار.",
      "5 دقائق", "20 سؤالاً", "16 - 30 شهراً",
      [
          "هل ينظر طفلك في عينيك أثناء التحدث معه؟",
          "هل يستجيب طفلك عند مناداته باسمه؟",
          "هل يشير طفلك بإصبعه ليُريك شيئاً يهتم به؟",
          "هل يقلّد طفلك حركاتك أو تعبيرات وجهك؟",
          "هل يشارك طفلك في اللعب التخيّلي مع الآخرين؟",
      ]),
     ("M-CHAT",
      "Modified checklist for early detection of autism spectrum disorder in young children.",
      "5 minutes", "20 questions", "16 - 30 months",
      [
          "Does your child make eye contact when you talk to them?",
          "Does your child respond when called by their name?",
          "Does your child point to show you something they're interested in?",
          "Does your child imitate your movements or facial expressions?",
          "Does your child engage in pretend play with others?",
      ])),
    ("learning", "book",
     ("صعوبات التعلم",
      "تقييم مؤشرات صعوبات التعلم الأكاديمية والإدراكية.",
      "7 دقائق", "14 سؤالاً", "6 - 14 سنة",
      [
          "هل يميّز طفلك الحروف والأرقام المناسبة لعمره؟",
          "هل يتذكّر طفلك ما تعلّمه بسهولة؟",
          "هل تتناسب قدرة طفلك على القراءة أو الكتابة مع عمره؟",
          "هل يربط طفلك بين أصوات الحروف وأشكالها؟",
          "هل ينجز طفلك واجباته الدراسية دون صعوبة كبيرة؟",
      ]),
     ("Learning Difficulties",
      "Assessment of academic and cognitive indicators of learning difficulties.",
      "7 minutes", "14 questions", "6 - 14 years",
      [
          "Does your child recognize letters and numbers appropriate for their age?",
          "Does your child remember what they've learned easily?",
          "Is your child's reading or writing ability on par with their age?",
          "Does your child link letter sounds to their shapes?",
          "Does your child complete schoolwork without major difficulty?",
      ])),
    ("social", "users",
     ("المهارات الاجتماعية",
      "تقييم مهارات التفاعل الاجتماعي والتواصل مع الأقران.",
      "5 دقائق", "12 سؤالاً", "4 - 12 سنة",
      [
          "هل يبادر طفلك باللعب مع الأطفال الآخرين؟",
          "هل يشارك طفلك ألعابه وأدواته مع أقرانه؟",
          "هل يعبّر طفلك عن مشاعره بطريقة مناسبة؟",
          "هل يفهم طفلك مشاعر الآخرين ويتجاوب معها؟",
          "هل يكوّن طفلك صداقات ويحافظ عليها؟",
      ]),
     ("Social Skills",
      "Assessment of social interaction skills and communication with peers.",
      "5 minutes", "12 questions", "4 - 12 years",
      [
          "Does your child initiate play with other children?",
          "Does your child share toys and tools with peers?",
          "Does your child express their feelings appropriately?",
          "Does your child understand and respond to others' feelings?",
          "Does your child make and keep friends?",
      ])),
    ("sensory", "sensory",
     ("الملف الحسي",
      "تقييم الاستجابات الحسية ومعالجة المعلومات الحسية عند الطفل.",
      "6 دقائق", "15 سؤالاً", "3 - 10 سنوات",
      [
          "هل يتقبّل طفلك الأصوات العالية دون انزعاج شديد؟",
          "هل يتحمّل طفلك ملمس الملابس والأطعمة المختلفة؟",
          "هل تتناسب استجابة طفلك للمس والحركة مع الموقف؟",
          "هل يحافظ طفلك على توازنه أثناء الحركة واللعب؟",
          "هل يتأقلم طفلك مع الأماكن المزدحمة أو الجديدة؟",
      ]),
     ("Sensory Profile",
      "Assessment of sensory responses and sensory information processing in the child.",
      "6 minutes", "15 questions", "3 - 10 years",
      [
          "Does your child tolerate loud sounds without severe distress?",
          "Does your child tolerate different clothing and food textures?",
          "Is your child's response to touch and movement appropriate to the situation?",
          "Does your child keep their balance during movement and play?",
          "Does your child adapt to crowded or new places?",
      ])),
]


class Command(BaseCommand):
    help = "Seed the AssessmentCard table from the original site content (assessmentData.ts)."

    def handle(self, *args, **opts):
        created = updated = 0
        for index, (slug, icon, ar, en) in enumerate(ASSESSMENTS):
            _, was_created = AssessmentCard.objects.update_or_create(
                slug=slug,
                defaults=dict(
                    key=slug, icon=icon, order=index, published=True,
                    title_ar=ar[0], desc_ar=ar[1], duration_ar=ar[2],
                    questions_ar=ar[3], age_range_ar=ar[4], question_list_ar=ar[5],
                    title_en=en[0], desc_en=en[1], duration_en=en[2],
                    questions_en=en[3], age_range_en=en[4], question_list_en=en[5],
                ),
            )
            created += was_created
            updated += (not was_created)
        self.stdout.write(self.style.SUCCESS(
            f"Seeded assessment cards: {created} created, {updated} updated."
        ))
