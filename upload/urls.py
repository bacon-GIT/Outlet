from django.urls import path
import upload.views

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('upload/', upload.views.uploadPassword)
]