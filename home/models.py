from django.db import models
from django.contrib.auth import get_user_model
from django.contrib.postgres.fields import ArrayField
from django.contrib.postgres.fields import JSONField

User = get_user_model()

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
    method = models.IntegerField(default=0)
    executed = models.BooleanField(default=False)
    create_time = models.DateTimeField(u'create time', auto_now_add=True)
    def __str__(self):
        return str(self.id)

