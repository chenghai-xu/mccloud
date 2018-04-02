#!/bin/bash
#install system wide package
sudo apt install python3
sudo apt install python3-pip
sudo apt install python3-virtualenv
sudo apt install python3-tk

sudo virtualenv -p /usr/bin/python3 /opt/mccloud_py3env
source /opt/mccloud_py3env/bin/activate

#install project deps package 
sudo pip install django
sudo pip install djangorestframework
sudo pip install psycopg2
sudo pip install pypugjs
sudo pip install celery
sudo pip install numpy
sudo pip install matplotlib
sudo pip install redis


#install mod_wsgi module by pip
sudo pip install mod_wsgi
/opt/mccloud_py3env/bin/mod_wsgi-express module-config
