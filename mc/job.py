from django.shortcuts import render
from django.http import JsonResponse,Http404
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
from . import execute_job

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

import shutil

jobs_root='./data/mc/jobs'

def MakeJobConfig(project,job):
    job_dir='%s/%s'%(jobs_root,job)
    project_dir='%s/%s'%(projects_root,project)
    os.makedirs(job_dir, exist_ok=True)
    gdml='%s/config.json.gdml' % project_dir
    mac='%s/config.json.mac' % project_dir
    try:
        shutil.copy(gdml,job_dir)
        shutil.copy(mac,job_dir)
        return True
    except:
        return False

    

#dump model as json
#https://stackoverflow.com/questions/13031058/how-to-serialize-to-json-a-list-of-model-objects-in-django-python
#http post csrf in postman
#https://stackoverflow.com/questions/43196888/sending-csrf-tokens-via-postman
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
            print('generate config file error')
            return response
        charge= Instance_Price[prj_json.instance] * int(prj_json.nodes) * prj_json.run_time
        print('The charge of the new job: ', charge)
        try:
            cash=Cash.objects.get(user=user)
        except:
            cash=Cash.objects.create(user=user,value=10)

        #if cash.value < charge:
        #    data={"success":False,"cash":0,"tips": "cash is not enough!"}
        #    return JsonResponse(json.dumps(data), content_type='application/json',safe=False)

        job=None
        order=None

        #check if exist job which is not executed and the order is not paied
        jobs=Job.objects.filter(user=user,project=project,status='UNPAY').order_by('-create_time')
        print(jobs)
        if len(jobs)>0:
            job=jobs[0]
            try:
                order=Order.objects.get(user=user,job=job)
                print('Use exist job and order: ',job,order)
            except:
                print('get order error: ',job)
                order=None
        else:
            print('Create new job and order')

        if job is None:
            try:
                job=Job.objects.create(user=user,project=project)
            except:
                print('create job error')
                return handler404(request)

        job.instance=prj_json.instance
        job.nodes=prj_json.nodes
        job.times=prj_json.run_time
        job.save()

        if MakeJobConfig(project.id,job.id)!=True:
            print('make job config error')
            return handler404(request)

        try:
            job_script=execute_job.JobScript(job.id,job.instance,job.nodes,job.times*60)
        except:
            print('create job script error')
            return handler404(request)

        if order is None:
            order=Order.objects.create(user=user,job=job)
        order.charge=charge
        order.save()

        cash_serializer = CashSerializer(cash)
        job_serializer = JobSerializer(job)
        order_serializer = OrderSerializer(order)
        data={'sucess':True,'cash':cash_serializer.data,'job':job_serializer.data,'order':order_serializer.data}
        return JsonResponse(data, content_type='application/json',safe=False)

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

class JobExecuteView(View):
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
        pk=request.GET.get('id',-1)
        try:
            job=Job.objects.get(pk=pk,user=user)
        except:
            print('get job error')
            return handler404(request)

        if job.status!='UNDO':
            data={'sucess':False,'tips':'Job is already executed'}
            return JsonResponse(data, content_type='application/json',safe=False)

        execute_job.run(job)
        data={'sucess':True,'tips':'Job is in executing'}
        return JsonResponse(data, content_type='application/json',safe=False)

