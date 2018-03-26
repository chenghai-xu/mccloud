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

class Order(models.Model):
    id = models.AutoField(primary_key=True, editable=False)
    user = models.ForeignKey(User,on_delete=models.PROTECT)
    item = ArrayField(models.IntegerField(),default=[])
    count = ArrayField(models.FloatField(),default=[])
    price = ArrayField(models.FloatField(),default=[])
    time = ArrayField(models.FloatField(),default=[])
    charge = models.FloatField(default=0.0)
    paied = models.BooleanField(default=False)
    create_time = models.DateTimeField(u'create time', auto_now_add=True)
    def __str__(self):
        return str(self.id)
    def AddItem(self,item,price,count,time=1):
        self.item.append(item)
        self.price.append(price)
        self.count.append(count)
        self.time.append(time)
        self.charge+=price*count*time
    def ClearItem(self):
        self.item=[]
        self.price=[]
        self.count=[]
        self.time=[]
        self.charge=0

