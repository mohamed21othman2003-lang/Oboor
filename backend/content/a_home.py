from django.contrib import admin
from unfold.admin import ModelAdmin
from .m_home import HeroSlide, StatItem, FeatureItem, GalleryImage


@admin.register(HeroSlide)
class HeroSlideAdmin(ModelAdmin):
    list_display = ("heading_ar", "badge_ar", "published", "order")
    list_filter = ("published",)
    list_editable = ("published", "order")
    search_fields = ("heading_ar", "heading_en", "badge_ar", "desc_ar", "key")
    fieldsets = (
        (None, {"fields": ("key", "published", "order", "image", "image_file")}),
        ("العربية", {"fields": ("badge_ar", "heading_ar", "desc_ar", "cta_ar")}),
        ("English", {"fields": ("badge_en", "heading_en", "desc_en", "cta_en")}),
    )


@admin.register(StatItem)
class StatItemAdmin(ModelAdmin):
    list_display = ("label_ar", "value", "icon", "published", "order")
    list_filter = ("published",)
    list_editable = ("published", "order")
    search_fields = ("label_ar", "label_en", "note_ar", "value", "key")
    fieldsets = (
        (None, {"fields": ("key", "value", "icon", "published", "order")}),
        ("العربية", {"fields": ("label_ar", "note_ar")}),
        ("English", {"fields": ("label_en", "note_en")}),
    )


@admin.register(FeatureItem)
class FeatureItemAdmin(ModelAdmin):
    list_display = ("title_ar", "icon", "published", "order")
    list_filter = ("published",)
    list_editable = ("published", "order")
    search_fields = ("title_ar", "title_en", "note_ar", "key")
    fieldsets = (
        (None, {"fields": ("key", "icon", "published", "order")}),
        ("العربية", {"fields": ("title_ar", "note_ar")}),
        ("English", {"fields": ("title_en", "note_en")}),
    )


@admin.register(GalleryImage)
class GalleryImageAdmin(ModelAdmin):
    list_display = ("caption_ar", "published", "order")
    list_filter = ("published",)
    list_editable = ("published", "order")
    search_fields = ("caption_ar", "caption_en", "key")
    fieldsets = (
        (None, {"fields": ("key", "image", "image_file", "published", "order")}),
        ("العربية", {"fields": ("caption_ar",)}),
        ("English", {"fields": ("caption_en",)}),
    )
