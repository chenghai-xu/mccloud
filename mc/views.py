from django.shortcuts import render
from django.http import JsonResponse
from django.core import serializers

from .models import *
import json

def index(request):
    return render(request, 'mc.pug')

#dump model as json
#https://stackoverflow.com/questions/13031058/how-to-serialize-to-json-a-list-of-model-objects-in-django-python
#http post csrf in postman
#https://stackoverflow.com/questions/43196888/sending-csrf-tokens-via-postman
def project(request):
    #proj=Project.objects.create(user=request.user,name="project")
    #a=serializers.serialize('json', Project.objects.filter(id=proj.id))
    a=serializers.serialize('json', Project.objects.filter(id=1))
    a=request.GET.get('id','')
    return JsonResponse(a, content_type='application/json',safe=False)
