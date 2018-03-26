from django.db import models
from django.contrib.auth import get_user_model


User = get_user_model()
# Create your models here.
class Item(models.Model):
    id = models.AutoField(primary_key=True, editable=False)
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    category = models.IntegerField(default=1)
    name = models.CharField(max_length=32)
    description = models.CharField(max_length=256)
    price = models.FloatField(default=1)
    unit = models.FloatField(default=1)
    create_time = models.DateTimeField(u'create time', auto_now_add=True)
    def __str__(self):
        return str(self.id)
