from rest_framework import serializers
from .models import NewsArticle
from .image_utils import ResolvedImageMixin


class NewsArticleSerializer(ResolvedImageMixin):
    class Meta:
        model = NewsArticle
        fields = ["slug", "section", "featured", "title_ar", "title_en",
                  "desc_ar", "desc_en", "category_ar", "category_en",
                  "date_ar", "date_en", "image", "order"]
