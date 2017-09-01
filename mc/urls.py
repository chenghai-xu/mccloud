from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^api/project/', views.ProjectView.as_view(), name='ProjectView'),

]
