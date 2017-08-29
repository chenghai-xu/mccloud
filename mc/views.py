from django.shortcuts import render

def index(request):
    return render(request, 'mc.pug')
# Create your views here.
