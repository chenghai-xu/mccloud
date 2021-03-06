# -*- coding:utf-8 -*-
from rest_framework import serializers
from .models import *

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ('id', 'user', 'name', 'geometry', 'physics','primary','archived','create_time','update_time')

class LogicalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Logical
        fields = ('id', 'project', 'name', 'solid', 'material', 'children')

class PhysicalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Physical
        fields = ('id', 'project', 'logical', 'position', 'rotation')
    
class SolidSerializer(serializers.ModelSerializer):
    class Meta:
        model = Solid
        fields = ('id', 'project', 'name', 'type', 'parameter')

class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = ('id', 'project', 'order', 'instance', 'nodes', 'times','status','create_time')

