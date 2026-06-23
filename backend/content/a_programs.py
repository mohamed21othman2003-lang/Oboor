from django.contrib import admin
from unfold.admin import ModelAdmin
from .m_programs import ProgramDetail


@admin.register(ProgramDetail)
class ProgramDetailAdmin(ModelAdmin):
    list_display = ("title_ar", "slug", "published", "order")
    list_filter = ("published",)
    list_editable = ("published", "order")
    search_fields = ("title_ar", "title_en", "slug")
    prepopulated_fields = {"slug": ("title_en",)}
    fieldsets = (
        (None, {"fields": ("slug", "image", "image_file", "order", "published")}),
        ("العربية", {"fields": (
            "title_ar", "subtitle_ar", "about_ar",
            "philosophy_intro_ar", "philosophy_ar",
            "methods_ar", "duration_ar",
            "target_ar", "target_tags_ar", "target_list_ar",
            "training_intro_ar", "training_areas_ar",
            "stations_intro_ar", "stations_ar",
        )}),
        ("English", {"fields": (
            "title_en", "subtitle_en", "about_en",
            "philosophy_intro_en", "philosophy_en",
            "methods_en", "duration_en",
            "target_en", "target_tags_en", "target_list_en",
            "training_intro_en", "training_areas_en",
            "stations_intro_en", "stations_en",
        )}),
    )
