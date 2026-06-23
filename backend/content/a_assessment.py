# -*- coding: utf-8 -*-
from django.contrib import admin
from unfold.admin import ModelAdmin
from .m_assessment import AssessmentCard


@admin.register(AssessmentCard)
class AssessmentCardAdmin(ModelAdmin):
    list_display = ("title_ar", "slug", "published", "order")
    list_filter = ("published",)
    list_editable = ("published", "order")
    search_fields = ("title_ar", "title_en", "slug")
    prepopulated_fields = {"slug": ("title_en",)}
    fieldsets = (
        (None, {"fields": ("slug", "key", "icon", "published", "order")}),
        ("العربية", {"fields": ("title_ar", "desc_ar", "duration_ar", "questions_ar", "age_range_ar", "question_list_ar")}),
        ("English", {"fields": ("title_en", "desc_en", "duration_en", "questions_en", "age_range_en", "question_list_en")}),
    )
