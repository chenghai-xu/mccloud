#!/bin/bash

#install apache
sudo apt install apache2
sudo apt install apache2-dev

#install mod_wsgi
sudo /opt/anaconda3/bin/pip install mod_wsgi
sudo /opt/anaconda3/bin/mod_wsgi-express module-config

#
#config apache2.conf

