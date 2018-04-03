#!/bin/bash
#install system wide package
sudo apt install python3
sudo apt install python3-pip
sudo apt install python3-virtualenv
sudo apt install python3-tk

sudo virtualenv -p /usr/bin/python3 /opt/mccloud_py3env
sudo chown -R ubuntu:ubuntu /opt/mccloud_py3env
source /opt/mccloud_py3env/bin/activate

#install project deps package 
pip install django
pip install djangorestframework
pip install psycopg2
pip install pypugjs
pip install celery
pip install numpy
pip install matplotlib
pip install redis
pip install django-appconf



#install mod_wsgi module by pip
pip install mod_wsgi
/opt/mccloud_py3env/bin/mod_wsgi-express module-config
