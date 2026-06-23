# -*- coding: utf-8 -*-
from django.contrib import admin
from unfold.admin import ModelAdmin
from .m_branches import Branch


@admin.register(Branch)
class BranchAdmin(ModelAdmin):
    list_display = ("name_ar", "city_ar", "is_new", "published", "order")
    list_filter = ("is_new", "published")
    list_editable = ("published", "order")
    search_fields = ("name_ar", "name_en", "slug")
    prepopulated_fields = {"slug": ("name_en",)}
    fieldsets = (
        (None, {"fields": ("slug", "phone", "is_new", "published", "order")}),
        ("العربية", {"fields": ("name_ar", "area_ar", "city_ar", "region_ar", "address_ar", "hours_ar", "services_ar")}),
        ("English", {"fields": ("name_en", "area_en", "city_en", "region_en", "address_en", "hours_en", "services_en")}),
    )
