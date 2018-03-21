from django.shortcuts import render
from django.http import JsonResponse, Http404
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
from home.models import Cash

def handler404(request):
    response = HttpResponse('Error: 404')
    response.status_code = 404
    return response

#dump model as json
#https://stackoverflow.com/questions/13031058/how-to-serialize-to-json-a-list-of-model-objects-in-django-python
#http post csrf in postman
#https://stackoverflow.com/questions/43196888/sending-csrf-tokens-via-postman
class OrderPayView(View):
    def post(self, request, *args, **kwargs):
        user=request.user
        pk=request.GET.get('id',-1)
        try:
            order=Order.objects.get(pk=pk,user=user)
        except:
            return Http404(request)

        try:
            job=Job.objects.get(user=user,order=order)
        except:
            return Http404(request)


        if order.paied==True:
            data={"success":True,"tips": "order is paied!"}
            if job.status=='UNPAY':
                job.status=='UNDO'
                job.save()
            return JsonResponse(json.dumps(data), content_type='application/json',safe=False)

        try:
            cash=Cash.objects.get(user=user)
        except:
            return Http404(request)

        if cash.value < order.charge:
            data={"success":False,"cash":0,"tips": "cash is not enough!"}
            return JsonResponse(json.dumps(data), content_type='application/json',safe=False)

        cash.value-=order.charge
        order.paied=True
        job.status='UNDO'
        cash.save()
        order.save()
        job.save()

        cash_serializer = CashSerializer(cash)
        order_serializer = OrderSerializer(order)
        data={'sucess':True,'cash':cash_serializer.data,'order':order_serializer.data}
        return JsonResponse(data, content_type='application/json',safe=False)

