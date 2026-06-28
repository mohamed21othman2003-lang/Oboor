from rest_framework import generics, serializers
from .m_home import HeroSlide, StatItem, FeatureItem, GalleryImage
from .image_utils import ResolvedImageMixin
from .preview import PreviewListMixin


class HeroSlideSerializer(ResolvedImageMixin):
    class Meta:
        model = HeroSlide
        fields = ["key", "badge_ar", "badge_en", "heading_ar", "heading_en",
                  "desc_ar", "desc_en", "cta_ar", "cta_en", "image", "order"]


class StatItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = StatItem
        fields = ["key", "label_ar", "label_en", "note_ar", "note_en",
                  "value", "icon", "order"]


class FeatureItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeatureItem
        fields = ["key", "title_ar", "title_en", "note_ar", "note_en",
                  "icon", "order"]


class GalleryImageSerializer(ResolvedImageMixin):
    class Meta:
        model = GalleryImage
        fields = ["key", "caption_ar", "caption_en", "image", "order"]


class HeroSlideList(PreviewListMixin, generics.ListAPIView):
    serializer_class = HeroSlideSerializer

    def get_queryset(self):
        return HeroSlide.objects.filter(published=True)


class StatItemList(PreviewListMixin, generics.ListAPIView):
    serializer_class = StatItemSerializer

    def get_queryset(self):
        return StatItem.objects.filter(published=True)


class FeatureItemList(PreviewListMixin, generics.ListAPIView):
    serializer_class = FeatureItemSerializer

    def get_queryset(self):
        return FeatureItem.objects.filter(published=True)


class GalleryImageList(PreviewListMixin, generics.ListAPIView):
    serializer_class = GalleryImageSerializer

    def get_queryset(self):
        return GalleryImage.objects.filter(published=True)
