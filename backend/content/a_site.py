from django.contrib import admin
from unfold.admin import ModelAdmin
from .m_site import SiteSettings


@admin.register(SiteSettings)
class SiteSettingsAdmin(ModelAdmin):
    fieldsets = (
        ("الهوية", {"fields": ("logo", "logo_path", "site_name_ar", "site_name_en", "brand_desc_ar", "brand_desc_en")}),
        ("التواصل", {"fields": ("email", "phone_unified", "phone_customer", "whatsapp", "website", "main_branch_ar", "main_branch_en")}),
        ("روابط التواصل الاجتماعي", {"fields": ("x_url", "instagram_url", "tiktok_url", "whatsapp_url", "youtube_url", "snapchat_url")}),
        ("أزرار الهيدر", {"fields": ("cta_admission_ar", "cta_admission_en", "cta_contact_ar", "cta_contact_en")}),
        ("نصوص الفوتر", {"fields": ("footer_quick_title_ar", "footer_quick_title_en", "footer_services_title_ar", "footer_services_title_en", "footer_contact_title_ar", "footer_contact_title_en", "privacy_label_ar", "privacy_label_en", "copyright_ar", "copyright_en")}),
    )

    def has_add_permission(self, request):
        # صف واحد فقط
        return not SiteSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False
