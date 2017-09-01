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

from .serializers import ProjectSerializer
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
        ids=request.GET.getlist('id')
        user=User.objects.get(email='xuchenghai1984@163.com')
        try:
            pk=request.GET.get('id',-1)
            #project = Project.objects.get(pk=pk,user=user)
            if len(ids)>0:
                project = Project.objects.filter(id__in=ids,user=user)
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
        try:
            pk=request.GET.get('id',-1)
            project = Project.objects.get(pk=pk,user=user)
        except Project.DoesNotExist:
            return HttpResponse('Delete: -1')
        project.delete()
        return HttpResponse('Delete: %s' % pk)
