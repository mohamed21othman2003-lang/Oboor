# -*- coding: utf-8 -*-
from rest_framework import generics, serializers
from .m_branches import Branch


class BranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Branch
        fields = ["slug", "name_ar", "name_en", "area_ar", "area_en",
                  "city_ar", "city_en", "region_ar", "region_en",
                  "address_ar", "address_en", "hours_ar", "hours_en",
                  "phone", "phone_evening", "email", "manager", "manager_en", "map_url",
                  "rating", "reviews_count",
                  "services_ar", "services_en", "service_cards",
                  "profile_intro_ar", "profile_intro_en", "profile_stats", "journey", "accreditations",
                  "distinctions", "success_heading_ar", "success_heading_en", "success_sub_ar", "success_sub_en",
                  "gallery", "lat", "lng", "is_new", "order"]


from .preview import PreviewListMixin


class BranchList(PreviewListMixin, generics.ListAPIView):
    serializer_class = BranchSerializer

    def get_queryset(self):
        return Branch.objects.filter(published=True)
