# -*- coding: utf-8 -*-
"""
تعبئة الحقول الإنجليزية للفروع (name_en / city_en / address_en / manager_en / services_en)
دون حذف أي بيانات — يحدّث بالـslug فقط. آمن للتشغيل على الإنتاج.
الترجمة نقل صوتي (transliteration) قابلة للتعديل لاحقاً من لوحة الـCMS.
"""
from django.core.management.base import BaseCommand
from content.m_branches import Branch

SERVICES_EN = [
    "Early Intervention", "Speech & Language Therapy",
    "Occupational Therapy", "Sensory Integration", "Behavior Modification",
]

# slug: (name_en, city_en, address_en, manager_en)
DATA = {
    "branch-1": ("Oboor Al-Aziziyah Day Care Center", "Al-Aziziyah",
                 "Riyadh Region – Al-Aziziyah District – Al-Nasr Road", "Mariam Al-Olaiqi"),
    "branch-2": ("Oboor Nammar Day Care Center", "Nammar",
                 "Riyadh Region – Nammar District – Najm Al-Din Road", "Amira Aidah Al-Malki"),
    "branch-3": ("Oboor Dhahrat Laban Day Care Center", "Dhahrat Laban",
                 "Riyadh Region – Dhahrat Laban District – Najran Street", "Al-Anoud Al-Qahtani"),
    "branch-4": ("Oboor Al-Rawdah Day Care Center", "Al-Rawdah",
                 "Riyadh Region – Al-Rawdah District – Exit 11, Eastern Ring Road", "Amani Al-Shehri"),
    "branch-5": ("Oboor Al-Muaizilah Day Care Center", "Al-Muaizilah",
                 "Riyadh Region – Al-Muaizilah District – Funun Street", "Maha Mubarak Al-Shoghab"),
    "branch-6": ("Oboor Al-Narjes Day Care Center", "Al-Narjes",
                 "Riyadh Region – Al-Narjes District – Prince Saud Bin Abdullah Al-Jalawi Street", "Aseel Saud Al-Rashed"),
    "branch-7": ("Oboor Al-Malqa Day Care Center", "Al-Malqa",
                 "Riyadh Region – Al-Malqa – Wadi Wej, Riyadh", "Latifa Al-Saleh"),
    "branch-8": ("Oboor Al-Mursalat Day Care Center", "Al-Mursalat",
                 "Riyadh – Al-Mursalat District", "Rajaa Saad Al-Qahtani"),
    "branch-9": ("Oboor Al-Salam Day Care Center", "Al-Salam",
                 "Riyadh – Al-Salam District", "Shatha Al-Osaimi"),
    "branch-10": ("Oboor Al-Majmaah Day Care Center", "Al-Majmaah",
                  "Al-Majmaah Governorate – King Abdullah District – Prince Thunayan Bin Saud Street", "Noura Al-Aibani"),
    "branch-11": ("Oboor Wadi Al-Dawasir Day Care Center", "Wadi Al-Dawasir",
                  "Dallah Road – Al-Wurud District", "Abeer Marzouq"),
    "branch-12": ("Oboor Al-Narjes South King Salman Day Care Center", "Al-Narjes South King Salman",
                  "Riyadh – Al-Narjes, Prince Faisal Bin Bandar Bin Abdulaziz Road", "Ashwaq Al-Muammar"),
    "branch-13": ("Oboor Al-Uraija Day Care Center", "Al-Uraija",
                  "Riyadh – Central Al-Uraija, Prince Musaid Bin Abdulrahman Bin Faisal Road", "Bajdaa Al-Hadbani"),
    "branch-14": ("Oboor Buraidah Day Care Center", "Buraidah",
                  "Qassim Region – Buraidah – Al-Nahdah District – Abu Bakr Al-Siddiq Street", "Amjad Al-Harbi"),
    "branch-15": ("Oboor Al-Rass Day Care Center", "Al-Rass",
                  "Qassim Region – Al-Rass Governorate – Al-Saadah District – Abdulrahman Bin Auf Street", "Nada Al-Harbi"),
    "branch-16": ("Oboor Muhayil Asir Day Care Center", "Muhayil Asir",
                  "Asir Region – Muhayil Asir – Al-Waad", "Shamaa Daabash"),
    "branch-17": ("Oboor Bisha Day Care Center", "Bisha",
                  "Asir Region – Bisha Governorate – Al-Khuzama District – King Saud Road", "Badria Al-Maawi"),
    "branch-18": ("Oboor Khamis Mushait Day Care Center", "Khamis Mushait",
                  "Khamis Mushait Branch – Al-Diyafah Road – Salah Al-Din Street, opposite Kingdom Hall", "Badria Marei Saeed Al-Sarhani"),
    "branch-19": ("Oboor Abha Day Care Center", "Abha",
                  "Abha – Al-Khalidiyah District – Sard Bin Abdullah Al-Azdi Road", "Nawal Al-Qahtani"),
    "branch-20": ("Oboor Jazan Day Care Center", "Jazan",
                  "Jazan – Al-Suways District – Bishr Al-Nasibi", "Raneem Omar"),
    "branch-21": ("Oboor Al-Ahsa Day Care Center – Human Rehabilitation Co. Branch", "Al-Ahsa",
                  "Eastern Province – Al-Ahsa Governorate – Al-Olaya District – Main Street", "Maha Saleh Al-Taiban"),
    "branch-22": ("Oboor Al-Ahsa VIP Day Care Center", "Al-Ahsa VIP",
                  "Eastern Province – Asma Bint Kharijah, Mahasin Aramco 2 District, Al-Mubarraz", "Al-Anoud Al-Ruwaished"),
    "branch-23": ("Oboor Al-Nairyah Day Care Center", "Al-Nairyah",
                  "Eastern Province – Al-Nairyah Governorate – Al-Rabee District – Abu Jaafar Al-Mansour Street", "Kholoud Al-Otaibi"),
    "branch-24": ("Oboor Hafar Al-Batin Day Care Center", "Hafar Al-Batin",
                  "Eastern Province – Hafar Al-Batin Governorate – Al-Khalidiyah District – Main Street", "Wafaa Midath Al-Sahli"),
    "branch-25": ("Oboor Al-Dammam Day Care Center", "Al-Dammam",
                  "Eastern Province – Al-Dammam – Al-Nawras District – Al-Zahra Street", "Saja"),
    "branch-26": ("Oboor Al-Jubail Day Care Center", "Al-Jubail",
                  "Al-Jubail – Al-Fanateer District", "Kholoud Al-Taweel"),
    "branch-27": ("Oboor Al-Khobar Day Care Center", "Al-Khobar",
                  "Al-Khobar – Al-Aqrabiyah – Al-Shura Street", "Manal Al-Dosari"),
    "branch-28": ("Oboor Taif Day Care Center", "Taif",
                  "Makkah Region – Taif Governorate – Al-Sharafiyah District – Main Street", "Mathayel Al-Hazmi"),
    "branch-29": ("Oboor Makkah Day Care Center", "Makkah",
                  "Makkah Region – Al-Shawqiyah District", "Hanan Abdullah Al-Munabbhi"),
    "branch-30": ("Oboor Madinah Day Care Center", "Madinah",
                  "Bir Othman District – Rafi Bin Jadbah Street", "Shadia Nayer Al-Harbi"),
    "branch-31": ("Oboor Al-Jouf Day Care Center", "Al-Jouf",
                  "Sakaka – Al-Aziziyah District – King Khalid Road", "Deema Al-Kuwaikbi"),
    "branch-32": ("Oboor Al-Ahsa Day Care Center – Male", "Al-Ahsa",
                  "Abu Al-Tawq, Al-Hazm Al-Janoubi District, Al-Mubarraz", "Omar Al-Khamis"),
    "branch-33": ("Oboor Al-Nairyah Day Care Center – Male", "Al-Nairyah",
                  "Eastern Province – Al-Nairyah Governorate – Al-Rabee District – Abu Jaafar Al-Mansour Street", "Kholoud Al-Otaibi"),
    "branch-34": ("Oboor Al-Dammam Day Care Center – Male", "Al-Dammam",
                  "Al-Dammam – Badr District – Diya Al-Din Al-Bishiri", "Ammar Bin Makki"),
    "branch-35": ("Oboor Al-Majmaah Day Care Center – Male", "Al-Majmaah",
                  "Al-Majmaah – King Abdulaziz District – Ubaidah Bin Al-Harith Street", "Khalid Al-Osaimi"),
    "branch-36": ("Oboor Al-Rimal Day Care Center – Male", "Al-Rimal",
                  "Riyadh – Al-Rimal District", "Adel Turki Bin Tanaf Al-Otaibi"),
    "branch-37": ("Oboor Abha Day Care Center – Male", "Abha",
                  "Sard Bin Abdullah Al-Azdi Road – Al-Khalidiyah District", "Mohammed Al-Omari"),
    "branch-38": ("Oboor Khamis Mushait Day Care Center – Male", "Khamis Mushait",
                  "Abha Road, Khamis Mushait", "Fahad Fayez Al-Shehri"),
    "branch-39": ("Oboor South Abha Day Care Center – Male", "South Abha",
                  "Abha – Al Ghaliz Villages – near Marhaban Alf Road", "Azzam Amer Abu Alam"),
    "branch-40": ("Oboor Jazan Day Care Center – Male", "Jazan",
                  "Bishr Al-Nasibi, Al-Suways District, Jazan", "Turki Bin Ali"),
    "branch-41": ("Oboor Muhayil Asir Day Care Center – Male", "Muhayil Asir",
                  "Muhayil Asir – Al-Waad District", "Saud Al-Gharazi"),
    "branch-42": ("Oboor Al-Jouf Day Care Center – Male", "Al-Jouf",
                  "Sakaka – Al-Rabwah", "Abdulaziz Al-Sayat"),
    "branch-43": ("Oboor Al-Uraija Day Care Center – Male", "Al-Uraija",
                  "Riyadh – Central Al-Uraija, Prince Musaid Bin Abdulrahman Bin Faisal Road", "Rakan Abdullah Al-Dargham"),
}

