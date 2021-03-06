from __future__ import absolute_import

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
import subprocess

from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser

import os
import glob
from datetime import *

from .serializers import *
from .models import *
from . import config

from celery import shared_task
@shared_task  # Use this decorator to make this a asyncronous function
def DeleteBackups(pk):
    patten= '%s/%s/config.json.[0-9][0-9][0-9][0-9]-*' % (config.projects_root,pk)
    baks=glob.glob(patten)
    baks.sort()
    for fname in baks[0:-6]:
        os.remove(fname)
    return True

def handler404(request):
    response = HttpResponse('Error: 404')
    response.status_code = 404
    return response

def ReadProjectConfig(pk):
    os.makedirs('%s/%s'%(config.projects_root,pk), exist_ok=True)
    fname = '%s/%s/config.json' % (config.projects_root,pk)
    data = '{}'
    #print('abspath',os.path.abspath(fname))
    try:
        f=open(fname,'r')
        data=f.read()
        f.close()
    except IOError as e:
        fname = '%s/config.json' % config.projects_root
        f=open(fname,'r')
        data=f.read()
        f.close()
    return data

def WriteProjectConfig(pk,data):
    os.makedirs('%s/%s'%(config.projects_root,pk), exist_ok=True)
    fname= '%s/%s/config.json' % (config.projects_root,pk)
    if os.path.exists(fname):
        postfix='.'+str(datetime.now()).replace(' ','T')
        postfix=postfix.replace(':','-')
        os.rename(fname,fname+postfix)
    f=open(fname,'w')
    f.write(data)
    f.close()
    DeleteBackups.delay(pk)
    return True

#dump model as json
#https://stackoverflow.com/questions/13031058/how-to-serialize-to-json-a-list-of-model-objects-in-django-python
#http post csrf in postman
#https://stackoverflow.com/questions/43196888/sending-csrf-tokens-via-postman
class ProjectView(View):
    def get(self, request, *args, **kwargs):
        pk=request.GET.get('id',-1)
        pk=int(pk)
        user=request.user
        try:
            last=LastOpen.objects.get(user=user)
        except LastOpen.DoesNotExist:
            last=LastOpen.objects.create(user=user)
        
        if pk==-1:
            pk=last.pid
        else:
            last.pid=pk
            last.save()

        try:
            project = Project.objects.get(pk=pk,user=user)
            print("get project success: ", project.id)
        except Project.DoesNotExist:
            print("get project fail:",pk)
            return handler404(request)
        return JsonResponse({'id':pk,'data':ReadProjectConfig(pk)}, content_type='application/json',safe=False)

    def post(self, request, *args, **kwargs):
        user=request.user
        pk=request.GET.get('id',-1)
        try:
            project = Project.objects.get(pk=pk,user=user)
        except Project.DoesNotExist:
            return handler404(request)

        #https://stackoverflow.com/questions/1576664/how-to-update-multiple-fields-of-a-django-model-instance
        data=request.body.decode("utf-8")
        js_data=json.loads(data)
        project.name=js_data['text']
        project.save()
        return JsonResponse(WriteProjectConfig(pk,data), content_type='application/json',safe=False)

def PackProject(project,dst):
    dst_file='%s/%s.zip' % (dst,project)
    subprocess.call(['mkdir', '-p', dst])
    subprocess.call(['rm', dst_file])
    proc=subprocess.Popen(['zip', '-i', 
        '*.mac', '*.gdml',
        '-r', dst_file, project],cwd=config.projects_root)
    proc.wait()
    #prefix = os.path.dirname(os.path.abspath(__file__))
    #subprocess.call(['%s/pack_project.sh'% prefix, project, config.projects_root,dst_file])
    return dst_file

from django.utils.encoding import smart_str
class ProjectDownload(View):
    def get(self, request, *args, **kwargs):
        pk=request.GET.get('id',-1)
        pk=int(pk)
        user=request.user
        try:
            project = Project.objects.get(pk=pk,user=user)
            print("get project success: ", project.id)
        except Project.DoesNotExist:
            print("get project fail:",pk)
            return handler404(request)

        dst='%s/project' % config.protected_root
        fpath=PackProject(str(pk),dst)
        fname=os.path.basename(fpath)

        response = HttpResponse(content_type='application/zip' )
        response["Content-Disposition"] = 'attachment; filename="%s"' % smart_str(fname)
        response['X-Sendfile'] = "%s/project/%s" % (config.protected_root,fname)
        return response

