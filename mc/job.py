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
import subprocess

from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser

import os
from datetime import *
import glob

from .serializers import *
from .models import *
from home.models import Cash, Order
from home.serializers import *
from store.models import *

from . import json_gdml
from . import execute_job
from . import config

def handler404(request):
    response = HttpResponse('Error: 404')
    response.status_code = 404
    return response

def EncodeProjectConfig(pk):
    os.makedirs('%s/%s'%(config.projects_root,pk), exist_ok=True)
    fname = '%s/%s/config.json' % (config.projects_root,pk)
    return fname

def ReadProjectConfigMac(pk):
    os.makedirs('%s/%s'%(config.projects_root,pk), exist_ok=True)
    fname = '%s/%s/config.json.mac' % (config.projects_root,pk)
    data = '{}'
    try:
        f=open(fname,'r')
        data=f.read()
        f.close()
    except IOError as e:
        data="#Nothing"
    return data

import shutil

def MakeJobConfig(project,job):
    job_dir='%s/%s'%(config.jobs_root,job)
    project_dir='%s/%s'%(config.projects_root,project)
    os.makedirs(job_dir, exist_ok=True)
    gdml='%s/config.json.gdml' % project_dir
    mac='%s/config.json.mac' % project_dir
    try:
        shutil.copy(gdml,job_dir)
        shutil.copy(mac,job_dir)
        return True
    except:
        print("Make Job Config error")
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

        #get config
        try:
            instance=Instance.objects.filter(name=prj_json.instance)[0]
            item=Item.objects.filter(pk=instance.item.id)[0]
        except:
            print('get instance and item info error, config store item and instance please!')
            return handler404(request)

        job=None
        order=None

        #check if exist job which is not executed and the order is not paied
        jobs=Job.objects.filter(user=user,project=project,status='UNDO').order_by('-create_time')
        if len(jobs) >0:
            job=jobs[0]
        if job is None:
            try:
                order=Order.objects.create(user=user)
                job=Job.objects.create(user=user,project=project,order=order)
            except:
                print('create job and order error')
                return handler404(request)
        else:
            orders=Order.objects.filter(pk=job.order.id,user=user,paied=False).order_by('-create_time')
            if len(orders) >0:
                order=orders[0]
            #no availiable order, new order and job
            if order is None:
                try:
                    order=Order.objects.create(user=user)
                    job=Job.objects.create(user=user,project=project,order=order)
                except:
                    print('create job and order error')
                    return handler404(request)

        order.ClearItem()
        order.AddItem(item.id,item.price, int(prj_json.nodes), float(prj_json.run_time))
        order.save()

        job.order=order
        job.instance=instance
        job.nodes=prj_json.nodes
        job.times=prj_json.run_time
        job.save()

        print('create job with instance %s, price %s, nodes %s, time %s' % 
                (instance.type,item.price,job.nodes,job.times))

        if MakeJobConfig(project.id,job.id)!=True:
            print('make job config error')
            return handler404(request)

        try:
            job_script=execute_job.JobScript(job.id,instance,job.nodes,job.times*60)
        except:
            print('create job script error')
            return handler404(request)


        job_serializer = JobSerializer(job)
        order_serializer = OrderSerializer(order)
        order_data=order_serializer.data
        names=[item.name]
        order_data['names']=names
        data={'success':True,'job':job_serializer.data,'order':order_data}
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
        prj_json=json_gdml.ProjectJSON(fname,1000)
        #ret,out,err=execute_job.verify_project.delay(pk)
        ret,out=execute_job.verify_project(pk)
        return JsonResponse({'ret':ret,'out':out}, content_type='application/json',safe=False)

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

        try:
            order=Order.objects.get(pk=job.order.id,user=user)
        except:
            print('get order error')
            return JsonResponse(data, content_type='application/json',safe=False)

        if order.paied==False:
            data={'success':False,'tips':'Your order is unpaied!'}
            return JsonResponse(data, content_type='application/json',safe=False)

        execute_job.run.delay(job.id)
        data={'success':True,'tips':'Job is in executing'}
        return JsonResponse(data, content_type='application/json',safe=False)

class JobOutput(View):
    """
    function: get output of a job
    parameter:
    id=1
    return:
    json object, example: 
    {"job":{},"mesh":["1.mesh","2.mesh"],"dist":["1.dist","2.dist"],"log":["d.log.l.0","d.log.1.1"]}
    """
    def get(self, request, *args, **kwargs):
        pk=request.GET.get('id',-1)
        user=request.user
        try:
            job = Job.objects.get(pk=pk,user=user)
        except:
            return handler404(request)
        fname="%s/%s/" %(config.jobs_root,pk)
        meshs=glob.glob(fname+ "/*.mesh")
        dists=glob.glob(fname+ "/*.dist")
        logs=glob.glob(fname+ "/*.log.1.*")

        for i in range(len(meshs)):
            if os.path.isfile(meshs[i]):
                meshs[i]=os.path.basename(meshs[i])
            else:
                meshs.remove(meshs[i])

        for i in range(len(dists)):
            if os.path.isfile(dists[i]):
                dists[i]=os.path.basename(dists[i])
            else:
                dists.remove(dists[i])

        for i in range(len(logs)):
            if os.path.isfile(logs[i]):
                logs[i]=os.path.basename(logs[i])
            else:
                logs.remove(logs[i])

        serializer = JobSerializer(job)
        data={'mesh':meshs,'dist':dists,'log':logs,'job':serializer.data}
        return JsonResponse(data, content_type='application/json',safe=False)

class JobListView(View):
    """
    function: get jobs of a project
    parameter:
    id=1
    return:
    json object, example: 
    {"jobs":[]}
    """
    def get(self, request, *args, **kwargs):
        pk=request.GET.get('id',-1)
        user=request.user
        try:
            job = Job.objects.filter(user=user,project=pk).order_by('-create_time')
        except Job.DoesNotExist:
            return JsonResponse({}, content_type='application/json',safe=False)
        serializer = JobSerializer(job,many=True)
        return JsonResponse(serializer.data, content_type='application/json',safe=False)

def PackJob(job,dst):
    dst_file='%s/%s.zip' % (dst,job)
    subprocess.call(['mkdir', '-p', dst])
    subprocess.call(['rm', dst_file])
    proc=subprocess.Popen(['zip', '-r', dst_file, job],cwd=config.jobs_root)
    proc.wait()
    return dst_file


from django.utils.encoding import smart_str

class JobDownloadView(View):
    """
    function: download job
    parameter:
    id=1
    return:  
    job files.
    """
    """
    http://www.cnblogs.com/linxiyue/p/4187484.html
    https://stackoverflow.com/questions/1156246/having-django-serve-downloadable-files
    """
    def get(self, request, *args, **kwargs):
        pk=request.GET.get('id',-1)
        user=request.user
        try:
            job = Job.objects.filter(pk=pk,user=user)
        except Job.DoesNotExist:
            return JsonResponse({}, content_type='application/json',safe=False)
        
        dst='%s/job' % config.protected_root
        fpath=PackJob(pk,dst)
        fname=os.path.basename(fpath)

        response = HttpResponse(content_type='application/zip' )
        response["Content-Disposition"] = 'attachment; filename="%s"' % smart_str(fname)
        response['X-Sendfile'] = "%s/job/%s" % (config.protected_root,fname)
        return response
