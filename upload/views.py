from django.shortcuts import render
from django.template import loader
from django.http import HttpResponse
import os


def index(request):
    return render(request, template_name='index.html')

