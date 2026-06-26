from rest_framework import serializers
from .models import NewsArticle
from .image_utils import ResolvedImageMixin


class NewsArticleSerializer(ResolvedImageMixin):
    class Meta:
        model = NewsArticle
        fields = ["slug", "section", "featured", "title_ar", "title_en",
                  "desc_ar", "desc_en", "category_ar", "category_en",
                  "date_ar", "date_en",
                  "body_ar", "body_en", "learn_ar", "learn_en",
                  "time_ar", "time_en", "location_ar", "location_en",
                  "audience_ar", "audience_en", "seats_ar", "seats_en",
                  "reg_status_ar", "reg_status_en",
                  "image", "order"]
