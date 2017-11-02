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

def handler404(request):
    response = HttpResponse('Error: 404')
    response.status_code = 404
    return response

projects_root='./data/mc/projects'
def EncodeProjectConfig(pk):
    os.makedirs('%s/%s'%(projects_root,pk), exist_ok=True)
    fname = '%s/%s/config.json' % (projects_root,pk)
    return fname
def ReadProjectConfigMac(pk):
    os.makedirs('%s/%s'%(projects_root,pk), exist_ok=True)
    fname = '%s/%s/config.json.mac' % (projects_root,pk)
    data = '{}'
    try:
        f=open(fname,'r')
        data=f.read()
        f.close()
    except IOError as e:
        data="#Nothing"
    return data

#dump model as json
#https://stackoverflow.com/questions/13031058/how-to-serialize-to-json-a-list-of-model-objects-in-django-python
#http post csrf in postman
#https://stackoverflow.com/questions/43196888/sending-csrf-tokens-via-postman
@method_decorator(csrf_exempt, name='dispatch')
class JobView(View):
    def get(self, request, *args, **kwargs):
        #pk=request.GET.get('id',-1)
        #user=User.objects.get(email='xuchenghai1984@163.com')
        ##user=request.user
        #try:
        #    job = Job.objects.filter(pk=pk,user=user)
        #except Job.DoesNotExist:
        #    return handler404(request)
        #return JsonResponse(ReadJobConfig(pk), content_type='application/json',safe=False)
        return JsonResponse(True)

    def post(self, request, *args, **kwargs):
        user=User.objects.get(email='xuchenghai1984@163.com')
        #user=request.user
        #This is not useable because it will change the primay id
        #job,created=Job.objects.update_or_create(user=user,pk=pk,defaults=request.POST)
        #
        #return JsonResponse(WriteJobConfig(pk,request.body.decode("utf-8")), content_type='application/json',safe=False)
        pk=request.GET.get('id',-1)
        if pk==-1:
            return handler404(request)
        fname=EncodeProjectConfig(pk)
        prj_json=json_gdml.ProjectJSON(fname)
        data={}
        data["mac"]=ReadProjectConfigMac(pk)
        return JsonResponse(data, content_type='application/json',safe=False)
