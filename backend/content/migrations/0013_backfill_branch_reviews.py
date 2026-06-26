# -*- coding: utf-8 -*-
"""تعبئة تقييم/عدد تقييمات الفروع بالقيم الحالية (4.8 / 124) حتى لا يتغيّر الشكل،
   ويبقى للأدمن التحكّم بها أو إخفاؤها بتركها فارغة."""
from django.db import migrations


def backfill(apps, schema_editor):
    Branch = apps.get_model("content", "Branch")
    for b in Branch.objects.all():
        changed = []
        if not b.rating:
            b.rating = "4.8"; changed.append("rating")
        if not b.reviews_count:
            b.reviews_count = "124"; changed.append("reviews_count")
        if changed:
            b.save(update_fields=changed)


def noop(apps, schema_editor):
    pass


class Migration(migrations.Migration):
    dependencies = [("content", "0012_branch_rating_branch_reviews_count")]
    operations = [migrations.RunPython(backfill, noop)]
