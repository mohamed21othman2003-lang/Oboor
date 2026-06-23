# -*- coding: utf-8 -*-
from django.contrib import admin
from unfold.admin import ModelAdmin
from .m_specialists import Specialist


@admin.register(Specialist)
class SpecialistAdmin(ModelAdmin):
    list_display = ("name_ar", "specialty_ar", "published", "order")
    list_filter = ("published",)
    list_editable = ("published", "order")
    search_fields = ("name_ar", "name_en")
    prepopulated_fields = {"slug": ("name_en",)}
    fieldsets = (
        (None, {"fields": ("slug", "published", "order", "image", "image_file")}),
        ("العربية", {"fields": (
            "name_ar", "specialty_ar", "desc_ar", "days_ar", "branch_ar",
            "experience_ar", "hours_ar", "branches_ar", "about_ar", "qualifications_ar",
        )}),
        ("English", {"fields": (
            "name_en", "specialty_en", "desc_en", "days_en", "branch_en",
            "experience_en", "hours_en", "branches_en", "about_en", "qualifications_en",
        )}),
    )
