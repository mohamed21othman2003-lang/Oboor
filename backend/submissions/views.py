from rest_framework import generics
from .models import ContactMessage, AdmissionRequest, AssessmentResult, JobApplication
from .serializers import (
    ContactMessageSerializer, AdmissionRequestSerializer,
    AssessmentResultSerializer, JobApplicationSerializer,
)


class ContactCreate(generics.CreateAPIView):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer


class AdmissionCreate(generics.CreateAPIView):
    queryset = AdmissionRequest.objects.all()
    serializer_class = AdmissionRequestSerializer


class AssessmentCreate(generics.CreateAPIView):
    queryset = AssessmentResult.objects.all()
    serializer_class = AssessmentResultSerializer


class CareerCreate(generics.CreateAPIView):
    queryset = JobApplication.objects.all()
    serializer_class = JobApplicationSerializer
