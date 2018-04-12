from django.contrib import admin
from .models import *

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    fieldsets = (
        (None, {
        	'fields' : ('user', 'item', 'price', 'count', 'time', 'charge', 'paied')
        }),
    )
    list_display = ('id', 'user', 'item', 'price', 'count', 'time', 'charge', 'paied', 'create_time')

def execute_charge(modeladmin, request, queryset):
    for item in queryset:
        if item.executed:
            continue
        user=item.user;
        try:
            cash=Cash.objects.get(user=user)
        except:
            cash=Cash.objects.get(user=user)
        item.executed=True
        cash.value+=item.value
        cash.save()
        item.save()
execute_charge.short_description="Add charge value to cash"

def undo_execute_charge(modeladmin, request, queryset):
    for item in queryset:
        if item.executed==False:
            continue
        user=item.user;
        try:
            cash=Cash.objects.get(user=user)
        except:
            cash=Cash.objects.get(user=user)
        item.executed=False
        cash.value-=item.value
        cash.save()
        item.save()
undo_execute_charge.short_description="Decrease charge value from cash"
# Register your models here.
@admin.register(Cash)
class CashAdmin(admin.ModelAdmin):
    fieldsets = (
        (None, {
        	'fields' : ('user', 'value')
        }),
    )
    list_display = ('id', 'user', 'value')

@admin.register(Charge)
class ChargeAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'value','executed','create_time')
    actions = [execute_charge,undo_execute_charge]
    list_filter = ('executed', 'user')
