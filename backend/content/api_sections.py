from rest_framework import generics, serializers
from .m_sections import SectionItem, ServiceCard
from .image_utils import ResolvedImageMixin


class SectionItemSerializer(ResolvedImageMixin):
    class Meta:
        model = SectionItem
        fields = ["page", "block", "key", "order", "icon", "value", "color",
                  "title_ar", "title_en", "text_ar", "text_en", "data_ar", "data_en", "image"]


class SectionByPage(generics.ListAPIView):
    """كل عناصر الأقسام المنشورة لصفحة معيّنة (تُجمَّع حسب block في الواجهة)."""
    serializer_class = SectionItemSerializer

    def get_queryset(self):
        return SectionItem.objects.filter(published=True, page=self.kwargs["page"])


class ServiceCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceCard
        fields = ["tab", "slug", "href", "order",
                  "badge_ar", "badge_en", "title_ar", "title_en",
                  "desc_ar", "desc_en", "suits_ar", "suits_en", "age_ar", "age_en",
                  "features_ar", "features_en", "regions_ar", "regions_en"]


class ServiceCardList(generics.ListAPIView):
    serializer_class = ServiceCardSerializer

    def get_queryset(self):
        return ServiceCard.objects.filter(published=True)
