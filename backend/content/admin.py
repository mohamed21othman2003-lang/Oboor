from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import NewsArticle

# تسجيل لوحات الإدارة لبقية أنواع المحتوى
from . import a_programs      # noqa: F401
from . import a_clinical      # noqa: F401
from . import a_techniques    # noqa: F401
from . import a_branches      # noqa: F401
from . import a_specialists   # noqa: F401
from . import a_careers       # noqa: F401
from . import a_success       # noqa: F401
from . import a_assessment    # noqa: F401
from . import a_home          # noqa: F401
from . import a_sections      # noqa: F401
from . import a_site          # noqa: F401


@admin.register(NewsArticle)
class NewsArticleAdmin(ModelAdmin):
    list_display = ("title_ar", "section", "featured", "published", "order")
    list_filter = ("section", "featured", "published")
    list_editable = ("featured", "published", "order")
    search_fields = ("title_ar", "title_en", "desc_ar", "slug")
    prepopulated_fields = {"slug": ("title_en",)}
    fieldsets = (
        (None, {"fields": ("slug", "section", "featured", "published", "order", "image", "image_file")}),
        ("العربية", {"fields": ("title_ar", "desc_ar", "category_ar", "date_ar")}),
        ("English", {"fields": ("title_en", "desc_en", "category_en", "date_en")}),
    )
