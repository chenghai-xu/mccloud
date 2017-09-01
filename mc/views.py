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

from .serializers import *
from .models import *

def index(request):
    return render(request, 'mc.pug')

def handler404(request):
    response = HttpResponse('Error: 404')
    response.status_code = 404
    return response

#dump model as json
#https://stackoverflow.com/questions/13031058/how-to-serialize-to-json-a-list-of-model-objects-in-django-python
#http post csrf in postman
#https://stackoverflow.com/questions/43196888/sending-csrf-tokens-via-postman
@method_decorator(csrf_exempt, name='dispatch')
class ProjectView(View):
    def get(self, request, *args, **kwargs):
        id_list=request.GET.getlist('id')
        user=User.objects.get(email='xuchenghai1984@163.com')
        #user=request.user
        try:
            pk=request.GET.get('id',-1)
            if len(id_list)>0:
                project = Project.objects.filter(id__in=id_list,user=user)
            else:
                project = Project.objects.filter(user=user)
        except Project.DoesNotExist:
            return handler404(request)
        serializer = ProjectSerializer(project,many=True)
        return JsonResponse(serializer.data, content_type='application/json',safe=False)

    def post(self, request, *args, **kwargs):
        user=User.objects.get(email='xuchenghai1984@163.com')
        #user=request.user
        #This is not useable because it will change the primay id
        #project,created=Project.objects.update_or_create(user=user,pk=pk,defaults=request.POST)
        #
        try:
            pk=request.POST.get('id',-1)
            project = Project.objects.get(pk=pk,user=user)
        except Project.DoesNotExist:
            project=Project.objects.create(user=user)

        #https://stackoverflow.com/questions/1576664/how-to-update-multiple-fields-of-a-django-model-instance
        for (key,value) in request.POST.items():
            if key != 'id':
                setattr(project, key, value)
        project.save()

        serializer = ProjectSerializer(project)
        return JsonResponse(serializer.data, content_type='application/json',safe=False)

    def delete(self, request, *args, **kwargs):
        user=User.objects.get(email='xuchenghai1984@163.com')
        #user=request.user
        try:
            pk=request.GET.get('id',-1)
            project = Project.objects.get(pk=pk,user=user)
        except Project.DoesNotExist:
            return HttpResponse('Delete: -1')
        project.delete()
        return HttpResponse('Delete: %s' % pk)

@method_decorator(csrf_exempt, name='dispatch')
class LogicalView(View):
    def get(self, request, *args, **kwargs):
        user=User.objects.get(email='xuchenghai1984@163.com')
        #user=request.user
        id_list=request.GET.getlist('id')
        project_id=request.GET.get('project',-1)

        #check the project first 
        try:
            project = Project.objects.get(pk=project_id,user=user)
        except Project.DoesNotExist:
            return handler404(request)

        #query the logical volume
        try:
            if len(id_list)>0:
                volume = Logical.objects.filter(id__in=id_list,project=project_id)
            else:
                volume = Logical.objects.filter(project=project_id)
        except Logical.DoesNotExist:
            return handler404(request)
        serializer = LogicalSerializer(volume,many=True)
        return JsonResponse(serializer.data, content_type='application/json',safe=False)

    def post(self, request, *args, **kwargs):
        user=User.objects.get(email='xuchenghai1984@163.com')
        #user=request.user
        pk=request.POST.get('id',-1)
        project_id=request.POST.get('project',-1)

        #check the project first 
        try:
            project = Project.objects.get(pk=project_id,user=user)
        except Project.DoesNotExist:
            return handler404(request)

        #query the logical volume
        try:
            pk=request.POST.get('id',-1)
            volume = Logical.objects.get(pk=pk,project=project_id)
        except Logical.DoesNotExist:
            volume=Logical.objects.create(project=project)

        #https://stackoverflow.com/questions/1576664/how-to-update-multiple-fields-of-a-django-model-instance
        for (key,value) in request.POST.items():
            if key != 'id' and key != 'project':
                setattr(volume, key, value)
        volume.save()

        serializer = LogicalSerializer(volume)
        return JsonResponse(serializer.data, content_type='application/json',safe=False)

    def delete(self, request, *args, **kwargs):
        user=User.objects.get(email='xuchenghai1984@163.com')
        #user=request.user
        pk=request.GET.get('id',-1)
        project_id=request.GET.get('project',-1)
        try:
            volume = Logical.objects.get(pk=pk,project=project_id)
        except Logical.DoesNotExist:
            return HttpResponse('Delete: -1')
        volume.delete()
        return HttpResponse('Delete: %s' % pk)

