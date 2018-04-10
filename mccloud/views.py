from django.shortcuts import render
from django.conf import settings

def index(request):
    ctx={'client_mail':settings.CS_EMAIL}
    return render(request, 'index.pug', ctx)
# Create your views here.
