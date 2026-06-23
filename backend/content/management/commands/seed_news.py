# -*- coding: utf-8 -*-
from django.core.management.base import BaseCommand
from content.models import NewsArticle

NEWS = [
    # section, featured, slug, order, image, ar(title,desc,cat,date), en(...)
    ("workshops", True, "language-support-workshop", 0, "/figma/news/wf.jpg",
     ('ورشة "دعم التواصل اللغوي في المنزل" للأسر',
      "ورشة تدريبية متخصصة تُقدّمها أخصائية علاج النطق لمساعدة الأسر على تعزيز مهارات التواصل واللغة لدى أطفالهم من خلال أنشطة عملية بسيطة يمكن تطبيقها في المنزل.",
      "ورشة تدريبية", "١٥ مارس ٢٠٢٥"),
     ('"Supporting Language Communication at Home" Workshop for Families',
      "A specialized training workshop delivered by a speech-language therapist to help families strengthen their child's communication and language skills through simple, practical activities that can be applied at home.",
      "Training Workshop", "March 15, 2025")),
    ("workshops", False, "sensory-integration-workshop", 1, "/figma/news/ws1.jpg",
     ("ورشة التكامل الحسي للآباء والأمهات", "تعريف الأسر بمبادئ التكامل الحسي وكيفية إنشاء بيئة منزلية داعمة تساعد الطفل على تنظيم استجاباته الحسية.", "ورشة تدريبية", "٢ مارس ٢٠٢٥"),
     ("Sensory Integration Workshop for Parents", "Introducing families to the principles of sensory integration and how to create a supportive home environment that helps the child regulate their sensory responses.", "Training Workshop", "March 2, 2025")),
    ("workshops", False, "behavior-management-workshop", 2, "/figma/news/ws2.jpg",
     ("ورشة إدارة السلوك للآباء والأمهات", "استراتيجيات عملية لتعديل السلوك وتعزيز السلوكيات الإيجابية لدى الأطفال ضمن الروتين اليومي.", "ورشة تدريبية", "٢ مارس ٢٠٢٥"),
     ("Behavior Management Workshop for Parents", "Practical strategies for behavior modification and reinforcing positive behaviors in children within the daily routine.", "Training Workshop", "March 2, 2025")),
    ("workshops", False, "communication-workshop", 3, "/figma/news/ws3.jpg",
     ("ورشة تنمية مهارات التواصل المبكر", "تزويد الأسر بأدوات تحفيز التواصل المبكر لدى الأطفال في مرحلة ما قبل الكلام عبر اللعب والتفاعل.", "ورشة تدريبية", "٢ مارس ٢٠٢٥"),
     ("Early Communication Skills Development Workshop", "Equipping families with tools to stimulate early communication in pre-verbal children through play and interaction.", "Training Workshop", "March 2, 2025")),
    ("center", False, "international-accreditation", 0, "/figma/news/nw1.jpg",
     ("عبور تُجدّد اعتمادها الدولي في خدمات التأهيل", "حصلت مراكز عبور على تجديد الاعتماد الدولي تقديراً لالتزامها بأعلى معايير الجودة في خدمات التأهيل والرعاية.", "أخبار المراكز", "٢ مارس ٢٠٢٥"),
     ("Oboor Renews Its International Accreditation in Rehabilitation Services", "Oboor Centers have earned the renewal of their international accreditation in recognition of their commitment to the highest quality standards in rehabilitation and care services.", "Center News", "March 2, 2025")),
    ("center", False, "new-branch-opening", 1, "/figma/news/nw2.jpg",
     ("افتتاح فرع جديد لمراكز عبور في المنطقة الشرقية", "توسّعاً في حضورنا بالمملكة، افتتحت مراكز عبور فرعاً جديداً مجهزاً بأحدث التقنيات لخدمة أسر المنطقة الشرقية.", "أخبار المراكز", "٢ مارس ٢٠٢٥"),
     ("Oboor Centers Open a New Branch in the Eastern Province", "Expanding our presence across the Kingdom, Oboor Centers have opened a new branch equipped with the latest technologies to serve families in the Eastern Province.", "Center News", "March 2, 2025")),
    ("center", False, "partnership", 2, "/figma/news/nw3.jpg",
     ("شراكة استراتيجية لتطوير برامج التدخل المبكر", "وقّعت مراكز عبور شراكة مع جهات متخصصة لتطوير وتوسيع برامج التدخل المبكر للأطفال في مختلف المناطق.", "أخبار المراكز", "٢ مارس ٢٠٢٥"),
     ("Strategic Partnership to Develop Early Intervention Programs", "Oboor Centers have signed a partnership with specialized entities to develop and expand Early Intervention programs for children across various regions.", "Center News", "March 2, 2025")),
    ("events", False, "autism-awareness-day", 0, "/figma/news/ev1.jpg",
     ("يوم التوعية بالتوحد — فعالية الباب المفتوح في الرياض", "تحتفل مراكز عبور باليوم العالمي للتوعية بالتوحد بفعالية الباب المفتوح، تتضمن ورشاً تفاعلية وأنشطة لأسر المستفيدين والزوار للتعريف بخدمات التأهيل.", "فعاليات", "٢ أبريل ٢٠٢٥"),
     ("Autism Awareness Day — Open House Event in Riyadh", "Oboor Centers celebrate World Autism Awareness Day with an open house event featuring interactive workshops and activities for beneficiaries' families and visitors to introduce our rehabilitation services.", "Events", "April 2, 2025")),
    ("events", False, "family-day", 1, "/figma/news/ev2.jpg",
     ("اليوم العائلي السنوي لأسر المستفيدين", "يوم ترفيهي وتوعوي يجمع أسر المستفيدين والكوادر في أجواء عائلية مميزة تعزّز الترابط وتبادل الخبرات بين الأسر.", "فعاليات", "٢ أبريل ٢٠٢٥"),
     ("Annual Family Day for Beneficiaries' Families", "A day of recreation and awareness bringing together beneficiaries' families and staff in a special family atmosphere that strengthens bonds and the exchange of experiences among families.", "Events", "April 2, 2025")),
    ("articles", True, "support-child-at-home", 0, "/figma/news/af.jpg",
     ("كيف تدعم طفلك في المنزل بعد جلسات العلاج؟", "دليل عملي للأسر يشرح كيفية استكمال التمارين العلاجية في المنزل وتعزيز ما يتعلّمه الطفل خلال الجلسات لتحقيق أفضل النتائج.", "توعية أسرية", "٨ مارس ٢٠٢٥"),
     ("How to Support Your Child at Home After Therapy Sessions", "A practical guide for families explaining how to continue therapeutic exercises at home and reinforce what the child learns during sessions to achieve the best results.", "Family Awareness", "March 8, 2025")),
    ("articles", False, "language-delay-signs", 1, "/figma/news/ar1.jpg",
     ("علامات التأخر اللغوي عند الأطفال — متى تطلب المساعدة؟", "يشرح هذا المقال علامات التأخر في اللغة والكلام حسب العمر، ومتى ينبغي استشارة الأخصائي.", "توعية أسرية", "١ مارس ٢٠٢٥"),
     ("Signs of Language Delay in Children — When to Seek Help?", "This article explains the signs of language and speech delay by age, and when you should consult a specialist.", "Family Awareness", "March 1, 2025")),
    ("articles", False, "understanding-autism", 2, "/figma/news/ar2.jpg",
     ("فهم التوحد: دليل الأسرة للمرحلة الأولى", "دليل شامل ومبسّط يُساعد الأسر على فهم تشخيص اضطراب طيف التوحد والخطوات الأولى بعده.", "توعية أسرية", "١٨ فبراير ٢٠٢٥"),
     ("Understanding Autism: A Family's Guide to the First Stage", "A comprehensive yet simple guide to help families understand an Autism Spectrum Disorder diagnosis and the first steps afterward.", "Family Awareness", "February 18, 2025")),
    ("articles", False, "occupational-therapy-meaning", 3, "/figma/news/ar3.jpg",
     ("العلاج الوظيفي — ماذا يعني لطفلي؟", "شرح وافٍ لمفهوم العلاج الوظيفي وأهدافه وما يمكن للطفل أن يكتسبه من خلاله.", "توعية أسرية", "٥ فبراير ٢٠٢٥"),
     ("Occupational Therapy — What Does It Mean for My Child?", "A thorough explanation of the concept of Occupational Therapy, its goals, and what your child can gain from it.", "Family Awareness", "February 5, 2025")),
]


class Command(BaseCommand):
    help = "Seed the NewsArticle table from the original site content."

    def handle(self, *args, **opts):
        created = updated = 0
        for section, featured, slug, order, image, ar, en in NEWS:
            _, was_created = NewsArticle.objects.update_or_create(
                slug=slug,
                defaults=dict(
                    section=section, featured=featured, order=order, image=image, published=True,
                    title_ar=ar[0], desc_ar=ar[1], category_ar=ar[2], date_ar=ar[3],
                    title_en=en[0], desc_en=en[1], category_en=en[2], date_en=en[3],
                ),
            )
            created += was_created
            updated += (not was_created)
        self.stdout.write(self.style.SUCCESS(f"Seeded news: {created} created, {updated} updated."))
