# -*- coding: utf-8 -*-
from django.core.management.base import BaseCommand
from content.m_site import SiteSettings
from content.m_sections import SectionItem

# روابط الهيدر (label_ar, label_en, href)
NAV = [
    ("الرئيسية", "Home", "/"),
    ("عن عبور", "About Oboor", "/about"),
    ("إعلامنا", "Our Media", "/news"),
    ("برامجنا التمكينية", "Our Empowerment Programs", "/programs"),
    ("مراكزنا", "Our Centers", "/branches"),
    ("أبطال عبور", "Oboor Champions", "/success-stories"),
    ("روّادنا", "Our Pioneers", "/specialists"),
    ("انضم إلينا", "Join Us", "/careers"),
    ("التقييم", "Assessment", "/assessment"),
]

# روابط الفوتر السريعة (label_ar, label_en, href)
QUICK = [
    ("عن عبور", "About Oboor", "/about"),
    ("برامجنا التمكينية", "Our Empowerment Programs", "/programs"),
    ("مراكزنا", "Our Centers", "/branches"),
    ("المدوّنة والمقالات", "Blog & Articles", "/news"),
    ("خذ الخطوة لعبور", "Take the Step to Oboor", "/contact"),
]

# خدمات الفوتر (label_ar, label_en)
SERVICES = [
    ("التدخل المبكر", "Early Intervention"),
    ("النطق والتخاطب", "Speech & Language Therapy"),
    ("العلاج الوظيفي", "Occupational Therapy"),
    ("العلاج الفيزيائي", "Physical Therapy"),
    ("التحليل السلوكي التطبيقي (ABA)", "Applied Behavior Analysis (ABA)"),
    ("الدعم التربوي والأكاديمي", "Educational & Academic Support"),
]

# روابط السوشيال في الفوتر (label_ar, label_en, icon, url)
SOCIAL = [
    ("إكس", "X", "x", "https://x.com/hdc_ksa"),
    ("انستغرام", "Instagram", "instagram", "https://www.instagram.com/hdc_ksa"),
    ("تيك توك", "TikTok", "tiktok", "https://www.tiktok.com/@hdc_ksa"),
    ("واتساب", "WhatsApp", "whatsapp", "https://wa.me/966920003452"),
]


class Command(BaseCommand):
    help = "Seed site settings + header/footer navigation/social blocks."

    def handle(self, *args, **opts):
        SiteSettings.objects.update_or_create(pk=1, defaults=dict(
            logo_path="/logo.png",
            site_name_ar="مركز عبور للرعاية والتأهيل",
            site_name_en="Oboor Center for Care & Rehabilitation",
            brand_desc_ar="مركز عبور للرعاية والتأهيل — وجهتكم المتخصصة في دعم أطفالكم وتمكين أسرهم من خلال برامج تأهيلية شاملة.",
            brand_desc_en="Oboor Center for Care & Rehabilitation — your specialized destination for supporting your children and empowering their families through comprehensive rehabilitation programs.",
            email="info@hdc.com.sa",
            phone_unified="920003452",
            phone_customer="0561000274",
            whatsapp="966920003452",
            website="oboor.com.sa",
            main_branch_ar="الرياض ( الفرع الرئيسي )",
            main_branch_en="Riyadh (Main Branch)",
            x_url="https://x.com/hdc_ksa",
            instagram_url="https://www.instagram.com/hdc_ksa",
            tiktok_url="https://www.tiktok.com/@hdc_ksa",
            whatsapp_url="https://wa.me/966920003452",
            cta_admission_ar="طلب التحاق", cta_admission_en="Apply Now",
            cta_contact_ar="خذ الخطوة لعبور", cta_contact_en="Take the Step to Oboor",
            footer_quick_title_ar="روابط سريعة", footer_quick_title_en="Quick Links",
            footer_services_title_ar="خدماتنا", footer_services_title_en="Our Services",
            footer_contact_title_ar="خذ الخطوة لعبور", footer_contact_title_en="Take the Step to Oboor",
            privacy_label_ar="سياسة الخصوصية", privacy_label_en="Privacy Policy",
            copyright_ar="© 2026 مركز عبور للرعاية والتأهيل. جميع الحقوق محفوظة.",
            copyright_en="© 2026 Oboor Center for Care & Rehabilitation. All rights reserved.",
        ))

        def upsert(page, block, key, **kw):
            SectionItem.objects.update_or_create(page=page, block=block, key=key, defaults=dict(published=True, **kw))

        for i, (ar, en, href) in enumerate(NAV):
            upsert("header", "nav", str(i), order=i, title_ar=ar, title_en=en, value=href)
        for i, (ar, en, href) in enumerate(QUICK):
            upsert("footer", "quick_links", str(i), order=i, title_ar=ar, title_en=en, value=href)
        for i, (ar, en) in enumerate(SERVICES):
            upsert("footer", "services", str(i), order=i, title_ar=ar, title_en=en, value="/programs")
        for i, (ar, en, icon, url) in enumerate(SOCIAL):
            upsert("footer", "social", str(i), order=i, title_ar=ar, title_en=en, icon=icon, value=url)

        self.stdout.write(self.style.SUCCESS(
            f"Seeded site settings + header({len(NAV)}) + footer quick({len(QUICK)})/services({len(SERVICES)})/social({len(SOCIAL)})."
        ))
