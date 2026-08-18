"""يضبط الترويسة الصغيرة (eyebrow) لقسم «نبذة تعريفية» بصفحة «عن عبور» إن كانت فارغة.

آمن: لا يمسّ القيمة إن كانت محرّرة مسبقاً. شغّله مرّة بعد النشر:
    python manage.py seed_about_intro_tagline
"""
from django.core.management.base import BaseCommand
from content.m_sections import SectionItem


class Command(BaseCommand):
    help = "Set the About-intro eyebrow (tagline) default if empty."

    def handle(self, *args, **opts):
        it = SectionItem.objects.filter(page="about", block="intro", key="about-intro").first()
        if not it:
            self.stdout.write(self.style.WARNING("about-intro item not found; tagline not set."))
            return
        changed = []
        if not str(it.tagline_ar or "").strip():
            it.tagline_ar = "تعرّف علينا"
            changed.append("tagline_ar")
        if not str(it.tagline_en or "").strip():
            it.tagline_en = "Get to know us"
            changed.append("tagline_en")
        if changed:
            it.save(update_fields=changed)
        self.stdout.write(self.style.SUCCESS(f"Set {len(changed)} tagline field(s) on about-intro."))
