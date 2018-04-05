from django.contrib import admin
# Register your models here.
from .models import *
from . import execute_job
 
 
admin.site.register(Material)
admin.site.register(Element)
admin.site.register(Logical)
admin.site.register(Physical)
admin.site.register(Solid)

def execute(modeladmin, request, queryset):
    for job in queryset:
        print('execute job %s by admin.'%job.id)
        try:
            job_script=execute_job.JobScript(job.id,job.instance,job.nodes,job.times*60)
        except:
            print('create job script error')
        #execute_job.run(job.id,True)
        execute_job.run.delay(job.id)
        print('finish execute job %s by admin.'%job.id)
    return True

execute.short_description="Execute job."

@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'order', 'project', 'instance', 'nodes', 'times', 'status', 'create_time')
    actions = [execute]
    list_filter = ('status', 'user')

@admin.register(Instance)
class InstanceAdmin(admin.ModelAdmin):
    list_display = ('id', 'item', 'name', 'type', 'core', 'create_time')
    def __str__(self):
        return str(self.id)

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'name', 'update_time','create_time')
    def __str__(self):
        return str(self.id)
