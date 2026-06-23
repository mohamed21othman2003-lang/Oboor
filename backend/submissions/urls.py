from django.urls import path
from . import views

urlpatterns = [
    path("contact/", views.ContactCreate.as_view(), name="contact"),
    path("admission/", views.AdmissionCreate.as_view(), name="admission"),
    path("assessment/", views.AssessmentCreate.as_view(), name="assessment"),
    path("career/", views.CareerCreate.as_view(), name="career"),
]
