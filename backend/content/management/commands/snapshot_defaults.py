"""يلتقط لقطة «النسخة الافتراضية» من المحتوى الحالي (لمرة واحدة، لا يكتب فوق الموجود)."""
from django.core.management.base import BaseCommand
from content.cms_crud import CONTENT, capture_snapshot


class Command(BaseCommand):
    help = "التقاط لقطة افتراضية لكل عناصر المحتوى الحالية."

    def add_arguments(self, parser):
        parser.add_argument("--force", action="store_true", help="إعادة كتابة اللقطات الموجودة.")

    def handle(self, *args, **opts):
        from content.models import ContentSnapshot
        from content.cms_crud import snapshot_fields
        total = 0
        for type_key, (Model, _title, *_rest) in CONTENT.items():
            for obj in Model.objects.all():
                if opts["force"]:
                    ContentSnapshot.objects.update_or_create(
                        type_key=type_key, obj_id=obj.pk,
                        defaults={"data": snapshot_fields(obj)},
                    )
                else:
                    capture_snapshot(type_key, obj)
                total += 1
            self.stdout.write(f"  {type_key}: {Model.objects.count()}")
        self.stdout.write(self.style.SUCCESS(f"تم التقاط {total} لقطة افتراضية."))
