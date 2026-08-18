"""يزرع شارتي هيرو صفحة «عن عبور» كعنصرين قابلين للتحرير في قسم «المقدمة العلوية».

آمن وغير مُتلِف: يستخدم get_or_create — لو العنصر موجود لا يلمس محتواه (يحافظ على تعديلات
المحرّر). شغّله مرّة بعد النشر:  python manage.py seed_about_hero_badges
"""
from django.core.management.base import BaseCommand
from content.m_sections import SectionItem

BADGES = [
    dict(
        key="about-hero-badge-1", order=1,
        title_ar="برامج متخصصة", title_en="Specialized Programs",
        text_ar="تأهيل شامل ومتكامل", text_en="Comprehensive Rehabilitation",
    ),
    dict(
        key="about-hero-badge-2", order=2,
        title_ar="تأسّس عام", title_en="Established",
        text_ar="٢٠٠٧", text_en="2007",
    ),
]


class Command(BaseCommand):
    help = "Seed the two editable hero badges for the About page (idempotent; never overwrites)."

    def handle(self, *args, **opts):
        created = 0
        for b in BADGES:
            defaults = {k: v for k, v in b.items() if k != "key"}
            defaults["published"] = True
            _, was_created = SectionItem.objects.get_or_create(
                page="about", block="hero", key=b["key"], defaults=defaults,
            )
            created += 1 if was_created else 0
            self.stdout.write(("created " if was_created else "exists  ") + b["key"])
        self.stdout.write(self.style.SUCCESS(f"About hero badges: {created} created, {len(BADGES) - created} already existed."))
