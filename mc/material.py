from django.shortcuts import render
from django.http import JsonResponse
from django.core import serializers
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from django.utils.decorators import method_decorator
from django.contrib.auth import get_user_model
User = get_user_model()


import json

from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser

import os
from datetime import *

from .serializers import *
from .models import *

from . import json_gdml
from . import config

def handler404(request):
    response = HttpResponse('Error: 404')
    response.status_code = 404
    return response

def ReadDefaultMaterial():
    prefix = os.path.dirname(os.path.abspath(__file__))
    fname = '%s/Elements.json' % prefix
    elements = '[]'
    try:
        f=open(fname,'r')
        elements=f.read()
        f.close()
    except IOError as e:
        elements='[]'
    fname = '%s/Materials.json' % prefix
    materials = '[]'
    try:
        f=open(fname,'r')
        materials=f.read()
        f.close()
    except IOError as e:
        materials='[]'
    #data={}
    #data["Elements"]=elements
    #data["Materials"]=materials
    data="{\"Elements\": %s,\"Materials\": %s}" % (elements,materials)
    return data

#dump model as json
#https://stackoverflow.com/questions/13031058/how-to-serialize-to-json-a-list-of-model-objects-in-django-python
#http post csrf in postman
#https://stackoverflow.com/questions/43196888/sending-csrf-tokens-via-postman
class MaterialView(View):
    def get(self, request, *args, **kwargs):
        user=request.user
        return JsonResponse(ReadDefaultMaterial(), content_type='application/json',safe=False)

