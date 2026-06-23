from rest_framework import serializers
from .models import ContactMessage, AdmissionRequest, AssessmentResult, JobApplication


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ["id", "name", "phone", "email", "branch", "type", "message", "created_at"]
        read_only_fields = ["id", "created_at"]


class AdmissionRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdmissionRequest
        fields = ["id", "child_name", "child_age", "gender", "city", "branch",
                  "parent_name", "phone", "email", "case_type", "notes", "created_at"]
        read_only_fields = ["id", "created_at"]


class AssessmentResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssessmentResult
        fields = ["id", "assessment", "assessment_slug", "level", "score", "answers",
                  "parent_name", "phone", "email", "child_name", "age", "gender", "city", "created_at"]
        read_only_fields = ["id", "created_at"]


class JobApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobApplication
        fields = ["id", "job", "name", "phone", "email", "city", "current_role",
                  "experience", "about", "cv", "created_at"]
        read_only_fields = ["id", "created_at"]
