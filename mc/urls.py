from django.conf.urls import url

from django.http import JsonResponse, HttpResponseRedirect, Http404

def require_login(view):
    def new_view(request,*args,**kwargs):
        if not request.user.is_authenticated:
            return HttpResponseRedirect('/accounts/login/')
        return view(request,*args,**kwargs)
    return new_view

from . import views
from . import project
from . import job
from . import material
from . import order
from . import visual 

urlpatterns = [
    url(r'^$', require_login(views.index), name='index'),
    url(r'^api/project/', require_login(views.ProjectView.as_view()), name='ProjectView'),
    url(r'^api/logical/', require_login(views.LogicalView.as_view()), name='LogicalView'),
    url(r'^api/physical/', require_login(views.PhysicalView.as_view()), name='PhysicalView'),
    url(r'^api/solid/', require_login(views.SolidView.as_view()), name='SolidView'),
    url(r'^project-tree/', require_login(project.ProjectView.as_view()), name='Project-Tree'),
    url(r'^job/create/', require_login(job.JobView.as_view()), name='JobView'),
    url(r'^job/verify/', require_login(job.JobVerifyView.as_view()), name='JobVerifyView'),
    url(r'^job/execute/', require_login(job.JobExecuteView.as_view()), name='JobExecuteView'),
    url(r'^material/', require_login(material.MaterialView.as_view()), name='MaterialView'),
    url(r'^order/pay/', require_login(order.OrderPayView.as_view()), name='OrderPayView'),
    url(r'^api/mesh/', visual.Mesh.as_view(), name='MeshView'),
    url(r'^api/dist/', visual.Dist.as_view(), name='DistView'),
    url(r'^api/output/', job.JobOutput.as_view(), name='JobOutputView'),

]
