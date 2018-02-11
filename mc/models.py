from django.db import models
from django.contrib.auth import get_user_model
from django.contrib.postgres.fields import ArrayField
from django.contrib.postgres.fields import JSONField
import json

from . import config

User = get_user_model()

class Project(models.Model):
    id = models.AutoField(primary_key=True, editable=False)
    user = models.ForeignKey(User, editable=False,on_delete=models.PROTECT)
    name = models.CharField(max_length=32,default="Project")
    geometry = models.IntegerField(default=0)
    physics = JSONField(default={"default":True})
    primary = JSONField(default={"default":True})
    archived = models.BooleanField(default=True)
    create_time = models.DateTimeField(u'create time', auto_now_add=True, editable = True)
    update_time = models.DateTimeField(u'update time',auto_now=True, null=True)
    def __str__(self):
        return self.name

class Logical(models.Model):
    id = models.AutoField(primary_key=True, editable=False)
    project = models.ForeignKey(Project, editable=False,on_delete=models.PROTECT)
    name = models.CharField(max_length=32,default="volume")
    solid = models.IntegerField(default=0)
    material = models.IntegerField(default=0)
    children = ArrayField(models.IntegerField(),default=[])
    def __str__(self):
        return self.name

class Physical(models.Model):
    id = models.AutoField(primary_key=True, editable=False)
    project = models.ForeignKey(Project, editable=False,on_delete=models.PROTECT)
    logical = models.IntegerField(default=0)
    position = ArrayField(models.FloatField(),size=4,default=[0,0,0,1])
    rotation = ArrayField(models.FloatField(),size=3,default=[0,0,0])

class Solid(models.Model):
    id = models.AutoField(primary_key=True, editable=False)
    project = models.ForeignKey(Project, editable=False,on_delete=models.PROTECT)
    name = models.CharField(max_length=32,default="solid")
    type = models.CharField(choices=config.SOLID_TYPE_CHOICES,max_length=64,default=config.SOLID_TYPE_BOX)
    parameter = JSONField(default={"default":True})
    def __str__(self):
        return self.name

class Material(models.Model):
    id = models.AutoField(primary_key=True, editable=False)
    project = models.ForeignKey(Project, editable=False,on_delete=models.PROTECT)
    name = models.CharField(max_length=32,default="material")
    type = models.CharField(choices=config.MAT_TYPE_CHOICES,max_length=64,default=config.MAT_TYPE_ELE)
    d = models.FloatField(default=1.00)
    component = ArrayField(models.IntegerField(),default=[0])
    weight    = ArrayField(models.IntegerField(),default=[0])
    def __str__(self):
        return self.name

class Element(models.Model):
    id = models.AutoField(primary_key=True, editable=False)
    name = models.CharField(max_length=32,default="Hydrogen")
    formula = models.CharField(max_length=32,default="H")
    z = models.IntegerField(default=1)
    atom = models.FloatField(default=1.01)
    def __str__(self):
        return self.name

class ProjectArchived(models.Model):
    id = models.AutoField(primary_key=True, editable=False)
    project = models.ForeignKey(Project, editable=False,on_delete=models.PROTECT)
    create_time = models.DateTimeField(u'create time', auto_now_add=True)
    def __str__(self):
        return str(self.id)

class Job(models.Model):
    id = models.AutoField(primary_key=True, editable=False)
    user = models.ForeignKey(User, editable=False,on_delete=models.PROTECT)
    project = models.ForeignKey(Project, editable=False,on_delete=models.PROTECT)
    instance = models.CharField(choices=config.INSTANCE_TYPE_CHOICES,max_length=24,default='Core8')
    nodes = models.IntegerField(default=0)
    times = models.FloatField(default=0.0)
    status = models.CharField(choices=config.JOB_STATUS_CHOICES,max_length=24,default='UNPAY')
    create_time = models.DateTimeField(u'create time', auto_now_add=True)
    def __str__(self):
        return str(self.id)

class Order(models.Model):
    id = models.AutoField(primary_key=True, editable=False)
    user = models.ForeignKey(User, editable=False,on_delete=models.PROTECT)
    job = models.OneToOneField(Job, editable=False,on_delete=models.PROTECT)
    charge = models.FloatField(default=0.0)
    paied = models.BooleanField(default=False)
    create_time = models.DateTimeField(u'create time', auto_now_add=True)
    def __str__(self):
        return str(self.id)

class Cash(models.Model):
    id = models.AutoField(primary_key=True,editable=False)
    user = models.OneToOneField(User, editable=False,on_delete=models.PROTECT)
    value = models.FloatField(default=0.0)
    create_time = models.DateTimeField(u'create time',auto_now_add=True)
    update_time = models.DateTimeField(u'update time',auto_now=True, null=True)
    def __str__(self):
        return str(self.id)

class Charge(models.Model):
    id = models.AutoField(primary_key=True, editable=False)
    user = models.ForeignKey(User, editable=False,on_delete=models.PROTECT)
    value = models.FloatField(default=0.0)
    executed = models.BooleanField(default=False)
    create_time = models.DateTimeField(u'create time', auto_now_add=True)
    def __str__(self):
        return str(self.id)

class LastOpen(models.Model):
    user = models.OneToOneField(User, primary_key=True, editable=False,on_delete=models.PROTECT)
    pid = models.IntegerField(default=-1)
    def __str__(self):
        return self.user
