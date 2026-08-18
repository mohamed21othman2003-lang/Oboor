"""يملأ حقول شارتَي الهيرو داخل عنصر «المقدمة العلوية» بصفحة «عن عبور».

آمن: يضع القيم الافتراضية فقط للحقول الفارغة (لا يمسّ تعديلات المحرّر)، ويحذف
العنصرين المنفصلين القديمين (about-hero-badge-1/2) اللذين استُبدلا بالحقول.
شغّله مرّة بعد النشر:  python manage.py seed_about_hero_badges
"""
from django.core.management.base import BaseCommand
from content.m_sections import SectionItem

DEFAULTS = {
    "badge1_label_ar": "برامج متخصصة", "badge1_label_en": "Specialized Programs",
    "badge1_value_ar": "تأهيل شامل ومتكامل", "badge1_value_en": "Comprehensive Rehabilitation",
    "badge2_label_ar": "تأسّس عام", "badge2_label_en": "Established",
    "badge2_value_ar": "٢٠٠٧", "badge2_value_en": "2007",
}


class Command(BaseCommand):
    help = "Fill About-hero badge fields (only if empty) and remove the old separate badge items."

    def handle(self, *args, **opts):
        removed = SectionItem.objects.filter(
            page="about", block="hero", key__in=["about-hero-badge-1", "about-hero-badge-2"],
        ).delete()[0]

        hero = SectionItem.objects.filter(page="about", block="hero", key="about-hero").first()
        if not hero:
            self.stdout.write(self.style.WARNING("about-hero item not found; badge fields not set."))
            return
        changed = []
        for field, val in DEFAULTS.items():
            if not str(getattr(hero, field, "") or "").strip():
                setattr(hero, field, val)
                changed.append(field)
        if changed:
            hero.save(update_fields=changed)
        self.stdout.write(self.style.SUCCESS(
            f"Removed {removed} old badge item(s); set {len(changed)} empty badge field(s) on about-hero."
        ))
