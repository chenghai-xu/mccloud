from django.conf.urls import url
from django.http import JsonResponse, HttpResponseRedirect, Http404

def require_login(view):
    def new_view(request,*args,**kwargs):
        if not request.user.is_authenticated:
            return HttpResponseRedirect('/accounts/login/')
        return view(request,*args,**kwargs)
    return new_view

from . import views
from . import order

urlpatterns = [
    url(r'^$', require_login(views.home), name='home'),
    url(r'^charge/', require_login(views.ChargeView.as_view()), name='charge'),
    url(r'^charge_list/', require_login(views.ChargeListView.as_view()), name='charge_list'),
    url(r'^order/pay/', require_login(order.OrderPayView.as_view()), name='OrderPayView'),
]

