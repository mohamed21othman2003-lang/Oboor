import os
from rest_framework import serializers
from .models import ContactMessage, AdmissionRequest, AssessmentResult, JobApplication

# أنواع ملفات السيرة الذاتية المسموحة وحدّ الحجم
CV_ALLOWED_EXT = {".pdf", ".doc", ".docx"}
CV_MAX_BYTES = 10 * 1024 * 1024  # 10 ميجابايت


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ["id", "name", "phone", "email", "branch", "type", "message", "created_at"]
        read_only_fields = ["id", "created_at"]


class AdmissionRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdmissionRequest
        fields = ["id", "child_name", "child_age", "gender", "city", "branch",
                  "parent_name", "phone", "email", "case_type", "prev_sessions",
                  "notes", "created_at"]
        read_only_fields = ["id", "created_at"]


class AssessmentResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssessmentResult
        fields = ["id", "assessment", "assessment_slug", "level", "score", "answers",
                  "parent_name", "phone", "email", "child_name", "age", "gender", "city", "branch", "created_at"]
        read_only_fields = ["id", "created_at"]


class JobApplicationSerializer(serializers.ModelSerializer):
    # سنوات الخبرة إلزامية (الموديل يسمح بالفراغ، لكن النموذج يتطلّبها)
    experience = serializers.CharField(
        required=True, allow_blank=False,
        error_messages={"required": "سنوات الخبرة مطلوبة.", "blank": "سنوات الخبرة مطلوبة."},
    )

    class Meta:
        model = JobApplication
        fields = ["id", "job", "name", "phone", "email", "city", "branch", "current_role",
                  "experience", "about", "cv", "created_at"]
        read_only_fields = ["id", "created_at"]

    def validate_cv(self, f):
        if not f:
            return f
        ext = os.path.splitext(getattr(f, "name", ""))[1].lower()
        if ext not in CV_ALLOWED_EXT:
            raise serializers.ValidationError("صيغة الملف غير مدعومة — المسموح: PDF أو DOC أو DOCX.")
        if getattr(f, "size", 0) > CV_MAX_BYTES:
            raise serializers.ValidationError("حجم الملف أكبر من 10 ميجابايت.")
        return f
