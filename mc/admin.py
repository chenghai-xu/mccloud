from django.contrib import admin
# Register your models here.
from .models import *
 
 
admin.site.register(Project)
admin.site.register(Material)
admin.site.register(Element)
admin.site.register(LogicalVolume)
admin.site.register(PhysicsVolume)
admin.site.register(Solid)
