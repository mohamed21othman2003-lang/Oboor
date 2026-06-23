from django.contrib import admin
from unfold.admin import ModelAdmin
from .m_sections import SectionItem, ServiceCard


@admin.register(SectionItem)
class SectionItemAdmin(ModelAdmin):
    list_display = ("page", "block", "title_ar", "value", "published", "order")
    list_filter = ("page", "block", "published")
    list_editable = ("published", "order")
    search_fields = ("title_ar", "title_en", "text_ar", "key", "block")
    fieldsets = (
        (None, {"fields": ("page", "block", "key", "order", "published", "icon", "value", "color")}),
        ("العربية", {"fields": ("title_ar", "text_ar", "data_ar")}),
        ("English", {"fields": ("title_en", "text_en", "data_en")}),
    )


@admin.register(ServiceCard)
class ServiceCardAdmin(ModelAdmin):
    list_display = ("tab", "title_ar", "slug", "published", "order")
    list_filter = ("tab", "published")
    list_editable = ("published", "order")
    search_fields = ("title_ar", "title_en", "slug")
    prepopulated_fields = {"slug": ("title_en",)}
    fieldsets = (
        (None, {"fields": ("tab", "slug", "href", "order", "published")}),
        ("العربية", {"fields": ("badge_ar", "title_ar", "desc_ar", "suits_ar", "age_ar", "features_ar", "regions_ar")}),
        ("English", {"fields": ("badge_en", "title_en", "desc_en", "suits_en", "age_en", "features_en", "regions_en")}),
    )
