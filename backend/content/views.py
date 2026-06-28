from rest_framework import generics
from .models import NewsArticle
from .serializers import NewsArticleSerializer
from .preview import PreviewListMixin


class NewsList(PreviewListMixin, generics.ListAPIView):
    serializer_class = NewsArticleSerializer

    def get_queryset(self):
        return NewsArticle.objects.filter(published=True)
