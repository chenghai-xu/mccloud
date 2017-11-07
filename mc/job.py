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
        pk=request.GET.get('id',-1)
        user=request.user
        try:
            job = Job.objects.get(pk=pk,user=user)
        except:
            return handler404(request)
                                      
        serializer = JobSerializer(job)
        return JsonResponse(serializer.data, content_type='application/json',safe=False)

    def post(self, request, *args, **kwargs):
        user=request.user
        pid=request.GET.get('project',-1)
        fname=EncodeProjectConfig(pid)
        data={}

        try:
            project = Project.objects.get(pk=pid,user=user)
        except:
            response = HttpResponse('Error: Invalid project')
            response.status_code = 404
            print('get project error')
            return response

        try:
            prj_json=json_gdml.ProjectJSON(fname)
        except:
            response = HttpResponse('Error: Invalid config file')
            response.status_code = 404
            print('generate config error')
            return response
        try:
            job=Job.objects.create(user=user,project=project)
        except:
            print('create job error')
            return handler404(request)

        job.instance=prj_json.instance
        job.nodes=prj_json.nodes
        job.times=prj_json.run_time
        job.save()

        serializer = JobSerializer(job)
        return JsonResponse(serializer.data, content_type='application/json',safe=False)

@method_decorator(csrf_exempt, name='dispatch')
class JobVerifyView(View):
    def get(self, request, *args, **kwargs):
        return JsonResponse(True)
    def post(self, request, *args, **kwargs):
        user=request.user
        pk=request.GET.get('id',-1)
        if pk==-1:
            return handler404(request)
        fname=EncodeProjectConfig(pk)
        prj_json=json_gdml.ProjectJSON(fname)
        data={}
        data["mac"]=ReadProjectConfigMac(pk)
        return JsonResponse(data, content_type='application/json',safe=False)
