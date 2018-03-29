#!/bin/bash
#install system wide package
sudo apt install python3
sudo apt install python3-pip
sudo apt install python3-virtualenv
sudo apt install python3-tk

virtualenv -p /usr/bin/python3 $HOME/.py3env_mccloud
source $HOME/.py3env_mccloud/bin/activate

#install project deps package 
pip install django
pip install djangorestframework
pip install psycopg2
pip install pypugjs
pip install celery
pip install numpy
pip install matplotlib


#install mod_wsgi module by pip
pip install mod_wsgi
$HOME/.py3env_mccloud/bin/mod_wsgi-express module-config
