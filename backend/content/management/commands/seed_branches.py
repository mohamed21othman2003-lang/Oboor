# -*- coding: utf-8 -*-
from django.core.management.base import BaseCommand
from content.m_branches import Branch

HOURS = "الأحد – الخميس: ٨ص – ٨م"
HOURS_EN = "Sunday – Thursday: 8 AM – 8 PM"

# slug, is_new, ar(name, area, city, region, address, services[]), en(name, area, city, region, address, services[])
BRANCHES = [
    ("narjes", True,
     ("النرجس - فرع الرياض", "حي النرجس", "الرياض", "الرياض", "شارع أنس بن مالك، حي النرجس، الرياض ١٣٣٢١",
      ["تحليل سلوك", "تكامل حسي", "تخاطب ولغة", "التدخل المبكر"]),
     ("Al-Narjes - Riyadh Branch", "Al-Narjes District", "Riyadh", "Riyadh", "Anas Bin Malik Street, Al-Narjes District, Riyadh 13321",
      ["Applied Behavior Analysis", "Sensory Integration", "Speech & Language Therapy", "Early Intervention"])),
    ("olaya", False,
     ("العليا - فرع الرياض", "حي العليا", "الرياض", "الرياض", "طريق الملك فهد، حي العليا، الرياض ١٢٢١٤",
      ["علاج وظيفي", "علاج طبيعي", "تخاطب ولغة"]),
     ("Al-Olaya - Riyadh Branch", "Al-Olaya District", "Riyadh", "Riyadh", "King Fahd Road, Al-Olaya District, Riyadh 12214",
      ["Occupational Therapy", "Physical Therapy", "Speech & Language Therapy"])),
    ("rawdah-ryd", False,
     ("الروضة - فرع الرياض", "حي الروضة", "الرياض", "الرياض", "شارع خالد بن الوليد، حي الروضة، الرياض ١٣٢١١",
      ["دعم نفسي", "تحليل سلوك", "التدخل المبكر"]),
     ("Al-Rawdah - Riyadh Branch", "Al-Rawdah District", "Riyadh", "Riyadh", "Khalid Bin Al-Walid Street, Al-Rawdah District, Riyadh 13211",
      ["Psychological Services", "Applied Behavior Analysis", "Early Intervention"])),
    ("shati-jed", True,
     ("الشاطئ - فرع جدة", "حي الشاطئ", "جدة", "جدة", "طريق الكورنيش، حي الشاطئ، جدة ٢٣٤١٢",
      ["تخاطب ولغة", "تكامل حسي", "علاج وظيفي"]),
     ("Al-Shati - Jeddah Branch", "Al-Shati District", "Jeddah", "Jeddah", "Corniche Road, Al-Shati District, Jeddah 23412",
      ["Speech & Language Therapy", "Sensory Integration", "Occupational Therapy"])),
    ("rawdah-jed", False,
     ("الروضة - فرع جدة", "حي الروضة", "جدة", "جدة", "شارع الأمير سلطان، حي الروضة، جدة ٢٣٤٣٤",
      ["علاج طبيعي", "تحليل سلوك", "التدخل المبكر"]),
     ("Al-Rawdah - Jeddah Branch", "Al-Rawdah District", "Jeddah", "Jeddah", "Prince Sultan Street, Al-Rawdah District, Jeddah 23434",
      ["Physical Therapy", "Applied Behavior Analysis", "Early Intervention"])),
    ("khobar", False,
     ("الخبر - فرع الشرقية", "حي العقربية", "الخبر", "المنطقة الشرقية", "طريق الملك فهد، حي العقربية، الخبر ٣٤٤٢٦",
      ["تخاطب ولغة", "علاج وظيفي", "تكامل حسي"]),
     ("Al-Khobar - Eastern Province Branch", "Al-Aqrabiyah District", "Al-Khobar", "Eastern Province", "King Fahd Road, Al-Aqrabiyah District, Al-Khobar 34426",
      ["Speech & Language Therapy", "Occupational Therapy", "Sensory Integration"])),
    ("azizia-mecca", False,
     ("العزيزية - فرع مكة", "حي العزيزية", "مكة المكرمة", "مكة المكرمة", "شارع الحج، حي العزيزية، مكة المكرمة ٢٤٢٢٧",
      ["تحليل سلوك", "تخاطب ولغة", "التدخل المبكر"]),
     ("Al-Azizia - Makkah Branch", "Al-Azizia District", "Makkah", "Makkah", "Al-Hajj Street, Al-Azizia District, Makkah 24227",
      ["Applied Behavior Analysis", "Speech & Language Therapy", "Early Intervention"])),
    ("abha", True,
     ("المنهل - فرع أبها", "حي المنهل", "أبها", "عسير", "طريق الملك عبدالعزيز، حي المنهل، أبها ٦٢٥٢١",
      ["علاج وظيفي", "دعم نفسي", "تخاطب ولغة"]),
     ("Al-Manhal - Abha Branch", "Al-Manhal District", "Abha", "Asir", "King Abdulaziz Road, Al-Manhal District, Abha 62521",
      ["Occupational Therapy", "Psychological Services", "Speech & Language Therapy"])),
    # فروع إقليمية إضافية
    ("kharj", False,
     ("فرع الخرج", "حي الناصرية", "الخرج", "منطقة الرياض", "طريق الملك عبدالعزيز، حي الناصرية، الخرج",
      ["تخاطب ولغة", "تحليل سلوك", "التدخل المبكر"]),
     ("Al-Kharj Branch", "Al-Nasiriyah District", "Al-Kharj", "Riyadh Region", "King Abdulaziz Road, Al-Nasiriyah District, Al-Kharj",
      ["Speech & Language Therapy", "Applied Behavior Analysis", "Early Intervention"])),
    ("wadi-dawasir", False,
     ("فرع وادي الدواسر", "حي الفيصلية", "وادي الدواسر", "منطقة الرياض", "الطريق العام، حي الفيصلية، وادي الدواسر",
      ["علاج وظيفي", "تخاطب ولغة"]),
     ("Wadi Al-Dawasir Branch", "Al-Faisaliyah District", "Wadi Al-Dawasir", "Riyadh Region", "Main Road, Al-Faisaliyah District, Wadi Al-Dawasir",
      ["Occupational Therapy", "Speech & Language Therapy"])),
    ("qassim", False,
     ("فرع القصيم", "حي الصفراء", "القصيم", "منطقة القصيم", "طريق الملك فهد، حي الصفراء، بريدة",
      ["تحليل سلوك", "تكامل حسي", "تخاطب ولغة"]),
     ("Qassim Branch", "Al-Safra District", "Qassim", "Qassim Region", "King Fahd Road, Al-Safra District, Buraidah",
      ["Applied Behavior Analysis", "Sensory Integration", "Speech & Language Therapy"])),
    ("majmaah", False,
     ("فرع المجمعة", "حي العزيزية", "المجمعة", "منطقة الرياض", "طريق الملك سلمان، حي العزيزية، المجمعة",
      ["علاج طبيعي", "علاج وظيفي"]),
     ("Al-Majmaah Branch", "Al-Azizia District", "Al-Majmaah", "Riyadh Region", "King Salman Road, Al-Azizia District, Al-Majmaah",
      ["Physical Therapy", "Occupational Therapy"])),
    ("sharqia", False,
     ("فرع الشرقية", "حي الفيصلية", "الشرقية", "المنطقة الشرقية", "طريق الملك فهد، حي الفيصلية، الدمام",
      ["تخاطب ولغة", "علاج وظيفي", "دعم نفسي"]),
     ("Eastern Province Branch", "Al-Faisaliyah District", "Eastern Province", "Eastern Province", "King Fahd Road, Al-Faisaliyah District, Dammam",
      ["Speech & Language Therapy", "Occupational Therapy", "Psychological Services"])),
    ("jouf", False,
     ("فرع الجوف", "حي الفيصلية", "الجوف", "منطقة الجوف", "طريق الملك عبدالله، حي الفيصلية، سكاكا",
      ["تحليل سلوك", "التدخل المبكر"]),
     ("Al-Jouf Branch", "Al-Faisaliyah District", "Al-Jouf", "Al-Jouf Region", "King Abdullah Road, Al-Faisaliyah District, Sakaka",
      ["Applied Behavior Analysis", "Early Intervention"])),
    ("madinah", False,
     ("فرع المدينة المنورة", "حي العزيزية", "المدينة المنورة", "منطقة المدينة المنورة", "طريق الملك عبدالعزيز، حي العزيزية، المدينة المنورة",
      ["تخاطب ولغة", "علاج وظيفي", "تكامل حسي"]),
     ("Madinah Branch", "Al-Azizia District", "Madinah", "Madinah Region", "King Abdulaziz Road, Al-Azizia District, Madinah",
      ["Speech & Language Therapy", "Occupational Therapy", "Sensory Integration"])),
    ("taif", False,
     ("فرع الطائف", "حي شهار", "الطائف", "منطقة مكة المكرمة", "طريق الملك فيصل، حي شهار، الطائف",
      ["علاج طبيعي", "تحليل سلوك"]),
     ("Taif Branch", "Shihar District", "Taif", "Makkah Region", "King Faisal Road, Shihar District, Taif",
      ["Physical Therapy", "Applied Behavior Analysis"])),
    ("aseer", False,
     ("فرع عسير", "حي المنسك", "عسير", "منطقة عسير", "طريق الملك عبدالعزيز، حي المنسك، أبها",
      ["علاج وظيفي", "دعم نفسي", "تخاطب ولغة"]),
     ("Asir Branch", "Al-Mansak District", "Asir", "Asir Region", "King Abdulaziz Road, Al-Mansak District, Abha",
      ["Occupational Therapy", "Psychological Services", "Speech & Language Therapy"])),
]

PHONE = "920000109"


class Command(BaseCommand):
    help = "Seed the Branch table from the original site content."

    def handle(self, *args, **opts):
        created = updated = 0
        for order, (slug, is_new, ar, en) in enumerate(BRANCHES):
            _, was_created = Branch.objects.update_or_create(
                slug=slug,
                defaults=dict(
                    is_new=is_new, order=order, published=True, phone=PHONE,
                    hours_ar=HOURS, hours_en=HOURS_EN,
                    name_ar=ar[0], area_ar=ar[1], city_ar=ar[2], region_ar=ar[3],
                    address_ar=ar[4], services_ar=ar[5],
                    name_en=en[0], area_en=en[1], city_en=en[2], region_en=en[3],
                    address_en=en[4], services_en=en[5],
                ),
            )
            created += was_created
            updated += (not was_created)
        self.stdout.write(self.style.SUCCESS(f"Seeded branches: {created} created, {updated} updated."))
