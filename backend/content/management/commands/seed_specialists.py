# -*- coding: utf-8 -*-
from django.core.management.base import BaseCommand
from content.m_specialists import Specialist

# slug, image, ar(name, specialty, desc, days, branch, experience, hours, branches, about, qualifications),
#                en(name, specialty, desc, days, branch, experience, hours, branches, about, qualifications)
SPECIALISTS = [
    ("mohammed-abdullah", "/figma/specialists/sp1.jpg",
     ("د. محمد عبدالله", "علاج وظيفي",
      "خبير في العلاج الطبيعي للأطفال وتأهيل الحالات العصبية والعضلية الهيكلية",
      "الأحد – الخميس", "الفرع الرئيسي – الرياض", "6 سنوات خبرة", "9:00 ص – 5:00 م",
      "الرياض",
      "يتمتع الدكتور محمد بخبرة تمتد لأكثر من 6 سنوات في مجال العلاج الوظيفي للأطفال. متخصص في تأهيل الحالات العصبية والعضلية الهيكلية وتنمية المهارات الحركية الدقيقة، ويحرص على إشراك الأسرة في الخطة العلاجية لضمان أفضل النتائج.",
      ["بكالوريوس العلاج الوظيفي - جامعة الملك سعود", "دبلوم التكامل الحسي للأطفال", "شهادة معتمدة في تأهيل الحالات العصبية"]),
     ("Dr. Mohammed Abdullah", "Occupational Therapy",
      "Expert in pediatric physical therapy and the rehabilitation of neurological and musculoskeletal conditions",
      "Sunday – Thursday", "Main Branch – Riyadh", "6 years of experience", "9:00 AM – 5:00 PM",
      "Riyadh",
      "Dr. Mohammed has more than 6 years of experience in pediatric occupational therapy. He specializes in rehabilitating neurological and musculoskeletal conditions and developing fine motor skills, and is keen to involve the family in the treatment plan to ensure the best outcomes.",
      ["Bachelor's in Occupational Therapy – King Saud University", "Diploma in Sensory Integration for Children", "Certified in Rehabilitation of Neurological Conditions"])),
    ("sara-khaled", "/figma/specialists/sp2.jpg",
     ("د. سارة خالد", "تخاطب وتواصل",
      "متخصصة في اضطرابات النطق والكلام واللغة لدى الأطفال والمراهقين",
      "الأحد – الخميس", "الفرع الرئيسي – الرياض", "3 سنوات خبرة", "9:00 ص – 5:00 م",
      "الرياض - جدة",
      "متخصصة في اضطرابات النطق والكلام واللغة لدى الأطفال والمراهقين، تتمتع بخبرة 3 سنوات في تقييم وعلاج تأخر اللغة واضطرابات التواصل، وتعتمد أحدث الأساليب العلاجية التفاعلية لتنمية مهارات التواصل.",
      ["بكالوريوس علوم التخاطب - جامعة الملك سعود", "دبلوم اضطرابات التواصل واللغة", "شهادة معتمدة في التواصل المعزز والبديل (AAC)"]),
     ("Dr. Sara Khaled", "Speech & Language Therapy",
      "Specialized in speech, language, and communication disorders in children and adolescents",
      "Sunday – Thursday", "Main Branch – Riyadh", "3 years of experience", "9:00 AM – 5:00 PM",
      "Riyadh – Jeddah",
      "Specialized in speech, language, and communication disorders in children and adolescents, with 3 years of experience in assessing and treating language delays and communication disorders. She adopts the latest interactive therapeutic methods to develop communication skills.",
      ["Bachelor's in Speech Sciences – King Saud University", "Diploma in Communication & Language Disorders", "Certified in Augmentative and Alternative Communication (AAC)"])),
    ("ahmed-alomari", "/figma/specialists/sp3.jpg",
     ("د. أحمد محمد العمري", "علاج وظيفي",
      "خبير في العلاج الطبيعي للأطفال وتأهيل الحالات العصبية والعضلية الهيكلية",
      "الأحد – الخميس", "الفرع الرئيسي – الرياض", "9 سنوات خبرة", "9:00 ص – 5:00 م",
      "الرياض - جده",
      "يتمتع الدكتور أحمد بخبرة واسعة تمتد لأكثر من 9 سنوات في مجال العلاج الوظيفي للأطفال. عمل في كبرى مراكز التأهيل في المنطقة وتخصص في تقييم وعلاج اضطرابات المعالجة الحسية، وتنمية المهارات الحركية الدقيقة، وتهيئة الأطفال للمرحلة الدراسية. يؤمن بأهمية المشاركة الأسرية في عملية التأهيل ويحرص على تدريب الوالدين.",
      ["بكالوريوس العلاج الوظيفي - جامعة الملك سعود", "ماجستير تأهيل الأطفال - جامعة الإمارات", "شهادة SIPT في التكامل الحسي"]),
     ("Dr. Ahmed Mohammed Al-Omari", "Occupational Therapy",
      "Expert in pediatric physical therapy and the rehabilitation of neurological and musculoskeletal conditions",
      "Sunday – Thursday", "Main Branch – Riyadh", "9 years of experience", "9:00 AM – 5:00 PM",
      "Riyadh – Jeddah",
      "Dr. Ahmed brings extensive experience spanning more than 9 years in pediatric occupational therapy. He has worked in the region's leading rehabilitation centers and specializes in assessing and treating sensory processing disorders, developing fine motor skills, and preparing children for school. He believes in the importance of family involvement in the rehabilitation process and is keen to train parents.",
      ["Bachelor's in Occupational Therapy – King Saud University", "Master's in Pediatric Rehabilitation – UAE University", "SIPT Certification in Sensory Integration"])),
    ("nada-fahd", "/figma/specialists/sp4.jpg",
     ("د. ندي فهد", "تخاطب وتواصل",
      "متخصصة في اضطرابات النطق والكلام واللغة لدى الأطفال والمراهقين",
      "الأحد – الخميس", "الفرع الرئيسي – الرياض", "3 سنوات خبرة", "9:00 ص – 5:00 م",
      "الرياض",
      "متخصصة في اضطرابات النطق والكلام واللغة لدى الأطفال والمراهقين، بخبرة 3 سنوات في برامج التواصل المعزز والبديل وتنمية المهارات اللغوية، وتحرص على تصميم جلسات تفاعلية ممتعة تناسب كل طفل.",
      ["بكالوريوس علوم التخاطب - جامعة الأميرة نورة", "دبلوم التخاطب الإكلينيكي", "شهادة معتمدة في تنمية المهارات اللغوية"]),
     ("Dr. Nada Fahd", "Speech & Language Therapy",
      "Specialized in speech, language, and communication disorders in children and adolescents",
      "Sunday – Thursday", "Main Branch – Riyadh", "3 years of experience", "9:00 AM – 5:00 PM",
      "Riyadh",
      "Specialized in speech, language, and communication disorders in children and adolescents, with 3 years of experience in augmentative and alternative communication programs and language skills development. She is keen to design fun, interactive sessions tailored to each child.",
      ["Bachelor's in Speech Sciences – Princess Nourah University", "Diploma in Clinical Speech Therapy", "Certified in Language Skills Development"])),
    ("omar-faisal", "/figma/specialists/sp5.jpg",
     ("د. عمر فيصل", "علاج وظيفي",
      "خبير في العلاج الطبيعي للأطفال وتأهيل الحالات العصبية والعضلية الهيكلية",
      "الأحد – الخميس", "الفرع الرئيسي – الرياض", "6 سنوات خبرة", "9:00 ص – 5:00 م",
      "الرياض - جدة",
      "خبير في العلاج الطبيعي للأطفال وتأهيل الحالات العصبية والعضلية الهيكلية، بخبرة 6 سنوات في تنمية المهارات الحركية الدقيقة والكبرى، ويعتمد خطط تأهيل فردية تراعي احتياجات كل طفل.",
      ["بكالوريوس العلاج الوظيفي - جامعة الملك سعود", "دبلوم العلاج الطبيعي للأطفال", "شهادة معتمدة في التكامل الحسي"]),
     ("Dr. Omar Faisal", "Occupational Therapy",
      "Expert in pediatric physical therapy and the rehabilitation of neurological and musculoskeletal conditions",
      "Sunday – Thursday", "Main Branch – Riyadh", "6 years of experience", "9:00 AM – 5:00 PM",
      "Riyadh – Jeddah",
      "Expert in pediatric physical therapy and the rehabilitation of neurological and musculoskeletal conditions, with 6 years of experience in developing fine and gross motor skills. He adopts individualized rehabilitation plans that take into account each child's needs.",
      ["Bachelor's in Occupational Therapy – King Saud University", "Diploma in Pediatric Physical Therapy", "Certified in Sensory Integration"])),
    ("laila-ahmed", "/figma/specialists/sp6.jpg",
     ("د. ليلى أحمد", "تعديل سلوك",
      "متخصصة في تحليل السلوك التطبيقي ABA وتدريب الأطفال على المهارات الاجتماعية",
      "الأحد – الخميس", "الفرع الرئيسي – الرياض", "9 سنوات خبرة", "9:00 ص – 5:00 م",
      "الرياض - جده",
      "متخصصة في تحليل السلوك التطبيقي ABA وتدريب الأطفال على المهارات الاجتماعية، بخبرة 9 سنوات في تصميم برامج تعديل السلوك الفردية وإشراك الأسرة في رحلة التطور.",
      ["بكالوريوس علم النفس - جامعة الملك سعود", "ماجستير تحليل السلوك التطبيقي", "شهادة BCBA المعتمدة دولياً"]),
     ("Dr. Laila Ahmed", "Behavior Modification",
      "Specialized in Applied Behavior Analysis (ABA) and training children in social skills",
      "Sunday – Thursday", "Main Branch – Riyadh", "9 years of experience", "9:00 AM – 5:00 PM",
      "Riyadh – Jeddah",
      "Specialized in Applied Behavior Analysis (ABA) and training children in social skills, with 9 years of experience in designing individualized behavior modification programs and involving the family in the development journey.",
      ["Bachelor's in Psychology – King Saud University", "Master's in Applied Behavior Analysis", "Internationally Certified BCBA"])),
]


class Command(BaseCommand):
    help = "Seed the Specialist table from the original site content."

    def handle(self, *args, **opts):
        created = updated = 0
        for order, (slug, image, ar, en) in enumerate(SPECIALISTS):
            _, was_created = Specialist.objects.update_or_create(
                slug=slug,
                defaults=dict(
                    order=order, image=image, published=True,
                    name_ar=ar[0], specialty_ar=ar[1], desc_ar=ar[2], days_ar=ar[3],
                    branch_ar=ar[4], experience_ar=ar[5], hours_ar=ar[6],
                    branches_ar=ar[7], about_ar=ar[8], qualifications_ar=ar[9],
                    name_en=en[0], specialty_en=en[1], desc_en=en[2], days_en=en[3],
                    branch_en=en[4], experience_en=en[5], hours_en=en[6],
                    branches_en=en[7], about_en=en[8], qualifications_en=en[9],
                ),
            )
            created += was_created
            updated += (not was_created)
        self.stdout.write(self.style.SUCCESS(f"Seeded specialists: {created} created, {updated} updated."))
