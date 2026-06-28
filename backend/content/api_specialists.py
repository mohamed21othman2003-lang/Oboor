# -*- coding: utf-8 -*-
from rest_framework import generics, serializers
from .m_specialists import Specialist
from .image_utils import ResolvedImageMixin


class SpecialistSerializer(ResolvedImageMixin):
    class Meta:
        model = Specialist
        fields = ["slug", "name_ar", "name_en", "specialty_ar", "specialty_en",
                  "desc_ar", "desc_en", "days_ar", "days_en", "branch_ar", "branch_en",
                  "experience_ar", "experience_en", "hours_ar", "hours_en",
                  "branches_ar", "branches_en", "about_ar", "about_en",
                  "qualifications_ar", "qualifications_en", "image", "order"]


from .preview import PreviewListMixin


class SpecialistList(PreviewListMixin, generics.ListAPIView):
    serializer_class = SpecialistSerializer

    def get_queryset(self):
        return Specialist.objects.filter(published=True)
