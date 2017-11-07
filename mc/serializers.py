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
        fields = ('id', 'project', 'instance', 'nodes', 'times','status','create_time')

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ('id', 'job', 'charge', 'paied','create_time')

class CashSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cash
        fields = ('id','user','value','update_time')

class ChargeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Charge
        fields = ('id', 'user', 'value', 'executed','create_time')
