# -*- coding:utf-8 -*-
from rest_framework import serializers
from .models import *

class ChargeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Charge
        fields = ('id', 'user', 'value','method','executed','create_time')
class CashSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cash
        fields = ('id','user','value','update_time')
class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ('id', 'user', 'item', 'price', 'count', 'time', 'charge', 'paied','create_time')

