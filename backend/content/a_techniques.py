from django.contrib import admin
from unfold.admin import ModelAdmin
from .m_techniques import Technique


@admin.register(Technique)
class TechniqueAdmin(ModelAdmin):
    list_display = ("title_ar", "slug", "published", "order")
    list_filter = ("published",)
    list_editable = ("published", "order")
    search_fields = ("title_ar", "title_en", "slug")
    prepopulated_fields = {"slug": ("title_en",)}
    fieldsets = (
        (None, {"fields": ("slug", "published", "order", "image", "image_file", "offer_icons")}),
        ("العربية", {"fields": ("title_ar", "badge_ar", "about_ar", "targets_ar", "offers_ar", "help_section_ar")}),
        ("English", {"fields": ("title_en", "badge_en", "about_en", "targets_en", "offers_en", "help_section_en")}),
    )
