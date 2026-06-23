# -*- coding: utf-8 -*-
from django.contrib import admin
from unfold.admin import ModelAdmin
from .m_careers import JobOpening


@admin.register(JobOpening)
class JobOpeningAdmin(ModelAdmin):
    list_display = ("title_ar", "slug", "city_ar", "published", "order")
    list_filter = ("published",)
    list_editable = ("published", "order")
    search_fields = ("title_ar", "title_en", "slug")
    prepopulated_fields = {"slug": ("title_en",)}
    fieldsets = (
        (None, {"fields": ("slug", "is_new", "published", "order")}),
        ("العربية", {"fields": (
            "title_ar", "department_ar", "city_ar", "employment_ar",
            "experience_ar", "date_ar", "start_date_ar",
            "description_ar", "responsibilities_ar", "requirements_ar",
        )}),
        ("English", {"fields": (
            "title_en", "department_en", "city_en", "employment_en",
            "experience_en", "date_en", "start_date_en",
            "description_en", "responsibilities_en", "requirements_en",
        )}),
    )
