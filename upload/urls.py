from django.views.static import serve
from django.urls import path
import upload.views
import Outlet.settings

from . import views


urlpatterns = [
    path('', views.index, name='index'),
    path('upload/', upload.views.uploadPassword),
    path(r'^static/(?P<path>.*)$', serve,{'document_root': Outlet.settings.STATIC_ROOT})
]
