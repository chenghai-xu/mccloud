from django.shortcuts import render
from django.views import View
from django.http import JsonResponse

from .models import *
from .serializers import *

def home(request):
    user=request.user
    try:
        cash=Cash.objects.get(user=user)
    except:
        cash=Cash.objects.create(user=user)
    return render(request, 'home.pug',{'cash':cash.value})

class ChargeView(View):
    def get(self, request, *args, **kwargs):
        return render(request, 'charge.pug')

    def post(self, request, *args, **kwargs):
        user=request.user
        pk=int(request.POST.get('id',-1))
        value=float(request.POST.get('value',-1))
        method=int(request.POST.get('method',0))
        if value<=0:
            return JsonResponse({'sucess':False,'msg':'Charge value can not be <=0!'}, content_type='application/json',safe=False)

        try:
            charge=Charge.objects.get(pk=pk)
        except:
            charge=Charge.objects.create(user=user)

        if charge.executed:
            return JsonResponse({'sucess':False,'msg':'Can not change executed charge!'}, content_type='application/json',safe=False)

        charge.value=value
        charge.method=method
        charge.save()

        charge_serializer = ChargeSerializer(charge)
        if method==0:
            url='/static/alipay.jpg'
        elif method==1:
            url='/static/weixin.jpg'
        else:
            url='/static/alipay.jpg'
        return JsonResponse({'sucess':True,'charge':charge_serializer.data,'url':url}, content_type='application/json',safe=False)
class ChargeListView(View):
    def get(self, request, *args, **kwargs):
        user=request.user
        try:
            charge = Charge.objects.filter(user=user)
        except Charge.DoesNotExist:
            return JsonResponse({}, content_type='application/json',safe=False)
        serializer = ChargeSerializer(charge,many=True)
        print(serializer.data)
        return JsonResponse(serializer.data, content_type='application/json',safe=False)
