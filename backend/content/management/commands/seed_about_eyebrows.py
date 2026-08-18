"""يضبط الترويسات الصغيرة (eyebrows) لأقسام صفحة «عن عبور» إن كانت فارغة.

آمن: لا يمسّ أي قيمة محرّرة مسبقاً. شغّله مرّة بعد النشر:
    python manage.py seed_about_eyebrows
"""
from django.core.management.base import BaseCommand
from content.m_sections import SectionItem

# key -> (tagline_ar, tagline_en)
EYEBROWS = {
    "about-intro": ("تعرّف علينا", "Get to know us"),
    "about-branches": ("حضور واسع في المملكة", "A wide presence across the Kingdom"),
}


class Command(BaseCommand):
    help = "Set About-page section eyebrows (tagline) defaults where empty."

    def handle(self, *args, **opts):
        total = 0
        for key, (ar, en) in EYEBROWS.items():
            it = SectionItem.objects.filter(page="about", key=key).first()
            if not it:
                self.stdout.write(self.style.WARNING(f"{key}: item not found."))
                continue
            changed = []
            if not str(it.tagline_ar or "").strip():
                it.tagline_ar = ar
                changed.append("tagline_ar")
            if not str(it.tagline_en or "").strip():
                it.tagline_en = en
                changed.append("tagline_en")
            if changed:
                it.save(update_fields=changed)
            total += len(changed)
            self.stdout.write(f"{key}: set {len(changed)} field(s)")
        self.stdout.write(self.style.SUCCESS(f"Done — {total} tagline field(s) set."))
