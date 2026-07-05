from rest_framework import generics
from .models import ContactMessage, AdmissionRequest, AssessmentResult, JobApplication
from .serializers import (
    ContactMessageSerializer, AdmissionRequestSerializer,
    AssessmentResultSerializer, JobApplicationSerializer,
)
from .dedup import DuplicateGuardMixin


class ContactCreate(DuplicateGuardMixin, generics.CreateAPIView):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    dedup_fields = ["name", "phone", "email", "branch", "type", "message"]


class AdmissionCreate(DuplicateGuardMixin, generics.CreateAPIView):
    queryset = AdmissionRequest.objects.all()
    serializer_class = AdmissionRequestSerializer
    dedup_fields = ["child_name", "child_age", "gender", "city", "branch",
                    "parent_name", "phone", "email", "case_type", "notes"]


class AssessmentCreate(DuplicateGuardMixin, generics.CreateAPIView):
    queryset = AssessmentResult.objects.all()
    serializer_class = AssessmentResultSerializer
    # نُدرِج النتيجة (score/level) حتى لا يُرفَض إعادة التقييم بإجابات مختلفة
    dedup_fields = ["assessment", "assessment_slug", "parent_name", "phone",
                    "email", "child_name", "age", "gender", "city", "branch",
                    "score", "level"]


class CareerCreate(DuplicateGuardMixin, generics.CreateAPIView):
    queryset = JobApplication.objects.all()
    serializer_class = JobApplicationSerializer
    # نتجاهل ملف السيرة الذاتية في المقارنة — التطابق على بيانات المتقدّم
    dedup_fields = ["job", "name", "phone", "email", "city", "branch",
                    "current_role", "experience", "about"]
