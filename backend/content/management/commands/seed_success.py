# -*- coding: utf-8 -*-
from django.core.management.base import BaseCommand
from content.m_success import SuccessStory

# slug, image, ar(name, age, category, durationLabel, before, after, quote, metaDuration, metaAge, author),
#                en(name, age, category, durationLabel, before, after, quote, metaDuration, metaAge, author)
STORIES = [
    ("tameem", "/figma/success-stories/tameem.jpg",
     ("تميم", "3 سنوات", "علاج النطق واللغة", "٢ شهراً من جلسات النطق",
      "كان يعاني من صعوبات شديدة في النطق",
      "تحدث بطلاقة وثقة عالية في المواقف اليومية",
      "الفريق المتخصص في عبور لم يعامل تميم كحالة، بل كإنسانة تستحق كل الاهتمام.",
      "3 أشهر", "3 سنوات", "أم تميم"),
     ("Tameem", "3 years", "Speech & Language Therapy", "2 months of speech sessions",
      "He suffered from severe speech difficulties",
      "He speaks fluently and with confidence in everyday situations",
      "The specialized team at Oboor did not treat Tameem as a case, but as a person who deserves every attention.",
      "3 months", "3 years", "Tameem's mother")),
    ("fahd", "/figma/success-stories/fahd.jpg",
     ("فهد", "3 سنوات", "علاج النطق واللغة", "٢ شهراً من جلسات النطق",
      "لم يكن يستطيع التواصل بشكل مستقل",
      "بات يتواصل بجمل كاملة وينخرط في الأنشطة الاجتماعية",
      "مركز عبور غيّر حياة ابني تماماً. رأيت تطوراً لم أكن أتخيله ممكناً",
      "3 أشهر", "3 سنوات", "أم فهد"),
     ("Fahd", "3 years", "Speech & Language Therapy", "2 months of speech sessions",
      "He was unable to communicate independently",
      "He now communicates in full sentences and takes part in social activities",
      "Oboor Center completely changed my son's life. I saw progress I never imagined possible.",
      "3 months", "3 years", "Fahd's mother")),
    ("sara", "/figma/success-stories/sara.jpg",
     ("سارة", "٨ سنوات", "علاج النطق واللغة", "٢ شهراً من جلسات النطق",
      "كانت تعاني من صعوبات شديدة في النطق",
      "تتحدث بطلاقة وثقة عالية في المواقف اليومية",
      "الفريق المتخصص في عبور لم يعامل سارة كحالة، بل كإنسانة تستحق كل الاهتمام.",
      "3 أشهر", "٥ سنوات", "أم ساره"),
     ("Sara", "8 years", "Speech & Language Therapy", "2 months of speech sessions",
      "She suffered from severe speech difficulties",
      "She speaks fluently and with confidence in everyday situations",
      "The specialized team at Oboor did not treat Sara as a case, but as a person who deserves every attention.",
      "3 months", "5 years", "Sara's mother")),
    ("aseel", "/figma/success-stories/aseel.jpg",
     ("اسيل", "6 سنوات", "علاج النطق واللغة", "٢ شهراً من جلسات النطق",
      "كانت تعاني من صعوبات شديدة في النطق",
      "تتحدث بطلاقة وثقة عالية في المواقف اليومية",
      "الفريق المتخصص في عبور لم يعامل اسيل، بل كإنسانة تستحق كل الاهتمام.",
      "3 أشهر", "6 سنوات", "أم اسيل"),
     ("Aseel", "6 years", "Speech & Language Therapy", "2 months of speech sessions",
      "She suffered from severe speech difficulties",
      "She speaks fluently and with confidence in everyday situations",
      "The specialized team at Oboor did not treat Aseel as a case, but as a person who deserves every attention.",
      "3 months", "6 years", "Aseel's mother")),
    ("maryam", "/figma/success-stories/maryam.jpg",
     ("مريم", "10 سنوات", "علاج النطق واللغة", "٢ شهراً من جلسات النطق",
      "كانت تعاني من صعوبات شديدة في النطق",
      "تتحدث بطلاقة وثقة عالية في المواقف اليومية",
      "الفريق المتخصص في عبور لم يعامل مريم كحالة، بل كإنسانة تستحق كل الاهتمام.",
      "3 أشهر", "10 سنوات", "أم مريم"),
     ("Maryam", "10 years", "Speech & Language Therapy", "2 months of speech sessions",
      "She suffered from severe speech difficulties",
      "She speaks fluently and with confidence in everyday situations",
      "The specialized team at Oboor did not treat Maryam as a case, but as a person who deserves every attention.",
      "3 months", "10 years", "Maryam's mother")),
    ("omar", "/figma/success-stories/omar.jpg",
     ("عمر", "4 سنوات", "علاج النطق واللغة", "٢ شهراً من جلسات النطق",
      "كان يعاني من صعوبات شديدة في النطق",
      "تحدث بطلاقة وثقة عالية في المواقف اليومية",
      "الفريق المتخصص في عبور لم يعامل عمر كحالة، بل كإنسانة تستحق كل الاهتمام.",
      "3 أشهر", "٥ سنوات", "أم عمر"),
     ("Omar", "4 years", "Speech & Language Therapy", "2 months of speech sessions",
      "He suffered from severe speech difficulties",
      "He speaks fluently and with confidence in everyday situations",
      "The specialized team at Oboor did not treat Omar as a case, but as a person who deserves every attention.",
      "3 months", "5 years", "Omar's mother")),
]


class Command(BaseCommand):
    help = "Seed the SuccessStory table from the original site content."

    def handle(self, *args, **opts):
        created = updated = 0
        for order, (slug, image, ar, en) in enumerate(STORIES):
            _, was_created = SuccessStory.objects.update_or_create(
                slug=slug,
                defaults=dict(
                    order=order, image=image, published=True,
                    name_ar=ar[0], age_ar=ar[1], category_ar=ar[2], duration_label_ar=ar[3],
                    before_ar=ar[4], after_ar=ar[5], quote_ar=ar[6],
                    meta_duration_ar=ar[7], meta_age_ar=ar[8], author_ar=ar[9],
                    name_en=en[0], age_en=en[1], category_en=en[2], duration_label_en=en[3],
                    before_en=en[4], after_en=en[5], quote_en=en[6],
                    meta_duration_en=en[7], meta_age_en=en[8], author_en=en[9],
                ),
            )
            created += was_created
            updated += (not was_created)
        self.stdout.write(self.style.SUCCESS(f"Seeded success stories: {created} created, {updated} updated."))
