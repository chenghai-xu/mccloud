from django.conf.urls import url
from django.http import JsonResponse, HttpResponseRedirect, Http404

def require_login(view):
    def new_view(request,*args,**kwargs):
        if not request.user.is_authenticated():
            return HttpResponseRedirect('/accounts/login/')
        return view(request,*args,**kwargs)
    return new_view

from . import views

urlpatterns = [
    url(r'^$', require_login(views.home), name='home'),
]

