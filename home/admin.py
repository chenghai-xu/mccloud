from django.contrib import admin
from .models import *

# Register your models here.
@admin.register(Cash)
class CashAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'value')

@admin.register(Charge)
class ChargeAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'value','executed','create_time')