REGION_EN = {
    "الرياض": "Riyadh", "مكة المكرمة": "Makkah", "المدينة المنورة": "Madinah",
    "الشرقية": "Eastern Province", "القصيم": "Qassim", "عسير": "Asir",
    "جازان": "Jazan", "الجوف": "Al-Jouf",
}


class Command(BaseCommand):
    help = "تعبئة الحقول الإنجليزية للفروع (غير مُدمِّر — بالـslug)"

    def handle(self, *args, **opts):
        updated = 0
        missing = []
        for slug, (name_en, city_en, address_en, manager_en) in DATA.items():
            try:
                b = Branch.objects.get(slug=slug)
            except Branch.DoesNotExist:
                missing.append(slug)
                continue
            b.name_en = name_en
            b.city_en = city_en
            b.address_en = address_en
            b.manager_en = manager_en
            b.region_en = REGION_EN.get(b.region_ar, b.region_ar)
            if not b.services_en:
                b.services_en = SERVICES_EN
            b.save(update_fields=["name_en", "city_en", "address_en", "manager_en", "region_en", "services_en"])
            updated += 1
        self.stdout.write(self.style.SUCCESS(f"updated {updated} branches"))
        if missing:
            self.stdout.write(self.style.WARNING(f"missing slugs: {missing}"))
