from django.shortcuts import render
def document(request):
    return render(request, 'document.pug')


