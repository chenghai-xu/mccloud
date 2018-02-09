from django.http import JsonResponse,Http404
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from django.utils.decorators import method_decorator
from django.contrib.auth import get_user_model
User = get_user_model()

import numpy as np
import matplotlib
import matplotlib.pyplot as plt
import matplotlib.cm as cm
from matplotlib.figure import Figure
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas

import math

import json
import os
import io 
import base64 


from datetime import *
from . import config
from . import GPLib 
from .models import *

def handler404(request):
    response = HttpResponse('Error: 404')
    response.status_code = 404
    return response

class Mesh(View):
    """
    function: Get image of a mesh
    parameter:
    id=1&fname=ct_body.dose.mesh&axis=y&index=100
    return:
    base64 encoded image
    """
    def get(self, request, *args, **kwargs):
        pk=request.GET.get('id',-1)
        fname=request.GET.get('fname',0)
        axis=request.GET.get('axis','x')
        index=int(request.GET.get('index',0))
        if fname==0 or pk == -1:
            return handler404(request)

        user=request.user
        try:
            job = Job.objects.get(pk=pk,user=user)
        except:
            return handler404(request)
                                      
        fname="%s/%s/%s" %(config.jobs_root,pk,fname)
        print("Read Mesh file: ",fname)
        try:
            mesh=GPLib.GPMesh(fname)
        except:
            print("Open Mesh file error ")
            return handler404(request)
        fig = Figure()
        ca = FigureCanvas(fig)
        a = fig.add_subplot(111)

        if axis == 'x':
            index=min(index,mesh.Data.shape[2]-1)
            a.imshow(mesh.Data[:,:,index],cmap=cm.jet)
        elif axis == 'y':
            index=min(index,mesh.Data.shape[1]-1)
            a.imshow(mesh.Data[:,index,:],cmap=cm.jet)
        elif axis == 'z':
            index=min(index,mesh.Data.shape[0]-1)
            a.imshow(mesh.Data[index],cmap=cm.jet)
        else:
            index=min(index,mesh.Data.shape[0]-1)
            a.imshow(mesh.Data[index],cmap=cm.jet)

        buff=io.BytesIO()
        ca.print_figure(buff,format="png")
        #src='<img src="data:image/png;base64,%s"/>' % base64.b64encode(buff.getvalue()).decode('utf-8').replace('\n', '')
        img="data:image/png;base64,%s" % base64.b64encode(buff.getvalue()).decode('utf-8').replace('\n', '')
        return JsonResponse({'src':img}, content_type='application/json',safe=False)
        #return HttpResponse(src)


class Dist(View):
    """
    function: Get image of a dist 
    parameter:
    id=1&fname=ct_body.dose.mesh&ls=steps&color=blue
    return:
    base64 encoded image
    """
    def get(self, request, *args, **kwargs):
        pk=request.GET.get('id',-1)
        fname=request.GET.get('fname',0)
        ls=request.GET.get('ls','steps')
        color=request.GET.get('color','blue')
        if fname==0 or pk == -1:
            return handler404(request)

        user=request.user
        try:
            job = Job.objects.get(pk=pk,user=user)
        except:
            return handler404(request)
                                      
        fname="%s/%s/%s" %(config.jobs_root,pk,fname)
        print("Read Dist file: ",fname)
        try:
            dist=GPLib.GPDist(fname)
        except:
            print("Open Dist file error ")
            return handler404(request)
        fig = Figure()
        ca = FigureCanvas(fig)
        a = fig.add_subplot(111)

        a.plot(dist.Data,ls=ls,color=color)

        buff=io.BytesIO()
        ca.print_figure(buff,format="png")
        #src='<img src="data:image/png;base64,%s"/>' % base64.b64encode(buff.getvalue()).decode('utf-8').replace('\n', '')
        #return HttpResponse(src)
        img="data:image/png;base64,%s" % base64.b64encode(buff.getvalue()).decode('utf-8').replace('\n', '')
        return JsonResponse({'src':img}, content_type='application/json',safe=False)

