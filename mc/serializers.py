# -*- coding:utf-8 -*-
from rest_framework import serializers
from .models import *


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ('id', 'user', 'name', 'root', 'physics','primary','create_time','update_time')
