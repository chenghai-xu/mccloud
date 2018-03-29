from __future__ import absolute_import
import os
from celery import Celery
from django.conf import settings
# set the default Django settings module for the 'celery' program.
#A good example
#http://www.cnblogs.com/StitchSun/p/8552488.html
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mccloud.settings')
app = Celery('mccloud')
# Using a string here means the worker will not have to
# pickle the object when using Windows.
app.config_from_object('django.conf:settings')
app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)
