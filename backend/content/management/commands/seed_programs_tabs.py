"""يزرع عناوين تبويبات صفحة «برامجنا التأهيلية» (البرامج / العيادية / التقنيات) —
العنوان + الوصف لكل تبويب — كعناصر قابلة للتحرير في بلوك tabs بصفحة programs.
آمن: get_or_create. شغّله مرّة بعد النشر:  python manage.py seed_programs_tabs
"""
from django.core.management.base import BaseCommand
from content.m_sections import SectionItem

ITEMS = [
    dict(key="programs", order=0,
         title_ar="برامجنا التأهيلية", title_en="Our Rehabilitation Programs",
         text_ar="صُمِّمت كل برامجنا التأهيلية وفق معايير علمية معتمدة لخدمة فئات محددة من الأطفال وفق احتياجاتهم الدقيقة.",
         text_en="All our rehabilitation programs are designed to accredited scientific standards to serve specific groups of children according to their precise needs."),
    dict(key="clinical", order=1,
         title_ar="خدماتنا العيادية", title_en="Our Clinical Services",
         text_ar="تقدم مراكز عبور طيفاً واسعاً من الخدمات العيادية التي يشرف عليها متخصصون مؤهلون في مجالات الصحة والتأهيل.",
         text_en="Oboor Centers offer a wide range of clinical services supervised by qualified specialists in health and rehabilitation fields."),
    dict(key="techniques", order=2,
         title_ar="تقنياتنا التأهيلية", title_en="Our Rehabilitation Technologies",
         text_ar="نستخدم في مراكز عبور تقنيات تأهيلية مبتكرة تدعم العملية العلاجية وتجعلها أكثر تفاعلاً وفاعلية.",
         text_en="At Oboor Centers we use innovative rehabilitation technologies that support the therapeutic process and make it more interactive and effective."),
]


class Command(BaseCommand):
    help = "Seed the programs page tab headings (title + intro) into the 'tabs' block."

    def handle(self, *args, **opts):
        created = 0
        for it in ITEMS:
            defaults = {k: v for k, v in it.items() if k != "key"}
            defaults["published"] = True
            _, was = SectionItem.objects.get_or_create(
                page="programs", block="tabs", key=it["key"], defaults=defaults,
            )
            created += 1 if was else 0
            self.stdout.write(("created " if was else "exists  ") + it["key"])
        self.stdout.write(self.style.SUCCESS(f"Programs tabs: {created} created, {len(ITEMS) - created} existed."))
