from django.contrib import admin

from .models import *

@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    fieldsets = (
        (None, {
        	'fields' : ('user', 'category', 'name', 'description', 'price', 'unit')
        }),
    )
    list_display = ('id', 'user', 'category', 'name', 'description', 'price', 'unit')
