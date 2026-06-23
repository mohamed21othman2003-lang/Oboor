from django.contrib import admin
from django.utils.html import format_html
from .models import ContactMessage, AdmissionRequest, AssessmentResult, JobApplication


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("name", "phone", "type", "branch", "created_at")
    list_filter = ("type", "branch", "created_at")
    search_fields = ("name", "phone", "email", "message")
    readonly_fields = ("created_at",)


@admin.register(AdmissionRequest)
class AdmissionRequestAdmin(admin.ModelAdmin):
    list_display = ("child_name", "parent_name", "phone", "city", "branch", "created_at")
    list_filter = ("city", "branch", "gender", "created_at")
    search_fields = ("child_name", "parent_name", "phone", "email")
    readonly_fields = ("created_at",)


@admin.register(AssessmentResult)
class AssessmentResultAdmin(admin.ModelAdmin):
    list_display = ("assessment", "child_name", "level", "score", "phone", "created_at")
    list_filter = ("assessment", "level", "created_at")
    search_fields = ("child_name", "parent_name", "phone", "email")
    readonly_fields = ("created_at", "answers", "score")


@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display = ("name", "job", "phone", "city", "experience", "cv_link", "created_at")
    list_filter = ("job", "city", "experience", "created_at")
    search_fields = ("name", "phone", "email", "current_role")
    readonly_fields = ("created_at", "cv_link")

    @admin.display(description="السيرة الذاتية")
    def cv_link(self, obj):
        if obj.cv:
            return format_html('<a href="{}" target="_blank">تحميل</a>', obj.cv.url)
        return "—"
