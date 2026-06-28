# -*- coding: utf-8 -*-
from rest_framework import generics, serializers
from .m_branches import Branch


class BranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Branch
        fields = ["slug", "name_ar", "name_en", "area_ar", "area_en",
                  "city_ar", "city_en", "region_ar", "region_en",
                  "address_ar", "address_en", "hours_ar", "hours_en",
                  "phone", "rating", "reviews_count",
                  "services_ar", "services_en", "gallery", "lat", "lng", "is_new", "order"]


from .preview import PreviewListMixin


class BranchList(PreviewListMixin, generics.ListAPIView):
    serializer_class = BranchSerializer

    def get_queryset(self):
        return Branch.objects.filter(published=True)
