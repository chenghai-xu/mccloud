from django.contrib import admin
# Register your models here.
from .models import *
 
 
admin.site.register(Project)
admin.site.register(Material)
admin.site.register(Element)
admin.site.register(Logical)
admin.site.register(Physical)
admin.site.register(Solid)
