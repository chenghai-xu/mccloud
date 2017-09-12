from django.conf.urls import url

from . import views
from . import project

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^api/project/', views.ProjectView.as_view(), name='ProjectView'),
    url(r'^api/logical/', views.LogicalView.as_view(), name='LogicalView'),
    url(r'^api/physical/', views.PhysicalView.as_view(), name='PhysicalView'),
    url(r'^api/solid/', views.SolidView.as_view(), name='SolidView'),
    url(r'^project-tree/', project.ProjectView.as_view(), name='Project-Tree'),

]
