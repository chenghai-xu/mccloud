from django.db import models
#from django.contrib.auth.models import User  
from django.contrib.auth import get_user_model
from django.contrib.postgres.fields import ArrayField
from django.contrib.postgres.fields import JSONField
import json

User = get_user_model()

# Create your models here.
class Project(models.Model):
    user = models.ForeignKey(User)
    name = models.CharField(max_length=32,default="Project")
    root = models.IntegerField(default=0)
    physics = JSONField(default={"default":True})
    primary = JSONField(default={"default":True})
    create_time = models.DateTimeField(u'create time', auto_now_add=True, editable = True)
    update_time = models.DateTimeField(u'update time',auto_now=True, null=True)
    def __str__(self):
        return self.name

NODE_TYPE_BOX = 'box'
NODE_TYPE_CYLINDER = 'cylinder'
NODE_TYPE_CHOICES = (
    (NODE_TYPE_BOX, 'box'),
    (NODE_TYPE_CYLINDER, 'cylinder'),
)

#list as field.
#https://stackoverflow.com/questions/22340258/django-list-field-in-model
class Node(models.Model):
    project = models.ForeignKey(Project)
    name = models.CharField(max_length=32,default="node")
    ntype = models.CharField(choices=NODE_TYPE_CHOICES,max_length=64,default=NODE_TYPE_BOX)
    parameter = JSONField(default={"default":True})
    material = models.IntegerField(default=0)
    region = JSONField(default={"default":True})
    position = ArrayField(models.FloatField(),size=4,default=[0,0,0,1])
    rotation = ArrayField(models.FloatField(),size=3,default=[0,0,0])
    parent = models.IntegerField(default=1)
    children = ArrayField(models.IntegerField(),default=[0])
    create_time = models.DateTimeField(u'create time', auto_now_add=True, editable = True)
    update_time = models.DateTimeField(u'update time',auto_now=True, null=True)
    def __str__(self):
        return self.name

MAT_TYPE_ELE = 'ELE'
MAT_TYPE_MIX = 'MIX'
MAT_TYPE_CHOICES = (
    (MAT_TYPE_ELE, 'Element'),
    (MAT_TYPE_MIX, 'Mixture'),
)
class Material(models.Model):
    project = models.ForeignKey(Project)
    name = models.CharField(max_length=32,default="material")
    ntype = models.CharField(choices=MAT_TYPE_CHOICES,max_length=64,default=MAT_TYPE_ELE)
    d = models.FloatField(default=1.00)
    component = ArrayField(models.IntegerField(),default=[0])
    weight    = ArrayField(models.IntegerField(),default=[0])
    update_time = models.DateTimeField(u'update time',auto_now=True, null=True)
    def __str__(self):
        return self.name

class Element(models.Model):
    name = models.CharField(max_length=32,default="Hydrogen")
    formula = models.CharField(max_length=32,default="H")
    z = models.IntegerField(default=1)
    atom = models.FloatField(default=1.01)
    def __str__(self):
        return self.name

