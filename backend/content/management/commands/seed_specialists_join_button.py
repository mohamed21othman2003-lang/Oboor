"""يضبط نص زر «انضم إلى فريقنا» (فوق العنوان) في قسم «انضم إلى الفريق» بصفحة الأخصائيين
— يُخزَّن في حقل tagline لعنصر join/visual. آمن: لا يمسّ القيمة إن كانت محرّرة.
شغّله مرّة بعد النشر:  python manage.py seed_specialists_join_button
"""
from django.core.management.base import BaseCommand
from content.m_sections import SectionItem


class Command(BaseCommand):
    help = "Set the specialists join-section button text (tagline of join/visual) if empty."

    def handle(self, *args, **opts):
        it = SectionItem.objects.filter(page="specialists", block="join", key="visual").first()
        if not it:
            self.stdout.write(self.style.WARNING("specialists join/visual item not found."))
            return
        changed = []
        if not str(it.tagline_ar or "").strip():
            it.tagline_ar = "انضم إلى فريقنا"
            changed.append("tagline_ar")
        if not str(it.tagline_en or "").strip():
            it.tagline_en = "Join Our Team"
            changed.append("tagline_en")
        if changed:
            it.save(update_fields=changed)
        self.stdout.write(self.style.SUCCESS(f"Set {len(changed)} tagline field(s) on specialists join/visual."))
