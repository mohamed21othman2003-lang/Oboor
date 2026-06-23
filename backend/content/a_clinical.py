from django.contrib import admin
from unfold.admin import ModelAdmin
from .m_clinical import ClinicalService


@admin.register(ClinicalService)
class ClinicalServiceAdmin(ModelAdmin):
    list_display = ("title_ar", "slug", "published", "order")
    list_filter = ("published",)
    list_editable = ("published", "order")
    search_fields = ("title_ar", "title_en", "slug")
    prepopulated_fields = {"slug": ("title_en",)}
    fieldsets = (
        (None, {"fields": ("slug", "published", "order", "image", "image_file")}),
        ("العربية", {"fields": ("title_ar", "subtitle_ar", "about_heading_ar", "about_ar", "about_list_ar", "about_tag_ar", "blocks_ar")}),
        ("English", {"fields": ("title_en", "subtitle_en", "about_heading_en", "about_en", "about_list_en", "about_tag_en", "blocks_en")}),
    )
