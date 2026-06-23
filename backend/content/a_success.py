# -*- coding: utf-8 -*-
from django.contrib import admin
from unfold.admin import ModelAdmin
from .m_success import SuccessStory


@admin.register(SuccessStory)
class SuccessStoryAdmin(ModelAdmin):
    list_display = ("name_ar", "category_ar", "published", "order")
    list_filter = ("published",)
    list_editable = ("published", "order")
    search_fields = ("name_ar", "name_en")
    prepopulated_fields = {"slug": ("name_en",)}
    fieldsets = (
        (None, {"fields": ("slug", "published", "order", "image", "image_file")}),
        ("العربية", {"fields": (
            "name_ar", "age_ar", "category_ar", "duration_label_ar",
            "before_ar", "after_ar", "quote_ar",
            "meta_duration_ar", "meta_age_ar", "author_ar",
        )}),
        ("English", {"fields": (
            "name_en", "age_en", "category_en", "duration_label_en",
            "before_en", "after_en", "quote_en",
            "meta_duration_en", "meta_age_en", "author_en",
        )}),
    )
