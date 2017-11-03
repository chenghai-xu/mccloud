from django.shortcuts import render

def home(request):
    return render(request, 'home.pug')
# Create your views here.