@method_decorator(csrf_exempt, name='dispatch')
class PhysicalView(View):
    def get(self, request, *args, **kwargs):
        user=User.objects.get(email='xuchenghai1984@163.com')
        #user=request.user
        id_list=request.GET.getlist('id')
        project_id=request.GET.get('project',-1)

        #check the project first 
        try:
            project = Project.objects.get(pk=project_id,user=user)
        except Project.DoesNotExist:
            return handler404(request)

        #query the logical volume
        try:
            if len(id_list)>0:
                volume = Physical.objects.filter(id__in=id_list,project=project_id)
            else:
                volume = Physical.objects.filter(project=project_id)
        except Physical.DoesNotExist:
            return handler404(request)
        serializer = PhysicalSerializer(volume,many=True)
        return JsonResponse(serializer.data, content_type='application/json',safe=False)

    def post(self, request, *args, **kwargs):
        user=User.objects.get(email='xuchenghai1984@163.com')
        #user=request.user
        pk=request.POST.get('id',-1)
        project_id=request.POST.get('project',-1)

        #check the project first 
        try:
            project = Project.objects.get(pk=project_id,user=user)
        except Project.DoesNotExist:
            return handler404(request)

        #query the logical volume
        try:
            pk=request.POST.get('id',-1)
            volume = Physical.objects.get(pk=pk,project=project_id)
        except Physical.DoesNotExist:
            volume=Physical.objects.create(project=project)

        #https://stackoverflow.com/questions/1576664/how-to-update-multiple-fields-of-a-django-model-instance
        for (key,value) in request.POST.items():
            if key != 'id' and key != 'project':
                setattr(volume, key, value)
        volume.save()

        serializer = PhysicalSerializer(volume)
        return JsonResponse(serializer.data, content_type='application/json',safe=False)

    def delete(self, request, *args, **kwargs):
        user=User.objects.get(email='xuchenghai1984@163.com')
        #user=request.user
        pk=request.GET.get('id',-1)
        project_id=request.GET.get('project',-1)
        try:
            volume = Physical.objects.get(pk=pk,project=project_id)
        except Physical.DoesNotExist:
            return HttpResponse('Delete: -1')
        volume.delete()
        return HttpResponse('Delete: %s' % pk)

@method_decorator(csrf_exempt, name='dispatch')
class SolidView(View):
    def get(self, request, *args, **kwargs):
        user=User.objects.get(email='xuchenghai1984@163.com')
        #user=request.user
        id_list=request.GET.getlist('id')
        project_id=request.GET.get('project',-1)

        #check the project first 
        try:
            project = Project.objects.get(pk=project_id,user=user)
        except Project.DoesNotExist:
            return handler404(request)

        #query the logical solid
        try:
            if len(id_list)>0:
                solid = Solid.objects.filter(id__in=id_list,project=project_id)
            else:
                solid = Solid.objects.filter(project=project_id)
        except Solid.DoesNotExist:
            return handler404(request)
        serializer = SolidSerializer(solid,many=True)
        return JsonResponse(serializer.data, content_type='application/json',safe=False)

    def post(self, request, *args, **kwargs):
        user=User.objects.get(email='xuchenghai1984@163.com')
        #user=request.user
        pk=request.POST.get('id',-1)
        project_id=request.POST.get('project',-1)

        #check the project first 
        try:
            project = Project.objects.get(pk=project_id,user=user)
        except Project.DoesNotExist:
            return handler404(request)

        #query the logical solid
        try:
            pk=request.POST.get('id',-1)
            solid = Solid.objects.get(pk=pk,project=project_id)
        except Solid.DoesNotExist:
            solid=Solid.objects.create(project=project)

        #https://stackoverflow.com/questions/1576664/how-to-update-multiple-fields-of-a-django-model-instance
        for (key,value) in request.POST.items():
            if key != 'id' and key != 'project':
                setattr(solid, key, value)
        solid.save()

        serializer = SolidSerializer(solid)
        return JsonResponse(serializer.data, content_type='application/json',safe=False)

    def delete(self, request, *args, **kwargs):
        user=User.objects.get(email='xuchenghai1984@163.com')
        #user=request.user
        pk=request.GET.get('id',-1)
        project_id=request.GET.get('project',-1)
        try:
            solid = Solid.objects.get(pk=pk,project=project_id)
        except Solid.DoesNotExist:
            return HttpResponse('Delete: -1')
        solid.delete()
        return HttpResponse('Delete: %s' % pk)

