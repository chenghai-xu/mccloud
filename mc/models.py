from django.db import models

# Create your models here.
class MCProject(models.Model):
    name = models.CharField(max_length=32)
    owner = models.ForeignKey(users)
    model = models.CharField(max_length=32)
    material = models.CharField(max_length=32)
    physics = models.CharField(max_length=32)
    primary = models.CharField(max_length=32)

