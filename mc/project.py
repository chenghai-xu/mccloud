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

def handler404(request):
    response = HttpResponse('Error: 404')
    response.status_code = 404
    return response

projects_root='./data/mc/projects'
def ReadProjectConfig(pk):
    os.makedirs('%s/%s'%(projects_root,pk), exist_ok=True)
    fname = '%s/%s/config.json' % (projects_root,pk)
    data = '{}'
    try:
        f=open(fname,'r')
        data=f.read()
        f.close()
    except IOError as e:
        fname = '%s/config.json' % projects_root
        f=open(fname,'r')
        data=f.read()
        f.close()
    return data

def WriteProjectConfig(pk,data):
    os.makedirs('%s/%s'%(projects_root,pk), exist_ok=True)
    fname= '%s/%s/config.json' % (projects_root,pk)
    if os.path.exists(fname):
        postfix='.'+str(datetime.now()).replace(' ','T')
        postfix=postfix.replace(':','-')
        os.rename(fname,fname+postfix)
    f=open(fname,'w')
    f.write(data)
    f.close()
    return True

#dump model as json
#https://stackoverflow.com/questions/13031058/how-to-serialize-to-json-a-list-of-model-objects-in-django-python
#http post csrf in postman
#https://stackoverflow.com/questions/43196888/sending-csrf-tokens-via-postman
class ProjectView(View):
    def get(self, request, *args, **kwargs):
        pk=request.GET.get('id',-1)
        user=request.user
        try:
            project = Project.objects.filter(pk=pk,user=user)
        except Project.DoesNotExist:
            return handler404(request)
        return JsonResponse(ReadProjectConfig(pk), content_type='application/json',safe=False)

    def post(self, request, *args, **kwargs):
        user=request.user
        pk=request.GET.get('id',-1)
        try:
            project = Project.objects.get(pk=pk,user=user)
        except Project.DoesNotExist:
            return handler404(request)

        #https://stackoverflow.com/questions/1576664/how-to-update-multiple-fields-of-a-django-model-instance
        return JsonResponse(WriteProjectConfig(pk,request.body.decode("utf-8")), content_type='application/json',safe=False)
