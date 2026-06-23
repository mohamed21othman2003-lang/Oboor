from rest_framework import generics
from .models import NewsArticle
from .serializers import NewsArticleSerializer


class NewsList(generics.ListAPIView):
    serializer_class = NewsArticleSerializer

    def get_queryset(self):
        return NewsArticle.objects.filter(published=True)
