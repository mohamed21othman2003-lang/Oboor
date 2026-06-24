from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from content import cms_api, cms_crud

admin.site.site_header = "لوحة تحكّم مركز عبور"
admin.site.site_title = "إدارة عبور"
admin.site.index_title = "الطلبات والمحتوى"

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("submissions.urls")),
    path("api/content/", include("content.urls")),
    # CMS المخصّص
    path("api/cms/login/", cms_api.login),
    path("api/cms/me/", cms_api.me),
    path("api/cms/stats/", cms_api.stats),
    path("api/cms/collections/<str:type_key>/schema/", cms_crud.schema),
    path("api/cms/collections/<str:type_key>/<int:pk>/reset/", cms_crud.reset_default),
    path("api/cms/collections/<str:type_key>/<int:pk>/", cms_crud.item),
    path("api/cms/collections/<str:type_key>/", cms_crud.collection),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
